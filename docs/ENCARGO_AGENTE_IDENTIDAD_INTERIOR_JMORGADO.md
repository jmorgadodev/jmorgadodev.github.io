# JMorgado — encargo para el agente paralelo (identidad de las secciones interiores)

**Fecha:** 7 de noviembre de 2026  
**Estado:** encargo listo para ejecución local, sin permiso para publicar.  
**Lectura obligatoria antes de editar:** AGENTS.md y docs/CONTEXTO_MAESTRO_JMORGADO.md.

## Objetivo

La web ya tiene herramientas, proyectos, servicios, Tetris, método, calculadora y contacto funcionales. La siguiente mejora es que **todos esos apartados compartan una identidad reconocible con el inicio**, sin homogeneizarlos ni copiar su Canvas.

No se busca rehacer la web ni agregar animación por agregar. Se busca fortalecer el carácter de marca: diseño modular editorial, capas con profundidad, líneas técnicas, tipografía con movimiento intencionado, variedad de composiciones y recursos reutilizables ya construidos.

## Frontera de trabajo: PROHIBICIONES

- **NO intervenir la introducción de siete escenas.** No tocar journey_study.py, assets/journey-study.js, assets/journey-study.css, ni el canon del documento maestro.
- No alterar títulos, descripciones, el orden o la animación de CRECER, ni «Todo comienza con una idea».
- No editar ni reemplazar el home hero, cambiar el scroll y GSAP de la introducción, ni alterar las reglas de sus capas.
- No introducir un nuevo tema visual que rompa la paleta/typografía del sistema.
- No sustituir proyectos reales por mockups ni inventar logos, métricas, casos o tecnologías.
- No hacer reset general del repositorio, ni commit/push/despliegue.
- Si se toca build_site.py o assets/site.css, delimitar la edición a secciones posteriores y verificar que no afecte a .tech-study, .study-frame, .study-copy o las siete escenas.

## Inventario que debes revisar antes de producir

- Diseño y colores: assets/themes.css, assets/site.css, assets/site.js.
- Estructura: build_site.py (home() después de journey_markup()), site_data.py, publish_site.py.
- Componentes reutilizables: tool_card/tool_sample/tool_workbench/tool_drawer, project_mark/featured_case, tech_badges/TECH_COLORS, order_example/home_savings.
- Geometrías: assets/modular/ (manifest y choreography), assets/modular-v02/.
- Kits fuente: Herramientas/JMorgado_Kit_Modular_Dia_Noche_v01 y Herramientas/JMorgado_Kit_Modular_Tecnologias_v02.
- Evidencia y marcas: assets/project-marks/, assets/project-previews/.
- Fichas y comportamiento: assets/tool-panel.js, assets/project-portal.js.
- Juego y cálculo: tetris_game.py, assets/tetris-preview.js, assets/calculator.js.
- QA y despliegue: qa_smoke.py, qa_tetris.cjs, README.md.

No basta con hojear: identifica qué piezas SVG y qué componentes existen ya en producción y cuáles son sólo referencias de kit. Reutiliza antes de dibujar otra cosa.

## Propuesta de ritmo de trabajo

### Etapa 1 — Auditoría visual, sin modificar el intro

- Ver la landing actual completa en escritorio 1440px, tablet y móvil. Revisar día/noche.
- Inventariar secciones posteriores (capacidades, herramientas, proyectos, Tetris, método, calculadora, contacto y servicios interiores).
- Describir por sección: qué funciona; qué se repite; dónde parece plantilla; qué recurso existente podría dar identidad; qué movimiento mostraría mejor el contenido.
- Confirmar si logos, capturas, paneles y ejemplos son reales o sintéticos y verificar el enlace correspondiente.
- Guardar capturas antes de empezar y un snapshot específico de los archivos que tocarás.

### Etapa 2 — Sistema visual compartido, expresiones distintas

Diseñar y aplicar progresivamente una misma gramática:
- Geometrías P/E/S del kit v01 para pequeñas conexiones estructurales.
- Módulos T/G/K del kit v02 para capacidades, tecnología, marcos y tipografía cinética donde exista relación semántica.
- Paleta día/noche, tipografía Instrument Sans/IBM Plex Mono, trazos finos y acento coral.
- Profundidad editorial mediante tres planos diferenciables (fondo técnico tenue / contenido legible / interacción sobrepuesta).
- Una continuidad sutil entre secciones, pero sin un componente repetido siete veces.

