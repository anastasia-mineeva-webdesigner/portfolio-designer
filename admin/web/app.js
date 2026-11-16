const app = document.querySelector("#app");
const notice = document.querySelector("#notice");
let csrf = "",
  snapshot,
  content,
  selected = 0,
  dirty = false,
  busy = false;
function showError(error) {
  notice.textContent = error.message;
}
function el(tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of children.flat())
    if (child !== undefined && child !== null) node.append(child);
  return node;
}
function button(text, action, className = "") {
  return el(
    "button",
    {
      type: "button",
      class: className,
      onclick: async () => {
        if (busy) return;
        try {
          await action();
        } catch (error) {
          showError(error);
        }
      },
    },
    text,
  );
}
async function api(path, input) {
  const response = await fetch(`/admin/api/${path}`, {
    method: input === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
    body: input === undefined ? undefined : JSON.stringify(input),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "Не удалось выполнить запрос");
  return result;
}
function markDirty() {
  dirty = true;
  document
    .querySelector("#save-state")
    ?.replaceChildren("Есть несохранённые изменения");
}
function field(title, object, key, multiline = false) {
  const input = el(multiline ? "textarea" : "input", {
    oninput: (event) => {
      object[key] = event.target.value;
      markDirty();
    },
  });
  input.value = object[key] ?? "";
  return el("label", {}, title, input);
}
function imageField(title, object) {
  return el(
    "div",
    {},
    field(title, object, "image"),
    el(
      "label",
      { class: "upload" },
      "Загрузить PNG, JPEG или WebP · до 8 МБ",
      el("input", {
        type: "file",
        accept: "image/png,image/jpeg,image/webp",
        onchange: async (event) => {
          try {
            const file = event.target.files[0];
            if (!file) return;
            if (file.size > 8 * 1024 * 1024)
              throw new Error("Изображение больше 8 МБ");
            notice.textContent = "Загружаем изображение…";
            const bytes = new Uint8Array(await file.arrayBuffer());
            let binary = "";
            for (const byte of bytes) binary += String.fromCharCode(byte);
            const uploaded = await api("upload", { bytes: btoa(binary) });
            object.image = uploaded.url;
            markDirty();
            render();
            notice.textContent = "Изображение загружено. Сохраните черновик.";
          } catch (error) {
            showError(error);
          }
        },
      }),
    ),
    object.image
      ? el("img", { src: object.image, alt: title, loading: "lazy" })
      : null,
  );
}
function shell(...children) {
  app.replaceChildren(
    el(
      "header",
      {},
      el(
        "div",
        {},
        el("strong", {}, "Редакция"),
        el("small", {}, "Портфолио / управление контентом"),
      ),
      button("Выйти", async () => {
        if (dirty && !confirm("Выйти без сохранения изменений?")) return;
        await api("logout", {});
        csrf = "";
        dirty = false;
        login();
      }),
    ),
    el("main", {}, ...children),
  );
}
function login() {
  const input = el("input", {
    type: "password",
    autocomplete: "current-password",
    required: "",
    minlength: "12",
  });
  const form = el(
    "form",
    {
      class: "login",
      onsubmit: async (event) => {
        event.preventDefault();
        const submit = form.querySelector("button");
        submit.disabled = true;
        try {
          ({ csrf } = await api("login", { password: input.value }));
          await load();
        } catch (error) {
          showError(error);
        } finally {
          submit.disabled = false;
        }
      },
    },
    el("p", { class: "muted" }, "Портфолио · закрытый раздел"),
    el("h1", {}, "Вход в редакцию"),
    el("label", {}, "Пароль", input),
    el("button", { type: "submit", class: "primary" }, "Войти"),
    el(
      "p",
      { class: "muted" },
      "Изменения здесь не затрагивают основной сайт.",
    ),
  );
  app.replaceChildren(form);
  input.focus();
}
async function load() {
  snapshot = await api("content");
  content = structuredClone(snapshot.draft);
  dirty = false;
  render();
}
async function mutate(action, extra = {}) {
  busy = true;
  document.querySelectorAll("button, input, textarea").forEach((control) => {
    control.disabled = true;
  });
  try {
    const saved = await api(action, { revision: snapshot.revision, ...extra });
    snapshot = saved;
    content = structuredClone(saved.draft);
    dirty = false;
    render();
    notice.textContent =
      action === "publish"
        ? "Опубликовано только в локальной CMS. Основной сайт не изменён."
        : "Готово. Основной сайт не изменён.";
  } finally {
    busy = false;
    document.querySelectorAll("button, input, textarea").forEach((control) => {
      control.disabled = false;
    });
  }
}
function blankChapter() {
  return {
    id: `chapter-${crypto.randomUUID().slice(0, 8)}`,
    title: "Новая глава",
    heading: "",
    text: "",
    caption: "",
    asset: "",
    image: "",
  };
}
function newCase() {
  content.cases.push({
    slug: `project-${crypto.randomUUID().slice(0, 8)}`,
    title: "Новый кейс",
    category: "",
    summary: "",
    role: "",
    scope: "",
    timeline: "",
    url: "",
    image: "",
    chapters: [],
  });
  selected = content.cases.length - 1;
  markDirty();
  render();
}
function render() {
  const project = content.cases[selected];
  const actions = el(
    "div",
    { class: "toolbar" },
    button("Сохранить черновик", () => mutate("save", { content }), "primary"),
    button("Предпросмотр", async () => {
      if (
        dirty &&
        !confirm(
          "Предпросмотр показывает сохранённый черновик. Сохранить изменения?",
        )
      )
        return;
      if (dirty) await mutate("save", { content });
      await preview();
    }),
    button("Опубликовать в CMS", async () => {
      if (dirty) throw new Error("Сначала сохраните черновик");
      if (
        confirm(
          "Опубликовать сохранённый черновик в отдельной CMS? Основной сайт не подключён.",
        )
      )
        await mutate("publish", { confirm: true });
    }),
    el(
      "a",
      {
        href: "/admin/api/backup",
        class: "button",
        download: "portfolio-backup.json",
      },
      "Скачать копию",
    ),
    button("Восстановить копию", () =>
      document.querySelector("#restore-file").click(),
    ),
    button("Предыдущая публикация", async () => {
      if (
        confirm(
          "Вернуть предыдущую публикацию в CMS? Текущий черновик будет заменён.",
        )
      )
        await mutate("rollback", { confirm: true });
    }),
    el("input", {
      id: "restore-file",
      type: "file",
      accept: ".json",
      hidden: "",
      onchange: async (event) => {
        try {
          const file = event.target.files[0];
          if (!file) return;
          if (file.size > 64 * 1024 * 1024)
            throw new Error(
              "Копия больше 64 МБ. Используйте серверную резервную копию.",
            );
          const backup = JSON.parse(await file.text());
          if (
            confirm(
              "Заменить черновик содержимым резервной копии? Публикация останется прежней.",
            )
          )
            await mutate("restore", { backup });
        } catch (error) {
          showError(error);
        }
      },
    }),
  );
  const list = el(
    "aside",
    { "aria-label": "Кейсы" },
    ...content.cases.map((entry, index) =>
      el(
        "div",
        { class: `case-row ${selected === index ? "selected" : ""}` },
        button(`${String(index + 1).padStart(2, "0")}  ${entry.title}`, () => {
          selected = index;
          render();
        }),
        el("small", {}, entry.category),
        el(
          "div",
          { class: "row-actions" },
          button("↑", () => move(index, -1)),
          button("↓", () => move(index, 1)),
          button(
            "Удалить",
            () => {
              if (
                confirm(
                  `Удалить «${entry.title}» из черновика? Исходные файлы останутся.`,
                )
              ) {
                content.cases.splice(index, 1);
                selected = Math.max(
                  0,
                  Math.min(selected, content.cases.length - 1),
                );
                markDirty();
                render();
              }
            },
            "danger",
          ),
        ),
      ),
    ),
    button("+ Добавить кейс", newCase),
  );
  const editor = el(
    "section",
    { class: "editor" },
    project
      ? el(
          "div",
          {},
          el("h2", {}, project.title),
          el(
            "div",
            { class: "fields" },
            ...Object.entries({
              title: "Название",
              slug: "Адрес /cases/…",
              category: "Категория",
              url: "Внешняя ссылка",
              role: "Роль",
              scope: "Объём работ",
              timeline: "Сроки",
            }).map(([key, label]) => field(label, project, key)),
          ),
          field("Описание", project, "summary", true),
          imageField("Обложка", project),
          el("h2", {}, "Главы кейса"),
          ...project.chapters.map((chapter, index) =>
            el(
              "details",
              {},
              el("summary", {}, `${index + 1}. ${chapter.title}`),
              ...Object.entries({
                id: "Якорь главы",
                title: "Название в оглавлении",
                heading: "Заголовок",
                text: "Текст",
                caption: "Подпись",
              }).map(([key, label]) =>
                field(label, chapter, key, key === "text"),
              ),
              imageField("Изображение главы", chapter),
              el(
                "div",
                { class: "toolbar" },
                button("Выше", () => moveChapter(index, -1)),
                button("Ниже", () => moveChapter(index, 1)),
                button(
                  "Удалить главу",
                  () => {
                    if (confirm("Удалить главу из черновика?")) {
                      project.chapters.splice(index, 1);
                      markDirty();
                      render();
                    }
                  },
                  "danger",
                ),
              ),
            ),
          ),
          button("+ Добавить главу", () => {
            project.chapters.push(blankChapter());
            markDirty();
            render();
          }),
        )
      : el("p", {}, "Кейсов пока нет. Добавьте первый проект."),
  );
  const contacts = el(
    "details",
    {},
    el("summary", {}, "Контакты, социальные ссылки и CV"),
    el(
      "div",
      { class: "fields" },
      ...["email", "telegram", "behance", "dribbble", "linkedin", "cv"].map(
        (key) =>
          field(
            key === "email"
              ? "Электронная почта"
              : key === "cv"
                ? "Ссылка на CV"
                : key,
            content.links,
            key,
          ),
      ),
    ),
    el(
      "p",
      { class: "muted" },
      "Пустое поле означает отсутствие ссылки. Разрешены https://, http:// и локальные адреса.",
    ),
  );
  shell(
    el("h1", {}, "Ваши проекты"),
    el(
      "p",
      { class: "note" },
      "Отдельная CMS. Сохранение и публикация не меняют основной сайт.",
    ),
    el(
      "p",
      { id: "save-state", class: "muted" },
      dirty
        ? "Есть несохранённые изменения"
        : `Черновик сохранён · версия ${snapshot.revision}`,
    ),
    actions,
    el("div", { class: "workspace" }, list, editor),
    contacts,
  );
}
function move(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= content.cases.length) return;
  [content.cases[index], content.cases[target]] = [
    content.cases[target],
    content.cases[index],
  ];
  selected = target;
  markDirty();
  render();
}
function moveChapter(index, direction) {
  const chapters = content.cases[selected].chapters,
    target = index + direction;
  if (target < 0 || target >= chapters.length) return;
  [chapters[index], chapters[target]] = [chapters[target], chapters[index]];
  markDirty();
  render();
}
async function preview() {
  const draft = await api("preview");
  const project = draft.cases[selected] || draft.cases[0];
  shell(
    button("← Вернуться к редактору", render),
    el(
      "p",
      { class: "note" },
      "Предпросмотр сохранённого черновика. Оформление редакционное; основной сайт не подключён.",
    ),
    el(
      "article",
      { class: "preview" },
      el(
        "nav",
        {},
        ...draft.cases.map((entry, index) =>
          button(entry.title, async () => {
            selected = index;
            await preview();
          }),
        ),
      ),
      project
        ? [
            el("h1", {}, project.title),
            el("p", {}, project.category),
            el("p", {}, project.summary),
            project.image
              ? el("img", { src: project.image, alt: project.title })
              : null,
            el(
              "dl",
              {},
              ...["role", "scope", "timeline"].flatMap((key, index) => [
                el("dt", {}, ["Роль", "Объём работ", "Сроки"][index]),
                el("dd", {}, project[key]),
              ]),
            ),
            ...project.chapters.map((chapter) =>
              el(
                "section",
                {},
                el("p", { class: "muted" }, chapter.title),
                el("h2", {}, chapter.heading),
                el("p", {}, chapter.text),
                chapter.image
                  ? el(
                      "figure",
                      {},
                      el("img", { src: chapter.image, alt: chapter.caption }),
                      el("figcaption", {}, chapter.caption),
                    )
                  : el("p", { class: "muted" }, chapter.caption),
              ),
            ),
          ]
        : el("p", {}, "Кейсов пока нет."),
    ),
  );
}
window.addEventListener("beforeunload", (event) => {
  if (dirty) {
    event.preventDefault();
    event.returnValue = "";
  }
});
(async () => {
  try {
    ({ csrf } = await api("session"));
    await load();
  } catch {
    login();
  }
})();
