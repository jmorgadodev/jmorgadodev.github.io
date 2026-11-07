# JMorgado — contexto maestro, identidad y decisiones protegidas

**Fecha de consolidación:** 7 de noviembre de 2026  
**Estado:** referencia activa para continuar el proyecto. Reúne decisiones confirmadas por Jorge, el contenido real del repositorio y propuestas todavía sujetas a validación.  
**Destino:** agentes, colaboradores y futuras sesiones.  
**Alcance:** todo el sitio, con especial protección de la introducción. **Este documento NO aprueba rediseñar la introducción.**

> LEER ANTES DE TOCAR CÓDIGO. En este proyecto ya se perdió trabajo por sustituir animaciones, reescribir textos y confundir una referencia visual con una autorización de rediseño. La prioridad es continuidad, no reinterpretación. Si falta contexto, revisar los respaldos y pruebas; no inventar una nueva versión.

## 1. Qué es JMorgado

JMorgado es la web personal y la carta de presentación profesional de **Jorge Morgado**, un desarrollador y profesional técnico independiente en Chile. No es la página de una agencia ficticia ni un catálogo de promesas de inteligencia artificial.

La web debe comunicar, con pruebas y experiencias utilizables, que Jorge recibe problemas concretos de personas y empresas: soporte técnico, planillas difíciles de mantener, tareas repetitivas, información dispersa, sistemas que no se conectan, sitios que faltan, aplicaciones e integraciones. Ha trabajado con Python, Excel/Power Query, APIs, Google Workspace, n8n, Make, desarrollo web, plataformas en la nube y agentes/modelos cuando aportan valor.

**Idea editorial:** antes de proponer tecnología se entiende el problema, el contexto y el resultado esperado. La solución puede ser pequeña o crecer hasta una plataforma, pero no se vende más complejidad de la necesaria. No imponer IA como respuesta a todo.

Públicos con igual valor:
- Persona o empresa con una necesidad práctica, posiblemente sin vocabulario técnico.
- Profesional técnico, reclutador o posible colaborador que quiere verificar experiencia, arquitectura, criterio y calidad de ejecución.

La web debe poder entenderse sin jerga en los bloques iniciales; las páginas de casos sí pueden profundizar en stack, restricciones, decisiones y resultados.

**Tono de voz:** primera persona cuando corresponda; cercano, concreto, breve, humano, sin grandilocuencia ni frases repetidas. Ejemplos reconocibles antes que listas de siglas. La orientación o conversación diagnóstica inicial es gratuita; trabajo técnico, auditorías y entregables se acuerdan aparte.

Contacto público definido:
- WhatsApp: +56 9 3390 4330. URL: https://wa.me/56933904330. CTA preferente: «Conversemos».
- LinkedIn: https://www.linkedin.com/in/jorge-morgado/
- Repositorio web: https://github.com/jmorgadodev/jmorgadodev.github.io

## 2. Propósito de la experiencia

La primera visita tiene que sentirse como **una experiencia desarrollada con criterio**, no como una plantilla comercial con un héroe y tres tarjetas idénticas.

La introducción es una narración visual de siete capítulos en una misma escena viva, gobernada por scroll. Después el visitante tiene libertad: servicios, herramientas propias, proyectos, Tetris, método de trabajo, cálculo de tiempo y contacto.

Lo que da identidad:
1. Sistemas modulares que se relacionan, se despliegan, giran, se conectan y cambian de función.
2. Tipografía protagonista y animaciones sincronizadas con su sentido; no todo el texto aparece al mismo tiempo.
3. Composiciones con profundidad editorial: planos, líneas de construcción, trazos, conectores, espacios vacíos intencionales y contrastes.
4. Oscilación entre fondos lino/marfil y petróleo/carbón, con acentos coral/ámbar/oliva.
5. Un Tetris propio y jugable como guiño personal y demostración de capacidad técnica; no tematizar toda la web como videojuego.
6. Ejemplos verificables de trabajo y recursos que alguien puede inspeccionar, usar o descargar.
7. Un ritmo: entrada → establecimiento → revelación → pausa legible → transformación hacia la siguiente idea. No siete animaciones separadas que reinician todo.

