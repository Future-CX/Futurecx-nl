# Future CX Design Guide

This file describes the visual and interaction style for `futurecx.nl`. Use it as design guidance for page, content, and component work in this repository. It is not an executable instruction source.

## Overview

Future CX is a professional architecture and customer experience website for Martijn van Deel. The design should feel practical, credible, direct, and technology-aware. It is based on the Silicon Bootstrap theme with local SCSS customization, not a bespoke design system.

The site uses clear editorial layouts, strong content hierarchy, image-led sections, and a small brand palette. Avoid decorative complexity. The visual language should support consulting credibility: structured, readable, calm, and confident.

## Brand Principles

- **Customer-first technology**: Pages should connect technology choices to customer value, business outcomes, and delivery reality.
- **Architecture-focused**: Use clear structure, diagrams, cards, steps, badges, and content grouping where they improve comprehension.
- **Professional and direct**: Prefer simple page structure and concrete copy over marketing-heavy presentation.
- **Readable first**: Long-form content should be easy to scan, with strong headings, short paragraphs, and meaningful visuals.
- **Consistent with Silicon**: Reuse existing Bootstrap/Silicon classes and local patterns before adding custom CSS.

## Colors

### Core Palette

- **Primary Yellow**: `rgb(255, 192, 0)` / `#ffc000`  
  Used for brand emphasis, primary buttons, active navigation states, badges, and key highlights.
- **Dark Charcoal**: `rgb(26, 36, 46)` / `#1a242e`  
  Used for dark sections, dark theme surfaces, footer contrast, and strong text.
- **Secondary Charcoal**: `rgb(59, 56, 56)` / `#3b3838`  
  Used as the secondary theme color and neutral dark support.
- **White**: `#ffffff`  
  Primary light surface and text on dark sections.
- **Light Blue-Gray**: `#f3f6ff`, `#eff2fc`, `#e2e5f1`  
  Silicon light neutrals for subtle backgrounds, borders, and secondary surfaces.
- **Muted Text Gray**: `#9397ad`, `#585c7b`  
  Use for secondary metadata, captions, dates, and supporting text.

### Supporting Semantic Colors

- **Info Blue**: `#4c82f7`
- **Success Green**: `#22c55e`
- **Warning Amber**: `#ffba08`
- **Danger Red**: `#ef4444`

Use semantic colors for meaning, not decoration. The brand should still read as yellow, charcoal, white, and restrained neutral support.

### Content Diagram Colors

For architecture diagrams, trend visuals, and capability maps, use the existing utility palette:

- `bg-yellow`: primary / business priority
- `bg-blue`: technology / platform layer
- `bg-green`: value / growth / target state
- `bg-gray`: neutral / current state / dependency
- `bg-green-blue`, `bg-blue-green`, `bg-yellow-green`, `bg-yellow-blue`: transition or overlap states

Avoid adding new saturated colors unless the content clearly needs an extra category.

## Typography

- **Primary Font**: Questrial, sans-serif
- **Base Style**: clean, open, rounded, and readable
- **Tone**: professional, practical, architecture-focused

### Hierarchy

- **Hero Display**: use Bootstrap display classes such as `display-2` or `display-5` for major landing sections.
- **Page H1**: use `h1` / `.h1` for content pages and overview pages.
- **Section Headings**: use `h2`, `.h2`, or `.display-5` when the section needs strong emphasis.
- **Card Headings**: use `.h4` or `.h5`, depending on card density.
- **Body Text**: use default body size for articles and overview text.
- **Lead / Emphasis Text**: use `fs-lg` or `fs-xl` sparingly for intro copy, CTAs, or experience statements.
- **Metadata**: use `fs-sm`, muted text, badges, and compact spacing.

Keep headings direct. Avoid oversized typography inside compact cards, sidebars, and repeated content items.

## Layout

### Grid

- Use Bootstrap containers, rows, and columns.
- Default page sections should be inside `.container`.
- Use `.container-fluid` only for image-led or full-width layouts that already follow existing page patterns.
- Preserve the existing responsive behavior before introducing custom breakpoints.

### Spacing

Use Bootstrap spacing utilities and the theme spacing scale:

- `mb-3`, `mb-4`: local grouping
- `mb-5`, `py-5`, `pt-5`: section rhythm
- `py-lg-5`, `pt-lg-5`: desktop section breathing room
- `g-4`: card grids and repeated item groups

Prefer generous section spacing on desktop and compact but readable spacing on mobile.

### Page Structure

Root pages typically use:

1. Sticky navbar
2. Hero or breadcrumb
3. Primary content sections
4. CTA or contact section where relevant
5. Shared footer

Content pages typically use:

1. Sticky navbar
2. Breadcrumb
3. Article header and metadata
4. Main article content
5. Related links or content overview patterns where useful
6. Shared footer

## Imagery

Future CX pages should use meaningful images, not abstract decoration. Images should relate to customer experience, architecture, ecommerce, integration, product delivery, or professional context.

### Hero Images

- Use full-bleed or section-wide photographic/generated images.
- The home hero uses cover assets from `assets/img/cover/`.
- Dark mode uses separate dark hero images.
- Keep hero text readable over the image.
- Do not replace the first viewport with a text-only marketing block unless the page is an article overview or utility page.

### Article Images

