# Templix — Website Template Gallery

A React (Vite) website for browsing and previewing the 12 website templates, with category listings, search and filters.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in ./dist
npm run preview    # serve the built ./dist locally
```

`dist/` is fully static (relative paths + hash routing), so you can upload it to any static host (Netlify, Vercel, GitHub Pages, cPanel) or a sub-folder.

## Pages

| Route | What it shows |
|---|---|
| `#/` | Home: hero, search, category cards, featured templates |
| `#/templates` | All templates with sidebar categories, style filter, search, sort |
| `#/category/:slug` | One category (fashion, ethnic, electronics, real-estate, food, agriculture) |
| `#/template/:id` | Template details: scrolling full-page preview, palette, sections, tags, similar templates |
| `#/preview/:id` | Full-screen live preview with Desktop / Tablet / Mobile switch |

## Where things live

- `public/templates/<id>/` — each template as a standalone site (`index.html` + `assets/`), plus `thumb.jpg` (card/hero image) and `full.jpg` (full-page screenshot).
- `src/data/templates.js` — template list and categories. Edit names, categories, tags, colours here.
- `src/pages/` — Home, Browse (all + category), Detail, Preview, NotFound.
- `src/components/` — Header, Footer, TemplateCard.
- `src/index.css` — all gallery styles.

## Adding a template

1. Copy the template folder to `public/templates/013/` (must contain `index.html`).
2. Add `thumb.jpg` (1440×900 screenshot, resized) and `full.jpg` (full-page screenshot, 720 px wide).
3. Add an entry to `templates` in `src/data/templates.js` with `id: '013'` and a `category` slug.