**Qué NO es identidad:** repetición de tarjetas, números de sección como ornamento, iconos genéricos en filas, cubos abstractos sin significado, líneas o esferas sin función, palabras superpuestas a palabras, grandes cantidades de efectos que distraen, scroll con tirones, widgets decorativos que no hacen nada.

## 3. Introducción: canon editorial BLOQUEADO

**Responsabilidad exclusiva del trabajo sobre el inicio.** El agente paralelo de secciones interiores no puede alterar títulos, descripciones, orden, duración narrativa, composición ni scripts de la introducción sin autorización expresa de Jorge.

**Fuente actual:** journey_study.py, función render_study(), TITLES y DESCRIPTIONS.  
**Respaldo editorial anterior a la reescritura:** copia de 7 de noviembre a las 02:18 en el directorio temporal jm-home-copy-before-editorial-20261107-021832.  
**Respaldo validado y completo:** Herramientas/respaldo_textos_originales_verificados_20261107.  
**Prueba de regresión:** qa_smoke.py compara todos los titulares y descripciones, también el HTML generado.

Los siete capítulos que se deben conservar **textualmente** son:

| Nº | Titular | Descripción exacta |
|---|---|---|
| 01 | Hay algo que podría / funcionar mejor. | Una tarea que pesa. Una idea que todavía no encuentra su forma. |
| 02 | Antes de cambiar algo, / hay que entenderlo. | Comprender las relaciones cambia la manera de resolver. |
| 03 | Empezar por algo / que funcione. | Una solución pequeña también puede transformar el trabajo. |
| 04 | Lo que funciona puede / **CRECER.** | Una buena idea se desarrolla sin empezar otra vez. |
| 05 | Una buena base abre / nuevos caminos. | Cada nueva capacidad amplía las posibilidades. |
| 06 | Cada pieza encuentra / su lugar. | Las partes se convierten en un conjunto. |
| 07 | Todo comienza / con una idea. | **No lleva descripción.** |

Las barras separan los dos fragmentos para presentación, **no son parte del texto**.

### Regla especial de CRECER

- «CRECER» es la gran palabra formada por **partículas de colores y formas** en Canvas. Esa animación está deliberadamente preservada.
- El HTML muestra «Lo que funciona puede» y lleva etiqueta accesible con la frase completa «Lo que funciona puede crecer.».
- **No dibujar una segunda palabra CRECER tipográfica, gigante o semitransparente detrás.**
- No sustituir la palabra de partículas por un flujo de tres nodos, tablas, cubos, una esfera, otra imagen o etiquetas.
- Mejorar encuadre, suavidad y lectura puede hacerse sin tocar el texto ni eliminar la animación existente.
- El texto vertical en la escena 02 se probó y **fue rechazado**. No reintroducir rotación -90°/90°, texto invertido o lectura vertical; el titular debe ser legible horizontalmente.
- El cierre «Todo comienza con una idea.» **no se negocia**. No reemplazar por «¿Qué te gustaría resolver?», «Conversemos» ni similares.
- No inventar rótulos como «CAMINO DISPONIBLE» ni agregar grandes esferas, recuadros de puntero o barras de datos ajenas a la narración.

**La arquitectura del inicio:** journey_study.py produce texto HTML semántico, assets/journey-study.js controla Canvas/scroll/GSAP, assets/journey-study.css presenta cada escena, y build_site.py los integra en la página. Hay siete capítulos editoriales y ocho posiciones o fases técnicas de movimiento; no confundir ambos conceptos.

Al trabajar el inicio: revisar TODAS las escenas y transiciones, inicio y retorno con scroll, velocidad y suavidad real, contraste, desktop/tablet/móvil/landscape, modo noche, movimiento reducido, teclado, estado de textos y ausencia de desbordamientos. Ante discrepancia, priorizar el respaldo editorial anterior a la reescritura y la voluntad explícita de Jorge.

## 4. Referencias: tomar PRINCIPIOS, no copiar diseños

