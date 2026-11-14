# Despliegue del frontend TRACOP

## Arquitectura

TRACOP es una SPA de React 19 compilada con Vite 8. `pnpm build` produce archivos estáticos en `dist/`; no requiere un servidor Node.js en producción y puede servirse desde S3 Static Website Hosting. Este repositorio contiene solo el frontend. Los datos de ejemplo se habilitan mediante `VITE_USE_MOCK=true`; no hay variables obligatorias declaradas en el código actualmente.

El workflow `.github/workflows/deploy-frontend.yml` compila y publica en el bucket existente `tracop-web-dev-us-east-1`, región `us-east-1`. El endpoint de sitio web S3 usa HTTP y no cifra el tráfico. El workflow no crea recursos, no habilita acceso público y no configura CloudFront.

## Configuración necesaria en AWS

En la consola de S3, abre `tracop-web-dev-us-east-1` y verifica en **Properties → Static website hosting**:

1. El hosting está habilitado como sitio web estático.
2. El documento de índice es `index.html`.
3. Para esta SPA con React Router, configura también el documento de error como `index.html` para que las rutas del cliente se resuelvan. S3 puede responder con estado 404 en rutas de fallback; el comportamiento puede variar. Para respuestas SPA con estado 200 y HTTPS se recomienda CloudFront cuando los permisos estén disponibles.
4. El acceso de lectura al endpoint web ya está permitido por una configuración aprobada de bucket/política. El sitio S3 debe ser públicamente legible para usuarios anónimos si se va a servir directamente desde ese endpoint. Esto expone los archivos estáticos compilados a Internet; nunca subas secretos al frontend. No cambies Block Public Access ni agregues una política pública sin aprobación del responsable de AWS.

El endpoint esperado es `http://tracop-web-dev-us-east-1.s3-website-us-east-1.amazonaws.com/`. No se ha comprobado el estado real del bucket desde este repositorio.

## Configuración de GitHub

En **Settings → Secrets and variables → Actions**, crea estos repository secrets:

| Secret | Valor |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | Access key temporal vigente del Learner Lab |
| `AWS_SECRET_ACCESS_KEY` | Secret key de esa misma sesión |
| `AWS_SESSION_TOKEN` | Session token de esa misma sesión |

Los tres valores deben corresponder a la misma sesión activa. El workflow no imprime los valores. No los guardes en el repositorio, `.env`, archivos de workflow ni logs. Rota/revoca de inmediato cualquier credencial publicada por error y reemplázala por una sesión nueva.

### OIDC y Learner Lab

El workflow actualmente usa credenciales temporales del laboratorio. OIDC requiere que alguien con permisos adecuados cree un proveedor de identidad GitHub y un rol IAM con confianza restringida al repositorio y a la rama `main`, además de permisos mínimos de S3. AWS Academy puede impedir esas operaciones; no es posible confirmar la disponibilidad sin acceso administrativo al laboratorio. No se configuró OIDC ni se afirma que el CI sea permanente.

Cuando la sesión Learner Lab caduque, inicia una sesión nueva, copia los tres valores de credenciales temporales desde **AWS Details / AWS CLI**, y actualiza los secretos de GitHub. Los siguientes despliegues fallarán hasta que se haga esto. Un error `ExpiredToken`, `InvalidClientTokenId` o de firma suele indicar credenciales vencidas o combinadas de sesiones distintas.

## Pipeline

En cada push a `main` y en ejecuciones manuales (`workflow_dispatch`), GitHub Actions instala con `pnpm install --frozen-lockfile`, ejecuta lint, TypeScript y las pruebas existentes, y compila con Node 22. Comprueba que `dist/index.html` exista, valida el bucket y la región fijos, verifica identidad AWS y acceso al bucket, sube assets y `index.html` con políticas de caché separadas, confirma que el objeto se publicó y consulta el endpoint HTTP. El grupo de concurrencia serializa ejecuciones de este entorno.

Los assets se publican con caché de un año; esto funciona mejor cuando los nombres de assets llevan hash. `index.html` se publica sin caché. El workflow intencionalmente no usa `--delete`: evita borrar objetos no generados por este frontend en el bucket compartido. Si luego se necesita limpieza automática, usa un prefijo dedicado para esta app y revisa el alcance antes de habilitar borrados.

## Despliegue manual

Desde una terminal con Node 22, pnpm 10 y AWS CLI configurada con credenciales actuales que tengan permisos de listado y escritura de objetos en el bucket:

```powershell
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
if (-not (Test-Path -Path 'dist/index.html' -PathType Leaf)) { throw 'Falta dist/index.html' }
aws sts get-caller-identity
aws s3api head-bucket --bucket tracop-web-dev-us-east-1
aws s3 sync dist/ s3://tracop-web-dev-us-east-1/ --region us-east-1 --exclude index.html --cache-control 'public,max-age=31536000,immutable'
aws s3 cp dist/index.html s3://tracop-web-dev-us-east-1/index.html --region us-east-1 --content-type 'text/html; charset=utf-8' --cache-control 'no-cache,no-store,must-revalidate'
aws s3api head-object --bucket tracop-web-dev-us-east-1 --key index.html
```

Comprueba luego el endpoint web en el navegador. Estos comandos no habilitan hosting ni cambian políticas de acceso.

## Diagnóstico

- `AccessDenied` en `head-bucket`, `sync` o `cp`: el rol no tiene la acción S3 correspondiente o el bucket/política la deniega. Solicita al administrador del Learner Lab los permisos mínimos; el workflow no los puede conceder.
- `AccessDenied` al abrir el endpoint: revisa hosting estático y la política aprobada de lectura pública. No desactives Block Public Access para sortearlo sin autorización.
- `ExpiredToken` o `InvalidClientTokenId`: renueva los tres secretos con valores de una sesión activa y coincidente.
- Error de HTTP tras una subida confirmada: verifica el documento índice, endpoint/región y permisos de lectura del sitio.
- Falla antes de AWS: revisa lint, typecheck, pruebas o build en el log del job.

## Rollback

No existe rollback automático configurado. Si S3 Versioning ya está habilitado, restaura las versiones anteriores de los objetos con el procedimiento aprobado por el administrador. Si no está habilitado, vuelve a desplegar un artefacto de build anterior guardado en una ejecución/artefacto de GitHub Actions. Antes de restaurar, conserva una copia del contenido actual. No se debe sincronizar una carpeta vacía ni ejecutar `--delete` como rollback.

## Evolución a CloudFront

Cuando AWS Academy o una cuenta con permisos lo permita, configura CloudFront con Origin Access Control (OAC), restringe el bucket para que CloudFront sea el único lector y utiliza HTTPS y una política de caché adecuada. Haz esa migración en una cuenta autorizada y verifica la política del bucket antes de retirar el acceso público del sitio. El endpoint S3 website requiere HTTP y no admite OAC como origen privado; para S3 privado, CloudFront debe usar el endpoint REST del bucket.
