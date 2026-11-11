# RRSS — informe de investigación

> Fase de investigación y preparación. No implementa la ficha.

## 1. Ficha de identidad

| Dato | Valor | Estado |
|---|---|---|
| Nombre público | RRSS (automatización editorial de kokeAI) | aprobado en el sitio |
| Categoría JMorgado | Automatización y contenido · Automatización editorial | aprobado |
| URL pública | **sin URL de producto**: es un sistema interno | aprobado en el sitio |
| Repositorio | sin remote configurado | verificado |
| Revisión auditada | `b0c478dbe41dab604c67682db0a129266de49f49` (rama `master`, 2026-04-08) | verificado |
| Ruta local auditada | `C:\Users\jorge\Proyectos\RRSS koke.ai` | sólo lectura |
| Fecha de revisión | 2026-11-10 | — |

> Working tree: `main.py` modificado y un `.pyc` eliminado. Registrado, no modificado.

**No confundir con**: `C:\Users\jorge\Proyectos\impulsacv-web\RRSS` y `C:\Users\jorge\Proyectos\pruebas\RRSS`, que pertenecen al módulo de RRSS de ImpulsaCV, y con `C:\Users\jorge\Proyectos\cambiometro-editorial`, que es otro sistema editorial.

## 2. Qué problema resuelve

Publicar en redes una pieza cada día no es el problema difícil: lo difícil es **mantener el ritmo sin repetir trabajo manual**. En este sistema, cada pieza recorre siempre el mismo camino: se toma la imagen pendiente, se redacta el texto con ayuda de un modelo, se compone la pieza final con el formato que corresponde a cada red, se publica y se deja registro de lo publicado.

## 3. Qué se desarrolló realmente

1. **Dos disparadores horarios en Apps Script.** `TRIGGER_MAÑANA_FEED()` y `TRIGGER_TARDE_STORY()` invocan un flujo central con el tipo de publicación (`appscript.txt:16-28`).
2. **Flujo central en cinco pasos.** `ejecutarFlujoCentral(tipoPost)`: obtener imagen pendiente → pedir texto a la IA → componer/publicar → registrar en la planilla (`appscript.txt:94-113`).
3. **Selección de material.** `obtenerImagenDeDrive()` elige la imagen pendiente y su serie (`appscript.txt:95-99`, `appscript.txt:165-178`).
4. **Redacción asistida con Gemini.** `pedirTextoA_IA()` llama a la Cloud Function con el tipo de publicación; para FEED pide un copy con hashtags y para STORY una frase muy corta (`appscript.txt:119-165`).
5. **Composición programática de la pieza.** La Cloud Function en Python genera el texto con `llamar_gemini()` y, para STORY, compone un lienzo 1080×1920 con fondo desenfocado, imagen central y barra de texto (`main.py:186-243`).
6. **Publicación en la red social.** `publicarEnInstagram()` crea el contenedor de medios, consulta su estado y publica con `media_publish` (`appscript.txt:288-360`).
7. **Registro del historial.** `registrarImagenPublicada()` deja constancia en la planilla y `obtenerTodoElHistorial()` la consulta (`appscript.txt:266-288`).
8. **Almacenamiento de la pieza procesada.** La imagen compuesta se sube a un bucket de Google Cloud Storage y se hace pública para poder publicarla (`main.py:245-262`).
9. **Seguridad de la función.** Token compartido en cabecera `X-Auth-Token`, CORS restringido a los dominios del proyecto y validación de dominio de origen para evitar SSRF (`main.py:137-175`, `main.py:29-38`).
10. **Modelo con cascada de respaldo.** Si un modelo no responde, se prueba el siguiente de una lista, y si todos fallan se devuelve un texto por defecto (`main.py:17-28`, `main.py:113-134`).
11. **Versionado del script de Apps Script.** `script_sync/` contiene la copia que se despliega con `clasp` (`.clasp.json`, `appsscript.json`, `Código.js`) (`script_sync/`).

## 4. Funcionalidades principales

| # | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| 1 | Publicación programada dos veces al día (feed y story) | `appscript.txt:16-28` | verificado |
| 2 | Selección automática de la pieza pendiente | `appscript.txt:95-99` | verificado |
| 3 | Redacción asistida por Gemini con formato según red | `appscript.txt:119-165`, `main.py:71-134` | verificado |
| 4 | Composición de la pieza (formato vertical 1080×1920 con texto) | `main.py:186-243` | verificado |
| 5 | Publicación en la red con control de estado | `appscript.txt:288-360` | verificado |
| 6 | Registro e historial en planilla | `appscript.txt:266-288` | verificado |

## 5. Arquitectura y flujo

```
Trigger horario (Apps Script)
   → obtener imagen pendiente en Drive
   → Cloud Function (Python)
        ├─ Gemini: frase (STORY) o copy + hashtags (FEED)
        ├─ Pillow: composición 1080×1920 con overlay de texto
        └─ Google Cloud Storage: pieza final (URL pública)
   → publicación en Instagram (contenedor + media_publish)
   → registro en Sheets (historial)
```

## 6. Tecnologías verificadas

Python 3 (Cloud Functions con `functions_framework`) · Google Cloud Storage · Pillow (Pillow ≥ 10) · requests · Google Apps Script (disparadores, Google Sheets, Google Drive, Graph API de Meta) · Gemini (`generativelanguage`, API v1beta con cascada de modelos) · Procfile para despliegue (`requirements.txt`, `Procfile`).

