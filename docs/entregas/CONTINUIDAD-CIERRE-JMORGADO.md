# Continuidad — Cierre definitivo de JMorgado

**Fecha:** 12 de noviembre de 2026
**Estado:** PUBLICADO en producción. Todos los cambios aprobados están en `main`.
**Alcance:** respaldo, identidad gráfica, dominio canónico, publicación y verificación en producción.

---

## 1. Estado final del proyecto

JMorgado está publicado y funcionando en **https://jmorgado.pages.dev/**. La landing, las cuatro escenas, los diagramas, la calculadora, Tetris y las páginas interiores están operativos. La experiencia continúa entre visitas y el botón `JM.` lleva a «¿Qué te gustaría mejorar?».

## 2. Rama y commit publicados

| Elemento | Valor |
| --- | --- |
| Rama | `main` |
| Commit | `98942c1` — *release: jmorgado version final preparada para produccion* |
| Respaldo | `backup/jmorgado-version-final-publicada` → `98942c1` |
| Rama de trabajo | `work/cierre-funcional-jmorgado` |
| Push a `origin/main` | completado; es fast-forward desde `7f617a8` |

## 3. Dominio canónico y alojamiento

- **Dominio canónico:** `https://jmorgado.pages.dev/`
- **Alojamiento:** Cloudflare Pages (proyecto `jmorgado`, conectado al repositorio `jmorgadodev/jmorgadodev.github.io`).
- **GitHub:** repositorio privado de código en `https://github.com/jmorgadodev/jmorgadodev.github.io`; rama `main` produce automáticamente en cada push.
- **GitHub Pages** (`https://jmorgadodev.github.io/`): sigue activa pero ya no es canónica; sirve la misma versión hasta retirarse.

## 4. Identidad gráfica

| Recurso | Origen | Ruta pública |
| --- | --- | --- |
| Logotipo `JM.` | `Herramientas/JMorgado_Logo_Favicon_Web/assets/` | `assets/favicon.svg` |
| Favicon vectorial + ICO | mismo paquete | `assets/favicon.svg` + `assets/favicon.ico` |
| Iconos PNG (16/32/48) | mismo paquete | `assets/favicon-{16,32,48}x48.png` |
| Apple touch icon | mismo paquete | `assets/apple-touch-icon.png` |
| Iconos Android/Chrome | mismo paquete | `assets/android-chrome-{192,512}x{192,512}.png` |
| Manifiesto PWA | mismo paquete | `assets/site.webmanifest` |
| Preview Open Graph | mismo paquete | `assets/social-preview.png` |

La cabecera conserva el tratamiento editorial aprobado (`JM.` en texto coral); no se sustituyó por imagen.

## 5. Archivos modificados y creados en esta ronda

**Generadores y scripts:**

- `build_site.py` — dominio canónico `jmorgado.pages.dev`, juego completo de iconos, función `sitemap()` que genera `robots.txt` y `sitemap.xml` desde rutas públicas
- `publish_site.py` — dominio actualizado
- `qa_smoke.py` — dominio actualizado en comprobación canónica
- `crear_entrega.py` — dominio en documentación

**Identidad y marca:**

- `assets/favicon.svg` (reemplazado por estrella JM.) · `assets/favicon.ico` · `assets/favicon-{16,32,48}x{16,32,48}.png` · `assets/apple-touch-icon.png` · `assets/android-chrome-{192,512}x{192,512}.png` · `assets/site.webmanifest` · `assets/social-preview.png`

**HTML regenerado:** index, 404, calculadora, contacto, herramientas, jugar, metodo, proyectos/* (11 páginas), servicios/* (7 páginas)

**Nuevos:** `robots.txt` (User-agent: * Allow: / Sitemap: https://jmorgado.pages.dev/sitemap.xml) · `sitemap.xml` (24 URLs públicas indexables)

## 6. Producción replicable

```sh
python publish_site.py   # genera _site/
npx wrangler pages dev _site --port 8788
```

`_site/` contiene HTML, CSS, JS, iconos, sitemap, robots y `.nojekyll`. Los archivos internos (`Herramientas/`, `REVISION-*/`, `docs/entregas/`, `.md`, `qa_*`) no están en la salida pública.

## 7. Comprobaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| Push fast-forward a `origin/main` | OK |
| `https://jmorgado.pages.dev/` | HTTP 200, título correcto |
| `robots.txt` y `sitemap.xml` | HTTP 200; 24 URLs públicas indexables |
| `og:image` absoluta | Cargando; canonical y `og:url` coherentes con `jmorgado.pages.dev` |
| `assets/social-preview.png` | HTTP 200, 187557 bytes |
| 404 propio | HTTP 404 en ruta inexistente; header/fооter compartidos |
| Favicon en portada e interiores | OK; 7 referencias en HTML válidas |
| `JM.` y navegación interior | OK; sin errores JS |
| `python qa_smoke.py` | OK en 5 viewports, 26 rutas, JS deshabilitado y movimiento reducido |

## 8. Pendientes reales

1. GitHub Pages puede retirarse cuando se confirme que todo el tráfico proviene de Cloudflare Pages.
2. El dominio `jmorgado.pages.dev` puede sustituirse en `SITE_URL` del generador si se mueve a un dominio propio.
3. El panel del sitio aún no tiene alternativa textual del recorrido para lectores de pantalla.

## 9. Google Search Console e indexación

| Elemento | Estado comprobado |
| --- | --- |
| Propiedad | `https://jmorgado.pages.dev/`, propiedad de prefijo URL; no existía antes de esta configuración |
| Verificación | Verificada con la etiqueta HTML de Google en el `<head>` de la portada. La etiqueta permanece en `build_site.py` y en el HTML generado |
| Sitemap | `https://jmorgado.pages.dev/sitemap.xml` enviado; Search Console confirmó que se recibió y que lo procesará periódicamente. Lectura y descubrimiento todavía pendientes |
| Robots | `https://jmorgado.pages.dev/robots.txt` permite el rastreo público y señala el sitemap canónico |
| URLs inspeccionadas | Portada, servicios, proyectos, herramientas y contacto. Google aún no reconoce ninguna; rastreo, sitemap de referencia y canonicals seleccionadas por Google aparecen como `N/D` mientras no las rastrea |
| Solicitudes de indexación | La solicitud para la portada fue rechazada por cuota diaria de Search Console. No quedó ninguna solicitud confirmada; reintentar cuando Google restablezca la cuota |
| Canonical / dominio anterior | Las páginas generadas declaran `https://jmorgado.pages.dev/`. GitHub Pages conserva el mismo contenido y el sitemap publicado en ambos hosts lista las mismas 24 URLs canónicas de Cloudflare |
| Git | `61857f4` añadió la etiqueta de verificación; `42b27ff` corrigió la inclusión de `herramientas/` para alinear ambos sitemaps. Ambos commits están en `origin/main` |

La cuota impidió probar la URL publicada e iniciar solicitudes de indexación. La propiedad está verificada y el sitemap fue recibido, pero eso no confirma que Google haya indexado páginas. Volver a revisar el estado después de que Google procese el sitemap y permita nuevas solicitudes.
