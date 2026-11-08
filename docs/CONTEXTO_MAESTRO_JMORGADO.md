# JMorgado — contexto maestro, identidad y decisiones protegidas

**Fecha de consolidación:** 7 de noviembre de 2026  
**Estado:** referencia activa para continuar el proyecto. Reúne decisiones confirmadas por Jorge, el contenido real del repositorio y propuestas todavía sujetas a validación.  
**Destino:** agentes, colaboradores y futuras sesiones.  
**Alcance:** todo el sitio, con especial protección de la introducción. **Este documento no autoriza rediseñar el canon ni la estructura narrativa; los refinamientos visuales aprobados para las escenas se rigen exclusivamente por docs/PLAN_MEJORA_ESCENAS_INICIO_JMORGADO.md.**

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
3. Crear snapshot local acotado de los archivos de trabajo; **nunca restaurar toda la rama**. Excepción para la introducción: Jorge declaró la versión actual como oficial y pidió no generar respaldos rutinarios nuevos, salvo que lo solicite.
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


## 14. Estado vigente del inicio y plan de refinamiento (8 nov. 2026)

**Actualización basada en la validación explícita de Jorge:** el trabajo anterior de escenas, coreografías y transiciones queda aprobado y constituye la versión oficial de continuidad. La sección 13 conserva el registro histórico de la revisión del 7 de noviembre; su etiqueta de implementación provisional ya no describe el estado actual.

No se debe reconstruir ni reabrir la base aprobada. Las siguientes mejoras son una segunda etapa de pulido, organizada en el documento operativo [PLAN_MEJORA_ESCENAS_INICIO_JMORGADO.md](PLAN_MEJORA_ESCENAS_INICIO_JMORGADO.md):

1. **Fase 1 — Fondo y atmósfera:** auditoría de las siete escenas; fondos específicos dentro de un sistema común; profundidad, capas, iluminación y transiciones tonales coherentes en día/noche; ritmo y revelado tipográfico sin cambiar el canon.
2. **Fase 2 — Reposo activo:** movimiento ambiental autónomo en todas las escenas, sin depender del puntero; continuidad temporal y ausencia de reinicios; movimiento también durante las transformaciones y transiciones.
3. **Fase 3 — Interacción con puntero:** respuesta espacial y sistémica basada en proximidad y dirección, suave y contextual; experiencia completa en táctil y sin hover.
4. **Fase 4 — Refinamiento de materialidad:** bordes, luces, sombras, volumen 2.5D, anclajes, conectores, limpieza visual y componentes reutilizables.

**Reglas que gobiernan todas las fases:** los efectos deben existir durante el recorrido completo y no sólo en los estados de reposo; las animaciones deben ser reversibles y conservar su estado al detener/reanudar/invertir scroll; el puntero no debe controlar la misma transformación que scroll o reposo; el diseño debe mantener legibilidad, rendimiento, accesibilidad, responsive y coherencia día/noche. La referencia principal de principios visuales es Lusion; no se copia su estética ni se abandona la identidad modular de JMorgado.

**Alcance actual:** sólo las siete escenas narrativas del inicio y sus transiciones. Las secciones posteriores del sitio se revisarán cuando Jorge declare terminado el inicio. Cada fase requiere validación de Jorge antes de comenzar la siguiente.

**Estado al 8 de noviembre:** Fase 1 — Fondo y atmósfera aprobada. Fase 2 — Reposo activo aprobada por Jorge: reloj ambiental continuo, intensidad diferenciada entre scroll y reposo y señales sincronizadas con transiciones. Fase 3 — Interacción con puntero aprobada por Jorge: campo espacial común por proximidad/dirección/velocidad, respuestas en las ocho escenas, scroll ida/vuelta y toque móvil; QA integral satisfactorio. Fase 4 — Refinamiento de materialidad cerrada y aprobada por Jorge tras revisar el ajuste de contención/sincronización de módulos en la esfera. Cierre responsive del inicio: la separación entre la descripción de la quinta escena y la esfera en horizontal compacto (844×390) ya está corregida en CSS acotado; QA técnico satisfactorio en día/noche, móvil vertical, escritorio y 320×568. Pendiente revisión visual final de Jorge antes de declarar terminado el inicio. El detalle está en la bitácora del plan operativo.

