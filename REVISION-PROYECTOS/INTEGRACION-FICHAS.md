# Integración prevista con el sistema de fichas

> **Nada de esto está implementado.** Es el plan de integración, para que la construcción de las
> fichas sea rápida cuando se apruebe este paquete. No se modificó `ficha.py`, `assets/ficha.css`,
> `site_data.py` ni ninguna página del sitio.

## 1. Qué se reutiliza tal cual

| Pieza | Ubicación | Uso en las fichas nuevas |
|---|---|---|
| Motor de render `fx-*` | `ficha.py` | Se usa sin cambios: `render_ficha()` ya recorre módulos y omite los que no estén |
| Sistema visual | `assets/ficha.css` | Se usa sin cambios: hero, secciones, listas, puntos, cierre y contacto |
| Datos de proyecto | `site_data.py::PROJECTS` | Ya están cargados los 8 proyectos con su copy aprobado |
| Datos de ficha | `site_data.py::FICHAS` | Se añade una entrada por proyecto, con el patrón de `FICHAS["impulsacv"]` |
| Portal embebido | `assets/project-portal.js` | Se reutiliza para los proyectos con URL y páginas públicas (hoy: El Cambiómetro y ListoPorHoy) |
| Tema global | `assets/themes.css`, `assets/theme-init.js` | Intocables |
| QA | `qa_smoke.py`, `qa_tetris.cjs` | Se ejecutan tras cada cambio |

## 2. Qué hay que hacer una sola vez (antes de la primera ficha nueva)

1. **Extraer la lógica de diagramas de ImpulsaCV a un par genérico.**
   Hoy la sincronía de tema y la carga diferida viven en `assets/project-impulsacv.css` / `.js`.
   Propuesta: crear `assets/project-archify.css` y `assets/project-archify.js` con ese comportamiento
   (mismo origen, `data-jm-theme` → `data-theme`, carga diferida del segundo iframe, bloqueo de
   atajos dentro del iframe) y dejar los archivos de ImpulsaCV como caso particular.

2. **Añadir un módulo de diagrama simple al motor.**
   `ficha.py` tiene hoy `perspectivas` (dos iframes con tabs, exclusivo de ImpulsaCV). Siete de las
   ocho fichas llevan **un** diagrama. Propuesta: un módulo `diagrama` con un único iframe, con
   carga diferida y sincronía de tema heredadas del par genérico.

3. **Fijar la convención de nombres de los assets.**
   Propuesta: `assets/<slug>-archify-<tipo>.html`
   (por ejemplo `assets/el-cambiometro-archify-arquitectura.html`), con la misma edición que se hizo
   en ImpulsaCV: retirar los controles de presentación, presets y tema propio del HTML público.

## 3. Plan por proyecto

Cada línea indica el trabajo **previsto**, no realizado.

### 3.1 El Cambiómetro (`el-cambiometro`)

- Diagrama: `assets/el-cambiometro-archify-arquitectura.html` (copia del HTML de `diagramas/`).
- Módulos: `hero`, `desafio`, `perspectivas`→`diagrama`, `plataforma`, `participacion`, `tech`,
  `repo` (repositorio público AGPL), `metrics` (sólo con cifras fechadas del README), `cierre`,
  `contacto`.
- Excepciones: único proyecto con `PROJECT_PORTAL_PAGES` de dos páginas (Inicio y Fuentes y
  datos) — ya resuelto en `site_data.py`.
- Override propio: no debería hacer falta.

### 3.2 ListoPorHoy (`conecta`)

- Diagrama: `assets/listoporhoy-archify-arquitectura.html`.
- Módulos: `hero`, `desafio`, `diagrama`, `plataforma`, `participacion`, `tech`, `cierre`, `contacto`.
- Sin módulo `repo`: el repositorio es privado y el enlace no aporta nada al visitante.
- `PROJECT_PORTAL_PAGES` ya tiene la entrada de la landing.
- Decisión pendiente: si el slug de ruta se renombra de `conecta` a `listoporhoy` (afecta rutas
  públicas y enlaces existentes).

### 3.3 Ryvolt (`ryvolt`)

