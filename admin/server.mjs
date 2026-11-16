import { createServer } from "node:http";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { openStore } from "./store.mjs";
const root = dirname(fileURLToPath(import.meta.url));
const MAX_IMAGE = 8 * 1024 * 1024;
const fail = (status, message) => Object.assign(new Error(message), { status });
async function body(request, limit = 12 * 1024 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) throw fail(413, "Файл или документ слишком большой");
    chunks.push(chunk);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString());
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("object required");
    return parsed;
  } catch {
    throw fail(400, "Ожидается JSON-объект");
  }
}
export function createAdmin({
  directory,
  passwordHash,
  origin,
  secure = false,
}) {
  if (!/^[a-f0-9]{64}:[a-f0-9]{128}$/.test(passwordHash || ""))
    throw new Error("Задайте ADMIN_PASSWORD_HASH (npm run password)");
  if (
    !origin ||
    new URL(origin).origin !== origin ||
    (secure && !origin.startsWith("https://"))
  )
    throw new Error(
      "Задайте точный ADMIN_ORIGIN, HTTPS обязателен в production",
    );
  const store = openStore(directory);
  const sessions = new Map(),
    attempts = new Map();
  const uploads = join(directory, "uploads");
  const json = (res, value, status = 200) => {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
    });
    res.end(JSON.stringify(value));
  };
  const server = createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' data: https:; style-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    );
    try {
      const path = new URL(req.url, origin).pathname;
      if (
        req.method === "GET" &&
        ["/admin", "/admin/", "/admin/app.js", "/admin/style.css"].includes(
          path,
        )
      ) {
        const file = path.endsWith("app.js")
          ? "app.js"
          : path.endsWith("style.css")
            ? "style.css"
            : "index.html";
        res.setHeader(
          "Content-Type",
          file.endsWith(".js")
            ? "text/javascript"
            : file.endsWith(".css")
              ? "text/css"
              : "text/html; charset=utf-8",
        );
        return res.end(await readFile(join(root, "web", file)));
      }
      if (req.method === "GET" && path === "/robots.txt")
        return res.end("User-agent: *\nDisallow: /\n");
      const sessionId = /(?:^|; )portfolio_admin=([a-f0-9]{64})(?:;|$)/.exec(
        req.headers.cookie || "",
      )?.[1];
      const session = sessions.get(sessionId);
      const now = Date.now();
      for (const [id, saved] of sessions)
        if (saved.expires < now) sessions.delete(id);
      for (const [ip, saved] of attempts)
        if (saved.until < now) attempts.delete(ip);
      if (req.method !== "GET" && req.headers.origin !== origin)
        throw fail(403, "Недопустимый источник запроса");
      if (path === "/admin/api/login" && req.method === "POST") {
        const ip = req.socket.remoteAddress;
        const rate = attempts.get(ip) || {
          count: 0,
          until: now + 15 * 60 * 1000,
        };
        if (rate.count >= 5)
          throw fail(429, "Слишком много попыток. Попробуйте через 15 минут");
        rate.count++;
        attempts.set(ip, rate);
        const input = await body(req, 4096);
        const [salt, expected] = passwordHash.split(":");
        const actual = scryptSync(
          typeof input.password === "string" ? input.password : "",
          salt,
          64,
        );
        if (!timingSafeEqual(actual, Buffer.from(expected, "hex")))
          throw fail(401, "Неверный пароль");
        attempts.delete(ip);
        if (sessionId) sessions.delete(sessionId);
        const id = randomBytes(32).toString("hex"),
          csrf = randomBytes(32).toString("hex");
        sessions.set(id, { csrf, expires: now + 8 * 3600 * 1000 });
        res.setHeader(
          "Set-Cookie",
          `portfolio_admin=${id}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=28800${secure ? "; Secure" : ""}`,
        );
        return json(res, { csrf });
      }
      if (!session || session.expires < now)
        throw fail(401, "Войдите в админку");
      if (req.method !== "GET" && req.headers["x-csrf-token"] !== session.csrf)
        throw fail(403, "Обновите страницу и повторите вход");
      if (path === "/admin/api/session" && req.method === "GET")
        return json(res, { csrf: session.csrf });
      if (path === "/admin/api/logout" && req.method === "POST") {
        sessions.delete(sessionId);
        res.setHeader(
          "Set-Cookie",
          `portfolio_admin=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`,
        );
        return json(res, { ok: true });
      }
      if (path === "/admin/api/content" && req.method === "GET")
        return json(res, store.read());
      if (path === "/admin/api/preview" && req.method === "GET")
        return json(res, store.read().draft);
      if (path === "/admin/api/backup" && req.method === "GET") {
        await mkdir(uploads, { recursive: true, mode: 0o700 });
        const files = [];
        for (const name of await readdir(uploads))
          if (/^[a-f0-9]{64}\.webp$/.test(name))
            files.push({
              name,
              bytes: (await readFile(join(uploads, name))).toString("base64"),
            });
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="portfolio-backup.json"',
        );
        return json(res, { format: 1, ...store.read(), files });
      }
      if (path === "/admin/api/upload" && req.method === "POST") {
        const input = await body(req);
        const bytes = Buffer.from(
          typeof input.bytes === "string" ? input.bytes : "",
          "base64",
        );
        if (!bytes.length || bytes.length > MAX_IMAGE)
          throw fail(413, "Изображение: максимум 8 МБ");
        let image;
        try {
          const source = sharp(bytes, {
            limitInputPixels: 40000000,
            animated: false,
          });
          const info = await source.metadata();
          if (!["png", "jpeg", "webp"].includes(info.format))
            throw new Error("format");
          image = await source.rotate().webp({ quality: 90 }).toBuffer();
        } catch {
          throw fail(
            400,
            "Нужен корректный PNG, JPEG или WebP до 40 мегапикселей",
          );
        }
        if (image.length > MAX_IMAGE)
          throw fail(
            413,
            "Изображение после обработки больше 8 МБ. Уменьшите разрешение.",
          );
        await mkdir(uploads, { recursive: true, mode: 0o700 });
        const name = `${randomBytes(32).toString("hex")}.webp`;
        await writeFile(join(uploads, name), image, {
          mode: 0o600,
          flag: "wx",
        });
        return json(res, { url: `/admin/uploads/${name}` });
      }
      if (
        req.method === "GET" &&
        /^\/admin\/uploads\/[a-f0-9]{64}\.webp$/.test(path)
      ) {
        res.setHeader("Content-Type", "image/webp");
        return res.end(await readFile(join(uploads, path.split("/").pop())));
      }
      if (req.method === "GET" && /^\/assets\/[a-z0-9-]+\.png$/.test(path)) {
        res.setHeader("Content-Type", "image/png");
        return res.end(await readFile(join(root, "..", "public", path)));
      }
      const action = /^\/admin\/api\/(save|publish|rollback|restore)$/.exec(
        path,
      )?.[1];
      if (action && req.method === "POST") {
        const input = await body(req, 64 * 1024 * 1024);
        if (["publish", "rollback"].includes(action) && input.confirm !== true)
          throw fail(400, "Подтвердите действие");
        if (action === "restore") {
          if (input.backup?.format !== 1 || !Array.isArray(input.backup.files))
            throw fail(400, "Неизвестный формат копии");
          // Validate and check revision before touching files; restoration only changes the draft.
          const { validateContent } = await import("./content.mjs");
          validateContent(input.backup.draft);
          if (store.read().revision !== input.revision)
            throw fail(409, "Версия изменилась. Обновите страницу");
          const restored = [];
          for (const file of input.backup.files) {
            if (
              !/^[a-f0-9]{64}\.webp$/.test(file.name) ||
              typeof file.bytes !== "string"
            )
              throw fail(400, "Неверный файл в копии");
            const bytes = Buffer.from(file.bytes, "base64");
            if (bytes.length > MAX_IMAGE)
              throw fail(400, "Слишком большой файл в копии");
            try {
              const info = await sharp(bytes, {
                limitInputPixels: 40000000,
              }).metadata();
              if (info.format !== "webp") throw new Error("format");
              await sharp(bytes, { limitInputPixels: 40000000 })
                .webp()
                .toBuffer();
            } catch {
              throw fail(400, "Повреждённое изображение в копии");
            }
            restored.push({ name: file.name, bytes });
          }
          await mkdir(uploads, { recursive: true, mode: 0o700 });
          for (const file of restored) {
            try {
              await writeFile(join(uploads, file.name), file.bytes, {
                flag: "wx",
                mode: 0o600,
              });
            } catch (error) {
              if (
                error.code !== "EEXIST" ||
                !(await readFile(join(uploads, file.name))).equals(file.bytes)
              )
                throw fail(409, "Конфликт файлов резервной копии");
            }
          }
          return json(
            res,
            store.update("restore", input.revision, input.backup.draft),
          );
        }
        return json(res, store.update(action, input.revision, input.content));
      }
      throw fail(404, "Адрес не найден");
    } catch (error) {
      if (!error.status && error.code !== "ENOENT") console.error(error);
      json(
        res,
        {
          error: error.status
            ? error.message
            : error.code === "ENOENT"
              ? "Файл не найден"
              : "Ошибка сервера",
        },
        error.status || (error.code === "ENOENT" ? 404 : 500),
      );
    }
  });
  server.on("close", () => store.close());
  return server;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.ADMIN_PORT || 3001);
  const server = createAdmin({
    directory: resolve(process.env.ADMIN_DATA_DIR || join(root, ".local-data")),
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
    origin: process.env.ADMIN_ORIGIN || `http://localhost:${port}`,
    secure: process.env.NODE_ENV === "production",
  });
  server.listen(port, "127.0.0.1", () =>
    console.log(`Админка: http://localhost:${port}/admin`),
  );
}
