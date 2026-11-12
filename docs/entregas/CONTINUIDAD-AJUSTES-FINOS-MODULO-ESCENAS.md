# Continuidad — Ajustes finos del Módulo de escenas JMorgado

**Fecha:** 11 de noviembre de 2026
**Estado:** implementación completa y verificada en navegador. Pendiente la revisión visual de Jorge.
**Alcance:** sólo el Módulo de escenas (la introducción). No se tocó el resto de la landing.

---

## 1. Git

| Elemento | Valor |
| --- | --- |
| Rama de respaldo | `backup/jmorgado-modulo-escenas-aprobado` |
| Commit de respaldo | `9f4c66a` — `chore: checkpoint aprobado modulo de escenas jmorgado` |
| Rama de trabajo | `work/ajustes-finos-modulo-escenas` |
| Base | el commit `9f4c66a`, que es exactamente la versión aprobada |

`main` no se tocó. Sin push, sin despliegue y sin ZIP nuevos.
`assets/site-particles.js` y `videos/` siguen **sin seguimiento**: pertenecen a otro frente de trabajo.

Los ajustes de esta tanda están **sin commit** en el árbol de trabajo, a la espera de aprobación visual.

---

## 2. Qué se ajustó, escena por escena

**Escena 01 · Idea.** El bloque de texto baja del 19 % al 26 % y queda más centrado verticalmente. La materia se carga más a la derecha (`centroX` de .67 a .72 en el primer acto, escala .57 → .60): hay más aire entre el texto y el visual. La lógica izquierda / animación a la derecha no cambia.

**Escena 02 · Forma.** La caja se ensancha (46 %, `right:6 %`, `top:16 %`), con más margen y más aire entre líneas; el apoyo queda a 30 ch. La animación de la izquierda conserva su protagonismo y el texto deja de sentirse arrinconado. «forma.» mantiene el bloque invertido y su contraste.

**Escena 03 · Crecimiento.** El título sigue arriba y el apoyo sigue debajo, en la misma estructura: sólo se ajusta el espaciado (`margin-top` 1.05 rem, 40 ch, opacidad .88). El cambio real está en la lectura de la palabra, ver §5.

**Escena 04 · Comienzo.** El cierre se divide: «Y esto es solo el» arriba, en tinta y a menor tamaño; «comienzo.» abajo, en coral y con mucho más cuerpo (`clamp(2.9rem, 7.6vw, 7.6rem)`). Deja de ser un bloque plano. La caída de las piezas se mantiene intacta.

---

## 3. Qué se cambió para reducir scroll

- La introducción pasa de `900svh` a **`720svh`**: el recorrido pasa de 8 a **6,2 pantallas** (medido: 5580 px de recorrido en 1440×900).
- El `scrub` del ScrollTrigger baja de `.42` a **`.30`**: la escena responde antes al gesto de scroll y el usuario percibe progreso real en cada movimiento.
- Se conserva la reversibilidad: el estado es una función pura de la posición del scroll, así que al subir la narrativa se rehace en sentido inverso sin saltos.

---

## 4. Cómo se reforzó el movimiento de la escena 1

Todo vive en el motor (`assets/journey-study.js`), sin capas ni lienzos nuevos:

- **Carga.** Al entrar, la materia está condensada y tensa: las 96 piezas se comprimen hacia el núcleo (`carga` multiplica la posición por 1 − .50 en X/Z) durante los primeros `.085` del recorrido. La primera pantalla ya muestra un núcleo cargado en el sector derecho.
- **Latido.** Un pulso radial (`latidoCarga`, seno entre `.08` y `.24`) separa y reagrupa el conjunto antes de que encaje.
- **Montaje con energía.** La interpolación ya no es lineal: `te` pasa de 0 a 1 con un pequeño rebote, de modo que la pieza llega con energía y se asienta (`(1−tO)²·sin(π·tO)·.20`).
- **Encendido.** Un frente recorre las piezas en el orden del montaje y cada una brilla un instante al recibirlo (`chispa`); el brillo se aplica al color de la pieza.
- **Vibración.** Durante el montaje las piezas tiemblan a ~7 Hz con amplitud pequeña (`escala·.011`); después queda un zumbido permanente (`escala·.0035`).
- **Movimiento autónomo intacto.** El zumbido y la respiración siguen alimentados por el reloj del mundo, así que la escena no se congela con el puntero quieto ni fuera de la zona.

