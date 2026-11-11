# Flor de Almendro — evidencias

> Fuente: repositorio local `C:\Users\jorge\Proyectos\Flor de almendro` (sólo lectura).
> Revisión auditada: `de2a2b14e5b551e64017a8f0ab6088e28e1f0b2b` (rama `master`, 2026-04-08 19:35 -0400).
> Sin remote configurado. Working tree: un archivo borrado (`flordealmendro_backup.zip`).
> Fecha de revisión: 2026-11-10.

## 1. Afirmaciones y respaldo

| # | Afirmación | Respaldo | Qué demuestra | Estado |
|---|---|---|---|---|
| 1 | El catálogo se lee de Google Sheets en formato CSV | `src/App.jsx:6`, `src/App.jsx:218-252` | fuente de verdad del catálogo | verificado |
| 2 | Se usa PapaParse con `download: true` y `header: true` | `src/App.jsx:221-224` | mecanismo de lectura | verificado |
| 3 | Las filas sin nombre se descartan | `src/App.jsx:225` | normalización mínima | verificado |
| 4 | El esquema de columnas está documentado para el negocio | `MANUAL_SISTEMA_CLIENTE.md:13-30` | contrato de datos | verificado |
| 5 | Las categorías se derivan del dato, con «Todos» por defecto | `src/App.jsx:343-344` | filtros sin configuración | verificado |
| 6 | Se admiten hasta cinco imágenes y un video por producto | `src/App.jsx:15-26`, `MANUAL_SISTEMA_CLIENTE.md:29-30` | galería enriquecida | verificado |
| 7 | Las imágenes de Drive se sirven como miniatura `sz=w800` y los videos como `/preview` | `src/App.jsx:254-269` | optimización de medios | verificado |
| 8 | El stock `0` desactiva la compra y muestra «Agotado» | `src/App.jsx:546`, `src/App.jsx:149`, `src/App.jsx:605` | estado real de stock | verificado |
| 9 | El mensaje de WhatsApp incluye nombre y precio | `src/App.jsx:278-299`, `src/App.jsx:593-599` | contacto con contexto | verificado |
| 10 | Hay búsqueda y vista activa sobre el catálogo | `src/App.jsx:194-205` | consulta | verificado |
| 11 | El sitio se despliega en Firebase Hosting con cabeceras de seguridad | `firebase.json:1-25` | entrega y.headers | verificado |
| 12 | Hay modo día/noche propio | `src/App.jsx:199`, `MANUAL_SISTEMA_CLIENTE.md:47` | identidad visual | verificado |
| 13 | El stack es React 18 + Vite 5 + Tailwind 3 + PapaParse + Firebase | `package.json` | stack | verificado |
| 14 | Ventas, visitas o conversión | — | sin instrumentación ni datos | no afirmable |
| 15 | Estado actual del sitio en producción | — | no verificado en esta tarea | pendiente |

## 2. Comandos ejecutados (sólo lectura)

```powershell
git -C "C:\Users\jorge\Proyectos\Flor de almendro" rev-parse HEAD
git -C "C:\Users\jorge\Proyectos\Flor de almendro" remote get-url origin   # (sin remote)
git -C "C:\Users\jorge\Proyectos\Flor de almendro" status --short
Get-Content package.json
Get-Content firebase.json -TotalCount 30
Get-Content src\App.jsx -TotalCount 280
Select-String -Path src\App.jsx -Pattern "Papa|spreadsheets|drive.google|wa\.me|stock|categoria|video"
Get-Content MANUAL_SISTEMA_CLIENTE.md -TotalCount 80
```

No se ejecutó `npm install`, `npm run build` ni `firebase deploy`.

## 3. Extractos mínimos

`src/App.jsx:218-226` (extracto)

```
const cargarDatos = async () => {
  try {
    Papa.parse(GOOGLE_SHEETS_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data.filter(p => p.nombre && p.nombre.trim() !== '');
        setProductos(data);
```

`src/App.jsx:254-261` (extracto)

```
const arreglarUrlDrive = (url) => {
  ...
  if (cleanUrl.includes('drive.google.com/file/d/')) {
    const id = cleanUrl.split('/d/')[1].split('/')[0];
    return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
  }
```

`src/App.jsx:343-344` (extracto)

```
const categoriasMap = new Set(productos.map(p => p.categoria ? p.categoria.trim() : '').filter(c => c !== ...));
const categorias = ['Todos', ...Array.from(categoriasMap)];
```

## 4. Archivos clave

| Archivo | Propósito |
|---|---|
| `package.json` | stack y scripts (dev, build, lint, preview) |
| `src/App.jsx` (838 líneas) | aplicación completa: carga, filtros, galería, modales, WhatsApp, tema |
| `src/main.jsx`, `src/index.css` | punto de entrada y estilos base |
| `firebase.json` | hosting en `dist` y cabeceras de seguridad |
| `.firebaserc` | proyecto de Firebase |
| `MANUAL_SISTEMA_CLIENTE.md` | manual de operación para la dueña del negocio |
| `Manual Flor de almendro.pdf` / `.docx` | versión imprimible del manual |
| `all_projects.json`, `clean_projects.json`, `projects.json` | volcados de datos del catálogo (no se transcriben aquí) |
| `deploy_output.txt`, `deploy_output_2.txt` | registro de despliegues |
| `Flor de Almendro Manual.docx` | manual en Word |

## 5. Observaciones de privacidad

- Este repositorio contiene datos comerciales del cliente (nombres de productos, precios, categorías y enlaces de Drive). No se transcribieron en los informes de esta revisión; las capturas para la ficha deben usarse con datos ficticios.
- `src/App.jsx:7` incluye el número de WhatsApp de la tienda; es un dato del cliente y no se reproduce en los informes.
