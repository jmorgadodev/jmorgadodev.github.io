# kokeAI — evidencias

> Fuente: repositorio local `C:\Users\jorge\Proyectos\koooke.ai` (sólo lectura).
> Revisión auditada: `40986da17efc82da651fba537e4928db3b59c02b` (rama `master`, 2026-04-08 19:35 -0400).
> Sin remote configurado. Working tree con cambios locales y un archivo eliminado (registrado).
> Fecha de revisión: 2026-11-10.

## 1. Afirmaciones y respaldo

| # | Afirmación | Respaldo | Qué demuestra | Estado |
|---|---|---|---|---|
| 1 | El portal es HTML/CSS/JS vanilla sobre Firebase Hosting | `docs_kokeai.md:8-12`, `firebase.json:1-30` | stack | verificado |
| 2 | Apps Script recorre las carpetas de Drive y publica el catálogo en la RTDB | `apps_script_firebase.js:14-45` | automatización | verificado |
| 3 | La publicación se hace con un `PUT` a `data.json` | `apps_script_firebase.js:18-19`, `apps_script_firebase.js:29-37` | mecanismo | verificado |
| 4 | La sincronización es nocturna mediante activador temporal | `apps_script_firebase.js:7-11` | frecuencia | verificado (configurable por el usuario) |
| 5 | El portal hace `fetch` del catálogo al cargar y refresca con marca de tiempo | `public/index.html:1599`, `public/index.html:1760-1779` | consumo | verificado |
| 6 | El lector guarda la última página en `localStorage` | `docs_kokeai.md:26-28` | experiencia | verificado |
| 7 | El audio se reproduce a través de un Worker con CORS y orígenes permitidos | `worker/index.js:1-35` | entrega de audio | verificado |
| 8 | Hay clasificadores locales de la biblioteca musical | `clasificar_musica.py:7-14`, `clasificar_musica_ia.py:6-30` | operación local | verificado |
| 9 | La RTDB es compartida con Hangar354 y sus reglas se administran desde el otro repo | `docs_kokeai.md:43` | acoplamiento entre proyectos | verificado |
| 10 | Las reglas de reescritura envían todas las rutas al `index.html` | `docs_kokeai.md:44`, `firebase.json:20-30` | hosting SPA | verificado |
| 11 | Uso, visitas o alcance del catálogo | — | sin instrumentación | no afirmable |
| 12 | Derechos de las piezas publicadas | — | no documentados en el repositorio | pendiente (crítico para el portafolio) |

## 2. Comandos ejecutados (sólo lectura)

```powershell
git -C C:\Users\jorge\Proyectos\koooke.ai rev-parse HEAD
git -C C:\Users\jorge\Proyectos\koooke.ai remote get-url origin      # (sin remote)
git -C C:\Users\jorge\Proyectos\koooke.ai log -1 --format="%H %ci %s"
git -C C:\Users\jorge\Proyectos\koooke.ai status --short
Get-Content docs_kokeai.md -TotalCount 70
Get-Content apps_script_firebase.js -TotalCount 50
Get-Content worker\index.js -TotalCount 40
Get-Content firebase.json -TotalCount 30
Get-Content kokeai_config.json -TotalCount 25
Select-String -Path public\index.html -Pattern "API_URL|fetch\(|globalData|zoom"
Get-Content clasificar_musica.py -TotalCount 30
Get-Content clasificar_musica_ia.py -TotalCount 30
```

No se ejecutó `firebase deploy`, ni se invocó el activador de Apps Script.

## 3. Extractos mínimos

`apps_script_firebase.js:22-41` (extracto)

```
function ActualizarBaseDatosFirebase() {
  try {
    var datosListos = ObtenerCatalogoCompleto();
    var options = {
      'method': 'put',
      'contentType': 'application/json',
      'payload': JSON.stringify(datosListos),
      'muteHttpExceptions': true
    };
    var response = UrlFetchApp.fetch(FIREBASE_DB_URL, options);
```

`worker/index.js:13-14` (extracto)

```
const ALLOWED_ORIGINS = ['https://kokeai.web.app', 'https://kokeai.firebaseapp.com'];
```

`public/index.html:1769` (extracto)

```
var res = await fetch(API_URL);
```

## 4. Archivos clave

| Archivo | Propósito |
|---|---|
| `docs_kokeai.md` | documentación técnica del portal (arquitectura, flujo, hosting) |
| `apps_script_firebase.js` | exportador de catálogo desde Drive hacia Firebase |
| `worker/index.js` | proxy de audio con CORS |
| `firebase.json` | hosting, reescrituras y caché |
| `database.rules.json` | reglas de la RTDB compartida (no desplegar desde este repo) |
| `kokeai_config.json` | configuración de Firebase del cliente web |
| `public/index.html` | portal completo (cómics, sesiones, lector, tema) |
| `clasificar_musica.py` | clasificador local por palabras clave |
| `clasificar_musica_ia.py` | clasificador local por reglas específicas del catálogo |
| `proxy.js` | utilidad de proxy en local |
| `.firebaserc` | alias del proyecto Firebase |

## 5. Observaciones

- `kokeai_config.json` incluye una `apiKey` de cliente de Firebase. Las claves de este tipo son públicas por diseño en el SDK web, pero no se reproducen en esta entrega.
- `apps_script_firebase.js:14-16` incluye identificadores de carpetas de Drive: no se reproducen aquí.
- La RTDB es compartida con el proyecto Hangar354: cualquier cambio de reglas afecta a ambos (`docs_kokeai.md:43`).
