# ListoPorHoy — informe de investigación

> Fase de investigación y preparación. No implementa la ficha.

## 1. Ficha de identidad

| Dato | Valor | Estado |
|---|---|---|
| Nombre público | ListoPorHoy | aprobado en el sitio |
| Nombre técnico | Conecta (API y repositorio) | verificado (`README.md:1-3`) |
| Categoría JMorgado | Productos y plataformas · Integraciones | aprobado |
| URL pública | https://listoporhoy.impulsacv.cl | declarada en `site_data.py` |
| Repositorio | https://github.com/jmorgadodev/conecta (privado) | verificado |
| Revisión auditada | `049a047fb8b8a629fc3acd2150d6f5260044ba43` (rama `codex/listoporhoy-release`, 2026-10-25) | verificado |
| Ruta local auditada | `C:\Users\jorge\Proyectos\Conecta` | sólo lectura |
| Fecha de revisión | 2026-11-10 | — |

## 2. Qué problema resuelve

Publicar en redes para marcas distintas obliga a convivir con calendarios sueltos, carpetas de archivos, cuentas separadas y estados de publicación dispersos. ListoPorHoy propone una capa única: **por marca**, con calendario, borradores, medios y conexiones a las redes en el mismo entorno y con permisos explícitos.

El repositorio lo describe como «la experiencia pública para planificar y entender contenido de redes sociales» y conserva el nombre técnico Conecta (`README.md:1-3`).

## 3. Qué se redujo realmente (verificado en código)

1. **Landing pública + dashboard web.** Frontend Vite con `frontend/index.html` (landing) y `frontend/app.html` (dashboard); scripts separados `js/landing.js` y `js/app.js` (`README.md:5-8`).
2. **API central en Hono sobre Cloudflare Workers.** `worker/src/index.js:1-23` declara el Worker «Multi-Tenant & Multi-RRSS»; las rutas se montan por dominio (`routes/auth.js`, `brands.js`, `posts.js`, `media.js`, `calendar.js`, `webhooks.js`, `feedback.js`, `admin.js`, `storage.js`, `meta-oauth.js`, `tiktok-oauth.js`).
3. **Multi-tenancy y permisos por marca.** El esquema D1 define `users`, `tenants` (marcas), `tenant_users` (roles), `social_accounts`, `posts`, `account_metrics_history`, `automations`, `feedback`, `calendar_ideas`, `calendar_notes` y `brand_plans`, con índices por marca, estado y fecha (`worker/src/db/schema.sql:6-178`).
4. **Ciclo de vida de una publicación.** `posts` guarda formato, copy, hashtags, medios de Drive, plataformas destino, programación, estado (`DRAFT`, `SCHEDULED`, `PUBLISHING`, `PUBLISHED`, `ERROR`), identificadores de publicación por red y bitácora de error (`worker/src/db/schema.sql:51-79`).
5. **Conexiones OAuth reales.** Servicios para Meta (`meta-connections.js`, `meta-graph.js`, `facebook.js`, `instagram.js`) y TikTok (`tiktok-oauth.js`, `tiktok-posting.js`, `tiktok-metrics.js`, `tiktok-diagnostics.js`), con estado de conexión explícito: `CONNECTED`, `LIMITED`, `UNVERIFIED`, `RECONNECT_REQUIRED`, y permisos derivados (`canPublish`, `canPublishStories`) (`worker/src/services/meta-connections.js:8-35`).
6. **Medios en Google Drive mediante un puente (Apps Script).** `storage-accounts.js:9-26` valida cada cuenta de almacenamiento (correo, carpeta raíz y URL del puente) y exige que el puente sea un `https://script.google.com/macros/s/.../exec`; `storage-accounts.js:28-39` exige que la capacidad informada esté verificada y no vencida.
7. **Cifrado de tokens en reposo.** `worker/src/services/crypto.js:1-29` implementa AES-GCM 256 bits con IV aleatorio y prefijo `enc:v1:`.
8. **Webhooks verificados.** `worker/src/services/webhook-security.js:2-8` valida la firma HMAC-SHA256 de Meta antes de procesar el evento; `persistMetaEvents` valida la envoltura del evento (`webhook-security.js:12-25`).
9. **Métricas e historial por cuenta.** `account_metrics_history` y servicios `facebook-metrics.js` / `tiktok-metrics.js` guardan histórico de indicadores por marca y plataforma (`worker/src/db/schema.sql:82-96`).
10. **Verificación y operación documentadas.** `docs/Validacion/`, `docs/AUDITORIA_FUNCIONAL_POST_DESPLIEGUE_20261019.md`, `docs/ESTADO_MODULOS_Y_SIGUIENTES_PRUEBAS_20261019.md`, guías de Meta, TikTok, Threads y despliegue de Drive.

