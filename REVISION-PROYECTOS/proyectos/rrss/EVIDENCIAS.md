# RRSS — evidencias

> Fuente: repositorio local `C:\Users\jorge\Proyectos\RRSS koke.ai` (sólo lectura).
> Revisión auditada: `b0c478dbe41dab604c67682db0a129266de49f49` (rama `master`, 2026-04-08 19:35 -0400).
> Sin remote configurado. Working tree: `main.py` modificado y un `.pyc` eliminado.
> Fecha de revisión: 2026-11-10.

## 1. Afirmaciones y respaldo

| # | Afirmación | Respaldo | Qué demuestra | Estado |
|---|---|---|---|---|
| 1 | Hay dos disparadores horarios (feed y story) | `appsscript.txt:16-28` | ritmo de publicación | verificado |
| 2 | El flujo central es uno solo, parametrizado por tipo | `appsscript.txt:94-113` | proceso único | verificado |
| 3 | El material pendiente se toma de Drive | `appsscript.txt:95-99`, `appsscript.txt:165-178` | fuente de piezas | verificado |
| 4 | El texto se genera con Gemini en la Cloud Function | `appsscript.txt:119-165`, `main.py:71-134` | asistencia de IA | verificado |
| 5 | La IA redacta; el formato lo define el sistema | `main.py:186-243` | separación de responsabilidades | verificado |
| 6 | La composición produce un lienzo 1080×1920 con overlay de texto | `main.py:199-243` | composición programática | verificado |
| 7 | La pieza procesada se sube a Cloud Storage y se hace pública | `main.py:245-262` | entrega del archivo | verificado |
| 8 | La publicación usa contenedor de medios y `media_publish` | `appsscript.txt:288-360` | publicación real | verificado |
| 9 | Cada publicación se registra en la planilla | `appsscript.txt:266-288` | historial | verificado |
| 10 | La función exige un token compartido y restringe CORS | `main.py:137-150`, `main.py:152-162` | control de acceso | verificado |
| 11 | Las imágenes se descargan sólo desde dominios permitidos (anti-SSRF) | `main.py:29-38`, `main.py:170-175` | validación de entrada | verificado |
| 12 | Hay cascada de modelos de respaldo | `main.py:17-28`, `main.py:113-134` | resiliencia | verificado |
| 13 | Existe modo de prueba que no publica | `appsscript.txt:42-51` | operación segura | verificado |
| 14 | Estado actual de activadores y despliegue | — | sin evidencia en el repositorio | pendiente |
| 15 | Volumen de publicaciones o resultados | — | sin datos | no afirmable |

## 2. Comandos ejecutados (sólo lectura)

```powershell
git -C "C:\Users\jorge\Proyectos\RRSS koke.ai" rev-parse HEAD
git -C "C:\Users\jorge\Proyectos\RRSS koke.ai" remote get-url origin      # (sin remote)
git -C "C:\Users\jorge\Proyectos\RRSS koke.ai" log -1 --format="%H %ci %s"
git -C "C:\Users\jorge\Proyectos\RRSS koke.ai" status --short
Select-String -Path main.py -Pattern "^def |^@|generativelanguage|PIL_|bucket|upload|requests\."
Get-Content main.py -TotalCount 60
Get-Content main.py | Select-Object -Skip 130 -First 140
Select-String -Path appsscript.txt -Pattern "^function |UrlFetchApp|CLOUD_FUNCTION|SpreadsheetApp|media_publish"
Get-Content appsscript.txt | Select-Object -Skip 93 -First 50
Get-Content requirements.txt
Get-Content Procfile
Get-ChildItem script_sync -File
```

No se ejecutó el script de Apps Script, ni la Cloud Function, ni ninguna llamada a la API de Meta.

## 3. Extractos mínimos

`appsscript.txt:94-113` (extracto)

```
function ejecutarFlujoCentral(tipoPost) {
  const contenido = obtenerImagenDeDrive();
  if (!contenido) { ... return; }
  const datosIA = pedirTextoA_IA(contenido.urlImagen, contenido.nombreComic, tipoPost);
  const urlFinal = datosIA.url_procesada || contenido.urlImagen;
  const captionFinal = (tipoPost === "STORY") ? "" : (datosIA.caption + "\n\n" + datosIA.hashtags);
  const exito = publicarEnInstagram(tipoPost, urlFinal, captionFinal);
  if (exito) { registrarImagenPublicada(...); }
}
```

`main.py:29-38` (extracto)

```
ALLOWED_DOMAINS = ["drive.google.com", "drive.usercontent.google.com", "storage.googleapis.com"]
def es_url_segura(url):
    """Verifica si la URL pertenece a un dominio confiable."""
```

`main.py:170-175` (extracto)

```
if tipo_post == "STORY" and url_original:
    # PROTECCION SSRF: Validar URL antes de llamar a requests.get
    if not es_url_segura(url_original):
        return (json.dumps({"error": "URL de imagen no valida o no permitida"}), 400, headers)
```

## 4. Archivos clave

| Archivo | Propósito |
|---|---|
| `main.py` | Cloud Function: llamada a Gemini, composición con Pillow, subida a GCS |
| `appsscript.txt` | script de Apps Script: disparadores, flujo central, publicación y registro |
| `script_sync/Código.js` | copia del script que se despliega con `clasp` |
| `script_sync/.clasp.json`, `script_sync/appsscript.json` | configuración de despliegue de Apps Script |
| `requirements.txt` | `functions-framework`, `google-cloud-storage`, `Pillow`, `requests` |
| `Procfile` | arranque de la función con `functions-framework` |

## 5. Riesgos detectados (no reproducidos aquí)

1. **Token de acceso de Meta y secreto compartido embebidos en el código** (`appscript.txt:4-5`, `script_sync/Código.js:7,15`). El propio script comenta que deberían moverse a *Script Properties*. No se copiaron a esta entrega; se recomienda rotarlos.
2. **Secretos en repositorio**: aunque el repositorio es local, conviene moverlos a propiedades del proyecto o a un gestor de secretos antes de cualquier copia o despliegue en la nube.
3. **La lista de dominios permitidos para descargas** está bien acotada (`main.py:29-38`), lo que reduce el riesgo de SSRF: es un control positivo, no una ausencia de control.

## 6. Relación con otros proyectos

- `C:\Users\jorge\Proyectos\impulsacv-web\RRSS` y `C:\Users\jorge\Proyectos\pruebas\RRSS` pertenecen al módulo de RRSS de ImpulsaCV: **proyecto distinto**.
- `C:\Users\jorge\Proyectos\cambiometro-editorial` es otro sistema editorial: **proyecto distinto**.
- La carpeta `C:\Users\jorge\Proyectos\RRSS` está vacía y no aporta información.
