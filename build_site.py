"""Compilador del sitio estático JMorgado.
Ejecutar: python build_site.py
Sólo escribe HTML dentro de landing/ y sus subdirectorios.
No modifica proyectos de clientes, repositorios ni DatosDemoCL.
"""
from __future__ import annotations
from html import escape
from pathlib import Path
import re
from hashlib import sha256
from urllib.parse import urlsplit
from site_data import (LEGACY_TOOL_SLUGS, PROJECT_CONTEXT, PROJECT_DECISIONS,
                       PROJECT_MARKS, PROJECTS, PROJECT_PORTAL_PAGES, SERVICES, TOOLS)

ROOT = Path(__file__).resolve().parent
PROJ = {p["slug"]: p for p in PROJECTS}
TOOL = {tool["slug"]: tool for tool in TOOLS}
SERV = {s["slug"]: s for s in SERVICES}
LINKEDIN = "https://www.linkedin.com/in/jorge-morgado/"
WHATSAPP = "https://wa.me/56933904330"
ORDER_CASE = {"before": 60, "after": 12, "runs_per_week": 5}
def e(value): return escape(str(value), quote=True)
def local(d, p=""): return "../"*d + p
def asset(d, path):
    """Cambiar la URL cuando cambie el recurso evita mezclar HTML y código en caché."""
    version = sha256((ROOT / path).read_bytes()).hexdigest()[:12]
    return local(d, path) + '?v=' + version
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
<symbol id="i-window" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18"/></symbol>
</svg>"""
def meta(d, title, description, active="", journey=False):
    nav_items=[("herramientas/","Herramientas","herramientas"),("proyectos/","Proyectos","proyectos"),("servicios/","Servicios","servicios"),("contacto/","Contacto","contacto")]
    links="".join(f'<a href="{e(local(d,u))}"' + (' class="nav-contact"' if section=="contacto" else '')+(' aria-current="page"' if section==active else '')+f'>{e(t)}</a>' for u,t,section in nav_items)
    journey_css=f'<link rel="stylesheet" href="{e(asset(d,"assets/journey-study.css"))}">' if journey else ''
    body_class=' class="home-page"' if journey else ''
    header_class=' home-header' if journey else ''
    descriptor='Una forma de resolver' if journey else 'Desarrollo independiente<br>Software / Datos / Procesos'
    monogram='JM' if journey else 'jm'
    controls=''
    progress='' if journey else ''
    fonts = '' if active=="jugar" else """<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">"""
    head = f"""<!doctype html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} | JMorgado</title><meta name="description" content="{e(description)}">
<meta name="robots" content="index,follow"><meta name="theme-color" content="#F0EDE5">
<meta property="og:type" content="website"><meta property="og:locale" content="es_CL">
<meta property="og:title" content="{e(title)} | JMorgado"><meta property="og:description" content="{e(description)}">
<link rel="icon" type="image/svg+xml" href="{e(local(d,'assets/favicon.svg'))}">
{fonts}
<script src="{e(local(d,'assets/theme-init.js'))}"></script>
<link rel="stylesheet" href="{e(asset(d,'assets/site.css'))}">
<link rel="stylesheet" href="{e(local(d,'assets/themes.css'))}">
<link rel="stylesheet" href="{e(asset(d,'assets/interior.css'))}">
</head><body{body_class}><a class="skip-link" href="#contenido">Saltar al contenido</a>{SYMBOLS}
<header class="site-header{header_class}"><div class="wrap header-inner">
<a class="wordmark" href="{e(local(d))}"><span class="mark" aria-hidden="true">{monogram}</span><span>JMorgado<span class="orange">.</span></span></a>
<div class="header-sub">{descriptor}</div>{controls}
<button type="button" class="menu-toggle" data-menu-toggle aria-controls="main-nav" aria-expanded="false">Menú +</button>
<button type="button" class="theme-toggle" data-theme-toggle aria-pressed="false" aria-label="Cambiar a modo noche">Noche</button>
<nav class="nav" id="main-nav" data-nav aria-label="Navegación principal">{links}</nav>
</div>{progress}</header>"""
    if journey:
        head=head.replace('</head>',journey_css+'</head>')
    if active=="contacto":
        booking_css=f'<link rel="stylesheet" href="{e(asset(d,"assets/booking.css"))}">'
        head=head.replace('</head>',booking_css+'</head>')
    if active=="jugar":
        head=head.replace("</head>", f'<link rel="stylesheet" href="{e(asset(d,"assets/tetris.css"))}"></head>')
    return head
def foot(d, journey=False, active=""):
    extra=''.join(f'<script src="{e(asset(d,path))}" defer></script>' for path in ['assets/vendor/gsap.min.js','assets/vendor/ScrollTrigger.min.js','assets/journey-study.js']) if journey else ''
    if active=="jugar":
        extra += f'<script src="{e(asset(d,"assets/tetris.js"))}" defer></script>'
    if journey or active=="herramientas":
        extra += f'<script src="{e(asset(d,"assets/tool-panel.js"))}" defer></script>'
    if journey:
        extra += f'<script src="{e(asset(d,"assets/tetris-preview.js"))}" defer></script>'
    return f"""<footer class="site-footer"><div class="wrap">
  <nav class="footer-links" aria-label="Explorar el sitio">
    <div><h2>Trabajo</h2>
    <a href="{e(local(d,'proyectos/'))}">Proyectos</a><a href="{e(local(d,'servicios/'))}">Servicios</a><a href="{e(local(d,'metodo/'))}">Método</a></div>
    <div><h2>Recursos</h2>
    <a href="{e(local(d,'herramientas/'))}">Herramientas</a><a href="{e(local(d,'calculadora/'))}">Calculadora</a><a href="{e(local(d,'jugar/'))}">Pausa de Tetris</a></div>
    <div><h2>Contacto</h2>
    {external(WHATSAPP,"WhatsApp","footer-external")}{external(LINKEDIN,"LinkedIn","footer-external")}
    <a href="{e(local(d,'contacto/#agenda'))}">Agendar una hora</a></div>
  </nav>
<div class="footer-base"><span>© JMorgado</span><a href="#contenido">Volver arriba ↑</a></div>
</div></footer><script src="{e(local(d,'assets/site.js'))}" defer></script>{extra}</body></html>"""
def page(where,title,description,content,active="",journey=False):
    target=ROOT / where / "index.html" if where else ROOT / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    depth=len(Path(where).parts) if where else 0
    canonical="https://jmorgadodev.github.io/"+(where.strip("/")+"/" if where else "")
    head=meta(depth,title,description,active,journey).replace("</head>",f'<link rel="canonical" href="{canonical}"></head>')
    target.write_text(head+f'<main id="contenido">{content}</main>'+foot(depth,journey,active),encoding="utf-8")
    print("PAGE",target.relative_to(ROOT))
