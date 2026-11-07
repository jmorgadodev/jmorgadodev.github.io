"""Compilador del sitio estático JMorgado.
Ejecutar: python build_site.py
Sólo escribe HTML dentro de landing/ y sus subdirectorios.
No modifica proyectos de clientes, repositorios ni DatosDemoCL.
"""
from __future__ import annotations
from hashlib import sha256
from html import escape
from pathlib import Path
import re
from site_data import PROJECTS, SERVICES, JOURNEY_SCENES

ROOT = Path(__file__).resolve().parent
PROJ = {p["slug"]: p for p in PROJECTS}
SERV = {s["slug"]: s for s in SERVICES}
LINKEDIN = "https://www.linkedin.com/in/jorge-morgado/"
def e(value): return escape(str(value), quote=True)
def local(d, p=""): return "../"*d + p
def game_asset(d, path):
    version = sha256((ROOT / path).read_bytes()).hexdigest()[:12]
    return e(local(d, path) + "?v=" + version)
def a(d,path,text,cls="link-arrow"): return f'<a class="{cls}" href="{e(local(d,path))}">{text}</a>'
def external(url, text, cls="link-arrow"): return f'<a class="{cls}" href="{e(url)}" target="_blank" rel="noopener noreferrer">{text}</a>'
def icon(name="arrow", tiny=False):
    return f'<svg class="icon{" tiny" if tiny else ""}" aria-hidden="true" focusable="false"><use href="#i-{e(name)}"></use></svg>'
SYMBOLS = """<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="0" height="0" style="position:absolute;overflow:hidden">
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 20 20 4M8 4h12v12"/></symbol>
<symbol id="i-data" viewBox="0 0 24 24"><path d="M3 6 12 2l9 4-9 4-9-4Zm0 6 9 4 9-4M3 18l9 4 9-4M3 6v12M21 6v12"/></symbol>
<symbol id="i-branch" viewBox="0 0 24 24"><path d="M4 4v16M4 7h8m0 0v10m0-10h8M12 17h8M20 4v6m0 4v6"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="20" cy="20" r="2"/></symbol>
<symbol id="i-code" viewBox="0 0 24 24"><path d="m8 5-6 7 6 7m8-14 6 7-6 7M14 3 10 21"/></symbol>
<symbol id="i-gear" viewBox="0 0 24 24"><path d="M3 7h18M3 17h18M7 3v8m10 2v8"/><circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/></symbol>
<symbol id="i-network" viewBox="0 0 24 24"><rect x="2" y="2" width="7" height="7"/><rect x="15" y="2" width="7" height="7"/><rect x="8.5" y="15" width="7" height="7"/><path d="M5.5 9v3h13V9M12 12v3"/></symbol>
<symbol id="i-support" viewBox="0 0 24 24"><path d="M3 13v-2a9 9 0 0 1 18 0v2M3 13h4v7H5a2 2 0 0 1-2-2v-5Zm18 0h-4v7h2a2 2 0 0 0 2-2v-5ZM17 20c0 2-3 2-5 2"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 5v7l5 3"/></symbol>
<symbol id="i-scan" viewBox="0 0 24 24"><path d="M2 9V3h6M16 3h6v6M22 16v5h-6M8 21H2v-5M5 12h14M8 16h8"/></symbol>
<symbol id="i-grid" viewBox="0 0 24 24"><path d="M2 2h8v8H2zM14 2h8v8h-8zM2 14h8v8H2zM14 14h8v8h-8z"/></symbol>
</svg>"""
def meta(d, title, description, active="", journey=False):
    nav_items=[("proyectos/","Proyectos","proyectos"),("servicios/","Servicios","servicios"),("metodo/","Método","metodo"),("calculadora/","Calculadora","calculadora")]
    links="".join(f'<a href="{e(local(d,u))}"'+(' aria-current="page"' if section==active else '')+f'>{e(t)}</a>' for u,t,section in nav_items)
    journey_css='<link rel="stylesheet" href="assets/journey.css">' if journey else ''
    body_class=' class="home-page"' if journey else ''
    header_class=' home-header' if journey else ''
    descriptor='Una forma de resolver' if journey else 'Desarrollo independiente<br>Software / Datos / Procesos'
    monogram='JM' if journey else 'jm'
    controls='<div class="journey-controls"><span class="journey-counter" aria-label="Escena actual"><span data-scene-count>01</span> / 07</span><a href="#explorar" class="journey-skip">Saltar el viaje ↗</a></div>' if journey else ''
    progress='<div class="journey-progress" role="progressbar" aria-label="Progreso del viaje" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-journey-progress></span></div>' if journey else ''
    head = f"""<!doctype html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} | JMorgado</title><meta name="description" content="{e(description)}">
<meta name="robots" content="index,follow"><meta name="theme-color" content="#F0EDE5">
<meta property="og:type" content="website"><meta property="og:locale" content="es_CL">
<meta property="og:title" content="{e(title)} | JMorgado"><meta property="og:description" content="{e(description)}">
<link rel="icon" type="image/svg+xml" href="{e(local(d,'assets/favicon.svg'))}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="{e(local(d,'assets/theme-init.js'))}"></script>
<link rel="stylesheet" href="{e(local(d,'assets/site.css'))}">
<link rel="stylesheet" href="{e(local(d,'assets/themes.css'))}">
</head><body{body_class}><a class="skip-link" href="#contenido">Saltar al contenido</a>{SYMBOLS}
<header class="site-header{header_class}"><div class="wrap header-inner">
<a class="wordmark" href="{e(local(d))}"><span class="mark" aria-hidden="true">{monogram}</span><span>JMorgado<span class="orange">.</span></span></a>
<div class="header-sub">{descriptor}</div>{controls}
<button type="button" class="menu-toggle" data-menu-toggle aria-controls="main-nav" aria-expanded="false">Menú +</button>
<button type="button" class="theme-toggle" data-theme-toggle aria-pressed="false" aria-label="Cambiar a modo noche">Noche</button>
<nav class="nav" id="main-nav" data-nav aria-label="Navegación principal">{links}<a class="nav-contact" href="{e(local(d,'contacto/'))}">Conversemos ↗</a></nav>
</div>{progress}</header>"""
    if journey:
        head=head.replace('</head>',journey_css+'</head>')
    return head
