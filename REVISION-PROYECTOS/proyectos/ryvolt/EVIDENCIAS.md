# Ryvolt — evidencias

> Fuente: repositorio local `C:\Users\jorge\Proyectos\Ryvolt\ryvolt-web` (sólo lectura).
> Revisión auditada: `4b52421f555eba6278d9ce877cb469b696b21aa8` (rama `production`, 2026-07-27 06:57 -0400).
> Sin remote configurado; se trata de la copia de entrega con `ENTREGA_CLIENTE.md` y el manual de marca.
> Fecha de revisión: 2026-11-10.

## 1. Afirmaciones y respaldo

| # | Afirmación | Respaldo | Qué demuestra | Estado |
|---|---|---|---|---|
| 1 | El sitio tiene dos experiencias visuales (Corporate / Rebel) | `src/App.jsx:1-9`, `src/App.jsx:33-45` | doble experiencia implementada | verificado |
| 2 | El cambio de modo tiene transición visual propia | `Documentacion_Tecnica_Ryvolt.md:27-31`, `src/components/ui/TransitionManager.jsx` | branded transition | verificado |
| 3 | El contenido y los metadatos cambian por idioma y modo | `src/App.jsx:10-31` | bilingüismo real | verificado |
| 4 | Hay tests que verifican la paridad entre modos e idiomas | `src/data/siteExperience.test.js:9-43` | consistencia verificada | verificado |
| 5 | El build prerenderiza el HTML en `dist/index.html` | `scripts/prerender.mjs:1-21`, `package.json` (script `build`) | prerenderizado | verificado |
| 6 | El build incluye una verificación de SEO | `package.json` (`verify:seo`), `scripts/verify-prerender.mjs` | control de calidad | verificado |
| 7 | El formulario valida campos, envía a Apps Script y cae a WhatsApp | `src/components/sections/Contact.jsx:13-46` | formulario con dos salidas | verificado |
| 8 | Hay analítica de eventos, páginas y secciones | `src/utils/analytics.js:1-26` | medición | verificado |
| 9 | El sitio se degrada en equipos modestos | `src/utils/performance.js:3-25` | adaptación real | verificado |
| 10 | El menú orbital es SVG con trigonometría y profundidad 3D en móvil | `Documentacion_Tecnica_Ryvolt.md:33-37` | componente propio | verificado |
| 11 | Existe una calculadora de ROI que sincroniza con el menú | `src/components/ROICalculator.jsx:3-20` | funcionalidad distintiva | verificado |
| 12 | El stack es React 19 + Vite 8 + Tailwind 4 + Framer Motion | `package.json`, `Documentacion_Tecnica_Ryvolt.md:6-16` | stack | verificado |
| 13 | Estado actual del sitio en producción | — | no verificado en esta tarea | pendiente |
| 14 | Tráfico, conversión o resultados del cliente | — | sin evidencia | no afirmable |

## 2. Comandos ejecutados (sólo lectura)

```powershell
git -C C:\Users\jorge\Proyectos\Ryvolt\ryvolt-web rev-parse HEAD
git -C C:\Users\jorge\Proyectos\Ryvolt\ryvolt-web log -1 --format="%H %ci %s"
git -C C:\Users\jorge\Proyectos\Ryvolt\ryvolt-web remote get-url origin   # (sin remote)
Get-Content README.md
Get-Content package.json
Get-Content Documentacion_Tecnica_Ryvolt.md -TotalCount 60
Get-Content scripts\prerender.mjs -TotalCount 40
Get-Content src\App.jsx -TotalCount 45
Get-Content src\utils\analytics.js -TotalCount 30
Get-Content src\utils\performance.js -TotalCount 25
Get-Content src\components\ROICalculator.jsx -TotalCount 20
Select-String -Path src\components\sections\Contact.jsx -Pattern "VITE_CONTACT_FORM_URL|fetch\(|WhatsApp"
Get-ChildItem src -Recurse -File
Get-ChildItem ..\Entrega_Fuentes_Ryvolt
```

No se ejecutó `npm ci`, `npm run build` ni `npm test`: no se debe mutar la entrega del cliente.

## 3. Extractos mínimos

`src/App.jsx:10-19` (extracto)

```
function SEOUpdater({ l, isRebelMode }) {
  useEffect(() => {
    const mode = isRebelMode ? 'Rebel' : 'Corporate';
    const content = SEO_CONTENT[mode][l];
    ...
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.description);
```

`scripts/prerender.mjs:16-19` (extracto)

```
const prerenderedHtml = template.replace(rootMarker, `<div id="root">${appHtml}</div>`);
await writeFile(distHtmlUrl, prerenderedHtml, 'utf8');
await rm(serverOutputUrl, { recursive: true, force: true });
```

`src/utils/performance.js:18-25` (extracto)

```
if (isMobile && (memory <= 4 || cores <= 4)) {
  setIsLowEnd(true);
}
if (navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType === '2g')) {
  setIsLowEnd(true);
}
```

## 4. Archivos clave

| Archivo | Propósito |
|---|---|
| `README.md` | stack, verificación, build y despliegue en Cloudflare Pages |
| `ENTREGA_CLIENTE.md` | guía de entrega y operación para el cliente |
| `Documentacion_Tecnica_Ryvolt.md` | documentación técnica de la doble experiencia |
| `package.json` | stack y cadena de build (incluye prerender y verify) |
| `scripts/prerender.mjs` | prerenderizado del HTML |
| `scripts/verify-prerender.mjs` | gate de SEO posterior al build |
| `src/App.jsx` | estado global de modo e idioma, metadatos SEO |
| `src/components/layout/CorporateExperience.jsx` · `RebelExperience.jsx` | las dos experiencias |
| `src/components/ui/TransitionManager.jsx` | transición entre modos |
| `src/components/sections/*` | secciones de contenido (Hero, Manifesto, SalesforceCore, VoltSys, Contact) |
| `src/components/ROICalculator.jsx` | calculadora de ROI |
| `src/data/constants.js` · `navigation.js` · `seo.js` | contenido y configuración |
| `src/utils/analytics.js` · `performance.js` | analítica y detección de rendimiento |
| `docs/seo_audit_report.md` | auditoría de SEO entregada |
| `..\Entrega_Fuentes_Ryvolt` | manual de marca y ambientes Corporate / Rebel |

## 5. Observaciones

- Deriva documental menor: `Documentacion_Tecnica_Ryvolt.md:42` menciona `usePerformance.js`, pero el archivo real es `src/utils/performance.js`. No afecta al código.
- Los archivos de entrega (`ryvolt-entrega-completa-2026-07-28.zip`, `ryvolt-cloudflare-upload-2026-07-28.zip`) existen en la carpeta y no se copiaron a la entrega de esta revisión.
