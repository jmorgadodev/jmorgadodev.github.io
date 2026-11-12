# Continuidad — Cierre funcional de JMorgado

**Fecha:** 12 de noviembre de 2026
**Estado:** implementado, **sin commit** (pendiente de aprobación visual y de publicación de Jorge).
**Alcance:** la corrección del Módulo de escenas (ronda anterior), el comportamiento definitivo del botón `JM.` y los requisitos de publicación. No se rediseña el sitio ni se incorporan funcionalidades nuevas.

---

## 1. Commit y rama de respaldo de los diagramas aprobados

| Elemento | Valor |
| --- | --- |
| Commit | `f820329` — *feat: finalizar diagramas interactivos de proyectos* |
| Rama de respaldo | `backup/jmorgado-diagramas-aprobados` → `f820329` |
| Rama del cierre funcional | **`work/cierre-funcional-jmorgado`**, y sigue siéndolo. `main` en `63e45ea` |

## 2. Rama utilizada para el cierre funcional

**`work/cierre-funcional-jmorgado`**, creada desde `f820329`. Contiene la corrección de ScrollTrigger (pendiente de aprobación) y ahora estos ajustes de publicación.

## 3. Comportamiento definitivo del botón `JM.`

**Problema:** desde la landing, `JM.` devolvía a `top: 0` de la página y mostraba de nuevo las cuatro escenas.

**Ahora:** `JM.` lleva al inicio del contenido, la sección **«¿Qué te gustaría mejorar?»** (`#explorar`).

- **Desde la portada:** desplazamiento suave hasta `#explorar`, sin recargar y sin volver a la introducción. El header fija `#explorar` con `scroll-margin-top` para no taparlo.
- **Desde páginas interiores:** navegación a `/#explorar`. Se abre la portada directamente en el contenido; no obliga a recorrer la introducción.
- **Recorrido reversible:** quien quiera repetir las escenas solo tiene que subir.
- **`prefers-reduced-motion`:** desplazamiento instantáneo.
- El atributo `aria-label` del enlace es «Ir a «¿Qué te gustaría mejorar?»».

## 4. Cómo se conservó la corrección de ScrollTrigger

La corrección de la ronda anterior —`resincronizar()` en `pageshow` y `popstate`, con `ScrollTrigger.refresh()`— se conserva intacta. Comprobado de nuevo tras este cambio: medidas `start 0 / end 3240` y progreso responde al scroll en ambas direcciones tras Atrás, un enlace del pie y `JM.`.

## 5. Estado de los diez requisitos de publicación

| # | Requisito | Estado |
| --- | --- | --- |
| 1 | Meta title único, descriptivo, ≤ 70 caracteres, un solo `JMorgado` | OK — todas las rutas públicas |
| 2 | Meta description propia en todas las páginas | OK — revisadas todas |
| 3 | Favicon consistente y sin rutas rotas | OK — `assets/favicon.svg` en todas |
| 4 | `robots.txt` | **Creado** — `User-agent: * / Allow: /` + `Sitemap:` apuntando al dominio público |
| 5 | `sitemap.xml` | **Generado** por `build_site.py` a partir de las rutas públicas; 23 URLs indexables. Excluye `404.html` y las dos páginas `noindex` de redirección (`proyectos/auditapc/`, `proyectos/nokto/`) |
| 6 | Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`) | OK — las 23 páginas públicas lo tienen completo. `og:image` = `https://jmorgadodev.github.io/assets/social-preview.png` (preview de marca, 38 KB, pública) |
| 7 | `alt` descriptivo o `alt=""` en imágenes | OK — revisadas todas las rutas |
| 8 | Descripción textual de cada arquitectura | **Añadida** — cada `<desc>` describe componentes y conexiones desde los datos del propio artefacto; la arquitectura ya no depende del movimiento |
| 9 | Responsive móvil | OK — sin desbordamientos en ninguna ruta; menú operativo; escenas y diagramas utilizables; foco visible con teclado |
| 10 | 404 propio y respuesta HTTP 404 | **Existe y es correcto** — header compartido, mensaje claro, enlaces a inicio y proyectos. Respuesta HTTP 404 real servida por GitHub Pages para una ruta inexistente |

## 6. Archivos modificados en esta ronda

| Archivo | Cambio |
| --- | --- |
| `build_site.py` | `home_target` → `#explorar`; destino del enlace `JM.`; función `sitemap()` que genera `sitemap.xml` y `robots.txt` desde las rutas públicas |
| `assets/journey-study.js` | `goToHomeStart()` desplaza a `#explorar`; `#home-start` desaparece; se conserva `resincronizar()` |
| `assets/journey-study.css` | `scroll-margin-top` de `#explorar` para que la cabecera no tape el título |
| `assets/*-archify-*.html` (11 artefactos) | Sustitución del `<desc>` genérico por componentes + conexiones del propio diagrama |
| `index.html` y HTML regenerado | Regenerados por `python build_site.py` |
| `robots.txt` | **Creado** (generado por el constructor) |
| `sitemap.xml` | **Creado** (generado por el constructor; 23 URLs) |

