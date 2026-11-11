# Rediseño de la sección Método — JMorgado (iteración 3 · final)

**Alcance:** exclusivamente `/metodo/`. Proyectos, herramientas, servicios, inicio y fichas aprobadas no fueron modificados. Sin commit, sin push, sin despliegue.

El trabajo se realizó en tres iteraciones: (1) primera implementación interactiva, (2) reestructuración de bloques planos e interacciones, (3) pulido final de integración, movimiento y coherencia editorial. Este informe documenta el resultado final completo.

## 1 · Cambios visuales del pulido final

- **Cabeceras de sección** unificadas con el sistema del sitio (`.section-head` centrado, tipografía de títulos a `clamp(1.8rem, 3.3vw, 3rem)`, `max-width: 24ch`), escoped a la página con `.method-hero ~ section …`: ningún otro bloque del sitio se toca.
- **Aparición suave de bloques** al hacer scroll (13 bloques: cabeceras, comparador, flujo, evolución, matriz, rail de seguridad, ejemplos, diagnóstico, cierre) — `opacity + translateY` con `cubic-bezier(.2,.7,.2,1)`; desactivada con `prefers-reduced-motion`.
- **Sombras duras de acento** en los estados activos (coral para B/etapas/filas, petróleo para etapas A): materialidad ligera, nada de degradados.
- **Numerales de marca de agua** en el panel de decisión y en las tarjetas de evolución.
- **Barra de progreso** en el recorrido evolutivo (`.met-stage-progress`, `--fill` animado) que avanza con la etapa activa: 01 ≈ 18 % · 02 ≈ 55 % · 03 = 100 %.
- **Microinteracciones discreta**: orbe pulsante al activar un paso del recorrido, rail de seguridad con nodos que escalan al pasar el puntero, flecha de ficha con avance al hover, CTA del cierre con elevación leve.
- **Atención al atenuado**: el pane inactivo del comparador sube de 0.5 a 0.62 de opacidad con línea tecnológica viva: contraste sin pérdida de lectura.

## 2 · Mejoras de animación

- Ritmo único del sitio: `--met-ease: cubic-bezier(.2,.7,.2,1)` en todos los cambios de estado; duraciones 0.22–0.75 s; nada de bounces ni elasticidad.
- **Comparador**: la alternancia automática ya no se congela fuera de pantalla (timer siempre activo con compuerta de visibilidad); hover/foco detiene la alternancia y enfoca el lado; al salir se reanuda. Se corrigió la carrera entre hover y temporizador.
- **Recorrido de decisión**: los cambios de etapa hacen un *swap* de 150 ms (kicker/título/cuerpo/watermark) con *translateY* leve; el punto activo pulsa una vez; los pasos anteriores quedan delineados en coral (recorrido avanzado).
- **Evolución**: rotación continua corregida (completa el ciclo 01→02→03 en bucle; antes se desalineaba tras una etapa) y barra de progreso sincronizada.
- **Matriz de recursos**: swap del panel con el mismo timing; hover del rótulo → señala la flecha.
- `prefers-reduced-motion`: sin apariciones, sin orbe, sin timer automático, sin transiciones relevantes.

## 3 · Textos corregidos o refinados

- **Voz unificada**: segunda persona (tú) en todo el copy visible; eliminados los saltos a «el cliente»: «infraestructura que ya usas», «conservas tus herramientas», «tu operación de la solución».
- **Títulos y apoyos**:
  - Hero: «Mejores decisiones desde el principio.» (sin cambios, integrado) — entradilla intacta con la idea central íntegra.
  - 01: «Sobredimensionar o construir con criterio.» + apoyo más directo. Estados: «Complejidad antes que valor» / «Proporcional y creciente».
  - 02: apoyo reducido a «Seis pasos, un punto de decisión. El detalle aparece al pasar por cada etapa.»
  - 03: apoyo → «Una base proporcional al problema de hoy, lista para volverse más capaz cuando el uso lo pida.»
  - 04: apoyo → «El panel muestra el recurso que resuelve mejor cada tipo de tarea.» · nota de cierre condensada.
  - 05: retirada la repetición «no al final» del apoyo (el título ya lo dice).
  - 07: encabezado «Fuera del diagnóstico gratuito.» → **«Lo que queda fuera.»** con lead ajustada (misma letra, español más limpio).
- Microcopy contextualmente revisado: métricas del comparador, deltas de etapa, rótulos de criterio en ejemplos, apoyos de los bloques 02 y 06.
- Sin adiciones de contenido: solo condensación y coherencia.

## 4 · Archivos modificados (iteración 3)

- `build_site.py` — línea de progreso del recorrido (`met-stage-progress`) + ajustes de copy (listados en el punto 3).
- `assets/metodo.css` — cabeceras integradas al sistema, aparición suave, tokens de movimiento, orbe, swap del panel, progreso, microinteracciones.
- `assets/metodo.js` — aparición por IntersectionObserver, swap unificado, orbe de reactivación, compuerta de visibilidad y rotación continua corregidas.
- `metodo/index.html` (regenerado, enlazado a hashes nuevos).

Sin otras páginas tocadas: `servicios/`, `index.html`, `herramientas/` verificados sin referencias a `metodo.*`.

## 5 · QA realizado

- **Overflow horizontal:** 0 px en 1440/1024/768/390/320 px, día y noche (10 combinaciones).
- **Animaciones en vivo:** 13 bloques con aparición gradual; swap del panel al pasar el puntero por «Implementación»; progreso evolutivo llega a `--fill: 1`; comparador alterna mientras está a la vista; evolución rota en bucle al entrar en vista.
- **Interacciones:** comparador (hover/foco/pestañas en toque), recorrido de decisión por hover con swap de 150 ms, orbe en el paso activo, 4 caminos con hover y teclado, evolución por click/hover con panel invariante, matriz con 5 caminos (hover/foco/toque), rail de seguridad con microinteracción discreta.
- **Accesibilidad:** outline de 3 px en todos los elementos activos; `aria-current`, `aria-pressed`, `aria-selected`, `aria-expanded` correctos; consola limpia en las 10 combinaciones.
- **Móvil 390/320 px:** aparición desactivada de forma segura, recorrido horizontal con snap, pestañas del comparador, tarjetas de evolución apiladas.
- `qa_smoke.py` (26 rutas) · `qa_tetris.cjs` · `qa_fichas.py` OK · `git diff --check` limpio.

## Nota final

El copy aprobado estructuralmente (diagnóstico gratuito, idea central, seguridad sin certificaciones) se conserva. El resultado es una página coherente de principio a fin: sobria, técnica y viva, parte del mismo sistema que el resto del portafolio.
