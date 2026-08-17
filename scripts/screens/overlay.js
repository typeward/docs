// Demo overlay for the recorded clips: a visible pointer, a click ripple, the
// keycaps for every shortcut, and a one-line caption for the current step.
//
// Playwright's real mouse leaves no trace in a screencast, and synthetic
// keydowns leave none either, so a clip of the app driving itself looks like
// things happen for no reason. This draws the missing half.
//
// Injected with page.addInitScript(installOverlay) in the video flows only --
// screenshots stay clean. It lives on <html>, outside the app's root, so no
// SolidJS render can remove it, and it is pointer-events: none throughout, so
// it never eats a click meant for the app.
//
// The function must stay self-contained: Playwright serializes it, so no
// closures over module scope.

export function installOverlay(opts) {
  const ACCENT = (opts && opts.accent) || '#e8a34d';

  const CSS = `
  #tw-demo {
    position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;
    font-family: Inter, "Segoe UI", system-ui, sans-serif;
  }
  #tw-demo .twd-cursor {
    position: absolute; top: 0; left: 0; width: 26px; height: 30px;
    transform: translate3d(-100px, -100px, 0);
    transition: transform 650ms cubic-bezier(.33, .06, .2, 1);
    will-change: transform;
    filter: drop-shadow(0 3px 7px rgba(0, 0, 0, .55));
    opacity: 0;
  }
  #tw-demo .twd-cursor.is-on { opacity: 1; }
  #tw-demo .twd-cursor svg { display: block; width: 26px; height: 30px; transition: transform 120ms ease; transform-origin: 3px 3px; }
  #tw-demo .twd-cursor.is-down svg { transform: scale(.82); }
  #tw-demo .twd-ring {
    position: absolute; top: 0; left: 0; width: 56px; height: 56px; margin: -28px 0 0 -28px;
    border-radius: 50%; border: 3px solid ${ACCENT};
    box-shadow: 0 0 22px ${ACCENT}66, inset 0 0 14px ${ACCENT}33;
    opacity: 0; transform: translate3d(-100px, -100px, 0) scale(.3);
  }
  #tw-demo .twd-ring.is-tap { animation: twd-tap 620ms cubic-bezier(.2, .7, .3, 1) forwards; }
  @keyframes twd-tap {
    0%   { opacity: 0;   transform: var(--twd-at) scale(.28); }
    18%  { opacity: .95; }
    100% { opacity: 0;   transform: var(--twd-at) scale(1.5); }
  }
  #tw-demo .twd-hud {
    position: absolute; left: 0; right: 0; bottom: 34px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  #tw-demo .twd-cap {
    max-width: 62%; padding: 9px 18px; border-radius: 999px;
    background: rgba(20, 17, 14, .82);
    border: 1px solid rgba(255, 255, 255, .14);
    box-shadow: 0 12px 34px rgba(0, 0, 0, .46);
    color: #f4ece1; font-size: 15px; font-weight: 500; letter-spacing: -.01em;
    white-space: nowrap; backdrop-filter: blur(9px);
    opacity: 0; transform: translateY(9px); transition: opacity 260ms ease, transform 260ms ease;
  }
  #tw-demo .twd-cap.is-on { opacity: 1; transform: none; }
  #tw-demo .twd-keys { display: flex; gap: 7px; opacity: 0; transform: translateY(8px) scale(.97); transition: opacity 180ms ease, transform 180ms ease; }
  #tw-demo .twd-keys.is-on { opacity: 1; transform: none; }
  #tw-demo .twd-key {
    min-width: 34px; padding: 8px 12px 9px; border-radius: 9px;
    background: linear-gradient(180deg, rgba(58, 51, 43, .96), rgba(34, 29, 24, .96));
    border: 1px solid rgba(255, 255, 255, .18);
    border-bottom-color: rgba(0, 0, 0, .6);
    box-shadow: 0 4px 0 rgba(0, 0, 0, .42), 0 10px 26px rgba(0, 0, 0, .4);
    color: #f6efe4; font-size: 14px; font-weight: 600; line-height: 1; text-align: center;
  }
  #tw-demo .twd-key.is-hit { background: linear-gradient(180deg, ${ACCENT}, #c8792c); border-color: ${ACCENT}; color: #1b1409; }
  `;

  const SVG =
    '<svg viewBox="0 0 26 30" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M3 2.2 L3 23.6 L8.7 18.2 L12.4 26.6 L16.5 24.8 L12.9 16.7 L20.6 16.4 Z" ' +
    'fill="#ffffff" stroke="#17130f" stroke-width="1.7" stroke-linejoin="round"/></svg>';

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  let el = null;
  function mount() {
    // Init scripts run before the document has an element to hang anything on,
    // so mounting is lazy and every entry point tolerates "not yet".
    const host = document.documentElement || document.body;
    if (!host) return null;
    if (el && host.contains(el.root)) return el;
    const root = document.createElement('div');
    root.id = 'tw-demo';
    root.innerHTML =
      '<style>' + CSS + '</style>' +
      '<span class="twd-ring"></span>' +
      '<div class="twd-cursor">' + SVG + '</div>' +
      '<div class="twd-hud"><div class="twd-cap"></div><div class="twd-keys"></div></div>';
    host.appendChild(root);
    el = {
      root,
      cursor: root.querySelector('.twd-cursor'),
      ring: root.querySelector('.twd-ring'),
      cap: root.querySelector('.twd-cap'),
      keys: root.querySelector('.twd-keys'),
      x: -100,
      y: -100,
    };
    return el;
  }

  function need() {
    const d = mount();
    if (!d) throw new Error('tw-demo: called before the document existed');
    return d;
  }

  window.__demo = {
    // Place the pointer with no travel (start of a scene).
    at(x, y) {
      const d = need();
      d.cursor.style.transition = 'none';
      d.cursor.style.transform = 'translate3d(' + (x - 3) + 'px,' + (y - 2) + 'px,0)';
      d.cursor.classList.add('is-on');
      d.x = x;
      d.y = y;
      // Force the no-transition placement to land before anything animates.
      void d.cursor.offsetWidth;
      d.cursor.style.transition = '';
    },

    // Glide to a point. Travel time scales with distance so short hops do not
    // crawl and long ones do not teleport.
    async to(x, y, ms) {
      const d = need();
      d.cursor.classList.add('is-on');
      const dist = Math.hypot(x - d.x, y - d.y);
      const dur = ms != null ? ms : Math.max(340, Math.min(900, 260 + dist * 0.62));
      d.cursor.style.transition = 'transform ' + dur + 'ms cubic-bezier(.33,.06,.2,1)';
      d.cursor.style.transform = 'translate3d(' + (x - 3) + 'px,' + (y - 2) + 'px,0)';
      d.x = x;
      d.y = y;
      await wait(dur + 90);
    },

    // Ripple at the pointer, with the small press dip that sells the click.
    async tap() {
      const d = need();
      d.ring.style.setProperty('--twd-at', 'translate3d(' + d.x + 'px,' + d.y + 'px,0)');
      d.ring.classList.remove('is-tap');
      void d.ring.offsetWidth;
      d.ring.classList.add('is-tap');
      d.cursor.classList.add('is-down');
      await wait(150);
      d.cursor.classList.remove('is-down');
      await wait(330);
    },

    // Keycaps for a shortcut, e.g. ['Ctrl', 'S']. The last cap lights up on
    // the beat the key would actually fire.
    async keys(list, hold) {
      const d = need();
      d.keys.innerHTML = list.map((k) => '<span class="twd-key">' + k + '</span>').join('');
      d.keys.classList.add('is-on');
      await wait(420);
      const caps = d.keys.querySelectorAll('.twd-key');
      caps.forEach((c) => c.classList.add('is-hit'));
      await wait(hold != null ? hold : 620);
      caps.forEach((c) => c.classList.remove('is-hit'));
      await wait(240);
      d.keys.classList.remove('is-on');
      await wait(200);
    },

    // Caption for the current step; stays until the next say() or clear().
    async say(text, settle) {
      const d = need();
      if (d.cap.textContent && d.cap.textContent !== text) {
        d.cap.classList.remove('is-on');
        await wait(230);
      }
      d.cap.textContent = text;
      d.cap.classList.add('is-on');
      await wait(settle != null ? settle : 420);
    },

    async clear() {
      const d = need();
      d.cap.classList.remove('is-on');
      d.keys.classList.remove('is-on');
      await wait(240);
      d.cap.textContent = '';
    },

    async fade() {
      const d = need();
      d.cursor.classList.remove('is-on');
      d.cap.classList.remove('is-on');
      d.keys.classList.remove('is-on');
      await wait(280);
    },
  };

  // Mount as soon as there is a document to mount into, so the first pointer
  // move does not also pay for creating the overlay.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mount());
  else mount();
}
