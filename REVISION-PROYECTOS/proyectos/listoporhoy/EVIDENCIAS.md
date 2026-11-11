# ListoPorHoy (Conecta) — evidencias

> Fuente: repositorio local `C:\Users\jorge\Proyectos\Conecta` (sólo lectura).
> Revisión auditada: `049a047fb8b8a629fc3acd2150d6f5260044ba43` (rama `codex/listoporhoy-release`, 2026-10-25 09:33 -0300).
> Remote: `https://github.com/jmorgadodev/conecta.git` (privado).
> Fecha de revisión: 2026-11-10.

## 1. Afirmaciones y respaldo

| # | Afirmación | Respaldo | Qué demuestra | Estado |
|---|---|---|---|---|
| 1 | El repositorio implementa ListoPorHoy bajo el nombre técnico Conecta | `README.md:1-3` | identidad del proyecto | verificado |
| 2 | Hay landing pública y dashboard web separados | `README.md:5-8`, `frontend/index.html`, `frontend/app.html` | dosurfaces | verificado |
| 3 | La API es Hono sobre Cloudflare Workers | `worker/package.json` (`hono ^4.6.0`), `worker/src/index.js:1-23` | stack backend | verificado |
| 4 | El modelo es multi-tenant con roles por marca | `worker/src/db/schema.sql:19-50` | `tenants`, `tenant_users`, `social_accounts` | verificado |
| 5 | El calendario se modela con ideas y notas por marca | `worker/src/db/schema.sql:123-153` | `calendar_ideas`, `calendar_notes` | verificado |
| 6 | Cada publicación guarda estado, medio, red y error | `worker/src/db/schema.sql:51-79` | trazabilidad de publicación | verificado |
| 7 | Existen conecciones OAuth de Meta y TikTok | `worker/src/routes/meta-oauth.js`, `routes/tiktok-oauth.js`, `services/tiktok-oauth.js` | integraciones | verificado |
| 8 | El estado de conexión Meta distingue permisos effective | `worker/src/services/meta-connections.js:8-35` | límites por permisos | verificado |
| 9 | El almacenamiento en Drive exige puente Apps Script HTTPS y capacidad verificada | `worker/src/services/storage-accounts.js:9-39` | control de medios | verificado |
| 10 | Los tokens se cifran con AES-GCM 256 | `worker/src/services/crypto.js:1-29` | seguridad de credenciales | verificado |
| 11 | Los webhooks Meta se validan con HMAC-SHA256 | `worker/src/services/webhook-security.js:2-8` | integridad de eventos | verificado |
| 12 | Hay histórico de métricas por cuenta y plataforma | `worker/src/db/schema.sql:82-96`, `services/facebook-metrics.js`, `services/tiktok-metrics.js` | medición | verificado |
| 13 | El modelo contempla automatizaciones de comentarios y DM, desactivadas por defecto | `worker/src/db/schema.sql:97-109` | alcance real vs. documentado | verificado (no operativas) |
| 14 | Existen migraciones que cubren OAuth de Meta y TikTok | `worker/migrations/0012…0015` | evolución del esquema | verificado |
| 15 | Marcas activas, volumen de publicaciones o usuarios | — | no hay evidencia en el repositorio | no afirmable |
| 16 | Autoría individual de módulos | — | commits sin coautores registrados | pendiente |

## 2. Comandos ejecutados (sólo lectura)

```powershell
git -C C:\Users\jorge\Proyectos\Conecta rev-parse HEAD
git -C C:\Users\jorge\Proyectos\Conecta remote get-url origin
git -C C:\Users\jorge\Proyectos\Conecta log -1 --format="%H %ci %s"
Get-Content README.md
Get-Content worker\package.json
Get-ChildItem worker\src -Recurse -File
Get-Content worker\src\index.js -TotalCount 140
Select-String -Path worker\src\db\schema.sql -Pattern "CREATE TABLE|CREATE INDEX"
Get-Content worker\src\services\meta-connections.js -TotalCount 40
Get-Content worker\src\services\storage-accounts.js -TotalCount 45
Get-Content worker\src\services\crypto.js -TotalCount 30
Get-Content worker\src\services\webhook-security.js -TotalCount 25
Get-ChildItem worker\migrations -File
Get-ChildItem docs -Recurse -File
```