def foot(d, journey=False):
    extra='<script src="assets/vendor/gsap.min.js" defer></script><script src="assets/vendor/ScrollTrigger.min.js" defer></script><script src="assets/journey.js" defer></script>' if journey else ''
    return f"""<footer class="site-footer"><div class="wrap"><div class="footer-inner"><div>
<div class="footer-mark">JM<span style="color:var(--signal)">/</span></div>
<div class="footer-meta">Trabajo independiente · Soluciones digitales basadas en problemas reales.</div>
</div><div class="footer-links mono small">
<a href="{e(local(d,'proyectos/'))}">Proyectos</a><a href="{e(local(d,'servicios/'))}">Servicios</a>
<a href="{e(local(d,'metodo/'))}">Método</a><a href="{e(local(d,'calculadora/'))}">Calculadora</a>
<a href="{e(local(d,'contacto/'))}">Contacto</a></div></div>
<p class="footer-meta">© JMorgado · Sin métricas ni testimonios inventados. Repositorios y documentación oficiales en GitHub.</p>
</div></footer><script src="{e(local(d,'assets/site.js'))}" defer></script>{extra}</body></html>"""
def page(where,title,description,content,active="",journey=False):
    target=ROOT / where / "index.html" if where else ROOT / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    depth=len(Path(where).parts) if where else 0
    canonical="https://jmorgadodev.github.io/"+(where.strip("/")+"/" if where else "")
    head=meta(depth,title,description,active,journey).replace("</head>",f'<link rel="canonical" href="{canonical}"></head>')
    footer = foot(depth, journey)
    if where == "jugar":
        head = head.replace("</head>", f'<link rel="stylesheet" href="{game_asset(depth,"assets/tetris.css")}"></head>')
        footer = footer.replace("</body>", f'<script src="{game_asset(depth,"assets/tetris.js")}" defer></script></body>')
    target.write_text(head+f'<main id="contenido">{content}</main>'+footer,encoding="utf-8")
    print("PAGE",target.relative_to(ROOT))
def overline(number,caption):
    return f'<div class="overline"><span class="num">{e(number)} / {e(caption)}</span></div>'
def crumb(d, parts):
    out=['<nav class="breadcrumb" aria-label="Ruta de navegación">',f'<a href="{e(local(d))}">Inicio</a>']
    for path,title in parts:
        out.append('<span aria-hidden="true">/</span>')
        if path:out.append(f'<a href="{e(local(d,path))}">{e(title)}</a>')
        else:out.append(f'<span aria-current="page">{e(title)}</span>')
    return "".join(out)+"</nav>"
def entry(d,p,idx,mini=False):
    url=local(d,"proyectos/"+p["slug"]+"/")
    if mini:
        return f"""<a class="feature" href="{e(url)}">
        <span class="feature-no">{idx:02d} /</span><div><span class="feature-type">{e(p["label"])} · {e(p["area"])}</span><h3>{e(p["title"])}</h3></div>
        <p class="feature-desc">{e(p["summary"])}</p><span class="feature-arrow">{icon("arrow")}</span></a>"""
    return f"""<a class="project-row" data-project-category="{e(p['category'])}" href="{e(url)}">
    <span class="index-number">{idx:02d}</span><div><h2>{e(p["title"])}</h2><span class="mono small muted">{e(p["label"])}</span></div>
    <p>{e(p["summary"])}</p><span class="category">{e(p["area"])}<br>{e(p["state"])}</span>
    <span class="row-link">{icon("arrow")}</span></a>"""
