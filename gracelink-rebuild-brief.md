# GraceLink Church — Static Site Rebuild Brief

Paste this into Claude Code as the opening prompt for the project. Work through it phase by phase; don't try to do it all in one pass.

---

## 1. Objective

Replace the existing WordPress site at `https://glchurch.co.uk` with a static site that is:

- **Mobile-first** — the majority of visitors are on phones, often on mobile data. This is the primary success criterion, not a secondary concern.
- **Free to host** — GitHub + Vercel, no monthly hosting fee.
- **Editable by a non-developer** — a second person will make occasional content updates and must not need Git, a terminal, or a laptop.
- **Visually faithful** to the current site's brand identity, but not a pixel-copy of its layout. Where the current layout hurts mobile, improve it.

## 2. Stack

| Layer | Choice | Why |
|---|---|---|
| Site generator | **Eleventy (11ty)** | Outputs pure static HTML. No client-side framework, no hydration, no JS runtime shipped to the visitor. Fastest possible mobile result. |
| Templating | Nunjucks | Shared header/footer/nav as layouts and partials. |
| Content | Markdown + front matter in `/src/content/` | Editable as plain files; CMS-compatible. |
| CMS | **Sveltia CMS** | Git-based, free, works properly on a phone browser, and auto-converts uploaded images to WebP with client-side resizing. |
| CMS auth | Cloudflare Workers OAuth helper (`sveltia/sveltia-cms-auth`) | Required for GitHub auth when not hosting on Netlify. Free tier. |
| Hosting | Vercel (free tier) | Global CDN, free SSL, auto-deploy on `git push`, preview URLs. |
| DNS / domain | Stays at IONOS | Point the domain at Vercel. Web Hosting Plus can then be downgraded to domain-only. |

**Do not** use React, Next.js, Astro-with-islands, Tailwind's full build, or any component framework. This is a brochure site. Ship HTML and CSS.

## 3. Phase 0 — Recon (do this first, before writing any code)

1. Fetch each live page listed in section 4 and save the text content to `/reference/`.
2. Fetch the site's compiled CSS and **extract the actual brand palette** — primary, secondary, accent, text, background hex values. Do not invent colours; read them off the live stylesheet and the logo files.
3. Download the logo assets:
   - `wp-content/uploads/2025/09/Revised-Header-Logo.png`
   - `wp-content/uploads/2025/08/GL-Website-Site-Logo-2.png`
   - `wp-content/uploads/2025/08/Copy-of-GL-Website-Site-Logo.png` (footer variant)
   - Favicon: `wp-content/uploads/2025/08/cropped-GL-Website-Site-Favicon-1-270x270.png`
4. Download the banner/hero images (e.g. `2025/09/GLC-SLIDER-BANNER-9.png`, `2025/11/Youre-Welcome-scaled.png`, `2025/09/PD-PW.png`) and note their file sizes. The og:image alone is 2194×1584 PNG — record the before/after so the improvement is measurable.
5. Identify the display and body typefaces in use.

Report findings before proceeding.

## 4. Page inventory

Preserve every URL exactly. These are indexed by Google and printed on materials.

| Page | URL | Notes |
|---|---|---|
| Home | `/` | Hero, service times, three CTA cards, contact/location blocks |
| Who We Are | `/who-we-are/` | Divine Instruction, Mission, Culture & Values, What We Believe (10 points) |
| Leadership | `/our-team/` | Team profiles — note the URL is `our-team`, not `leadership` |
| Plan A Visit | `/plan-a-visit/` | |
| Get Involved | `/get-involved/` | |
| Ministries | `/ministers/` | Keep the existing odd slug |
| Give | `/give/` | |
| Events | `/events/` | See section 7 |
| Contact | `/contact/` | See section 8 |

**Navigation structure** (from the live site):

- Home
- About ▾ → Who We Are, Leadership
- Plan A Visit
- Connect ▾ → Get Involved, Ministries
- Give ▾ → Events
- Contact

Note: "Events" currently sits under the "Give" dropdown, which is almost certainly a WordPress menu mistake. Move Events under "Connect" and flag it for confirmation.

## 5. Mobile performance budget — the core spec

Treat these as hard build targets, not aspirations. Measure with Lighthouse mobile throttling before declaring any page done.

- **Total page weight: under 300 KB** on first load, including the hero image.
- **JavaScript shipped to the browser: under 5 KB.** The only JS needed is the mobile nav toggle. Write it by hand. No jQuery, no Slider Revolution, no carousel library.
- **Largest Contentful Paint: under 2.0s** on simulated 4G.
- **Cumulative Layout Shift: under 0.05.** Every `<img>` gets explicit `width` and `height` attributes.
- **No render-blocking resources.** Inline critical CSS in `<head>`; the full stylesheet should be small enough that this is trivial.

### Image pipeline

The single biggest win over the current site. For every image:

