# Continuidad — Refinamiento de la página de contacto JMorgado

**Fecha:** 12 de noviembre de 2026
**Estado:** implementación completa, **sin commit** (pendiente de revisión visual final de Jorge).
**Alcance:** exclusivamente `/contacto/`. No se tocaron la landing, las escenas, el header, el footer ni otras páginas.

---

## 1. Qué se ajustó

### Apertura de la página — nueva ficha de agenda

La apertura usaba `modular-v02/K02-marco-editorial.svg`: un marco abstracto (dos escuadras, dos puntos coral y una línea de puntos) al 50 % de opacidad detrás del título. Aportaba ruido y no comunicaba nada.

Ahora la apertura usa **`assets/modular-v02/K03-ficha-agenda.svg`**, una ficha de agenda mínima:

- Ficha rectangular de esquinas redondeadas en trazo petróleo `--jm-petrol` (1,8 px).
- División horizontal superior que separa la cabecera del cuerpo.
- Tres renglones finos en `--jm-line` que sugieren apuntes de agenda, sin días ni horas reales.
- Acento coral: un cuadrado en la cabecera, un tramo de renglón marcado y una flecha de acción (mismo motivo `↗` que usa la marca).
- Proporción horizontal 520 × 300, colocada en la columna derecha (`right:1.5%`, `width:min(29%,24rem)`, opacidad 0,9).
- Por debajo de 1000 px la ficha se retira: no hay columna y la apertura móvil queda despejada.

Es **decorativa**: `aria-hidden="true"`, sin enlaces, sin puntero activo y sin campos. La disponibilidad y la hora se siguen eligiendo en Google Calendar al abrir el enlace.

### Sección «03 · Antes de conversar»

- `.statement-contact` pasa a `align-items:center`: el bloque de apoyo queda **centrado verticalmente** dentro de su columna (antes pegado al borde superior).
- Se conservan las columnas `1.04fr / .96fr` y el `gap` existentes, el título, el texto, el fondo oscuro y la jerarquía.
- En móvil (≤ 800 px) sigue apilándose en una sola columna con separación natural (≈ 52 px).

### Sección «01 · Agenda una conversación»

Se conserva la gráfica de calendario con fecha seleccionada y su pie «45 min · Google Calendar / Hora de Chile», tal como quedó en la ronda anterior.

---

## 2. Archivos modificados

| Archivo | Cambio |
| --- | --- |
| `assets/modular-v02/K03-ficha-agenda.svg` | **Nuevo**: la ficha de agenda de la apertura |
| `build_site.py` | La apertura de contacto apunta a `K03-ficha-agenda.svg` en lugar de `K02-marco-editorial.svg` |
| `assets/interior.css` | Medida y posición de `.contact-frame-art`; retirada por debajo de 1000 px; `.statement-contact` con `align-items:center` |
| `assets/booking.css` | (ronda anterior) estilos de la gráfica de calendario de la sección 01 |
| `contacto/index.html` y el resto del HTML | Regenerados por `python build_site.py` |

`K02-marco-editorial.svg` se conserva en disco: puede seguir usándose en otras piezas.

---

## 3. Comprobación

| Comprobación | Resultado |
| --- | --- |
| La ficha se ve mejor que el marco anterior y aporta el concepto de agenda | OK — pieza legible, con acento coral de acción |
| Sigue siendo decorativa, no funcional | OK — `aria-hidden`, sin enlaces ni puntero |
| Sección 03 equilibrada | OK — el texto queda a 21 px del centro óptico del título (1440 px) |
| Sin desbordes ni quiebres raros | OK — 1440, 1280, 1200, 1100, 1024, 1001, 1000, 900, 768 y 390 px revisados; la ficha nunca choca con el título |
| Enlace de contacto y resto de la página | OK — «Ver horarios» conserva la URL de Google Calendar, WhatsApp intacto, cabecera y pie globales |
| Errores de consola | Ninguno |
| Comprobación puntual | **18/18 superadas** |

---

## 4. URL local

```
http://127.0.0.1:8765/contacto/
```

Servidor estático en la raíz del proyecto:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

---

## 5. Estado de Git

- Rama activa: **`work/refinamiento-contacto`**, sobre el commit `4e8a715` (*feat: consolidar landing jmorgado aprobada*).
- Respaldo de la landing aprobada: **`backup/jmorgado-landing-aprobada`** → `4e8a715`.
- Los cambios de contacto están **sin commit**, a la espera de la revisión visual final.
- `main` sigue en `63e45ea`, sin tocar. No hay push, despliegue ni ZIP.

> Nota: `assets/site-particles.js` y `videos/*.webm` siguen sin seguimiento y fuera del sitio; pertenecen a otro frente y no se tocan.