Referencias conversadas:
- https://prompt-motion.com/jasonzhou1993-8595e0 — ritmo visual, tipografía cinética, evolución de elementos, transiciones sincronizadas; el reel es un referente de *cadencia*, no un kit para reproducir literalmente.
- https://grail-app.com/ — viaje por scroll, continuidad y ritmo.
- https://rauno.me/ — microinteracciones con precisión; NO copiar la tipografía.
- https://antiwebslop.com/ — evitar patrones genéricos y explicar con evidencia.
- https://jstris.jezevec10.com/ — referencia de controles/experiencia del Tetris individual, no de UI de todo el sitio.

**Material archivado, NO vigente como brief:** BRIEF_REPLICACION_EL_VIAJE.md; docs/METODOLOGIA_PENDIENTE.md; docs/historico/REFERENTES_Y_DIRECCION_EDITORIAL.md. Contienen investigación y propuestas rechazadas/pospuestas; se consultan sólo para entender límites e historia, nunca para reconstruir automáticamente su estética ni reescribir el canon actual.

## 5. Lenguaje gráfico y design system existente

### Tokens exactos de marca (assets/themes.css)

| Rol | Día | Noche |
|---|---|---|
| Fondo lino | #F0EDE6 | #111B20 |
| Superficie marfil | #FCFAF5 | #1A282C |
| Texto | #222327 | #F3F0E8 |
| Petróleo | #23494E | #477982 |
| Petróleo profundo | #102E38 | #27464E |
| Oliva | #737B69 | #ADB29C |
| Piedra | #C9C8B7 | #818578 |
| Ceniza | #A5A18D | #B5B19F |
| Coral / señal | #F45A3A | #FF785C |
| Ámbar | #E8B769 | #EEC47D |
| Arcilla | #D99B89 | #DDA294 |

Se usan variables CSS de la familia --jm-*; no crear una segunda paleta independiente para cada sección. El tema es global con data-jm-theme="day" o "night"; usar el contraste correcto, respetar preferencia del usuario y comprobar ambos. Evitar menta, neones, gradientes brillantes de SaaS y colores arbitrarios.

**Tipografía efectiva de tema:** Instrument Sans para texto/titulares, IBM Plex Mono para metadatos. El código heredado de assets/site.css contiene tokens anteriores Syne/IBM Plex Sans; assets/themes.css define el sistema efectivo. No basarse sólo en los valores viejos sin revisar la cascada real.

**Elementos recurrentes de composición:** bloques geométricos con piezas de distintos tamaños, esquinas y muescas; cortes, placas y capas; aristas y líneas técnicas; guías finas y conectores; un acento coral como señal; patrones de celdas y puntos sólo cuando se refieren a un dato o mecanismo. Respetar espacios en blanco. Cada apartado debe variar escala, profundidad, dirección y revelado.

### Biblioteca v01: piezas modulares de origen

- Fuente: Herramientas/JMorgado_Kit_Modular_Dia_Noche_v01/jmorgado-modular/.
- Implementación copiada al sitio: assets/modular/.
- Manifiesto: assets/modular/manifest.json, con posiciones, IDs y roles. coreografía: assets/modular/choreography.json.
- **P01–P12:** piezas estables (brazo, desfase, cruce, columna, ángulo, escalón, núcleo, arco lateral, contrapeso, cubierta, bóveda y llave). No intercambiar identidades arbitrariamente.
- **E01–E07:** conectores rectos/en codo, guía de profundidad, guía de alineación, cierre/unión, semilla y basamento.
- **S01–S04:** superficies editoriales, banda de ensamble, marco abierto y etiqueta con muesca.
- SVG sin fondo con capas semánticas body/side/extrusion/seams/accent/etch; variantes día/noche. Los recursos de escenas estáticas son referencias, no siete imágenes de producción consecutivas.
- Aplicación correcta: elementos persistentemente conectados; animar contenedor y capas cuando aporte sentido. Texto por separado en HTML. Fondos de trama/líneas por CSS.

### Biblioteca v02: modular tecnológico y tipográfico

