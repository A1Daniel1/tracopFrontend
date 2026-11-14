# TRACOP web: estado funcional e integración

Esta versión permite demostrar los flujos principales sin backend mediante datos locales claramente identificados. La misma interfaz puede cambiar a adaptadores HTTP con `VITE_DATA_MODE=http`; los endpoints descritos aquí son contratos propuestos para revisión, no servicios existentes.

## Ejecutar la demostración

1. Copia `.env.example` a `.env.local` y conserva `VITE_DATA_MODE=mock`.
2. Ejecuta `pnpm install --frozen-lockfile` y `pnpm dev`.
3. Crea un perfil local, prueba búsqueda/filtros, publica una oferta y recorre pedidos, cámara/QR, audio y ubicación.
4. Limpia los datos desde las herramientas del navegador eliminando las claves `tracop.*` cuando necesites reiniciar la demo.

Los perfiles, ofertas, pedidos y operaciones pendientes se guardan en `localStorage`. Las fotografías y grabaciones solo usan URLs temporales en memoria y no se persisten.

## Inventario funcional

| Área                                         | Estado                                | Funciona ahora                                                                     | Dependencia del backend                                                   |
| -------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Registro y login                             | Adaptador de desarrollo               | Validación, roles, errores, carga, sesión persistente y cierre de sesión           | Identity debe validar identidad y emitir una sesión real                  |
| Rutas protegidas                             | Funcional localmente                  | Conserva la sesión mock al recargar y restringe por rol                            | Autorización definitiva y expiración de sesión                            |
| Catálogo                                     | Funcional localmente / preparado HTTP | Búsqueda, categoría, disponibilidad, distancia, orden, vacío, carga y error        | Dataset, paginación y geodatos de catalog                                 |
| Publicaciones                                | Adaptador de desarrollo               | Crear y editar ofertas persistidas localmente                                      | Permisos, validación, almacenamiento de medios y estado oficial de offers |
| Pedidos                                      | Adaptador de desarrollo               | Crear pedido, aceptar, rechazar y contraofertar localmente                         | Orders decide transiciones, precios y permisos                            |
| Cámara y QR                                  | Funcional mediante API del navegador  | Vista previa real, permiso, liberación de cámara, BarcodeDetector e ingreso manual | Shipments verifica el código; compatibilidad de BarcodeDetector varía     |
| Foto de cosecha                              | Funcional localmente                  | Cámara/galería, validación de tipo/tamaño y vista previa                           | Storage entrega URL firmada y offers asocia el medio                      |
| Audio                                        | Funcional localmente                  | Grabación, detención, reproducción, cancelación, límite de 60 s/8 MB               | AI/STT recibe y procesa el archivo; no se simula transcripción            |
| Ubicación y mapa                             | Funcional mediante API del navegador  | Consentimiento, geolocalización, coordenadas manuales y mapa OSM                   | Shipments entrega paradas/ruta/ETA confirmadas                            |
| Offline                                      | Adaptador de desarrollo               | Estado de red, cola persistente, `clientOpId` y estados pendientes honestos        | Sync define reintentos, idempotencia, reconciliación y confirmación       |
| Notificaciones, pagos y asistente de precios | Pendiente de contrato                 | Pantallas existentes siguen como demostración                                      | Messaging, payments y AI/analytics                                        |

## Arquitectura

```text
Pantallas y hooks
       │
Servicios por dominio (auth, catalog, offers, orders)
       │
       ├── modo mock: localStorage + dataset de desarrollo
       └── modo http: cliente central + parser de respuestas
                              │
                     apps/api (externo)

Operaciones sin conexión → cola local con clientOpId → sync (pendiente)
```

Decisiones:

- `src/shared/http/client.ts` normaliza respuestas, errores HTTP y validación por parser.
- `src/services/*` concentra acceso a datos y evita que componentes conozcan `fetch` o claves de almacenamiento.
- `VITE_DATA_MODE` selecciona explícitamente `mock` o `http`; no hay fallback silencioso de HTTP a mock.
- El modo mock nunca genera tokens ni afirma haber sincronizado datos.
- Los tipos actuales son provisionales. Cuando `packages/shared` tenga una versión acordada, debe reemplazar los duplicados mediante una dependencia versionada.

