# TRACOP

TRACOP is an agricultural logistics platform that connects three roles in Colombia:

- **Productor** (producer) — publishes harvests and fresh produce for sale.
- **Transportista** (transporter) — accepts freight and moves goods between producers and buyers.
- **Comprador** (buyer) — discovers fresh produce and places orders.

Key product capabilities:

- **Voice-first publishing** — producers publish offers by voice ("Publicar por voz").
- **Offline mode** — the app works without connectivity and surfaces connectivity state.

The UI is entirely in **Spanish** (`es`). All user-facing copy, labels, and messages must be written in Spanish.

## Commands

Run with `pnpm`:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server (default port `8443`) |
| `pnpm build` | Production build into `dist/` |
| `pnpm preview` | Serve the production build locally (default port `8443`) |
| `pnpm format` | Format the project with oxfmt |

## Git workflow

- Branch flow: `feature/*` → `develop` → `main`.
- Create a `feature/<name>` branch off `develop`; merge it back to `develop` when done. `develop` is promoted to `main` on release.
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`, `test:`, `build:`, `ci:`, `perf:`.
- Keep commits small and focused.
- Do **not** push unless explicitly asked.

## Security

- **Never commit secrets or credentials**, including AWS keys (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`), API tokens, or passwords.
- Use environment variables or a git-ignored local file for secrets. Client-exposed values go through `import.meta.env` prefixed with `VITE_` — never expose backend secrets to the client.

## Domain: order states

An order (pedido) progresses through these states, in order:

1. `solicitado` — requested
2. `aceptado` — accepted
3. `en camino` — on the way
4. `entregado` — delivered
5. `pagado` — paid

## Project structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element.
- `src/App.tsx` - Primary application component. This is currently a monolithic Figma Make export (single file) holding every screen and the role-based flow. When adding features, extract components rather than growing this file further.
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import.
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`.
- `package.json` - Project dependencies and scripts.
- `vite.config.ts` - Vite config (React, Tailwind v4, Figma Make plugins, and the `@` → `src` alias). It imports `.figma/make/site.json`, so the `.figma/` folder must remain present for builds.
- `.mise.toml` - Toolchain versions (Node 22, pnpm 10.34.3).

## Dependencies

- Runtime: React 19, React DOM 19, and lucide-react (icons).
- Styling: Tailwind CSS v4 via the `@tailwindcss/vite` plugin.
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`.
- Formatting: oxfmt.

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. No Tailwind or PostCSS config file is needed.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then any `@font-face` rules and font-family defaults.

Tailwind emits utility classes in `@layer utilities`, and CSS outside any cascade layer overrides every layer regardless of specificity. Put global element styles (resets and defaults for `body`, headings, `button`, `input`) inside `@layer base { ... }` so utility classes on those elements still apply.