def journey_markup():
    from journey_view import render_journey
    return render_journey(JOURNEY_SCENES)

def home():
    d=0
    main=f"""<section class="section home-projects" id="explorar" tabindex="-1" aria-labelledby="projects-title"><div class="wrap">
    <div class="section-head"><h2 id="projects-title">Proyectos.</h2><p>ImpulsaCV reúne flujos de empleabilidad; El Cambiómetro transforma fuentes públicas en datos consultables; Conecta integra marcas, contenido y APIs. Puedes entrar en cada proyecto para conocer el trabajo detrás de la pantalla.</p></div>
    <div class="feature-list">{''.join(entry(d,p,i,True) for i,p in enumerate(PROJECTS,1))}</div>
    <p style="margin-top:2rem">{a(d,"proyectos/","Explorar por categoría "+icon("arrow",True))}</p>
    <div class="portfolio-about"><h3>Jorge Morgado.</h3>
    <p class="lead">Soy Jorge Morgado. Me contactan para resolver cosas concretas: datos que necesitan orden, aplicaciones que no se conectan, una web que falta o una tarea que se repite todos los días. He construido desde catálogos administrados con Sheets hasta plataformas con usuarios y APIs. La solución depende del problema, no de la tecnología de moda.</p>
    <details class="portfolio-situations"><summary>¿Qué te trae por aquí?</summary>
    <div class="choice-list">
    <a href="{e(local(d,'servicios/datos-y-bi/'))}"><span>01 / Planillas, datos y reportes</span>{icon('arrow',True)}</a>
    <a href="{e(local(d,'servicios/automatizacion/'))}"><span>02 / Tareas repetitivas</span>{icon('arrow',True)}</a>
    <a href="{e(local(d,'servicios/integraciones/'))}"><span>03 / Herramientas desconectadas</span>{icon('arrow',True)}</a>
    <a href="{e(local(d,'servicios/desarrollo-web/'))}"><span>04 / Una web o aplicación propia</span>{icon('arrow',True)}</a>
    <a href="{e(local(d,'servicios/soporte-ti/'))}"><span>05 / Un problema técnico puntual</span>{icon('arrow',True)}</a>
    </div>
    </details><p>¿No sabes cómo llamarlo? Descríbeme qué pasa. Primero conversamos. Esa orientación inicial no tiene costo.</p>
    {a(d,"contacto/","Contarme el problema "+icon("arrow",True))}</div></div></section>
    <section class="section"><div class="wrap">{overline("02","Cómo puedo aportar")}
    <div class="section-head"><h2>Si basta con Power Query, no te voy a vender un agente.</h2><p>He trabajado con Excel, Python, n8n, Make, servicios en la nube y desarrollo propio. No todas esas herramientas se necesitan juntas: elijo según el trabajo que haya que resolver.</p></div>
    <div class="rule-grid">
      <div class="rule"><div class="rule-icon">{icon("data")}</div><h3>Datos y procesos</h3><p>Planillas, consolidación, limpieza, ETL, dashboards y reportes que no dependan de copiar y pegar todos los días.</p>{a(d,"servicios/datos-y-bi/","Ver el enfoque "+icon("arrow",True))}</div>
      <div class="rule"><div class="rule-icon">{icon("network")}</div><h3>Conexiones reales</h3><p>Python, APIs, Apps Script, n8n o Make. Lo importante es qué entra, qué ocurre y cómo se comprueba el resultado.</p>{a(d,"servicios/integraciones/","Ver el enfoque "+icon("arrow",True))}</div>
      <div class="rule"><div class="rule-icon">{icon("code")}</div><h3>Software a medida</h3><p>Desde una web corporativa hasta un producto con usuarios, estados, backend y funcionamiento propio.</p>{a(d,"servicios/desarrollo-web/","Ver el enfoque "+icon("arrow",True))}</div>
    </div><p style="margin-top:2rem">{a(d,"servicios/","Ver todos los servicios "+icon("arrow",True))}</p></div></section>
    <section class="ink-panel" id="recursos"><div class="wrap">{overline("03","Herramientas propias")}
    <div class="statement"><div><h2>Herramientas que puedes revisar por dentro<span style="color:var(--signal)">.</span></h2>
    <p class="lead">AuditaPC y Nokto son proyectos locales para Windows. Cada repositorio reúne su código, instrucciones y versiones; aquí sólo explico qué resuelven.</p></div>
    <div><p class="mono small">AUDITAPC / NOKTO</p><p>No hay una biblioteca de descargas duplicada. Los enlaces van al GitHub oficial de cada proyecto.</p>
    {a(d,"proyectos/","Ver las fichas "+icon("arrow",True),"button")}<div class="resource-repos">{external(PROJ['auditapc']['repo'],'AuditaPC en GitHub ↗')}{external(PROJ['nokto']['repo'],'Nokto en GitHub ↗')}</div></div></div></div></section>
    <section class="section"><div class="wrap">{overline("04","Una forma de trabajar")}
    <div class="section-head"><h2>El primer paso no es pedirme una cotización.</h2><p>Cuéntame qué está pasando: qué haces hoy, dónde se atasca el trabajo y qué te gustaría conseguir. La conversación inicial es gratuita; el trabajo técnico se acuerda después.</p></div>
    <ol class="step-list"><li><h3>Conversar</h3><p>Qué pasa hoy y qué debería mejorar.</p></li><li><h3>Comprender</h3><p>Flujo, datos, personas y límites.</p></li><li><h3>Proponer</h3><p>Alternativas proporcionadas.</p></li><li><h3>Acordar</h3><p>Alcance, costos y condiciones.</p></li><li><h3>Entregar</h3><p>Probar, explicar y documentar.</p></li></ol>
    {a(d,"metodo/","Cómo trabajo con clientes "+icon("arrow",True))}</div></section>
    <section class="ink-panel"><div class="wrap">{overline("05","Tiempo recuperado")}
    <div class="statement"><div><h2>¿Cuánto tiempo te ocupa esa tarea que siempre vuelve?</h2><p class="lead">La calculadora permite contrastar tiempo activo, frecuencia, personas e intervención humana posterior. El ejemplo es hipotético; los resultados reales dependen de cada proceso.</p></div>
    <div>{a(d,"calculadora/","Abrir calculadora "+icon("arrow",True),"button")}</div></div></div></section>
    <section class="section" id="una-partida" aria-labelledby="game-invite-title"><div class="wrap">
    <div class="section-head"><h2 id="game-invite-title">Pausa de Tetris<span class="orange">.</span></h2>
    <p>Me gusta pensar qué espacio dejar para la próxima pieza. Te invito a una partida para probar tu mejor puntaje.</p></div>
    {a(d,"jugar/","Probar una partida "+icon("arrow",True),"button")}</div></section>
    <section class="section"><div class="wrap"><div class="contact-board"><div><span class="eyebrow" style="color:var(--ink)">06 / Conversación inicial</span>
    <h2>Descríbeme el problema como lo contarías en tu trabajo.</h2></div><div><p>No hace falta que sepas si necesitas una app, un flujo de Make o una fórmula en Excel. La primera conversación es gratuita; el trabajo técnico se acuerda aparte.</p>
    {a(d,"contacto/","Hablemos "+icon("arrow",True),"button dark")}</div></div></div></section>"""
    page("","Soluciones digitales, automatización y desarrollo a medida","Desarrollo web, automatización, datos, integraciones y herramientas reales. Conoce los proyectos de JMorgado y solicita un diagnóstico inicial gratuito.",journey_markup()+main,journey=True)