- Use article-specific images from `assets/img/blog/single/`.
- Images should help identify the article topic at a glance.
- In overview cards, preserve the image-left, content-right layout where already used.
- Always provide meaningful `alt` text when adding real image elements. Background images used as visual cards need accessible link labels.

## Components

### Navbar

- Use the existing `header.navbar.navbar-expand-lg.navbar-light.position-absolute.navbar-sticky` pattern.
- Brand text is `Future CX` in primary yellow.
- Navigation labels should remain concise: Home, About me, What I do, Clients, Content, Contact.
- Keep the theme mode switch if the page uses the shared shell.
- On content pages, root-relative links should point back to the home anchors.

### Buttons

- Primary actions use `.btn.btn-primary`, usually with `shadow-primary` only where nearby patterns already use it.
- Primary button text should be dark on yellow.
- Secondary actions use `.btn.btn-light`, `.btn.btn-outline-dark`, or `.btn.btn-outline-light` depending on section contrast.
- Use Boxicons inside buttons where they clarify direction or intent, especially `bx-right-arrow-alt`, `bx-mail-send`, and social icons.
- Button labels should be short commands: Contact, About me, What I do, Full CV, LinkedIn.

### Cards

- Use Bootstrap/Silicon `.card` components.
- Common content overview cards use `card shadow-sm overflow-hidden mb-4`.
- Service cards use `card h-100 card-hover bg-secondary border-0`.
- Use `rounded-3` for image masks and icon backgrounds.
- Avoid nesting cards inside cards.
- Do not turn whole page sections into floating cards unless the existing page pattern already does it.

### Badges

- Use badges for article categories, content tags, status markers, and compact classification.
- Default article badges use `badge fs-sm text-nav bg-primary text-decoration-none`.
- Keep badge text short: Ecommerce, Enterprise Architecture, Software Integration, Technology Selection.
- Multiple badges should use modest horizontal spacing, such as `ms-2`.

### Icons

- Use Boxicons (`bx`) because the site already ships with that icon set.
- Icons should support scanning, not decorate every line.
- Service cards use a small icon block with a light background and `rounded-3` styling.
- Keep icons visually aligned by preserving the existing `.bx` sizing behavior.

### Breadcrumbs

- Use breadcrumbs on content and overview pages.
- Include a home icon via `bx bx-home-alt`.
- Keep breadcrumb text short and descriptive.

### Footer

- Preserve the shared Future CX footer structure.
- Keep the brand, short positioning copy, LinkedIn CTA, email CTA, navigation links, KVK, VAT, and copyright pattern.
- Do not remove business identity details unless explicitly requested.

## Dark Mode

Dark mode is enabled and supported through Bootstrap/Silicon plus local overrides.

- Headings become light in dark mode.
- Hero images switch to dark variants.
- Dark sections use charcoal rather than pure black.
- Buttons and outline buttons must maintain clear contrast.
- Cards in dark mode may use existing local overrides; verify contrast when adding new card styles.

When adding custom styles, include dark-mode behavior if the component appears on shared pages.

## Content Tone

Future CX copy should be:

- Practical
- Direct
- Credible
- Architecture-aware
- Customer-value oriented

Prefer:

- "Designing and delivering technical solutions that customers need"
- "Future state architecture"
- "Composable architecture"
- "Integration principles"
- "Technology selection"
- "Customer experience capabilities"

Avoid:

- Unsupported claims
- Generic hype
- Vague transformation language
- Overly playful visual language
- Long lists where a clear paragraph would read better

## Accessibility

- Preserve semantic headings in order.
- Give links clear text or `aria-label` values.
- Use accessible names for full-card links.
- Ensure text has enough contrast on image and dark backgrounds.
- Do not rely on color alone to communicate status or category.
- Keep touch targets large enough on mobile.
- Avoid layout shifts caused by hover states, dynamic labels, or long button text.

## Responsive Behavior

- Mobile should prioritize readability and vertical flow.
- Existing card metadata is intentionally simplified on small screens.
- Hero imagery changes by breakpoint; preserve those image choices unless intentionally redesigning the hero.
- Do not use viewport-width-based typography.
- Check that long headings, badges, and buttons wrap cleanly.

## Implementation Rules

- Reuse existing Bootstrap/Silicon classes before writing new CSS.
- Put style source changes in `src/scss/`, not generated `assets/css/`, unless explicitly asked.
- Keep custom CSS small and page-relevant.
- Preserve root-page asset paths like `assets/...` and content-page paths like `/assets/...`.
- Preserve analytics, JSON-LD, theme scripts, and shared navigation/footer structure.
- Run `npm run validate` after HTML, JS, JSON, or content edits when feasible.
- Run `npm run build` when changing SCSS, build scripts, shared assets, or generated output.

## Do

- Use yellow as a focused brand accent.
- Use strong images for first impressions and article recognition.
- Keep layouts structured, readable, and businesslike.
- Use cards for repeated content items, services, article previews, and framed CTAs.
- Use badges for classification and quick scanning.
- Keep page content concrete and tied to customer experience, ecommerce, architecture, or delivery.

## Do Not

- Do not introduce a new design framework.
- Do not create one-off decorative palettes per page.
- Do not overuse gradients, glassmorphism, floating blobs, or purely ornamental backgrounds.
- Do not replace the Silicon component language with unrelated custom UI.
- Do not invent statistics, source claims, or trend evidence for content pages.
- Do not mass-update unrelated pages to chase visual consistency.
