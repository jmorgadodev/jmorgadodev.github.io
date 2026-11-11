# Exo Dream — informe de investigación

> Fase de investigación y preparación. No implementa la ficha.

## 1. Ficha de identidad

| Dato | Valor | Estado |
|---|---|---|
| Nombre público | Exo Dream | aprobado en el sitio |
| Categoría JMorgado | Experiencia web · Showroom configurable | aprobado |
| URL pública | **sin confirmar** (el repositorio declara `vercel.json`, `netlify.toml` y `dist/`) | pendiente |
| Repositorio | sin repositorio Git local; fuente local-only | verificado |
| Revisión | **no aplica**: la carpeta `C:\Users\jorge\Proyectos\Toby` no contiene `.git` | verificado |
| Ruta local auditada | `C:\Users\jorge\Proyectos\Toby` | sólo lectura |
| Material de cliente | `Manual_Operativo_Exo_Dream.pdf`, `Documentacion/` (logos) | verificado |
| Fecha de revisión | 2026-11-10 | — |

> La ficha debe mantener el estado «proyecto documentado; URL pública sin confirmar». No se debe inventar un enlace.

## 2. Qué problema resuelve

Un estudio interdisciplinario (audio, música, arte audiovisual) tiene líneas de trabajo distintas que cambian: obras, servicios, agenda, formularios. Mantener cada bloque al día rehaciendo páginas no escala. Exo Dream resuelve eso con un **showroom configurable**: catálogo y textos salen de una planilla y de Drive, y la interfaz se reconstruye a partir de ellos.

## 3. Qué se desarrolló realmente

1. **Capa de datos en dos servicios.** `src/services/sheets.js` expone `fetchCatalogData()` y `fetchSiteConfig()`; `src/services/drive.js` resuelve medios (`extractDriveFileId`, `resolveDriveImageUrl` con tamaños `card`/`zoom`/`thumb` y reintentos) (`src/services/sheets.js:227-286`, `src/services/drive.js:5-40`).
2. **Lectura por proxy interno con respaldo.** El catálogo se pide primero a `/api/catalog` (proxy en el hosting) y, si no responde, cae a un endpoint de respaldo protegido por tokenización en `src/config.js:3-14`, sin caché (`src/services/sheets.js:227-286`).
3. **Proxy en el hosting.** Netlify y Vercel reescriben `/api/catalog` y `/api/config` hacia la exportación CSV de la planilla, y fijan cabeceras de seguridad (`netlify.toml:1-22`, `vercel.json:1-30`).
4. **Textos del sitio editables sin tocar código.** `processConfigRows()` procesa la hoja «Configuración y Textos» sobre una base `DEFAULT_SITE_TEXTS` (`src/services/sheets.js:288-296`, `src/config.js:44-45`), y la app los consume en hero, contacto y WhatsApp (`src/App.jsx:29-30`, `src/App.jsx:272`, `src/App.jsx:390`).
5. **Sanitización de filas.** `processCatalogRows()` normaliza claves (minúsculas, sin acentos), descarta columnas no autorizadas y descarta filas sin nombre (`src/services/sheets.js:22-40`).
6. **Showroom con catálogo, categorías, búsqueda y fichas.** `CategoryFilters`, `ProductCard`, `ProductDetailModal`, `GalleryZoomModal` y `VideoModal` (`src/App.jsx:3-9`, `src/App.jsx:118`).
7. **Agenda y formularios.** `BookingModal` (reserva/contacto), `SurveyModal` (encuestas y formularios técnicos embebidos, con enlace externo por ítem) y `ContactModal` (`src/components/SurveyModal.jsx:6-40`).
8. **Identidad visual.** `AnimatedExoLogo`, `BackgroundGrid`, `BrandLoader` y un botón flotante de WhatsApp (`src/App.jsx:12-13`).
9. **Herramientas de operación.** `update_sheets_full.cjs` (escribe celdas de la planilla con Chrome headless vía `puppeteer-core`), `test_sheets_paste.cjs` y `audit_test.cjs` (auditoría de normalización telefónica y desbordamiento) (`update_sheets_full.cjs:1-35`, `audit_test.cjs:10-25`).
10. **Sitio ya construido.** `dist/` incluye `index.html`, `manifest.json`, `sitemap.xml`, `robots.txt`, `_headers` y `_redirects` (`dist/`), lo que permite servirlo como sitio estático.

## 4. Funcionalidades principales

| # | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| 1 | Catálogo desde Sheets con proxy y respaldo | `src/services/sheets.js:227-286`, `netlify.toml:1-10` | verificado |
| 2 | Textos del sitio editables desde la planilla | `src/services/sheets.js:288-296`, `src/config.js:44-45` | verificado |
| 3 | Medios de Drive resueltos y optimizados | `src/services/drive.js:28-40` | verificado |
| 4 | Filtros por categoría y búsqueda | `src/App.jsx:25-27`, `src/App.jsx:118` | verificado |
| 5 | Ficha de producto con galería, zoom y video | `src/components/ProductDetailModal.jsx`, `GalleryZoomModal.jsx`, `VideoModal.jsx` | verificado |
| 6 | Agenda, encuestas y formulario de contacto | `src/components/BookingModal.jsx`, `SurveyModal.jsx:6-40`, `ContactModal.jsx` | verificado |

## 5. Arquitectura y flujo

```
Google Sheets ──┬─ export CSV (catálogo)  ──┐
                └─ gviz CSV (Configuración) ┤
Google Drive ───── medios (imágenes, video) ┤
                                            ▼
                        /api/catalog · /api/config   (proxy del hosting)
                                            │
                              fetchCatalogData() + fetchSiteConfig()
                                            │
                              normalización y sanitización
                                            │
                                            ▼
                Showroom: hero · categorías · fichas · agenda · formularios
```

