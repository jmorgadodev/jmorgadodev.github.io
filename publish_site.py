"""Genera una salida pública común para GitHub Pages y Cloudflare Pages."""
from pathlib import Path
import runpy
import shutil
from xml.etree.ElementTree import Element, SubElement, ElementTree

from site_data import LEGACY_TOOL_SLUGS, PROJECTS, SERVICES

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "_site"
runpy.run_path(str(ROOT / "build_site.py"), run_name="__main__")
OUT.mkdir(exist_ok=True)

canonical = [
    "", "proyectos", "servicios", "metodo", "calculadora", "contacto", "herramientas", "jugar",
    *(f"proyectos/{project['slug']}" for project in PROJECTS),
    *(f"servicios/{service['slug']}" for service in SERVICES),
]
redirects = [f"proyectos/{slug}" for slug in LEGACY_TOOL_SLUGS]
routes = canonical + redirects
assert len(routes) == len(set(routes)) == 26, "El sitio debe conservar sus 26 rutas"

urls = Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
for route in routes:
    relative = Path(route) / "index.html"
    target = OUT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / relative, target)
    if route in canonical:
        url = "https://jmorgado.pages.dev/" + (route + "/" if route else "")
        SubElement(SubElement(urls, "url"), "loc").text = url
shutil.copytree(ROOT / "assets", OUT / "assets", dirs_exist_ok=True)
shutil.copy2(ROOT / "404.html", OUT / "404.html")
ElementTree(urls).write(OUT / "sitemap.xml", encoding="utf-8", xml_declaration=True)
(OUT / "robots.txt").write_text("User-agent: *\nAllow: /\nSitemap: https://jmorgado.pages.dev/sitemap.xml\n", encoding="utf-8")
(OUT / "_routes.json").write_text('{"version":1,"include":["/api/tetris/ranking"],"exclude":[]}\n', encoding="utf-8")
(OUT / ".nojekyll").touch()
print(f"Salida pública: _site/ ({len(canonical)} páginas, {len(redirects)} redirecciones)")
