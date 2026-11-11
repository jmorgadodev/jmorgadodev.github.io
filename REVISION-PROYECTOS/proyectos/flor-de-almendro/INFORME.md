# Flor de Almendro — informe de investigación

> Fase de investigación y preparación. No implementa la ficha.

## 1. Ficha de identidad

| Dato | Valor | Estado |
|---|---|---|
| Nombre público | Flor de Almendro | aprobado en el sitio |
| Categoría JMorgado | Experiencia web · Catálogo comercial | aprobado |
| URL pública | https://flordealmendro.cl/ | declarada en `site_data.py` |
| Repositorio | sin remote (resguardo local) | verificado |
| Revisión auditada | `de2a2b14e5b551e64017a8f0ab6088e28e1f0b2b` (rama `master`, 2026-04-08) | verificado |
| Ruta local auditada | `C:\Users\jorge\Proyectos\Flor de almendro` | sólo lectura |
| Documentación de cliente | `MANUAL_SISTEMA_CLIENTE.md`, `Manual Flor de almendro.pdf` | verificado |
| Fecha de revisión | 2026-11-10 | — |

> El working tree tiene un archivo borrado (`flordealmendro_backup.zip`). Se registra, no se modifica.

## 2. Qué problema resuelve

Una joyería pequeña administra su catálogo en una planilla y sus fotos en Drive. Publicar eso en web, sin obligar al negocio a aprender un panel de administración, es el problema real: la planilla es el «cerebro» y el sitio es la vitrina.

El manual del cliente lo dice sin rodeos: «tu Excel central es el cerebro de la web. Cada fila nueva que agregues ahí, aparecerá sola como una joya en vivo en internet» (`MANUAL_SISTEMA_CLIENTE.md:7-11`).

## 3. Qué se desarrolló realmente

1. **Lectura del catálogo desde Google Sheets por CSV.** `Papa.parse(GOOGLE_SHEETS_CSV_URL, { download: true, header: true })` en el montaje, con filtrado de filas sin nombre y estados de carga y error (`src/App.jsx:218-252`). La URL export CSV de la planilla está en `src/App.jsx:6`.
2. **Normalización mínima y explícita.** Columnas documentadas: `nombre`, `descripcion`, `precio`, `categoria`, `stock`, `etiqueta`, `descuento`, `url_imagen`…`url_imagen_5`, `url_video` (`MANUAL_SISTEMA_CLIENTE.md:13-30`).
3. **Categorías derivadas del propio dato.** El set de categorías se arma con `new Set(productos.map(p => p.categoria))` y se antepone «Todos» (`src/App.jsx:343-344`).
4. **Galería por producto con hasta cinco imágenes y video.** Se recorren las columnas `url_imagen`…`url_imagen_5`, se detecta `url_video` y se mezclan en un carrusel con swipe en móvil (`src/App.jsx:15-26`, `src/App.jsx:62-66`).
5. **Optimización de medios en Drive.** Las URLs de Drive se convierten a miniatura `sz=w800` y los videos cambian a la ruta `/preview` (`src/App.jsx:254-269`).
6. **Stock como estado de interfaz.** `stock === '0'` (o «no») marca la joya como agotada, muestra el letrero y desactiva la compra (`src/App.jsx:546`, `src/App.jsx:593-605`).
7. **Contacto por WhatsApp con mensaje compuesto.** El mensaje incluye nombre y precio del producto; si está agotado, offers un mensaje de consulta de reposición (`src/App.jsx:278-299`, `src/App.jsx:593-599`).
8. **Búsqueda y filtros.** Estado de búsqueda y de vista activa sobre el catálogo cargado (`src/App.jsx:194-205`).
9. **Modo día/noche propio.** El sitio arranca en oscuro y conmuta entre lienzos nocturnos y diurnos (`src/App.jsx:199`, `MANUAL_SISTEMA_CLIENTE.md:47`).
10. **Despliegue en Firebase Hosting con cabeceras de seguridad.** `firebase.json` define `dist` como carpeta pública y añade `X-Frame-Options`, `X-Content-Type-Options` y `X-XSS-Protection` (`firebase.json:1-25`).
11. **Guía de operación para la dueña del negocio.** Manual con instrucciones paso a paso, el requisito de compartir las imágenes de Drive y notas de soporte (`MANUAL_SISTEMA_CLIENTE.md`).

## 4. Funcionalidades principales

| # | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| 1 | Catálogo vivo desde Google Sheets | `src/App.jsx:218-252` | verificado |
| 2 | Categorías, búsqueda y filtros | `src/App.jsx:343-344`, `src/App.jsx:194-205` | verificado |
| 3 | Galería con hasta cinco fotos y video por joya | `src/App.jsx:15-26` | verificado |
| 4 | Estado de stock, precio tachado y etiquetas | `src/App.jsx:143-145`, `src/App.jsx:546` | verificado |
| 5 | Contacto por WhatsApp con mensaje armado | `src/App.jsx:278-299` | verificado |
| 6 | Modo día/noche y experiencia móvil (swipe, zoom) | `src/App.jsx:199`, `MANUAL_SISTEMA_CLIENTE.md:47-52` | verificado |

## 5. Arquitectura y flujo

```
Google Sheets (edición del negocio)
   └─ export CSV  ──►  sitio (PapaParse, header: true)
                            ├─ normalización mínima y categorías
                            ├─ galería (Drive: thumbnail sz=w800 · /preview)
                            └─ estado de stock ──► botón de WhatsApp con nombre y precio

Firebase Hosting (dist) + cabeceras de seguridad
```

No hay base de datos ni backend: la fuente de verdad es la planilla y el sitio la lee. Es una decisión de diseño, no una limitación: el negocio no aprende una herramienta nueva.

