"""Compilador del sitio estático JMorgado.
Ejecutar: python build_site.py
Sólo escribe HTML dentro de landing/ y sus subdirectorios.
No modifica proyectos de clientes, repositorios ni DatosDemoCL.
"""
from __future__ import annotations
from html import escape
from pathlib import Path
import json
import re
from hashlib import sha256
from urllib.parse import urlsplit
from site_data import (LEGACY_TOOL_SLUGS, PROJECT_ARCHIVE, PROJECT_CONTEXT, PROJECT_DECISIONS,
                       PROJECT_MARKS, PROJECTS, PROJECT_PORTAL_PAGES, SERVICE_CONTACT,
                       SERVICE_EXTRAS, SERVICE_VISUALS, SERVICES, TECNOLOGIAS, TECH_ICON,
                       TOOLS)

ROOT = Path(__file__).resolve().parent
PROJ = {p["slug"]: p for p in PROJECTS}
# Paginas que usan el sistema de fichas (fx-*). El resto mantiene la ficha legacy.
FICHA_PAGES = ("proyectos/impulsacv", "proyectos/el-cambiometro", "proyectos/conecta", "proyectos/ryvolt", "proyectos/flor-de-almendro", "proyectos/exo-dream", "proyectos/tobys-warehouse", "proyectos/kooke-portal", "proyectos/kooke-rrss")
# Paginas con diagramas Archify: cargan el modulo generico de integracion.
FICHA_ARCHIFY_PAGES = ("proyectos/impulsacv", "proyectos/el-cambiometro", "proyectos/conecta", "proyectos/flor-de-almendro", "proyectos/exo-dream", "proyectos/tobys-warehouse", "proyectos/kooke-portal", "proyectos/kooke-rrss")
# CSS especifico por ficha.
FICHA_CSS = {"proyectos/ryvolt": "assets/project-ryvolt.css",
            "proyectos/flor-de-almendro": "assets/project-flor.css",
            "proyectos/exo-dream": "assets/project-exo.css",
            "proyectos/tobys-warehouse": "assets/project-hangar.css",
            "proyectos/kooke-portal": "assets/project-kokeai.css",
            "proyectos/kooke-rrss": "assets/project-rrss.css"}
TOOL = {tool["slug"]: tool for tool in TOOLS}
SERV = {s["slug"]: s for s in SERVICES}
LINKEDIN = "https://www.linkedin.com/in/jorge-morgado/"
WHATSAPP = "https://wa.me/56933904330"
BOOKING_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3nJEkpRw3rSiFc6ldUwwIPkAhPsU7OYKU8sa3XNiW_B1-6MrMRT9YLVTwZir0YJCvPp57moGoW"
SITE_URL = "https://jmorgadodev.github.io/"
SOCIAL_IMAGE = "assets/social-preview.png"
ORDER_CASE = {"before": 60, "after": 12, "runs_per_week": 5}
def e(value): return escape(str(value), quote=True)
def local(d, p=""): return "/" + p if d is None else "../"*d + p
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
<symbol id="i-linkedin" viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.4 2.4 4.4 5.6V21h-4v-5.3c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21h-3.9V9Z"/></symbol>
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
<symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M21 11.6a9 9 0 0 1-13.2 8L3 21l1.3-4.7A9 9 0 1 1 21 11.6Z"/><path d="M9.7 7.6c-.4-.7-1-.8-1.5-.2-.9 1-.6 2.6 1 4.5 1.8 2 3.8 3 5.2 2.8.9-.1 1.5-.7 1.5-1.4l-2.2-1.1-.9.9c-1.4-.6-2.4-1.5-3-2.9l.9-.8Z"/></symbol>
</svg>"""
def meta(d, title, description, active="", journey=False, *, canonical=None, jsonld=None):
    # Una sola cabecera para todo el sitio. La portada es la referencia: los
    # servicios van a su pagina, las herramientas tambien y sobre mi y contacto
    # apuntan a la seccion que corresponde en cada contexto.
    nav_items=([("servicios/","Servicios","servicios"),("#trabajos","Proyectos","proyectos"),
                ("herramientas/","Herramientas","herramientas"),("#quien-soy","Sobre mí","persona"),
                ("#contacto","Contacto","contacto")] if journey else
               [("servicios/","Servicios","servicios"),("proyectos/","Proyectos","proyectos"),
                ("herramientas/","Herramientas","herramientas"),("#quien-soy","Sobre mí","persona"),
                ("contacto/","Contacto","contacto")])
    links="".join(f'<a href="{e(local(d,u))}"' + (' class="nav-contact"' if section=="contacto" else '')+(' aria-current="page"' if section==active else '')+f'>{e(t)}</a>' for u,t,section in nav_items)
    journey_css=(f'<link rel="stylesheet" href="{e(asset(d,"assets/journey-study.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/booking.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-narrative.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-refinement.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-art-direction.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-editorial-pass.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-identity-system.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-visual-pass-03.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-visual-pass-05.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-visual-pass-06.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-theme-quality.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-layout-rhythm.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-depth-editorial.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-hierarchy.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-project-carousel.css"))}">'
                 f'<link rel="stylesheet" href="{e(asset(d,"assets/home-tools-rig.css"))}">') if journey else ""
    body_class=' class="home-page"' if journey else ''
    descriptor='Una forma de resolver' if journey else 'Desarrollo independiente<br>Software, datos y procesos'
    monogram='JM.'
    home_target=local(d) + "#home-start"
    controls=''
    # El control de tema es un icono en todas las paginas: la cabecera lleva
    # la marca «JM.» a la izquierda y el icono del día y la noche a la derecha.
    theme_icon=' data-theme-icon'
    progress='' if journey else ''
    fonts = '' if journey or active=="jugar" else """<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">"""
    robots = "index,follow" if canonical else "noindex,follow"
    canonical_meta = f'<link rel="canonical" href="{e(canonical)}"><meta property="og:url" content="{e(canonical)}">' if canonical else ""
    head = f"""<!doctype html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} | JMorgado</title><meta name="description" content="{e(description)}">
<meta name="robots" content="{robots}"><meta name="theme-color" content="#F0EDE5">
<meta property="og:type" content="website"><meta property="og:locale" content="es_CL">
<meta property="og:title" content="{e(title)} | JMorgado"><meta property="og:description" content="{e(description)}">
<meta property="og:image" content="{e(SITE_URL + SOCIAL_IMAGE)}">
<meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Jorge Morgado · Desarrollo web, datos y automatización. Composición con piezas modulares de JMorgado.">
{canonical_meta}
<link rel="icon" type="image/svg+xml" href="{e(local(d,'assets/favicon.svg'))}">
{fonts}
<script src="{e(local(d,'assets/theme-init.js'))}"></script>
<link rel="stylesheet" href="{e(asset(d,'assets/site.css'))}">
<link rel="stylesheet" href="{e(local(d,'assets/themes.css'))}">
<link rel="stylesheet" href="{e(asset(d,'assets/interior.css'))}">
</head><body{body_class}><a class="skip-link" href="#contenido">Saltar al contenido</a>{SYMBOLS}
<header class="site-header jm-header"><div class="wrap header-inner">
<a class="wordmark" href="{e(home_target)}" data-home-return aria-label="Volver al inicio de la experiencia JMorgado"><span class="mark" aria-hidden="true">{monogram}</span><span class="wordmark-text">JMorgado<span class="orange">.</span></span></a>
<div class="header-sub">{descriptor}</div>{controls}
<button type="button" class="menu-toggle" data-menu-toggle aria-controls="main-nav" aria-expanded="false">Menú +</button>
<button type="button" class="theme-toggle" data-theme-toggle{theme_icon} aria-pressed="false" aria-label="Cambiar a modo noche">Noche</button>
<nav class="nav" id="main-nav" data-nav aria-label="Navegación principal">{links}</nav>
</div>{progress}</header>"""
    if jsonld:
        bloques = jsonld if isinstance(jsonld, list) else [jsonld]
        etiquetas = "".join('<script type="application/ld+json">' + json.dumps(bloque, ensure_ascii=False) + "</script>" for bloque in bloques)
        head=head.replace("</head>", etiquetas + "</head>")
    if journey:
        head=head.replace('</head>',journey_css+'</head>')
    if active=="contacto":
        booking_css=f'<link rel="stylesheet" href="{e(asset(d,"assets/booking.css"))}">'
        head=head.replace('</head>',booking_css+'</head>')
    if active=="metodo":
        head=head.replace('</head>', f'<link rel="stylesheet" href="{e(asset(d,"assets/metodo.css"))}"></head>')
    if active=="jugar":
        head=head.replace("</head>", f'<link rel="stylesheet" href="{e(asset(d,"assets/tetris.css"))}"></head>')
    return head
def foot(d, journey=False, active=""):
    extra=''.join(f'<script src="{e(asset(d,path))}" defer></script>' for path in ['assets/vendor/gsap.min.js','assets/vendor/ScrollTrigger.min.js','assets/journey-study.js']) if journey else ''
    if active=="jugar":
        extra += f'<script src="{e(asset(d,"assets/tetris.js"))}" defer></script>'
    if active=="metodo":
        extra += f'<script src="{e(asset(d,"assets/metodo.js"))}" defer></script>'
    if journey or active=="herramientas":
        extra += f'<script src="{e(asset(d,"assets/tool-panel.js"))}" defer></script>'
    if journey:
        extra += f'<script src="{e(asset(d,"assets/calculator.js"))}" defer></script>'
        extra += f'<script src="{e(asset(d,"assets/home-quick-calculator.js"))}" defer></script>'
        extra += f'<script src="{e(asset(d,"assets/home-calculator-drawer.js"))}" defer></script>'
        extra += f'<script src="{e(asset(d,"assets/home-narrative.js"))}" defer></script>'
        extra += f'<script src="{e(asset(d,"assets/home-project-carousel.js"))}" defer></script>'
    fab_hidden = " hidden" if journey else ""
    # Un solo pie para todo el sitio: identidad a la izquierda, enlaces a la
    # derecha y una linea fina con el cierre y el regreso.
    footer_html=f"""<footer class="site-footer jm-footer"><div class="wrap">
      <div class="jm-footer-top">
        <div class="jm-footer-brand">
          <span class="jm-footer-mark">JM.</span>
          <p>Desarrollo web, datos y automatización para resolver necesidades concretas.</p>
        </div>
        <nav class="jm-footer-links" aria-label="Explorar el sitio">
          <a href="{e(local(d,'servicios/'))}">Servicios</a>
          <a href="{e(local(d,'proyectos/'))}">Proyectos</a>
          <a href="{e(local(d,'herramientas/'))}">Herramientas</a>
          <a href="{e(local(d,'#quien-soy'))}">Sobre mí</a>
          <a href="{e(local(d,'contacto/'))}">Contacto</a>
        </nav>
      </div>
      <div class="jm-footer-base">
        <span>© 2026 Jorge Morgado</span>
        <a href="{e(local(d,'#home-start'))}" data-home-return>Volver al inicio ↑</a>
      </div>
    </div></footer>"""
    if journey:
        return footer_html+f"""
        <a class="whatsapp-fab" href="{e(WHATSAPP)}" target="_blank" rel="noopener noreferrer" aria-label="Escribirme por WhatsApp" hidden>{icon("whatsapp")}</a>
        <script src="{e(asset(d,'assets/site.js'))}" defer></script>{extra}</body></html>"""
    return footer_html+f"""
    <script src="{e(asset(d,'assets/site.js'))}" defer></script>{extra}</body></html>"""
def page(where,title,description,content,active="",journey=False,jsonld=None):
    target=ROOT / where / "index.html" if where else ROOT / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    depth=len(Path(where).parts) if where else 0
    canonical=SITE_URL+(where.strip("/")+"/" if where else "")
    head=meta(depth,title,description,active,journey,canonical=canonical,jsonld=jsonld)
    archive = where == "proyectos"
    if archive:
        head=head.replace("</head>", f'<link rel="stylesheet" href="{e(asset(depth,"assets/project-archive.css"))}"></head>')
    ficha = where in FICHA_PAGES
    if ficha:
        head=head.replace("</head>", f'<link rel="stylesheet" href="{e(asset(depth,"assets/ficha.css"))}"></head>')
    archify = where in FICHA_ARCHIFY_PAGES
    if archify:
        head=head.replace("</head>", f'<link rel="stylesheet" href="{e(asset(depth,"assets/project-archify.css"))}"></head>')
    impulsacv = where == "proyectos/impulsacv"
    if impulsacv:
        head=head.replace("</head>", f'<link rel="stylesheet" href="{e(asset(depth,"assets/project-impulsacv.css"))}"></head>')
    if where in FICHA_CSS:
        head=head.replace("</head>", f'<link rel="stylesheet" href="{e(asset(depth,FICHA_CSS[where]))}"></head>')
    output=head+f'<main id="contenido">{content}</main>'+foot(depth,journey,active)
    if archive:
        output=output.replace("</body></html>", f'<script src="{e(asset(depth,"assets/project-archive.js"))}" defer></script></body></html>')
    if archify:
        output=output.replace("</body></html>", f'<script src="{e(asset(depth,"assets/project-archify.js"))}" defer></script></body></html>')
    target.write_text(output,encoding="utf-8")
    print("PAGE",target.relative_to(ROOT))

def not_found():
    title = "Página no encontrada"
    description = "La página que buscas ya no está en esta dirección. Vuelve al inicio o explora los proyectos de JMorgado."
    body = f"""<main id="contenido"><section class="page-hero"><div class="wrap">
    <p class="eyebrow">Error 404</p><h1>{title}<span class="orange">.</span></h1>
    <p class="lead">{description}</p>
    <p class="missing-actions">{a(None,"","Volver al inicio","button strong")} {a(None,"proyectos/","Ver proyectos","button")}</p>
    </div></section></main>"""
    (ROOT / "404.html").write_text(meta(None, title, description) + body + foot(None), encoding="utf-8")