## 4. Funcionalidades principales

| # | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| 1 | Landing pública de planificación | `frontend/index.html`, `frontend/js/landing.js` | verificado |
| 2 | Dashboard por marca con calendario e ideas | `frontend/app.html`, `js/app.js`, `routes/calendar.js` | verificado |
| 3 | Borradores, programación y estados de publicación | `db/schema.sql:51-79`, `routes/posts.js` | verificado |
| 4 | Biblioteca de medios con carga por fragmentos y verificación | `routes/media.js:36-85`, `services/private-media.js` | verificado |
| 5 | Conexión y publicación en Instagram/Facebook y TikTok | `services/meta-graph.js`, `services/tiktok-posting.js` | verificado |
| 6 | Métricas e historial por cuenta y plataforma | `db/schema.sql:82-96`, `services/*-metrics.js` | verificado |

## 5. Arquitectura y flujo

```
Landing pública (Vite) ─┐
                         ├─► API Hono (Cloudflare Workers)
Dashboard (Vite) ────────┘      │
                                ├─► D1: marcas, usuarios, roles, calendario, posts, métricas, feedback
                                ├─► Drive (medios) ◄── puente Apps Script con capacidad verificada
                                ├─► OAuth Meta (Instagram / Facebook) ──► publicación + métricas
                                ├─► OAuth TikTok ─────────────────────► publicación + métricas
                                └─► Webhooks Meta (firma HMAC verificada)
```

El frontend se sirve como estático y el Worker responde en `/api`; el repositorio documenta el reenvío de Vite a `http://localhost:8787` en desarrollo (`README.md:22-30`).

## 6. Tecnologías verificadas

Vite 5 (frontend, sin framework JS) · Hono 4 (`worker/package.json`) · Cloudflare Workers + Wrangler 3 · Cloudflare D1 · Google Drive como almacén de medios · Apps Script como puente de medios · OAuth de Meta y TikTok · Google Apps Script (formularios/landing) · Tailwind en el kit de diseño aprovado (`docs/Diseño/`).

## 7. Mi participación

**Afirmable:** el repositorio `jmorgadodev/conecta` está bajo la misma cuenta y contiene la implementación completa; el README declara que la ruta única de desarrollo es la carpeta local del proyecto (`README.md:5`).

**No afirmable:** la autoría individual de cada módulo no está documentada; los commits son de la misma cuenta, sin coautores registrados.

**Pendiente:** el repositorio es privado, así que la ficha no puede enlazar al código público (a diferencia de El Cambiómetro). Conviene decidirlo antes de escribir la sección `repo`.

## 8. Capacidades que merece la pena mostrar

1. **Una marca, un contexto:** calendario, borradores, medios y estados por tenant, con roles (`db/schema.sql:19-50`).
2. **Permisos que se ven:** el estado de la conexión y lo que se puede o no hacer con esa cuenta (`services/meta-connections.js:8-35`).
3. **Publicación con trazabilidad:** cada publicación guarda identificador de medio, de contenedor, permalink y error (`db/schema.sql:68-77`).

## 9. Propuesta de ficha JMorgado

