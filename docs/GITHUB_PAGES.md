# Publicar TRACOP en GitHub Pages

GitHub Pages publicará la SPA con HTTPS desde `main`. El pipeline no usa ni requiere credenciales AWS. El workflow de publicación S3 que ya existe en `main` se conserva sin cambios; esta configuración agrega Pages como hosting público y no migra ni borra recursos de AWS.

## Activación inicial

Una persona con permisos de administrador del repositorio debe hacer este ajuste una vez:

1. Abre **Settings → Pages** en `A1Daniel1/tracopFrontend`.
2. En **Build and deployment**, elige **Source: GitHub Actions**.
3. Cuando los cambios lleguen a `main` mediante los PR del flujo acordado, espera a que termine **Deploy GitHub Pages** en Actions.
4. Abre la URL que entrega el job `deploy`. Para este repositorio normalmente será `https://a1daniel1.github.io/tracopFrontend/`.

El primer despliegue puede requerir que GitHub Pages esté habilitado para el repositorio. No configures el deployment desde `develop` ni desde una rama feature.

## Qué hace el workflow

`.github/workflows/deploy-pages.yml` se activa con push a `main` o ejecución manual. Ambos jobs verifican que la referencia sea `main`; una ejecución manual seleccionada desde otra rama queda omitida. El pipeline instala dependencias bloqueadas, ejecuta lint, typecheck, Vitest y build, prepara un `404.html` para que GitHub Pages entregue la SPA al entrar a una URL anidada, sube solo `dist/` y publica el artefacto.

El `base` de Vite es `/` durante desarrollo local y `/tracopFrontend/` en build/preview de producción. React Router recibe `import.meta.env.BASE_URL` como `basename`. Vite reescribe las URLs de scripts, CSS y el favicon al subpath del repositorio. Las imágenes de ejemplo y la fuente Nunito siguen cargándose desde Unsplash y Google Fonts, por lo que dependen de conexión a esos servicios externos.

## Navegación directa y límites actuales

`404.html` copia el HTML compilado; esto hace que la aplicación vuelva a montar al abrir o recargar rutas profundas como `/tracopFrontend/comprador/pedidos`. El estado del rol, sin embargo, vive solo en memoria en `RoleProvider`. Si se recarga una ruta protegida, `RequireRole` redirige a la selección de rol. GitHub Pages resolverá el recurso y servirá la SPA, pero conservar la sesión/rol tras recargar requiere un cambio funcional aparte, que no se incluye en esta configuración.

## Validación local y después de publicar

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

El build local se genera con el prefijo `/tracopFrontend/`; verifica que `dist/index.html` refiera a `/tracopFrontend/assets/` y que existan `dist/assets/` y `dist/favicon.png`. `pnpm preview` sirve los archivos desde la raíz local y no reproduce fielmente el subpath de un sitio de proyecto. La verificación del workflow, ejecutada solo después de publicar desde `main`, consulta la página y `/comprador/pedidos` en el dominio Pages para comprobar el fallback y las referencias de assets. En Actions, comprueba que el artefacto contenga `index.html`, `404.html`, `assets/` y `favicon.png`, y que la URL del entorno `github-pages` coincida con la página publicada.

## Relación con AWS S3

El workflow S3 se mantiene en `main`. GitHub Pages se publicará desde `main` después de que el equipo integre los PR de feature a `develop` y luego el PR de release de `develop` a `main`. La coexistencia de ambos workflows puede publicar a ambos destinos; deshabilitar o retirar el S3 workflow requiere una decisión posterior explícita.