def overline(number,caption):
    return f'<div class="overline"><span class="num">{e(number)} · {e(caption)}</span></div>'
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
    slug=p["slug"]
    detail=local(d, "proyectos/"+slug+"/")
    summaries={
        "impulsacv":"Una plataforma para crear, revisar y mejorar currículums.",
        "el-cambiometro":"Información pública reunida para consultar y comparar su evolución.",
        "ryvolt":"Un sitio bilingüe para presentar los servicios de la marca.",
        "flor-de-almendro":"Un catálogo digital que el negocio puede mantener actualizado."
    }
    summary=summaries.get(slug, PROJECT_CONTEXT[slug][1])
    return f"""<a class="feature feature-{e(slug)}" href="{e(detail)}" aria-label="Abrir el proyecto {e(p['title'])}">
      <div class="feature-identity">{project_mark(d,p)}<h3>{e(p['title'])}</h3></div>
      <p class="feature-summary">{e(summary)}</p>
      <span class="feature-arrow" aria-hidden="true">{icon("arrow",True)}</span>
    </a>"""

def home_project_carousel(d, projects):
    # Galería circular: una pieza central grande y el resto entrando en profundidad.
    # Sin numeración, flechas ni instrucciones visibles.
    blurbs = {
        "impulsacv": "Currículums y herramientas para acompañar la búsqueda de empleo.",
        "el-cambiometro": "Datos públicos organizados para consultar su evolución.",
        "conecta": "Calendario y contenido de marcas coordinados en un mismo espacio.",
        "ryvolt": "Una experiencia corporativa bilingüe para presentar servicios.",
        "flor-de-almendro": "Catálogo de joyería que el negocio puede actualizar.",
        "exo-dream": "Showroom digital con catálogo, agenda y fichas configurables.",
        "tobys-warehouse": "Tiempos y resultados compartidos de competencias.",
        "kooke-portal": "Colecciones multimedia reunidas para explorar contenido.",
        "kooke-rrss": "Planificación y producción asistida de publicaciones.",
    }
    # Colores corporativos verificados; el resto usa los acentos ya definidos del sitio.
    brand = {
        "ryvolt": "#0098A9",
        "tobys-warehouse": "#E52421",
        "kooke-portal": "#00F2FF",
        "conecta": "#23494E",
    }
    fallback = {"tobys-warehouse": "Hangar354", "kooke-portal": "kokeAI", "kooke-rrss": "RRSS"}
    cards = []
    for p in projects:
        slug = p["slug"]
        if slug in PROJECT_MARKS:
            logo = project_mark(d, p)
        else:
            logo = f'<span class="projects-flow-fallback" aria-hidden="true">{e(fallback.get(slug, p["title"]))}</span>'
        color = brand.get(slug) or ("var(--jm-coral)" if p["accent"] == "orange" else "var(--jm-petrol)")
        href = e(local(d, "proyectos/" + slug + "/"))
        cards.append(f'''<a class="projects-flow-card" href="{href}" data-project-card
             data-project-slug="{e(slug)}" data-project-name="{e(p['title'])}"
             style="--pf-brand:{color}" aria-label="Abrir la ficha de {e(p['title'])}">
          <span class="projects-flow-card-surface">
            <span class="projects-flow-logo">{logo}</span>
            <span class="projects-flow-copy">
              <strong class="projects-flow-name">{e(p['title'])}</strong>
              <span class="projects-flow-desc">{e(blurbs.get(slug, p["summary"]))}</span>
            </span>
          </span>
        </a>''')
    return f'''<div class="projects-carousel" data-project-carousel>
      <div class="projects-flow-stage" data-project-track role="region"
        aria-roledescription="galería circular de proyectos"
        aria-label="Proyectos. Usa las flechas izquierda y derecha para recorrer la galería; Intro abre la ficha del proyecto centrado.">
        <div class="projects-flow-atmosphere" aria-hidden="true"></div>
        {"".join(cards)}
      </div>
      <p class="projects-flow-status" data-flow-status role="status" aria-live="polite"></p>
    </div>'''


ARCHIVE_FAMILIES = (
    ("todos", "Todos"),
    ("software", "Software y plataformas"),
    ("datos", "Datos e ingeniería"),
    ("web", "Web y catálogos"),
    ("automatizacion", "Automatización"),
)

def archive_entry(d,p,idx):
    """Fila editorial del Archivo de proyectos. El panel contextual lee estos datos."""
    entry = PROJECT_ARCHIVE[p["slug"]]
    participation, _ = PROJECT_CONTEXT[p["slug"]]
    url = local(d,"proyectos/"+p["slug"]+"/")
    families = " ".join(entry["families"])
    return f"""<a class="archive-row" href="{e(url)}" data-project-category="{e(families)}" data-archive-index="{idx}"
      data-name="{e(p["title"])}" data-label="{e(p["label"])}"
      data-problem="{e(p["problem"])}" data-solution="{e(entry["solution"])}" data-role="{e(participation)}"
      style="--row-accent:{e(entry["accent"])}" aria-label="Abrir el caso: {e(p["title"])}">
      <span class="archive-signal" aria-hidden="true"></span>
      <span class="archive-identity"><h2>{e(p["title"])}</h2><span class="archive-label">{e(p["label"])}</span></span>
      <span class="archive-brief">{e(entry["brief"])}</span>
      <span class="archive-go" aria-hidden="true">{icon("arrow")}</span></a>"""

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

def tech_chips(d, names):
    """Chips de tecnologia con icono. Reutiliza el chip compartido del sitio
    (`.tag.tech-badge`) y los SVG locales de `assets/tech-icons/`."""
    chips = []
    for name in names:
        archivo = TECH_ICON.get(name)
        imagen = ""
        if archivo:
            imagen = (f'<img src="{e(asset(d, "assets/tech-icons/" + archivo))}" alt="" width="26" height="26"'
                      f' loading="lazy" decoding="async">')
        chips.append(f'<span class="tag tech-badge tech-badge--icon">{imagen}{e(name)}</span>')
    return "".join(chips)


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

def tool_links(tool):
    """Enlaces de la ficha: primero la referencia (codigo, documentacion, versiones)
    y despues la descarga, que es la accion principal."""
    reference = [external(tool["repo"], "GitHub")]
    if tool.get("docs"):
        label, url = tool["docs"]
        reference.append(external(url, label))
    for label, url in tool.get("extra_links", []):
        reference.append(external(url, label))
    downloads = []
    for index, (label, url) in enumerate(tool.get("downloads", [])):
        downloads.append(external(url, label, "button" if index == 0 else "button outline"))
    return (f'<div class="tool-links"><div class="tool-links-row">{"".join(reference)}</div>'
            f'<div class="tool-links-downloads">{"".join(downloads)}</div></div>')


def tool_detail_body(d, tool):
    """Cuerpo de la ficha, en tres bloques: contenido, ficha tecnica y recursos.
    Es el mismo bloque que se despliega en el panel y el que queda como alternativa
    sin JavaScript; dentro del panel se reparte en columnas."""
    facts = " · ".join(e(tool[key]) for key in ("platform", "state"))
    features = "".join(f"<li>{e(feature)}</li>" for feature in tool["features"])
    licenses = "".join(f"<dt>{e(scope)}</dt><dd>{e(name)}</dd>" for scope, name in tool["licenses"])
    note = f'<p class="tool-detail-note">{e(tool["note"])}</p>' if tool.get("note") else ""
    caution = ""
    if tool.get("caution"):
        label, text = tool["caution"]
        caution = f'<p class="tool-caution"><strong>{e(label)}.</strong> {e(text)}</p>'
    return f"""<div class="tool-detail-main">
    <p class="tool-facts mono small">{facts}</p>
    <p class="tool-detail-summary">{e(tool["description"])}</p>
    <h3>Qué resuelve</h3><p>{e(tool["problem"])}</p>
    <h3>Qué incluye</h3><ul class="tool-detail-features">{features}</ul>
    </div>
    <aside class="tool-detail-side">
    <h3>Tecnologías</h3><div class="tag-list">{tech_badges(d,tool["tech"])}</div>
    <h3>Licencia</h3><dl class="tool-license">{licenses}</dl>
    {note}{caution}
    </aside>
    <div class="tool-detail-resources">
    <h3>Recursos</h3>{tool_links(tool)}
    </div>"""


