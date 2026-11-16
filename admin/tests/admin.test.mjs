import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { createAdmin } from "../server.mjs";
import { hashPassword } from "../password.mjs";
import { seed } from "../content.mjs";
const password = "test-only-long-password";
const passwordHash = hashPassword(password);
async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-admin-"));
  const origin = "http://localhost:3001";
  let server;
  let base;
  async function start() {
    server = createAdmin({ directory, passwordHash, origin });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  }
  await start();
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  let cookie = "",
    csrf = "";
  async function request(path, input, options = {}) {
    const response = await fetch(`${base}/admin/api/${path}`, {
      method: input === undefined ? "GET" : "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        Cookie: cookie,
        "X-CSRF-Token": csrf,
        ...options.headers,
      },
      body: input === undefined ? undefined : JSON.stringify(input),
    });
    const result = await response.json();
    return { status: response.status, result, response };
  }
  async function login() {
    const logged = await request("login", { password });
    assert.equal(logged.status, 200);
    cookie = logged.response.headers.get("set-cookie").split(";")[0];
    csrf = logged.result.csrf;
  }
  return {
    request,
    login,
    async restart() {
      await new Promise((resolve) => server.close(resolve));
      await start();
    },
    get base() {
      return base;
    },
  };
}
test("drafts, uploads and mutations require login; origin, CSRF and logout are enforced", async (t) => {
  const f = await fixture(t);
  for (const path of ["content", "preview", "backup"])
    assert.equal((await f.request(path)).status, 401);
  assert.equal((await f.request("save", {})).status, 401);
  assert.equal(
    (
      await f.request(
        "login",
        { password },
        { headers: { Origin: "https://other.example" } },
      )
    ).status,
    403,
  );
  await f.login();
  assert.equal(
    (await f.request("save", {}, { headers: { "X-CSRF-Token": "wrong" } }))
      .status,
    403,
  );
  const current = await f.request("content");
  assert.deepEqual(current.result.draft, seed);
  assert.equal((await f.request("logout", {})).status, 200);
  assert.equal((await f.request("preview")).status, 401);
});
test("draft save, concurrent editing, publication, rollback and restart preserve independent versions", async (t) => {
  const f = await fixture(t);
  await f.login();
  const draft = structuredClone(seed);
  draft.cases[0].title = "Изменённый кейс";
  let saved = await f.request("save", { revision: 1, content: draft });
  assert.equal(saved.status, 200);
  assert.deepEqual(saved.result.published, seed);
  assert.equal(
    (await f.request("save", { revision: 1, content: seed })).status,
    409,
  );
  assert.equal((await f.request("publish", { revision: 2 })).status, 400);
  saved = await f.request("publish", { revision: 2, confirm: true });
  assert.equal(saved.result.published.cases[0].title, "Изменённый кейс");
  assert.deepEqual(saved.result.previous, seed);
  saved = await f.request("rollback", { revision: 3, confirm: true });
  assert.deepEqual(saved.result.published, seed);
  await f.restart();
  assert.equal((await f.request("content")).status, 401);
  await f.login();
  saved = await f.request("content");
  assert.equal(saved.result.revision, 4);
  assert.deepEqual(saved.result.previous, draft);
});
test("images are decoded and reencoded; backup restores draft and files into a clean CMS", async (t) => {
  const f = await fixture(t);
  await f.login();
  const bytes = await sharp({
    create: { width: 3, height: 3, channels: 3, background: "#f00" },
  })
    .png()
    .toBuffer();
  const uploaded = await f.request("upload", {
    bytes: bytes.toString("base64"),
  });
  assert.equal(uploaded.status, 200);
  const draft = structuredClone(seed);
  draft.cases[0].image = uploaded.result.url;
  await f.request("save", { revision: 1, content: draft });
  const backup = (await f.request("backup")).result;
  const fresh = await fixture(t);
  await fresh.login();
  const restored = await fresh.request("restore", { revision: 1, backup });
  assert.equal(restored.status, 200);
  assert.deepEqual(restored.result.draft, draft);
  assert.deepEqual(restored.result.published, seed);
  const file = await fetch(`${fresh.base}${uploaded.result.url}`, {
    headers: {
      Cookie: (await fresh.request("login", { password })).response.headers
        .get("set-cookie")
        .split(";")[0],
    },
  });
  assert.equal(file.status, 200);
  assert.equal(file.headers.get("content-type"), "image/webp");
  assert.equal(
    (await fetch(`${fresh.base}${uploaded.result.url}`)).status,
    401,
  );
});
test("invalid content, unsafe links, malformed images and backups are rejected", async (t) => {
  const f = await fixture(t);
  await f.login();
  for (const bytes of [
    "not-an-image",
    '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  ])
    assert.equal(
      (
        await f.request("upload", {
          bytes: Buffer.from(bytes).toString("base64"),
        })
      ).status,
      400,
    );
  for (const invalidContent of [
    null,
    { cases: [null], links: seed.links },
    {
      ...structuredClone(seed),
      cases: [{ ...seed.cases[0], chapters: [null] }],
    },
  ])
    assert.equal(
      (await f.request("save", { revision: 1, content: invalidContent }))
        .status,
      400,
    );
  assert.equal((await f.request("save", null)).status, 400);
  let invalid = structuredClone(seed);
  invalid.cases[0].url = "javascript:alert(1)";
  assert.equal(
    (await f.request("save", { revision: 1, content: invalid })).status,
    400,
  );
  invalid = structuredClone(seed);
  invalid.cases[1].slug = invalid.cases[0].slug;
  assert.equal(
    (await f.request("save", { revision: 1, content: invalid })).status,
    400,
  );
  assert.equal(
    (
      await f.request("restore", {
        revision: 1,
        backup: {
          format: 1,
          draft: seed,
          files: [{ name: "../../etc/passwd", bytes: "" }],
        },
      })
    ).status,
    400,
  );
  assert.equal((await f.request("content")).result.revision, 1);
});
test("login rate limit blocks repeated attempts", async (t) => {
  const f = await fixture(t);
  for (let i = 0; i < 5; i++)
    assert.equal((await f.request("login", { password: "wrong" })).status, 401);
  assert.equal((await f.request("login", { password })).status, 429);
});
