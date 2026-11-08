# Plan operativo vigente — mejoras de las escenas del inicio JMorgado

**Actualizado:** 8 de noviembre de 2026
**Estado:** base narrativa, coreografías y transiciones anteriores validadas por Jorge. Fase 1 — Fondo y atmósfera: aprobada. Fase 2 — Reposo activo: aprobada por Jorge el 8 de noviembre de 2026. Fase 3 — Interacción con puntero: aprobada por Jorge el 8 de noviembre de 2026. Fase 4 — Refinamiento de materialidad: cerrada y aprobada por Jorge el 8 de noviembre de 2026. Cierre responsive del inicio: ajuste de la quinta escena en horizontal compacto implementado y validado técnicamente; pendiente revisión visual final de Jorge.
**Alcance:** las siete escenas narrativas del inicio y sus transiciones. No incluye todavía la edición del resto del sitio.

## 1. Punto de partida: conservar lo aprobado

El trabajo anterior se considera **validado y es la base oficial de continuidad**. No se reinicia ni se sustituye para aplicar este plan.

Se conserva:

- La historia visual de siete escenas y su orden editorial.
- Los textos, jerarquías y sentido de cada capítulo.
- Las coreografías, animaciones y transiciones ya ajustadas y aprobadas.
- La transformación y el comportamiento de las plataformas y piezas 2.5D que ya se validaron.
- Los movimientos de giro, crecimiento, conexión y organización de módulos que forman parte del concepto aprobado.
- La continuidad del recorrido con scroll y la posibilidad de recorrerlo en ambos sentidos.

Las fases siguientes son una **capa de refinamiento sobre esa base**, no una nueva propuesta de introducción. Si una mejora amenaza una coreografía aprobada, se adapta o se descarta la mejora; no se sacrifica lo validado para forzar un efecto.

## 2. Dirección visual y referencias