def tool_card(d, tool, heading="h3"):
    facts = " · ".join(e(tool[key]) for key in ("platform", "state"))
    name = e(tool["title"])
    return f"""<article class="tool-card tool-{e(tool["tone"])}" id="{e(tool["slug"])}">
    <div class="tool-info">
    <p class="tool-task">{icon(tool["icon"])} {e(tool["task"])}</p>
    <{heading} class="tool-name">{name}</{heading}><p>{e(tool["summary"])}</p>
    <p class="tool-facts mono small">{facts}</p>
    <details class="tool-details"><summary>Ver ficha <span class="sr-only">de {name}</span>{icon("arrow",True)}</summary>
    <div class="tool-detail-body">{tool_detail_body(d,tool)}</div></details></div>
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
    library = "".join(
        f'<template data-tool-template="{e(tool["slug"])}" data-tone="{e(tool["tone"])}">'
        f'<span class="tool-panel-glyph" aria-hidden="true">{tool_glyph(tool["slug"])}</span>'
        f'<p class="tool-panel-kicker">{e(tool["task"])}</p></template>'
        for tool in TOOLS)
    return """<dialog class="tool-panel" aria-labelledby="tool-panel-title">
    <div class="tool-panel-surface"><div class="tool-panel-header">
    <div class="tool-panel-heading">
    <span class="tool-panel-glyph" data-tool-glyph aria-hidden="true"></span>
    <div class="tool-panel-titles"><p class="tool-panel-kicker" data-tool-kicker></p>
    <h2 id="tool-panel-title"></h2></div></div>
    <button type="button" data-tool-close aria-label="Cerrar ficha" autofocus>×</button></div>
    <div class="tool-panel-scroll" data-tool-content></div></div>
    <div class="tool-panel-library" hidden>""" + library + """</div></dialog>"""

def tools_index():
    d = 1
    body = f"""<section class="page-hero tools-intro"><div class="wrap">{crumb(d,[(None,"Herramientas")])}
    <h1>Herramientas<span class="orange">.</span></h1>
    <div class="tools-intro-grid">
    <p class="lead">Software propio que desarrollo y comparto en abierto para registrar una visita técnica, automatizar acciones en Windows y probar con datos sintéticos. Cada ficha reúne el código, la documentación y las versiones disponibles.</p>
    <aside class="tools-intro-note">
    <p class="tools-open-note">Software abierto para que puedas revisar el código, utilizarlo, modificarlo y adaptarlo, respetando las condiciones de su licencia.</p>
    </aside></div></div></section>
    <section class="section tools-catalog"><div class="wrap">
    <div class="tool-grid">{"".join(tool_card(d,tool,"h2") for tool in TOOLS)}</div></div></section>{tool_drawer()}"""
    page("herramientas", "Herramientas y recursos", "AuditaPC, Nokto y DatosDemoCL. Software propio publicado en abierto, con documentación, licencias y descargas oficiales.", body, "herramientas")

def redirect_legacy_tools():
    for slug in LEGACY_TOOL_SLUGS:
        target = ROOT / "proyectos" / slug / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        destination = f"../../herramientas/#{slug}"
        target.write_text(f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url={destination}">
<link rel="canonical" href="https://jmorgadodev.github.io/herramientas/">
<meta name="description" content="{e('Consulta ' + TOOL[slug]['title'] + ' en Herramientas y recursos de JMorgado.')}">
<link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
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

def calculator_widget():
    before_h, before_m = divmod(ORDER_CASE["before"], 60)
    after_h, after_m = divmod(ORDER_CASE["after"], 60)
    return f"""<div class="calc-grid"><form id="calculator" novalidate aria-label="Calculadora de tiempo recuperado">
    <div class="calc-fields">
    <div class="field-title full">Tiempo activo actual por ejecución</div>
    <div class="field"><label for="before-h">Horas</label><input id="before-h" type="number" min="0" step="1" value="{before_h}" inputmode="numeric"></div>
    <div class="field"><label for="before-m">Minutos (0 a 59)</label><input id="before-m" type="number" min="0" max="59" step="1" value="{before_m}" inputmode="numeric"></div>
    <div class="field-title full">Intervención humana posterior</div>
    <div class="field"><label for="after-h">Horas</label><input id="after-h" type="number" min="0" step="1" value="{after_h}" inputmode="numeric"></div>
    <div class="field"><label for="after-m">Minutos (0 a 59)</label><input id="after-m" type="number" min="0" max="59" step="1" value="{after_m}" inputmode="numeric"></div>
    <div class="field-title full">Frecuencia y dedicación</div>
    <div class="field"><label for="frequency">Veces que se repite</label><input id="frequency" type="number" min=".01" step="any" value="{ORDER_CASE["runs_per_week"]}"></div>
    <div class="field"><label for="period">Frecuencia</label><select id="period"><option value="week">Por semana</option><option value="day">Por día</option><option value="month">Por mes</option></select></div>
    <div class="field" id="days-field" hidden><label for="days">Días de operación por semana</label><input id="days" type="number" min="1" max="7" step="1" value="5"></div>
    <div class="field"><label for="people">Personas con igual dedicación</label><input id="people" type="number" min="1" step="1" value="1"></div>
    <div class="field"><label for="workday">Horas por jornada</label><input id="workday" type="number" min=".1" step="any" value="8"></div></div>
    <p class="hint">Si ingresas el tiempo total del equipo, deja Personas = 1. Cuenta sólo trabajo activo, incluyendo revisión posterior, correcciones y excepciones.</p>
    <details><summary>Estimación económica opcional</summary><div class="calc-fields">
    <div class="field full"><label for="hour-cost">Valor del tiempo por hora (CLP)</label><input id="hour-cost" type="number" min="0" step="any" placeholder="Opcional"></div>
    <div class="field"><label for="initial-cost">Costo inicial de implementación (CLP)</label><input id="initial-cost" type="number" min="0" step="any" placeholder="Opcional"></div>
    <div class="field"><label for="monthly-cost">Costo mensual de operación (CLP)</label><input id="monthly-cost" type="number" min="0" step="any" placeholder="Opcional"></div></div></details>
    <p class="hint">{icon("scan",True)} Los cálculos se realizan en este navegador. Nada se transmite ni almacena.</p>
    </form><aside class="result" aria-live="polite" aria-atomic="true">
    <div class="eyebrow">Tiempo recuperado por persona</div>
    <div class="result-value" id="per-run">{ORDER_CASE["before"] - ORDER_CASE["after"]} min</div>
    <div class="result-status" id="calc-state">Tiempo activo recuperado por ejecución</div>
    <div class="result-stats">
    <div><strong id="per-week">—</strong><span>Por semana · equipo</span></div>
    <div><strong id="per-month">—</strong><span>Por mes · equipo</span></div>
    <div><strong id="per-year">—</strong><span>Por año · equipo</span></div>
    <div><strong id="reduction">—</strong><span>Variación del tiempo activo</span></div>
    <div><strong id="workdays">—</strong><span>Jornadas equivalentes al mes</span></div>
    <div><strong id="execs">—</strong><span>Ejecuciones mensuales</span></div></div>
    <p class="result-money" id="money-output" hidden></p><p class="result-note" id="assumptions"></p>
    <p class="result-note" id="calc-error" role="status"></p></aside></div>"""

def home_problem_visual():
    return """<figure class="problem-schematic" aria-label="Tres fuentes de trabajo convergen en un mapa del proceso">
      <figcaption class="problem-schematic-head"><span>FUENTES DE INFORMACIÓN</span><span>01—03 · ENTRADAS</span></figcaption>
      <svg class="problem-flow-wide" viewBox="0 0 740 420" role="img" aria-labelledby="problem-flow-title problem-flow-desc">
        <title id="problem-flow-title">De tres fuentes a una lectura común</title>
        <desc id="problem-flow-desc">Una planilla, dos sistemas y un proceso manual se analizan para construir un mapa de datos, reglas y excepciones.</desc>
        <g fill="none" stroke="#737B69" stroke-width="2">
          <path d="M266 76H316V208H374"/><path d="M266 207H374"/><path d="M266 338H316V208"/>
          <path d="M356 208H390" stroke="#F45A3A" stroke-width="3"/>
        </g>
        <g fill="#F45A3A"><circle cx="266" cy="76" r="4"/><circle cx="266" cy="207" r="4"/><circle cx="266" cy="338" r="4"/><path d="m384 201 9 7-9 7z"/></g>

        <g>
          <rect x="25" y="38" width="244" height="84" fill="#C9C8B7"/>
          <rect x="18" y="31" width="244" height="84" fill="#FCFAF5" stroke="#23494E" stroke-width="1.5"/>
          <rect x="18" y="31" width="244" height="22" fill="#23494E"/>
          <text x="30" y="46" fill="#FCFAF5" font-size="12" font-family="monospace" letter-spacing="1">PLANILLA · VENTAS.XLSX</text>
          <path d="M30 66H250M30 82H250M30 98H250M90 58V108M165 58V108" stroke="#B8B9AE" stroke-width="1"/>
          <path d="M30 66H90M90 82H165M165 98H250" stroke="#737B69" stroke-width="2"/>

          <rect x="25" y="169" width="244" height="84" fill="#C9C8B7"/>
          <rect x="18" y="162" width="244" height="84" fill="#FCFAF5" stroke="#23494E" stroke-width="1.5"/>
          <rect x="18" y="162" width="244" height="22" fill="#23494E"/>
          <text x="30" y="177" fill="#FCFAF5" font-size="12" font-family="monospace" letter-spacing="1">SISTEMAS · APP A + APP B</text>
          <rect x="31" y="193" width="91" height="40" fill="#F0EDE6" stroke="#737B69"/>
          <rect x="157" y="193" width="91" height="40" fill="#F0EDE6" stroke="#737B69"/>
          <path d="M41 204H108M41 212H91M41 220H101M167 204H234M167 212H216M167 220H226" stroke="#737B69" stroke-width="2"/>
          <path d="M125 212H154m-6-5 6 5-6 5" fill="none" stroke="#F45A3A" stroke-width="2"/>

          <rect x="25" y="300" width="244" height="84" fill="#C9C8B7"/>
          <rect x="18" y="293" width="244" height="84" fill="#FCFAF5" stroke="#23494E" stroke-width="1.5"/>
          <rect x="18" y="293" width="244" height="22" fill="#23494E"/>
          <text x="30" y="308" fill="#FCFAF5" font-size="12" font-family="monospace" letter-spacing="1">PROCESO · TAREA MANUAL</text>
          <path d="M48 346H220" stroke="#737B69" stroke-width="2"/>
          <g fill="#E8B769" stroke="#23494E" stroke-width="1.5"><circle cx="54" cy="346" r="8"/><circle cx="134" cy="346" r="8"/><circle cx="214" cy="346" r="8"/></g>
          <g fill="#222327" font-size="9" font-family="monospace" text-anchor="middle"><text x="54" y="365">01</text><text x="134" y="365">02</text><text x="214" y="365">03</text></g>
        </g>

        <g>
          <rect x="399" y="122" width="302" height="180" fill="#C9C8B7"/>
          <path d="M390 113H692V293H390Z" fill="#102E38" stroke="#23494E" stroke-width="1.5"/>
          <path d="M390 113H692" stroke="#F45A3A" stroke-width="4"/>
          <text x="414" y="143" fill="#E8B769" font-size="12" font-family="monospace" letter-spacing="1.3">LECTURA INICIAL</text>
          <text x="414" y="180" fill="#FCFAF5" font-size="28" font-family="sans-serif" font-weight="600">Mapa del proceso</text>
          <path d="M414 198H668" stroke="#5C797B" stroke-width="1"/>
          <g font-family="monospace" font-size="12">
            <circle cx="423" cy="222" r="4" fill="#F45A3A"/><text x="438" y="226" fill="#FCFAF5">DATOS</text>
            <circle cx="423" cy="248" r="4" fill="#E8B769"/><text x="438" y="252" fill="#FCFAF5">REGLAS</text>
            <circle cx="423" cy="274" r="4" fill="#AAB9A6"/><text x="438" y="278" fill="#FCFAF5">EXCEPCIONES</text>
          </g>
          <path d="M615 222h42m-42 26h42m-42 26h42" stroke="#5C797B" stroke-width="2"/>
          <path d="M650 217l7 5-7 5m0 21 7 5-7 5m0 21 7 5-7 5" fill="none" stroke="#E8B769" stroke-width="1.5"/>
        </g>
      </svg>
      <svg class="problem-flow-tall" viewBox="0 0 360 590" role="img" aria-labelledby="problem-flow-mobile-title problem-flow-mobile-desc">
        <title id="problem-flow-mobile-title">Fuentes de trabajo que se reúnen</title>
        <desc id="problem-flow-mobile-desc">Planillas, sistemas y procesos se conectan con un mapa de datos, reglas y excepciones.</desc>
        <g fill="none" stroke="#737B69" stroke-width="2"><path d="M180 110V130M180 235V255M180 360V405"/><path d="M174 397l6 9 6-9" stroke="#F45A3A" stroke-width="3"/></g>
        <g>
          <rect x="31" y="31" width="306" height="86" fill="#C9C8B7"/><rect x="24" y="24" width="306" height="86" fill="#FCFAF5" stroke="#23494E"/>
          <rect x="24" y="24" width="306" height="22" fill="#23494E"/><text x="38" y="39" fill="#FCFAF5" font-size="12" font-family="monospace">01 ? PLANILLA · VENTAS.XLSX</text>
          <path d="M38 62H315M38 78H315M38 94H315M118 54V102M216 54V102" stroke="#B8B9AE"/>
          <rect x="31" y="156" width="306" height="86" fill="#C9C8B7"/><rect x="24" y="149" width="306" height="86" fill="#FCFAF5" stroke="#23494E"/>
          <rect x="24" y="149" width="306" height="22" fill="#23494E"/><text x="38" y="164" fill="#FCFAF5" font-size="12" font-family="monospace">02 ? SISTEMAS · APP A + APP B</text>
          <rect x="40" y="184" width="110" height="37" fill="#F0EDE6" stroke="#737B69"/><rect x="204" y="184" width="110" height="37" fill="#F0EDE6" stroke="#737B69"/>
          <path d="M50 195h90m-90 8h72m92-8h90m-90 8h70M152 202h49m-6-5 6 5-6 5" stroke="#737B69" stroke-width="2" fill="none"/>
          <rect x="31" y="281" width="306" height="86" fill="#C9C8B7"/><rect x="24" y="274" width="306" height="86" fill="#FCFAF5" stroke="#23494E"/>
          <rect x="24" y="274" width="306" height="22" fill="#23494E"/><text x="38" y="289" fill="#FCFAF5" font-size="12" font-family="monospace">03 ? PROCESO · TAREA MANUAL</text>
          <path d="M66 328H288" stroke="#737B69" stroke-width="2"/><g fill="#E8B769" stroke="#23494E"><circle cx="72" cy="328" r="8"/><circle cx="177" cy="328" r="8"/><circle cx="282" cy="328" r="8"/></g>
          <g fill="#222327" font-size="9" font-family="monospace" text-anchor="middle"><text x="72" y="350">01</text><text x="177" y="350">02</text><text x="282" y="350">03</text></g>
          <rect x="31" y="423" width="306" height="145" fill="#C9C8B7"/>
          <path d="M24 416H330V561H24Z" fill="#102E38" stroke="#23494E"/>
          <path d="M24 416H330" stroke="#F45A3A" stroke-width="4"/>
          <text x="42" y="446" fill="#E8B769" font-size="12" font-family="monospace" letter-spacing="1">LECTURA INICIAL</text>
          <text x="42" y="480" fill="#FCFAF5" font-size="23" font-family="sans-serif" font-weight="600">Mapa del proceso</text>
          <path d="M42 494H312" stroke="#5C797B"/>
          <g font-family="monospace" font-size="12" fill="#FCFAF5"><text x="42" y="519">●  DATOS</text><text x="142" y="519">●  REGLAS</text><text x="42" y="541">●  EXCEPCIONES</text></g>
        </g>
      </svg>
      <figcaption class="problem-schematic-foot"><span>PLANILLAS</span><i></i><span>SISTEMAS</span><i></i><span>PROCESOS</span><i></i><strong>MAPA COMÚN</strong></figcaption>
    </figure>"""


def home_method_visual():
    stages = [
        ("Entender", "Escuchar lo que necesitas y revisar cómo se hace hoy."),
        ("Proponer", "Elegir una solución realista, sin sumar herramientas innecesarias."),
        ("Acompañar", "Desarrollar, probar y dejar todo listo para que puedas usarlo."),
    ]
    items = "".join(
        f"""<div class="method-step"><h3>{title}</h3><p>{description}</p></div>"""
        for title, description in stages
    )
    return f"""<div class="method-steps" aria-label="Cómo trabajo">
      {items}
    </div>"""


def home_tetris_visual(d):
    # Una sola ficha T: cuatro bloques, una silueta y una rotación continua.
    blocks = (("coral",0,0),("amber",1,0),("olive",2,0),("petrol",1,1))
    faces=("front","back","right","left","top","bottom")

    def offset(units):
        return "0px" if units == 0 else "calc(" + " + ".join(["var(--cube-step)"] * units) + ")"

    cubes=[]
    for color,x,y in blocks:
        cube_faces="".join(f'<i class="tetris-face tetris-face--{face}"></i>' for face in faces)
        cubes.append(
            f'<span class="tetris-cube tetris-cube--{color}" '
            f'style="--block-left:{offset(x)};--block-top:{offset(y)}">{cube_faces}</span>'
        )

    return f"""<div class="tetris-play-stage">
      <a class="tetris-piece-link" href="{e(local(d,'jugar/'))}" aria-label="Jugar Tetris: entrar a una partida individual">
        <span class="tetris-piece-scene" aria-hidden="true">
          <span class="tetris-piece-orbit tetris-piece-orbit--a"></span>
          <span class="tetris-piece-orbit tetris-piece-orbit--b"></span>
          <span class="tetris-piece-shadow"></span>
          <span class="tetris-piece-float">
            <span class="tetris-tetromino" data-tetris-piece="T">{"".join(cubes)}</span>
          </span>
          <span class="tetris-piece-signal" aria-hidden="true"></span>
        </span>
      </a>
      <a class="tetris-play-cta" href="{e(local(d,'jugar/'))}">
        <span class="tetris-play-cta-copy"><small>PARTIDA INDIVIDUAL</small><strong>Entrar al tablero</strong></span>
        <span class="tetris-play-cta-arrow">{icon("arrow",True)}</span>
      </a>
    </div>"""

TOOL_LABELS = {
    "auditapc": "Inventario y diagnóstico",
    "nokto": "Automatización de escritorio",
    "datosdemocl": "Generación de datos",
}

TOOL_TONES = {"auditapc": "petrol", "nokto": "coral", "datosdemocl": "amber"}

# Familia de iconos propia: misma retícula de 24, trazo 1,6, radios y densidad.
# Cada pieza = un panel reconocible + una marca funcional de su propósito.
TOOL_GLYPHS = {
    # Monitor con señal de diagnóstico: equipo + análisis técnico.
    "auditapc": (
        '<rect x="2.6" y="3.4" width="18.8" height="12.4" rx="1.8"/>'
        '<path d="M9 20.6h6"/><path d="M12 15.8v4.8"/>'
        '<path d="M5.2 10.3h2.3l1.2-2.5 2.2 5.4 1.3-2.9h6.2"/>'
    ),
    # Ventanas de escritorio encadenadas con ejecución: automatización de una rutina.
    "nokto": (
        '<path d="M7.2 10.8H4.1A1.5 1.5 0 0 1 2.6 9.3V4.7A1.5 1.5 0 0 1 4.1 3.2h10.2a1.5 1.5 0 0 1 1.5 1.5v3.1"/>'
        '<path d="M2.6 6h13.2"/>'
        '<rect x="8.2" y="9.4" width="13.2" height="11.4" rx="1.5"/>'
        '<path d="M13.2 12.4l3.4 2.7-3.4 2.7Z" fill="currentColor" stroke-linejoin="round"/>'
    ),
    # Registros estructurados + generación de un nuevo lote.
    "datosdemocl": (
        '<rect x="2.8" y="3.8" width="13" height="4.4" rx="1.2"/>'
        '<rect x="2.8" y="9.6" width="13" height="4.4" rx="1.2"/>'
        '<rect x="2.8" y="15.4" width="13" height="4.4" rx="1.2"/>'
        '<path d="M18.4 15.4v5.2M15.8 18h5.2"/>'
    ),
}

def tool_glyph(slug):
    return (f'<svg class="tool-piece-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false" '
            f'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
            f'{TOOL_GLYPHS.get(slug, "")}</svg>')

def home_tool_card(d, tool):
    outcomes={
        "auditapc":"Deja el inventario y los informes listos para continuar o compartir los hallazgos.",
        "nokto":"Convierte acciones frecuentes del escritorio en rutinas configurables.",
        "datosdemocl":"Prepara lotes de prueba repetibles sin trabajar con registros reales."
    }
    name=e(tool["title"])
    label=e(TOOL_LABELS.get(tool["slug"], tool["task"]))
    tone=e(TOOL_TONES.get(tool["slug"], tool["tone"]))
    summary=e(tool["summary"])
    outcome=e(outcomes.get(tool["slug"],tool["problem"]))
    detail=local(d, "herramientas/#" + tool["slug"])
    return f"""<article class="tool-piece tool-piece--{tone}" id="home-{e(tool["slug"])}">
      <a class="tool-piece-link" href="{e(detail)}" aria-label="Abrir la ficha de {name}">
        <span class="tool-piece-head">
          <span class="tool-piece-icon">{tool_glyph(tool["slug"])}</span>
          <span class="tool-piece-label">{label}</span>
        </span>
        <span class="tool-piece-name">{name}</span>
        <span class="tool-piece-summary">{summary}</span>
        <span class="tool-piece-outcome">{outcome}</span>
        <span class="tool-piece-light" aria-hidden="true"></span>
      </a>
    </article>"""


def home_tools_showcase(d):
    cards = "".join(home_tool_card(d, tool) for tool in TOOLS)
    return f"""<div class="tools-rig" data-tools-rig>{cards}</div>"""


def home_savings(d):
    # Ejemplo de la portada: antes de automatizar, despues y frecuencia.
    before, after, runs = 180, 1, 5
    recovered=before-after
    weekly_hours=recovered*runs/60
    annual_hours=weekly_hours*52
    return f"""<section class="ink-panel home-calculator" id="ahorro" aria-labelledby="impact-title"><div class="wrap">
      <div class="impact-heading">
        <div>
          <p class="eyebrow impact-eyebrow">EL COSTO INVISIBLE DE REPETIR</p>
          <h2 id="impact-title">Compara el tiempo antes y despu&eacute;s.</h2>
        </div>
        <p>Incluye la revisi&oacute;n y las correcciones que todav&iacute;a requieren trabajo humano. Ajusta tres datos para estimar tu propio caso.</p>
      </div>
      <div class="quick-calc-layout">
        <form class="home-quick-calc" data-home-quick-calc aria-label="Calculadora r&aacute;pida de tiempo">
          <div class="quick-calc-fields">
            <label class="quick-calc-field" for="quick-before">
              <span>Antes de automatizar</span>
              <span class="quick-calc-control"><input id="quick-before" data-time-before type="number" min="0" max="1440" step="1" value="{before}" inputmode="numeric"><span>min</span></span>
            </label>
            <label class="quick-calc-field" for="quick-after">
              <span>Con automatizaci&oacute;n y revisi&oacute;n</span>
              <span class="quick-calc-control"><input id="quick-after" data-time-after type="number" min="0" max="1440" step="1" value="{after}" inputmode="numeric"><span>min</span></span>
            </label>
            <label class="quick-calc-field" for="quick-frequency">
              <span>Veces por semana</span>
              <span class="quick-calc-control"><input id="quick-frequency" data-frequency type="number" min="0" max="1000" step="1" value="{runs}" inputmode="numeric"><span>veces</span></span>
            </label>
          </div>
          <p class="quick-calc-note">Incluye el tiempo de ejecución y la revisión humana que siga siendo necesaria.</p>
        </form>
        <aside class="quick-calc-result" aria-live="off">
          <p class="quick-calc-result-label" data-quick-label>TIEMPO RECUPERADO</p>
          <div class="quick-calc-primary"><strong data-quick-run>{recovered} min</strong><span>por ejecuci&oacute;n</span></div>
          <div class="quick-calc-totals">
            <div><span data-quick-week-label>Por semana</span><strong data-quick-week>{weekly_hours:g} h</strong></div>
            <div><span data-quick-year-label>Por a&ntilde;o</span><strong data-quick-year>{annual_hours:g} h</strong></div>
          </div>
          <div class="quick-calc-next">
            <span class="quick-calc-next-hint">Incluye personas y valor econ&oacute;mico.</span>
            <a class="quick-calc-next-link" href="{e(local(d,'calculadora/'))}" data-open-calculator aria-haspopup="dialog" aria-controls="calculator-drawer">Calcular mi caso</a>
          </div>
          <p class="quick-calc-status" data-quick-status role="status" aria-live="polite">La estimaci&oacute;n se actualiza al cambiar cualquier valor.</p>
        </aside>
      </div>
    </div></section>"""

def home_calculator_drawer(d):
    return f"""<dialog class="calculator-drawer" id="calculator-drawer" aria-labelledby="calculator-drawer-title">
      <div class="calculator-drawer-shell">
        <header class="calculator-drawer-header"><div><p class="eyebrow">Calcula el tiempo que puedes recuperar</p>
        <h2 id="calculator-drawer-title">Calcula tu caso.</h2></div>
        <button class="calculator-drawer-close" type="button" data-close-calculator aria-label="Cerrar calculadora">×</button></header>
        <p class="calculator-drawer-lead">Ajusta los tiempos, la frecuencia y las personas. El resultado se actualiza mientras escribes.</p>
        <div class="calculator-quick" aria-label="Resumen de tiempo recuperado">
          <div><span>Horas semanales del equipo</span><strong data-preview-week>4 h</strong></div>
          <div><span>Horas anuales del equipo</span><strong data-preview-year>208 h</strong></div>
        </div>
        {calculator_widget()}
        <div class="calculator-drawer-end"><a href="{e(local(d,'calculadora/'))}">Abrir calculadora completa {icon("arrow",True)}</a>
        <p>Estimaciones orientativas; no implican ahorros económicos garantizados.</p></div>
      </div></dialog>"""

def home_booking_dialog():
    embed=BOOKING_URL+"?gv=true"
    panel=f"""<div class="project-portal-frame booking-portal-frame" data-portal-frame></div>
    <template data-portal-template><iframe title="Horarios de Google Calendar"
    src="{e(embed)}" referrerpolicy="strict-origin-when-cross-origin"></iframe></template>
    <p class="project-portal-note">Si no ves los horarios, puedes abrir la agenda de Google en otra pestaña.</p>"""
    return portal_dialog(0,title="Elige un horario",subtitle="Google Calendar · 45 minutos",
                         url=BOOKING_URL,mode="live booking-portal",panel=panel,filter_available=True)

def home():
    d=0
    featured_projects=PROJECTS
    main=f"""\n    <section class="section home-problem" id="explorar" tabindex="-1" aria-labelledby="resolve-title"><div class="wrap">
      <div class="section-head">
        <h2 id="resolve-title">¿Qué te gustaría <em>mejorar?</em></h2>
        <p>Puedo ayudarte a ordenar información, conectar herramientas y crear soluciones que hagan más simple tu trabajo.</p>
      </div>
      <div class="home-offer-grid">
        <article class="home-offer">
          <a class="home-offer-link" href="{e(local(d,'servicios/'))}">
            <span class="home-offer-icon" aria-hidden="true">{icon("network")}</span>
            <h3>Automatizar y conectar</h3>
            <p>Reducir tareas repetidas y hacer que las aplicaciones que ya utilizas trabajen juntas.</p>
          </a>
        </article>
        <article class="home-offer">
          <a class="home-offer-link" href="{e(local(d,'servicios/'))}">
            <span class="home-offer-icon" aria-hidden="true">{icon("data")}</span>
            <h3>Datos y paneles</h3>
            <p>Ordenar planillas e información para entender lo importante y tomar mejores decisiones.</p>
          </a>
        </article>
        <article class="home-offer">
          <a class="home-offer-link" href="{e(local(d,'servicios/'))}">
            <span class="home-offer-icon" aria-hidden="true">{icon("window")}</span>
            <h3>Web y herramientas</h3>
            <p>Crear sitios, catálogos y sistemas a medida, además de soporte cuando lo necesites.</p>
          </a>
        </article>
      </div>
      <p class="home-offer-all">{a(d,"servicios/","Ver servicios "+icon("arrow",True))}</p>
    </div></section>

    <section class="section home-method" id="como-trabajo" aria-labelledby="method-title"><div class="wrap">
      <div class="method-layout">
        <div class="method-copy">
          <p class="eyebrow">Una forma de trabajar cercana y directa</p>
          <h2 id="method-title">Primero te <em>escucho.</em></h2>
          <p>Reviso cómo trabajas hoy, qué necesitas y qué vale la pena cambiar. La propuesta se ajusta a tu realidad y a tu presupuesto.</p>
          <p class="method-principle">No se trata de sumar tecnología porque sí, sino de encontrar algo que realmente te sirva.</p>

        </div>
        {home_method_visual()}
      </div>
    <p class="method-bottom-link">{a(d,"metodo/","Conocer mi forma de trabajar","method-more-link")}</p>
    </div></section>

    {home_savings(d)}

    <section class="section home-work" id="trabajos" aria-labelledby="projects-title"><div class="wrap">
      <div class="section-head">
        <h2 id="projects-title">Proyectos<em>.</em></h2>
        <p>Algunos trabajos en los que he participado y las soluciones que quedaron funcionando.</p>
      </div>
      {home_project_carousel(d,featured_projects)}
      <p class="section-action">{a(d,"proyectos/","Ver más proyectos "+icon("arrow",True))}</p>
    </div></section>

    <section class="section home-persona" id="quien-soy" aria-label="Quién está detrás"><div class="wrap">
      <div class="persona-content">
        <div class="persona-identity"><h2>Soy <span class="persona-first">Jorge</span><br><span class="persona-last">Morgado</span><span class="persona-dot">.</span></h2></div>
        <div class="persona-story">
          <p>Trabajo de forma independiente con personas y empresas. Me involucro en entender el problema y encontrar una solución realista, desde una web o un panel de datos hasta una automatización o una herramienta propia.</p>
          <p>También puedo ayudarte a revisar y mantener funcionando lo que ya utilizas.</p>
          <a class="persona-linkedin" href="{e(LINKEDIN)}" target="_blank" rel="noopener noreferrer" aria-label="Ver el perfil de Jorge Morgado en LinkedIn (se abre en una pestaña nueva)">
            <svg class="icon" aria-hidden="true" focusable="false"><use href="#i-linkedin"></use></svg>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div></section>

    <section class="section home-tools" id="recursos" aria-labelledby="tools-title"><div class="wrap">
      <div class="section-head">
        <h2 id="tools-title">Herramientas <em>propias</em><span class="title-dot">.</span></h2>
        <p>Además de trabajar con clientes, desarrollo herramientas por iniciativa propia y comparto sus proyectos en abierto.</p>
      </div>
      {home_tools_showcase(d)}
    </div></section>

    <section class="home-contact-cta" id="contacto" aria-labelledby="contact-title"><div class="wrap">
      <div class="contact-board">
        <div class="contact-board-intro">
          <p class="eyebrow">PRIMERA CONVERSACIÓN GRATUITA</p>
          <h2 id="contact-title">Cuéntame qué necesitas <em>mejorar.</em></h2>
        </div>
        <div class="contact-board-copy">
          <p>Podemos partir por el contexto y el resultado que buscas. No necesitas elegir una tecnología antes de conversar.</p>
          <div class="contact-actions">
            {external(WHATSAPP,"Escribirme por WhatsApp "+icon("whatsapp",True),"button dark")}
            <a class="button outline" href="{e(BOOKING_URL)}" data-project-portal aria-haspopup="dialog">Agendar 45 minutos {icon("window",True)}</a>
          </div>
          <p class="contact-caveat">La conversación inicial es gratuita. Cualquier trabajo posterior se acuerda y presupuesta aparte.</p>
        </div>
      </div>
    </div></section>

    <section class="section home-game" id="una-partida" aria-labelledby="pause-title"><div class="wrap">
      <div class="pause-layout">
        <div class="pause-copy">
          <h2 id="pause-title">Una pausa <em>para jugar.</em></h2>
          <p>Tetris siempre ha sido uno de mis juegos favoritos. Si te apetece, puedes jugar una partida aquí mismo.</p>
        </div>
        <div class="pause-figure">{home_tetris_visual(d)}</div>
      </div>
    </div></section>

      {home_calculator_drawer(d)}
      {home_booking_dialog()}"""
    page("","Jorge Morgado | Desarrollo web, datos y automatización",
         "Jorge Morgado desarrolla herramientas, automatizaciones, integraciones y sitios web para resolver necesidades concretas de personas y empresas.",
         journey_markup()+main+tool_drawer(),journey=True)

def archive_inspector(d):
    """Panel contextual inicial. El JS actualiza sus nodos sin inventar contenido."""
    p = PROJECTS[0]
    entry = PROJECT_ARCHIVE[p["slug"]]
    participation, _ = PROJECT_CONTEXT[p["slug"]]
    total = len(PROJECTS)
    return f"""<aside class="archive-inspector" id="archive-inspector" aria-labelledby="archive-inspector-name">
      <div class="archive-inspector-head"><span>En foco</span><span class="archive-position" id="archive-position">01 / {total:02d}</span></div>
      <div class="archive-inspector-rule" aria-hidden="true"></div>
      <div class="archive-inspector-body" id="archive-inspector-body">
        <p class="archive-kicker" id="archive-inspector-label">{e(p["label"])}</p>
        <h2 id="archive-inspector-name">{e(p["title"])}</h2>
        <dl class="archive-facts">
          <div><dt>Problema</dt><dd id="archive-problem">{e(p["problem"])}</dd></div>
          <div><dt>Solución</dt><dd id="archive-solution">{e(entry["solution"])}</dd></div>
          <div><dt>Mi participación</dt><dd id="archive-role">{e(participation)}</dd></div>
        </dl>
      </div>
      <div class="archive-inspector-foot">
        <a id="archive-link" href="{e(local(d,"proyectos/"+p["slug"]+"/"))}">Explorar el caso {icon("arrow",True)}</a>
      </div>
    </aside>"""

def portfolio():
    d=1
    buttons="".join(f'<button class="archive-filter" type="button" data-filter="{e(k)}" aria-pressed="{"true" if i==0 else "false"}">{e(v)}</button>' for i,(k,v) in enumerate(ARCHIVE_FAMILIES))
    total=len(PROJECTS)
    rows="".join(archive_entry(d,p,i) for i,p in enumerate(PROJECTS,1))
    body=f"""<div class="project-archive-page" data-archive>
    <section class="archive-hero"><div class="archive-wrap"><div class="archive-hero-grid">
      <div class="archive-hero-copy">{crumb(d,[("", "Proyectos")])}<h1>Archivo de proyectos<span class="orange">.</span></h1>
      <p class="archive-intro">Trabajos que pasaron de una necesidad concreta a una solución. Explora qué se construyó, mi participación y lo que quedó funcionando.</p></div>
      <div class="archive-count"><strong>{total:02d}</strong><small>Casos documentados</small>
      <p>Cada proyecto tiene su propia historia y decisiones técnicas.</p></div>
    </div></div></section>
    <section class="archive-main"><div class="archive-wrap">
      <div class="archive-toolbar"><div class="archive-filters" role="group" aria-label="Filtrar proyectos">{buttons}</div>
      <p class="archive-result" id="archive-count" role="status">{total} proyectos disponibles</p></div>
      <div class="archive-grid"><div class="archive-list" id="archive-list">{rows}</div>{archive_inspector(d)}</div>
    </div></section></div>"""
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
      <p class="project-portal-status" role="status" data-portal-status></p>
    </header>{panel}</dialog>
    <script src="{e(asset(d,'assets/project-portal.js'))}" defer></script>"""

