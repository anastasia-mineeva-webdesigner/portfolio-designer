# Портфолио Миры Смирновой

Демонстрационный сайт-портфолио AI Full Stack Designer на React 19, TypeScript, Vite и CSS. В проекте есть главная с видеосценой Hero → About, шесть дизайн-кейсов, резюме с печатной версией и PDF, контакты и страница 404.

[Открыть сайт](https://mira-portfolio-review.idealforum1.chatgpt.site/)

## Локальный запуск

Требуется Node.js 22.12 или новее.

```sh
npm ci
npm run dev
```

Откройте адрес, указанный Vite в терминале.

| Команда | Назначение |
| --- | --- |
| `npm test` | Тесты адаптивной геометрии, скролл-анимации и вспомогательной логики. |
| `npm run build` | Проверка TypeScript и статическая сборка в `dist/`. |
| `npm run preview` | Предпросмотр `dist/` после сборки. |

GitHub Actions запускает тесты и сборку при push и pull request.

## Страницы

| Адрес | Содержимое |
| --- | --- |
| `/` | Главная. Selected work и Process доступны по якорям `#work` и `#process`. |
| `/cases/<slug>/` | Общий шаблон кейса. Шесть проектов описаны в [данных кейсов](src/data/cases.json). |
| `/cv/` | Резюме с действиями Print CV и Download CV. |
| `/contacts/` | Контакты, внешние профили и форма Get in touch. |
| `/404.html` | Шаблон для неизвестных адресов. |

Форма Get in touch проверяет поля и показывает подтверждение в браузере. В демонстрационной версии заявки не отправляются и не сохраняются.

## Структура проекта

Маршруты определяются в [App.tsx](src/App.tsx). Интерфейс отрисовывается в браузере, метаданные страниц генерируются при сборке.

| Задача | Файлы |
| --- | --- |
| Тексты и контакты | [Главная](src/components/Sections.tsx), [контакты](src/components/ContactsPage.tsx), [резюме](src/components/CVPage.tsx), [ссылки](src/config/links.ts) |
| Кейсы | [Данные](src/data/cases.json), [шаблон](src/components/CasePage.tsx), [медиа](public/projects/) |
| Адаптивная компоновка | [CSS-переменные](src/tokens.css), [адаптивные правила](src/responsive.css), [геометрия Hero](src/config/hero-layout.mjs) |
| Видео и переход Hero → About | [Медиа](src/config/media.ts), [таймлайн](src/config/intro-scene.mjs), [сцена](src/components/VideoScene.tsx) |
| Get in touch | [Форма и валидация](src/components/ContactDialog.tsx) |
| Печатное резюме | [Стили печати](src/cv.css), [генератор](scripts/build-cv-pdf.mjs), [PDF](public/downloads/mira-smirnova-cv.pdf) |

## Публикация и сопровождение

На хостинг передаётся содержимое `dist/`. Текущий адрес обслуживает ChatGPT Sites. Параметры проекта указаны в [конфигурации публикации](.openai/hosting.json). Публикация версии сайта выполняется в ChatGPT Sites отдельно от проверок GitHub Actions.

- [Сборка, SEO и обновление PDF](docs/seo-checklist.md)
- [Проверка перед показом или публикацией](docs/verification.md)
