# Continuidad — Refinamiento final de la landing y navegación global JMorgado

**Fecha:** 12 de noviembre de 2026
**Estado:** implementación completa, **sin commit** (pendiente de aprobación visual de Jorge).
**Alcance:** navegación global (cabecera y pie), presentación de las secciones de la landing, calculadora, carrusel de proyectos y textos editoriales. El módulo de escenas aprobado no se altera.

---

## 1. Punto de recuperación y rama de trabajo

| Elemento | Valor |
| --- | --- |
| Commit de respaldo | `d1c6373` — *feat: finalizar modulo de escenas jmorgado aprobado* |
| Rama de respaldo | `backup/jmorgado-antes-refinamiento-landing` (apunta a `d1c6373`) |
| Respaldo previo | `backup/jmorgado-escenas-finalizadas` (también en `d1c6373`) |
| Rama de trabajo | `work/refinamiento-final-landing` (creada desde `d1c6373`) |
| `main` | `63e45ea` — sin tocar |

El estado restaurado ya correspondía exactamente a un commit existente, por lo que **no se creó ningún commit vacío**. El experimento descartado de partículas ambientales fue retirado de forma selectiva: `assets/site-particles.js` y `videos/*.webm` siguen en disco pero **fuera de la carga del sitio** (pertenecen a otro frente; no borrar).

---

## 2. Resumen de cambios por sección

| Fase | Sección | Resultado |
| --- | --- | --- |
| 1 | Unión con la landing | Capa cromática plana sobre el lienzo en `play.t` 7.05 → 7.92: el fondo evoluciona hacia el papel real de la primera sección. Sin franja ni salto de luminancia, reversible al subir. Verificado en día y noche. |
| 2 | Cabecera | Una sola cabecera para todo el sitio. Fija, marca `JM.` a la izquierda, navegación y control de tema a la derecha. **No aparece sobre las cuatro escenas.** |
| 3 | «¿Qué te gustaría mejorar?» | Las tres opciones son accesos navegables a `/servicios/` con «Ver servicios ↗», hover y foco visible. |
| 4 | Calculadora | Encabezado centrado, texto auxiliar nuevo, valores 180 / 1 / 5 y animaciones numéricas discretas. |
| 5 | Proyectos | «Ver más proyectos» centrado bajo el carrusel; selección por hover con demora en escritorio. |
| 6 | Tetris | Nuevo titular «Una pausa / para jugar.» y texto secundario nuevo. |
| 7 | Contacto | Separación vertical entre los botones y la nota: 25 px medidos (objetivo 20–24 px). |
| 8 | Sobre mí | Enlace a LinkedIn con logotipo y azul `#0A66C2`, centrado en la columna derecha. |
| 9 | Pie | Un único pie para todo el sitio: petróleo oscuro, identidad a la izquierda, enlaces a la derecha, línea fina con copyright y regreso. |

---

## 3. Cómo quedó centralizada la cabecera

- Se genera una sola vez en `meta()` dentro de `build_site.py` (función compartida por portada y páginas interiores). No hay copias del HTML.
- Clase global única: **`.jm-header`** (antes `.home-header`, que solo usaba la portada).
- Estilos globales en `assets/site.css` (bloque «Cabecera global»), con prefijo `body` para ganar al estilo base `.site-header`.
- `assets/journey-study.css` ya no define reglas de cabecera; solo conserva la visibilidad según el estado del módulo.
- Referencias actualizadas de `.home-header` → `.jm-header` en: `assets/journey-study.js`, `assets/journey-study.css`, `assets/home-theme-quality.css`, `assets/home-editorial-pass.css`, `journey_study.py` (resguardo `<noscript>`) y `qa_smoke.py`.
- Comportamiento: `position:fixed`, `z-index:40`, `--jm-header-h` (80 px / 70 px ≤ 620 px). En páginas interiores `main` recibe `padding-top:calc(var(--jm-header-h) + 1.2rem)`.
- **Las reglas llevan prefijo `body`** (`body .jm-header…`). Sin él, la regla base `.site-header` de `assets/site.css` —que se carga antes— gana por orden de cascada y la cabecera queda `position:relative`, sin fijar, y el menú móvil deja de ser pulsable. Es el punto más frágil del cambio.
- Durante el módulo de escenas la cabecera permanece oculta (`visibility:hidden` + `pointer-events:none`) y el JS la marca `inert`; aparece al entrar al contenido y en móvil abre el menú desplegable.
- `assets/site.js` gestiona el icono de día/noche (`data-theme-icon`) en todas las páginas.