**Operación:** la versión actual es oficial; no generar respaldos rutinarios nuevos. No eliminar respaldos históricos. No hacer commit, push ni despliegue: Jorge realizará el push cuando corresponda. La compilación y el QA no sustituyen la inspección visual de cada escena y de todos sus tramos de transición.


## 15. Portada de entrada y diferenciación atmosférica (8 nov. 2026)

Jorge aprobó la composición de portada que aparece al cargar el sitio y pidió una iteración adicional sobre su secuencia de entrada, el reposo de los tres grupos y la identidad de los fondos. Este bloque complementa las fases 1–4 ya aprobadas; no las reabre ni cambia el canon.

- En `assets/journey-study.js`, la carga inicial revela los tres grupos en tres tiempos, activa progresivamente la línea inferior y sus anclajes y deja una señal coral viajera. El movimiento autónomo del reposo sigue los tres grupos reales (no la antigua retícula de columnas), con microdesplazamientos contenidos.
- Las superficies base ahora diferencian los ocho capítulos en día/noche: papel cálido, salvia, coral, mineral, petróleo, piedra fría, arena y cierre petróleo. Las luces de ambiente tienen desplazamiento lento y acotado.
- Se conservan textos exactos, cantidad de módulos, composiciones, geometrías, anclajes, timeline de scroll y transiciones aprobadas. No se tocaron CSS, HTML, secciones posteriores ni archivos del agente paralelo.
- QA técnico completado: `node --check`, `python qa_smoke.py` (26 rutas; cinco tamaños), `node qa_tetris.cjs`, `git diff --check); Playwright 80 estados en cinco tamaños y día/noche sin errores ni overflow; movimiento reducido estático.
- Capturas: `_revision/portada-ambient-20261108/` y `_revision/portada-ambient-after-20261108/`.

**Estado:** implementación lista para revisión visual de Jorge. No commit, push ni despliegue.


## 16. Segunda iteración visual de la portada (8 nov. 2026)

Jorge observó que la primera mejora de portada no resolvía el problema: el modo día seguía percibiéndose plano y los objetos parecían detenidos tras una animación de entrada. Esa iteración anterior queda como antecedente técnico, no como aprobación visual.

En `assets/journey-study.js` se implementó una segunda dirección:

- Los tres grupos de módulos ahora se leen como **TAREA → IDEA → FORMA**, mediante etiquetas discretas y una ruta curva con tres nodos. Un pulso coral viaja entre ellos y cada grupo reacciona al recibirlo.
- La animación autónoma tiene tres comportamientos distintos: compresión/recuperación para TAREA, órbita y variación radial para IDEA, y una onda de alineación por filas para FORMA. Continúa después de la entrada inicial.
- La entrada parte de una concentración central y despliega los módulos hacia los grupos con desfase y asentamiento.
- En modo día se reforzaron las superficies con gradientes direccionales, focos por material, sombras de contacto, viñeteado y textura determinista de grano. Se ajustaron las bases cromáticas claras. La noche mantiene su carácter.
- El recorrido de scroll, textos, cantidad de módulos, geometría y transiciones posteriores permanecen intactos. No se tocó HTML ni secciones fuera del inicio. Se añadió una única media query CSS para evitar la superposición de titular, descripción y módulos en landscape compacto (844×390).
- Capturas: `_revision/portada-narrativa-20261108/`.

**Estado:** segunda iteración implementada; pendiente aprobación visual de Jorge. No commit, push ni despliegue.


## 17. Portada: campo orbital compartido y transferencia entre estados (8 nov. 2026)

Jorge eligió la dirección **campo sistémico + órbitas controladas + transferencias sutiles** para resolver que la actividad se concentraba demasiado en la línea inferior. Se implementó una tercera iteración complementaria en `assets/journey-study.js`:

- El campo visual ahora atraviesa los tres grupos mediante dos trayectorias curvas y tres arcos orbitales parciales, cada uno con una inclinación propia. Se evita el átomo literal y los anillos decorativos completos.
- Los módulos reales orbitan sus centros: TAREA tiene contracción y recuperación de una masa compacta; IDEA presenta la órbita más abierta y fases individuales alrededor del núcleo; FORMA recibe una onda de alineación por filas.
- Dos pequeños paquetes viajan entre grupos. El núcleo de IDEA pulsa y la conexión inferior queda subordinada como referencia.
- El movimiento se desvanece al iniciar el scroll y no altera el destino de las piezas, el canon textual, la cantidad de módulos ni las escenas siguientes.
- Con movimiento reducido, las trayectorias quedan estáticas y no se ejecutan órbitas ni transferencias.

Capturas en `_revision/portada-orbital-20261108/`. QA: sintaxis JS, `qa_smoke.py` (26 rutas y cinco tamaños), `qa_tetris.cjs`, `git diff --check` y Playwright de escritorio, móvil y landscape en día/noche: correctos, sin errores de consola ni overflow. El muestreo temporal confirma movimiento en las tres zonas.

**Estado:** implementación y QA técnico completados; pendiente aprobación visual de Jorge. Sólo se modificó `assets/journey-study.js` y documentación. Sin commit, push ni despliegue.


## 18. Portada — segunda revisión del campo orbital (8 nov. 2026)

Se refinó la tercera iteración a partir de capturas reales. Los centros de TAREA, IDEA y FORMA ahora se calculan desde `openingGroupCenter()`; `openingGroupDrift()` comparte el desplazamiento de reposo entre los módulos, los arcos orbitales, las curvas de conexión y los reflejos ambientales. `openingGroupOrbit()` sincroniza la inclinación de cada arco con el giro de su conjunto. Así las líneas dejan de quedarse fijas detrás de piezas que sí se mueven.

En móvil vertical (incluido 320×568) se elevó moderadamente el sistema completo: centros, etiquetas, ramas y circuito inferior. El móvil horizontal y escritorio conservan su composición. En modo día se reforzó la tinta de las órbitas para equilibrar la lectura que ya ofrecía el modo noche; sin añadir adornos, halos grandes ni nuevas capas decorativas.

QA: sintaxis JS, seis combinaciones de tamaño/tema sin errores de consola ni overflow; cambio de tema, puntero, transición por scroll y movimiento reducido comprobados. Respaldo anterior y capturas en `_revision/portada-orbital-20261108/`. Sólo implementación en `assets/journey-study.js` más documentación. Sin commit, push ni despliegue. Pendiente aprobación visual.


## 19. Microanimación narrativa de entrada (8 nov. 2026)

La portada ahora tiene una entrada de una sola ejecución (aprox. 2,68 s), en tres momentos solapados: aparición desde un núcleo común, formación escalonada de TAREA → IDEA → FORMA y conexión progresiva. Las curvas se dibujan en dos entregas, primero hacia IDEA y luego hacia FORMA; las órbitas se completan por conjunto y el núcleo central se activa al final. Después toma el relevo el reposo activo, sin repetir la entrada.

Si el usuario empieza a hacer scroll antes de terminar, la entrada se completa para evitar estados interrumpidos. El cambio de tema no reinicia la animación. Con `prefers-reduced-motion`, la portada aparece completa y estática.

Sólo cambió `assets/journey-study.js`; se conservaron copy, geometría final, CSS, HTML, escenas posteriores y transiciones aprobadas. QA completo: `node --check`, `python qa_smoke.py`, `node qa_tetris.cjs`, `git diff --check`; seis formatos/temas y pruebas de cambio de tema, scroll temprano y movimiento reducido, sin errores ni overflow. Capturas en `_revision/portada-orbital-20261108/`. Implementación y QA listos; pendiente revisión visual final. Sin commit, push ni despliegue.


## 20. Portada — experiencia orgánica y modo día (8 nov. 2026)

Jorge pidió superar el efecto «presentación PPT» y recuperar en modo día la profundidad y legibilidad del modo noche. Se modificó sólo `assets/journey-study.js` (no tocar el contenido canon, CSS ni escenas posteriores): aparición solapada de tres corrientes de piezas que vuelan por curvas desde un centro común, rutas y órbitas que comienzan durante la formación, etiquetas técnicas sin 01/02/03, un pulso que recorre la conexión y provoca respuesta físicamente contenida en los tres conjuntos. Los módulos conservan su geometría final y sus destinos al hacer scroll.

El modo día cambia a papel mineral neutro, reduce el baño ámbar, refuerza líneas petróleo y emplea sombras de contacto más discretas que acompañan el asentamiento de cada grupo; no añade tarjetas ni efectos decorativos. Modo noche conserva la composición existente. La entrada no se repite, no se reinicia con el tema, y las preferencias de movimiento reducido mantienen composición estática.

Capturas de esta iteración: `_revision/portada-orbital-20261108/production-*.png`. Pendiente aprobación visual de Jorge; no commit, push ni deploy.

**Cierre técnico de la iteración:** también se oscurecieron selectivamente las piezas color piedra sólo en la escena inicial de día para evitar que se fundan con el papel claro. `node --check`, `python qa_smoke.py` (26 rutas), `node qa_tetris.cjs` y `git diff --check` correctos. Validación Playwright final: 1220×859 día/noche, 390×844 día/noche, 844×390 y 320×568, todos sin errores ni desbordamiento; scroll temprano y `prefers-reduced-motion` correctos. Capturas finales: `production-final-desktop-day.png` y `production-final-mobile-day.png` en `_revision/portada-orbital-20261108/`. Implementado, pendiente valoración visual de Jorge.


## 21. Escenas 1–7: mismo estándar de movimiento y materialidad de la portada (8 nov. 2026)

Jorge validó la mejora de la portada y solicitó elevar las otras escenas. Se compararon capturas reales día/noche de las siete escenas. No se rehizo la composición: se introdujo un pulso compartido entre objeto y conexión para que cada escena tenga comportamiento causal.

- Escena 1: un solo paquete recorre la conexión, activando los puertos y módulos de cada grupo al llegar.
- Escena 2: expansión radial elástica de los módulos existentes, sin aros nuevos.
- Escena 3: onda coherente longitudinal sobre las partículas que dibujan CRECER; titular legible en modo noche por corrección CSS mínima.
- Escena 4: esfera y piso aprobados preservados.
- Escena 5: fichas responden al barrido de su plataforma, que gana profundidad en día.
- Escena 6: fondo arena mineral diurno menos lavado, tonos piedra de barras reforzados; glint que atraviesa la curva y activa las barras sin alterar anclajes.
- Escena 7: cierre, semilla y ondas preservados; se prolongó levemente el reposo visible de las cintas y se incorporaron señales que viajan por sus mismos trazados, para evitar que la escena quede estática.

Modificados exclusivamente `assets/journey-study.js`, `assets/journey-study.css` (una regla nocturna) y documentación. Sin alterar textos, tiempos de scroll, destinos, títulos, navegación ni trabajo del agente paralelo. Comparativas y snapshots móviles en `_revision/escenas-refinamiento-20261108/`. QA: `node --check`, `python qa_smoke.py` (26 rutas), `node qa_tetris.cjs`, `git diff --check`, 56 estados Playwright (escritorio, móvil, tablet, landscape; ambos temas) sin errores ni overflow. Espera revisión visual de Jorge, sin commit/push/deploy.


## 22. Plataformas y gráfico — refinamiento de material y transferencia (8 nov. 2026)

Tras la aprobación de la portada y la primera pasada sobre siete escenas, se corrigió la transición entre la escena 5 (bases/plataformas) y la 6 (gráfico). En `assets/journey-study.js`, los planos de día usan la base fría cromática de su propio capítulo (`p.bg[5]`) para bastidor/caras superiores y laterales; noche conserva su material previo. `scene5FlowPhase(group,progress)` sincroniza cable, barrido, marcador y elevación de fichas. En escena 6, `withdraw(group)` retira cada plataforma y sus conexiones de acuerdo con el avance de sus piezas, evitando planos superpuestos a barras ya formadas.

Sin cambios de textos, HTML, CSS, geometrías finales, scroll, portada, ni otros archivos del agente paralelo. Capturas: `_revision/plataformas-grafico-20261108/` (contactos día/noche y detalle 5–6). QA: `node --check`, `git diff --check`, Playwright 15 estados y luego 36 posiciones con navegación en ambos sentidos, seis combinaciones de tamaño/tema, reduced motion, sin errores ni overflow; `python qa_smoke.py` (26 rutas) y `node qa_tetris.cjs` correctos. Implementación lista para aprobación visual. No commit/push/deploy.


## 23. Landing narrativa posterior a la introducción (8 nov. 2026)

Jorge aprobó la reorganización de la landing sin alterar el inicio. Se implementó localmente el orden problema → método → impacto y calculadora → proyectos ejecutados → herramientas propias → presentación personal → pausa de Tetris → Hablemos y footer. Textos orientados al problema real, tono profesional cercano, colores funcionales según paleta JMorgado en día/noche, proyectos editoriales asimétricos con logos originales intactos y navegación contextual con marcador de capítulo.

La calculadora se abre desde el lado izquierdo en `<dialog>` y comparte **exactamente** el motor de `assets/calculator.js` con la página completa; incluye resultado visible sincronizado, parámetros editables y cálculo económico opcional sin prometer ahorros de caja. Se reutiliza Google Calendar en visor modal interno de la landing, manteniendo WhatsApp y fallback externos. La invitación de Tetris se simplificó sin tocar su juego real. El footer obtuvo firma editorial propia. Fuentes editadas: `build_site.py`, `qa_smoke.py`, nuevos `assets/home-narrative.css` y `assets/home-narrative.js`; generados sólo `index.html` y `calculadora/index.html` (este último idéntico en bytes al anterior). No se editó el Canvas del inicio ni el código del juego.

Respaldos, capturas y pruebas específicas: `_revision/landing-narrativa-implementacion-20261108/`. QA smoke completo (26 rutas, intro, responsive, JS disabled, reduced motion, visor, Tetris), pruebas propias de 5 combinaciones de pantalla/tema y modales, validaciones de menú sticky (top 80 px escritorio, 100 px móvil), foco restaurado, fórmula compartida y `git diff --check`: correctos. Servidor local: `http://127.0.0.1:8791/`. Estado: implementado y validado técnicamente, a la espera de aprobación visual. Sin commit, push ni despliegue.