## Contratos HTTP propuestos

Estas rutas son borradores para conversar con backend. No deben considerarse implementadas.

| Dominio   | Operación propuesta                | Solicitud mínima                                                          | Respuesta que el frontend necesita                               |
| --------- | ---------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| identity  | `POST /identity/login`             | `{ celular, rol }` más mecanismo OTP acordado                             | `{ userId, nombre, celular, rol }` y estrategia segura de sesión |
| identity  | `POST /identity/register`          | `{ nombre, celular, rol, aceptaDatos }`                                   | Perfil creado o errores por campo                                |
| catalog   | `GET /catalog/offers`              | query, categoría, ubicación, disponibilidad, cursor y orden               | Lista validable, cursor siguiente y metadatos de filtros         |
| offers    | `POST /offers` / `PUT /offers/:id` | producto, cantidad, unidad, precio, ubicación, disponibilidad y media IDs | Oferta canónica, permisos, versión y estado                      |
| orders    | crear/transicionar/contraofertar   | `client_op_id`, versión esperada y payload de acción                      | Pedido canónico, acciones disponibles y conflicto si aplica      |
| shipments | verificar QR y eventos             | código o media ID, ubicación opcional y `client_op_id`                    | Verificación firmada, carga y siguiente acción permitida         |
| sync      | lote de operaciones                | operaciones idempotentes con `client_op_id`                               | resultado individual: confirmado, rechazado o conflicto          |
| storage   | preparar carga                     | tipo, tamaño y hash                                                       | URL firmada/ID temporal; nunca credenciales de almacenamiento    |

Cada respuesta debe tener esquema compartido o parser versionado. Los errores deberían incluir un código estable, mensaje seguro, errores por campo y correlación; el frontend no debe depender de textos libres.

## Seguridad y límites

- `localStorage` solo contiene datos de demostración no sensibles. No se debe usar para tokens de producción, documentos, fotos ni audios.
- Cámara, micrófono y ubicación se solicitan únicamente por acción explícita. Streams y URLs temporales se liberan al salir.
- OpenStreetMap se usa para visualizar una coordenada autorizada; no se inventan rutas ni tiempos.
- Las operaciones mock muestran “local” o “pendiente”, nunca “confirmada por servidor”.
- Antes de habilitar HTTP se necesita acordar autenticación, CORS, CSRF/cookies, reintentos, límites de archivos y esquemas compartidos.

## Pruebas incluidas

- Filtros combinados y orden del catálogo.
- Registro/login mock y duplicados.
- Cliente HTTP: parser y error normalizado.
- Cola offline y generación de `client_op_id`.
- Smoke test de navegación inicial.

Las APIs de medios requieren pruebas manuales en HTTPS y dispositivos Android reales porque JSDOM no ofrece cámara, micrófono ni permisos del navegador.

## Roadmap por PR

1. **Este PR:** vertical mock funcional, arquitectura de adaptadores y capacidades del navegador.
2. **Contratos compartidos:** adoptar `packages/shared`, paginación y errores acordados.
3. **Identity + catalog HTTP:** sesión segura, OTP y catálogo real detrás de feature flag.
4. **Offers + orders + sync:** idempotencia, conflictos, acciones autorizadas y reconciliación.
5. **Shipments + storage + AI:** QR verificado, carga firmada, STT y geodatos reales.
6. **UX de campo:** pruebas con usuarios, accesibilidad, rendimiento Android y recursos offline.

## Checklist para backend

- [ ] Confirmar esquemas y versionado en `packages/shared`.
- [ ] Definir sesión web, OTP, cookies/CORS/CSRF y expiración.
- [ ] Definir catálogo paginado y filtros admitidos.
- [ ] Definir matriz de transiciones y acciones por rol.
- [ ] Definir idempotencia y reconciliación para `client_op_id`.
- [ ] Definir carga de medios y límites de audio/foto.
- [ ] Definir contrato geográfico sin exponer ubicación innecesaria.