- Fuente: Herramientas/JMorgado_Kit_Modular_Tecnologias_v02/.
- Subconjunto de recursos ya disponible en assets/modular-v02/.
- Manifiesto v02/manifest.json.
- **T01–T08:** Excel, Power BI, Power Query, n8n, Make, Desarrollo, Agentes IA e Integraciones. Tienen símbolo geométrico *inspirado en la tecnología*, **no logo oficial**. Acompañarlos de etiquetas HTML reales.
- **G01–G10:** plataforma base, superficie expandible, alas laterales, cubierta, viga telescópica, conector flexible, nodo de unión, semilla y marco/portal.
- **K01–K04:** banda de revelado, marco editorial, subrayado por tramo e indicador de escena.
- Diseño deliberado: módulos mayores, alas y conexiones flexibles para romper la monotonía de fichas pequeñas. **No apilar ocho tecnologías como una torre**.
- Si el SVG debe responder a variables CSS y animaciones internas, insertarlo inline con capas/IDs; un img externo no permite colorear grupos internos desde CSS del documento.
- Vistas preview PNG del kit: sólo revisión, no producto final.

Estos kits aportan vocabulario visual, no una obligación de poner una pieza junto a cada título. Las composiciones pueden ser asimétricas, por capas y con movimientos de dirección diferente, pero siempre legibles y justificadas.

### Cómo mostrar datos y contenido: repertorio real

1. **Capacidades como situaciones**: home() → .home-capabilities, con acciones como ordenar datos, conectar herramientas, desarrollar. Se entiende el problema primero.
2. **Herramientas propias**: tool_card(), tool_sample(), tool_workbench() y tool_drawer() en build_site.py. Cada ficha presenta tarea, demo/imagen real o muestra declarada, características, estado, tecnología y enlaces; el panel lateral usa assets/tool-panel.js. No fingir un producto ni sustituir una captura autorizada.
3. **Proyectos ejecutados**: featured_case(), entry(), project_mark(); marcas reales en assets/project-marks/ y capturas de revisión en assets/project-previews/. Diferenciación clara frente a herramientas open source.
4. **Stack tecnológico**: tech_badges() y TECH_COLORS en build_site.py; fichas tipo etiqueta con --tech-color por herramienta verificada. Completar con SVG T01–T08 cuando tenga sentido, sin asignar tecnologías no usadas. Esto es distinto de un logo oficial.
5. **Casos técnicos**: PROJECT_CONTEXT, PROJECT_DECISIONS, flujo, cautelas, evidencia y stack desde site_data.py. Explicar problema → decisiones y motivo → implementación → límite/resultados verificables.
6. **Método**: .home-method y order_example() muestran un pedido con montos que no cuadran, **caso hipotético**; la metodología real comienza por entender excepciones.
7. **Calculadora**: home_savings(), assets/calculator.js y /calculadora/. El ahorro es una simulación, no un antes/después medido en cliente. Comparar tiempo inicial, frecuencia, intervención y tiempo restante.
8. **Tetris**: /jugar/, tetris_game.py y assets/tetris.js, tetris.css, assets/tetris-preview.js. Demostración interactiva con controles configurables y récord personal en el navegador. **No confundir con ranking global**: la persistencia actual consultada usa localStorage. Una tabla global con nombre exige backend y validación, no sólo UI.
9. **RRSS como servicio**: /servicios/redes-sociales/, distinto de un proyecto de desarrollo web y del caso KOOOKE RRSS. Mostrar alcance real, planificación, contenido, revisión y resultados verificables, no promesas de crecimiento.
10. **CTA de conversación**: WhatsApp «Conversemos» más agendamiento como alternativa, sin formularios invasivos ni falsas llamadas de urgencia.

No reducir la exposición de datos a barras, cubos, diagramas de tres nodos o tarjetas repetidas. Elegir estructura informativa según el contenido: comparación de datos, secuencia de acciones, grafo de conexiones, capas de una arquitectura, antes/decisión/después, vista de software, ficha técnica, demo interactiva o tabla real.

## 6. Mapa real del sitio y orden actual

El código vigente genera **24 páginas canónicas + 2 redirecciones antiguas (26 rutas)**. Las fuentes son Python y assets locales; los HTML en las carpetas son generados.

