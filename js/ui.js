/*!
 * js/ui.js — SHARED CORE (never edit). window.UI: helpers, icons, class recipes and ready-made CLAY STUDIO components.
 * Every component returns an HTML string. After injecting HTML call UI.mount(container) (binds 3D/motion, accordion, tabs, carousel, ring, cube).
 * tone: 'light' (cocoa text on cream/blush/sage/mist sections) | 'dark' (cream text on cocoa sections)
 * Design law: matte clay surfaces, generous radius (≥ rounded-2xl), token shadows (shadow-clay*), spotlight backgrounds (bg-spot-*), NO glass/blur, NO black outlines.
 */
(function (window, document) {
  'use strict';
  var ICONS = {
    'arrow-right': '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/>', 'arrow-left': '<line x1="20" y1="12" x2="4" y2="12"/><polyline points="11 5 4 12 11 19"/>',
    'arrow-up': '<line x1="12" y1="20" x2="12" y2="4"/><polyline points="5 11 12 4 19 11"/>', 'arrow-down': '<line x1="12" y1="4" x2="12" y2="20"/><polyline points="19 13 12 20 5 13"/>', 'arrow-up-right': '<line x1="6" y1="18" x2="18" y2="6"/><polyline points="8 6 18 6 18 16"/>',
    'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'mail': '<rect x="2" y="4" width="20" height="16"/><polyline points="2,5 12,13 22,5"/>', 'map-pin': '<path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13z"/><rect x="10" y="7" width="4" height="4"/>',
    'navigation': '<polygon points="3 11 22 2 13 21 11 13 3 11"/>', 'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'calendar': '<rect x="3" y="4" width="18" height="18"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>', 'check-circle': '<circle cx="12" cy="12" r="10"/><polyline points="7 12 11 16 17 8"/>', 'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="7" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    'info': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="11"/><line x1="12" y1="7.5" x2="12.01" y2="7.5"/>', 'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    'quote': '<path d="M3 21h7V11H6c0-3 1-5 4-6V2C5 3 3 7 3 12z"/><path d="M14 21h7V11h-4c0-3 1-5 4-6V2c-5 1-7 5-7 10z"/>',
    'menu': '<line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>', 'x': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    'chevron-down': '<polyline points="6 9 12 15 18 9"/>', 'chevron-up': '<polyline points="18 15 12 9 6 15"/>', 'chevron-left': '<polyline points="15 18 9 12 15 6"/>', 'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
    'search': '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>', 'user': '<rect x="7" y="3" width="10" height="10"/><path d="M4 21v-3h16v3"/>', 'users': '<rect x="3" y="6" width="8" height="8"/><rect x="13" y="9" width="8" height="8"/><path d="M3 21v-3h8v3M13 21v-1h8v1"/>',
    'lock': '<rect x="4" y="11" width="16" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', 'eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><rect x="10" y="10" width="4" height="4"/>',
    'eye-off': '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c7 0 11 7 11 7a18 18 0 0 1-3.2 4M6.1 6.1A18 18 0 0 0 1 12s4 7 11 7a10 10 0 0 0 4-.8"/>',
    'share': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/>',
    'facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>', 'linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><rect x="2" y="2" width="4" height="4"/>',
    'youtube': '<rect x="2" y="5" width="20" height="14"/><polygon points="10 9 16 12 10 15 10 9"/>', 'instagram': '<rect x="2" y="2" width="20" height="20"/><circle cx="12" cy="12" r="4.5"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    'message-circle': '<path d="M3 3h18v14H8l-5 4z"/>', 'activity': '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>', 'shield': '<path d="M12 22s8-4 8-10V4H4v8c0 6 8 10 8 10z"/>',
    'award': '<circle cx="12" cy="8" r="6"/><polyline points="8.2 13.9 7 22 12 19 17 22 15.8 13.9"/>', 'heart': '<path d="M12 21 3 12a5 5 0 0 1 9-5 5 5 0 0 1 9 5z"/>', 'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><rect x="11" y="11" width="2" height="2"/>',
    'building': '<rect x="4" y="2" width="16" height="20"/><path d="M9 22v-4h6v4"/><path d="M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2"/>', 'car': '<path d="M3 17h18v-5l-3-5H6l-3 5z"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/>',
    'wifi': '<path d="M5 12.5a10 10 0 0 1 14 0M1.4 9a15 15 0 0 1 21.2 0M8.5 16a5 5 0 0 1 7 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>', 'video': '<rect x="2" y="6" width="14" height="12"/><polygon points="16 10 22 6 22 18 16 14"/>',
    'wheelchair': '<circle cx="12" cy="4" r="1.5"/><path d="M12 7v6h5l3 5M8 11a5 5 0 1 0 6 7"/>', 'download': '<path d="M21 15v6H3v-6"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    'filter': '<polygon points="22 3 2 3 10 12.5 10 20 14 22 14 12.5 22 3"/>', 'tag': '<path d="M20.6 13.4 13.4 20.6a1 1 0 0 1-1.4 0L2 12V2h10l8.6 8.6a1 1 0 0 1 0 2.8z"/>',
    'book-open': '<path d="M2 3h7a3 3 0 0 1 3 3v15a2 2 0 0 0-2-2H2z"/><path d="M22 3h-7a3 3 0 0 0-3 3v15a2 2 0 0 1 2-2h8z"/>', 'play': '<polygon points="6 3 20 12 6 21 6 3"/>',
    'plus': '<line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/>', 'minus': '<line x1="4" y1="12" x2="20" y2="12"/>',
    'printer': '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H2v-8h20v8h-4"/><rect x="6" y="14" width="12" height="8"/>', 'external-link': '<path d="M18 13v8H3V6h8"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
    'file-text': '<path d="M14 2H5v20h14V7z"/><polyline points="14 2 14 7 19 7"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>', 'credit-card': '<rect x="1" y="4" width="22" height="16"/><line x1="1" y1="10" x2="23" y2="10"/>',
    'copy': '<rect x="9" y="9" width="13" height="13"/><path d="M5 15H2V2h13v3"/>', 'trending-up': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>', 'home': '<path d="M3 10 12 2l9 8v12H3z"/><rect x="9" y="14" width="6" height="8"/>',
    'log-in': '<path d="M15 3h6v18h-6"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>', 'send': '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    'sparkles': '<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>', 'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'brain': '<path d="M9 3a4 4 0 0 0-4 4 4 4 0 0 0-2 5 4 4 0 0 0 2 5 4 4 0 0 0 4 4h6a4 4 0 0 0 4-4 4 4 0 0 0 2-5 4 4 0 0 0-2-5 4 4 0 0 0-4-4z"/><line x1="12" y1="3" x2="12" y2="21"/>', 'moon': '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>', 'sun': '<circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'
  };

  function trim1(n) { return String(Math.round(n * 10) / 10).replace(/\.0$/, ''); }
  function shortBDT(n) { return n >= 100000 ? trim1(n / 100000) + ' lakh' : Number(n).toLocaleString('en-IN'); }
  var TINT = { clay: 'bg-clay-100', blush: 'bg-clay-50', sage: 'bg-sage-100', mist: 'bg-mist-300', gold: 'bg-gold-300/40' };
  var WAVE = { cream: '#FFF8F1', blush: '#FBE3D6', sage: '#E3EDE2', mist: '#E3F0F5', cocoa: '#2B1D1A', clay: '#D7693F', white: '#FFFFFF' };
  var HEROBG = { cream: 'bg-spot-cream', blush: 'bg-spot-blush', sage: 'bg-spot-sage', mist: 'bg-spot-mist' };
  var CUBE_T = ['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'];
  function dk(t) { return t === 'dark'; }

  var UI = {
    cls: {
      container: 'mx-auto w-full max-w-7xl px-5 sm:px-8',
      secCream: 'relative overflow-x-clip bg-spot-cream py-20 text-cocoa md:py-32', secBlush: 'relative overflow-x-clip bg-spot-blush py-20 text-cocoa md:py-32',
      secSage: 'relative overflow-x-clip bg-spot-sage py-20 text-cocoa md:py-32', secMist: 'relative overflow-x-clip bg-spot-mist py-20 text-cocoa md:py-32',
      secCocoa: 'relative overflow-x-clip bg-spot-cocoa py-20 text-cream md:py-32', secClay: 'relative overflow-x-clip bg-clay-grad py-20 text-white md:py-32',
      h1: 'font-display text-[clamp(2.6rem,7vw,5.75rem)] font-semibold leading-[1.02] tracking-tight', h2: 'font-display text-[clamp(2rem,4.6vw,3.7rem)] font-semibold leading-[1.06] tracking-tight', h3: 'font-display text-xl font-semibold leading-snug md:text-2xl',
      lead: 'text-lg leading-relaxed text-cocoa/75 md:text-xl',
      eyebrow: 'inline-flex items-center gap-2 rounded-full bg-cream px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-clay-700 shadow-clay',
      clay: 'rounded-[2rem] bg-cream text-cocoa shadow-clay', clayLg: 'rounded-[2.5rem] bg-cream text-cocoa shadow-clay-lg', well: 'rounded-2xl bg-cream-100 shadow-well',
      btnPrimary: 'inline-flex items-center justify-center gap-2 rounded-full bg-clay-grad px-7 py-3.5 font-semibold text-white shadow-clay-btn transition duration-300 ease-out hover:-translate-y-1 hover:brightness-105 active:translate-y-0.5 active:shadow-well focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40',
      btnSoft: 'inline-flex items-center justify-center gap-2 rounded-full bg-cream px-7 py-3.5 font-semibold text-cocoa shadow-clay transition duration-300 ease-out hover:-translate-y-1 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40',
      btnDark: 'inline-flex items-center justify-center gap-2 rounded-full bg-cocoa px-7 py-3.5 font-semibold text-cream shadow-clay-dark transition duration-300 ease-out hover:-translate-y-1 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50',
      btnGhost: 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-cocoa transition duration-300 hover:bg-cream focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40',
      iconBall: 'flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orb text-clay-700 shadow-clay',
      chip: 'rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-cocoa shadow-clay transition duration-300 hover:-translate-y-0.5 aria-pressed:bg-clay-grad aria-pressed:text-white aria-pressed:shadow-clay-btn focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40',
      tab: 'rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-cocoa shadow-clay transition duration-300 hover:-translate-y-0.5 aria-selected:bg-clay-grad aria-selected:text-white aria-selected:shadow-clay-btn focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40',
      arrowBtn: 'flex h-14 w-14 items-center justify-center rounded-full bg-cream text-cocoa shadow-clay transition duration-300 hover:-translate-y-1 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40',
      stage: '[perspective:1600px]', preserve: '[transform-style:preserve-3d]', noBack: '[backface-visibility:hidden]'
    },
    ready: function (fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); },
    qs: function (s, r) { return (r || document).querySelector(s); },
    qsa: function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    emph: function (s) { return UI.esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>'); },
    getParam: function (n) { return new URLSearchParams(window.location.search).get(n); },
    debounce: function (fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms || 200); }; },
    slugify: function (s) { return String(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); },
    pad: function (n) { return String(n).padStart(2, '0'); },
    formatBDT: function (n) { return '\u09F3' + Number(n).toLocaleString('en-IN'); },
    formatBDTRange: function (a, b) { if (a >= 100000 && b >= 100000) return '\u09F3' + trim1(a / 100000) + ' \u2013 ' + trim1(b / 100000) + ' lakh'; return '\u09F3' + shortBDT(a) + ' \u2013 ' + shortBDT(b); },
    formatDate: function (iso, style) { var d = new Date(String(iso).indexOf('T') > -1 ? iso : iso + 'T00:00:00'); return d.toLocaleDateString('en-GB', { day: 'numeric', month: style === 'short' ? 'short' : 'long', year: 'numeric' }); },
    formatTime: function (date) { return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); },
    isBDPhone: function (v) { return /^(?:\+?88)?01[3-9]\d{8}$/.test(String(v).replace(/[\s-]/g, '')); },
    icon: function (name, cls) {
      var filled = /-fill$/.test(name), base = name.replace(/-fill$/, ''), d = ICONS[base]; if (!d) return '';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="' + (cls || 'h-5 w-5') + '" fill="' + (filled ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + '</svg>';
    },
    iconNames: function () { return Object.keys(ICONS); },
    img: function (src, alt, cls, o) { o = o || {}; var w = o.w || 800, h = o.h || 600; return '<img src="' + UI.esc(src) + '" alt="' + UI.esc(alt) + '" width="' + w + '" height="' + h + '" class="' + (cls || '') + '" loading="' + (o.eager ? 'eager' : 'lazy') + '"' + (o.eager ? ' fetchpriority="high"' : '') + ' decoding="async">'; },
    deco: function (src, cls) { return '<img src="' + UI.esc(src) + '" alt="" aria-hidden="true" width="400" height="400" class="' + (cls || '') + '" loading="lazy" decoding="async">'; },
    stars: function (r, cls) { var o = '<span class="inline-flex items-center gap-0.5" role="img" aria-label="Rated ' + r + ' out of 5">'; for (var i = 1; i <= 5; i++) o += UI.icon('star-fill', (cls || 'h-4 w-4') + (i <= Math.round(r) ? ' text-gold' : ' text-cocoa/20')); return o + '</span>'; },
    badge: function (text, tone) { return '<span class="inline-flex items-center rounded-full ' + (dk(tone) ? 'bg-white/15 text-cream' : 'bg-sage-100 text-sage-700') + ' px-3 py-1 text-xs font-semibold">' + UI.esc(text) + '</span>'; },
    /* organic wave divider; colour = the colour of the NEXT section: cream|blush|sage|mist|cocoa|clay|white */
    wave: function (next) { return '<div aria-hidden="true" data-component="Wave" class="pointer-events-none -mb-px block leading-[0]"><svg viewBox="0 0 1440 90" preserveAspectRatio="none" class="block h-10 w-full md:h-20" fill="' + (WAVE[next] || WAVE.cream) + '"><path d="M0 46 C 240 96 480 6 720 42 S 1200 88 1440 34 L1440 90 L0 90 Z"/></svg></div>'; },
    eyebrow: function (text) { return '<p data-reveal="fade" class="' + UI.cls.eyebrow + '">' + UI.esc(text) + '</p>'; },
    /* o:{eyebrow,title(*highlight*),lead,tone:'light'|'dark',align:'center'|'left'} */
    sectionHead: function (o) {
      var d = dk(o.tone), c = o.align !== 'left', em = d ? '[&_em]:bg-gold-grad' : '[&_em]:bg-clay-grad';
      return '<div data-component="SectionHead" class="' + (c ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl') + '">' + (o.eyebrow ? '<div class="' + (c ? 'flex justify-center' : '') + '">' + UI.eyebrow(o.eyebrow) + '</div>' : '') +
        '<h2 data-reveal="rise" class="mt-5 ' + UI.cls.h2 + ' ' + (d ? 'text-cream' : 'text-cocoa') + ' ' + em + ' [&_em]:bg-clip-text [&_em]:not-italic [&_em]:text-transparent">' + UI.emph(o.title) + '</h2>' + (o.lead ? '<p data-reveal="rise" data-delay="120" class="mt-5 ' + UI.cls.lead + (d ? ' !text-cream/80' : '') + '">' + UI.esc(o.lead) + '</p>' : '') + '</div>';
    },
    /* Standard inner-page hero with a camera-orbit 3D scene. o:{eyebrow,title(*highlight*),lead,actionsHTML,tone:'cream|blush|sage|mist'} */
    pageHero: function (o) {
      var ob = SITE.img.objects, bg = HEROBG[o.tone || 'cream'] || HEROBG.cream;
      return '<section data-component="PageHero" data-section="page-hero" id="page-hero" class="relative overflow-x-clip ' + bg + ' pb-20 pt-36 text-cocoa md:pb-32 md:pt-44"><div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-1/2 bg-floor-grid [background-size:56px_56px] [mask-image:linear-gradient(to_top,black,transparent)]"></div>' +
        '<div aria-hidden="true" class="pointer-events-none absolute inset-0 hidden md:block ' + UI.cls.stage + '"><div data-orbit="7" class="absolute inset-0 ' + UI.cls.preserve + '">' +
        '<div class="absolute left-[6%] top-[30%] w-36 [transform:translateZ(110px)]">' + UI.deco(ob.orbSage, 'w-full motion-safe:animate-float') + '</div><div class="absolute left-[16%] bottom-[8%] w-28 [transform:translateZ(40px)]">' + UI.deco(ob.pill, 'w-full motion-safe:animate-float-slow') + '</div>' +
        '<div class="absolute right-[7%] top-[26%] w-40 [transform:translateZ(90px)]">' + UI.deco(ob.cube, 'w-full motion-safe:animate-float-slow') + '</div><div class="absolute right-[18%] bottom-[10%] w-32 [transform:translateZ(-30px)]">' + UI.deco(ob.torus, 'w-full motion-safe:animate-float') + '</div></div></div>' +
        '<div class="' + UI.cls.container + ' relative text-center">' + (o.eyebrow ? '<div class="mt-8 flex justify-center">' + UI.eyebrow(o.eyebrow) + '</div>' : '') +
        '<h1 data-reveal="rise" data-delay="100" class="mx-auto mt-6 max-w-4xl ' + UI.cls.h1 + ' [&_em]:bg-clay-grad [&_em]:bg-clip-text [&_em]:not-italic [&_em]:text-transparent">' + UI.emph(o.title) + '</h1>' +
        (o.lead ? '<p data-reveal="rise" data-delay="220" class="mx-auto mt-7 max-w-2xl ' + UI.cls.lead + '">' + UI.esc(o.lead) + '</p>' : '') + (o.actionsHTML ? '<div data-reveal="rise" data-delay="320" class="mt-10 flex flex-wrap justify-center gap-4">' + o.actionsHTML + '</div>' : '') + '</div></section>';
    },
    /* inflated 3D stat ball. o:{value,suffix,label,color:'clay|sage|gold',delay,decimals} */
    statOrb: function (o) {
      var bg = { clay: 'bg-orb', sage: 'bg-orb-sage', gold: 'bg-orb-gold' }[o.color || 'clay'];
      return '<div data-component="StatOrb" data-reveal="pop" data-delay="' + (o.delay || 0) + '" class="text-center"><div class="relative mx-auto flex aspect-square w-40 items-center justify-center rounded-full ' + bg + ' shadow-clay-lg motion-safe:animate-float sm:w-44"><span class="font-display text-3xl font-semibold text-cocoa sm:text-4xl"><span data-counter="' + o.value + '"' + (o.suffix ? ' data-suffix="' + UI.esc(o.suffix) + '"' : '') + (o.decimals ? ' data-decimals="' + o.decimals + '"' : '') + '>' + o.value + '</span></span></div><div aria-hidden="true" class="mx-auto mt-5 h-3 w-28 rounded-full bg-cocoa/25 blur-md"></div><p class="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-cocoa/70">' + UI.esc(o.label) + '</p></div>';
    },
    /* Pop-out service card: the clay object breaks out of the card. */
    serviceCard: function (s, o) {
      o = o || {};
      return '<article data-component="ServiceCard" data-category="' + UI.esc(s.category) + '" class="group relative pt-24"><a href="' + SITE.url.service(s.slug) + '" data-light class="relative flex h-full flex-col rounded-[2rem] bg-cream pb-7 pt-32 text-cocoa shadow-clay transition duration-500 ease-out hover:-translate-y-2 hover:shadow-clay-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40">' +
        '<span aria-hidden="true" class="absolute inset-x-5 top-5 h-28 rounded-[1.5rem] ' + (TINT[s.accent] || TINT.clay) + '"></span>' +
        UI.img(s.image, s.name, 'pointer-events-none absolute -top-24 left-1/2 w-52 -translate-x-1/2 drop-shadow-[0_18px_18px_rgba(43,29,26,.25)] transition duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-105', { w: 600, h: 600 }) +
        '<div class="flex flex-1 flex-col px-7"><div class="flex items-center justify-between gap-3">' + UI.badge(s.category) + '<span class="' + UI.cls.iconBall + ' !h-10 !w-10">' + UI.icon(s.icon, 'h-5 w-5') + '</span></div><h3 class="mt-4 ' + UI.cls.h3 + '">' + UI.esc(s.name) + '</h3><p class="mt-3 text-sm leading-relaxed text-cocoa/75">' + UI.esc(s.short) + '</p>' +
        '<div class="mt-auto flex items-end justify-between gap-3 pt-6"><p class="text-sm font-semibold text-cocoa">' + UI.formatBDTRange(s.priceFrom, s.priceTo) + '<span class="block text-xs font-normal text-cocoa/60">' + UI.esc(s.priceUnit) + '</span></p><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clay-grad text-white shadow-clay-btn transition duration-300 group-hover:translate-x-1">' + UI.icon('arrow-right', 'h-5 w-5') + '</span></div></div></a></article>';
    },
    chamberCard: function (c) {
      return '<article data-component="ChamberCard" class="group h-full"><div data-light class="flex h-full flex-col rounded-[2rem] bg-cream p-4 text-cocoa shadow-clay transition duration-500 ease-out hover:-translate-y-2 hover:shadow-clay-lg"><div class="overflow-hidden rounded-[1.5rem] bg-clay-50">' + UI.img(c.image, c.name + ' building', 'aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105', { w: 800, h: 600 }) + '</div>' +
        '<div class="flex flex-1 flex-col px-3 pb-3 pt-5"><div class="flex flex-wrap items-center gap-2">' + UI.badge(c.area + ', ' + c.city) + '</div><h3 class="mt-3 ' + UI.cls.h3 + '">' + UI.esc(c.name) + '</h3><ul class="mt-4 space-y-2 text-sm text-cocoa/80"><li class="flex gap-2">' + UI.icon('map-pin', 'mt-0.5 h-4 w-4 shrink-0 text-clay-600') + '<span>' + UI.esc(c.address) + '</span></li>' +
        c.schedule.map(function (s) { return '<li class="flex gap-2">' + UI.icon('clock', 'mt-0.5 h-4 w-4 shrink-0 text-clay-600') + '<span><b class="text-cocoa">' + UI.esc(s.label) + '</b> \u00B7 ' + UI.esc(s.hours) + '</span></li>'; }).join('') + '<li class="flex gap-2">' + UI.icon('credit-card', 'mt-0.5 h-4 w-4 shrink-0 text-clay-600') + '<span>First visit ' + UI.formatBDT(c.fee.firstVisit) + ' \u00B7 Follow-up ' + UI.formatBDT(c.fee.followUp) + '</span></li></ul>' +
        '<div class="mt-auto flex flex-wrap gap-3 pt-6"><a href="' + SITE.url.appointment({ chamber: c.slug }) + '" class="' + UI.cls.btnPrimary + ' !px-5 !py-2.5 text-sm">Book here' + UI.icon('arrow-right', 'h-4 w-4') + '</a><a href="' + SITE.url.chamber(c.slug) + '" class="' + UI.cls.btnGhost + ' !py-2.5 text-sm">Details</a></div></div></div></article>';
    },
    postCard: function (p) {
      return '<article data-component="PostCard" class="group h-full"><a href="' + SITE.url.blog(p.slug) + '" data-light class="flex h-full flex-col rounded-[2rem] bg-cream p-4 text-cocoa shadow-clay transition duration-500 ease-out hover:-translate-y-2 hover:shadow-clay-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40"><div class="overflow-hidden rounded-[1.5rem] bg-clay-50">' + UI.img(p.image, p.title, 'aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105', { w: 800, h: 500 }) + '</div>' +
        '<div class="flex flex-1 flex-col px-3 pb-3 pt-5"><div class="flex flex-wrap items-center gap-3">' + UI.badge(p.category) + '<span class="text-xs text-cocoa/60">' + UI.formatDate(p.date, 'short') + ' \u00B7 ' + p.readMinutes + ' min read</span></div><h3 class="mt-3 ' + UI.cls.h3 + '">' + UI.esc(p.title) + '</h3><p class="mt-3 text-sm leading-relaxed text-cocoa/75">' + UI.esc(p.excerpt) + '</p><p class="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-clay-700">Read article' + UI.icon('arrow-right', 'h-4 w-4 transition group-hover:translate-x-1') + '</p></div></a></article>';
    },
    testimonialCard: function (x) {
      var s = SITE.getService(x.serviceSlug);
      return '<figure data-component="TestimonialCard" class="relative flex h-full flex-col rounded-[2rem] bg-cream p-7 text-cocoa shadow-clay-lg"><span aria-hidden="true" class="absolute -top-5 left-7 flex h-12 w-12 items-center justify-center rounded-full bg-orb-gold shadow-clay font-display text-3xl font-semibold text-cocoa">\u201C</span>' +
        '<div class="mt-4">' + UI.stars(x.rating) + '</div><blockquote class="mt-4 text-base leading-relaxed text-cocoa/85">' + UI.esc(x.quote) + '</blockquote><figcaption class="mt-auto flex items-center gap-3 pt-6"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orb-sage font-display text-lg font-semibold text-cocoa shadow-clay">' + UI.esc(x.name.charAt(0)) + '</span><span class="min-w-0"><span class="block font-semibold">' + UI.esc(x.name) + ', ' + x.age + '</span><span class="block truncate text-sm text-cocoa/65">' + UI.esc(x.area) + (s ? ' \u00B7 ' + UI.esc(s.name) : '') + '</span></span></figcaption></figure>';
    },
    faqItem: function (o) {
      var id = UI.esc(o.id), open = !!o.open;
      return '<div data-component="FaqItem" data-accordion-item class="rounded-[1.75rem] ' + (dk(o.tone) ? 'bg-cocoa-800 text-cream shadow-clay-dark' : 'bg-cream text-cocoa shadow-clay') + '"><h3><button type="button" id="acc-btn-' + id + '" data-accordion-trigger aria-expanded="' + open + '" aria-controls="acc-panel-' + id + '" class="flex w-full items-center justify-between gap-4 rounded-[1.75rem] px-6 py-5 text-left font-display text-lg font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40"><span>' + UI.esc(o.question) + '</span><span data-accordion-icon class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orb text-clay-700 shadow-clay transition-transform duration-300' + (open ? ' rotate-45' : '') + '">' + UI.icon('plus', 'h-4 w-4') + '</span></button></h3>' +
        '<div id="acc-panel-' + id + '" role="region" aria-labelledby="acc-btn-' + id + '" data-accordion-panel' + (open ? '' : ' inert') + ' class="grid transition-[grid-template-rows] duration-300 ' + (open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]') + '"><div class="overflow-hidden"><div class="px-6 pb-6 leading-relaxed ' + (dk(o.tone) ? 'text-cream/80' : 'text-cocoa/80') + '">' + o.answerHTML + '</div></div></div></div>';
    },
    /* complete dark-clay CTA section with a 3D scene. o:{title(*highlight*),lead,primaryLabel,primaryHref,secondaryLabel,secondaryHref} */
    ctaBand: function (o) {
      var ob = SITE.img.objects;
      return '<section data-component="CtaBand" data-section="cta" id="cta" class="relative overflow-x-clip bg-spot-cocoa py-20 text-cream md:py-32"><div aria-hidden="true" class="pointer-events-none absolute inset-0 hidden md:block ' + UI.cls.stage + '"><div data-orbit="9" class="absolute inset-0 ' + UI.cls.preserve + '"><div class="absolute left-[8%] top-[18%] w-36 [transform:translateZ(100px)]">' + UI.deco(ob.orbClay, 'w-full motion-safe:animate-float') + '</div><div class="absolute right-[9%] top-[22%] w-32 [transform:translateZ(60px)]">' + UI.deco(ob.fork, 'w-full motion-safe:animate-float-slow') + '</div><div class="absolute right-[20%] bottom-[8%] w-28 [transform:translateZ(-20px)]">' + UI.deco(ob.orbGold, 'w-full motion-safe:animate-float') + '</div><div class="absolute left-[20%] bottom-[10%] w-24 [transform:translateZ(30px)]">' + UI.deco(ob.waves, 'w-full') + '</div></div></div>' +
        '<div class="' + UI.cls.container + ' relative text-center"><h2 data-reveal="rise" class="mx-auto max-w-3xl ' + UI.cls.h1 + ' [&_em]:bg-gold-grad [&_em]:bg-clip-text [&_em]:not-italic [&_em]:text-transparent">' + UI.emph(o.title) + '</h2><p data-reveal="rise" data-delay="120" class="mx-auto mt-6 max-w-xl text-lg text-cream/80">' + UI.esc(o.lead) + '</p><div data-reveal="rise" data-delay="220" class="mt-10 flex flex-wrap justify-center gap-4"><a href="' + (o.primaryHref || SITE.routes.appointment) + '" class="' + UI.cls.btnPrimary + '">' + UI.esc(o.primaryLabel || 'Book Appointment') + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="' + (o.secondaryHref || 'tel:' + SITE.contact.phone.e164) + '" class="' + UI.cls.btnSoft + '">' + UI.icon('phone', 'h-5 w-5') + UI.esc(o.secondaryLabel || SITE.contact.phone.display) + '</a></div></div></section>';
    },
    marquee: function (items) { var row = items.map(function (i) { return '<li class="flex items-center gap-4 whitespace-nowrap px-4"><span class="font-display text-2xl font-semibold text-cocoa/80 md:text-4xl">' + UI.esc(i) + '</span><span class="h-3 w-3 rounded-full bg-orb shadow-clay"></span></li>'; }).join(''); return '<div data-component="Marquee" aria-hidden="true" class="overflow-hidden py-5"><ul class="flex w-max motion-safe:animate-marquee">' + row + row + '</ul></div>'; },
    /* 6-face drag-to-rotate 3D cube. items: exactly 6 {icon,title,text}. */
    cube: function (items) {
      var n = items.slice(0, 6), faces = n.map(function (it, i) { return '<div aria-hidden="true" class="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[2rem] bg-cream p-6 text-center text-cocoa shadow-clay-lg ' + UI.cls.noBack + ' [transform:' + CUBE_T[i] + '_translateZ(110px)] sm:[transform:' + CUBE_T[i] + '_translateZ(140px)]"><span class="' + UI.cls.iconBall + '">' + UI.icon(it.icon, 'h-6 w-6') + '</span><span class="font-display text-lg font-semibold sm:text-xl">' + UI.esc(it.title) + '</span><span class="text-xs leading-relaxed text-cocoa/75 sm:text-sm">' + UI.esc(it.text) + '</span></div>'; }).join('');
      return '<div data-component="Cube" data-cube-root class="flex flex-col items-center gap-10"><div class="h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] ' + UI.cls.stage + ' cursor-grab active:cursor-grabbing"><div data-drag3d data-spin role="group" aria-label="Interactive cube. Drag or use the arrow keys to turn it." class="relative h-full w-full ' + UI.cls.preserve + ' focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40">' + faces + '</div></div>' +
        '<div aria-hidden="true" class="h-3 w-48 rounded-full bg-cocoa/25 blur-md"></div><div class="flex items-center gap-5"><button type="button" data-cube-prev aria-label="Previous face" class="' + UI.cls.arrowBtn + '">' + UI.icon('arrow-left') + '</button><div data-cube-dots class="flex items-center gap-2"></div><button type="button" data-cube-next aria-label="Next face" class="' + UI.cls.arrowBtn + '">' + UI.icon('arrow-right') + '</button></div>' +
        '<ul class="sr-only">' + n.map(function (it) { return '<li>' + UI.esc(it.title) + ': ' + UI.esc(it.text) + '</li>'; }).join('') + '</ul></div>';
    },
    /* cylinder (3D ring) carousel. cards = array of HTML strings. o:{itemWidth:'w-[280px] sm:w-[340px]', autoplay:6000} */
    ring: function (cards, o) {
      o = o || {}; var w = o.itemWidth || 'w-[280px] sm:w-[340px]';
      return '<div data-component="Ring" data-ring' + (o.autoplay ? ' data-autoplay="' + o.autoplay + '"' : '') + ' class="relative" role="region" aria-roledescription="carousel" aria-label="' + UI.esc(o.label || 'Carousel') + '"><div class="pt-8 ' + 'sm:pt-10 ' + '[perspective:1800px]"><div data-ring-stage class="relative mx-auto ' + w + ' ' + UI.cls.preserve + ' transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]">' + cards.map(function (c) { return '<div data-ring-item class="absolute left-1/2 top-0 ' + w + ' ' + UI.cls.noBack + '">' + c + '</div>'; }).join('') + '</div></div>' +
        '<div class="mt-8 flex items-center justify-center gap-5"><button type="button" data-ring-prev aria-label="Previous" class="' + UI.cls.arrowBtn + '">' + UI.icon('arrow-left') + '</button><div data-ring-dots class="flex items-center gap-2"></div><button type="button" data-ring-next aria-label="Next" class="' + UI.cls.arrowBtn + '">' + UI.icon('arrow-right') + '</button></div></div>';
    },
    /* Exploded 3D ear-anatomy model; scroll explodes the layers (data-explode). Place inside a container with room (≥ 420px wide). */
    earModel: function () {
      var L = SITE.img.layers, names = [['floor', 'Base plate'], ['outer', 'Outer ear'], ['canal', 'Ear canal'], ['drum', 'Eardrum'], ['ossicles', 'Middle-ear bones'], ['cochlea', 'Cochlea']];
      return '<div data-component="EarModel" class="' + UI.cls.stage + ' mx-auto w-[min(92vw,540px)]" role="img" aria-label="Exploded 3D model of the ear: outer ear, ear canal, eardrum, middle-ear bones and cochlea"><div data-explode class="relative aspect-square w-full ' + UI.cls.preserve + ' [transform:rotateX(calc(64deg_-_var(--x,0)*12deg))_rotateZ(calc(-26deg_+_var(--n,0)*-16deg))] transition-transform duration-300 ease-out">' +
        names.map(function (nm) { return '<div data-layer class="absolute inset-0 ' + UI.cls.preserve + ' [transform:translateZ(calc(var(--i,0)*var(--x,0)*78px_+_var(--i,0)*6px))]">' + UI.deco(L[nm[0]], 'h-full w-full') + '</div>'; }).join('') + '</div></div>';
    },
    field: function (o) {
      var id = 'f-' + o.name, type = o.type || 'text', d = dk(o.tone);
      var base = 'w-full rounded-2xl bg-cream-100 px-5 py-3.5 text-cocoa shadow-well placeholder:text-cocoa/40 transition focus:bg-white focus:outline-none focus:ring-4 focus:ring-clay/30 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-danger/40';
      var attrs = ' id="' + id + '" name="' + o.name + '"' + (o.required ? ' required' : '') + (o.minlength ? ' minlength="' + o.minlength + '"' : '') + (o.validate ? ' data-validate="' + o.validate + '"' : '') + (o.autocomplete ? ' autocomplete="' + o.autocomplete + '"' : '') + (o.placeholder ? ' placeholder="' + UI.esc(o.placeholder) + '"' : '') + ' aria-describedby="err-' + o.name + '"', ctl;
      if (type === 'select') ctl = '<div class="relative"><select' + attrs + ' class="' + base + ' appearance-none pr-12"><option value="">' + UI.esc(o.placeholder || 'Select\u2026') + '</option>' + (o.options || []).map(function (x) { var v = typeof x === 'string' ? x : x.value, l = typeof x === 'string' ? x : x.label; return '<option value="' + UI.esc(v) + '"' + (o.value === v ? ' selected' : '') + '>' + UI.esc(l) + '</option>'; }).join('') + '</select><span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-clay-700">' + UI.icon('chevron-down', 'h-5 w-5') + '</span></div>';
      else if (type === 'textarea') ctl = '<textarea' + attrs + ' rows="' + (o.rows || 5) + '" class="' + base + '">' + UI.esc(o.value || '') + '</textarea>';
      else if (type === 'checkbox') return '<div data-component="Field"><label class="flex cursor-pointer items-start gap-3 text-sm ' + (d ? 'text-cream' : 'text-cocoa/80') + '"><input type="checkbox"' + attrs + ' class="mt-0.5 h-6 w-6 shrink-0 accent-clay"><span>' + o.labelHTML + '</span></label><p id="err-' + o.name + '" data-error-for="' + o.name + '" class="mt-1 hidden text-sm font-semibold text-danger"></p></div>';
      else ctl = '<input type="' + type + '"' + attrs + (o.value ? ' value="' + UI.esc(o.value) + '"' : '') + (o.min ? ' min="' + o.min + '"' : '') + (o.max ? ' max="' + o.max + '"' : '') + ' class="' + base + '">';
      return '<div data-component="Field"><label for="' + id + '" class="mb-2 block text-sm font-semibold ' + (d ? 'text-cream' : 'text-cocoa') + '">' + UI.esc(o.label) + (o.required ? ' <span class="text-clay-600" aria-hidden="true">*</span>' : '') + '</label>' + ctl + (o.hint ? '<p class="mt-1 text-xs ' + (d ? 'text-cream/70' : 'text-cocoa/60') + '">' + UI.esc(o.hint) + '</p>' : '') + '<p id="err-' + o.name + '" data-error-for="' + o.name + '" class="mt-1 hidden text-sm font-semibold ' + (d ? 'text-clay-200' : 'text-danger') + '"></p></div>';
    },
    validateForm: function (form) {
      var ok = true, first = null;
      Array.prototype.forEach.call(form.querySelectorAll('[name]'), function (f) {
        if (f.disabled || f.type === 'hidden' || f.type === 'submit' || f.type === 'button') return;
        var m = form.querySelector('[data-error-for="' + f.name + '"]'), msg = '';
        var empty = f.type === 'checkbox' ? !f.checked : f.type === 'radio' ? !form.querySelector('[name="' + f.name + '"]:checked') : !String(f.value).trim();
        if (f.required && empty) msg = f.type === 'checkbox' ? 'Please tick this box to continue.' : 'This field is required.';
        else if (f.type === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) msg = 'Enter a valid email address.';
        else if (f.getAttribute('data-validate') === 'bd-phone' && f.value && !UI.isBDPhone(f.value)) msg = 'Enter a valid Bangladeshi mobile number, e.g. 01712-345678.';
        else if (f.minLength > 0 && f.value && f.value.length < f.minLength) msg = 'Please enter at least ' + f.minLength + ' characters.';
        f.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (m) { m.textContent = msg; m.classList.toggle('hidden', !msg); }
        if (msg) { ok = false; if (!first) first = f; }
      });
      if (first) first.focus(); return ok;
    },
    toast: function (message, type) {
      type = type || 'success'; var root = document.getElementById('toast-root');
      if (!root) { root = document.createElement('div'); root.id = 'toast-root'; root.setAttribute('role', 'status'); root.setAttribute('aria-live', 'polite'); root.className = 'pointer-events-none fixed inset-x-0 top-24 z-[80] flex flex-col items-center gap-3 px-4'; document.body.appendChild(root); }
      var el = document.createElement('div'); el.className = 'pointer-events-auto flex max-w-md items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold shadow-clay-dark motion-safe:animate-pop ' + (type === 'error' ? 'bg-danger text-white' : 'bg-cocoa text-cream');
      el.innerHTML = UI.icon(type === 'error' ? 'alert-circle' : 'check-circle', 'h-5 w-5 shrink-0') + '<span>' + UI.esc(message) + '</span>'; root.appendChild(el);
      setTimeout(function () { el.remove(); }, 4200);
    },
    copy: function (text) { var done = function () { UI.toast('Copied to clipboard'); }; if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(done); var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ } ta.remove(); return Promise.resolve(); },
    scrollLock: function (on) { document.documentElement.classList.toggle('overflow-hidden', !!on); },
    trapFocus: function (c) {
      var sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
      function k(e) { if (e.key !== 'Tab') return; var f = c.querySelectorAll(sel); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
      c.addEventListener('keydown', k); return function () { c.removeEventListener('keydown', k); };
    },
    accordion: function (root) {
      if (!root || root.hasAttribute('data-accordion-bound')) return; root.setAttribute('data-accordion-bound', '');
      function set(btn, open) { var p = document.getElementById(btn.getAttribute('aria-controls')); if (!p) return; btn.setAttribute('aria-expanded', String(open)); p.classList.toggle('grid-rows-[1fr]', open); p.classList.toggle('grid-rows-[0fr]', !open); if (open) p.removeAttribute('inert'); else p.setAttribute('inert', ''); var ic = btn.querySelector('[data-accordion-icon]'); if (ic) ic.classList.toggle('rotate-45', open); }
      root.addEventListener('click', function (e) { var b = e.target.closest('[data-accordion-trigger]'); if (!b || !root.contains(b)) return; var will = b.getAttribute('aria-expanded') !== 'true'; if (root.hasAttribute('data-accordion-single')) UI.qsa('[data-accordion-trigger][aria-expanded="true"]', root).forEach(function (x) { if (x !== b) set(x, false); }); set(b, will); });
    },
    tabs: function (root) {
      if (!root || root.hasAttribute('data-tabs-bound')) return; root.setAttribute('data-tabs-bound', '');
      var tabs = UI.qsa('[data-tab]', root), panels = UI.qsa('[data-tab-panel]', root);
      function show(id, focus) { tabs.forEach(function (t) { var on = t.getAttribute('data-tab') === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); }); panels.forEach(function (p) { var on = p.getAttribute('data-tab-panel') === id; p.classList.toggle('hidden', !on); if (on) { p.classList.remove('motion-safe:animate-fade'); void p.offsetWidth; p.classList.add('motion-safe:animate-fade'); } }); root.dispatchEvent(new CustomEvent('tabchange', { detail: { id: id } })); }
      tabs.forEach(function (t, i) { t.addEventListener('click', function () { show(t.getAttribute('data-tab')); }); t.addEventListener('keydown', function (e) { var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null; if (n === null) return; e.preventDefault(); n = (n + tabs.length) % tabs.length; show(tabs[n].getAttribute('data-tab'), true); }); });
      var init = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]; if (init) show(init.getAttribute('data-tab'));
      root.showTab = show;
    },
    carousel: function (root) {
      if (!root || root.hasAttribute('data-carousel-bound')) return; root.setAttribute('data-carousel-bound', '');
      var track = root.querySelector('[data-carousel-track]'), slides = UI.qsa('[data-carousel-slide]', root), dots = root.querySelector('[data-carousel-dots]'), idx = 0, timer = null;
      if (!track || !slides.length) return;
      function go(i) { idx = (i + slides.length) % slides.length; track.scrollTo({ left: slides[idx].offsetLeft - track.offsetLeft, behavior: window.FX && FX.reduced() ? 'auto' : 'smooth' }); mark(); }
      function mark() { if (dots) UI.qsa('button', dots).forEach(function (b, i) { b.setAttribute('aria-current', i === idx ? 'true' : 'false'); b.classList.toggle('bg-clay', i === idx); b.classList.toggle('bg-cocoa/25', i !== idx); }); }
      if (dots) { dots.innerHTML = slides.map(function (_, i) { return '<button type="button" aria-label="Go to slide ' + (i + 1) + '" class="h-3 w-3 rounded-full bg-cocoa/25 shadow-well"></button>'; }).join(''); UI.qsa('button', dots).forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); }); }
      var p = root.querySelector('[data-carousel-prev]'), n = root.querySelector('[data-carousel-next]'); if (p) p.addEventListener('click', function () { go(idx - 1); }); if (n) n.addEventListener('click', function () { go(idx + 1); });
      track.addEventListener('scroll', UI.debounce(function () { var best = 0, d = 1e9; slides.forEach(function (s, i) { var x = Math.abs(s.offsetLeft - track.offsetLeft - track.scrollLeft); if (x < d) { d = x; best = i; } }); idx = best; mark(); }, 80), { passive: true });
      root.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1); });
      var ms = parseInt(root.getAttribute('data-autoplay') || '0', 10);
      if (ms && !(window.FX && FX.reduced())) { var start = function () { stop(); timer = setInterval(function () { go(idx + 1); }, ms); }, stop = function () { clearInterval(timer); }; root.addEventListener('pointerenter', stop); root.addEventListener('pointerleave', start); root.addEventListener('focusin', stop); root.addEventListener('focusout', start); start(); }
      mark();
    },
    mount: function (container) {
      var c = container || document;
      if (window.FX) FX.init(c);
      UI.qsa('[data-accordion]', c).forEach(UI.accordion); UI.qsa('[data-tabs]', c).forEach(UI.tabs); UI.qsa('[data-carousel]', c).forEach(UI.carousel);
      if (c !== document && c.matches) { if (c.matches('[data-accordion]')) UI.accordion(c); if (c.matches('[data-tabs]')) UI.tabs(c); if (c.matches('[data-carousel]')) UI.carousel(c); }
    }
  };
  window.UI = UI;
  UI.ready(function () { UI.mount(document); });
})(window, document);
