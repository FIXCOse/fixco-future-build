

## Problem

The build fails because uploading 16,400+ HTML files to R2 storage exceeds the deadline timeout. Splitting into multiple builds is not possible in Lovable's environment. The previous working limit was ~320 files.

## Solution: Inline SEO Script (zero extra files)

Instead of generating thousands of HTML files, inject a small **inline `<script>`** directly into `index.html` that runs **before React loads**. This script:

1. Reads `window.location.pathname` (e.g., `/tjanster/snickare/stockholm`)
2. Looks up the service and area names from a compact mapping (~5KB)
3. Immediately sets `document.title` and injects `<meta name="description">`, `<link rel="canonical">`, and hreflang tags into `<head>`

This executes **synchronously before any framework code** — Googlebot sees unique meta tags without needing to run React. Zero extra HTML files, zero R2 upload issues.

### What changes

**1. Create `scripts/generate-seo-inline.mjs`** (new build script)
- Reads all 152 service slug→name mappings and 54 area slug→name mappings
- Generates a single `dist/seo-inline.js` file (~5-8KB) containing:
  - A slug-to-name lookup object for services and areas
  - Logic to parse the URL and set `document.title`, meta description, canonical, hreflang
- Handles both Swedish (`/tjanster/`) and English (`/en/services/`) paths
- Also handles blog paths (`/blogg/`, `/en/blog/`)

**2. Update `index.html`**
- Add `<script src="/seo-inline.js"></script>` in `<head>` (before React)
- Or inline the script directly during build via the generate script

**3. Update `package.json` build command**
```
"build": "node scripts/generate-sitemaps.mjs && vite build && node scripts/generate-seo-inline.mjs && node scripts/validate-sitemaps.mjs"
```

**4. Remove `scripts/generate-prerender.mjs`**
- No longer needed — zero HTML files generated

### What Googlebot sees

For `/tjanster/snickare/stockholm`:
- `<title>Snickare i Stockholm | Fixco ★ 5/5</title>`
- `<meta name="description" content="Professionell snickare i Stockholm. Fixco erbjuder...">`
- `<link rel="canonical" href="https://fixco.se/tjanster/snickare/stockholm">`
- Proper hreflang sv/en tags

All set within milliseconds, before React even mounts.

### Why this works
- Googlebot executes inline `<script>` tags — this is basic JS, not framework rendering
- The script is tiny (~5KB) and synchronous — no async loading delays
- Covers all 16,400+ URL combinations with **one file** instead of 16,400
- Build stays fast (generates 1 file, not 16,400)
- React's `<Helmet>` tags then take over once the app hydrates (no conflict)

