# JMorgado

**Contexto y decisiones vigentes:** [Contexto maestro del proyecto](docs/CONTEXTO_MAESTRO_JMORGADO.md). Para continuar el inicio, seguir el [plan operativo de mejoras de escenas](docs/PLAN_MEJORA_ESCENAS_INICIO_JMORGADO.md). Para agentes, leer también [AGENTS.md](AGENTS.md) y el [encargo de identidad de secciones interiores](docs/ENCARGO_AGENTE_IDENTIDAD_INTERIOR_JMORGADO.md).

Fuente de la web estática de Jorge Morgado. Python estándar genera 24 páginas canónicas, 2 redirecciones y 1 página de contacto para el QR (27 rutas). La generación usa la biblioteca estándar.

## Generación

```sh
python publish_site.py
```

La salida pública se escribe en `_site/`, con HTML, recursos, sitemap y robots. Los borradores editoriales locales y archivos de revisión siguen excluidos de Git y de la salida pública. Se exceptúan únicamente los tres documentos de contexto y coordinación enlazados arriba, que deben viajar con el repositorio; no se copian a _site/.

## Publicación

- Repositorio: https://github.com/jmorgadodev/jmorgadodev.github.io
- GitHub Pages: https://jmorgadodev.github.io/ (legado; la dirección anterior dejó de ser canónica)
- Cloudflare Pages: https://jmorgado.pages.dev/ (canónico), proyecto `jmorgado` conectado directamente al mismo repositorio.
- Rama de producción: `main`.
- GitHub Actions: `.github/workflows/pages.yml` genera `_site/`.
- Cloudflare Pages: directorio raíz vacío, comando `python3 publish_site.py`, salida `_site`.
- Las URL canónicas y el sitemap apuntan a Cloudflare Pages.

Los cambios en `main` disparan publicaciones automáticas. No se incluyen credenciales ni servicios de pago. Los estilos, scripts y contenido editorial se mantienen en sus archivos existentes.

## Contacto del QR

El QR apunta a `https://jmorgado.pages.dev/qr/`. Esta página se accede por enlace directo y lleva la indicación `noindex` para los buscadores. Tras publicarla, haz un primer envío desde el formulario y confirma el correo de activación de [FormSubmit](https://formsubmit.co/faq) en la bandeja de destino. Después comprueba la recepción con un envío de prueba.

## Ranking de Tetris

El ranking opcional usa una Pages Function y un namespace de Workers KV con el binding `TETRIS_RANKING`. Las dos direcciones públicas consultan el mismo endpoint en Cloudflare Pages. `_routes.json` reserva las invocaciones de la función para ese endpoint.

Para probar con datos locales:

```sh
python publish_site.py
npx wrangler pages dev _site --kv TETRIS_RANKING --port 8788
```

Para activarlo en producción, confirma que la cuenta usa Workers Free y vincula un namespace KV al proyecto Pages `jmorgado` como `TETRIS_RANKING` antes del despliegue. Cada marca ocupa una clave y el Top 10 se guarda en caché durante un minuto. Si la cuota gratuita se agota, el ranking muestra un aviso y el juego sigue disponible con su registro local.