---

## 4. Cómo quedó centralizado el pie

- Se genera una sola vez en `foot()` dentro de `build_site.py` y se aplica a **todas** las rutas (portada, servicios, proyectos, herramientas, contacto, calculadora, método, jugar, fichas y 404).
- Estructura: `.jm-footer` → `.jm-footer-top` (`.jm-footer-brand` con marca `JM.` + descripción breve | `.jm-footer-links` con los cinco enlaces) y `.jm-footer-base` (línea fina con `© 2026 Jorge Morgado` y «Volver al inicio ↑»).
- Estilos en `assets/site.css` (bloque «Pie global»), fondo petróleo `#102E38`.
- Los pies antiguos de portada (`.home-footer .footer-nav`) y de páginas interiores (`.footer-links`/`.footer-base`) se retiraron del generador; sus reglas CSS heredadas quedan sin efecto.

---

## 5. Rutas de navegación implementadas

| Enlace | Portada | Página interior |
| --- | --- | --- |
| Servicios | `/servicios/` | `/servicios/` |
| Proyectos | `#trabajos` (sección) | `/proyectos/` |
| Herramientas | `/herramientas/` | `/herramientas/` |
| Sobre mí | `#quien-soy` (sección) | `../#quien-soy` (sección de la portada) |
| Contacto | `#contacto` (sección) | `/contacto/` |

El pie usa siempre rutas de página (`/servicios/`, `/proyectos/`, `/herramientas/`, `/contacto/`) y, para «Sobre mí», la sección de la portada.

La marca `JM.` mantiene el comportamiento previo: en la portada regresa al inicio de la experiencia sin recargar (`data-home-return`); en páginas interiores apunta a la portada. No se inventaron anclas nuevas.

---

## 6. Calculadora

- Valores iniciales: **antes 180 min · con automatización y revisión 1 min · 5 veces por semana**. Los campos siguen siendo editables y los resultados se calculan dinámicamente.
- Ahorro por ejecución: **179 min** (verificado en navegador). Conversiones semanal y anual conservadas de la lógica existente.
- Texto auxiliar nuevo: «Incluye el tiempo de ejecución y la revisión humana que siga siendo necesaria.»
- Encabezado «EL COSTO INVISIBLE DE REPETIR» centrado sobre su propio título (`.impact-eyebrow`), con el mismo acento cromático.
- Animaciones numéricas: `move()` con duración 380 ms y suavizado `easeInOutQuad` (sin rebote); entrada inicial 640 ms. Se evita reiniciar animaciones mientras se edita.

---

## 7. Carrusel de proyectos

- Diseño, tarjetas, perspectiva y contenidos **sin reconstruir**.
- «Ver más proyectos» centrado bajo el carrusel (`.section-action` con `width:auto` + `margin-inline:auto`; el enlace queda en el centro real del `wrap`).
- Selección por hover **solo en escritorio**: `pointerenter` con `pointerType === "mouse"` y `(hover: hover) and (pointer: fine)`, con demora de **240 ms**; al salir de la tarjeta se cancela el temporizador. La selección queda fijada hasta otra interacción.
- El hover **no navega**: el clic sigue abriendo la ficha del proyecto.
- Teclado y táctil intactos (flechas, foco y deslizamiento).

---

## 8. Archivos modificados

**Generadores y fuentes**

- `build_site.py` — cabecera y pie únicos, navegación por ruta, opciones a servicios, calculadora, Tetris, LinkedIn, símbolo `i-linkedin`.
- `journey_study.py` — **una sola línea**: el resguardo `<noscript>` (`.home-header` → `.jm-header`). Los títulos, descripciones y la coreografía de las cuatro escenas no se tocan.
- `site_data.py` — sin cambios (ya existiría `LINKEDIN`).

**Estilos**

- `assets/site.css` — bloque global de cabecera y pie (con prefijo `body`).
- `assets/journey-study.css` — se retiraron las reglas de cabecera (movidas a `site.css`); quedan dos renombres de clase.
- `assets/home-art-direction.css` — ajustes de portada: opciones, encabezado de la calculadora, enlace de proyectos, contacto, LinkedIn.
- `assets/home-theme-quality.css`, `assets/home-editorial-pass.css` — un selector de cabecera cada uno (`.home-header` → `.jm-header`).

