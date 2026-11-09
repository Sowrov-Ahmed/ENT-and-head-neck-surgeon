/*!
 * js/fx.js — SHARED CORE (never edit). Real-3D scene engine driven by data-attributes (perspective + preserve-3d + translateZ).
 *   data-reveal="rise|pop|tilt|fade|left|right" [data-delay=ms]    soft scroll-in (default rise). Not on elements that also use scroll-tilt/parallax/orbit.
 *   data-orbit[="10"]            CAMERA ORBIT: the element (give it [transform-style:preserve-3d]; parent [perspective:1600px]) rotates a few degrees toward the pointer
 *   data-explode                 EXPLODED VIEW: children [data-layer] get --i (0..n); the container gets --x (0 collapsed → 1 exploded) and --n (-1..1) while scrolling.
 *                                Style layers with e.g. [transform:translateZ(calc(var(--i)*var(--x)*70px))]
 *   data-drag3d                  drag / arrow-keys rotate an object (cube). Buttons: [data-cube-prev] [data-cube-next]; dots container [data-cube-dots]
 *   data-ring                    CYLINDER CAROUSEL: > [data-ring-stage] > [data-ring-item]; buttons [data-ring-prev] [data-ring-next]; [data-ring-dots]; data-autoplay="6000"
 *   data-light                   sets --mx/--my (px) on pointer move for specular-highlight overlays
 *   data-scroll-tilt             plane that tilts up (rotateX 28° → 0) as it scrolls into view
 *   data-parallax="0.12"         gentle vertical parallax (positive = slower)
 *   data-counter="5200" [data-prefix] [data-suffix] [data-decimals]    animated number
 * FX.init(root?) is idempotent; call it (or UI.mount) after injecting HTML. FX.reduced() reports prefers-reduced-motion.
 */
