"""Comprobaciones locales sin crear capturas ni grabaciones."""
from pathlib import Path
import functools, http.server, threading, re
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parent
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
def seek(page,i,phase=.65):
    page.evaluate('''([i,f])=>{const j=document.querySelector('[data-journey]'),h=document.querySelector('.home-header').offsetHeight;scrollTo({top:scrollY+j.getBoundingClientRect().top-h+(j.offsetHeight-innerHeight+h)*(i+f)/7,behavior:'instant'});}''',[i,phase])
    page.wait_for_function('i=>document.querySelector("[data-journey]").dataset.scene===String(i+1)',arg=i)
    page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
  for w,h in [(1440,900),(768,1024),(390,844),(320,568)]:
   page=browser.new_page(viewport={'width':w,'height':h});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(base,wait_until='networkidle');assert page.locator('h1').is_visible();assert page.locator('[data-piece-id]').count()==12
   assert page.locator('[data-chapter]').count()==7
   page.evaluate('window.testPieces=[...document.querySelectorAll("[data-piece-id]")]')
   if page.locator('.is-enhanced').count():
    for i in list(range(7))+list(reversed(range(7))):
     seek(page,i,.85 if i==6 else .65)
     assert page.locator(f'[data-chapter="{i}"]').evaluate('e=>Number(getComputedStyle(e).opacity)')>.95
     assert page.evaluate('testPieces.every(p=>p.isConnected&&document.querySelector(`[data-piece-id="${p.dataset.pieceId}"]`)===p)')
     assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
    seek(page,2); foundation=page.locator('[data-piece-id="P01-brazo"]').get_attribute('transform')
    seek(page,5,.95); assert page.locator('[data-piece-id="P01-brazo"]').get_attribute('transform')==foundation
    assert all(page.locator(f'[data-piece-id^="P{i:02}-"]').evaluate('e=>Number(getComputedStyle(e).opacity)')>.99 for i in range(1,13))
    seek(page,6,.95); assert page.locator('[data-piece-id="P01-brazo"]').evaluate('e=>Number(getComputedStyle(e).opacity)')==0
    assert page.locator('[data-element="E06-semilla"]').evaluate('e=>Number(getComputedStyle(e).opacity)')>.99
   for theme in ['night','day']:
    page.locator('[data-theme-toggle]').click();assert page.locator('html').get_attribute('data-jm-theme')==theme
    page.reload();assert page.locator('html').get_attribute('data-jm-theme')==theme
   page.goto(base+'proyectos/');page.locator('[data-filter="herramientas"]').click();assert page.locator('[data-project-category]:visible').count()==2
   page.goto(base+'calculadora/');expect(page.locator('#per-run')).to_have_text('15 h 59 min');page.locator('#after-h').fill('17');expect(page.locator('#calc-state')).to_contain_text('adicional')
   assert not errors,errors
   print('Escenas, inverso, persistencia, temas, filtros y calculadora:',w,h,'OK');page.close()
  page=browser.new_page(reduced_motion='reduce',color_scheme='dark');page.goto(base);assert page.locator('html').get_attribute('data-jm-theme')=='night';assert page.locator('.is-enhanced').count()==0;assert page.locator('[data-chapter]:visible').count()==7;page.close()
  page=browser.new_page(java_script_enabled=False);page.goto(base);assert page.locator('[data-chapter]:visible').count()==7;assert page.get_by_role('heading',name='Todo comienza con una idea.').is_visible();page.close()
  page=browser.new_page()
  files=[ROOT/'index.html',*list((ROOT/'proyectos').rglob('index.html')),*list((ROOT/'servicios').rglob('index.html')),*(ROOT/x/'index.html' for x in ['metodo','calculadora','contacto','jugar'])]
  assert len(files)==24
  for file in files:
   path=file.relative_to(ROOT).as_posix();r=page.goto(base+path);assert r.status==200
   assert page.locator('[data-theme-toggle]').is_visible()
   html=BeautifulSoup(file.read_text(encoding='utf-8'),'html.parser');ids=[x['id'] for x in html.select('[id]')];assert len(ids)==len(set(ids))
  page.close();browser.close();print('24 rutas, tema global, movimiento reducido y sin JS: OK')
finally: server.shutdown()