## 24. Segunda dirección visual de la landing (8 nov. 2026)

Tras la crítica de Jorge («la ficha no aporta», «el impacto se representa mal», «software propio quedó igual»), se hizo una segunda implementación. En la portada se quitó la ficha hipotética de pedido y se sustituyó por un mapa visual de cuatro etapas del método (contexto, alcance, construcción, entrega). Impacto ahora compara barras proporcionales 60 min manuales vs 12 min de revisión, muestra 48 min por ejecución, 4 h/semana y 208 h/año con ecuación explícita 48 × 5 × 52. No se presenta como caso de cliente. Software propio dejó el selector antiguo y ahora muestra tres fichas simultáneas (AuditaPC, Nokto, DatosDemoCL) con capturas/muestra, tarea, plataforma, estado, repo y ficha técnica modal. Se restauró el diseño editorial desigual de proyectos y se aplicaron fondos y transiciones cromáticas día/noche en la nueva secuencia de secciones.

Archivos nuevos assets/home-refinement.css; build_site.py incluye home_method_visual, home_tool_card, home_tools_showcase y nueva visualización home_savings; qa_smoke.py refleja los nuevos titulares. Se agregó la clase tool-card a las nuevas fichas para reutilizar assets/tool-panel.js. La portada conserva el Canvas de apertura exacto y la página /calculadora/ idéntica al respaldo; Tetris, proyectos y otros trabajos paralelos sin cambios.

