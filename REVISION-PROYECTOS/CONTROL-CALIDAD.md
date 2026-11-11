# Control de calidad — revisión de proyectos

Fecha: 2026-11-10. Alcance: la fase de investigación, documentación y preparación descrita en el
encargo. **No** se implementaron fichas, no se modificó el sitio y no se hizo commit, push ni
despliegue.

## 1. Qué se comprobó

| Comprobación | Resultado |
|---|---|
| Los 8 proyectos localizados y con revisión identificada | OK (7 con commit, 1 sin repositorio Git) |
| Lectura de código en los 8 repositorios (sólo lectura) | OK |
| 7 diagramas candidatos escritos y validados | OK (`validate` = `ok: true` en los 7) |
| 7 diagramas generados con `finalize` (validate + deliver + check + browser-check) | OK (las 4 compuertas en `pass`) |
| HTML y JSON corresponden entre sí | OK (sha256 del candidato y del artefacto en cada recibo) |
| Ningún repositorio de origen modificado | OK (sólo `git status`, `git log`, lecturas) |
| Ninguna credencial, token, `.env` o dato personal de cliente en la entrega | OK (revisado; hay excepciones documentadas abajo que **no** se copiaron) |
| La landing, ImpulsaCV, otras fichas y la skill Archify intactas | OK |
| Todo el resultado aislado en `REVISION-PROYECTOS/` | OK |
| Informes individuales completos (los 8 con INFORME + EVIDENCIAS) | OK |

## 2. Inventario de archivos incluidos

El listado completo, con tamaño y sha256, está en **`INVENTARIO-ARCHIVOS.md`** (generado al cierre de
esta fase). Resumen:

| Bloque | Archivos | Contenido |
|---|---|---|
| Documentación general | 6 + este inventario | README, INFORME-GENERAL, INVENTARIO-PROYECTOS, METODOLOGIA, INTEGRACION-FICHAS, CONTROL-CALIDAD |
| Documentación por proyecto | 23 | 8 INFORME + 8 EVIDENCIAS + 7 VALIDACION |
| Material Archify | 47 | 7 JSON de diagrama + 7 HTML + 5 archivos `.evidencias.json` + 28 recibos (finalize, summary, browser-check, delivery) |
| Paquete de entrega | 1 | `ENTREGA/ENTREGA-REVISION-PROYECTOS.zip` |

Total en la carpeta: **77 archivos** (76 inventariados + este inventario).

## 3. Información no verificada

| Proyecto | Qué no se pudo verificar | Por qué |
|---|---|---|
| Todos | Reparto de autoría dentro de los equipos | No hay bloque de autoría ni coautores registrados en los repositorios |
| Todos | Usuarios, tráfico, conversión, ingresos | Ninguna fuente del repositorio los contiene |
| El Cambiómetro | Vigencia actual de las cifras del README | Son un corte de 2026-09 y el repositorio no se actualiza en línea |
| ListoPorHoy | Estado real de las automatizaciones de comentarios y DM | El esquema las contempla, desactivadas por defecto; no hay evidencia de uso |
| ListoPorHoy | Marcas activas y volumen de publicaciones | No hay datos |
| Ryvolt | Estado actual del sitio en producción | No verificado contra `ryvolt.cl` en esta tarea |
| Flor de Almendro | Estado actual del sitio y datos del cliente | No verificado; el repositorio es un resguardo de 2026-04 |
| Exo Dream | URL pública de producción | No existe en el repositorio; no se inventa |
| Hangar354 | Nombre comercial vigente | El repositorio aún usa «Toby's Warehouse» |
| Hangar354 | Estado del despliegue | No verificado |
| kokeAI | Alcance real del catálogo y activador activo | No verificable sin entrar a Google Apps Script |
| RRSS | Si los activadores y la función están hoy activos | No verificable; el repositorio sólo guarda el código |

## 4. Limitaciones encontradas

1. **Procedencia enlazable sólo en 2 de 7 diagramas.** Archify exige `meta.repository` cuando un
   nodo declara `sources`, y exige una URL de remote sin credenciales. El Cambiómetro y ListoPorHoy la
   tienen; Hangar354, kokeAI, Flor de Almendro, Exo Dream y RRSS no. Para esos cinco, la evidencia se
   conservó en archivos `.evidencias.json` (nodo → archivo y líneas) y el HTML quedó sin procedencia
   automática. Es una limitación honesta, no un atajo: preferible a inventar un remote.
