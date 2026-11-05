"""Smoke tests reproducibles del sitio local JMorgado; no modifica otros proyectos."""
import functools
import http.server
import threading
import re
from pathlib import Path
from urllib.request import urlopen
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parent
CHROME=Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
REVISION=ROOT/"_revision"
REVISION.mkdir(exist_ok=True)
home=BeautifulSoup((ROOT/"index.html").read_text(encoding="utf-8"),"html.parser")
assert len(home.select("[data-chapter]"))==7,"La portada debe contener los siete capítulos del viaje"
assert len(home.select("[data-journey-stage]"))==1,"El escenario debe ser único"
assert len(home.select("h1"))==1,"La portada debe conservar una jerarquía de encabezados única"
assert home.select_one("#explorar") and home.select_one("#recursos"),"Faltan destinos de exploración"
assert home.select_one('[href="https://github.com/jmorgadodev/AuditaPC"]')
assert home.select_one('[href="https://github.com/jmorgadodev/Nokto"]')
assert home.select_one(".choice-list a"),"El selector anterior debe conservarse"
assert home.select_one('[data-journey]').find_next_sibling('section').get('id')=='explorar'
assert len(home.select('#explorar .feature'))==11,'Después del viaje deben aparecer directamente los proyectos reales'
assert not home.select('.explore-entry,.hero'),'La portada no debe reiniciarse después del viaje'
ids={node["id"] for node in home.select("[id]")}
assert len(ids)==len(home.select("[id]")),"Hay identificadores HTML duplicados"
for link in home.select('a[href^="#"]'):
    assert link["href"][1:] in ids,("Destino interno inexistente",link["href"])
print("JOURNEY STRUCTURE: OK")

def seek(page,index,phase=.4):
    """Read a chapter partway through its scroll range, including the short-screen layout."""
    page.evaluate("""([index,phase])=>{
      const journey=document.querySelector('[data-journey]');
      const chapter=journey.querySelectorAll('[data-chapter]')[index];
      const header=document.querySelector('.home-header').offsetHeight;
      const compact=journey.classList.contains('is-compact');
      const offset=header+(compact?journey.querySelector('.stage').offsetHeight+24:0);
      window.scrollTo({top:scrollY+chapter.getBoundingClientRect().top-offset+chapter.offsetHeight*phase,behavior:'instant'});
    }""",[index,phase])
    page.wait_for_function("index=>document.querySelector('[data-journey]').dataset.scene===String(index+1)",arg=index)
    page.evaluate("()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))")

