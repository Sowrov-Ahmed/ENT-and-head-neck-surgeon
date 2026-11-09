/*
 * js/pages/faqs.js
 * Path: js/pages/faqs.js · Owner: Part 2 · Purpose: searchable, tabbed FAQ page with helpful buttons and FAQPage JSON-LD
 * Depends on: SITE, UI, FX (kit), window.FAQS (js/data/faqs.js)
 */
(function () {
  'use strict';
  UI.ready(function () {
    var data = window.FAQS || { categories: [], items: [] };
    var cats = data.categories, items = data.items;
    var catById = {};
    cats.forEach(function (c) { catById[c.id] = c; });

    /* 1. hero */
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      eyebrow: 'Questions & answers', title: 'Clear answers, *before you ask*', tone: 'cream',
      lead: 'Eighteen plain-language answers about ears, nose, throat, children and booking. They are general information and cannot diagnose you.'
    });
    UI.mount(document.getElementById('page-hero'));

    /* 2. helpers */
    function answerHTML(item, prefix) {
      var cat = catById[item.categoryId];
      return '<p>' + UI.esc(item.answer) + '</p><div class="mt-5 flex flex-wrap items-center gap-3 text-sm" data-helpful-row="' + UI.esc(prefix + item.id) + '">' +
        (cat ? '<span class="mr-1">' + UI.badge(cat.name) + '</span>' : '') + '<span class="font-semibold text-cocoa">Was this helpful?</span>' +
        '<button type="button" data-helpful="yes" class="' + UI.cls.chip + ' !px-4 !py-2.5 min-h-[44px]">' + UI.icon('check', 'mr-1 inline h-4 w-4') + 'Yes</button>' +
        '<button type="button" data-helpful="no" class="' + UI.cls.chip + ' !px-4 !py-2.5 min-h-[44px]">Not really</button></div>';
    }
    function listHTML(list, prefix) {
      if (!list.length) {
        return '<div data-component="FaqEmpty" role="status" class="rounded-[2rem] bg-cream p-10 text-center shadow-clay"><span class="' + UI.cls.iconBall + ' mx-auto">' + UI.icon('search', 'h-6 w-6') + '</span><h3 class="mt-5 ' + UI.cls.h3 + '">No answers match that search</h3><p class="mx-auto mt-3 max-w-md text-cocoa/75">Try a simpler word such as ear, nose, fee or child, or ask the appointment desk directly on ' + UI.esc(SITE.contact.phone.display) + '.</p></div>';
      }
      return '<div data-component="FaqList" data-accordion data-accordion-single class="space-y-4">' + list.map(function (it, i) {
        return UI.faqItem({ id: prefix + it.id, question: it.question, answerHTML: answerHTML(it, prefix), tone: 'light', open: false });
      }).join('') + '</div>';
    }
    function byCat(id) { return items.filter(function (i) { return i.categoryId === id; }); }

    /* 3. browse section: search + tabs + accordion + side card */
    var tabBtns = '<button type="button" role="tab" id="faq-tab-all" data-tab="all" aria-selected="true" aria-controls="faq-panel-all" class="' + UI.cls.tab + ' min-h-[44px]">All questions</button>' +
      cats.map(function (c) { return '<button type="button" role="tab" id="faq-tab-' + UI.esc(c.slug) + '" data-tab="' + UI.esc(c.slug) + '" aria-selected="false" aria-controls="faq-panel-' + UI.esc(c.slug) + '" class="' + UI.cls.tab + ' min-h-[44px]">' + UI.esc(c.name) + '</button>'; }).join('');
    var panels = '<div role="tabpanel" id="faq-panel-all" data-tab-panel="all" aria-labelledby="faq-tab-all" tabindex="0"><h2 class="mb-5 ' + UI.cls.h3 + '">All questions</h2><div id="faq-all-list">' + listHTML(items, 'all-') + '</div></div>' +
      cats.map(function (c) {
        return '<div role="tabpanel" id="faq-panel-' + UI.esc(c.slug) + '" data-tab-panel="' + UI.esc(c.slug) + '" aria-labelledby="faq-tab-' + UI.esc(c.slug) + '" tabindex="0" class="hidden"><div class="mb-5 flex items-center gap-3"><span class="' + UI.cls.iconBall + ' !h-11 !w-11">' + UI.icon(c.icon, 'h-5 w-5') + '</span><h2 class="' + UI.cls.h3 + '">' + UI.esc(c.name) + '</h2></div>' + listHTML(byCat(c.id), c.slug + '-') + '</div>';
      }).join('');

    var aside = '<aside data-component="FaqHelpCard" aria-label="Still have a question" class="lg:sticky lg:top-28"><div data-reveal="pop" class="' + UI.cls.clayLg + ' p-7"><div data-light class="rounded-[1.75rem]"><span class="' + UI.cls.iconBall + '">' + UI.icon('message-circle', 'h-6 w-6') + '</span>' +
      '<h2 class="mt-5 ' + UI.cls.h3 + '">Still have a question?</h2><p class="mt-3 text-sm leading-relaxed text-cocoa/75">The clinic team answers calls and WhatsApp messages Saturday to Thursday. For anything urgent after surgery, use the urgent line.</p>' +
      '<div class="mt-6 flex flex-col gap-3"><a href="tel:' + SITE.contact.phone.e164 + '" class="' + UI.cls.btnPrimary + ' min-h-[44px]">' + UI.icon('phone', 'h-5 w-5') + UI.esc(SITE.contact.phone.display) + '</a>' +
      '<a href="' + SITE.contact.whatsappUrl + '" target="_blank" rel="noopener" class="' + UI.cls.btnSoft + ' min-h-[44px]">' + UI.icon('message-circle', 'h-5 w-5') + 'Message on WhatsApp</a>' +
      '<a href="' + SITE.routes.contact + '" class="' + UI.cls.btnGhost + ' min-h-[44px]">Send us a message' + UI.icon('arrow-right', 'h-4 w-4') + '</a></div>' +
      '<p class="mt-5 text-xs leading-relaxed text-cocoa/65">' + UI.esc(SITE.contact.deskHours) + '. In an emergency call ' + UI.esc(SITE.contact.nationalEmergency) + ' or go to the nearest emergency department.</p></div></div></aside>';

    var browse = UI.wave('blush') + '<section id="browse" data-section="browse" class="' + UI.cls.secBlush + '"><div class="' + UI.cls.container + '">' +
      '<div aria-hidden="true" data-parallax="0.12" class="pointer-events-none absolute right-[4%] top-12 hidden w-28 md:block">' + UI.deco(SITE.img.objects.orbGold, 'w-full motion-safe:animate-float') + '</div>' +
      '<div aria-hidden="true" data-parallax="0.1" class="pointer-events-none absolute left-[3%] bottom-16 hidden w-24 lg:block">' + UI.deco(SITE.img.objects.pill, 'w-full motion-safe:animate-float-slow') + '</div>' +
      '<div data-scroll-tilt class="relative mx-auto max-w-3xl"><div class="' + UI.cls.clayLg + ' p-6 md:p-8"><form id="faq-search-form" role="search" novalidate class="flex flex-col gap-3"><label for="faq-search" class="text-sm font-semibold">Search all questions</label>' +
      '<div class="relative"><span class="pointer-events-none absolute inset-y-0 left-5 flex items-center text-clay-700">' + UI.icon('search', 'h-5 w-5') + '</span><input id="faq-search" name="q" type="search" autocomplete="off" aria-describedby="faq-count faq-hint" class="w-full rounded-2xl bg-cream-100 py-3.5 pl-14 pr-5 text-cocoa shadow-well focus:bg-white focus:outline-none focus:ring-4 focus:ring-clay/30"></div>' +
      '<p id="faq-hint" class="text-xs text-cocoa/65">For example: cotton buds, nosebleed, bKash or adenoids.</p><p id="faq-count" role="status" aria-live="polite" class="text-xs text-cocoa/65"></p></form></div></div>' +
      '<div data-tabs class="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"><div class="min-w-0"><div role="tablist" aria-label="FAQ categories" class="mb-8 flex flex-wrap gap-3">' + tabBtns + '</div>' + panels + '</div>' + aside + '</div></div></section>' +
      UI.wave('cocoa');
    document.getElementById('browse-mount').outerHTML = browse;
    var section = document.getElementById('browse');
    UI.mount(section);

    document.getElementById('cta-mount').outerHTML = UI.ctaBand({
      title: 'Ready to *talk it through* in person?', lead: 'Book a first consultation in Sylhet or Dhaka. Bring your reports and we will take it from there.'
    });
    UI.mount(document.getElementById('cta'));

    /* 4. behaviour: tabs from hash, search, helpful buttons */
    var tabsRoot = section.querySelector('[data-tabs]');
    var countEl = document.getElementById('faq-count');
    function fromHash() {
      var h = decodeURIComponent((window.location.hash || '').replace('#', ''));
      if (h && tabsRoot.showTab && cats.some(function (c) { return c.slug === h; })) tabsRoot.showTab(h);
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);

    function runSearch() {
      var q = document.getElementById('faq-search').value.trim().toLowerCase();
      var list = !q ? items : items.filter(function (it) { return (it.question + ' ' + it.answer).toLowerCase().indexOf(q) !== -1; });
      var host = document.getElementById('faq-all-list');
      host.innerHTML = listHTML(list, 'all-');
      UI.mount(host);
      if (q && tabsRoot.showTab) tabsRoot.showTab('all');
      countEl.textContent = q ? (list.length + (list.length === 1 ? ' answer found' : ' answers found')) : '';
    }
    document.getElementById('faq-search').addEventListener('input', UI.debounce(runSearch, 200));
    document.getElementById('faq-search-form').addEventListener('submit', function (e) { e.preventDefault(); runSearch(); });

    section.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-helpful]') : null;
      if (!b) return;
      var row = b.closest('[data-helpful-row]');
      if (row) {
        UI.qsa('[data-helpful]', row).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      }
      if (b.getAttribute('data-helpful') === 'yes') UI.toast('Thank you. We are glad that helped.', 'success');
      else UI.toast('Sorry about that. Please call or message the clinic and we will answer properly.', 'info');
    });

    /* 5. FAQPage JSON-LD */
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: items.map(function (it) { return { '@type': 'Question', name: it.question, acceptedAnswer: { '@type': 'Answer', text: it.answer } }; })
    });
    document.head.appendChild(ld);
  });
})();
