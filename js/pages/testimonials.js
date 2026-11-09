/*
 * js/pages/testimonials.js — Patient stories: rating summary, 3D ring, filterable grid, featured story, share-your-experience form
 * Path: js/pages/testimonials.js · Owner: Part 5 · Purpose: renders testimonials from SITE.testimonialsIndex + TESTIMONIALS and submits new stories
 * Depends on: SITE, UI, FX (kit), window.TESTIMONIALS (js/data/testimonials.js) · Exposes: nothing
 */
(function () {
  'use strict';
  var PER_PAGE = 9;
  var SHORT = { 'hearing-loss-cochlear': 'Hearing', 'ear-infection-tympanoplasty': 'Ear infections', 'vertigo-balance': 'Vertigo', 'sinus-endoscopic-surgery': 'Sinus', 'septoplasty-rhinoplasty': 'Nose', 'snoring-sleep-apnoea': 'Snoring & sleep', 'tonsil-adenoid-children': 'Tonsils & children', 'voice-throat-head-neck': 'Voice & throat' };

  UI.ready(function () {
    var all = SITE.testimonialsIndex.concat(window.TESTIMONIALS || []).map(function (t) { return Object.assign({ outcome: '', title: '', verified: true }, t); });
    var state = { service: 'all', rating: 'all', sort: 'newest', shown: PER_PAGE };
    var d = SITE.doctor;

    function countFor(slug) { return all.filter(function (t) { return slug === 'all' || t.serviceSlug === slug; }).length; }
    function filtered() {
      var list = all.filter(function (t) { return (state.service === 'all' || t.serviceSlug === state.service) && (state.rating === 'all' || String(t.rating) === state.rating); });
      list.sort(function (a, b) {
        if (state.sort === 'oldest') return a.date < b.date ? -1 : 1;
        if (state.sort === 'rating') return b.rating - a.rating || (a.date < b.date ? 1 : -1);
        return a.date < b.date ? 1 : -1;
      });
      return list;
    }

    /* ---------- hero ---------- */
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      eyebrow: 'Patient stories', title: 'In their *own words*', tone: 'sage',
      lead: 'Real experiences from people treated in Sylhet and Dhaka, shared with their permission. Every case is different, and results vary from person to person.',
      actionsHTML: '<a href="#share" class="' + UI.cls.btnPrimary + '">Share your experience' + UI.icon('arrow-down', 'h-5 w-5') + '</a><a href="' + SITE.routes.appointment + '" class="' + UI.cls.btnSoft + '">Book appointment</a>'
    });
    UI.mount(document.getElementById('page-hero'));

    /* ---------- rating summary ---------- */
    var total = all.length, sum = all.reduce(function (a, t) { return a + t.rating; }, 0), avg = total ? sum / total : 0;
    var dist = [5, 4, 3, 2, 1].map(function (r) { var n = all.filter(function (t) { return t.rating === r; }).length; return { r: r, n: n, pct: total ? Math.round(n / total * 100) : 0 }; });
    var summary = '<section id="summary" data-section="summary" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'The numbers', title: 'How patients *rate* their care', lead: 'Calculated from every story on this page, including the four-star ones.', tone: 'light' }) +
      '<div class="mt-16 grid items-center gap-10 lg:grid-cols-3">' +
      '<div data-reveal="tilt" data-component="AverageRating" class="rounded-[2.5rem] bg-cream p-8 text-center shadow-clay-lg"><p class="font-display text-7xl font-semibold text-cocoa">' + avg.toFixed(1) + '</p><div class="mt-3 flex justify-center">' + UI.stars(avg, 'h-6 w-6') + '</div><p class="mt-3 text-cocoa/70">Average from ' + total + ' patient stories</p></div>' +
      '<div data-reveal="tilt" data-delay="100" data-component="RatingBars" class="rounded-[2.5rem] bg-cream p-8 shadow-clay-lg"><h3 class="font-display text-xl font-semibold">Rating breakdown</h3><ul class="mt-5 space-y-4">' +
      dist.map(function (x) { return '<li class="flex items-center gap-3 text-sm font-semibold"><span class="w-14 shrink-0">' + x.r + ' star' + (x.r > 1 ? 's' : '') + '</span><span aria-hidden="true" class="h-4 flex-1 rounded-full bg-cream-100 shadow-well"><span data-bar="' + x.pct + '" class="block h-4 w-0 rounded-full bg-clay-grad transition-[width] duration-1000 ease-out"></span></span><span class="w-10 shrink-0 text-right text-cocoa/70">' + x.n + '</span></li>'; }).join('') + '</ul></div>' +
      '<div data-component="SatisfactionOrb" class="flex justify-center">' + UI.statOrb({ value: d.satisfactionPercent, suffix: '%', label: 'Patient satisfaction', color: 'sage' }) + '</div></div></div></section>';

    /* ---------- ring of featured stories ---------- */
    var featured = all.filter(function (t) { return t.rating === 5; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 6);
    var ring = '<section id="stories" data-section="stories" class="' + UI.cls.secBlush + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Featured stories', title: 'Six voices, *one ring*', lead: 'Swipe, use the arrows or press the left and right arrow keys to turn the ring.', tone: 'light' }) +
      '<div class="mt-14">' + UI.ring(featured.map(function (t) { return UI.testimonialCard(t); }), { autoplay: 7000, label: 'Featured patient stories' }) + '</div></div></section>';

    /* ---------- filter bar + grid ---------- */
    var chips = [{ slug: 'all', name: 'All stories' }].concat(SITE.servicesIndex.map(function (s) { return { slug: s.slug, name: SHORT[s.slug] || s.name }; })).map(function (c) {
      return '<button type="button" data-service="' + c.slug + '" aria-pressed="' + (c.slug === 'all') + '" class="' + UI.cls.chip + ' min-h-[44px]">' + UI.esc(c.name) + ' <span class="opacity-70">(' + countFor(c.slug) + ')</span></button>';
    }).join('');
    var sel = function (id, label, opts) { return '<div class="relative"><label for="' + id + '" class="mb-2 block text-sm font-semibold">' + label + '</label><select id="' + id + '" name="' + id + '" class="min-h-[48px] w-full appearance-none rounded-full bg-cream-100 py-3 pl-5 pr-12 font-semibold text-cocoa shadow-well focus:outline-none focus:ring-4 focus:ring-clay/30">' + opts.map(function (o) { return '<option value="' + o[0] + '">' + UI.esc(o[1]) + '</option>'; }).join('') + '</select><span class="pointer-events-none absolute bottom-0 right-4 flex h-12 items-center text-clay-700">' + UI.icon('chevron-down', 'h-5 w-5') + '</span></div>'; };
    var browse = '<section id="all-stories" data-section="all-stories" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Every story', title: 'Find a story like *yours*', lead: 'Filter by the kind of care, the rating or the date. Names are shared with permission.', tone: 'light' }) +
      '<div data-component="StoryFilters" class="mt-14 rounded-[2.5rem] bg-cream p-5 shadow-clay-lg md:p-7"><div id="story-chips" role="group" aria-label="Filter by service" class="flex flex-wrap gap-3">' + chips + '</div>' +
      '<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:max-w-xl">' + sel('story-rating', 'Rating', [['all', 'All ratings'], ['5', '5 stars'], ['4', '4 stars']]) + sel('story-sort', 'Sort by', [['newest', 'Newest first'], ['oldest', 'Oldest first'], ['rating', 'Highest rated']]) + '</div>' +
      '<p id="story-count" role="status" aria-live="polite" class="mt-5 text-sm font-semibold text-cocoa/70"></p></div>' +
      '<div id="story-grid" data-component="StoryGrid" class="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3"></div><div class="mt-12 text-center"><button type="button" id="story-more" class="' + UI.cls.btnSoft + '">Load more stories' + UI.icon('plus', 'h-5 w-5') + '</button></div></div></section>';

    /* ---------- featured story: before / during / after ---------- */
    var story = [
      { id: 'before', label: 'Before', icon: 'clock', title: 'Years of asking people to repeat themselves', text: 'Mohammad Abdul Karim, a retired schoolteacher from Zindabazar, first noticed that he could no longer follow conversations at the family table. He turned the television up, avoided the mosque’s crowded gatherings and began to feel left out. For nearly four years he assumed it was simply age.' },
      { id: 'during', label: 'During', icon: 'activity', title: 'A careful test and an honest conversation', text: 'At the Upashahar clinic he had a full hearing test and an ear examination, which showed a gradual loss in both ears. Dr. Ashfaq explained each option, including what each would cost, and why the quietest and simplest one was worth trying first. His family joined the visit and asked their questions too.' },
      { id: 'after', label: 'After', icon: 'heart', title: 'Back at the dinner table', text: 'After his hearing solution was fitted and adjusted over two follow-up visits, he could follow his grandchildren’s talk again. He still needs regular checks, and quiet rooms remain easier than noisy ones. Every person’s hearing is different, so his experience cannot be promised to others.' }
    ];
    var tab = story.map(function (s, i) { return '<button type="button" role="tab" id="story-tab-' + s.id + '" data-tab="' + s.id + '" aria-controls="story-panel-' + s.id + '" aria-selected="' + (i === 0) + '" class="' + UI.cls.tab + ' inline-flex min-h-[48px] items-center gap-2">' + UI.icon(s.icon, 'h-4 w-4') + s.label + '</button>'; }).join('');
    var panels = story.map(function (s, i) { return '<div role="tabpanel" id="story-panel-' + s.id + '" data-tab-panel="' + s.id + '" aria-labelledby="story-tab-' + s.id + '" tabindex="0" class="' + (i ? 'hidden ' : '') + 'mt-8 rounded-[2rem] bg-cream p-7 shadow-clay focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40"><h3 class="' + UI.cls.h3 + '">' + UI.esc(s.title) + '</h3><p class="mt-4 text-lg leading-relaxed text-cocoa/80">' + UI.esc(s.text) + '</p></div>'; }).join('');
    var ob = SITE.img.objects;
    var feature = '<section id="featured-story" data-section="featured-story" class="' + UI.cls.secMist + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Featured story', title: 'One patient, *three chapters*', lead: 'A closer look at one journey, from the first worry to the follow-up visits.', tone: 'light' }) +
      '<div class="mt-16 grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div class="relative mx-auto w-full max-w-sm"><div class="' + UI.cls.stage + '"><div data-orbit="5" class="' + UI.cls.preserve + '"><div data-light class="relative rounded-[2.5rem] bg-cream p-8 text-center shadow-clay-lg ' + UI.cls.preserve + '"><div class="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-orb-sage font-display text-5xl font-semibold shadow-clay [transform:translateZ(60px)]">M</div><p class="mt-6 font-display text-xl font-semibold">Mohammad Abdul Karim, 63</p><p class="mt-1 text-sm text-cocoa/70">Zindabazar, Sylhet · Hearing care</p><div class="mt-4 flex justify-center">' + UI.stars(5) + '</div>' +
      '<div aria-hidden="true" class="pointer-events-none absolute -right-6 -top-8 w-20 [transform:translateZ(100px)]">' + UI.deco(ob.orbGold, 'w-full motion-safe:animate-float') + '</div></div></div></div><div aria-hidden="true" class="mx-auto mt-6 h-4 w-2/3 rounded-full bg-cocoa/20 blur-xl"></div></div>' +
      '<div data-tabs data-component="StoryTabs"><div role="tablist" aria-label="Story chapters" class="flex flex-wrap gap-3">' + tab + '</div>' + panels + '</div></div></div></section>';

    /* ---------- share form ---------- */
    var stars = [1, 2, 3, 4, 5].map(function (n) { return '<label class="relative cursor-pointer"><input type="radio" name="rating" value="' + n + '" required class="peer sr-only"><span data-star="' + n + '" class="flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 shadow-well transition peer-focus-visible:ring-4 peer-focus-visible:ring-clay/40">' + UI.icon('star-fill', 'h-6 w-6 text-cocoa/25') + '</span><span class="sr-only">' + n + ' star' + (n > 1 ? 's' : '') + '</span></label>'; }).join('');
    var consent = 'I agree that Dr. Ashfaq Talukder’s team may show my story, with my first name and area, on this website after it has been checked.';
    var share = '<section id="share" data-section="share" class="' + UI.cls.secBlush + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Your turn', title: 'Share your *experience*', lead: 'Your story helps other patients decide with confidence. Every submission is read and checked before anything is published.', tone: 'light' }) +
      '<div class="mx-auto mt-14 max-w-3xl rounded-[2.5rem] bg-cream p-6 shadow-clay-lg md:p-10" data-component="TestimonialForm"><form id="testimonial-form" novalidate class="space-y-6"><div class="grid gap-6 sm:grid-cols-2">' +
      UI.field({ label: 'Your name', name: 'name', required: true, autocomplete: 'name' }) + UI.field({ label: 'Mobile number (optional)', name: 'phone', type: 'tel', validate: 'bd-phone', autocomplete: 'tel', hint: 'Used only if the team needs to check your story. Never published.' }) + '</div>' +
      UI.field({ label: 'Which care did you receive?', name: 'service', type: 'select', required: true, options: SITE.servicesIndex.map(function (s) { return { value: s.slug, label: s.name }; }) }) +
      '<fieldset><legend class="mb-2 block text-sm font-semibold">Your rating <span class="text-clay-600" aria-hidden="true">*</span></legend><div class="flex flex-wrap gap-2">' + stars + '</div><p id="err-rating" data-error-for="rating" class="mt-1 hidden text-sm font-semibold text-danger"></p></fieldset>' +
      UI.field({ label: 'Title for your story', name: 'title', required: true, minlength: 4 }) + UI.field({ label: 'Your message', name: 'message', type: 'textarea', required: true, minlength: 30, rows: 5, hint: 'At least 30 characters. Please do not include other people’s names or phone numbers.' }) +
      UI.field({ type: 'checkbox', name: 'consent', required: true, labelHTML: UI.esc(consent) }) +
      '<button type="submit" class="' + UI.cls.btnPrimary + ' w-full sm:w-auto">Send my story' + UI.icon('send', 'h-5 w-5') + '</button></form></div></div></section>';

    var cta = UI.ctaBand({ title: 'Ready to *be heard*? Start with one visit', lead: 'Book a first consultation in Sylhet or Dhaka and get a clear explanation of what is happening and what your options are.' });
    document.getElementById('stories-mount').outerHTML = UI.wave('cream') + summary + UI.wave('blush') + ring + UI.wave('cream') + browse + UI.wave('mist') + feature + UI.wave('blush') + share + UI.wave('cocoa') + cta;
    ['summary', 'stories', 'all-stories', 'featured-story', 'share', 'cta'].forEach(function (id) { UI.mount(document.getElementById(id)); });

    /* rating bars: width set at runtime when they scroll into view */
    var bars = UI.qsa('[data-bar]');
    function fill(el) { el.style.setProperty('width', el.getAttribute('data-bar') + '%'); }
    if ('IntersectionObserver' in window && !FX.reduced()) {
      var io = new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { fill(e.target); o.unobserve(e.target); } }); }, { threshold: 0.3 });
      bars.forEach(function (b) { io.observe(b); });
    } else { bars.forEach(fill); }

    /* ---------- grid rendering ---------- */
    var grid = document.getElementById('story-grid'), more = document.getElementById('story-more'), count = document.getElementById('story-count');
    function tile(t) {
      var svc = SITE.getService(t.serviceSlug);
      return '<div data-component="StoryTile" class="flex h-full flex-col gap-4 pt-5"><div class="flex flex-wrap items-center gap-2 px-2">' + (t.outcome ? UI.badge(t.outcome) : '') + (t.verified ? '<span class="inline-flex items-center gap-1 text-xs font-semibold text-sage-700">' + UI.icon('check-circle', 'h-4 w-4') + 'Verified patient</span>' : '') + '<span class="text-xs text-cocoa/60">' + UI.formatDate(t.date, 'short') + '</span></div>' +
        (t.title ? '<h3 class="px-2 font-display text-xl font-semibold leading-snug">' + UI.esc(t.title) + '</h3>' : '<h3 class="sr-only">' + UI.esc(svc ? svc.name : 'Patient story') + '</h3>') + '<div class="flex-1">' + UI.testimonialCard(t) + '</div></div>';
    }
    function render() {
      var list = filtered(), slice = list.slice(0, state.shown);
      count.textContent = list.length ? 'Showing ' + slice.length + ' of ' + list.length + (list.length === 1 ? ' story' : ' stories') : 'No stories match these filters';
      grid.innerHTML = slice.length ? slice.map(tile).join('') : '<div data-component="EmptyState" class="col-span-full rounded-[2rem] bg-cream p-10 text-center shadow-clay"><span class="' + UI.cls.iconBall + ' mx-auto">' + UI.icon('search', 'h-6 w-6') + '</span><h3 class="mt-5 ' + UI.cls.h3 + '">No stories match yet</h3><p class="mx-auto mt-3 max-w-md text-cocoa/75">Try another service or rating, or clear the filters to see every story.</p><button type="button" data-reset class="' + UI.cls.btnPrimary + ' mt-6">Clear filters</button></div>';
      more.parentElement.classList.toggle('hidden', list.length <= state.shown);
      UI.qsa('#story-chips [data-service]').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-service') === state.service)); });
      UI.mount(grid);
    }
    document.getElementById('story-chips').addEventListener('click', function (e) { var b = e.target.closest('[data-service]'); if (!b) return; state.service = b.getAttribute('data-service'); state.shown = PER_PAGE; render(); });
    document.getElementById('story-rating').addEventListener('change', function (e) { state.rating = e.target.value; state.shown = PER_PAGE; render(); });
    document.getElementById('story-sort').addEventListener('change', function (e) { state.sort = e.target.value; state.shown = PER_PAGE; render(); });
    more.addEventListener('click', function () { state.shown += PER_PAGE; render(); });
    grid.addEventListener('click', function (e) {
      if (!e.target.closest('[data-reset]')) return;
      state.service = 'all'; state.rating = 'all'; state.sort = 'newest'; state.shown = PER_PAGE;
      document.getElementById('story-rating').value = 'all'; document.getElementById('story-sort').value = 'newest'; render();
    });
    render();

    /* ---------- form ---------- */
    var form = document.getElementById('testimonial-form');
    form.addEventListener('change', function (e) {
      if (e.target.name !== 'rating') return;
      var v = parseInt(e.target.value, 10) || 0;
      UI.qsa('[data-star]', form).forEach(function (s) { var on = parseInt(s.getAttribute('data-star'), 10) <= v; s.firstElementChild.classList.toggle('text-gold', on); s.firstElementChild.classList.toggle('text-cocoa/25', !on); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!UI.validateForm(form)) return;
      var button = form.querySelector('button[type="submit"]'); button.disabled = true; button.textContent = 'Sending…';
      var checked = form.querySelector('[name="rating"]:checked');
      var payload = { name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), serviceSlug: form.elements.service.value, rating: checked ? parseInt(checked.value, 10) : 0, title: form.elements.title.value.trim(), message: form.elements.message.value.trim(), consent: true };
      SITE.submit('testimonial', payload).then(function (res) {
        var box = form.parentElement;
        box.innerHTML = '<div role="status" data-component="TestimonialThanks" class="text-center"><span class="' + UI.cls.iconBall + ' mx-auto !bg-orb-sage">' + UI.icon('check-circle', 'h-7 w-7') + '</span><h3 class="mt-5 ' + UI.cls.h3 + '">Thank you, ' + UI.esc(payload.name.split(' ')[0]) + '</h3><p class="mt-3 text-cocoa/75">Your story has reached the clinic team. Every story is read and checked before it is published, so it may take a few days to appear. Your reference is <b>' + UI.esc(res.id) + '</b>.</p><a href="' + SITE.routes.home + '" class="' + UI.cls.btnSoft + ' mt-6">Back to home</a></div>';
      });
    });
  });
})();
