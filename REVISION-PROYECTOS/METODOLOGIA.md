# Metodología aplicada en este levantamiento

Procedimiento reutilizable para investigar un proyecto de JMorgado y dejarlo listo para construir su
ficha. Deriva del flujo trabajado con ImpulsaCV
(`Herramientas/archify-lab/impulsacv/INFORME-FLUJO-REUTILIZABLE.md`) y de la metodología de la skill
(`~/.agents/skills/archify/references/repository-authoring.md`).

## 0. Principio rector

> La fuente es la autoridad. El diagrama y el texto explican lo que el código hace; si algo no se
> puede verificar, no se afirma.

Consecuencias prácticas:

- Cada afirmación técnica del informe lleva un respaldo `archivo:líneas`.
- Se distinguen tres estados: **verificado** (está en el código), **inferido** (interpretación
  razonable, señalada como tal) y **pendiente** (no hay evidencia).
- No se usan cifras de negocio, usuarios, tráfico ni resultados si no aparecen en una fuente
  verificable y fechada.

## 1. Fase A — Preparación

1. Localizar el repositorio real del proyecto y **una** revisión concreta con la que trabajar.
2. Registrar: `git rev-parse HEAD`, `git remote get-url origin`, `git status --short`.
   Si no hay remote, se anota «copia local sin remote» y se sigue.
3. Crear la carpeta de trabajo `REVISION-PROYECTOS/proyectos/<slug>/` con `diagramas/`.
4. Verificar la skill: `node bin/archify.mjs doctor` (todo `[ok]` salvo el runtime de `explainer`, que
   no aplica a diagramas nativos).

## 2. Fase B — Investigación

Orden de lectura que funcionó en los ocho casos:

1. `README.md` y documentación de producto (alcance y límites declarados).
2. `package.json` / requisitos (stack real, scripts disponibles).
3. Configuración de despliegue (`firebase.json`, `wrangler.toml`, `netlify.toml`, `vercel.json`).
4. **Entry points**: `src/App.jsx`, `worker/src/index.js`, `public/index.html`, `main.py`.
5. Esquema de datos (migrations, `schema.sql`, `database.rules.json`).
6. Servicios e integraciones (OAuth, APIs, Drive, IA, almacenamiento).
7. Pruebas (`tests/`): son la mejor evidencia de qué se considera comportamiento esperado.

Reglas de lectura:

- Nada de leer el README y basta: en este levantamiento el README de El Cambiómetro describe
 features que sólo se explican con `scripts/etl/validation.mjs`.
- No ejecutar nada que escriba en sistemas externos (Sheets, Drive, redes sociales, Firebase).
- No transcribir datos de cliente (catálogos, credenciales, correos, tokens).

## 3. Fase C — Decidir qué merece un diagrama

Criterio explícito, aplicado a los ocho proyectos:

| Pregunta | Si la respuesta es «sí» | Tipo resultante |
|---|---|---|
| ¿El proyecto tiene una cadena de piezas que un visitante no puede intuir? | diagrama de arquitectura | `architecture` |
| ¿El proyecto **es** un recorrido de datos de origen a destino? | diagrama de flujo de datos | `dataflow` |
| ¿El proyecto es un proceso en el tiempo, sin interfaz? | diagrama de recorrido | `workflow` |
| ¿El proyecto se explica mejor con imágenes que con un esquema? | **sin diagrama** | — |

El caso de Ryvolt es el contrapeso útil: un diagrama de arquitectura de una web de marketing no
informa. Se documenta la decisión y se propone `galeria` en su lugar.

## 4. Fase D — Construir el candidato

1. Escribir el JSON en `diagramas/` con la estructura del tipo elegido
   (`schema_version` 1 para `architecture`/`dataflow`, 2 para `workflow`).
2. Cada nodo declara **una** fuente real: `{ path, line, end_line }` relativo a la raíz del repo.
3. Etiquetas cortas y en español; las tarjetas (`cards`) cuentan la narrativa en tres bloques.
4. Cuando el repositorio **no tiene remote**, Archify exige `meta.repository` si un nodo declara
   `sources`, y no hay una URL honesta que declarar. Decisión tomada en este levantamiento: el JSON
   se entrega **sin** `sources` y la evidencia se conserva en un archivo hermano
   `<diagrama>.evidencias.json`, que documenta nodo por nodo archivo y líneas.

## 5. Fase E — Validar y generar

Comandos verificados (instalación real en `~/.agents/skills/archify`, v3.2.0):

