# Animation and navigation review

## Implemented

- Replaced the 4.5/4.2 viewport pinned Hero → About scene with native document flow. The hero video still maps its time reversibly to the opening section's scroll progress.
- Replaced character-by-character statement colouring and translated/scaled reveals with one-time opacity fades. Sections passed by fast scrolling remain visible on return. Reduced motion displays content immediately.
- Restored a standalone `/work/` route and generated static entry point/metadata. Case breadcrumbs and return links now point there.
- Unified desktop/mobile navigation: Work, CV, Process, Get in touch. Process/contact links resolve against home from CV and case pages. Header contact links lead to the contact section; its CTA still opens the existing form.
- Menu focus restoration uses `preventScroll`, removing a source of jumps. Initial direct fragment links resolve after React mount and fonts; back/forward restoration remains browser-managed.
- Added project titles/categories to existing project cards so link destinations are visible. Preserved the existing six-project selection.
- Fixed tablet decorative tool overlap with hero metrics.

## Evidence and limitations

Inspected the original published site in Chrome before editing. The opening scene visibly held the screen over a large scroll range; the original menu linked Work to `/#work` and included both About and CV.

`npm run build`, `npm test` (21/21), and `git diff --check` pass.

Updated browser verification is blocked: `sites-preview start` returned `relay could not open browser port 4173: timed out waiting for relay readiness`; status reports stopped. The requested end-to-end scenario has **not** been verified against the changed build. No replacement browser/server route was used.

Publication is blocked: the Site ID retained in `.openai/hosting.json` is readable, but Sites source credential creation returned `project_not_found`. The existing hosted site has not been updated.

## Review recording still needed

No recording was attached; timestamps alone do not identify gestures or particular elements.

- **0:00–0:31:** the pinned delay is reproducible; the exact jump from the recording cannot be confirmed. Fixed the menu-focus jump risk and direct fragment resolution.
- **0:31–1:09:** opacity-only reveals are implemented, but the reviewer-indicated group and following element need visual identification to set their exact order.
- **2:16–2:28:** the lower block is not uniquely identifiable. Existing project cards have clearer labels; a different lower selection should be identified before restructuring it into 3–4 cards.

## Pending browser checklist

Home → slow/normal/fast scroll down → back up (check reversible video); menu Work → case → return to Work → CV → home Process → contacts. Reload `/work/`, a case, `/cv/`, `/#process`, `/#contact`; verify browser Back restores the list position. Repeat reveals with reduced motion, and on narrow/wide viewports.