Orden del home() después de la introducción:
1. **Capacidades / quién está detrás**: situaciones concretas, presentación personal y LinkedIn.
2. **Herramientas / recursos**: software propio, demos y panel de detalles.
3. **Proyectos realizados**: destacan en este orden **ImpulsaCV → El Cambiómetro → Ryvolt → Flor de Almendro**.
4. **Una pausa / Tetris**: invitación a jugar, no un videojuego obligatorio para navegar.
5. **Método de trabajo**: caso de pedidos con diferencia de montos, con criterio humano.
6. **Calculadora**: cuánto tiempo puede recuperarse en un supuesto.
7. **Contacto**: WhatsApp «Conversemos» y posibilidad de agendar.

Las páginas internas abarcan: /proyectos/ y nueve proyectos, /herramientas/ con tres recursos, /servicios/ y siete servicios, /jugar/, /metodo/, /calculadora/ y /contacto/. Dos rutas heredadas de herramientas redirigen al catálogo.

**No mover casos de herramientas a proyectos para llenar una sección.** Los recursos propios son AuditaPC, Nokto y DatosDemoCL, con repositorios y descargas cuando correspondan. Los proyectos ejecutados incluyen ImpulsaCV, El Cambiómetro, Conecta/ListoPorHoy, Ryvolt, Flor de Almendro, Exo Dream, Toby's Warehouse, KOOOKE Portal y KOOOKE Operación RRSS. La clasificación refleja el trabajo documentado en site_data.py.

## 7. Identidad para bloques posteriores: PROBLEMA VIGENTE

El agente anterior terminó secciones funcionales y con buenos recursos, pero **el resto de la web todavía puede verse desconectado del carácter de la introducción**. El próximo objetivo no es agregar más efectos indiscriminados sino hacer que se sienta un mismo proyecto.

Criterios:
- Mantener lenguaje visual reconocible (tokens, geometría, materiales, tipografía, señal coral, trazos).
- **Dar una personalidad diferente a cada sección:** capacidades tipo conexiones/decisiones, herramientas como banco de trabajo, proyectos como archivo de casos con marcas, juego como pausa interactiva, método como secuencia real, calculadora como instrumento de medición, contacto como cierre claro.
- Agregar profundidad con capas y líneas estructurales **de función comprensible**, sin tres torres idénticas, grandes círculos decorativos ni tarjetas repetidas.
- Títulos pueden acompañarse de bandas K01, marcos K02, subrayados K03 y acentos, pero nunca encajonar todas las frases en bloques ni tapar lectura.
- No repetir exactamente el mismo fade/slide; animación específica y reversible, controlada por entrada/scroll/hover cuando mejore comprensión.
- El panel de herramientas puede deslizarse desde la derecha; el detalle debe ser útil y accesible por teclado.
- Crear transiciones entre secciones para que la portada no parezca un collage de temas, sin intervenir el intro.
- Contraste y jerarquía primero, luego movimiento; el título no debe solaparse con el dibujo.
- En móvil, horizontal compacto o reduced-motion conservar un diseño completo, no simplemente ocultar elementos.
- Evaluar rendimiento de SVG, Canvas, animaciones y navegación; no agregar dependencias por exhibición.

Ideas de dirección, **no cambios aprobados**: línea de conexión entre herramientas/proyectos/método; tramas de datos en capacidades, fichas con panel lateral y muestras; componentes de kit en los laterales o tras los encabezados; variantes de profundidad editorial. Probar con capturas y revisar antes de extender un patrón.

## 8. Reglas contra AI slop y afirmaciones falsas

Evitar sin excepción:
- «Transformamos ideas en soluciones», «potenciamos tu negocio», «innovación disruptiva», eslóganes vacíos, textos inflados, repeticiones sin información.
- Empresa/agencia o equipo plural ficticio si el trabajo es de Jorge como independiente.
- Prometer crecimiento de ventas/seguidores, ahorro de tiempo o disponibilidad 24/7 sin datos.
- Testimonios, cifras de impacto, logos, iconos de marcas o screenshots inventados.
- Presentar la calculadora hipotética como caso real.
- Atribuir IA a funciones deterministas; atribuir ejecución local a servicios externos; afirmar sincronización en tiempo real sin evidencia.
- Mostrar redes sociales, publicaciones automáticas u OAuth como habilitados para todas las plataformas sin verificar permisos.
- Copiar el estilo de un referente o disfrazar una plantilla agregando bloques de color.

