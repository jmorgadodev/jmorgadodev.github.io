# Ryvolt — informe de investigación

> Fase de investigación y preparación. No implementa la ficha.

## 1. Ficha de identidad

| Dato | Valor | Estado |
|---|---|---|
| Nombre público | Ryvolt | aprobado en el sitio |
| Categoría JMorgado | Experiencia web · Sitio corporativo | aprobado |
| URL pública | https://ryvolt.cl/ | declarada en `site_data.py` |
| Repositorio | sin remote configurado (copia local de entrega) | verificado |
| Revisión auditada | `4b52421f555eba6278d9ce877cb469b696b21aa8` (rama `production`, 2026-07-27) | verificado |
| Ruta local auditada | `C:\Users\jorge\Proyectos\Ryvolt\ryvolt-web` | sólo lectura |
| Material de marca | `C:\Users\jorge\Proyectos\Ryvolt\Entrega_Fuentes_Ryvolt` (manual + dos ambientes) | verificado |
| Fecha de revisión | 2026-11-10 | — |

## 2. Qué problema resuelve

Ryvolt es una consultora (Salesforce y transformación digital) que necesita explicar sus servicios a públicos distintos sin diluir su identidad: un cliente corporate espera claridad y seriedad; el perfil técnico espera una expresión con attitude. El sitio resuelve eso con una **doble experiencia** en la misma dirección: un registro corporativo sobrio y un registro «Rebel» de estética tecnológica, con transición animada entre ambos (`Documentacion_Tecnica_Ryvolt.md:1-4`, `src/App.jsx:33-45`).

## 3. Qué se desarrolló realmente

1. **Doble experiencia con estado global.** `App.jsx` mantiene `isRebelMode` y el idioma (`l`), y renderiza `CorporateExperience` o `RebelExperience` (`src/App.jsx:1-9`, `src/App.jsx:33-45`).
2. **Transición de marca.** `TransitionManager` inyecta ruido, glitch y distortions durante el cambio de modo (`Documentacion_Tecnica_Ryvolt.md:27-31`, `src/components/ui/TransitionManager.jsx`).
3. **Componente central `VoltSys`.** Menú orbital en SVG con trigonometría en escritorio y profundidad lineal con rotación 3D en móvil; los modales de servicio se montan con `createPortal` para no quedar atrapados en el apilamiento de animaciones (`Documentacion_Tecnica_Ryvolt.md:33-37`).
4. **Bilingüismo real.** Contenido y metadatos por idioma y modo: `SEO_CONTENT[mode][l]` actualiza `title`, `description`, `og:*`, `twitter:*` y `lang` en vivo (`src/App.jsx:10-31`). Hay pruebas que verifican la paridad entre modos e idiomas (`src/data/siteExperience.test.js:9-43`).
5. **Prerenderizado para SEO.** El build compila el servidor (`vite build --ssr src/entry-server.jsx`) y `scripts/prerender.mjs` inyecta el HTML renderizado en `dist/index.html` antes de eliminar el bundle de servidor (`scripts/prerender.mjs:1-21`, `package.json` scripts).
6. **Verificación de SEO en el pipeline.** `npm run verify:seo` ejecuta `scripts/verify-prerender.mjs` después del build (`package.json`).
7. **Formulario de contacto con dos salidas.** El formulario Rebel valida nombre, teléfono, correo y motivo, registra el evento, envía al endpoint de Google Apps Script y ofrece un fallback a WhatsApp (`src/components/sections/Contact.jsx:13-46`, `README.md:36-40`).
8. **Analítica.** `trackEvent`, `trackPageView` y `trackSectionView` sobre `gtag` (`src/utils/analytics.js:1-26`).
9. **Adaptación a equipos modestos.** `usePerformance` detecta móvil con ≤4 GB de RAM o ≤4 núcleos, y también ahorro de datos o red 2G, para desactivar partículas, blur y rotaciones 3D (`src/utils/performance.js:3-25`).
10. **Calculadora de ROI.** `ROICalculator` traduce un indicador de «fricción» en horas recuperadas y sincroniza el valor con el menú orbital mediante un evento de ventana (`src/components/ROICalculator.jsx:3-20`).
11. **Verificación de calidad.** `npm run lint`, `npm test` (tests de `src/data/*.test.js`) y `npm run build` (`README.md:14-22`).

> Nota de documentación: `Documentacion_Tecnica_Ryvolt.md:42` menciona `usePerformance.js`; el archivo real es `src/utils/performance.js`. Deriva menor del documento, no del código.

## 4. Funcionalidades principales

| # | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| 1 | Dos experiencias visuales con transición animada | `src/App.jsx:33-45`, `ui/TransitionManager.jsx` | verificado |
| 2 | Bilingüismo es/en con metadatos por modo | `src/App.jsx:10-31` | verificado |
| 3 | Menú orbital de servicios y profundidad 3D en móvil | `Documentacion_Tecnica_Ryvolt.md:33-37` | verificado |
| 4 | Prerenderizado + verificación de SEO en el build | `scripts/prerender.mjs:1-21`, `package.json` | verificado |
| 5 | Formulario con Apps Script y fallback a WhatsApp | `src/components/sections/Contact.jsx:13-46` | verificado |
| 6 | Analítica de eventos, páginas y secciones | `src/utils/analytics.js:1-26` | verificado |

## 5. Arquitectura y flujo