**Scripts**

- `assets/journey-study.js` — referencia a `.jm-header` y capa de cierre del módulo.
- `assets/home-quick-calculator.js` — duraciones y suavizado.
- `assets/home-project-carousel.js` — selección por hover con demora.
- `assets/site.js` — icono de tema para todas las páginas.

**QA, Git y HTML generado**

- `qa_smoke.py` — selectores de cabecera y pie, lista de navegación y titular de Tetris.
- `.gitignore` — excepción para que este documento pueda versionarse.
- HTML regenerado por `python build_site.py` (25 archivos): `index.html`, `404.html` y todas las páginas de servicios, proyectos, herramientas, contacto, calculadora, método y jugar.

---

## 9. Resultado de las comprobaciones básicas

| Comprobación | Resultado |
| --- | --- |
| `python build_site.py` | OK — sitio regenerado sin errores |
| `python qa_smoke.py` | OK — 1440×900, 768×1024, 390×844, 320×568, 844×390; touch ripple; catálogo y filtros; juego (teclado, táctil, responsive); 26 rutas, 24 canónicas, JS deshabilitado y movimiento reducido |
| `node --check assets/journey-study.js assets/site.js assets/home-quick-calculator.js assets/home-project-carousel.js` | OK |
| `git diff --check` | OK (sin errores de espacios) |
| Transición cromática | Sin franja: la última fila del lienzo es `rgb(240,235,228)` frente al papel `rgb(240,237,230)` en día y `rgb(20,29,33)` frente a `rgb(17,27,32)` en noche (Δ ≤ 5/255) |
| Cabecera | Coherente en portada y páginas interiores; fija; oculta sobre las escenas |
| Enlaces de Servicios y Herramientas | Correctos desde portada e interiores |
| Opciones iniciales | Las tres navegan a `/servicios/`, con foco visible (contorno 2 px) |
| Calculadora | 180/1/5 → 179 min; 14,9 h por semana; 775,7 h por año; animaciones discretas |
| Carrusel | Hover selecciona sin navegar; el cruce rápido no cambia la selección; teclado y móvil operativos |
| Tetris | «Una pausa para jugar.» + texto secundario nuevo |
| Contacto | 25 px de separación entre botones y nota (escritorio y móvil) |
| LinkedIn | `https://www.linkedin.com/in/jorge-morgado/`, logo `rgb(10,102,194)`, nombre accesible y centrado en la columna |
| Pie | Compartido en todas las rutas (portada, servicios, proyectos, herramientas, contacto, calculadora, método, jugar, fichas y 404) |
| Errores de consola | Ninguno en portada ni en interiores |
| Recuento de la FASE 10 | **23/23 comprobaciones superadas** |

---

## 10. Pendientes reales

1. **Aprobación visual de Jorge y commit local** de esta tanda (no se ha hecho commit, push ni despliegue).
2. `assets/site-particles.js` y `videos/*.webm` siguen sin seguimiento y fuera del sitio: son de otro frente, no se borran desde aquí.
3. `.gitignore` ignora `docs/entregas/*` salvo los documentos whitelisteados. Este documento se ha añadido a la lista para que pueda versionarse con el commit aprobado.

---

## 11. URL local para revisar

```
http://127.0.0.1:8765/
```

Servidor estático en la raíz del proyecto:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Rutas útiles: `/servicios/`, `/proyectos/`, `/herramientas/`, `/contacto/`, `/calculadora/`, `/jugar/`.

---

## 12. Nota para quien continúe

- El módulo de escenas (`journey_study.py`, `assets/journey-study.js`, `assets/journey-study.css`) es **canónico**: no reiniciarlo ni reconstruirlo. Solo se допуjeron cambios de nombre de clase (`home-header` → `jm-header`) y la capa de cierre cromático.
- El generador es `build_site.py`: cualquier cambio de cabecera, pie o secciones debe hacerse ahí y luego ejecutar `python build_site.py`. **No editar el HTML generado como fuente.**
- En cascada, varias reglas de la landing usan `!important` con mayor especificidad. Para ajustar la landing usar selectores `body.home-page main > …` con `!important` (así se resolvieron `contact-caveat`, `impact-eyebrow`, `quick-calc-note`, `persona-linkedin` y `section-action`).
- El selector `.home-header` ya no existe en el sitio: todo apunta a `.jm-header`.
