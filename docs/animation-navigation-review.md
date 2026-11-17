# Mira animation and navigation review

## Changes
- Kept Hero → About composition and reversible video scrubbing. Shortened pinned distance from 4.5/4.2 to 2.1/1.9 viewport heights and aligned timeline start to the actual sticky position on short windows.
- Removed video autoplay competing with scroll seeks. Intersection gates detach scroll handlers outside the intro. Fonts are preloaded; media dimensions are reserved. No global scroll reset or manual history restoration was introduced.
- Replaced character-by-character white-to-black text with readable text; semantic groups fade in once, in document order (tag, heading, description, statement, Recognition, awards, button). No translate/scale in content reveals. Delays are capped, skipped content stays visible, reduced motion bypasses waits.
- Restored /work/ from commit 23d8a04 and emitted its static HTML for direct requests/reload. Shared desktop/mobile destinations: Work, About(CV), Process, Get in touch. CV CTA: Читать подробнее. Menu focus restoration uses preventScroll.
- Replaced next-project text link with a single horizontal, scrollable card row containing every other project, preview, category and title. Keyboard focus and native horizontal scrolling are supported.
- Exported original SVG decorations and stickers from Figma cq0Wj2JTCIpmrrPO2zVTuY, handoff frame 354:8684; no raster images embedded in those SVGs. Existing tool SVGs retained. Photography and project screenshots remain raster by design.
- Fixed tablet tool/metrics overlap exposed by the existing layout test.

## Verification
- Before edits, opened published site in Chrome. Scrolled in small, normal and large steps; observed long portrait pin after heading disappearance and menu still pointing Work to /#work. Opened and closed menu.
- npm test: 21/21 passing. npm run build: passing, including TypeScript and ten static routes. SVG raster-embedding scan: none. git diff --check: passing.
- Local preview failed with “relay could not open browser port 4173: timed out waiting for relay readiness”; sites-preview status: stopped. No alternate browser infrastructure installed.
- Post-deployment browser checks are recorded below after publication.

## Review references
No review video was attached. The user's written follow-up identifies the lower block as other projects on case pages; that block is implemented. At 0:31–1:09 the exact gestured groups remain unknown; fade order follows the explicit written sequence, without inventing a different gesture mapping. At 2:16–2:28, any lower block other than the case recommendations still needs a specific element reference.

## Published browser verification (Chrome)
- Completed Home → scroll down/back → Work → Volta case → All projects → CV → Process → contacts.
- Work survived reload, case breadcrumb and recommendation links target /work/, and Back/Forward returned between the case and list.
- Menu open/close preserved scrollY=3432 exactly. Video was paused, reached 4.002s at scrollY=1838 and rewound to 3.273404s at scrollY=1103.
- Process reload settled at section top=128.375px below the 81px header; contacts likewise at 128.375px. Direct anchor landing now explicitly resolves after React and fonts, without changing back_forward navigation or unfragmented page positions. CV's secondary project links also use /work/.
- Five other-project cards are present on Volta, visible with previews/category/title, in a horizontal track. Screenshot captured from published page.
- Mobile drawer interaction was checked at the browser's 1156px content width. True phone viewport, touch seeking, Safari/iOS, and reduced-motion runtime remain unverified: this managed Chrome blocks DevTools/device and media emulation (“Your organization has blocked the use of DevTools on this page”). Reduced-motion branches were reviewed in source, and eight layout widths are covered by the automated layout checks; these are not browser/device tests.
