/*
 * js/pages/chambers.js — Chambers page script
 * Path: js/pages/chambers.js · Owner: Part 4 · Purpose: renders overview, weekly matrix, three chamber sections, comparison, checklist, cube and CTA
 * Depends on: SITE, UI, window.CHAMBERS (js/data/chambers.js) · Exposes: nothing
 */
(function () {
  'use strict';
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], ORDER = [6, 0, 1, 2, 3, 4, 5];
  var SCENES = [['orbSage', 'pill'], ['orbGold', 'torus'], ['orbClay', 'cone']], BGS = ['secSage', 'secCream', 'secMist'];
  var JOINT = { cream: 'bg-cream-100', blush: 'bg-clay-200', sage: 'bg-sage-200', mist: 'bg-mist', cocoa: 'bg-cocoa' };
  var BRING = ['Your previous ear, nose or throat reports and prescriptions', 'Hearing tests (audiograms), CT or MRI scans and X-ray films, on disc or on your phone', 'All current medicines, in their strips or boxes', 'A list of allergies and long-term conditions such as diabetes or high blood pressure', 'A parent or family member if the patient is a child or an older adult', 'Your national ID card, or the child’s birth certificate, for the file', 'Your hearing aid, with its charger or spare batteries, if you use one', 'Your questions, written down so that nothing is forgotten in the room'];
  var chambers = SITE.chambersIndex.map(function (ci) { var d = (window.CHAMBERS || []).filter(function (x) { return x.slug === ci.slug; })[0] || {}; return Object.assign({}, ci, d); });

  function mins(t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function joint(prev, next) { return '<div aria-hidden="true" class="' + JOINT[prev] + '">' + UI.wave(next) + '</div>'; }
  function status(c) {
    var now = new Date(), m = now.getHours() * 60 + now.getMinutes(), open = null;
    c.schedule.forEach(function (s) { if (s.days.indexOf(now.getDay()) > -1 && m >= mins(s.start) && m < mins(s.end)) open = s; });
    if (open) { var e = open.end.split(':'); return { open: true, text: 'Open now · until ' + UI.formatTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(e[0]), Number(e[1]))) }; }
    var n = SITE.nextOpening(c.slug);
    return n ? { open: false, text: 'Closed now · Next: ' + (n.isToday ? 'today' : DAYS[n.startAt.getDay()].slice(0, 3)) + ' ' + UI.formatTime(n.startAt) } : { open: false, text: 'Closed now' };
  }
  function pill(c) {
    var s = status(c);
    return '<span class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-clay ' + (s.open ? 'bg-sage-100 text-sage-700' : 'bg-cream text-cocoa/75') + '"><span aria-hidden="true" class="h-2.5 w-2.5 rounded-full ' + (s.open ? 'bg-sage motion-safe:animate-breathe' : 'bg-gold') + '"></span>' + UI.esc(s.text) + '</span>';
  }
  function statusBox(c) { return '<div data-open-status="' + c.slug + '">' + pill(c) + '</div>'; }
  function hoursOn(c, d) { return c.schedule.filter(function (s) { return s.days.indexOf(d) > -1; }).map(function (s) { return s.hours; }).join(' and '); }
  function refresh() {
    chambers.forEach(function (c) { UI.qsa('[data-open-status="' + c.slug + '"]').forEach(function (el) { el.innerHTML = pill(c); }); });
    var today = new Date().getDay();
    UI.qsa('[data-day]').forEach(function (el) { var on = Number(el.getAttribute('data-day')) === today; el.classList.toggle('bg-clay-100', on); if (on) el.setAttribute('aria-current', 'date'); else el.removeAttribute('aria-current'); });
  }
  function tableCard(inner) { return '<div class="' + UI.cls.clayLg + ' mt-14 overflow-x-auto" tabindex="0" role="region" aria-label="Scrollable table">' + inner + '</div>'; }
  function section(id, bgKey, inner, label) { return '<section id="' + id + '" data-section="' + id + '" data-component="' + label + '" class="' + UI.cls[bgKey] + '"><div class="' + UI.cls.container + '">' + inner + '</div></section>'; }

  /* 1 overview */
  function overview() {
    return section('overview', 'secCream', UI.sectionHead({ eyebrow: 'Three chambers', title: 'Two in Sylhet, *one in Dhaka*', lead: 'Each chamber lists today’s status, its weekly sessions and its fees. Choose the one that is closest to you, or the one that opens soonest.' }) +
      '<div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">' + chambers.map(function (c, i) { return '<div data-reveal="pop" data-delay="' + i * 100 + '" class="flex h-full flex-col gap-5"><div>' + statusBox(c) + '</div><div class="flex-1">' + UI.chamberCard(c) + '</div></div>'; }).join('') + '</div>' +
      '<p class="mx-auto mt-12 max-w-2xl text-center text-sm text-cocoa/70">Every other day is closed, and Friday is off except the Uttara morning session. Surgeries are performed on Sunday to Wednesday mornings at Surma Valley Specialized Hospital in Sylhet.</p>', 'ChamberOverview');
  }
  /* 2 weekly matrix */
  function matrix() {
    var head = '<tr><th scope="col" class="px-5 py-4 text-left font-display text-base">Chamber</th>' + ORDER.map(function (d) { return '<th scope="col" data-day="' + d + '" class="px-4 py-4 text-center font-display text-base">' + DAYS[d].slice(0, 3) + '</th>'; }).join('') + '</tr>';
    var rows = chambers.map(function (c) {
      return '<tr class="border-t border-cocoa/10"><th scope="row" class="px-5 py-5 text-left font-semibold">' + UI.esc(c.area) + '<span class="block text-xs font-normal text-cocoa/65">' + UI.esc(c.city) + '</span></th>' + ORDER.map(function (d) {
        var h = hoursOn(c, d); return '<td data-day="' + d + '" class="px-3 py-5 text-center text-sm ' + (h ? 'font-semibold text-cocoa' : 'text-cocoa/50') + '">' + (h ? UI.esc(h).replace(' – ', '<br>to ') : 'Closed') + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return section('weekly', 'secBlush', UI.sectionHead({ eyebrow: 'Weekly sessions', title: 'Find *your day* at a glance', lead: 'Saturday to Friday. Today’s column is highlighted, and every slot lasts twenty minutes.' }) +
      tableCard('<table class="w-full min-w-[860px] border-collapse"><caption class="sr-only">Weekly chamber hours, Saturday to Friday</caption><thead>' + head + '</thead><tbody>' + rows + '</tbody></table>'), 'WeeklyMatrix');
  }
  /* 3 detail sections */
  function detail(c, i) {
    var ob = SITE.img.objects, sc = SCENES[i % SCENES.length], bg = BGS[i % BGS.length], tel = 'tel:' + c.phone.e164;
    var dir = 'https://www.google.com/maps/dir/?api=1&destination=' + c.lat + ',' + c.lng, wa = SITE.contact.whatsappUrl + '?text=' + encodeURIComponent('Hello, I would like to ask about the ' + c.chamberName + '.');
    var scene = '<div class="relative mx-auto w-full max-w-xl ' + UI.cls.stage + '"><div data-orbit="6" class="relative ' + UI.cls.preserve + '"><div class="' + UI.cls.clayLg + ' p-4 [transform:translateZ(20px)]">' + UI.img(c.image, c.name + ' building in ' + c.area + ', ' + c.city, 'aspect-[4/3] w-full rounded-[2rem] object-cover', { w: 800, h: 600 }) + '</div>' +
      '<div aria-hidden="true" class="absolute -right-3 -top-10 w-24 [transform:translateZ(110px)] sm:w-28">' + UI.deco(ob[sc[0]], 'w-full motion-safe:animate-float') + '</div><div aria-hidden="true" class="absolute -bottom-6 -left-3 w-20 [transform:translateZ(70px)] sm:w-24">' + UI.deco(ob[sc[1]], 'w-full motion-safe:animate-float-slow') + '</div></div>' +
      '<div aria-hidden="true" class="mx-auto -mt-1 h-7 w-[86%] rounded-full bg-cream-200 shadow-plinth"></div><div aria-hidden="true" class="mx-auto mt-2 h-3 w-2/3 rounded-full bg-cocoa/25 blur-md"></div></div>';
    var info = '<div class="' + UI.cls.clay + ' p-7 sm:p-9">' + c.about.map(function (p) { return '<p class="mb-4 leading-relaxed text-cocoa/80">' + UI.esc(p) + '</p>'; }).join('') + '<ul class="mt-6 space-y-3 text-cocoa/85">' +
      '<li class="flex gap-3">' + UI.icon('map-pin', 'mt-0.5 h-5 w-5 shrink-0 text-clay-600') + '<span class="break-words">' + UI.esc(c.address) + '</span></li>' +
      '<li class="flex gap-3">' + UI.icon('phone', 'mt-0.5 h-5 w-5 shrink-0 text-clay-600') + '<a class="font-semibold underline-offset-4 hover:underline" href="' + tel + '">' + UI.esc(c.phone.display) + '</a></li>' +
      c.schedule.map(function (s) { return '<li class="flex gap-3">' + UI.icon('clock', 'mt-0.5 h-5 w-5 shrink-0 text-clay-600') + '<span><b>' + UI.esc(s.label) + '</b> · ' + UI.esc(s.hours) + '</span></li>'; }).join('') +
      '<li class="flex gap-3">' + UI.icon('credit-card', 'mt-0.5 h-5 w-5 shrink-0 text-clay-600') + '<span>First visit ' + UI.formatBDT(c.fee.firstVisit) + ' · Follow-up ' + UI.formatBDT(c.fee.followUp) + ' · ' + c.slotMinutes + '-minute slots</span></li></ul><div class="mt-6">' + statusBox(c) + '</div></div>';
    var btns = '<div class="mt-8 flex flex-wrap gap-3"><a href="' + SITE.url.appointment({ chamber: c.slug }) + '" class="' + UI.cls.btnPrimary + '">Book here' + UI.icon('arrow-right', 'h-5 w-5') + '</a>' +
      '<a href="' + dir + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnSoft + '">' + UI.icon('navigation', 'h-5 w-5') + 'Get directions</a><a href="' + tel + '" class="' + UI.cls.btnSoft + '">' + UI.icon('phone', 'h-5 w-5') + 'Call</a>' +
      '<a href="' + wa + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnSoft + '">' + UI.icon('message-circle', 'h-5 w-5') + 'WhatsApp</a></div>';
    var facilities = '<h3 class="mt-20 text-center ' + UI.cls.h3 + '">What you will find here</h3><ul class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">' + c.facilities.map(function (f, k) {
      return '<li data-reveal="rise" data-delay="' + (k % 3) * 80 + '" data-light class="flex gap-4 rounded-[1.75rem] bg-cream p-5 shadow-clay"><span class="' + UI.cls.iconBall + '">' + UI.icon(f.icon, 'h-6 w-6') + '</span><div><h4 class="font-display text-lg font-semibold">' + UI.esc(f.title) + '</h4><p class="mt-1 text-sm leading-relaxed text-cocoa/75">' + UI.esc(f.description) + '</p></div></li>'; }).join('') + '</ul>';
    var routes = [['road', 'Road', 'byRoad'], ['rideshare', 'Rideshare', 'byRideshare'], ['bus', 'Bus', 'byBus'], ['parking', 'Parking', 'parking']];
    var tabs = '<div data-tabs><div role="tablist" aria-label="How to reach the ' + UI.esc(c.chamberName) + '" class="flex flex-wrap gap-3">' + routes.map(function (r, k) {
      return '<button type="button" role="tab" id="tab-' + c.slug + '-' + r[0] + '" aria-controls="panel-' + c.slug + '-' + r[0] + '" aria-selected="' + (k === 0) + '" data-tab="' + r[0] + '" class="' + UI.cls.tab + '">' + r[1] + '</button>'; }).join('') + '</div>' + routes.map(function (r, k) {
      return '<div role="tabpanel" id="panel-' + c.slug + '-' + r[0] + '" aria-labelledby="tab-' + c.slug + '-' + r[0] + '" data-tab-panel="' + r[0] + '" class="' + UI.cls.clay + ' mt-6 p-7' + (k ? ' hidden' : '') + '"><p class="leading-relaxed text-cocoa/80">' + UI.esc(c.howToReach[r[2]]) + '</p></div>'; }).join('') +
      '<ul class="mt-6 space-y-2 text-sm text-cocoa/75">' + c.patientTips.map(function (t) { return '<li class="flex gap-2">' + UI.icon('check-circle', 'mt-0.5 h-4 w-4 shrink-0 text-sage-600') + '<span>' + UI.esc(t) + '</span></li>'; }).join('') + '</ul></div>';
    var map = '<div class="overflow-hidden rounded-[2rem] shadow-clay-lg"><iframe title="Map of the ' + UI.esc(c.chamberName) + ', ' + UI.esc(c.area) + '" src="https://www.google.com/maps?q=' + encodeURIComponent(c.mapQuery) + '&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="h-80 w-full border-0 sm:h-[26rem]"></iframe></div>';
    var body = UI.sectionHead({ eyebrow: c.area + ', ' + c.city, title: c.chamberName.replace(c.area, '*' + c.area + '*'), lead: c.name + '. ' + c.landmark + '.' }) +
      '<div class="mt-16 grid items-center gap-14 lg:grid-cols-2"><div class="' + (i % 2 ? 'lg:order-last' : '') + '">' + scene + '</div><div>' + info + btns + '</div></div>' + facilities +
      '<h3 class="mt-20 text-center ' + UI.cls.h3 + '">How to reach us</h3><div class="mt-8 grid items-start gap-10 lg:grid-cols-2">' + tabs + map + '</div>';
    return '<section id="' + c.slug + '" data-section="' + c.slug + '" data-component="ChamberDetail" class="scroll-mt-20 ' + UI.cls[bg] + '"><div data-highlight class="' + UI.cls.container + ' rounded-[2.5rem] transition duration-500">' + body + '</div></section>';
  }
  /* 4 comparison */
  function compare() {
    var rows = [['Area', function (c) { return c.area + ', ' + c.city; }], ['Days', function (c) { return c.schedule.map(function (s) { return s.label; }).join(' and '); }], ['Hours', function (c) { return c.schedule.map(function (s) { return s.hours; }).join(' and '); }],
      ['First visit', function (c) { return UI.formatBDT(c.fee.firstVisit); }], ['Follow-up', function (c) { return UI.formatBDT(c.fee.followUp); }], ['Slot length', function (c) { return c.slotMinutes + ' minutes'; }],
      ['Hearing and balance tests', function (c) { return c.facilities.some(function (f) { return /audiometry/i.test(f.title); }) ? 'Done here' : 'Booked at the Upashahar clinic'; }],
      ['Parking', function (c) { var f = c.facilities.filter(function (x) { return x.icon === 'car'; })[0]; return f ? f.title : 'Nearby roads'; }], ['Phone', function (c) { return c.phone.display; }]];
    return section('compare', 'secBlush', UI.sectionHead({ eyebrow: 'Side by side', title: 'Compare *the chambers*', lead: 'Fees are for the consultation only. Tests, procedures and surgery are quoted after examination.' }) +
      tableCard('<table class="w-full min-w-[720px] border-collapse text-left"><caption class="sr-only">Comparison of the three chambers</caption><thead><tr><th scope="col" class="px-5 py-4 font-display">Detail</th>' + chambers.map(function (c) { return '<th scope="col" class="px-5 py-4 font-display">' + UI.esc(c.area) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr class="border-t border-cocoa/10"><th scope="row" class="px-5 py-4 text-sm font-semibold text-cocoa/70">' + r[0] + '</th>' + chambers.map(function (c) { return '<td class="px-5 py-4 text-sm font-semibold">' + UI.esc(r[1](c)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>'), 'ChamberComparison');
  }
  /* 5 what to bring */
  function bring() {
    return section('bring', 'secSage', UI.sectionHead({ eyebrow: 'Before you come', title: 'What to *bring* with you', lead: 'Tick each item as you pack it. Reports save time and often avoid repeating tests.' }) +
      '<div data-checklist class="mx-auto mt-14 max-w-3xl"><ul class="space-y-4">' + BRING.map(function (t, i) {
        return '<li data-reveal="rise" data-delay="' + (i % 4) * 60 + '"><label class="flex min-h-[3.5rem] cursor-pointer items-center gap-4 rounded-[1.5rem] bg-cream p-4 shadow-clay"><input type="checkbox" data-bring class="peer sr-only"><span aria-hidden="true" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-white shadow-well transition peer-checked:bg-clay-grad peer-checked:shadow-clay-btn peer-focus-visible:ring-4 peer-focus-visible:ring-clay/40 [&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100">' + UI.icon('check', 'h-5 w-5') + '</span><span class="text-cocoa/85">' + UI.esc(t) + '</span></label></li>'; }).join('') + '</ul>' +
      '<p class="mt-8 text-center font-semibold" role="status" aria-live="polite" data-bring-count>0 of ' + BRING.length + ' packed</p></div>', 'BringChecklist');
  }
  /* 6 cube */
  function cube() {
    var items = [['video', 'Endoscopy', 'A thin camera shows the inside of your nose, throat or ear canal, and you see the same pictures.'], ['activity', 'Hearing', 'A hearing test measures each ear. It is done at the Upashahar clinic and explained in plain words.'],
      ['target', 'Balance', 'Gentle positional tests find the cause of dizziness. Balance tests are also done at Upashahar.'], ['layers', 'Nose', 'We check the airway, the septum and the sinus openings for blockage.'],
      ['message-circle', 'Throat and voice', 'We examine the throat, the tonsils and the voice box when you have a lasting hoarse voice or trouble swallowing.'], ['heart', 'Children', 'Short, gentle checks with a parent beside the child, and no rush.']].map(function (x) { return { icon: x[0], title: x[1], text: x[2] }; });
    return section('checks', 'secCream', UI.sectionHead({ eyebrow: 'In the chamber', title: 'Six things *we check*', lead: 'Drag the cube, or use the arrows, to see what a visit may include. This page cannot diagnose you, and your doctor decides what is needed.' }) + '<div class="relative mt-16">' + '<div aria-hidden="true" data-parallax="0.15" class="pointer-events-none absolute -right-4 -top-10 hidden w-28 md:block">' + UI.deco(SITE.img.objects.orbGold, 'w-full motion-safe:animate-float') + '</div>' + UI.cube(items) + '</div>', 'CheckCube');
  }

  UI.ready(function () {
    document.getElementById('hero-mount').innerHTML = UI.pageHero({ eyebrow: 'Our chambers', title: 'Find the *chamber* that suits you', tone: 'mist', lead: 'Two chambers in Sylhet and one in Uttara, Dhaka. Check the hours, see how to reach each one and book the time that works for you.',
      actionsHTML: '<a href="' + SITE.routes.appointment + '" class="' + UI.cls.btnPrimary + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a>' });
    UI.mount(document.getElementById('page-hero'));
    var mount = function (id, html) { var el = document.getElementById(id); if (el) { el.outerHTML = html; } };
    mount('overview-mount', overview() + joint('cream', 'blush'));
    mount('weekly-mount', matrix() + joint('blush', 'sage'));
    mount('details-mount', chambers.map(function (c, i) { return detail(c, i) + (i < chambers.length - 1 ? joint(['sage', 'cream', 'mist'][i], ['cream', 'mist'][i]) : ''); }).join('') + joint('mist', 'blush'));
    mount('compare-mount', compare() + joint('blush', 'sage'));
    mount('bring-mount', bring() + joint('sage', 'cream'));
    mount('cube-mount', cube() + joint('cream', 'cocoa'));
    mount('cta-mount', UI.ctaBand({ title: 'Ready to *see the doctor?*', lead: 'Pick a chamber, a day and a time in a few minutes. No payment is taken online, and you can call the desk at any point.' }));
    UI.mount(document.getElementById('main'));
    refresh(); setInterval(refresh, 60000);

    var boxes = UI.qsa('[data-bring]'), count = UI.qs('[data-bring-count]');
    var checklist = UI.qs('[data-checklist]');
    if (checklist) checklist.addEventListener('change', function () { count.textContent = boxes.filter(function (b) { return b.checked; }).length + ' of ' + boxes.length + ' packed'; });

    var timer = null;
    function highlight() {
      var id = decodeURIComponent((window.location.hash || '').replace('#', '')), sec = chambers.some(function (c) { return c.slug === id; }) ? document.getElementById(id) : null;
      if (!sec) return;
      var box = sec.querySelector('[data-highlight]'); sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (!box) return; box.classList.add('ring-4', 'ring-inset', 'ring-clay/40'); clearTimeout(timer);
      timer = setTimeout(function () { box.classList.remove('ring-4', 'ring-inset', 'ring-clay/40'); }, 2000);
    }
    highlight(); window.addEventListener('hashchange', highlight);
  });
})();
