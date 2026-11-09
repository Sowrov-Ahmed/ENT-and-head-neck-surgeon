# Part 2 — About, Contact, FAQs

## 1. Files
- `about.html`, `contact.html`, `faqs.html` — page shells (template, data scripts, page script)
- `js/pages/about.js` — About page sections · `js/pages/contact.js` — Contact page, form · `js/pages/faqs.js` — FAQ search, tabs, JSON-LD
- `js/data/faqs.js` — `window.FAQS` (6 categories × 3 questions)
- `docs/PART-2-about-contact-faqs.md` — this file

## 2. Pages → section ids → data-components
- **about**: `page-hero` (PageHero) · `story` · `numbers` (StatOrb ×4) · `timeline` (Timeline, Milestone) · `approach` (PrincipleCard) · `expertise` (Cube) · `credentials` (CredentialCard) · `first-visit` (VisitSteps, VisitStep, BringList) · `cta` (CtaBand)
- **contact**: `page-hero` · `tiles` (ContactTile) · `message` (ContactForm, DeskInfo, ContactSuccess) · `chambers` (ChamberCard, tabs/maps) · `emergency` (EmergencyCard) · `quick-faq` (FaqItem) · `cta`
- **faqs**: `page-hero` · `browse` (FaqList, FaqEmpty, FaqHelpCard, tabs) · `cta`

## 3. Globals & data schema
Only `window.FAQS`. Example:
`{ categories:[{ id:'faqc-001', slug:'general', name:'General', icon:'info' }], items:[{ id:'faq-001', categoryId:'faqc-001', question:'…', answer:'…' }] }`
About-page milestones, principles, steps, publications are local arrays (DB-shaped: `id`, `year`, `title`, `text`) inside `about.js`.

## 4. Kit API used
UI: ready, esc, emph, mount, debounce, icon, img, deco, badge, wave, sectionHead, pageHero, statOrb, cube, chamberCard, faqItem, ctaBand, field, validateForm, toast, cls.*.
SITE read: doctor.*, contact.*, routes.*, img.*, chambersIndex, submit. Links out: appointment.html, chambers.html, contact.html, faqs.html, index.html. Expected in: `faqs.html#<category slug>`.

## 5. Forms
- `contact` → `{ fullName, phone (digits), email, subject, chamberSlug, message, consent }`
- FAQ search form is client-side only (no submit).

## 6. 3D/motion techniques
- about: orbit portrait scene, floating orbs, light, stat orbs, scroll-tilt (timeline, visit plane), parallax, cube, pop reveals, wave dividers.
- contact: hero orbit, light tiles, scroll-tilt form, parallax orb, pop reveals, wave dividers, float.
- faqs: hero orbit, scroll-tilt search plane, parallax objects, light, pop reveal, wave dividers, float.

## 7. Next.js migration map
about.html → `/about`; contact.html → `/contact`; faqs.html → `/faqs`. Components: PageHero, StatOrb, Timeline, PrincipleCard, Cube, CredentialCard, VisitSteps, ContactTile, ContactForm, ChamberCard, FaqList, CtaBand. Data: `window.FAQS` → tables `faq_categories`, `faqs`; milestones → `milestones`. Form `contact` → `POST /api/contact`.

## 8. Merge notes
`js/data/faqs.js` is loaded by faqs.html and contact.html. Form fields use the kit default select prompt (no custom prompt text). Titles are short because the layout suffix is 48 characters.

## 9. QA result
ALL CLEAR · 0 warnings (node tools/qa.js --part 2, 4 rounds)

## 10. Known limits
Maps need internet. Search matches plain substrings. Publications and awards are fictional. Statistics are rounded.
