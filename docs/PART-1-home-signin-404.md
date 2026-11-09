# Part 1 — Home, Sign-in & 404 (Owner: Person 1)

## 1. Files
| Path | Purpose |
|---|---|
| `index.html` | Home shell: static hero (h1, orbit scene, ear-model mounts) + `#home-mount` |
| `js/pages/home.js` | Hero content, 12 more sections, services filter, live chamber labels, quick-booking form |
| `signin.html` / `js/pages/signin.js` | Split-screen account page: tabs, forms, strength meter, help sections |
| `404.html` / `js/pages/404.js` | Not-found page: orbit scene, popular-page cards, "Looking for care?" selector |

## 2. Pages → section ids → data-components
- **Home:** `hero` (HomeHero, HeroIntro, EarModel, EarLegend) · `marquee-stats` (HomeStats) · `about` (HomeAbout) · `services` (HomeServices, ServiceGrid) · `cube` (HomeWhy, Cube) · `visit` (HomeVisit) · `chambers` (HomeChambers, ChamberCard) · `book` (HomeBook, QuickBookForm) · `voices` (HomeVoices, Ring) · `blog` (HomeBlog, PostCard) · `faqs` (HomeFaqs, FaqItem) · `emergency` (HomeEmergency) · `cta` (CtaBand)
- **Sign-in:** `account` (AccountSplit, AuthTabs, SignInForm, ForgotPasswordForm, RegisterForm, AuthSuccess) · `getting-started` (GettingStarted) · `help` (SignInHelp)
- **404:** `lost` (NotFoundHero) · `popular` (PopularSection, PopularPages, CareFinder)

## 3. Globals & data schema
No `window.X` globals are created. Every page script is an IIFE. Home FAQs are a local array of `[question, answer]` pairs; all other data comes from `SITE`.
Example (quick-booking output): `appointment.html?service=vertigo-balance&chamber=upashahar&date=2026-11-15&type=new`

## 4. Kit API used · SITE read · URLs
- **UI:** `ready, esc, emph, pad, icon, img, deco, formatTime, field, validateForm, toast, sectionHead, statOrb, serviceCard, chamberCard, postCard, testimonialCard, faqItem, ctaBand, marquee, cube, ring, earModel, wave, mount, qsa, cls.*`
- **SITE:** `doctor.*, contact.*, img.objects.*, routes.*, url.service, url.appointment, servicesIndex, chambersIndex, blogIndex, testimonialsIndex, getChamber, getService, nextOpening, submit`
- **Links out:** `about.html, services.html, service-details.html?slug=…, chambers.html#<slug>, appointment.html[?…], blog.html, blog-details.html?slug=…, testimonials.html, faqs.html, contact.html, index.html`
- **Expected inbound:** `signin.html` (header), `404.html` (hosting fallback)

## 5. Forms
| Form name | Where | Payload |
|---|---|---|
| `signin` | signin.html | `{ identifier, remember }` (password never sent or stored) |
| `register` | signin.html | `{ fullName, phone, email, termsAccepted }` |
| `forgot-password` | signin.html | `{ identifier }` |
| quick booking (no `SITE.submit`) | index.html | navigates to `SITE.url.appointment({service, chamber, date, type})` |

Sign-in and register redirect to `appointment.html` 1.4 s after success. The booking date is checked against the chamber's `schedule[].days` and an inline error names the open days.

## 6. 3D / motion techniques
- **Home (13):** `UI.earModel` (scroll explode) · `data-orbit` scenes (hero, book) · `UI.cube` · `UI.ring` · `data-scroll-tilt` (visit) · `data-light` · `data-parallax` · `UI.statOrb` · `animate-float` · pop/rise reveals · `UI.wave` · `UI.marquee` · plinth + floor grid
- **Sign-in:** orbit scene, floating objects, scroll-tilt steps, pop reveals, specular card, waves
- **404:** orbit scene, floating objects, pop reveals, `data-light` cards

## 7. Next.js migration map
| Now | Next.js |
|---|---|
| `index.html` / `signin.html` / `404.html` | `app/page.tsx` / `app/signin/page.tsx` / `app/not-found.tsx` |
| `HomeServices`, `ChamberCard`, `PostCard`, `FaqItem` | same-named server/client components fed from the API |
| `SITE.servicesIndex`, `chambersIndex`, `blogIndex` | `services`, `chambers`, `posts` tables via `GET /api/...` |
| `signin`, `register`, `forgot-password` | `POST /api/auth/login`, `/register`, `/forgot-password` (hash passwords server-side) |
| `nextOpening()` label | `GET /api/chambers/:slug/next-opening` |

## 8. Merge notes
Files are independent of other parts. Home FAQs are local to `home.js` and do not use `window.FAQS`. The header's "Sign in" link points to `signin.html`.

## 9. QA result
`node tools/qa.js --part 1` → `✓ ALL CLEAR · 1 warnings` (index.html 0 fail/0 warn · signin.html 0 fail/1 warn · 404.html 0 fail/0 warn).

## 10. Known limits
- Sign-in is front-end only: `SITE.submit` simulates success and nothing is authenticated.
- `QA` reports one warning for `confirmPassword` in the register form (sample data is still flagged invalid); the form works correctly when the two passwords match.
- The quick-booking form needs JavaScript. The ear model needs about 420 px of width.
- Chamber "Open today" labels use the visitor's device clock, not Bangladesh time.
