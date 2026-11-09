/*
 * js/pages/contact.js
 * Path: js/pages/contact.js · Owner: Part 2 · Purpose: Contact page: contact tiles, message form, chambers with map tabs, emergency guidance, mini FAQ
 * Depends on: SITE, UI, FX (kit), window.FAQS (js/data/faqs.js) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var c = SITE.contact, ob = SITE.img.objects;
    var subjects = ['Appointment query', 'Fees & surgery estimate', 'Hearing test booking', 'Second opinion on reports', 'Feedback', 'Other'];

    /* 1. hero */
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      eyebrow: 'Contact', title: 'We are *easy to reach*', tone: 'mist',
      lead: 'Call, message on WhatsApp or write to the clinic team. Questions about appointments, fees or reports are answered Saturday to Thursday.'
    });
    UI.mount(document.getElementById('page-hero'));

    /* 2. tiles */
    var tiles = [
      { id: 'tile-phone', icon: 'phone', title: 'Appointment line', line: c.phone.display, note: 'Saturday – Thursday, 9:00 AM – 8:00 PM', href: 'tel:' + c.phone.e164, label: 'Call the appointment line' },
      { id: 'tile-whatsapp', icon: 'message-circle', title: 'WhatsApp', line: c.phone.display, note: 'Send reports and photographs, replies within a working day', href: c.whatsappUrl, label: 'Message on WhatsApp', ext: true },
      { id: 'tile-email', icon: 'mail', title: 'Email', line: c.email, note: 'For fee questions and second opinions', href: 'mailto:' + c.email, label: 'Send an email' },
      { id: 'tile-urgent', icon: 'alert-circle', title: 'Urgent line', line: c.urgent.display, note: c.urgent.note, href: 'tel:' + c.urgent.e164, label: 'Call the urgent line' }
    ];
    var tileHTML = tiles.map(function (t, i) {
      return '<div data-reveal="pop" data-delay="' + (i * 100) + '"><a id="' + t.id + '" data-component="ContactTile" data-light href="' + UI.esc(t.href) + '"' + (t.ext ? ' target="_blank" rel="noopener"' : '') + ' aria-label="' + UI.esc(t.label + ': ' + t.line) + '" class="flex h-full min-h-[44px] flex-col items-center rounded-[2rem] bg-cream p-7 text-center text-cocoa shadow-clay transition duration-500 ease-out hover:-translate-y-2 hover:shadow-clay-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40"><span class="' + UI.cls.iconBall + ' !h-16 !w-16">' + UI.icon(t.icon, 'h-7 w-7') + '</span><h2 class="mt-5 ' + UI.cls.h3 + '">' + UI.esc(t.title) + '</h2><p class="mt-2 break-words font-semibold text-clay-700">' + UI.esc(t.line) + '</p><p class="mt-2 text-sm leading-relaxed text-cocoa/70">' + UI.esc(t.note) + '</p></a></div>';
    }).join('');
    var tilesSec = UI.wave('cream') + '<section id="tiles" data-section="tiles" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Reach the clinic', title: 'Four ways to *get in touch*', tone: 'light', lead: 'Choose whatever is easiest. The urgent line is only for patients who have recently had surgery.' }) +
      '<div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">' + tileHTML + '</div></div></section>';

    /* 3. form + info */
    var chamberOpts = SITE.chambersIndex.map(function (ch) { return { value: ch.slug, label: ch.chamberName + ', ' + ch.city }; });
    var form = '<form id="contact-form" data-component="ContactForm" novalidate class="space-y-5" aria-label="Contact form">' +
      '<div class="grid gap-5 sm:grid-cols-2">' + UI.field({ label: 'Full name', name: 'fullName', required: true, autocomplete: 'name' }) + UI.field({ label: 'Mobile number', name: 'phone', type: 'tel', required: true, validate: 'bd-phone', autocomplete: 'tel', hint: 'For example 01712-345678' }) + '</div>' +
      UI.field({ label: 'Email (optional)', name: 'email', type: 'email', autocomplete: 'email' }) +
      '<div class="grid gap-5 sm:grid-cols-2">' + UI.field({ label: 'Subject', name: 'subject', type: 'select', required: true, options: subjects }) + UI.field({ label: 'Preferred chamber (optional)', name: 'chamberSlug', type: 'select', options: chamberOpts }) + '</div>' +
      UI.field({ label: 'Your message', name: 'message', type: 'textarea', required: true, minlength: 20, rows: 5, hint: 'At least 20 characters. Please do not send emergencies here.' }) +
      UI.field({ name: 'consent', type: 'checkbox', required: true, labelHTML: 'I agree that the clinic may contact me about this message. I understand it is not an emergency service.' }) +
      '<button type="submit" id="contact-submit" class="' + UI.cls.btnPrimary + ' w-full min-h-[44px] disabled:opacity-60 sm:w-auto"><span data-label>Send message</span>' + UI.icon('send', 'h-5 w-5') + '</button></form>';
    var nextSteps = ['We read your message the same working day.', 'A team member replies by phone or WhatsApp within one working day.', 'If a visit helps, we offer the earliest suitable slot at your chamber.'].map(function (t, i) {
      return '<li class="flex gap-4"><span aria-hidden="true" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay-grad font-display font-semibold text-white shadow-clay-btn">' + (i + 1) + '</span><span class="pt-1.5 leading-relaxed text-cocoa/80">' + UI.esc(t) + '</span></li>';
    }).join('');
    var formSec = UI.wave('blush') + '<section id="message" data-section="message" class="' + UI.cls.secBlush + '"><div class="' + UI.cls.container + '">' +
      '<div aria-hidden="true" data-parallax="0.12" class="pointer-events-none absolute right-[3%] top-10 hidden w-24 md:block">' + UI.deco(ob.orbSage, 'w-full motion-safe:animate-float') + '</div>' +
      UI.sectionHead({ eyebrow: 'Write to us', title: 'Send a *message*', tone: 'light', lead: 'Tell us briefly what you need. Please do not include test results in this form; send them on WhatsApp instead.' }) +
      '<div class="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]"><div data-scroll-tilt><div id="form-card" class="' + UI.cls.clayLg + ' p-6 md:p-10">' + form + '</div></div>' +
      '<aside data-component="DeskInfo" data-reveal="pop" class="' + UI.cls.clayLg + ' p-7"><span class="' + UI.cls.iconBall + '">' + UI.icon('clock', 'h-6 w-6') + '</span><h3 class="mt-5 ' + UI.cls.h3 + '">Desk hours</h3><p class="mt-3 leading-relaxed text-cocoa/80">' + UI.esc(c.deskHours) + '. Chambers keep their own session times, shown below.</p>' +
      '<h3 class="mt-8 ' + UI.cls.h3 + '">What happens next</h3><ol class="mt-5 space-y-4">' + nextSteps + '</ol></aside></div></div></section>';

    /* 4. chambers + map tabs */
    var cards = SITE.chambersIndex.map(function (ch, i) { return '<div data-reveal="rise" data-delay="' + (i * 100) + '">' + UI.chamberCard(ch) + '</div>'; }).join('');
    var tabBtns = SITE.chambersIndex.map(function (ch) {
      return '<button type="button" role="tab" id="map-tab-' + ch.slug + '" data-tab="' + ch.slug + '" aria-selected="false" aria-controls="map-panel-' + ch.slug + '" class="' + UI.cls.tab + ' min-h-[44px]">' + UI.esc(ch.chamberName) + '</button>';
    }).join('');
    var panels = SITE.chambersIndex.map(function (ch) {
      var q = encodeURIComponent(ch.name + ', ' + ch.address);
      return '<div role="tabpanel" id="map-panel-' + ch.slug + '" data-tab-panel="' + ch.slug + '" aria-labelledby="map-tab-' + ch.slug + '" class="hidden"><div class="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div class="overflow-hidden rounded-[2rem] bg-clay-50 shadow-clay-lg"><iframe title="Map of ' + UI.esc(ch.name) + ', ' + UI.esc(ch.area) + ', ' + UI.esc(ch.city) + '" src="https://www.google.com/maps?q=' + q + '&amp;output=embed" width="800" height="400" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="h-[320px] w-full md:h-[400px]"></iframe></div>' +
        '<div class="' + UI.cls.clay + ' flex flex-col justify-center p-7"><h3 class="' + UI.cls.h3 + '">' + UI.esc(ch.name) + '</h3><p class="mt-3 break-words text-sm leading-relaxed text-cocoa/75">' + UI.esc(ch.address) + '</p><p class="mt-3 text-sm text-cocoa/75">' + UI.esc(ch.phone.display) + '</p>' +
        '<a href="https://www.google.com/maps/dir/?api=1&amp;destination=' + ch.lat + ',' + ch.lng + '" target="_blank" rel="noopener" class="' + UI.cls.btnPrimary + ' mt-6 min-h-[44px]">' + UI.icon('navigation', 'h-5 w-5') + 'Get directions</a></div></div></div>';
    }).join('');
    var chambersSec = UI.wave('cream') + '<section id="chambers" data-section="chambers" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Visit us', title: 'Three chambers, *two cities*', tone: 'light', lead: 'Two in Sylhet and one in Dhaka Uttara. Surgeries are done Sunday to Wednesday mornings at Surma Valley Specialized Hospital.' }) +
      '<div class="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">' + cards + '</div>' +
      '<div data-tabs class="mt-20"><h3 class="mb-6 text-center ' + UI.cls.h3 + '">Find your chamber on the map</h3><div role="tablist" aria-label="Chamber maps" class="mb-8 flex flex-wrap justify-center gap-3">' + tabBtns + '</div>' + panels + '</div></div></section>';

    /* 5. emergency */
    var urgent = [
      { icon: 'alert-circle', t: 'Trouble breathing or swallowing', d: 'Noisy breathing, drooling, or being unable to swallow your own saliva needs the nearest emergency department at once.' },
      { icon: 'activity', t: 'Bleeding that will not stop', d: 'Sit up, lean forward and pinch the soft part of the nose for 10–15 minutes. If it is still bleeding, or you feel faint, go to hospital.' },
      { icon: 'shield', t: 'A swallowed button battery or magnet', d: 'Go to the emergency department immediately, even if the child seems well. Do not wait for symptoms, and do not induce vomiting.' },
      { icon: 'clock', t: 'Sudden hearing loss', d: 'Not an emergency for 999, but it is urgent. See a doctor within 72 hours, as early treatment gives the best chance of recovery.' }
    ].map(function (u, i) {
      return '<article data-component="EmergencyCard" data-reveal="pop" data-delay="' + (i * 100) + '" class="' + UI.cls.clay + ' flex gap-4 p-6"><span class="' + UI.cls.iconBall + '">' + UI.icon(u.icon, 'h-6 w-6') + '</span><div><h3 class="' + UI.cls.h3 + '">' + UI.esc(u.t) + '</h3><p class="mt-2 text-sm leading-relaxed text-cocoa/75">' + UI.esc(u.d) + '</p></div></article>';
    }).join('');
    var emergency = UI.wave('sage') + '<section id="emergency" data-section="emergency" class="' + UI.cls.secSage + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Emergencies', title: 'When to go *straight to hospital*', tone: 'light', lead: 'This website and its forms are not an emergency service. In an emergency call ' + c.nationalEmergency + ' or go to the nearest emergency department.' }) +
      '<div class="mt-14 grid gap-6 md:grid-cols-2">' + urgent + '</div>' +
      '<div class="mt-10 text-center"><a href="tel:' + c.nationalEmergency + '" class="' + UI.cls.btnDark + ' min-h-[44px]">' + UI.icon('phone', 'h-5 w-5') + 'Call ' + UI.esc(c.nationalEmergency) + '</a></div></div></section>';

    /* 6. mini FAQ from window.FAQS */
    var faqData = window.FAQS || { items: [] };
    var pick = ['faq-005', 'faq-009', 'faq-018'].map(function (id) { return faqData.items.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean);
    var faqSec = UI.wave('blush') + '<section id="quick-faq" data-section="quick-faq" class="' + UI.cls.secBlush + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Quick answers', title: 'Before you *call*', tone: 'light' }) +
      '<div data-accordion data-accordion-single class="mx-auto mt-12 max-w-3xl space-y-4">' + pick.map(function (f, i) { return UI.faqItem({ id: 'contact-' + f.id, question: f.question, answerHTML: '<p>' + UI.esc(f.answer) + '</p>', tone: 'light', open: i === 0 }); }).join('') + '</div>' +
      '<p class="mt-8 text-center"><a href="' + SITE.routes.faqs + '" class="' + UI.cls.btnSoft + ' min-h-[44px]">All questions and answers' + UI.icon('arrow-right', 'h-5 w-5') + '</a></p></div></section>' + UI.wave('cocoa');

    document.getElementById('rest-mount').outerHTML = tilesSec + formSec + chambersSec + emergency + faqSec + '<div id="cta-mount"></div>';
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Prefer to *see the doctor*?', lead: 'Choose a chamber and a time that suits you. Slots last twenty minutes, so you are never rushed.' });
    ['tiles', 'message', 'chambers', 'emergency', 'quick-faq', 'cta'].forEach(function (id) { UI.mount(document.getElementById(id)); });

    /* 7. form behaviour */
    var formEl = document.getElementById('contact-form');
    var tabsRoot = document.querySelector('#chambers [data-tabs]');
    if (tabsRoot && tabsRoot.showTab) tabsRoot.showTab(SITE.chambersIndex[0].slug);
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!UI.validateForm(formEl)) return;
      var btn = document.getElementById('contact-submit');
      btn.disabled = true; btn.querySelector('[data-label]').textContent = 'Sending…';
      var f = formEl.elements;
      var payload = { fullName: f.fullName.value.trim(), phone: f.phone.value.replace(/[\s-]/g, ''), email: f.email.value.trim(), subject: f.subject.value, chamberSlug: f.chamberSlug.value, message: f.message.value.trim(), consent: f.consent.checked };
      SITE.submit('contact', payload).then(function (res) {
        var card = document.getElementById('form-card');
        card.innerHTML = '<div data-component="ContactSuccess" role="status" tabindex="-1" id="contact-success" class="py-8 text-center"><span class="' + UI.cls.iconBall + ' mx-auto !h-20 !w-20 !bg-sage-100">' + UI.icon('check-circle', 'h-9 w-9 text-sage-600') + '</span><h3 class="mt-6 ' + UI.cls.h3 + '">Thank you, ' + UI.esc(payload.fullName.split(' ')[0]) + '. Your message is with us.</h3><p class="mx-auto mt-3 max-w-md leading-relaxed text-cocoa/75">A member of the clinic team will contact you on ' + UI.esc(payload.phone) + ' within one working day.</p><p class="mt-6 inline-flex rounded-full bg-cream-100 px-5 py-2 font-semibold shadow-well">Reference: ' + UI.esc(res.id) + '</p></div>';
        var s = document.getElementById('contact-success'); if (s) s.focus();
        UI.toast('Message sent. Reference ' + res.id, 'success');
      });
    });
  });
})();