```
Estático (Vite + React 19 + Tailwind 4)
   ├─ build cliente (vite build)
   ├─ build SSR (entry-server.jsx)
   ├─ prerender.mjs → dist/index.html con contenido real
   └─ verify-prerender.mjs (gate de SEO)
          │
          ▼
   Cloudflare Pages (dist)
          │
          ├─ Formulario → Google Apps Script → Sheets
          ├─ Analítica → GA4 (gtag)
          └─ Contacto alternativo → WhatsApp
```

## 6. Tecnologías verificadas

React 19.2.4 · Vite 8.0.1 (ESM) · Tailwind CSS 4.2.2 · Framer Motion 12.38.0 · Lucide React · `localStorage` para preferencias de modo · Google Apps Script (formularios) · WhatsApp · Google Analytics 4 (`Documentacion_Tecnica_Ryvolt.md:6-16`, `package.json`).

## 7. Mi participación

**Afirmable:** la carpeta local `Ryvolt/ryvolt-web` es la entrega del proyecto (incluye `ENTREGA_CLIENTE.md` y el manual de marca) y el historial de commits es continuo bajo la cuenta de Jorge.

**No afirmable:** autoría individual por módulo (sin coautores registrados) y el estado actual del sitio en producción, que no se verificó en esta tarea.

## 8. Capacidades que merece la pena mostrar

1. **Dos registros, una sola dirección:** el mismo contenido de servicios presentado con dos códigos visuales y transición propia.
2. **Bilingüismo de verdad:** contenido, navegación y metadatos cambian por idioma y por modo (`src/App.jsx:10-31`).
3. **Cuidado del detalle técnico:** prerenderizado con verificación, ajuste automático a equipos modestos y menú orbital en SVG.

## 9. Propuesta de ficha JMorgado

- **Título editorial:** «Ryvolt» + acento coral. Bajada: «Una web corporativa con dos registros visuales y una base preparada para buscadores».
- **Descripción breve:** mantener la aprobada.
- **Desafío:** explicar servicios de consultoría a públicos distintos sin perder una identidad reconocible.
- **Solución:** frontend responsive y bilingüe con experiencias Corporate/Rebel, componentes interactivos propios, formularios con salida doble y prerenderizado con verificación de SEO.
- **Funcionalidades destacadas:** doble experiencia con transición · bilingüismo completo · prerenderizado y SEO verificado · formulario con Apps Script y WhatsApp.
- **Participación:** «Implementé el frontend bilingüe, las interacciones y el prerenderizado».
- **Tecnologías:** React · Vite · Tailwind · Framer Motion · SEO técnico · Apps Script.
- **Demostraciones posibles:** none (ficha sin portal embebido); alternativa: un GIF o capturas de la transición entre modos, o el propio sitio abierto en pestaña.
- **Estructura sugerida de módulos `fx-*`:**
  - `hero` — sí, con chip «Ver sitio».
  - `desafio` — sí.
  - `perspectivas` — **no**: sin diagrama (ver sección 10). No dejar la sección vacía.
  - `plataforma` — sí, con tres ideas (doble experiencia / bilingüismo / prerenderizado y SEO).
  - `participacion` — sí (Frontend / Interacción / SEO y entrega).
  - `tech` — sí.
  - `repo` — no: no hay repositorio público.
  - `metrics` — no: no hay cifras verificables de tráfico o conversión.
  - `galeria` — **sí, es el módulo que más aporta aquí**: capturas de los dos registros y del menú orbital, en vez de un diagrama técnico.
  - `cierre` + `contacto` — sí, CTA único a `/contacto/`.
- **Qué omitir:** el detalle de la lógica interna de `VoltSys` (interesa el resultado, no la trigonometría) y cualquier afirmación sobre el estado actual del sitio en producción.

## 10. Recomendación Archify

**Sin diagrama Archify**, y esta es una decisión argumentada, no una omisión:

- El proyecto es una experiencia visual, no una arquitectura con servicios intercambiables. Un `architecture` con «React», «Tailwind», «Apps Script» y «GA4» no le dice nada a un visitante que no es técnico.
- La información con valor —el menú orbital, la transición, el bilingüismo, el prerenderizado— se comunica mejor con **capturas y texto**.
- Se cumple el criterio del encargo: el diagrama debe ayudar al visitante a comprender el proyecto, y aquí el recurso adecuado es la galería.

Si más adelante se quisiera un diagrama, el único con sentido es un `workflow` de la entrega (contenido → build cliente + SSR → prerender → verificación → Pages → formulario → Apps Script), pero su valor es de portafolio técnico, no de comprensión del producto. **Queda como opción, no como recomendación.**

## 11. Información pendiente de confirmar

- Estado actual del sitio en producción (no verificado en esta tarea).
- Existencia de capturas aprobadas reutilizables.
- Si existe material de case study del cliente (casos, cifras) que permita un bloque `metrics`.
- Confirmación del nombre comercial actual de la marca.

## 12. Fuentes consultadas

`README.md` · `ENTREGA_CLIENTE.md` · `Documentacion_Tecnica_Ryvolt.md` · `package.json` · `scripts/prerender.mjs` · `src/App.jsx` · `src/components/layout/*` · `src/components/ui/TransitionManager.jsx` · `src/components/sections/Contact.jsx` · `src/components/ROICalculator.jsx` · `src/data/*.js` y `*.test.js` · `src/utils/analytics.js` · `src/utils/performance.js` · `docs/seo_audit_report.md` (índice) · carpeta `Entrega_Fuentes_Ryvolt` (manual de marca y ambientes).
