# Informe — Fase 2 de Servicios

**JMorgado · Diferenciación, orquestación de IA y seguridad**

Fecha: 2026-11-10 · Base: `REVISION-SERVICIOS/INFORME-CONSOLIDACION-SERVICIOS.md`.

Todo quedó **local**: sin commit, sin push, sin despliegue. Las ocho URLs se conservan y los datos estructurados siguen vigentes.

---

## Índice

1. [Resumen de la fase](#1-resumen-de-la-fase)
2. [Índice de Servicios: hero, orden y cierre](#2-índice-de-servicios-hero-orden-y-cierre)
3. [Ecosistemas e iconografía](#3-ecosistemas-e-iconografía)
4. [IA aplicada: orquestación y control de costos](#4-ia-aplicada-orquestación-y-control-de-costos)
5. [Seguridad desde el diseño](#5-seguridad-desde-el-diseño)
6. [Representaciones visuales por servicio](#6-representaciones-visuales-por-servicio)
7. [QA](#7-qa)
8. [Archivos modificados y creados](#8-archivos-modificados-y-creados)
9. [Brechas de seguridad que requieren atención](#9-brechas-de-seguridad-que-requieren-atención)
10. [Lo que queda fuera y pendientes](#10-lo-que-queda-fuera-y-pendientes)

---

## 1. Resumen de la fase

La sección no se rehizo: se transformó su presentación para que tenga más personalidad, profundidad técnica y una experiencia visual propia por servicio.

| Antes | Ahora |
|---|---|
| Hero del índice con un elemento geométrico vacío al costado | Hero asimétrico con un mapa real de las siete capacidades |
| Tecnologías antes que servicios | **01 Áreas de trabajo · 02 Tecnologías y ecosistemas · 03 Primer contacto** |
| Nota que separaba los bots de la gestión de redes | **Eliminada**, sin sustituto |
| Fichas con la misma estructura editorial | Cada servicio tiene **su propia representación visual**, distinta de las demás |
| IA aplicada: integración de modelos y generación | Orquestación de agentes, control de tokens y costos, y un diagrama propio |
| Sin apartado de seguridad | **Seguridad desde el diseño**, con la matriz de controles verificada proyecto por proyecto |
| Cierre genérico con el mismo texto en todas las fichas | Cierre propio por área, con pregunta y CTA diferenciados |
| «La conversación inicial no tiene costo.» | Bloque de primer contacto con título, tres pasos y dos llamadas a la acción |

---

## 2. Índice de Servicios: hero, orden y cierre

### 2.1 Hero

Se elimina el marco geométrico (`assets/modular/S03-marco-abierto.svg`), que ocupaba el costado derecho sin comunicar nada. En su lugar, el hero se reparte en dos columnas:

- **Izquierda**: eyebrow, titular «En qué puedo ayudarte.» y el subtítulo que explica las siete áreas.
- **Derecha**: un **mapa de capacidades** con las siete áreas, cada una con su icono de línea y su nombre, sobre una retícula con filetes. Es información real y sirve de índice de salto.

### 2.2 Orden de las secciones

| Orden | Antes | Ahora |
|---|---|---|
| 01 | Tecnologías y ecosistemas | **Áreas de trabajo** |
| 02 | Áreas de trabajo | **Tecnologías y ecosistemas** |
| 03 | Qué incluye el primer contacto | **Primer contacto** |

Quien entra entiende primero qué problemas se resuelven y después con qué herramientas se trabaja.

### 2.3 Nota de separación: eliminada

El párrafo «La automatización de consultas y atención comercial con bots es una capacidad dentro de Automatización de procesos. La gestión de redes sociales es editorial…» se retira del índice **sin sustituto**. Cada servicio conserva su propia clasificación en su ficha.

### 2.4 Nuevo cierre: primer contacto

El bloque oscuro del índice se replantea como experiencia de primer contacto:

- **Eyebrow**: Primer contacto · Sin costo
- **Título**: «Primero entendemos el problema. Después definimos la solución.»
- **Descripción**: Cuéntame qué necesitas resolver, cómo funciona actualmente tu operación y qué resultado buscas. Revisamos el contexto y definimos si tiene sentido avanzar. La primera conversación no tiene costo. Las auditorías e intervenciones técnicas se acuerdan por separado.

**Los tres pasos** se muestran como una secuencia con filete superior, numerados, no como tarjetas:

- 01 · Cuéntame el contexto
- 02 · Revisamos el alcance
- 03 · Definimos el siguiente paso

**Llamadas a la acción**:

- Principal: **«Conversar sobre mi proyecto»** → `/contacto//` (botón coral)
- Secundaria: «Conocer el método» → `/metodo//`

---

## 3. Ecosistemas e iconografía

Se conservan los siete grupos y el estilo de los chips. La intelligence artificial se amplía con dos grupos nuevos:

| Grupo | Tecnologías |
|---|---|
| Google Workspace y Cloud | Google Sheets, Google Drive, Google Calendar, Google Apps Script, Google Cloud, BigQuery, Firebase, Google Cloud SDK / CLI |
| Datos y Business Intelligence | Python, Excel, Power Query, Power BI, Tableau, Looker Studio |
| Desarrollo e integraciones | React, Vite, TypeScript, Hono, Cloudflare Workers, Cloudflare D1, APIs REST, OAuth |
| Inteligencia artificial y contenido | Gemini API, Google AI Studio, NotebookLM, Nano Banana, Google Flow, Google Flow Music, Pillow, CapCut |
| Agentes y entornos de desarrollo | Claude Code, OpenCode, Antigravity, Codex, Tracer |
| Modelos y ejecución local | Qwen, DeepSeek, MiniMax, Gemma, Ollama, LM Studio |
| Automatización | n8n, Make, Python, Apps Script |

### 3.1 Modelos locales frente a servicios externos

El grupo **«Modelos y ejecución local»** (Qwen, DeepSeek, MiniMax, Gemma, Ollama, LM Studio) se separa del grupo **«Inteligencia artificial y contenido»** (Gemini API, Google AI Studio, NotebookLM, Nano Banana, Google Flow, Google Flow Music, Pillow, CapCut) y del grupo **«Agentes y entornos de desarrollo»** (Claude Code, OpenCode, Antigravity, Codex, Tracer). La aclaración del bloque lo dice de forma explícita: los modelos de ejecución local y los agentes se combinan con los servicios externos según lo que cada tarea necesita, y ninguna tecnología se usa en todos los proyectos.

### 3.2 Iconos

`assets/tech-icons/` queda con **55 iconos** de 32×32. Se crean **11** para esta fase: `claude-code.svg`, `opencode.svg`, `antigravity.svg`, `codex.svg`, `tracer.svg` y `minimax.svg`. Son representaciones propias, no logotipos oficiales; los conceptos genéricos siguen usando pictogramas originales sobre petróleo.

El índice publica **45 chips con icono** y las siete fichas, **92**. Ninguno queda como cuadrado de color.

---

## 4. IA aplicada: orquestación y control de costos

La ficha de IA aplicada suma dos apartados propios y actualiza su metadato SEO.

### 4.1 Orquestación de agentes y modelos

**Título**: Cada tarea, con la herramienta que le corresponde.

Trabajo con distintos entornos y agentes de desarrollo, y con familias de modelos que se ejecutan en local o se consumen mediante API. El objetivo no es usar más agentes, sino asignar bien: uno planifica, otro implementa y otro revisa, cuando el proyecto lo justifica. También hay tareas que un modelo potente resuelve mal y una regla bien escrita resuelve perfecto.

**Responsabilidades asignadas:**

- Planificación y análisis del problema antes de escribir una línea.
- Desarrollo e implementación con el entorno más adecuado para la tarea.
- Revisión de código y comprobación de que lo entregado funciona.
- Pruebas y corrección sobre lo que falló, no sobre lo que se supone.
- Documentación del resultado y de las decisiones tomadas.
- Procesamiento de información y tareas específicas resueltas en local.

**Diagrama de orquestación**

```
Tarea  →  Selección de agente o modelo  →  Ejecución  →  Revisión  →  Resultado
──────────────────────────────────────────────────────────────────────────────
Capa transversal:  Costos y tokens · Privacidad de los datos · Supervisión humana
```
Los cinco pasos se dibujan como una cadena con marcas de color, y la capa transversal aparece debajo, encima de un filete discontinuo que la atraviesa: el control acompaña a todo el recorrido, no es un paso más.

Pasos: **Tarea** (Qué hay que resolver.) · **Selección** (Agente, modelo o herramienta.) · **Ejecución** (Planificación, código o análisis.) · **Revisión** (Comprobación y corrección.) · **Resultado** (Entregable verificado.).

### 4.2 Gestión inteligente de tokens y costos

**Título**: Administrar el consumo de IA es parte del desarrollo.

No todas las tareas necesitan el modelo más potente ni todas requieren consumir tokens mediante una API. Seleccionar correctamente las herramientas permite acelerar el desarrollo y mantener los costos bajo control, siempre respetando las políticas, las cuotas y las condiciones de uso de cada proveedor.

**Responsabilidades asignadas:**

- Selección del modelo según la complejidad y la naturaleza de la tarea.
- Administración de tokens y de la ventana de contexto disponible.
- Optimización de instrucciones y reutilización del contexto ya elaborado.
- Elección entre consumo por API y uso de las suscripciones disponibles.
- Aprovechamiento responsable de las suscripciones y de los límites de cada plan.
- Modelos locales para las tareas específicas donde conviene.
- Control de cuotas y seguimiento del consumo para evitar facturas inesperadas.
- Derivación a un modelo alternativo cuando la tarea no necesita el más costoso.

**Escalera de decisión**

```
Tarea simple       →  Regla o modelo local         →  Sin consumo de tokens
Tarea intermedia   →  Modelo por API o suscripción →  Costo acotado y previsible
Tarea compleja     →  Modelo potente con revisión  →  Se reserva para lo que lo requiere
```
La escalera se presenta como tres niveles con filete de color progresivo: el trabajo simple no consume tokens, el intermedio tiene costo acotado y el modelo potente se reserva para lo que realmente lo requiere.

**Metadatos actualizados**

| Campo | Antes | Ahora |
|---|---|---|
| Título SEO | IA aplicada: modelos y agentes con criterio | IA aplicada: agentes, modelos y control de costos |
| Meta description | Hablaba de clasificación y extracción de documentos | Habla de orquestación, ejecución local frente a API y control de tokens y costos |

**Nota de encuadre**: el apartado respeta las políticas, las cuotas y las condiciones de uso de cada proveedor. El texto no presenta el uso de suscripciones como una forma de eludir límites, sino como una elección de consumo responsable.

---

## 5. Seguridad desde el diseño

Desarrollo web y plataformas suma un apartado propio entre «Qué entrego» y «Qué experiencia respalda».

**Título**: La protección se diseña con la solución, no se agrega después.

Cada proyecto se construye considerando la protección de sus datos, sus accesos y sus conexiones. La matriz de controles se revisa proyecto por proyecto, porque no todos usan la misma arquitectura ni necesitan el mismo nivel. Lo que se publica aquí son medidas verificadas en los trabajos entregados.

**Medidas verificadas**

- **Transporte y cabeceras** — HTTPS y HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy y Permissions-Policy donde la arquitectura lo requiere.
- **Credenciales y secretos** — Claves y tokens desde variables de entorno o gestor de secretos, nunca escritos en el código.
- **Acceso y permisos** — Contraseñas derivadas con PBKDF2, sesiones firmadas y roles por proyecto o por cliente.
- **Datos y consultas** — Consultas parametrizadas, cifrado en reposo de tokens sensibles y validación de la entrada.
- **Integraciones y webhooks** — Firmas verificadas, handshake, CORS con lista blanca de orígenes y permisos mínimos por servicio.
- **Operación y límites** — Cuotas, control de tamaño de las solicitudes, registro de errores y copias de seguridad cuando la arquitectura las necesita.

### 5.1 De dónde salen las afirmaciones

Antes de redactar, se auditó cada proyecto por separado: configuración de despliegue, autenticación, middlewares de API, webhooks, acceso a datos, gestión de secretos y reglas de base de datos. La matriz completa, con el estado de cada control por proyecto, está en [`MATRIZ-SEGURIDAD-INTERNAL.md`](MATRIZ-SEGURIDAD-INTERNAL.md) y **no se publica**: describe debilidades concretas de proyectos en producción.

Lo que sí se publica son medidas verificadas y sin identificar proyectos con brechas. **No se afirma seguridad absoluta, certificaciones ni auditorías externas.**

### 5.2 Referencias breves en otras áreas

- **Integraciones y APIs**: cada conexión se abre con credenciales propias y el mínimo alcance necesario, y los webhooks se validan por firma antes de aceptarse.
- **IA aplicada**: se decide con criterio qué datos salen del entorno; lo que no necesita salir se resuelve en local.

### 5.3 Brechas detectadas

La auditoría encontró **siete brechas** que requieren atención. Están documentadas en la matriz interna y resumidas en la sección 9 de este informe. **Ninguna se publica.**

---

## 6. Representaciones visuales por servicio

Cada servicio recibe una representación propia, distinta de las demás, construida con HTML y CSS (sin ilustraciones decorativas) y con la misma familia visual del sitio: filetes, números en monoespaciada, color petróleo y acento coral.

| Servicio | Composición | Qué explica |
|---|---|---|
| Automatización de procesos | flujo | Cadena de cinco pasos con marca de color: disparador, procesamiento, validación, acción y notificación. |
| Desarrollo web y plataformas | capas | Cinco capas apiladas con filete de color progresivo, la última (seguridad) en coral. |
| Datos, planillas y BI | cadena | Cadena de cinco eslabones con el dashboard destacado en coral. |
| Integraciones y APIs | hub | Núcleo central (API y webhooks) con seis sistemas alrededor y sus funciones. |
| Soporte técnico | ciclo | Ciclo de cuatro pasos con marcadores circulares y las modalidades presencial y remota. |
| Gestión de redes sociales | dos-vias | Dos vías paralelas: publicaciones y producción audiovisual, con el calendario como eje. |

La ficha de IA aplicada no lleva banda visual propia: su diagrama de orquestación va dentro del apartado correspondiente, que es donde explica algo.

### 6.1 Inventario de componentes visuales nuevos

| Componente | Archivo | Tipo |
|---|---|---|
| Mapa de capacidades del hero | build_site.py · `services_index()` | lista con iconos |
| Cadena de pasos | `.visual-chain`, `.visual-step`, `.visual-num` | rejilla con filete superior |
| Cadena con eslabón destacado | `.visual-chain--cadena` | variante de color |
| Ciclo con marcadores circulares | `.visual-chain--ciclo` | variante de marca |
| Cadena de orquestación | `.visual-chain--orquestacion` | variante con tres colores |
| Capas de una solución | `.visual-layers`, `.visual-layer` | lista con filete progresivo |
| Núcleo y satélites | `.visual-hub`, `.visual-core`, `.visual-satellites` | composición en dos zonas |
| Vías paralelas | `.visual-tracks`, `.visual-track`, `.visual-track-steps` | dos columnas |
| Capa transversal | `.visual-transversal` | banda con filete discontinuo |
| Escalera de decisión | `.visual-levels`, `.visual-level` | tres niveles con filete |
| Puntos de un apartado | `.extra-points` | lista con marca |
| Medidas de seguridad | `.measure-list`, `.measure` | rejilla con filete superior |
| Pasos de primer contacto | `.contact-steps` | secuencia numerada |
| Cabecera del diagrama visual | `.visual-head` | título y bajada |

**Reglas respetadas**: sin tarjetas genéricas, sin sombras, sin degradados nuevos, sin cajas repetidas y sin convertir ninguna sección en otro listado. Las composiciones reflowan a una columna en móvil.

---

## 7. QA

### 7.1 Sección Servicios

**8 páginas × 5 anchos (1440, 1024, 768, 390, 320) × día y noche = 80 combinaciones.**

| Comprobación | Resultado |
|---|---|
| Desbordamiento horizontal | 0 |
| Iconos de tecnología rotos | 0 |
| Chips de tecnología sin icono | 0 |
| Errores de consola | 0 |
| Navegación desde el índice | las 7 filas llevan a su ficha |
| «Otras áreas» | 6 enlaces por ficha |
| CTA de cada ficha |→ `/contacto/` con su propio texto |

### 7.2 Sitio completo

| Prueba | Resultado |
|---|---|
| `python build_site.py` | OK |
| `python qa_smoke.py` | OK — 26 rutas, 24 canónicas, JS deshabilitado y movimiento reducido |
| `node qa_tetris.cjs` | OK — motor completo |
| `python Herramientas/qa_fichas.py` | OK — las nueve fichas de proyectos |
| `git diff --check` | exit 0 |
| Paridad del resto del sitio | Todas las páginas fuera de `/servicios/` difieren **sólo en el hash de caché** de `assets/site.css` |
| Aislamiento de estilos | Ninguna clase nueva de fase 2 aparece fuera de `/servicios/` |

---

## 8. Archivos modificados y creados

### Modificados

| Archivo | Cambio |
|---|---|
| `site_data.py` | Dos grupos nuevos de ecosistemas; seis iconos nuevos en `TECH_ICON`; stack de IA ampliado a 18 tecnologías; SEO de IA actualizado; referencias de seguridad en Integraciones e IA; nuevos bloques `SERVICE_VISUALS`, `SERVICE_EXTRAS` y `SERVICE_CONTACT` |
| `build_site.py` | Hero del índice sin elemento geométrico y con mapa de capacidades; orden de secciones invertido; cierre de primer contacto; banda visual por servicio; apartados propios con numeración dinámica; `visual_block()` y `visual_chain()` |
| `assets/site.css` | Catorce componentes visuales nuevos y ajustes de aislamiento |

### Creados

| Archivo | Detalle |
|---|---|
| `assets/tech-icons/*.svg` | 6 iconos nuevos (agentes y entornos de desarrollo, MiniMax) |
| `REVISION-SERVICIOS/INFORME-FASE-2-SERVICIOS.md` | Este informe |
| `REVISION-SERVICIOS/MATRIZ-SEGURIDAD-INTERNAL.md` | Matriz interna de seguridad por proyecto |
| `Herramientas/ENTREGA-FICHAS-JMORGADO.zip` | Paquete de entrega regenerado |

### Sin tocar

Las páginas de proyectos, la sección de Herramientas, la landing, contacto, método, calculadora, juego, el sistema Archify y las ocho URLs.

---

## 9. Brechas de seguridad que requieren atención

Detalle en [`MATRIZ-SEGURIDAD-INTERNAL.md`](MATRIZ-SEGURIDAD-INTERNAL.md). Resumen:

| # | Severidad | Dónde | Hallazgo |
|---|---|---|---|
| 1 | **Crítica** | ImpulsaCV | Secretos de respaldo escritos en el código: si `JWT_SECRET` o `SETUP_KEY` no están configurados en producción, las sesiones y el endpoint de setup quedan protegidos por valores conocidos |
| 2 | Alta | ImpulsaCV | Sin cabeceras de seguridad en el borde (HSTS, X-Frame, nosniff, Referrer-Policy, Permissions-Policy) |
| 3 | Alta | ListoPorHoy | Rutas sin el middleware unificado de autenticación, según su propia auditoría técnica |
| 4 | Media | ImpulsaCV | Derivación PBKDF2 con 100.000 iteraciones, frente a 600.000 en ListoPorHoy |
| 5 | Media | ListoPorHoy | Secretos de Meta y Sheets leídos en el código pero no declarados en `wrangler.toml` |
| 6 | Transversal | Todos los web | Ninguna aplicación declara Content-Security-Policy |
| 7 | Baja | Ryvolt, Flor de Almendro | Cabeceras de seguridad sin Strict-Transport-Security |

**Ninguna de estas brechas se publica en el sitio.** La sección describe medidas verificadas, sin identificar proyectos con debilidades.

---

## 10. Lo que queda fuera y pendientes

| Punto | Motivo |
|---|---|
| Nombre «DriveVipClub» | Sin autorización para nombrarlo; sigue presentándose de forma anónima |
| Exo Dream | Sin web pública terminada; no se publica como evidencia |
| Detalle de las brechas | Va en la matriz interna, nunca en el sitio |
| Certificaciones o auditorías externas | No se han realizado; no se mencionan |
| Analítica de alcance en redes sociales | No existe como sistema completo; sigue presentada como extensión futura |
| **Pendiente de decisión** | Si el proyecto de membership debe aparecer con nombre propio, hace falta autorización expresa |
| **Pendiente de verificación** | Cuotas y condiciones de cada suscripción de modelos y agentes, para que el texto del apartado de costos sea exacto en cada caso |

---

## Fin del informe

Fase 2 de Servicios implementada el 2026-11-10. Todo quedó local, sin commit, sin push y sin despliegue.