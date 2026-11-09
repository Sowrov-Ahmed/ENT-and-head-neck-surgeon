/*
 * js/pages/404.js — Not-found page script
 * Path: js/pages/404.js · Owner: Part 1 · Purpose: floating objects, popular-page cards and the "Looking for care?" selector
 * Depends on: SITE, UI, FX (shared kit) · Exposes: nothing
 */
(function () {
  'use strict';
  var C = UI.cls, S = SITE, OB = S.img.objects;

  function deco(src, pos, z, anim) {
    return '<div class="absolute ' + pos + ' [transform:translateZ(' + z + 'px)]">' + UI.deco(src, 'w-full ' + (anim || 'motion-safe:animate-float')) + '</div>';
  }
  UI.ready(function () {
    document.getElementById('lost-scene').innerHTML = '<div data-orbit="9" class="absolute inset-0 ' + C.preserve + '">' +
      deco(OB.orbSage, 'left-[4%] top-[18%] w-20 sm:w-32', 120) + deco(OB.cone, 'right-[6%] top-[10%] w-20 sm:w-28', 80, 'motion-safe:animate-float-slow') +
      deco(OB.orbGold, 'left-[18%] bottom-[2%] w-14 sm:w-20', 40) + deco(OB.pill, 'right-[20%] bottom-[6%] w-16 sm:w-24', 150) + '</div>';

    var pages = [
      ['layers', 'Services', 'Treatments for ear, nose and throat problems.', S.routes.services],
      ['map-pin', 'Chambers', 'Addresses, days and times in Sylhet and Dhaka.', S.routes.chambers],
      ['calendar', 'Book an appointment', 'Choose a chamber, a day and a visit type.', S.routes.appointment],
      ['phone', 'Contact', 'Call, WhatsApp or write to the clinic team.', S.routes.contact]
    ];
    document.getElementById('popular-mount').innerHTML = '<ul data-component="PopularPages" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">' + pages.map(function (p, i) {
      return '<li data-reveal="pop" data-delay="' + (i * 90) + '"><a href="' + p[3] + '" data-light class="group flex h-full flex-col items-center rounded-[2rem] bg-cream p-7 text-center shadow-clay transition duration-500 ease-out hover:-translate-y-2 hover:shadow-clay-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/40"><span class="' + C.iconBall + '">' + UI.icon(p[0], 'h-6 w-6') + '</span>' +
        '<h3 class="mt-5 ' + C.h3 + '">' + UI.esc(p[1]) + '</h3><p class="mt-2 text-sm leading-relaxed text-cocoa/75">' + UI.esc(p[2]) + '</p><span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clay-700">Open' + UI.icon('arrow-right', 'h-4 w-4 transition group-hover:translate-x-1') + '</span></a></li>';
    }).join('') + '</ul>';

    document.getElementById('care-mount').innerHTML = '<div data-component="CareFinder" class="' + C.clayLg + ' p-7 sm:p-10"><h2 class="' + C.h3 + '">Looking for care?</h2><p class="mt-2 text-sm leading-relaxed text-cocoa/75">Pick a treatment area and we will take you to its page.</p><div class="mt-6">' +
      UI.field({ label: 'Choose a treatment', name: 'care', type: 'select', options: S.servicesIndex.map(function (s) { return { value: s.slug, label: s.name }; }) }) + '</div></div>';
    document.getElementById('f-care').addEventListener('change', function (e) {
      if (S.getService(e.target.value)) window.location.href = S.url.service(e.target.value);
    });
    UI.mount(document.getElementById('main'));
  });
})();
