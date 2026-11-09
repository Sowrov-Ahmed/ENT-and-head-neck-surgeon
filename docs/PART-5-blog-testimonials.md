# Part 5 — Blog, Blog Details, Testimonials

## 1. Files
| Path | Purpose |
|---|---|
| `blog.html`, `js/pages/blog.js` | Journal index: search hero, featured post, filters, paginated grid, topics, newsletter |
| `blog-details.html`, `js/pages/blog-details.js` | One article from `?slug=` with TOC, share tools, related content, JSON-LD |
| `testimonials.html`, `js/pages/testimonials.js` | Rating summary, 3D ring, filterable grid, featured story, share form |
| `js/data/blogs.js` | `window.BLOGS`: 8 article DETAIL records |
| `js/data/testimonials.js` | `window.TESTIMONIALS`: 10 additional records (tst-007 to tst-016) |

## 2. Pages → section ids → `data-component`
- **blog**: `page-hero` (PageHero) · `featured` (FeaturedPost) · `browse` (BlogToolbar, PostGrid, PostCard, EmptyState) · `topics` (TagCloud, MostRead, NewsletterCard, NewsletterSuccess) · `cta` (CtaBand)
- **blog-details**: `page-hero` · `article` (ArticleCover, ArticleBody, TableOfContents, KeyTakeaways, ShareTools, BookCard, Callout, PullQuote) · `author` (TagList, AuthorCard, Disclaimer, EmergencyNote) · `related-services` (ServiceCard) · `more` (PostCard) · `cta`; unknown slug → `not-found` (NotFoundPanel)
- **testimonials**: `page-hero` · `summary` (AverageRating, RatingBars, SatisfactionOrb) · `stories` (Ring) · `all-stories` (StoryFilters, StoryGrid, StoryTile, EmptyState) · `featured-story` (StoryTabs) · `share` (TestimonialForm, TestimonialThanks) · `cta`

## 3. Globals and data schema
`window.BLOGS` (detail only, merged by slug with `SITE.blogIndex`) and `window.TESTIMONIALS` (added to `SITE.testimonialsIndex`). No other globals.
```js
{ id:'blg-001', slug:'ear-wax-and-cotton-buds', tags:['Ear wax','Ear care','Hearing'], views:1840, summary:'…',
  keyTakeaways:['…','…','…'], relatedSlugs:['…','…'], serviceSlugs:['…'], content:[{ type:'p', text:'…' }] }
{ id:'tst-007', name:'Abu Taher', age:58, area:'Upashahar', serviceSlug:'ear-infection-tympanoplasty', rating:5,
  date:'2026-03-18', quote:'…', title:'…', outcome:'Eardrum repaired', verified:true }
```
**Block types:** `p {text}` · `h2 {text}` · `ul {items[]}` · `ol {items[]}` · `quote {text,cite}` · `callout {tone:'tip'|'warning',title,text}`. Inline `**bold**` is converted after `UI.esc`.

## 4. Kit API and SITE members used
UI: `ready, getParam, esc, slugify, pad, formatDate, icon, img, deco, stars, badge, wave, mount, pageHero, sectionHead, statOrb, serviceCard, postCard, testimonialCard, ring, ctaBand, field, validateForm, copy, debounce, cls.*`. FX: `reduced`.
SITE: `blogIndex, blogCategories, testimonialsIndex, servicesIndex, getPost, getService, doctor, brand, img, routes, url.blog, url.blogCategory, url.appointment, submit`.
Links out: `index.html`, `about.html`, `blog.html`, `appointment.html?service=<slug>`, `service-details.html?slug=<slug>` (via `UI.serviceCard`). Expected in: `blog.html?category=&q=&page=`, `blog-details.html?slug=`, `testimonials.html`.

## 5. Forms
| Form | Payload |
|---|---|
| `newsletter` | `{ email }` |
| `testimonial` | `{ name, phone, serviceSlug, rating, title, message, consent }` |
The blog search form only filters in the browser (no submit to a server).