Capturas y respaldo: _revision/landing-refinement-20261108/. QA completo python qa_smoke.py (26 rutas), node qa_tetris.cjs, git diff --check, 4 temas/tamaños de sección, anclas sin colisión, 3 modales de herramientas en ambos temas, 320 px sin overflow, calculadora sincronizada, inicio exacto contra respaldo, sin errores de consola. Servidor local http://127.0.0.1:8791/, HTTP 200. Estado: implementado y validado técnicamente, pendiente aprobación visual. No commit/push/deploy.


## 25. Tercera dirección de arte de la landing (8 nov. 2026)

Jorge solicitó analizar todos los apartados por fondos degradados, submenú confuso, acentos de color sin función y figuras planas. Se hizo una revisión de ocho secciones en modo día, noche y móvil, manteniendo intacto el Canvas inicial.

Se sustituyó el diagrama abstracto de problema por un esquema de fuentes reales (planilla, sistemas, proceso manual) que convergen en un mapa de datos/reglas/excepciones; se aumentó su escala tipográfica y se hizo una composición vertical móvil. Método quedó como secuencia continua sin tarjetas. Impacto conserva los cálculos y barras pero sin paneles ni líneas decorativas. Proyectos son folios sin cajas/fondos de colores. Software propio conserva las tres capturas/muestra y fichas técnicas; se corrigió el contraste de AuditaPC en noche. Persona es más compacta y la numeración quedó continua: 06 persona, 07 Tetris, 08 contacto. Tetris usa preview isométrica de volumen, sin alterar el juego. Contacto ya no hereda el panel gris de interior.css; su cierre y footer comparten superficies petróleo y texto de alto contraste.