def portfolio():
    d=1
    cats=[("todos","Todos"),("plataformas","Plataformas"),("web","Web y catálogos"),("sistemas","Sistemas"),("herramientas","Herramientas")]
    buttons="".join(f'<button class="filter-btn" type="button" data-filter="{e(k)}" aria-pressed="{"true" if i==0 else "false"}">{e(v)}</button>' for i,(k,v) in enumerate(cats))
    body=f"""<section class="page-hero"><div class="wrap">{crumb(d,[("", "Proyectos")])}<span class="eyebrow">Trabajo que existe / Alcances reales</span><h1>Archivo de proyectos<span class="orange">.</span></h1>
    <p class="lead">Productos web, ingeniería de datos, integraciones, herramientas de escritorio y sistemas en tiempo real. Cada ficha identifica el problema, el trabajo desarrollado y lo que no debe darse por supuesto.</p>
    <div class="page-meta"><span>11 proyectos documentados</span><span>Fuente: proyectos y documentación revisados</span></div></div></section>
    <section class="section"><div class="wrap">{overline("Índice","Explorar por tipo de problema")}
    <div class="project-toolbar"><div class="filter-row" role="group" aria-label="Filtrar proyectos">{buttons}</div>
    <p class="mono small muted">Selecciona una categoría · Accede a la ficha completa</p></div>
    <div class="project-index">{''.join(entry(d,p,i) for i,p in enumerate(PROJECTS,1))}</div>
    <p class="small muted">Algunos proyectos no tienen URL pública confirmada; se presentan por el trabajo documentado, no como productos publicados.</p></div></section>"""
    page("proyectos","Proyectos de desarrollo web, datos, automatización y software","Portafolio de JMorgado: ImpulsaCV, Cambiómetro, Conecta, Ryvolt, AuditaPC, Nokto y otros proyectos con contexto técnico y límites verificables.",body,"proyectos")
