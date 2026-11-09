/*
 * js/pages/services.js — Services catalogue page
 * Path: js/pages/services.js · Owner: Part 3 · Purpose: hero, filterable pop-out catalogue, treatment ladder, fees table, marquee, CTA
 * Depends on: SITE, UI, FX (shared kit) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var list = SITE.servicesIndex, CATS = ['ear', 'nose', 'throat', 'children'], c = UI.cls;
    var CAT_LABEL = { all: 'All', ear: 'Ear', nose: 'Nose', throat: 'Throat', children: 'Children' };
    var state = { cat: 'all', q: '', sort: 'name' };
    var pre = (UI.getParam('category') || '').toLowerCase();
    if (CATS.indexOf(pre) > -1) state.cat = pre;

    function fees() {
      var f = SITE.chambersIndex.map(function (x) { return x.fee.firstVisit; }), g = SITE.chambersIndex.map(function (x) { return x.fee.followUp; });
      return { first: UI.formatBDTRange(Math.min.apply(null, f), Math.max.apply(null, f)), follow: UI.formatBDTRange(Math.min.apply(null, g), Math.max.apply(null, g)) };
    }

    /* 1. hero */
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      eyebrow: 'Ear, nose, throat & children', title: 'Eight services, *one gentle approach*', tone: 'sage',
      lead: 'From a careful hearing test to cochlear implant surgery, each service starts with an honest examination and the gentlest treatment that is likely to work.',
      actionsHTML: '<a href="' + SITE.routes.appointment + '" class="' + c.btnPrimary + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="#catalogue" class="' + c.btnSoft + '">Browse services' + UI.icon('arrow-down', 'h-5 w-5') + '</a>'
    }) + UI.wave('cream');
    UI.mount(document.getElementById('page-hero'));

    /* 2. catalogue with sticky filter bar */
    var chips = ['all'].concat(CATS).map(function (k) {
      return '<button type="button" class="' + c.chip + '" aria-pressed="' + (state.cat === k) + '" data-filter="' + k + '">' + CAT_LABEL[k] + '</button>';
    }).join('');
    var inputCls = 'h-12 w-full rounded-2xl bg-cream-100 px-4 text-sm text-cocoa shadow-well focus:bg-white focus:outline-none focus:ring-4 focus:ring-clay/30';
    var bar = '<div data-component="ServiceFilterBar" class="sticky top-24 z-30 rounded-[2rem] bg-cream p-4 shadow-clay-lg md:p-5"><div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">' +
      '<div class="flex flex-wrap items-center gap-3" role="group" aria-label="Filter by category">' + chips + '</div>' +
      '<div class="grid gap-3 sm:grid-cols-[1fr_11rem] lg:w-[30rem]"><div><label for="svc-search" class="mb-1 block px-1 text-xs font-semibold text-cocoa/60">Search by symptom or service</label><input id="svc-search" type="search" autocomplete="off" class="' + inputCls + '"></div>' +
      '<div><label for="svc-sort" class="mb-1 block px-1 text-xs font-semibold text-cocoa/60">Sort by</label><select id="svc-sort" class="' + inputCls + '"><option value="name">Name</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option></select></div></div></div>' +
      '<p id="svc-count" role="status" aria-live="polite" class="mt-3 px-1 text-sm text-cocoa/70"></p></div>';
    var cat = '<section id="catalogue" data-section="catalogue" class="' + c.secCream + ' !pt-16 md:!pt-24"><div class="' + c.container + '">' +
      UI.sectionHead({ eyebrow: 'The services', title: 'Find the *care you need*', lead: 'Choose a category or search by symptom. Prices are estimates; the final quote is given after examination.' }) +
      '<div class="mt-12">' + bar + '</div><div id="svc-grid" class="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4" data-component="ServiceGrid"></div></div></section>' + UI.wave('blush');
    document.getElementById('catalogue-mount').outerHTML = cat;
    var root = document.getElementById('catalogue'), grid = document.getElementById('svc-grid'), count = document.getElementById('svc-count');
    document.getElementById('svc-sort').value = state.sort;

    function render() {
      var q = state.q.trim().toLowerCase();
      var rows = list.filter(function (s) {
        return (state.cat === 'all' || s.category === state.cat) && (!q || (s.name + ' ' + s.short + ' ' + s.category).toLowerCase().indexOf(q) > -1);
      });
      rows.sort(function (a, b) { return state.sort === 'low' ? a.priceFrom - b.priceFrom : state.sort === 'high' ? b.priceTo - a.priceTo : a.name.localeCompare(b.name); });
      count.textContent = rows.length === 1 ? '1 service shown' : rows.length + ' services shown';
      if (!rows.length) {
        grid.innerHTML = '<div class="col-span-full mx-auto max-w-lg rounded-[2rem] bg-cream p-10 text-center shadow-clay"><span class="' + c.iconBall + ' mx-auto">' + UI.icon('search', 'h-6 w-6') + '</span><h3 class="mt-5 ' + c.h3 + '">No service matches that</h3><p class="mt-3 text-cocoa/75">Try a different word, or show every service. If you are unsure where your problem fits, call the appointment desk and we will guide you.</p><button type="button" data-filter="reset" class="' + c.btnPrimary + ' mt-6">Show all services</button></div>';
      } else {
        grid.innerHTML = rows.map(function (s) { return UI.serviceCard(s); }).join('');
      }
      UI.mount(grid);
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]'); if (!b || !root.contains(b)) return;
      var k = b.getAttribute('data-filter'); if (k === 'reset') { k = 'all'; state.q = ''; document.getElementById('svc-search').value = ''; }
      state.cat = k;
      UI.qsa('[data-filter][aria-pressed]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-filter') === k)); });
      render();
    });
    document.getElementById('svc-search').addEventListener('input', UI.debounce(function (e) { state.q = e.target.value; render(); }, 200));
    document.getElementById('svc-sort').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
    UI.mount(root); render();

    /* 3. ladder: gentlest treatment first, three clay planes stepping up in 3D */
    var steps = [
      { n: '01', icon: 'heart', title: 'Medicines & clinic care', text: 'Most visits end here. Camera and microscope examination, safe ear cleaning, hearing and sleep tests, the repositioning manoeuvre for positional vertigo, nasal sprays and voice therapy.', tag: 'Where most patients start', w: 'md:w-[82%]', z: 'md:[transform:translateZ(0px)]' },
      { n: '02', icon: 'activity', title: 'Minor procedures', text: 'When medicines are not enough, short procedures can help: grommets for glue ear, reducing swollen nasal turbinates, treating small polyps and removing growths on the vocal cords.', tag: 'Short and often day-care', w: 'md:w-[91%]', z: 'md:[transform:translateZ(60px)]' },
      { n: '03', icon: 'shield', title: 'Surgery when needed', text: 'Eardrum repair, endoscopic sinus surgery, septoplasty, tonsil and adenoid removal, thyroid surgery and cochlear implants. Offered only when likely to help, with the options and risks explained first.', tag: 'Discussed with you in detail', w: 'md:w-full', z: 'md:[transform:translateZ(120px)]' }
    ];
    var ladder = '<section id="ladder" data-section="ladder" class="' + c.secBlush + '"><div class="' + c.container + '">' +
      UI.sectionHead({ eyebrow: 'How we decide', title: 'Gentlest treatment *first*', lead: 'Care moves up one step at a time, and only when the step below has not been enough.' }) +
      '<div class="relative mt-16"><div aria-hidden="true" data-parallax="0.12" class="pointer-events-none absolute -top-10 right-0 hidden w-28 md:block">' + UI.deco(SITE.img.objects.orbGold, 'w-full motion-safe:animate-float') + '</div>' +
      '<div class="' + c.stage + '"><div data-orbit="4" class="' + c.preserve + ' flex flex-col items-center gap-6">' + steps.map(function (s) {
        return '<div class="w-full ' + s.w + ' ' + c.preserve + ' ' + s.z + '"><div data-scroll-tilt data-light class="relative flex flex-col gap-5 rounded-[2.5rem] bg-cream p-7 shadow-clay-lg sm:flex-row sm:items-center md:p-10"><span class="font-display text-5xl font-semibold text-clay-300 md:text-6xl" aria-hidden="true">' + s.n + '</span><span class="' + c.iconBall + '">' + UI.icon(s.icon, 'h-6 w-6') + '</span><div class="flex-1"><h3 class="' + c.h3 + '">' + s.title + '</h3><p class="mt-2 leading-relaxed text-cocoa/80">' + s.text + '</p></div>' + UI.badge(s.tag) + '</div></div>';
      }).join('') + '</div></div></div></div></section>' + UI.wave('mist');
    document.getElementById('ladder-mount').outerHTML = ladder;
    UI.mount(document.getElementById('ladder'));

    /* 4. fees explained */
    var f = fees(), em = SITE.contact;
    var rowsHTML = list.map(function (s, i) {
      return '<tr data-service-row="' + UI.esc(s.slug) + '"><td class="rounded-l-2xl bg-cream-100 px-5 py-4 align-top"><a href="' + SITE.url.service(s.slug) + '" class="font-semibold text-cocoa underline-offset-4 hover:text-clay-700 hover:underline">' + UI.esc(s.name) + '</a></td><td class="bg-cream-100 px-5 py-4 align-top capitalize">' + UI.esc(s.category) + '</td><td class="whitespace-nowrap bg-cream-100 px-5 py-4 align-top font-semibold">' + UI.formatBDTRange(s.priceFrom, s.priceTo) + '</td><td class="rounded-r-2xl bg-cream-100 px-5 py-4 align-top text-cocoa/75">' + UI.esc(s.priceUnit) + '</td></tr>';
    }).join('');
    var pay = ['Cash', 'bKash', 'Nagad', 'Card at chamber'].map(function (p) { return '<li class="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold shadow-clay">' + p + '</li>'; }).join('');
    var feesSec = '<section id="fees" data-section="fees" class="' + c.secMist + '"><div class="' + c.container + '">' +
      UI.sectionHead({ eyebrow: 'Fees explained', title: 'Know the cost *before you decide*', lead: 'Every estimate below is a range. Your examination decides where in the range you fall, and you receive a written quote first.' }) +
      '<div class="mt-12 grid gap-6 md:grid-cols-3"><div data-reveal="rise" class="' + c.clay + ' p-7"><span class="' + c.iconBall + '">' + UI.icon('credit-card', 'h-6 w-6') + '</span><h3 class="mt-4 ' + c.h3 + '">Consultation</h3><p class="mt-2 text-cocoa/80">A first visit costs ' + f.first + ' depending on the chamber, and a follow-up costs ' + f.follow + '. Each visit is about twenty minutes.</p></div>' +
      '<div data-reveal="rise" data-delay="100" class="' + c.clay + ' p-7"><span class="' + c.iconBall + '">' + UI.icon('file-text', 'h-6 w-6') + '</span><h3 class="mt-4 ' + c.h3 + '">Tests and procedures</h3><p class="mt-2 text-cocoa/80">Hearing tests, endoscopy and sleep studies are priced separately and explained at the visit. You decide which to do, and in what order.</p></div>' +
      '<div data-reveal="rise" data-delay="200" class="' + c.clay + ' p-7"><span class="' + c.iconBall + '">' + UI.icon('building', 'h-6 w-6') + '</span><h3 class="mt-4 ' + c.h3 + '">Surgery estimates</h3><p class="mt-2 text-cocoa/80">Surgery is performed at Surma Valley Specialized Hospital, Sylhet. The estimate covers surgeon, anaesthesia and theatre; the final quote comes after examination.</p></div></div>' +
      '<div data-reveal="rise" class="mt-12 rounded-[2rem] bg-cream p-3 shadow-clay-lg md:p-6"><div class="overflow-x-auto"><table class="w-full min-w-[680px] border-separate border-spacing-y-3 text-left text-sm md:text-base"><caption class="px-3 pb-3 text-left text-sm text-cocoa/70">Estimated fees in Bangladeshi taka. Final quote after examination.</caption><thead><tr class="text-cocoa/70"><th scope="col" class="px-5 pb-1 font-semibold">Service</th><th scope="col" class="px-5 pb-1 font-semibold">Area</th><th scope="col" class="px-5 pb-1 font-semibold">Estimate</th><th scope="col" class="px-5 pb-1 font-semibold">What it covers</th></tr></thead><tbody>' + rowsHTML + '</tbody></table></div></div>' +
      '<div class="mt-12 grid items-start gap-6 lg:grid-cols-2"><div class="' + c.clay + ' p-7"><h3 class="' + c.h3 + '">Ways to pay</h3><ul class="mt-5 flex flex-wrap gap-3">' + pay + '</ul><p class="mt-5 text-sm text-cocoa/70">Receipts are given for every payment. Ask the appointment desk about instalments for larger surgeries.</p></div>' +
      '<div class="rounded-[2rem] bg-clay-50 p-7 text-cocoa shadow-clay" role="note"><div class="flex items-start gap-4"><span class="' + c.iconBall + '">' + UI.icon('alert-circle', 'h-6 w-6') + '</span><div><h3 class="' + c.h3 + '">In an emergency, do not wait</h3><p class="mt-2 text-cocoa/80">This page cannot diagnose you. Trouble breathing or swallowing, bleeding that will not stop, or a swallowed button battery or magnet needs the nearest emergency department or <a class="font-semibold underline underline-offset-4" href="tel:999">999</a>. Patients after surgery can reach the urgent line on <a class="font-semibold underline underline-offset-4" href="tel:' + em.urgent.e164 + '">' + em.urgent.display + '</a>.</p></div></div></div></div></div></section>' + UI.wave('cream');
    document.getElementById('fees-mount').outerHTML = feesSec;
    UI.mount(document.getElementById('fees'));

    /* 5. marquee + CTA */
    var names = ['Hearing tests', 'Cochlear implants', 'Eardrum repair', 'Vertigo manoeuvre', 'Sinus surgery', 'Septoplasty', 'Sleep studies', 'Grommets', 'Tonsil surgery', 'Video laryngoscopy', 'Thyroid surgery', 'Voice therapy'];
    document.getElementById('marquee-mount').outerHTML = '<section id="treatments" data-section="treatments" class="relative overflow-x-clip bg-spot-cream pb-16 pt-4 text-cocoa md:pb-24"><div class="' + c.container + ' text-center"><p class="mx-auto max-w-2xl text-cocoa/75">Whatever brings you in, you will get a clear explanation of what was found, what your options are and what each will cost.</p></div><div class="mt-8">' + UI.marquee(names) + '</div></section>' + UI.wave('cocoa');
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Not sure which service you *need*?', lead: 'Book a first consultation in Sylhet or Dhaka and we will work out the next step together. Evening and Friday-morning slots are available.', primaryLabel: 'Book Appointment', primaryHref: SITE.routes.appointment, secondaryLabel: 'Call ' + em.phone.display, secondaryHref: 'tel:' + em.phone.e164 });
    UI.mount(document.getElementById('treatments')); UI.mount(document.getElementById('cta'));
  });
})();
