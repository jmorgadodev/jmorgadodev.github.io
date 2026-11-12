# Continuidad — Módulo de escenas JMorgado (versión aprobada)

**Fecha:** 12 de noviembre de 2026
**Estado:** versión aprobada por Jorge. Es el punto de recuperación definitivo del inicio antes de trabajar la capa ambiental de la landing.
**Alcance:** sólo la introducción (`.tech-study`). La landing y sus secciones no se tocan.

---

## 1. Las cuatro escenas y sus textos

Viven en `journey_study.py` (`TITLES` y `DESCRIPTIONS`) y se generan en `index.html` mediante `render_study()`.

| # | Escena | Título | Texto secundario |
| --- | --- | --- | --- |
| 01 | Idea | `Todo comienza` / `con una idea.` | `O con algo que podría funcionar mejor.` |
| 02 | Forma | `Le damos` / `forma.` | `Transformando lo que imaginas en algo que funciona.` |
| 03 | Crecimiento | `Lo que funciona` / `puede crecer.` | `Evolucionar, abrir nuevas posibilidades y llegar más lejos.` |
| 04 | Comienzo | `Y esto es solo el` / `comienzo.` | — (sin secundario) |

En la escena 04 la segunda línea va en coral y con mucho más cuerpo; el cierre no repite el nombre de la marca.

**Composición por escena**

- **01 · Idea** — texto a la izquierda (`left:7 %`, `top:26 %`), materia a la derecha. El polvo de la escena se atrae hacia la segunda línea del titular, así que letra y materia comparten el mismo aire.
- **02 · Forma** — texto a la derecha (`right:6 %`, `top:30 %`), retícula y red de uniones a la izquierda. «forma.» va sobre un bloque invertido y conserva su contraste.
- **03 · Crecimiento** — titular arriba y centrado, palabra CRECER construida en el lienzo, texto de apoyo debajo de las partículas con ~100 px de hueco libre (medido por el motor, no estimado).
- **04 · Comienzo** — una línea arriba y «comienzo.» en coral abajo; las piezas se desprenden, giran y caen hacia el sitio.

---

## 2. El movimiento autónomo

El motor tiene un **reloj del mundo** (`idleClock` / `idleMotion.time`) que es la única fuente del movimiento propio:

- Avanza siempre que la introducción está a la vista, con `prefers-reduced-motion` desactivado.
- **No depende del puntero**: el puntero sólo modula la respuesta (trazado, velocidad, dirección). Si sale de la página o la ventana pierde el foco, la escena sigue viva.
- El puntero marca un objetivo (`tx/ty`) y la escena lo persigue con inercia (120 ms): la respuesta es continua, nunca un salto.
- Cada pieza respira con dos oscilaciones lentas (periodos de 12 y 18 s) y amplitud de pocos píxeles: **la estructura respira, no tiembla**.
- La capa narrativa se repinta a su propio ritmo (33 ms en escritorio, 42 ms en pantallas estrechas) mientras el mundo late.

**Entrada de la escena 01.** La materia entra condensada en un núcleo tenso, se libera, y las piezas describen **arcos** hacia su sitio (no líneas rectas). El montaje no es lineal: la pieza se queda un momento dispersa, acelera, llega con energía y se asienta con un rebote corto. Un latido radial separa y reagrupa el conjunto, y un frente de encendido recorre las piezas en el orden del montaje.

**Cuarta escena.** Al cerrarse, `huida` desprende cada pieza con su propio peso, la separa del conjunto y la hace girar mientras cae.

---

## 3. El recorrido: 460 svh

- `.tech-study.is-linked { height: 460svh }` → **3,6 pantallas** de recorrido (3240 px en 1440×900), de las que 360 svh son el recorrido útil y 100 svh el traspaso a la landing.
- El `scrub` del ScrollTrigger es `.30`: la escena responde con agilidad sin aceleraciones internas.
- El estado es una **función pura de la posición del scroll**: el recorrido se puede recorrer en ambos sentidos sin saltos ni reinicios.
- Las cuatro ventanas de texto se **cruzan** (`[[0,2.08],[1.92,4.08],[3.94,6.08],[5.92,8]]` en unidades de `play.t`): un texto nunca desaparece antes de que el siguiente haya empezado a aparecer. El cruce dura `.26` s.

