// Parallax and cursor focus for the Math Space backdrop.
//
// Two effects, both driven from one rAF loop that only runs while something is
// still moving — a background must not hold a frame loop open for the life of
// the page:
//
//   parallax — each item drifts against the pointer by its own `depth`, so the
//              field reads as layered rather than flat.
//   focus    — whatever the pointer is near brightens, un-blurs and lifts
//              slightly, the way the original design rewards moving the mouse.
//
// Skipped wholesale for reduced motion and coarse pointers (there is no cursor
// to follow on a touchscreen, and the effect would just cost battery).

/** Pointer distance, in px, over which an item fades from focused to not. */
const FOCUS_RADIUS = 260;

/** Peak parallax offset in px, for an item at depth 1. */
const DRIFT = 26;

interface Item {
  el: HTMLElement;
  depth: number;
  /** Viewport-centre of the element, refreshed on resize and scroll. */
  cx: number;
  cy: number;
  focus: number;
  baseBlur: number;
  baseScale: number;
}

export function initMathField(): void {
  const field = document.querySelector<HTMLElement>('[data-math-field]');
  if (!field) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const items: Item[] = Array.from(field.querySelectorAll<HTMLElement>('.mf-item')).map((el) => {
    const styles = getComputedStyle(el);
    return {
      el,
      depth: Number(el.dataset.depth ?? '0.5'),
      cx: 0,
      cy: 0,
      focus: 0,
      baseBlur: parseFloat(styles.getPropertyValue('--mf-blur')) || 0,
      baseScale: parseFloat(styles.getPropertyValue('--mf-scale')) || 1,
    };
  });
  if (items.length === 0) return;

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let driftX = 0;
  let driftY = 0;
  let targetX = 0;
  let targetY = 0;
  let frame = 0;

  function measure(): void {
    for (const item of items) {
      // getBoundingClientRect on a transformed element includes the transform,
      // so back it out to get the untransformed centre the maths assumes.
      const rect = item.el.getBoundingClientRect();
      item.cx = rect.left + rect.width / 2 - driftX * item.depth;
      item.cy = rect.top + rect.height / 2 - driftY * item.depth;
    }
  }

  function step(): void {
    driftX += (targetX - driftX) * 0.06;
    driftY += (targetY - driftY) * 0.06;

    let settling = Math.abs(targetX - driftX) > 0.05 || Math.abs(targetY - driftY) > 0.05;

    for (const item of items) {
      const distance = Math.hypot(pointerX - item.cx, pointerY - item.cy);
      const target = Math.max(0, 1 - distance / FOCUS_RADIUS);
      item.focus += (target - item.focus) * 0.12;
      if (Math.abs(target - item.focus) > 0.004) settling = true;

      const f = item.focus;
      const x = driftX * item.depth;
      const y = driftY * item.depth;
      const scale = item.baseScale * (1 + f * 0.06);
      item.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      item.el.style.setProperty('--mf-focus', f.toFixed(3));
      if (item.baseBlur > 0) {
        item.el.style.filter = `blur(${(item.baseBlur * (1 - f)).toFixed(2)}px)`;
      }
    }

    frame = settling ? requestAnimationFrame(step) : 0;
  }

  function wake(): void {
    if (!frame) frame = requestAnimationFrame(step);
  }

  measure();

  window.addEventListener(
    'mousemove',
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      targetX = (event.clientX / window.innerWidth - 0.5) * -2 * DRIFT;
      targetY = (event.clientY / window.innerHeight - 0.5) * -2 * DRIFT;
      wake();
    },
    { passive: true },
  );

  // The field is fixed, so scrolling changes which items sit under the cursor.
  // Coalesce to one measure per frame: measure() reads getBoundingClientRect
  // on every item, and doing that on each scroll event forces layout mid-scroll.
  let scrollFrame = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        measure();
        wake();
      });
    },
    { passive: true },
  );

  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      measure();
      wake();
    }, 150);
  });
}