CASE_HEADLINES = {
    'impulsacv':'Un recorrido laboral que no debería estar fragmentado.',
    'el-cambiometro':'Datos públicos, fuentes distintas, una lectura más clara.',
    'conecta':'Varias marcas. Un problema de coordinación.',
    'ryvolt':'Dos registros visuales para explicar una misma marca.',
    'flor-de-almendro':'Actualizar productos sin añadir otra plataforma que administrar.',
    'exo-dream':'Una experiencia que cambia junto con su contenido.',
    'tobys-warehouse':'Todos necesitan consultar el mismo resultado.',
    'kooke-portal':'Unir metadatos y medios sin perder el catálogo.',
    'kooke-rrss':'La planificación editorial también tiene flujo de datos.',
    'auditapc':'Del levantamiento técnico al informe entregable.',
    'nokto':'Un escritorio con información y acciones locales.',
}
def project_detail(p):
    d=2
    quick=f'<dt>Tipo</dt><dd>{e(p["label"])}</dd><dt>Estado documental</dt><dd>{e(p["state"])}</dd><dt>Área</dt><dd>{e(p["area"])}</dd>'
    links=[]
    if p["site"]:links.append(external(p["site"],"Abrir proyecto "+icon("arrow",True),"button dark"))
    if p["repo"]:links.append(external(p["repo"],"Ver código y documentación en GitHub "+icon("arrow",True),"button"))
    if not links:links.append('<p class="hint">Sin enlace de producción público confirmado. No se publica URL por inferencia.</p>')
    flow="".join(f'<div class="flowstep"><span class="flow-index">0{i} / PASO</span><strong>{e(text)}</strong></div>' for i,text in enumerate(p["flow"],1))
    tags="".join(f'<span class="tag">{e(x)}</span>' for x in p["tech"])
    related=SERV[p["related"]]
    body=f"""<section class="page-hero tone-{e(p['accent'])}"><div class="wrap">{crumb(d,[("proyectos/","Proyectos"),(None,p["title"])])}
    <div class="eyebrow">{e(p["area"])} / {e(p["label"])}</div><h1>{e(p["title"])}<span class="orange">.</span></h1>
    <p class="lead">{e(p["summary"])}</p>
    <div class="page-meta"><span>{e(p["state"])}</span><span>Estudio de caso / alcance documental</span></div></div></section>
    <section class="section"><div class="wrap">{overline("01","Qué se resolvió")}
    <div class="case-layout"><article class="prose"><h2>{e(CASE_HEADLINES[p['slug']])}</h2><p>{e(p["problem"])}</p>
    <h3>Trabajo desarrollado</h3><p>{e(p["work"])}</p>
    <div class="tag-list">{tags}</div></article>
    <aside><p class="eyebrow">Ficha técnica / Referencia</p>
    <dl class="facts">{quick}</dl>
    <div style="display:grid;gap:.85rem;margin:1.7rem 0">{''.join(links)}</div>
    <p class="hint">La ficha explica el trabajo a nivel de portafolio. No sustituye la documentación técnica del repositorio.</p></aside></div></div></section>
    <section class="section" style="background:var(--paper2)"><div class="wrap">{overline("02","Cómo se conecta el trabajo")}
    <h2>De la entrada al resultado.</h2><p class="lead">Esquema conceptual del flujo documentado. No representa una captura de producción ni un mapa exhaustivo de infraestructura.</p>
    <div class="flowstrip">{flow}</div></div></section>
    <section class="section"><div class="wrap">{overline("03","Límites y evidencia")}
    <div class="case-layout"><div><h2>Qué se puede afirmar.</h2><p class="lead">{e(p["caution"])}</p></div>
    <aside><p class="eyebrow">Servicio relacionado</p><h3>{e(related["title"])}</h3><p>{e(related["short"])}</p>
    {a(d,"servicios/"+related["slug"]+"/","Explorar este servicio "+icon("arrow",True))}</aside></div>
    <div class="related" style="margin-top:4rem"><p class="eyebrow" style="padding-top:1rem">Seguir explorando</p>
    <a href="{e(local(d,'proyectos/'))}"><span>Volver al archivo de proyectos</span>{icon("arrow")}</a>
    <a href="{e(local(d,'contacto/'))}"><span>Conversar sobre un problema parecido</span>{icon("arrow")}</a></div></div></section>"""
    page("proyectos/"+p["slug"],p["title"]+" — proyecto y arquitectura",p["summary"]+" Conoce el alcance, las tecnologías y los límites de este trabajo de JMorgado.",body,"proyectos")
