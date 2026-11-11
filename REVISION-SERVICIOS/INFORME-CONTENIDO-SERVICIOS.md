# Informe de contenido y estructura — Sección Servicios

**JMorgado · Auditoría y levantamiento de `/servicios/`**

Fecha: 2026-11-10 · Documento de **investigación y documentación**. No se modificó HTML, CSS, JavaScript, Python, textos publicados, URLs ni SEO. Todo el trabajo sigue local, sin commit, sin push y sin despliegue.

Alcance: página principal de Servicios, las siete páginas individuales de servicio, la navegación y los enlaces entre páginas, los componentes visuales compartidos, los textos y llamadas a la acción, y los metadatos y la configuración SEO.

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Inventario de páginas](#2-inventario-de-páginas)
3. [Texto íntegro por página](#3-texto-íntegro-por-página)
4. [Auditoría SEO](#4-auditoría-seo)
5. [Estructura visual y composición](#5-estructura-visual-y-composición)
6. [Enlaces, navegación y proyectos relacionados](#6-enlaces-navegación-y-proyectos-relacionados)
7. [Funcionalidades y tecnologías identificadas](#7-funcionalidades-y-tecnologías-identificadas)
8. [Decisiones preliminares registradas](#8-decisiones-preliminares-registradas)
9. [Oportunidades de mejora](#9-oportunidades-de-mejora)
10. [Información que falta verificar](#10-información-que-falta-verificar)
11. [Recomendaciones para la siguiente etapa](#11-recomendaciones-para-la-siguiente-etapa)
12. [Anexo — inventario de textos](#12-anexo--inventario-de-textos)

---

## 1. Resumen ejecutivo

La sección Servicios está compuesta por **ocho páginas**: un índice de áreas de trabajo y siete fichas de servicio. Todas se generan desde un único par de archivos:

- `site_data.py::SERVICES` (líneas 223–234): los datos de las siete áreas.
- `build_site.py::services_index()` (líneas 1209–1224), `build_site.py::social_service()` (líneas 1225–1240) y `build_site.py::service_detail()` (líneas 1242–1269): las plantillas.

**Hallazgos principales de esta auditoría:**

1. El índice y las fichas se construyen con un mismo patrón, pero la ficha de **Gestión de redes sociales** usa una plantilla propia (`social_service`), con tres bloques en vez de cuatro y sin los apartados «Problema y enfoque», «Experiencia demostrada» ni «Tecnologías utilizadas».
2. La sección se presenta como siete áreas, pero la portada ya nombra en su texto introductorio cinco: «Desarrollo web, datos, automatización, soporte y gestión de redes sociales». **Integraciones e IA aplicada no se nombran** en ese párrafo, aunque sí tienen ficha.
3. El título SEO del índice es «Servicios de automatización, desarrollo, datos e IA aplicada» y su meta description menciona «n8n y Make», que no aparecen en ninguna ficha de servicio: es la única mención de esas herramientas en toda la sección.
4. La etiqueta de **Servicios** del encabezado (`site_data.py::SERVICES`) es el punto donde vive el nombre público de cada área; el nombre «Soporte técnico independiente» está sólo ahí y en el `title` SEO de su ficha.
5. No existe ningún dato estructurado (JSON-LD) en la sección. Tampoco hay `robots.txt` ni `sitemap.xml` en el repositorio: se generan al publicar (`publish_site.py`, líneas 34–36).
6. Todas las páginas comparten el pie de sitio completo, con cuatro enlaces de navegación contextual, cinco de recursos y tres de contacto.

---

## 2. Inventario de páginas

Rutas identificadas **desde el código** (`site_data.py::SERVICES` y `build_site.py`), no desde la navegación visible. Coinciden con las generadas en el repositorio y con las incluidas en el `sitemap.xml` de publicación.

| # | Ruta | Archivo fuente | Título SEO | Generada por |
|---|---|---|---|---|
| 1 | `/servicios/` | `build_site.py::services_index()` L1209 | Servicios de automatización, desarrollo, datos e IA aplicada \| JMorgado | `build_site.py::services_index()` L1209 |
| 2 | `/servicios/automatizacion/` | `site_data.py` L224 | Automatización de procesos — JMorgado \| JMorgado | `build_site.py::service_detail()` L1242 |
| 3 | `/servicios/datos-y-bi/` | `site_data.py` L226 | Datos, planillas y BI — JMorgado \| JMorgado | `build_site.py::service_detail()` L1242 |
| 4 | `/servicios/desarrollo-web/` | `site_data.py` L225 | Desarrollo web y plataformas — JMorgado \| JMorgado | `build_site.py::service_detail()` L1242 |
| 5 | `/servicios/ia-aplicada/` | `site_data.py` L228 | IA aplicada con criterio — JMorgado \| JMorgado | `build_site.py::service_detail()` L1242 |
| 6 | `/servicios/integraciones/` | `site_data.py` L227 | Integraciones y APIs — JMorgado \| JMorgado | `build_site.py::service_detail()` L1242 |
| 7 | `/servicios/redes-sociales/` | `site_data.py` L230 | Gestión de redes sociales \| JMorgado | `build_site.py::service_detail()` L1242 + `social_service()` L1225 |
| 8 | `/servicios/soporte-ti/` | `site_data.py` L229 | Soporte técnico independiente — JMorgado \| JMorgado | `build_site.py::service_detail()` L1242 |

**Páginas relacionadas con la sección, fuera de `/servicios/`:**

- `/` — portada: la sección aparece en la home como «Herramientas propias» y en el menú.
- `/proyectos/` — archivo de proyectos: cada ficha de servicio enlaza a trabajos concretos.
- `/herramientas/` — software propio abierto.
- `/metodo/` — «Conocer el método», destino del CTA del índice.
- `/contacto/` — destino del CTA de cada ficha de servicio.
- `/calculadora/`, `/jugar/` — enlazados desde el pie de sitio.

**Rutas heredadas que ya no existen como fichas:** `proyectos/auditapc/` y `proyectos/nokto/` son reescrituras a `herramientas/#auditapc` y `herramientas/#nokto` (`build_site.py::redirect_legacy_tools()`, L407–419). No pertenecen a Servicios, pero conviene no confundirlas.

---

## 3. Texto íntegro por página

Todo el texto visible, **en orden de aparición**, tal como está publicado. La columna «Origen» indica el archivo y la línea del código donde se define; `—` significa que el texto es parte de la plantilla de `build_site.py` y se repite en todas las páginas (cabecera, pie, botones).

### 3.1 Servicios (índice)

- **URL**: `/servicios/`
- **Archivo generado**: `servicios/index.html`
- **Título SEO**: `Servicios de automatización, desarrollo, datos e IA aplicada | JMorgado`
- **Meta description**: `Servicios profesionales de JMorgado: automatización con Python, n8n y Make, desarrollo web, dashboards, integraciones, IA aplicada y soporte técnico.`
- **Canonical**: `https://jmorgadodev.github.io/servicios/`
- **robots**: `index,follow`

**Jerarquía de encabezados**

- `h1` En qué puedo ayudarte.
- `h3` Automatización de procesos
- `h3` Desarrollo web y plataformas
- `h3` Datos, planillas y BI
- `h3` Integraciones y APIs
- `h3` IA aplicada con criterio
- `h3` Soporte técnico independiente
- `h3` Gestión de redes sociales
- `h2` La conversación inicial no tiene costo.
- `h2` Trabajo
- `h2` Recursos
- `h2` Contacto

**Estructura de secciones**

- `<section class="page-hero service-map-hero">`
- `<section class="section service-map">`
- `<section class="ink-panel">`

**Texto completo, en orden de aparición**

| # | Elemento | Texto | Origen |
|---|---|---|---|
| 1 | `span .wordmark` | jm | `build_site.py` L33 → `../#home-start` |
| 2 | `span .wordmark` | JMorgado | `build_site.py` L1 → `../#home-start` |
| 3 | `span .wordmark` | . | plantilla → `../#home-start` |
| 4 | `div` | Desarrollo independiente | `build_site.py` L81 |
| 5 | `br` | Software, datos y procesos | `build_site.py` L81 |
| 6 | `button` | Menú + | `build_site.py` L110 |
| 7 | `button` | Noche | `build_site.py` L111 |
| 8 | `a` | Herramientas | `build_site.py` L61 → `../herramientas/` |
| 9 | `a` | Proyectos | `build_site.py` L61 → `../proyectos/` |
| 10 | `a` | Servicios | `build_site.py` L61 → `../servicios/` |
| 11 | `a .nav-contact` | Contacto | `build_site.py` L61 → `../contacto/` |
| 12 | `a` | Inicio | `build_site.py` L206 → `../` |
| 13 | `span` | / | `build_site.py` L3 |
| 14 | `span` | Servicios | `build_site.py` L61 |
| 15 | `span` | Soluciones según tu necesidad | `build_site.py` L1216 |
| 16 | `h1` | En qué puedo ayudarte | `build_site.py` L1217 |
| 17 | `span` | . | plantilla |
| 18 | `p` | Desarrollo web, datos, automatización, soporte y gestión de redes sociales. Cada servicio explica qué puedo tomar a cargo y qué necesitamos acordar. | `build_site.py` L1218 |
| 19 | `span` | 01 · Áreas de trabajo | plantilla |
| 20 | `span .service-line` | 01. | plantilla → `../servicios/automatizacion/` |
| 21 | `h3 .service-line` | Automatización de procesos | `site_data.py` L224 → `../servicios/automatizacion/` |
| 22 | `p .service-line` | Quitar trabajo repetitivo sin crear un sistema innecesario. | `site_data.py` L224 → `../servicios/automatizacion/` |
| 23 | `span .service-line` | 02. | plantilla → `../servicios/desarrollo-web/` |
| 24 | `h3 .service-line` | Desarrollo web y plataformas | `site_data.py` L225 → `../servicios/desarrollo-web/` |
| 25 | `p .service-line` | De una web comercial a una aplicación con usuarios y lógica propia. | `site_data.py` L225 → `../servicios/desarrollo-web/` |
| 26 | `span .service-line` | 03. | `build_site.py` L70 → `../servicios/datos-y-bi/` |
| 27 | `h3 .service-line` | Datos, planillas y BI | `site_data.py` L226 → `../servicios/datos-y-bi/` |
| 28 | `p .service-line` | De archivos dispersos a información que se puede trabajar. | `site_data.py` L226 → `../servicios/datos-y-bi/` |
| 29 | `span .service-line` | 04. | `build_site.py` L198 → `../servicios/integraciones/` |
| 30 | `h3 .service-line` | Integraciones y APIs | `site_data.py` L227 → `../servicios/integraciones/` |
| 31 | `p .service-line` | Conectar herramientas que ya forman parte del negocio. | `site_data.py` L227 → `../servicios/integraciones/` |
| 32 | `span .service-line` | 05. | `build_site.py` L71 → `../servicios/ia-aplicada/` |
| 33 | `h3 .service-line` | IA aplicada con criterio | `site_data.py` L228 → `../servicios/ia-aplicada/` |
| 34 | `p .service-line` | Modelos y agentes cuando aportan valor, no por tendencia. | `site_data.py` L228 → `../servicios/ia-aplicada/` |
| 35 | `span .service-line` | 06. | `build_site.py` L72 → `../servicios/soporte-ti/` |
| 36 | `h3 .service-line` | Soporte técnico independiente | `site_data.py` L229 → `../servicios/soporte-ti/` |
| 37 | `p .service-line` | Diagnóstico, levantamientos y resolución de incidencias concretas. | `site_data.py` L229 → `../servicios/soporte-ti/` |
| 38 | `span .service-line` | 07. | plantilla → `../servicios/redes-sociales/` |
| 39 | `h3 .service-line` | Gestión de redes sociales | `site_data.py` L230 → `../servicios/redes-sociales/` |
| 40 | `p .service-line` | Planificar contenido, organizar publicaciones y revisar qué está funcionando. | `site_data.py` L231 → `../servicios/redes-sociales/` |
| 41 | `span` | 02 · Qué incluye el primer contacto | plantilla |
| 42 | `h2` | La conversación inicial no tiene costo. | `build_site.py` L1222 |
| 43 | `p` | Es una orientación para conocer la tarea y sus restricciones. Una auditoría o intervención técnica se acuerda por separado. | `build_site.py` L1222 |
| 44 | `a .button` | Conocer el método | `build_site.py` L1223 → `../metodo/` |
| 45 | `h2` | Trabajo | `build_site.py` L150 |
| 46 | `a` | Proyectos | `build_site.py` L61 → `../proyectos/` |
| 47 | `a` | Servicios | `build_site.py` L61 → `../servicios/` |
| 48 | `a` | Método | `build_site.py` L151 → `../metodo/` |
| 49 | `h2` | Recursos | `build_site.py` L152 |
| 50 | `a` | Herramientas | `build_site.py` L61 → `../herramientas/` |
| 51 | `a` | Calculadora | `build_site.py` L153 → `../calculadora/` |
| 52 | `a` | Pausa de Tetris | `build_site.py` L153 → `../jugar/` |
| 53 | `h2` | Contacto | `build_site.py` L61 |
| 54 | `a .footer-external` | WhatsApp | `build_site.py` L146 → `https://wa.me/56933904330` |
| 55 | `a .footer-external` | LinkedIn | `build_site.py` L155 → `https://www.linkedin.com/in/jorge-morgado/` |
| 56 | `a` | Agendar una hora | `build_site.py` L156 → `../contacto/#agenda` |
| 57 | `span` | © JMorgado | `build_site.py` L158 |
| 58 | `a` | Volver arriba ↑ | `build_site.py` L158 → `#contenido` |

---

### 3.2 Automatización de procesos

- **URL**: `/servicios/automatizacion/`
- **Archivo generado**: `servicios/automatizacion/index.html`
- **Título SEO**: `Automatización de procesos — JMorgado | JMorgado`
- **Meta description**: `Cuando una misma tarea pasa por planillas, correos y aplicaciones, la solución puede ser una fórmula, una rutina de Python, un flujo en Make o una integración de API.`
- **Canonical**: `https://jmorgadodev.github.io/servicios/automatizacion/`
- **robots**: `index,follow`

**Jerarquía de encabezados**

- `h1` Automatización de procesos.
- `h2` Qué situación abordo.
- `h3` Cómo decido la solución
- `h2` Trabajos que aportan contexto.
- `h2` ¿Tienes un proceso parecido?
- `h2` Trabajo
- `h2` Recursos
- `h2` Contacto

**Estructura de secciones**

- `<section class="page-hero service-detail-hero">`
- `<section class="section service-detail-brief">`
- `<section class="section">`
- `<section class="section">`

**Texto completo, en orden de aparición**

| # | Elemento | Texto | Origen |
|---|---|---|---|
| 1 | `span .wordmark` | jm | `build_site.py` L33 → `../../#home-start` |
| 2 | `span .wordmark` | JMorgado | `build_site.py` L1 → `../../#home-start` |
| 3 | `span .wordmark` | . | plantilla → `../../#home-start` |
| 4 | `div` | Desarrollo independiente | `build_site.py` L81 |
| 5 | `br` | Software, datos y procesos | `build_site.py` L81 |
| 6 | `button` | Menú + | `build_site.py` L110 |
| 7 | `button` | Noche | `build_site.py` L111 |
| 8 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 9 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 10 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 11 | `a .nav-contact` | Contacto | `build_site.py` L61 → `../../contacto/` |
| 12 | `a` | Inicio | `build_site.py` L206 → `../../` |
| 13 | `span` | / | `build_site.py` L3 |
| 14 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 15 | `span` | / | `build_site.py` L3 |
| 16 | `span` | Automatización de procesos | `site_data.py` L224 |
| 17 | `span` | Soluciones a medida | `build_site.py` L1255 |
| 18 | `h1` | Automatización de procesos | `site_data.py` L224 |
| 19 | `span` | . | plantilla |
| 20 | `p` | Cuando una misma tarea pasa por planillas, correos y aplicaciones, la solución puede ser una fórmula, una rutina de Python, un flujo en Make o una integración de API. | `site_data.py` L224 |
| 21 | `span` | Evaluación caso a caso | `build_site.py` L1256 |
| 22 | `span` | Primer diagnóstico conversado: gratuito | `build_site.py` L1256 |
| 23 | `span` | 01 · Problema y enfoque | plantilla |
| 24 | `h2` | Qué situación abordo. | `build_site.py` L1258 |
| 25 | `p` | Copiar registros, validar datos, transferir información y preparar reportes de forma repetitiva consume horas y eleva el riesgo de errores. | `site_data.py` L224 |
| 26 | `h3` | Cómo decido la solución | `build_site.py` L1259 |
| 27 | `p` | Primero entiendo el proceso, su frecuencia, quién lo ejecuta y qué excepciones aparecen. Luego evalúo desde Power Query y Apps Script hasta n8n, Make o código, según el costo de mantenimiento y las condiciones del cliente. | `site_data.py` L224 |
| 28 | `p` | Ejemplos de entregables según alcance | `build_site.py` L1260 |
| 29 | `li` | Automatización de tareas entre herramientas | `site_data.py` L224 |
| 30 | `li` | Procesamiento y validación de datos | `site_data.py` L224 |
| 31 | `li` | Registros y control de excepciones | `site_data.py` L224 |
| 32 | `li` | Documentación de operación | `site_data.py` L224 |
| 33 | `p` | Tecnologías utilizadas en esta línea | `build_site.py` L1261 |
| 34 | `span` | Python | `site_data.py` L7 |
| 35 | `span` | n8n / Make | `site_data.py` L224 |
| 36 | `span` | Apps Script | `site_data.py` L13 |
| 37 | `span` | Excel / Power Query | `site_data.py` L224 |
| 38 | `span` | APIs | `site_data.py` L7 |
| 39 | `p` | La selección final depende del problema; no todas las herramientas se usan en todos los encargos. | `build_site.py` L1262 |
| 40 | `span` | 02 · Experiencia demostrada | plantilla |
| 41 | `h2` | Trabajos que aportan contexto. | `build_site.py` L1264 |
| 42 | `p` | No son promesas de resultados: permiten revisar tipos de sistemas y decisiones técnicas que ya he trabajado. | `build_site.py` L1264 |
| 43 | `span` | RRSS | `site_data.py` L13 → `../../proyectos/kooke-rrss/` |
| 44 | `span` | ListoPorHoy | `site_data.py` L8 → `../../proyectos/conecta/` |
| 45 | `span` | AuditaPC | `site_data.py` L34 → `../../herramientas/#auditapc` |
| 46 | `span` | Contacto | `build_site.py` L61 |
| 47 | `h2` | ¿Tienes un proceso parecido? | `build_site.py` L1266 |
| 48 | `p` | Cuéntame qué haces hoy y qué necesitas cambiar. La primera conversación es gratuita. | `build_site.py` L1267 |
| 49 | `a .button` | Revisemos tu caso | `build_site.py` L1268 → `../../contacto/` |
| 50 | `h2` | Trabajo | `build_site.py` L150 |
| 51 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 52 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 53 | `a` | Método | `build_site.py` L151 → `../../metodo/` |
| 54 | `h2` | Recursos | `build_site.py` L152 |
| 55 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 56 | `a` | Calculadora | `build_site.py` L153 → `../../calculadora/` |
| 57 | `a` | Pausa de Tetris | `build_site.py` L153 → `../../jugar/` |
| 58 | `h2` | Contacto | `build_site.py` L61 |
| 59 | `a .footer-external` | WhatsApp | `build_site.py` L146 → `https://wa.me/56933904330` |
| 60 | `a .footer-external` | LinkedIn | `build_site.py` L155 → `https://www.linkedin.com/in/jorge-morgado/` |
| 61 | `a` | Agendar una hora | `build_site.py` L156 → `../../contacto/#agenda` |
| 62 | `span` | © JMorgado | `build_site.py` L158 |
| 63 | `a` | Volver arriba ↑ | `build_site.py` L158 → `#contenido` |

---

### 3.3 Datos, planillas y BI

- **URL**: `/servicios/datos-y-bi/`
- **Archivo generado**: `servicios/datos-y-bi/index.html`
- **Título SEO**: `Datos, planillas y BI — JMorgado | JMorgado`
- **Meta description**: `Ordeno flujos de datos, depuro y combino fuentes, y preparo reportes y paneles que ayuden a interpretar la operación sin rehacer procesos manuales.`
- **Canonical**: `https://jmorgadodev.github.io/servicios/datos-y-bi/`
- **robots**: `index,follow`

**Jerarquía de encabezados**

- `h1` Datos, planillas y BI.
- `h2` Qué situación abordo.
- `h3` Cómo decido la solución
- `h2` Trabajos que aportan contexto.
- `h2` ¿Tienes un proceso parecido?
- `h2` Trabajo
- `h2` Recursos
- `h2` Contacto

**Estructura de secciones**

- `<section class="page-hero service-detail-hero">`
- `<section class="section service-detail-brief">`
- `<section class="section">`
- `<section class="section">`

**Texto completo, en orden de aparición**

| # | Elemento | Texto | Origen |
|---|---|---|---|
| 1 | `span .wordmark` | jm | `build_site.py` L33 → `../../#home-start` |
| 2 | `span .wordmark` | JMorgado | `build_site.py` L1 → `../../#home-start` |
| 3 | `span .wordmark` | . | plantilla → `../../#home-start` |
| 4 | `div` | Desarrollo independiente | `build_site.py` L81 |
| 5 | `br` | Software, datos y procesos | `build_site.py` L81 |
| 6 | `button` | Menú + | `build_site.py` L110 |
| 7 | `button` | Noche | `build_site.py` L111 |
| 8 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 9 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 10 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 11 | `a .nav-contact` | Contacto | `build_site.py` L61 → `../../contacto/` |
| 12 | `a` | Inicio | `build_site.py` L206 → `../../` |
| 13 | `span` | / | `build_site.py` L3 |
| 14 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 15 | `span` | / | `build_site.py` L3 |
| 16 | `span` | Datos, planillas y BI | `site_data.py` L226 |
| 17 | `span` | Soluciones a medida | `build_site.py` L1255 |
| 18 | `h1` | Datos, planillas y BI | `site_data.py` L226 |
| 19 | `span` | . | plantilla |
| 20 | `p` | Ordeno flujos de datos, depuro y combino fuentes, y preparo reportes y paneles que ayuden a interpretar la operación sin rehacer procesos manuales. | `site_data.py` L226 |
| 21 | `span` | Evaluación caso a caso | `build_site.py` L1256 |
| 22 | `span` | Primer diagnóstico conversado: gratuito | `build_site.py` L1256 |
| 23 | `span` | 01 · Problema y enfoque | plantilla |
| 24 | `h2` | Qué situación abordo. | `build_site.py` L1258 |
| 25 | `p` | Varias versiones de una planilla, columnas inconsistentes o reportes montados a mano dificultan el seguimiento de cualquier operación. | `site_data.py` L226 |
| 26 | `h3` | Cómo decido la solución | `build_site.py` L1259 |
| 27 | `p` | Reviso qué datos existen, cómo se relacionan y qué decisiones deben respaldar. Utilizo la tecnología más proporcional: Excel, Power Query, Python, Power BI, BigQuery o Looker Studio. | `site_data.py` L226 |
| 28 | `p` | Ejemplos de entregables según alcance | `build_site.py` L1260 |
| 29 | `li` | Consolidación y limpieza de archivos | `site_data.py` L226 |
| 30 | `li` | Transformaciones y procesos ETL | `site_data.py` L226 |
| 31 | `li` | Dashboards e informes | `site_data.py` L226 |
| 32 | `li` | Modelos de datos y automatizaciones | `site_data.py` L226 |
| 33 | `p` | Tecnologías utilizadas en esta línea | `build_site.py` L1261 |
| 34 | `img` | Excel | `site_data.py` L224 |
| 35 | `img` | Power Query | `site_data.py` L224 |
| 36 | `span` | Python | `site_data.py` L7 |
| 37 | `img` | Power BI | `site_data.py` L226 |
| 38 | `span` | GCP / BigQuery | `site_data.py` L226 |
| 39 | `span` | Looker Studio | `site_data.py` L226 |
| 40 | `p` | La selección final depende del problema; no todas las herramientas se usan en todos los encargos. | `build_site.py` L1262 |
| 41 | `span` | 02 · Experiencia demostrada | plantilla |
| 42 | `h2` | Trabajos que aportan contexto. | `build_site.py` L1264 |
| 43 | `p` | No son promesas de resultados: permiten revisar tipos de sistemas y decisiones técnicas que ya he trabajado. | `build_site.py` L1264 |
| 44 | `span` | El Cambiómetro | `site_data.py` L7 → `../../proyectos/el-cambiometro/` |
| 45 | `span` | Flor de Almendro | `site_data.py` L10 → `../../proyectos/flor-de-almendro/` |
| 46 | `span` | Contacto | `build_site.py` L61 |
| 47 | `h2` | ¿Tienes un proceso parecido? | `build_site.py` L1266 |
| 48 | `p` | Cuéntame qué haces hoy y qué necesitas cambiar. La primera conversación es gratuita. | `build_site.py` L1267 |
| 49 | `a .button` | Revisemos tu caso | `build_site.py` L1268 → `../../contacto/` |
| 50 | `h2` | Trabajo | `build_site.py` L150 |
| 51 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 52 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 53 | `a` | Método | `build_site.py` L151 → `../../metodo/` |
| 54 | `h2` | Recursos | `build_site.py` L152 |
| 55 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 56 | `a` | Calculadora | `build_site.py` L153 → `../../calculadora/` |
| 57 | `a` | Pausa de Tetris | `build_site.py` L153 → `../../jugar/` |
| 58 | `h2` | Contacto | `build_site.py` L61 |
| 59 | `a .footer-external` | WhatsApp | `build_site.py` L146 → `https://wa.me/56933904330` |
| 60 | `a .footer-external` | LinkedIn | `build_site.py` L155 → `https://www.linkedin.com/in/jorge-morgado/` |
| 61 | `a` | Agendar una hora | `build_site.py` L156 → `../../contacto/#agenda` |
| 62 | `span` | © JMorgado | `build_site.py` L158 |
| 63 | `a` | Volver arriba ↑ | `build_site.py` L158 → `#contenido` |

---

### 3.4 Desarrollo web y plataformas

- **URL**: `/servicios/desarrollo-web/`
- **Archivo generado**: `servicios/desarrollo-web/index.html`
- **Título SEO**: `Desarrollo web y plataformas — JMorgado | JMorgado`
- **Meta description**: `Construyo interfaces y sistemas web en función de la operación: una web corporativa, un catálogo administrable, un panel de control o un producto digital completo.`
- **Canonical**: `https://jmorgadodev.github.io/servicios/desarrollo-web/`
- **robots**: `index,follow`

**Jerarquía de encabezados**

- `h1` Desarrollo web y plataformas.
- `h2` Qué situación abordo.
- `h3` Cómo decido la solución
- `h2` Trabajos que aportan contexto.
- `h2` ¿Tienes un proceso parecido?
- `h2` Trabajo
- `h2` Recursos
- `h2` Contacto

**Estructura de secciones**

- `<section class="page-hero service-detail-hero">`
- `<section class="section service-detail-brief">`
- `<section class="section">`
- `<section class="section">`

**Texto completo, en orden de aparición**

| # | Elemento | Texto | Origen |
|---|---|---|---|
| 1 | `span .wordmark` | jm | `build_site.py` L33 → `../../#home-start` |
| 2 | `span .wordmark` | JMorgado | `build_site.py` L1 → `../../#home-start` |
| 3 | `span .wordmark` | . | plantilla → `../../#home-start` |
| 4 | `div` | Desarrollo independiente | `build_site.py` L81 |
| 5 | `br` | Software, datos y procesos | `build_site.py` L81 |
| 6 | `button` | Menú + | `build_site.py` L110 |
| 7 | `button` | Noche | `build_site.py` L111 |
| 8 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 9 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 10 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 11 | `a .nav-contact` | Contacto | `build_site.py` L61 → `../../contacto/` |
| 12 | `a` | Inicio | `build_site.py` L206 → `../../` |
| 13 | `span` | / | `build_site.py` L3 |
| 14 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 15 | `span` | / | `build_site.py` L3 |
| 16 | `span` | Desarrollo web y plataformas | `site_data.py` L225 |
| 17 | `span` | Soluciones a medida | `build_site.py` L1255 |
| 18 | `h1` | Desarrollo web y plataformas | `site_data.py` L225 |
| 19 | `span` | . | plantilla |
| 20 | `p` | Construyo interfaces y sistemas web en función de la operación: una web corporativa, un catálogo administrable, un panel de control o un producto digital completo. | `site_data.py` L225 |
| 21 | `span` | Evaluación caso a caso | `build_site.py` L1256 |
| 22 | `span` | Primer diagnóstico conversado: gratuito | `build_site.py` L1256 |
| 23 | `span` | 01 · Problema y enfoque | plantilla |
| 24 | `h2` | Qué situación abordo. | `build_site.py` L1258 |
| 25 | `p` | Una presencia digital no resuelve por sí sola un proceso. A veces hace falta conectar datos, crear permisos o integrar una operación que hoy se realiza manualmente. | `site_data.py` L225 |
| 26 | `h3` | Cómo decido la solución | `build_site.py` L1259 |
| 27 | `p` | Definir objetivos, usuarios y flujos antes de elegir el stack. Arquitectura, frontend, backend, datos e interacción se justifican por lo que la solución debe hacer. | `site_data.py` L225 |
| 28 | `p` | Ejemplos de entregables según alcance | `build_site.py` L1260 |
| 29 | `li` | Sitios y catálogos conectados | `site_data.py` L225 |
| 30 | `li` | Aplicaciones y paneles internos | `site_data.py` L225 |
| 31 | `li` | Experiencias responsive y accesibles | `site_data.py` L225 |
| 32 | `li` | Integración de servicios y formularios | `site_data.py` L225 |
| 33 | `p` | Tecnologías utilizadas en esta línea | `build_site.py` L1261 |
| 34 | `span` | React / Vite | `site_data.py` L6 |
| 35 | `span` | TypeScript | `site_data.py` L225 |
| 36 | `span` | Hono / Workers | `site_data.py` L225 |
| 37 | `span` | Firebase | `site_data.py` L12 |
| 38 | `span` | Cloudflare D1 | `site_data.py` L225 |
| 39 | `p` | La selección final depende del problema; no todas las herramientas se usan en todos los encargos. | `build_site.py` L1262 |
| 40 | `span` | 02 · Experiencia demostrada | plantilla |
| 41 | `h2` | Trabajos que aportan contexto. | `build_site.py` L1264 |
| 42 | `p` | No son promesas de resultados: permiten revisar tipos de sistemas y decisiones técnicas que ya he trabajado. | `build_site.py` L1264 |
| 43 | `span` | ImpulsaCV | `site_data.py` L6 → `../../proyectos/impulsacv/` |
| 44 | `span` | Ryvolt | `site_data.py` L9 → `../../proyectos/ryvolt/` |
| 45 | `span` | Hangar354 | `site_data.py` L12 → `../../proyectos/tobys-warehouse/` |
| 46 | `span` | Contacto | `build_site.py` L61 |
| 47 | `h2` | ¿Tienes un proceso parecido? | `build_site.py` L1266 |
| 48 | `p` | Cuéntame qué haces hoy y qué necesitas cambiar. La primera conversación es gratuita. | `build_site.py` L1267 |
| 49 | `a .button` | Revisemos tu caso | `build_site.py` L1268 → `../../contacto/` |
| 50 | `h2` | Trabajo | `build_site.py` L150 |
| 51 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 52 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 53 | `a` | Método | `build_site.py` L151 → `../../metodo/` |
| 54 | `h2` | Recursos | `build_site.py` L152 |
| 55 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 56 | `a` | Calculadora | `build_site.py` L153 → `../../calculadora/` |
| 57 | `a` | Pausa de Tetris | `build_site.py` L153 → `../../jugar/` |
| 58 | `h2` | Contacto | `build_site.py` L61 |
| 59 | `a .footer-external` | WhatsApp | `build_site.py` L146 → `https://wa.me/56933904330` |
| 60 | `a .footer-external` | LinkedIn | `build_site.py` L155 → `https://www.linkedin.com/in/jorge-morgado/` |
| 61 | `a` | Agendar una hora | `build_site.py` L156 → `../../contacto/#agenda` |
| 62 | `span` | © JMorgado | `build_site.py` L158 |
| 63 | `a` | Volver arriba ↑ | `build_site.py` L158 → `#contenido` |

---

### 3.5 IA aplicada con criterio

- **URL**: `/servicios/ia-aplicada/`
- **Archivo generado**: `servicios/ia-aplicada/index.html`
- **Título SEO**: `IA aplicada con criterio — JMorgado | JMorgado`
- **Meta description**: `Trabajo con modelos locales y servicios externos según precisión, privacidad, rendimiento y costo. La IA se integra dentro de un proceso verificable y con supervisión.`
- **Canonical**: `https://jmorgadodev.github.io/servicios/ia-aplicada/`
- **robots**: `index,follow`

**Jerarquía de encabezados**

- `h1` IA aplicada con criterio.
- `h2` Qué situación abordo.
- `h3` Cómo decido la solución
- `h2` Trabajos que aportan contexto.
- `h2` ¿Tienes un proceso parecido?
- `h2` Trabajo
- `h2` Recursos
- `h2` Contacto

**Estructura de secciones**

- `<section class="page-hero service-detail-hero">`
- `<section class="section service-detail-brief">`
- `<section class="section">`
- `<section class="section">`

**Texto completo, en orden de aparición**

| # | Elemento | Texto | Origen |
|---|---|---|---|
| 1 | `span .wordmark` | jm | `build_site.py` L33 → `../../#home-start` |
| 2 | `span .wordmark` | JMorgado | `build_site.py` L1 → `../../#home-start` |
| 3 | `span .wordmark` | . | plantilla → `../../#home-start` |
| 4 | `div` | Desarrollo independiente | `build_site.py` L81 |
| 5 | `br` | Software, datos y procesos | `build_site.py` L81 |
| 6 | `button` | Menú + | `build_site.py` L110 |
| 7 | `button` | Noche | `build_site.py` L111 |
| 8 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 9 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 10 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 11 | `a .nav-contact` | Contacto | `build_site.py` L61 → `../../contacto/` |
| 12 | `a` | Inicio | `build_site.py` L206 → `../../` |
| 13 | `span` | / | `build_site.py` L3 |
| 14 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 15 | `span` | / | `build_site.py` L3 |
| 16 | `span` | IA aplicada con criterio | `site_data.py` L228 |
| 17 | `span` | Soluciones a medida | `build_site.py` L1255 |
| 18 | `h1` | IA aplicada con criterio | `site_data.py` L228 |
| 19 | `span` | . | plantilla |
| 20 | `p` | Trabajo con modelos locales y servicios externos según precisión, privacidad, rendimiento y costo. La IA se integra dentro de un proceso verificable y con supervisión. | `site_data.py` L228 |
| 21 | `span` | Evaluación caso a caso | `build_site.py` L1256 |
| 22 | `span` | Primer diagnóstico conversado: gratuito | `build_site.py` L1256 |
| 23 | `span` | 01 · Problema y enfoque | plantilla |
| 24 | `h2` | Qué situación abordo. | `build_site.py` L1258 |
| 25 | `p` | Clasificar texto, extraer información, analizar documentos o generar contenido puede requerir modelos; otros problemas funcionan mejor con reglas simples. | `site_data.py` L228 |
| 26 | `h3` | Cómo decido la solución | `build_site.py` L1259 |
| 27 | `p` | Evaluar dónde se ejecutan los datos, qué grado de revisión necesita la salida y qué ocurre cuando el modelo se equivoca. No prometer ejecución local en flujos que dependen de servicios externos. | `site_data.py` L228 |
| 28 | `p` | Ejemplos de entregables según alcance | `build_site.py` L1260 |
| 29 | `li` | Integración de modelos vía API o local | `site_data.py` L228 |
| 30 | `li` | Análisis y clasificación asistidos | `site_data.py` L228 |
| 31 | `li` | Orquestación de agentes y herramientas | `site_data.py` L228 |
| 32 | `li` | Validación y supervisión de resultados | `site_data.py` L228 |
| 33 | `p` | Tecnologías utilizadas en esta línea | `build_site.py` L1261 |
| 34 | `span` | Ollama / LM Studio | `site_data.py` L228 |
| 35 | `span` | Gemma / Qwen / DeepSeek | `site_data.py` L228 |
| 36 | `span` | APIs de modelos | `site_data.py` L228 |
| 37 | `span` | CLI y agentes | `site_data.py` L228 |
| 38 | `span` | Python | `site_data.py` L7 |
| 39 | `p` | La selección final depende del problema; no todas las herramientas se usan en todos los encargos. | `build_site.py` L1262 |
| 40 | `span` | 02 · Experiencia demostrada | plantilla |
| 41 | `h2` | Trabajos que aportan contexto. | `build_site.py` L1264 |
| 42 | `p` | No son promesas de resultados: permiten revisar tipos de sistemas y decisiones técnicas que ya he trabajado. | `build_site.py` L1264 |
| 43 | `span` | ImpulsaCV | `site_data.py` L6 → `../../proyectos/impulsacv/` |
| 44 | `span` | RRSS | `site_data.py` L13 → `../../proyectos/kooke-rrss/` |
| 45 | `span` | Contacto | `build_site.py` L61 |
| 46 | `h2` | ¿Tienes un proceso parecido? | `build_site.py` L1266 |
| 47 | `p` | Cuéntame qué haces hoy y qué necesitas cambiar. La primera conversación es gratuita. | `build_site.py` L1267 |
| 48 | `a .button` | Revisemos tu caso | `build_site.py` L1268 → `../../contacto/` |
| 49 | `h2` | Trabajo | `build_site.py` L150 |
| 50 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 51 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 52 | `a` | Método | `build_site.py` L151 → `../../metodo/` |
| 53 | `h2` | Recursos | `build_site.py` L152 |
| 54 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 55 | `a` | Calculadora | `build_site.py` L153 → `../../calculadora/` |
| 56 | `a` | Pausa de Tetris | `build_site.py` L153 → `../../jugar/` |
| 57 | `h2` | Contacto | `build_site.py` L61 |
| 58 | `a .footer-external` | WhatsApp | `build_site.py` L146 → `https://wa.me/56933904330` |
| 59 | `a .footer-external` | LinkedIn | `build_site.py` L155 → `https://www.linkedin.com/in/jorge-morgado/` |
| 60 | `a` | Agendar una hora | `build_site.py` L156 → `../../contacto/#agenda` |
| 61 | `span` | © JMorgado | `build_site.py` L158 |
| 62 | `a` | Volver arriba ↑ | `build_site.py` L158 → `#contenido` |

---

### 3.6 Integraciones y APIs

- **URL**: `/servicios/integraciones/`
- **Archivo generado**: `servicios/integraciones/index.html`
- **Título SEO**: `Integraciones y APIs — JMorgado | JMorgado`
- **Meta description**: `El objetivo no siempre es crear una aplicación nueva. A veces basta con permitir que la planilla, el catálogo, la base de datos y el servicio externo intercambien información correctamente.`
- **Canonical**: `https://jmorgadodev.github.io/servicios/integraciones/`
- **robots**: `index,follow`

**Jerarquía de encabezados**

- `h1` Integraciones y APIs.
- `h2` Qué situación abordo.
- `h3` Cómo decido la solución
- `h2` Trabajos que aportan contexto.
- `h2` ¿Tienes un proceso parecido?
- `h2` Trabajo
- `h2` Recursos
- `h2` Contacto

**Estructura de secciones**

- `<section class="page-hero service-detail-hero">`
- `<section class="section service-detail-brief">`
- `<section class="section">`
- `<section class="section">`

**Texto completo, en orden de aparición**

| # | Elemento | Texto | Origen |
|---|---|---|---|
| 1 | `span .wordmark` | jm | `build_site.py` L33 → `../../#home-start` |
| 2 | `span .wordmark` | JMorgado | `build_site.py` L1 → `../../#home-start` |
| 3 | `span .wordmark` | . | plantilla → `../../#home-start` |
| 4 | `div` | Desarrollo independiente | `build_site.py` L81 |
| 5 | `br` | Software, datos y procesos | `build_site.py` L81 |
| 6 | `button` | Menú + | `build_site.py` L110 |
| 7 | `button` | Noche | `build_site.py` L111 |
| 8 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 9 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 10 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 11 | `a .nav-contact` | Contacto | `build_site.py` L61 → `../../contacto/` |
| 12 | `a` | Inicio | `build_site.py` L206 → `../../` |
| 13 | `span` | / | `build_site.py` L3 |
| 14 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 15 | `span` | / | `build_site.py` L3 |
| 16 | `span` | Integraciones y APIs | `site_data.py` L227 |
| 17 | `span` | Soluciones a medida | `build_site.py` L1255 |
| 18 | `h1` | Integraciones y APIs | `site_data.py` L227 |
| 19 | `span` | . | plantilla |
| 20 | `p` | El objetivo no siempre es crear una aplicación nueva. A veces basta con permitir que la planilla, el catálogo, la base de datos y el servicio externo intercambien información correctamente. | `site_data.py` L227 |
| 21 | `span` | Evaluación caso a caso | `build_site.py` L1256 |
| 22 | `span` | Primer diagnóstico conversado: gratuito | `build_site.py` L1256 |
| 23 | `span` | 01 · Problema y enfoque | plantilla |
| 24 | `h2` | Qué situación abordo. | `build_site.py` L1258 |
| 25 | `p` | Cuando la información queda aislada en distintas herramientas, alguien termina haciendo de puente manual entre sistemas. | `site_data.py` L227 |
| 26 | `h3` | Cómo decido la solución | `build_site.py` L1259 |
| 27 | `p` | Definir responsabilidades de cada sistema, permisos, formato de datos, frecuencia de actualización y respuesta ante fallos. Elegir integración directa, Apps Script, servicio intermedio o automatización visual. | `site_data.py` L227 |
| 28 | `p` | Ejemplos de entregables según alcance | `build_site.py` L1260 |
| 29 | `li` | Conexiones entre APIs y servicios | `site_data.py` L227 |
| 30 | `li` | Integraciones con Google Workspace | `site_data.py` L227 |
| 31 | `li` | Flujos con controles de error | `site_data.py` L227 |
| 32 | `li` | Almacenamiento y sincronización cuando corresponda | `site_data.py` L227 |
| 33 | `p` | Tecnologías utilizadas en esta línea | `build_site.py` L1261 |
| 34 | `span` | APIs REST | `site_data.py` L227 |
| 35 | `span` | OAuth | `site_data.py` L8 |
| 36 | `span` | Google Sheets | `site_data.py` L10 |
| 37 | `span` | Apps Script | `site_data.py` L13 |
| 38 | `span` | Firebase | `site_data.py` L12 |
| 39 | `span` | Cloudflare Workers | `site_data.py` L6 |
| 40 | `p` | La selección final depende del problema; no todas las herramientas se usan en todos los encargos. | `build_site.py` L1262 |
| 41 | `span` | 02 · Experiencia demostrada | plantilla |
| 42 | `h2` | Trabajos que aportan contexto. | `build_site.py` L1264 |
| 43 | `p` | No son promesas de resultados: permiten revisar tipos de sistemas y decisiones técnicas que ya he trabajado. | `build_site.py` L1264 |
| 44 | `span` | ListoPorHoy | `site_data.py` L8 → `../../proyectos/conecta/` |
| 45 | `span` | Flor de Almendro | `site_data.py` L10 → `../../proyectos/flor-de-almendro/` |
| 46 | `span` | kokeAI | `site_data.py` L13 → `../../proyectos/kooke-portal/` |
| 47 | `span` | Contacto | `build_site.py` L61 |
| 48 | `h2` | ¿Tienes un proceso parecido? | `build_site.py` L1266 |
| 49 | `p` | Cuéntame qué haces hoy y qué necesitas cambiar. La primera conversación es gratuita. | `build_site.py` L1267 |
| 50 | `a .button` | Revisemos tu caso | `build_site.py` L1268 → `../../contacto/` |
| 51 | `h2` | Trabajo | `build_site.py` L150 |
| 52 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 53 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 54 | `a` | Método | `build_site.py` L151 → `../../metodo/` |
| 55 | `h2` | Recursos | `build_site.py` L152 |
| 56 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 57 | `a` | Calculadora | `build_site.py` L153 → `../../calculadora/` |
| 58 | `a` | Pausa de Tetris | `build_site.py` L153 → `../../jugar/` |
| 59 | `h2` | Contacto | `build_site.py` L61 |
| 60 | `a .footer-external` | WhatsApp | `build_site.py` L146 → `https://wa.me/56933904330` |
| 61 | `a .footer-external` | LinkedIn | `build_site.py` L155 → `https://www.linkedin.com/in/jorge-morgado/` |
| 62 | `a` | Agendar una hora | `build_site.py` L156 → `../../contacto/#agenda` |
| 63 | `span` | © JMorgado | `build_site.py` L158 |
| 64 | `a` | Volver arriba ↑ | `build_site.py` L158 → `#contenido` |

---

### 3.7 Gestión de redes sociales

- **URL**: `/servicios/redes-sociales/`
- **Archivo generado**: `servicios/redes-sociales/index.html`
- **Título SEO**: `Gestión de redes sociales | JMorgado`
- **Meta description**: `Organizo contigo el trabajo de contenido, desde las ideas y el calendario hasta la revisión de las publicaciones.`
- **Canonical**: `https://jmorgadodev.github.io/servicios/redes-sociales/`
- **robots**: `index,follow`

**Jerarquía de encabezados**

- `h1` Gestión de redes sociales.
- `h2` Que cada publicación tenga un propósito.
- `h3` Planificar
- `h3` Preparar y publicar
- `h3` Revisar
- `h2` Trabajo
- `h2` Recursos
- `h2` Contacto

**Estructura de secciones**

- `<section class="page-hero social-hero">`
- `<section class="section social-workflow">`

**Texto completo, en orden de aparición**

| # | Elemento | Texto | Origen |
|---|---|---|---|
| 1 | `span .wordmark` | jm | `build_site.py` L33 → `../../#home-start` |
| 2 | `span .wordmark` | JMorgado | `build_site.py` L1 → `../../#home-start` |
| 3 | `span .wordmark` | . | plantilla → `../../#home-start` |
| 4 | `div` | Desarrollo independiente | `build_site.py` L81 |
| 5 | `br` | Software, datos y procesos | `build_site.py` L81 |
| 6 | `button` | Menú + | `build_site.py` L110 |
| 7 | `button` | Noche | `build_site.py` L111 |
| 8 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 9 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 10 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 11 | `a .nav-contact` | Contacto | `build_site.py` L61 → `../../contacto/` |
| 12 | `a` | Inicio | `build_site.py` L206 → `../../` |
| 13 | `span` | / | `build_site.py` L3 |
| 14 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 15 | `span` | / | `build_site.py` L3 |
| 16 | `span` | Gestión de redes sociales | `site_data.py` L230 |
| 17 | `span` | Servicio editorial | `build_site.py` L1228 |
| 18 | `h1` | Gestión de redes sociales | `site_data.py` L230 |
| 19 | `span` | . | plantilla |
| 20 | `p` | Organizo contigo el trabajo de contenido, desde las ideas y el calendario hasta la revisión de las publicaciones. | `site_data.py` L232 |
| 21 | `h2` | Que cada publicación tenga un propósito. | `build_site.py` L1232 |
| 22 | `p` | Partimos por tus perfiles, el público al que quieres llegar y los recursos que ya tienes. Acordamos qué puedo asumir y qué necesita tu aprobación. | `build_site.py` L1232 |
| 23 | `h3` | Planificar | `site_data.py` L14 |
| 24 | `p` | Definir temas, formatos y un calendario que puedas sostener. | `build_site.py` L1234 |
| 25 | `h3` | Preparar y publicar | `build_site.py` L1235 |
| 26 | `p` | Apoyar la creación de textos y piezas, organizar los perfiles y coordinar la revisión antes de publicar. | `build_site.py` L1235 |
| 27 | `h3` | Revisar | `site_data.py` L229 |
| 28 | `p` | Consultar resultados disponibles en cada plataforma y usarlos para ajustar las próximas publicaciones. | `build_site.py` L1236 |
| 29 | `p` | Cuando tiene sentido, puedo automatizar recordatorios o tareas de preparación. Las decisiones de contenido y la aprobación quedan dentro del proceso acordado. | `build_site.py` L1238 |
| 30 | `a .button` | Conversemos | `build_site.py` L1239 → `https://wa.me/56933904330` |
| 31 | `h2` | Trabajo | `build_site.py` L150 |
| 32 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 33 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 34 | `a` | Método | `build_site.py` L151 → `../../metodo/` |
| 35 | `h2` | Recursos | `build_site.py` L152 |
| 36 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 37 | `a` | Calculadora | `build_site.py` L153 → `../../calculadora/` |
| 38 | `a` | Pausa de Tetris | `build_site.py` L153 → `../../jugar/` |
| 39 | `h2` | Contacto | `build_site.py` L61 |
| 40 | `a .footer-external` | WhatsApp | `build_site.py` L146 → `https://wa.me/56933904330` |
| 41 | `a .footer-external` | LinkedIn | `build_site.py` L155 → `https://www.linkedin.com/in/jorge-morgado/` |
| 42 | `a` | Agendar una hora | `build_site.py` L156 → `../../contacto/#agenda` |
| 43 | `span` | © JMorgado | `build_site.py` L158 |
| 44 | `a` | Volver arriba ↑ | `build_site.py` L158 → `#contenido` |

---

### 3.8 Soporte técnico independiente

- **URL**: `/servicios/soporte-ti/`
- **Archivo generado**: `servicios/soporte-ti/index.html`
- **Título SEO**: `Soporte técnico independiente — JMorgado | JMorgado`
- **Meta description**: `Apoyo en problemas de configuración y operación tecnológica, con información clara de lo encontrado y de las acciones realizadas.`
- **Canonical**: `https://jmorgadodev.github.io/servicios/soporte-ti/`
- **robots**: `index,follow`

**Jerarquía de encabezados**

- `h1` Soporte técnico independiente.
- `h2` Qué situación abordo.
- `h3` Cómo decido la solución
- `h2` Trabajos que aportan contexto.
- `h2` ¿Tienes un proceso parecido?
- `h2` Trabajo
- `h2` Recursos
- `h2` Contacto

**Estructura de secciones**

- `<section class="page-hero service-detail-hero">`
- `<section class="section service-detail-brief">`
- `<section class="section">`
- `<section class="section">`

**Texto completo, en orden de aparición**

| # | Elemento | Texto | Origen |
|---|---|---|---|
| 1 | `span .wordmark` | jm | `build_site.py` L33 → `../../#home-start` |
| 2 | `span .wordmark` | JMorgado | `build_site.py` L1 → `../../#home-start` |
| 3 | `span .wordmark` | . | plantilla → `../../#home-start` |
| 4 | `div` | Desarrollo independiente | `build_site.py` L81 |
| 5 | `br` | Software, datos y procesos | `build_site.py` L81 |
| 6 | `button` | Menú + | `build_site.py` L110 |
| 7 | `button` | Noche | `build_site.py` L111 |
| 8 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 9 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 10 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 11 | `a .nav-contact` | Contacto | `build_site.py` L61 → `../../contacto/` |
| 12 | `a` | Inicio | `build_site.py` L206 → `../../` |
| 13 | `span` | / | `build_site.py` L3 |
| 14 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 15 | `span` | / | `build_site.py` L3 |
| 16 | `span` | Soporte técnico independiente | `site_data.py` L229 |
| 17 | `span` | Soluciones a medida | `build_site.py` L1255 |
| 18 | `h1` | Soporte técnico independiente | `site_data.py` L229 |
| 19 | `span` | . | plantilla |
| 20 | `p` | Apoyo en problemas de configuración y operación tecnológica, con información clara de lo encontrado y de las acciones realizadas. | `site_data.py` L229 |
| 21 | `span` | Evaluación caso a caso | `build_site.py` L1256 |
| 22 | `span` | Primer diagnóstico conversado: gratuito | `build_site.py` L1256 |
| 23 | `span` | 01 · Problema y enfoque | plantilla |
| 24 | `h2` | Qué situación abordo. | `build_site.py` L1258 |
| 25 | `p` | Un equipo, una instalación o una configuración problemática puede detener una tarea. La intervención debe identificar hechos antes de recomendar cambios. | `site_data.py` L229 |
| 26 | `h3` | Cómo decido la solución | `build_site.py` L1259 |
| 27 | `p` | Revisar la necesidad, acordar acceso y alcance, realizar el levantamiento técnico necesario, documentar hallazgos y explicar siguientes pasos. | `site_data.py` L229 |
| 28 | `p` | Ejemplos de entregables según alcance | `build_site.py` L1260 |
| 29 | `li` | Diagnóstico inicial y alcance | `site_data.py` L229 |
| 30 | `li` | Levantamiento técnico de equipos | `site_data.py` L229 |
| 31 | `li` | Registro de incidencias | `site_data.py` L229 |
| 32 | `li` | Informes técnicos comprensibles | `site_data.py` L229 |
| 33 | `p` | Tecnologías utilizadas en esta línea | `build_site.py` L1261 |
| 34 | `span` | Windows | `site_data.py` L40 |
| 35 | `span` | Herramientas locales | `site_data.py` L229 |
| 36 | `span` | Informes HTML | `site_data.py` L50 |
| 37 | `span` | Inventario técnico | `site_data.py` L36 |
| 38 | `p` | La selección final depende del problema; no todas las herramientas se usan en todos los encargos. | `build_site.py` L1262 |
| 39 | `span` | 02 · Experiencia demostrada | plantilla |
| 40 | `h2` | Trabajos que aportan contexto. | `build_site.py` L1264 |
| 41 | `p` | No son promesas de resultados: permiten revisar tipos de sistemas y decisiones técnicas que ya he trabajado. | `build_site.py` L1264 |
| 42 | `span` | AuditaPC | `site_data.py` L34 → `../../herramientas/#auditapc` |
| 43 | `span` | Contacto | `build_site.py` L61 |
| 44 | `h2` | ¿Tienes un proceso parecido? | `build_site.py` L1266 |
| 45 | `p` | Cuéntame qué haces hoy y qué necesitas cambiar. La primera conversación es gratuita. | `build_site.py` L1267 |
| 46 | `a .button` | Revisemos tu caso | `build_site.py` L1268 → `../../contacto/` |
| 47 | `h2` | Trabajo | `build_site.py` L150 |
| 48 | `a` | Proyectos | `build_site.py` L61 → `../../proyectos/` |
| 49 | `a` | Servicios | `build_site.py` L61 → `../../servicios/` |
| 50 | `a` | Método | `build_site.py` L151 → `../../metodo/` |
| 51 | `h2` | Recursos | `build_site.py` L152 |
| 52 | `a` | Herramientas | `build_site.py` L61 → `../../herramientas/` |
| 53 | `a` | Calculadora | `build_site.py` L153 → `../../calculadora/` |
| 54 | `a` | Pausa de Tetris | `build_site.py` L153 → `../../jugar/` |
| 55 | `h2` | Contacto | `build_site.py` L61 |
| 56 | `a .footer-external` | WhatsApp | `build_site.py` L146 → `https://wa.me/56933904330` |
| 57 | `a .footer-external` | LinkedIn | `build_site.py` L155 → `https://www.linkedin.com/in/jorge-morgado/` |
| 58 | `a` | Agendar una hora | `build_site.py` L156 → `../../contacto/#agenda` |
| 59 | `span` | © JMorgado | `build_site.py` L158 |
| 60 | `a` | Volver arriba ↑ | `build_site.py` L158 → `#contenido` |

---

## 4. Auditoría SEO

### 4.1 Metadatos por página

| Página | Title | Long. | Meta description | Long. | Canonical | robots |
|---|---|---|---|---|---|---|
| Servicios (índice) | Servicios de automatización, desarrollo, datos e IA aplicada \| JMorgado | 71 | «Servicios profesionales de JMorgado: automatización con Python, n8n y Make, desarrollo web, dashboards, integraciones, IA aplicada y soporte técnico.» | 149 | `https://jmorgadodev.github.io/servicios/` | index,follow |
| Automatización de procesos | Automatización de procesos — JMorgado \| JMorgado ⚠️ | 48 | «Cuando una misma tarea pasa por planillas, correos y aplicaciones, la solución puede ser una fórmula, una rutina de Python, un flujo en Make o una int…» ⚠️ | 166 | `https://jmorgadodev.github.io/servicios/automatizacion/` | index,follow |
| Datos, planillas y BI | Datos, planillas y BI — JMorgado \| JMorgado ⚠️ | 43 | «Ordeno flujos de datos, depuro y combino fuentes, y preparo reportes y paneles que ayuden a interpretar la operación sin rehacer procesos manuales.» | 147 | `https://jmorgadodev.github.io/servicios/datos-y-bi/` | index,follow |
| Desarrollo web y plataformas | Desarrollo web y plataformas — JMorgado \| JMorgado ⚠️ | 50 | «Construyo interfaces y sistemas web en función de la operación: una web corporativa, un catálogo administrable, un panel de control o un producto digi…» ⚠️ | 163 | `https://jmorgadodev.github.io/servicios/desarrollo-web/` | index,follow |
| IA aplicada con criterio | IA aplicada con criterio — JMorgado \| JMorgado ⚠️ | 46 | «Trabajo con modelos locales y servicios externos según precisión, privacidad, rendimiento y costo. La IA se integra dentro de un proceso verificable y…» ⚠️ | 167 | `https://jmorgadodev.github.io/servicios/ia-aplicada/` | index,follow |
| Integraciones y APIs | Integraciones y APIs — JMorgado \| JMorgado ⚠️ | 42 | «El objetivo no siempre es crear una aplicación nueva. A veces basta con permitir que la planilla, el catálogo, la base de datos y el servicio externo …» ⚠️ | 189 | `https://jmorgadodev.github.io/servicios/integraciones/` | index,follow |
| Gestión de redes sociales | Gestión de redes sociales \| JMorgado | 36 | «Organizo contigo el trabajo de contenido, desde las ideas y el calendario hasta la revisión de las publicaciones.» | 113 | `https://jmorgadodev.github.io/servicios/redes-sociales/` | index,follow |
| Soporte técnico independiente | Soporte técnico independiente — JMorgado \| JMorgado ⚠️ | 51 | «Apoyo en problemas de configuración y operación tecnológica, con información clara de lo encontrado y de las acciones realizadas.» | 129 | `https://jmorgadodev.github.io/servicios/soporte-ti/` | index,follow |

⚠️ Marca una observación que se detalla más abajo.

### 4.2 Open Graph, datos estructurados e indexabilidad

| Página | og:title | og:description | og:url | og:image | og:type | og:locale | JSON-LD | Twitter |
|---|---|---|---|---|---|---|---|---|
| Servicios (índice) | Servicios de automatización, desarrollo, datos e IA aplicada \| JMorgado | 149 car. | https://jmorgadodev.github.io/servicios/ | `social-preview.png` | website | es_CL | 0 | 0 |
| Automatización de procesos | Automatización de procesos — JMorgado \| JMorgado | 166 car. | https://jmorgadodev.github.io/servicios/automatizacion/ | `social-preview.png` | website | es_CL | 0 | 0 |
| Datos, planillas y BI | Datos, planillas y BI — JMorgado \| JMorgado | 147 car. | https://jmorgadodev.github.io/servicios/datos-y-bi/ | `social-preview.png` | website | es_CL | 0 | 0 |
| Desarrollo web y plataformas | Desarrollo web y plataformas — JMorgado \| JMorgado | 163 car. | https://jmorgadodev.github.io/servicios/desarrollo-web/ | `social-preview.png` | website | es_CL | 0 | 0 |
| IA aplicada con criterio | IA aplicada con criterio — JMorgado \| JMorgado | 167 car. | https://jmorgadodev.github.io/servicios/ia-aplicada/ | `social-preview.png` | website | es_CL | 0 | 0 |
| Integraciones y APIs | Integraciones y APIs — JMorgado \| JMorgado | 189 car. | https://jmorgadodev.github.io/servicios/integraciones/ | `social-preview.png` | website | es_CL | 0 | 0 |
| Gestión de redes sociales | Gestión de redes sociales \| JMorgado | 113 car. | https://jmorgadodev.github.io/servicios/redes-sociales/ | `social-preview.png` | website | es_CL | 0 | 0 |
| Soporte técnico independiente | Soporte técnico independiente — JMorgado \| JMorgado | 129 car. | https://jmorgadodev.github.io/servicios/soporte-ti/ | `social-preview.png` | website | es_CL | 0 | 0 |

### 4.3 Jerarquía de encabezados

| Página | H1 | H2 | H3 | H4 | ¿Salto de nivel? |
|---|---|---|---|---|---|
| Servicios (índice) | 1 | 4 | 7 | 0 | no |
| Automatización de procesos | 1 | 6 | 1 | 0 | no |
| Datos, planillas y BI | 1 | 6 | 1 | 0 | no |
| Desarrollo web y plataformas | 1 | 6 | 1 | 0 | no |
| IA aplicada con criterio | 1 | 6 | 1 | 0 | no |
| Integraciones y APIs | 1 | 6 | 1 | 0 | no |
| Gestión de redes sociales | 1 | 4 | 3 | 0 | no |
| Soporte técnico independiente | 1 | 6 | 1 | 0 | no |

### 4.4 Hallazgos

**H1 — Marca duplicada en el título SEO (6 de 7 fichas).**

Las seis fichas generadas por `service_detail()` pasan el título como `s["title"] + " — JMorgado"` (`build_site.py` L1269) y `meta()` añade además `" | JMorgado"` (`build_site.py` L91). El resultado publicado es:

```
Automatización de procesos — JMorgado | JMorgado
Datos, planillas y BI — JMorgado | JMorgado
Desarrollo web y plataformas — JMorgado | JMorgado
IA aplicada con criterio — JMorgado | JMorgado
Integraciones y APIs — JMorgado | JMorgado
Soporte técnico independiente — JMorgado | JMorgado
```

La ficha de **Gestión de redes sociales** no repite la marca porque su plantilla propia (`social_service()`, L1240) pasa `s["title"]` sin sufijo: «Gestión de redes sociales | JMorgado». Es la única de la sección con el patrón correcto, y conviene usar el mismo criterio en las otras seis.

**Meta description — tres páginas por encima del límite recomendado.**

Google recorta alrededor de 155–160 caracteres en escritorio y 120 en móvil.  hoy:

| Página | Caracteres | Lectura |
|---|---|---|
| Integraciones y APIs | 189 | se corta en «…servicio externo intercambien informació» |
| IA aplicada con criterio | 167 | se corta en «…proceso verificable y con supervisi» |
| Automatización de procesos | 166 | se corta en «…puede ser una fórmula, una routi» |
| Servicios (índice) | 149 | completo |
| Datos, planillas y BI | 147 | completo |
| Desarrollo web y plataformas | 163 | justo en el límite |
| Soporte técnico independiente | 129 | completo |
| Gestión de redes sociales | 113 | completo |

**La meta description es literalmente el texto `lead` de la ficha**, el mismo que aparece en el hero (`site_data.py`, campo `lead`). En escritorio eso es aceptable, pero en móvil el visitante ve el titular y enseguida el mismo párrafo: conviene que el resumen SEO diga qué resuelve el servicio, no que lo repita.

**Sin datos estructurados.** No hay JSON-LD en ninguna página de la sección (0 coincidencias). Es la oportunidad más grande de la auditoría: un `Service` (o `ProfessionalService`) por área, con `provider`, `areaServed`, `hasOfferCatalog` y `description`, más un `BreadcrumbList` que refleje la ruta visible. También un `ItemList` en el índice con las siete áreas.

**Sin tarjeta de Twitter/X.** No hay etiquetas `twitter:*`. No es obligatorio, pero `summary_large_image` con la misma imagen mejoraría la presentación al compartir.

**Imagen Open Graph genérica.** Las ocho páginas usan `assets/social-preview.png`. No hay imagen propia por servicio: al compartir en redes, todas se ven igual.

**Canonical, robots y Open Graph están correctos.**

- `canonical` absoluto y autorreferencial en las ocho páginas.
- `robots` = `index,follow` en las ocho; las dos reescrituras heredadas (`proyectos/auditapc/`, `proyectos/nokto/`) llevan `noindex,follow` y no pertenecen a esta sección.
- `og:url` coincide con el canonical; `og:type` = `website`; `og:locale` = `es_CL`.
- `og:description` replica la meta description en las ocho: consistente.

**Sitemap y robots.txt.** No existen en el repositorio: se generan al publicar (`publish_site.py`, L34–36). El `sitemap.xml` incluye las siete rutas de servicio (`servicios/<slug>/`) porque se construyen desde `SERVICES` (L17). El `robots.txt` publicado es `User-agent: * / Allow: / / Sitemap: …`. Correcto, aunque conviene confirmar en cada publicación que el archivo sigue generándose.

**Sin salto de nivel de encabezado.** Ninguna página usa H4 y todas mantienen H1 → H2 → H3. Correcto.

**Migas de pan implementadas y rastreables.** Son un `nav.breadcrumb` con enlaces reales a `/` y `/servicios/`, no sólo texto. El índice muestra «Inicio / Servicios»; las fichas, «Inicio / Servicios / <área>».

**Posible contenido duplicado.** Los bloques de texto que se repiten entre fichas son de plantilla, no de contenido: los overlines «01 · Problema y enfoque», «02 · Experiencia demostrada», «Qué situación abordo.», «Cómo decido la solución», «Ejemplos de entregables según alcance», «Tecnologías utilizadas en esta línea», «La selección final depende del problema…», «Trabajos que aportan contexto.», «No son promesas de resultados…», «¿Tienes un proceso parecido?», «Cuéntame qué haces hoy y qué necesitas cambiar. La primera conversación es gratuita.» y el CTA «Revisemos tu caso». El contenido propio de cada ficha (situación, enfoque, entregables, tecnologías y ejemplos) es único. No hay duplicación que penalice, pero sí una oportunidad de **diferenciar el cierre** de cada servicio: hoy las seis fichas terminan con el mismo texto y el mismo botón.

**Enlaces internos.** Cada ficha enlaza entre uno y tres trabajos del archivo, al índice por la miga de pan y a `/contacto/`. La sección no enlaza desde su cuerpo a `/servicios/` ni a las fichas hermanas: no existe una ruta interna que permita recorrer las siete áreas seguidas.

---

## 5. Estructura visual y composición

Medido sobre el sitio publicado a 1440 px de ancho (contenedor `.wrap` de 1400 px).

### 5.1 Elementos que funcionan y conviene conservar

- **Cabecera fija del sitio**: monograma, descriptor en dos líneas, conmutador día/noche y menú de cuatro entradas. Coherente en toda la sección.
- **Hero editorial**: titular de 89,28 px con `letter-spacing: -.06em`, punto coral como firma, subtítulo de 21,6 px y filete inferior de 1 px. Jerarquía clara y muy legible.
- **Overlines numerados** (`01 ·`, `02 ·`) con filete que se estira:que dan orden de lectura sin añadir ruido.
- **Rail de color a la izquierda** del listado del índice (3 px petróleo) y de la ficha técnica (3 px petróleo): ancla visual que ordena la rejilla.
- **Filas del índice** en rejilla de cuatro columnas (número · título · descripción · icono), con fondo alterno y desplazamiento de 0,25 rem al pasar el cursor: la interacción es discreta y se siente como una lista viva, no como una tabla.
- **Iconografía de línea** compartida (27 px, un solo trazo) para las siete áreas: `gear`, `code`, `data`, `network`, `branch`, `support`, `grid`.
- **Ficha técnica en tarjeta** (`interior.css` L363): borde de 1 px, borde superior de 3 px petróleo y fondo `--jm-surface`. Separa bien la enumeración de entregables del texto principal.
- **Tablón de contacto** en coral con borde de 1 px: es el punto de mayor contraste de la página y funciona como cierre de la argumentación.
- **Pie de sitio en tres columnas** (Trabajo · Recursos · Contacto) con filetes de color: cierra con calma y repite las rutas útiles.
- **Modo noche**: verificado por captura en las ocho páginas. El crema del papel, el petróleo del rail y el coral del tablón se mantienen legibles; los bloques con fondo de superficie cambian de tono sin romper el contraste.

### 5.2 Hero de cada tipo de página

| Tipo | Fondo | Filete superior | Altura | Particularidad |
|---|---|---|---|---|
| Índice (`/servicios/`) | papel | — | 445 px | Ilustración `S03-marco-abierto.svg` absoluta a la derecha (40 % del ancho, opacidad .56) |
| Ficha estándar | papel | — | 512–599 px | Línea `page-meta` con dos datos separados por `justify-content: space-between` |
| Gestión de redes sociales | degradado crema → arcilla | 5 px arcilla | 450 px | Único hero con color propio |

### 5.3 Distribución interna de las fichas estándar

Tres bloques, con las alturas medidas:

| Bloque | Contenido | Columnas | Altura | Densidad (car. por 10 px) |
|---|---|---|---|---|
| `01 · Problema y enfoque` | H2 + párrafo + H3 + párrafo a la izquierda; tarjeta lateral con entregables, tecnologías y nota | 869 px / 416 px (1,15fr / minmax(300px,.55fr)), hueco de 112 px | 716–778 px | 9,8–11,3 |
| `02 · Experiencia demostrada` | Titular + aclaración a la derecha; lista de trabajos relacionados | 845 px / 507 px | 652–778 px | 2,5–2,8 |
| `03` (sin número) | Tablón de contacto | 835 px / 358 px (1,4fr / .6fr) | 908 px | 1,6 |

**Espacios vacíos detectados:**

- El bloque `02` tiene la densidad más baja de los tres (2,5–2,8): entre 195 y 205 caracteres en 778 px de alto. La lista de trabajos relacionados deja unos 200 px de aire bajo el último enlace. Con una sola línea de texto y dos o tres enlaces, el bloque pide menos altura o un apoyo visual.
- El tablón de contacto (908 px con 142 caracteres) es el bloque más alto de la ficha y el de menor densidad. El H2 a `clamp(2,8rem,6vw,6rem)` con `max-width:11ch` ocupa tres líneas en un panel muy ancho: es deliberado y funciona, pero deja el bloque mucho más alto que su contenido.
- En `01 · Problema y enfoque`, la columna izquierda (texto) queda más corta que la tarjeta lateral en todas las fichas: entre 150 y 200 px de hueco bajo el último párrafo.
- El hero del índice tiene 445 px con 221 caracteres. El H1 «En qué puedo ayudarte.» más el texto introductorio ocupan la mitad izquierda; la ilustración ocupa la derecha con opacidad reducida. El reparto funciona, pero el texto introductorio nombra cinco áreas de las siete que se listan abajo.

### 5.4 Ficha de Gestión de redes sociales

Es una plantilla aparte (`social_service()`), con un solo bloque de 979 px y 675 caracteres:

- Hero propio en degradado con arcilla y filete superior de 5 px.
- Un `section-head` con el titular «Que cada publicación tenga un propósito.» a la izquierda en tres líneas y el párrafo de apoyo a la derecha, alineado al pie: la composición deja un hueco notable en la esquina superior derecha.
- Lista de tres pasos (`01 Planificar`, `02 Preparar y publicar`, `03 Revisar`) como filas con número en mono, título y descripción, con rail de 3 px arcilla a la izquierda.
- Párrafo de cierre y botón «Conversemos» (WhatsApp).
- No lleva overline numerado ni línea `page-meta`, a diferencia de las otras seis.

### 5.5 Tipografía, separadores e iconografía

| Elemento | Tratamiento |
|---|---|
| Titular de página | Syne/IBM Plex, `clamp(2,35rem,6,2vw,5,6rem)`, interlínea .98, `letter-spacing: -.06em`, `max-width:17ch` |
| Titular de sección | `clamp(2rem,3,8vw,3,6rem)` dentro de `case-layout` |
| Texto corrido | IBM Plex Sans 1,08rem / 1,72 dentro de `.prose` (máx. 65 caracteres) |
| Etiquetas | IBM Plex Mono, versalitas, 0,75rem, con filete (`overline`) |
| Overline | Mono 0,75rem en versalitas + línea de 1 px que se estira al resto del ancho |
| Separadores | 1 px `--line` en listas y paneles; 1 px `--ink` en la cabecera del hero y en `related`; 3 px de color en los rails |
| Iconos de área | 27 px, un trazo de 1,6, retícula de 24 (`SYMBOLS`, `build_site.py` L47–54) |
| Chips de tecnología | `.tag.tech-badge` con un cuadrado de color (`TECH_COLORS`) y, para cuatro herramientas, un SVG de marca a 38×26 (`TECH_ART`: Excel, Power BI, Power Query, n8n) |
| Enlace de proyecto | Fila con título a la izquierda y flecha a la derecha, con filete inferior |

### 5.6 Responsive

- **Listado del índice**: pasa de `80px 1fr .85fr 40px` a `45px 1fr 30px`; la descripción baja a una segunda fila bajo el título.
- **Rejillas de dos columnas** (`case-layout`, `section-head`, `contact-board`, `statement`): pasan a una columna.
- **Hero**: el H1 baja a `clamp(2,15rem,10vw,3,4rem)` y el subtítulo se ajusta; la ilustración del índice pasa a `bottom:0` con opacidad .26.
- **Lista de redes sociales**: de tres columnas a una, conservando el rail de color.
- **Contactos**: el tablón baja a `padding:2rem 1,3rem`.
- Capturas propias de las ocho páginas a 390 px: no hay desbordamiento horizontal ni solapamientos.

---

## 6. Enlaces, navegación y proyectos relacionados

### 6.1 Mapa de enlaces de la sección

```
/servicios/  (índice)
   ├─ 01 Automatización de procesos  → /servicios/automatizacion/
   ├─ 02 Desarrollo web y plataformas → /servicios/desarrollo-web/
   ├─ 03 Datos, planillas y BI        → /servicios/datos-y-bi/
   ├─ 04 Integraciones y APIs         → /servicios/integraciones/
   ├─ 05 IA aplicada con criterio    → /servicios/ia-aplicada/
   ├─ 06 Soporte técnico independiente→ /servicios/soporte-ti/
   ├─ 07 Gestión de redes sociales    → /servicios/redes-sociales/
   └─ CTA «Conocer el método»         → /metodo/

cada ficha de servicio:
   ├─ migas: /  ·  /servicios/  ·  (área)
   ├─ 1–3 trabajos del archivo       → /proyectos/<slug>/   o  /herramientas/#<slug>
   └─ CTA «Revisemos tu caso»        → /contacto/     (redes-sociales: WhatsApp)

pie de sitio (las 8 páginas):
   Trabajo:   Proyectos · Servicios · Método
   Recursos:  Herramientas · Calculadora · Pausa de Tetris
   Contacto:  WhatsApp ↗ · LinkedIn ↗ · Agendar una hora → /contacto/#agenda
```

### 6.2 Proyectos relacionados por ficha

| Servicio | Trabajo relacionado | Tipo | URL |
|---|---|---|---|
| Automatización de procesos | RRSS | proyecto | `/proyectos/kooke-rrss/` |
| Automatización de procesos | ListoPorHoy | proyecto | `/proyectos/conecta/` |
| Automatización de procesos | AuditaPC | herramienta | `/herramientas/#auditapc` |
| Desarrollo web y plataformas | ImpulsaCV | proyecto | `/proyectos/impulsacv/` |
| Desarrollo web y plataformas | Ryvolt | proyecto | `/proyectos/ryvolt/` |
| Desarrollo web y plataformas | Hangar354 | proyecto | `/proyectos/tobys-warehouse/` |
| Datos, planillas y BI | El Cambiómetro | proyecto | `/proyectos/el-cambiometro/` |
| Datos, planillas y BI | Flor de Almendro | proyecto | `/proyectos/flor-de-almendro/` |
| Integraciones y APIs | ListoPorHoy | proyecto | `/proyectos/conecta/` |
| Integraciones y APIs | Flor de Almendro | proyecto | `/proyectos/flor-de-almendro/` |
| Integraciones y APIs | kokeAI | proyecto | `/proyectos/kooke-portal/` |
| IA aplicada con criterio | ImpulsaCV | proyecto | `/proyectos/impulsacv/` |
| IA aplicada con criterio | RRSS | proyecto | `/proyectos/kooke-rrss/` |
| Soporte técnico independiente | AuditaPC | herramienta | `/herramientas/#auditapc` |
| Gestión de redes sociales | — | — | — |

**Cobertura.** Cuatro de las siete fichas enlazan a un trabajo del archivo de proyectos y dos de ellas lo hacen además con una herramienta propia (`AuditaPC`). **Gestión de redes sociales no enlaza ningún trabajo**, ni de proyectos ni de herramientas, aunque existen proyectos con componentes de contenido (RRSS, ListoPorHoy) que son evidencia directa de esa línea.

**Trabajos sin servicio asociado.** El archivo tiene nueve fichas; los servicios cubren ImpulsaCV, El Cambiómetro, ListoPorHoy, Ryvolt, Flor de Almendro, Exo Dream, Hangar354, kokeAI y RRSS entre las seis fichas estándar. **Exo Dream** no aparece en ningún `examples`.

### 6.3 Enlaces externos

Sólo hay tres, y están en el pie de sitio de las ocho páginas: WhatsApp (`https://wa.me/56933904330`), LinkedIn (`https://www.linkedin.com/in/jorge-morgado/`) y el enlace interno de agenda. La ficha de redes sociales añade el WhatsApp como CTA principal, con `target="_blank"` y `rel="noopener noreferrer"`.

---

## 7. Funcionalidades y tecnologías identificadas

Transcripción literal de los cuatro campos de cada servicio (`site_data.py` L223–234).

### 7.1 Entregables (`outputs`)

| Servicio | Entregables publicados |
|---|---|
| Automatización de procesos | Automatización de tareas entre herramientas · Procesamiento y validación de datos · Registros y control de excepciones · Documentación de operación |
| Desarrollo web y plataformas | Sitios y catálogos conectados · Aplicaciones y paneles internos · Experiencias responsive y accesibles · Integración de servicios y formularios |
| Datos, planillas y BI | Consolidación y limpieza de archivos · Transformaciones y procesos ETL · Dashboards e informes · Modelos de datos y automatizaciones |
| Integraciones y APIs | Conexiones entre APIs y servicios · Integraciones con Google Workspace · Flujos con controles de error · Almacenamiento y sincronización cuando corresponda |
| IA aplicada con criterio | Integración de modelos vía API o local · Análisis y clasificación asistidos · Orquestación de agentes y herramientas · Validación y supervisión de resultados |
| Soporte técnico independiente | Diagnóstico inicial y alcance · Levantamiento técnico de equipos · Registro de incidencias · Informes técnicos comprensibles |

### 7.2 Tecnologías (`stack`) y si llevan icono

| Servicio | Tecnologías publicadas | Con icono |
|---|---|---|
| Automatización de procesos | Python · n8n / Make · Apps Script · Excel / Power Query · APIs | n8n / Make, Excel / Power Query |
| Desarrollo web y plataformas | React / Vite · TypeScript · Hono / Workers · Firebase · Cloudflare D1 | ninguna |
| Datos, planillas y BI | Excel · Power Query · Python · Power BI · GCP / BigQuery · Looker Studio | Excel, Power Query, Power BI |
| Integraciones y APIs | APIs REST · OAuth · Google Sheets · Apps Script · Firebase · Cloudflare Workers | ninguna |
| IA aplicada con criterio | Ollama / LM Studio · Gemma / Qwen / DeepSeek · APIs de modelos · CLI y agentes · Python | ninguna |
| Soporte técnico independiente | Windows · Herramientas locales · Informes HTML · Inventario técnico | ninguna |

Los iconos de marca disponibles en el sistema (`TECH_ART`, `build_site.py` L318–321) son sólo cuatro: Excel, Power BI, Power Query y n8n. El resto de chips se distingue con un cuadrado de color (`TECH_COLORS`).

### 7.3 Lo que el encargo propone añadir y el estado actual

| Propuesta del encargo | ¿Está hoy en la sección? | Dónde |
|---|---|---|
| Bots y asistentes automatizados para consultas, atención, reservas y operaciones comerciales | **No.** No aparece en ninguna ficha, ni en el índice ni en los entregables | — |
| Reportes personalizados, dashboards y BI | **Sí**, de forma explícita en «Datos, planillas y BI» («Dashboards e informes», Power BI, BigQuery, Looker Studio) | `datos-y-bi` |
| **Tableau** | **No.** No figura en ninguna ficha ni en la sección | — |
| Conexión de sistemas, servicios externos, calendarios y CRM | **Parcial.** «Integraciones y APIs» cubre APIs, OAuth, Google Workspace, Sheets, Apps Script, Firebase y Workers. **No hay mención explícita a calendarios ni a CRM** | `integraciones` |
| Desarrollo e integración de soluciones con IA | **Sí**, con «IA aplicada con criterio» y la ficha completa | `ia-aplicada` |
| Renombrar «Soporte técnico independiente» a «Soporte técnico» | **Pendiente.** El nombre público vive en `site_data.py` L229 y se propaga al título SEO y al H1 | `soporte-ti` |
| Atención presencial y remota, instalación de software, formateo, reinstalación, carga de imágenes y configuración de equipos | **No.** La ficha sólo habla de diagnóstico, levantamiento, incidencias e informes | `soporte-ti` |
| Gestión de redes sociales con enfoque editorial (planificación, producción, organización, distribución) | **Sí**, con plantilla propia y tres pasos | `redes-sociales` |
| No confundir gestión de redes sociales con bots de atención comercial | **Coherente hoy**: la ficha de redes sociales habla de contenido y la de automatización no menciona bots | — |

---

## 8. Decisiones preliminares registradas

Registro de los ajustes que el encargo propone para la siguiente etapa, con lo que la auditoría de hoy muestra. **No son cambios aplicados**: son decisiones anotadas, con el estado actual documentado al lado.

### 8.1 Automatización de procesos — Incorporar bots y asistentes automatizados

**Decisión registrada.** Sumar al área la creación de bots y asistentes automatizados para consultas, atención, reservas y operaciones comerciales.

**Estado actual.** La ficha de Automatización de procesos presenta cuatro entregables —automatización de tareas entre herramientas, procesamiento y validación de datos, registros y control de excepciones, documentación de operación— y cinco tecnologías: Python, n8n / Make, Apps Script, Excel / Power Query y APIs. **No hay ninguna mención a bots, asistentes, atención al cliente, reservas ni chatbots**, ni en los entregables, ni en el enfoque, ni en el texto del índice.

**Consideración de encaje.** La ficha de IA aplicada con criterio menciona «Orquestación de agentes y herramientas» como entregable. Conviene decidir en qué área vive lo de bots y asistentes: si en Automatización (la operación comercial) o en IA aplicada (la tecnología), y evitar que las dos se solapen. También hay que distinguirlo de la gestión de redes sociales, que es editorial.

**DriveVipClub.** No se encontró ninguna referencia a este proyecto en el repositorio ni en las carpetas de trabajo revisadas (`C:\Users\jorge\Proyectos`). No es posible documentar sus casos de uso ni su relación con esta área sin el material original. Queda como punto pendiente (sección 10).

### 8.2 Desarrollo web y plataformas — Revisar la presentación

**Decisión registrada.** Revisar cómo se presentan las soluciones web, aplicaciones y plataformas con lógica propia.

**Estado actual.** La ficha es la que mejor sostiene su argumento: presenta la web como un sistema que se justifica por la operación, con cuatro entregables que van del sitio corporativo al panel interno, y un stack de cinco piezas (React / Vite, TypeScript, Hono / Workers, Firebase, Cloudflare D1). Enlaza tres proyectos reales (ImpulsaCV, Ryvolt, Hangar354).

**Observación.** El texto de la sección 01 ya distingue el sitio comercial del producto con usuarios y lógica propia, pero esa distinción no se apoya en ningún entregable explícito: «Aplicaciones y paneles internos» cubre la parte de plataforma, y no hay ninguna mención a cuentas, roles, permisos o pagos, que es lo que distingue una plataforma de un sitio. Es una buena candidata para reforzar la diferenciación cuando se consolide la sección.

### 8.3 Datos, planillas y BI — Reportes, dashboards y BI

**Decisión registrada.** Incorporar reportes personalizados, dashboards y herramientas como Power BI y Tableau.

**Estado actual.** Power BI ya está presente: en el texto de enfoque («Excel, Power Query, Python, Power BI, BigQuery o Looker Studio») y en las tecnologías (con icono de marca). Los entregables ya incluyen «Dashboards e informes».

**Observación.** **Tableau no aparece en ninguna parte de la sección.** Es la única incorporación puramente nueva de este bloque. Conviene decidir si entra como alternativa a Power BI o como complemento, y en qué orden se enumeran las herramientas de BI en el chip de tecnologías.

### 8.4 Integraciones y APIs — Destacar el alcance

**Decisión registrada.** Destacar la conexión de sistemas, servicios externos, plataformas, calendarios, CRM y otros recursos.

**Estado actual.** La ficha cubre seis tecnologías (APIs REST, OAuth, Google Sheets, Apps Script, Firebase, Cloudflare Workers) y cuatro entregables (conexiones entre APIs y servicios, integraciones con Google Workspace, flujos con controles de error, almacenamiento y sincronización). Enlaza ListoPorHoy, Flor de Almendro y kokeAI.

**Observación.** **Calendarios y CRM no se nombran**, aunque el trabajo con calendarios sí aparece en otras fichas (ListoPorHoy). Es el punto donde la realidad del portafolio y el texto publicado más se separan.

### 8.5 IA aplicada con criterio — Revisar la presentación

**Decisión registrada.** Revisar cómo se presenta el desarrollo e integración de soluciones con inteligencia artificial.

**Estado actual.** La ficha es la más prudente del conjunto y conviene conservarla: separa explícitamente «modelos locales y servicios externos» según precisión, privacidad, rendimiento y costo, y termina con «No prometer ejecución local en flujos que dependen de servicios externos». Sus entregables incluyen «Validación y supervisión de resultados», que es la garantía que el visitante necesita. Enlaza ImpulsaCV y RRSS.

**Observación.** Es la única ficha que declara límites de forma explícita en el cuerpo. Ese tono puede ser el patrón para el resto de la sección.

### 8.6 Soporte técnico — Cambio de nombre y ampliación del alcance

**Decisión registrada.** Cambiar «Soporte técnico independiente» por «Soporte técnico», y considerar atención presencial y remota, instalación de software, formateo, reinstalación de sistemas, carga de imágenes y configuración de equipos.

**Estado actual.** El nombre público «Soporte técnico independiente» aparece en dos lugares: el campo `title` de `site_data.py` L229 (del que salen el H1, el título SEO, la línea del índice y la etiqueta del enlace) y el título SEO «Soporte técnico independiente — JMorgado | JMorgado». La ficha incluye cuatro entregables (diagnóstico inicial y alcance, levantamiento técnico de equipos, registro de incidencias, informes técnicos comprensibles) y cuatro tecnologías (Windows, herramientas locales, informes HTML, inventario técnico).

**Observación.** **Ninguna de las capacidades propuestas está hoy en la ficha**: ni atención presencial o remota, ni instalación de software, ni formateo o reinstalación, ni carga de imágenes, ni configuración de equipos. Es la ampliación de contenido más grande de las siete, y la única que afecta además al nombre público y al título SEO.

**Consecuencia del cambio de nombre.** «Soporte técnico» como nombre público también obliga a revisar la línea corta del índice («Diagnóstico, levantamientos y resolución de incidencias concretas.») y el texto de la meta description, que hoy dice «Apoyo en problemas de configuración y operación tecnológica…». El nombre actual es más largo y más preciso; el propuesto es más directo. Conviene decidir si la precisión se conserva en el subtítulo.

### 8.7 Gestión de redes sociales — Mantener el enfoque editorial

**Decisión registrada.** Mantener su enfoque editorial: planificación, producción, organización y distribución de contenido, sin confundirla con los bots de atención comercial.

**Estado actual.** Coherente con lo observado. La ficha declara «Servicio editorial», describe tres pasos (Planificar · Preparar y publicar · Revisar), y cierra con «Las decisiones de contenido y la aprobación quedan dentro del proceso acordado». No menciona bots, atención comercial ni respuestas automáticas.

**Observación.** Cuando se incorporen los bots y asistentes del punto 8.1, esta ficha es la que requiere más cuidado editorial para que la diferencia quede explícita. Hoy la separación es correcta, pero no está **dibujada**: depende de que el lector recuerde la ficha de automatización. Recomendable añadir una línea explícita que separe contenido editorial de atención comercial, sin nombrar a ningún otro servicio.

---

## 9. Oportunidades de mejora

Ordenadas por impacto editorial y por facilidad de ejecución. **Ninguna está aplicada.**

### 9.1 Correcciones de SEO (alto impacto, bajo riesgo)

1. **Eliminar la marca duplicada en el título de las seis fichas** («X — JMorgado | JMorgado»). Es el defecto más visible de la sección en un resultado de búsqueda y la corrección es de una línea por plantilla (`build_site.py` L1269).
2. **Acortar tres meta descriptions** por encima de 160 caracteres: Integraciones (189), IA aplicada (167) y Automatización (166). Conviene que el resumen diga qué resuelve el área, no que repita el subtítulo del hero.
3. **Añadir datos estructurados** `Service` por área y `BreadcrumbList`, más un `ItemList` en el índice. Hoy la sección no declara ninguna clase de dato estructurado.
4. **Etiquetar Twitter/X** (`summary_large_image`) si se quiere controlar la presentación al compartir.
5. **Imagen social propia por servicio**: las ocho páginas comparten `assets/social-preview.png`.

### 9.2 Coherencia editorial (alto impacto)

6. **Sincronizar la lista del índice con el texto introductorio.** El índice nombra cinco áreas en su lead («Desarrollo web, datos, automatización, soporte y gestión de redes sociales») y listas siete. Faltan Integraciones e IA aplicada.
7. **Revisar la meta description del índice**, que anuncia «automatización con Python, n8n y Make». Es la única mención de n8n y Make en toda la sección, y puede leerse como una promesa que ninguna ficha desarrolla por separado.

8. **Diferenciar el cierre de cada ficha.** Las seis fichas estándar terminan con el mismo bloque («¿Tienes un proceso parecido?» / «Cuéntame qué haces hoy…» / «Revisemos tu caso»). Es la parte que un visitante lee después de comparar y es la que menos distingue.

9. **Unificar el nombre público de «Soporte técnico independiente»** según la decisión 8.6, y revisar en cascada título SEO, H1, línea del índice y meta description.

10. **Alinear el CTA de redes sociales con el resto.** Es la única ficha que sale a WhatsApp; las otras seis van a `/contacto/`. Ambas rutas son válidas, pero la diferencia no está justificada en el texto.

### 9.3 Cobertura de contenido (medio impacto)

11. **Añadir las capacidades faltantes** señaladas en 8.1 (bots y asistentes), 8.3 (Tableau) y 8.6 (atención presencial y remota, instalación, formateo, reinstalación, carga de imágenes, configuración de equipos).
12. **Nombrar calendarios y CRM** en la ficha de Integraciones, si el trabajo real lo justifica.
13. **Enlazar trabajos desde la ficha de redes sociales.** Es la única sin evidencia en la sección, y existen proyectos con componentes de contenido que la respaldan.

### 9.4 Navegación (medio impacto)

14. **Añadir un camino entre fichas hermanas.** Hoy no hay forma de pasar de un servicio al siguiente salvo volver al índice por la miga de pan. Una línea «Otras áreas» al pie de cada ficha aumentaría el tiempo en la sección sin tocar el diseño.
15. **Revisar la miga de pan del índice**: muestra «Inicio / Servicios», que es correcto, pero el índice no enlaza a las fichas hermanas desde el cuerpo, sólo desde la lista.

### 9.5 Composición visual (bajo impacto, alto cuidado)

16. **Ajustar la altura del bloque `02 · Experiencia demostrada`.** Con 195–205 caracteres en 778 px, deja en torno a 200 px de aire bajo la lista de trabajos. Se puede resolver reduciendo el relleno vertical de la sección o enriqueciendo los ejemplos con una línea de descripción.
17. **Revisar el peso del tablón de contacto.** 908 px de alto con 142 caracteres: es el bloque más alto de la ficha y el de menor densidad. Es una decisión de diseño —el cierre en coral funciona—, pero conviene contrastarla con el resto del sitio.
18. **Considerar la columna izquierda del bloque `01`**. En todas las fichas queda entre 150 y 200 px más corta que la tarjeta lateral.
19. **Cerrar el hueco superior derecho de la ficha de redes sociales**, donde el titular ocupa tres líneas y el párrafo de apoyo queda alineado al pie.

---

## 10. Información que falta verificar

Puntos que esta auditoría **no puede cerrar** con la información disponible en el repositorio.

| # | Punto | Por qué no se pudo verificar |
|---|---|---|
| 1 | **DriveVipClub y sus desarrollos** | No hay ninguna coincidencia de «DriveVip», «Drive VIP» ni «drive-vip» en el repositorio ni en las carpetas de trabajo revisadas (`C:\Users\jorge\Proyectos`: AuditaPC, Nokto, RRSS, Conecta, Koooke.ai, impulsacv-web, vehiculos.impulsacv.cl, Isla Dinamica, sorting-app, pruebas, Mariela, taller). No se puede documentar ningún caso de uso ni distinguirlo de otros proyectos |
| 2 | Qué proyectos corresponden a «atención presencial y remota», «formateo», «carga de imágenes» y «configuración de equipos» | Los servicios no nombran ningún proyecto de ese tipo y el archivo de proyectos no contiene fichas de esa línea |
| 3 | Si la atención comercial con bots ya se ha implementado en algún cliente | No hay evidencia en el portafolio. La ficha de Automatización no lo menciona |
| 4 | Qué herramientas de BI se usan realmente (Power BI, Tableau, Looker Studio, BigQuery) | La ficha declara seis tecnologías, pero el portafolio no documenta entregables de BI con esa detalle |
| 5 | Si existe una interfaz pública de los bots o asistentes | Sin información |
| 6 | Posible uso de Tableau | No aparece en ninguna parte del sitio |
| 7 | Estado real de publicación del `sitemap.xml` y `robots.txt` | Se generan en `publish_site.py`; no están en el repositorio. Hay que comprobarlos en el despliegue |
| 8 | Métricas o analítica sobre el tráfico a `/servicios/` | El sitio no expone medición de esta sección |

---

## 11. Recomendaciones para la siguiente etapa

### 11.1 Orden sugerido

**Paso 1 — Correcciones que no cambian el diseño ni los textos publicados.**

- Quitar la marca duplicada del título SEO en las seis fichas.
- Acortar las tres meta descriptions largas.
- Añadir `Service` y `BreadcrumbList` estructurados.
- Etiquetas de Twitter/X e imagen social por servicio.
- Corrección del texto introductorio del índice para que nombre las siete áreas.
- Revisar la meta description del índice.

**Paso 2 — Decisiones de contenido, una por servicio.**

- **Automatización**: incorporar bots y asistentes, y decidir su frontera con IA aplicada y con redes sociales.
- **Desarrollo web**: reforzar la diferencia entre sitio corporativo y plataforma con lógica propia (cuentas, roles, permisos).
- **Datos y BI**: incorporar Tableau y ordenar el chip de tecnologías.
- **Integraciones**: nombrar calendarios y CRM.
- **IA aplicada**: mantener el tono actual; es el patrón de límites explícitos.
- **Soporte técnico**: decidir el nombre público y ampliar el alcance con las capacidades presenciales y de configuración de equipos.
- **Redes sociales**: mantener el enfoque editorial y añadir una línea que lo separe explícitamente de la atención comercial; enlazar trabajos.

**Paso 3 — Coherencia de plantilla y cierre.**

- Unificar el CTA de las siete fichas hacia la misma ruta, o justificar la excepción de redes sociales en el propio texto.
- Diferenciar el bloque de cierre de cada servicio.
- Decidir si la ficha de redes sociales adopta la estructura de las otras seis (overline, `page-meta`, «Qué situación abordo.», «Experiencia demostrada», tecnologías) o si mantiene su plantilla propia, que hoy funciona bien pero deja la ficha más corta y menos comparable.
- Añadir un enlace «Otras áreas» al pie de cada ficha.

**Paso 4 — Ajustes de composición, con revisión visual comparada.**

- Altura del bloque `02 · Experiencia demostrada`.
- Peso del tablón de contacto.
- Equilibrium de la columna de texto frente a la tarjeta lateral en `01`.
- Hueco superior derecho de la ficha de redes sociales.

### 11.2 Guardas

- Los textos actuales están **aprobados**: cualquier cambio de copy necesita aprobación explícita, igual que en las fichas de proyectos.
- Las URLs `/servicios/<slug>/` están publicadas y enlazadas desde el sitemap: **no deben cambiar**. Si «Soporte técnico independiente» pasa a «Soporte técnico», debe cambiar sólo el nombre público, conservando la ruta `/servicios/soporte-ti/`.
- La plantilla de redes sociales es la única con identidad propia (hero en arcilla, rail de 3 px, plan de tres pasos). Antes de unificar, conviene decidir si esa diferencia es deliberada.
- Cualquier ajuste visual debería medirse como en esta auditoría: ancho de contenido, columnas, densidad por bloque y alturas, en escritorio y en móvil, en día y en noche.
- La sección no debe duplicar lo que ya cuentan las fichas de proyectos: los enlaces a trabajos son contexto, noargumentos. Si un servicio necesita explicar un proyecto, ese material vive en la ficha del proyecto.

---

## 12. Anexo — inventario de textos

### 12.1 Recuento

| Concepto | Cantidad |
|---|---|
| Páginas revisadas | 8 |
| Bloques de texto extraídos | 485 |
| Bloques compartidos por las 8 páginas (cabecera, migas de inicio, pie de sitio) | 26 × 8 = 208 |
| Bloques propios de cada página | 277 |
| Encabezados H1 | 8 (uno por página) |
| Encabezados H2 | 20 en el cuerpo de las páginas (más 3 del pie por página) |
| Encabezados H3 | 16 |
| Enlaces internos en el cuerpo de las páginas | 43 |
| Enlaces externos | 1 en el cuerpo (el WhatsApp del CTA de redes sociales) + 2 en el pie de las 8 páginas (WhatsApp y LinkedIn) |
| Imágenes en el cuerpo | 3 (sólo los iconos de Excel, Power Query y Power BI) |

### 12.2 Bloques compartidos (idénticos en las ocho páginas)

**Cabecera del sitio**

| Elemento | Texto |
|---|---|
| Marca | jm · JMorgado · . (enlace a `/#home-start`) |
| Descriptor | Desarrollo independiente / Software, datos y procesos |
| Botón de tema | Noche |
| Botón de menú | Menú + |
| Navegación | Herramientas · Proyectos · Servicios · Contacto |

**Migas de pan**

| Elemento | Texto |
|---|---|
| Inicio | `Inicio` → `/` |
| Separador | `/` |
| Sección | `Servicios` → `/servicios/` |
| Área (sólo en las fichas) | nombre del área, sin enlace |

**Pie de sitio**

| Columna | Elementos |
|---|---|
| Trabajo | Proyectos · Servicios · Método |
| Recursos | Herramientas · Calculadora · Pausa de Tetris |
| Contacto | WhatsApp ↗ · LinkedIn ↗ · Agendar una hora |
| Cierre | © JMorgado · Volver arriba ↑ |

### 12.3 Bloques propios por página (resumen)

| Página | Bloques propios | Elementos característicos |
|---|---|---|
| Servicios (índice) | 33 | Breadcrumb · «Soluciones según tu necesidad» · «En qué puedo ayudarte.» · lead · «01 · Áreas de trabajo» · 7 filas numeradas · «02 · Qué incluye el primer contacto» · «La conversación inicial no tiene costo.» · «Conocer el método» |
| Automatización de procesos | 38 | «Soluciones a medida» · «Evaluación caso a caso» · «Primer diagnóstico conversado: gratuito» · «01 · Problema y enfoque» · «Qué situación abordo.» · «Cómo decido la solución» · 4 entregables · 5 tecnologías · «02 · Experiencia demostrada» · 3 trabajos · «¿Tienes un proceso parecido?» |
| Datos, planillas y BI | 38 | Igual estructura; 4 entregables; 6 tecnologías; 2 trabajos |
| Desarrollo web y plataformas | 38 | Igual estructura; 4 entregables; 5 tecnologías; 3 trabajos |
| IA aplicada con criterio | 37 | Igual estructura; 4 entregables; 5 tecnologías; 2 trabajos |
| Integraciones y APIs | 39 | Igual estructura; 4 entregables; 6 tecnologías; 3 trabajos |
| Soporte técnico independiente | 35 | Igual estructura; 4 entregables; 4 tecnologías; 1 trabajo |
| Gestión de redes sociales | 19 | «Servicio editorial» · «Gestión de redes sociales» · lead · «Que cada publicación tenga un propósito.» · 3 pasos · párrafo de cierre · «Conversemos» |

El texto íntegro de cada bloque, con su origen en el código, está en la [sección 3](#3-texto-íntegro-por-página).

---

## Fin del informe

Documento generado el 2026-11-10 en `REVISION-SERVICIOS/INFORME-CONTENIDO-SERVICIOS.md`. Auditoría de lectura: **no se modificó HTML, CSS, JavaScript, Python, textos publicados, URLs ni SEO**, no se hizo commit, push ni despliegue. La sección Servicios queda exactamente como está.