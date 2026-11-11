# El Cambiómetro — informe de investigación

> Fase de investigación y preparación. Este documento **no** implementa la ficha: describe lo que el proyecto hace, con evidencia en el repositorio, y propone cómo contarlo en JMorgado.

## 1. Ficha de identidad

| Dato | Valor | Estado |
|---|---|---|
| Nombre público | El Cambiómetro | verificado |
| Categoría JMorgado | Datos e información · Ingeniería de datos | aprobado en el sitio |
| Tipo de proyecto | Plataforma de datos públicos de Chile | verificado (`README.md:1-3`) |
| URL pública | https://cambiometro.impulsacv.cl | declarada en `site_data.py` |
| Repositorio | https://github.com/jmorgadodev/cambiometro | verificado (`git remote get-url origin`) |
| Revisión auditada | `8fb1fe98af1c2d5862d5d7605bbe43b5c42e3b53` (rama `main`, 2026-09-22) | verificado |
| Ruta local auditada | `C:\Users\jorge\Proyectos\cambiometro-public` | sólo lectura |
| Licencia | AGPL-3.0 (`README.md:44`) | verificado |
| Fecha de revisión | 2026-11-10 | — |

> La carpeta local tiene 2 archivos modificados sin commitizar (`transparencia-app/app/page.tsx` y `transparencia-app/components/home/Hero.tsx`). Las afirmaciones de este informe se apoyan en el código visible; la revisión citada es el HEAD del repositorio.

## 2. Qué problema resuelve

La información pública de Chile está dispersa: cada organismo publica con su propio formato, su propio calendario y su propia forma de nombrar a las personas y las entidades. Consultar cuánto gastó un municipio, cómo votó un diputado o quién aparece en el lobby y en una compra pública exige unir fuentes que hoy nadie reúne por defecto.

El proyecto se posiciona como esa capa de unión: **extraer, normalizar, validar y cruzar** datos oficiales, conservando siempre la evidencia de origen (`README.md:3-11`, `transparencia-app/scripts/etl/validation.mjs:43-46`).

## 3. Qué se desarrolló realmente

Verificado en el código, no inferido:

1. **Conectores de ingesta por fuente oficial.** El ETL está organizado como un pipeline de build-time con conectores por fuente: Congreso/Senado (`scripts/etl/connectors/senado.mjs`), InfoLobby/InfoProbidad (`scripts/etl/connectors/cplt.mjs`), ChileCompra, SINIM, SERVEL, Contraloría, DIPRES, entre otros (`scripts/etl/`, `scripts/build-*-v1.mjs`).
2. **Validación con reglas duras.** `validatePublication()` exige identificador único por registro, URL HTTPS de fuente oficial, fecha con formato ISO,Umbral mínimo de registros y un ratio de retención frente al lote anterior; además calcula un checksum SHA-256 del lote (`scripts/etl/validation.mjs:25-69`). La variante `validatePublicationStream()` hace lo mismo sin cargar el lote completo en memoria, para fuentes de varios GB (`scripts/etl/validation.mjs:71-80`).
3. **Continuidad cuando una fuente falla.** El orquestador declara que «conserva el último bloque válido de una fuente cuando ésta falla» y que no genera datos simulados (`scripts/etl.mjs:1-13`).
4. **Data lake con catálogo y proyecciones.** `buildLakePlan()` define el plan del lago; `build-data-lake.mjs` lee el snapshot de ingesta, aplica el plan y conserva catálogos y proyecciones previas (`scripts/etl/lake.mjs:9-27`, `scripts/build-data-lake.mjs:5-46`).
5. **Publicación verificada en R2.** `publish-data-lake.mjs` publica contra Cloudflare con reintentos y valida tamaño y checksum de cada asset antes de dar por buena la publicación (`scripts/publish-data-lake.mjs:18-45`).
6. **Materialización en D1.** `materialize-d1.mjs` puebla la base con el lago, resuelve alias de personas, deduplica por fuente y permite materialización incremental (`scripts/materialize-d1.mjs:9-33`).
7. **API pública en Workers.** `workers/public-api/index.ts` expone el env con D1, una base dedicada de transferencias y R2, con caché y cabeceras de seguridad (`workers/public-api/index.ts:18-51`).
8. **Sitio estático y páginas de detalle.** Next.js con exportación estática a Cloudflare Pages; el build incluye pasos de verificación de SEO, artefactos generados y redirects (`package.json`, scripts `pages:build` / `pages:verify`).
9. **Reglas de integridad declaradas.** Sanity global (agregado = suma de partes), jerarquía de fuentes, append-only de snapshots y coherencia matemática (`README.md:29-35`).
10. **Control operativo.** Suite de 479 pruebas (typecheck + vitest) y verificaciones propias: `check:etl-freshness`, `check:production-gates`, `verify:cold-crawl`, `verify:prod:double`, `check:static-architecture` (`package.json:5-45`, `README.md:41`).

