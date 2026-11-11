# El Cambiómetro — evidencias

> Fuente: repositorio local `C:\Users\jorge\Proyectos\cambiometro-public` (sólo lectura).
> Revisión auditada: `8fb1fe98af1c2d5862d5d7605bbe43b5c42e3b53` (rama `main`, 2026-09-22 23:09 -0300).
> Remote: `https://github.com/jmorgadodev/cambiometro.git` · Licencia AGPL-3.0.
> Fecha de revisión: 2026-11-10.

## 1. Afirmaciones y respaldo

| # | Afirmación | Respaldo | Qué demuestra | Estado |
|---|---|---|---|---|
| 1 | El proyecto cruza 11 fuentes oficiales del Estado | `README.md:3`, `README.md:13-27` | alcance declarado en el propio repositorio | verificado (corte 2026-09) |
| 2 | Cubre municipios, parlamentarios, servicios públicos y partidos | `README.md:7-10` | cobertura por dominio | verificado (corte 2026-09) |
| 3 | Existe un ETL con conectores por fuente | `scripts/etl.mjs:1-13`, `scripts/etl/connectors/` | ingesta separada por origen | verificado |
| 4 | La validación exige evidencia HTTPS oficial por registro | `scripts/etl/validation.mjs:43-46` | trazabilidad real, no declarativa | verificado |
| 5 | La validación detecta ids duplicados y fechas inválidas | `scripts/etl/validation.mjs:36-51` | control de calidad | verificado |
| 6 | Se conserva el lote anterior ante caída abrupta de volumen | `scripts/etl/validation.mjs:54-59` | control de regresión de ingesta | verificado |
| 7 | Cada publicación lleva checksum SHA-256 | `scripts/etl/validation.mjs:61-68` | integridad verificable | verificado |
| 8 | El pipeline conserva el último bloque válido si una fuente falla | `scripts/etl.mjs:1-13` | continuidad operativa | verificado |
| 9 | Existe un data lake con plan, catálogo y proyecciones | `scripts/etl/lake.mjs:9-27`, `scripts/build-data-lake.mjs:5-46` | capa de datos con catálogo | verificado |
| 10 | La publicación a Cloudflare reintenta y valida checksum y tamaño | `scripts/publish-data-lake.mjs:18-45` | publicación segura | verificado |
| 11 | Los datos se materializan en D1 con dedupe y alias de personas | `scripts/materialize-d1.mjs:9-33` | modelo de entidades | verificado |
| 12 | La API pública expone D1 + R2 con caché y cabeceras de seguridad | `workers/public-api/index.ts:18-51` | API operable | verificado |
| 13 | El sitio se genera como exportación estática a Cloudflare Pages | `package.json` (script `pages:build`, `pages:verify`) | entrega pública | verificado |
| 14 | Hay 479 pruebas automatizadas | `README.md:41`, `package.json:30` | red de seguridad | verificado (corte 2026-09) |
| 15 | Los snapshots son append-only | `README.md:33` | memoria histórica | verificado (regla declarada) |
| 16 | El editorial es un repositorio separado | repo `jmorgadodev/cambiometro-editorial`, revisión `af500681dc79213a4e88493af193d6d3dcd3aca8` | separación de entornos | verificado |
| 17 | Reparto de autoría dentro del equipo | — | no hay bloque de autoría en el repositorio | pendiente |
| 18 | Usuarios, tráfico o ingresos del producto | — | no hay evidencia | no afirmable |

## 2. Comandos ejecutados (sólo lectura)

```powershell
git -C C:\Users\jorge\Proyectos\cambiometro-public rev-parse HEAD
git -C C:\Users\jorge\Proyectos\cambiometro-public remote get-url origin
git -C C:\Users\jorge\Proyectos\cambiometro-public log -1 --format="%H %ci %s"
git -C C:\Users\jorge\Proyectos\cambiometro-public status --short
Get-Content README.md
Get-Content transparencia-app\package.json
Select-String -Path transparencia-app\scripts\etl\validation.mjs -Pattern "export function"
Get-ChildItem transparencia-app\scripts\etl -Recurse -File
Get-ChildItem transparencia-app\workers\public-api -Recurse -File
Get-ChildItem transparencia-app\migrations -File
Get-Content docs\etl-incremental-y-costo-cero.md, docs\datos-abiertos.md (índice)
```

No se ejecutó ningún build, deploy, ETL ni test: el repositorio es ajeno a esta tarea y no debe mutar.

## 3. Extractos mínimos

`transparencia-app/scripts/etl/validation.mjs:43-46`

```
const evidence = sourceUrl(record);
if (typeof evidence !== "string" || !/^https:\/\//i.test(evidence)) {
  fail("ETL_MISSING_SOURCE", `${sourceId}/${id} no tiene una URL HTTPS oficial`);
}
```

`transparencia-app/scripts/etl.mjs:1-6`

```
 * Pipeline build-time de fuentes oficiales.
 * Descarga por rango, valida trazabilidad y conserva el último bloque válido de
 * una fuente cuando ésta falla. No genera datos simulados ni limita registros.
```

`transparencia-app/workers/public-api/index.ts:18-27` (extracto)

```
export interface Env {
  DB?: D1Database;
  TRANSFERS_DB?: D1Database;
  PUBLIC_DATA?: R2Bucket;
  ...
```

## 4. Archivos clave

| Archivo | Propósito |
|---|---|
| `README.md` | alcance, fuentes, reglas de integridad y stack |
| `transparencia-app/scripts/etl.mjs` | orquestador del pipeline de ingesta |
| `transparencia-app/scripts/etl/validation.mjs` | reglas de validación y checksum |
| `transparencia-app/scripts/etl/connectors/` | conectores por fuente oficial |
| `transparencia-app/scripts/etl/lake.mjs` | plan del data lake y particionado |
| `transparencia-app/scripts/build-data-lake.mjs` | construcción del lago y catálogo |
| `transparencia-app/scripts/publish-data-lake.mjs` | publicación verificada en Cloudflare |
| `transparencia-app/scripts/materialize-d1.mjs` | materialización y reconciliación en D1 |
| `transparencia-app/workers/public-api/index.ts` | API pública (Workers) |
| `transparencia-app/migrations/0001…0014` | esquema D1 evolutionado |
| `transparencia-app/docs/etl-*.md`, `datos-abiertos.md` | documentación operativa del pipeline |
| `transparencia-app/docs/auditoria-*.md` | auditorías de integridad y producción |
