/*
 * js/pages/home.js — Home page script
 * Path: js/pages/home.js · Owner: Part 1 · Purpose: builds the hero scene and every home section from SITE data with kit components
 * Depends on: SITE, UI, FX (shared kit) · Exposes: nothing
 */
(function () {
  'use strict';
  var C = UI.cls, S = SITE, D = S.doctor, OB = S.img.objects;

  function sec(id, comp, cls, inner) {
    return '<section id="' + id + '" data-section="' + id + '" data-component="' + comp + '" class="' + cls + '"><div class="' + C.container + '">' + inner + '</div></section>';
  }
  function link(href, label, cls, icon) {
    return '<a href="' + href + '" class="' + cls + '">' + UI.esc(label) + (icon ? UI.icon(icon, 'h-5 w-5') : '') + '</a>';
  }
  function deco(src, pos, z, anim) {
    return '<div class="absolute ' + pos + ' [transform:translateZ(' + z + 'px)]">' + UI.deco(src, 'w-full ' + (anim || 'motion-safe:animate-float')) + '</div>';
  }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + UI.pad(d.getMonth() + 1) + '-' + UI.pad(d.getDate());
  }

  /* ---------- 1. hero: split layout with portrait, floating info cards ---------- */
  var HERO_IMG = 'assets/img/doctor-hero.png'; /* transparent portrait cut-out */
  function heroNext() {
    var n = S.nextOpening(), el = document.getElementById('hero-next');
    if (!el) return;
    el.textContent = !n ? 'Call the desk for dates' : n.chamber.chamberName + ', ' + (n.isToday && n.startAt <= new Date() ? 'open until ' + UI.formatTime(n.endAt) : n.startAt.toLocaleDateString('en-GB', { weekday: 'short' }) + ' ' + UI.formatTime(n.startAt));
  }
  function renderHero() {
    document.getElementById('hero-intro').innerHTML =
      '<div data-component="HeroIntro"><p data-reveal="rise" data-delay="200" class="mx-auto mt-7 max-w-xl lg:mx-0 ' + C.lead + '">' + UI.esc(D.name) + ' is an ENT and head\u2013neck surgeon who has treated more than ' + D.patientsTreated.toLocaleString('en-IN') + ' patients in Sylhet and Dhaka. Every visit starts with a careful camera examination and an explanation in plain language.</p>' +
      '<div data-reveal="rise" data-delay="300" class="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start">' + link(S.routes.appointment, 'Book Appointment', C.btnPrimary, 'arrow-right') +
      '<a href="tel:' + S.contact.phone.e164 + '" class="' + C.btnSoft + '">' + UI.icon('phone', 'h-5 w-5') + UI.esc(S.contact.phone.display) + '</a></div>' +
      '<ul data-reveal="rise" data-delay="400" class="mt-9 flex flex-wrap justify-center gap-3 text-sm font-semibold lg:justify-start">' +
      [['shield', 'BMDC reg. no. ' + D.bmdcNo], ['award', 'FCPS (ENT)'], ['clock', D.experienceYears + '+ years in practice'], ['heart', D.satisfactionPercent + '% patient satisfaction']].map(function (t) {
        return '<li class="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 shadow-clay">' + UI.icon(t[0], 'h-4 w-4 text-clay-600') + UI.esc(t[1]) + '</li>';
      }).join('') + '</ul></div>';

    var box = document.getElementById('hero-portrait');
    box.innerHTML = UI.img(HERO_IMG, D.name + ', ENT and head\u2013neck surgeon', 'h-full w-full object-contain object-bottom', { w: 369, h: 506, eager: true });
    document.getElementById('hero-orb-a').innerHTML = UI.deco(OB.orbGold, 'w-full');
    document.getElementById('hero-orb-b').innerHTML = UI.deco(OB.orbSage, 'w-full');
    heroNext();
  }

  /* ---------- 2. ear model section (moved out of the hero) ---------- */
  function earSection() {
    var parts = [
      ['Outer ear', 'The visible part that collects sound and guides it into the ear canal.'],
      ['Ear canal', 'A short tube that carries sound to the eardrum and makes the wax that protects it.'],
      ['Eardrum', 'A thin skin that vibrates with sound. Infections and injuries can make a hole in it.'],
      ['Middle-ear bones', 'Three tiny bones that pass the vibrations on. They can stiffen with age or infection.'],
      ['Cochlea', 'A snail-shaped organ that turns vibrations into signals for the hearing nerve.']
    ];
    var list = '<ol class="space-y-4">' + parts.map(function (p, i) {
      return '<li data-reveal="rise" data-delay="' + (i * 80) + '" class="flex gap-4 rounded-[2rem] bg-cream p-5 shadow-clay"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orb font-display text-lg font-semibold shadow-clay">' + (i + 1) + '</span>' +
        '<div><h3 class="font-display text-lg font-semibold">' + UI.esc(p[0]) + '</h3><p class="mt-1 text-sm leading-relaxed text-cocoa/75">' + UI.esc(p[1]) + '</p></div></li>';
    }).join('') + '</ol>';
    return sec('ear', 'HomeEar', C.secMist,
      '<div class="grid items-center gap-14 lg:grid-cols-2"><div><div class="' + C.stage + '">' + UI.earModel() + '</div><div aria-hidden="true" class="mx-auto -mt-4 h-6 w-[min(70vw,380px)] rounded-full bg-cocoa/25 blur-md"></div></div>' +
      '<div>' + UI.sectionHead({ eyebrow: 'Inside the ear', title: 'See how you *hear*', lead: 'Scroll to take the model apart, layer by layer. Knowing the parts makes it easier to understand what the doctor explains.', align: 'left' }) + '<div class="mt-8">' + list + '</div></div></div>');
  }

  /* ---------- section builders ---------- */
  function statsSection() {
    var items = ['Cochlear implants', 'Eardrum repair', 'Vertigo treatment', 'Sinus surgery', 'Septoplasty', 'Sleep apnoea care', 'Children\u2019s ENT', 'Voice and thyroid care'];
    return sec('marquee-stats', 'HomeStats', C.secBlush,
      UI.marquee(items) + '<div class="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">' +
      UI.statOrb({ value: D.experienceYears, suffix: '+', label: 'Years in practice', color: 'clay' }) + UI.statOrb({ value: D.patientsTreated, suffix: '+', label: 'Patients treated', color: 'sage', delay: 100 }) +
      UI.statOrb({ value: D.surgeriesPerformed, suffix: '+', label: 'Surgeries performed', color: 'gold', delay: 200 }) + UI.statOrb({ value: D.satisfactionPercent, suffix: '%', label: 'Patient satisfaction', color: 'clay', delay: 300 }) + '</div>');
  }

  function aboutSection() {
    var stage = '<div class="relative mx-auto w-full max-w-md ' + C.stage + '"><div aria-hidden="true" data-parallax="0.12" class="pointer-events-none absolute -left-3 top-6 z-10 w-24 sm:w-32">' + UI.deco(OB.orbGold, 'w-full motion-safe:animate-float') + '</div>' +
      '<div data-light data-reveal="pop" class="relative mx-auto w-[88%] pt-10"><div aria-hidden="true" class="absolute inset-x-0 bottom-6 aspect-square rounded-full bg-orb-sage shadow-clay-lg"></div>' +
      UI.img(HERO_IMG, 'Portrait of ' + D.name + ', ENT and head\u2013neck surgeon', 'relative w-full drop-shadow-[0_20px_20px_rgba(43,29,26,.25)]', { w: 369, h: 506 }) + '</div>' +
      '<div aria-hidden="true" class="relative mx-auto -mt-8 h-14 w-[96%] rounded-full bg-cream shadow-plinth"></div><div aria-hidden="true" class="mx-auto -mt-2 h-4 w-[70%] rounded-full bg-cocoa/25 blur-md"></div></div>';
    var creds = D.degrees.map(function (g) { return '<li class="flex gap-3">' + UI.icon('check-circle', 'mt-0.5 h-5 w-5 shrink-0 text-sage-600') + '<span>' + UI.esc(g) + '</span></li>'; }).join('');
    return sec('about', 'HomeAbout', C.secCream + ' md:!pt-20',
      '<div class="grid items-center gap-16 lg:grid-cols-2">' + stage + '<div>' + UI.sectionHead({ eyebrow: 'Meet the doctor', title: 'Careful hands, *clear explanations*', align: 'left' }) +
      '<div data-reveal="rise" data-delay="120" class="mt-7 space-y-5 text-lg leading-relaxed text-cocoa/80"><p>' + UI.esc(D.title) + ' with ' + D.experienceYears + ' years of experience. After training in Sylhet and at BSMMU he studied cochlear implantation and skull-base surgery in Chennai.</p>' +
      '<p>His approach is simple: look carefully, explain honestly and begin with the gentlest option that is likely to work. Surgery is discussed only when it will help you.</p></div>' +
      '<ul data-reveal="rise" data-delay="200" class="mt-8 space-y-3 text-cocoa/85">' + creds + '</ul>' +
      '<div class="mt-10 flex flex-wrap gap-4">' + link(S.routes.about, 'About Dr. Ashfaq', C.btnSoft, 'arrow-right') + link(S.routes.appointment, 'Book Appointment', C.btnPrimary, 'calendar') + '</div></div></div>');
  }

  var CATS = [{ k: 'all', l: 'All' }, { k: 'ear', l: 'Ear' }, { k: 'nose', l: 'Nose' }, { k: 'throat', l: 'Throat' }, { k: 'children', l: 'Children' }];
  function servicesSection() {
    return sec('services', 'HomeServices', C.secBlush,
      UI.sectionHead({ eyebrow: 'Treatments', title: 'Care for every part of *ear, nose and throat*', lead: 'Choose a group to see the treatments. Prices are estimates and the final quote is given after examination.' }) +
      '<div id="svc-filters" role="group" aria-label="Filter treatments by area" class="mt-10 flex flex-wrap justify-center gap-3">' + CATS.map(function (c) {
        return '<button type="button" class="' + C.chip + ' min-h-[44px]" aria-pressed="' + (c.k === 'all') + '" data-filter="' + c.k + '">' + c.l + '</button>';
      }).join('') + '</div><p id="svc-status" role="status" class="mt-5 text-center text-sm text-cocoa/70"></p>' +
      '<div id="svc-grid" data-component="ServiceGrid" class="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4"></div>' +
      '<div class="mt-14 flex justify-center">' + link(S.routes.services, 'See all treatments', C.btnPrimary, 'arrow-right') + '</div>');
  }
  function renderServices(cat) {
    var grid = document.getElementById('svc-grid'), list = S.servicesIndex.filter(function (s) { return cat === 'all' || s.category === cat; });
    grid.innerHTML = list.length ? list.map(function (s) { return UI.serviceCard(s); }).join('') : '<p class="col-span-full rounded-[2rem] bg-cream p-8 text-center shadow-clay">No treatments in this group yet. Choose All to see everything.</p>';
    document.getElementById('svc-status').textContent = 'Showing ' + list.length + ' of ' + S.servicesIndex.length + ' treatments';
    UI.mount(grid);
  }

  function cubeSection() {
    var cube = UI.cube([
      { icon: 'activity', title: 'Camera first', text: 'A quick endoscope examination shows the problem, so decisions rest on what is really there.' },
      { icon: 'heart', title: 'Gentle with children', text: 'Parents stay beside the child, and examinations are slow, calm and playful.' },
      { icon: 'shield', title: 'Honest options', text: 'You hear every option, including the ones that avoid an operation.' },
      { icon: 'clock', title: 'Unhurried visits', text: 'Each patient is given about twenty minutes, enough time for a proper look and your questions.' },
      { icon: 'credit-card', title: 'Clear costs', text: 'Fees and surgery estimates are explained before you decide anything.' },
      { icon: 'message-circle', title: 'WhatsApp follow-up', text: 'After your visit, the clinic team answers questions on WhatsApp within a day.' }
    ]);
    return sec('cube', 'HomeWhy', C.secSage,
      '<div class="grid items-center gap-14 lg:grid-cols-2"><div>' + UI.sectionHead({ eyebrow: 'Why patients choose Dr. Ashfaq', title: 'Six reasons, *one cube*', lead: 'Drag the cube, or use the arrows, to read each reason.', align: 'left' }) +
      '<p data-reveal="rise" data-delay="160" class="mt-6 max-w-lg text-lg leading-relaxed text-cocoa/80">Ear, nose and throat problems often feel frightening because they affect how you hear, breathe and speak. A calm examination and a clear explanation take much of that fear away.</p></div>' +
      '<div class="relative">' + cube + '</div></div>');
  }

  function visitSection() {
    var steps = [
      ['Examine', 'A gentle camera examination of your ear, nose and throat shows what is happening. Most visits take about twenty minutes.'],
      ['Test', 'If needed, a hearing test, balance test or scan is arranged. Audiometry and balance tests are done at the Upashahar clinic.'],
      ['Plan', 'You hear every option, from medicines and exercises to surgery, with an estimated cost before you decide.'],
      ['Treat and follow up', 'Treatment begins with the gentlest option likely to work, and the clinic team answers your questions afterwards.']
    ];
    return sec('visit', 'HomeVisit', C.secCream,
      '<div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-1/2 bg-floor-grid [background-size:56px_56px] [mask-image:linear-gradient(to_top,black,transparent)]"></div>' +
      '<div class="relative">' + UI.sectionHead({ eyebrow: 'Your visit', title: 'Your visit in *four steps*', lead: 'No surprises: here is what happens from the moment you walk in.' }) +
      '<ol class="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 ' + C.stage + '">' + steps.map(function (s, i) {
        return '<li data-scroll-tilt class="relative"><div class="h-full rounded-[2rem] bg-cream px-6 pb-8 pt-14 text-center shadow-clay-lg"><span aria-hidden="true" class="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-orb font-display text-2xl font-semibold shadow-clay-lg">' + (i + 1) + '</span>' +
          '<h3 class="' + C.h3 + '">' + UI.esc(s[0]) + '</h3><p class="mt-3 text-sm leading-relaxed text-cocoa/75">' + UI.esc(s[1]) + '</p></div></li>';
      }).join('') + '</ol></div>');
  }

  function openLabel(slug) {
    var n = S.nextOpening(slug), now = new Date();
    if (!n) return 'Call the desk for dates';
    if (n.isToday && n.startAt <= now) return 'Open today until ' + UI.formatTime(n.endAt);
    if (n.isToday) return 'Opens today at ' + UI.formatTime(n.startAt);
    return 'Next: ' + n.startAt.toLocaleDateString('en-GB', { weekday: 'short' }) + ' ' + UI.formatTime(n.startAt);
  }
  function chambersSection() {
    return sec('chambers', 'HomeChambers', C.secMist,
      UI.sectionHead({ eyebrow: 'Chambers', title: 'Three places to *meet the doctor*', lead: 'Two chambers in Sylhet and one in Dhaka Uttara. Every other day is closed, and the label shows the next session.' }) +
      '<div class="mt-14 grid gap-8 lg:grid-cols-3">' + S.chambersIndex.map(function (c, i) {
        return '<div data-reveal="rise" data-delay="' + (i * 100) + '" class="flex flex-col gap-4"><p class="mx-auto inline-flex w-fit items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold shadow-clay"><span aria-hidden="true" class="h-2.5 w-2.5 rounded-full bg-sage motion-safe:animate-breathe"></span><span data-open-label="' + UI.esc(c.slug) + '">' + UI.esc(openLabel(c.slug)) + '</span></p><div class="grid flex-1">' + UI.chamberCard(c) + '</div></div>';
      }).join('') + '</div>');
  }
  function refreshLabels() {
    UI.qsa('[data-open-label]').forEach(function (el) { el.textContent = openLabel(el.getAttribute('data-open-label')); });
  }

  function bookSection() {
    var chambers = S.chambersIndex.map(function (c) { return { value: c.slug, label: c.chamberName + ', ' + c.city }; });
    var services = S.servicesIndex.map(function (s) { return { value: s.slug, label: s.name }; });
    var types = [{ value: 'new', label: 'New patient' }, { value: 'follow-up', label: 'Follow-up' }, { value: 'second-opinion', label: 'Second opinion' }, { value: 'post-op', label: 'After surgery' }];
    var scene = '<div aria-hidden="true" class="pointer-events-none relative mx-auto mt-12 h-48 w-full max-w-sm ' + C.stage + '"><div data-orbit="8" class="absolute inset-0 ' + C.preserve + '">' +
      deco(OB.orbClay, 'left-[4%] top-[10%] w-24', 100) + deco(OB.cone, 'right-[6%] top-[4%] w-24', 60, 'motion-safe:animate-float-slow') + deco(OB.orbGold, 'left-[40%] bottom-0 w-20', 150) + '</div></div>';
    var form = '<form id="quick-book" novalidate data-component="QuickBookForm" class="space-y-5">' +
      UI.field({ label: 'Chamber', name: 'chamber', type: 'select', required: true, options: chambers }) +
      UI.field({ label: 'Treatment area', name: 'service', type: 'select', required: true, options: services }) +
      UI.field({ label: 'Preferred date', name: 'date', type: 'date', required: true, min: todayISO(), hint: 'We check the date against the chamber\u2019s open days.' }) +
      UI.field({ label: 'Visit type', name: 'type', type: 'select', required: true, options: types }) +
      '<button type="submit" class="' + C.btnPrimary + ' w-full">Continue to booking' + UI.icon('arrow-right', 'h-5 w-5') + '</button></form>';
    return sec('book', 'HomeBook', C.secClay,
      '<div class="grid items-center gap-12 lg:grid-cols-2"><div class="text-center lg:text-left"><p data-reveal="fade" class="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-clay-700 shadow-clay">Quick booking</p>' +
      '<h2 data-reveal="rise" class="mt-5 ' + C.h2 + ' text-white [&_em]:not-italic [&_em]:underline [&_em]:decoration-white/50 [&_em]:underline-offset-8">' + UI.emph('Pick a day, *we will do the rest*') + '</h2>' +
      '<p data-reveal="rise" data-delay="120" class="mt-5 text-lg leading-relaxed text-white">Choose a chamber, a treatment area and a day. The next page asks for your details and confirms the slot.</p>' + scene + '</div>' +
      '<div data-reveal="pop" data-light class="' + C.clayLg + ' p-6 sm:p-10"><h3 class="mb-6 ' + C.h3 + '">Start your appointment</h3>' + form + '</div></div>');
  }
  function setDateError(form, msg) {
    var el = form.querySelector('[data-error-for="date"]'), input = form.elements.date;
    el.textContent = msg; el.classList.toggle('hidden', !msg); input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function dayCheck(form) {
    var c = S.getChamber(form.elements.chamber.value), v = form.elements.date.value;
    if (!c || !v) return true;
    var day = new Date(v + 'T00:00:00').getDay();
    if (!c.schedule.some(function (s) { return s.days.indexOf(day) > -1; })) { setDateError(form, c.chamberName + ' is open on ' + c.schedule.map(function (s) { return s.label; }).join(' and ') + '. Please choose one of those days.'); return false; }
    if (v < todayISO()) { setDateError(form, 'Please choose today or a later date.'); return false; }
    setDateError(form, ''); return true;
  }
  function bindBooking() {
    var form = document.getElementById('quick-book');
    form.addEventListener('change', function (e) { if (e.target.name === 'chamber' || e.target.name === 'date') dayCheck(form); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = UI.validateForm(form);
      if (ok && !dayCheck(form)) { ok = false; form.elements.date.focus(); }
      if (!ok) return;
      window.location.href = S.url.appointment({ service: form.elements.service.value, chamber: form.elements.chamber.value, date: form.elements.date.value, type: form.elements.type.value });
    });
  }

  function voicesSection() {
    return sec('voices', 'HomeVoices', C.secCream,
      UI.sectionHead({ eyebrow: 'Patient stories', title: 'In their *own words*', lead: 'Individual experiences differ, and results depend on each person\u2019s condition.' }) +
      '<div class="mt-14">' + UI.ring(S.testimonialsIndex.map(function (t) { return UI.testimonialCard(t); }), { autoplay: 7000, label: 'Patient stories' }) + '</div>' +
      '<div class="mt-14 flex justify-center">' + link(S.routes.testimonials, 'Read more stories', C.btnSoft, 'arrow-right') + '</div>');
  }

  function blogSection() {
    var posts = S.blogIndex.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
    return sec('blog', 'HomeBlog', C.secBlush,
      UI.sectionHead({ eyebrow: 'Health notes', title: 'Plain answers to *common worries*', lead: 'Short articles that explain ear, nose and throat problems without jargon. They are general information, not a diagnosis.' }) +
      '<div class="mt-14 grid gap-8 md:grid-cols-3">' + posts.map(function (p) { return UI.postCard(p); }).join('') + '</div>' +
      '<div class="mt-14 flex justify-center">' + link(S.routes.blog, 'Read all articles', C.btnPrimary, 'arrow-right') + '</div>');
  }

  function faqsSection() {
    var faqs = [
      ['Do I need a referral to see the doctor?', 'No. You can book directly. Please bring earlier reports, hearing tests, scans and a list of your medicines, because they save time and can avoid repeat tests.'],
      ['How long does a first visit take?', 'Each patient is given about twenty minutes. Most examinations use a small camera and a light, and a hearing or balance test may be arranged afterwards if it is needed.'],
      ['Where are tests and surgeries done?', 'Audiometry and balance tests are done at the Upashahar clinic in Sylhet. Surgeries are performed on Sunday to Wednesday mornings at Surma Valley Specialized Hospital in Sylhet.'],
      ['Is the examination safe for children?', 'Yes. Children sit on a parent\u2019s lap and are examined slowly with plenty of reassurance. If a child is distressed, the doctor pauses and explains what comes next.'],
      ['How much will treatment cost?', 'Consultation fees are listed for each chamber, and treatment prices on the services page are estimates. A final quote is given after examination and before you decide anything. Payment by bKash and Nagad is accepted at the desk.'],
      ['Whom should I call after surgery?', 'Patients after surgery can call the urgent line on ' + S.contact.urgent.display + '. For heavy bleeding, trouble breathing or swallowing, go to the nearest emergency department or call ' + S.contact.nationalEmergency + '.']
    ];
    return sec('faqs', 'HomeFaqs', C.secCream,
      '<div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div class="lg:sticky lg:top-32 lg:self-start">' + UI.sectionHead({ eyebrow: 'Questions', title: 'Things people *ask first*', lead: 'Quick answers before you book.', align: 'left' }) +
      '<div class="mt-8">' + link(S.routes.faqs, 'See all questions', C.btnSoft, 'arrow-right') + '</div></div>' +
      '<div data-accordion data-accordion-single class="space-y-4">' + faqs.map(function (f, i) {
        return UI.faqItem({ id: 'home-' + i, question: f[0], answerHTML: '<p>' + UI.esc(f[1]) + '</p>', tone: 'light', open: i === 0 });
      }).join('') + '</div></div>');
  }

  function emergencySection() {
    var items = [
      ['A nosebleed that will not stop', 'Sit up, lean forward and pinch the soft part of the nose for 10\u201315 minutes. Never tilt the head back. If it is heavy or still bleeding, go to an emergency department.'],
      ['Trouble breathing or swallowing', 'Noisy breathing, drooling or being unable to swallow saliva needs emergency care straight away, especially in children.'],
      ['A swallowed button battery or magnet', 'Go to the nearest emergency department immediately, even if there are no symptoms yet. Do not wait.'],
      ['Sudden hearing loss', 'Losing hearing over hours or a day is urgent. See a doctor within 72 hours, and sooner if you can.']
    ];
    return sec('emergency', 'HomeEmergency', C.secSage,
      UI.sectionHead({ eyebrow: 'Urgent care', title: 'When ENT problems *cannot wait*', lead: 'Most ear, nose and throat problems can wait for an appointment. These cannot. This page cannot diagnose you.' }) +
      '<div data-reveal="pop" class="mx-auto mt-14 max-w-5xl rounded-[2.5rem] bg-cream p-7 shadow-clay-lg md:p-12"><ul class="grid gap-8 sm:grid-cols-2">' + items.map(function (it) {
        return '<li class="flex gap-4"><span class="' + C.iconBall + '">' + UI.icon('alert-circle', 'h-6 w-6') + '</span><div><h3 class="' + C.h3 + '">' + UI.esc(it[0]) + '</h3><p class="mt-2 text-sm leading-relaxed text-cocoa/80">' + UI.esc(it[1]) + '</p></div></li>';
      }).join('') + '</ul><p class="mt-8 text-sm text-cocoa/75">Please never poke anything into an ear or a nose. In any emergency go to the nearest emergency department or call <b>' + S.contact.nationalEmergency + '</b>.</p>' +
      '<div class="mt-8 flex flex-wrap gap-4"><a href="tel:' + S.contact.nationalEmergency + '" class="' + C.btnPrimary + '">' + UI.icon('phone', 'h-5 w-5') + 'Call ' + S.contact.nationalEmergency + '</a>' +
      '<a href="tel:' + S.contact.urgent.e164 + '" class="' + C.btnSoft + '">' + UI.icon('phone', 'h-5 w-5') + 'After surgery: ' + UI.esc(S.contact.urgent.display) + '</a></div></div>');
  }

  UI.ready(function () {
    renderHero();
    document.getElementById('home-mount').outerHTML =
      UI.wave('blush') + statsSection() + UI.wave('cream') + aboutSection() + UI.wave('mist') + earSection() + UI.wave('blush') + servicesSection() + UI.wave('sage') + cubeSection() + UI.wave('cream') + visitSection() +
      UI.wave('mist') + chambersSection() + UI.wave('clay') + bookSection() + UI.wave('cream') + voicesSection() + UI.wave('blush') + blogSection() + UI.wave('cream') + faqsSection() +
      UI.wave('sage') + emergencySection() + UI.wave('cocoa') +
      UI.ctaBand({ title: 'One visit can change how you *hear the world*', lead: 'Book a first consultation in Sylhet or Dhaka, with evening sessions and a Friday-morning session in Uttara.' });

    renderServices('all');
    document.getElementById('svc-filters').addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]'); if (!b) return;
      UI.qsa('[data-filter]', e.currentTarget).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderServices(b.getAttribute('data-filter'));
    });
    bindBooking();
    setInterval(function () { refreshLabels(); heroNext(); }, 60000);
    UI.mount(document.getElementById('main'));
  });
})();