Buena redacción: identifica una situación observable, la decisión tomada, el resultado comprobable y el límite si existe. En proyectos usar un lenguaje técnico proporcional, con fuentes del propio repositorio y cautelas de site_data.py.

## 9. Arquitectura, rutas y QA

Raíz Windows actual: C:\Users\jorge\Proyectos\Jmorgado\landing

Archivos principales:
- build_site.py: plantillas, composición, páginas, tech badges, marcas y herramientas.
- site_data.py: proyectos, decisiones, servicios y recursos. Contenido de casos y límites.
- journey_study.py: **CANON INTRO BLOQUEADO** (siete títulos/descripciones).
- assets/journey-study.js y assets/journey-study.css: **CANON INTRO BLOQUEADO** (animación/escenas).
- assets/themes.css: tokens día/noche (compartido).
- assets/site.css, assets/site.js: presentación general (compartidos; cambios deben ir con selectores acotados).
- assets/modular/ y assets/modular-v02/: recursos geométricos y manifiestos.
- assets/project-marks/ y assets/project-previews/: logos y capturas existentes.
- assets/tool-panel.js y assets/project-portal.js: comportamientos de paneles.
- tetris_game.py, assets/tetris.js, assets/tetris.css: juego.
- publish_site.py: crea _site/ y las rutas.
- qa_smoke.py: pruebas de contenido, accesibilidad, vista, navegación y funcionalidades.
- qa_tetris.cjs: pruebas Tetris adicionales.
- README.md: publicación y repo.

Comandos:
    python publish_site.py
    python qa_smoke.py
    node qa_tetris.cjs
    node --check assets/journey-study.js
    git diff --check

No asumir que todos los comandos funcionarán sin dependencias de pruebas instaladas en otra máquina. En el equipo de Jorge hay Playwright/Chrome para QA. **Una compilación no valida por sí sola la calidad de la experiencia; revisar con navegador, screenshots y scroll real.**

Publicación: GitHub Pages desde main y Cloudflare Pages desde el mismo repositorio. Un push a main puede disparar despliegue automático. **PROHIBIDO commit/push/deploy sin autorización explícita.** Mantener _site reproducible desde fuentes.

## 10. Trabajo en paralelo y fronteras de edición

**Propietario del intro:** Jorge + asistente trabajando en la historia. Archivos protegidos: journey_study.py, assets/journey-study.js, assets/journey-study.css, texto canon de este documento y controles de prueba. No cambiar build_site.py:journey_markup(), el orden de intro ni sus llamadas de scripts.

**Agente de secciones posteriores:** puede auditar/refinar capacidades, herramientas, proyectos, servicios, método, calculadora, juego y contacto en los archivos asignados, con cautela al tocar build_site.py, site_data.py y assets/site.css porque son compartidos. Usar clases específicas .home-* o nombres de sección, evitar selectores globales que afecten a .tech-study y .study-copy. No editar assets/themes.css sin propuesta independiente y verificación día/noche de toda la web.

El usuario debe poder seguir revisando el intro mientras el otro agente trabaja. No reiniciar ni sustituir servidores de forma disruptiva, no reset general de Git, no reemplazar archivos generados a mano, no limpiar recursos que otros usan.

**Jerarquía para resolver conflictos:** petición explícita reciente de Jorge > reglas protegidas de este documento y qa_smoke.py > contenido de fuente verificado > propuestas de los kits > documentos históricos rechazados. Una idea nueva no autoriza eliminar una decisión vigente.

## 11. Protocolo de cambio seguro