## 7. Mi participación

**Afirmable:** el repositorio contiene la implementación completa de las dos piezas del sistema (Apps Script y Cloud Function), el versionado con `clasp` y los scripts de seguridad propios; es un trabajo propio, no una plantilla.

**No afirmable:** autoría individual por módulo, y **cuál es el estado actual de ejecución**: no hay evidencia de que los activadores estén activos en Google ni de que la función esté desplegada.

## 8. Capacidades que merece la pena mostrar

1. **Ritmo con proceso:** cada publicación recorre el mismo camino verificable (`appscript.txt:94-113`).
2. **Asistencia acotada:** el modelo redacta; el formato y la publicación los define el sistema (`main.py:186-243`).
3. **Registro y trazabilidad:** cada publicación queda anotada con su estado (`appscript.txt:277-288`).

## 9. Propuesta de ficha JMorgado

- **Título editorial:** «RRSS» + acento coral. Bajada: «Publicación programada: del material al post, con registro de cada paso».
- **Descripción breve:** mantener la aprobada.
- **Desafío:** mantener un ritmo de publicación constante sin repetir trabajo manual ni perder el registro.
- **Solución:** automatización con Sheets y Apps Script, una función en Python con apoyo de Gemini para el texto y Pillow para la composición, y conexión con la API de la red social.
- **Funcionalidades destacadas:** calendario y disparadores · redacción asistida · composición programática · publicación con registro.
- **Participación:** «Implementé el flujo de planificación, generación asistida y composición».
- **Tecnologías:** Python · Google Sheets · Apps Script · Gemini · Pillow · Google Cloud Storage.
- **Demostraciones posibles (sin publicar en redes):** diagrama del flujo de publicación; una pieza compuesta de ejemplo con material ficticio; el flujo de pruebas «guardar en Drive y registrar en Sheets sin publicar» que ya existe en el código (`appscript.txt:42-51`).
- **Estructura sugerida de módulos `fx-*`:**
  - `hero` — sí, **sin chip de sitio** (no hay URL de producto).
  - `desafio` — sí.
  - `perspectivas` — **sí, un solo diagrama `workflow`** del recorrido de una publicación. Es la forma más clara de mostrar un proceso que no tiene interfaz.
  - `plataforma` — sí (Calendario y disparadores / Composición / Publicación y registro).
  - `participacion` — sí (Automatización / IA aplicada / Composición).
  - `tech` — sí.
  - `repo` — no.
  - `metrics` — no: no hay publicaciones, alcance ni resultados verificables.
  - `galeria` — opcional, con piezas de ejemplo sin derechos de terceros.
  - `cierre` + `contacto` — sí, CTA único a `/contacto/`.
- **Qué omitir:** el detalle de prompts, los tokens de acceso y cualquier identificador de cuenta. La ficha debe dejar claro que es un **sistema interno** y no un producto con URL.

## 10. Diagrama Archify recomendado

**Tipo: `workflow`** (un carril de trabajo con 5 pasos, agrupado en fases). Justificación: el valor del proyecto es un proceso repetible sin interfaz; `workflow` lo representa mejor que `architecture` (no hay servicios que desplegar como producto) y mejor que `dataflow` (el flujo va de izquierda a derecha en el tiempo, no por capas de dato).

Nodos propuestos (carril único, 5 columnas):

| id | etiqueta | tipo | evidencia |
|---|---|---|---|
| `disparo` | Disparador horario | messagebus | `appsscript.txt:16-28` |
| `drive` | Pieza pendiente en Drive | external | `appsscript.txt:95-99`, `appsscript.txt:165-178` |
| `ia` | Redacción asistida (Gemini) | backend | `appsscript.txt:119-165`, `main.py:71-134` |
| `composicion` | Composición de la pieza | backend | `main.py:186-243` |
| `gcs` | Pieza final (Cloud Storage) | cloud | `main.py:245-262` |
| `publicacion` | Publicación en la red | external | `appscript.txt:288-360` |
| `registro` | Registro en Sheets | database | `appsscript.txt:266-288` |

Fases: «Disparador» (columna 0), «Preparación» (columnas 1-2, variante `emphasis`), «Publicación y registro» (columnas 3-5). Tarjetas: «Ritmo con proceso», «La IA redacta, el sistema compone», «Cada publicación queda registrada».

**Segundo diagrama:** no recomendado.

## 11. Información pendiente de confirmar

- **Estado de ejecución**: si los activadores de Apps Script y la Cloud Function están hoy activos. La ficha debe hablar en pasado o en presente del diseño, sin prometer automatismo en marcha.
- **Riesgo de seguridad a resolver antes de cualquier publicación**: `appsscript.txt:4-5` y `script_sync/Código.js:7,15` contienen un token de acceso de Meta y un secreto compartido embebidos en el código. No se reproducen aquí. Deberían migrarse a propiedades del proyecto / gestor de secretos y rotarse.
- Volumen y regularidad real de publicaciones.
- Derechos de las imágenes y del material publicado.

## 12. Fuentes consultadas

`main.py` (segmentos 1-60, 71-134, 137-190, 190-270) · `appscript.txt` (segmentos 1-60, 94-165, 165-288, 288-360) · `script_sync/Código.js` (cabecera) · `script_sync/.clasp.json`, `appsscript.json` · `requirements.txt` · `Procfile` · comparación con `C:\Users\jorge\Proyectos\cambiometro-editorial` (sólo para confirmar que es otro sistema).