## 6. Tecnologías verificadas

React 18.2 · Vite 5 · Tailwind CSS 3.4 · PapaParse 5.4 (lectura CSV) · Firebase Hosting 10 (`package.json`) · Google Sheets (export CSV) · Google Drive (miniatura y preview de video) · WhatsApp (`src/App.jsx:294-299`).

## 7. Mi participación

**Afirmable:** la carpeta local es el resguardo del proyecto (`Resguardo inicial del código`), con manual de operación para el cliente y despliegue configurado (`firebase.json`, `deploy_output*.txt`).

**No afirmable:** autoría individual por archivo y cualquier cifra de ventas, visitas o conversión (no hay datos ni instrumentación de analítica en el repositorio).

## 8. Capacidades que merece la pena mostrar

1. **Edición en herramientas conocidas:** la planilla del negocio es el panel de administración, sin panel propio.
2. **Catálogo con estado real:** stock, precio anterior tachado y etiquetas salen del mismo dato.
3. **Contacto que conserva el contexto:** el mensaje a WhatsApp ya lleva el nombre y el precio de la joya.

## 9. Propuesta de ficha JMorgado

- **Título editorial:** «Flor de Almendro» + acento coral. Bajada: «Un catálogo que se actualiza desde la planilla que el negocio ya usa».
- **Descripción breve:** mantener la aprobada.
- **Desafío:** publicar y mantener un catálogo sin imponer un sistema de gestión nuevo.
- **Solución:** frontend de catálogo con categorías, filtros, stock y contacto por WhatsApp; Google Sheets como fuente de productos y Drive como almacén de imágenes y video.
- **Funcionalidades destacadas:** catálogo vivo desde Sheets · galería con video y zoom · estado de stock · contacto por WhatsApp.
- **Participación:** «Desarrollé el catálogo e integré sus fuentes de productos e imágenes».
- **Tecnologías:** React · Vite · Google Sheets · Google Drive · WhatsApp · Firebase Hosting.
- **Demostraciones posibles:** diagrama de flujo de datos del catálogo; captura de la ficha de producto; captura de la vista de agotado.
- **Estructura sugerida de módulos `fx-*`:**
  - `hero` — sí, con chip «Ver sitio».
  - `desafio` — sí.
  - `perspectivas` — **sí, un solo diagrama `dataflow`**: el flujo Sheets → normalización → catálogo → WhatsApp es el corazón del proyecto y se explica mejor en un diagrama que en un párrafo.
  - `plataforma` — sí, tres pasos (edición en Sheets / carga y normalización / catálogo y consulta).
  - `participacion` — sí (Catálogo / Integración / Experiencia).
  - `tech` — sí.
  - `repo` — no.
  - `metrics` — no: sin cifras verificables.
  - `galeria` — sí, si hay capturas aprobadas del catálogo.
  - `cierre` + `contacto` — sí, CTA único a `/contacto/`.
- **Qué omitir:** el detalle de la interfaz (modales, splash, zoom) y cualquier dato del negocio (nombres de clientas, precios reales). En capturas se deben usar datos ficticios.

## 10. Diagrama Archify recomendado

**Tipo: `dataflow`** (5 etapas). Justificación: el valor está en la cadena de datos y su simplicidad —una planilla, una lectura, un catálogo—; un `architecture` obligaría a inventar componentes que no existen (no hay backend ni base de datos).

Etapas y nodos propuestos:

| etapa | id | etiqueta | tipo | evidencia |
|---|---|---|---|---|
| Fuentes | `sheets` | Google Sheets (catálogo) | external | `src/App.jsx:6`, `src/App.jsx:221` |
| Fuentes | `drive` | Google Drive (imágenes y video) | external | `src/App.jsx:254-269` |
| Ingesta | `lectura` | Lectura CSV (PapaParse) | backend | `src/App.jsx:218-252` |
| Proceso | `normalizacion` | Normalización y categorías | backend | `src/App.jsx:343-344`, `MANUAL_SISTEMA_CLIENTE.md:13-30` |
| Proceso | `medios` | Miniaturas y preview de Drive | backend | `src/App.jsx:254-269` |
| Consumo | `catalogo` | Catálogo (filtros y stock) | frontend | `src/App.jsx:194-205`, `src/App.jsx:546` |
| Consumo | `whatsapp` | Contacto por WhatsApp | external | `src/App.jsx:278-299` |

Flujos: `sheets→lectura` (export CSV), `drive→medios` (miniatura `sz=w800` / `/preview`), `lectura→normalizacion`, `normalizacion→catalogo`, `medios→catalogo` (galería), `catalogo→whatsapp` (nombre y precio en el mensaje). Tarjetas narrativas: «Una planilla como panel», «Estado real del producto», «Contacto con contexto».

**Segundo diagrama:** no recomendado. Un diagrama de arquitectura sólo mostraría «React en Firebase», que no aporta.

## 11. Información pendiente de confirmar

- Si el sitio sigue en producción con el mismo diseño (no verificado).
- Capturas aprobadas y con datos ficticios.
- Confirmación de que la URL `flordealmendro.cl` sigue vigente.
- Derechos de uso de las imágenes del catálogo para material de portafolio.

## 12. Fuentes consultadas

`package.json` · `firebase.json` · `src/App.jsx` · `index.html` · `MANUAL_SISTEMA_CLIENTE.md` · `Manual Flor de almendro.pdf` (índice) · `all_projects.json` / `clean_projects.json` / `projects.json` (estructura de datos, sin contenido comercial transcrito) · `deploy_output*.txt` (salida de despliegue, sin credenciales).
