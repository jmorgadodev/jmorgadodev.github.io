"""Genera una salida pública común para GitHub Pages y Cloudflare Pages."""
from pathlib import Path
import runpy
import shutil
from xml.etree.ElementTree import Element, SubElement, ElementTree
ROOT = Path(__file__).resolve().parent
OUT = ROOT / "_site"
runpy.run_path(str(ROOT / "build_site.py"), run_name="__main__")
OUT.mkdir(exist_ok=True)
routes = [ROOT / "index.html", *sorted((ROOT / "proyectos").rglob("index.html")), *sorted((ROOT / "servicios").rglob("index.html")), *(ROOT / name / "index.html" for name in ("metodo", "calculadora", "contacto"))]
assert len(routes) == 23, "El sitio debe conservar sus 23 rutas"
urls = Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
for source in routes:
    relative = source.relative_to(ROOT)
    target = OUT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    path = relative.parent.as_posix()
    url = "https://jmorgadodev.github.io/" + (path + "/" if path != "." else "")
    SubElement(SubElement(urls, "url"), "loc").text = url
shutil.copytree(ROOT / "assets", OUT / "assets", dirs_exist_ok=True)
ElementTree(urls).write(OUT / "sitemap.xml", encoding="utf-8", xml_declaration=True)
(OUT / "robots.txt").write_text("User-agent: *\nAllow: /\nSitemap: https://jmorgadodev.github.io/sitemap.xml\n", encoding="utf-8")
(OUT / ".nojekyll").touch()
print("Salida pública: _site/ (23 páginas)")