def overline(number,caption):
    return f'<div class="overline"><span class="num">{e(number)} / {e(caption)}</span></div>'
def interior_art(path, class_name):
    svg = (ROOT / "assets" / path).read_text(encoding="utf-8")
    return svg.replace("<svg ", f'<svg class="interior-art {class_name}" aria-hidden="true" focusable="false" ', 1)
def crumb(d, parts):
    out=['<nav class="breadcrumb" aria-label="Ruta de navegación">',f'<a href="{e(local(d))}">Inicio</a>']
    for path,title in parts:
        out.append('<span aria-hidden="true">/</span>')
        if path:out.append(f'<a href="{e(local(d,path))}">{e(title)}</a>')
        else:out.append(f'<span aria-current="page">{e(title)}</span>')
    return "".join(out)+"</nav>"
def featured_case(d, p):
    slug = p["slug"]
    url = local(d, "proyectos/" + slug + "/")
    participation, result = PROJECT_CONTEXT[slug]
    return f"""<a class="feature feature-{e(slug)}" href="{e(url)}">
    {project_mark(d,p)}<div class="case-title"><span class="feature-type">{e(p["label"])}</span><h3>{e(p["title"])}</h3></div>
    <div class="case-contribution"><p>{e(participation)}</p><p>{e(result)}</p></div>
    <span class="case-read">Ver caso {icon("arrow", True)}</span></a>"""

def entry(d,p,idx):
    url=local(d,"proyectos/"+p["slug"]+"/")
    participation, _ = PROJECT_CONTEXT[p["slug"]]
    return f"""<a class="project-row" data-project-category="{e(p['category'])}" href="{e(url)}">
    <span class="index-number">{idx:02d}</span><div><h2>{e(p["title"])}</h2><span class="mono small muted">{e(p["label"])}</span></div>
    <div class="project-contribution"><p>{e(p["summary"])}</p><p>{e(participation)}</p></div><span class="category">{e(p["state"])}</span>
    <span class="row-link">{icon("arrow")}</span></a>"""
def journey_markup():
    from journey_study import render_study
    return render_study()

TECH_COLORS = {
    "python": "#2b6595", "javascript": "#9d7500", "react": "#157d90", "vite": "#7054b9",
    "html": "#aa4d36", "css": "#3b5ca0", "cloudflare": "#a74915", "firebase": "#ac6b12",
    "google sheets": "#217244", "google drive": "#277e63", "apps script": "#376bbb",
    "api": "#486d66", "n8n": "#b03d5b", "make": "#784ab2", "github": "#575469",
    "postgresql": "#336791", "supabase": "#287450", ".net": "#7350a3", "tailwind": "#137a99",
}

TECH_ART = {
    "Excel": "T01-excel.svg", "Power BI": "T02-power-bi.svg",
    "Power Query": "T03-power-query.svg", "n8n": "T04-n8n.svg",
}

def tech_badges(d, technologies):
    badges = []
    for name in technologies:
        tone = next((color for key, color in TECH_COLORS.items() if key in name.lower()), None)
        marker = f' style="--tech-color:{tone}"' if tone else ""
        piece = TECH_ART.get(name)
        image = f'<img src="{e(asset(d, "assets/modular-v02/" + piece))}" alt="" width="38" height="26" loading="lazy">' if piece else ""
        badges.append(f'<span class="tag tech-badge"{marker}>{image}{e(name)}</span>')
    return "".join(badges)

def project_mark(d, project):
    mark = PROJECT_MARKS.get(project["slug"])
    if not mark:
        return ""
    day, night = mark
    def image(filename, theme=""):
        src = asset(d, f"assets/project-marks/{filename}")
        return f'<img class="{theme}" src="{e(src)}" alt="" loading="lazy" decoding="async">'
    variants = image(day, "mark-day") + image(night, "mark-night") if night else image(day)
    return f'<span class="project-mark mark-{e(project["slug"])}">{variants}</span>'

def tool_sample(d, tool):
    images = tool.get("sample_images")
    if images:
        light, dark = images
        source = asset(d, f"assets/project-previews/{light}")
        alternate = ""
        if dark:
            dark_source = asset(d, f"assets/project-previews/{dark}")
            alternate = f'<img class="sample-night" src="{e(dark_source)}" alt="{e(tool["sample_alt"])}" loading="lazy">'
        content = f'<img class="{"sample-day" if dark else ""}" src="{e(source)}" alt="{e(tool["sample_alt"])}" loading="lazy">{alternate}'
    else:
        content = """<table><thead><tr><th scope="col">id_prueba</th><th scope="col">comuna</th><th scope="col">monto_clp</th></tr></thead>
        <tbody><tr><td>1</td><td>Quilpué</td><td>24.990</td></tr><tr><td>2</td><td>Coronel</td><td>17.400</td></tr>
        <tr><td>3</td><td>Ovalle</td><td>9.900</td></tr></tbody></table>"""
    return f'<figure class="tool-sample">{content}<figcaption>{e(tool["sample_title"])}</figcaption></figure>'