def check_journey(page,width,height):
    page.set_viewport_size({"width":width,"height":height})
    page.goto(base,wait_until="domcontentloaded")
    expect(page.locator("[data-journey]")).to_have_class(re.compile("is-ready"))
    compact=page.locator("[data-journey]").evaluate("e=>e.classList.contains('is-compact')")
    header_height=page.locator('.home-header').bounding_box()['height']
    states=[]
    for index in range(7):
        seek(page,index,.48)
        assert page.locator("[data-scene-count]").inner_text()==f"{index+1:02}"
        states.append(int(page.locator('.journey-progress').get_attribute('aria-valuenow')))
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+1"),(width,height,index)
        # Scene text must remain readable outside the graphic region.
        copy=page.locator(f'[data-chapter="{index}"] .chapter-copy')
        assert float(copy.evaluate("e=>getComputedStyle(e).opacity"))>.9,(width,height,index)
        if not compact:
            bounds=copy.bounding_box()
            assert bounds['y']>=page.locator('.home-header').bounding_box()['height']-1,(width,index,bounds)
        if index==1:
            control=page.get_by_role('button',name='FORMATOS DISTINTOS',exact=False) if not compact else copy.locator('summary').first
            control.click()
            expect(page.locator('#journey-detail')).to_be_visible()
            assert page.locator('#journey-detail-title').inner_text()=='El mismo dato puede llegar distinto'
            page.screenshot(path=str(REVISION/f'viaje-{width}-detalle.png'))
            page.keyboard.press('Escape')
            expect(page.locator('#journey-detail')).to_be_hidden()
            seek(page,index,.48)
            expect(control).to_be_focused()
        if index==4:
            for label in ['Más fuentes','Históricos','Consulta web']:
                choice=page.locator('[data-branch]').filter(has_text=label) if not compact else copy.locator('summary').filter(has_text=label)
                choice.click()
                expect(page.locator('#journey-detail')).to_be_visible()
                expect(page.locator('[data-branch]').filter(has_text=label)).to_have_attribute('aria-pressed','true')
                page.keyboard.press('Escape')
                seek(page,index,.48)
        if index==5:
            seek(page,5,.25)
            assert 'Cambio detectado' in page.locator('[data-rule-state]').inner_text()
            seek(page,5,.85)
            assert 'Regla corregida' in page.locator('[data-rule-state]').inner_text()
            seek(page,5,.25)
            assert 'Cambio detectado' in page.locator('[data-rule-state]').inner_text(),"La corrección debe ser reversible"
            seek(page,5,.85)
        page.screenshot(path=str(REVISION/f"viaje-{width}-{index+1:02}.png"))
    assert states==sorted(states),(width,states)
    assert abs(page.locator('.home-header').bounding_box()['height']-header_height)<1,"La altura de la cabecera crece al recalcular el escenario"
    seek(page,2,.45)
    before=page.locator('[data-layer="report"]').get_attribute('style')
    seek(page,6,.5)
    seek(page,2,.45)
    assert page.locator('[data-layer="report"]').get_attribute('style')==before,"La pose depende del historial del scroll"
    # No DOM writes should continue while the visitor is standing still.
    mutations=page.evaluate("""()=>new Promise(resolve=>{
      let count=0;const observer=new MutationObserver(records=>count+=records.length);
      observer.observe(document.querySelector('.stage-world'),{attributes:true,subtree:true});
      setTimeout(()=>{observer.disconnect();resolve(count)},180);
    })""")
    assert mutations==0,("La escena sigue trabajando en reposo",mutations)
    page.locator('.journey-skip').click()
    expect(page.locator('#explorar')).to_be_focused()
    assert page.evaluate("document.activeElement.id")=='explorar'
    print("JOURNEY SCROLL + DETAILS + REVERSE + IDLE: OK",width,height,"compact" if compact else "immersive")
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
handler=functools.partial(QuietHandler,directory=str(ROOT))
server=http.server.ThreadingHTTPServer(("127.0.0.1",0),handler)
thread=threading.Thread(target=server.serve_forever,daemon=True)
thread.start()
base=f"http://127.0.0.1:{server.server_address[1]}/"
try:
    paths=sorted(p.relative_to(ROOT).as_posix() for p in ROOT.rglob("index.html"))
    assert len(paths)==23,(len(paths),paths)
    titles=set()
    for path in paths:
        html=(ROOT/path).read_text(encoding="utf-8")
        soup=BeautifulSoup(html,"html.parser")
        assert soup.title and soup.title.text.strip(),path
        assert soup.find("meta",attrs={"name":"description"}).get("content"),path
        assert soup.title.text not in titles,("title repetido",path)
        titles.add(soup.title.text)
        with urlopen(base+path) as r:
            assert r.status==200,(path,r.status)
        for link in soup.select("a[href]"):
            href=link.get("href")
            if href.startswith(("http://","https://","#","mailto:")):continue
            resolved=(ROOT/path).parent.joinpath(href).resolve()
            if href.endswith("/") or href == "":
                resolved=resolved/"index.html"
            assert resolved.is_file(),(path,href,resolved)
    print("METADATA + INTERNAL LINKS: OK",len(paths),"pages")
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=str(CHROME),headless=True,args=["--no-sandbox"])
        page=browser.new_page(viewport={"width":1440,"height":900},device_scale_factor=1)
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto(base,wait_until="domcontentloaded")
        page.screenshot(path=str(REVISION/"viaje-portada-desktop.png"))
        overflow=page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
        assert not overflow,"Desktop horizontal overflow"
        assert page.get_by_role("heading",name="Proyectos.",exact=True).count()==1
        for width,height in [(1440,900),(768,1024),(390,844),(320,568)]:
            check_journey(page,width,height)
        # Keyboard-only optional detail; leaving a scene must dismiss it.
        page.set_viewport_size({"width":1440,"height":900})
        page.goto(base,wait_until="domcontentloaded")
        first_detail=page.locator('[data-chapter="0"] summary')
        first_detail.focus()
        page.keyboard.press('Enter')
        expect(page.locator('#journey-detail')).to_be_visible()
        expect(page.locator('.detail-close')).to_be_focused()
        page.keyboard.press('Escape')
        expect(first_detail).to_be_focused()
        first_detail.press('Enter')
        seek(page,1,.45)
        expect(page.locator('#journey-detail')).to_be_hidden()
        assert errors==[],errors
        # Profile the two busiest transformations over real browser animation frames.
        session=page.context.new_cdp_session(page)
        session.send('Performance.enable')
        before_metrics={m['name']:m['value'] for m in session.send('Performance.getMetrics')['metrics']}
        page.evaluate("""async()=>{
          for(const index of [2,4]){
            const chapter=document.querySelectorAll('[data-chapter]')[index];
            const start=scrollY+chapter.getBoundingClientRect().top-document.querySelector('.home-header').offsetHeight;
            for(let frame=0;frame<60;frame++){
              window.scrollTo({top:start+chapter.offsetHeight*frame/65,behavior:'instant'});
              await new Promise(requestAnimationFrame);
            }
          }
        }""")
        after_metrics={m['name']:m['value'] for m in session.send('Performance.getMetrics')['metrics']}
        print('SCROLL PROFILE (120 frames):', {name:round((after_metrics[name]-before_metrics[name])*1000,1) for name in ['ScriptDuration','LayoutDuration','RecalcStyleDuration']},'ms total')
        session.detach()
        # Motion preference is honored on load and when changed at runtime.
        page.emulate_media(reduced_motion='reduce')
        page.goto(base,wait_until="domcontentloaded")
        expect(page.locator('[data-journey]')).to_have_class(re.compile('is-compact'))
        assert page.locator('.stage-world').bounding_box()['width']>200,'El gráfico compacto debe mantener una anchura visible'
        for index in range(7):
            seek(page,index,.2)
            stable=page.locator('.j-object').evaluate_all("nodes=>nodes.map(n=>n.style.transform)")
            seek(page,index,.6)
            assert stable==page.locator('.j-object').evaluate_all("nodes=>nodes.map(n=>n.style.transform)"),("Movimiento reducido",index)
        page.emulate_media(reduced_motion='no-preference')
        expect(page.locator('[data-journey]')).not_to_have_class(re.compile('is-compact'))
        # A new load at a chapter anchor must restore the graphic and scene count.
        page.goto(base+'#escena-05',wait_until='domcontentloaded')
        expect(page.locator('[data-scene-count]')).to_have_text('05')
        # Plain HTML remains usable with scripts disabled.
        plain=browser.new_page(java_script_enabled=False,viewport={"width":390,"height":844})
        plain.goto(base,wait_until='domcontentloaded')
        assert plain.locator('[data-chapter]').count()==7
        plain.locator('[data-chapter="0"] summary').click()
        expect(plain.get_by_role('heading',name='No es sólo un informe',exact=True)).to_be_visible()
        expect(plain.locator('[data-nav]')).to_be_visible()
        assert not plain.evaluate('document.documentElement.scrollWidth>innerWidth+1')
        plain.close()
        print('KEYBOARD + REDUCED MOTION + ANCHOR RESTORE + NO JAVASCRIPT: OK')
        # Text enlargement must choose flowing prose and avoid horizontal clipping.
        page.goto(base,wait_until='domcontentloaded')
        page.add_style_tag(content='html{font-size:200%}')
        expect(page.locator('[data-journey]')).to_have_class(re.compile('is-compact'))
        page.screenshot(path=str(REVISION/'viaje-texto-200.png'))
        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),page.evaluate("""()=>[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,left:e.getBoundingClientRect().left})).filter(e=>e.right>innerWidth+1||e.left<0).slice(0,20)""")
        page.goto(base,wait_until='domcontentloaded')
        print('TEXT ENLARGEMENT 200%: OK')
        page.set_viewport_size({"width":1440,"height":900})
        page.goto(base+"proyectos/",wait_until="domcontentloaded")
        assert page.locator("[data-project-category]").count()==11
        page.get_by_role("button",name="Herramientas").click()
        assert page.locator("[data-project-category]:visible").count()==2
        page.get_by_role("button",name="Todos").click()
        assert page.locator("[data-project-category]:visible").count()==11
        page.goto(base+"calculadora/",wait_until="domcontentloaded")
        assert "15 h 59 min" in page.locator("#per-run").inner_text()
        page.locator("#period").select_option("day")
        assert page.locator("#days-field").is_visible()
        page.locator("#after-h").fill("17")
        assert "adicional" in page.locator("#calc-state").inner_text().lower()
        page.locator("#after-h").fill("0")
        page.locator("summary").click()
        page.locator("#hour-cost").fill("10000")
        assert page.locator("#money-output").is_visible()
        mobile=browser.new_page(viewport={"width":390,"height":844},device_scale_factor=1,is_mobile=True,has_touch=True)
        mobile.goto(base,wait_until="domcontentloaded")
        mobile.locator("[data-menu-toggle]").click()
        assert mobile.locator("[data-nav]").get_attribute("data-open")=="true"
        mobile.locator("[data-nav]").get_by_text("Proyectos",exact=True).click()
        assert "/proyectos/" in mobile.url
        mobile.goto(base+"proyectos/impulsacv/",wait_until="domcontentloaded")
        mobile.screenshot(path=str(REVISION/"viaje-regresion-ficha-mobile.png"),full_page=True)
        overflow=mobile.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
        assert not overflow,"Mobile horizontal overflow"
        for path in paths:
            mobile.goto(base+path,wait_until="domcontentloaded")
            overflow=mobile.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
            assert not overflow,("Mobile horizontal overflow",path)
        print("RESPONSIVE MOBILE: OK",len(paths),"pages")
        browser.close()
    print("BROWSER SMOKE: OK",base)
    print("SCREENSHOTS:",str(REVISION))
finally:
    server.shutdown()