- **Título editorial:** «ListoPorHoy» + acento coral. Bajada: «Planificar, revisar y publicar por marca desde un mismo entorno».
- **Descripción breve:** mantener la aprobada («Calendario, borradores, marcas, medios y servicios de publicación coordinados desde un mismo entorno»).
- **Desafío:** operar contenido de distintas marcas con herramientas separadas.
- **Solución:** plataforma web con landing y dashboard, backend Hono sobre Workers, D1 multi-tenant, biblioteca de medios en Drive y conexiones OAuth con Meta y TikTok.
- **Funcionalidades destacadas:** calendario e ideas por marca · borradores con programación · medios verificados · publicación con permisos y métricas.
- **Participación:** «Desarrollé la plataforma, su modelo de permisos y las integraciones disponibles».
- **Tecnologías:** Vite · Hono · Cloudflare Workers · D1 · OAuth / APIs sociales · Google Drive.
- **Demostraciones posibles:** diagrama de arquitectura; captura del calendario por marca; flujo de conexión de una cuenta; portal embebido (ya existe `PROJECT_PORTAL_PAGES["conecta"]` con la landing).
- **Estructura sugerida de módulos `fx-*`:**
  - `hero` — sí, con chip «Ver sitio».
  - `desafio` — sí.
  - `perspectivas` — **sí, un solo diagrama de arquitectura** (el sistema es lo más difícil de explicar en texto).
  - `plataforma` — sí, tres pasos (marca y calendario / backend, datos y permisos / OAuth y publicación).
  - `participacion` — sí (Desarrollo / Integración / Permisos).
  - `tech` — sí.
  - `repo` — **no**: repositorio privado. La ficha debe llevar sólo el enlace al sitio.
  - `metrics` — no, salvo que exista un conteo de marcas o publicaciones verificable y fechado.
  - `galeria` — opcional, si hay capturas aprobadas del dashboard.
  - `cierre` + `contacto` — sí, en ese orden, con CTA único a `/contacto/`.
- **Qué omitir:** el detalle de automatizaciones de comentarios y mensajes directos. El esquema las contempla con banderas por marca y desactivadas por defecto (`db/schema.sql:97-109`); no hay evidencia de que estén operativas.

## 10. Diagrama Archify recomendado

**Tipo: `architecture`** (7 nodos). Justificación: lo que distingue este proyecto frente a un calendario común son las conexiones, los permisos y el almacenamiento de medios; un diagrama lo explica mejor que un texto.

Nodos propuestos:

| id | etiqueta | tipo | evidencia |
|---|---|---|---|
| `landing` | Landing y dashboard | frontend | `frontend/index.html`, `frontend/app.html` |
| `api` | API Hono (Workers) | backend | `worker/src/index.js:1-23` |
| `d1` | D1 · marcas, roles, calendario | database | `worker/src/db/schema.sql:19-50` |
| `drive` | Google Drive (medios) | cloud | `worker/src/services/storage-accounts.js:9-26` |
| `bridge` | Puente Apps Script | backend | `worker/src/services/private-media.js`, `storage-accounts.js:19-22` |
| `meta` | Meta (Instagram · Facebook) | external | `worker/src/services/meta-graph.js`, `meta-connections.js` |
| `tiktok` | TikTok | external | `worker/src/services/tiktok-posting.js` |

Conexiones: `landing→api` (REST `/api`), `api→d1` (CRUD por tenant), `api→bridge` (subida de medios), `bridge→drive` (carpeta raíz), `api→meta` (OAuth y publicación, con nota de permisos), `api→tiktok` (OAuth y publicación), `meta→api` (webhook con firma HMAC). Las flechas de retorno (webhooks, métricas) son el argumento de valor del diagrama.

**Segundo diagrama:** opcional. Si se hace, un `workflow` del recorrido de una publicación (idea → borrador → medio → programación → publicación → métrica) encajaría mejor que un segundo `architecture`.

## 11. Información pendiente de confirmar

- Estado real de las automatizaciones de comentarios/mensajes en producción.
- Número de marcas activas y volumen de publicaciones (no hay evidencia en el repositorio).
- Si la landing pública sigue siendo la url principal del producto.
- Disponibilidad de capturas del dashboard.

## 12. Fuentes consultadas

`README.md` · `PROYECTO_CONECTA_MASTER.md` · `ARQUITECTURA_PLATAFORMA.md` · `AUDITORIA_SISTEMA.md` · `worker/package.json` · `worker/src/index.js` · `worker/src/db/schema.sql` · `worker/src/routes/*` · `worker/src/services/*` · `worker/migrations/0001…0015` · `docs/ARQUITECTURA_CONECTA_MVP.md` · `docs/ESTADO_MODULOS_Y_SIGUIENTES_PRUEBAS_20261019.md` · `docs/METRICAS_FUENTES_Y_LIMITES.md` · `GUIA_INTEGRACION_META_INSTAGRAM.md` · `GUIA_INTEGRACION_TIKTOK.md` · `docs/Validacion/`.
