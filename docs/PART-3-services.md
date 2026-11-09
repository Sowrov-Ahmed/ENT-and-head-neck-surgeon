# PART 3 — Services & Service Details

## 1. Files
| Path | Purpose |
|---|---|
| `services.html` | Catalogue page shell (mount divs only) |
| `service-details.html` | Single-service page shell |
| `js/pages/services.js` | Hero, filter bar + grid, 3D ladder, fees table, marquee, CTA |
| `js/pages/service-details.js` | Reads `?slug=`, merges data, renders hero, stage, sections, booking card, related care, CTA |
| `js/data/services.js` | `window.SERVICES`: 8 detail records |
| `docs/PART-3-services.md` | This file |

## 2. Pages → section ids → data-components
- **services.html**: `page-hero` (PageHero) · `catalogue` (ServiceFilterBar, ServiceGrid, ServiceCard) · `ladder` · `fees` · `treatments` (Marquee) · `cta` (CtaBand)
- **service-details.html**: `page-hero` · `object` (ServiceStage) · `details` (ServiceBody; ServiceNav, BookingCard, BookingBar) with `overview` ServiceOverview, `symptoms` ServiceSymptoms, `when-to-see-us` ServiceWhenToSee, `diagnosis` ServiceDiagnosis, `treatments` ServiceTreatments, `procedure` ServiceProcedure, `recovery` ServiceRecovery (Ring), `risks` ServiceRisks, `pricing` ServicePricing, `faqs` ServiceFaqs (FaqItem) · `related` RelatedCare · `cta`. Unknown slug: `not-found` (NotFound) only.

## 3. Globals & data schema
Only `window.SERVICES` (array of DETAIL records, keyed by `id`/`slug` of `SITE.servicesIndex`; merged with `Object.assign({}, index, detail)`).
```
{ id:'svc-003', slug:'vertigo-balance', tagline, overview:[2], symptoms:[5], whenToSeeUs:[4],
  diagnosis:[{title,description}×3], treatments:[{title,description}×4],
  procedure:{duration,anaesthesia,hospitalStay,steps:[{title,description}×5]},
  recovery:[{phase,title,description}×4], risks:[×3],
  pricing:{inclusions:[4],exclusions:[3],note,paymentOptions:[4]},
  faqs:[{id:'sfaq-001',question,answer}×3], relatedSlugs:[2], relatedBlogSlugs:[1–2] }
```
Related slugs: hearing-loss-cochlear → vertigo-balance, ear-infection-tympanoplasty · ear-infection-tympanoplasty → hearing-loss-cochlear, tonsil-adenoid-children · vertigo-balance → hearing-loss-cochlear, ear-infection-tympanoplasty · sinus-endoscopic-surgery → septoplasty-rhinoplasty, tonsil-adenoid-children · septoplasty-rhinoplasty → sinus-endoscopic-surgery, snoring-sleep-apnoea · snoring-sleep-apnoea → septoplasty-rhinoplasty, tonsil-adenoid-children · tonsil-adenoid-children → ear-infection-tympanoplasty, sinus-endoscopic-surgery · voice-throat-head-neck → tonsil-adenoid-children, snoring-sleep-apnoea.

## 4. Kit API used
UI: ready, getParam, esc, icon, img, deco, badge, pad, debounce, formatBDT, formatBDTRange, pageHero, sectionHead, serviceCard, postCard, faqItem, ring, wave, marquee, ctaBand, mount, cls.*.
SITE read: routes (home, services, appointment), url.service, url.appointment({service}), servicesIndex, chambersIndex (fees), getService, getPost, contact (phone, urgent, whatsappUrl), img.objects.
Links out: `appointment.html?service=<slug>`, `blog-details.html?slug=` via postCard, `services.html`, `index.html`. Expected in: `services.html?category=<ear|nose|throat|children>`, `service-details.html?slug=<slug>`.

## 5. Forms
None. Both pages link to the appointment page.

## 6. 3D / motion techniques
- services: hero camera orbit, pop-out service cards with `data-light`, filter bar, ladder (`data-orbit` + stepped `translateZ` + `data-scroll-tilt`), `data-parallax` gold orb, `animate-float`, reveals (`rise`/`pop`), wave dividers, marquee.
- service-details: hero orbit, large object on a plinth in a `data-orbit` scene with floating objects, stepped treatment ladder (`translateZ` + `data-scroll-tilt`), timeline with `data-scroll-tilt`, `UI.ring` recovery carousel, `data-light`, reveals, waves.

## 7. Next.js migration map
`/services` ← services.html (`ServiceCatalogue`, filters via query string) · `/services/[slug]` ← service-details.html (`ServiceDetail`, `BookingCard`, `RelatedCare`) · `services` table + `service_details` (JSONB sections or child tables: faqs, steps, risks) via `GET /api/services`, `GET /api/services/:slug`.

## 8. Merge notes
Load order on service-details.html: kit scripts → `js/data/services.js` → `js/pages/service-details.js`. The booking bar is fixed bottom-centre on mobile only, clear of the kit's bottom-right buttons.

## 9. QA result
`✓ ALL CLEAR · 0 warnings` (node tools/qa.js --part 3, round 4; 11 page variants, 0 fail)

## 10. Known limits
3D scenes were checked in jsdom only, not in a real browser. Prices are estimates. Service pages do not read other parts' globals.