Se retiró el submenú fijo y su lógica JS; el header principal es la única navegación superior. Se ocultó el botón flotante WhatsApp en portada para evitar duplicación de CTA. Se reemplazaron todos los fondos de secciones por colores sólidos, sin degradados calculados en los apartados posteriores al intro. Nuevos estilos assets/home-art-direction.css; cambios en build_site.py, assets/home-narrative.js, qa_smoke.py; regenerados sólo index.html y calculadora/index.html. El Canvas, Tetris real, las nueve fichas de proyectos y otras páginas no se editaron.

QA smoke 26 rutas, Tetris, git diff check; Playwright día/noche/móvil con ocho secciones, sin overflow, sin degradados, sin submenú, sin errores. Capturas _revision/landing-art-direction-20261108/. Local http://127.0.0.1:8791/. Sin commit/push/deploy. Pendiente aprobación visual.

## 25. Referencias externas aplicadas a la landing — 8 nov. 2026

Jorge pidió referencias de sitios reales para corregir la landing (el diseño anterior seguía viéndose como AI slop, con espacios iguales, gráficos tipo dashboard y cierre monocromático). Se revisaron https://velvele.studio/work (índice editorial), https://alright.studio/work (jerarquía del trabajo y contexto) y https://tobiasahlin.com/ (separación herramientas propias/trabajo profesional). Se tomó el principio de diseño, sin copiar contenido ni arte.