def tool_card(d, tool, heading="h3"):
    facts = " · ".join(e(tool[key]) for key in ("platform", "state"))
    name = e(tool["title"])
    links = [external(tool["repo"], "GitHub")]
    if tool.get("docs"):
        links.append(external(tool["docs"], "Documentación"))
    if tool.get("download"):
        links.append(external(tool["download"], "Descargar ZIP", "button"))
    features = "".join(f'<li>{e(feature)}</li>' for feature in tool["features"])
    license_label = f'<p class="mono small">Licencia {e(tool["license"])}</p>' if tool.get("license") else ""
    return f"""<article class="tool-card tool-{e(tool["tone"])}" id="{e(tool["slug"])}">
    <div class="tool-info">
    <p class="tool-task">{icon(tool["icon"])} {e(tool["task"])}</p>
    <{heading} class="tool-name">{name}</{heading}><p>{e(tool["summary"])}</p>
    <p class="tool-facts mono small">{facts}</p>
    <details class="tool-details"><summary>Ver ficha <span class="sr-only">de {name}</span>{icon("arrow",True)}</summary>
    <div class="tool-detail-body"><p class="tool-facts mono small">{facts}</p>
    <p class="tool-detail-summary">{e(tool["summary"])}</p>
    <h3>Qué resuelve</h3><p>{e(tool["problem"])}</p><h3>Qué incluye</h3><ul>{features}</ul>
    <h3>Tecnologías</h3><div class="tag-list">{tech_badges(d,tool["tech"])}</div>
    {license_label}<div class="tool-links">{"".join(links)}</div></div></details></div>
    {tool_sample(d,tool)}</article>"""

def tool_workbench(d):
    choices = "".join(
        f'<button type="button" aria-controls="{e(tool["slug"])}"><span>{e(tool["title"])}</span>{icon("arrow",True)}</button>'
        for tool in TOOLS
    )
    return f"""<div class="tool-workbench" data-tool-workbench>
    {interior_art("modular-v02/G02-superficie-expandible.svg","bench-platform")}
    <div class="tool-choices" role="group" aria-label="Elegir herramienta" hidden>{choices}</div>
    <div class="tool-grid">{"".join(tool_card(d,tool) for tool in TOOLS)}</div></div>"""

def tool_drawer():
    return """<dialog class="tool-panel" aria-labelledby="tool-panel-title">
    <div class="tool-panel-surface"><div class="tool-panel-header">
    <h2 id="tool-panel-title"></h2>
    <button type="button" data-tool-close aria-label="Cerrar ficha" autofocus>×</button></div>
    <div data-tool-content></div></div></dialog>"""

def tools_index():
    d = 1
    body = f"""<section class="page-hero tools-intro"><div class="wrap">{crumb(d,[(None,"Herramientas")])}
    <h1>Herramientas<span class="orange">.</span></h1>
    <p class="lead">Software que hice para registrar una visita técnica, automatizar acciones en Windows y probar con datos sintéticos. Cada ficha reúne el código y los recursos publicados.</p></div></section>
    <section class="section tools-catalog"><div class="wrap">
    <div class="tool-grid">{"".join(tool_card(d,tool,"h2") for tool in TOOLS)}</div></div></section>{tool_drawer()}"""
    page("herramientas", "Herramientas y recursos", "AuditaPC, Nokto y DatosDemoCL. Software propio, documentación y descargas oficiales.", body, "herramientas")

