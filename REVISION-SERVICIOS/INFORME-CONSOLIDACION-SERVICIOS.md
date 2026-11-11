# Informe de consolidación — Sección Servicios

**JMorgado · Implementación de la consolidación editorial, comercial, tecnológica, visual y SEO de `/servicios/`**

Fecha: 2026-11-10 · Base: `REVISION-SERVICIOS/PROPUESTA-CONSOLIDACION-SERVICIOS.md` y `REVISION-SERVICIOS/INFORME-CONTENIDO-SERVICIOS.md`.

Todo quedó **local**: sin commit, sin push, sin despliegue. Las ocho URLs se conservan.

---

## Índice

1. [Resumen de la consolidación](#1-resumen-de-la-consolidación)
2. [Las ocho páginas y sus cambios](#2-las-ocho-páginas-y-sus-cambios)
3. [Tecnologías e iconografía](#3-tecnologías-e-iconografía)
4. [Qué se publicó y qué quedó fuera](#4-qué-se-publicó-y-qué-quedó-fuera)
5. [QA](#5-qa)
6. [Archivos modificados y creados](#6-archivos-modificados-y-creados)
7. [Integridad del resto del sitio](#7-integridad-del-resto-del-sitio)

---

## 1. Resumen de la consolidación

La sección conserva sus siete áreas, sus ocho rutas y su identidad visual. Cambian el contenido, el orden de los bloques y el tratamiento de la evidencia.

| Antes | Ahora |
|---|---|
| Un bloque «Qué situación abordo» con el enfoque del consultor | Cuatro bloques: problema y enfoque, entregables explicados, experiencia y cierre |
| Entregables como lista de palabras en el lateral | Bloque «Qué entrego, en concreto», cada entregable con su línea de explicación |
| Proyectos y herramientas en la misma lista | Dos grupos obligatorios: «Proyectos realizados» y «Herramientas propias» |
| El mismo cierre en las seis fichas | CTA propio por área, con la frase de conversación gratuita |
| Sin bloque de tecnologías en el índice | «Tecnologías y ecosistemas»: cinco grupos, 34 tecnologías, todas con icono |
| Chips con un cuadrado de color | Chips con icono SVG en el índice y en las siete fichas |
| Títulos «X — JMorgado \| JMorgado» | Títulos únicos, sin marca duplicada |
| Sin datos estructurados | `Service`, `BreadcrumbList` e `ItemList` |
| Sin navegación entre fichas | Franja «Otras áreas» al pie de cada ficha |

---

## 2. Las ocho páginas y sus cambios

### 2.1 `/servicios/` — Índice

**SEO**: «Servicios de software, datos y automatización | JMorgado» · «Software, datos y automatización en siete áreas: procesos repetitivos, plataformas web, reportes, integraciones, IA aplicada, soporte técnico y contenido.» (154 caracteres)

**Hero**: se conserva (miga, ilustración, titular «En qué puedo ayudarte.»). El subtítulo pasa a explicar las siete áreas y qué encuentra el visitante en cada ficha.

**Bloque nuevo · 01 · Tecnologías y ecosistemas**: cinco grupos, 34 tecnologías con icono y la aclaración «El stack se selecciona según las necesidades de cada proyecto. No todas las tecnologías se utilizan en todos los encargos.»

**Bloque · 02 · Áreas de trabajo**: las siete filas con descripción comercial de una línea.

**Nota de separación** (nueva): «La automatización de consultas y atención comercial con bots es una capacidad dentro de Automatización de procesos. La gestión de redes sociales es editorial: planificación, producción y publicación de contenido.»

**Bloque · 03 · Qué incluye el primer contacto**: sin cambios.

**Datos estructurados**: `ItemList` con las siete áreas + `BreadcrumbList`.

### 2.2 Las siete fichas

| Área | H1 | Título SEO | Meta description |
|---|---|---|---|
| Automatización de procesos | Automatización de procesos. | Automatización de procesos y tareas repetitivas \| JMorgado | Automatizo tareas que se repiten: validación de datos, flujos entre planillas y correo, reservas y atención con bots. Python, n8n, Make y Apps Script. |
| Desarrollo web y plataformas | Desarrollo web y plataformas. | Desarrollo web y plataformas a medida \| JMorgado | Sitios, catálogos, paneles y plataformas con usuarios y lógica propia. La arquitectura se decide por el problema, no por la tecnología de moda. |
| Datos, planillas y BI | Datos, planillas y BI. | Datos, planillas y BI: reportes y dashboards \| JMorgado | Consolido y limpio datos dispersos, automatizo informes y construyo dashboards con Power BI, Tableau, Excel, Python, BigQuery y Looker Studio. |
| Integraciones y APIs | Integraciones y APIs. | Integraciones y APIs entre sistemas \| JMorgado | Conecto planillas, calendarios, CRM y pasarelas de pago con APIs, OAuth y automatización, para eliminar el copiar y pegar manual. |
| IA aplicada con criterio | IA aplicada con criterio. | IA aplicada: modelos y agentes con criterio \| JMorgado | Integro modelos de IA para clasificar, extraer y procesar documentos, con validación y supervisión. Dónde aporta valor la IA y dónde no. |
| Soporte técnico | Soporte técnico. | Soporte técnico de equipos y software \| JMorgado | Diagnóstico, instalación, configuración, formateo y reinstalación de equipos y software, en el lugar o a distancia, con levantamientos e informes técnicos. |
| Gestión de redes sociales | Gestión de redes sociales. | Gestión de redes sociales y contenido \| JMorgado | Planifico calendarios editoriales, preparo textos y piezas, organizo perfiles y coordino publicación y revisión. Sin automatizar la atención comercial. |

**Estructura común de las siete fichas**

```
HERO      miga · eyebrow · H1 · lead · línea de estado
01 · Qué problema resuelvo
          columna de texto            ficha rápida
            Qué problema resuelvo.        En una línea
            situación                     Tecnologías utilizadas en esta línea
            Cómo lo abordo                nota de alcance
            enfoque
02 · Qué entrego, en concreto
          entregables numerados, cada uno con su explicación
03 · Qué experiencia respalda
          Proyectos realizados   ·   Herramientas propias
04 · Conversemos
          panel coral · pregunta propia del área · CTA a /contacto/
Otras áreas
          siete enlaces para pasar de un servicio a otro
```

**Contenido por ficha**

#### Automatización de procesos — `/servicios/automatizacion/`

- **Lead**: Cuando la misma tarea pasa por planillas, correos y aplicaciones, el tiempo se va en copiar, pegar y revisar. Automatizo ese tramo para que el proceso siga solo y tú controles cuándo, con qué y con quién.
- **Qué problema resuelvo**: Copiar registros, validar datos, transferir información y preparar reportes de forma repetitiva consume horas y multiplica el riesgo de error. Cuando además hay que atender consultas, gestionar reservas o administrar membresías, el cuello de botella aparece en el mismo lugar: alguien haciendo de puente entre sistemas.
- **Cómo lo abordo**: Primero entiendo el proceso, su frecuencia, quién lo ejecuta y qué excepciones aparecen. Después evalúo, según el costo de mantenimiento y las condiciones del cliente, desde Power Query y Apps Script hasta n8n, Make, Python o un bot propio. Si un paso necesita que una persona resuelva algo, el flujo lo deriva; si no, lo resuelve solo.
- **En una línea**: Un proceso que se ejecuta solo, con reglas claras, avisos cuando corresponde y documentación de cómo operarlo.
- **Qué entrego** (10): Automatización de tareas repetitivas; Bots de consultas y atención comercial; Asistentes automatizados; Sistemas de reservas; Automatización de membresías; Confirmación de pagos y gestión de accesos; Notificaciones y recordatorios; Flujos de trabajo entre plataformas; Procesamiento y validación de información; Documentación de operación
- **Tecnologías** (7): Python, n8n, Make, Google Apps Script, Excel, Power Query, APIs REST
- **Proyectos realizados**: Sistema de automatización comercial y membresías; RRSS; ListoPorHoy
- **Herramientas propias**: Nokto
- **Nota de alcance**: La selección final depende del problema; no todas las herramientas se usan en todos los encargos.
- **CTA**: «¿Cuánto tiempo se te va en tareas que se repiten?» → *Revisar mi proceso* → `/contacto/`

#### Desarrollo web y plataformas — `/servicios/desarrollo-web/`

- **Lead**: Construyo sitios, catálogos, paneles y plataformas según la operación que tienen que sostener: no todos los problemas necesitan una aplicación completa, y la arquitectura se decide antes de elegir la tecnología.
- **Qué problema resuelvo**: Una presencia digital no resuelve por sí sola un proceso. A veces hace falta conectar datos, crear permisos o integrar una operación que hoy se realiza a mano, y aun así un catálogo o un sitio bien hecho se queda corto.
- **Cómo lo abordo**: Defino objetivos, usuarios y flujos antes de elegir el stack. Arquitectura, frontend, backend, datos e interacción se justifican por lo que la solución debe hacer, no por la moda del momento. Si un sitio administrable cumple el objetivo, no construyo una plataforma que nadie va a mantener.
- **En una línea**: Un sistema web que se sostiene en el tiempo, con lo que el negocio necesita operar y nada más.
- **Qué entrego** (6): Sitios corporativos y comerciales; Catálogos administrables; Aplicaciones web; Paneles de administración; Plataformas con usuarios y permisos; Sistemas conectados a datos y servicios
- **Tecnologías** (7): React, Vite, TypeScript, Hono, Cloudflare Workers, Cloudflare D1, Firebase
- **Proyectos realizados**: ImpulsaCV; Ryvolt; Hangar354
- **Herramientas propias**: —
- **Nota de alcance**: La selección final depende del problema; no todas las herramientas se usan en todos los encargos.
- **CTA**: «¿Tienes un proceso que necesita su propio sistema?» → *Plantear mi plataforma* → `/contacto/`

#### Datos, planillas y BI — `/servicios/datos-y-bi/`

- **Lead**: Ordeno flujos de datos, depuro y combino fuentes y preparo los reportes que permiten decidir sin reconstruir nada a mano. El objetivo es que el dato llegue a tiempo y en un formato que se pueda leer.
- **Qué problema resuelvo**: Varias versiones de una misma planilla, columnas que no coinciden entre archivos o reportes montados a mano dificultan el seguimiento de cualquier operación. Cuando nadie tiene un número fiable, cada decisión se toma con la información que hay, no con la que debería haber.
- **Cómo lo abordo**: Reviso qué datos existen, cómo se relacionan y qué decisiones deben respaldar. Utilizo la tecnología más proporcional al problema: Excel y Power Query para lo cercano, Python y BigQuery para lo que pide escala, Power BI o Tableau para lo que debe observarse y Looker Studio cuando el acceso tiene que ser sencillo y compartido. Cada reporte se diseña alrededor de las preguntas que el negocio necesita responder.
- **En una línea**: Datos consolidados y un tablero que se mira, no un excel más grande que nadie abre.
- **Qué entrego** (7): Consolidación y limpieza de archivos; Transformaciones y procesos ETL; Modelos de datos; Dashboards e informes personalizados; Automatización de reportes; Procesamiento de múltiples fuentes; Indicadores de gestión y análisis
- **Tecnologías** (8): Excel, Power Query, Python, Power BI, Tableau, BigQuery, Looker Studio, Google Cloud
- **Proyectos realizados**: El Cambiómetro; Flor de Almendro
- **Herramientas propias**: AuditaPC; DatosDemoCL
- **Nota de alcance**: Power BI y Tableau son herramientas de trabajo habitual en esta línea; no se atribuyen a un proyecto concreto sin evidencia documentada.
- **CTA**: «¿Cómo decides hoy con tus datos?» → *Ordenar mis datos* → `/contacto/`

#### Integraciones y APIs — `/servicios/integraciones/`

- **Lead**: El objetivo no siempre es crear una aplicación nueva. A veces basta con que la planilla, el calendario, el CRM y el servicio externo intercambien información correctamente, y con eso la operación deja de depender de alguien copiando datos de un lado a otro.
- **Qué problema resuelvo**: Cuando la información queda aislada en distintas herramientas, alguien termina haciendo de puente manual entre sistemas: copia un dato de un lado, lo pega en otro y reza para que no se desincronice. El costo no es el copiado, es la demora y el error.
- **Cómo lo abordo**: Defino responsabilidades de cada sistema, permisos, formato de datos, frecuencia de actualización y respuesta ante fallos. Elijo entre integración directa, Apps Script, un servicio intermedio o automatización visual según lo que exista en cada caso, y dejo claro quién es el dueño de cada dato. Cuando la integración toca Meta o TikTok, se trabaja con sus APIs oficiales y los permisos autorizados, no con agentes que operen las cuentas por métodos no oficiales ni con simulaciones de navegación.
- **En una línea**: Sistemas que se hablan entre sí con reglas claras, no con copias manuales.
- **Qué entrego** (7): Conexiones entre APIs y servicios; Integraciones con Google Workspace; Plataformas de pago; Servicios de comunicación; Sincronización entre sistemas; Flujos con controles de error; Almacenamiento y consulta
- **Tecnologías** (13): Google Sheets, Google Drive, Google Calendar, Google Apps Script, Firebase, Google Cloud, BigQuery, APIs REST, OAuth, Pasarelas de pago, Servicios de comunicación, CRM, Cloudflare Workers
- **Proyectos realizados**: ListoPorHoy; kokeAI; Flor de Almendro
- **Herramientas propias**: —
- **Nota de alcance**: Las integraciones conectan herramientas que el cliente ya utiliza; no obligan a reemplazar toda la operación.
- **CTA**: «¿Qué sistemas tienes que unir a mano?» → *Conectar mis sistemas* → `/contacto/`

#### IA aplicada con criterio — `/servicios/ia-aplicada/`

- **Lead**: Trabajo con modelos locales y servicios externos según privacidad, precisión, costo y rendimiento. La IA entra donde aporta valor y queda dentro de un proceso verificable, con revisión humana y sin prometer más de lo que un modelo puede hacer.
- **Qué problema resuelvo**: Clasificar texto, extraer información, analizar documentos o preparar contenido puede requerir modelos; otros problemas funcionan mejor con reglas simples. La pregunta correcta no es «¿puedo usar IA?», sino «¿qué parte de esta tarea se resuelve mejor con un modelo y cuál con una regla?».
- **Cómo lo abordo**: Evalúo dónde se ejecutan los datos, qué grado de revisión necesita la salida y qué ocurre cuando el modelo se equivoca. No prometo ejecución local en flujos que dependen de servicios externos, y no presento como inteligencia artificial una automatización tradicional que ya funcionaba. Cuando la tarea lo pide, construyo la aplicación propia que la sostiene.
- **En una línea**: IA dentro de un proceso que se puede revisar, medir y corregir, no una demo suelta.
- **Qué entrego** (10): Integración de modelos mediante API; Procesamiento de documentos; Clasificación y extracción de información; Generación asistida de contenido; Producción de guiones; Generación de imágenes y recursos audiovisuales; Aplicaciones propias conectadas a modelos; Orquestación de agentes y herramientas; Voz y subtítulos con aplicaciones auxiliares; Validación y supervisión de resultados
- **Tecnologías** (12): Gemini API, Google AI Studio, NotebookLM, Nano Banana, Google Flow, Google Flow Music, Ollama, LM Studio, Gemma, Qwen, DeepSeek, Python
- **Proyectos realizados**: ImpulsaCV; RRSS
- **Herramientas propias**: —
- **Nota de alcance**: Una automatización tradicional no se presenta como inteligencia artificial cuando no lo es.
- **CTA**: «¿Dónde te serviría la IA de verdad?» → *Revisar un caso con IA* → `/contacto/`

#### Soporte técnico — `/servicios/soporte-ti/`

- **Lead**: Diagnóstico y puesta en marcha de equipos y software, en el lugar o a distancia. Atiendo lo que está fallando, documento lo que encontré y dejo el equipo funcionando y explicado, no resuelto a medias.
- **Qué problema resuelvo**: Un equipo, una instalación o una configuración problemática puede detener una tarea entera. Lo que suele faltar no es la acción, sino saber qué está pasando antes de cambiar nada y dejar registro de lo que se hizo.
- **Cómo lo abordo**: Reviso la necesidad, acuerdo el alcance y el acceso, realizo el levantamiento técnico necesario, documento los hallazgos y explico los siguientes pasos. Trabajo presencialmente o de forma remota según lo que permita el caso, y dejo cada equipo en un estado conocido y reproducible.
- **En una línea**: Equipos y software que vuelven a funcionar, con lo encontrado y lo hecho anotado.
- **Qué entrego** (9): Atención presencial y remota; Diagnóstico de equipos; Instalación y configuración de software; Formateo y reinstalación de sistemas; Carga y restauración de imágenes de sistema; Instalación de controladores; Configuración de equipos y periféricos; Resolución de incidencias; Levantamientos e informes técnicos
- **Tecnologías** (4): Windows, Herramientas locales, Informes HTML, Inventario técnico
- **Herramientas propias**: AuditaPC; Nokto
- **Nota de alcance**: El alcance covers configuración y puesta en marcha; no incluye reparación de hardware ni recuperación de información.
- **CTA**: «¿Un equipo que no está funcionando como debería?» → *Revisar mi equipo* → `/contacto/`

#### Gestión de redes sociales — `/servicios/redes-sociales/`

- **Lead**: Organizo contigo el trabajo de contenido: las ideas, el calendario, la preparación de las publicaciones y la revisión de lo que funcionó. Un perfil ordenado se sostiene; uno improvisado se abandona.
- **Qué problema resuelvo**: Publicar de forma irregular y a la carrera produce un perfil que no dice nada y una carga de trabajo que se termina abandonando. El problema no suele ser la falta de ideas, sino la falta de un proceso que se pueda sostener con el tiempo disponible.
- **Cómo lo abordo**: Partimos por tus perfiles, el público al que quieres llegar y los recursos que ya tienes. Acordamos qué puedo asumir y qué necesita tu aprobación, y de ahí sale un calendario que se puede mantener en lugar de uno que se abandona a la segunda semana.
- **En una línea**: Contenido planificado y publicado con un proceso que se sostiene en el tiempo.
- **Qué entrego** (7): Generación de publicaciones desde información existente; Generación y composición de contenido; Calendario editorial; Publicación e integraciones; Registro y seguimiento; Revisión de resultados; Producción audiovisual
- **Tecnologías** (11): Gemini API, Google AI Studio, Pillow, Nano Banana, Google Flow, Google Flow Music, CapCut, Python, Google Sheets, Google Apps Script, Google Drive
- **Proyectos realizados**: RRSS; ListoPorHoy
- **Herramientas propias**: —
- **Nota de alcance**: Esta área es editorial. Los bots de consultas y reservas pertenecen a Automatización de procesos.
- **CTA**: «¿Tu contenido depende de que alguien tenga tiempo?» → *Planificar mi contenido* → `/contacto/`

---

## 3. Tecnologías e iconografía

### 3.1 Los cinco bloques del índice

| Grupo | Tecnologías |
|---|---|
| Google Workspace y Cloud | Google Sheets, Google Drive, Google Calendar, Google Apps Script, Google Cloud, BigQuery, Firebase, Google Cloud SDK / CLI |
| Datos y Business Intelligence | Python, Excel, Power Query, Power BI, Tableau, Looker Studio |
| Desarrollo e integraciones | React, Vite, TypeScript, Hono, Cloudflare Workers, Cloudflare D1, APIs REST, OAuth |
| Inteligencia artificial y contenido | Gemini API, Google AI Studio, NotebookLM, Nano Banana, Google Flow, Google Flow Music, Pillow, CapCut |
| Automatización | n8n, Make, Python, Apps Script |

**34 tecnologías en el índice**, todas con icono SVG local.

### 3.2 Set de iconos

`assets/tech-icons/` queda con **49 iconos** de 32×32: los 11 que ya existían (Python, Google Sheets, Google Drive, Google Apps Script, Gemini, Google AI Studio, Nano Banana, Pillow, Meta Graph API, Google Flow y CapCut) más **38 creados** para esta consolidación.

|Nuevo icono | Propósito |
|---|---|
| `google-calendar.svg` | Calendario de Google |
| `google-cloud.svg` | Google Cloud |
| `google-cloud-cli.svg` | Consola y SDK de Google Cloud |
| `bigquery.svg` | BigQuery |
| `firebase.svg` | Firebase |
| `excel.svg` | Microsoft Excel |
| `power-query.svg` | Power Query |
| `power-bi.svg` | Power BI |
| `tableau.svg` | Tableau |
| `looker-studio.svg` | Looker Studio |
| `react.svg` | React |
| `vite.svg` | Vite |
| `typescript.svg` | TypeScript |
| `hono.svg` | Hono |
| `cloudflare-workers.svg` | Cloudflare Workers |
| `cloudflare-d1.svg` | Cloudflare D1 |
| `apis-rest.svg` | APIs REST |
| `oauth.svg` | OAuth |
| `notebooklm.svg` | NotebookLM |
| `google-flow-music.svg` | Google Flow Music |
| `ollama.svg` | Ollama |
| `lm-studio.svg` | LM Studio |
| `gemma.svg` | Gemma |
| `qwen.svg` | Qwen |
| `deepseek.svg` | DeepSeek |
| `windows.svg` | Windows |
| `herramientas-locales.svg` | Herramientas locales |
| `informes-html.svg` | Informes HTML |
| `inventario-tecnico.svg` | Inventario técnico |
| `calendario-editorial.svg` | Calendario editorial |
| `programacion-publicaciones.svg` | Programación de publicaciones |
| `metricas-plataforma.svg` | Métricas por plataforma |
| `hojas-calendario.svg` | Hojas de calendario |
| `pasarelas-pago.svg` | Pasarelas de pago |
| `crm.svg` | CRM |
| `servicios-de-comunicacion.svg` | Servicios de comunicación |
| `n8n.svg` | n8n |
| `make.svg` | Make |

**Criterio de diseño**: rejilla de 32×32, formas planas, color de marca cuando existe y pictograma propio sobre fondo petróleo para los conceptos genéricos (API, OAuth, CRM, herramientas locales, informes, inventario, calendario editorial, programación, métricas, hojas, pasarelas de pago y comunicación). **Son representaciones propias, no logotipos oficiales**, y así se entendió en la documentación del sistema. Ningún emoji, ningún cuadrado de color como sustituto permanente.

**Integración**: el chip compartido `.tag.tech-badge` del sitio ya admitía imagen; las reglas nuevas sólo añaden `.tech-badge--icon` (alineación, separación y tamaño 22×22) y el ocultado del punto de color cuando hay icono. La página de Herramientas y las fichas de proyectos no se tocan.

---

## 4. Qué se publicó y qué quedó fuera

### 4.1 Publicado

| Contenido | Dónde |
|---|---|
| Bots de consultas y atención comercial, asistentes, reservas, membresías, confirmación de pagos y gestión de accesos | Automatización de procesos · entregables |
| Sistema de automatización comercial y membresías, presentado de forma anónima | Automatización de procesos · Proyectos realizados |
| Reportes personalizados, dashboards, indicadores de gestión, ETL, modelos de datos y automatización de informes | Datos, planillas y BI · entregables |
| Power BI, Tableau, Excel, Power Query, Python, BigQuery, Looker Studio y Google Cloud | Datos, planillas y BI · tecnologías |
| Calendarios, CRM, pasarelas de pago, servicios de comunicación y Firebase | Integraciones y APIs · entregables y tecnologías |
| Nota explícita sobre APIs oficiales frente a agentes de navegador en Meta y TikTok | Integraciones y APIs · párrafo «Cómo lo abordo» |
| Guiones, generación audiovisual, voz y subtítulos con aplicación auxiliar | IA aplicada · entregables |
| Atención presencial y remota, formateo, reinstalación, imágenes de sistema, controladores y periféricos | Soporte técnico · entregables |
| Generación de publicaciones desde información existente, con el ejemplo del catálogo de discos | Gestión de redes sociales · entregables |
| Composición con Gemini y Pillow, apoyo visual con Nano Banana, calendario editorial con post, historia o reel y aprobación configurable | Gestión de redes sociales · entregables |
| Registro de programación y horario, con la analítica de alcance presentada como extensión futura | Gestión de redes sociales · entregables |
| Producción audiovisual con Flow, Flow Music y CapCut | Gestión de redes sociales · entregables |
| Flujo de producción, almacenamiento, portal y reproducción de kokeAI | Integraciones y APIs y Gestión de redes sociales · descripciones de los proyectos |

### 4.2 Quedó fuera, con el motivo

| Contenido | Motivo |
|---|---|
| **Exo Dream** | No tiene web pública terminada ni dominio confirmado. No se publica como evidencia en ninguna ficha |
| **Nombre «DriveVipClub»** | Sin autorización para nombrarlo. Se publica como «Sistema de automatización comercial y membresías», sin enlace público |
| **Estado actual del sistema de membresías** | Se documenta como antecedente de la línea; no se afirma que todos sus componentes sigan operativos |
| **Tableau como experiencia demostrada** | No hay proyecto que lo acredite. Se declara como tecnología de trabajo, no como caso |
| **Analítica de likes, comentarios y alcance** | No existe como sistema completo. Se presenta como extensión futura sujeta a APIs y permisos |
| **Reparación de hardware y recuperación de información** | Alcance no confirmado en Soporte técnico |
| **Agentes de navegador sobre cuentas de Meta o TikTok** | No se recomienda: la ficha de Integraciones indica el uso de APIs oficiales y permisos |
| **Tokens, bases de usuarios, campañas y datos comerciales** | Ninguno se publica |

---

## 5. QA

### 5.1 Sección Servicios

**8 páginas × 5 anchos (1440, 1024, 768, 390, 320) × día y noche = 80 combinaciones.**

| Comprobación | Resultado |
|---|---|
| Desbordamiento horizontal | 0 en las 80 combinaciones |
| Iconos de tecnología rotos | 0 |
| Chips de tecnología sin icono | 0 |
| Errores de consola | 0 |
| Navegación desde el índice | las 7 filas llevan a su ficha y muestran su H1 |
| «Otras áreas» | 6 enlaces por ficha, correctos |
| CTA | cada ficha lleva al área correspondiente y a `/contacto/` |
| Modo noche | revisado en las 8 páginas |

### 5.2 Sitio completo

| Prueba | Resultado |
|---|---|
| `python build_site.py` | OK |
| `python qa_smoke.py` | OK — 26 rutas, 24 canónicas, JS deshabilitado y movimiento reducido |
| `node qa_tetris.cjs` | OK — motor completo |
| `python Herramientas/qa_fichas.py` | OK — las nueve fichas de proyectos |
| `git diff --check` | exit 0, sin errores de whitespace |
| `python publish_site.py` | 24 páginas y 2 redirecciones; el `sitemap.xml` incluye las ocho rutas de Servicios y el `robots.txt` sigue granting acceso |

---

## 6. Archivos modificados y creados

### Modificados

| Archivo | Cambio |
|---|---|
| `site_data.py` | Nuevo modelo de servicios: `SERVICES` con descripción, situación, enfoque, entregables, tecnologías, proyectos, herramientas propias, CTA y SEO; `TECNOLOGIAS` con los cinco ecosistemas; `TECH_ICON` con el mapa de iconos |
| `build_site.py` | `tech_chips()`; `services_index()`, `service_detail()` y `social_service()` reescritas; `service_others()`, `service_experience()`, `service_deliverables()`; `service_jsonld()` y `breadcrumb_jsonld()`; `meta()` y `page()` aceptan `jsonld` |
| `assets/site.css` | Componentes de Servicios: chips con icono, ecosistemas, entregables, experiencia, nota de separación, ficha rápida y franja «Otras áreas» |
| `assets/interior.css` | Sin cambios en esta ronda |
| `assets/tool-panel.js` | Sin cambios en esta ronda |

### Creados

| Archivo | Detalle |
|---|---|
| `assets/tech-icons/*.svg` | 49 iconos de tecnología (11 previos + 38 nuevos) |
| `servicios/index.html` y `servicios/<slug>/index.html` | Las ocho páginas generadas |
| `REVISION-SERVICIOS/INFORME-CONSOLIDACION-SERVICIOS.md` | Este informe |
| `REVISION-SERVICIOS/PROPUESTA-CONSOLIDACION-SERVICIOS.md` | Propuesta base de la consolidación |
| `REVISION-SERVICIOS/INFORME-CONTENIDO-SERVICIOS.md` | Auditoría previa |
| `Herramientas/ENTREGA-FICHAS-JMORGADO.zip` | Paquete de entrega regenerado (193 entradas) con las ocho páginas de Servicios y el set completo de iconos |

### Sin tocar

Las páginas de proyectos, sus repositorios, la sección de Herramientas, la landing, la sección de contacto, el método, la calculadora y el juego. Dentro de Servicios, las ocho rutas y el sistema de diagrama Archify tampoco se han tocado.

---

## 7. Integridad del resto del sitio

Se reconstruyó el sitio con el estado anterior a la consolidación y se compararon todas las páginas generadas:

| Grupo | Resultado |
|---|---|
| Portada, proyectos (9 fichas), archivo de proyectos, método, contacto, calculadora, 404, Herramientas | **Idénticas**, salvo el hash de caché de `assets/site.css` |
| Servicios (8 páginas) | Cambian según lo previsto en esta consolidación |

Además, se comprobó que ninguna de las clases CSS nuevas (`.related-item`, `.deliverables`, `.ecosystem-group`, `.service-experience`, `.service-aside`, `.service-note`, `.service-others`, `.tech-badge--icon`, `.service-contact`) aparece fuera de `/servicios/`: no hay efectos colaterales posibles con otras secciones.

---

## Fin del informe

Consolidación de Servicios implementada el 2026-11-10. Todo quedó local, sin commit, sin push y sin despliegue.