2. **Un diagrama usa perfil `standard`.** El flujo de Flor de Almendro (cinco etapas, dos fuentes en
   paralelo) es rechazado por las comprobaciones de corredor del perfil `showcase`. Se validó y
   generó con `standard`, que es un perfil soportado y menos restrictivo.
3. **Revisión visual de maquetación fina pendiente.** `finalize` ejecutó `browser-check` (carga real
   sin errores de consola) y además se revisó cada HTML en un navegador real: los 7 cargan sin
   errores de consola, con el SVG dibujado, las etiquetas presentes y las dimensiones esperadas
   (891×489, 906×217, 891×601, 891×443, 891×656, 906×320 y 891×581 px). Queda pendiente la lectura
   fina de composición por una persona (no hay captura de pantalla en este entorno).
4. **Sin portal embebido nuevo.** Sólo El Cambiómetro y ListoPorHoy tienen páginas públicas
   configuradas en `PROJECT_PORTAL_PAGES`; el resto necesita decisión antes de usar el chip
   «Ver sitio».
5. **Los diagramas no están publicados.** Son HTML autocontenidos en este repositorio; integrarlos
   en las fichas implica copiarlos a `assets/` y aplicar la edición de controles heredados que se
   hizo en ImpulsaCV.

## 5. Riesgos de seguridad detectados en los repositorios de origen

Se documentan aquí; **no se copiaron** credenciales ni valores a esta entrega.

| Repositorio | Hallazgo | Acción sugerida |
|---|---|---|
| `RRSS koke.ai` | Token de acceso de Meta y secreto compartido embebidos en el script de Apps Script y en `script_sync/Código.js` | Migrar a *Script Properties* o a un gestor de secretos, y rotar ambos valores |
| `torneo` (Hangar354) | Credenciales de administrador en texto plano dentro de `AGENT_INSTRUCTIONS.md` | Rotar y sacar del repositorio |
| `Conecta` (ListoPorHoy) | Clave de cifrado AES-GCM por defecto escrita en el código (`services/crypto.js`) | Usar siempre variable de entorno y rotar si se usó en producción |
| `Conecta` | Reglas de RTDB con escritura pública en `torneo_hangar354` | Revisar si el proyecto sigue en producción |
| `Conecta` | Repositorio privado enlazado en el JSON del diagrama | El diagrama declara `link_mode: local-only` para no exponer una URL privada |

## 6. Pendientes que requieren tu aprobación

| # | Decisión | Dónde afecta |
|---|---|---|
| 1 | Orden de construcción de las fichas | `INTEGRACION-FICHAS.md` §5 propone un orden |
| 2 | Qué proyecto se construye primero (recomendación: El Cambiómetro) | Development del módulo `diagrama` y del par genérico `project-archify.*` |
| 3 | Nombre público de Hangar354 y si se renombra el slug `tobys-warehouse` | Ficha y rutas del sitio |
| 4 | Si se renombran los slugs `conecta`, `kooke-portal` y `kooke-rrss` a los nombres públicos | Rutas públicas y enlaces |
| 5 | Confirmar la URL de Exo Dream o mantener la ficha sin chip de sitio | Ficha de Exo Dream |
| 6 | Qué cifras se usan en `metrics` de El Cambiómetro (y con qué fecha) | Ficha de El Cambiómetro |
| 7 | Si se afirma en RRSS que la automatización está activa hoy | Ficha de RRSS |
| 8 | Qué capturas con datos ficticios se usan en Flor de Almendro, Exo Dream y kokeAI | Galerías de esas fichas |
| 9 | Si se autoriza publicar el paquete en el repositorio (commit) | Todo `REVISION-PROYECTOS/` |

## 7. Cómo revisar este paquete

1. Empieza por `INFORME-GENERAL.md` (panorama) y `INVENTARIO-PROYECTOS.md` (tabla).
2. Abre los diagramas con doble clic: son HTML autocontenidos.
3. Para cada proyecto, contrasta `INFORME.md` con `EVIDENCIAS.md`: cada afirmación debe tener
   respaldo `archivo:líneas` en el repositorio de origen.
4. `VALIDACION.md` por proyecto deja constancia de las cuatro compuertas de Archify.
5. `INVENTARIO-ARCHIVOS.md` permite comprobar que el ZIP incluye exactamente lo declarado.