Dirección diferenciada por bloque (adaptar, no copiar mecánicamente):
1. **Capacidades**: situaciones reales; al explorar se conecta problema con posible intervención. Evitar las tres tarjetas de iconos como única estructura.
2. **Herramientas propias**: banco de trabajo o fichas de utilidades; seleccionar/abrir panel lateral desde la derecha, interacción clara y accesible, muestras reales o declaradas.
3. **Proyectos**: archivo editorial de casos con logos genuinos, composición más generosa y diferenciación por tipo de desarrollo; primeros cuatro: ImpulsaCV, El Cambiómetro, Ryvolt y Flor de Almendro.
4. **Tetris**: pausa lúdica y demostración utilizable; conservar juego individual, controles y estados; no convertir todas las secciones en un tablero.
5. **Método**: hacer visible el criterio al revisar datos, las excepciones y el rol humano; el caso de conciliación de pedidos es hipotético.
6. **Calculadora**: instrumento de medición, no infografía de ROI ficticio. Facilitar parámetros y explicar supuestos.
7. **Contacto**: final directo, WhatsApp «Conversemos», LinkedIn ya en ficha personal, alternativa de agendar.
8. **Servicio RRSS**: lenguaje y composición propios de gestión editorial, distinto de software desarrollado y distinto de KOOOKE RRSS como caso técnico.

No hagas una cuadrícula de cubos para decorar cada título. Los bloques deben sugerir función, módulos, relación y movimiento.

### Etapa 3 — Profundidad de contenido sin AI slop

- Revisión de microcopy de secciones interiores: natural, directo, ejemplos concretos.
- Evitar «soluciones innovadoras», «transformación de negocios», «mejora exponencial», frases intercambiables.
- Proyectos: contexto, por qué se tomó cada decisión, tecnología utilizada de verdad y restricciones; conservar PROJECT_DECISIONS y cautelas existentes.
- Stack: reutilizar tech_badges con colores propios; si añades SVG tecnológicos, no afirmar que son logos oficiales.
- Herramientas: AuditaPC, Nokto y DatosDemoCL con links oficiales y demos. No mezclarlas con los nueve proyectos ejecutados.
- Respetar qué es funcional hoy. El récord de Tetris actualmente se guarda en el navegador; no presentarlo como ranking global. Si se evalúa ranking global, documentar backend, validación y alcance antes de intervenir la funcionalidad.

### Etapa 4 — Motion y cohesión

- Títulos pueden tener bandas tipo K01, marcos K02, líneas K03 y piezas que reaccionan a entrada/hover/scroll, pero texto siempre por delante y legible.
- El movimiento debe tener una función: revelar contexto, mostrar relación, abrir detalle o explicar transición. Alternar dirección, profundidad y pausa según sección.
- Animar preferentemente transform/opacity; respetar prefers-reduced-motion; no introducir dependencia grande ni Canvas en todas partes.
- Preferir contenido estático valioso si JavaScript falla.
- Evitar elementos encima de CTA, descripciones y marcas en pantallas compactas.

### Etapa 5 — QA obligatorio

- python publish_site.py
- python qa_smoke.py (incluye guardia de los siete textos originales, CRECER y el cierre).
- node qa_tetris.cjs, cuando el entorno soporte las pruebas.
- git diff --check y comprobación de enlaces, consola y focos.
- Capturas comparables en escritorio, tablet y móvil, temas día/noche y reduced-motion. Comprobar scroll ida/vuelta.
- Verificar que la página de herramientas, los proyectos, el Tetris y la agenda no tengan regresiones.
- Mostrar la diff de los archivos editados y justificar cualquier cambio compartido.

## Entrega esperada del agente

1. Tabla de hallazgos por sección y decisiones de diseño concretas.
2. Mejoras implementadas localmente, reusando assets existentes.
3. Lista exacta de archivos tocados y razón.
4. Evidencia antes/después, con capturas o reporte visual legible.
5. Resultados de QA, errores, límites y pendientes.
6. Confirmación explícita: «NO TOQUÉ LA INTRODUCCIÓN; los siete textos originales y CRECER siguen intactos».
7. No publicar ni hacer commit. Dejar el trabajo disponible para revisión.

**Regla final:** si una mejora necesita cambiar el diseño del intro, detener sólo esa parte y reportar la propuesta; el otro flujo de trabajo es el único propietario del inicio.
