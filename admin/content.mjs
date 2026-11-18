import { cases, caseChapters } from "../src/data/cases.ts";
import { links } from "../src/config/links.ts";
export const seed = {
  cases: cases.map((project) => ({
    ...project,
    image: project.image ? `/assets/${project.image}.png` : "",
    url: "",
    role: "Add responsibilities",
    scope: "Add project scope",
    timeline: "To be confirmed",
    chapters: caseChapters.map((chapter) => ({ ...chapter, image: "" })),
  })),
  links: structuredClone(links),
};
export function validateContent(content) {
  const fail = () => {
    throw Object.assign(
      new Error("Проверьте структуру контента и адреса ссылок"),
      { status: 400 },
    );
  };
  const text = (value, max = 20000) =>
    typeof value === "string" && value.length <= max;
  const url = (value) =>
    value === null ||
    (text(value, 2048) &&
      (value === "" ||
        /^\/(?!\/)[a-zA-Z0-9/_.,%?=#-]*$/.test(value) ||
        /^https?:\/\/[^\s]+$/.test(value)));
  if (
    !content ||
    !Array.isArray(content.cases) ||
    content.cases.length > 100 ||
    !content.links ||
    typeof content.links !== "object" ||
    Array.isArray(content.links)
  )
    fail();
  const slugs = new Set();
  for (const project of content.cases) {
    if (!project || typeof project !== "object" || Array.isArray(project))
      fail();
    if (
      !text(project.slug, 100) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) ||
      slugs.has(project.slug)
    )
      fail();
    slugs.add(project.slug);
    for (const field of [
      "title",
      "category",
      "summary",
      "role",
      "scope",
      "timeline",
    ])
      if (!text(project[field])) fail();
    if (
      !url(project.image) ||
      !url(project.url) ||
      !Array.isArray(project.chapters) ||
      project.chapters.length > 50
    )
      fail();
    const ids = new Set();
    for (const chapter of project.chapters) {
      if (!chapter || typeof chapter !== "object" || Array.isArray(chapter))
        fail();
      for (const field of [
        "id",
        "title",
        "heading",
        "text",
        "caption",
        "asset",
      ])
        if (!text(chapter[field])) fail();
      if (
        !/^[a-z0-9-]+$/.test(chapter.id) ||
        ids.has(chapter.id) ||
        !url(chapter.image)
      )
        fail();
      ids.add(chapter.id);
    }
  }
  for (const key of ["telegram", "behance", "dribbble", "linkedin", "cv"])
    if (!url(content.links[key])) fail();
  if (
    content.links.email !== null &&
    content.links.email !== "" &&
    (!text(content.links.email, 254) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.links.email))
  )
    fail();
  if (
    !Array.isArray(content.links.projects) ||
    content.links.projects.length > 100 ||
    !content.links.projects.every(url)
  )
    fail();
  return content;
}