def redirect_legacy_tools():
    for slug in LEGACY_TOOL_SLUGS:
        target = ROOT / "proyectos" / slug / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        destination = f"../../herramientas/#{slug}"
        target.write_text(f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url={destination}">
<link rel="canonical" href="https://jmorgadodev.github.io/herramientas/">
<title>{e(TOOL[slug]["title"])} | Herramientas de JMorgado</title></head>
<body><p>La ficha está en <a href="{destination}">Herramientas y recursos</a>.</p></body></html>
""", encoding="utf-8")

def game_page():
    from tetris_game import render_game
    page("jugar", "Pausa de Tetris", "Una pausa en el portafolio. Tetris con teclado configurable, controles táctiles y récord personal en este navegador.", render_game(), "jugar")

def order_example():
    return f"""<figure class="order-example">{interior_art("modular/E02-conector-codo.svg","order-trace")}
    <figcaption><span>Revisión de pedidos</span><strong>Pedido 1042</strong></figcaption>
    <dl><div><dt>Planilla de ventas</dt><dd>$24.990</dd></div><div><dt>Exportación de la tienda</dt><dd>$29.990</dd></div></dl>
    <p class="order-decision"><strong>Revisar monto.</strong> Las dos fuentes quedan a la vista.</p></figure>"""

def home_savings(d):
    before, after, runs = (ORDER_CASE[key] for key in ("before", "after", "runs_per_week"))
    saved_week = (before - after) * runs // 60
    saved_year = saved_week * 52
    return f"""<section class="ink-panel home-calculator" id="ahorro"><div class="wrap">
    <p class="savings-kicker">{interior_art("modular-v02/K01-banda-revelado.svg","savings-band")}<span>Calculadora · Caso hipotético</span></p><div class="savings-case"><div class="savings-copy">
    <h2>Una hora diaria cerrando pedidos.</h2>
    <p>Una persona cruza dos planillas cada tarde. Si el sistema reúne los pedidos y sólo quedan las excepciones por revisar, el cierre baja de {before} a {after} minutos.</p>
    <dl class="savings-compare"><div><dt>Conciliar a mano</dt><dd>{before} min</dd></div>
    <div style="--share:{after / before:.2%}"><dt>Revisar excepciones</dt><dd>{after} min</dd></div></dl>
    {a(d,"calculadora/","Probar este ejemplo "+icon("arrow",True),"button")}</div>
    <div class="savings-result"><p><strong>{saved_week}<span> h</span></strong> recuperadas cada semana</p>
    <p><strong>{saved_year} horas</strong> al año. Equivalen a {saved_year // 8} jornadas de 8 horas.</p>
    <small>Supuesto: {runs} cierres por semana durante 52 semanas.</small></div>
    </div></div></section>"""

def home():
    d=0
    from tetris_game import game_art
    featured_projects = [PROJ[slug] for slug in ("impulsacv", "el-cambiometro", "ryvolt", "flor-de-almendro")]
    main=f"""    <section class="section home-projects" id="explorar" tabindex="-1" aria-labelledby="resolve-title"><div class="wrap">{overline("01","Capacidades")}
    <div class="section-head"><h2 id="resolve-title">¿Qué necesitas resolver?</h2>
    <p>Una planilla que toma toda la mañana, dos aplicaciones que no se hablan o una web que necesitas poner en marcha. Podemos partir por ahí.</p></div>
    <div class="home-opening">
    {interior_art("modular-v02/G07-conector-flexible.svg","capability-connector")}
    <div>
      <div class="home-capabilities">
        <a href="servicios/datos-y-bi/">{icon("data")}<div><h3>Ordenar datos y reportes</h3><p>Reunir planillas, revisar errores y preparar informes que puedas actualizar.</p></div>{icon("arrow",True)}</a>
        <a href="servicios/integraciones/">{icon("network")}<div><h3>Conectar herramientas</h3><p>Pasar información entre los sistemas que ya usas y reducir pasos manuales.</p></div>{icon("arrow",True)}</a>
        <a href="servicios/desarrollo-web/">{icon("code")}<div><h3>Desarrollar una web o aplicación</h3><p>Crear un catálogo, un panel o un sistema para un proceso que necesita su propio espacio.</p></div>{icon("arrow",True)}</a>
      </div>
      <p class="section-action">{a(d,"servicios/","Ver todos los servicios "+icon("arrow",True))}</p>
    </div>
    <aside class="portfolio-about"><p class="eyebrow">Quién está detrás</p><h3>Soy Jorge Morgado.</h3>
    <p>Trabajo de forma independiente en desarrollo, datos y automatización. Para empezar, me sirve ver cómo haces hoy la tarea y qué resultado esperas.</p>
    <p class="profile-link">{external(LINKEDIN,"Mi perfil en LinkedIn "+icon("arrow",True))}</p>
    </aside></div></div></section>

    <section class="section home-tools" id="recursos"><div class="wrap">{overline("02","Software propio")}
    <div class="section-head"><h2>Software de mi banco de trabajo.</h2><p>Tres utilidades que hice para tareas que se repiten. Puedes revisar cómo funcionan y abrir su código.</p></div>
    {tool_workbench(d)}
    <p class="section-action">{a(d,"herramientas/","Ver todas las herramientas "+icon("arrow",True),"button")}</p></div></section>
    <section class="section home-work" id="trabajos"><div class="wrap">{overline("03","Portafolio")}
    <div class="section-head"><h2>Proyectos realizados.</h2><p>Cuatro trabajos de producto, datos y web. En cada ficha cuento qué hice y las decisiones que dieron forma al resultado.</p></div>
    <div class="feature-list">{"".join(featured_case(d,p) for p in featured_projects)}</div>
    <p class="section-action">{a(d,"proyectos/",f"Ver los {len(PROJECTS)} proyectos "+icon("arrow",True),"button")}</p></div></section>
    <section class="section game-invite home-game" id="una-partida"><div class="wrap game-invite-inner">
    <div class="game-invite-copy"><p class="eyebrow">Una pausa · Tetris</p><h2>La pieza que todavía no llega.</h2>
    <p class="lead">De los videojuegos, al que más vuelvo es al Tetris. Me gusta pensar qué espacio dejar para la próxima pieza. A veces el mejor movimiento es guardar un hueco.</p>
    <p>Prueba el encaje. Si te quedas con ganas, te invito a una partida para superar tu marca.</p>
    {a(d,"jugar/","Probar una partida "+icon("arrow",True),"button")}</div>
    <figure class="game-invite-display" data-tetris-preview>
    {interior_art("modular/P12-llave.svg","game-key-piece")}
    <figcaption><span>La jugada</span><span role="status">Queda un hueco de cuatro filas.</span></figcaption>{game_art()}
    <button type="button" class="button" hidden>Encajar la pieza</button></figure></div></section>
    <section class="section home-method" id="como-trabajo"><div class="wrap">
    <div class="method-layout"><div class="method-copy"><p class="eyebrow">Cómo trabajo · Caso hipotético</p><h2>Empiezo por la fila que no cuadra.</h2>
    <p>Imagina que el mismo pedido aparece en dos planillas con montos distintos. Antes de automatizar el cierre, revisaría contigo cuál es la fuente de referencia y quién decide cuando discrepan.</p>
    <p>El sistema puede juntar las coincidencias y dejarte sólo los casos que necesitan criterio.</p>
    {a(d,"metodo/","Ver cómo preparo una entrega "+icon("arrow",True))}</div>
    {order_example()}</div></div></section>
    {home_savings(d)}
    <section class="section home-contact"><div class="wrap"><div class="home-contact-layout">
    {interior_art("modular-v02/K02-marco-editorial.svg","contact-frame-art")}
    <div><span class="eyebrow">Hablemos</span>
    <h2>Cuéntame dónde se traba el trabajo.</h2></div><div><p>Puedes escribirme por WhatsApp o reservar una conversación inicial gratuita.</p>
    {external(WHATSAPP,"Conversemos "+icon("arrow",True),"button dark")}
    <p class="contact-secondary">{a(d,"contacto/#agenda","Prefiero agendar una hora "+icon("arrow",True))}</p></div></div></div></section>"""
    page("","Jorge Morgado | Desarrollo web, datos y automatización","Jorge Morgado desarrolla herramientas, automatizaciones, integraciones y sitios web para resolver necesidades concretas de personas y empresas.",journey_markup()+main+tool_drawer(),journey=True)
def portfolio():
    d=1
    cats=[("todos","Todos"),("plataformas","Plataformas"),("web","Web y catálogos"),("sistemas","Sistemas")]
    buttons="".join(f'<button class="filter-btn" type="button" data-filter="{e(k)}" aria-pressed="{"true" if i==0 else "false"}">{e(v)}</button>' for i,(k,v) in enumerate(cats))
    body=f"""<section class="page-hero project-archive"><div class="wrap">{crumb(d,[("", "Proyectos")])}<h1>Archivo de proyectos<span class="orange">.</span></h1>
    <p class="lead">Productos web, ingeniería de datos, integraciones y sistemas en tiempo real. Cada ficha reúne el contexto, mi participación y las decisiones del proyecto.</p></div></section>
    <section class="section project-catalog"><div class="wrap">
    <div class="project-toolbar"><div class="filter-row" role="group" aria-label="Filtrar proyectos">{buttons}</div>
    <p class="mono small muted">{len(PROJECTS)} proyectos en el archivo</p></div>
    <div class="project-index">{''.join(entry(d,p,i) for i,p in enumerate(PROJECTS,1))}</div></div></section>"""
    page("proyectos","Proyectos de desarrollo web, datos, automatización y software","Portafolio de JMorgado: ImpulsaCV, Cambiómetro, Conecta, Ryvolt y otros proyectos con contexto técnico y límites verificables.",body,"proyectos")
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
}

def portal_dialog(d, *, title, subtitle, url, mode, panel, filter_available=False):
    filter_button = '<button type="button" class="button" data-portal-filter aria-pressed="false">Filtro noche</button>' if filter_available else ""
    return f"""<dialog class="project-portal project-portal-{mode}" aria-labelledby="project-portal-title">
    <header class="project-portal-bar">
      <div class="project-portal-identity"><p>{e(subtitle)}</p><h2 id="project-portal-title">{e(title)}</h2></div>
      <div class="project-portal-actions">{filter_button}
        {external(url, "Abrir en otra pestaña "+icon("arrow",True), "button")}
        <form method="dialog"><button class="button" autofocus>Cerrar</button></form>
      </div>
    </header>{panel}</dialog>
    <script src="{e(asset(d,'assets/project-portal.js'))}" defer></script>"""

def project_portal_pages(slug, title, pages):
    buttons = []
    templates = []
    sandbox = "allow-scripts allow-same-origin" if slug == "el-cambiometro" else ""
    for index, (key, label, source) in enumerate(pages):
        pressed = "true" if index == 0 else "false"
        buttons.append(f'<button type="button" class="button" data-portal-choice="{key}" aria-pressed="{pressed}">{e(label)}</button>')
        templates.append(f"""<template data-portal-page="{key}"><iframe title="{e(title)} · {e(label)}"
        src="{e(source + '?jmorgado=1')}" sandbox="{sandbox}" referrerpolicy="origin"></iframe></template>""")
    return f"""<div class="portal-pages" data-portal-pages>
    <div class="portal-pages-nav" role="group" aria-label="Páginas públicas" hidden>{"".join(buttons)}</div>
    <div class="project-portal-frame" data-portal-frame></div>
    <p class="project-portal-note portal-unavailable" data-portal-unavailable hidden>Abre el sitio en otra pestaña para visitarlo desde esta dirección.</p>
    {"".join(templates)}</div>"""

def project_portal(d, project):
    url = project["site"]
    name = project["title"]
    subtitle = urlsplit(url).hostname
    pages = PROJECT_PORTAL_PAGES.get(project["slug"])
    if pages:
        panel = project_portal_pages(project["slug"], name, pages)
        return portal_dialog(d, title=name, subtitle=subtitle, url=url, mode="pages", panel=panel, filter_available=True)
    panel = f"""<div class="project-portal-frame" data-portal-frame></div>
    <template data-portal-template><iframe title="{e(name)} · Sitio oficial" src="{e(url)}"
    sandbox="allow-scripts allow-same-origin allow-forms" referrerpolicy="no-referrer"></iframe></template>
    <p class="project-portal-note">El filtro noche ajusta la vista. Si el sitio no carga o te pide iniciar sesión, ábrelo en otra pestaña.</p>"""
    return portal_dialog(d, title=name, subtitle=subtitle, url=url, mode="live", panel=panel, filter_available=True)

def project_detail(p):
    d=2
    quick=f'<dt>Tipo</dt><dd>{e(p["label"])}</dd><dt>Estado documental</dt><dd>{e(p["state"])}</dd><dt>Área</dt><dd>{e(p["area"])}</dd>'
    links=[]
    if p["repo"]:links.append(external(p["repo"],"Ver código y documentación en GitHub "+icon("arrow",True),"button"))
    if not links and not p["site"]:links.append('<p class="hint">Este caso se presenta a través de su ficha.</p>')
    flow="".join(f'<div class="flowstep"><span class="flow-index">0{i} / PASO</span><strong>{e(text)}</strong></div>' for i,text in enumerate(p["flow"],1))
    tags = tech_badges(d,p["tech"])
    related=SERV[p["related"]]
    participation, result = PROJECT_CONTEXT[p["slug"]]
    site_link = f'<a class="button dark" href="{e(p["site"])}" data-project-portal>Ver sitio {icon("window",True)}</a>' if p["site"] else ""
    portal = project_portal(d, p) if p["site"] else ""
    body=f"""<section class="page-hero project-hero tone-{e(p['accent'])}"><div class="wrap">{crumb(d,[("proyectos/","Proyectos"),(None,p["title"])])}
    <div class="eyebrow">{e(p["area"])} / {e(p["label"])}</div>{project_mark(d,p)}<h1>{e(p["title"])}<span class="orange">.</span></h1>
    <p class="lead">{e(p["summary"])}</p>{site_link}
    <div class="page-meta"><span>{e(p["state"])}</span><span>Estudio de caso / alcance documental</span></div></div></section>
    <section class="section"><div class="wrap">{overline("01","Qué se resolvió")}
    <div class="case-layout"><article class="prose"><h2>{e(CASE_HEADLINES[p['slug']])}</h2><p>{e(p["problem"])}</p>
    <h3>Trabajo desarrollado</h3><p>{e(p["work"])}</p>
    <h3>Por qué lo construí así</h3><p>{e(PROJECT_DECISIONS[p["slug"]])}</p>
    <h3>Mi participación</h3><p>{e(participation)}</p>
    <h3>Resultado</h3><p>{e(result)}</p>
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
    <a href="{e(local(d,'contacto/'))}"><span>Conversar sobre un problema parecido</span>{icon("arrow")}</a></div></div></section>{portal}"""
    page("proyectos/"+p["slug"],p["title"]+" — proyecto y arquitectura",p["summary"]+" Conoce el alcance, las tecnologías y los límites de este trabajo de JMorgado.",body,"proyectos")
def services_index():
    d=1
    service_icons={"automatizacion":"gear","desarrollo-web":"code","datos-y-bi":"data","integraciones":"network","ia-aplicada":"branch","soporte-ti":"support","redes-sociales":"grid"}
    services="".join(f"""<a class="service-line" href="{e(local(d,'servicios/'+s['slug']+'/'))}">
    <span class="service-no">{i:02d}/</span><h3>{e(s["title"])}</h3><p>{e(s["short"])}</p>{icon(service_icons[s['slug']])}</a>""" for i,s in enumerate(SERVICES,1))
    body=f"""<section class="page-hero service-map-hero"><div class="wrap">{crumb(d,[(None,"Servicios")])}
    {interior_art("modular/S03-marco-abierto.svg","service-map-art")}
    <span class="eyebrow">Servicios / Una solución proporcional</span>
    <h1>En qué puedo ayudarte<span class="orange">.</span></h1>
    <p class="lead">Desarrollo web, datos, automatización, soporte y gestión de redes sociales. Cada servicio explica qué puedo tomar a cargo y qué necesitamos acordar.</p></div></section>
    <section class="section service-map"><div class="wrap">{overline("01","Áreas de trabajo")}
    <div class="service-index">{services}</div></div></section>
    <section class="ink-panel"><div class="wrap">{overline("02","Qué incluye el primer contacto")}
    <div class="statement"><div><h2>La conversación inicial no tiene costo.</h2><p class="lead">Es una orientación para conocer la tarea y sus restricciones. Una auditoría o intervención técnica se acuerda por separado.</p></div>
    <div>{a(d,"metodo/","Conocer el método "+icon("arrow",True),"button")}</div></div></div></section>"""
    page("servicios","Servicios de automatización, desarrollo, datos e IA aplicada","Servicios profesionales de JMorgado: automatización con Python, n8n y Make, desarrollo web, dashboards, integraciones, IA aplicada y soporte técnico.",body,"servicios")
def social_service(s):
    d = 2
    body = f"""<section class="page-hero social-hero"><div class="wrap">{crumb(d,[("servicios/","Servicios"),(None,s["title"])])}
    <span class="eyebrow">Servicio editorial</span>
    <h1>Gestión de redes sociales<span class="orange">.</span></h1>
    <p class="lead">{e(s["lead"])}</p></div></section>
    <section class="section social-workflow"><div class="wrap"><div class="section-head">
    <h2>Que cada publicación tenga un propósito.</h2><p>Partimos por tus perfiles, el público al que quieres llegar y los recursos que ya tienes. Acordamos qué puedo asumir y qué necesita tu aprobación.</p></div>
    <ol class="social-plan">
      <li><h3>Planificar</h3><p>Definir temas, formatos y un calendario que puedas sostener.</p></li>
      <li><h3>Preparar y publicar</h3><p>Apoyar la creación de textos y piezas, organizar los perfiles y coordinar la revisión antes de publicar.</p></li>
      <li><h3>Revisar</h3><p>Consultar resultados disponibles en cada plataforma y usarlos para ajustar las próximas publicaciones.</p></li>
    </ol>
    <p>Cuando tiene sentido, puedo automatizar recordatorios o tareas de preparación. Las decisiones de contenido y la aprobación quedan dentro del proceso acordado.</p>
    {external(WHATSAPP,"Conversemos "+icon("arrow",True),"button dark")}</div></section>"""
    page("servicios/redes-sociales", s["title"], s["lead"], body, "servicios")

def service_detail(s):
    if s["slug"] == "redes-sociales":
        social_service(s)
        return
    d=2
    outputs="".join(f'<li>{e(t)}</li>' for t in s["outputs"])
    links = []
    for slug in s["examples"]:
        item = PROJ.get(slug) or TOOL[slug]
        url = f"proyectos/{slug}/" if slug in PROJ else f"herramientas/#{slug}"
        links.append(f'<a href="{e(local(d,url))}"><span>{e(item["title"])}</span>{icon("arrow",True)}</a>')
    flow = tech_badges(d,s["stack"])
    body=f"""<section class="page-hero service-detail-hero"><div class="wrap">{crumb(d,[("servicios/","Servicios"),(None,s["title"])])}
    <span class="eyebrow">Área de trabajo / Soluciones a medida</span><h1>{e(s["title"])}<span class="orange">.</span></h1>
    <p class="lead">{e(s["lead"])}</p><div class="page-meta"><span>Evaluación caso a caso</span><span>Primer diagnóstico conversado: gratuito</span></div></div></section>
    <section class="section service-detail-brief"><div class="wrap">{overline("01","Problema y enfoque")}
    <div class="case-layout"><article class="prose"><h2>Qué situación abordo.</h2><p>{e(s["situation"])}</p>
    <h3>Cómo decido la solución</h3><p>{e(s["approach"])}</p></article>
    <aside><p class="eyebrow">Ejemplos de entregables según alcance</p><ul>{outputs}</ul>
    <p class="eyebrow" style="margin-top:2rem">Tecnologías utilizadas en esta línea</p><div class="tag-list">{flow}</div>
    <p class="hint">La selección final depende del problema; no todas las herramientas se usan en todos los encargos.</p></aside></div></div></section>
    <section class="section" style="background:var(--paper2)"><div class="wrap">{overline("02","Experiencia demostrada")}
    <div class="section-head"><h2>Trabajos que aportan contexto.</h2><p>No son promesas de resultados: permiten revisar tipos de sistemas y decisiones técnicas que ya he trabajado.</p></div>
    <div class="related">{"".join(links)}</div></div></section>
    <section class="section"><div class="wrap"><div class="contact-board"><div><span class="eyebrow" style="color:var(--ink)">03 / Contacto</span><h2>¿Tienes un proceso parecido?</h2></div>
    <div><p>Cuéntame qué haces hoy y qué necesitas cambiar. La primera conversación es gratuita.</p>
    {a(d,"contacto/","Revisemos tu caso "+icon("arrow",True),"button dark")}</div></div></div></section>"""
    page("servicios/"+s["slug"],s["title"]+" — JMorgado",s["lead"],body,"servicios")
def method():
    d=1
    included=["Escuchar qué necesitas resolver y cuál es la dificultad","Comprender de forma inicial el proceso y sus herramientas","Comentar alternativas posibles y una ruta para continuar"]
    excluded=["Auditoría exhaustiva de archivos o sistemas","Cambios técnicos, instalaciones o reparación gratuita","Acceso inmediato a credenciales o datos sensibles"]
    def cells(arr):return "".join(f'<li>{e(item)}</li>' for item in arr)
    body=f"""<section class="page-hero method-hero"><div class="wrap">{crumb(d,[(None,"Método")])}
    <span class="eyebrow">Cómo trabajo</span><h1>Empiezo con un caso concreto<span class="orange">.</span></h1>
    <p class="lead">Me sirve ver la tarea como ocurre hoy. Una fila dudosa, un archivo que siempre hay que corregir o una excepción que sólo conoce quien hace el trabajo.</p></div></section>
    <section class="section method-example"><div class="wrap method-layout">
    <div class="method-copy"><p class="eyebrow">Conciliación de pedidos · Caso hipotético</p>
    <h2>Qué hacemos cuando dos fuentes discrepan.</h2>
    <p>Primero acordaría qué dato identifica cada pedido y qué fuente manda cuando hay una diferencia. Probaría esas reglas con pedidos duplicados, registros incompletos y montos distintos.</p>
    <p>Entregaría el resultado junto a una lista de excepciones, una forma de repetir la prueba y las instrucciones para ajustar las reglas.</p>
    {a(d,"calculadora/","Estimar el tiempo de esta tarea "+icon("arrow",True))}</div>{order_example()}</div></section>
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
    before_h, before_m = divmod(ORDER_CASE["before"], 60)
    after_h, after_m = divmod(ORDER_CASE["after"], 60)
    body=f"""<section class="page-hero calculator-hero"><div class="wrap">{crumb(d,[(None,"Calculadora")])}
    <span class="eyebrow">Herramienta interactiva / Estimación de tiempo</span><h1>El tiempo también cuenta<span class="orange">.</span></h1>
    <p class="lead">La calculadora parte con el cierre de pedidos de la portada. Cambia los tiempos, la frecuencia y el número de personas para estimar tu propio caso.</p></div></section>
    <section class="section calculator-panel"><div class="wrap">{overline("01","Compara dos escenarios")}
    <div class="calc-grid"><form id="calculator" novalidate aria-label="Calculadora de tiempo recuperado">
    <div class="calc-fields">
    <div class="field-title full">A / Tiempo activo actual por ejecución</div>
    <div class="field"><label for="before-h">Horas</label><input id="before-h" type="number" min="0" step="1" value="{before_h}" inputmode="numeric"></div>
    <div class="field"><label for="before-m">Minutos (0 a 59)</label><input id="before-m" type="number" min="0" max="59" step="1" value="{before_m}" inputmode="numeric"></div>
    <div class="field-title full">B / Intervención humana posterior</div>
    <div class="field"><label for="after-h">Horas</label><input id="after-h" type="number" min="0" step="1" value="{after_h}" inputmode="numeric"></div>
    <div class="field"><label for="after-m">Minutos (0 a 59)</label><input id="after-m" type="number" min="0" max="59" step="1" value="{after_m}" inputmode="numeric"></div>
    <div class="field-title full">C / Frecuencia y dedicación</div>
    <div class="field"><label for="frequency">Veces que se repite</label><input id="frequency" type="number" min=".01" step="any" value="{ORDER_CASE["runs_per_week"]}"></div>
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
    <div class="result-value" id="per-run">{ORDER_CASE["before"] - ORDER_CASE["after"]} min</div>
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
    <div class="section-head"><h2>Cómo leer el resultado.</h2>
    <p>El caso de pedidos supone cinco cierres por semana durante 52 semanas. Si la tarea es estacional o cambia de frecuencia, ajusta ese dato para representar mejor tu operación.</p></div>
    <p>{a(d,"contacto/","Revisemos un proceso real "+icon("arrow",True))}</p></div></section>"""
    page("calculadora","Calculadora de tiempo recuperado al automatizar tareas","Calcula horas recuperadas por ejecución, semana, mes y año al automatizar una tarea. Estimación local sin enviar datos; valor económico opcional.",body,"calculadora")
    path=ROOT/"calculadora"/"index.html"
    text=path.read_text(encoding="utf-8")
    text=text.replace("</body></html>",'<script src="../assets/calculator.js" defer></script></body></html>')
    path.write_text(text,encoding="utf-8")
def contact():
    d=1
    booking_url="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3nJEkpRw3rSiFc6ldUwwIPkAhPsU7OYKU8sa3XNiW_B1-6MrMRT9YLVTwZir0YJCvPp57moGoW"
    booking_embed = booking_url + "?gv=true"
    booking_panel = f"""<div class="project-portal-frame booking-portal-frame" data-portal-frame></div>
    <template data-portal-template><iframe title="Horarios de Google Calendar" src="{e(booking_embed)}"
    referrerpolicy="strict-origin-when-cross-origin"></iframe></template>
    <p class="project-portal-note">Si no ves los horarios, puedes abrir la agenda de Google en otra pestaña.</p>"""
    booking_dialog = portal_dialog(d, title="Elige un horario", subtitle="Google Calendar · 45 min", url=booking_url,
                                   mode="live booking-portal", panel=booking_panel, filter_available=True)
    booking_description=("Conversación inicial gratuita de 45 minutos para conocer el problema o proceso que quieres mejorar, "
        "entender cómo lo resuelves hoy y explorar alternativas con datos, automatización, integraciones, desarrollo de software "
        "o inteligencia artificial. No necesitas llegar con una solución definida ni preparar documentación; basta con contar "
        "el contexto y el resultado que buscas. Evita incluir información confidencial al describir tu consulta.")
    body=f"""<section class="page-hero contact-hero"><div class="wrap">{crumb(d,[(None,"Contacto")])}
    {interior_art("modular-v02/K02-marco-editorial.svg","contact-frame-art")}
    <span class="eyebrow">Conversación directa / Diagnóstico inicial gratuito</span>
    <h1>¿Qué necesitas resolver<span class="orange">?</span></h1>
    <p class="lead">Cuéntame qué haces hoy y qué parte te está tomando más tiempo del que debería.</p>
    {external(WHATSAPP,"Conversemos por WhatsApp "+icon("arrow",True),"button dark")}</div></section>
    <section class="section booking-section" id="agenda" aria-labelledby="booking-title"><div class="wrap">
    {overline("01","Agenda una conversación")}
    <div class="booking-intro"><div><h2 id="booking-title">Elige un horario para conversar.</h2>
    <p class="lead">{e(booking_description)}</p></div>
    <p class="booking-time">45 min · Google Calendar<br><span>Hora de Chile</span></p></div>
    <a class="button dark" href="{e(booking_url)}" data-project-portal>Ver horarios {icon("window",True)}</a>
    {booking_dialog}
    </div></section>
    <section class="section"><div class="wrap">{overline("02","Primer contacto")}
    <div class="case-layout"><div><h2>Cuéntame cómo haces hoy la tarea.</h2><p class="lead">Podemos empezar por el resultado que esperas y las herramientas que ya usas.</p>
    <p style="margin-top:2rem">{external(LINKEDIN,"Contactar por LinkedIn "+icon("arrow",True),"button strong")}</p>
    <p class="hint">Si prefieres conversar antes de reservar, también puedes escribirme por LinkedIn.</p></div>
    <aside><p class="eyebrow">Orientación / sin costo</p>
    <p>La primera conversación ayuda a decidir si conviene evaluar el problema con más detalle. Una auditoría, instalación, desarrollo o intervención se presupuestan y acuerdan por separado.</p>
    <p class="hint">No envíes credenciales, bases de clientes, datos privados ni archivos sensibles en el primer mensaje.</p></aside></div></div></section>
    <section class="ink-panel"><div class="wrap">{overline("03","Antes de conversar")}
    <div class="statement"><h2>Una pregunta es suficiente para comenzar.</h2>
    <p class="lead">¿Qué parte de tu trabajo requiere tiempo que podría dedicarse a algo más útil? Si no lo tienes claro, también podemos revisarlo.</p></div></div></section>"""
    page("contacto","Agenda una conversación","Agenda una conversación inicial gratuita de 45 minutos con JMorgado. Reserva directamente desde la web mediante Google Calendar.",body,"contacto")
if __name__=="__main__":
    home();portfolio();tools_index();game_page();redirect_legacy_tools()
    for p in PROJECTS:project_detail(p)
    services_index()
    for s in SERVICES:service_detail(s)
    method();calc();contact()