---

## 4. La paleta diurna aprobada

El día trabaja sobre **gris pizarra claro, ligeramente verdoso**:

| Tramo | Color | Escena |
| --- | --- | --- |
| 0 | `#C6D2CF` | 01 · Idea |
| 1 | `#BDCAC7` | 02 · Forma |
| 2 | `#B2C0BD` | 02 · Forma |
| 3 | `#A7B5B2` | 02 · Forma |
| 4 | `#08272C` | 03 · Crecimiento |
| 5 | `#10333A` | 03 · Crecimiento |
| 6 | `#BFCBC9` | 04 · Comienzo |
| 7 | `#F0EDE6` | traspaso → papel de la landing |

El degradado ambiental es muy sutil (crema al 20 % arriba a la izquierda, tinta al 17 % abajo a la derecha) y no hay manchas decorativas.

**Contraste diurno**: cuerpo de las piezas `mix(ink, petrol .44)`, halo `mix(ash, petrol .68)`, baño de crema reducido a `.26` y borde de pieza al `.40`: las piezas grises, marfil, coral y doradas se distinguen sin brillos artificiales. La niebla de profundidad baja a `.36` para que la composición no se lave.

**Modo noche**: intacto y aprobado. `#131E23 → #111B20`, piezas marfil, coral `#FF785C` y ámbar `#EEC47D`.

---

## 5. La formación de CRECER

`pioneerCampo('CRECER')` mide la silueta de la palabra sobre un lienzo temporal y guarda dos conjuntos: el **cuerpo** de la letra y su **contorno** (los puntos sin tinta al lado).

- **Fragmentos**: los 96 fragmentos recorren la letra entera con un barrido parejo → el interior de cada carácter se construye y no hay acumulaciones desordenadas.
- **Polvo**: 900 partículas; el 30 % va al contorno y un 70 % al cuerpo, con el contorno un 45 % más grande y el cuerpo un 18 % más grande.
- **Halo**: un resplandor elíptico suave, con la escala vertical del propio trazo, separa la palabra del fondo sin recortarla.
- La palabra aparece entre `play.t` 4,0 y 5,2, justo cuando el titular ya está asentado.

---

## 6. La transición hacia la landing

Al terminar la cuarta escena el marco se desprende del anclaje y asciende mientras el papel de la landing entra por debajo. El fondo final del módulo (`#F0EDE6`) es exactamente el papel del sitio (`--jm-bg`), de modo que el traspaso no tiene corte de tono. La cabecera de la landing aparece cuando `#explorar` entra en pantalla y se retira en cuanto el visitante vuelve a las escenas.

El botón `JM.` de la cabecera devuelve al inicio de la experiencia con un desplazamiento suave, sin recargar el documento y con el motor atado a la posición real del scroll.

---

## 7. Archivos principales del módulo

| Archivo | Papel |
| --- | --- |
| `journey_study.py` | Canon de las cuatro escenas y marcado HTML accesible del inicio. |
| `assets/journey-study.js` | Motor del módulo: escena paramétrica, reloj del mundo, CRECER, fondo y paleta. |
| `assets/journey-study.css` | Distribución de las cuatro escenas, cabecera de la portada y medidas propias. |
| `assets/site.js` | Iconos del control de tema (sólo en la portada). |
| `build_site.py` | Marca `JM.`, clase `wordmark-text` y atributo `data-theme-icon` de la portada. |
| `qa_smoke.py` | Contrato editorial del inicio y comprobaciones de recorrido. |
| `index.html` | Salida generada con `python build_site.py`. |

---

## 8. Cómo ejecutar el sitio localmente

```bash
cd C:\Users\jorge\Proyectos\Jmorgado\landing
python -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/`. Para ver el ensamblaje de la escena 01 conviene avanzar despacio el primer 15 % del recorrido.

Comprobaciones de apoyo: `node --check assets/journey-study.js`, `python build_site.py`, `python qa_smoke.py`.
