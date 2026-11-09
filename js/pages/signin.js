/*
 * js/pages/signin.js — Sign-in / create account page script
 * Path: js/pages/signin.js · Owner: Part 1 · Purpose: renders the tabbed auth card, scene objects, validation and form submission
 * Depends on: SITE, UI, FX (shared kit) · Exposes: nothing
 */
(function () {
  'use strict';
  var C = UI.cls, S = SITE, OB = S.img.objects;

  function deco(src, pos, z, anim) {
    return '<div class="absolute ' + pos + ' [transform:translateZ(' + z + 'px)]">' + UI.deco(src, 'w-full ' + (anim || 'motion-safe:animate-float')) + '</div>';
  }
  function passToggle(inputId) {
    return '<button type="button" data-toggle-pass="' + inputId + '" aria-controls="' + inputId + '" aria-pressed="false" class="mt-1 inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-sm font-semibold text-clay-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40">' + UI.icon('eye', 'h-4 w-4') + '<span>Show password</span></button>';
  }
  function submitBtn(label) { return '<button type="submit" class="' + C.btnPrimary + ' w-full">' + UI.esc(label) + UI.icon('arrow-right', 'h-5 w-5') + '</button>'; }

  function signinForm() {
    return '<form id="form-signin" novalidate data-component="SignInForm" class="mt-6 space-y-5">' +
      UI.field({ label: 'Mobile number or email', name: 'login-id', type: 'text', required: true, autocomplete: 'username' }) +
      '<div>' + UI.field({ label: 'Password', name: 'login-password', type: 'password', required: true, autocomplete: 'current-password' }) + passToggle('f-login-password') + '</div>' +
      '<div class="flex flex-wrap items-center justify-between gap-3">' + UI.field({ name: 'remember', type: 'checkbox', labelHTML: 'Remember me on this device' }) +
      '<button type="button" data-show-forgot class="inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-semibold text-clay-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40">Forgot password?</button></div>' +
      submitBtn('Sign in') + '</form>';
  }
  function forgotForm() {
    return '<form id="form-forgot" novalidate hidden data-component="ForgotPasswordForm" class="mt-6 space-y-5"><p class="text-sm leading-relaxed text-cocoa/75">Enter the mobile number or email you used to register. If an account exists, we will send a reset link or code.</p>' +
      UI.field({ label: 'Mobile number or email', name: 'forgot-id', type: 'text', required: true, autocomplete: 'username' }) + submitBtn('Send reset instructions') +
      '<button type="button" data-show-signin class="' + C.btnGhost + ' w-full">' + UI.icon('arrow-left', 'h-5 w-5') + 'Back to sign in</button></form>';
  }
  function registerForm() {
    var meter = '<div class="mt-3"><div id="strength-meter" data-score="0" aria-hidden="true" class="flex gap-2">' + [0, 1, 2, 3].map(function () { return '<span class="h-2 flex-1 rounded-full bg-cocoa/15 transition duration-300"></span>'; }).join('') + '</div>' +
      '<p id="strength-label" role="status" class="mt-2 text-xs font-semibold text-cocoa/70">Password strength: start typing</p></div>';
    return '<form id="form-register" novalidate data-component="RegisterForm" class="mt-6 space-y-5">' +
      UI.field({ label: 'Full name', name: 'reg-name', type: 'text', required: true, autocomplete: 'name', minlength: 3 }) +
      UI.field({ label: 'Mobile number', name: 'reg-phone', type: 'tel', required: true, validate: 'bd-phone', autocomplete: 'tel' }) +
      UI.field({ label: 'Email', name: 'reg-email', type: 'email', required: true, autocomplete: 'email' }) +
      '<div>' + UI.field({ label: 'Password', name: 'reg-password', type: 'password', required: true, minlength: 8, autocomplete: 'new-password', hint: 'At least 8 characters. Mix letters, numbers and symbols.' }) + passToggle('f-reg-password') + meter + '</div>' +
      UI.field({ label: 'Confirm password', name: 'confirmPassword', type: 'password', required: true, autocomplete: 'new-password' }) +
      UI.field({ name: 'reg-terms', type: 'checkbox', required: true, labelHTML: 'I agree to the terms of use and understand my details are used only to manage my appointments.' }) +
      submitBtn('Create account') + '</form>';
  }

  function extraSections() {
    var steps = [['Create your account', 'Add your name, mobile number and email. It takes about a minute.'], ['Choose a chamber and day', 'Pick Zindabazar, Upashahar or Uttara and a day when that chamber is open.'], ['Arrive with your reports', 'Bring earlier tests and your medicines. The doctor will explain every option.']];
    var help = [['phone', 'Call the desk', S.contact.phone.display, 'tel:' + S.contact.phone.e164], ['message-circle', 'WhatsApp', 'Message the clinic team', S.contact.whatsappUrl], ['mail', 'Email', S.contact.email, 'mailto:' + S.contact.email]];
    return UI.wave('cream') + '<section id="getting-started" data-section="getting-started" data-component="GettingStarted" class="' + C.secCream + '"><div class="' + C.container + '">' +
      UI.sectionHead({ eyebrow: 'Getting started', title: 'Three calm steps to *your first visit*', lead: 'An account is optional, but it keeps your bookings and follow-ups together.' }) +
      '<ol class="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3 ' + C.stage + '">' + steps.map(function (s, i) {
        return '<li data-scroll-tilt class="relative"><div class="h-full rounded-[2rem] bg-cream px-6 pb-8 pt-14 text-center shadow-clay-lg"><span aria-hidden="true" class="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-orb font-display text-2xl font-semibold shadow-clay-lg">' + (i + 1) + '</span><h3 class="' + C.h3 + '">' + UI.esc(s[0]) + '</h3><p class="mt-3 text-sm leading-relaxed text-cocoa/75">' + UI.esc(s[1]) + '</p></div></li>';
      }).join('') + '</ol></div></section>' + UI.wave('sage') +
      '<section id="help" data-section="help" data-component="SignInHelp" class="' + C.secSage + '"><div class="' + C.container + '">' +
      UI.sectionHead({ eyebrow: 'Need a hand?', title: 'We can help you *sign in*', lead: S.contact.deskHours + '. We will never ask for your password by phone or WhatsApp.' }) +
      '<ul class="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3">' + help.map(function (h, i) {
        return '<li data-reveal="pop" data-delay="' + (i * 100) + '"><a href="' + UI.esc(h[3]) + '" class="flex h-full flex-col items-center rounded-[2rem] bg-cream p-7 text-center shadow-clay transition duration-500 ease-out hover:-translate-y-2 hover:shadow-clay-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40"><span class="' + C.iconBall + '">' + UI.icon(h[0], 'h-6 w-6') + '</span><h3 class="mt-5 ' + C.h3 + '">' + UI.esc(h[1]) + '</h3><p class="mt-2 break-words text-sm text-cocoa/75">' + UI.esc(h[2]) + '</p></a></li>';
      }).join('') + '</ul></div></section>';
  }
  function render() {
    document.getElementById('more-mount').outerHTML = extraSections();
    var scene = document.getElementById('auth-scene');
    scene.innerHTML = '<div data-orbit="9" class="absolute inset-0 ' + C.preserve + '">' + deco(OB.orbClay, 'left-[8%] top-[12%] w-24 sm:w-32', 110) + deco(OB.cube, 'right-[10%] top-[6%] w-24 sm:w-32', 70, 'motion-safe:animate-float-slow') + deco(OB.orbSage, 'left-[38%] bottom-[2%] w-20 sm:w-24', 150) + deco(OB.torus, 'right-[28%] bottom-[18%] w-16', -30) + '</div>';
    var perks = [['calendar', 'bg-orb', 'See your appointments in one place'], ['check', 'bg-orb-sage', 'Book follow-up visits in a few taps'], ['shield', 'bg-orb-gold', 'Your details stay private']];
    document.getElementById('benefits-mount').innerHTML = perks.map(function (p, i) {
      return '<li data-reveal="pop" data-delay="' + (200 + i * 100) + '" class="flex items-center gap-4 rounded-[2rem] bg-cream p-4 shadow-clay"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ' + p[1] + ' text-clay-700 shadow-clay">' + UI.icon(p[0], 'h-5 w-5') + '</span><span class="font-semibold">' + UI.esc(p[2]) + '</span></li>';
    }).join('');
    var tabs = [['signin', 'Sign in'], ['register', 'Create account']];
    document.getElementById('auth-mount').innerHTML = '<div data-reveal="pop" data-light class="' + C.clayLg + ' p-6 sm:p-10"><div data-tabs data-component="AuthTabs">' +
      '<div role="tablist" aria-label="Account options" class="flex flex-wrap justify-center gap-3">' + tabs.map(function (t, i) {
        return '<button type="button" role="tab" id="tab-' + t[0] + '" data-tab="' + t[0] + '" aria-controls="panel-' + t[0] + '" aria-selected="' + (i === 0) + '" class="' + C.tab + ' min-h-[44px]">' + t[1] + '</button>';
      }).join('') + '</div>' +
      '<div role="tabpanel" id="panel-signin" data-tab-panel="signin" aria-labelledby="tab-signin" tabindex="0"><div id="signin-box"><h2 id="signin-title" class="mt-8 ' + C.h3 + '">Welcome back</h2>' + signinForm() + forgotForm() + '</div></div>' +
      '<div role="tabpanel" id="panel-register" data-tab-panel="register" aria-labelledby="tab-register" tabindex="0" class="hidden"><h2 class="mt-8 ' + C.h3 + '">Create your account</h2>' + registerForm() + '</div></div></div>';
    UI.mount(document.getElementById('main'));
  }

  function strength(v) {
    var s = 0;
    if (v.length >= 8) s++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return v ? Math.max(1, s) : 0;
  }
  var TONES = ['bg-cocoa/15', 'bg-danger', 'bg-gold', 'bg-sage-400', 'bg-sage-600'], WORDS = ['start typing', 'weak', 'fair', 'good', 'strong'];
  function paintMeter(v) {
    var n = strength(v), segs = UI.qsa('#strength-meter span');
    segs.forEach(function (el, i) { TONES.forEach(function (t) { el.classList.remove(t); }); el.classList.add(i < n ? TONES[n] : TONES[0]); });
    document.getElementById('strength-meter').setAttribute('data-score', String(n));
    document.getElementById('strength-label').textContent = 'Password strength: ' + WORDS[n];
  }

  function fieldError(form, name, msg) {
    var el = form.querySelector('[data-error-for="' + name + '"]'), input = form.elements[name];
    el.textContent = msg; el.classList.toggle('hidden', !msg); input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) input.focus();
  }
  function success(form, title, text, ref, redirect) {
    var box = document.createElement('div');
    box.setAttribute('role', 'status'); box.setAttribute('data-component', 'AuthSuccess'); box.className = 'mt-8 rounded-[2rem] bg-sage-50 p-8 text-center shadow-well';
    box.innerHTML = '<span class="' + C.iconBall + ' mx-auto">' + UI.icon('check-circle', 'h-7 w-7') + '</span><h3 class="mt-5 ' + C.h3 + '">' + UI.esc(title) + '</h3><p class="mt-3 text-cocoa/80">' + UI.esc(text) + '</p><p class="mt-4 text-sm font-semibold text-cocoa/70">Reference: ' + UI.esc(ref) + '</p>' +
      (redirect ? '<p class="mt-2 text-sm text-cocoa/70">Taking you to appointment booking\u2026</p>' : '');
    form.replaceWith(box); UI.toast(title, 'success');
    if (redirect) setTimeout(function () { window.location.href = S.routes.appointment; }, 1400);
  }
  function wire(id, name, payload, extra, done) {
    var form = document.getElementById(id);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!UI.validateForm(form)) return;
      if (extra && !extra(form)) return;
      var btn = form.querySelector('[type="submit"]'); btn.disabled = true; btn.setAttribute('aria-busy', 'true');
      S.submit(name, payload(form)).then(function (res) { done(form, res.id); });
    });
  }

  UI.ready(function () {
    render();
    var root = document.getElementById('auth-mount'), signin = document.getElementById('form-signin'), forgot = document.getElementById('form-forgot'), title = document.getElementById('signin-title');
    function showForgot(on) {
      signin.hidden = on; forgot.hidden = !on; title.textContent = on ? 'Reset your password' : 'Welcome back';
      (on ? forgot : signin).querySelector('input').focus();
    }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-toggle-pass]');
      if (t) {
        var input = document.getElementById(t.getAttribute('data-toggle-pass')), show = input.type === 'password';
        input.type = show ? 'text' : 'password'; t.setAttribute('aria-pressed', String(show));
        t.innerHTML = UI.icon(show ? 'eye-off' : 'eye', 'h-4 w-4') + '<span>' + (show ? 'Hide password' : 'Show password') + '</span>';
      }
      if (e.target.closest('[data-show-forgot]')) showForgot(true);
      if (e.target.closest('[data-show-signin]')) showForgot(false);
    });
    document.getElementById('f-reg-password').addEventListener('input', function (e) { paintMeter(e.target.value); });

    wire('form-signin', 'signin', function (f) { return { identifier: f.elements['login-id'].value.trim(), remember: f.elements.remember.checked }; }, null,
      function (f, ref) { success(f, 'You are signed in', 'Welcome back. We are taking you to appointment booking.', ref, true); });
    wire('form-forgot', 'forgot-password', function (f) { return { identifier: f.elements['forgot-id'].value.trim() }; }, null,
      function (f, ref) { success(f, 'Check your messages', 'If an account exists for those details, a reset link or code is on its way.', ref, false); });
    wire('form-register', 'register', function (f) { return { fullName: f.elements['reg-name'].value.trim(), phone: f.elements['reg-phone'].value.trim(), email: f.elements['reg-email'].value.trim(), termsAccepted: f.elements['reg-terms'].checked }; },
      function (f) { if (f.elements['confirmPassword'].value !== f.elements['reg-password'].value) { fieldError(f, 'confirmPassword', 'The two passwords do not match.'); return false; } return true; },
      function (f, ref) { success(f, 'Your account is ready', 'Thank you for registering. We are taking you to appointment booking.', ref, true); });
  });
})();
