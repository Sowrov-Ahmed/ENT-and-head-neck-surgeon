# Team Kit 4 — "Clay Studio": Premium 3D portfolio for an ENT specialist

Style: Premium + real 3D. A warm product-launch studio: matte inflated clay surfaces (cream, terracotta, sage, brass, mist, cocoa), studio spotlights, long contact shadows, centred symmetrical layouts, organic wave dividers, and genuine 3D scenes: an ear that explodes into its anatomical layers as you scroll, a drag-to-rotate six-face cube, a cylinder carousel, camera-orbit hero scenes, clay objects that pop out of their cards.
It deliberately shares no design principles with the earlier kits: no flat light-blue cards (kit 1), no dark aurora glass or serif italics (kit 2), no hard black borders or square blocks (kit 3).

## What is in the zip
`js/` shared kit (design tokens, 3D engine, components, centred-logo header, footer, QA engine) · `assets/img/` 36 clay-rendered illustrations (8 transparent treatment objects, 3 chamber scenes, 8 article covers, 5 anatomy layers + base plate for the exploded ear, 9 floating decor objects, portrait, logo) · `qa.html` browser QA runner · `tools/qa.js` + bundled jsdom (offline test runner) · `tools/golden-about.*` (tested reference page) · `tools/page-template.html` · `prompts/PROMPT-1…5`.

## Normal chat vs artifacts → normal chat with file creation
Settings → Capabilities → switch ON **Code execution and file creation**. Artifacts cannot hold a multi-file site or run the QA tool.

## Steps for each member
1. Unzip `team-kit-4.zip` once (creates `site/`).
2. New Claude chat (Sonnet). **Attach `team-kit-4.zip`** AND paste your prompt file (`prompts/PROMPT-N-…md`) as the message. Send.
3. Claude unzips the kit, writes your files, runs `node tools/qa.js --part N`, fixes every failure, and gives you **`part-N.zip`**. If it stops, send `RESUME`.
4. Unzip `part-N.zip` **into your `site/` folder** (no extra folder) and open your pages.
If the zip cannot be attached, paste the prompt alone (Mode B: no automated QA) and run the QA yourself after merging.

| Person | Prompt | Delivers |
|---|---|---|
| 1 | PROMPT-1-home-signin-404 | Home (13 sections incl. exploded ear + cube + ring), Sign-in, 404 |
| 2 | PROMPT-2-about-contact-faqs | About, Contact, FAQs |
| 3 | PROMPT-3-services | Services, Service Details (8 ENT services) |
| 4 | PROMPT-4-chambers-appointment | Chambers, 5-step Appointment wizard |
| 5 | PROMPT-5-blog-testimonials | Blog, Blog Details (8 articles), Testimonials |

## Merge + QA
1. Unzip all five `part-N.zip` into the same `site/` folder (nothing is overwritten; if your computer asks, stop and check).
2. **Automated (needs Node):** from inside `site`, `node tools/qa.js` — static checks (kit-API misuse, design-law linter, data integrity incl. ENT safety facts, links, template, ownership, 3D-technique count) + a runtime test of every page and URL variant in jsdom (scripts run, every tab/accordion/carousel/cube/ring/filter clicked, every form submitted empty and with valid data). Exit code 1 on any failure; `-v` shows warnings.
3. **In a real browser, no install:** open `qa.html` and press *Run quick check* / *Run every variant*: it loads each page at 390 px and 1280 px, scrolls it and reports layout overflow, broken images, tap targets and animations that never fired.
4. Fix failures in the owning part (each `docs/PART-*.md` lists its files). Add `?qa=1` to any page URL for an on-page report.
5. **Horizontal scrollbar:** the kit sets `overflow-x-clip` on `<html>` and every section; if one still appears, `qa.html` names the offending element.

## Honest limits
The kit and QA tool were tested here in jsdom, including planted bugs (all caught) and a stress page for forms, tabs, carousel, cube and ring. **No real browser was available**, so the 3D visuals (exploded ear, cube rotation, ring, orbit scenes) were verified by code review and logic tests, not by eye; one real bug of that kind (invalid `calc()` spacing) was found and fixed that way. Expect to review the 3D scenes visually on first open and report anything odd. The prompts were not run through Claude's free tier.