def services_index():
    d=1
    service_icons={"automatizacion":"gear","desarrollo-web":"code","datos-y-bi":"data","integraciones":"network","ia-aplicada":"branch","soporte-ti":"support"}
    services="".join(f"""<a class="service-line" href="{e(local(d,'servicios/'+s['slug']+'/'))}">
    <span class="service-no">{i:02d}/</span><h3>{e(s["title"])}</h3><p>{e(s["short"])}</p>{icon(service_icons[s['slug']])}</a>""" for i,s in enumerate(SERVICES,1))
    body=f"""<section class="page-hero"><div class="wrap">{crumb(d,[(None,"Servicios")])}<span class="eyebrow">Servicios / Una solución proporcional</span>
    <h1>Resolver primero. Elegir después<span class="orange">.</span></h1>
    <p class="lead">No vendo una herramienta porque esté de moda. Escucho el problema, reviso cómo ocurre el trabajo y elijo entre planillas, automatizaciones, integraciones, datos o software a medida.</p></div></section>
    <section class="section"><div class="wrap">{overline("01","Áreas de trabajo")}
    <div class="service-index">{services}</div></div></section>
    <section class="ink-panel"><div class="wrap">{overline("02","Qué incluye el primer contacto")}
    <div class="statement"><div><h2>La conversación inicial no tiene costo.</h2><p class="lead">Es una orientación para conocer la tarea y sus restricciones. Una auditoría o intervención técnica se acuerda por separado.</p></div>
    <div>{a(d,"metodo/","Conocer el método "+icon("arrow",True),"button")}</div></div></div></section>"""
    page("servicios","Servicios de automatización, desarrollo, datos e IA aplicada","Servicios profesionales de JMorgado: automatización con Python, n8n y Make, desarrollo web, dashboards, integraciones, IA aplicada y soporte técnico.",body,"servicios")
def service_detail(s):
    d=2
    outputs="".join(f'<li>{e(t)}</li>' for t in s["outputs"])
    links="".join(f'<a href="{e(local(d,"proyectos/"+slug+"/"))}"><span>{e(PROJ[slug]["title"])}</span>{icon("arrow",True)}</a>' for slug in s["examples"])
    flow="".join(f'<span class="tag">{e(t)}</span>' for t in s["stack"])
    body=f"""<section class="page-hero"><div class="wrap">{crumb(d,[("servicios/","Servicios"),(None,s["title"])])}
    <span class="eyebrow">Área de trabajo / Soluciones a medida</span><h1>{e(s["title"])}<span class="orange">.</span></h1>
    <p class="lead">{e(s["lead"])}</p><div class="page-meta"><span>Evaluación caso a caso</span><span>Primer diagnóstico conversado: gratuito</span></div></div></section>
    <section class="section"><div class="wrap">{overline("01","Problema y enfoque")}
    <div class="case-layout"><article class="prose"><h2>Qué situación abordo.</h2><p>{e(s["situation"])}</p>
    <h3>Cómo decido la solución</h3><p>{e(s["approach"])}</p></article>
    <aside><p class="eyebrow">Ejemplos de entregables según alcance</p><ul>{outputs}</ul>
    <p class="eyebrow" style="margin-top:2rem">Tecnologías utilizadas en esta línea</p><div class="tag-list">{flow}</div>
    <p class="hint">La selección final depende del problema; no todas las herramientas se usan en todos los encargos.</p></aside></div></div></section>
    <section class="section" style="background:var(--paper2)"><div class="wrap">{overline("02","Experiencia demostrada")}
    <div class="section-head"><h2>Trabajos que aportan contexto.</h2><p>No son promesas de resultados: permiten revisar tipos de sistemas y decisiones técnicas que ya he trabajado.</p></div>
    <div class="related">{links}</div></div></section>
    <section class="section"><div class="wrap"><div class="contact-board"><div><span class="eyebrow" style="color:var(--ink)">03 / Contacto</span><h2>¿Tienes un proceso parecido?</h2></div>
    <div><p>Cuéntame qué haces hoy y qué necesitas cambiar. La primera conversación es gratuita.</p>
    {a(d,"contacto/","Revisemos tu caso "+icon("arrow",True),"button dark")}</div></div></div></section>"""
    page("servicios/"+s["slug"],s["title"]+" — JMorgado",s["lead"],body,"servicios")
