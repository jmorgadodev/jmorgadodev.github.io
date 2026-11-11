# kokeAI — informe de investigación

> Fase de investigación y preparación. No implementa la ficha.

## 1. Ficha de identidad

| Dato | Valor | Estado |
|---|---|---|
| Nombre público | kokeAI (KOOOKE.AI) | aprobado en el sitio |
| Categoría JMorgado | Automatización y contenido · Portal multimedia | aprobado |
| URL pública | https://kokeai.web.app/ | verificado (`docs_kokeai.md:10`, `firebase.json`) |
| Repositorio | sin remote configurado | verificado |
| Revisión auditada | `40986da17efc82da651fba537e4928db3b59c02b` (rama `master`, 2026-04-08) | verificado |
| Ruta local auditada | `C:\Users\jorge\Proyectos\koooke.ai` | sólo lectura |
| Fecha de revisión | 2026-11-10 | — |

> Working tree con cambios locales (`database.rules.json`, `docs_kokeai.md`, `public/index.html`) y un archivo eliminado. Registrado, no modificado.

## 2. Qué problema resuelve

UnStudio creativo acumula piezas repartidas entre carpetas de Drive (cómics, sesiones de música) y un archivo de audio que un navegador no puede reproducir directamente por CORS. El portal resuelve tres cosas a la vez: **organizar el material en un catálogo**, **publicarlo de forma navegable** y **entregar el audio** sin romper el navegador.

## 3. Qué se desarrolló realmente

1. **Catálogo generado automáticamente desde Drive.** Un Apps Script recorre las carpetas de cómics y de sesiones, arma el catálogo y lo publica en la RTDB con `UrlFetchApp` (`apps_script_firebase.js:1-45`). El disparador es un activador temporal configurable por el usuario (`apps_script_firebase.js:7-11`).
2. **Portal estático que consume la base.** `public/index.html` define `API_URL` contra `data.json`, hace `fetch` al cargar y vuelve a pedirlo con una marca de tiempo para refrescar (`public/index.html:1599`, `public/index.html:1760-1779`).
3. **Experiencia de lectura de cómics.** Orden alfabético, portada dinámica y lector con zoom, navegación por páginas y **persistencia de la última página en `localStorage`** (`docs_kokeai.md:23-28`, `public/index.html:1515-1519`).
4. **Secciones de audio.** Reproductor con marquesina, categorías plegables y estados de shuffle/repeat (`docs_kokeai.md:30-35`).
5. **Worker de audio en Cloudflare.** `worker/index.js` es un proxy de archivos de Drive con cabeceras CORS y orígenes permitidos, para que `<audio>` funcione desde el hosting (`worker/index.js:1-35`).
6. **Clasificación local de música.** `clasificar_musica.py` ordena archivos por estilos con palabras clave; `clasificar_musica_ia.py` aplica un diccionario de reglas específico del catálogo (`clasificar_musica.py:7-14`, `clasificar_musica_ia.py:6-30`).
7. **Hosting en Firebase con reescrituras y caché.** `firebase.json` define `public/` como raíz, reescribe todas las rutas a `index.html` y fija caché para recursos estáticos (`firebase.json:1-30`).
8. **Reglas de base compartidas con Hangar354.** La RTDB `kokeai-default-rtdb` es la misma que usa el proyecto de torneos, y sus reglas se administran desde el otro repositorio (`docs_kokeai.md:43`).

## 4. Funcionalidades principales

| # | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| 1 | Catálogo automático desde Drive hacia Firebase | `apps_script_firebase.js:14-45` | verificado |
| 2 | Portal con carga y refresco del catálogo | `public/index.html:1599`, `public/index.html:1769-1779` | verificado |
| 3 | Lector de cómics con zoom y página recordada | `docs_kokeai.md:23-28`, `public/index.html:1515-1519` | verificado |
| 4 | Reproductor de sesiones de estudio | `docs_kokeai.md:30-35` | verificado |
| 5 | Audio servido a través de un Worker con CORS | `worker/index.js:1-35` | verificado |
| 6 | Orden local de la biblioteca musical por estilo | `clasificar_musica.py:7-14`, `clasificar_musica_ia.py:6-30` | verificado |

## 5. Arquitectura y flujo

```
Google Drive
  ├─ Cómics ─┐
  └─ Sesiones ┘
        │
        ▼
Apps Script (activador nocturno) ── PUT ──► Firebase RTDB  /data.json
                                                   │
                                                   ▼
                                        Portal (Firebase Hosting)
                                                   │
                                                   └──► Worker de audio ──► Drive (CORS)
```

El portal no habla con Drive directamente para el audio: el Worker resuelve el problema de CORS.

## 6. Tecnologías verificadas

HTML5, CSS3 y JavaScript vanilla · Firebase Hosting (`firebase.json`) · Firebase Realtime Database v9 · Google Apps Script (`apps_script_firebase.js`) · Google Drive como almacén de medios · Cloudflare Worker (`worker/index.js`) · Python 3 con Tkinter para la clasificación local (`clasificar_musica.py`).

## 7. Mi participación

