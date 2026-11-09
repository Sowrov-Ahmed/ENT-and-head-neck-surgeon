# Part 4 — Chambers & Appointment

## 1. Files
| Path | Purpose |
|---|---|
| `chambers.html` | Chambers page shell (hero mount + 7 section mounts) |
| `appointment.html` | Appointment page shell (booking section + help and CTA mounts) |
| `js/data/chambers.js` | `window.CHAMBERS`: detail records merged with `SITE.chambersIndex` |
| `js/pages/chambers.js` | Renders overview, weekly matrix, 3 chamber sections, comparison, checklist, cube, CTA |
| `js/pages/appointment.js` | 5-step wizard, live summary, confirmation, `.ics` export |
| `docs/PART-4-chambers-appointment.md` | This file |

## 2. Pages → section ids → `data-component`
- **chambers.html**: `page-hero` (PageHero) · `overview` (ChamberOverview, contains ChamberCard ×3) · `weekly` (WeeklyMatrix) · `zindabazar`, `upashahar`, `uttara` (ChamberDetail) · `compare` (ChamberComparison) · `bring` (BringChecklist) · `checks` (CheckCube, Cube) · `cta` (CtaBand).
- **appointment.html**: `page-hero` · `booking` (BookingWizard, BookingSummary, BookingConfirmation) · `help` (BookingHelp, FaqItem ×4) · `cta` (CtaBand).

## 3. Globals & data schema
Only `window.CHAMBERS` (array of 3). Records hold extra fields only; runtime merge is `Object.assign({}, SITE.getChamber(slug), detail)`.
```js
{ id:'ch-001', slug:'zindabazar', about:[p1,p2], landmark:'…', facilities:[{icon,title,description}×6],
  howToReach:{byRoad,byRideshare,byBus,parking}, patientTips:[×4], mapQuery:'House 14, Zindabazar Main Road, Sylhet 3100' }
```

## 4. Kit API, `SITE` members and URLs
- UI: `ready, qs, qsa, esc, pad, debounce, getParam, formatBDT, formatDate, formatTime, icon, img, deco, wave, sectionHead, pageHero, chamberCard, faqItem, ctaBand, cube, field, validateForm, toast, mount`, `UI.cls.*`.
- SITE read: `chambersIndex, getChamber, getService, servicesIndex, nextOpening, url.appointment, routes, contact, doctor, img`.
- Links out: `appointment.html?chamber=<slug>`, `chambers.html`, `index.html`, Google Maps directions and embed, `wa.me`, `tel:`.
- Expected in: `appointment.html?service=&chamber=&date=&type=` and `chambers.html#<slug>` from other parts.

## 5. Forms
| Form | Payload |
|---|---|
| `appointment` (`#booking-form`, via `SITE.submit('appointment', payload)`) | see schema below |

```js
{ visitType:'new|follow-up|second-opinion|post-op', serviceSlug:'<service slug>|general-consultation', chamberSlug:'zindabazar|upashahar|uttara',
  date:'YYYY-MM-DD', time:'HH:MM', slotMinutes:20, fee:1500, paymentPreference:'Pay at chamber|bKash|Nagad|Card at chamber',
  patient:{ fullName, age, gender:'Female|Male|Other', phone:'+8801…', email, area, bookingFor:'Myself|Family member|My child', relation },
  concern, mainArea:'Ear|Nose|Throat|Other', hasReports:bool, consent:true, source:'website', createdAt:ISO }
```
Fee rule: `new` and `second-opinion` use `fee.firstVisit`; `follow-up` and `post-op` use `fee.followUp`. No money is taken online.

## 6. 3D and motion techniques
- **Chambers**: camera-orbit scenes (`data-orbit`) with floating clay objects at different `translateZ`, clay plinth, 6-face `UI.cube`, `data-light` cards, `data-parallax`, wave dividers, pop/rise reveals, `animate-float`.
- **Appointment**: tilt reveal on the summary, `tilt-in` between steps, doctor card with `translateZ` on a plinth (`data-light`), floating clay check sphere on confirmation, wave dividers, orbit hero and CTA scenes from the kit.

## 7. Next.js migration map
| Now | Next.js |
|---|---|
| `chambers.html` | `app/chambers/page.tsx` (+ `#slug` anchors) |
| `appointment.html` | `app/appointment/page.tsx` (client component wizard) |
| ChamberDetail / WeeklyMatrix / ChamberComparison | components of the same name |
| BookingWizard / BookingSummary / BookingConfirmation | components of the same name; steps become child components |
| `window.CHAMBERS` | `chamber_details` table or `GET /api/chambers/:slug` |
| Slot rule and `slotsFor()` | `GET /api/chambers/:slug/slots?date=` (server decides real availability) |
| `SITE.submit('appointment')` | `POST /api/appointments` returning `{ id }` |

## 8. Merge notes
- Own files only; no kit edits. `window.CHAMBERS` is the only global.
- `sessionStorage` key `ortho:booking` holds `{type, service, chamber, date, time, step, payment, details}`; it is removed after a successful booking. `SITE.submit` also writes `ortho:last:appointment`.
- Query-param contract: `service` (service slug or `general-consultation`), `chamber` (slug), `date` (`YYYY-MM-DD`, open day within the next 60 days), `type` (`new|follow-up|second-opinion|post-op`). Invalid values are ignored without errors. A date that does not suit the chosen chamber is dropped. The wizard opens at the first incomplete step.
- Booked-slot rule: `hash(chamberSlug + date + 'HH:MM') % 4 === 0` means booked, with `hash(s)`: `h = 5381; for each char: h = ((h * 33) ^ charCode) >>> 0`. The result is the same for every visitor. Slots start at the schedule start and repeat every `slotMinutes`; slots that have started today are dropped.
- Reference number: `ENT-YYMMDD-XXXX`, where YYMMDD is the appointment date and XXXX the last four characters of the submit id.
- Calendar: Saturday-first, 60 days from today, `role="grid"`, arrow keys, Home/End (week), PageUp/PageDown (month).

## 9. QA result
`node tools/qa.js --part 4` → `✓ ALL CLEAR · 0 warnings` (static checks plus 5 jsdom page variants). A separate jsdom walk-through also ran all 5 wizard steps, validation errors, calendar keys, submit, confirmation, `.ics` and "Book another" with no JS errors.

## 10. Known limits
- Availability and "booked" slots are simulated in the browser; a real API must replace `slotsFor()`.
- Open/closed status uses the visitor's device clock and time zone.
- The 3D scenes were checked by code review and jsdom logic tests, not by eye in a browser.
- The Google Maps embed needs a network connection.