Todo el sitio es estático: no hay backend propio ni base de datos.

## 6. Tecnologías verificadas

React 18.2 · Vite 5 · Tailwind CSS 3.4 · PapaParse 5.4 · Lucide React · `puppeteer-core` (operación de la planilla) · Netlify (`netlify.toml`) y Vercel (`vercel.json`) como destinos de despliegue · Google Sheets y Google Drive como fuentes (`package.json`).

## 7. Mi participación

**Afirmable:** el proyecto completo está en la carpeta local, con manual operativo para el cliente, scripts de auditoría propios (`audit_test.cjs`) y scripts de actualización de la planilla (`update_sheets_full.cjs`), que son trabajo de implementación y operación propio.

**No afirmable:** autoría por módulo (sin historial Git) y cualquier cifra de uso.

## 8. Capacidades que merece la pena mostrar

1. **Configuración sin desarrollo:** textos, contacto y catálogo se editan en la planilla (`src/services/sheets.js:288-296`).
2. **Resiliencia de la fuente:** proxy con respaldo tokenizado y sin caché (`src/services/sheets.js:227-286`).
3. **Multidisciplinar en una sola experiencia:** catálogo, fichas, agenda, encuestas y contacto conviven (`src/App.jsx:3-19`).

## 9. Propuesta de ficha JMorgado

- **Título editorial:** «Exo Dream» + acento coral. Bajada: «Un showroom que se reconfigura desde la planilla, no desde el código».
- **Descripción breve:** mantener la aprobada.
- **Desafío:** presentar líneas de trabajo heterogéneas con contenido que cambia seguido.
- **Solución:** frontend configurable con catálogo y textos desde Google Sheets, medios en Drive, proxy de lectura con respaldo y un conjunto de piezas de interfaz (fichas, agenda, encuestas, contacto).
- **Funcionalidades destacadas:** catálogo y textos configurables · fichas con galería, zoom y video · agenda y formularios · operación asistida con scripts propios.
- **Participación:** «Construí el frontend configurable y los servicios de lectura del catálogo».
- **Tecnologías:** React · Vite · Google Sheets · Google Drive · PapaParse · Netlify/Vercel.
- **Demostraciones posibles:** diagrama de flujo de datos; captura del showroom con datos ficticios.
- **Estructura sugerida de módulos `fx-*`:**
  - `hero` — sí, **sin chip de sitio** mientras la URL no esté confirmada (el sistema ya lo permite: `site` vacío omite el chip).
  - `desafio` — sí.
  - `perspectivas` — **sí, un solo diagrama `dataflow`** (Sheets + Drive → proxy → normalización → showroom). Es la mejor forma de contar «configurable».
  - `plataforma` — sí (Configuración / Lectura / Showroom).
  - `participacion` — sí (Frontend / Servicios de lectura / Interfaz).
  - `tech` — sí.
  - `repo` — no: no hay repositorio público.
  - `metrics` — no.
  - `galeria` — sí, con capturas de ejemplo y datos ficticios.
  - `cierre` + `contacto` — sí, CTA único a `/contacto/`.
- **Qué omitir:** el detalle de la ofuscación del fallback (`config.js`) — es una decisión interna, no un valor para el visitante; y los identificadores de las planillas de Google, que no deben publicarse.

## 10. Diagrama Archify recomendado

**Tipo: `dataflow`** (5 etapas). Justificación: el proyecto se define por su cadena de configuración; el `dataflow` muestra el recorrido sin inventar backend.

Etapas y nodos propuestos:

| etapa | id | etiqueta | tipo | evidencia |
|---|---|---|---|---|
| Fuentes | `sheets_catalogo` | Google Sheets · catálogo | external | `src/services/sheets.js:227-253` |
| Fuentes | `sheets_config` | Google Sheets · configuración | external | `src/services/sheets.js:292-296`, `netlify.toml:12-16` |
| Fuentes | `drive` | Google Drive · medios | external | `src/services/drive.js:5-40` |
| Ingesta | `proxy` | Proxy `/api/catalog` y `/api/config` | backend | `netlify.toml:1-16`, `vercel.json:1-15` |
| Proceso | `normalizacion` | Normalización y sanitización | backend | `src/services/sheets.js:22-40` |
| Consumo | `showroom` | Showroom y fichas | frontend | `src/App.jsx:41-60`, `src/App.jsx:118` |
| Consumo | `agenda` | Agenda, encuestas y contacto | frontend | `src/components/BookingModal.jsx`, `SurveyModal.jsx:6-40` |

Flujos: `sheets_catalogo→proxy`, `sheets_config→proxy`, `proxy→normalizacion`, `normalizacion→showroom`, `drive→showroom` (galería y video), `showroom→agenda`. Tarjetas: «Configurar sin código», «Lectura con respaldo», «Una experiencia, varias piezas».

**Segundo diagrama:** no recomendado.

## 11. Información pendiente de confirmar

- **URL pública de producción** (bloqueante para el chip «Ver sitio» y para el portal embebido).
- Existencia de repositorio o forma de compartir el código.
- Derechos sobre logos e imágenes del cliente para uso en el portafolio (`Documentacion/Exo Dream Logo`).
- Confirmación del alcance actual: si las fichas y la agenda siguen activas.

## 12. Fuentes consultadas

`package.json` · `index.html` · `netlify.toml` · `vercel.json` · `src/App.jsx` · `src/config.js` · `src/services/sheets.js` · `src/services/drive.js` · `src/components/*` (índice y revisión de BookingModal, SurveyModal, ContactModal) · `update_sheets_full.cjs` · `test_sheets_paste.cjs` · `audit_test.cjs` · `dist/` (manifiesto y cabeceras) · `Manual_Operativo_Exo_Dream.pdf` (índice).
