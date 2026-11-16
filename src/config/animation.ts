/** All scroll ranges use normalized progress 0…1. Durations are milliseconds.
 * Increase scrollScreens for a slower scene. Smoothing never changes the final
 * scroll→time mapping: it only eases toward that exact target after a seek.
 */
export const animation = {
  enabled: { video: true, hero: true, stickers: true, headings: true, process: true, faq: true, plane: true },
  desktop: {
    video: { scrollScreens: 2.6, start: 0, end: 1, smoothingMs: 75, startSeconds: 0, endSeconds: null as number | null, objectPosition: '50% 50%' },
    heroOut: [0.12, 0.35] as const,
    aboutIn: [0.38, 0.63] as const,
    heading: { startViewport: 0.9, endViewport: 0.52, scrub: true, durationMs: 700 },
    reveal: { durationMs: 650, offsetPx: 14, scale: 0.97, processIntervalMs: 110, faqIntervalMs: 75, startViewport: 0.9 },
    stickers: { durationMs: 600, delaysMs: [170, 390, 280, 560, 340, 650, 470, 730], offsetPx: 16, scale: 0.92 },
    title: {durationMs: 850, delayMs: 60},
    hoverMs: 180,
  },
  mobile: {
    video: { scrollScreens: 2.2, start: 0, end: 1, smoothingMs: 55, startSeconds: 0, endSeconds: null as number | null, objectPosition: '50% 50%' },
    heroOut: [0.1, 0.32] as const,
    aboutIn: [0.37, 0.61] as const,
    heading: { startViewport: 0.94, endViewport: 0.68, scrub: true, durationMs: 550 },
    reveal: { durationMs: 500, offsetPx: 8, scale: 0.985, processIntervalMs: 80, faqIntervalMs: 55, startViewport: 0.94 },
    stickers: { durationMs: 500, delaysMs: [120, 290, 210, 420, 270, 480, 360, 540], offsetPx: 10, scale: 0.94 },
    title: {durationMs: 700, delayMs: 30},
    hoverMs: 150,
  },
  plane: { xPx: 8, yPx: -7, rotationDeg: -6 },
};
export function motionSettings(){return window.matchMedia('(max-width: 599px)').matches?animation.mobile:animation.desktop}