```powershell
# 1. Diagnóstico de la skill
node bin/archify.mjs doctor

# 2. Validación aislada del candidato (no escribe nada)
node bin/archify.mjs validate <tipo> <candidato.json> --repo-root <repo> --quality <showcase|standard> --json

# 3. Generación + entrega + comprobaciones encadenadas
node bin/archify.mjs finalize <tipo> <candidato.json> <salida.html> --repo-root <repo> --quality <showcase|standard> --json
```

`finalize` encadena `validate` → `deliver` → `check` → `browser-check` y devuelve código de salida
distinto de cero si cualquiera falla. Deja cuatro recibos junto al HTML: `.finalize.json`,
`.finalize-summary.json`, `.browser-check.json` y `.delivery.json`.

### Perfil de calidad: cuándo `showcase` y cuándo `standard`

| Diagrama | Perfil | Motivo |
|---|---|---|
| El Cambiómetro, ListoPorHoy, Hangar354, kokeAI, Exo Dream | `showcase` | Arquitectura con 6–8 piezas; pasa todas las comprobaciones de corridor y legibilidad |
| RRSS | `showcase` | Recorrido de 5 columnas, sin conflicto de corredores |
| Flor de Almendro | `standard` | El perfil `showcase` rechaza el corredor compartido que produce un flujo de cinco etapas con dos fuentes en paralelo. Con `standard` el diagrama es válido y legible |

### Errores reales encontrados y cómo se corrigieron

| Error | Causa | Corrección |
|---|---|---|
| `Component X is not wrapped by boundary but sits inside its frame` | El marco de la frontera cubría componentes ajenos | Reubicar componentes y reducir las fronteras a un grupo compacto |
| `endpoint-side-direction` | `fromSide`/`toSide` declarados sin segmentos perpendiculares coherentes | Quitar los lados explícitos y dejar el enrutado automático |
| `edge-through-node` | Una arista manual cruzaba un nodo | Quitar el `via` manual y recalcular la posición de los nodos |
| `Repository evidence requires /meta/repository` | Nodos con `sources` en repos sin remote | Extraer la evidencia a `<diagrama>.evidencias.json` |
| `Label is wider than component` | Etiqueta más larga que el ancho por defecto del nodo | Fijar `width` en el nodo |
| `Data-flow layout validation failed` (corredores compartidos) | Dos flujos paralelos con el mismo canal | Bajar a `--quality standard` para ese diagrama |
| `/nodes/6/col must be <= 5` | El recorrido `workflow` admite un máximo de 5 columnas | Reducir a 5 columnas fusionando «pieza final» con «publicación» |

## 6. Fase F — Revisión

1. `finalize` ejecuta `browser-check`: carga el HTML en un navegador real y falla si hay error de
   consola. Es la revisión automática mínima.
2. Revisión visual manual pendiente para esta entrega (ver `CONTROL-CALIDAD.md`).
3. Los recibos JSON se conservan como evidencia auditable.

## 7. Fase G — Entrega e integración

1. Copiar el HTML al proyecto (`assets/<slug>-archify-<tipo>.html` cuando se implemente la ficha).
2. Enlazar con `<iframe>` y sincronizar el tema con el patrón de ImpulsaCV
   (`assets/project-impulsacv.js`): `data-jm-theme` → `data-theme` (`day`→`light`, `night`→`dark`).
3. Ocultar los controles heredados de Archify (presentación, presets y tema propio) por CSS, igual
   que se hizo en ImpulsaCV.
4. Carga diferida: el segundo diagrama se monta sólo al pulsar su pestaña.

## 8. Checklist para un próximo levantamiento

- [ ] Repositorio localizado, revisión registrada, `git status` anotado.
- [ ] `doctor` de Archify ejecutado.
- [ ] README, documentación, entry points, esquema de datos, integraciones y pruebas leídos.
- [ ] Afirmaciones clave anotadas con `archivo:líneas`.
- [ ] Decisión de diagrama tomada y justificada (incluida la opción de no hacer diagrama).
- [ ] JSON candidato escrito con etiquetas en español y fuentes reales.
- [ ] `validate` OK.
- [ ] `finalize` OK (validate + deliver + check + browser-check).
- [ ] HTML revisado visualmente en modo día y noche.
- [ ] `INFORME.md` y `EVIDENCIAS.md` escritos por proyecto.
- [ ] Riesgos de seguridad y pendientes de confirmación listados.
- [ ] Nada de commit, push ni despliegue sin autorización.