La referencia principal es [Lusion](https://lusion.co/): atmósfera, profundidad, materialidad, movimiento ambiental e interacción integrada. Se toman principios de calidad y comportamiento, **no se copia su diseño ni se reemplaza la identidad de JMorgado**.

También se conservan como referencias de criterio:

- [Grail](https://grail-app.com/): continuidad narrativa y ritmo de una experiencia guiada por scroll.
- [Jason Zhou](https://prompt-motion.com/jasonzhou1993-8595e0): cadencia, revelado tipográfico y sincronización de movimientos.
- [Rauno](https://rauno.me/): precisión y contención de microinteracciones.

La dirección buscada es una experiencia editorial y tecnológica premium, con profundidad 2.5D, geometría con propósito y movimiento fluido. No debe convertirse en una demo abstracta, un videojuego, una plantilla ni una sucesión de efectos.

## 3. Reglas transversales para las cuatro fases

Estas reglas aplican a todas las escenas, no sólo al momento en que cada una queda detenida:

1. **Movimiento durante todo el recorrido.** Los efectos deben acompañar también la entrada, transformación, salida y transición entre escenas. No reservar la calidad visual para el estado final o el reposo.
2. **Continuidad temporal.** Al detener, reanudar o invertir el scroll, los elementos deben continuar desde su estado real; no reiniciarse, saltar ni cambiar bruscamente de velocidad.
3. **Una sola autoridad por transformación.** Separar capas de posición, giro, profundidad, iluminación e interacción. No permitir que scroll, reposo y puntero controlen simultáneamente la misma transformación.
4. **Identidad compartida, expresión propia.** Usar un sistema común de atmósfera, luz, color y comportamiento, con composición y tratamiento específicos para cada escena.
5. **Día y noche coherentes.** Mantener la paleta y los tokens de marca existentes. Resolver los cambios de tema y de escena con transiciones suaves, sin destellos ni saltos de contraste.
6. **Legibilidad primero.** Los fondos, luces, partículas y respuestas al puntero no pueden competir con los titulares ni reducir el contraste.
7. **Movimiento con intención.** Cada efecto debe explicar profundidad, conexión, transformación, jerarquía o respuesta. Evitar adornos genéricos, partículas gratuitas y repeticiones.
8. **No convertir la escena ordenada en Tetris.** Las piezas pueden crecer y transformarse, pero deben conservar su lógica espacial, anclaje y lectura; especialmente donde la composición final representa datos organizados.
9. **Accesibilidad y control.** Respetar la preferencia de movimiento reducido, teclado, dispositivos táctiles y ausencia de hover. El movimiento ambiental nunca debe ser requisito para comprender la historia.
10. **Rendimiento.** Priorizar animación eficiente, capas reutilizables y efectos proporcionados al dispositivo. No añadir dependencias ni complejidad sólo para exhibir tecnología.

## 4. Fase 1 — Fondo y atmósfera

**Objetivo:** que las siete escenas pertenezcan al mismo universo visual, pero que cada una tenga una atmósfera adecuada a lo que está contando.

Trabajo:

- Auditar las siete escenas una por una, incluyendo el tramo de entrada y salida de cada una.
- Definir qué necesita cada fondo: profundidad, escala, dirección, contraste y relación con la composición principal.
- Crear un sistema ambiental compartido y configurable, en vez de siete fondos inconexos o un único fondo repetido.
- Trabajar planos y capas: fondo, geometría secundaria, profundidad, iluminación y elementos narrativos.
- Incorporar gradientes tonales, halos, líneas, tramas o partículas sólo cuando refuercen la lectura y la profundidad.
- Hacer que la atmósfera evolucione con el scroll y se mezcle gradualmente entre escenas; evitar cambios de color bruscos o fondos que aparezcan/desaparezcan de golpe.
- Ajustar el comportamiento para modo día y modo noche usando los tokens existentes.
- Revisar el espacio negativo: que no se perciba vacío accidental, pero tampoco rellenarlo con decoración.
- Afinar la aparición y el ritmo de los textos —máscaras, revelados, subrayados y jerarquía cinética— sin cambiar una sola palabra del canon.

**Criterio de aceptación:** cada escena tiene una atmósfera propia y reconocible, pero al recorrerlas se percibe un mismo sistema. El fondo acompaña la transición completa, no sólo el fotograma de reposo.

## 5. Fase 2 — Reposo activo

**Objetivo:** que la escena siga viva cuando la persona se detiene a leer, sin depender de mover el puntero.

Trabajo:

- Incorporar movimiento ambiental lento y continuo en todas las escenas.
- Aplicar oscilaciones, órbitas, rotaciones locales, respiración de luz, desplazamiento de profundidad y barridos sutiles según el significado de cada composición.
- Mantener las plataformas y piezas ancladas a su espacio: nada debe parecer que se cae, se vence o flota sin intención.
- Conservar el orden y la legibilidad de los módulos mientras se mueven.
- Usar una referencia temporal estable para que el movimiento no se reinicie al detener/reanudar scroll, mover el puntero o volver a una escena.
- Evitar bucles evidentes, movimientos sincronizados en exceso o amplitudes que distraigan.
- Asegurar que la animación continúe de manera sutil durante las transiciones, no sólo cuando la escena está completamente asentada.

**Criterio de aceptación:** al detenerse a leer, la escena mantiene vida perceptible; el movimiento es elegante, estable y secundario al contenido. Al volver a desplazarse, no hay saltos ni reinicios.

## 6. Fase 3 — Interacción con puntero

**Objetivo:** pasar de efectos aislados de hover a una respuesta espacial coherente del sistema completo.

Trabajo:

- Diseñar un lenguaje de interacción común para las siete escenas.
- Usar proximidad, dirección y velocidad del puntero para producir respuestas pequeñas y contextualizadas: variaciones de luz, parallax, profundidad, énfasis de nodos o reacción entre piezas relacionadas.
- Hacer que la respuesta afecte a capas y relaciones, no sólo al objeto que está justo debajo del cursor.
- Mantener la interacción integrada durante el scroll y las transiciones, sin interrumpir la coreografía.
- Suavizar entrada y salida de la influencia del puntero; evitar cambios instantáneos, saltos o perseguir el cursor de forma exagerada.
- No convertir el cursor en un elemento gráfico protagonista ni añadir anillos, marcos o señales que parezcan controles ajenos al diseño.
- En táctil, conservar una experiencia completa sin depender del puntero; cualquier respuesta equivalente debe ser discreta y no exigir gestos innecesarios.

**Criterio de aceptación:** el puntero se siente conectado al universo visual, pero la experiencia funciona igual de bien sin moverlo. La interacción no rompe la lectura ni el estado de las animaciones.

## 7. Fase 4 — Refinamiento de materialidad

**Objetivo:** elevar la calidad de las figuras existentes para que se perciban construidas, conectadas y tridimensionales, sin perder su lenguaje geométrico.

Trabajo:

- Refinar bordes, biseles, contornos, uniones y espesores.
- Mejorar luces, reflejos controlados, sombras de contacto y oclusión entre capas.
- Dar volumen 2.5D consistente a placas, plataformas, piezas y conectores.
- Revisar perspectiva, anclajes y ejes de giro: las plataformas giran sobre su propio centro y los bloques crecen desde su huella, no se inclinan como si fueran a caer.
- Hacer que los conectores pasen por detrás de las plataformas y lleguen a nodos centrales lógicos; evitar trazos que parezcan carreteras o líneas colocadas al azar.
- Refinar el material de cada familia de piezas manteniendo la paleta y sus acentos originales.
- Limpiar solapamientos, brillos excesivos, bordes inconsistentes, sombras flotantes y detalles que no aportan.
- Consolidar componentes y funciones reutilizables cuando compartan comportamiento, sin crear una abstracción global que vuelva difícil ajustar cada escena.

**Criterio de aceptación:** las figuras tienen profundidad y materialidad creíbles, conservan su geometría y se entienden mejor. Ningún acabado compite con la historia ni convierte la composición en una colección de adornos.

## 8. Cierre — Integración y control de calidad

El cierre no es una quinta dirección estética: es la comprobación de que las cuatro fases funcionan juntas sin degradar la base aprobada.

Revisión obligatoria:

- Las siete escenas completas y todas sus transiciones, no sólo capturas de los estados finales.
- Scroll hacia delante, hacia atrás, detenciones prolongadas y reanudación en distintos puntos.
- Modo día y modo noche, incluyendo los cambios entre escenas.
- Escritorio, tablet, móvil y orientación horizontal.
- Puntero lento/rápido, entrada/salida de zonas y experiencia táctil.
- Preferencia de movimiento reducido, navegación por teclado, contraste y lectura de los textos.
- Rendimiento, fluidez, consumo y comportamiento al cambiar de pestaña o volver a la página.
- Ausencia de errores de consola, saltos, reinicios, desbordamientos y cambios bruscos de color.

Pruebas técnicas del proyecto, cuando corresponda:

- node --check assets/journey-study.js
- python publish_site.py
- python qa_smoke.py
- git diff --check

La compilación y las pruebas automáticas no sustituyen la revisión visual real de las siete escenas.

## 9. Orden de ejecución y validación

1. Completar Fase 1 y revisar el resultado antes de avanzar.
2. Con la atmósfera aprobada, completar Fase 2 y validar reposo, continuidad y reanudación.
3. Después completar Fase 3 y validar interacción con puntero y alternativa táctil.
4. Completar Fase 4 y revisar materialidad escena por escena.
5. Ejecutar el cierre de integración y QA.

**No avanzar de fase sin validar la anterior con Jorge.** Si una mejora no alcanza el nivel visual esperado, se corrige dentro de su fase; no se compensa agregando más efectos en otra.

## 10. Límites de alcance y protección

- Trabajar únicamente en las escenas narrativas del inicio hasta que Jorge declare cerrado este trabajo.
- No editar todavía capacidades, herramientas, proyectos, servicios, Tetris, método, calculadora, contacto ni el resto del sitio.
- No cambiar titulares, descripciones, orden narrativo ni significado de las siete escenas.
- No reemplazar, simplificar ni reconstruir las animaciones y transiciones ya aprobadas.
- No copiar literalmente Lusion ni introducir estética genérica de IA, SaaS o videojuego.
- No crear respaldos rutinarios de esta versión: Jorge declaró la versión actual como oficial y señaló que los respaldos anteriores ya no son necesarios. No eliminar respaldos históricos existentes.
- No hacer commit, push ni despliegue. Jorge realizará el push cuando corresponda.


## 11. Bitácora de ejecución

### 8 de noviembre de 2026 — Fase 1, primera iteración

**Estado de la iteración:** aprobada por Jorge el 8 de noviembre de 2026.

Implementación local en `assets/journey-study.js`:

- Se incorporó una capa de atmósfera de fondo que se dibuja antes de las piezas de cada escena.
- Se añadieron luces radiales y direccionales específicas para los ocho estados de composición que utiliza el recorrido, manteniendo las siete escenas editoriales y sus textos.
- Se añadió viñeteado tenue adaptado a día/noche, un horizonte ambiental para integrar el piso de la escena de profundidad y focos suaves para las plataformas.
- La transición atmosférica entre estados utiliza el mismo progreso de disolución que el color de fondo. No hay cortes ni cambios independientes de escena.
- Se conserva intacto el dibujo de las piezas, la retícula del piso, la geometría, las coreografías, el timeline, los titulares y las descripciones. No se modificó el CSS ni el HTML generado.

**Validación ejecutada:**

- Capturas de los ocho estados en modo día y modo noche.
- Revisión de transiciones día entre escenas, incluida la mezcla coral–claro y claro–oscuro.
- Pruebas visuales en 1440×900, 768×1024, 390×844, 320×568 y 844×390.
- Sin errores de consola ni errores de página en la revisión Playwright.
- `node --check assets/journey-study.js`: correcto.
- `git diff --check`: correcto.
- `python qa_smoke.py`: correcto; 26 rutas, 24 canónicas, responsive, accesibilidad, temas, movimiento reducido, juego y navegación.

Las capturas de referencia y revisión quedaron en `_revision/phase1-baseline/`, `_revision/phase1-after/` y `_revision/phase1-refined/`. Son evidencia visual local ignorada por Git, no respaldos del código.

**Cierre:** Jorge revisó y aprobó la atmósfera. La Fase 1 queda cerrada; se autoriza continuar con la Fase 2.

### 8 de noviembre de 2026 — Fase 2, primera iteración

**Estado:** aprobada por Jorge el 8 de noviembre de 2026. La Fase 2 queda cerrada; se autoriza continuar con la Fase 3.

Implementación local en `assets/journey-study.js`:

- Se conserva el Canvas principal y el `idleCanvas` independiente. Se evoluciona el sistema ambiental existente; no se sustituye ni se agregan efectos decorativos ajenos a las escenas.
- El reloj ambiental avanza mientras la introducción está visible y conserva su fase al detener/reanudar/invertir el scroll, mover el puntero o volver a entrar en la sección. Sólo se pausa cuando la sección sale de pantalla, la pestaña queda oculta, la ventana pierde foco o se activa movimiento reducido.
- La intensidad se mantiene baja durante el desplazamiento (objetivo 0.18) y aumenta gradualmente al detenerse (objetivo 0.84), mediante interpolación temporal. No hay reinicio del reloj ni rampas que vuelvan a cero en cada pausa.
- Las señales de luz y recorrido se mezclan con el mismo progreso de disolución de la escena principal, para evitar cortes entre capítulos.
- Las piezas mantienen sus anclajes y geometría. El puntero conserva su lógica independiente y no controla las mismas transformaciones que el movimiento ambiental.
- Se respeta `prefers-reduced-motion`: la introducción permanece estática y no se inicia el ciclo ambiental.
- No se modificaron CSS, HTML, titulares, descripciones, geometría aprobada ni duraciones del timeline.

**Validación ejecutada:**

- `node --check assets/journey-study.js`: correcto.
- Playwright: ocho estados en escritorio 1440×900, modo día y noche; sin errores de página ni de consola.
- Playwright: ocho estados en móvil 390×844 y horizontal 844×390; sin desbordamiento horizontal y sin errores de consola.
- Comparación de píxeles en reposo y durante eventos de scroll: el Canvas principal y la capa ambiental siguen cambiando en ambos estados; el cierre también conserva movimiento sutil en la semilla.
- Movimiento reducido: modo estático confirmado.
- `python qa_smoke.py`: correcto en 1440×900, 768×1024, 390×844, 320×568 y 844×390; 26 rutas, navegación, accesibilidad, temas, movimiento reducido y juego.
- `node qa_tetris.cjs`: correcto.
- `git diff --check` sobre los archivos propios de esta fase: correcto.

Las capturas locales de revisión quedaron en `_revision/phase2/`; son evidencia visual, no respaldos del código.

**Observación visual registrada para el cierre responsive (resuelta el 8 de noviembre de 2026):** en orientación horizontal 844×390, durante la quinta escena la descripción se acercaba demasiado a la parte superior de la esfera/plataformas. El ajuste final quedó aplicado en `assets/journey-study.css`; la validación visual comparativa y el QA de cierre se registran al final de esta bitácora.

### 8 de noviembre de 2026 — Fase 3, primera iteración

**Estado:** aprobada por Jorge el 8 de noviembre de 2026. La Fase 3 queda cerrada; se autoriza continuar con la Fase 4.

**Criterio aplicado:** el puntero deja de ser un cursor con efectos propios y pasa a ser un campo espacial común. Su influencia depende de proximidad, dirección y velocidad, y se manifiesta en las piezas, rutas y superficies de cada escena.

**Implementación:**

- La interacción se mantiene activa durante el scroll; ya no depende de `scrollIdle`. El reposo conserva su propio reloj e intensidad y no comparte transformaciones con el puntero.
- Se eliminó el hover aislado sobre una sola ficha, junto con los anillos y ondas dibujados alrededor del cursor. No hay un marcador que persiga al visitante.
- Las ocho composiciones tienen respuestas contextuales: módulos, nodos y conectores; núcleo y onda; partículas tipográficas; perspectiva y partículas de la esfera; superficies y uniones de plataformas; tramo local de la gráfica; ondas y semilla final.
- La velocidad y dirección generan una estela breve; la proximidad determina qué elementos reaccionan. Las influencias son acotadas y no cambian los anclajes ni la geometría aprobada.
- En táctil, el toque y el arrastre activan el mismo campo durante el contacto; no se requiere hover. El toque se desvanece gradualmente al terminar.
- Se conserva `prefers-reduced-motion`: modo estático, sin interacción animada.
- No se modificaron CSS, HTML, titulares, descripciones, duraciones del timeline ni la composición editorial. La edición de esta fase se limita al JavaScript de la introducción y a esta documentación.

**Validación interactiva preliminar:**

- Playwright en escritorio 1440×900, modo día y noche: las ocho escenas responden y no presentan errores de página ni de consola.
- Playwright en móvil 390×844: las ocho escenas responden; toque táctil verificado en la esfera; sin desbordamiento horizontal.
- Interacción durante scroll hacia delante y hacia atrás: la respuesta permanece activa y el orden de escenas se conserva.
- Comparación de píxeles en las ocho escenas: el cambio por interacción supera el movimiento ambiental normal en las escenas probadas; no aparece un anillo o marcador centrado en el cursor.
- Movimiento reducido: estado estático confirmado.
- Se realizó una optimización del cálculo espacial para evitar distancia y mezcla de color innecesarias por partícula.

**Validación integral completada:**

- `node --check assets/journey-study.js`: correcto.
- `python qa_smoke.py`: correcto en 1440×900, 768×1024, 390×844, 320×568 y 844×390; 26 rutas, 24 canónicas, textos originales, navegación, accesibilidad, temas, movimiento reducido, calculadora y juego.
- `node qa_tetris.cjs`: correcto; motor, giros, reserva, caídas, líneas, T-Spins, combos, B2B, nivel, pausa y fin.
- `git diff --check` sobre los archivos propios de la introducción y coordinación: correcto.
- Playwright: ocho escenas en día/noche, desktop 1440×900 y móvil 390×844; sin errores de página/consola ni desbordamiento horizontal.
- Playwright: puntero durante scroll hacia delante y atrás, toque táctil, estado estático con movimiento reducido; sin errores.
- Capturas de interacción en `_revision/phase3/`, incluidas respuestas de las ocho escenas, día/noche, scroll y toque móvil.

**Cierre:** Jorge revisó y aprobó la interacción. La Fase 3 queda cerrada; se autoriza continuar con la Fase 4. La observación responsive horizontal 844×390 de la Fase 2 continúa registrada para el cierre final del inicio.

### 8 de noviembre de 2026 — Fase 4, primera iteración

**Estado:** Fase 4 cerrada y aprobada por Jorge el 8 de noviembre de 2026, incluida la contención y sincronización de los módulos de la esfera.

**Criterio aplicado:** elevar la materialidad de las figuras existentes mediante iluminación orientada, sombras de contacto, biseles y profundidad 2.5D. No añadir nuevas formas decorativas ni cambiar la geometría aprobada.

**Implementación en `assets/journey-study.js`:**

- `drawBeveledBlock`: valores tonales independientes en las caras inferior y lateral, gradiente en la cara principal, bisel con canto superior/izquierdo iluminado y borde opuesto más oscuro. La extrusión conserva su escala corta.
- `drawModule`: refinamiento de contorno y reflejo en módulos rectangulares, circulares y en L; se conserva la silueta de cada familia.
- Escena de conexiones: sombra corta en los raíles, sockets con cara interior y bisel orientado.
- Esfera: variación tonal precomputada por material según profundidad; no se añadieron halos ni partículas.
- Contención de módulos en la esfera: `sphereModulePoint` comparte ahora la misma proyección de `draw4` (centro, radio, perspectiva, giro, inclinación y respuesta al puntero); se aplica un margen radial proporcional al tamaño para que las piezas no sobresalgan del campo visible.
- Sincronización: el traslado de módulos termina junto con la formación de la esfera (`u=.79`), en lugar de continuar hasta `u=.985`; se elimina la órbita posicional individual que los separaba del movimiento común.
- Plataformas: bastidor inferior con tonalidad propia, caras laterales con sombra diferenciada y cantos tratados según orientación, en lugar de un borde blanco uniforme.
- Conectores: contacto oscuro discreto, cuerpo cromático y reflejo central; puertos cuadrados con cara, bisel y sombra.
- Fichas de plataforma: sombras de contacto contenidas, fachadas con valores tonales distintos y cubierta con reflectancia diferenciada.
- Rendimiento: se omite el dibujo de módulos totalmente transparentes y se reducen gradientes/sombras redundantes por pieza para contener el coste de Canvas.

**Límites respetados:**

- No se modificaron CSS, HTML, titulares, descripciones, orden editorial, geometría base, anclajes ni duraciones del timeline.
- No se alteraron las duraciones globales del timeline ni la lógica de reposo/interacción. Se sincronizó únicamente el asentamiento local de los módulos con la formación de la esfera, a petición de Jorge.
- No se tocaron otras secciones del sitio ni archivos del agente paralelo.
- Sin commit, push ni despliegue.

**Validación ejecutada:**

- `node --check assets/journey-study.js`: correcto.
- `python qa_smoke.py`: correcto en 1440×900, 768×1024, 390×844, 320×568 y 844×390; 26 rutas, 24 canónicas, contenido, navegación, accesibilidad, temas, movimiento reducido, calculadora y juego.
- `node qa_tetris.cjs`: correcto; motor y controles.
- `git diff --check` en los archivos de la introducción y coordinación: correcto.
- Playwright: 22 comprobaciones de escena en día/noche, escritorio, móvil y horizontal; orden de escena correcto, sin errores de consola/página ni desbordamiento horizontal.
- Capturas de revisión en `_revision/phase4/`: ocho estados en día/noche, más móvil y horizontal.
- Ajuste puntual posterior solicitado por Jorge: escena de la esfera en 1213×850 (día/noche), 390×844 y 844×390; la escena se conserva en índice 4, sin errores de página/consola ni desbordamiento horizontal. Capturas `sphere-fix-night.png`, `sphere-fix-mobile.png`, `sphere-fix-landscape.png` y variantes de progreso `sphere-fix-u-*`.

**Cierre de Fase 4:** Jorge aprobó la materialidad y la corrección de contención/sincronización de la esfera el 8 de noviembre de 2026. La fase queda cerrada.

**Cierre responsive del inicio — pendiente de revisión visual final:** se ajustó únicamente `assets/journey-study.css` para pantallas horizontales compactas (`orientation: landscape`, ancho máximo 900 px y alto máximo 620 px). En la quinta escena, el titular y la descripción suben y reducen ligeramente su escala/espaciado para dejar aire antes de la esfera. No cambia el layout de escritorio ni de móvil vertical, el Canvas, la geometría ni el timeline. Capturas comparativas en `_revision/phase4/responsive-before-*`, `responsive-after-*` y `responsive-final-*`.

**Validación del cierre responsive:**

- Playwright 844×390 en día y noche, recorriendo la quinta escena en progreso `.2`, `.4`, `.6`, `.8` y `.95`: la descripción sólo aparece cuando corresponde y, cuando es visible, termina antes de la esfera; sin errores de página/consola ni desbordamiento horizontal.
- Escena 4 en 1440×900, 390×844 y 320×568: sin errores ni desbordamiento; la regla nueva sólo aplica a landscape compacto.
- `node --check assets/journey-study.js`, `python qa_smoke.py` (26 rutas, 24 canónicas), `node qa_tetris.cjs` y `git diff --check`: correctos.


### 8 de noviembre de 2026 — Bloque complementario: apertura y diferenciación atmosférica

**Motivo:** Jorge aprobó la composición actual de la portada y pidió mejorar lo que ocurre al cargar el sitio, dar más vida al reposo de los tres grupos y hacer más reconocibles los fondos entre capítulos. Este bloque complementa las cuatro fases ya cerradas; no las reabre ni sustituye sus aprobaciones.

**Implementación en `assets/journey-study.js`:**

- La carga inicial revela los tres grupos en secuencia izquierda → centro → derecha, con un asentamiento corto y escala/rotación de entrada contenidas. El reordenamiento por scroll sigue siendo el mismo.
- El basamento inferior se dibuja progresivamente, revela sus tres anclajes en secuencia y muestra una señal coral viajera que desaparece al terminar la entrada.
- El reposo de la portada ya no utiliza las antiguas referencias de columnas: los trazos de luz recorren puntos de los tres grupos reales y el basamento. Cada grupo tiene un desfase propio.
- Los módulos de la portada respiran con desplazamientos inferiores a unos pocos píxeles y variaciones pequeñas de escala/inclinación; no flotan ni pierden sus anclajes.
- Se diferenciaron las superficies base día/noche: papel cálido (0), salvia fría (1), coral (2), mineral (3), petróleo (4), piedra fría (5), arena cálida (6) y cierre petróleo (7).
- Las luces ambientales de escenas 0, 1, 3, 5 y 6 ahora se desplazan lentamente; cada tratamiento sigue subordinado a la composición y al contraste del texto.

**Límites respetados:**

- No se cambiaron títulos, descripciones, orden narrativo, número de módulos, geometrías, anclajes ni transiciones aprobadas por scroll.
- No se modificaron HTML, CSS, secciones posteriores ni archivos del agente paralelo.
- `prefers-reduced-motion` conserva la portada estática y accesible.
- Sin commit, push ni despliegue.

**Capturas de comparación:** `_revision/portada-ambient-20261108/` y `_revision/portada-ambient-after-20261108/` (entrada por tiempos y ocho escenas en día/noche).

**Validación integral completada:** `node --check assets/journey-study.js`, `python qa_smoke.py` (26 rutas, cinco tamaños y movimiento reducido), `node qa_tetris.cjs` y `git diff --check`: correctos. Playwright recorrió 80 estados (ocho escenas × cinco tamaños × día/noche) sin errores de página/consola ni overflow. Otra pasada capturó las ocho superficies en ambos temas y confirmó su diferenciación cromática; el movimiento de portada cambia entre fotogramas y `prefers-reduced-motion` conserva el estado estático.

**Revisión visual de Jorge:** esta iteración no fue aprobada. El modo día aún se percibía plano y la portada parecía limitarse a una animación de entrada; los módulos quedaban sin una acción o relación comprensible. El QA técnico previo no equivale a aprobación visual. La observación queda registrada y se aborda en la segunda iteración siguiente.


### 8 de noviembre de 2026 — Segunda iteración: portada con actividad narrativa y superficies diurnas

**Objetivo:** corregir la observación de Jorge: la portada debe explicar visualmente qué representan las piezas y seguir viva después de la entrada; el modo día debe tener profundidad y materialidad perceptibles, no limitarse a fondos lisos con un cambio de tono.

**Portada — tres estados que se relacionan:**

- Se conserva el texto y el recorrido aprobado, pero los tres grupos ahora tienen una lectura explícita: **TAREA → IDEA → FORMA**.
- Se reemplazó el eje horizontal tipo gráfico por un recorrido curvo con tres anclajes. Un pulso coral viaja entre los nodos y cada grupo responde cuando la señal lo alcanza.
- La animación autónoma dejó de ser un desplazamiento subpíxel común: TAREA se comprime y recupera volumen; IDEA gira y prueba distintas distancias alrededor de su núcleo; FORMA recibe una onda que recorre las filas y acompaña el encaje.
- La entrada parte de un núcleo común y despliega las piezas hacia los tres grupos, con desfase, rotación y asentamiento. La animación de reposo continúa después; no depende de la secuencia de carga.
- Los grupos aumentaron ligeramente de tamaño y se acercaron a su relación con el recorrido inferior. Las etiquetas mantienen jerarquía secundaria respecto del titular.

**Superficies — modo día:**

- Se ajustaron las bases cromáticas de papel, salvia, mineral, piedra y arena para separar mejor los capítulos sin cambiar la paleta de marca.
- Se añadió una luz direccional más presente, focos radiales por material, caída tonal hacia los bordes, grano determinista en composición *soft-light* y sombras amplias bajo los grupos de la portada.
- Se mantiene el tratamiento nocturno aprobado; el grano se reduce en noche para no ensuciar los fondos.
- La variación tonal se comprobó por muestreo de píxeles en las ocho escenas diurnas. En las superficies claras, la diferencia entre zonas de luz y sombra es visible y no depende sólo del color base.

**Límites respetados:**

- No se cambiaron titulares, descripciones, orden narrativo, número de módulos, geometría de las escenas siguientes, anclajes del recorrido ni transiciones aprobadas.
- No se modificó HTML, contenido editorial, escenas posteriores ni archivos del agente paralelo. Los cambios se limitaron a `assets/journey-study.js`, una media query de `assets/journey-study.css` para landscape compacto y documentación.
- `prefers-reduced-motion` conserva el modo estático; el movimiento continuo sólo se ejecuta cuando la introducción está visible y el usuario no solicita movimiento reducido.
- Sin commit, push ni despliegue.

**Capturas:** `_revision/portada-narrativa-20261108/` (entrada, reposo, ocho escenas en día/noche, escritorio, móvil y horizontal).

**Corrección responsive adicional:** en landscape compacto (844×390), la primera captura mostró que la descripción se acercaba demasiado a los grupos. Se ajustó únicamente la posición y escala del titular/descripción y se bajaron los grupos en esa proporción. En día y noche, la descripción termina en y=149 y las etiquetas comienzan en y=176; sin superposición ni overflow.

**Validación integral:** `node --check assets/journey-study.js`, `python qa_smoke.py` (26 rutas, cinco tamaños, movimiento reducido), `node qa_tetris.cjs` y `git diff --check`: correctos. Playwright recorrió 80 estados (ocho escenas × cinco tamaños × día/noche) sin errores de página/consola ni overflow. En la portada, el muestreo de 850 ms detecta cambios de píxeles en los tres grupos (14.08 %, 13.24 % y 8.96 %); movimiento reducido permanece estático. Se capturaron las ocho superficies en día/noche y se verificó su contraste tonal.

**Estado:** implementación y QA técnico completados; pendiente revisión visual de Jorge.


### 8 de noviembre de 2026 — Tercera iteración: campo orbital compartido en la portada

**Dirección aprobada para explorar por Jorge:** campo sistémico como base, con órbitas controladas y transferencias sutiles. La portada deja de depender visualmente del pulso del basamento inferior: los tres conjuntos son ahora los protagonistas del movimiento.

**Implementación en `assets/journey-study.js`:**

- Se añadió un campo común con dos trayectorias curvas entre los grupos y tres arcos orbitales parciales, inclinados de forma distinta. No son anillos completos ni una ilustración atómica literal.
- Los propios módulos se mueven en reposo, alrededor de sus centros: **TAREA** comprime y recupera una masa compacta; **IDEA** describe la órbita más abierta y cada pieza conserva una fase propia alrededor del núcleo; **FORMA** combina giro contenido con una onda que alinea sus filas.
- Dos paquetes pequeños recorren las conexiones entre estados y el núcleo central de IDEA responde suavemente. La señal del basamento inferior se redujo para que funcione como referencia secundaria.
- El movimiento se atenúa al comenzar el scroll, no modifica el destino de las piezas ni adelanta la coreografía aprobada. Mantiene su reloj continuo, sin reinicios.
- En `prefers-reduced-motion` quedan las trayectorias como composición estática y se desactiva el movimiento de paquetes y módulos.

**Límites:** sin cambios de textos, HTML, CSS, orden, cantidad de módulos, geometría ni transiciones de escenas posteriores. Sólo se editó `assets/journey-study.js` y esta documentación. No commit, push ni despliegue.

**Capturas:** `_revision/portada-orbital-20261108/` (día/noche, escritorio, móvil y landscape; dos instantes de reposo).

**Validación:** sintaxis JS correcta; `python qa_smoke.py` correcto (26 rutas, cinco tamaños, scroll, tema, accesibilidad y movimiento reducido); `node qa_tetris.cjs` correcto; `git diff --check` limpio. Playwright comprobó la actividad de las tres zonas en escritorio día/noche, móvil día/noche y landscape día: sin errores de página/consola ni overflow. Los tres grupos registraron variación visible entre fotogramas.

**Estado:** tercera iteración implementada y validada técnicamente; pendiente aprobación visual de Jorge.


### 8 de noviembre de 2026 — Refinamiento de integración y responsive de la portada

**Segunda revisión visual de la iteración orbital**, comparando capturas reales de escritorio día/noche, móvil vertical día/noche, móvil horizontal y 320×568.

Hallazgos corregidos:
- En móvil vertical había demasiado aire entre el texto y el sistema de módulos. Se elevó el conjunto de forma coordinada (centros, rótulos y circuito inferior), conservando margen de lectura.
- En modo día las órbitas perdían contraste frente al modo noche. Se reforzó la tinta de campo y la lectura de los arcos, sin añadir halos grandes ni degradados nuevos.
- Las órbitas quedaban casi estáticas respecto del pequeño desplazamiento de las piezas. Ahora centros, trayectorias y satélites comparten el mismo desplazamiento; la inclinación de cada arco acompaña el giro de su grupo.
- Se centralizaron las coordenadas de TAREA, IDEA y FORMA en helpers comunes para evitar que módulos, órbitas y luces ambientales usen centros distintos.
- Se mantuvo la personalidad de cada grupo, el orden de lectura, el contenido textual y la coreografía ligada al scroll.

**Validación:** `node --check assets/journey-study.js`; Playwright en seis tamaños/temas (1220×859 día/noche, 390×844 día/noche, 844×390 día y 320×568 día), sin errores de página/consola ni overflow horizontal. Prueba adicional de cambio de tema, interacción con puntero, scroll hacia escena 2 y `prefers-reduced-motion`: correcta. `git diff --check` correcto (sólo advertencia habitual de conversión LF/CRLF en documentación).

**Respaldo:** `_revision/portada-orbital-20261108/journey-study.before-refinement.js`. Capturas actualizadas: archivos `refined-*.png` en la misma carpeta.

**Alcance:** cambios de implementación sólo en `assets/journey-study.js`; sin cambios de copy, CSS, escenas posteriores, estructura HTML, commit, push ni despliegue. Estado: refinamiento aplicado y validado técnicamente; pendiente aprobación visual final de Jorge.


### 8 de noviembre de 2026 — Microanimación narrativa de entrada

Se sustituyó la revelación casi simultánea de módulos y campo por una entrada de una sola ejecución, de aproximadamente 2,68 s, coordinada mediante `introReveal`:

1. **Aparición:** las piezas nacen desde un núcleo común y comienzan a separarse.
2. **Formación:** TAREA, IDEA y FORMA se revelan con desfases y asentamientos propios, parcialmente solapados.
3. **Conexión:** el circuito inferior y las trayectorias principales se dibujan por tramos (TAREA → IDEA → FORMA); las órbitas se completan en secuencia y el núcleo de IDEA se activa al final.

La entrada no se repite: al terminar toma el relevo el reposo activo ya aprobado. Si el usuario inicia el scroll antes de terminar, se completa la presentación para no dejar piezas o textos a medias. Cambiar el tema no reinicia la secuencia. `prefers-reduced-motion` conserva el estado completo y estático.

**Alcance:** sólo `assets/journey-study.js`. Sin cambios de HTML, CSS, copy, geometría final, escenas posteriores ni transiciones de scroll aprobadas. Sin respaldo rutinario nuevo, conforme a la regla vigente.

**QA:** `node --check`, `python qa_smoke.py` (26 rutas, responsive, accesibilidad, tema, movimiento reducido y juego), `node qa_tetris.cjs`, `git diff --check`; Playwright adicional en escritorio día/noche, móvil vertical día/noche, landscape y 320×568, sin errores de consola ni overflow. Verificados cambio de tema sin reinicio, scroll temprano, y reduced-motion.

Capturas finales: `entry-final-desktop-day.png`, `entry-final-desktop-night.png`, `entry-final-mobile-portrait-day.png` en `_revision/portada-orbital-20261108/`; capturas temporales de las fases de entrada `entry-180ms.png` a `entry-2760ms.png`.

**Estado:** microanimación implementada y QA técnico aprobado; pendiente revisión visual final de Jorge. Sin commit, push ni despliegue.


### 8 de noviembre de 2026 — Portada: corrección del efecto «PPT» y balance del modo día

Jorge detectó que la nueva microanimación todavía se leía como presentación por etapas y que el modo día perdía el detalle visible en modo noche. Se refinó **solo** `assets/journey-study.js`, sin cambiar texto, HTML, CSS, secciones posteriores ni destinos de la coreografía ligada al scroll.

- **Entrada con acción común:** los tres conjuntos ya no entran como tres diapositivas separadas. Sus apariciones se solapan y las piezas se desplazan por trayectorias cúbicas individuales desde un núcleo, con profundidad, rotación y escala moduladas por el recorrido. Se conservan sus posiciones finales aprobadas.
- **Conexión nacida de la formación:** órbitas y líneas comienzan a formarse mientras llegan las piezas, en vez de esperar a que los grupos estén estáticos. Se eliminaron los prefijos numéricos de las etiquetas; se mantienen TAREA, IDEA y FORMA.
- **Sistema que reacciona:** una señal recorre las conexiones en dos tramos; al llegar, el conjunto correspondiente responde mediante una pequeña expansión, elevación y cambio de orientación. Los satélites de las órbitas tienen recorridos suficientemente visibles en reposo, sin aceleración estridente.
- **Modo día material y legible:** fondo papel mineral gris verdoso claro en lugar de beige lavado, luz ambiental más fría, trazos de color petróleo con contraste real, sombras de contacto más contenidas que se forman bajo las piezas conforme llegan. Modo noche conserva su atmósfera aprobada.
- **Continuidad:** sin autoplay de scroll, sin repetición de la entrada, cambio día/noche sin reinicio, scroll anticipado completa la entrada, y `prefers-reduced-motion` conserva todos los elementos legibles.

Comparación de fotogramas en `_revision/portada-orbital-20261108/production-*.png` (escritorio, móvil y landscape; día/noche; diferentes momentos de entrada). Pendiente la aprobación visual de Jorge. Sin commit, push ni despliegue.

**Cierre técnico de la iteración:** también se oscurecieron selectivamente las piezas color piedra sólo en la escena inicial de día para evitar que se fundan con el papel claro. `node --check`, `python qa_smoke.py` (26 rutas), `node qa_tetris.cjs` y `git diff --check` correctos. Validación Playwright final: 1220×859 día/noche, 390×844 día/noche, 844×390 y 320×568, todos sin errores ni desbordamiento; scroll temprano y `prefers-reduced-motion` correctos. Capturas finales: `production-final-desktop-day.png` y `production-final-mobile-day.png` en `_revision/portada-orbital-20261108/`. Implementado, pendiente valoración visual de Jorge.


### 8 de noviembre de 2026 — Refinamiento transversal del recorrido, escenas 1–7

**Disparador:** Jorge aprobó la mejoría visible de la portada y pidió revisar el resto de escenas con el mismo criterio: causa y respuesta entre objetos, movimiento orgánico y materialidad legible en ambos temas. Se compararon las escenas 1–7 antes y después, en modo día y noche, sin cambiar la narrativa ni los textos.

**Cambios quirúrgicos en `assets/journey-study.js`:**
- **Escena 1 — comprender / conexiones:** la señal ahora recorre los dos tramos como un solo trayecto (en lugar de dos pulsos independientes). Puertos y módulos reaccionan al mismo reloj mediante activación local; los desplazamientos son pequeños y no se altera la curva ni los destinos de scroll.
- **Escena 2 — activar / expansión:** la respuesta elástica se propaga radialmente entre las piezas existentes, sin agregar ondas o partículas decorativas. El núcleo, los radios y el recorrido de expansión aprobados no cambian.
- **Escena 3 — CRECER:** sustitución del temblor mayormente individual por una onda longitudinal coherente que viaja por las letras; se mantiene exactamente la silueta de partículas, el texto HTML y la interacción con puntero.
- **Escena 4 — esfera:** se conserva la rotación tridimensional y su piso en perspectiva, porque ya responden al nivel definido por la portada.
- **Escena 5 — plataformas:** respuesta breve y secuencial en la altura de las fichas cuando la señal pasa por su plataforma; cara superior más definida en modo día, sin cambiar tamaños, anclajes ni la trayectoria desde la esfera.
- **Escena 6 — organización y gráfico:** base de día menos amarilla y más mineral; tonos piedra más legibles; un reflejo recorre la misma curva y activa las barras con mínimas variaciones de escala, sin alterar sus anclajes, ejes ni alturas finales.
- **Escena 7 — cierre:** conserva la semilla, el trayecto y las ondas originales; prolonga discretamente la vida de las cintas y hace recorrer su trazado a unas señales pequeñas, sin añadir objetos ni competir con la frase.

**CSS (única regla añadida):** `assets/journey-study.css` corrige el titular HTML de CRECER en modo noche, cuyo color petróleo se perdía sobre el fondo mineral nocturno. Los tiempos de aparición de la descripción y la jerarquía tipográfica se mantienen sin cambios.

**Límites:** el canon textual, las duraciones y scroll sincronizado, las escenas aprobadas, distribución final, accesibilidad de reduced motion y los archivos del agente paralelo permanecen intactos. Sólo se modificaron `assets/journey-study.js`, una regla en `assets/journey-study.css` y esta documentación. Sin commit, push ni despliegue.

**Revisión visual:** capturas de escenas 1–7, día/noche antes y después, montajes `overview-day-before.jpg`, `overview-day-after.jpg`, `overview-night-before.jpg`, `overview-night-after.jpg` en `_revision/escenas-refinamiento-20261108/`. Capturas móviles de escenas 1, 3, 5 y 6 en ambos temas; prueba temporal de movimiento `motion-scene-*-a/b.png`.

**QA realizado:** `node --check`; `python qa_smoke.py` (26 rutas, cinco formatos, temas, scroll, accesibilidad, movimiento reducido, puntero y recursos); `node qa_tetris.cjs` (motor, pausas y controles); `git diff --check`: todos correctos. Playwright confirmó 14 estados de escritorio (siete escenas por dos temas) y 42 estados adicionales (móvil, tablet y landscape, día/noche), sin errores JS, overflow ni escenas incorrectas. **Estado: implementado y probado; pendiente aprobación visual de Jorge.**


### 8 de noviembre de 2026 — Refinamiento de plataformas y transformación a gráfico

**Origen:** Jorge pidió continuar las mejoras tras validar la primera pasada de las siete escenas. Prioridad: escenas 5 (plataformas) y 6 (conversión en barras), especialmente la lectura de materialidad en modo día y la continuidad entre ambas.

**Cambios implementados exclusivamente en `assets/journey-study.js`:**
- En la escena 5 la materialidad diurna de las plataformas se mezcla con el **fondo frío real de la propia escena** (`p.bg[5]`) en lugar del papel mineral de portada (`p.bg[0]`). Bastidores, caras laterales y cara superior tienen mezclas cromáticas más consistentes; noche conserva sus valores anteriores.
- Se creó `scene5FlowPhase(group,progress)` como reloj común del recorrido de señal: cable, barrido sobre el plano, punto luminoso del canto y elevación de las fichas usan la misma fase. Dejan de parecer animaciones independientes.
- En la escena 6 se sustituyó la retirada uniforme y tardía de las cuatro plataformas por `withdraw(group)`, un desvanecimiento por grupos sincronizado con el avance de sus fichas hacia la gráfica. Puertos y conectores siguen exactamente la retirada de su grupo, evitando superficies fantasma detrás de barras ya formadas.
- Las geometrías finales, la disposición de las piezas, el trazado del gráfico, las coordenadas de conectores, los textos y las duraciones del scroll **no se modifican**.

**Evidencia visual:** `_revision/plataformas-grafico-20261108/`, con contactos `contact-sheet-desktop-day.jpg` y `contact-sheet-desktop-night.jpg`, cinco instantes de escena 5–6, vistas de escritorio y móvil. En la comparación, la escena 6 a mitad de recorrido mantiene el gráfico legible sin los cuatro planos semitransparentes compitiendo por detrás.

**QA:** sintaxis JavaScript y `git diff --check` correctos. Se verificaron 15 fotogramas día/noche/móvil sin errores ni overflow. Una comprobación posterior del scroll **bidireccional** se realizó en 36 posiciones de seis combinaciones (1220×859 día/noche, 390×844 día/noche, 844×390 y 320×568), con interpolación de scroll sincronizada para evitar falsos positivos en los límites; todos correctos. `prefers-reduced-motion` correcto. `python qa_smoke.py` (26 rutas, responsive, tema, accesibilidad, juego y recursos) y `node qa_tetris.cjs`: correctos.

**Estado:** implementado y validado técnicamente; pendiente valoración visual de Jorge. Sin commit, push ni despliegue. No se alteró el trabajo del agente paralelo.