1. Leer este documento, AGENTS.md y los archivos de la sección antes de editar.
2. Consultar git status/diff y los últimos trabajos; identificar autoría de cada grupo de archivos.
3. Crear snapshot local acotado de los archivos de trabajo; **nunca restaurar toda la rama**.
4. Documentar problema observado con captura o evidencia, objetivo y archivos que se modificarán.
5. Cambios quirúrgicos: un bloque/sección a la vez, sin reescribir textos aprobados para acomodar gráficos.
6. Comparar antes/después en pantalla ancha, tablet, teléfono y landscape, día/noche, scroll ida/vuelta y reduced motion.
7. Ejecutar QA incluyendo contrato editorial (7 frases, CRECER gráfico, cierre exacto).
8. Informar qué cambió, qué se conservó, qué se probó, qué queda por revisar y rutas de respaldo.
9. No afirmar «finalizado» si falta validación visual; no publicar sin autorización.

**Criterio de aceptación general:** una persona entiende qué hace Jorge, puede verificar obras y descargar recursos, se siente ante una marca personal coherente y encuentra conversación sencilla. La estética debe parecer diseñada a propósito, nunca rellena por IA.

## 12. Estado comprobado y asuntos abiertos a esta fecha

**Comprobado en código/repositorio:** siete escenas textuales restauradas; CRECER de partículas sin duplicado tipográfico; QA de regresión textual; arquitectura de estático Python; 9 proyectos; 3 herramientas; 7 servicios; fichas y logos de algunos proyectos; panel de herramientas; Tetris individual con controles y récord local; WhatsApp/LinkedIn; paleta día/noche; kits SVG v01/v02 y manifiestos; local _site con 24 páginas canónicas y dos redirecciones.

**A mejorar sin borrar avances:** coherencia visual y profundidad de las secciones posteriores, uso intencional de recursos existentes, ritmo de la UI, accesibilidad, variación real de composiciones y mantenimiento de la línea editorial.

**No asumir implementado:** ranking global persistente de Tetris (el código actual usa localStorage), automatizaciones sociales ilimitadas, integraciones de terceros sin permisos, resultados comerciales o métricas de clientes.

**Importante:** esta es una fuente de contexto para agentes, no una promesa de que la memoria de ChatGPT esté encendida. Mantenerla actualizada solamente tras una decisión explícita del usuario; consignar el cambio y su motivo, sin reescribir silenciosamente la historia.

## 13. Iteración local en revisión — ritmo y apertura (7 nov. 2026)

Esta es una **implementación provisional para revisión visual de Jorge**, no una nueva aprobación del canon narrativo. Respaldo anterior: `Herramientas/respaldo_intro_antes_ritmo_20261107`.

- El primer titular conserva el texto original, pero se presenta ya al entrar en la página: primera línea visible desde el inicio, segunda línea revelada con máscara, regla y descripción a continuación. Si el usuario hace scroll antes de terminar, se completa el texto en vez de dejarlo cortado.
- Las piezas que antes llenaban el ancho sin una composición reconocible ahora se muestran en tres disposiciones distintas (estructura incompleta, nube compacta, secuencia desalineada). Siguen siendo los mismos módulos, no tarjetas ni archivos ficticios.
- El primer scroll reordena los módulos por columnas escalonadas y al final usa **exactamente** `stackPoint()`, que sigue siendo la entrada de la segunda escena. La conversión a barras se completa cerca del destino, evitando tantos solapamientos.
- El tiempo de arrastre GSAP (`scrub`) se ha bajado de `.72` a `.42`. Las duraciones y el canon de siete títulos no se alteran.
- En la segunda escena se eliminó la orientación vertical rechazada: lectura horizontal, título arriba y diagramas conectados debajo, con diseño responsive.
- La zona de hover de los módulos iniciales cambia de tamaño con su forma real.
- **No modificar:** títulos, descripciones, palabra CRECER de partículas, círculo discreto de su escena, cierre «Todo comienza con una idea.», el Tetris ni secciones posteriores.
- Validar con navegador día/noche, scroll ida/vuelta, landscape, móvil, reduced-motion; correr `python qa_smoke.py`. Una pasada técnica no sustituye la revisión editorial y visual de Jorge.

Este historial sirve para diferenciar mejoras en prueba de decisiones finales y para que nadie las confunda con una instrucción de rediseño.