`404.html` existía y sigue funcionando: header y footer compartidos, mensaje claro, enlaces a inicio y proyectos.

## 7. Estados de carga y mensajes de error (FASE 8)

No hizo falta escribir código nuevo. Lo que ya existe:

- **Calculadora rápida y completa**: mensajes claros para datos inválidos, resultados dinámicos, "No equivale a ahorro de caja garantizado".
- **Tetris**: "Cargando ranking", "El ranking no está disponible ahora" + reintento, "No se pudo guardar la marca. Puedes volver a intentarlo o seguir jugando."
- **Agendar**: nota alternativa al iframe del calendario ("Si no ves los horarios…").
- **Módulo de escenas y diagramas**: funcionan con `prefers-reduced-motion` y sin JavaScript.

Errores y mensajes siempre orientados al usuario, con una acción posible cuando aplica. Ninguno es técnico ni interno.

## 8. Pendientes que dependen del hosting o dominio público

1. **Dominio público de producción**: `SITE_URL` está configurado a `https://jmorgadodev.github.io/`, que es el dominio que sirve GitHub Pages.
2. **`404.html` solo se sirve como respuesta 404 real en GitHub Pages** (y hosts equivalentes que lo reconocen, como Netlify). Con `python -m http.server` la ruta inexistente devuelve 404 pero con la página genérica del servidor. Pasos de verificación: al desplegar, `GET https://jmorgadodev.github.io/cualquier-ruta` debe responder HTTP 404 y devolver `404.html`.
3. **Imágenes `og:image`**: si el sitio se mueve a otro dominio, `assets/social-preview.png` debe seguir siendo pública y su URL debe actualizarse junto con `SITE_URL`.
4. **`sitemap.xml` y `robots.txt` se regeneran en cada build**; si el sitio cambia de dominio, basta con cambiar `SITE_URL`.

## 9. Resultado de las comprobaciones

| Comprobación | Resultado |
| --- | --- |
| `JM.` desde la portada | OK — lleva a `#explorar`, sin recargar |
| `JM.` desde páginas interiores | OK — lleva a `/#explorar` |
| Escenas al regresar | OK — funcionan en ambos sentidos |
| ScrollTrigger persistente | OK — 25/25 recorridos de navegación |
| Funcionalidad del sitio | OK — 41/41 |
| Preparación para publicación | OK — 5/5 |
| 404 | OK — página propia, header y footer compartidos |
| Metadatos y OG | OK — 23 páginas públicas con todos los campos |
| Alt texts | OK — revisadas todas las rutas |
| Diagramas con `<desc>` | OK — ya no dependen del movimiento |
| Móvil | OK — sin desbordamientos, menú operativo |
| `python build_site.py` / `qa_smoke.py` / `node --check` | OK / OK 5 viewports, 26 rutas, juego, catálogo / OK |

Comprobador específico de navegación: `C:\Users\jorge\AppData\Local\Temp\jm_fase2.py`. Comprobador funcional: `jm_fase3.py`. Imágenes: `jm_alt.py`. Títulos/descripciones: `jm_fase23.py`.

## 10. Pendientes reales

1. **Aprobación visual de Jorge y commit** de este cierre (corrección de ScrollTrigger + ajustes de publicación).
2. El panel del sitio aún no tiene alternativa textual del recorrido para lectores de pantalla (el diagrama es accesible como imagen con `role="img"` y `<desc>`, pero el orden solo existe en el movimiento).
3. Los seis diagramas distintos de ImpulsaCV conservan las etiquetas técnicas que documentó cada proyecto.
4. `assets/site-particles.js` y `videos/*.webm` siguen sin seguimiento y fuera del sitio: pertenecen a otro frente.
5. Los textos de algunos artefactos de Archify conservan la palabra «Recorrido» en el título (coherencia idiomática del generador); no se modificaron las composiciones aprobadas.

## 11. URL local

```
http://127.0.0.1:8765/
```

Servidor estático en la raíz del proyecto:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

---

## 12. Nota para quien continúe

- `robots.txt` y `sitemap.xml` se regeneran en cada `python build_site.py`. Si se añaden o quitan páginas públicas, no los toques a mano: cambia `PUBLICAS` en `build_site.py`.
- El puerto de publicación es GitHub Pages. Cualquier configuración de despliegue va fuera de este repositorio.
- La descripción textual de los diagramas vive en el `<desc>` del artefacto y se genera desde los datos del propio artefacto.
