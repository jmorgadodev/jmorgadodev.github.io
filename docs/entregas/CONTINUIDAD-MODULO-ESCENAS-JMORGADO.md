# Continuidad — Módulo de escenas JMorgado

**Fecha:** 11 de noviembre de 2026
**Estado:** implementación completa y verificada en navegador. Pendiente la revisión visual de Jorge.
**Alcance:** sólo el Módulo de escenas (la introducción) y su traspaso inmediato a la landing.

---

## 1. Git

| Elemento | Valor |
| --- | --- |
| Rama de respaldo | `backup/jmorgado-antes-ajustes-modulo-escenas` |
| Commit de respaldo | `d5f0dac` — `chore: checkpoint previo a refinamiento del modulo de escenas` |
| Rama de trabajo | `work/modulo-escenas-jmorgado` |
| Base de la versión aprobada | los cambios sin commitear de `experiment/intro-pioneer-c` (módulo Pioneer C de cuatro escenas), protegidos en `d5f0dac` |

El respaldo queda intacto. `main` no se tocó. No hay push ni despliegue.
`assets/site-particles.js` y `videos/` siguen **sin seguimiento**: pertenecen a otro frente de trabajo y no se incorporaron.

Para recuperar la versión anterior: `git checkout backup/jmorgado-antes-ajustes-modulo-escenas`.
Para volver a la versión aprobada: `git checkout work/modulo-escenas-jmorgado` (los cambios de implementación están en el árbol de trabajo, sin commit, a la espera de aprobación visual).

---

## 2. Los cuatro textos definitivos

Viven en `journey_study.py` (`TITLES` y `DESCRIPTIONS`) y se generan en `index.html`.

| # | Escena | Título | Texto secundario |
| --- | --- | --- | --- |
| 01 | Idea | `Todo comienza` / `con una idea.` | `O con algo que podría funcionar mejor.` |
| 02 | Forma | `Le damos` / `forma.` | `Transformando lo que imaginas en algo que funciona.` |
| 03 | Crecimiento | `Lo que funciona` / `puede crecer.` | `Evolucionar, abrir nuevas posibilidades y llegar más lejos.` |
| 04 | Comienzo | `Y esto es solo el comienzo.` (una sola línea) | — (sin secundario) |

El cierre ya **no** muestra «JMorgado — Desarrollo web, datos y automatización» ni el wordmark.

---

## 3. Distribución y comportamiento de cada escena

Cada escena ocupa un acto de dos tramos del recorrido (`play.t` 0→8).

- **01 · Idea** — texto a la izquierda (`left:7%`, `top:19%`), materia a la derecha. Titular grande, «con una idea.» en coral. El polvo de la escena se atrae hacia ese texto (`pioneerMedirTexto`), así que la letra y la materia se comparten.
- **02 · Forma** — texto a la derecha (`right:7%`, `top:13%`, alineado a la derecha), retícula y red de uniones a la izquierda. «forma.» va sobre un bloque invertido que participa del contraste tipográfico.
- **03 · Crecimiento** — titular centrado arriba (`top:8%`), **descripción justo debajo del titular** (ya no aislada al pie) y la palabra **CRECER** escrita en el lienzo por la propia materia, en el centro. La palabra se forma entre `play.t` 4.0 y 5.2, justo cuando el titular ya está asentado.
- **04 · Comienzo** — una sola línea centrada (`top:30%`), tipografía protagonista. Detrás, las piezas se desprenden, se separan, giran y caen; el texto permanece hasta el final del recorrido.

Los textos nunca se leaves a pantalla vacía: cada escena entra en.crossfade con la siguiente (0,30 s de solape) y el barrido completo del recorrido confirma que en ningún punto baja de 0,55 la opacidad del texto visible.

---

## 4. Movimiento autónomo

El motor tiene un **reloj del mundo** (`idleClock` / `idleMotion.time`) que es la única fuente del movimiento propio:

- Avanza siempre que la introducción esté a la vista, con `prefers-reduced-motion` desactivado.
- **No depende del puntero**: el puntero sólo modula trayectoria, velocidad y respuesta; si sale de la página o la ventana pierde el foco, la escena sigue respirando.
- `ambientTick()` es el único punto de control: si la sección sale de pantalla o la pestaña se oculta, el reloj se pausa y conserva su fase (no se reinicia).
- La capa narrativa se repinta a su propio ritmo (`narrativeInterval()`: 33 ms en escritorio, 42 ms en pantallas estrechas) mientras el mundo late.
- Cada pieza respira por su cuenta: una oscilación pequeña de tamaño y un desplazamiento mínimo, con fase propia (`pioneerFase`).

Medición puntual del intervalo entre fotogramas con el movimiento autónomo activo (Chrome, 1440×900 y 390×844): **mediana 4,2 ms, p95 8,2 ms**.

Optimización aplicada para sostener esa cadencia: el polvo (780 partículas) se dibuja agrupado por tono y por nivel de opacidad (18 `fill()` en vez de 780).

---

## 5. Sincronización con el scroll

