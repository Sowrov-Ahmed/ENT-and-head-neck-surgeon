/*
 * js/pages/appointment.js — 5-step appointment wizard (configurator) with live summary and confirmation
 * Path: js/pages/appointment.js · Owner: Part 4 · Purpose: prefill from URL, validate each step, pick date/time, submit via SITE.submit('appointment')
 * Depends on: SITE, UI (shared kit) · Exposes: nothing · Storage: sessionStorage key "ortho:booking"
 */
(function () {
  'use strict';
  var KEY = 'ortho:booking', DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], WEEK = [6, 0, 1, 2, 3, 4, 5], RANGE = 60;
  var TYPES = [{ v: 'new', t: 'New consultation', d: 'Your first visit for a new problem.' }, { v: 'follow-up', t: 'Follow-up', d: 'A review within 30 days of a previous visit.' }, { v: 'second-opinion', t: 'Second opinion', d: 'Bring your reports and scans for a fresh look.' }, { v: 'post-op', t: 'Post-operative check', d: 'A check after surgery with Dr. Ashfaq Talukder.' }];
  var STEPS = ['Visit & concern', 'Chamber', 'Date & time', 'Your details', 'Review & confirm'], PAYS = ['Pay at chamber', 'bKash', 'Nagad', 'Card at chamber'];
  var GENERAL = 'general-consultation', GENERAL_NAME = 'Not sure yet — general ENT consultation', DOC = SITE.doctor;
  var state = { type: '', service: '', chamber: '', date: '', time: '', step: 1, payment: PAYS[0], details: {}, done: false, busy: false };
  var view = { y: 0, m: 0 }, root, form, body;

  /* ---------- small helpers ---------- */
  function mins(t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function iso(d) { return d.getFullYear() + '-' + UI.pad(d.getMonth() + 1) + '-' + UI.pad(d.getDate()); }
  function parse(s) { if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return null; var d = new Date(s + 'T00:00:00'); return isNaN(d.getTime()) || iso(d) !== s ? null : d; }
  function today() { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h; }
  function clock(t) { var p = t.split(':'); return UI.formatTime(new Date(2000, 0, 1, Number(p[0]), Number(p[1]))); }
  function longDate(s) { var d = parse(s); return d ? DAYS[d.getDay()] + ', ' + UI.formatDate(s, 'long') : ''; }
  function chamber() { return SITE.getChamber(state.chamber); }
  function service() { return state.service === GENERAL ? { name: GENERAL_NAME } : SITE.getService(state.service); }
  function typeName() { var t = TYPES.filter(function (x) { return x.v === state.type; })[0]; return t ? t.t : ''; }
  function fee(c) { c = c || chamber(); if (!c) return 0; return state.type === 'follow-up' || state.type === 'post-op' ? c.fee.followUp : c.fee.firstVisit; }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify({ type: state.type, service: state.service, chamber: state.chamber, date: state.date, time: state.time, step: state.step, payment: state.payment, details: state.details })); } catch (e) { /* storage unavailable */ } }
  function toE164(v) { var s = String(v).replace(/[\s-]/g, ''); if (/^01/.test(s)) return '+88' + s; if (/^8801/.test(s)) return '+' + s; return s; }

  /* ---------- availability (the booked-slot rule is deterministic: hash(chamberSlug + date + HH:MM) % 4 === 0) ---------- */
  function slotsFor(c, d) {
    var day = parse(d), out = [], now = new Date(); if (!day || !c) return out;
    c.schedule.forEach(function (s) {
      if (s.days.indexOf(day.getDay()) < 0) return;
      for (var m = mins(s.start); m + c.slotMinutes <= mins(s.end); m += c.slotMinutes) {
        var at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, m), t = UI.pad(at.getHours()) + ':' + UI.pad(at.getMinutes());
        if (at > now) out.push({ time: t, booked: hash(c.slug + d + t) % 4 === 0 });
      }
    });
    return out;
  }
  function dayOpen(c, d) { var day = parse(d), t = today(); return !!(day && c && day >= t && day <= addDays(t, RANGE - 1) && slotsFor(c, d).some(function (s) { return !s.booked; })); }
  function earliest(c) { for (var i = 0; i < RANGE; i++) { var d = iso(addDays(today(), i)), f = slotsFor(c, d).filter(function (s) { return !s.booked; })[0]; if (f) return { date: d, time: f.time }; } return null; }
  function revalidate() {
    var c = chamber(); if (!c) { state.date = ''; state.time = ''; return; }
    if (state.date && !dayOpen(c, state.date)) { state.date = ''; state.time = ''; }
    if (state.time && !slotsFor(c, state.date).some(function (s) { return s.time === state.time && !s.booked; })) state.time = '';
  }

  /* ---------- load: storage first, then valid URL params ---------- */
  function load() {
    var s = {}; try { s = JSON.parse(sessionStorage.getItem(KEY) || '{}') || {}; } catch (e) { s = {}; }
    function ok(v, list) { return list.indexOf(v) > -1 ? v : ''; }
    var types = TYPES.map(function (t) { return t.v; }), services = SITE.servicesIndex.map(function (x) { return x.slug; }).concat([GENERAL]), chambers = SITE.chambersIndex.map(function (x) { return x.slug; });
    state.type = ok(s.type, types); state.service = ok(s.service, services); state.chamber = ok(s.chamber, chambers); state.date = parse(s.date) ? s.date : ''; state.time = /^\d{2}:\d{2}$/.test(s.time || '') ? s.time : '';
    state.payment = ok(s.payment, PAYS) || PAYS[0]; state.details = s.details && typeof s.details === 'object' ? s.details : {}; state.step = Math.min(5, Math.max(1, parseInt(s.step, 10) || 1));
    var q = { type: ok(UI.getParam('type'), types), service: ok(UI.getParam('service'), services), chamber: ok(UI.getParam('chamber'), chambers), date: parse(UI.getParam('date')) ? UI.getParam('date') : '' }, any = false;
    Object.keys(q).forEach(function (k) { if (q[k]) { state[k] = q[k]; any = true; } });
    revalidate(); var first = !state.type || !state.service ? 1 : !state.chamber ? 2 : !state.date || !state.time ? 3 : 4;
    state.step = any ? first : Math.min(state.step, first);
    var v = parse(state.date) || today(); view.y = v.getFullYear(); view.m = v.getMonth();
  }

  /* ---------- summary (rendered twice: mobile accordion and sticky desktop card) ---------- */
  function summaryHTML() {
    var c = chamber(), s = service(), none = '<span class="text-cocoa/50">Not chosen yet</span>';
    function row(label, val) { return '<div class="flex items-start justify-between gap-4 py-3"><dt class="text-sm text-cocoa/65">' + label + '</dt><dd class="text-right text-sm font-semibold break-words">' + (val ? UI.esc(val) : none) + '</dd></div>'; }
    return '<dl class="divide-y divide-cocoa/10">' + row('Visit', typeName()) + row('Concern', s ? s.name : '') + row('Chamber', c ? c.chamberName + ', ' + c.city : '') + row('Date', longDate(state.date)) + row('Time', state.time ? clock(state.time) : '') + row('Consultation fee', c && state.type ? UI.formatBDT(fee(c)) : '') + '</dl>' +
      '<div class="mt-5 [perspective:1600px]"><div data-light class="flex items-center gap-4 rounded-[1.75rem] bg-cream-100 p-4 shadow-well ' + UI.cls.preserve + '"><span class="shrink-0 [transform:translateZ(40px)]">' + UI.img(SITE.img.portrait, 'Portrait of ' + DOC.name, 'h-16 w-16 rounded-full bg-clay-100 object-cover shadow-clay', { w: 128, h: 128 }) + '</span><span class="min-w-0 text-sm"><b class="block font-display text-base">' + UI.esc(DOC.shortName) + '</b><span class="text-cocoa/70">ENT and head–neck surgeon</span></span></div><div aria-hidden="true" class="mx-auto mt-1 h-5 w-4/5 rounded-full bg-cream-200 shadow-plinth"></div></div>' +
      '<div class="mt-5 flex flex-wrap gap-3"><a href="tel:' + SITE.contact.phone.e164 + '" class="' + UI.cls.btnSoft + ' !px-5 !py-2.5 text-sm">' + UI.icon('phone', 'h-4 w-4') + 'Call</a><a href="' + SITE.contact.whatsappUrl + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnSoft + ' !px-5 !py-2.5 text-sm">' + UI.icon('message-circle', 'h-4 w-4') + 'WhatsApp</a></div>' +
      '<p class="mt-5 flex gap-2 text-xs leading-relaxed text-cocoa/70">' + UI.icon('shield', 'h-4 w-4 shrink-0 text-sage-600') + '<span>No payment is taken online. You pay at the chamber, and the fee is for the consultation only.</span></p>';
  }
  function renderSummary() { UI.qsa('[data-summary]').forEach(function (el) { el.innerHTML = summaryHTML(); }); }

  /* ---------- step markup ---------- */
  function radioCard(name, value, checked, inner, extra) {
    return '<label class="block cursor-pointer"><input type="radio" name="' + name + '" value="' + UI.esc(value) + '" required aria-describedby="err-' + name + '" class="peer sr-only"' + (checked ? ' checked' : '') + '><span class="block h-full rounded-[1.5rem] bg-cream p-4 shadow-clay transition duration-300 hover:-translate-y-0.5 peer-checked:bg-clay-50 peer-checked:ring-4 peer-checked:ring-clay/40 peer-focus-visible:ring-4 peer-focus-visible:ring-clay/40 ' + (extra || '') + '">' + inner + '</span></label>';
  }
  function errP(name) { return '<p id="err-' + name + '" data-error-for="' + name + '" role="alert" class="mt-2 hidden text-sm font-semibold text-danger"></p>'; }
  function legend(text) { return '<legend class="mb-3 font-display text-lg font-semibold">' + text + '</legend>'; }
  function step1() {
    return '<fieldset>' + legend('What kind of visit is this?') + '<div class="grid gap-4 sm:grid-cols-2">' + TYPES.map(function (t) { return radioCard('type', t.v, state.type === t.v, '<b class="block font-display text-base">' + t.t + '</b><span class="mt-1 block text-sm text-cocoa/70">' + t.d + '</span>'); }).join('') + '</div>' + errP('type') + '</fieldset>' +
      '<fieldset class="mt-10">' + legend('What brings you in?') + '<div class="grid gap-4 sm:grid-cols-2">' + SITE.servicesIndex.map(function (s) { return radioCard('service', s.slug, state.service === s.slug, '<span class="flex items-center gap-3">' + UI.img(s.image, '', 'h-16 w-16 shrink-0 object-contain drop-shadow-[0_8px_8px_rgba(43,29,26,.2)]', { w: 128, h: 128 }).replace('alt=""', 'alt="" aria-hidden="true"') + '<span><b class="block font-display text-base leading-snug">' + UI.esc(s.name) + '</b></span></span>'); }).join('') +
      radioCard('service', GENERAL, state.service === GENERAL, '<span class="flex items-center gap-3"><span class="' + UI.cls.iconBall + '">' + UI.icon('search', 'h-6 w-6') + '</span><b class="block font-display text-base leading-snug">' + GENERAL_NAME + '</b></span>', 'sm:col-span-2') + '</div>' + errP('service') + '</fieldset>';
  }
  function step2() {
    return '<fieldset>' + legend('Choose a chamber') + '<div class="grid gap-5">' + SITE.chambersIndex.map(function (c) {
      return radioCard('chamber', c.slug, state.chamber === c.slug, '<span class="flex flex-col gap-4 sm:flex-row sm:items-center">' + UI.img(c.image, c.name + ' building', 'aspect-[16/10] w-full shrink-0 rounded-[1.25rem] object-cover sm:w-44', { w: 352, h: 220 }) + '<span class="min-w-0 text-sm"><b class="block font-display text-lg">' + UI.esc(c.chamberName) + '</b><span class="block text-cocoa/70">' + UI.esc(c.area + ', ' + c.city) + '</span>' +
        c.schedule.map(function (s) { return '<span class="mt-1 block"><b>' + UI.esc(s.label) + '</b> · ' + UI.esc(s.hours) + '</span>'; }).join('') + '<span class="mt-2 inline-flex rounded-full bg-sage-100 px-3 py-1 font-semibold text-sage-700">Fee for your visit ' + UI.formatBDT(fee(c)) + '</span></span></span>'); }).join('') + '</div>' + errP('chamber') + '</fieldset>';
  }
  function calendar() {
    var c = chamber(), t = today(), end = addDays(t, RANGE - 1), first = new Date(view.y, view.m, 1), off = (first.getDay() + 1) % 7, total = new Date(view.y, view.m + 1, 0).getDate(), cells = [], tab = '';
    for (var i = 0; i < off; i++) cells.push(null); for (var d = 1; d <= total; d++) cells.push(new Date(view.y, view.m, d)); while (cells.length % 7) cells.push(null);
    var inView = parse(state.date) && parse(state.date).getMonth() === view.m && parse(state.date).getFullYear() === view.y;
    cells.forEach(function (x) { if (!tab && x && dayOpen(c, iso(x)) && (!inView || iso(x) === state.date)) tab = iso(x); });
    var rows = ''; for (var r = 0; r < cells.length; r += 7) rows += '<div role="row" class="grid grid-cols-7 gap-1">' + cells.slice(r, r + 7).map(function (x) {
      if (!x) return '<div role="gridcell" class="h-11"></div>'; var k = iso(x), open = dayOpen(c, k), sel = k === state.date;
      return '<div role="gridcell" aria-selected="' + sel + '" class="flex justify-center"><button type="button" data-date="' + k + '" tabindex="' + (k === tab ? 0 : -1) + '"' + (open ? '' : ' aria-disabled="true"') + ' aria-label="' + longDate(k) + (open ? '' : ', unavailable') + '" class="h-11 w-11 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40 ' + (sel ? 'bg-clay-grad text-white shadow-clay-btn' : open ? 'bg-cream text-cocoa shadow-clay hover:-translate-y-0.5' : 'cursor-not-allowed text-cocoa/30') + '">' + x.getDate() + '</button></div>';
    }).join('') + '</div>';
    var prevOff = new Date(view.y, view.m, 0) < t, nextOff = new Date(view.y, view.m + 1, 1) > end;
    return '<div class="mb-4 flex items-center justify-between gap-3"><button type="button" data-month="-1" aria-label="Previous month"' + (prevOff ? ' disabled' : '') + ' class="' + UI.cls.arrowBtn + ' !h-11 !w-11 disabled:opacity-40">' + UI.icon('chevron-left') + '</button><p class="font-display text-lg font-semibold" aria-live="polite">' + first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) + '</p><button type="button" data-month="1" aria-label="Next month"' + (nextOff ? ' disabled' : '') + ' class="' + UI.cls.arrowBtn + ' !h-11 !w-11 disabled:opacity-40">' + UI.icon('chevron-right') + '</button></div>' +
      '<div role="grid" aria-label="Choose a date" data-grid class="space-y-1"><div role="row" class="grid grid-cols-7 gap-1 pb-2 text-center text-xs font-semibold uppercase tracking-wider text-cocoa/60">' + WEEK.map(function (d) { return '<div role="columnheader">' + DAYS[d].slice(0, 3) + '</div>'; }).join('') + '</div>' + rows + '</div>';
  }
  function slotsHTML() {
    var c = chamber(); if (!state.date) return '<p class="text-cocoa/70">Choose a date to see the times that are open.</p>';
    var list = slotsFor(c, state.date), left = list.filter(function (s) { return !s.booked; }).length;
    return '<h3 class="font-display text-lg font-semibold">' + longDate(state.date) + '</h3><p class="mt-1 text-sm text-cocoa/70">' + left + ' of ' + list.length + ' slots left · ' + c.slotMinutes + ' minutes each</p><div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">' + list.map(function (s) {
      return '<button type="button" data-slot="' + s.time + '" aria-pressed="' + (s.time === state.time) + '"' + (s.booked ? ' disabled aria-label="' + clock(s.time) + ', booked"' : '') + ' class="min-h-[2.75rem] rounded-full px-4 py-2 text-sm font-semibold shadow-clay transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40 ' + (s.booked ? 'bg-cream-100 text-cocoa/40 line-through' : 'bg-cream hover:-translate-y-0.5 aria-pressed:bg-clay-grad aria-pressed:text-white aria-pressed:shadow-clay-btn') + '">' + clock(s.time) + (s.booked ? '<span class="sr-only"> booked</span>' : '') + '</button>'; }).join('') + '</div>';
  }
  function step3() {
    var c = chamber(), e = earliest(c); if (!c) return '<p>Please choose a chamber first.</p>';
    return '<h3 class="font-display text-lg font-semibold">' + UI.esc(c.chamberName) + ' · ' + UI.esc(c.schedule.map(function (s) { return s.label + ' ' + s.hours; }).join(' and ')) + '</h3>' +
      (e ? '<p class="mt-3 flex flex-wrap items-center gap-3 rounded-2xl bg-sage-100 px-4 py-3 text-sm"><span>Earliest available: <b>' + longDate(e.date) + ', ' + clock(e.time) + '</b></span><button type="button" data-earliest class="rounded-full bg-cream px-4 py-2 font-semibold shadow-clay focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40">Choose it</button></p>' : '<p class="mt-3 text-sm">No open slots in the next ' + RANGE + ' days. Please call the desk.</p>') +
      '<div class="mt-6 grid gap-8 md:grid-cols-2"><div data-cal>' + calendar() + '</div><div data-slots aria-live="polite">' + slotsHTML() + '</div></div>' + errP('datetime') + '<p class="mt-4 text-xs text-cocoa/60">Dates in the next ' + RANGE + ' days are shown. Greyed days are closed or fully booked.</p>';
  }
  function step4() {
    var d = state.details, rel = d.bookingFor && d.bookingFor !== 'Myself';
    function chips(name, list) { return '<div class="grid grid-cols-' + list.length + ' gap-3">' + list.map(function (v) { return radioCard(name, v, d[name] === v, '<b class="block text-center text-sm">' + v + '</b>'); }).join('') + '</div>' + errP(name); }
    return '<div class="grid gap-6 sm:grid-cols-2">' + UI.field({ label: 'Who is the visit for?', name: 'bookingFor', type: 'select', required: true, options: ['Myself', 'Family member', 'My child'], value: d.bookingFor || '' }) +
      '<div data-relation class="' + (rel ? '' : 'hidden') + '">' + UI.field({ label: 'Relationship to you', name: 'patientRelation', required: true, value: d.patientRelation || '', hint: 'For example: mother, father or sister' }) + '</div>' +
      UI.field({ label: 'Patient’s full name', name: 'fullName', required: true, autocomplete: 'name', value: d.fullName || '', hint: 'As on the national ID or birth certificate' }) + UI.field({ label: 'Patient’s age', name: 'age', type: 'number', required: true, min: 1, max: 110, value: d.age || '', hint: 'Between 1 and 110 years' }) +
      '<fieldset class="sm:col-span-2"><legend class="mb-2 text-sm font-semibold">Gender <span class="text-clay-600" aria-hidden="true">*</span></legend>' + chips('gender', ['Female', 'Male', 'Other']) + '</fieldset>' +
      UI.field({ label: 'Mobile number', name: 'phone', type: 'tel', required: true, validate: 'bd-phone', autocomplete: 'tel', value: d.phone || '', hint: 'For example 01712-345678. We confirm by SMS or WhatsApp.' }) + UI.field({ label: 'Email (optional)', name: 'email', type: 'email', autocomplete: 'email', value: d.email || '' }) +
      UI.field({ label: 'Area where you live', name: 'area', required: true, value: d.area || '', hint: 'For example: Upashahar, Sylhet' }) +
      '<fieldset><legend class="mb-2 text-sm font-semibold">Main area of the problem <span class="text-clay-600" aria-hidden="true">*</span></legend>' + chips('mainArea', ['Ear', 'Nose', 'Throat', 'Other']).replace('grid-cols-4', 'grid-cols-2 sm:grid-cols-4') + '</fieldset>' +
      '<div class="sm:col-span-2">' + UI.field({ label: 'Describe your concern', name: 'concern', type: 'textarea', required: true, minlength: 15, rows: 4, value: d.concern || '', hint: 'At least 15 characters. This is not a diagnosis, and the doctor will examine you.' }) + '</div>' +
      '<div class="sm:col-span-2">' + UI.field({ name: 'hasReports', type: 'checkbox', labelHTML: 'I have previous reports, scans or prescriptions to bring.' }) + '</div><div class="sm:col-span-2">' + UI.field({ name: 'consent', type: 'checkbox', required: true, labelHTML: 'I agree that the clinic may use these details to contact me about this appointment.' }) + '</div></div>' +
      '<p class="mt-6 flex gap-2 rounded-2xl bg-clay-50 p-4 text-sm text-cocoa/80">' + UI.icon('alert-circle', 'h-5 w-5 shrink-0 text-clay-600') + '<span>For trouble breathing or swallowing, a swallowed button battery or magnet, or bleeding that will not stop, go to the nearest emergency department or call ' + SITE.contact.nationalEmergency + ' instead of booking.</span></p>';
  }
  function step5() {
    var d = state.details, c = chamber(), s = service();
    function row(label, val, goto) { return '<div class="flex items-start justify-between gap-4 py-3"><dt class="text-sm text-cocoa/65">' + label + '</dt><dd class="flex-1 text-right text-sm font-semibold break-words">' + UI.esc(val || '—') + (goto ? ' <button type="button" data-goto="' + goto + '" class="ml-2 rounded-full px-3 py-1 text-xs font-semibold text-clay-700 underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40" aria-label="Edit ' + label.toLowerCase() + '">Edit</button>' : '') + '</dd></div>'; }
    return '<dl class="divide-y divide-cocoa/10 rounded-[1.75rem] bg-cream-100 px-5 shadow-well">' + row('Visit', typeName(), 1) + row('Concern', s && s.name, 1) + row('Chamber', c && c.chamberName + ', ' + c.city, 2) + row('Date', longDate(state.date), 3) + row('Time', state.time && clock(state.time), 3) +
      row('Patient', [d.fullName, d.age && d.age + ' years', d.gender].filter(Boolean).join(', '), 4) + row('Booking for', d.bookingFor === 'Myself' ? 'Myself' : (d.bookingFor || '') + (d.patientRelation ? ' (' + d.patientRelation + ')' : ''), 4) + row('Contact', [d.phone, d.email].filter(Boolean).join(' · '), 4) + row('Main area', d.mainArea + (d.hasReports ? ' · bringing reports' : ''), 4) + row('Concern noted', d.concern, 4) + '</dl>' +
      '<p class="mt-6 flex items-center justify-between rounded-2xl bg-sage-100 px-5 py-4 font-display text-lg font-semibold"><span>Consultation fee</span><span>' + UI.formatBDT(fee(c)) + '</span></p>' +
      '<fieldset class="mt-8">' + legend('How would you like to pay?') + '<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">' + PAYS.map(function (p) { return radioCard('payment', p, state.payment === p, '<b class="block text-center text-sm">' + p + '</b>'); }).join('') + '</div>' + errP('payment') + '<p class="mt-3 text-sm text-cocoa/70">This is only your preference. No money is taken online, and you pay at the chamber after the consultation.</p></fieldset>' +
      '<p class="mt-6 text-sm leading-relaxed text-cocoa/70">Need to change or cancel? Call ' + UI.esc(SITE.contact.phone.display) + ' at least three hours before your slot and we will move it free of charge. Final charges for tests or procedures are quoted after examination.</p>';
  }

  /* ---------- wizard shell ---------- */
  function indicator() {
    return '<ol aria-label="Booking steps" class="flex items-center justify-between gap-2">' + STEPS.map(function (t, i) { var n = i + 1, cur = n === state.step, done = n < state.step;
      return '<li' + (cur ? ' aria-current="step"' : '') + ' class="flex flex-1 flex-col items-center gap-2 text-center"><span class="flex h-11 w-11 items-center justify-center rounded-full font-display font-semibold ' + (cur ? 'bg-clay-grad text-white shadow-clay-btn' : done ? 'bg-sage-100 text-sage-700 shadow-clay' : 'bg-cream-100 text-cocoa/60 shadow-well') + '">' + (done ? UI.icon('check', 'h-5 w-5') : n) + '</span><span class="text-xs font-semibold ' + (cur ? 'text-cocoa' : 'hidden text-cocoa/60 sm:block') + '">' + t + '</span></li>'; }).join('') + '</ol>' +
      '<div role="progressbar" aria-label="Booking progress" aria-valuemin="1" aria-valuemax="5" aria-valuenow="' + state.step + '" class="mt-5 h-3 rounded-full bg-cream-100 shadow-well"><div data-bar class="h-full rounded-full bg-clay-grad"></div></div>';
  }
  function renderStep(focus) {
    var fn = [null, step1, step2, step3, step4, step5][state.step];
    root.querySelector('[data-indicator]').innerHTML = indicator(); root.querySelector('[data-bar]').style.width = state.step * 20 + '%';
    body.innerHTML = '<div data-step-panel class="motion-safe:animate-tilt-in"><h2 data-step-heading tabindex="-1" class="mb-6 font-display text-2xl font-semibold focus:outline-none md:text-3xl">Step ' + state.step + ' of 5 · ' + STEPS[state.step - 1] + '</h2>' + fn() + '</div>';
    var last = state.step === 5;
    root.querySelector('[data-nav]').innerHTML = (state.step > 1 ? '<button type="button" data-back class="' + UI.cls.btnSoft + '">' + UI.icon('arrow-left', 'h-5 w-5') + 'Back</button>' : '<span></span>') + '<button type="submit" data-next class="' + UI.cls.btnPrimary + '">' + (last ? 'Confirm appointment' + UI.icon('check', 'h-5 w-5') : 'Next' + UI.icon('arrow-right', 'h-5 w-5')) + '</button>';
    if (state.step === 4) { var rel = body.querySelector('[name="patientRelation"]'); if (rel && body.querySelector('[data-relation]').classList.contains('hidden')) rel.disabled = true; ['hasReports', 'consent'].forEach(function (n) { var el = body.querySelector('[name="' + n + '"]'); if (el) el.checked = !!state.details[n]; }); }
    UI.mount(body); root.querySelector('[data-live]').textContent = 'Step ' + state.step + ' of 5: ' + STEPS[state.step - 1];
    if (focus) { var h = body.querySelector('[data-step-heading]'); if (h) h.focus(); if (form.scrollIntoView) form.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    save();
  }
  function collect() {
    if (state.step !== 4) return; var d = state.details;
    ['fullName', 'age', 'phone', 'email', 'area', 'bookingFor', 'patientRelation', 'concern'].forEach(function (n) { var el = form.elements.namedItem(n); if (el) d[n] = el.value; });
    ['gender', 'mainArea'].forEach(function (n) { var c = form.querySelector('[name="' + n + '"]:checked'); if (c) d[n] = c.value; }); ['hasReports', 'consent'].forEach(function (n) { var el = form.elements.namedItem(n); if (el) d[n] = !!el.checked; });
  }
  function setError(name, msg) { var el = form.querySelector('[data-error-for="' + name + '"]'); if (el) { el.textContent = msg; el.classList.remove('hidden'); } var f = form.querySelector('[name="' + name + '"]'); if (f) { f.setAttribute('aria-invalid', 'true'); f.focus(); } }
  function validStep() {
    if (state.step === 3) { if (state.date && state.time) return true; var e = form.querySelector('[data-error-for="datetime"]'); if (e) { e.textContent = state.date ? 'Please choose a time.' : 'Please choose a date and a time.'; e.classList.remove('hidden'); } return false; }
    var ok = UI.validateForm(form); if (!ok) return false; collect();
    if (state.step === 4) { var age = Number(state.details.age); if (!(age >= 1 && age <= 110) || Math.floor(age) !== age) { setError('age', 'Enter an age between 1 and 110.'); return false; } }
    return true;
  }
  function go(n, focus) { collect(); state.step = Math.min(5, Math.max(1, n)); if (state.step === 3) { revalidate(); var v = parse(state.date) || today(); view.y = v.getFullYear(); view.m = v.getMonth(); } renderStep(focus); }

  /* ---------- submit and confirmation ---------- */
  function payload() {
    var d = state.details, c = chamber();
    return { visitType: state.type, serviceSlug: state.service, chamberSlug: state.chamber, date: state.date, time: state.time, slotMinutes: c.slotMinutes, fee: fee(c), paymentPreference: state.payment,
      patient: { fullName: d.fullName.trim(), age: Number(d.age), gender: d.gender, phone: toE164(d.phone), email: (d.email || '').trim(), area: d.area.trim(), bookingFor: d.bookingFor, relation: d.bookingFor === 'Myself' ? '' : (d.patientRelation || '').trim() },
      concern: d.concern.trim(), mainArea: d.mainArea, hasReports: !!d.hasReports, consent: true, source: 'website', createdAt: new Date().toISOString() };
  }
  function refId(res, date) { var tail = String(res.id || '').split('-').pop().replace(/[^A-Z0-9]/gi, '').toUpperCase(); return 'ENT-' + date.replace(/-/g, '').slice(2) + '-' + ('0000' + tail).slice(-4); }
  function ics(ref, p) {
    var c = chamber(), s = p.date.replace(/-/g, '') + 'T' + p.time.replace(':', '') + '00', e = new Date(parse(p.date).getTime()); e = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 0, mins(p.time) + p.slotMinutes);
    var end = iso(e).replace(/-/g, '') + 'T' + UI.pad(e.getHours()) + UI.pad(e.getMinutes()) + '00', esc = function (t) { return String(t).replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n'); }, stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dr Ashfaqur Rahman Talukder//Appointment//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VTIMEZONE', 'TZID:Asia/Dhaka', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0600', 'TZOFFSETTO:+0600', 'TZNAME:+06', 'END:STANDARD', 'END:VTIMEZONE', 'BEGIN:VEVENT', 'UID:' + ref + '@drashfaqtalukder.com', 'DTSTAMP:' + stamp,
      'DTSTART;TZID=Asia/Dhaka:' + s, 'DTEND;TZID=Asia/Dhaka:' + end, 'SUMMARY:' + esc('ENT appointment with ' + DOC.name), 'LOCATION:' + esc(c.name + ', ' + c.address), 'DESCRIPTION:' + esc('Reference ' + ref + '. Arrive 15 minutes early and bring your reports. Phone ' + c.phone.display + '.'), 'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Appointment in one hour', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  function download(name, text) { var url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' })), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000); }
  function confirmation(ref, p) {
    var c = chamber(), s = service(), msg = 'My ENT appointment with ' + DOC.name + ': ' + longDate(p.date) + ', ' + clock(p.time) + ' at ' + c.chamberName + ', ' + c.address + '. Reference ' + ref + '.';
    function row(l, v) { return '<div class="flex justify-between gap-4 py-3 text-sm"><dt class="text-cocoa/65">' + l + '</dt><dd class="text-right font-semibold break-words">' + UI.esc(v) + '</dd></div>'; }
    root.innerHTML = '<div data-component="BookingConfirmation" data-reveal="pop" class="text-center"><div class="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-orb-sage text-white shadow-clay-lg motion-safe:animate-float">' + UI.icon('check', 'h-14 w-14') + '</div><div aria-hidden="true" class="mx-auto mt-3 h-3 w-24 rounded-full bg-cocoa/25 blur-md"></div>' +
      '<h2 data-confirm-heading tabindex="-1" class="mt-6 font-display text-3xl font-semibold focus:outline-none md:text-4xl">Your appointment is booked</h2><p class="mt-3 text-cocoa/75">Reference number</p><p class="mt-1 inline-block rounded-full bg-cream-100 px-6 py-2 font-display text-2xl font-semibold shadow-well" data-ref>' + UI.esc(ref) + '</p>' +
      '<p class="mx-auto mt-5 max-w-lg text-cocoa/80">Please arrive 15 minutes early and bring your reports. The clinic desk will confirm by SMS or WhatsApp on ' + UI.esc(p.patient.phone) + '.</p>' +
      '<dl class="mx-auto mt-8 max-w-lg divide-y divide-cocoa/10 rounded-[1.75rem] bg-cream-100 px-6 text-left shadow-well">' + row('Patient', p.patient.fullName) + row('Visit', typeName() + ' · ' + (s ? s.name : '')) + row('Chamber', c.chamberName + ', ' + c.city) + row('Address', c.address) + row('Date', longDate(p.date)) + row('Time', clock(p.time)) + row('Consultation fee', UI.formatBDT(p.fee) + ' (' + p.paymentPreference + ')') + '</dl>' +
      '<div class="mt-8 flex flex-wrap justify-center gap-3"><button type="button" data-ics class="' + UI.cls.btnPrimary + '">' + UI.icon('calendar', 'h-5 w-5') + 'Add to calendar</button><button type="button" data-print class="' + UI.cls.btnSoft + '">' + UI.icon('printer', 'h-5 w-5') + 'Print</button><a href="https://wa.me/?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnSoft + '">' + UI.icon('share', 'h-5 w-5') + 'Share on WhatsApp</a><button type="button" data-again class="' + UI.cls.btnSoft + '">' + UI.icon('plus', 'h-5 w-5') + 'Book another</button></div>' +
      '<p class="mx-auto mt-8 flex max-w-lg gap-2 rounded-2xl bg-clay-50 p-4 text-left text-sm text-cocoa/80">' + UI.icon('alert-circle', 'h-5 w-5 shrink-0 text-clay-600') + '<span>This booking is for routine care. For trouble breathing or swallowing, a swallowed button battery or magnet, or bleeding that will not stop, go to the nearest emergency department or call ' + SITE.contact.nationalEmergency + '.</span></p></div>';
    UI.mount(root); var h = root.querySelector('[data-confirm-heading]'); if (h) h.focus();
    root.querySelector('[data-ics]').addEventListener('click', function () { download('ent-appointment-' + ref + '.ics', ics(ref, p)); });
    root.querySelector('[data-print]').addEventListener('click', function () { window.print(); }); root.querySelector('[data-again]').addEventListener('click', function () { state = { type: '', service: '', chamber: '', date: '', time: '', step: 1, payment: PAYS[0], details: {}, done: false, busy: false }; build(); renderSummary(); if (root.scrollIntoView) root.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  }
  function submit() {
    if (state.busy) return; state.busy = true; var btn = form.querySelector('[data-next]'), p = payload(); btn.disabled = true; btn.textContent = 'Confirming…';
    SITE.submit('appointment', p).then(function (res) { state.done = true; try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ } confirmation(refId(res, p.date), p); })
      .catch(function () { state.busy = false; btn.disabled = false; btn.textContent = 'Confirm appointment'; UI.toast('We could not send your booking. Please try again or call the desk.', 'error'); });
  }

  /* ---------- events ---------- */
  function onChange(e) {
    var t = e.target, n = t.name; if (!n) return;
    if (n === 'type' || n === 'service') state[n] = t.value;
    else if (n === 'chamber') { state.chamber = t.value; revalidate(); }
    else if (n === 'payment') state.payment = t.value;
    else if (n === 'bookingFor') { var box = form.querySelector('[data-relation]'), rel = form.querySelector('[name="patientRelation"]'), on = t.value && t.value !== 'Myself'; box.classList.toggle('hidden', !on); rel.disabled = !on; }
    collect(); save(); renderSummary();
  }
  function pickDate(k) {
    var c = chamber(); if (!dayOpen(c, k)) return; state.date = k; revalidate(); var d = parse(k); view.y = d.getFullYear(); view.m = d.getMonth(); form.querySelector('[data-cal]').innerHTML = calendar(); form.querySelector('[data-slots]').innerHTML = slotsHTML();
    var err = form.querySelector('[data-error-for="datetime"]'); if (err) err.classList.add('hidden'); var b = form.querySelector('[data-date="' + k + '"]'); if (b) b.focus(); save(); renderSummary();
  }
  function onClick(e) {
    var t = e.target, b;
    if ((b = t.closest('[data-date]'))) pickDate(b.getAttribute('data-date'));
    else if ((b = t.closest('[data-month]'))) { var m = new Date(view.y, view.m + Number(b.getAttribute('data-month')), 1); view.y = m.getFullYear(); view.m = m.getMonth(); form.querySelector('[data-cal]').innerHTML = calendar(); }
    else if ((b = t.closest('[data-slot]'))) { state.time = b.getAttribute('data-slot'); UI.qsa('[data-slot]', form).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); var er = form.querySelector('[data-error-for="datetime"]'); if (er) er.classList.add('hidden'); save(); renderSummary(); }
    else if (t.closest('[data-earliest]')) { var f = earliest(chamber()); if (f) { pickDate(f.date); state.time = f.time; form.querySelector('[data-slots]').innerHTML = slotsHTML(); save(); renderSummary(); } }
    else if ((b = t.closest('[data-goto]'))) go(Number(b.getAttribute('data-goto')), true);
    else if (t.closest('[data-back]')) go(state.step - 1, true);
  }
  function onKey(e) {
    var b = e.target.closest('[data-date]'); if (!b) return; var d = parse(b.getAttribute('data-date')), t = today(), end = addDays(t, RANGE - 1), step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key], n;
    if (step) n = addDays(d, step); else if (e.key === 'Home') n = addDays(d, -((d.getDay() + 1) % 7)); else if (e.key === 'End') n = addDays(d, 6 - ((d.getDay() + 1) % 7)); else if (e.key === 'PageUp') n = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()); else if (e.key === 'PageDown') n = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()); else return;
    e.preventDefault(); if (n < t) n = t; if (n > end) n = end; view.y = n.getFullYear(); view.m = n.getMonth(); var cal = form.querySelector('[data-cal]'); cal.innerHTML = calendar();
    UI.qsa('[data-date]', cal).forEach(function (x) { x.tabIndex = x.getAttribute('data-date') === iso(n) ? 0 : -1; }); var f = cal.querySelector('[data-date="' + iso(n) + '"]'); if (f) f.focus();
  }

  /* ---------- build ---------- */
  function build() {
    document.getElementById('booking-mount').innerHTML = '<h2 class="sr-only">Booking form and summary</h2><div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_24rem]"><aside aria-label="Booking summary" class="lg:order-last lg:sticky lg:top-28"><div class="lg:hidden" data-accordion>' + UI.faqItem({ id: 'booking-summary', question: 'Your booking summary', answerHTML: '<div data-summary></div>', tone: 'light' }) + '</div>' +
      '<div data-component="BookingSummary" data-reveal="tilt" class="' + UI.cls.clay + ' hidden p-7 lg:block"><h2 class="mb-2 font-display text-2xl font-semibold">Your booking</h2><div data-summary></div></div></aside>' +
      '<div data-component="BookingWizard" data-reveal="rise" class="' + UI.cls.clayLg + ' p-5 sm:p-10"><div data-wizard><div data-indicator></div><p class="sr-only" role="status" aria-live="polite" data-live></p><form novalidate id="booking-form" class="mt-10"><div data-body></div><div data-nav class="mt-10 flex items-center justify-between gap-4"></div></form></div></div></div>';
    root = document.querySelector('[data-wizard]'); form = document.getElementById('booking-form'); body = form.querySelector('[data-body]');
    form.addEventListener('submit', function (e) { e.preventDefault(); if (state.busy || state.done) return; if (!validStep()) return; if (state.step < 5) go(state.step + 1, true); else submit(); });
    form.addEventListener('change', onChange); form.addEventListener('input', UI.debounce(function () { collect(); save(); renderSummary(); }, 250)); form.addEventListener('click', onClick); form.addEventListener('keydown', onKey);
    UI.mount(document.getElementById('booking')); renderStep(false); renderSummary();
  }

  UI.ready(function () {
    var hero = UI.pageHero({ eyebrow: 'Book online', title: 'Your appointment, *in five steps*', tone: 'cream', lead: 'Choose your visit, chamber, date and time. We confirm by SMS or WhatsApp, and nothing is paid online.' });
    document.getElementById('hero-mount').innerHTML = hero.replace('pb-20 pt-36', 'pb-10 pt-32').replace('md:pb-32 md:pt-44', 'md:pb-14 md:pt-40'); UI.mount(document.getElementById('page-hero'));
    load(); build();
    var help = [['What happens after I book?', 'The clinic desk checks your slot and confirms by SMS or WhatsApp, usually within a few hours during desk time. You receive a reference number straight away on this page.'], ['Do I pay online?', 'No. You only choose a payment preference. The consultation fee is paid at the chamber with cash, bKash, Nagad or a card, depending on the chamber.'], ['Can I change my slot?', 'Yes. Call the desk at least three hours before your visit and we will move your slot at no charge.'], ['Is this for emergencies?', 'No. Sudden hearing loss should be seen by a doctor within 72 hours, so call us the same day. For trouble breathing, a swallowed button battery or magnet, or bleeding that will not stop, go to the nearest emergency department or call ' + SITE.contact.nationalEmergency + '.']];
    document.getElementById('help-mount').outerHTML = '<div aria-hidden="true" class="bg-cream-100">' + UI.wave('sage') + '</div><section id="help" data-section="help" data-component="BookingHelp" class="' + UI.cls.secSage + '"><div class="' + UI.cls.container + '">' + UI.sectionHead({ eyebrow: 'Good to know', title: 'Booking *questions*, answered', lead: SITE.contact.deskHours + '. Call ' + SITE.contact.phone.display + ' if you would rather book by phone.' }) +
      '<div data-accordion data-accordion-single class="mx-auto mt-14 max-w-3xl space-y-4">' + help.map(function (h, i) { return UI.faqItem({ id: 'book-' + i, question: h[0], answerHTML: '<p>' + UI.esc(h[1]) + '</p>', tone: 'light', open: i === 0 }); }).join('') + '</div></div></section><div aria-hidden="true" class="bg-sage-200">' + UI.wave('cocoa') + '</div>';
    UI.mount(document.getElementById('help'));
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Prefer to *talk first?*', lead: 'The appointment desk is open Saturday to Thursday, 9:00 AM to 8:00 PM. Call or message us and we will find a time with you.', primaryLabel: 'See our chambers', primaryHref: SITE.routes.chambers });
    UI.mount(document.getElementById('cta'));
  });
})();