(function (w, d) {
  'use strict';
  var REVEAL = { rise: 'rise', pop: 'pop', tilt: 'tilt-in', fade: 'fade', left: 'slide-l', right: 'slide-r' };
  function reduced() { return !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function fine() { return !!(w.matchMedia && w.matchMedia('(pointer: fine)').matches); }
  function all(root, sel) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  function num(el, a, def) { var v = parseFloat(el.getAttribute(a)); return isNaN(v) ? def : v; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var hasIO = 'IntersectionObserver' in w, revealIO, counterIO, visIO, scrollItems = new Set(), visible = new Set(), ticking = false;

  function ensure() {
    if (!hasIO || revealIO) return;
    revealIO = new IntersectionObserver(function (es, o) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; var el = e.target; o.unobserve(el);
        var cls = 'animate-' + (REVEAL[el.getAttribute('data-reveal')] || 'rise'), delay = parseInt(el.getAttribute('data-delay') || '0', 10), dcls = delay ? '[animation-delay:' + delay + 'ms]' : '';
        el.classList.remove('opacity-0'); el.classList.add(cls); if (dcls) el.classList.add(dcls);
        el.addEventListener('animationend', function () { el.classList.remove(cls); if (dcls) el.classList.remove(dcls); el.setAttribute('data-revealed', 'true'); }, { once: true });
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    counterIO = new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { o.unobserve(e.target); runCounter(e.target); } }); }, { threshold: 0.4 });
    visIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); }); schedule(); }, { rootMargin: '200px 0px 200px 0px' });
  }
  function reveal(root) { all(root, '[data-reveal]:not([data-reveal-bound])').forEach(function (el) { el.setAttribute('data-reveal-bound', ''); if (reduced() || !hasIO) return; el.classList.add('opacity-0'); revealIO.observe(el); }); }

  /* ---- scroll-driven: parallax, scroll-tilt, explode ---- */
  function scrollFx(root) {
    all(root, '[data-parallax],[data-scroll-tilt],[data-explode]').forEach(function (el) {
      if (el.hasAttribute('data-sc-bound')) return; el.setAttribute('data-sc-bound', '');
      if (el.hasAttribute('data-explode')) all(el, '[data-layer]').forEach(function (l, i) { l.style.setProperty('--i', String(i)); });
      if (reduced() || !hasIO) { if (el.hasAttribute('data-explode')) { el.style.setProperty('--x', '0.7'); el.style.setProperty('--n', '0'); } return; }
      scrollItems.add(el); visIO.observe(el);
    });
  }
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  function update() {
    ticking = false; var vh = w.innerHeight;
    visible.forEach(function (el) {
      var r = el.getBoundingClientRect(), n = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2 || 1), -1, 1);
      if (el.hasAttribute('data-parallax')) el.style.transform = 'translate3d(0,' + (-(r.top + r.height / 2 - vh / 2) * num(el, 'data-parallax', 0.12)).toFixed(1) + 'px,0)';
      if (el.hasAttribute('data-scroll-tilt')) { var p = clamp((vh - r.top) / (vh * 0.8), 0, 1), e = 1 - Math.pow(1 - p, 3); el.style.transform = 'perspective(1400px) rotateX(' + ((1 - e) * 28).toFixed(2) + 'deg) translateY(' + ((1 - e) * 60).toFixed(1) + 'px) scale(' + (0.9 + 0.1 * e).toFixed(3) + ')'; el.style.opacity = (0.4 + 0.6 * e).toFixed(2); }
      if (el.hasAttribute('data-explode')) { el.style.setProperty('--x', clamp(1 - n * 1.15, 0, 1).toFixed(3)); el.style.setProperty('--n', n.toFixed(3)); }
    });
  }

  /* ---- camera orbit ---- */
  function orbit(root) {
    if (reduced() || !fine()) return;
    all(root, '[data-orbit]:not([data-orbit-bound])').forEach(function (el) {
      el.setAttribute('data-orbit-bound', ''); var max = num(el, 'data-orbit', 10), tx = 0, ty = 0, cx = 0, cy = 0, run = false, host = el.parentElement || el;
      function loop() { cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07; el.style.transform = 'rotateX(' + (cy * -max).toFixed(2) + 'deg) rotateY(' + (cx * max).toFixed(2) + 'deg)'; if (Math.abs(tx - cx) > 0.003 || Math.abs(ty - cy) > 0.003) requestAnimationFrame(loop); else run = false; }
      function go() { if (!run) { run = true; requestAnimationFrame(loop); } }
      host.addEventListener('pointermove', function (e) { var r = host.getBoundingClientRect(); tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1); ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1); go(); });
      host.addEventListener('pointerleave', function () { tx = 0; ty = 0; go(); });
    });
  }

  /* ---- drag-rotate object (cube) ---- */
  function drag3d(root) {
    all(root, '[data-drag3d]:not([data-drag-bound])').forEach(function (el) {
      el.setAttribute('data-drag-bound', ''); var rx = -16, ry = -28, vx = 0, vy = 0, down = false, lx = 0, ly = 0, face = 0, spin = el.hasAttribute('data-spin') && !reduced(), raf = 0;
      var FACES = [[0, 0], [0, -90], [0, -180], [0, -270], [-90, 0], [90, 0]];
      function paint() { el.style.transform = 'rotateX(' + rx.toFixed(1) + 'deg) rotateY(' + ry.toFixed(1) + 'deg)'; }
      function tick() { if (!down) { if (Math.abs(vx) > 0.02 || Math.abs(vy) > 0.02) { ry += vx; rx = clamp(rx + vy, -80, 80); vx *= 0.95; vy *= 0.95; } else if (spin) ry += 0.18; paint(); } raf = requestAnimationFrame(tick); }
      var host = el.parentElement || el;
      host.addEventListener('pointerdown', function (e) { down = true; lx = e.clientX; ly = e.clientY; spin = false; try { host.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } });
      host.addEventListener('pointermove', function (e) { if (!down) return; vx = (e.clientX - lx) * 0.4; vy = -(e.clientY - ly) * 0.4; ry += vx; rx = clamp(rx + vy, -80, 80); lx = e.clientX; ly = e.clientY; paint(); });
      function up() { down = false; } host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
      function to(i) { face = (i + 6) % 6; var f = FACES[face]; rx = f[0]; ry = f[1]; vx = vy = 0; spin = false; mark(); paint(); }
      function mark() { var dots = (root || d).querySelector ? el.closest('[data-cube-root]') : null; if (dots) all(dots, '[data-cube-dots] button').forEach(function (b, i) { b.setAttribute('aria-current', i === face ? 'true' : 'false'); }); }
      el.setAttribute('tabindex', '0'); el.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { ry -= 30; vx = 0; paint(); } if (e.key === 'ArrowLeft') { ry += 30; vx = 0; paint(); } if (e.key === 'ArrowUp') { rx = clamp(rx + 30, -80, 80); paint(); } if (e.key === 'ArrowDown') { rx = clamp(rx - 30, -80, 80); paint(); } });
      var rootEl = el.closest('[data-cube-root]') || d;
      var p = rootEl.querySelector('[data-cube-prev]'), n = rootEl.querySelector('[data-cube-next]'), dots = rootEl.querySelector('[data-cube-dots]');
      if (p) p.addEventListener('click', function () { to(face - 1); }); if (n) n.addEventListener('click', function () { to(face + 1); });
      if (dots) { dots.innerHTML = [0, 1, 2, 3, 4, 5].map(function (i) { return '<button type="button" aria-label="Show benefit ' + (i + 1) + '" class="h-3 w-3 rounded-full bg-cocoa/25 shadow-well aria-[current=true]:bg-clay"></button>'; }).join(''); all(dots, 'button').forEach(function (b, i) { b.addEventListener('click', function () { to(i); }); }); mark(); }
      paint(); if (!reduced()) raf = requestAnimationFrame(tick);
    });
  }

  /* ---- cylinder carousel ---- */
  function ring(root) {
    all(root, '[data-ring]:not([data-ring-bound])').forEach(function (el) {
      el.setAttribute('data-ring-bound', ''); var stage = el.querySelector('[data-ring-stage]'), items = all(el, '[data-ring-item]'), n = items.length, idx = 0, drag = 0, timer = null, radius = 0, step = n ? 360 / n : 0;
      if (!stage || !n) return;
      function layout() { var w0 = items[0].offsetWidth || 300; radius = n > 1 ? Math.round((w0 / 2) / Math.tan(Math.PI / n)) + 36 : 0; var h = 0; items.forEach(function (it, i) { it.style.marginLeft = (-w0 / 2) + 'px'; it.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)'; h = Math.max(h, it.offsetHeight); }); if (h) stage.style.height = h + 'px'; rotate(); }
      function rotate(extra) { stage.style.transform = 'translateZ(' + (-radius) + 'px) rotateY(' + (-idx * step + (extra || 0)).toFixed(1) + 'deg)'; items.forEach(function (it, i) { var on = i === ((idx % n) + n) % n; if (on) { it.removeAttribute('inert'); it.setAttribute('aria-current', 'true'); } else { it.setAttribute('inert', ''); it.removeAttribute('aria-current'); } }); mark(); }
      function go(i) { idx = i; rotate(); }
      function mark() { var dots = el.querySelector('[data-ring-dots]'); if (dots) all(dots, 'button').forEach(function (b, i) { b.setAttribute('aria-current', i === (((idx % n) + n) % n) ? 'true' : 'false'); }); }
      var dots = el.querySelector('[data-ring-dots]'); if (dots) { dots.innerHTML = items.map(function (_, i) { return '<button type="button" aria-label="Show item ' + (i + 1) + '" class="h-3 w-3 rounded-full bg-cocoa/25 shadow-well aria-[current=true]:bg-clay"></button>'; }).join(''); all(dots, 'button').forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); }); }
      var p = el.querySelector('[data-ring-prev]'), nx = el.querySelector('[data-ring-next]'); if (p) p.addEventListener('click', function () { go(idx - 1); }); if (nx) nx.addEventListener('click', function () { go(idx + 1); });
      var sx = null; el.addEventListener('pointerdown', function (e) { sx = e.clientX; }); el.addEventListener('pointerup', function (e) { if (sx == null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1)); });
      el.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1); });
      var ms = parseInt(el.getAttribute('data-autoplay') || '0', 10); if (ms && !reduced()) { var start = function () { stop(); timer = setInterval(function () { go(idx + 1); }, ms); }, stop = function () { clearInterval(timer); }; el.addEventListener('pointerenter', stop); el.addEventListener('pointerleave', start); el.addEventListener('focusin', stop); el.addEventListener('focusout', start); start(); }
      layout(); var rt; w.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 150); });
    });
  }

  function light(root) { if (!fine()) return; all(root, '[data-light]:not([data-light-bound])').forEach(function (el) { el.setAttribute('data-light-bound', ''); el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); }); }); }

  function fmtN(el, v) { var dec = parseInt(el.getAttribute('data-decimals') || '0', 10); return (el.getAttribute('data-prefix') || '') + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.getAttribute('data-suffix') || ''); }
  function runCounter(el) { var target = num(el, 'data-counter', 0), dur = parseInt(el.getAttribute('data-duration') || '1800', 10), t0 = performance.now(); (function tick(t) { var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmtN(el, p < 1 ? target * e : target); if (p < 1) requestAnimationFrame(tick); })(t0); }
  function counters(root) { all(root, '[data-counter]:not([data-counter-bound])').forEach(function (el) { el.setAttribute('data-counter-bound', ''); var t = num(el, 'data-counter', 0); if (reduced() || !hasIO) { el.textContent = fmtN(el, t); return; } el.textContent = fmtN(el, 0); counterIO.observe(el); }); }

  var FX = { init: function (root) { ensure(); reveal(root); scrollFx(root); orbit(root); drag3d(root); ring(root); light(root); counters(root); schedule(); }, reduced: reduced };
  w.addEventListener('scroll', function () { if (visible.size) schedule(); }, { passive: true });
  w.addEventListener('resize', schedule, { passive: true });
  w.FX = FX;
  function boot() { FX.init(d); }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})(window, document);
