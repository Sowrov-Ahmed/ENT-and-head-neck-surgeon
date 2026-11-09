/*
 * js/pages/about.js
 * Path: js/pages/about.js · Owner: Part 2 · Purpose: About page: story, numbers, timeline, approach, expertise cube, credentials, first visit, CTA
 * Depends on: SITE, UI, FX (kit) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var d = SITE.doctor, ob = SITE.img.objects;
    var PORTRAIT = 'assets/img/professional-doctor.png';

    /* data shaped like DB records */
    var milestones = [
      { id: 'mile-001', year: 2005, title: 'MBBS at MAG Osmani Medical College', text: 'Began medical school in Sylhet, where a first rotation in the ENT ward showed him how much a small ear or nose problem changes daily life.' },
      { id: 'mile-002', year: 2010, title: 'Internship and first ENT posting', text: 'Completed his internship and spent a year in district-level ENT outpatients, treating blocked ears, nosebleeds and tonsil infections.' },
      { id: 'mile-003', year: 2012, title: 'MS residency at BSMMU', text: 'Entered the Otolaryngology – Head & Neck Surgery programme in Dhaka and trained in microscope ear surgery and endoscopic sinus surgery.' },
      { id: 'mile-004', year: 2016, title: 'FCPS in ENT', text: 'Qualified as a Fellow of the College of Physicians and Surgeons, and returned to Sylhet to open a hearing and sinus practice.' },
      { id: 'mile-005', year: 2018, title: 'First cochlear implant', text: 'Performed his first cochlear implant for a young child, and began building a team for hearing tests and speech therapy follow-up.' },
      { id: 'mile-006', year: 2021, title: 'Fellowship in Chennai', text: 'Completed a fellowship in cochlear implantation and skull-base surgery, bringing back newer techniques for complex ear and sinus conditions.' },
      { id: 'mile-007', year: 2024, title: 'Associate Professor and Consultant', text: 'Took up an associate professor role and began teaching postgraduate trainees, while opening the Dhaka Uttara chamber for patients from the capital.' },
      { id: 'mile-008', year: 2026, title: 'The 7,000th surgery', text: 'Reached seven thousand operations, from ear and sinus procedures to thyroid surgery, with a team that still phones every patient after discharge.' }
    ];
    var principles = [
      { id: 'prin-001', icon: 'search', title: 'Examine properly', text: 'A camera and microscope examination shows what is actually there, so decisions rest on evidence and not on guesswork.', par: '0.06' },
      { id: 'prin-002', icon: 'message-circle', title: 'Explain plainly', text: 'You hear the diagnosis, the options and the likely cost in everyday Bangla or English, with time for every question.', par: '0.12' },
      { id: 'prin-003', icon: 'heart', title: 'Treat gently first', text: 'Medicines, cleaning, exercises and simple procedures come before surgery whenever they can reasonably help.', par: '0.08' },
      { id: 'prin-004', icon: 'check-circle', title: 'Follow through', text: 'After treatment the clinic checks on your recovery, and the urgent line is open for patients after surgery.', par: '0.14' }
    ];
    var expertise = [
      { icon: 'activity', title: 'Cochlear implants', text: 'Implant surgery and rehabilitation planning for children and adults with severe hearing loss.' },
      { icon: 'shield', title: 'Ear surgery', text: 'Eardrum repair, mastoid surgery and microscope-guided treatment of chronic ear disease.' },
      { icon: 'layers', title: 'Sinus & skull base', text: 'Camera-guided sinus surgery and careful work near the skull base, without external cuts.' },
      { icon: 'sparkles', title: 'Nose & septum', text: 'Septoplasty and functional rhinoplasty to restore breathing, with natural-looking results.' },
      { icon: 'moon', title: 'Sleep surgery', text: 'Sleep study review and surgery for selected snoring and sleep apnoea patients.' },
      { icon: 'target', title: 'Head–neck & thyroid', text: 'Assessment of neck lumps, voice problems and thyroid conditions, with surgery when needed.' }
    ];
    var memberships = ['Bangladesh Society of Otolaryngologists – Head & Neck Surgeons', 'Bangladesh Medical and Dental Council (reg. ' + d.bmdcNo + ')', 'Bangladesh Society of Cochlear Implantation', 'Sylhet Division ENT Forum'];
    var publications = [
      { title: 'Outcomes of paediatric cochlear implantation in a Bangladeshi tertiary centre', source: 'Bangladesh Journal of Otorhinolaryngology', year: 2022 },
      { title: 'Endoscopic management of chronic rhinosinusitis with polyps: a five-year review', source: 'Journal of Sylhet Medical College', year: 2023 },
      { title: 'Benign positional vertigo and the repositioning manoeuvre in primary referral clinics', source: 'Bangladesh Medical Research Council Bulletin', year: 2024 },
      { title: 'Day-care tympanoplasty: patient selection and early recovery', source: 'Bangladesh Journal of Otorhinolaryngology', year: 2025 }
    ];
    var awards = [
      { title: 'Best Clinical Teacher, ENT department', body: 'Postgraduate trainees’ vote', year: 2023 },
      { title: 'Young Investigator Award', body: 'National ENT conference, Dhaka', year: 2019 },
      { title: 'Patient Care Commendation', body: 'Surma Valley Specialized Hospital', year: 2025 }
    ];
    var steps = [
      { id: 'step-001', title: 'Book a 20-minute slot', text: 'Choose a chamber and a time online or by phone. Each patient gets a full twenty minutes, so the waiting room is rarely crowded.' },
      { id: 'step-002', title: 'Tell your story', text: 'The doctor listens first: when it began, what makes it better or worse, and how it affects your sleep, work and family.' },
      { id: 'step-003', title: 'A gentle examination', text: 'Ears, nose and throat are examined with a light and, when helpful, a thin camera. You see the pictures on the screen.' },
      { id: 'step-004', title: 'Tests, only if needed', text: 'A hearing test or scan is suggested only when it changes the decision. Audiometry is done at the Upashahar clinic.' },
      { id: 'step-005', title: 'A clear plan and costs', text: 'You leave with a written plan, simple explanations and an estimate. The final quote is confirmed after examination.' }
    ];
    var bring = ['Earlier hearing tests, scans and discharge papers', 'Prescriptions and a list of your current medicines', 'Your national ID or a family member’s phone number for records', 'For a child: the vaccination card and a favourite toy'];

    /* 1. hero */
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      eyebrow: 'About the doctor', title: 'Careful hands. *Clear explanations.*', tone: 'blush',
      lead: d.name + ' is an ENT and head–neck surgeon who treats hearing, nose, throat and voice problems with patience, precision and plain language.',
      actionsHTML: '<a href="' + SITE.routes.appointment + '" class="' + UI.cls.btnPrimary + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="' + SITE.routes.chambers + '" class="' + UI.cls.btnSoft + '">See chambers</a>'
    });
    UI.mount(document.getElementById('page-hero'));

    /* 2. story */
    var story = UI.wave('cream') + '<section id="story" data-section="story" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '"><div class="grid items-center gap-16 lg:grid-cols-2">' +
      '<div class="' + UI.cls.stage + ' mx-auto w-full max-w-md"><div data-orbit="6" class="relative ' + UI.cls.preserve + '">' +
      '<div data-light class="relative mx-auto w-[82%] rounded-[2.5rem] bg-clay-grad p-3 shadow-clay-lg [transform:translateZ(40px)]"><div class="relative overflow-hidden rounded-[2rem] bg-orb-sage pt-10"><div aria-hidden="true" class="absolute inset-x-8 top-8 h-2/3 rounded-full bg-cream/40 blur-2xl"></div>' + UI.img(PORTRAIT, 'Portrait of ' + d.name + ' in a white coat with a stethoscope', 'relative mx-auto block w-[88%] drop-shadow-[0_18px_18px_rgba(43,29,26,.25)]', { w: 369, h: 506, eager: true }) + '</div></div>' +
      '<div aria-hidden="true" class="mx-auto -mt-6 h-16 w-[92%] rounded-[50%] bg-cocoa/20 blur-xl"></div>' +
      '<div aria-hidden="true" class="absolute -left-2 top-10 w-24 [transform:translateZ(120px)] sm:w-28">' + UI.deco(ob.orbSage, 'w-full motion-safe:animate-float') + '</div>' +
      '<div aria-hidden="true" class="absolute -right-2 bottom-24 w-20 [transform:translateZ(90px)] sm:w-24">' + UI.deco(ob.orbGold, 'w-full motion-safe:animate-float-slow') + '</div></div></div>' +
      '<div class="text-center lg:text-left"><div data-reveal="fade" class="flex justify-center lg:justify-start">' + UI.eyebrow('His story') + '</div>' +
      '<h2 data-reveal="rise" class="mt-5 ' + UI.cls.h2 + ' [&_em]:bg-clay-grad [&_em]:bg-clip-text [&_em]:not-italic [&_em]:text-transparent">' + UI.emph('From a Sylhet ward to a *hearing and sinus* practice') + '</h2>' +
      '<div class="mt-8 space-y-5 text-left text-lg leading-relaxed text-cocoa/80">' +
      '<p data-reveal="rise">' + UI.esc('Dr. Ashfaq chose ENT as a medical student at MAG Osmani Medical College in Sylhet. A young shopkeeper who could not hear his customers, and a child who snored through every night, showed him that the ear, nose and throat shape sleep, school, work and conversation.') + '</p>' +
      '<p data-reveal="rise" data-delay="100">' + UI.esc('He trained in Otolaryngology – Head & Neck Surgery at BSMMU in Dhaka, learning microscope ear surgery and endoscopic sinus surgery from some of the country’s most careful teachers. A fellowship in cochlear implantation and skull-base surgery in Chennai followed.') + '</p>' +
      '<p data-reveal="rise" data-delay="200">' + UI.esc('Then he came home. Today he sees patients in Sylhet and Dhaka, operates at Surma Valley Specialized Hospital and teaches trainees. His rule is simple: examine properly, explain plainly and recommend surgery only when it is likely to help.') + '</p></div>' +
      '<div data-reveal="rise" class="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">' + UI.badge('BMDC ' + d.bmdcNo) + UI.badge(d.languages.join(' and ')) + UI.badge(d.experienceYears + '+ years in practice') + '</div></div></div></div></section>';

    /* 3. numbers */
    var numbers = UI.wave('sage') + '<section id="numbers" data-section="numbers" class="' + UI.cls.secSage + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'By the numbers', title: 'Sixteen years of *steady* work', tone: 'light', lead: 'Figures from clinic and hospital records, rounded down.' }) +
      '<div class="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">' +
      UI.statOrb({ value: d.experienceYears, suffix: '+', label: 'Years in practice', color: 'clay' }) +
      UI.statOrb({ value: d.patientsTreated, suffix: '+', label: 'Patients treated', color: 'sage', delay: 100 }) +
      UI.statOrb({ value: d.surgeriesPerformed, suffix: '+', label: 'Surgeries', color: 'gold', delay: 200 }) +
      UI.statOrb({ value: d.satisfactionPercent, suffix: '%', label: 'Patient satisfaction', color: 'clay', delay: 300 }) + '</div></div></section>';

    /* 4. timeline */
    var tl = milestones.map(function (m, i) {
      var left = i % 2 === 0;
      return '<li class="relative grid gap-4 lg:grid-cols-2 lg:gap-24"><span aria-hidden="true" class="absolute left-0 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-orb font-display text-lg font-semibold text-clay-700 shadow-clay lg:left-1/2 lg:-translate-x-1/2">' + (i + 1) + '</span>' +
        '<div class="pl-16 lg:pl-0 ' + (left ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-2') + '"><div data-scroll-tilt><article data-component="Milestone" id="' + UI.esc(m.id) + '" class="' + UI.cls.clay + ' p-7"><p class="font-display text-3xl font-semibold text-clay-600">' + UI.esc(m.year) + '</p><h3 class="mt-2 ' + UI.cls.h3 + '">' + UI.esc(m.title) + '</h3><p class="mt-3 leading-relaxed text-cocoa/75">' + UI.esc(m.text) + '</p></article></div></div></li>';
    }).join('');
    var timeline = UI.wave('cream') + '<section id="timeline" data-section="timeline" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'The journey', title: 'Twenty-one years, *eight milestones*', tone: 'light' }) +
      '<div class="relative mt-16"><div aria-hidden="true" class="absolute bottom-0 left-6 top-0 w-1.5 -translate-x-1/2 rounded-full bg-clay-200 lg:left-1/2"></div><ol data-component="Timeline" class="space-y-10 lg:space-y-6">' + tl + '</ol></div></div></section>';

    /* 5. approach */
    var pr = principles.map(function (p, i) {
      return '<div data-parallax="0.1" data-par-index="' + i + '" class="pt-2"><article data-component="PrincipleCard" id="' + UI.esc(p.id) + '" data-light class="relative h-full rounded-[2rem] bg-cream p-7 pt-12 text-center shadow-clay"><span class="' + UI.cls.iconBall + ' absolute -top-7 left-1/2 -translate-x-1/2 !h-16 !w-16">' + UI.icon(p.icon, 'h-7 w-7') + '</span><p class="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">Principle ' + (i + 1) + '</p><h3 class="mt-2 ' + UI.cls.h3 + '">' + UI.esc(p.title) + '</h3><p class="mt-3 text-sm leading-relaxed text-cocoa/75">' + UI.esc(p.text) + '</p></article></div>';
    }).join('');
    var approach = UI.wave('blush') + '<section id="approach" data-section="approach" class="' + UI.cls.secBlush + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'How he works', title: 'Four principles *behind every visit*', tone: 'light', lead: 'They sound simple. They are also the reason patients return and send their families.' }) +
      '<div class="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">' + pr + '</div></div></section>';

    /* 6. expertise cube */
    var expertiseSec = UI.wave('mist') + '<section id="expertise" data-section="expertise" class="' + UI.cls.secMist + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Sub-specialities', title: 'Six areas, *one cube*', tone: 'light', lead: 'Drag the cube, or use the arrows, to turn through the six areas Dr. Ashfaq focuses on.' }) +
      '<div class="relative mt-16"><div aria-hidden="true" data-parallax="0.15" class="pointer-events-none absolute right-0 top-0 hidden w-28 md:block">' + UI.deco(ob.orbClay, 'w-full motion-safe:animate-float') + '</div>' + UI.cube(expertise) + '</div></div></section>';

    /* 7. credentials */
    var degrees = d.degrees.map(function (x) { return '<li class="flex gap-3">' + UI.icon('check-circle', 'mt-1 h-5 w-5 shrink-0 text-sage-600') + '<span>' + UI.esc(x) + '</span></li>'; }).join('');
    var mem = memberships.map(function (x) { return '<li class="flex gap-3">' + UI.icon('users', 'mt-1 h-5 w-5 shrink-0 text-clay-600') + '<span>' + UI.esc(x) + '</span></li>'; }).join('');
    var pubs = publications.map(function (x) { return '<li><p class="font-semibold leading-snug">' + UI.esc(x.title) + '</p><p class="text-sm text-cocoa/65">' + UI.esc(x.source) + ' · ' + x.year + '</p></li>'; }).join('');
    var awd = awards.map(function (x) { return '<li class="flex gap-3">' + UI.icon('award', 'mt-1 h-5 w-5 shrink-0 text-gold-600') + '<span><b>' + UI.esc(x.title) + '</b> <span class="block text-sm text-cocoa/65">' + UI.esc(x.body) + ' · ' + x.year + '</span></span></li>'; }).join('');
    function credCard(icon, title, body, delay) {
      return '<article data-component="CredentialCard" data-reveal="pop" data-delay="' + delay + '" data-light class="rounded-[2rem] bg-cream p-7 shadow-clay"><span class="' + UI.cls.iconBall + '">' + UI.icon(icon, 'h-6 w-6') + '</span><h3 class="mt-5 ' + UI.cls.h3 + '">' + UI.esc(title) + '</h3>' + body + '</article>';
    }
    var credentials = UI.wave('cream') + '<section id="credentials" data-section="credentials" class="' + UI.cls.secCream + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'Credentials', title: 'Trained, registered and *still learning*', tone: 'light', lead: 'BMDC registration number ' + d.bmdcNo + '. You can ask to see any certificate at your visit.' }) +
      '<div class="mt-14 grid gap-8 md:grid-cols-2">' +
      credCard('book-open', 'Degrees and fellowship', '<ul class="mt-4 space-y-3 text-cocoa/80">' + degrees + '</ul>', 0) +
      credCard('users', 'Memberships', '<ul class="mt-4 space-y-3 text-cocoa/80">' + mem + '</ul>', 100) +
      credCard('file-text', 'Selected publications', '<ul class="mt-4 space-y-4 text-cocoa/80">' + pubs + '</ul>', 200) +
      credCard('award', 'Awards', '<ul class="mt-4 space-y-4 text-cocoa/80">' + awd + '</ul>', 300) + '</div></div></section>';

    /* 8. first visit */
    var st = steps.map(function (s, i) {
      return '<li data-component="VisitStep" id="' + UI.esc(s.id) + '" class="flex gap-5 rounded-[1.75rem] bg-cream p-6 shadow-clay"><span aria-hidden="true" class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-clay-grad font-display text-lg font-semibold text-white shadow-clay-btn">' + (i + 1) + '</span><div><h3 class="' + UI.cls.h3 + '">' + UI.esc(s.title) + '</h3><p class="mt-2 leading-relaxed text-cocoa/75">' + UI.esc(s.text) + '</p></div></li>';
    }).join('');
    var bringList = bring.map(function (x) { return '<li class="flex gap-3">' + UI.icon('check', 'mt-1 h-5 w-5 shrink-0 text-sage-600') + '<span>' + UI.esc(x) + '</span></li>'; }).join('');
    var visit = UI.wave('sage') + '<section id="first-visit" data-section="first-visit" class="' + UI.cls.secSage + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ eyebrow: 'First visit', title: 'Your first *consultation*', tone: 'light', lead: 'Five calm steps, from booking to a written plan.' }) +
      '<div class="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]"><div data-scroll-tilt class="relative"><div aria-hidden="true" class="absolute inset-x-6 -bottom-6 h-10 rounded-[50%] bg-cocoa/20 blur-xl"></div><ol data-component="VisitSteps" class="relative space-y-4 rounded-[2.5rem] bg-sage-100 p-4 shadow-clay-lg md:p-6">' + st + '</ol></div>' +
      '<aside data-component="BringList" data-reveal="pop" class="' + UI.cls.clayLg + ' p-7"><span class="' + UI.cls.iconBall + '">' + UI.icon('file-text', 'h-6 w-6') + '</span><h3 class="mt-5 ' + UI.cls.h3 + '">What to bring</h3><ul class="mt-4 space-y-3 text-cocoa/80">' + bringList + '</ul>' +
      '<p class="mt-6 rounded-2xl bg-clay-50 p-4 text-sm leading-relaxed text-cocoa/80"><b>Emergency note.</b> If you have trouble breathing or swallowing, bleeding that will not stop, or a child has swallowed a button battery or magnet, do not wait for a chamber visit. Go to the nearest emergency department or call ' + UI.esc(SITE.contact.nationalEmergency) + '.</p></aside></div></div></section>' + UI.wave('cocoa');

    document.getElementById('story-mount').outerHTML = story;
    document.getElementById('rest-mount').outerHTML = numbers + timeline + approach + expertiseSec + credentials + visit + '<div id="cta-mount"></div>';
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'One visit can change how you *hear the world*', lead: 'Book a first consultation in Sylhet or Dhaka. Evening and Friday slots are available, and the desk answers Saturday to Thursday.' });
    UI.qsa('[data-par-index]').forEach(function (el) { el.setAttribute('data-parallax', principles[Number(el.getAttribute('data-par-index'))].par); });
    ['story', 'numbers', 'timeline', 'approach', 'expertise', 'credentials', 'first-visit', 'cta'].forEach(function (id) { UI.mount(document.getElementById(id)); });
  });
})();