No se ejecutó `npm install`, `wrangler dev`, ni los comandos `db:reset` / `db:seed` que el propio repositorio marca como sensibles (`README.md:32-36`).

## 3. Extractos mínimos

`worker/src/db/schema.sql:97-105` (extracto)

```
CREATE TABLE IF NOT EXISTS automations (
    ...
    comments_enabled INTEGER DEFAULT 0,
    comments_message TEXT,
    comments_delay INTEGER DEFAULT 30,
    dm_enabled INTEGER DEFAULT 0,
    dm_message TEXT,
```

`worker/src/services/meta-connections.js:21-35` (extracto)

```
const fresh = Number(row.verified_at) > time - 900;
const state =
  row.expires_at && row.expires_at <= time
    ? "RECONNECT_REQUIRED"
    : !fresh && row.connection_state !== "RECONNECT_REQUIRED"
      ? "UNVERIFIED"
      : row.connection_state || "UNVERIFIED";
...
  canPublish: identity && row.can_publish === 1,
```

`worker/src/services/storage-accounts.js:18-22` (extracto)

```
if (!LABEL.test(label) || !label || !EMAIL.test(googleEmail) || !FOLDER_ID.test(rootFolderId)
    || parsed.protocol !== 'https:' || parsed.hostname !== 'script.google.com'
    || !/^\/macros\/s\/[A-Za-z0-9_-]{10,200}\/exec$/.test(parsed.pathname)
```

## 4. Archivos clave

| Archivo | Propósito |
|---|---|
| `README.md` | identidad, estructura y operación del repositorio |
| `PROYECTO_CONECTA_MASTER.md` | contexto de producto |
| `ARQUITECTURA_PLATAFORMA.md` / `docs/ARQUITECTURA_CONECTA_MVP.md` | arquitectura del MVP |
| `worker/src/index.js` | Worker central: middlewares, CORS, montaje de rutas, cron |
| `worker/src/db/schema.sql` | esquema D1 completo (11 tablas + índices) |
| `worker/src/middleware/auth.js` | `requireAuth()` por ruta |
| `worker/src/routes/*.js` | marcas, posts, calendario, medios, webhooks, admin, storage, OAuth |
| `worker/src/services/meta-graph.js`, `meta-connections.js` | integración Meta y estados de permisos |
| `worker/src/services/tiktok-*.js` | integración TikTok (OAuth, publicación, métricas, diagnóstico) |
| `worker/src/services/storage-accounts.js`, `private-media.js` | medios en Drive vía puente Apps Script |
| `worker/src/services/crypto.js` | cifrado AES-GCM de tokens |
| `worker/src/services/webhook-security.js` | verificación HMAC de webhooks |
| `worker/migrations/0001…0015` | historial de esquema |
| `frontend/index.html`, `app.html`, `js/*.js` | landing y dashboard |
| `docs/Validacion/`, `docs/AUDITORIA_FUNCIONAL_POST_DESPLIEGUE_20261019.md` | evidencia de validación por iteración |

## 5. Hallazgos de seguridad (no reproducidos aquí)

- `worker/src/services/crypto.js:6` define una clave de cifrado por defecto embebida en el código. Debe reemplazarse por una variable de entorno en cualquier despliegue y rotarse si se usó en producción.
- `worker/src/services/storage-accounts.js:9-26` cifra el secreto del puente con esa misma clave: depende del punto anterior.
- No se reprodujeron aquí valores de tokens, IDs de cuentas sociales ni secretos de `.dev.vars` / `.env`.
