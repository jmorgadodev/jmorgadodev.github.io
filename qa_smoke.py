"""QA local de rutas, escena, portafolio y juego. Requiere Playwright, Chrome y bs4."""
from pathlib import Path
import functools, http.server, os, threading
from urllib.parse import urlsplit
from xml.etree.ElementTree import parse
from site_data import LEGACY_TOOL_SLUGS, PROJECTS, SERVICES, TOOLS
from playwright.sync_api import sync_playwright, expect
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent
# Contrato editorial del inicio: conservar las siete frases y descripciones de
# la versión respaldada antes de la intervención del 7 de noviembre.
from journey_study import TITLES as INTRO_TITLES, DESCRIPTIONS as INTRO_DESCRIPTIONS
ORIGINAL_TITLES = [
    ("Hay algo que podría", "funcionar mejor."),
    ("Antes de cambiar algo,", "hay que entenderlo."),
    ("Empezar por algo", "que funcione."),
    ("Lo que funciona puede", ""),  # CRECER se dibuja en Canvas
    ("Una buena base abre", "nuevos caminos."),
    ("Cada pieza encuentra", "su lugar."),
    ("Todo comienza", "con una idea."),
]
ORIGINAL_DESCRIPTIONS = [
    "Una tarea que pesa. Una idea que todavía no encuentra su forma.",
    "Comprender las relaciones cambia la manera de resolver.",
    "Una solución pequeña también puede transformar el trabajo.",
    "Una buena idea se desarrolla sin empezar otra vez.",
    "Cada nueva capacidad amplía las posibilidades.",
    "Las partes se convierten en un conjunto.",
    "",
]
assert INTRO_TITLES == ORIGINAL_TITLES, "Los titulares del inicio cambiaron"
assert INTRO_DESCRIPTIONS == ORIGINAL_DESCRIPTIONS, "Las descripciones originales cambiaron"
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(
    ('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(server.server_port)+'/'

def seek(page,p):
    page.evaluate("""p=>{
        document.documentElement.style.scrollBehavior='auto';
        const s=ScrollTrigger.getById('jmorgado-journey');
        scrollTo(0,s.start+(s.end-s.start)*p);
        ScrollTrigger.update();
    }""",p)
    page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')

VIEWPORTS = [(1440,900),(768,1024),(390,844),(320,568),(844,390)]
ARTIFACTS = os.environ.get("JMORGADO_QA_ARTIFACTS")

def no_overflow(page):
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), page.viewport_size

def navigation(page):
    menu = page.locator("[data-menu-toggle]")
    if menu.is_visible():
        menu.click()
        no_overflow(page)
    links = page.locator("#main-nav a")
    assert links.all_text_contents() == ["Herramientas", "Proyectos", "Servicios", "Contacto"]
    assert all(link.is_visible() for link in links.all())
    if menu.is_visible():
        menu.click()

def game_keyboard(browser):
    page = browser.new_page(reduced_motion="reduce", viewport={"width":1440,"height":900})
    page.add_init_script("Math.random=()=>.63")
    page.goto(base+"jugar/")
    root = page.locator("[data-tetris]")
    expect(root).to_have_attribute("data-game-state", "idle")
    page.get_by_role("button", name="Empezar").click()
    expect(root).to_have_attribute("data-game-state", "playing")
    board = page.locator(".game-board")
    expect(board).to_be_focused()
    canvas = page.locator("[data-board]")
    before = canvas.evaluate("e=>e.toDataURL()")
    page.keyboard.press("ArrowLeft")
    assert canvas.evaluate("e=>e.toDataURL()") != before
    page.keyboard.press("ArrowRight")
    assert canvas.evaluate("e=>e.toDataURL()") == before
    page.keyboard.press("ArrowDown")
    expect(page.locator('[data-stat="score"]')).to_have_text("1")
    page.keyboard.press("KeyC")
    assert page.locator("[data-hold]").get_attribute("aria-label").startswith("Pieza en reserva")
    page.keyboard.press("Space")
    assert int(page.locator('[data-stat="score"]').inner_text()) > 1
    page.keyboard.press("Escape")
    expect(root).to_have_attribute("data-game-state", "paused")
    page.keyboard.press("Escape")
    expect(root).to_have_attribute("data-game-state", "playing")
    page.evaluate("""()=>{
      Object.defineProperty(document,'hidden',{configurable:true,value:true});
      document.dispatchEvent(new Event('visibilitychange'));
      delete document.hidden;
    }""")
    expect(root).to_have_attribute("data-game-state", "paused")
    page.get_by_role("button", name="Configurar controles").click()
    dialog = page.get_by_role("dialog")
    left = dialog.locator('[data-bind="left"]')
    left.click()
    page.keyboard.press("ArrowRight")
    expect(dialog.get_by_role("status")).to_contain_text("ya está asignada")
    page.keyboard.press("Escape")
    expect(dialog).to_be_visible()
    expect(left).to_have_text("←")
    left.click()
    page.keyboard.press("KeyA")
    expect(left).to_have_text("A")
    dialog.get_by_role("button", name="Guardar y cerrar").click()
    expect(dialog).not_to_be_visible()
    page.wait_for_function("JSON.parse(localStorage.getItem('jmorgado.tetris.controls.v1'))?.keys.left==='KeyA'")
    record = page.locator('[data-stat="best"]').inner_text()
    page.reload()
    expect(root).to_have_attribute("data-game-state", "idle")
    expect(page.locator('[data-stat="best"]')).to_have_text(record)
    page.get_by_role("button", name="Configurar controles").click()
    expect(left).to_have_text("A")
    dialog.get_by_role("button", name="Restablecer controles").click()
    expect(left).to_have_text("←")
    dialog.get_by_role("button", name="Guardar y cerrar").click()
    page.get_by_role("button", name="Empezar").click()
    for _ in range(45):
        if root.get_attribute("data-game-state") == "over":
            break
        page.keyboard.press("Space")
    expect(root).to_have_attribute("data-game-state", "over")
    expect(page.get_by_role("button", name="Jugar de nuevo")).to_be_visible()
    page.get_by_role("button", name="Jugar de nuevo").click()
    expect(root).to_have_attribute("data-game-state", "playing")
    expect(page.locator('[data-stat="score"]')).to_have_text("0")
    page.keyboard.press("ArrowDown")
    page.get_by_role("button", name="Reiniciar").click()
    expect(page.locator('[data-stat="score"]')).to_have_text("0")
    page.locator("[data-touch-option]").focus()
    page.keyboard.press("Space")
    expect(page.locator("[data-touch-option]")).to_be_checked()
    expect(page.locator('[data-stat="score"]')).to_have_text("0")
    page.evaluate("""()=>{
      localStorage.setItem('jmorgado.tetris.controls.v1','{malformed');
      localStorage.setItem('jmorgado.tetris.best.v1','-42');
    }""")
    page.reload()
    expect(page.locator('[data-stat="best"]')).to_have_text("0")
    page.get_by_role("button", name="Configurar controles").click()
    expect(left).to_have_text("←")
    page.close()
    print("Juego con teclado, pausa de pestaña, configuración, guardado y reinicio OK")

def game_touch(browser):
    page = browser.new_page(viewport={"width":390,"height":844}, has_touch=True, is_mobile=True, reduced_motion="reduce")
    page.goto(base+"jugar/")
    option = page.locator("[data-touch-option]")
    expect(option).to_be_checked()
    option.uncheck()
    expect(page.locator(".game-touch")).not_to_be_visible()
    option.check()
    page.get_by_role("button", name="Empezar").tap()
    soft = page.locator('[data-touch="soft"]')
    soft.scroll_into_view_if_needed()
    box = soft.bounding_box()
    cdp = page.context.new_cdp_session(page)
    point = {"x": box["x"] + box["width"]/2, "y": box["y"] + box["height"]/2}
    cdp.send("Input.dispatchTouchEvent", {"type":"touchStart","touchPoints":[point]})
    page.wait_for_function("Number(document.querySelector('[data-stat=score]').textContent)>=3")
    cdp.send("Input.dispatchTouchEvent", {"type":"touchCancel","touchPoints":[]})
    stopped = page.locator('[data-stat="score"]').inner_text()
    page.wait_for_timeout(180)
    expect(page.locator('[data-stat="score"]')).to_have_text(stopped)
    page.locator('[data-touch="hard"]').tap()
    after = int(page.locator('[data-stat="score"]').inner_text())
    assert 0 < after-int(stopped) <= 40
    page.locator('[data-touch="hold"]').tap()
    assert page.locator("[data-hold]").get_attribute("aria-label").startswith("Pieza en reserva")
    page.reload()
    expect(option).to_be_checked()
    page.close()
    print("Pulsación táctil, repetición, cancelación y persistencia OK")

def game_layouts(browser):
    for width, height in VIEWPORTS:
        page = browser.new_page(viewport={"width":width,"height":height}, has_touch=width<=620)
        errors, external = [], []
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("request", lambda request: external.append(request.url) if urlsplit(request.url).netloc != urlsplit(base).netloc else None)
        page.goto(base+"jugar/")
        expect(page.locator(".game-shell")).to_be_visible()
        no_overflow(page)
        navigation(page)
        rect = page.locator("[data-board]").bounding_box()
        assert abs(rect["height"]-2*rect["width"]) < 2
        page.get_by_role("button", name="Configurar controles").click()
        dialog = page.get_by_role("dialog")
        expect(dialog).to_be_visible()
        assert dialog.bounding_box()["width"] < width
        page.keyboard.press("Escape")
        expect(dialog).not_to_be_visible()
        page.get_by_role("button", name="Empezar").click()
        expect(page.locator("[data-tetris]")).to_have_attribute("data-game-state","playing")
        if ARTIFACTS and width in (1440,390):
            page.keyboard.press("KeyC")
            page.keyboard.press("Space")
            page.keyboard.press("ArrowLeft")
            page.keyboard.press("ArrowLeft")
            page.keyboard.press("Space")
            page.locator(".game-shell").evaluate("e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-10,behavior:'instant'})")
            page.screenshot(path=Path(ARTIFACTS)/f"jmorgado-jugar-{width}.png")
        assert not errors,errors
        assert not external,external
        print(width,height,"juego responsive y recursos locales OK")
        page.close()

def portfolio(browser):
    page = browser.new_page()
    page.goto(base+"proyectos/")
    assert page.locator("[data-project-category]").count() == len(PROJECTS) == 9
    assert not page.locator('[data-filter="herramientas"]').count()
    assert page.get_by_role("heading",name="El Cambiómetro").count() == 1
    assert not page.get_by_role("heading",name="AuditaPC",exact=True).count()
    assert not page.get_by_role("heading",name="Nokto",exact=True).count()
    for category in ("plataformas","web","sistemas","todos"):
        page.locator(f'[data-filter="{category}"]').click()
        expected = sum(category == "todos" or project["category"] == category for project in PROJECTS)
        assert page.locator("[data-project-category]:visible").count() == expected
    page.goto(base+"herramientas/")
    for item in TOOLS:
        card = page.locator("#"+item["slug"])
        trigger = card.locator("summary")
        trigger.click()
        panel = page.get_by_role("dialog", name=item["title"])
        expect(panel).to_be_visible()
        assert panel.get_by_role("link",name="GitHub",exact=True).get_attribute("href") == item["repo"]
        assert panel.get_by_role("link",name="Documentación",exact=True).get_attribute("href") == item["docs"]
        downloads = panel.get_by_role("link",name="Descargar ZIP")
        assert downloads.count() == bool(item.get("download"))
        if item.get("download"):
            assert downloads.get_attribute("href") == item["download"]
        page.keyboard.press("Escape")
        expect(panel).not_to_be_visible()
        expect(trigger).to_be_focused()
    for slug in LEGACY_TOOL_SLUGS:
        page.goto(base+"proyectos/"+slug+"/")
        page.wait_for_url(base+"herramientas/#"+slug)
    for slug, embed in (("ryvolt", True), ("impulsacv", False)):
        project_url = base+"proyectos/"+slug+"/"
        page.goto(project_url)
        trigger = page.locator("[data-project-portal]")
        destination = trigger.get_attribute("href")
        page.route(destination, lambda route: route.fulfill(
            content_type="text/html", body="<h1>Sitio de prueba</h1>"))
        assert trigger.get_attribute("target") is None
        trigger.press("Enter")
        portal = page.get_by_role("dialog")
        expect(portal).to_be_visible()
        assert page.url == project_url and len(page.context.pages) == 1
        new_tab = portal.get_by_role("link", name="Abrir en otra pestaña")
        expect(new_tab).to_have_attribute("href", destination)
        expect(new_tab).to_have_attribute("target", "_blank")
        if embed:
            expect(portal.frame_locator("iframe").get_by_role("heading")).to_have_text("Sitio de prueba")
            night_filter = portal.get_by_role("button", name="Filtro noche")
            night_filter.click()
            expect(night_filter).to_have_attribute("aria-pressed", "true")
            expect(portal.locator("iframe")).to_have_css("filter", "invert(0.91) hue-rotate(180deg) saturate(0.85)")
            night_filter.click()
            expect(portal.locator("iframe")).to_have_css("filter", "none")
        else:
            expect(portal.get_by_text("Abre el sitio en otra pestaña para visitarlo desde esta dirección.")).to_be_visible()
            expect(portal.locator("iframe")).to_have_count(0)
            expect(portal.get_by_role("button", name="Ver capturas")).to_have_count(0)
        portal.get_by_role("button", name="Cerrar").click()
        expect(portal).not_to_be_visible()
        expect(portal.locator("iframe")).to_have_count(0)
        expect(trigger).to_be_focused()
    page.close()
    print("Catálogo, filtros, enlaces oficiales, redirecciones y visor OK")

try:
    with sync_playwright() as p:
        browser=p.chromium.launch(
            executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',
            headless=True)
        for width,height in VIEWPORTS:
            page=browser.new_page(viewport={'width':width,'height':height})
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(base,wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            assert page.locator('[data-copy]').count()==7
            rendered_copy=page.eval_on_selector_all('[data-copy]', """sections=>sections.map(s=>({
                fragments:[...s.querySelectorAll('.study-mask>span')].map(x=>x.textContent),
                description:s.querySelector('.study-description')?.textContent??''
            }))""")
            assert rendered_copy == [
                {"fragments":[part for part in title if part],"description":description}
                for title,description in zip(ORIGINAL_TITLES,ORIGINAL_DESCRIPTIONS)
            ], "El texto generado ya no coincide con el original"
            assert page.locator('#journey-title-3').get_attribute('aria-label') == 'Lo que funciona puede crecer.'
            # El primer titular aparece sin scroll; nunca debe regresar la pantalla vacía.
            first_line=page.locator('.copy-0 .study-mask>span').first
            assert first_line.evaluate(
                "e=>getComputedStyle(e).transform") in ('none','matrix(1, 0, 0, 1, 0, 0)')
            assert page.locator('.study-canvas').count()==1
            assert page.locator('canvas.study-canvas').evaluate('e=>e.width>0&&e.height>0')
            assert not page.locator('.tech-label,.study-kicker,.journey-counter').count()
            assert not errors,errors
            assert page.locator('.is-linked').count()==1
            assert page.locator('.home-header').evaluate(
                "e=>getComputedStyle(e).visibility")=='hidden'
            assert page.locator('canvas.study-canvas').evaluate(
                "e=>getComputedStyle(e).pointerEvents==='auto' && e.width>0 && e.height>0")
            rect=page.locator('canvas.study-canvas').evaluate(
                'e=>{let r=e.getBoundingClientRect();return [r.width,r.height]}')
            assert abs(rect[0]-width)<2 and abs(rect[1]-height)<2,(width,height,rect)
            midpoints=[.065,.194,.318,.439,.569,.704,.825,.939]
            expected=['Hay algo que podría','Antes de cambiar algo','Empezar por algo',
                      'Lo que funciona','Una buena base abre','Una buena base abre',
                      'Cada pieza encuentra','Todo comienza']
            for fraction,phrase,scene in zip(midpoints,expected,range(8)):
                seek(page,fraction);page.wait_for_timeout(1500)
                state=page.evaluate('''()=>{const copies=[...document.querySelectorAll('[data-copy]')];
                    const active=copies.findIndex(e=>e.getAttribute('aria-hidden')!=='true');
                    return {scene:Number(document.querySelector('[data-study]').dataset.scene),
                    active,activeText:active>=0?copies[active].innerText:'',
                    opacity:copies.map(e=>Number(getComputedStyle(e).opacity))}}''')
                expected_index=[0,1,2,3,4,4,5,6][scene]
                assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                assert state['scene']==scene,(width,height,fraction,state['scene'])
                assert state['active']==expected_index and phrase in state['activeText'],(width,height,scene,state)
                assert state['opacity'][expected_index]>.98,(width,height,scene,state['opacity'])
                if scene==1:
                    # El titular vertical / invertido fue rechazado; comprobar CSS real.
                    assert page.locator('.copy-1 .study-heading').evaluate(
                        "e=>getComputedStyle(e).transform") in ('none','matrix(1, 0, 0, 1, 0, 0)')
            seek(page,.569);page.wait_for_timeout(220)
            before=page.locator('canvas').evaluate('e=>e.toDataURL()')
            page.mouse.move(width*.5,height*.62);page.wait_for_timeout(280)
            after=page.locator('canvas').evaluate('e=>e.toDataURL()')
            assert before!=after,(width,height,'pointer interaction did not redraw canvas')
            seek(page,.99);page.wait_for_timeout(560)
            assert page.locator('.copy-6').evaluate(
                'e=>Number(getComputedStyle(e).opacity)')>.98
            page.locator('.intro-skip').click()
            assert page.locator('.home-header').evaluate('e=>!e.inert')
            headings = page.locator("main > section:not([data-study])").all()
            order = ["¿Qué necesitas resolver?", "Software de mi banco de trabajo.", "Proyectos realizados.",
                     "La pieza que todavía no llega.", "Empiezo por la fila que no cuadra.", "Una hora diaria cerrando pedidos.",
                     "Cuéntame dónde se traba el trabajo."]
            assert len(headings) == len(order)
            for section, title in zip(headings, order):
                assert title in section.locator("h2").first.inner_text()
            navigation(page)
            if ARTIFACTS and width in (1440,390):
                page.locator("#recursos").evaluate("e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-95,behavior:'instant'})")
                page.screenshot(path=Path(ARTIFACTS)/f"jmorgado-landing-{width}.png")
            page.locator('.study-theme').click()
            assert page.locator('html').get_attribute('data-jm-theme')=='night'
            seek(page,.05);page.wait_for_timeout(220)
            assert page.locator('.home-header').evaluate('e=>e.inert')
            assert not errors,errors
            print(width,height,'motion, scroll, header, accesibilidad y tema OK')
            page.close()
        touch=browser.new_page(viewport={'width':390,'height':844},has_touch=True)
        touch.goto(base,wait_until='networkidle');seek(touch,.569);touch.wait_for_timeout(220)
        before=touch.locator('canvas').evaluate('e=>e.toDataURL()')
        touch.touchscreen.tap(195,540);touch.wait_for_timeout(300)
        after=touch.locator('canvas').evaluate('e=>e.toDataURL()')
        assert before!=after,'touch ripple did not redraw canvas'
        touch.close();print('touch ripple OK')
        for settings in [dict(reduced_motion='reduce'),
                         dict(java_script_enabled=False)]:
            page=browser.new_page(**settings)
            page.goto(base)
            assert page.locator('[data-copy]:visible').count()==7
            assert page.locator('.is-linked').count()==0
            page.close()
        portfolio(browser)
        game_layouts(browser)
        game_keyboard(browser)
        game_touch(browser)
        page=browser.new_page()
        page.goto(base+'calculadora/')
        expect(page.locator('#per-run')).to_have_text('48 min')
        expect(page.locator('#per-week')).to_have_text('4 h')
        expect(page.locator('#per-year')).to_have_text('208 h')
        page.locator('#after-h').fill('17')
        expect(page.locator('#calc-state')).to_contain_text('adicional')
        routes = ["", "proyectos/", "servicios/", "metodo/", "calculadora/", "contacto/", "herramientas/", "jugar/",
                  *(f"proyectos/{p['slug']}/" for p in PROJECTS), *(f"servicios/{s['slug']}/" for s in SERVICES),
                  *(f"proyectos/{slug}/" for slug in LEGACY_TOOL_SLUGS)]
        assert len(routes) == len(set(routes)) == 26
        sitemap = parse(ROOT/"_site"/"sitemap.xml")
        assert len(sitemap.findall(".//{*}loc")) == 24
        for route in routes:
            response = page.request.get(base+route)
            assert response.status == 200
            file = ROOT/route/"index.html"
            document = BeautifulSoup(file.read_text(encoding="utf-8"),"html.parser")
            ids = [element["id"] for element in document.select("[id]")]
            assert len(ids) == len(set(ids)), str(file)
            assert bool(document.select('script[src*="tetris.js"]')) == (route == "jugar/")
            if route not in [f"proyectos/{slug}/" for slug in LEGACY_TOOL_SLUGS]:
                assert document.select_one('.footer-links a[href$="herramientas/"]')
                assert document.select_one('.footer-links a[href$="jugar/"]')
        urls = {entry.text for entry in sitemap.findall(".//{*}loc")}
        assert urls == {"https://jmorgadodev.github.io/"+route for route in routes
                        if route not in [f"proyectos/{slug}/" for slug in LEGACY_TOOL_SLUGS]}
        browser.close()
        print('26 rutas, 24 canónicas, calculadora, JS deshabilitado y movimiento reducido OK')
finally:
    server.shutdown()