---

## 5. Cómo se mejoró la lectura de CRECER

Sin volver la palabra un signo vectorial:

- **Silueta más densa.** El muestreo de la forma pasa de 3 px a 2 px: hay más puntos sobre el trazo.
- **Polvo con más presencia** dentro de la palabra (`1 + aCrecer·.42`, antes `.28`).
- **Halo de atmósfera.** Un resplandor elíptico muy suave se dibuja detrás de la palabra, con la escala vertical del propio trazo. La palabra emerge del fondo sin recortarse.
- **Piezas que acompañan.** Al escribir CRECER las piezas bajan a la mitad de tamaño (`1 − tL·.46`) y suben un 30 % de opacidad: se funden con la palabra en vez de romperla.

El trazo sigue siendo orgánico: lo escriben las mismas partículas y fragmentos del módulo.

---

## 6. Archivos modificados

| Archivo | Qué cambió |
| --- | --- |
| `journey_study.py` | El cierre se divide en dos líneas: («Y esto es solo el», «comienzo.»). El texto aprobado no cambia. |
| `assets/journey-study.js` | Carga, latido, montaje con rebote, encendido y vibración; posición de la materia; halo y densidad de CRECER; `scrub` a `.30`. |
| `assets/journey-study.css` | Altura 720 svh; posiciones de las cuatro escenas; coral y tamaño del cierre; ajuste equivalente en móvil y horizontal compacto. |
| `qa_smoke.py` | El contrato editorial recoge el cierre en dos líneas. |
| `index.html` | Regenerado con `python build_site.py` (cambia el `?v=` del recurso). |

---

## 7. Estado de Git

```
rama activa: work/ajustes-finos-modulo-escenas
HEAD:        9f4c66a  chore: checkpoint aprobado modulo de escenas jmorgado
sin commit:  assets/journey-study.js, assets/journey-study.css,
             journey_study.py, qa_smoke.py, index.html
sin seguimiento (ajeno): assets/site-particles.js, videos/
```

`main` en `63e45ea`, sin tocar. Sin push ni despliegue.

---

## 8. Comprobaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| `node --check assets/journey-study.js` | correcto |
| `python build_site.py` | correcto (26 rutas) |
| `python qa_smoke.py` | correcto en 1440×900, 768×1024, 390×844, 320×568 y 844×390; 26 rutas, 24 canónicas, accesibilidad, temas, movimiento reducido, calculadora y juego |
| `git diff --check` | correcto |
| Barrido del recorrido (101 posiciones) | 0 fracciones sin texto legible |
| Movimiento autónomo | el lienzo cambia con el puntero quieto y con el puntero fuera de la página |
| Consola | sin errores de página ni de consola en escritorio (1440×900) y móvil (390×844) |
| Lectura de CRECER | legible en modo día y en modo noche, en escritorio y en móvil |
| Intervalo entre fotogramas | mediana 4,2 ms (sin cambio respecto a la versión aprobada) |
| Revisión visual | escritorio 1440×900 y móvil 390×844, escenas 01–04, secuencia de carga de la escena 01 y traspaso a la landing |

---

## 9. Cómo visualizar la versión local

```bash
cd C:\Users\jorge\Proyectos\Jmorgado\landing
python -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/` y recorrer con la rueda. Para ver el ensamblaje de la escena 01 conviene avanzar despacio los primeros 15 % del recorrido: ahí se concentrates la carga, la liberación y el montaje de las piezas.
