/*
 * js/pages/blog-details.js — Single article page (?slug=)
 * Path: js/pages/blog-details.js · Owner: Part 5 · Purpose: renders one article from SITE.blogIndex + BLOGS with table of contents, share tools, related content and JSON-LD
 * Depends on: SITE, UI, FX (kit), window.BLOGS (js/data/blogs.js) · Exposes: nothing
 */
(function () {
  'use strict';
  var SUFFIX = ' | Dr. Ashfaqur Rahman Talukder – ENT Specialist';

  function setMeta(selector, attr, value) { var el = document.querySelector(selector); if (el) el.setAttribute(attr, value); }
  function inline(text) { return UI.esc(text).replace(/\*\*(.+?)\*\*/g, '<b class="font-semibold text-cocoa">$1</b>'); }
  function wave(next) { return UI.wave(next); }

  UI.ready(function () {
    var slug = UI.getParam('slug') || '', idx = SITE.getPost(slug), mount = document.getElementById('article-mount');
    var all = SITE.blogIndex.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (!idx) { renderNotFound(); return; }
    var detail = (window.BLOGS || []).filter(function (x) { return x.slug === slug; })[0] || {};
    var post = Object.assign({ tags: [], keyTakeaways: [], content: [], relatedSlugs: [], serviceSlugs: [], views: 0, summary: idx.excerpt }, idx, detail);
    var d = SITE.doctor, ob = SITE.img.objects, pageUrl = window.location.href.split('#')[0];

    /* ---------- document head + JSON-LD ---------- */
    document.title = post.title.split(/[:?] /)[0] + SUFFIX;
    setMeta('meta[name="description"]', 'content', post.summary);
    setMeta('meta[property="og:title"]', 'content', post.title);
    setMeta('meta[property="og:description"]', 'content', post.summary);
    var ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.summary, datePublished: post.date, image: post.image, keywords: post.tags.join(', '),
      author: { '@type': 'Person', name: d.name, jobTitle: 'ENT and Head–Neck Surgeon' }, publisher: { '@type': 'Organization', name: SITE.brand.name, url: 'https://' + SITE.brand.domain } }).replace(/</g, '\\u003c');
    document.head.appendChild(ld);

    /* ---------- hero ---------- */
    var parts = post.title.split(': '), heroTitle = parts.length > 1 ? parts[0] + ': *' + parts.slice(1).join(': ') + '*' : post.title;
    var pill = function (icon, text) { return '<span class="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold shadow-clay">' + UI.icon(icon, 'h-4 w-4 text-clay-600') + UI.esc(text) + '</span>'; };
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      eyebrow: post.category, title: heroTitle, lead: post.excerpt, tone: 'mist',
      actionsHTML: pill('calendar', UI.formatDate(post.date, 'long')) + pill('clock', post.readMinutes + ' min read') + pill('eye', post.views.toLocaleString('en-US') + ' reads') + pill('user', 'By ' + d.shortName)
    });
    UI.mount(document.getElementById('page-hero'));

    /* ---------- body blocks + headings ---------- */
    var heads = [], first = true;
    function list(b, ordered) {
      return '<' + (ordered ? 'ol' : 'ul') + ' class="mt-6 space-y-3">' + b.items.map(function (it, i) {
        return '<li class="flex gap-4 text-lg leading-relaxed text-cocoa/85"><span aria-hidden="true" class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orb text-xs font-bold text-clay-700 shadow-clay">' + (ordered ? i + 1 : UI.icon('check', 'h-3.5 w-3.5')) + '</span><span>' + inline(it) + '</span></li>';
      }).join('') + '</' + (ordered ? 'ol' : 'ul') + '>';
    }
    function block(b) {
      if (b.type === 'h2') { var id = 'sec-' + (heads.length + 1) + '-' + UI.slugify(b.text).slice(0, 36); heads.push({ id: id, text: b.text }); return '<h2 id="' + id + '" class="mt-14 scroll-mt-28 font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl">' + UI.esc(b.text) + '</h2>'; }
      if (b.type === 'p') { var cap = first ? ' first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-clay-600' : ''; first = false; return '<p class="mt-6 text-lg leading-[1.8] text-cocoa/85' + cap + '">' + inline(b.text) + '</p>'; }
      if (b.type === 'ul') return list(b, false);
      if (b.type === 'ol') return list(b, true);
      if (b.type === 'quote') return '<figure data-component="PullQuote" class="mt-8 rounded-[2rem] bg-cream-100 p-7 shadow-well"><blockquote class="font-display text-xl font-semibold leading-snug">' + inline(b.text) + '</blockquote>' + (b.cite ? '<figcaption class="mt-3 text-sm text-cocoa/65">' + UI.esc(b.cite) + '</figcaption>' : '') + '</figure>';
      if (b.type === 'callout') { var warn = b.tone === 'warning'; return '<div role="note" data-component="Callout" data-light class="mt-8 flex gap-4 rounded-[2rem] bg-cream p-6 shadow-clay"><span class="' + UI.cls.iconBall + (warn ? ' !bg-orb-gold' : ' !bg-orb-sage') + '">' + UI.icon(warn ? 'alert-circle' : 'sparkles', 'h-6 w-6') + '</span><div><p class="font-display text-lg font-semibold">' + UI.esc(b.title) + '</p><p class="mt-2 leading-relaxed text-cocoa/80">' + inline(b.text) + '</p></div></div>'; }
      return '';
    }
    var body = post.content.map(block).join('');

    var tocLinks = '<ol class="space-y-1">' + heads.map(function (h, i) { return '<li><a data-toc-link href="#' + h.id + '" class="flex min-h-[44px] items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-cocoa/80 transition hover:bg-cream-100 aria-[current=true]:bg-clay-100 aria-[current=true]:text-clay-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40"><span class="text-xs text-clay-600">' + UI.pad(i + 1) + '</span><span>' + UI.esc(h.text) + '</span></a></li>'; }).join('') + '</ol>';
    var share = 'flex h-12 w-12 items-center justify-center rounded-full bg-cream text-cocoa shadow-clay transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40';
    var enc = encodeURIComponent(pageUrl), msg = encodeURIComponent(post.title + ' ' + pageUrl);
    var aside =
      '<aside class="hidden space-y-6 lg:sticky lg:top-28 lg:block lg:self-start" aria-label="Article tools">' +
      '<nav data-component="TableOfContents" aria-label="Table of contents" class="rounded-[2rem] bg-cream p-5 shadow-clay"><p class="px-3 font-display text-lg font-semibold">In this article</p><div class="mt-3">' + tocLinks + '</div></nav>' + takeaways() + sharer('d') + bookCard() + '</aside>';
    function takeaways() { return '<div data-component="KeyTakeaways" class="rounded-[2rem] bg-cream p-6 shadow-clay"><h2 class="font-display text-lg font-semibold">Key takeaways</h2><ul class="mt-4 space-y-3">' + post.keyTakeaways.map(function (t) { return '<li class="flex gap-3 text-sm leading-relaxed text-cocoa/80">' + UI.icon('check-circle', 'mt-0.5 h-5 w-5 shrink-0 text-sage-600') + '<span>' + UI.esc(t) + '</span></li>'; }).join('') + '</ul></div>'; }
    function sharer(k) { return '<div data-component="ShareTools" class="rounded-[2rem] bg-cream p-6 shadow-clay"><p class="font-display text-lg font-semibold">Share this article</p><div class="mt-4 flex gap-3">' +
      '<button type="button" data-copy-link aria-label="Copy link to this article" class="' + share + '">' + UI.icon('copy', 'h-5 w-5') + '</button>' +
      '<a href="https://wa.me/?text=' + msg + '" target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp (opens in a new tab)" class="' + share + '">' + UI.icon('message-circle', 'h-5 w-5') + '</a>' +
      '<a href="https://www.facebook.com/sharer/sharer.php?u=' + enc + '" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook (opens in a new tab)" class="' + share + '">' + UI.icon('facebook', 'h-5 w-5') + '</a>' +
      '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + enc + '" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn (opens in a new tab)" class="' + share + '">' + UI.icon('linkedin', 'h-5 w-5') + '</a></div></div>'; }
    function bookCard() { return '<div data-component="BookCard" class="rounded-[2rem] bg-cocoa p-6 text-cream shadow-clay-dark"><p class="font-display text-xl font-semibold">Book a consultation</p><p class="mt-2 text-sm leading-relaxed text-cream/80">A short examination can tell what is causing your symptoms. Chambers in Sylhet and Dhaka.</p><a href="' + SITE.url.appointment({ service: post.serviceSlugs[0] }) + '" class="' + UI.cls.btnPrimary + ' mt-5 w-full">Book appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div>'; }

    /* ---------- article section ---------- */
    var article = '<section id="article" data-section="article" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '">' +
      '<div class="relative mx-auto max-w-4xl"><div class="' + UI.cls.stage + '"><div data-orbit="3" class="relative ' + UI.cls.preserve + '">' +
      '<div data-scroll-tilt><div data-component="ArticleCover" class="rounded-[2.5rem] bg-cream p-3 shadow-clay-lg">' + UI.img(post.image, post.title + ' – cover illustration', 'aspect-[16/10] w-full rounded-[2rem] object-cover', { w: 1200, h: 750, eager: true }) + '</div></div>' +
      '<div aria-hidden="true" class="pointer-events-none absolute -right-6 -top-10 hidden w-24 [transform:translateZ(90px)] md:block">' + UI.deco(ob.orbClay, 'w-full motion-safe:animate-float') + '</div>' +
      '<div aria-hidden="true" class="pointer-events-none absolute -bottom-8 -left-6 hidden w-20 [transform:translateZ(70px)] md:block">' + UI.deco(ob.orbSage, 'w-full motion-safe:animate-float-slow') + '</div></div></div>' +
      '<div aria-hidden="true" class="mx-auto mt-6 h-4 w-2/3 rounded-full bg-cocoa/20 blur-xl"></div>' +
      '<div aria-hidden="true" data-parallax="0.1" class="pointer-events-none absolute -left-24 top-1/2 hidden w-28 xl:block">' + UI.deco(ob.orbGold, 'w-full') + '</div></div>' +
      '<div class="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16"><div class="mx-auto w-full max-w-[68ch] break-words lg:mx-0">' +
      '<details id="toc-mobile" class="rounded-[2rem] bg-cream shadow-clay lg:hidden"><summary class="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 rounded-[2rem] px-6 py-3 font-display text-lg font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40">In this article' + UI.icon('chevron-down', 'h-5 w-5 text-clay-700') + '</summary><nav aria-label="Table of contents (mobile)" class="px-3 pb-4">' + tocLinks + '</nav></details>' +
      '<div data-component="ArticleBody">' + body + '</div>' +
      '<div class="mt-12 space-y-6 lg:hidden">' + takeaways() + sharer('m') + bookCard() + '</div></div>' + aside + '</div></div></section>';

    /* ---------- author, tags, disclaimer, emergency ---------- */
    var author = '<section id="author" data-section="author" class="' + UI.cls.secBlush + '"><div class="' + UI.cls.container + '"><div class="mx-auto max-w-4xl">' +
      '<div class="flex flex-wrap justify-center gap-2" data-component="TagList">' + post.tags.map(function (t) { return '<a href="blog.html?q=' + encodeURIComponent(t) + '" class="' + UI.cls.chip + ' inline-flex min-h-[44px] items-center !px-4 !py-2">' + UI.icon('tag', 'mr-2 h-4 w-4') + UI.esc(t) + '</a>'; }).join('') + '</div>' +
      '<div data-reveal="pop" data-component="AuthorCard" data-light class="mt-10 flex flex-col items-center gap-6 rounded-[2.5rem] bg-cream p-7 text-center shadow-clay-lg md:flex-row md:text-left"><div class="shrink-0 rounded-full bg-orb p-2 shadow-clay">' + UI.img(SITE.img.portrait, d.name + ', ENT and head–neck surgeon', 'h-32 w-32 rounded-full object-cover md:h-36 md:w-36', { w: 300, h: 300 }) + '</div>' +
      '<div><p class="' + UI.cls.eyebrow + '">Written and reviewed by</p><h2 class="mt-3 font-display text-2xl font-semibold md:text-3xl">' + UI.esc(d.name) + '</h2><p class="mt-2 text-cocoa/75">' + UI.esc(d.title) + '. BMDC reg. no. ' + UI.esc(d.bmdcNo) + '. ' + d.experienceYears + '+ years of ear, nose, throat and head–neck practice in Sylhet and Dhaka.</p><a href="' + SITE.routes.about + '" class="' + UI.cls.btnSoft + ' mt-5 !py-2.5">About the doctor' + UI.icon('arrow-right', 'h-4 w-4') + '</a></div></div>' +
      '<div class="mt-8 grid gap-6 md:grid-cols-2"><div data-component="Disclaimer" class="rounded-[2rem] bg-cream-100 p-6 shadow-well"><p class="flex items-center gap-2 font-display text-lg font-semibold">' + UI.icon('info', 'h-5 w-5 text-clay-600') + 'General information only</p><p class="mt-3 text-sm leading-relaxed text-cocoa/80">This article is general information, not a diagnosis. It cannot replace an examination, and it does not recommend any medicine brand or dose. Treatment depends on what is found when a doctor looks at you.</p></div>' +
      '<div data-component="EmergencyNote" class="rounded-[2rem] bg-cocoa p-6 text-cream shadow-clay-dark"><p class="flex items-center gap-2 font-display text-lg font-semibold">' + UI.icon('alert-circle', 'h-5 w-5 text-gold') + 'ENT emergencies</p><p class="mt-3 text-sm leading-relaxed text-cream/85">Trouble breathing or swallowing, a swallowed button battery or magnet, or bleeding that will not stop: go to the nearest emergency department or call <a href="tel:999" class="font-semibold text-gold underline">999</a>. Do not wait for a chamber appointment.</p></div></div></div></div></section>';

    /* ---------- related services ---------- */
    var svcs = post.serviceSlugs.map(function (s) { return SITE.getService(s); }).filter(Boolean);
    var services = svcs.length ? '<section id="related-services" data-section="related-services" class="' + UI.cls.secSage + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Related care', title: 'Where this *topic* meets treatment', lead: 'If this article describes you, these are the services the doctor offers for it.', tone: 'light' }) +
      '<div class="mx-auto mt-16 grid gap-x-8 gap-y-6 ' + (svcs.length > 1 ? 'max-w-3xl sm:grid-cols-2' : 'max-w-sm') + '">' + svcs.map(function (s) { return UI.serviceCard(s); }).join('') + '</div></div></section>' : '';

    /* ---------- prev / next + related articles ---------- */
    var pos = all.map(function (p) { return p.slug; }).indexOf(slug), prev = all[pos - 1], next = all[pos + 1];
    function nav(p, label, icon, right) { return '<a href="' + SITE.url.blog(p.slug) + '" data-light class="group flex min-h-[44px] flex-col gap-2 rounded-[2rem] bg-cream p-6 shadow-clay transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40' + (right ? ' text-right sm:items-end' : '') + '"><span class="inline-flex items-center gap-2 text-sm font-semibold text-clay-700">' + (right ? '' : UI.icon(icon, 'h-4 w-4')) + label + (right ? UI.icon(icon, 'h-4 w-4') : '') + '</span><span class="font-display text-lg font-semibold leading-snug">' + UI.esc(p.title) + '</span></a>'; }
    var related = post.relatedSlugs.map(function (s) { return SITE.getPost(s); }).filter(Boolean);
    var more = '<section id="more" data-section="more" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '">' +
      '<div class="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">' + (prev ? nav(prev, 'Previous article', 'arrow-left', false) : '<span class="hidden sm:block"></span>') + (next ? nav(next, 'Next article', 'arrow-right', true) : '') + '</div>' +
      '<div class="mt-20">' + UI.sectionHead({ eyebrow: 'Keep reading', title: 'Related *articles*', tone: 'light' }) + '</div>' +
      '<div class="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">' + related.map(function (p) { return UI.postCard(p); }).join('') + '</div></div></section>';
    var cta = UI.ctaBand({ title: 'Have a symptom that *worries you*?', lead: 'Reading helps, but an examination answers the question. Book a consultation in Sylhet or Dhaka.', primaryHref: SITE.url.appointment({ service: post.serviceSlugs[0] }) });

    mount.outerHTML = wave('cream') + article + wave('blush') + author + (services ? wave('sage') + services : '') + wave('cream') + more + wave('cocoa') + cta;
    ['article', 'author', 'related-services', 'more', 'cta'].forEach(function (id) { var el = document.getElementById(id); if (el) UI.mount(el); });

    /* ---------- behaviours ---------- */
    var toc = document.getElementById('toc-mobile');
    if (toc && window.matchMedia && window.matchMedia('(min-width: 1024px)').matches) toc.open = true;
    UI.qsa('[data-copy-link]').forEach(function (b) { b.addEventListener('click', function () { UI.copy(pageUrl); }); });
    if ('IntersectionObserver' in window && heads.length) {
      var links = UI.qsa('[data-toc-link]');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)); });
        });
      }, { rootMargin: '-15% 0px -70% 0px' });
      heads.forEach(function (h) { var el = document.getElementById(h.id); if (el) io.observe(el); });
    }

    function renderNotFound() {
      document.title = 'Article not found' + SUFFIX;
      document.getElementById('hero-mount').innerHTML = UI.pageHero({ eyebrow: 'Blog', title: 'This article could not be *found*', tone: 'mist', lead: 'The link may be old or mistyped. Every article in the journal is still one click away.' });
      UI.mount(document.getElementById('page-hero'));
      var latest = SITE.blogIndex.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
      mount.outerHTML = wave('cream') + '<section id="not-found" data-section="not-found" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '"><div data-component="NotFoundPanel" class="mx-auto max-w-2xl rounded-[2.5rem] bg-cream p-8 text-center shadow-clay-lg"><span class="' + UI.cls.iconBall + ' mx-auto">' + UI.icon('search', 'h-6 w-6') + '</span><h2 class="mt-5 ' + UI.cls.h3 + '">Article not found</h2><p class="mt-3 text-cocoa/75">We could not find an article with that address. Go back to the journal to browse by topic, or start with one of the latest pieces below.</p><a href="' + SITE.routes.blog + '" class="' + UI.cls.btnPrimary + ' mt-6">Back to all articles' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div>' +
        '<div class="mt-14 grid gap-8 md:grid-cols-3">' + latest.map(function (p) { return UI.postCard(p); }).join('') + '</div></div></section>';
      UI.mount(document.getElementById('not-found'));
    }
  });
})();
