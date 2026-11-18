import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { seed, validateContent } from "./content.mjs";
export function openStore(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(join(directory, "content.sqlite"));
  db.exec(
    "PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, draft TEXT NOT NULL, published TEXT NOT NULL, previous TEXT);",
  );
  db.prepare("INSERT OR IGNORE INTO content VALUES (1, 1, ?, ?, NULL)").run(
    JSON.stringify(seed),
    JSON.stringify(seed),
  );
  function read() {
    const row = db.prepare("SELECT * FROM content WHERE id=1").get();
    return {
      revision: row.revision,
      draft: JSON.parse(row.draft),
      published: JSON.parse(row.published),
      previous: row.previous ? JSON.parse(row.previous) : null,
    };
  }
  function update(action, revision, content) {
    if (!Number.isSafeInteger(revision))
      throw Object.assign(new Error("Нужна версия документа"), { status: 400 });
    const serialized = ["save", "restore"].includes(action)
      ? JSON.stringify(validateContent(content))
      : null;
    const statements = {
      save: "draft=?",
      restore: "draft=?",
      publish: "previous=published, published=draft",
      rollback: "draft=previous, previous=published, published=previous",
    };
    if (!statements[action])
      throw Object.assign(new Error("Неизвестное действие"), { status: 400 });
    const query = `UPDATE content SET ${statements[action]}, revision=revision+1 WHERE id=1 AND revision=?${action === "rollback" ? " AND previous IS NOT NULL" : ""}`;
    const updated = db
      .prepare(query)
      .run(...(serialized === null ? [revision] : [serialized, revision]));
    if (!updated.changes)
      throw Object.assign(
        new Error(
          "Версия изменилась в другой вкладке или нет предыдущей публикации. Скопируйте несохранённые тексты и обновите страницу.",
        ),
        { status: 409 },
      );
    return read();
  }
  return { read, update, close: () => db.close() };
}