def project_portal_pages(slug, title, pages):
    buttons = []
    templates = []
    sandbox = "allow-scripts allow-same-origin" if slug in ("el-cambiometro", "conecta") else ""
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

def impulsacv_detail():
    d=2
    p = PROJ["impulsacv"]
    portal = project_portal(d, p) if p["site"] else ""
    from site_data import FICHAS
    from ficha import render_ficha
    spec = FICHAS["impulsacv"]
    secs = {s["type"]: s for s in spec["sections"]}
    flow_src = asset(d, "assets/impulsacv-archify-workflow.html")
    arch_src = asset(d, "assets/impulsacv-archify-architecture.html")
    secs["perspectivas"]["flow_src"] = flow_src
    secs["perspectivas"]["arch_src"] = arch_src
    secs["contacto"]["href"] = local(d, "contacto/")
    body, title, description = render_ficha(d, "impulsacv")
    body = body + portal
    page("proyectos/impulsacv", title, description + " Conoce el alcance, la infraestructura, la IA y los pagos de este trabajo de JMorgado.", body, "proyectos")
    return


def cambiometro_detail():
    d=2
    p = PROJ["el-cambiometro"]
    portal = project_portal(d, p) if p["site"] else ""
    from site_data import FICHAS
    from ficha import render_ficha
    spec = FICHAS["el-cambiometro"]
    secs = {s["type"]: s for s in spec["sections"]}
    arch_src = asset(d, "assets/el-cambiometro-archify-architecture.html") + "&embed=1"
    secs["diagrama"]["src"] = arch_src
    secs["contacto"]["href"] = local(d, "contacto/")
    body, title, description = render_ficha(d, "el-cambiometro")
    body = body + portal
    page("proyectos/el-cambiometro", title, description, body, "proyectos")
    return


