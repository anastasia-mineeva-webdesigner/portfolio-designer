import { randomBytes, scryptSync } from "node:crypto";
export function hashPassword(password) {
  const salt = randomBytes(32).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  if (process.stdin.isTTY)
    throw new Error(
      'Передайте пароль через stdin: read -s -r -p "Пароль: " ADMIN_SECRET; printf %s "$ADMIN_SECRET" | npm run password --silent; unset ADMIN_SECRET',
    );
  let password = "";
  for await (const part of process.stdin) password += part;
  password = password.trimEnd();
  if (password.length < 12) throw new Error("Нужно не менее 12 символов");
  console.log(`ADMIN_PASSWORD_HASH=${hashPassword(password)}`);
}
