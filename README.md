# TRACOP Web

TRACOP is a mobile-first agricultural marketplace for Colombia. It connects producers who publish harvests, buyers who discover products and place orders, and carriers who coordinate pickup and delivery.

The web application is currently designed to run as a complete frontend demonstration without a backend. Development data is explicitly labeled and stored in the browser. Domain services and an HTTP adapter are ready to connect to the team's API after its contracts are approved.

## Live application

Open the current deployment at:

**[https://a1daniel1.github.io/tracopFrontend/](https://a1daniel1.github.io/tracopFrontend/)**

The site is deployed from `main` through GitHub Actions and GitHub Pages. Camera, microphone and geolocation features require HTTPS and browser permission. QR auto-detection depends on `BarcodeDetector` support; manual code entry is available as a fallback.

## What can be demonstrated

- Local registration and login with validation, role selection and persistent sessions.
- Role-based navigation for producers, buyers and carriers.
- Catalog search, categories, availability, distance filters and sorting.
- Local creation and editing of produce offers.
- Local order creation, acceptance, rejection and counteroffers.
- Pending operation queue with `client_op_id` values for intermittent connectivity.
- Real browser camera access, QR detection and manual code entry.
- Photo capture/gallery selection and audio recording/playback.
- User-approved geolocation and OpenStreetMap visualization.

Mock operations are not presented as server-confirmed transactions. OTP, official prices and state transitions, media storage, QR verification, route calculations and synchronization reconciliation still depend on the backend.

## Run locally

Requirements:

- Node.js 22 or newer
- pnpm 10 (the repository pins `10.34.3` in `.mise.toml`)

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Vite prints the local URL, normally `http://localhost:5173`. Browser media permissions work most reliably on `localhost` or HTTPS.

### Environment configuration

Copy `.env.example` to `.env.local`:

```env
VITE_DATA_MODE=mock
VITE_API_BASE_URL=http://localhost:3000
```

| Variable            | Purpose                                                               |
| ------------------- | --------------------------------------------------------------------- |
| `VITE_DATA_MODE`    | `mock` uses browser persistence; `http` enables domain HTTP adapters. |
| `VITE_API_BASE_URL` | Base URL for the external API. Required only in HTTP mode.            |

HTTP mode should be enabled only after the backend contracts, authentication strategy and CORS policy are agreed. The frontend does not silently fall back to mock data when an HTTP request fails.

## Quality commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format:check
```

`pnpm build` generates the production bundle in `dist/` with the `/tracopFrontend/` base path required by GitHub Pages.

## Architecture

```text
React screens and hooks
        │
Domain services: auth, catalog, offers and orders
        │
        ├── mock adapter: localStorage + development dataset
        └── HTTP adapter: centralized client + response parsers
                               │
                         external apps/api

Offline-compatible actions → local queue → backend sync contract
```

Important locations:

| Path                          | Responsibility                                                   |
| ----------------------------- | ---------------------------------------------------------------- |
| `src/app/`                    | Routing, role/session context and application shell.             |
| `src/features/`               | Screens grouped by business capability.                          |
| `src/services/`               | Domain adapters for mock and HTTP data access.                   |
| `src/shared/http/`            | Central HTTP client, error normalization and runtime parsers.    |
| `src/shared/offline/`         | Connectivity state and pending operation queue.                  |
| `src/shared/maps/`            | Browser geolocation and map presentation.                        |
| `docs/FRONTEND_FUNCTIONAL.md` | Feature inventory, proposed API contracts and backend checklist. |

Browser persistence is intended only for non-sensitive development data. Production credentials, tokens, photos and audio must not be stored in `localStorage`.

## Deployment

The public site uses GitHub Pages only. `.github/workflows/deploy-pages.yml` runs quality checks, builds the application, prepares the SPA fallback and deploys when `main` changes.

Repository configuration and direct-route behavior are described in [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md).

## Documentation

- [Functional frontend and proposed backend contracts](docs/FRONTEND_FUNCTIONAL.md)
- [GitHub Pages deployment](docs/GITHUB_PAGES.md)
- [Image sources and licenses](docs/IMAGE_CREDITS.md)
- [UX/UI audit](docs/UX_AUDIT.md)

## Git workflow

The normal collaboration flow is `feature/* → develop → main`. Use Conventional Commits and keep tests with the behavior they verify. The interface language is Spanish (`es`), while engineering documentation is maintained in English.

## Current limitations

- Backend modules are not part of this repository.
- Camera, microphone, QR and geolocation require manual testing on supported browsers and Android devices.
- The mock adapter is a development tool, not a production authentication or transaction system.
- Shared types are provisional until the team publishes a versioned `packages/shared` contract.