Se rehízo en `build_site.py` la presentación del **impacto** como una sola comparación 60 minutos antes / 48 recuperados / 12 después, con 208 h/año y apertura de la calculadora real; los **cuatro proyectos** se transformaron en un índice editorial con sus logos, roles, resultados y visor interno, **sin capturas de proyectos**. El modal permite abrir sitio oficial o ficha local. Se redistribuyó **software propio** (AuditaPC protagonista, Nokto y DatosDemoCL secundarios) y se diferenció el cierre: identidad personal en salvia, Tetris en ámbar y tablero petróleo, Hablemos claro y footer petróleo compacto. CSS nueva capa sólo home: `assets/home-editorial-pass.css`. Interacción del modal: `assets/home-narrative.js`. La intro y Tetris permanecen intactos; ningún commit/push/deploy.

Importante: comprobación HTTP del 8 nov. 2026 detectó que ImpulsaCV no permite embedding externo (`X-Frame-Options: SAMEORIGIN`), y El Cambiómetro tampoco (`DENY`, `frame-ancestors 'none'`). **No se eluden** esas restricciones: esos dos se abren en la ficha propia dentro del modal y ofrecen visitar el sitio oficial. Ryvolt y Flor de Almendro se intentan cargar directamente en visor, con enlaces alternativos. Modal de cada proyecto probado 12 veces en día/noche/móvil, con Escape y foco restaurado. Se mantiene el calendario en ventana interna, WhatsApp y la calculadora compartida.

