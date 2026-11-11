# Revisión de proyectos JMorgado — paquete de investigación

Paquete de **investigación, documentación y preparación** para las fichas de la línea principal del
portafolio. No contiene fichas implementadas: contiene lo que hace falta para construirlas después
de tu aprobación.

Fecha de corte: 2026-11-10 · Archify v3.2.0 · 8 proyectos · 7 diagramas generados y validados.

## 1. Cómo leer este paquete

| Si quieres… | Lee |
|---|---|
| Un panorama rápido de los 8 proyectos | `INFORME-GENERAL.md` |
| La ficha técnica de cada proyecto (qué es, repositorio, estado) | `INVENTARIO-PROYECTOS.md` |
| El procedimiento aplicado y cómo se replica | `METODOLOGIA.md` |
| Cómo se integra cada proyecto en el sistema de fichas `fx-*` | `INTEGRACION-FICHAS.md` |
| Archivos incluidos, límites y pendientes que requieren tu aprobación | `CONTROL-CALIDAD.md` |
| El detalle de un proyecto | `proyectos/<slug>/INFORME.md` + `EVIDENCIAS.md` (+ `VALIDACION.md` si tiene diagrama) |

## 2. Estructura

```
REVISION-PROYECTOS/
├── README.md                     · este documento
├── INFORME-GENERAL.md            · informe consolidado y comparativo
├── INVENTARIO-PROYECTOS.md       · tabla maestra de los 8 proyectos
├── METODOLOGIA.md                · procedimiento aplicado (reutilizable)
├── INTEGRACION-FICHAS.md         · plan de integración con el sistema fx-*
├── CONTROL-CALIDAD.md            · inventario, límites y pendientes
├── proyectos/
│   ├── el-cambiometro/
│   │   ├── INFORME.md            · investigación y propuesta de ficha
│   │   ├── EVIDENCIAS.md         · afirmaciones con archivo:línea
│   │   ├── VALIDACION.md         · resultado de validate / finalize / browser-check
│   │   └── diagramas/            · JSON, HTML, receipts y evidencias de procedencia
│   ├── listoporehoy/
│   ├── ryvolt/                   · sin diagrama (justificado en el informe)
│   ├── flor-de-almendro/
│   ├── exo-dream/
│   ├── hangar354/
│   ├── kokeai/
│   └── rrss/
└── ENTREGA/
    └── ENTREGA-REVISION-PROYECTOS.zip
```

## 3. Los 8 proyectos y su diagrama

| Proyecto | Diagrama | Tipo | Archivo |
|---|---|---|---|
| El Cambiómetro | Sí | `architecture` | `proyectos/el-cambiometro/diagramas/el-cambiometro-arquitectura.html` |
| ListoPorHoy | Sí | `architecture` | `proyectos/listoporhoy/diagramas/listoporhoy-arquitectura.html` |
| Flor de Almendro | Sí | `dataflow` | `proyectos/flor-de-almendro/diagramas/flor-de-almendro-flujo.html` |
| Exo Dream | Sí | `architecture` | `proyectos/exo-dream/diagramas/exo-dream-arquitectura.html` |
| Hangar354 | Sí | `architecture` | `proyectos/hangar354/diagramas/hangar354-arquitectura.html` |
| kokeAI | Sí | `architecture` | `proyectos/kokeai/diagramas/kokeai-arquitectura.html` |
| RRSS | Sí | `workflow` | `proyectos/rrss/diagramas/rrss-recorrido.html` |
| Ryvolt | **No** | — | Justificado en `proyectos/ryvolt/INFORME.md` §10: es una experiencia visual y se explica mejor con capturas |

## 4. Cómo abrir un diagrama

Cada HTML es **autocontenido** (estilos, SVG y scripts dentro del mismo archivo). Basta con abrirlo
en un navegador; no necesita servidor ni build.

Para revisarlos todos de un tirón, hay un servidor local opcional ya levantado en el repositorio:

```
http://127.0.0.1:8090/REVISION-PROYECTOS/
```

(Equivale a `python -m http.server 8090 --bind 127.0.0.1` desde la raíz del repositorio.)

Para verlos con el tema del sitio, hay dos rutas previstas en la integración (aún no implementadas):

- mostrarlos dentro de la ficha con `<iframe>` y sincronizar `data-theme` (patrón de ImpulsaCV), o
- publicarlos como assets del sitio y enlazarlos en la sección `perspectivas`.

Mientras tanto, la revisión visual se puede hacer abriendo el HTML directamente.

## 5. Reglas que se respetaron

- Los repositorios de origen se leyeron **sólo en lectura**. No se ejecutó ningún build, deploy, ETL
  ni script que modifique datos de cliente.
- No se modificó la landing, ni ImpulsaCV, ni ninguna ficha existente, ni la skill Archify.
- No se hizo commit, push ni despliegue.
- No se incluyeron credenciales, tokens, `.env`, datos personales de clientes ni código owner.
- Todo el resultado vive dentro de `REVISION-PROYECTOS/`.

## 6. Estado

Todo el trabajo de esta tanda queda **sin commit**, a la espera de tu revisión.
