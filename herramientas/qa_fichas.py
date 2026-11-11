"""QA especifico de las fichas con diagramas Archify (sistema fx-*).

Comprueba, para cada ficha indicada:
  · carga real del diagrama dentro del iframe,
  · theme del sitio sincronizado con el tema interno del diagrama,
  · ocultacion de los controles internos de Archify,
  · ausencia de desbordamiento horizontal en varios anchos,
  · consola sin errores,
  · enlace de contacto y chip de portal.

Uso:  python Herramientas/qa_fichas.py [slug ...]
Requiere Playwright y Chrome (igual que qa_smoke.py).
"""
from pathlib import Path
import functools, http.server, os, sys, threading

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from site_data import FICHAS  # noqa: E402

WIDTHS = [(1440, 900), (1024, 768), (768, 1024), (390, 844), (320, 568)]


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main(slugs):
    server = http.server.ThreadingHTTPServer(
        ("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = "http://127.0.0.1:" + str(server.server_port) + "/"

    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for slug in slugs:
            url = base + "proyectos/" + slug + "/"
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            errors = []
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(url, wait_until="load")

            # 1. estructura del sistema de fichas
            assert page.locator(".fx-ficha").count() == 1, f"{slug}: falta .fx-ficha"
            assert page.locator(".fx-contact-button").count() == 1, f"{slug}: falta el bloque de contacto"
            href = page.locator(".fx-contact-button").get_attribute("href")
            assert href and href.endswith("/contacto/"), f"{slug}: el CTA no apunta a /contacto/ ({href})"
            if FICHAS[slug].get("site"):
                if page.locator("dialog.project-portal").count():
                    # Ficha con portal embebido.
                    chip = page.locator("[data-project-portal]").first
                    assert page.locator("[data-project-portal]").count() >= 1, f"{slug}: falta el chip del portal"
                    chip.click()
                    dialog = page.get_by_role("dialog")
                    expect(dialog).to_be_visible()
                    assert dialog.get_by_role("link", name="Abrir en otra pestaña").count() == 1, (
                        f"{slug}: el portal no ofrece abrir en otra pestana")
                    dialog.get_by_role("button", name="Cerrar").click()
                    expect(dialog).not_to_be_visible()
                else:
                    # Ficha sin portal: el sitio se abre en otra pestana.
                    external = page.locator("a.fx-portal--external")
                    assert external.count() == 1, f"{slug}: falta el enlace externo al sitio"
                    assert external.get_attribute("target") == "_blank", f"{slug}: el enlace no abre en otra pestana"
                    assert "noopener" in (external.get_attribute("rel") or ""), f"{slug}: falta rel=noopener"
                    assert page.locator("[data-project-portal]").count() == 0, f"{slug}: no debe abrir el portal"

            # 2. diagramas: carga, tema y controles internos (solo si la ficha los lleva)
            usa_diagrama = any(s["type"] in ("diagrama", "perspectivas") for s in FICHAS[slug]["sections"])
            scopes = page.locator("[data-archify-scope]")
            frames = page.locator("[data-archify-frame]")
            if usa_diagrama:
                assert scopes.count() >= 1, f"{slug}: falta el ambito de diagramas"
                assert frames.count() >= 1, f"{slug}: falta el iframe del diagrama"
            else:
                assert scopes.count() == 0, f"{slug}: la ficha no declara diagrama"

            loaded = 0
            for i in range(frames.count()):
                frame = frames.nth(i)
                if frame.get_attribute("hidden") is not None:
                    continue  # diagrama en segundo plano: se activa desde su pestaña
                frame.scroll_into_view_if_needed()
                page.wait_for_timeout(400)
                try:
                    page.wait_for_function(
                        "i => { const f=document.querySelectorAll('[data-archify-frame]')[i];"
                        " return f && f.contentDocument && f.contentDocument.querySelector('svg'); }",
                        arg=i, timeout=15000)
                except Exception:
                    pass
                has_svg = page.evaluate(
                    "i => { const f=document.querySelectorAll('[data-archify-frame]')[i];"
                    " return !!(f && f.contentDocument && f.contentDocument.querySelector('svg')); }", i)
                if has_svg:
                    loaded += 1
                    page.wait_for_timeout(600)
                    theme = page.evaluate(
                        "i => { const f=document.querySelectorAll('[data-archify-frame]')[i];"
                        " return f.contentDocument.documentElement.dataset.theme; }", i)
                    site_theme = page.evaluate("() => document.documentElement.dataset.jmTheme")
                    assert theme == ("dark" if site_theme == "night" else "light"), (
                        f"{slug}: el diagrama no acompana el tema del sitio ({theme} vs {site_theme})")
                    hidden = page.evaluate(
                        "i => { const d=document.querySelectorAll('[data-archify-frame]')[i].contentDocument;"
                        " const b=d.getElementById('btn-theme');"
                        " return !b || getComputedStyle(b).display === 'none'; }", i)
                    assert hidden, f"{slug}: el control interno de tema sigue visible"
            if usa_diagrama:
                assert loaded >= 1, f"{slug}: ningun diagrama cargo dentro del iframe"

            # 2b. pestañas: al activarlas, el diagrama debe montarse y quedar visible
            tabs = page.locator("[data-archify-view]")
            for i in range(tabs.count()):
                if tabs.nth(i).get_attribute("aria-selected") == "true":
                    continue
                tabs.nth(i).click()
                page.wait_for_timeout(600)
                frame = frames.nth(i)
                frame.scroll_into_view_if_needed()
                page.wait_for_timeout(600)
                has_svg = page.evaluate(
                    "i => { const f=document.querySelectorAll('[data-archify-frame]')[i];"
                    " return !!(f && f.contentDocument && f.contentDocument.querySelector('svg')); }", i)
                assert has_svg, f"{slug}: la pestana {i} no monto su diagrama"

            # 3. cambio de tema real
            if usa_diagrama:
                page.locator("[data-theme-toggle]").click()
                page.wait_for_timeout(500)
                sync = page.evaluate(
                    "() => { const f=document.querySelector('[data-archify-frame]');"
                    " const d=f && f.contentDocument;"
                    " return d ? d.documentElement.dataset.theme : null; }")
                site_theme = page.evaluate("() => document.documentElement.dataset.jmTheme")
                assert sync == ("dark" if site_theme == "night" else "light"), (
                    f"{slug}: el tema no se sincroniza tras cambiarlo ({sync} vs {site_theme})")
                page.locator("[data-theme-toggle]").click()
                page.wait_for_timeout(300)

            # 4. desbordamiento horizontal en varios anchos
            for w, h in WIDTHS:
                page.set_viewport_size({"width": w, "height": h})
                page.wait_for_timeout(250)
                overflow = page.evaluate(
                    "() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
                assert overflow <= 1, f"{slug}: desbordamiento horizontal de {overflow}px a {w}px"

            assert not errors, f"{slug}: errores de consola: {errors}"
            detalle = "diagrama, " if usa_diagrama else "enlace al sitio, "
            print(f"{slug}: {detalle}tema, contacto y responsive OK")
            page.close()
        browser.close()
    server.shutdown()
    if failures:
        print("FALLOS:", failures)
        return 1
    return 0


if __name__ == "__main__":
    # por defecto se revisan todas las fichas declaradas en site_data.FICHAS
    objetivo = sys.argv[1:] or sorted(FICHAS.keys())
    raise SystemExit(main(objetivo))
