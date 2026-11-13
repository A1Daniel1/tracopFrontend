# Reorganizar app en app/features/shared

**Objetivo**: reorganizar el monolito `src/App.tsx` (~1635 líneas, 31 componentes) en una arquitectura por capas (app / features / shared) sin cambiar lo visual, salvo eliminar el scaffolding de demo aprobado.

**Rama**: `feature/refactor-architecture` · **Estrategia**: single-pr · **Runner**: `pnpm test`

## Specs

- S1: Estructura `app/` (router, providers, layout), `features/{auth,catalog,offers,orders,freight,shipments,assistant,notifications}/` con `components/`, `hooks/`, `api/`, y `shared/{ui,lib,types,offline}/`.
- S2: Tipos `Rol`, `Oferta`, `Pedido`, `EstadoPedido`, `Flete` en `shared/types`.
- S3: Datos de ejemplo movidos a capa mock separada de componentes, activa con `VITE_USE_MOCK=true`.
- S4: Componentes reutilizables extraídos a `shared/ui`: stepper de estado (`StatusStepper`), chip de sincronización (`SyncChip`, estados guardado/pendiente/sincronizado), banner sin conexión (`OfflineBanner`).
- S5: Rutas por rol con guard (`RequireRole`). Sin rol elegido → redirige a `/`.
- S6: Eliminar scaffolding de demo: `prototype-note` (panel "Prototipo móvil"), `role-pills`, toggle manual de conexión y `StateGallery`.
- S7: `lint`, `typecheck`, `test` y `build` pasan. Render idéntico (salvo S6).

## Tasks

- T1 [S1,S2] Instalar react-router-dom; crear `shared/types` y estructura de carpetas. (inline)
- T2 [S4] Mover UI compartida a `shared/ui` (Button, AppIcon, SectionTitle, Header, BottomNav, SyncChip, StatusStepper, OfflineBanner). (inline)
- T3 [S3] Capa mock + helpers (format, rutas) en `shared/lib`; hook `useOffline` en `shared/offline`. (inline)
- T4 [S1] Extraer pantallas a `features/*`. (inline)
- T5 [S5,S6] Router por rol + guard + Layout; eliminar scaffolding demo; rewire `main.tsx` y test. (inline)
- T6 [S7] Verificación final (lint/typecheck/test/build). (inline)

## Log

- L1: "Analiza src/ y dime primero qué hay duplicado… Espera mi aprobación y luego reorganiza así, sin cambiar lo visual…"
- L2: Análisis entregado; aprobado. Decisión usuario: **eliminar** scaffolding demo (panel prototipo, role-pills, toggle de conexión, StateGallery).