## 6. 3D and motion techniques
- **blog**: orbit scene with translateZ layers, `data-light` specular card, 2 × `data-parallax`, floating clay objects, pop and tilt reveals, wave dividers, `shadow-clay-lg` plinth.
- **blog-details**: orbit scene around a `data-scroll-tilt` cover, translateZ orbs, parallax orb, `data-light` callouts and cards, wave dividers, floating objects.
- **testimonials**: `UI.statOrb`, `UI.ring` (cylinder), orbit scene on the featured card, `data-light`, tilt reveals, animated bars, wave dividers.

## 7. Next.js migration map
| Now | Next.js |
|---|---|
| `blog.html` | `/blog` (searchParams `category,q,page`) |
| `blog-details.html?slug=` | `/blog/[slug]` (`generateMetadata` replaces the runtime title and JSON-LD) |
| `testimonials.html` | `/testimonials` |
| `renderPost*`, `UI.postCard` | `<PostCard/>`, `<FeaturedPost/>`, `<PostGrid/>`, `<TableOfContents/>`, `<ShareTools/>` |
| `BLOGS` + `blogIndex` | table `posts` (+ `post_tags`, `post_services`) · `GET /api/posts?category&q&page` · `GET /api/posts/:slug` |
| `TESTIMONIALS` + index | table `testimonials` (`status` = pending / published) · `GET /api/testimonials` |
| `SITE.submit('newsletter')` | `POST /api/newsletter` |
| `SITE.submit('testimonial')` | `POST /api/testimonials` (stored as pending for moderation) |

## 8. Merge notes
Part 5 owns only the files above and the globals `BLOGS` and `TESTIMONIALS`. Blog URLs come from `SITE.url.blog` and `SITE.url.blogCategory`. Other parts may link to `blog.html?category=ear` and `testimonials.html`. The `data-page` values are `blog`, `blog-details`, `testimonials`.

## 9. QA result
`node tools/qa.js --part 5`, last run:
`✓ ALL CLEAR · 0 warnings` (static checks plus 15 runtime variants: blog ×4, blog-details ×9 including the unknown slug, testimonials ×1 and the data checks)

## 10. Known limits
- 3D scenes (orbit, ring, scroll-tilt) were verified in jsdom, not by eye in a real browser.
- Table-of-contents scroll-spy relies on `IntersectionObserver`; without it the links still work.
- Share buttons open third-party sites in a new tab; copy-link uses the clipboard where allowed.
- Testimonials and view counts are fictional and stored in files until a database exists.

## Appendix — the 8 articles
| Slug | Tags | relatedSlugs | serviceSlugs |
|---|---|---|---|
| ear-wax-and-cotton-buds | Ear wax, Ear care, Hearing | sudden-hearing-loss-act-fast, child-ear-infections-when-to-worry | ear-infection-tympanoplasty, hearing-loss-cochlear |
| child-ear-infections-when-to-worry | Children, Ear infection, Glue ear | ear-wax-and-cotton-buds, sinusitis-or-allergy | tonsil-adenoid-children, ear-infection-tympanoplasty |
| sudden-hearing-loss-act-fast | Sudden hearing loss, Emergency, Inner ear | vertigo-dizziness-causes, ear-wax-and-cotton-buds | hearing-loss-cochlear |
| sinusitis-or-allergy | Sinusitis, Allergy, Blocked nose | child-ear-infections-when-to-worry, snoring-and-sleep-apnoea-signs | sinus-endoscopic-surgery, septoplasty-rhinoplasty |
| snoring-and-sleep-apnoea-signs | Snoring, Sleep apnoea, Sleep study | sinusitis-or-allergy, sore-throat-and-antibiotics | snoring-sleep-apnoea |
| vertigo-dizziness-causes | Vertigo, Dizziness, Balance | sudden-hearing-loss-act-fast, ear-wax-and-cotton-buds | vertigo-balance |
| sore-throat-and-antibiotics | Sore throat, Tonsillitis, Antibiotics | child-ear-infections-when-to-worry, snoring-and-sleep-apnoea-signs | tonsil-adenoid-children, voice-throat-head-neck |
| nosebleed-first-aid | Nosebleed, First aid, Emergency | sinusitis-or-allergy, sore-throat-and-antibiotics | septoplasty-rhinoplasty, sinus-endoscopic-surgery |

URL state (blog): `?category=<slug>` (invalid ignored) · `?q=<text>` (max 80 characters) · `?page=<n>` (clamped to the last page). Updated with `history.replaceState`; sort order is not stored in the URL.
