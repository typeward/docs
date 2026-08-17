# Typeward Docs

Documentation site for [Typeward](https://typeward.com), the open-source LaTeX and Typst editor ([source](https://github.com/typeward/app), GPL-3.0-or-later). Built with [Astro Starlight](https://starlight.astro.build). Deployed to https://docs.typeward.com via GitHub Pages on every push to `main`.

## Working on the docs

```
npm install
npm run dev       # local preview at localhost:4321
npm run build     # production build + internal link validation
```

Pages live in `src/content/docs/` as Markdown. The sidebar is explicit in `astro.config.mjs` -- only finished pages are listed; no "coming soon" stubs. The build fails on broken internal links (`starlight-links-validator`).

[`STYLE.md`](STYLE.md) is the writing guide: house rules, a skeleton per page type, the terminology table, and a checklist to run against a finished page.