def method():
    d=1
    included=["Escuchar qué necesitas resolver y cuál es la dificultad","Comprender de forma inicial el proceso y sus herramientas","Comentar alternativas posibles y una ruta para continuar"]
    excluded=["Auditoría exhaustiva de archivos o sistemas","Cambios técnicos, instalaciones o reparación gratuita","Acceso inmediato a credenciales o datos sensibles"]
    def cells(arr):return "".join(f'<li>{e(item)}</li>' for item in arr)
    body=f"""<section class="page-hero"><div class="wrap">{crumb(d,[(None,"Método")])}
    <span class="eyebrow">Así trabajo / De la conversación a la entrega</span><h1>No hay receta antes del diagnóstico<span class="orange">.</span></h1>
    <p class="lead">Los proyectos llegan desde personas que necesitan resolver algo puntual, empresas con un proceso complejo o clientes que requieren soporte. El tamaño del problema no define de antemano la herramienta.</p></div></section>
    <section class="section"><div class="wrap">{overline("01","Recorrido de trabajo")}
    <ol class="step-list"><li><h3>Conversar</h3><p>Problema y resultado buscado. Gratis.</p></li>
    <li><h3>Comprender</h3><p>Entradas, excepciones y personas.</p></li><li><h3>Proponer</h3><p>Alternativas y límites.</p></li>
    <li><h3>Acordar</h3><p>Entregables, costos, plazos.</p></li><li><h3>Entregar</h3><p>Pruebas y documentación.</p></li></ol>
    <div class="contrast"><p><strong>Decisión importante:</strong> no todos los problemas requieren un agente de IA. Power Query, Python, una API o una aplicación pueden ser opciones mejores según el contexto.</p></div></div></section>
    <section class="section"><div class="wrap">{overline("02","Diagnóstico inicial gratuito")}
    <div class="case-layout"><article class="prose"><h2>Qué conversamos primero.</h2>
    <p>Una orientación para entender la tarea, las herramientas involucradas, la frecuencia y los resultados esperados. No necesitas elegir la tecnología.</p>
    <h3>Incluye</h3><ul>{cells(included)}</ul></article>
    <aside><p class="eyebrow">Fuera del diagnóstico gratuito</p><ul>{cells(excluded)}</ul>
    <p class="hint">El trabajo técnico se propone y acuerda antes de comenzar. No se piden archivos de clientes, accesos, cuentas o datos sensibles en el primer contacto.</p></aside></div></div></section>
    <section class="section"><div class="wrap"><div class="contact-board"><div><h2>La primera conversación es el inicio.</h2></div>
    <div><p>Una descripción libre del problema es suficiente para comenzar.</p>{a(d,"contacto/","Escribirme "+icon("arrow",True),"button dark")}</div></div></div></section>"""
    page("metodo","Cómo trabajo y qué incluye el diagnóstico gratuito","Conoce el método de JMorgado: conversación gratuita, comprensión del proceso, propuesta, acuerdo, desarrollo y entrega documentada.",body,"metodo")
def calc():
    d=1
    body=f"""<section class="page-hero"><div class="wrap">{crumb(d,[(None,"Calculadora")])}
    <span class="eyebrow">Herramienta interactiva / Estimación de tiempo</span><h1>El tiempo también cuenta<span class="orange">.</span></h1>
    <p class="lead">Compara cuánto trabajo activo exige una tarea con la intervención que todavía necesitaría después de automatizarse. Ajusta la frecuencia y las personas: el resultado cambia en vivo.</p></div></section>
    <section class="section"><div class="wrap">{overline("01","Compara dos escenarios")}
    <div class="calc-grid"><form id="calculator" novalidate aria-label="Calculadora de tiempo recuperado">
    <div class="calc-fields">
    <div class="field-title full">A / Tiempo activo actual por ejecución</div>
    <div class="field"><label for="before-h">Horas</label><input id="before-h" type="number" min="0" step="1" value="16" inputmode="numeric"></div>
    <div class="field"><label for="before-m">Minutos (0 a 59)</label><input id="before-m" type="number" min="0" max="59" step="1" value="0" inputmode="numeric"></div>
    <div class="field-title full">B / Intervención humana posterior</div>
    <div class="field"><label for="after-h">Horas</label><input id="after-h" type="number" min="0" step="1" value="0" inputmode="numeric"></div>
    <div class="field"><label for="after-m">Minutos (0 a 59)</label><input id="after-m" type="number" min="0" max="59" step="1" value="1" inputmode="numeric"></div>
    <div class="field-title full">C / Frecuencia y dedicación</div>
    <div class="field"><label for="frequency">Veces que se repite</label><input id="frequency" type="number" min=".01" step="any" value="1"></div>
    <div class="field"><label for="period">Frecuencia</label><select id="period"><option value="week">Por semana</option><option value="day">Por día</option><option value="month">Por mes</option></select></div>
    <div class="field" id="days-field" hidden><label for="days">Días de operación por semana</label><input id="days" type="number" min="1" max="7" step="1" value="5"></div>
    <div class="field"><label for="people">Personas con igual dedicación</label><input id="people" type="number" min="1" step="1" value="1"></div>
    <div class="field"><label for="workday">Horas por jornada</label><input id="workday" type="number" min=".1" step="any" value="8"></div></div>
    <p class="hint">Si ingresas el tiempo total del equipo, deja Personas = 1. Cuenta sólo trabajo activo, incluyendo revisión posterior, correcciones y excepciones.</p>
    <details><summary>D / Estimación económica opcional</summary><div class="calc-fields">
    <div class="field full"><label for="hour-cost">Valor del tiempo por hora (CLP)</label><input id="hour-cost" type="number" min="0" step="any" placeholder="Opcional"></div>
    <div class="field"><label for="initial-cost">Costo inicial de implementación (CLP)</label><input id="initial-cost" type="number" min="0" step="any" placeholder="Opcional"></div>
    <div class="field"><label for="monthly-cost">Costo mensual de operación (CLP)</label><input id="monthly-cost" type="number" min="0" step="any" placeholder="Opcional"></div></div></details>
    <p class="hint">{icon("scan",True)} Los cálculos se realizan en este navegador. Nada se transmite ni almacena.</p>
    </form><aside class="result" aria-live="polite" aria-atomic="true">
    <div class="eyebrow">Resultado / por ejecución y persona</div>
    <div class="result-value" id="per-run">15 h 59 min</div>
    <div class="result-status" id="calc-state">Tiempo activo recuperado por ejecución</div>
    <div class="result-stats">
    <div><strong id="per-week">—</strong><span>Por semana · equipo</span></div>
    <div><strong id="per-month">—</strong><span>Por mes · equipo</span></div>
    <div><strong id="per-year">—</strong><span>Por año · equipo</span></div>
    <div><strong id="reduction">—</strong><span>Variación del tiempo activo</span></div>
    <div><strong id="workdays">—</strong><span>Jornadas equivalentes / mes</span></div>
    <div><strong id="execs">—</strong><span>Ejecuciones / mes</span></div></div>
    <p class="result-money" id="money-output" hidden></p><p class="result-note" id="assumptions"></p>
    <p class="result-note" id="calc-error" role="status"></p></aside></div></div></section>
    <section class="section" style="background:var(--paper2)"><div class="wrap">{overline("02","Cómo interpretar la cifra")}
    <div class="section-head"><h2>Una estimación no es una cotización.</h2>
    <p>Pasar de dos jornadas de ocho horas a un minuto sería recuperar 15 h 59 min de trabajo activo por ejecución. Es un ejemplo matemático, no una medición ni una promesa para todos los procesos.</p></div>
    <p>{a(d,"contacto/","Revisemos un proceso real "+icon("arrow",True))}</p></div></section>"""
    page("calculadora","Calculadora de tiempo recuperado al automatizar tareas","Calcula horas recuperadas por ejecución, semana, mes y año al automatizar una tarea. Estimación local sin enviar datos; valor económico opcional.",body,"calculadora")
    path=ROOT/"calculadora"/"index.html"
    text=path.read_text(encoding="utf-8")
    text=text.replace("</body></html>",'<script src="../assets/calculator.js" defer></script></body></html>')
    path.write_text(text,encoding="utf-8")
