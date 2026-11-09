/*!
 * js/site.js — SHARED CORE (identical for every member; never edit)
 * window.SITE: doctor facts, contact, routes, URL builders, canonical indexes (services, chambers, blog, testimonials),
 * image paths, submit adapter, nextOpening(). Loaded (defer) before ui.js, fx.js, layout.js and page scripts.
 */
(function (window) {
  'use strict';
  /* QA hook: with ?qa=1 collect every runtime error (read by js/qa.js). Harmless otherwise. */
  if (/[?&]qa=1/.test(window.location.search)) {
    window.__qaErrors = window.__qaErrors || [];
    window.addEventListener('error', function (e) { var t = e.target; if (t && t !== window && (t.src || t.href)) window.__qaErrors.push({ type: 'resource', message: 'failed to load ' + (t.src || t.href) }); else window.__qaErrors.push({ type: 'error', message: e.message, src: (e.filename || '').replace(/^.*\//, '') + ':' + e.lineno }); }, true);
    window.addEventListener('unhandledrejection', function (e) { window.__qaErrors.push({ type: 'promise', message: String(e.reason && e.reason.message || e.reason) }); });
    var ce = console.error; console.error = function () { window.__qaErrors.push({ type: 'console.error', message: Array.prototype.join.call(arguments, ' ') }); ce.apply(console, arguments); };
  }
})(window);
(function (window) {
  'use strict';
  var IMG = 'assets/img/';
  var SITE = {
    version: '4.0.0',
    brand: { name: 'Dr. Ashfaqur Rahman Talukder', tagline: 'Hear clearly. Breathe freely. Speak with ease.', domain: 'www.drashfaqtalukder.com', monogram: 'AT' },
    doctor: {
      id: 'doc-001', slug: 'dr-ashfaqur-rahman-talukder', name: 'Dr. Ashfaqur Rahman Talukder', shortName: 'Dr. Ashfaq Talukder',
      title: 'Associate Professor & Consultant, ENT and Head–Neck Surgeon', department: 'Department of Otolaryngology – Head & Neck Surgery',
      specialty: 'ENT, Cochlear Implant & Head–Neck Surgeon',
      degrees: ['MBBS (MAG Osmani Medical College, Sylhet)', 'MS (Otolaryngology – Head & Neck Surgery, BSMMU)', 'FCPS (ENT)', 'Fellowship in Cochlear Implantation & Skull-Base Surgery (Chennai)'],
      bmdcNo: 'A-58463', experienceYears: 16, surgeriesPerformed: 7400, patientsTreated: 34000, satisfactionPercent: 97,
      languages: ['Bangla', 'English'], image: IMG + 'doctor-portrait.svg'
    },
    contact: {
      phone: { display: '+880 1711-406283', e164: '+8801711406283', local: '01711-406283' },
      urgent: { display: '+880 1824-905137', e164: '+8801824905137', local: '01824-905137', note: 'For patients after surgery' },
      nationalEmergency: '999',
      whatsappUrl: 'https://wa.me/8801711406283',
      email: 'care@drashfaqtalukder.com',
      deskHours: 'Appointment desk: Saturday – Thursday, 9:00 AM – 8:00 PM'
    },
    social: { facebook: 'https://www.facebook.com/drashfaqtalukderent', linkedin: 'https://www.linkedin.com/in/drashfaqtalukder', youtube: 'https://www.youtube.com/@drashfaqtalukderent', instagram: 'https://www.instagram.com/drashfaqtalukderent' },
    img: {
      portrait: IMG + 'doctor-portrait.svg', logo: IMG + 'logo-mark.svg',
      layers: { floor: IMG + 'layer-0-floor.svg', outer: IMG + 'layer-1-outer.svg', canal: IMG + 'layer-2-canal.svg', drum: IMG + 'layer-3-drum.svg', ossicles: IMG + 'layer-4-ossicles.svg', cochlea: IMG + 'layer-5-cochlea.svg' },
      objects: { orbClay: IMG + 'obj-orb-clay.svg', orbSage: IMG + 'obj-orb-sage.svg', orbGold: IMG + 'obj-orb-gold.svg', torus: IMG + 'obj-torus.svg', cube: IMG + 'obj-cube.svg', cone: IMG + 'obj-cone.svg', pill: IMG + 'obj-pill.svg', waves: IMG + 'obj-waves.svg', fork: IMG + 'obj-fork.svg' }
    },
    nav: [
      { label: 'Home', href: 'index.html', page: 'home' }, { label: 'About', href: 'about.html', page: 'about' },
      { label: 'Services', href: 'services.html', page: 'services' }, { label: 'Chambers', href: 'chambers.html', page: 'chambers' },
      { label: 'Contact', href: 'contact.html', page: 'contact' }
    ],
    routes: { home: 'index.html', about: 'about.html', services: 'services.html', serviceDetails: 'service-details.html', chambers: 'chambers.html', appointment: 'appointment.html', blog: 'blog.html', blogDetails: 'blog-details.html', testimonials: 'testimonials.html', contact: 'contact.html', faqs: 'faqs.html', signin: 'signin.html', notFound: '404.html' },
    url: {
      service: function (slug) { return 'service-details.html?slug=' + encodeURIComponent(slug); },
      blog: function (slug) { return 'blog-details.html?slug=' + encodeURIComponent(slug); },
      blogCategory: function (c) { return 'blog.html?category=' + encodeURIComponent(c); },
      chamber: function (slug) { return 'chambers.html#' + slug; },
      appointment: function (o) { var p = new URLSearchParams(); Object.keys(o || {}).forEach(function (k) { if (o[k]) p.set(k, o[k]); }); var q = p.toString(); return 'appointment.html' + (q ? '?' + q : ''); }
    },

    servicesIndex: [
      { id: 'svc-001', slug: 'hearing-loss-cochlear', name: 'Hearing Loss & Cochlear Implants', category: 'ear', accent: 'clay', icon: 'activity', image: IMG + 'svc-hearing-loss-cochlear.svg', priceFrom: 3500, priceTo: 3200000, priceUnit: 'from a hearing test to a cochlear implant', short: 'Precise hearing tests, hearing-aid guidance and cochlear implant surgery for children and adults.' },
      { id: 'svc-002', slug: 'ear-infection-tympanoplasty', name: 'Ear Infections & Eardrum Repair', category: 'ear', accent: 'blush', icon: 'shield', image: IMG + 'svc-ear-infection-tympanoplasty.svg', priceFrom: 4000, priceTo: 150000, priceUnit: 'per treatment', short: 'Microscope-guided cleaning, treatment of discharging ears and tympanoplasty to close a perforated eardrum.' },
      { id: 'svc-003', slug: 'vertigo-balance', name: 'Vertigo & Balance Disorders', category: 'ear', accent: 'gold', icon: 'target', image: IMG + 'svc-vertigo-balance.svg', priceFrom: 3000, priceTo: 25000, priceUnit: 'per programme', short: 'Clear diagnosis of dizziness, quick repositioning treatment for positional vertigo and balance rehabilitation.' },
      { id: 'svc-004', slug: 'sinus-endoscopic-surgery', name: 'Sinusitis & Endoscopic Sinus Surgery', category: 'nose', accent: 'mist', icon: 'layers', image: IMG + 'svc-sinus-endoscopic-surgery.svg', priceFrom: 120000, priceTo: 350000, priceUnit: 'per surgery', short: 'Camera-guided treatment of chronic sinusitis, polyps and blocked sinuses without external cuts.' },
      { id: 'svc-005', slug: 'septoplasty-rhinoplasty', name: 'Nasal Obstruction, Septoplasty & Rhinoplasty', category: 'nose', accent: 'blush', icon: 'sparkles', image: IMG + 'svc-septoplasty-rhinoplasty.svg', priceFrom: 90000, priceTo: 450000, priceUnit: 'per surgery', short: 'Straightening a deviated septum to restore breathing, with careful functional and cosmetic nose reshaping.' },
      { id: 'svc-006', slug: 'snoring-sleep-apnoea', name: 'Snoring & Sleep Apnoea', category: 'throat', accent: 'sage', icon: 'moon', image: IMG + 'svc-snoring-sleep-apnoea.svg', priceFrom: 6000, priceTo: 300000, priceUnit: 'from a sleep study to surgery', short: 'Sleep study, weight and lifestyle guidance, devices and surgery to quiet snoring and protect your health.' },
      { id: 'svc-007', slug: 'tonsil-adenoid-children', name: "Tonsils, Adenoids & Children's ENT", category: 'children', accent: 'clay', icon: 'users', image: IMG + 'svc-tonsil-adenoid-children.svg', priceFrom: 60000, priceTo: 180000, priceUnit: 'per surgery', short: 'Gentle, child-friendly care for repeated tonsillitis, blocked adenoids, glue ear and snoring in children.' },
      { id: 'svc-008', slug: 'voice-throat-head-neck', name: 'Voice, Throat & Head–Neck Care', category: 'throat', accent: 'sage', icon: 'message-circle', image: IMG + 'svc-voice-throat-head-neck.svg', priceFrom: 5000, priceTo: 400000, priceUnit: 'from a check-up to thyroid surgery', short: 'Hoarseness, swallowing problems, neck lumps and thyroid conditions, assessed with video laryngoscopy.' }
    ],

    chambersIndex: [
      { id: 'ch-001', slug: 'zindabazar', mode: 'in-person', name: 'Surma Valley Specialized Hospital', chamberName: 'Zindabazar Chamber', area: 'Zindabazar', city: 'Sylhet',
        address: 'House 14, Zindabazar Main Road, Sylhet 3100', phone: { display: '+880 1313-570962', e164: '+8801313570962' },
        schedule: [{ days: [6, 1, 3], label: 'Sat, Mon, Wed', start: '17:00', end: '21:00', hours: '5:00 PM – 9:00 PM' }],
        fee: { firstVisit: 1500, followUp: 800 }, slotMinutes: 20, lat: 24.8949, lng: 91.8687, image: IMG + 'ch-zindabazar.svg' },
      { id: 'ch-002', slug: 'upashahar', mode: 'in-person', name: 'Surma Hearing & Balance Clinic', chamberName: 'Upashahar Chamber', area: 'Upashahar', city: 'Sylhet',
        address: 'Block C, Road 5, Upashahar, Sylhet 3100', phone: { display: '+880 1614-283750', e164: '+8801614283750' },
        schedule: [{ days: [0, 2], label: 'Sun, Tue', start: '10:00', end: '14:00', hours: '10:00 AM – 2:00 PM' }],
        fee: { firstVisit: 1200, followUp: 600 }, slotMinutes: 20, lat: 24.9040, lng: 91.8795, image: IMG + 'ch-upashahar.svg' },
      { id: 'ch-003', slug: 'uttara', mode: 'in-person', name: 'Crescent Head & Neck Centre', chamberName: 'Dhaka Uttara Chamber', area: 'Uttara', city: 'Dhaka',
        address: 'Plot 22, Road 9, Sector 7, Uttara, Dhaka 1230', phone: { display: '+880 1919-648305', e164: '+8801919648305' },
        schedule: [{ days: [4], label: 'Thu', start: '17:00', end: '21:00', hours: '5:00 PM – 9:00 PM' }, { days: [5], label: 'Fri', start: '10:00', end: '13:00', hours: '10:00 AM – 1:00 PM' }],
        fee: { firstVisit: 2000, followUp: 1000 }, slotMinutes: 20, lat: 23.8759, lng: 90.3795, image: IMG + 'ch-uttara.svg' }
    ],

    blogCategories: [
      { slug: 'ear', name: 'Ear' }, { slug: 'nose', name: 'Nose' }, { slug: 'throat', name: 'Throat' }, { slug: 'children', name: 'Children' }, { slug: 'sleep', name: 'Sleep' }, { slug: 'first-aid', name: 'First Aid' }
    ],
    blogIndex: [
      { id: 'blg-001', slug: 'ear-wax-and-cotton-buds', title: 'Ear Wax and Cotton Buds: What ENT Doctors Wish You Knew', category: 'Ear', categorySlug: 'ear', date: '2026-09-26', readMinutes: 6, image: IMG + 'blog-ear-wax-and-cotton-buds.svg', excerpt: 'Ear wax protects your ear, and cotton buds push it deeper. Learn what is normal, what is safe and when to see a doctor.' },
      { id: 'blg-002', slug: 'child-ear-infections-when-to-worry', title: 'Children\u2019s Ear Infections: When to Worry and When to Wait', category: 'Children', categorySlug: 'children', date: '2026-09-02', readMinutes: 6, image: IMG + 'blog-child-ear-infections-when-to-worry.svg', excerpt: 'Ear pain at night is every parent\u2019s worry. How to recognise a real infection, ease the pain and know when antibiotics are needed.' },
      { id: 'blg-003', slug: 'sudden-hearing-loss-act-fast', title: 'Sudden Hearing Loss: Why the First 72 Hours Matter', category: 'Ear', categorySlug: 'ear', date: '2026-08-11', readMinutes: 5, image: IMG + 'blog-sudden-hearing-loss-act-fast.svg', excerpt: 'Waking up unable to hear in one ear is an emergency, not something to wait out. What to do and what treatment involves.' },
      { id: 'blg-004', slug: 'sinusitis-or-allergy', title: 'Sinusitis or Allergy? How to Tell the Difference', category: 'Nose', categorySlug: 'nose', date: '2026-07-21', readMinutes: 6, image: IMG + 'blog-sinusitis-or-allergy.svg', excerpt: 'A blocked nose can mean very different things. Signs that point to infection, allergy or something structural, and what actually helps.' },
      { id: 'blg-005', slug: 'snoring-and-sleep-apnoea-signs', title: 'Snoring and Sleep Apnoea: Signs You Should Not Ignore', category: 'Sleep', categorySlug: 'sleep', date: '2026-06-30', readMinutes: 7, image: IMG + 'blog-snoring-and-sleep-apnoea-signs.svg', excerpt: 'Loud snoring with pauses in breathing strains the heart and steals your energy. How sleep apnoea is diagnosed and treated.' },
      { id: 'blg-006', slug: 'vertigo-dizziness-causes', title: 'Vertigo and Dizziness: Common Causes and What Helps', category: 'Ear', categorySlug: 'ear', date: '2026-05-19', readMinutes: 6, image: IMG + 'blog-vertigo-dizziness-causes.svg', excerpt: 'The room spins when you turn in bed. Most vertigo comes from the inner ear and many cases can be fixed in a single visit.' },
      { id: 'blg-007', slug: 'sore-throat-and-antibiotics', title: 'Sore Throat and Antibiotics: When You Really Need Them', category: 'Throat', categorySlug: 'throat', date: '2026-04-14', readMinutes: 6, image: IMG + 'blog-sore-throat-and-antibiotics.svg', excerpt: 'Most sore throats are viral and antibiotics will not help. How doctors decide, and what relieves the pain in the meantime.' },
      { id: 'blg-008', slug: 'nosebleed-first-aid', title: 'Nosebleed First Aid: What to Do and What to Avoid', category: 'First Aid', categorySlug: 'first-aid', date: '2026-03-08', readMinutes: 5, image: IMG + 'blog-nosebleed-first-aid.svg', excerpt: 'Most nosebleeds look worse than they are. The right way to stop one in ten minutes, and the signs that need urgent care.' }
    ],

    testimonialsIndex: [
      { id: 'tst-001', name: 'Mohammad Abdul Karim', age: 63, area: 'Zindabazar', serviceSlug: 'hearing-loss-cochlear', rating: 5, date: '2026-08-20', quote: 'After years of asking everyone to repeat themselves, my new hearing solution gave me back conversations at the family table. Dr. Ashfaq explained every option and the cost honestly.' },
      { id: 'tst-002', name: 'Shirin Sultana', age: 37, area: 'Upashahar', serviceSlug: 'septoplasty-rhinoplasty', rating: 5, date: '2026-07-12', quote: 'I had breathed through my mouth for fifteen years without realising. Since the septum surgery I sleep deeply and wake up fresh. The follow-up care was careful and kind.' },
      { id: 'tst-003', name: 'Rafiq Ahmed', age: 49, area: 'Dhaka Uttara', serviceSlug: 'snoring-sleep-apnoea', rating: 5, date: '2026-06-05', quote: 'My wife said I stopped breathing at night. The sleep study found severe apnoea. Treatment was explained step by step, and now we both finally sleep through the night.' },
      { id: 'tst-004', name: 'Nasrin Akter', age: 33, area: 'Sylhet', serviceSlug: 'tonsil-adenoid-children', rating: 5, date: '2026-09-09', quote: 'My daughter had tonsillitis every month. The doctor was patient with her fear, and the surgery went smoothly. She eats, sleeps and plays normally again.' },
      { id: 'tst-005', name: 'Tanvir Chowdhury', age: 28, area: 'Upashahar', serviceSlug: 'vertigo-balance', rating: 5, date: '2026-05-27', quote: 'The room used to spin whenever I turned over in bed. One short manoeuvre in the clinic fixed it. I only wish I had come a year sooner.' },
      { id: 'tst-006', name: 'Lutfun Nahar', age: 55, area: 'Zindabazar', serviceSlug: 'sinus-endoscopic-surgery', rating: 5, date: '2026-04-30', quote: 'Years of headaches and a blocked nose. The camera-guided surgery was quick and recovery easier than I feared. I can smell my own kitchen again.' }
    ],

    getService: function (slug) { return SITE.servicesIndex.filter(function (s) { return s.slug === slug; })[0] || null; },
    getChamber: function (slug) { return SITE.chambersIndex.filter(function (c) { return c.slug === slug; })[0] || null; },
    getPost: function (slug) { return SITE.blogIndex.filter(function (b) { return b.slug === slug; })[0] || null; },

    /* Form adapter. Today: short delay then success. Later: replace the body with a real API call. */
    submit: function (formName, payload) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          var id = formName.slice(0, 3).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
          try { sessionStorage.setItem('ortho:last:' + formName, JSON.stringify({ id: id, payload: payload, at: new Date().toISOString() })); } catch (e) { /* storage unavailable */ }
          resolve({ ok: true, id: id, formName: formName });
        }, 900);
      });
    },

    /* Next chamber opening from now. slug optional. -> {chamber, at, startAt, endAt, schedule, isToday} | null */
    nextOpening: function (slug) {
      var list = slug ? SITE.chambersIndex.filter(function (c) { return c.slug === slug; }) : SITE.chambersIndex;
      var now = new Date(), best = null;
      list.forEach(function (c) {
        c.schedule.forEach(function (s) {
          for (var i = 0; i < 8; i++) {
            var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
            if (s.days.indexOf(d.getDay()) === -1) continue;
            var st = s.start.split(':').map(Number), en = s.end.split(':').map(Number);
            var startAt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), st[0], st[1]);
            var endAt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), en[0], en[1]);
            if (endAt <= now) continue;
            var at = startAt > now ? startAt : now;
            if (!best || at < best.at) best = { chamber: c, at: at, startAt: startAt, endAt: endAt, schedule: s, isToday: i === 0 };
            break;
          }
        });
      });
      return best;
    }
  };
  window.SITE = SITE;
})(window);