**El sistema editorial de contenidos es un repositorio separado** (`https://github.com/jmorgadodev/cambiometro-editorial`, revisión `af500681dc79213a4e88493af193d6d3dcd3aca8`). No es parte del pipeline de datos; conviene mantener esa separación en la narrativa.

## 4. Funcionalidades principales

| # | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| 1 | Ingesta de 11 fuentes oficiales del Estado | `README.md:13-27`, `scripts/etl/` | verificado |
| 2 | Normalización y data lake con catálogo y snapshots | `scripts/build-data-lake.mjs:5-46`, `scripts/etl/lake.mjs` | verificado |
| 3 | Validación de publicación con checksum y trazabilidad | `scripts/etl/validation.mjs:25-69` | verificado |
| 4 | Cruces de datos (lobby + ventas, puerta giratoria, nepotismo) | `README.md:11`, rutas `/cruces`, `/personas` | verificado en código y UI |
| 5 | API pública con caché y materialización D1 | `workers/public-api/index.ts:18-51`, `scripts/materialize-d1.mjs` | verificado |
| 6 | Visualización y fichas de personas, municipios, partidos | rutas `/municipalidades`, `/politico`, `/rankings`, `/cruces` | verificado |

Cobertura declarada en el README (corte histórico, 2026-09): 346 municipalidades, 205 parlamentarios, 538 servicios públicos, 18 partidos (`README.md:7-10`). **Son cifras del repositorio en esa revisión, no métricas de hoy.**

## 5. Arquitectura y flujo

```
Fuentes oficiales (11)
        │  descarga por rango, connectors
        ▼
ETL + validación (ids, HTTPS oficial, fechas, retención, sha256)
        │
        ▼
Data lake en R2 (catálogo v1, proyecciones por fuente, snapshots append-only)
        │
        ├──► materialización D1 (entidades, alias de personas, relaciones)
        │             │
        │             ▼
        │        API pública (Workers) ──► consumidores / integradores
        ▼
Sitio estático Next.js → Cloudflare Pages (fichas, cruces, rankings)
```

Dos consumidores finales conviven: el sitio público (exportación estática, sirve para buscadores y clientes) y la API (consulta programable). El editorial es un tercer sistema, deliberadamente separado.

## 6. Tecnologías verificadas

- Next.js + React (exportación estática a Cloudflare Pages) — `package.json`, `next.config.ts`
- Cloudflare Workers (API pública) — `workers/public-api/index.ts`
- Cloudflare R2 (data lake y assets) — `scripts/publish-data-lake.mjs`, `workers/public-api/index.ts:21`
- Cloudflare D1 (consulta indexada) — `scripts/materialize-d1.mjs`, migraciones `0001`–`0014`
- Node.js para ETL y scripts; Python puntual para extracción PDF (`scripts/etl/extract_cgr_pdf.py`)
- Vitest + typecheck como verificación (`package.json:30`)

## 7. Mi participación

**Afirmable con evidencia:** el repositorio es la implementación del proyecto y su historia de commits es continua en `jmorgadodev/cambiometro`; el código cubre desde los conectores hasta la API y el sitio.

**No afirmable con la evidencia disponible:** el reparto de tareas dentro del equipo, la participación de terceros y la autoría de cada archivo. La documentación del repositorio no incluye un bloque de autoría por persona. En la ficha se debe mantener la primera persona sobre lo verificable: «construí la ingesta, los controles de calidad y el flujo de consulta» (texto ya aprobado en el sitio).

**Pendiente:** si existe documentación de equipo o commits con autoría compartida en otro repositorio, conviene incorporarla antes de publicar.

## 8. Capacidades que merece la pena mostrar

1. **Ingesta con evidencia:** cada registro conserva su fuente oficial verificable; el pipeline falla si un lote no la tiene (`scripts/etl/validation.mjs:43-46`).
2. **Memoria histórica:** snapshots append-only, nunca sobrescritos (`README.md:33`).
3. **Continuidad operativa:** si una fuente falla, se conserva el último bloque válido y el build no se rompe (`scripts/etl.mjs:1-13`).

## 9. Propuesta de ficha JMorgado