def contact():
    d=1
    body=f"""<section class="page-hero"><div class="wrap">{crumb(d,[(None,"Contacto")])}
    <span class="eyebrow">Conversación directa / Diagnóstico inicial gratuito</span>
    <h1>¿Qué necesitas resolver<span class="orange">?</span></h1>
    <p class="lead">Puede ser una planilla que toma demasiado tiempo, una aplicación que falta, un proceso que se repite o una incidencia técnica. No necesitas llegar con la solución escogida.</p></div></section>
    <section class="section"><div class="wrap">{overline("01","Primer contacto")}
    <div class="case-layout"><div><h2>Descríbeme la tarea, no el stack.</h2><p class="lead">Con que me cuentes qué haces hoy, qué esperas conseguir y qué herramientas intervienen, podemos comenzar.</p>
    <p style="margin-top:2rem">{external(LINKEDIN,"Contactar por LinkedIn "+icon("arrow",True),"button strong")}</p>
    <p class="hint">LinkedIn es el canal público disponible actualmente. No se inventan formularios, correos ni teléfonos.</p></div>
    <aside><p class="eyebrow">Orientación / sin costo</p>
    <p>La primera conversación ayuda a decidir si conviene evaluar el problema con más detalle. Una auditoría, instalación, desarrollo o intervención se presupuestan y acuerdan por separado.</p>
    <p class="hint">No envíes credenciales, bases de clientes, datos privados ni archivos sensibles en el primer mensaje.</p></aside></div></div></section>
    <section class="ink-panel"><div class="wrap">{overline("02","Antes de escribir")}
    <div class="statement"><h2>Una pregunta es suficiente para comenzar.</h2>
    <p class="lead">¿Qué parte de tu trabajo requiere tiempo que podría dedicarse a algo más útil? Si no lo tienes claro, también podemos revisarlo.</p></div></div></section>"""
    page("contacto","Contacto y diagnóstico inicial gratuito","Conversa directamente con JMorgado sobre automatización, sitios web, datos, IA, integraciones o soporte técnico. Primer diagnóstico orientativo gratuito.",body,"contacto")
def game_page():
    from tetris_game import render_game
    page("jugar", "Pausa de Tetris", "Una pausa en el portafolio. Tetris con teclado configurable, controles táctiles y récord personal en este navegador.", render_game(), "jugar")

if __name__=="__main__":
    home();portfolio()
    for p in PROJECTS:project_detail(p)
    services_index()
    for s in SERVICES:service_detail(s)
    method();calc();contact();game_page()
