# JMorgado

Fuente de la web estática de Jorge Morgado. Python estándar genera las 23 rutas existentes; no se requiere instalar dependencias para publicar.

## Generación

```sh
python publish_site.py
```

La salida pública se escribe en `_site/`, con HTML, recursos, sitemap y robots. Los borradores editoriales locales y archivos de revisión están excluidos de Git y de la salida pública.

## Publicación

- Repositorio: https://github.com/jmorgadodev/jmorgadodev.github.io
- GitHub Pages: https://jmorgadodev.github.io/ (principal)
- Cloudflare Pages: https://jmorgadodev.pages.dev/ (secundario), proyecto `jmorgadodev` conectado directamente al mismo repositorio.
- Rama de producción: `main`.
- GitHub Actions: `.github/workflows/pages.yml` genera y publica `_site/` en cada push a main.
- Cloudflare Pages: directorio raíz vacío, comando `python3 publish_site.py`, salida `_site`.
- Las URL canónicas y el sitemap apuntan a GitHub Pages en ambos alojamientos.

Los cambios en `main` disparan publicaciones automáticas. No se incluyen credenciales ni servicios de pago. Los estilos, scripts y contenido editorial se mantienen en sus archivos existentes.
