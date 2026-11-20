const responseTime = 170;
const lineHeight = 16;

export function installSmoothScroll() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let target = 0;
  let position = 0;
  let lastWritten = 0;
  let previousTime = 0;

  function stop() {
    window.cancelAnimationFrame(frame);
    frame = 0;
  }

  function maxScroll() {
    const root = document.scrollingElement!;
    return Math.max(0, root.scrollHeight - root.clientHeight);
  }

  function pageIsLocked() {
    return document.body.style.overflow === 'hidden';
  }

  function animate(time: number) {
    if (pageIsLocked() || Math.abs(window.scrollY - lastWritten) > 1) {
      stop();
      return;
    }

    target = Math.min(target, maxScroll());
    const remaining = target - position;
    const finished = Math.abs(remaining) < 0.5;
    const elapsed = Math.max(0, Math.min(time - previousTime, 32));
    position = finished ? target : position + remaining * (1 - Math.exp(-elapsed / responseTime));
    window.scrollTo({ top: position, behavior: 'instant' });
    lastWritten = window.scrollY;
    previousTime = time;
    frame = finished ? 0 : window.requestAnimationFrame(animate);
  }

  function handleWheel(event: WheelEvent) {
    // Read deltaMode first so delta units remain consistent across browsers.
    const mode = event.deltaMode;
    if (event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.shiftKey ||
        Math.abs(event.deltaX) >= Math.abs(event.deltaY) || pageIsLocked()) {
      stop();
      return;
    }

    for (const node of event.composedPath()) {
      if (node === document.body || node === document.documentElement) break;
      if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight &&
          /^(auto|scroll|overlay)$/.test(getComputedStyle(node).overflowY)) {
        stop();
        return;
      }
    }

    const current = window.scrollY;
    const root = document.scrollingElement!;
    const delta = event.deltaY * (mode === 1 ? lineHeight : mode === 2 ? root.clientHeight : 1);
    const isAnimating = frame !== 0 && Math.abs(current - lastWritten) <= 1;
    // Reverse immediately instead of consuming the remaining travel in the old direction.
    const continuesInSameDirection = isAnimating && Math.sign(target - position) === Math.sign(delta);
    const start = continuesInSameDirection ? target : current;
    const next = Math.max(0, Math.min(start + delta, maxScroll()));
    if (!isAnimating && next === current) {
      stop();
      return;
    }

    event.preventDefault();
    target = next;
    if (!isAnimating) {
      stop();
      position = lastWritten = current;
      previousTime = performance.now();
      frame = window.requestAnimationFrame(animate);
    }
  }

  function syncPreference() {
    window.removeEventListener('wheel', handleWheel);
    stop();
    if (!reducedMotion.matches) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }
  }

  syncPreference();
  reducedMotion.addEventListener('change', syncPreference);
  const interruptEvents = ['pointerdown', 'keydown', 'resize', 'pagehide'];
  for (const event of interruptEvents) window.addEventListener(event, stop, { passive: true });

  return () => {
    reducedMotion.removeEventListener('change', syncPreference);
    window.removeEventListener('wheel', handleWheel);
    for (const event of interruptEvents) window.removeEventListener(event, stop);
    stop();
  };
}
