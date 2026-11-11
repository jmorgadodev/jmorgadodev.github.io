# Exo Dream — evidencias

> Fuente: carpeta local `C:\Users\jorge\Proyectos\Toby` (sólo lectura).
> Sin repositorio Git: no hay commit, rama ni remote que registrar. Estado declarado: fuente local-only.
> Fecha de revisión: 2026-11-10.

## 1. Afirmaciones y respaldo

| # | Afirmación | Respaldo | Qué demuestra | Estado |
|---|---|---|---|---|
| 1 | El catálogo se obtiene desde Google Sheets | `src/services/sheets.js:227-286` | fuente de datos | verificado |
| 2 | Existe un proxy interno `/api/catalog` con respaldo tokenizado | `src/services/sheets.js:227-286`, `src/config.js:3-14` | resiliencia de lectura | verificado |
| 3 | El hosting reescribe `/api/catalog` y `/api/config` | `netlify.toml:1-16`, `vercel.json:1-15` | contrato de despliegue | verificado |
| 4 | Los textos del sitio se editan en una hoja «Configuración» | `src/services/sheets.js:288-296`, `src/config.js:44-45`, `src/App.jsx:29-30` | configuración sin código | verificado |
| 5 | Las filas se normalizan y sanitizan antes de usarse | `src/services/sheets.js:22-40` | control de entrada | verificado |
| 6 | Los medios de Drive se resuelven y optimizan por tamaño | `src/services/drive.js:5-40` | manejo de medios | verificado |
| 7 | El showroom compone hero, filtros, fichas y modales | `src/App.jsx:1-19`, `src/App.jsx:41-60` | interfaz | verificado |
| 8 | Existen agenda, encuestas y formulario de contacto | `src/components/BookingModal.jsx`, `src/components/SurveyModal.jsx:6-40`, `src/components/ContactModal.jsx` | functionality | verificado |
| 9 | Hay scripts propios de operación y auditoría | `update_sheets_full.cjs:1-35`, `test_sheets_paste.cjs`, `audit_test.cjs:10-25` | operación asistida | verificado |
| 10 | El sitio está construido como estático | `dist/index.html`, `dist/sitemap.xml`, `dist/_headers` | entregable | verificado |
| 11 | Stack React 18 + Vite 5 + Tailwind 3 + PapaParse | `package.json` | stack | verificado |
| 12 | URL pública de producción | — | sin evidencia en la fuente | pendiente (bloqueante) |
| 13 | Repositorio o código público | — | no existe `.git` ni remote | pendiente |
| 14 | Uso real, visitas o resultados del cliente | — | sin instrumentación | no afirmable |

## 2. Comandos ejecutados (sólo lectura)

```powershell
Get-ChildItem C:\Users\jorge\Proyectos\Toby -Force                 # (sin .git)
Get-Content package.json
Get-Content netlify.toml
Get-Content vercel.json
Get-Content src\App.jsx -TotalCount 60
Get-Content src\config.js -TotalCount 45
Get-Content src\services\sheets.js -TotalCount 300
Get-Content src\services\drive.js -TotalCount 40
Select-String -Path src\components\*.jsx -Pattern "whatsapp|encuesta|reserva|wa\.me"
Get-Content update_sheets_full.cjs -TotalCount 35
Get-Content audit_test.cjs -TotalCount 25
Get-ChildItem dist -Recurse -File
```

No se ejecutó `npm install`, `vite build` ni los scripts que escriben en Google Sheets (`update_sheets_full.cjs` sí modifica la planilla: no se ejecutó).

## 3. Extractos mínimos

`src/services/sheets.js:227-233` (extracto)

```
export const fetchCatalogData = async () => {
  // 1. Intentar cargar mediante el proxy interno seguro (/api/catalog)
  try {
    const proxyEndpoint = CONFIG.CATALOG_API_ENDPOINT;
    if (proxyEndpoint) {
      const sep = proxyEndpoint.includes('?') ? '&' : '?';
      const urlWithCacheBuster = `${proxyEndpoint}${sep}_ts=${Date.now()}`;
```

`src/services/sheets.js:260-268` (extracto)

```
  // 2. Fallback de seguridad con endpoint protegido por tokenizacion y sin cache
  return new Promise((resolve, reject) => {
    const rawFallbackUrl = getSecureFallbackCatalogUrl();
    ...
    const fallbackUrl = `${rawFallbackUrl}${sep}_ts=${Date.now()}`;
```

`src/services/sheets.js:288-296` (extracto)

```
/**
 * Procesa las filas de la hoja secundaria de Configuracion y Textos.
 * Permite al administrador editar cualquier texto de la web o el numero de telefono sin tocar codigo.
 */
export const processConfigRows = (rawRows) => {
  const settings = { ...DEFAULT_SITE_TEXTS };
```

## 4. Archivos clave

| Archivo | Propósito |
|---|---|
| `package.json` | stack y scripts |
| `src/App.jsx` | composición del showroom y estados |
| `src/config.js` | textos por defecto, fallback tokenizado y normalización de teléfono |
| `src/services/sheets.js` | lectura de catálogo y configuración, normalización y sanitización |
| `src/services/drive.js` | resolución y optimización de medios de Drive |
| `src/components/CategoryFilters.jsx`, `ProductCard.jsx` | navegación del catálogo |
| `src/components/ProductDetailModal.jsx`, `GalleryZoomModal.jsx`, `VideoModal.jsx` | fichas y medios |
| `src/components/BookingModal.jsx`, `SurveyModal.jsx`, `ContactModal.jsx` | agenda, encuestas y contacto |
| `src/components/AnimatedExoLogo.jsx`, `BackgroundGrid.jsx`, `BrandLoader.jsx` | identidad visual |
| `netlify.toml`, `vercel.json` | proxy de lectura y cabeceras de seguridad |
| `update_sheets_full.cjs`, `test_sheets_paste.cjs` | operación sobre la planilla |
| `audit_test.cjs` | auditoría de normalización telefónica y desbordamiento |
| `dist/` | sitio construido (index, sitemap, robots, headers, redirects) |
| `Manual_Operativo_Exo_Dream.pdf`, `Documentacion/` | manual y logos del cliente |

## 5. Observaciones

- `src/config.js:3-14` ofusca la URL de respaldo con `atob`. Es una medida defensiva del cliente, no un requisito de la ficha; no se reproduce la URL en los informes.
- La carpeta contiene un `.env` en la raíz: no se leyó su contenido ni se incluirán variables en esta entrega.