def conecta_detail():
    d=2
    p = PROJ["conecta"]
    portal = project_portal(d, p) if p["site"] else ""
    from site_data import FICHAS
    from ficha import render_ficha
    spec = FICHAS["conecta"]
    secs = {s["type"]: s for s in spec["sections"]}
    arch_src = asset(d, "assets/listoporhoy-archify-architecture.html") + "&embed=1"
    secs["diagrama"]["src"] = arch_src
    secs["contacto"]["href"] = local(d, "contacto/")
    body, title, description = render_ficha(d, "conecta")
    body = body + portal
    page("proyectos/conecta", title, description, body, "proyectos")
    return


def ryvolt_detail():
    d=2
    p = PROJ["ryvolt"]
    portal = project_portal(d, p) if p["site"] else ""
    from site_data import FICHAS
    from ficha import render_ficha
    spec = FICHAS["ryvolt"]
    secs = {s["type"]: s for s in spec["sections"]}
    secs["contacto"]["href"] = local(d, "contacto/")
    body, title, description = render_ficha(d, "ryvolt")
    body = body + portal
    page("proyectos/ryvolt", title, description, body, "proyectos")
    return


def flor_detail():
    d=2
    p = PROJ["flor-de-almendro"]
    portal = project_portal(d, p) if p["site"] else ""
    from site_data import FICHAS
    from ficha import render_ficha
    spec = FICHAS["flor-de-almendro"]
    secs = {s["type"]: s for s in spec["sections"]}
    arch_src = asset(d, "assets/flor-de-almendro-archify-flujo.html") + "&embed=1"
    secs["diagrama"]["src"] = arch_src
    spec["logo"]["src"] = asset(d, "assets/project-marks/flor-de-almendro.webp")
    secs["contacto"]["href"] = local(d, "contacto/")
    body, title, description = render_ficha(d, "flor-de-almendro")
    body = body + portal
    page("proyectos/flor-de-almendro", title, description, body, "proyectos")
    return


def exo_dream_detail():
    d=2
    from site_data import FICHAS
    from ficha import render_ficha
    spec = FICHAS["exo-dream"]
    secs = {s["type"]: s for s in spec["sections"]}
    arch_src = asset(d, "assets/exo-dream-archify-arquitectura.html") + "&embed=1"
    secs["diagrama"]["src"] = arch_src
    spec["logo"]["src"] = asset(d, "assets/project-marks/exo-dream.svg")
    secs["contacto"]["href"] = local(d, "contacto/")
    body, title, description = render_ficha(d, "exo-dream")
    # Sin portal: el cliente esta adquiriendo el dominio y no hay URL publica confirmada.
    page("proyectos/exo-dream", title, description, body, "proyectos")
    return


def hangar_detail():
    d=2
    p = PROJ["tobys-warehouse"]
    portal = project_portal(d, p) if p["site"] else ""
    from site_data import FICHAS
    from ficha import render_ficha
    spec = FICHAS["tobys-warehouse"]
    secs = {s["type"]: s for s in spec["sections"]}
    arch_src = asset(d, "assets/hangar354-archify-arquitectura.html") + "&embed=1"
    secs["diagrama"]["src"] = arch_src
    spec["logo"]["src"] = asset(d, "assets/project-marks/hangar354.svg")
    secs["contacto"]["href"] = local(d, "contacto/")
    body, title, description = render_ficha(d, "tobys-warehouse")
    body = body + portal
    page("proyectos/tobys-warehouse", title, description, body, "proyectos")
    return


def kokeai_detail():
    d=2
    p = PROJ["kooke-portal"]
    portal = project_portal(d, p) if p["site"] else ""
    from site_data import FICHAS
    from ficha import render_ficha
    spec = FICHAS["kooke-portal"]
    secs = {s["type"]: s for s in spec["sections"]}
    flow_src = asset(d, "assets/kokeai-archify-recorrido.html") + "&embed=1"
    arch_src = asset(d, "assets/kokeai-archify-arquitectura.html") + "&embed=1"
    # Dos vistas del mismo sistema: la primera es el recorrido, la segunda la arquitectura.
    diagramas = [s for s in spec["sections"] if s["type"] == "diagrama"]
    diagramas[0]["src"] = flow_src
    diagramas[1]["src"] = arch_src
    spec["logo"]["src"] = asset(d, "assets/project-marks/kokeai-mark.png")
    secs["contacto"]["href"] = local(d, "contacto/")
    body, title, description = render_ficha(d, "kooke-portal")
    body = body + portal
    page("proyectos/kooke-portal", title, description, body, "proyectos")
    return


def rrss_detail():
    d=2
    from site_data import FICHAS
    from ficha import render_ficha
    spec = FICHAS["kooke-rrss"]
    secs = {s["type"]: s for s in spec["sections"]}
    arch_src = asset(d, "assets/rrss-archify-flujo.html") + "&embed=1"
    secs["diagrama"]["src"] = arch_src
    spec["logo"]["src"] = asset(d, "assets/project-marks/rrss.svg")
    secs["contacto"]["href"] = local(d, "contacto/")
    body, title, description = render_ficha(d, "kooke-rrss")
    # El prototipo no tiene interfaz publica: la ficha se explica con el diagrama.
    page("proyectos/kooke-rrss", title, description, body, "proyectos")
    return