- `ScrollTrigger` id `jmorgado-journey`, `scrub: .42`, anclado a `.tech-study`.
- Un único `master` timeline mueve `play.t` de 0 a 8; todo el estado de la escena es una **función pura de la posición del scroll**, de modo que el recorrido es reversible sin saltos ni reinicios.
- La altura de la introducción bajó de `1140svh` a **`900svh`**: 800 svh de recorrido útil (200 svh por acto) más 100 svh de traspaso a la landing.
- El fondo se mezcla con el mismo progreso de disolución que el resto de la escena; no hay cambios de color bruscos entre actos.
- La cuatro ventanas de texto son `[[0,2.08],[1.92,4.08],[3.94,6.08],[5.92,8]]` en unidades de `play.t`; cada una se apaga cuando entra la siguiente.

---

## 6. Cabecera y botón JM.

- Durante las cuatro escenas **no** hay cabecera de la landing. Tampoco el monograma «JM» ni «Desplázate para continuar» en la introducción (se eliminaron del markup). En la esquina superior derecha queda sólo el control de tema y el enlace «Ir al sitio ↗».
- La cabecera aparece cuando el contenido del sitio entra en pantalla (`#explorar`) y se retira al volver a las escenas (`navStatus()` ya no fuerza su presencia en el último acto).
- La cabecera lleva la marca `JM.` a la izquierda, los enlaces de navegación existentes y el **control de día/noche como icono** en el extremo derecho (luna en modo día, sol en modo noche: el icono anuncia el modo al que se llega).
- Al pulsar `JM.` (o «Volver al inicio ↑» del pie) el sitio **desplaza suavemente hasta elscroll 0**, sin recargar el documento ni reconstruir la escena. El motor sigue atado a la posición real del scroll, así que al volver a bajar se recorre la introducción de nuevo y al subir se rehace en sentido inverso.

---

## 7. Archivos modificados

| Archivo | Qué cambió |
| --- | --- |
| `journey_study.py` | Canon de las cuatro escenas, marcado sin monograma ni invitación, cierre de una sola línea. |
| `assets/journey-study.js` | Reloj del mundo y repintado autónomo, cruce de las cuatro escenas, formación de CRECER, caída del cuarto acto, contraste diurno, agrupado del polvo, limpieza del código muerto, cabecera/JM. |
| `assets/journey-study.css` | Distribución de las cuatro escenas, cabecera con `JM.` e icono de tema, altura 900 svh, adaptación móvil. |
| `assets/site.js` | Iconos de día/noche para el botón `data-theme-icon` (sólo portada). |
| `build_site.py` | Marca `JM.`, clase `wordmark-text`, atributo `data-theme-icon` en la portada. |
| `index.html` y páginas interiores | Regenerado con `python build_site.py` (cambia sólo el `?v=` de los recursos y la marca del logotipo). |
| `qa_smoke.py` | El contrato editorial pasa a las cuatro escenas; se añade la comprobación de movimiento autónomo. |
| `.gitignore` | Sólo se versiona este documento de `docs/entregas/`; el resto de la carpeta (zip, capturas, MP4) sigue siendo material local. |

---

## 8. Comprobaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| `node --check assets/journey-study.js` / `assets/site.js` | correcto |
| `python build_site.py` | correcto (26 rutas) |
| `python qa_smoke.py` | correcto en 1440×900, 768×1024, 390×844, 320×568 y 844×390; 26 rutas, 24 canónicas, accesibilidad, temas, movimiento reducido, calculadora y juego |
| `git diff --check` | correcto (sólo el aviso habitual de conversión LF/CRLF) |
| Barrido del recorrido (101 posiciones) | 0 fracciones sin texto legible |
| Movimiento autónomo | el lienzo cambia con el puntero quieto y con el puntero fuera de la página |
| Consola | sin errores de página ni de consola en escritorio (1440×900) y móvil (390×844) |
| CRECER | reconocible en modo día y en modo noche, también en móvil |
| Cabecera | oculta durante las escenas, visible con el sitio, `inert` al volver con `JM.` |
| Movimiento reducido | lienzo estático y las cuatro copias visibles |
| Intervalo entre fotogramas | mediana 4,2 ms · p95 8,2 ms |
| Grabación de revisión | `docs/entregas/revision-modulo-escenas-jmorgado.mp4` (MP4, H.264, 1280×720, 30 fps, sin audio, 2,3 MB) |

---

## 9. Pendiente de revisión visual

1. Ritmo de la caída del cuarto acto: conviene mirar la escena 04 detenida y durante el traspaso.
2. En móvil, CRECER ocupa el 88 % del ancho y sube junto al titular: hay que confirmar que la composición respira.
3. El «Ir al sitio ↗» de la esquina superior derecha de la introducción: se conserva porque el encargo no pedía retirarlo.
4. Confirmar que la marca `JM.` sola en la cabecera satisface la marca de portada.

---

## 10. Grabación de revisión

`docs/entregas/revision-modulo-escenas-jmorgado.mp4` — MP4, H.264, 1280×720, 30 fps, sin audio, 2,3 MB.
Recorre las cuatro escenas con sus rótulos, muestra CRECER escrito, el puntero quieto y el puntero fuera de la página (la escena sigue viva), la caída de las piezas, la entrada a la landing y el retorno con `JM.` con el recorrido inverso.

---

## 11. Cómo verlo en local

```bash
cd C:\Users\jorge\Proyectos\Jmorgado\landing
python -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/` y recorrer con la rueda. El control de tema está arriba a la derecha durante la introducción y en la cabecera cuando aparece el sitio.
