/*
 * js/pages/blog.js — Blog listing: featured post, filter toolbar, paginated grid, topics, newsletter
 * Path: js/pages/blog.js · Owner: Part 5 · Purpose: renders the journal index from SITE.blogIndex + BLOGS and keeps ?category=&q=&page= in the URL
 * Depends on: SITE, UI, FX (kit), window.BLOGS (js/data/blogs.js) · Exposes: nothing
 */
(function () {
  'use strict';
  var PER_PAGE = 6;
  var SORTS = [{ v: 'newest', l: 'Newest first' }, { v: 'oldest', l: 'Oldest first' }, { v: 'popular', l: 'Most read' }, { v: 'short', l: 'Shortest read' }];

  UI.ready(function () {
    var details = window.BLOGS || [];
    var posts = SITE.blogIndex.map(function (p) {
      var d = details.filter(function (x) { return x.slug === p.slug; })[0] || {};
      return Object.assign({}, p, d, { tags: d.tags || [], views: d.views || 0 });
    });
    var cats = SITE.blogCategories;
    var state = readUrl();

    function readUrl() {
      var c = UI.getParam('category'), valid = cats.some(function (x) { return x.slug === c; });
      return { category: valid ? c : 'all', q: (UI.getParam('q') || '').trim().slice(0, 80), sort: 'newest', page: Math.max(1, parseInt(UI.getParam('page'), 10) || 1) };
    }
    function syncUrl() {
      var p = new URLSearchParams();
      if (state.category !== 'all') p.set('category', state.category);
      if (state.q) p.set('q', state.q);
      if (state.page > 1) p.set('page', String(state.page));
      var qs = p.toString();
      try { window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '')); } catch (e) { /* storage or history unavailable */ }
    }
    function filtered() {
      var q = state.q.toLowerCase();
      var list = posts.filter(function (p) {
        if (state.category !== 'all' && p.categorySlug !== state.category) return false;
        if (!q) return true;
        return (p.title + ' ' + p.excerpt + ' ' + p.category + ' ' + p.tags.join(' ')).toLowerCase().indexOf(q) > -1;
      });
      list.sort(function (a, b) {
        if (state.sort === 'oldest') return a.date < b.date ? -1 : 1;
        if (state.sort === 'popular') return b.views - a.views;
        if (state.sort === 'short') return a.readMinutes - b.readMinutes || (a.date < b.date ? 1 : -1);
        return a.date < b.date ? 1 : -1;
      });
      return list;
    }
    function countFor(slug) { return posts.filter(function (p) { return slug === 'all' || p.categorySlug === slug; }).length; }

    /* ---------- hero with search ---------- */
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      eyebrow: 'The ENT journal', title: 'Plain answers for *ear, nose and throat* worries', tone: 'blush',
      lead: 'Eight short articles written by Dr. Ashfaq Talukder’s team: what is normal, what is not, and when it is time to see a doctor.',
      actionsHTML: '<form id="blog-search-form" role="search" novalidate class="flex w-full max-w-xl items-center gap-2 rounded-full bg-cream p-2 shadow-clay-lg"><label for="blog-search" class="sr-only">Search articles</label>' +
        '<span class="ml-3 text-clay-700">' + UI.icon('search', 'h-5 w-5') + '</span><input id="blog-search" name="q" type="search" autocomplete="off" maxlength="80" value="' + UI.esc(state.q) + '" title="Search articles, for example ear wax, vertigo or snoring" class="min-h-[48px] w-full min-w-0 rounded-full bg-transparent px-2 text-cocoa focus:outline-none">' +
        '<button type="submit" class="' + UI.cls.btnPrimary + ' !px-6 !py-3">Search</button></form>'
    });
    UI.mount(document.getElementById('page-hero'));

    /* ---------- featured (newest) ---------- */
    var latest = posts.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; })[0], ob = SITE.img.objects;
    var featured = '<section id="featured" data-section="featured" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Latest article', title: 'Fresh from the *chamber*', lead: 'The newest piece in the journal, written for patients and families.', tone: 'light' }) +
      '<div class="relative mt-16"><div aria-hidden="true" data-parallax="0.12" class="pointer-events-none absolute -left-2 -top-12 hidden w-28 md:block">' + UI.deco(ob.orbGold, 'w-full motion-safe:animate-float') + '</div>' +
      '<div aria-hidden="true" data-parallax="0.08" class="pointer-events-none absolute -bottom-10 -right-2 hidden w-24 md:block">' + UI.deco(ob.cone, 'w-full motion-safe:animate-float-slow') + '</div>' +
      '<div data-reveal="pop"><div class="' + UI.cls.stage + '"><div data-orbit="3" class="' + UI.cls.preserve + '">' +
      '<article data-component="FeaturedPost" data-light class="group relative grid gap-10 rounded-[2.5rem] bg-cream p-5 text-cocoa shadow-clay-lg ' + UI.cls.preserve + ' md:p-8 lg:grid-cols-2 lg:items-center">' +
      '<span aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-[2.5rem] opacity-0 transition duration-500 group-hover:opacity-100 [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,30%),rgba(255,255,255,.65),transparent_62%)]"></span>' +
      '<div class="relative rounded-[2rem] bg-clay-50 p-3 shadow-well [transform:translateZ(40px)]">' + UI.img(latest.image, latest.title, 'aspect-[16/10] w-full rounded-[1.5rem] object-cover', { w: 800, h: 500 }) +
      '<div aria-hidden="true" class="pointer-events-none absolute -right-4 -top-8 w-20 [transform:translateZ(90px)] md:w-24">' + UI.deco(ob.orbSage, 'w-full motion-safe:animate-float') + '</div>' +
      '<div aria-hidden="true" class="pointer-events-none absolute -bottom-6 -left-4 w-16 [transform:translateZ(70px)] md:w-20">' + UI.deco(ob.pill, 'w-full motion-safe:animate-float-slow') + '</div></div>' +
      '<div class="relative [transform:translateZ(20px)]"><div class="flex flex-wrap items-center gap-3">' + UI.badge(latest.category) + '<span class="text-sm text-cocoa/65">' + UI.formatDate(latest.date, 'long') + ' · ' + latest.readMinutes + ' min read</span></div>' +
      '<h3 class="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">' + UI.esc(latest.title) + '</h3><p class="mt-5 text-lg leading-relaxed text-cocoa/75">' + UI.esc(latest.excerpt) + '</p>' +
      '<ul class="mt-6 flex flex-wrap gap-2">' + latest.tags.map(function (t) { return '<li class="rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-cocoa/75 shadow-well">' + UI.esc(t) + '</li>'; }).join('') + '</ul>' +
      '<a href="' + SITE.url.blog(latest.slug) + '" class="' + UI.cls.btnPrimary + ' mt-8">Read the article' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div></article></div></div></div></div></div></section>';

    /* ---------- toolbar + grid ---------- */
    var chips = [{ slug: 'all', name: 'All' }].concat(cats).map(function (c) {
      return '<button type="button" class="' + UI.cls.chip + ' min-h-[44px]" data-filter="' + c.slug + '" aria-pressed="' + (state.category === c.slug) + '">' + UI.esc(c.name) + ' <span class="opacity-70">(' + countFor(c.slug) + ')</span></button>';
    }).join('');
    var sortSel = '<div class="relative"><label for="blog-sort" class="sr-only">Sort articles</label><select id="blog-sort" name="sort" class="min-h-[48px] w-full appearance-none rounded-full bg-cream-100 py-3 pl-5 pr-12 font-semibold text-cocoa shadow-well focus:outline-none focus:ring-4 focus:ring-clay/30">' +
      SORTS.map(function (s) { return '<option value="' + s.v + '">' + UI.esc(s.l) + '</option>'; }).join('') + '</select><span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-clay-700">' + UI.icon('chevron-down', 'h-5 w-5') + '</span></div>';
    var browse = '<section id="browse" data-section="browse" class="' + UI.cls.secBlush + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'All articles', title: 'Browse by *topic*', lead: 'Pick a category, search above or change the order. Everything here is general information and cannot diagnose you.', tone: 'light' }) +
      '<div data-component="BlogToolbar" class="mt-14 rounded-[2.5rem] bg-cream p-5 shadow-clay-lg md:p-7"><div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div id="blog-chips" role="group" aria-label="Filter by category" class="flex flex-wrap gap-3">' + chips + '</div><div class="w-full lg:w-60">' + sortSel + '</div></div>' +
      '<p id="blog-count" role="status" aria-live="polite" class="mt-5 text-sm font-semibold text-cocoa/70"></p></div>' +
      '<div id="blog-grid" data-component="PostGrid" class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"></div><nav id="blog-pager" aria-label="Article pages" class="mt-12 flex flex-wrap items-center justify-center gap-3"></nav></div></section>';

    /* ---------- topics ---------- */
    var tagCount = {};
    posts.forEach(function (p) { p.tags.forEach(function (t) { tagCount[t] = (tagCount[t] || 0) + 1; }); });
    var tags = Object.keys(tagCount).sort(function (a, b) { return tagCount[b] - tagCount[a] || (a < b ? -1 : 1); }).slice(0, 12);
    var top = posts.slice().sort(function (a, b) { return b.views - a.views; }).slice(0, 3);
    var topics = '<section id="topics" data-section="topics" class="' + UI.cls.secSage + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Topics', title: 'What readers *look for* most', tone: 'light' }) +
      '<div class="mt-14 grid gap-8 lg:grid-cols-3">' +
      '<div data-reveal="tilt" data-component="TagCloud" class="rounded-[2rem] bg-cream p-7 shadow-clay"><h3 class="' + UI.cls.h3 + '">Popular tags</h3><p class="mt-2 text-sm text-cocoa/70">Tap a tag to search the journal.</p><div class="mt-5 flex flex-wrap gap-2">' +
      tags.map(function (t) { return '<button type="button" data-tag="' + UI.esc(t) + '" class="' + UI.cls.chip + ' min-h-[44px] !px-4 !py-2">' + UI.esc(t) + '</button>'; }).join('') + '</div></div>' +
      '<div data-reveal="tilt" data-delay="100" data-component="MostRead" class="rounded-[2rem] bg-cream p-7 shadow-clay"><h3 class="' + UI.cls.h3 + '">Most read</h3><ol class="mt-5 space-y-5">' +
      top.map(function (p, i) { return '<li class="flex items-start gap-4"><span class="' + UI.cls.iconBall + ' !h-11 !w-11 font-display text-lg font-semibold">' + (i + 1) + '</span><a href="' + SITE.url.blog(p.slug) + '" class="block min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40"><span class="block font-display text-base font-semibold leading-snug">' + UI.esc(p.title) + '</span><span class="mt-1 block text-xs text-cocoa/60">' + p.views.toLocaleString('en-US') + ' reads · ' + p.readMinutes + ' min</span></a></li>'; }).join('') + '</ol></div>' +
      '<div id="newsletter-box" data-reveal="tilt" data-delay="200" data-component="NewsletterCard" class="rounded-[2rem] bg-cream p-7 shadow-clay"><h3 class="' + UI.cls.h3 + '">One article a month</h3><p class="mt-2 text-sm leading-relaxed text-cocoa/70">A short, plain-language note from the clinic. No advertising and you can leave at any time.</p>' +
      '<form id="newsletter-form" novalidate class="mt-5 space-y-4">' + UI.field({ label: 'Email address', name: 'email', type: 'email', required: true, hint: 'We use your address only to send the journal.', autocomplete: 'email' }) +
      '<button type="submit" class="' + UI.cls.btnPrimary + ' w-full">Subscribe' + UI.icon('send', 'h-5 w-5') + '</button></form></div></div></div></section>';

    var cta = UI.ctaBand({ title: 'Worried about a symptom? *Ask in person*', lead: 'Articles help you understand a problem, but only an examination can tell what is causing it. Book a visit in Sylhet or Dhaka.' });
    document.getElementById('blog-mount').outerHTML = UI.wave('cream') + featured + UI.wave('blush') + browse + UI.wave('sage') + topics + UI.wave('cocoa') + cta;
    ['featured', 'browse', 'topics', 'cta'].forEach(function (id) { UI.mount(document.getElementById(id)); });

    /* ---------- render grid ---------- */
    var grid = document.getElementById('blog-grid'), pager = document.getElementById('blog-pager'), count = document.getElementById('blog-count');
    function render() {
      var list = filtered(), pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      state.page = Math.min(Math.max(1, state.page), pages);
      var slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
      var label = state.category === 'all' ? '' : ' in ' + (cats.filter(function (c) { return c.slug === state.category; })[0] || {}).name;
      count.textContent = list.length ? 'Showing ' + (slice.length ? (state.page - 1) * PER_PAGE + 1 : 0) + '–' + ((state.page - 1) * PER_PAGE + slice.length) + ' of ' + list.length + (list.length === 1 ? ' article' : ' articles') + label + (state.q ? ' for “' + state.q + '”' : '') : 'No articles found' + label + (state.q ? ' for “' + state.q + '”' : '');
      grid.innerHTML = slice.length ? slice.map(function (p) { return UI.postCard(p); }).join('') :
        '<div data-component="EmptyState" class="col-span-full rounded-[2rem] bg-cream p-10 text-center shadow-clay"><span class="' + UI.cls.iconBall + ' mx-auto">' + UI.icon('search', 'h-6 w-6') + '</span><h3 class="mt-5 ' + UI.cls.h3 + '">No articles match yet</h3><p class="mx-auto mt-3 max-w-md text-cocoa/75">Try a shorter word such as “ear” or “nose”, or clear the filters to see every article.</p><button type="button" data-reset class="' + UI.cls.btnPrimary + ' mt-6">Clear filters</button></div>';
      var btn = 'flex h-12 w-12 items-center justify-center rounded-full bg-cream font-semibold text-cocoa shadow-clay transition duration-300 hover:-translate-y-0.5 aria-[current=page]:bg-clay-grad aria-[current=page]:text-white aria-[current=page]:shadow-clay-btn focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40 disabled:opacity-40';
      var h = '';
      if (pages > 1) {
        h += '<button type="button" data-page="' + (state.page - 1) + '" aria-label="Previous page" class="' + btn + '"' + (state.page === 1 ? ' disabled' : '') + '>' + UI.icon('chevron-left', 'h-5 w-5') + '</button>';
        for (var i = 1; i <= pages; i++) h += '<button type="button" data-page="' + i + '" aria-label="Page ' + i + '" class="' + btn + '"' + (i === state.page ? ' aria-current="page"' : '') + '>' + i + '</button>';
        h += '<button type="button" data-page="' + (state.page + 1) + '" aria-label="Next page" class="' + btn + '"' + (state.page === pages ? ' disabled' : '') + '>' + UI.icon('chevron-right', 'h-5 w-5') + '</button>';
      }
      pager.innerHTML = h; pager.classList.toggle('hidden', pages < 2);
      UI.qsa('#blog-chips [data-filter]').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === state.category)); });
      document.getElementById('blog-sort').value = state.sort;
      UI.mount(grid); syncUrl();
    }
    function toGrid() { var el = document.getElementById('browse'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: FX.reduced() ? 'auto' : 'smooth', block: 'start' }); }

    document.getElementById('blog-chips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]'); if (!b) return;
      state.category = b.getAttribute('data-filter'); state.page = 1; render();
    });
    document.getElementById('blog-sort').addEventListener('change', function (e) { state.sort = e.target.value; state.page = 1; render(); });
    pager.addEventListener('click', function (e) {
      var b = e.target.closest('[data-page]'); if (!b || b.disabled) return;
      state.page = parseInt(b.getAttribute('data-page'), 10) || 1; render(); toGrid();
    });
    grid.addEventListener('click', function (e) {
      if (!e.target.closest('[data-reset]')) return;
      state.category = 'all'; state.q = ''; state.page = 1; document.getElementById('blog-search').value = ''; render();
    });
    var search = document.getElementById('blog-search');
    var apply = function () { state.q = search.value.trim().slice(0, 80); state.page = 1; render(); };
    search.addEventListener('input', UI.debounce(apply, 250));
    document.getElementById('blog-search-form').addEventListener('submit', function (e) { e.preventDefault(); apply(); toGrid(); });
    document.getElementById('topics').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tag]'); if (!b) return;
      state.q = b.getAttribute('data-tag'); state.category = 'all'; state.page = 1; search.value = state.q; render(); toGrid();
    });

    /* ---------- newsletter ---------- */
    var form = document.getElementById('newsletter-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!UI.validateForm(form)) return;
      var button = form.querySelector('button[type="submit"]'); button.disabled = true; button.textContent = 'Subscribing…';
      SITE.submit('newsletter', { email: form.elements.email.value.trim() }).then(function (res) {
        form.outerHTML = '<div role="status" data-component="NewsletterSuccess" class="mt-5 rounded-2xl bg-sage-100 p-5 text-sage-700"><p class="flex items-center gap-2 font-display text-lg font-semibold">' + UI.icon('check-circle', 'h-6 w-6') + 'You are subscribed</p><p class="mt-2 text-sm">Thank you. Your reference is <b>' + UI.esc(res.id) + '</b>. The next article will reach you by email.</p></div>';
      });
    });

    render();
  });
})();