def project_detail(p):
    if p["slug"] == "impulsacv":
        impulsacv_detail()
        return
    if p["slug"] == "el-cambiometro":
        cambiometro_detail()
        return
    if p["slug"] == "conecta":
        conecta_detail()
        return
    if p["slug"] == "ryvolt":
        ryvolt_detail()
        return
    if p["slug"] == "flor-de-almendro":
        flor_detail()
        return
    if p["slug"] == "exo-dream":
        exo_dream_detail()
        return
    if p["slug"] == "tobys-warehouse":
        hangar_detail()
        return
    if p["slug"] == "kooke-portal":
        kokeai_detail()
        return
    if p["slug"] == "kooke-rrss":
        rrss_detail()
        return
    d=2
    quick=f'<dt>Tipo</dt><dd>{e(p["label"])}</dd><dt>Estado documental</dt><dd>{e(p["state"])}</dd><dt>Área</dt><dd>{e(p["area"])}</dd>'
    links=[]
    if p["repo"]:links.append(external(p["repo"],"Ver código y documentación en GitHub "+icon("arrow",True),"button"))
    if not links and not p["site"]:links.append('<p class="hint">Este caso se presenta a través de su ficha.</p>')
    flow="".join(f'<div class="flowstep"><span class="flow-index">0{i} · PASO</span><strong>{e(text)}</strong></div>' for i,text in enumerate(p["flow"],1))
    tags = tech_badges(d,p["tech"])
    related=SERV[p["related"]]
    participation, result = PROJECT_CONTEXT[p["slug"]]
    site_link = f'<a class="button dark" href="{e(p["site"])}" data-project-portal>Ver sitio {icon("window",True)}</a>' if p["site"] else ""
    portal = project_portal(d, p) if p["site"] else ""
    body=f"""<section class="page-hero project-hero tone-{e(p['accent'])}"><div class="wrap">{crumb(d,[("proyectos/","Proyectos"),(None,p["title"])])}
    <div class="eyebrow">{e(p["area"])} ? {e(p["label"])}</div>{project_mark(d,p)}<h1>{e(p["title"])}<span class="orange">.</span></h1>
    <p class="lead">{e(p["summary"])}</p>{site_link}
    <div class="page-meta"><span>{e(p["state"])}</span><span>Estudio de caso · alcance documentado</span></div></div></section>
    <section class="section"><div class="wrap">{overline("01","Qué se resolvió")}
    <div class="case-layout"><article class="prose"><h2>{e(CASE_HEADLINES[p['slug']])}</h2><p>{e(p["problem"])}</p>
    <h3>Trabajo desarrollado</h3><p>{e(p["work"])}</p>
    <h3>Por qué lo construí así</h3><p>{e(PROJECT_DECISIONS[p["slug"]])}</p>
    <h3>Mi participación</h3><p>{e(participation)}</p>
    <h3>Resultado</h3><p>{e(result)}</p>
    <div class="tag-list">{tags}</div></article>
    <aside><p class="eyebrow">Datos del proyecto</p>
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
SERVICE_ICONS = {"automatizacion": "gear", "desarrollo-web": "code", "datos-y-bi": "data",
                 "integraciones": "network", "ia-aplicada": "branch", "soporte-ti": "support",
                 "redes-sociales": "grid"}


def visual_chain(pasos, clase=""):
    """Cadena de pasos. Acepta (numero, titulo, descripcion) o (titulo, descripcion)."""
    items = []
    for paso in pasos:
        if len(paso) == 3:
            num, titulo, desc = paso
            items.append(f'<li class="visual-step"><span class="visual-num">{e(num)}</span>'
                          f'<strong>{e(titulo)}</strong><span class="visual-desc">{e(desc)}</span></li>')
        else:
            titulo, desc = paso
            items.append(f'<li class="visual-step"><strong>{e(titulo)}</strong>'
                          f'<span class="visual-desc">{e(desc)}</span></li>')
    return f'<ol class="visual-chain {clase}">{"".join(items)}</ol>'


def visual_block(vis):
    """Representación visual propia. Cada servicio tiene una composición distinta."""
    if not vis:
        return ""
    tipo = vis["tipo"]
    if tipo in ("flujo", "cadena"):
        cuerpo = visual_chain(vis["pasos"], f"visual-chain--{tipo}")
    elif tipo == "capas":
        items = "".join(
            f'<li class="visual-layer"><strong>{e(titulo)}</strong>'
            f'<span class="visual-desc">{e(desc)}</span></li>' for titulo, desc in vis["pasos"])
        cuerpo = f'<ol class="visual-layers">{items}</ol>'
    elif tipo == "hub":
        centro, sub = vis["centro"]
        ramas = "".join(
            f'<li class="visual-satellite"><strong>{e(titulo)}</strong><span>{e(desc)}</span></li>'
            for titulo, desc in vis["ramas"])
        cuerpo = (f'<div class="visual-hub"><div class="visual-core"><strong>{e(centro)}</strong>'
                  f'<span>{e(sub)}</span></div><ul class="visual-satellites">{ramas}</ul></div>')
    elif tipo == "ciclo":
        cuerpo = visual_chain(vis["pasos"], "visual-chain--ciclo")
        modos = "".join(f'<li>{e(m)}</li>' for m in vis.get("modalidades", []))
        if modos:
            cuerpo += f'<ul class="visual-modes">{modos}</ul>'
    elif tipo == "dos-vias":
        vias = "".join(
            f'<div class="visual-track"><p class="visual-track-title">{e(nombre)}</p>'
            f'<ol class="visual-track-steps">'
            + "".join(f'<li><strong>{e(paso)}</strong><span>{e(desc)}</span></li>' for paso, desc in pasos)
            + '</ol></div>' for nombre, pasos in vis["vias"])
        cuerpo = f'<div class="visual-tracks">{vias}</div>'
    elif tipo == "orquestacion":
        cuerpo = visual_chain(vis["pasos"], "visual-chain--orquestacion")
        capa = "".join(f'<li>{e(c)}</li>' for c in vis["capa"])
        cuerpo += ('<div class="visual-transversal"><span class="visual-transversal-label">Capa transversal</span>'
                   f'<ul>{capa}</ul></div>')
    elif tipo == "escalera":
        niveles = "".join(
            f'<li class="visual-level"><strong>{e(titulo)}</strong><span>{e(modo)}</span><em>{e(costo)}</em></li>'
            for titulo, modo, costo in vis["niveles"])
        cuerpo = f'<ol class="visual-levels">{niveles}</ol>'
    else:
        cuerpo = ""
    titulo = vis.get("titulo", "")
    desc = vis.get("desc", "")
    cabeza = ""
    if titulo:
        cabeza = f'<div class="visual-head"><h2>{e(titulo)}</h2><p>{e(desc)}</p></div>'
    return f'<div class="visual-body visual-body--{tipo}">{cabeza}{cuerpo}</div>'


def service_visual(d, s):
    """Banda visual propia del servicio, entre el hero y el contenido."""
    vis = SERVICE_VISUALS.get(s["slug"])
    if not vis:
        return ""
    return f'<section class="section service-visual service-visual--{vis["tipo"]}"><div class="wrap">{visual_block(vis)}</div></section>'


def service_extras(d, s, numeros):
    """Apartados propios de un servicio (orquestación, seguridad, costos)."""
    bloques = []
    for extra in SERVICE_EXTRAS.get(s["slug"], []):
        puntos = ""
        if extra.get("puntos"):
            puntos = '<ul class="extra-points">' + "".join(f'<li>{e(p)}</li>' for p in extra["puntos"]) + '</ul>'
        medidas = ""
        if extra.get("medidas"):
            medidas = ('<div class="measure-list">' + "".join(
                f'<div class="measure"><strong>{e(titulo)}</strong><p>{e(desc)}</p></div>'
                for titulo, desc in extra["medidas"]) + '</div>')
        visual = visual_block(extra.get("visual"))
        bloques.append(
            f'<section class="section service-extra service-section"><div class="wrap">'
            f'{overline(f"{numeros:02d}", extra["overline"])}'
            f'<div class="section-head"><h2>{e(extra["titulo"])}</h2><p>{e(extra["cuerpo"])}</p></div>'
            f'{puntos}{medidas}{visual}</div></section>')
    return "".join(bloques)


def service_others(d, s):
    """Franja de navegación cruzada: el resto de las áreas."""
    filas = "".join(
        f'<a href="{e(local(d, "servicios/" + other["slug"] + "/"))}"><span>{e(other["title"])}</span>{icon("arrow",True)}</a>'
        for other in SERVICES if other["slug"] != s["slug"])
    return (f'<section class="section service-others"><div class="wrap">'
            f'<p class="eyebrow">Otras áreas</p><div class="related">{filas}</div></div></section>')


def service_experience(d, s):
    """Experiencia que respalda el servicio, separada en proyectos y herramientas propias.
    Las dos categorías reparten el ancho de forma proporcional a su contenido."""
    def grupo(rotulo, items, span):
        filas = []
        for titulo, url, desc in items:
            if url:
                filas.append(f'<a href="{e(url)}"><span class="related-item"><strong>{e(titulo)}</strong>'
                             f'<em>{e(desc)}</em></span>{icon("arrow",True)}</a>')
            else:
                filas.append(f'<div class="related-item related-item--note"><strong>{e(titulo)}</strong>'
                             f'<em>{e(desc)}</em></div>')
        return (f'<div class="service-experience-group" style="grid-column:span {span}">'
                f'<p class="eyebrow">{rotulo}</p><div class="related">{"".join(filas)}</div></div>')
    categorias = [(rotulo, items) for rotulo, items in
                  (("Proyectos realizados", s["proyectos"]), ("Herramientas propias", s["herramientas"]))
                  if items]
    total = sum(len(items) for _r, items in categorias)
    bloques = []
    for indice, (rotulo, items) in enumerate(categorias):
        if len(categorias) == 1:
            span = 12
        else:
            span = round(12 * len(items) / total)
            resto = 12 - sum(round(12 * len(i) / total) for _r, i in categorias)
            span += resto
            span = max(4, min(span, 12 - 4 * (len(categorias) - 1)))
        bloques.append(grupo(rotulo, items, span))
    nota = ""
    if s["herramientas"]:
        nota = ('<p class="hint service-experience-note">Software propio, publicado en abierto para que puedas revisar el código, '
                'utilizarlo y adaptarlo respetando las condiciones de su licencia.</p>'
                f'<p class="service-experience-more">{a(d, "herramientas/", "Ver todas las herramientas " + icon("arrow", True))}</p>')
    return f'<div class="service-experience">{"".join(bloques)}</div>{nota}'


def service_deliverables(d, s):
    items = "".join(f'<li><strong>{e(titulo)}</strong><p>{e(desc)}</p></li>' for titulo, desc in s["entregables"])
    return f'<ol class="deliverables">{items}</ol>'


def service_jsonld(s):
    url = SITE_URL + "servicios/" + s["slug"] + "/"
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": s["title"],
        "description": s["descripcion"],
        "url": url,
        "serviceType": s["title"],
        "provider": {"@type": "Organization", "name": "JMorgado", "url": SITE_URL},
        "areaServed": {"@type": "Country", "name": "Chile"},
    }


def breadcrumb_jsonld(slug, nombre):
    items = [
        {"@type": "ListItem", "position": 1, "name": "Inicio", "item": SITE_URL},
        {"@type": "ListItem", "position": 2, "name": "Servicios", "item": SITE_URL + "servicios/"},
    ]
    if slug:
        items.append({"@type": "ListItem", "position": 3, "name": nombre,
                      "item": SITE_URL + "servicios/" + slug + "/"})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}


def services_index():
    d = 1
    services = "".join(f"""<a class="service-line" href="{e(local(d,'servicios/'+s['slug']+'/'))}">
    <span class="service-no">{i:02d}.</span><h3>{e(s["title"])}</h3><p>{e(s["short"])}</p>{icon(SERVICE_ICONS[s['slug']])}</a>""" for i,s in enumerate(SERVICES,1))
    grupos = "".join(
        f'<div class="ecosystem-group"><h3>{e(rotulo)}</h3><div class="tag-list">{tech_chips(d, items)}</div></div>'
        for rotulo, items in TECNOLOGIAS)
    mapa = "".join(
        f'<li>{icon(SERVICE_ICONS[s["slug"]])}<span>{e(s["title"])}</span></li>' for s in SERVICES)
    itemlist = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Áreas de trabajo",
        "itemListElement": [
            {"@type": "ListItem", "position": i, "name": s["title"],
             "url": SITE_URL + "servicios/" + s["slug"] + "/"}
            for i, s in enumerate(SERVICES, 1)],
    }
    contacto = SERVICE_CONTACT
    pasos = "".join(f'<li><span>{e(num)}</span><strong>{e(titulo)}</strong></li>' for num, titulo in contacto["pasos"])
    lead = ("Hay tareas que se repiten, sistemas que no se hablan entre sí y datos que nadie mira a tiempo. "
            "Trabajo en siete áreas para resolver eso: automatización de procesos, desarrollo web y plataformas, "
            "datos y BI, integraciones, IA aplicada, soporte técnico y gestión de redes sociales. "
            "Cada ficha explica qué entrego y qué trabajos respaldan esa capacidad.")
    body=f"""<section class="page-hero service-map-hero"><div class="wrap">{crumb(d,[(None,"Servicios")])}
    <div class="service-hero-grid">
    <div class="service-hero-copy">
    <span class="eyebrow">Soluciones según tu necesidad</span>
    <h1>En qué puedo ayudarte<span class="orange">.</span></h1>
    <p class="lead">{lead}</p></div>
    <ul class="service-hero-map">{mapa}</ul></div></div></section>
    <section class="section service-map"><div class="wrap">{overline("01","Áreas de trabajo")}
    <div class="service-index">{services}</div></div></section>
    <section class="section service-ecosystems"><div class="wrap">{overline("02","Tecnologías y ecosistemas")}
    <div class="ecosystem-grid">{grupos}
    <p class="hint ecosystem-note">El stack se selecciona según las necesidades de cada proyecto. No todas las tecnologías se utilizan en todos los encargos. Los modelos de ejecución local y los agentes de desarrollo se combinan con los servicios externos según lo que cada tarea necesita.</p></div></section>
    <section class="ink-panel service-contact-intro"><div class="wrap">{overline("03","Primer contacto")}
    <div class="contact-grid">
    <div class="contact-lead"><span class="eyebrow">{e(contacto["eyebrow"])}</span>
    <h2>{e(contacto["titulo"])}</h2></div>
    <p class="lead contact-desc">{e(contacto["descripcion"])}</p>
    <ol class="contact-steps">{pasos}</ol>
    <div class="contact-actions">
    {a(d, contacto["cta"][1], contacto["cta"][0] + " " + icon("arrow", True), "button strong")}
    {a(d, contacto["secundario"][1], contacto["secundario"][0] + " " + icon("arrow", True))}
    </div></div></div></section>"""
    page("servicios","Servicios de software, datos y automatización",
         "Software, datos y automatización en siete áreas: procesos repetitivos, plataformas web, reportes, integraciones, IA aplicada, soporte técnico y contenido.",
         body,"servicios",jsonld=[itemlist, breadcrumb_jsonld(None, "Servicios")])


def service_page(s, hero_clase, extra_social=""):
    """Ficha de servicio: hero, visual, problema, entregables, apartados, experiencia y cierre."""
    d = 2
    n = 1
    partes = [f"""<section class="page-hero {hero_clase}"><div class="wrap">{crumb(d,[("servicios/","Servicios"),(None,s["title"])])}
    <span class="eyebrow">{e(s["eyebrow"])}</span>
    <div class="hero-split"><h1>{e(s["title"])}<span class="orange">.</span></h1>
    <p class="lead">{e(s["descripcion"])}</p></div></div></section>"""]
    partes.append(service_visual(d, s))
    n += 1
    partes.append(f"""<section class="section service-detail-brief"><div class="wrap">{overline(f"{n:02d}","Qué problema resuelvo")}
    <div class="case-layout"><article class="prose"><h2>Qué problema resuelvo.</h2><p>{e(s["situacion"])}</p>
    <h3>Cómo lo abordo</h3><p>{e(s["enfoque"])}</p></article>
    <aside><p class="eyebrow">En una línea</p><p class="service-aside">{e(s["aside"])}</p>
    <p class="eyebrow" style="margin-top:2rem">Tecnologías utilizadas en esta línea</p><div class="tag-list">{tech_chips(d,s["stack"])}</div>
    <p class="hint">{e(s["nota"])}</p></aside></div></div></section>""")
    n += 1
    partes.append(f"""<section class="section service-section" style="background:var(--paper2)"><div class="wrap">{overline(f"{n:02d}","Qué entrego, en concreto")}
    <div class="section-head"><h2>Qué entrego, en concreto.</h2><p>Cada punto es un entregable que se puede revisar y aceptar por separado.</p></div>
    {service_deliverables(d,s)}{extra_social}</div></section>""")
    n += 1
    extras = service_extras(d, s, n)
    if extras:
        partes.append(extras)
        n += len(SERVICE_EXTRAS.get(s["slug"], []))
    partes.append(f"""<section class="section service-section"><div class="wrap">{overline(f"{n:02d}","Qué experiencia respalda")}
    <div class="section-head"><h2>Trabajos y herramientas que aportan contexto.</h2><p>No son promesas de resultados: permiten revisar tipos de sistemas y decisiones técnicas que ya he trabajado.</p></div>
    {service_experience(d,s)}</div></section>""")
    n += 1
    partes.append(f"""<section class="section service-contact"><div class="wrap">{overline(f"{n:02d}","Conversemos")}
    <div class="contact-board"><div><span class="eyebrow" style="color:var(--ink)">Contacto</span><h2>{e(s["cta_h2"])}</h2></div>
    <div><p class="contact-meta"><span>Evaluación caso a caso</span><span>Primer diagnóstico conversado: gratuito</span></p>
    <p>{e(s["cta_p"])}</p>
    {a(d,"contacto/",s["cta_label"]+" "+icon("arrow",True),"button dark")}</div></div></div></section>""")
    partes.append(service_others(d, s))
    page("servicios/"+s["slug"], s["seo_title"], s["meta_description"], "".join(partes), "servicios",
         jsonld=[service_jsonld(s), breadcrumb_jsonld(s["slug"], s["title"])])


def social_service(s):
    plan = "".join(
        f'<li><h3>{e(titulo)}</h3><p>{e(desc)}</p></li>'
        for titulo, desc in [
            ("Planificar", "Definir temas, formatos y un calendario que puedas sostener."),
            ("Preparar y publicar", "Apoyar la creación de textos y piezas, organizar los perfiles y coordinar la revisión antes de publicar."),
            ("Revisar", "Consultar resultados disponibles en cada plataforma y usarlos para ajustar las próximas publicaciones."),
        ])
    extra_social = ('<div class="social-workflow"><p class="eyebrow">El ciclo de trabajo</p>'
                     f'<ol class="social-plan">{plan}</ol></div>')
    service_page(s, "social-hero", extra_social)


def service_detail(s):
    if s["slug"] == "redes-sociales":
        social_service(s)
        return
    service_page(s, "service-detail-hero")

def method():
    d = 1
    included = ["Escuchar qué necesitas resolver y cuál es la dificultad",
                "Comprender de forma inicial el proceso y sus herramientas",
                "Comentar alternativas posibles y una ruta para continuar"]
    excluded = ["Auditoría exhaustiva de archivos o sistemas",
                "Cambios técnicos, instalaciones o reparación gratuita",
                "Acceso inmediato a credenciales o datos sensibles"]

    def cells(arr): return "".join(f'<li>{e(item)}</li>' for item in arr)

    # ---------------- bloques del recorrido de decisión (los seis pasos y los cuatro caminos)
    pasos = [
        ("need", "01", "Necesidad", "Escuchar el problema real",
         "Escuchar el problema en la boca de quien lo vive: qué ocurre hoy, con qué frecuencia, quién lo hace y qué significa que esté bien hecho. Nada de propuestas antes de entender."),
        ("analysis", "02", "Análisis", "Entender el proceso",
         "Qué datos entran y salen, qué excepciones existen, qué herramientas están involucradas, cuánto volumen hay y cómo se valida el resultado al final."),
        ("decision", "03", "Decisión", "Elegir el camino",
         "El camino se elige aquí: aprovechar lo existente, integrar, automatizar o desarrollar. La tecnología se selecciona después de analizar, nunca antes."),
        ("implementation", "04", "Implementación", "Construir con una base sólida",
         "Permisos mínimos, credenciales fuera del código, convenciones ordenadas y una entrega documentada que queda en manos del cliente."),
        ("validation", "05", "Validación", "Probar con casos reales",
         "Casos reales e incompletos: duplicados, montos distintos, datos faltantes. Medir antes de dar el ajuste por bueno."),
        ("evolution", "06", "Evolución", "Un ajuste que crece",
         "La solución queda lista para una nueva capacidad, integración o infraestructura adicional, solo cuando el uso lo pida."),
    ]

    caminos = [
        ("camino1", "01", "Camino 1 · Aprovechar lo existente", "Lo que ya usas",
         "Planillas, CRM, correo, ERP y archivos: el camino más barato y el que menos mantención exige.",
         "Reutilizar las herramientas que ya dominas es el primer camino que evalúo: resolver hoy sin crear otro sistema."),
        ("camino2", "02", "Camino 2 · Integrar", "Conectar sistemas",
         "Que las plataformas intercambien datos sin paso manual, con autenticación adecuada y manejo de errores.",
         "Conectar sistemas en uso para que hablen entre sí: conservas tus herramientas y ganas tiempo en cada traspaso."),
        ("camino3", "03", "Camino 3 · Automatizar", "Eliminar los pasos repetidos",
         "Reglas, validaciones y disparos automáticos sobre el flujo que ya existe.",
         "Menos clics, mismos datos y mismo resultado: la automatización cubre el tramo mecánico y deja el criterio en manos del cliente."),
        ("camino4", "04", "Camino 4 · Desarrollar", "Solución propia",
         "Cuando ninguna de las anteriores cubre la necesidad, se diseña y construye lo que falta.",
         "El software a medida es el último recurso, no el punto de partida: llega cuando la necesidad lo justifica y con una base lista para crecer."),
    ]

    def step_button(key, num, nombre, sub, detalle):
        special = ' met-step--decision' if key == "decision" else ""
        tag = '<span class="met-step-tag">4 caminos</span>' if key == "decision" else ""
        return (f'<li><button class="met-step{special}" type="button" data-step="{key}" '
                f'data-title="{e(nombre)}" data-kicker="Paso {num}" data-detail="{e(detalle)}">'
                f'<span class="met-step-num">{num}</span>'
                f'<span class="met-step-body"><strong>{e(nombre)}</strong><small>{e(sub)}</small></span>'
                f'{tag}</button></li>')

    pasos_html = "".join(step_button(*p) for p in pasos)

    def camino_button(key, num, titulo, nombre, frase, detalle):
        return (f'<button class="met-path" type="button" data-path="{key}" data-title="{e(titulo)}" '
                f'data-kicker="{e(titulo.split("·")[0].strip())}" data-detail="{e(detalle)}">'
                f'<span class="met-path-num">{num}</span>'
                f'<span class="met-path-body"><strong>{e(nombre)}</strong><small>{e(frase)}</small></span>'
                f'</button>')

    caminos_html = "".join(camino_button(*c) for c in caminos)

    # ---------------- recursos: 5 tipos de tarea → 5 recursos
    tareas = [
        ("repetitiva", "Automatizar lo repetitivo", "Planillas, correos y pasos mecánicos que se repiten",
         "Automatización convencional", "Reglas, flujos y scripts. Sin invocar un modelo para lo que un flujo resuelve.",
         ["Reglas y flujos", "Scripts", "Integraciones nativas"],
         ["Costo: mínimo", "Velocidad: inmediata", "Complejidad: baja", "Privacidad: sin salir del entorno", "Mantenimiento: mínimo"],
         "El trabajo mecánico no necesita un modelo de IA para resolverse bien."),

        ("tecnica", "Trabajo técnico complejo", "Arquitectura, refactor, depuración y funcionalidades",
         "Agente de desarrollo", "Trabajo de ingeniería con contexto amplio, donde el juicio es parte del resultado.",
         ["Claude Code", "OpenCode", "Antigravity", "Codex", "Traycer"],
         ["Costo: medio", "Velocidad: alta", "Complejidad: alta", "Privacidad: según el entorno", "Mantenimiento: medio"],
         "Tareas con contexto amplio: vale pagar más capacidad cuando el juicio es parte del trabajo."),

        ("costo", "Presupuesto y cuota ajustada", "Mucho volumen o márgenes delgados",
         "Modelo eficiente o local", "El de menor costo que cumple: cuotas y suscripciones primero.",
         ["Qwen", "DeepSeek", "MiniMax", "Modelos locales"],
         ["Costo: mínimo", "Velocidad: media", "Complejidad: media", "Privacidad: alta (local)", "Mantenimiento: bajo"],
         "Un modelo más barato que cumple rinde más que uno caro usado para todo."),

        ("privada", "Información sensible o confidencial", "Credenciales, datos de clientes, código privado",
         "Ejecución local o entorno controlado", "El modelo va al dato, no el dato al modelo.",
         ["Modelos locales", "Entornos privados", "Permisos mínimos"],
         ["Costo: medio", "Velocidad: media", "Complejidad: media", "Privacidad: máxima", "Mantenimiento: medio"],
         "La privacidad manda: el modelo se acerca al dato, no al revés."),

        ("especifica", "Necesidad puntual y estricta", "Un formato, un servicio o una integración externa",
         "Servicio o API externa", "Se consume lo justamente necesario, sin instalar infraestructura.",
         ["APIs por uso", "Suscripciones", "Servicios en la nube"],
         ["Costo: por uso", "Velocidad: inmediata", "Complejidad: baja–media", "Privacidad: según el proveedor", "Mantenimiento: mínimo"],
         "Para una necesidad puntual no se instala una plataforma: se contrata justo lo que hace falta."),
    ]

    def tarea_row(key, titulo, sub, recurso, rec_frase, herramientas, factores, nota):
        tools = "|".join(herramientas)
        factors = "|".join(factores)
        return (f'<button class="met-matrix-row" type="button" data-kind="{key}" role="tab" aria-selected="false" '
                f'data-name="{e(recurso)}" data-desc="{e(rec_frase)}" '
                f'data-tools="{e(tools)}" data-factors="{e(factors)}" data-note="{e(nota)}">'
                f'<span class="met-matrix-task"><b>{e(titulo)}</b><small>{e(sub)}</small></span>'
                f'<span class="met-matrix-arrow" aria-hidden="true">→</span>'
                f'<span class="met-matrix-res"><b>{e(recurso)}</b></span>'
                f'</button>')

    tareas_html = "".join(tarea_row(*t) for t in tareas)

    # ---------------- seguridad: seis controles en un rail transversal
    controles = [
        ("01", "Permisos mínimos", "Cada persona y cada proceso accede solo a lo necesario."),
        ("02", "Accesos controlados", "Roles y credenciales separadas por responsabilidad."),
        ("03", "Credenciales protegidas", "Secretos fuera del código y de los repositorios."),
        ("04", "Entradas validadas", "La información se verifica antes de procesarla."),
        ("05", "Datos protegidos", "Sensibilidad y contexto definen el nivel de resguardo."),
        ("06", "Operación registrada", "Cada operación queda con un registro verificable."),
    ]
    controles_html = "".join(
        f'<li><span class="met-shield-num">{n}</span><b>{e(t)}</b><span>{e(d)}</span></li>'
        for n, t, d in controles)

    # ---------------- ejemplos: criterio demostrable por proyecto
    ejemplos = [
        ("proyectos/el-cambiometro/", "El Cambiómetro", "Integrar ≠ construir",
         "Fuentes públicas integradas y validadas antes de construir una plataforma de consulta."),
        ("proyectos/impulsacv/", "ImpulsaCV", "Recorrido, no etapas sueltas",
         "Del análisis del CV a su preparación: varias etapas conectadas en un solo flujo."),
        ("proyectos/conecta/", "ListoPorHoy", "Conectar, no replicar",
         "Marcas, medios, calendarios y plataformas sociales en un solo lugar, con las herramientas que ya usan."),
        ("proyectos/exo-dream/", "Exo Dream", "Ordenar, no acumular",
         "Fuentes de información, catálogo y herramientas de gestión en una sola administración."),
    ]
    ejemplos_html = "".join(
        f'<article class="met-example"><p class="met-example-kicker">{e(kicker)}</p><b>{e(titulo)}</b>'
        f'<p>{e(caso)}</p>{a(d, href, "Ver la ficha " + icon("arrow", True), "met-example-link")}</article>'
        for href, titulo, kicker, caso in ejemplos)

    # ---------------- etapas de evolución
    etapas = [
        ("0", "01", "Resolver", "Resolver lo de hoy", "Construido para el problema concreto.", "desde cero"),
        ("1", "02", "Consolidar", "Base confiable", "Orden, validación y estructura.", "suma orden y validación"),
        ("2", "03", "Escalar", "Capacidad a la base", "Integraciones e infraestructura bajo demanda.", "suma capacidad sin rehacer"),
    ]
    etapas_html = '<span class="met-stage-line" aria-hidden="true"></span><span class="met-stage-progress" aria-hidden="true"></span>' + "".join(
        f'<button class="met-stage" type="button" data-stage="{idx}" style="--i:{idx}" '
        f'aria-expanded="{"true" if idx == "0" else "false"}">'
        f'<span class="met-stage-big" aria-hidden="true">{num}</span>'
        f'<span class="met-stage-kicker">{num} · {e(nombre.upper())}</span>'
        f'<strong>{e(titulo)}</strong>'
        f'<span class="met-stage-sub">{e(sub)}</span>'
        f'<span class="met-stage-delta">{e(delta)}</span>'
        f'</button>'
        for idx, num, nombre, titulo, sub, delta in etapas)

    paneles = [
        ("01 · RESOLVER",
         "Construir lo necesario para el problema concreto que tienes hoy: sin capas por adelantado, sin infraestructura vacía. La base debe ser sólida, ordenada y preparada para crecer.",
         [("Base de la solución, lo que resuelve hoy", True),
          ("Registros y documentación mínima desde el primer día", False)]),
        ("02 · CONSOLIDAR",
         "Ordenar, validar y estabilizar: procesos claros, resultados medidos y una estructura que resiste el uso diario. Tú operas la solución sin depender de quien la construyó.",
         [("Documentación de reglas y excepciones", True),
          ("Validación y monitoreo de los resultados", True),
          ("Estructura y convenciones mantenibles", True)]),
        ("03 · ESCALAR",
         "Incorporar capacidades cuando el crecimiento lo requiera: integraciones, infraestructura y recursos adicionales, sin demoler lo que ya funciona.",
         [("Nuevas integraciones y módulos sobre la misma base", True),
          ("Infraestructura escalada bajo demanda", True),
          ("Automatizaciones y controles adicionales", True)]),
    ]

    paneles_html = "".join(
        f'<div class="met-evo-panel" data-met-evo-panel{"" if i == 0 else " hidden"}>'
        f'<div class="met-evo-copy"><h3>{e(k)}</h3><p>{e(txt)}</p></div>'
        f'<ul class="met-evo-modules">'
        + "".join(f'<li class="{"is-new" if nuevo else ""}" style="--d:{n}"><b>{e(txt2)}</b></li>' if nuevo else f'<li style="--d:{n}">{e(txt2)}</li>'
                  for n, (txt2, nuevo) in enumerate(mods))
        + '</ul></div>'
        for i, (k, txt, mods) in enumerate(paneles))

    body = f"""<section class="page-hero method-hero"><div class="wrap">{crumb(d, [(None, "Método")])}
    <div class="met-hero-grid"><div><span class="eyebrow">Cómo trabajo</span>
    <h1>Mejores decisiones desde el principio<span class="orange">.</span></h1>
    <p class="lead">No siempre necesitas más tecnología para conseguir una mejor solución. Empiezo por entender el problema, aprovecho lo que ya tienes y solo incorporo complejidad cuando aporta valor real.</p></div>
    <aside class="met-hero-quote"><p>Una buena arquitectura permite comenzar simple y ampliar escala cuando el proyecto lo pide.</p><span>El criterio, antes que el stack</span></aside></div>
    <ol class="met-principles">
      <li><span>01</span><p>Empiezo con los recursos y tecnologías realmente necesarios.</p></li>
      <li><span>02</span><p>No incorporo complejidad que todavía no aporta valor.</p></li>
      <li><span>03</span><p>Aprovecho las herramientas e infraestructura que ya usas.</p></li>
      <li><span>04</span><p>Construyo una base sólida, ordenada y preparada para crecer.</p></li>
      <li><span>05</span><p>Administro los recursos económicos, tecnológicos y de ejecución.</p></li>
      <li><span>06</span><p>Escalo cuando las necesidades reales del proyecto lo justifican.</p></li>
    </ol></div></section>

    <section class="section"><div class="wrap">{overline("01", "Dos formas de trabajar")}
    <div class="met-dual-head"><h2>Sobredimensionar<br>o construir<br>con criterio.</h2>
    <p>El mismo problema admite dos respuestas. La diferencia es cuándo llega cada tecnología y por qué.</p></div>
    <div class="met-compare-tabs" role="group" aria-label="Elegir enfoque">
      <button class="met-compare-tab" type="button" data-pane-tab="a" aria-pressed="false">A · Sobredimensionar</button>
      <button class="met-compare-tab" type="button" data-pane-tab="b" aria-pressed="true">B · Construir con criterio</button>
    </div>
    <div class="met-compare" data-met-compare data-active="b">
      <article class="met-pane met-pane--a" data-pane="a" tabindex="0" aria-label="Enfoque A: sobredimensionar desde el inicio">
        <header class="met-pane-head"><span class="met-pane-tag">Enfoque A</span><span class="met-pane-state">Complejidad antes que valor</span></header>
        <h3>Sobredimensionar<br>desde el inicio</h3>
        <ul>
          <li>Tecnologías innecesarias desde el día uno.</li>
          <li>Costos que crecen antes de necesitarlo.</li>
          <li>Dependencias y complejidad difíciles de mantener.</li>
          <li>Infraestructura que todavía no aporta valor.</li>
        </ul>
        <footer class="met-pane-foot"><span>Arranque<b>costo alto</b></span><span>Capacidad usada<b>parcial</b></span><span>Mantenimiento<b>alto</b></span></footer>
      </article>
      <div class="met-compare-axis" aria-hidden="true"><span class="met-compare-line"></span><span class="met-compare-vs">vs</span><span class="met-compare-line"></span></div>
      <article class="met-pane met-pane--b" data-pane="b" tabindex="0" aria-label="Enfoque B: construir con criterio">
        <header class="met-pane-head"><span class="met-pane-tag">Enfoque B</span><span class="met-pane-state">Proporcional y creciente</span></header>
        <h3>Construir<br>con criterio</h3>
        <ul>
          <li>Empiezo por la necesidad real, no por el stack.</li>
          <li>Aprovecho las herramientas que ya tienes.</li>
          <li>Una base proporcional, ordenada y mantenible.</li>
          <li>Nuevas capacidades cuando el proyecto las necesita.</li>
        </ul>
        <footer class="met-pane-foot"><span>Arranque<b>justo</b></span><span>Capacidad usada<b>completa</b></span><span>Mantenimiento<b>bajo</b></span></footer>
      </article>
    </div>
    <p class="met-foot-note">Empezar con menos tecnología no es entregar una solución inferior: es evitar costos, dependencias y mantenimiento innecesarios. La base queda lista para comenzar simple y crecer cuando corresponda.</p>
    </div></section>

    <section class="section" style="background:var(--paper2)"><div class="wrap">{overline("02", "Cómo se toma la decisión")}
    <div class="section-head"><h2>La tecnología se elige después de entender el problema.</h2>
    <p>Seis pasos, un punto de decisión. El detalle aparece al pasar por cada etapa.</p></div>
    <div class="met-flow2" data-met-flow data-active="decision">
      <ol class="met-steps" aria-label="Recorrido de toma de decisión">
        {pasos_html}
      </ol>
      <aside class="met-flow2-panel" aria-live="polite">
        <p class="met-flow2-kicker"><span data-kicker>Paso 03</span><span class="met-flow2-kicker-sep" aria-hidden="true">/</span><span data-kicker-of>Decisión</span></p>
        <h3 data-title>El camino se elige aquí</h3>
        <p data-body>La tecnología se selecciona después de analizar, nunca antes.</p>
        <div class="met-flow2-paths" data-paths>
          <p class="met-flow2-paths-label">Cuatro caminos posibles, un mismo criterio</p>
          {caminos_html}
        </div>
      </aside>
    </div>
    </div></section>

    <section class="section"><div class="wrap">{overline("03", "Resolver, consolidar y escalar")}
    <div class="section-head"><h2>De la solución inicial a la que crece.</h2>
    <p>Una base proporcional al problema de hoy, lista para volverse más capaz cuando el uso lo pida.</p></div>
    <div class="met-evo2" data-met-evolution data-active="0">
      <div class="met-evo2-track">
        {etapas_html}
      </div>
      {paneles_html}
    </div>
    </div></section>

    <section class="section" style="background:var(--paper2)"><div class="wrap">{overline("04", "Gestión inteligente de recursos")}
    <div class="section-head"><h2>El recurso correcto para cada tarea.</h2>
    <p>No siempre uso los mismos agentes ni los mismos modelos. El panel muestra el recurso que resuelve mejor cada tipo de tarea.</p></div>
    <div class="met-matrix" data-met-matrix data-active="tecnica">
      <div class="met-matrix-rows" role="tablist" aria-label="Tipos de tarea">
        <p class="met-matrix-label">Tipo de tarea <span aria-hidden="true">→</span> Recurso recomendado</p>
        {tareas_html}
      </div>
      <aside class="met-matrix-panel" aria-live="polite">
        <p class="met-matrix-kicker">Recurso a medida de la tarea</p>
        <h3 data-name>…</h3>
        <p data-desc>…</p>
        <div class="met-matrix-tools" data-tools></div>
        <ul class="met-matrix-factors" data-factors></ul>
        <p class="met-matrix-note" data-note>…</p>
      </aside>
    </div>
    <p class="met-foot-note">Elegir la herramienta también es parte de desarrollar bien. Un modelo más caro que el necesario no mejora el resultado: encarece el proceso y gasta cuotas que rinden más en la siguiente tarea.</p>
    </div></section>

    <section class="section"><div class="wrap">{overline("05", "La seguridad acompaña cada etapa")}
    <div class="met-shield-head"><h2>La seguridad no se agrega al final.</h2>
    <p>Es el suelo del recorrido completo: se decide desde el diseño y se verifica en cada entrega.</p></div>
    <ol class="met-shield-rail" aria-label="Seis prácticas de seguridad transversales">
      {controles_html}
    </ol>
    <p class="met-shield-foot">Sin certificaciones ni auditorías afirmadas: el compromiso es con prácticas verificables en cada entrega. Cada control se documenta, se prueba y queda en el registro.</p>
    </div></section>

    <section class="section" style="background:var(--paper2)"><div class="wrap">{overline("06", "Aplicado, no solo teoría")}
    <div class="section-head"><h2>Contrástala con proyectos reales.</h2>
    <p>Cuatro casos, un mismo criterio aplicado cuatro veces. Cada uno enlaza a su ficha.</p></div>
    <div class="met-examples">{ejemplos_html}</div>
    </div></section>

    <section class="section"><div class="wrap">{overline("07", "Diagnóstico inicial gratuito")}
    <div class="met-diag">
      <div class="met-diag-col met-diag-col--in"><h2>Qué conversamos primero.</h2>
      <p class="met-diag-lead">Una orientación para entender la tarea, las herramientas, la frecuencia y los resultados esperados. No necesitas elegir la tecnología.</p>
      <h3>Qué incluye</h3><ul>{cells(included)}</ul></div>
      <div class="met-diag-col met-diag-col--out"><h2>Lo que queda fuera.</h2>
      <p class="met-diag-lead">Este trabajo se propone y se acuerda por separado, antes de comenzar.</p>
      <h3>Qué queda fuera</h3><ul>{cells(excluded)}</ul>
      <p class="hint">El trabajo técnico se propone y acuerda antes de comenzar. No se piden archivos de clientes, accesos, cuentas o datos sensibles en el primer contacto.</p></div>
    </div></div></section>

    <section class="section met-close"><div class="wrap"><div class="contact-board"><div><h2>La primera conversación es el inicio.</h2></div>
    <div><p>Una descripción libre del problema es suficiente para comenzar.</p>{a(d, "contacto/", "Escribirme " + icon("arrow", True), "button dark")}</div></div></div></section>"""

    page("metodo", "Método de trabajo: criterio antes que tecnología",
         "Cómo trabajo: entender el problema antes de elegir herramientas, aprovechar lo que ya existe, construir una base proporcional y escalar cuando el proyecto lo pide. Diagnóstico inicial gratuito.",
         body, "metodo")


def calc():
    d=1
    before_h, before_m = divmod(ORDER_CASE["before"], 60)
    after_h, after_m = divmod(ORDER_CASE["after"], 60)
    body=f"""<section class="page-hero calculator-hero"><div class="wrap">{crumb(d,[(None,"Calculadora")])}
    <span class="eyebrow">Calculadora de tiempo</span><h1>El tiempo también cuenta<span class="orange">.</span></h1>
    <p class="lead">La calculadora parte con el cierre de pedidos de la portada. Cambia los tiempos, la frecuencia y el número de personas para estimar tu propio caso.</p></div></section>
    <section class="section calculator-panel"><div class="wrap">{overline("01","Compara dos escenarios")}
    {calculator_widget()}</div></section>
    <section class="section" style="background:var(--paper2)"><div class="wrap">{overline("02","Cómo interpretar la cifra")}
    <div class="section-head"><h2>Cómo leer el resultado.</h2>
    <p>El caso de pedidos supone cinco cierres por semana durante 52 semanas. Si la tarea es estacional o cambia de frecuencia, ajusta ese dato para representar mejor tu operación.</p></div>
    <p>{a(d,"contacto/","Revisemos un proceso real "+icon("arrow",True))}</p></div></section>"""
    page("calculadora","Calculadora de tiempo recuperado al automatizar tareas","Calcula horas recuperadas por ejecución, semana, mes y año al automatizar una tarea. Estimación local sin enviar datos; valor económico opcional.",body,"calculadora")
    path=ROOT/"calculadora"/"index.html"
    text=path.read_text(encoding="utf-8")
    text=text.replace("</body></html>",'<script src="../assets/calculator.js" defer></script></body></html>')
    path.write_text(text,encoding="utf-8")
def booking_art():
    """Ilustracion geometrica del agendamiento.

    La disponibilidad y la hora se eligen en Google Calendar al abrir el
    enlace: aqui solo se comunica la idea de calendario con la marca.
    """
    marks = [(64, 126), (122, 126), (238, 126),
             (64, 176), (180, 176),
             (122, 226), (238, 226)]
    squares = "".join(f'<rect x="{x}" y="{y}" width="18" height="18" rx="2"/>' for x, y in marks)
    return f"""<div class="booking-art">
    <svg class="booking-art-figure" viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <rect class="booking-art-frame" x="24" y="46" width="272" height="230" rx="9"/>
      <path class="booking-art-rule" d="M24 94h272"/>
      <path class="booking-art-ring" d="M89 46a11 11 0 0 1 22 0M209 46a11 11 0 0 1 22 0"/>
      <g class="booking-art-marks">{squares}</g>
      <rect class="booking-art-pick" x="180" y="126" width="18" height="18" rx="2"/>
      <path class="booking-art-tick" d="M180 152h18"/>
    </svg>
    <p class="booking-art-note"><b>45 min</b> · Google Calendar<span>Hora de Chile</span></p>
    </div>"""


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
    {interior_art("modular-v02/K03-ficha-agenda.svg","contact-frame-art")}
    <span class="eyebrow">Diagnóstico inicial gratuito</span>
    <h1>¿Qué necesitas resolver<span class="orange">?</span></h1>
    <p class="lead">Cuéntame qué haces hoy y qué parte te está tomando más tiempo del que debería.</p>
    {external(WHATSAPP,"Conversemos por WhatsApp "+icon("arrow",True),"button dark")}</div></section>
    <section class="section booking-section" id="agenda" aria-labelledby="booking-title"><div class="wrap">
    {overline("01","Agenda una conversación")}
    <div class="booking-intro"><div><h2 id="booking-title">Elige un horario para conversar.</h2>
    <p class="lead">{e(booking_description)}</p></div>
    {booking_art()}</div>
    <a class="button dark" href="{e(booking_url)}" data-project-portal>Ver horarios {icon("window",True)}</a>
    {booking_dialog}
    </div></section>
    <section class="section"><div class="wrap">{overline("02","Primer contacto")}
    <div class="case-layout"><div><h2>Cuéntame cómo haces hoy la tarea.</h2><p class="lead">Podemos empezar por el resultado que esperas y las herramientas que ya usas.</p>
    <p style="margin-top:2rem">{external(LINKEDIN,"Contactar por LinkedIn "+icon("arrow",True),"button strong")}</p>
    <p class="hint">Si prefieres conversar antes de reservar, también puedes escribirme por LinkedIn.</p></div>
    <aside><p class="eyebrow">Orientación gratuita</p>
    <p>La primera conversación ayuda a decidir si conviene evaluar el problema con más detalle. Una auditoría, instalación, desarrollo o intervención se presupuestan y acuerdan por separado.</p>
    <p class="hint">No envíes credenciales, bases de clientes, datos privados ni archivos sensibles en el primer mensaje.</p></aside></div></div></section>
    <section class="ink-panel"><div class="wrap">{overline("03","Antes de conversar")}
    <div class="statement statement-contact"><h2>Una pregunta es suficiente para comenzar.</h2>
    <p class="lead">¿Qué parte de tu trabajo requiere tiempo que podría dedicarse a algo más útil? Si no lo tienes claro, también podemos revisarlo.</p></div></div></section>"""
    page("contacto","Agenda una conversación","Agenda una conversación inicial gratuita de 45 minutos con JMorgado. Reserva directamente desde la web mediante Google Calendar.",body,"contacto")
if __name__=="__main__":
    home();portfolio();tools_index();game_page();redirect_legacy_tools()
    for p in PROJECTS:project_detail(p)
    services_index()
    for s in SERVICES:service_detail(s)
    method();calc();contact();not_found()
