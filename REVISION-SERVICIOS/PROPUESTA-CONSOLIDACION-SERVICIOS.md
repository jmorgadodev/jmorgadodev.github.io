# Propuesta de consolidación — Sección Servicios

**JMorgado · Propuesta editorial, comercial, SEO y visual de `/servicios/`**

Fecha: 2026-11-10 · Etapa de **propuesta**. No se modificó HTML, CSS, JavaScript, Python, textos publicados, URLs ni SEO. Sin commit, sin push, sin despliegue.

Documento de referencia: `REVISION-SERVICIOS/INFORME-CONTENIDO-SERVICIOS.md` (auditoría del estado actual).

Todo el texto de las secciones 3 y 4 es **copy nuevo, redactado para publicar**, no una descripción de lo que hay que cambiar. Las rutas propuestas son las actuales y no se modifican.

---

## Índice

1. [Resumen de la propuesta](#1-resumen-de-la-propuesta)
2. [Arquitectura editorial propuesta](#2-arquitectura-editorial-propuesta)
3. [Propuesta de texto — índice `/servicios/`](#3-propuesta-de-texto--índice-servicios)
4. [Propuesta de texto — las siete fichas](#4-propuesta-de-texto--las-siete-fichas)
5. [Títulos SEO y meta descriptions propuestos](#5-títulos-seo-y-meta-descriptions-propuestos)
6. [Entregables y tecnologías por área](#6-entregables-y-tecnologías-por-área)
7. [Proyectos relacionados y herramientas propias](#7-proyectos-relacionados-y-herramientas-propias)
8. [Propuesta de CTA por página](#8-propuesta-de-cta-por-página)
9. [Propuesta de ajustes visuales](#9-propuesta-de-ajustes-visuales)
10. [Mejoras de navegación](#10-mejoras-de-navegación)
11. [Correcciones SEO](#11-correcciones-seo)
12. [Información pendiente de verificar](#12-información-pendiente-de-verificar)
13. [Comparación entre el contenido actual y el propuesto](#13-comparación-entre-el-contenido-actual-y-el-propuesto)
14. [Decisiones que requieren aprobación](#14-decisiones-que-requieren-aprobación)

---

## 1. Resumen de la propuesta

La sección no cambia de arquitectura ni de URLs. Cambia **qué dice cada ficha** y **en qué orden**.

**Los cinco ejes de la propuesta:**

1. **Cada ficha empieza por el problema del visitante, no por la tecnología.** El bloque «Qué situación abordo» pasa a llamarse «Qué problema resuelvo», y el encabezado del primer bloque «Qué situación abordo.» pasa a ser la pregunta que el área responde.
2. **Los entregables dejan de ser una lista de palabras.** Cada entregable se publica con una línea que explica qué recibe el cliente, en un bloque propio titled «Qué entrego, en concreto».
3. **La evidencia se separa en dos grupos explícitos**: «Proyectos realizados» (trabajos para necesidades concretas) y «Herramientas propias» (software abierto que forma parte del catálogo). AuditaPC deja de aparecer como si fuera un proyecto de cliente.
4. **Cada ficha cierra con su propia llamada a la acción**, ligada a la necesidad que resuelve, manteniendo la frase «la primera conversación es gratuita» y la aclaración de que la auditoría técnica se acuerda por separado.
5. **El índice describe la oferta completa** y cada una de las siete filas tiene una frase comercial diferenciada, no una etiqueta.

**Lo que no cambia:** las siete áreas y su orden, las ocho URLs, la identidad visual (crema, noche, coral, petróleo, tipografía, overlines, rails, iconografía de línea), la estructura de cuatro bloques de las fichas estándar y el componente de cierre en coral. La ficha de Gestión de redes sociales conserva su personalidad visual propia, pero adopta el mismo guion de cuatro bloques para que sea comparable con las demás.

---

## 2. Arquitectura editorial propuesta

### 2.1 Las siete áreas y sus URLs (sin cambios)

| # | URL | Nombre público actual | Nombre público propuesto |
|---|---|---|---|
| 01 | `/servicios/automatizacion/` | Automatización de procesos | Automatización de procesos |
| 02 | `/servicios/desarrollo-web/` | Desarrollo web y plataformas | Desarrollo web y plataformas |
| 03 | `/servicios/datos-y-bi/` | Datos, planillas y BI | Datos, planillas y BI |
| 04 | `/servicios/integraciones/` | Integraciones y APIs | Integraciones y APIs |
| 05 | `/servicios/ia-aplicada/` | IA aplicada con criterio | IA aplicada con criterio |
| 06 | `/servicios/soporte-ti/` | Soporte técnico independiente | Soporte técnico **(cambia)** |
| 07 | `/servicios/redes-sociales/` | Gestión de redes sociales | Gestión de redes sociales |

Los bots y asistentes automatizados **no son un área nueva**: entran como entregables de Automatización de procesos, con una línea explícita que los distingue de la atención comercial automatizada con bots y de la gestión editorial de redes sociales.

### 2.2 Estructura común de las siete fichas

```
HERO
  migas  ·  eyebrow  ·  H1  ·  lead (una idea)  ·  línea de estado

01 · QUÉ PROBLEMA RESUELVO
  columna izquierda              columna lateral (ficha rápida)
    H2 «Qué problema resuelvo.»   «En una línea» + resumen
    párrafo (situación)            «Con qué lo construyo» + chips
    H3 «Cómo lo abordo»             nota de alcance
    párrafo (enfoque)

02 · QUÉ ENTREGO
  entregables numerados, cada uno con una línea de explicación

03 · QUÉ EXPERIENCIA RESPALDA
  «Proyectos realizados»  +  «Herramientas propias»

04 · CIERRE
  panel coral  ·  pregunta propia del área  ·  frase «la primera conversación es gratuita»
  botón propio del área  →  /contacto/

pie del sitio (sin cambios)
```

### 2.3 Qué cambia respecto de la estructura actual

| Aspecto | Hoy | Propuesto |
|---|---|---|
| Bloque 01 | «Qué situación abordo.» + «Cómo decido la solución» | «Qué problema resuelvo.» + «Cómo lo abordo» |
| Lateral | Entregables como lista de palabras + tecnologías | Ficha rápida: «En una línea» + tecnologías |
| Entregables | Dentro del lateral, sin explicar | Bloque propio «Qué entrego, en concreto», con una línea por entregable |
| Bloque 02 | «Experiencia demostrada», lista de trabajos | «Qué experiencia respalda», en dos grupos: proyectos y herramientas |
| Bloque 03 | Panel coral con el mismo texto en las seis fichas | Panel coral con pregunta y botón propios del área |
| Redes sociales | Plantilla aparte, tres bloques | Misma estructura de cuatro bloques, conservando su hero y su rail de color |
| Índice | Lead que nombra cinco áreas de siete | Lead que nombra las siete + filas con frase comercial |

---

## 3. Propuesta de texto — índice `/servicios/`

**Eyebrow**

> Soluciones según tu necesidad

**H1** (sin cambios)

> En qué puedo ayudarte.

**Lead**

> Hay tareas que se repiten, sistemas que no se hablan entre sí y datos que nadie mira a tiempo. Trabajo en siete áreas para resolver eso: automatización de procesos, desarrollo web y plataformas, datos y BI, integraciones, IA aplicada, soporte técnico y gestión de redes sociales. Cada ficha explica qué entrego y qué trabajos respaldan esa capacidad.

**Las siete filas**

| # | Área | Frase propuesta |
|---|---|---|
| 01 | Automatización de procesos | Convierto tareas que se repiten en procesos que corren solos: datos, avisos, reservas y atención. |
| 02 | Desarrollo web y plataformas | Sitios, catálogos, paneles y plataformas con usuarios y lógica propia, diseñados para la operación que sostienen. |
| 03 | Datos, planillas y BI | Convierto datos dispersos en indicadores que se pueden mirar, comparar y usar para decidir. |
| 04 | Integraciones y APIs | Hago que tus sistemas se comuniquen y dejen de depender de copiar y pegar a mano. |
| 05 | IA aplicada con criterio | Uso modelos de IA donde aportan valor real, con revisión humana y sin prometer más de lo que hacen. |
| 06 | Soporte técnico | Diagnóstico y puesta en marcha de equipos y software, en el lugar o a distancia, con hallazgos documentados. |
| 07 | Gestión de redes sociales | Planifico, preparo y publico contenido con un calendario que puedes sostener. |

**Bloque de cierre** (sin cambios)

> **La conversación inicial no tiene costo.**
>
> Es una orientación para conocer la tarea y sus restricciones. Una auditoría o intervención técnica se acuerda por separado.
>
> [ Conocer el método ] → `/metodo/`

**Nota de separación** (nueva, una línea bajo las filas)

> La automatización de consultas y atención comercial con bots es una capacidad dentro de Automatización de procesos. La gestión de redes sociales es editorial: planificación, producción y publicación de contenido.

---

## 4. Propuesta de texto — las siete fichas

### 4.1 Automatización de procesos

`/servicios/automatizacion/`

**Hero**

- Eyebrow: Soluciones a medida
- H1: **Automatización de procesos.**
- Lead: Cuando la misma tarea pasa por planillas, correos y aplicaciones, el tiempo se va en copiar, pegar y revisar. Automatizo ese tramo para que el proceso siga solo y tú controles cuándo, con qué y con quién.
- Línea de estado: `Evaluación caso a caso` · `Primer diagnóstico conversado: gratuito`

**01 · Qué problema resuelvo**

- H2: **Qué problema resuelvo.**
- Párrafo: Copiar registros, validar datos, transferir información y preparar reportes de forma repetitiva consume horas y multiplica el riesgo de error. Cuando además hay que atender consultas o gestionar reservas, el cuello de botella aparece en el mismo lugar: alguien haciendo de puente entre sistemas.
- H3: **Cómo lo abordo**
- Párrafo: Primero entiendo el proceso, su frecuencia, quién lo ejecuta y qué excepciones aparecen. Después evalío, según el costo de mantenimiento y las condiciones del cliente, desde Power Query y Apps Script hasta n8n, Make, Python o un bot propio. Si un paso necesita que una persona resuelva algo, el flujo lo deriva; si no, lo resuelve solo.

**Lateral — ficha rápida**

- «En una línea»: Un proceso que se ejecuta solo, con reglas claras, avisos cuando corresponde y documentación de cómo operarlo.
- «Con qué lo construyo»: Python, n8n / Make, Apps Script, Excel / Power Query, APIs
- Nota: *La selección final depende del problema; no todas las herramientas se usan en todos los encargos.*

**02 · Qué entrego**

- H2: **Qué entrego, en concreto.**
- Bajada: *No entrego un listado de herramientas, sino un resultado que se puede usar. Cada punto es un entregable que puedes revisar y aceptar por separado.*

1. **Automatización de tareas repetitivas** — Procesos entre planillas, correo y herramientas que hoy se hacen a mano.
2. **Bots y asistentes automatizados** — Consultas frecuentes, atención comercial y derivación a una persona cuando corresponde.
3. **Sistemas de reservas** — Disponibilidad, confirmación y aviso, con registro de cada operación.
4. **Procesamiento y validación de datos** — Control de errores y excepciones antes de que lleguen al destino.
5. **Flujos de trabajo entre plataformas** — Cuando el dato tiene que pasar de un sistema a otro sin intervención.
6. **Notificaciones y recordatorios** — Avisos en el canal que corresponde, con seguimiento de lo que quedó pendiente.
7. **Documentación de operación** — Cómo funciona el proceso y qué hacer cuando algo se detiene.

**03 · Qué experiencia respalda**

*Proyectos realizados*

- **RRSS** (/proyectos/kooke-rrss/) — Coordinación de calendario, historial, generación asistida y composición programática de contenidos con Sheets, Apps Script y Python.
- **ListoPorHoy** (/proyectos/conecta/) — Plataforma con calendario, borradores, marcas, medios y conexiones por API desde un mismo entorno.

*Herramientas propias*

- **Nokto** (/herramientas/#nokto) — Consola de escritorio con automatización de rutinas por bloques y disparadores, ejecutadas en local.
- **AuditaPC** (/herramientas/#auditapc) — Herramienta propia para levantamiento técnico e informes, que sirvió de base al área de soporte.

**04 · Cierre**

- Eyebrow: `Contacto`
- H2: **¿Cuánto tiempo se te va en tareas que se repiten?**
- Párrafo: Cuéntame qué se repite hoy y en qué parte se atasca. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.
- Botón: **[ Revisar mi proceso ]** → `/contacto/`

---

## 4. Propuesta de texto — las siete fichas

### 4.2 Desarrollo web y plataformas

`/servicios/desarrollo-web/`

**Hero**

- Eyebrow: Soluciones a medida
- H1: **Desarrollo web y plataformas.**
- Lead: Construyo sitios, catálogos, paneles y plataformas según la operación que tienen que sostener: no todos los problemas necesitan una aplicación completa, y la arquitectura se decide antes de elegir la tecnología.
- Línea de estado: `Evaluación caso a caso` · `Primer diagnóstico conversado: gratuito`

**01 · Qué problema resuelvo**

- H2: **Qué problema resuelvo.**
- Párrafo: Una presencia digital no resuelve por sí sola un proceso. A veces hace falta conectar datos, crear permisos o integrar una operación que hoy se realiza a mano, y aún así un catálogo o un sitio bien hecho se queda corto.
- H3: **Cómo lo abordo**
- Párrafo: Defino objetivos, usuarios y flujos antes de elegir el stack. Arquitectura, frontend, backend, datos e interacción se justifican por lo que la solución debe hacer, no por la moda del momento. Si un sitio administrable cumple el objetivo, no construyo una plataforma que nadie va a mantener.

**Lateral — ficha rápida**

- «En una línea»: Un sistema web que se sostiene en el tiempo, con lo que el negocio necesita operar y nada más.
- «Con qué lo construyo»: React / Vite, TypeScript, Hono / Workers, Firebase, Cloudflare D1
- Nota: *La selección final depende del problema; no todas las herramientas se usan en todos los encargos.*

**02 · Qué entrego**

- H2: **Qué entrego, en concreto.**
- Bajada: *No entrego un listado de herramientas, sino un resultado que se puede usar. Cada punto es un entregable que puedes revisar y aceptar por separado.*

1. **Sitios corporativos y comerciales** — Presencia clara de la marca, con contenidos que se pueden mantener sin depender del desarrollo.
2. **Catálogos administrables** — Productos, categorías, stock y consultas conectados a la fuente de información que ya usas.
3. **Aplicaciones web** — Herramientas internas con formularios, flujos y estados propios del proceso.
4. **Paneles de administración** — Control y seguimiento de la operación para quien la ejecuta, no sólo para quien la desarrolla.
5. **Plataformas con usuarios y lógica propia** — Cuentas, permisos, suscripciones o pagos cuando el caso lo exige.
6. **Sistemas conectados a datos y servicios** — Cuando la aplicación necesita hablar con una base de datos o un servicio externo.

**03 · Qué experiencia respalda**

*Proyectos realizados*

- **ImpulsaCV** (/proyectos/impulsacv/) — Producto digital con cuentas, membresías y pagos, módulos de análisis de CV y entrevista.
- **Ryvolt** (/proyectos/ryvolt/) — Sitio corporativo bilingüe, responsive, con dos registros visuales y base técnica preparada para buscadores.
- **Hangar354** (/proyectos/tobys-warehouse/) — Sistema de operación en tiempo real con sesiones, tiempos, resultados y vista pública.

**04 · Cierre**

- Eyebrow: `Contacto`
- H2: **¿Tienes un proceso que necesita su propio sistema?**
- Párrafo: Cuéntame cómo trabajas hoy y qué te falta. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.
- Botón: **[ Plantear mi plataforma ]** → `/contacto/`

---

## 4. Propuesta de texto — las siete fichas

### 4.3 Datos, planillas y BI

`/servicios/datos-y-bi/`

**Hero**

- Eyebrow: Soluciones a medida
- H1: **Datos, planillas y BI.**
- Lead: Ordeno flujos de datos, depuro y combino fuentes y preparo los reportes que permiten decidir sin reconstruir nada a mano. El objetivo es que el dato llegue a tiempo y en un formato que se pueda leer.
- Línea de estado: `Evaluación caso a caso` · `Primer diagnóstico conversado: gratuito`

**01 · Qué problema resuelvo**

- H2: **Qué problema resuelvo.**
- Párrafo: Varias versiones de una misma planilla, columnas que no coinciden entre archivos o reportes montados a mano dificultan el seguimiento de cualquier operación. Cuando nadie tiene un número fiable, cada decisión se toma con la información que hay, no con la que debería haber.
- H3: **Cómo lo abordo**
- Párrafo: Reviso qué datos existen, cómo se relacionan y qué decisiones deben respaldar. Utilizo la tecnología más proporcional al problema: Excel y Power Query para lo cercano, Python y BigQuery para lo que pide escala, Power BI o Tableau para lo que debe observarse y Looker Studio cuando el acceso tiene que ser sencillo y compartido.

**Lateral — ficha rápida**

- «En una línea»: Datos consolidados y un tablero que se mira, no un excel más grande que nadie abre.
- «Con qué lo construyo»: Excel, Power Query, Python, Power BI, Tableau, GCP / BigQuery, Looker Studio
- Nota: *La selección final depende del problema; no todas las herramientas se usan en todos los encargos.*

**02 · Qué entrego**

- H2: **Qué entrego, en concreto.**
- Bajada: *No entrego un listado de herramientas, sino un resultado que se puede usar. Cada punto es un entregable que puedes revisar y aceptar por separado.*

1. **Consolidación y limpieza de archivos** — Unir versiones, normalizar columnas y dejar una fuente que se pueda mantener.
2. **Transformaciones y procesos ETL** — Extracción, normalización y carga de datos desde múltiples orígenes.
3. **Modelos de datos** — Estructuras que respondan preguntas y no sólo que reflejan cómo está guardado cada cosa.
4. **Dashboards e informes** — Indicadores de gestión pensados para decidir, no para mostrar números.
5. **Automatización de informes** — Reportes que se actualizan solos y se distribuyen sin que nadie los monte a mano.
6. **Procesamiento de múltiples fuentes** — Cuando la información está repartida entre sistemas distintos.

**03 · Qué experiencia respalda**

*Proyectos realizados*

- **El Cambiómetro** (/proyectos/el-cambiometro/) — Ingesta y validación de fuentes públicas, instantáneos históricos, consultas, API y visualización con trazabilidad.
- **Flor de Almendro** (/proyectos/flor-de-almendro/) — Catálogo alimentado por Sheets como fuente de información y Drive para medios.

*Herramientas propias*

- **AuditaPC** (/herramientas/#auditapc) — Herramienta propia que recoge el inventario técnico de un equipo y exporta HTML, CSV y JSON.
- **DatosDemoCL** (/herramientas/#datosdemocl) — Generador de datos sintéticos para probar formularios, importadores y sistemas sin usar datos reales.

**04 · Cierre**

- Eyebrow: `Contacto`
- H2: **¿Cómo decides hoy con tus datos?**
- Párrafo: Cuéntame qué información necesitas para decidir y de dónde viene. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.
- Botón: **[ Ordenar mis datos ]** → `/contacto/`

---

## 4. Propuesta de texto — las siete fichas

### 4.4 Integraciones y APIs

`/servicios/integraciones/`

**Hero**

- Eyebrow: Soluciones a medida
- H1: **Integraciones y APIs.**
- Lead: El objetivo no siempre es crear una aplicación nueva. A veces basta con que la planilla, el calendario, el CRM y el servicio externo intercambien información correctamente, y con eso la operación deja de depender de alguien copiando datos de un lado a otro.
- Línea de estado: `Evaluación caso a caso` · `Primer diagnóstico conversado: gratuito`

**01 · Qué problema resuelvo**

- H2: **Qué problema resuelvo.**
- Párrafo: Cuando la información queda aislada en distintas herramientas, alguien termina haciendo de puente manual entre sistemas: copia un dato de un lado, lo pega en otro y reza para que no se desincronice. El costo no es el copiado, es la demora y el error.
- H3: **Cómo lo abordo**
- Párrafo: Defino responsabilidades de cada sistema, permisos, formato de datos, frecuencia de actualización y respuesta ante fallos. Elijo entre integración directa, Apps Script, un servicio intermedio o automatización visual según lo que exista en cada caso, y dejo claro quién es dueño de cada dato.

**Lateral — ficha rápida**

- «En una línea»: Sistemas que se hablan entre sí con reglas claras, no con copias manuales.
- «Con qué lo construyo»: APIs REST, OAuth, Google Sheets, Google Calendar, CRM, Apps Script, Firebase, Cloudflare Workers
- Nota: *La selección final depende del problema; no todas las herramientas se usan en todos los encargos.*

**02 · Qué entrego**

- H2: **Qué entrego, en concreto.**
- Bajada: *No entrego un listado de herramientas, sino un resultado que se puede usar. Cada punto es un entregable que puedes revisar y aceptar por separado.*

1. **Conexiones entre APIs y servicios** — Integraciones directas donde la plataforma lo permite y el caso lo justifica.
2. **Integraciones con Google Workspace** — Sheets, Drive, Calendar y Apps Script cuando el negocio ya trabaja con ahí.
3. **Plataformas de pago** — Confirmación y registro de operaciones para dejar de seguir el estado a mano.
4. **Canales de comunicación** — Avisos y consultas por el canal que ya usan tus clientes o tu equipo.
5. **Flujos con controles de error** — Reintentos, avisos y registro de lo que falló, para que nada se pierda en silencio.
6. **Almacenamiento y sincronización** — Mantener una única fuente de verdad cuando hay varias copias del mismo dato.

**03 · Qué experiencia respalda**

*Proyectos realizados*

- **ListoPorHoy** (/proyectos/conecta/) — Backend, base de datos y conexiones por OAuth con servicios sociales, con permisos por rol.
- **kokeAI** (/proyectos/kooke-portal/) — Automatizaciones de metadatos con Apps Script y Drive, portal en Firebase y un Worker independiente para servir audio.
- **Flor de Almendro** (/proyectos/flor-de-almendro/) — Catálogo y medios conectados a Sheets y Drive, con contacto por WhatsApp.

**04 · Cierre**

- Eyebrow: `Contacto`
- H2: **¿Qué sistemas tienes que unir a mano?**
- Párrafo: Cuéntame qué se copia hoy y entre quién. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.
- Botón: **[ Conectar mis sistemas ]** → `/contacto/`

---

## 4. Propuesta de texto — las siete fichas

### 4.5 IA aplicada con criterio

`/servicios/ia-aplicada/`

**Hero**

- Eyebrow: Soluciones a medida
- H1: **IA aplicada con criterio.**
- Lead: Trabajo con modelos locales y servicios externos según precisión, privacidad, rendimiento y costo. La IA entra donde aporta valor y queda dentro de un proceso verificable, con revisión humana y sin prometer más de lo que un modelo puede hacer.
- Línea de estado: `Evaluación caso a caso` · `Primer diagnóstico conversado: gratuito`

**01 · Qué problema resuelvo**

- H2: **Qué problema resuelvo.**
- Párrafo: Clasificar texto, extraer información, analizar documentos o preparar contenido puede requerir modelos; otros problemas funcionan mejor con reglas simples. La pregunta correcta no es «puedo usar IA», sino «qué parte de esta tarea se resuelve mejor con un modelo y cuál con una regla».
- H3: **Cómo lo abordo**
- Párrafo: Evaluo dónde se ejecutan los datos, qué grado de revisión necesita la salida y qué ocurre cuando el modelo se equivoca. No prometo ejecución local en flujos que dependen de servicios externos, y no presento como inteligencia artificial una automatización tradicional que ya funcionaba.

**Lateral — ficha rápida**

- «En una línea»: IA dentro de un proceso que se puede revisar, medir y corregir, no una demo suelta.
- «Con qué lo construyo»: Ollama / LM Studio, Gemma / Qwen / DeepSeek, APIs de modelos, CLI y agentes, Python
- Nota: *La selección final depende del problema; no todas las herramientas se usan en todos los encargos.*

**02 · Qué entrego**

- H2: **Qué entrego, en concreto.**
- Bajada: *No entrego un listado de herramientas, sino un resultado que se puede usar. Cada punto es un entregable que puedes revisar y aceptar por separado.*

1. **Integración de modelos vía API o local** — Elección del modelo según el lugar donde deben ejecutarse los datos.
2. **Análisis y clasificación asistidos** — Extracción de información de documentos, mensajes o archivos, con validación posterior.
3. **Procesamiento de documentos** — Lectura y extracción estructurada de PDF, planillas y textos largos.
4. **Automatización asistida por IA** — Borradores, resúmenes o propuestas que una persona revisa antes de publicarse.
5. **Orquestación de agentes y herramientas** — Cuando el trabajo requiere encadenar modelos, búsquedas y pasos con criterios.
6. **Validación y supervisión de resultados** — Reglas de calidad, mátricas de coincidencia y trazabilidad de lo que el modelo decidió.

**03 · Qué experiencia respalda**

*Proyectos realizados*

- **ImpulsaCV** (/proyectos/impulsacv/) — Producto con componentes de IA integrados junto a motores deterministas y servicios remotos.
- **RRSS** (/proyectos/kooke-rrss/) — Generación asistida de texto con Gemini y composición programática de la pieza gráfica.

**04 · Cierre**

- Eyebrow: `Contacto`
- H2: **¿Dónde te serviría la IA de verdad?**
- Párrafo: Cuéntame qué tarea te cuesta y qué parte te molesta. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.
- Botón: **[ Revisar un caso con IA ]** → `/contacto/`

---

## 4. Propuesta de texto — las siete fichas

### 4.6 Soporte técnico

`/servicios/soporte-ti/`
**Nombre público**: pasa de «Soporte técnico independiente» a «Soporte técnico». La URL no cambia.

**Hero**

- Eyebrow: Soluciones a medida
- H1: **Soporte técnico.**
- Lead: Diagnóstico y puesta en marcha de equipos y software, en el lugar o a distancia. Atiendo lo que está fallando, documento lo que encontró y dejo el equipo funcionando y explicado, no resuelto a medias.
- Línea de estado: `Evaluación caso a caso` · `Primer diagnóstico conversado: gratuito`

**01 · Qué problema resuelvo**

- H2: **Qué problema resuelvo.**
- Párrafo: Un equipo, una instalación o una configuración problemática puede detener una tarea entera. Lo que suele faltar no es la acción, sino saber qué está pasando antes de cambiar nada y dejar registro de lo que se hizo.
- H3: **Cómo lo abordo**
- Párrafo: Reviso la necesidad, acuerdo el alcance y el acceso, realizo el levantamiento técnico necesario, documento los hallazgos y explico los siguientes pasos. Trabajo en el lugar o de forma remota según lo que permita el caso, y dejo cada equipo en un estado conocido y reproducible.

**Lateral — ficha rápida**

- «En una línea»: Equipos y software que vuelven a funcionar, con lo encontrado y lo hecho anotado.
- «Con qué lo construyo»: Windows, Herramientas locales, Informes HTML, Inventario técnico
- Nota: *La selección final depende del problema; no todas las herramientas se usan en todos los encargos.*

**02 · Qué entrego**

- H2: **Qué entrego, en concreto.**
- Bajada: *No entrego un listado de herramientas, sino un resultado que se puede usar. Cada punto es un entregable que puedes revisar y aceptar por separado.*

1. **Atención presencial y remota** — Visitas al lugar o soporte por conexión, según lo que el caso requiera.
2. **Diagnóstico de equipos** — Identificación de hardware, sistema, software y estado real del equipo.
3. **Instalación y configuración de software** — Programas, licencias y ajustes de configuración para el uso previsto.
4. **Formateo y reinstalación de sistemas** — Reinstalación del sistema operativo con respaldo previo de la información del equipo.
5. **Carga o restauración de imágenes de sistema** — Implantación de la imagen corporativa o restauración de un equipo.
6. **Instalación de controladores** — Drivers de impresoras, tarjetas y periféricos para que el equipo los reconozca.
7. **Configuración de equipos y periféricos** — Red, impresoras, pantalla, actualizaciones y todo lo que hace falta para operar.
8. **Resolución de incidencias** — Diagnóstico y resolución de fallas de software, red o arranque.
9. **Levantamientos e informes técnicos** — Inventario, fotografías, notas de terreno e informe comprensible para quien recibe el equipo.

**03 · Qué experiencia respalda**

*Herramientas propias*

- **AuditaPC** (/herramientas/#auditapc) — Herramienta propia para inventarios técnicos, con informes HTML individuales y consolidados, exportación CSV y JSON y funcionamiento portable sin conexión.
- **Nokto** (/herramientas/#nokto) — Consola de escritorio para telemetría del equipo y control de audio, con rutinas de mantenimiento configurables.

**04 · Cierre**

- Eyebrow: `Contacto`
- H2: **¿Un equipo que no está funcionando como debería?**
- Párrafo: Cuéntame qué pasa y qué necesitas del equipo. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.
- Botón: **[ Revisar mi equipo ]** → `/contacto/`

---

## 4. Propuesta de texto — las siete fichas

### 4.7 Gestión de redes sociales

`/servicios/redes-sociales/`

**Hero**

- Eyebrow: Servicio editorial
- H1: **Gestión de redes sociales.**
- Lead: Organizo contigo el trabajo de contenido: las ideas, el calendario, la preparación de las publicaciones y la revisión de lo que funcionó. Un perfil ordenado se sostiene; uno improvisado se abandona.
- Línea de estado: `Evaluación caso a caso` · `Primer diagnóstico conversado: gratuito`

**01 · Qué problema resuelvo**

- H2: **Qué problema resuelvo.**
- Párrafo: Publicar de forma irregular y a la carrera produce un perfil que no dice nada y una carga de trabajo que se termina abandonando. El problema no suele ser la falta de ideas, sino la falta de un proceso que se pueda sostener con el tiempo disponible.
- H3: **Cómo lo abordo**
- Párrafo: Partimos por tus perfiles, el público al que quieres llegar y los recursos que ya tienes. Acordamos qué puedo asumir y qué necesita tu aprobación, y de ahí sale un calendario que se puede mantener en lugar de uno que se abandona a la segunda semana.

**Lateral — ficha rápida**

- «En una línea»: Contenido planificado y publicado con un proceso que se sostiene en el tiempo.
- «Con qué lo construyo»: Planificación editorial, Programación de publicaciones, Métricas por plataforma, Hojas de calendario
- Nota: *Esta área es editorial. La atención comercial automatizada con bots es una capacidad de Automatización de procesos.*

**02 · Qué entrego**

- H2: **Qué entrego, en concreto.**
- Bajada: *No entrego un listado de herramientas, sino un resultado que se puede usar. Cada punto es un entregable que puedes revisar y aceptar por separado.*

1. **Planificación de contenido** — Temas, formatos y prioridades definidos antes de producir.
2. **Calendarios editoriales** — Un calendario por perfil, con fechas realistas y margen para revisar.
3. **Creación de textos y piezas** — Borradores y material visual listos para publicar, con la revisión que acordemos.
4. **Organización de perfiles** — Perfiles ordenados, con bio, imagenes y estructura coherente con lo que vendes.
5. **Programación y distribución** — Publicación en la fecha acordada y por el canal que corresponda.
6. **Revisión de resultados** — Lectura de lo que cada plataforma entrega y ajuste de lo que viene después.

**03 · Qué experiencia respalda**

*Proyectos realizados*

- **RRSS** (/proyectos/kooke-rrss/) — Coordinación de calendario e historial de publicaciones, con generación asistida y composición programática de las piezas.
- **ListoPorHoy** (/proyectos/conecta/) — Calendario, borradores, marcas y medios coordinados desde un mismo entorno, con conexiones por API.

**04 · Cierre**

- Eyebrow: `Contacto`
- H2: **¿Tu contenido depende de que alguien tenga tiempo?**
- Párrafo: Cuéntame qué publicas hoy y con cuánta frecuencia puedes sostenerlo. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.
- Botón: **[ Planificar mi contenido ]** → `/contacto/`

---

## 5. Títulos SEO y meta descriptions propuestos

`meta()` ya añade `| JMorgado` al título. La corrección consiste en **dejar de añadir `— JMorgado` en la plantilla** (`build_site.py` L1269), con lo que cada página queda con un título único.

| Ruta | Título SEO propuesto | Long. | Meta description propuesta | Long. |
|---|---|---|---|---|
| `/servicios/` | Servicios de software, datos y automatización \| JMorgado | 56 | Software, datos y automatización en siete áreas: procesos repetitivos, plataformas web, reportes, integraciones, IA aplicada, soporte técnico y contenido. | 154 |
| `/servicios/automatizacion/` | Automatización de procesos y tareas repetitivas \| JMorgado | 58 | Automatizo tareas que se repiten: validación de datos, flujos entre planillas y correo, reservas y atención con bots. Python, n8n, Make y Apps Script. | 150 |
| `/servicios/desarrollo-web/` | Desarrollo web y plataformas a medida \| JMorgado | 48 | Sitios, catálogos, paneles y plataformas con usuarios y lógica propia. La arquitectura se decide por el problema, no por la tecnología de moda. | 143 |
| `/servicios/datos-y-bi/` | Datos, planillas y BI: reportes y dashboards \| JMorgado | 55 | Consolido y limpio datos dispersos, automatizo informes y construyo dashboards con Power BI, Tableau, Excel, Python, BigQuery y Looker Studio. | 142 |
| `/servicios/integraciones/` | Integraciones y APIs entre sistemas \| JMorgado | 46 | Conecto planillas, calendarios, CRM y pasarelas de pago con APIs, OAuth y automatización, para eliminar el copiar y pegar manual. | 129 |
| `/servicios/ia-aplicada/` | IA aplicada: modelos y agentes con criterio \| JMorgado | 54 | Integro modelos de IA para clasificar, extraer y procesar documentos, con validación y supervisión. Dónde aporta valor la IA y dónde no. | 136 |
| `/servicios/soporte-ti/` | Soporte técnico de equipos y software \| JMorgado | 48 | Diagnóstico, instalación, configuración, formateo y reinstalación de equipos y software, en el lugar o a distancia, con levantamientos e informes técnicos. | 155 |
| `/servicios/redes-sociales/` | Gestión de redes sociales y contenido \| JMorgado | 48 | Planifico calendarios editoriales, preparo textos y piezas, organizo perfiles y coordino publicación y revisión. Sin automatizar la atención comercial. | 151 |

Todos los títulos quedan bajo 60 caracteres y todas las descripciones bajo 155. Ninguna meta description repite el párrafo del hero: cada una describe qué resuelve el área.

**Estructura de datos propuesta**

Sólo esquemas válidos y verificables, sin promesas de posicionamiento:

- `Service` en cada ficha, con `name`, `description`, `provider` (la organización), `areaServed` (Chile), `url` y `serviceType`. Sin `offers` con precios, porque no hay precios publicados.
- `BreadcrumbList` en las ocho páginas, reflejando la ruta visible.
- `ItemList` en el índice, con los siete elementos de `Service`.
- Nada en las páginas de proyectos o herramientas: la sección no las cambia.

---

## 6. Entregables y tecnologías por área

| Área | Entregables propuestos | Tecnologías propuestas |
|---|---|---|
| Automatización de procesos | Automatización de tareas repetitivas; Bots y asistentes automatizados; Sistemas de reservas; Procesamiento y validación de datos; Flujos de trabajo entre plataformas; Notificaciones y recordatorios; Documentación de operación | Python, n8n / Make, Apps Script, Excel / Power Query, APIs |
| Desarrollo web y plataformas | Sitios corporativos y comerciales; Catálogos administrables; Aplicaciones web; Paneles de administración; Plataformas con usuarios y lógica propia; Sistemas conectados a datos y servicios | React / Vite, TypeScript, Hono / Workers, Firebase, Cloudflare D1 |
| Datos, planillas y BI | Consolidación y limpieza de archivos; Transformaciones y procesos ETL; Modelos de datos; Dashboards e informes; Automatización de informes; Procesamiento de múltiples fuentes | Excel, Power Query, Python, Power BI, Tableau, GCP / BigQuery, Looker Studio |
| Integraciones y APIs | Conexiones entre APIs y servicios; Integraciones con Google Workspace; Plataformas de pago; Canales de comunicación; Flujos con controles de error; Almacenamiento y sincronización | APIs REST, OAuth, Google Sheets, Google Calendar, CRM, Apps Script, Firebase, Cloudflare Workers |
| IA aplicada con criterio | Integración de modelos vía API o local; Análisis y clasificación asistidos; Procesamiento de documentos; Automatización asistida por IA; Orquestación de agentes y herramientas; Validación y supervisión de resultados | Ollama / LM Studio, Gemma / Qwen / DeepSeek, APIs de modelos, CLI y agentes, Python |
| Soporte técnico | Atención presencial y remota; Diagnóstico de equipos; Instalación y configuración de software; Formateo y reinstalación de sistemas; Carga o restauración de imágenes de sistema; Instalación de controladores; Configuración de equipos y periféricos; Resolución de incidencias; Levantamientos e informes técnicos | Windows, Herramientas locales, Informes HTML, Inventario técnico |
| Gestión de redes sociales | Planificación de contenido; Calendarios editoriales; Creación de textos y piezas; Organización de perfiles; Programación y distribución; Revisión de resultados | Planificación editorial, Programación de publicaciones, Métricas por plataforma, Hojas de calendario |

**Tecnologías que entran por primera vez en la sección**

| Tecnología | Dónde | Nota |
|---|---|---|
| **Tableau** | Datos, planillas y BI | Se declara como herramienta disponible, **no** como experiencia demostrada en un proyecto: no hay evidencia en el portafolio |
| Google Calendar | Integraciones y APIs | La conexión con calendarios aparece en ListoPorHoy, aunque su ficha hoy no lo menciona entre las tecnologías |
| CRM | Integraciones y APIs | Declarado como categoría de sistema a conectar, sin nombrar marcas |
| Telegram y otros canales | Integraciones y APIs | Enmarcado como canal de avisos y consultas, sin anexar el caso no documentado de DriveVipClub |
| Plataformas de pago | Integraciones y APIs | Enmarcado como conexión a confirmar, sin nombres de proveedor |

**Tecnologías que salen**

Ninguna. Se conservan las siete áreas con su stack actual; sólo se añaden las que el encargo solicita y que son coherentes con la línea.

---

## 7. Proyectos relacionados y herramientas propias

Esta separación es obligatoria en toda la sección. La regla aplicada: **cada enlace tiene que aportar evidencia de la capacidad que el área declara**.

### 7.1 Proyectos realizados

| Área | Proyecto | Qué respalda | URL |
|---|---|---|---|
| Automatización de procesos | RRSS | Coordinación de calendario, historial, generación asistida y composición programática de contenidos con Sheets, Apps Script y Python. | `/proyectos/kooke-rrss/` |
| Automatización de procesos | ListoPorHoy | Plataforma con calendario, borradores, marcas, medios y conexiones por API desde un mismo entorno. | `/proyectos/conecta/` |
| Desarrollo web y plataformas | ImpulsaCV | Producto digital con cuentas, membresías y pagos, módulos de análisis de CV y entrevista. | `/proyectos/impulsacv/` |
| Desarrollo web y plataformas | Ryvolt | Sitio corporativo bilingüe, responsive, con dos registros visuales y base técnica preparada para buscadores. | `/proyectos/ryvolt/` |
| Desarrollo web y plataformas | Hangar354 | Sistema de operación en tiempo real con sesiones, tiempos, resultados y vista pública. | `/proyectos/tobys-warehouse/` |
| Datos, planillas y BI | El Cambiómetro | Ingesta y validación de fuentes públicas, instantáneos históricos, consultas, API y visualización con trazabilidad. | `/proyectos/el-cambiometro/` |
| Datos, planillas y BI | Flor de Almendro | Catálogo alimentado por Sheets como fuente de información y Drive para medios. | `/proyectos/flor-de-almendro/` |
| Integraciones y APIs | ListoPorHoy | Backend, base de datos y conexiones por OAuth con servicios sociales, con permisos por rol. | `/proyectos/conecta/` |
| Integraciones y APIs | kokeAI | Automatizaciones de metadatos con Apps Script y Drive, portal en Firebase y un Worker independiente para servir audio. | `/proyectos/kooke-portal/` |
| Integraciones y APIs | Flor de Almendro | Catálogo y medios conectados a Sheets y Drive, con contacto por WhatsApp. | `/proyectos/flor-de-almendro/` |
| IA aplicada con criterio | ImpulsaCV | Producto con componentes de IA integrados junto a motores deterministas y servicios remotos. | `/proyectos/impulsacv/` |
| IA aplicada con criterio | RRSS | Generación asistida de texto con Gemini y composición programática de la pieza gráfica. | `/proyectos/kooke-rrss/` |
| Gestión de redes sociales | RRSS | Coordinación de calendario e historial de publicaciones, con generación asistida y composición programática de las piezas. | `/proyectos/kooke-rrss/` |
| Gestión de redes sociales | ListoPorHoy | Calendario, borradores, marcas y medios coordinados desde un mismo entorno, con conexiones por API. | `/proyectos/conecta/` |

### 7.2 Herramientas propias

| Área | Herramienta | Qué respalda | URL |
|---|---|---|---|
| Automatización de procesos | Nokto | Consola de escritorio con automatización de rutinas por bloques y disparadores, ejecutadas en local. | `/herramientas/#nokto` |
| Automatización de procesos | AuditaPC | Herramienta propia para levantamiento técnico e informes, que sirvió de base al área de soporte. | `/herramientas/#auditapc` |
| Datos, planillas y BI | AuditaPC | Herramienta propia que recoge el inventario técnico de un equipo y exporta HTML, CSV y JSON. | `/herramientas/#auditapc` |
| Datos, planillas y BI | DatosDemoCL | Generador de datos sintéticos para probar formularios, importadores y sistemas sin usar datos reales. | `/herramientas/#datosdemocl` |
| Soporte técnico | AuditaPC | Herramienta propia para inventarios técnicos, con informes HTML individuales y consolidados, exportación CSV y JSON y funcionamiento portable sin conexión. | `/herramientas/#auditapc` |
| Soporte técnico | Nokto | Consola de escritorio para telemetría del equipo y control de audio, con rutinas de mantenimiento configurables. | `/herramientas/#nokto` |

### 7.3 Cambios respecto del enlaces actual

| Cambio | Detalle |
|---|---|
| **AuditaPC pasa a «Herramientas propias»** | Hoy aparece como si fuera un proyecto de cliente dentro de Automatización y Soporte. Pasa a un grupo propio, con su enlace a `/herramientas/#auditapc`. |
| **Se incorpora Nokto y DatosDemoCL** | No estaban enlazados desde ninguna ficha de servicio. Nokto respalda la automatización local de rutinas (Automatización) y la telemetría de equipo (Soporte). DatosDemoCL respalda la preparación de datos de prueba (Datos). |
| **Redes sociales deja de estar sin evidencia** | Hoy no enlaza ningún trabajo. Se incorporan RRSS (coordinación de calendario y composición de publicaciones) y ListoPorHoy (calendario, borradores, medios y publicación por API), con las cautelas de sus propias fichas. |
| **Exo Dream sigue sin enlazarse** | Es un showroom configurable, y ninguna de las siete áreas lo presenta hoy como evidencia propia. Se deja fuera; si en la siguiente etapa se incorpora el área de desarrollo web con catálogos configurables, se puede sumar. |
| **Hangar354 se mantiene en Desarrollo web** | Sigue siendo la evidencia de un sistema operativo con estado en tiempo real. |

---

## 8. Propuesta de CTA por página

El destino no cambia: `/contacto/`. Lo que cambia es el mensaje, para que cada cierre hable del problema del área y no sea el mismo en las siete páginas.

| Página | H2 del cierre | Texto | Botón | Destino |
|---|---|---|---|---|
| `/servicios/` | La conversación inicial no tiene costo. | Es una orientación para conocer la tarea y sus restricciones. Una auditoría o intervención técnica se acuerda por separado. | Conocer el método | `/metodo/` |
| `/servicios/automatizacion/` | ¿Cuánto tiempo se te va en tareas que se repiten? | Cuéntame qué se repite hoy y en qué parte se atasca. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado. | Revisar mi proceso | `/contacto/` |
| `/servicios/desarrollo-web/` | ¿Tienes un proceso que necesita su propio sistema? | Cuéntame cómo trabajas hoy y qué te falta. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado. | Plantear mi plataforma | `/contacto/` |
| `/servicios/datos-y-bi/` | ¿Cómo decides hoy con tus datos? | Cuéntame qué información necesitas para decidir y de dónde viene. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado. | Ordenar mis datos | `/contacto/` |
| `/servicios/integraciones/` | ¿Qué sistemas tienes que unir a mano? | Cuéntame qué se copia hoy y entre quién. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado. | Conectar mis sistemas | `/contacto/` |
| `/servicios/ia-aplicada/` | ¿Dónde te serviría la IA de verdad? | Cuéntame qué tarea te cuesta y qué parte te molesta. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado. | Revisar un caso con IA | `/contacto/` |
| `/servicios/soporte-ti/` | ¿Un equipo que no está funcionando como debería? | Cuéntame qué pasa y qué necesitas del equipo. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado. | Revisar mi equipo | `/contacto/` |
| `/servicios/redes-sociales/` | ¿Tu contenido depende de que alguien tenga tiempo? | Cuéntame qué publicas hoy y con cuánta frecuencia puedes sostenerlo. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado. | Planificar mi contenido | `/contacto/` |

**Reglas que se respetan en las siete fichas**

- La primera conversación se presenta como **gratuita**, con la misma frase en las siete.
- La auditoría o intervención técnica **se acuerda por separado**, con la misma aclaración en las siete.
- El índice mantiene su CTA a `/metodo/`, porque su función es explicar el proceso, no vender.
- Ningún cierre promete plazos, precios ni resultados.

**Excepción que se propone eliminar:** hoy la ficha de Redes sociales cierra con un botón a WhatsApp («Conversemos») y las otras seis con un enlace a `/contacto/`. La propuesta unifica el destino en `/contacto/` en las siete, manteniendo WhatsApp y LinkedIn en el pie de sitio de todas.

---

## 9. Propuesta de ajustes visuales

### 9.1 Lo que se conserva sin cambios

Identidad editorial, fondo crema y modo noche, tipografía actual, acento coral, color petróleo, overlines con numeración, separadores de 1 px, rails laterales de 3 px, iconografía de línea de 27 px, jerarquía visual y tratamiento de los enlaces. **No se propone ninguna tarjeta nueva, sombra, degradado, borde redondeado ni elemento decorativo.**

### 9.2 Ajustes propuestos

| # | Ajuste | Motivo | Cómo se resuelve |
|---|---|---|---|
| 1 | **Bloque 02 con demasiado aire** | Densidad de 2,5–2,8 caracteres por 10 px: unos 200 px vacíos bajo la lista | El bloque «Qué entrego» pasa a ocupar ese espacio con contenido real, y la sección de experiencia baja su relleno vertical. Sin tocar la retícula |
| 2 | **Tablón de contacto muy alto** | 908 px para 142 caracteres | Se mantiene el panel coral, pero con la pregunta propia del área y un párrafo de dos líneas; el H2 baja de `clamp(2,8rem,6vw,6rem)` a `clamp(2,4rem,5vw,4,4rem)`. La caja baja a unos 700 px sin perder presencia |
| 3 | **Columna de texto más corta que la lateral** | Entre 150 y 200 px de diferencia en las seis fichas | La lateral pasa a llevar sólo la ficha rápida (resumen + tecnologías) y los entregables bajan al bloque 02. Las dos columnas quedan equilibradas |
| 4 | **Legibilidad de las tecnologías** | Los chips muestran un cuadrado de color; sólo Excel, Power Query, Power BI y n8n tienen icono de marca | Se conserva el chip actual (`.tag.tech-badge`) y se añaden los iconos SVG de `assets/tech-icons/` donde exista el archivo; el resto mantiene el cuadrado de color. Sin cambiar el tamaño del chip |
| 5 | **Hueco superior derecho en Redes sociales** | El titular ocupa tres líneas y el párrafo queda alineado al pie | El párrafo se alinea arriba y el bloque toma la altura del titular. Se conserva el hero en arcilla y el rail de 3 px |
| 6 | **Filas del índice con descripciones largas** | La descripción de «Gestión de redes sociales» ocupa dos líneas y rompe la horizontalidad de la rejilla | Las siete frases propuestas caben en una línea a 1440 px; en móvil ya bajan a una fila propia |
| 7 | **Cabecera de la ficha de Redes sociales** | Hoy no lleva la línea `page-meta` que las otras seis | Se le añade la misma línea, para que el bloque de estado sea consistente en las siete |

### 9.3 Revisión obligatoria en cuatro estados

Cada ajuste se revisa en día y en noche, a 1440 px y a 390 px, comprobando que no aparece desbordamiento horizontal ni cambios en el ritmo de lectura. La ficha de Redes sociales se revisa además con su hero en arcilla, que es el único fondo de color de la sección.

---

## 10. Mejoras de navegación

### 10.1 «Otras áreas» al pie de cada ficha

Hoy, desde una ficha sólo se llega a otra mediante la miga de pan. Se propone una franja compuesta con el componente `.related` ya existente, sin sombras ni tarjetas:

```
OTRAS ÁREAS
Automatización de procesos        ·
Desarrollo web y plataformas       ·
Datos, planillas y BI              ·
Integraciones y APIs              ·
IA aplicada con criterio          ·
Soporte técnico                   ·
Gestión de redes sociales          ·
```

Siete enlaces de una línea, con la misma tipografía de `.related a` que ya se usa para los trabajos del archivo. En móvil se convierte en lista vertical.

### 10.2 Miga de pan del índice

Se mantiene «Inicio / Servicios». La propuesta **no** añade enlaces a las fichas hermanas en la miga: el índice ya las lista en pantalla y la franja «Otras áreas» cubre la navegación cruzada.

### 10.3 Enlace a la ficha de soporte desde Herramientas

AuditaPC y Nokto aparecen como herramientas propias en las fichas de Soporte técnico y Automatización, y enlazan a `/herramientas/#<slug>`. Se propone que esas rutas puras (`/herramientas/`) resuelvan al listado y que el ancla lleve a la tarjeta, como ya funciona hoy.

---

## 11. Correcciones SEO

| # | Corrección | Dónde | Prioridad |
|---|---|---|---|
| 1 | Quitar `— JMorgado` del título de las seis fichas | `build_site.py` L1269 | Alta |
| 2 | Títulos únicos y descriptivos por página | `site_data.py` (campo nuevo `seo_title`) | Alta |
| 3 | Meta descriptions propias, ≤155 caracteres y distintas del hero | `site_data.py` | Alta |
| 4 | `Service` + `BreadcrumbList` + `ItemList` | `build_site.py::meta()` | Media |
| 5 | Etiquetas de Twitter/X con la imagen actual | `build_site.py::meta()` | Baja |
| 6 | Comprobar el `sitemap.xml` tras cada publicación | `publish_site.py` | Rutina |
| 7 | Verificar que `robots.txt` se sigue generando | `publish_site.py` | Rutina |

**Lo que no se toca:** canonical, `robots` (`index,follow`), `og:type`, `og:locale`, `og:url`, la estructura de encabezados y las URLs.

---

## 12. Información pendiente de verificar

| # | Punto | Qué se necesita | Qué bloquea |
|---|---|---|---|
| 1 | **DriveVipClub** | Documentación original: bots de consultas y reservas, automatización de membresías, integración con MercadoPago, PayPal y Telegram Stars, confirmación de pagos, activación, vencimiento y revocación de accesos a Google Drive, demos temporales, recordatorios y recuperación, Google Sheets como CRM, publicaciones programadas y continuidad operativa | La página de caso en «Experiencia demostrada» de Automatización. **Sin ese material, la capacidad se publica como servicio y no como antecedente** |
| 2 | **Autorización para nombrar el proyecto** | Confirmación del cliente o del titular | Publicar «DriveVipClub» como caso. La propuesta **no lo nombra** y presenta la capacidad de forma anonimizada |
| 3 | **Tableau** | Confirmar si se usa en algún encargo real | Declararlo como tecnología disponible. Se propone declararlo como capacidad, **no** como experiencia demostrada |
| 4 | **CRM y pasarelas de pago** | Confirmar el alcance real de esas conexiones | El entregable «Plataformas de pago» de Integraciones |
| 5 | **Capacidades concretas de Soporte técnico** | Confirmar formateo, reinstalación, carga de imágenes, controladores y periféricos | Los seis entregables técnicos de Soporte. La propuesta los incluye **sin** comprometer reparaciones de hardware ni recuperación de datos |
| 6 | **Telegram como canal** | Confirmar el tipo de uso real | Mencionarlo como canal en Integraciones |
| 7 | **Exo Dream** | Decidir si entra como evidencia de desarrollo web | La lista de proyectos de esa área |

**Búsqueda realizada para recuperar DriveVipClub.** Se revisaron: el repositorio del portafolio (coincidencias de «DriveVip», «drive vip», «vipclub», «club drive», «membresía», «Telegram Stars», «activación/revocación de accesos»); las carpetas de trabajo bajo `C:\Users\jorge\Proyectos` (`AuditaPC`, `Nokto`, `RRSS`, `Conecta`, `Koooke.ai`, `impulsacv-web`, `vehiculos.impulsacv.cl`, `Isla Dinamica`, `sorting-app`, `pruebas`, `Mariela`, `taller`); los repositorios públicos de `github.com/jmorgadodev` (5 repositorios, ninguno corresponde); y el árbol de nombres de archivo en busca de `drive`, `vip`, `bot`, `reserva`, `membres` y `mercado`. **No hay ninguna coincidencia.** Los únicos hallazgos relacionados —pagos con MercadoPago— pertenecen a ImpulsaCV y ya están documentados en su ficha; los avisos por Telegram pertenecen a las alertas del ETL de El Cambiómetro, que es otra cosa. Por eso el proyecto no se nombra y su capacidad no se documenta como antecedente hasta que se recupere el material.

---

## 13. Comparación entre el contenido actual y el propuesto

### 13.1 Índice

| Elemento | Actual | Propuesto |
|---|---|---|
| Lead | «Desarrollo web, datos, automatización, soporte y gestión de redes sociales. Cada servicio explica qué puedo tomar a cargo y qué necesitamos acordar.» (nombra 5 de 7) | «Hay tareas que se repiten, sistemas que no se hablan entre sí y datos que nadie mira a tiempo. Trabajo en siete áreas para resolver eso: automatización de procesos, desarrollo web y plataformas, datos y BI, integraciones, IA aplicada, soporte técnico y gestión de redes sociales. Cada ficha explica qué entrego y qué trabajos respaldan esa capacidad.» |
| Filas | Título + etiqueta corta | Título + frase comercial de una línea, diferenciada |
| Nota de separación | No existe | Una línea que separa bots de atención comercial y gestión editorial |
| Meta description | Menciona «n8n y Make», que no aparecen en ninguna ficha | «Software, datos y automatización en siete áreas: procesos repetitivos, plataformas web, reportes, integraciones, IA aplicada, soporte técnico y contenido.» |

### 13.2 Fichas

| Elemento | Actual | Propuesto |
|---|---|---|
| H1 de Soporte técnico | «Soporte técnico independiente.» | «Soporte técnico.» |
| Lead | Una frase que describe la tecnología (n8n, Make, Python, Sheets) | Una frase que describe el problema y la promesa (qué se repite, qué se recupera) |
| Bloque 01 | «Qué situación abordo.» / «Cómo decido la solución» | «Qué problema resuelvo.» / «Cómo lo abordo» |
| Entregables | Lista de 4 sin explicar, en el lateral | Bloque propio con 6–9 entregables, cada uno con una línea de explicación |
| Tecnologías | 4–6 chips con un cuadrado de color | Las mismas, con icono SVG cuando existe |
| Experiencia | 1–3 proyectos mezclados | Dos grupos: «Proyectos realizados» y «Herramientas propias» |
| Cierre | Idéntico en las seis fichas | Pregunta y botón propios del área, con la frase de conversación gratuita |
| Redes sociales | Plantilla de tres bloques, CTA a WhatsApp | Cuatro bloques, mismo guion que las demás, CTA a `/contacto/` |

### 13.3 Volumen de contenido

| Página | Palabras actuales (aprox.) | Palabras propuestas (aprox.) |
| Servicios (índice) | 153 | 248 |
| Automatización de procesos | 213 | 381 |
| Desarrollo web y plataformas | 203 | 333 |
| Datos, planillas y BI | 198 | 354 |
| Integraciones y APIs | 202 | 347 |
| IA aplicada con criterio | 210 | 320 |
| Soporte técnico | 176 | 361 |
| Gestión de redes sociales | 126 | 308 |

El crecimiento corresponde a los entregables explicados (una línea cada uno), al bloque nuevo de experiencia en dos grupos y al cierre propio. **No se amplía la cantidad de bloques ni se repite el mismo texto entre fichas**; el aire que sobra en la composición se llena con contenido que el visitante necesita.

---

## 14. Decisiones que requieren aprobación

| # | Decisión | Alternativa | Impacto si cambia |
|---|---|---|---|
| 1 | **Nombre público «Soporte técnico»** | Mantener «Soporte técnico independiente» | Cambia H1, título SEO, línea del índice y meta description. La URL `/servicios/soporte-ti/` no se toca |
| 2 | **Unificar el CTA de Redes sociales en `/contacto/`** | Mantener el botón a WhatsApp | Elimina una excepción y unifica el camino de contacto |
| 3 | **Adoptar la estructura de cuatro bloques en Redes sociales** | Mantener su plantilla aparte | La hace comparable con las otras seis; se pierde parte de su personalidad, aunque conserva hero y rail |
| 4 | **Nuevo bloque «Qué entrego, en concreto»** | Mantener los entregables en el lateral | Es el cambio de mayor volumen de copy y el que más mejora la lectura comercial |
| 5 | **Separar «Proyectos realizados» y «Herramientas propias»** | Mantener una lista única | Obliga a reubicar AuditaPC y a declarar Nokto y DatosDemoCL como evidencia |
| 6 | **Publicar Tableau como capacidad** | No mencionarlo hasta tener evidencia | Afecta a Datos, planillas y BI. La propuesta no lo presenta como experiencia demostrada |
| 7 | **Anunciar bots, reservas y atención comercial en Automatización** | No anunciarlos hasta recuperar la documentación de DriveVipClub | Es el punto que más se apoya en material no verificado; por eso se propone como capacidad y no como antecedente |
| 8 | **Franja «Otras áreas» al pie de cada ficha** | No añadirla | Es la única mejora de navegación propuesta; aumenta la altura de cada ficha |
| 9 | **Datos estructurados `Service`** | No añadirlos | Aporta semántica verificable; no se prometen mejoras de posicionamiento |
| 10 | **Que Exo Dream siga sin enlazarse** | Enlazarlo en Desarrollo web | Añade un Showcase configurable a la evidencia de esa área |

### Orden de implementación sugerido

1. **Texto y SEO**: contenido de las ocho páginas, títulos y meta descriptions, nombre público de Soporte técnico. Sin tocar el diseño.
2. **Estructura**: bloque de entregables, separación de proyectos y herramientas, CTA por área, franja «Otras áreas», bloque de estado en Redes sociales.
3. **Datos estructurados** y etiquetas de Twitter/X.
4. **Ajustes visuales**: alturas, alineación y equilibro de columnas, con revisión en los cuatro estados.

Los pasos 1 y 2 no requieren modificar CSS; el 4 sí, y es el que conviene hacer al final, cuando el contenido ya está aprobado y se puede medir la composición con los textos definitivos.

---

## Fin de la propuesta

Documento generado el 2026-11-10 en `REVISION-SERVICIOS/PROPUESTA-CONSOLIDACION-SERVICIOS.md`. Etapa de propuesta: **no se modificó HTML, CSS, JavaScript, Python, textos publicados, URLs ni SEO**, no se hizo commit, push ni despliegue. La sección Servicios sigue exactamente como está.