- **Título editorial:** «El Cambiómetro» + acento coral. Subtítulo opcional: «Datos públicos del Estado, unidos y verificados».
- **Descripción breve:** mantener la aprobada: «De fuentes públicas dispersas a datos consultables: ingesta, validación, trazabilidad, API y visualización.»
- **Desafío:** fuentes públicas dispersas, con formatos y cortes distintos; consultar y comparar exige depuración manual.
- **Solución:** procesos de ingesta y ETL con validación de trazabilidad, data lake con snapshots, API pública y visualizaciones; el editorial vive en un sistema aparte.
- **Funcionalidades destacadas:** ingesta multipuente · validación con checksum y evidencia · cruces entre fuentes · API y fichas de consulta.
- **Participación:** «Construí la ingesta, los controles de calidad y el flujo de consulta» + «separé ingesta, validación y consulta porque las fuentes publican con formatos y cortes distintos».
- **Tecnologías:** ETL · Python/Node · fuentes públicas · Cloudflare R2 + D1 + Workers · APIs · Dashboards.
- **Demostraciones posibles:** diagrama interactivo del pipeline; captura de un cruce lobby ↔ compras; ficha de persona con historial; la landing pública a través del portal embebido (ya existe `PROJECT_PORTAL_PAGES["el-cambiometro"]`).
- **Estructura sugerida de módulos `fx-*`:**
  - `hero` (con chip «Ver sitio») — sí.
  - `desafio` — sí (variante `fx-section--alt`).
  - `perspectivas` — **sí, con un solo diagrama** (pipeline de datos). Si se agrega un segundo iframe, reutilizar exactamente el patrón de ImpulsaCV (tabs + carga diferida).
  - `plataforma` — sí, renombrado conceptualmente a «Cómo funciona la plataforma» con 3 pasos (ingesta, validación y lake, API y visualización).
  - `participacion` — sí, tres puntos (Ingesta / Validación / Consulta).
  - `tech` — sí, chips de stack.
  - `repo` — sí: el repositorio es público y AGPL (`README.md:44`), lo que refuerza la trazabilidad del trabajo.
  - `metrics` — **con cautela**: sólo con cifras del README fechadas («11 fuentes», «346 municipalidades», «479 pruebas») y etiquetadas como corte de la revisión auditada. Sin cifras de usuarios o tráfico.
  - `galeria` — opcional: capturas de fichas y rankings, si existen capturas aprobadas.
  - `cierre` — sí («El siguiente paso»), antes del bloque de contacto.
  - `contacto` — sí, CTA único a `/contacto/`.
- **Qué omitir:** el sistema editorial (entorno separado; mezclarlo confunde), el detalle deDeploy y los artefactos de CI, y las métricas no fechadas.

## 10. Diagrama Archify recomendado

**Tipo: `architecture`** (un lienzo, 7 nodos). Justificación: el valor para un visitante está en ver que existe una cadena verificable desde la fuente oficial hasta la consulta; un `dataflow` exigiría Grafo de datos que el proyecto no documenta como tal, y un `workflow` de usuario no aplica (el público no «usa» un flujo, consulta resultados).

Nodos propuestos:

| id | etiqueta | tipo | evidencia |
|---|---|---|---|
| `fuentes` | Fuentes oficiales (11) | external | `README.md:13-27` |
| `etl` | ETL y conectores | backend | `scripts/etl.mjs:1-13`, `scripts/etl/connectors/` |
| `validacion` | Validación y trazabilidad | security | `scripts/etl/validation.mjs:25-69` |
| `lake` | Data lake en R2 | database | `scripts/build-data-lake.mjs:5-46`, `scripts/publish-data-lake.mjs` |
| `d1` | D1 (consulta indexada) | database | `scripts/materialize-d1.mjs:19-33` |
| `api` | API pública (Workers) | backend | `workers/public-api/index.ts:18-51` |
| `sitio` | Sitio estático (Pages) | frontend | `package.json` (`pages:build`) |

Conexiones: `fuentes→etl` (descarga por rango), `etl→validacion` (checksum y evidencia), `validacion→lake` (publicación verificada), `lake→d1` (materialización), `d1→api` (consulta), `lake→sitio` (exportación estática), `api→sitio`/visitantes (lectura). El editorial **no** entra en el lienzo: es un sistema separado.

**Segundo diagrama:** no recomendado. El cruce de datos puede mostrarse con capturas reales, no con un diagrama.

## 11. Información pendiente de confirmar

- Reparto de autoría dentro del equipo (no está en el repositorio).
- Vigencia actual de las cifras del README (son de 2026-09).
- Disponibilidad de capturas aprobadas de la interfaz para `galeria`.
- Si la API pública tiene Consumidores externos documentados (permite hablar de «API» con nombre propio).

## 12. Fuentes consultadas

`README.md` · `package.json` · `next.config.ts` · `scripts/etl.mjs` · `scripts/etl/validation.mjs` · `scripts/etl/lake.mjs` · `scripts/etl/history.mjs` · `scripts/build-data-lake.mjs` · `scripts/publish-data-lake.mjs` · `scripts/materialize-d1.mjs` · `workers/public-api/index.ts` · `migrations/0001…0014` · `docs/etl-*.md` · `docs/datos-abiertos.md` · `docs/auditoria-*.md` · repositorio `jmorgadodev/cambiometro-editorial` (sólo identificación).