**Afirmable:** el repositorio incluye la documentación técnica del portal, el exportador de Apps Script, el Worker de audio, los clasificadores en Python y la configuración de hosting; el conjunto es un trabajo propio y no una plantilla genérica.

**No afirmable:** autoría individual por archivo (sin remote ni coautores) y métricas de uso o alcance de las colecciones.

## 8. Capacidades que merece la pena mostrar

1. **Catálogo que se arma solo:** la estructura de carpetas de Drive es la fuente; el catálogo se publica cada noche (`apps_script_firebase.js:7-45`).
2. **Experiencia de lectura cuidada:** zoom, salto de página y continuación donde quedó (`docs_kokeai.md:26-28`).
3. **Audio resuelto:** un Worker pequeño con CORS permite reproducir desde Drive sin cambiar de hosting (`worker/index.js:1-35`).

## 9. Propuesta de ficha JMorgado

- **Título editorial:** «kokeAI» + acento coral. Bajada: «Un portal creativo alimentado por las carpetas que ya existen en Drive».
- **Descripción breve:** mantener la aprobada.
- **Desafío:** ordenar contenido creativo disperso y ofrecerlo de forma navegable, incluido el audio.
- **Solución:** portal estático en Firebase que consume un catálogo publicado automáticamente por Apps Script desde Drive, con lector de cómics, reproductor de sesiones y un Worker dedicado al audio.
- **Funcionalidades destacadas:** catálogo automático · lector con continuidad de página · audio vía Worker · clasificación local de la biblioteca.
- **Participación:** «Desarrollé el frontend, la automatización de metadatos y el servicio de audio».
- **Tecnologías:** HTML/CSS/JavaScript · Firebase · Apps Script · Google Drive · Cloudflare Worker · Python.
- **Demostraciones posibles:** diagrama de arquitectura del flujo de contenido; captura del portal; captura del lector.
- **Estructura sugerida de módulos `fx-*`:**
  - `hero` — sí, con chip «Ver sitio».
  - `desafio` — sí.
  - `perspectivas` — **sí, un solo diagrama `architecture`** del recorrido Drive → Apps Script → RTDB → Portal → Worker.
  - `plataforma` — sí (Organización / Automatización / Portal).
  - `participacion` — sí (Frontend / Automatización / Servicio de audio).
  - `tech` — sí.
  - `repo` — no.
  - `metrics` — no: la documentación menciona «88 temas» como referencia interna del clasificador (`clasificar_musica_ia.py:6`); no es una métrica de producto y no debe usarse como tal.
  - `galeria` — sí, con capturas del portal (verificar derechos de las piezas).
  - `cierre` + `contacto` — sí, CTA único a `/contacto/`.
- **Qué omitir:** identificadores de carpetas de Drive, claves de configuración de Firebase y el identificador de la base de datos compartida con Hangar354. La ficha no debe insinuar que el portal y el proyecto RRSS son el mismo sistema: son piezas distintas de una misma operación.

## 10. Diagrama Archify recomendado

**Tipo: `architecture`** (6 nodos). Justificación: el proyecto es una cadena de cuatro piezas (Drive, Apps Script, base, portal) más un servicio auxiliar; el diagrama muestra en un vistazo lo que cuesta explicar en texto: que el contenido no «se sube» a una web, se publica desde la carpeta.

Nodos propuestos:

| id | etiqueta | tipo | evidencia |
|---|---|---|---|
| `drive` | Google Drive (material) | external | `apps_script_firebase.js:14-16` |
| `script` | Apps Script (activador) | backend | `apps_script_firebase.js:7-11`, `apps_script_firebase.js:22-45` |
| `rtdb` | Firebase RTDB `/data` | database | `apps_script_firebase.js:18-19`, `public/index.html:1599` |
| `portal` | Portal (Firebase Hosting) | frontend | `public/index.html:1760-1779`, `firebase.json:1-30` |
| `worker` | Worker de audio | backend | `worker/index.js:1-35` |
| `audio` | Archivo de audio en Drive | external | `worker/index.js:4-8` |

Conexiones: `drive→script` (lectura de carpetas), `script→rtdb` (PUT del catálogo), `rtdb→portal` (lectura del catálogo), `portal→worker` (solicitud de audio), `worker→audio` (proxy con CORS). Tarjetas: «El material no se copia», «Automatización nocturna», «Audio sin bloqueos».

**Segundo diagrama:** no recomendado.

## 11. Información pendiente de confirmar

- Derechos y licencias del material publicado (cómics y sesiones): requisito para mostrar capturas en el portafolio.
- Estado actual del portal y del activador de Apps Script.
- Confirmar si el proyecto sigue vivo en el mismo hosting.
- Volumen real del catálogo (la documentación menciona 88 temas en un comentario interno; no es una cifra verificable de uso).

## 12. Fuentes consultadas

`docs_kokeai.md` · `apps_script_firebase.js` · `worker/index.js` · `firebase.json` · `database.rules.json` · `kokeai_config.json` (sólo estructura; la clave de API es pública por diseño en Firebase y no se reproduce) · `public/index.html` (segmentos 1387-1450, 1515-1520, 1599-1631, 1760-1800) · `clasificar_musica.py` · `clasificar_musica_ia.py` · `proxy.js` · `.firebaserc`.