- Sin diagrama y sin asset.
- Módulos: `hero`, `desafio`, `plataforma`, `participacion`, `tech`, `galeria`, `cierre`, `contacto`.
- `galeria` es el módulo que aporta: capturas de los dos registros visuales (Corporate / Rebel) y
  del menú orbital, en modo día y noche.

### 3.4 Flor de Almendro (`flor-de-almendro`)

- Diagrama: `assets/flor-de-almendro-archify-flujo.html`.
- Módulos: `hero`, `desafio`, `diagrama`, `plataforma`, `participacion`, `tech`, `galeria` (opcional),
  `cierre`, `contacto`.
- Consideración: las capturas deben usar datos ficticios (el repositorio contiene datos reales del
  cliente).

### 3.5 Exo Dream (`exo-dream`)

- Diagrama: `assets/exo-dream-archify-arquitectura.html`.
- Módulos: `hero` **sin chip de sitio** (la URL no está confirmada), `desafio`, `diagrama`,
  `plataforma`, `participacion`, `tech`, `galeria`, `cierre`, `contacto`.
- Bloqueante antes de publicar: URL de producción, derechos de logos e imágenes, estado actual del
  proyecto.

### 3.6 Hangar354 (`tobys-warehouse`)

- Diagrama: `assets/hangar354-archify-arquitectura.html`.
- Módulos: `hero`, `desafio`, `diagrama`, `plataforma`, `participacion`, `tech`, `cierre`, `contacto`.
- Sin `metrics`: los datos son de torneos de prueba, no métricas de producto.
- Antes de publicar: confirmar el nombre público (Hangar354 vs Toby's Warehouse) y rotar las
  credenciales de administrador que están en el repositorio.

### 3.7 kokeAI (`kooke-portal`)

- Diagrama: `assets/kokeai-archify-arquitectura.html`.
- Módulos: `hero`, `desafio`, `diagrama`, `plataforma`, `participacion`, `tech`, `galeria`, `cierre`,
  `contacto`.
- Antes de publicar: derechos de las piezas otakus/ audio mostradas en capturas.

### 3.8 RRSS (`kooke-rrss`)

- Diagrama: `assets/rrss-archify-recorrido.html`.
- Módulos: `hero` **sin chip de sitio** (no hay URL de producto), `desafio`, `diagrama`, `plataforma`,
  `participacion`, `tech`, `cierre`, `contacto`.
- Antes de publicar: decidir si se afirma que el automatismo está activo hoy (la evidencia no lo
  confirma) y rotar el token de Meta embebido en el código.

## 4. Módulos que se omiten en la mayoría de las fichas

| Módulo | Cuándo se usa | Cuándo se omite |
|---|---|---|
| `perspectivas` | Sólo ImpulsaCV (dos diagramas con tabs) | En todas las demás: usar `diagrama` |
| `diagrama` | 7 de 8 fichas | Ryvolt |
| `metrics` | Sólo El Cambiómetro, con cifras fechadas | En las demás: no hay cifras verificables |
| `repo` | Sólo El Cambiómetro (repositorio público) | Donde el repositorio es privado o no existe |
| `galeria` | Ryvolt, y donde haya capturas aprobadas | Donde no haya material visual aprobado |
| `plataforma`, `participacion`, `tech`, `cierre`, `contacto` | En todas | — |

## 5. Orden de construcción sugerido

1. **El Cambiómetro** (referencia de una ficha completa: diagrama + métricas + repo + portal).
   Construir aquí el módulo `diagrama` y el par genérico `project-archify.*`.
2. **ListoPorHoy** (diagrama + portal, sin repo).
3. **Hangar354** y **kokeAI** (diagrama, sin métricas).
4. **RRSS** y **Exo Dream** (diagrama, sin chip de sitio).
5. **Flor de Almendro** (diagrama simple, galería).
6. **Ryvolt** (sin diagrama: sirve para comprobar que el sistema funciona sin el módulo `diagrama`).

## 6. QA esperado en cada paso

```powershell
python build_site.py      # regenera las fichas
python qa_smoke.py
node qa_tetris.cjs
git diff --check
```

Más revisión visual en 320 / 390 / 768 / 1024 / 1440 / 1920 px, en modo día y noche, y comprobación
de que el diagrama carga dentro del iframe con el tema sincronizado.
