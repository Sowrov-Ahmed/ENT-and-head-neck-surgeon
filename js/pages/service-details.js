/*
 * js/pages/service-details.js — Single service page (?slug=)
 * Path: js/pages/service-details.js · Owner: Part 3 · Purpose: hero, 3D plinth stage, sticky nav + sections, booking card, related care, CTA
 * Depends on: SITE, UI, FX, window.SERVICES (js/data/services.js) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var c = UI.cls, E = UI.esc, slug = UI.getParam('slug') || '';
    var idx = SITE.getService(slug), det = (window.SERVICES || []).filter(function (x) { return x.slug === slug; })[0];
    var heroMount = document.getElementById('hero-mount');
    var TITLE = ' | Dr. Ashfaq Talukder \u2013 ENT';

    function setMeta(sel, val) { var m = document.querySelector(sel); if (m) m.setAttribute('content', val); }
    function cardCls() { return 'rounded-[2rem] bg-cream p-6 text-cocoa shadow-clay'; }
    function li(icon, text, tone) { return '<li class="flex items-start gap-3">' + UI.icon(icon, 'mt-1 h-5 w-5 shrink-0 ' + (tone || 'text-clay-600')) + '<span>' + E(text) + '</span></li>'; }
    function block(id, comp, title, inner) {
      return '<div id="' + id + '" data-section="' + id + '" data-component="' + comp + '" class="scroll-mt-28"><h2 data-reveal="rise" class="font-display text-3xl font-semibold tracking-tight md:text-4xl">' + E(title) + '</h2><div class="mt-6">' + inner + '</div></div>';
    }

    /* ---------- unknown slug: friendly not-found, nothing else renders ---------- */
    if (!idx || !det) {
      document.title = 'Service not found' + TITLE;
      ['stage-mount', 'body-mount', 'related-mount', 'cta-mount'].forEach(function (id) { var n = document.getElementById(id); if (n) n.remove(); });
      heroMount.innerHTML = '<section id="not-found" data-section="not-found" data-component="NotFound" class="' + c.secCream + ' !pt-40 md:!pt-48"><div class="' + c.container + ' text-center"><span class="' + c.iconBall + ' mx-auto !h-16 !w-16">' + UI.icon('search', 'h-7 w-7') + '</span><h1 class="mx-auto mt-6 max-w-3xl ' + c.h1 + '">We could not find that <span class="text-clay-700">service</span></h1><p class="mx-auto mt-6 max-w-xl ' + c.lead + '">The link may be old or mistyped. Every service we offer is listed below, and the appointment desk can point you to the right one.</p>' +
        '<div class="mt-8 flex flex-wrap justify-center gap-4"><a href="' + SITE.routes.services + '" class="' + c.btnPrimary + '">See all services' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="tel:' + SITE.contact.phone.e164 + '" class="' + c.btnSoft + '">' + UI.icon('phone', 'h-5 w-5') + 'Call ' + E(SITE.contact.phone.display) + '</a></div>' +
        '<h2 class="mt-12 ' + c.h3 + '">All our services</h2><ul class="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-3">' + SITE.servicesIndex.map(function (s) { return '<li><a href="' + SITE.url.service(s.slug) + '" class="' + c.chip + ' inline-flex">' + E(s.name) + '</a></li>'; }).join('') + '</ul></div></section>';
      UI.mount(document.getElementById('not-found'));
      return;
    }

    var svc = Object.assign({}, idx, det), cat = svc.category.charAt(0).toUpperCase() + svc.category.slice(1);
    var range = UI.formatBDTRange(svc.priceFrom, svc.priceTo), bookUrl = SITE.url.appointment({ service: svc.slug });
    document.title = svc.name + TITLE;
    setMeta('meta[name="description"]', svc.name + ': ' + svc.short + ' Symptoms, tests, recovery, risks and fees explained.');
    setMeta('meta[property="og:title"]', svc.name); setMeta('meta[property="og:description"]', svc.short);

    /* ---------- hero ---------- */
    var words = svc.name.split(' '), keep = Math.max(1, words.length - 2);
    heroMount.innerHTML = UI.pageHero({
      eyebrow: cat + ' care', title: words.slice(0, keep).join(' ').replace(/\*/g, '') + ' *' + words.slice(keep).join(' ').replace(/\*/g, '') + '*', tone: 'blush', lead: svc.tagline,
      actionsHTML: '<div class="flex basis-full flex-wrap items-center justify-center gap-3">' + UI.badge(cat) + '<span class="rounded-full bg-cream px-4 py-1.5 text-sm font-semibold shadow-clay">' + range + '</span><span class="text-sm text-cocoa/70">' + E(svc.priceUnit) + '</span></div>' +
        '<a href="' + bookUrl + '" class="' + c.btnPrimary + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="tel:' + SITE.contact.phone.e164 + '" class="' + c.btnSoft + '">' + UI.icon('phone', 'h-5 w-5') + 'Call ' + E(SITE.contact.phone.display) + '</a>'
    }) + UI.wave('sage');
    UI.mount(document.getElementById('page-hero'));

    /* ---------- stage: the clay object large on a plinth (camera orbit) ---------- */
    var O = SITE.img.objects;
    function layer(z, inner, cls) { return '<div class="absolute inset-0 flex justify-center ' + (cls || 'items-end') + ' [transform:translateZ(' + z + 'px)]">' + inner + '</div>'; }
    document.getElementById('stage-mount').outerHTML = '<section id="object" data-section="object" data-component="ServiceStage" class="' + c.secSage + ' !pb-12 !pt-8 md:!pb-20 md:!pt-12"><div class="' + c.container + '"><div data-reveal="pop" class="mx-auto max-w-3xl"><div class="' + c.stage + '"><div data-orbit="6" class="relative h-[340px] w-full ' + c.preserve + ' sm:h-[440px]">' +
      layer(0, '<div aria-hidden="true" class="mb-2 h-16 w-[85%] rounded-full bg-cocoa/20 blur-xl sm:h-20"></div>') +
      layer(30, '<div aria-hidden="true" class="mb-4 h-16 w-[62%] max-w-md rounded-full bg-cream shadow-clay-lg sm:h-20"></div>') +
      layer(110, UI.img(svc.image, svc.name, 'mb-14 h-auto w-[68%] max-w-sm object-contain drop-shadow-[0_26px_22px_rgba(43,29,26,.28)] sm:mb-20', { w: 600, h: 600, eager: true })) +
      layer(170, '<div aria-hidden="true" class="mt-6 w-full"><div class="ml-[4%] w-20 sm:w-28">' + UI.deco(O.orbGold, 'w-full motion-safe:animate-float') + '</div></div>', 'items-start') +
      layer(80, '<div aria-hidden="true" class="mt-24 flex w-full justify-end"><div class="mr-[4%] w-16 sm:w-24">' + UI.deco(O.pill, 'w-full motion-safe:animate-float-slow') + '</div></div>', 'items-start') +
      '</div></div><p class="mt-4 text-center text-sm text-cocoa/75">Estimated cost ' + range + ', ' + E(svc.priceUnit) + '. Final quote after examination.</p></div></div></section>' + UI.wave('cream');
    UI.mount(document.getElementById('object'));

    /* ---------- body sections ---------- */
    function renderOverview() {
      var facts = [['Estimated cost', range], ['Area of care', cat], ['Consultation', UI.formatBDTRange(Math.min.apply(null, SITE.chambersIndex.map(function (x) { return x.fee.followUp; })), Math.max.apply(null, SITE.chambersIndex.map(function (x) { return x.fee.firstVisit; })))]];
      return block('overview', 'ServiceOverview', 'Overview', svc.overview.map(function (p) { return '<p class="mb-4 text-lg leading-relaxed text-cocoa/80">' + E(p) + '</p>'; }).join('') +
        '<dl class="mt-6 grid gap-4 sm:grid-cols-3">' + facts.map(function (f) { return '<div data-light class="' + cardCls() + '"><dt class="text-xs font-semibold uppercase tracking-[0.14em] text-cocoa/60">' + f[0] + '</dt><dd class="mt-2 font-display text-lg font-semibold">' + f[1] + '</dd></div>'; }).join('') + '</dl>');
    }
    function renderSymptoms() {
      return block('symptoms', 'ServiceSymptoms', 'You may notice\u2026', '<ul class="grid gap-4 sm:grid-cols-2">' + svc.symptoms.map(function (s) { return '<li data-reveal="rise" class="flex items-start gap-3 ' + cardCls() + '">' + UI.icon('check-circle', 'mt-0.5 h-5 w-5 shrink-0 text-sage-700') + '<span>' + E(s) + '</span></li>'; }).join('') + '</ul><p class="mt-4 text-sm text-cocoa/70">This page cannot diagnose you. Many conditions share the same symptoms, so an examination is needed.</p>');
    }
    function renderWhen() {
      return block('when-to-see-us', 'ServiceWhenToSee', 'When to see us promptly', '<div role="note" class="rounded-[2rem] bg-clay-50 p-7 shadow-clay"><div class="flex items-start gap-4"><span class="' + c.iconBall + '">' + UI.icon('alert-circle', 'h-6 w-6') + '</span><div><p class="font-semibold">Please book a visit soon if you notice any of these:</p><ul class="mt-4 space-y-3 text-cocoa/85">' + svc.whenToSeeUs.map(function (x) { return li('arrow-right', x); }).join('') + '</ul><p class="mt-5 text-sm text-cocoa/80">Trouble breathing or swallowing, bleeding that will not stop, or a swallowed button battery or magnet needs the nearest emergency department or <a class="font-semibold underline underline-offset-4" href="tel:999">999</a>.</p></div></div></div>');
    }
    function renderDiagnosis() {
      var ic = ['search', 'activity', 'layers'];
      return block('diagnosis', 'ServiceDiagnosis', 'How we find the cause', '<div class="grid gap-5 md:grid-cols-3">' + svc.diagnosis.map(function (d, i) { return '<div data-light data-reveal="pop" data-delay="' + (i * 100) + '" class="' + cardCls() + '"><span class="' + c.iconBall + '">' + UI.icon(ic[i % 3], 'h-6 w-6') + '</span><h3 class="mt-4 ' + c.h3 + '">' + E(d.title) + '</h3><p class="mt-2 text-sm leading-relaxed text-cocoa/80">' + E(d.description) + '</p></div>'; }).join('') + '</div>');
    }
    function renderTreatments() {
      var n = svc.treatments.length;
      return block('treatments', 'ServiceTreatments', 'Treatment, gentlest first', '<p class="mb-8 text-cocoa/80">Each step is tried only if the one before has not been enough for you.</p><div class="' + c.stage + '"><div class="' + c.preserve + ' space-y-5">' + svc.treatments.map(function (t, i) {
        var tag = i === 0 ? 'Gentlest' : i === n - 1 ? 'Surgical' : 'Step ' + (i + 1);
        return '<div class="' + c.preserve + ' md:[transform:translateZ(' + (i * 30) + 'px)] ' + ['md:ml-0', 'md:ml-6', 'md:ml-12', 'md:ml-[4.5rem]'][i % 4] + '"><div data-scroll-tilt data-light class="flex items-start gap-4 ' + cardCls() + '"><span class="font-display text-4xl font-semibold text-clay-300" aria-hidden="true">' + UI.pad(i + 1) + '</span><div class="flex-1"><div class="flex flex-wrap items-center gap-3"><h3 class="' + c.h3 + '">' + E(t.title) + '</h3>' + UI.badge(tag) + '</div><p class="mt-2 text-sm leading-relaxed text-cocoa/80">' + E(t.description) + '</p></div></div></div>';
      }).join('') + '</div></div>');
    }
    function renderProcedure() {
      var p = svc.procedure, facts = [['clock', 'Duration', p.duration], ['shield', 'Anaesthesia', p.anaesthesia], ['building', 'Hospital stay', p.hospitalStay]];
      return block('procedure', 'ServiceProcedure', 'What happens, step by step', '<div class="grid gap-4 sm:grid-cols-3">' + facts.map(function (f) { return '<div class="' + cardCls() + '"><div class="flex items-center gap-2 text-clay-700">' + UI.icon(f[0], 'h-5 w-5') + '<span class="text-xs font-semibold uppercase tracking-[0.14em]">' + f[1] + '</span></div><p class="mt-2 text-sm font-semibold">' + E(f[2]) + '</p></div>'; }).join('') + '</div>' +
        '<ol class="relative mt-8 space-y-5 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-1 before:rounded-full before:bg-clay-200">' + p.steps.map(function (s, i) { return '<li class="relative pl-16"><span class="absolute left-0 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-clay-grad font-display font-semibold text-white shadow-clay-btn">' + (i + 1) + '</span><div data-scroll-tilt class="' + cardCls() + '"><h3 class="' + c.h3 + '">' + E(s.title) + '</h3><p class="mt-2 text-sm leading-relaxed text-cocoa/80">' + E(s.description) + '</p></div></li>'; }).join('') + '</ol>');
    }
    function renderRecovery() {
      var cards = svc.recovery.map(function (r) { return '<div class="flex h-full flex-col rounded-[2rem] bg-cream p-6 text-cocoa shadow-clay-lg">' + UI.badge(r.phase) + '<h3 class="mt-4 ' + c.h3 + '">' + E(r.title) + '</h3><p class="mt-2 text-sm leading-relaxed text-cocoa/80">' + E(r.description) + '</p></div>'; });
      return block('recovery', 'ServiceRecovery', 'Recovery, phase by phase', '<p class="mb-8 text-cocoa/80">Turn the ring with the arrows to move through each phase. Everyone heals at their own pace.</p>' + UI.ring(cards, { itemWidth: 'w-[250px] sm:w-[300px]', label: 'Recovery phases' }));
    }
    function renderRisks() {
      return block('risks', 'ServiceRisks', 'Risks, stated plainly', '<div class="grid gap-5 md:grid-cols-3">' + svc.risks.map(function (r) { return '<div class="' + cardCls() + '"><span class="' + c.iconBall + '">' + UI.icon('info', 'h-6 w-6') + '</span><h3 class="mt-4 ' + c.h3 + '">' + E(r.title) + '</h3><p class="mt-2 text-sm leading-relaxed text-cocoa/80">' + E(r.description) + '</p></div>'; }).join('') + '</div><p class="mt-4 text-sm text-cocoa/70">Your surgeon explains the risks that apply to you before you agree to anything.</p>');
    }
    function renderPricing() {
      var p = svc.pricing;
      return block('pricing', 'ServicePricing', 'Fees and what they include', '<div class="rounded-[2.5rem] bg-cream p-7 shadow-clay-lg"><p class="font-display text-3xl font-semibold">' + range + '</p><p class="text-sm text-cocoa/70">' + E(svc.priceUnit) + '</p><div class="mt-6 grid gap-6 md:grid-cols-2"><div><h3 class="font-semibold">Usually included</h3><ul class="mt-3 space-y-2 text-sm">' + p.inclusions.map(function (x) { return li('check', x, 'text-sage-700'); }).join('') + '</ul></div><div><h3 class="font-semibold">Usually extra</h3><ul class="mt-3 space-y-2 text-sm">' + p.exclusions.map(function (x) { return li('minus', x, 'text-cocoa/60'); }).join('') + '</ul></div></div>' +
        '<p class="mt-6 text-sm text-cocoa/80">' + E(p.note) + '</p><ul class="mt-5 flex flex-wrap gap-2" aria-label="Payment options">' + p.paymentOptions.map(function (x) { return '<li class="rounded-full bg-cream-100 px-4 py-2 text-sm font-semibold shadow-well">' + E(x) + '</li>'; }).join('') + '</ul></div>');
    }
    function renderFaqs() {
      return block('faqs', 'ServiceFaqs', 'Questions people ask', '<div data-accordion data-accordion-single class="space-y-4">' + svc.faqs.map(function (f, i) { return UI.faqItem({ id: f.id, question: f.question, answerHTML: '<p>' + E(f.answer) + '</p>', tone: 'light', open: i === 0 }); }).join('') + '</div>');
    }
    var parts = [['overview', 'Overview', renderOverview], ['symptoms', 'Symptoms', renderSymptoms], ['when-to-see-us', 'When to see us', renderWhen], ['diagnosis', 'Diagnosis', renderDiagnosis], ['treatments', 'Treatments', renderTreatments], ['procedure', 'Procedure', renderProcedure], ['recovery', 'Recovery', renderRecovery], ['risks', 'Risks', renderRisks], ['pricing', 'Pricing', renderPricing], ['faqs', 'FAQs', renderFaqs]];
    var navCls = 'block whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold text-cocoa/80 transition hover:bg-clay-50 aria-[current=true]:bg-clay-grad aria-[current=true]:text-white aria-[current=true]:shadow-clay-btn focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40';
    var nav = '<nav aria-label="On this page" data-component="ServiceNav" class="sticky top-20 z-30 -mx-5 bg-cream px-5 py-2 lg:top-28 lg:mx-0 lg:self-start lg:rounded-[2rem] lg:p-3 lg:shadow-clay"><ul class="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:overflow-visible">' + parts.map(function (p) { return '<li><a href="#' + p[0] + '" data-spy="' + p[0] + '" class="' + navCls + '">' + p[1] + '</a></li>'; }).join('') + '</ul></nav>';

    var feeRows = SITE.chambersIndex.map(function (ch) { return '<li class="flex items-baseline justify-between gap-3"><span>' + E(ch.area) + '</span><span class="font-semibold">' + UI.formatBDT(ch.fee.firstVisit) + ' <span class="font-normal text-cocoa/60">/ ' + UI.formatBDT(ch.fee.followUp) + '</span></span></li>'; }).join('');
    var aside = '<aside data-component="BookingCard" class="lg:sticky lg:top-28 lg:self-start"><div class="hidden rounded-[2.5rem] bg-cream p-7 shadow-clay-lg lg:block"><h2 class="font-display text-2xl font-semibold">Book this service</h2><p class="mt-4 font-display text-3xl font-semibold">' + range + '</p><p class="text-sm text-cocoa/70">' + E(svc.priceUnit) + '</p>' +
      '<p class="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-cocoa/60">Consultation: first / follow-up</p><ul class="mt-2 space-y-2 text-sm">' + feeRows + '</ul><div class="mt-6 grid gap-3"><a href="' + bookUrl + '" class="' + c.btnPrimary + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="tel:' + SITE.contact.phone.e164 + '" class="' + c.btnSoft + '">' + UI.icon('phone', 'h-5 w-5') + E(SITE.contact.phone.display) + '</a><a href="' + SITE.contact.whatsappUrl + '" target="_blank" rel="noopener" class="' + c.btnSoft + '">' + UI.icon('message-circle', 'h-5 w-5') + 'WhatsApp</a></div><p class="mt-4 text-xs text-cocoa/60">Final quote after examination.</p></div></aside>';
    var bar = '<div id="book-bar" data-component="BookingBar" class="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 lg:hidden"><div class="pointer-events-auto flex items-center gap-2 rounded-full bg-cream p-2 shadow-clay-lg"><a href="' + bookUrl + '" class="' + c.btnPrimary + ' !px-5 !py-3 text-sm">Book Appointment</a><a href="tel:' + SITE.contact.phone.e164 + '" aria-label="Call ' + E(SITE.contact.phone.display) + '" class="' + c.arrowBtn + ' !h-12 !w-12">' + UI.icon('phone', 'h-5 w-5') + '</a></div></div>';
    document.getElementById('body-mount').outerHTML = '<section id="details" data-section="details" data-component="ServiceBody" class="' + c.secCream + ' !pt-8 md:!pt-16"><div class="' + c.container + ' grid gap-8 lg:grid-cols-[11.5rem_minmax(0,1fr)_18rem] lg:gap-10">' + nav + '<div class="min-w-0 space-y-16 md:space-y-20">' + parts.map(function (p) { return p[2](); }).join('') + '</div>' + aside + '</div></section>' + bar + UI.wave('blush');
    UI.mount(document.getElementById('details'));

    /* scroll-spy: highlights the in-page link of the section in view */
    var links = UI.qsa('[data-spy]'), sections = parts.map(function (p) { return document.getElementById(p[0]); });
    function mark(id) { links.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('data-spy') === id)); }); }
    mark('overview');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); }); }, { rootMargin: '-30% 0px -60% 0px' });
      sections.forEach(function (s) { if (s) io.observe(s); });
    }

    /* ---------- related care, previous / next, CTA ---------- */
    var all = SITE.servicesIndex, at = all.findIndex(function (s) { return s.slug === svc.slug; });
    var prev = all[(at + all.length - 1) % all.length], next = all[(at + 1) % all.length];
    var rel = svc.relatedSlugs.map(SITE.getService).filter(Boolean), posts = (svc.relatedBlogSlugs || []).map(SITE.getPost).filter(Boolean);
    function pn(s, dir) { return '<a href="' + SITE.url.service(s.slug) + '" class="' + c.btnSoft + ' !justify-between !rounded-[2rem] text-left">' + (dir < 0 ? UI.icon('arrow-left', 'h-5 w-5 shrink-0') : '') + '<span><span class="block text-xs font-normal text-cocoa/60">' + (dir < 0 ? 'Previous service' : 'Next service') + '</span>' + E(s.name) + '</span>' + (dir > 0 ? UI.icon('arrow-right', 'h-5 w-5 shrink-0') : '') + '</a>'; }
    document.getElementById('related-mount').outerHTML = '<section id="related" data-section="related" data-component="RelatedCare" class="' + c.secBlush + '"><div class="' + c.container + '">' + UI.sectionHead({ eyebrow: 'Related care', title: 'Often considered *alongside*', lead: 'Conditions of the ear, nose and throat are connected, so these services are often part of the same conversation.' }) +
      '<div class="mx-auto mt-12 grid max-w-3xl gap-x-8 gap-y-6 sm:grid-cols-2">' + rel.map(function (s) { return UI.serviceCard(s); }).join('') + '</div>' +
      (posts.length ? '<h3 class="mt-20 text-center ' + c.h3 + '">Read more</h3><div class="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">' + posts.map(function (p) { return UI.postCard(p); }).join('') + '</div>' : '') +
      '<div class="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-2">' + pn(prev, -1) + pn(next, 1) + '</div></div></section>' + UI.wave('cocoa');
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Ready to talk about *' + svc.name.split(' ')[0].replace(/[*,]/g, '') + '*?', lead: 'Book a first consultation in Sylhet or Dhaka. You will be examined, told what was found and given every option before any decision.', primaryLabel: 'Book Appointment', primaryHref: bookUrl, secondaryLabel: 'Call ' + SITE.contact.phone.display, secondaryHref: 'tel:' + SITE.contact.phone.e164 });
    UI.mount(document.getElementById('related')); UI.mount(document.getElementById('cta'));
  });
})();