Respaldo y capturas de revisión técnica: `_revision/landing-art-rebuild-20261108/`. Investigación y decisiones: `docs/REFERENCIAS_Y_REDISENO_LANDING_20261108.md`. Se comprobó literalmente la igualdad de los 3518 caracteres del inicio original; el portafolio muestra 4 proyectos y 7 variantes de **sólo sus logos** (sin capturas). Regresión completa `python qa_smoke.py` sobre 26 rutas, cinco resoluciones, Canvas, temas, JS disabled, reduced motion y juego: OK. `node qa_tetris.cjs`: OK. Playwright día/noche/móvil/320, cálculo 208→468, agenda, modal, sin errores ni overflow. Servidor local activo: `http://127.0.0.1:8791/`. Pendiente aprobación visual del propietario y eventual consolidación de CSS de home tras su aprobación.


## 26. Segunda pasada editorial de la landing — 8 nov. 2026

A petición del propietario se revisó nuevamente la landing usando https://tobiasahlin.com/ como referencia directa. Principios observados en el referente: encabezados de sección breves y tipográficos, separación explícita Projects / Work / Say hi, bloques de color sólidos con composiciones variadas y contacto resuelto como cierre sencillo, no como otra gran sección promocional.

Cambios implementados localmente:
- Se eliminaron todos los overlines numerados del recorrido (01 / El problema, 02 / El criterio, etc.) y se simplificaron los títulos a «Proyectos.» y «Software propio.». También se quitaron los índices redundantes de las tarjetas de proyecto y de las herramientas; los tipos/estados siguen visibles.
- Se eliminó por completo el capítulo «Hablemos» inmediatamente anterior al footer. No se perdió ninguna vía de contacto: WhatsApp, LinkedIn y agenda Google Calendar están ahora agrupados en el panel de cierre del propio footer.
- Se retiró del footer la firma «JMorgado / Desarrollo independiente», el logotipo textual «JM.» y la frase «Desarrollo, datos y automatización. Soluciones con un propósito concreto.»; no se reemplazaron por otro tagline.
- El footer se reorganizó como un cierre compacto de dos áreas: panel de contacto «Hablemos.» y navegación en dos columnas (Proyectos / Recorrido), más una línea inferior de copyright y retorno al inicio. Ajustes de espaciado para móvil y tema noche.
- Proyectos: se sustituyó el índice horizontal por una composición asimétrica de cuatro paneles de color, manteniendo los logos originales, aportación, resultado, visor interno y enlaces oficiales. No se incorporaron capturas de proyectos.
- Persona: se quitó el banner/monograma redundante; queda el nombre y la historia.
- Tetris: etiqueta simplificada, sin índice de sección. No se cambió el juego.

Archivos: `build_site.py`, `assets/home-editorial-pass.css`, `index.html`, `qa_smoke.py`. Se regeneró la landing con `home()`. QA visual Playwright previo: cinco variantes escritorio/móvil, día/noche, cero overflow; modal de proyecto y agenda abren/cierran correctamente. QA de esta última pasada se está cerrando. Sin commit, push ni despliegue. Servidor local: http://127.0.0.1:8791/.


### Cierre de QA de la segunda iteración — 8 nov. 2026

Regresión final completada correctamente: `python qa_smoke.py` (26 rutas, 24 canónicas, intro, motion, accesibilidad, tema, calculadora, visor y JS deshabilitado) y `node qa_tetris.cjs` (motor, teclado, tacto, persistencia, pausa y fin de partida). Playwright en 1440, 768, 390, 320 y 844 px, día/noche: cero overflow, cero errores de JS; se comprobó apertura/cierre de visor y agenda. Footer final: 372 px escritorio / 436 px móvil, con enlaces compactados y tres vías de contacto funcionales. Introducción y Tetris siguen intactos. `git diff --check` OK. Servidor local HTTP 200 en `http://127.0.0.1:8791/`. Sin commit, push ni despliegue.