1. Convert to **WebP** (with an AVIF variant if straightforward), keep a JPEG/PNG fallback only where genuinely needed.
2. Generate widths at 480 / 768 / 1200 / 1600 px.
3. Serve via `<picture>` with `srcset` and `sizes` so phones never download a desktop-sized asset.
4. `loading="lazy"` and `decoding="async"` on everything below the fold. The hero image gets `fetchpriority="high"` and is **not** lazy-loaded.
5. Use the `@11ty/eleventy-img` plugin to automate this at build time.

### Fonts

Self-host as WOFF2 with `font-display: swap`. Subset to Latin. Two families maximum — one display, one body. If the current site's fonts are heavy or only available via Google Fonts CDN, self-host them; do not add a third-party request on the critical path.

### Mobile layout rules

- Design at 375px width first, then enhance upward. Do not design desktop and shrink.
- Minimum tap target 44×44px, with at least 8px between adjacent targets.
- The hamburger menu must be reachable one-handed and must handle the two dropdown sub-menus without nesting a scroll trap.
- Service times, address and phone number should be visible on the home screen without scrolling far — these are the top mobile intents. Make the phone number a `tel:` link and the address a maps link.
- Consider a persistent bottom "Plan a Visit" CTA on mobile. Build it, then evaluate whether it earns its space.
- Replace the Slider Revolution hero with either a single static image or a CSS `scroll-snap` carousel. A rotating slider is bad for mobile performance and bad for conversion; prefer the single strong image.

## 6. CMS setup

Configure Sveltia CMS at `/admin/` with a GitHub backend, editorial workflow off (keep it simple), and these collections:

- **Pages** — one entry per page, with fields for headings, body sections, and images
- **Leadership** — repeatable: name, role, photo, short bio
- **Ministries** — repeatable: name, description, image, link
- **Site settings** — service times, address, phone, email, social links, all pulled into the templates as globals so they're changed in one place

Set the image widget to output WebP with a max width of 1600px so uploads are compressed before commit.

Write a short `EDITING.md` in plain English for the second editor: how to log in, how to change text, how to add a leader, what not to touch.

## 7. Events

The current site uses The Events Calendar WordPress plugin. Options, in order of preference:

1. **Embed or link ChurchSuite** — the church already uses it for forms and giving. Keeping events there means one system, no duplication, and no editing burden. Strongly preferred.
2. Manage events as a Markdown collection in the CMS, sorted by date with past events auto-hidden by a build filter.

Confirm which before building.

## 8. Forms and external integrations

Everything transactional already lives elsewhere — preserve these links, don't rebuild them:

- **Giving** → `https://gracelinkchurch.churchsuite.com/donate`, plus the existing bank transfer details as static text with the note about preferring bank transfer
- **Connect With Us / Plan A Visit** → `https://gracelinkchurch.churchsuite.com/-/forms/jbjqb8y8`

For the **contact form**, there is no server, so use one of:

- The existing ChurchSuite form (most consistent, zero new accounts)
- Formspree or Web3Forms free tier (if a distinct contact form is wanted)

Include a honeypot field for spam. Do not put the email address in plain text in the HTML if avoidable.

## 9. SEO and migration safety

- Keep all URLs identical, with trailing slashes, as listed in section 4.
- Add `301` redirects in `vercel.json` for any WordPress cruft: `/?page_id=…`, `/post-types/`, `/?post_type=tribe_events`.
- Generate `sitemap.xml` and `robots.txt` at build.
- Port the existing meta titles and descriptions; keep `og:` and `twitter:` tags. Locale is `en_GB`.
- Add `LocalBusiness` / `Church` JSON-LD structured data with the address, service times and phone — helps Google surface service times directly in mobile search.
- Footer must retain: `© GraceLink Church. Charity No. 1214587` and the Facebook, Google, Instagram and YouTube links.

## 10. Quality floor

- Responsive from 320px upward with no horizontal scroll at any width.
- Visible keyboard focus states; `prefers-reduced-motion` respected.
- Semantic landmarks, real heading hierarchy, alt text on every image. Colour contrast at WCAG AA minimum — check this against the brand palette and adjust shades if the brand colours fail on small text.
- Works with JavaScript disabled, except the nav toggle (which should degrade to a visible menu).

## 11. Build order

1. Phase 0 recon → report palette, fonts, asset sizes
2. Project scaffold: Eleventy, base layout, header, footer, nav, design tokens as CSS custom properties
3. Home page → Lighthouse audit → fix → lock the pattern
4. Remaining pages, reusing established components
5. Sveltia CMS config + Cloudflare OAuth worker + `EDITING.md`
6. `vercel.json`, redirects, sitemap, structured data
7. Full-site Lighthouse mobile audit against section 5 budgets
8. Deploy to Vercel preview, review on a real phone, then point IONOS DNS

## 12. Key facts to hard-code

- Service: Sundays 11:00am – 12:30pm
- Venue: Drama Studio, Vivacity Werrington Leisure Centre, Staniland Way, Peterborough, PE4 6NA
- Phone: 07364 115813
- Email: info@gracelink.co.uk
- Charity No. 1214587

Put all of these in a single `site.json` data file so they're changed in one place.
