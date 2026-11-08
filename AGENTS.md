# AGENTS — JMorgado

Este archivo es la puerta de entrada obligatoria para cualquier agente que trabaje en este repositorio.

## Lectura obligatoria y orden de prioridad

1. docs/CONTEXTO_MAESTRO_JMORGADO.md — visión, marca, canon narrativo, piezas y límites de verdad.
2. docs/PLAN_MEJORA_ESCENAS_INICIO_JMORGADO.md — plan operativo vigente y fases autorizadas para el inicio.
3. docs/ENCARGO_AGENTE_IDENTIDAD_INTERIOR_JMORGADO.md — alcance exclusivo del agente paralelo.
4. README.md, build_site.py, site_data.py y manifiestos SVG de las secciones que vaya a editar.
5. Respaldo editorial de referencia: Herramientas/respaldo_textos_originales_verificados_20261107.
6. qa_smoke.py — valida que el texto del inicio no haya sido alterado.

No confundir documentos históricos con instrucciones actuales: BRIEF_REPLICACION_EL_VIAJE.md, docs/METODOLOGIA_PENDIENTE.md y docs/historico/REFERENTES_Y_DIRECCION_EDITORIAL.md están marcados como material rechazado o pospuesto.

## PROTECCIÓN OBLIGATORIA DE LA INTRODUCCIÓN

- Propiedad: Jorge y el asistente asignado al inicio.
- La base de escenas, coreografías y transiciones trabajada previamente está validada por Jorge y es la versión oficial de continuidad. No reiniciarla ni reconstruirla.
- El asistente asignado al inicio está autorizado a ejecutar únicamente los refinamientos del plan docs/PLAN_MEJORA_ESCENAS_INICIO_JMORGADO.md, fase por fase y con validación de Jorge.
- Otro agente: no modificar journey_study.py, assets/journey-study.js, assets/journey-study.css, journey_markup() ni el inicio generado de index.html.
- Los siete títulos y sus descripciones se conservan EXACTOS, como en el documento maestro y las pruebas.
- La palabra CRECER de partículas **se conserva**; jamás duplicarla tipográficamente detrás ni sustituirla.
- El último titular es **«Todo comienza con una idea.»**, SIN subtítulo.
- Texto vertical en la segunda escena: rechazado. No reintroducirlo.
- No alterar inicio para acomodar un recurso gráfico. Adaptar el gráfico, no el canon.
- Evitar tocar reglas globales que modifiquen .tech-study, .study-copy y sus descendientes; si se toca CSS compartido, QA visual completo.

## Trabajo simultáneo sin pérdidas

- Revisar git status/diff antes de editar: hay múltiples archivos con cambios de trabajo previo.
- No git reset, checkout masivo, eliminación de respaldos, ni sobrescritura de archivos editados por otro agente.
- Cambios mínimos y por sección; crear respaldo antes y reportar todo lo tocado. Excepción para la introducción: Jorge declaró la versión actual como oficial y pidió no generar respaldos rutinarios nuevos; no eliminar respaldos históricos.
- No publicar, hacer commit/push ni ejecutar despliegue sin autorización.
- python publish_site.py genera _site/; no editar salida construida como fuente.
- QA: python qa_smoke.py, node qa_tetris.cjs, git diff --check y capturas responsive en ambos temas.
- Para agentes distintos del propietario del intro: si una propuesta requiere modificarlo, dejarla escrita y **no ejecutarla**. El propietario actual puede ejecutar sólo los refinamientos autorizados en el plan vigente, sin reabrir decisiones aprobadas.

La meta es identidad y continuidad del trabajo ya avanzado; no reinterpretación, reemplazo o retroceso.
