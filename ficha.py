"""JMorgado — Sistema reutilizable de fichas de proyectos (`fx-*`).

Una ficha se describe en `site_data.py::FICHAS[<slug>]`:

    FICHAS["impulsacv"] = {
        "slug": "impulsacv",
        "eyebrow": "Producto digital · HR Tech",
        "tags": ["Producto digital", "Infraestructura", "IA aplicada"],
        "topline": [("", "Archivo"), ("", "Software y plataformas"), (None, "ImpulsaCV")],
        "title": "ImpulsaCV", "title_accent": ".",
        "page_class": "project-impulsacv-page",
        "page_title": "...", "description": "...",
        "sections": [
            {"type": "desafio", ...},
            {"type": "perspectivas", ...},
            ...
        ],
    }

`render_ficha()` recorre `sections` en orden y devuelve (body, page_title,
description). Las secciones ausentes no dejan huecos.
"""
from pathlib import Path
from html import escape as _e
from hashlib import sha256
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent

def e(value): return _e(str(value), quote=True)

def local(d, p=""):
    if d is None:
        return "/" + p
    return "../" * d + p

def asset(d, path):
    version = sha256((ROOT / path).read_bytes()).hexdigest()[:12]
    return local(d, path) + "?v=" + version

def icon(name="arrow", tiny=False):
    cls = f'icon{" tiny" if tiny else ""}'
    return f'<svg class="{cls}" aria-hidden="true" focusable="false"><use href="#i-{e(name)}"></use></svg>'

def crumb(d, parts):
    out = ['<nav class="fx-crumb" aria-label="Ruta de navegación">']
    for i, (href, label) in enumerate(parts):
        if i: out.append('<span aria-hidden="true">/</span>')
        if href is None: out.append(f'<span aria-current="page">{e(label)}</span>')
        else: out.append(f'<a href="{e(href)}">{e(label)}</a>')
    return "".join(out) + "</nav>"

def fx_portal(d, spec):
    url = spec.get("site")
    if not url: return ""
    return f'<a class="fx-portal" href="{e(url)}" data-project-portal>Ver sitio {icon("window", True)}</a>'

def fx_topline(d, spec):
    return f'<div class="fx-topline">{crumb(d, spec["topline"])}{fx_portal(d, spec)}</div>'

def fx_tags(items):
    return '<div class="fx-tags">' + "".join(f"<span>{e(t)}</span>" for t in items) + "</div>"

def fx_hero(d, spec):
    title = e(spec["title"])
    accent = spec.get("title_accent")
    if accent:
        title += f'<span class="fx-coral">{e(accent)}</span>'
    logo = ""
    if spec.get("logo"):
        marca = spec["logo"]
        logo = (f'<img class="fx-hero-logo" src="{e(marca["src"])}" alt="{e(marca.get("alt", spec["title"]))}"'
                f' width="{marca.get("w", 96)}" height="{marca.get("h", 96)}" decoding="async">')
    estado = f'<p class="fx-hero-estado">{e(spec["estado"])}</p>' if spec.get("estado") else ""
    return f'''<section class="fx-hero"><div class="fx-wrap">
      {fx_topline(d, spec)}
      <div class="fx-hero-grid"><div class="fx-hero-left">{logo}<p class="fx-eyebrow">{e(spec["eyebrow"])}</p><h1 class="fx-hero-title">{title}</h1></div>
      <div class="fx-hero-copy"><p>{e(spec["summary"])}</p>{estado}{fx_tags(spec["tags"])}</div></div></div></section>'''

def fx_head(h2, intro):
    return f'<div class="fx-head"><h2>{h2}</h2><p class="fx-intro">{e(intro)}</p></div>'

def fx_section(eyebrow, inner, modifier=""):
    mod = f" {modifier}" if modifier else ""
    return f'<section class="fx-section{mod}"><div class="fx-wrap"><p class="fx-eyebrow">{e(eyebrow)}</p>\n{inner}</div></section>'

def render_hero(d, spec):
    return fx_hero(d, spec)

def render_desafio(d, spec):
    inner = fx_head(spec["h2"], spec["intro"])
    return fx_section(spec.get("eyebrow", "El desafío"), inner, spec.get("modifier", "fx-section--alt"))

def render_perspectivas(d, spec):
    arch_src = spec["arch_src"]
    flow_src = spec["flow_src"]
    inner = f'''<p class="fx-eyebrow">{e(spec.get("eyebrow", "Así funciona"))}</p>
      <div class="ic-system-head"><h2>{spec["h2"]}</h2><p class="fx-intro">{e(spec["intro"])}</p></div>
      <div class="ic-tabs" role="tablist" aria-label="Perspectiva del sistema">
        <button type="button" role="tab" aria-selected="true" data-archify-view="workflow" data-src="{e(flow_src)}">{e(spec["labels"][0])}</button>
        <button type="button" role="tab" aria-selected="false" data-archify-view="architecture" data-src="{e(arch_src)}">{e(spec["labels"][1])}</button>
      </div>
      <div class="ic-archify-frame">
        <iframe id="archify-frame" data-archify-frame="workflow" src="{e(flow_src)}" title="{e(spec.get('iframe_title', spec['title']))}" loading="lazy" referrerpolicy="origin"></iframe>
        <iframe id="archify-frame-architecture" data-archify-frame="architecture" title="{e(spec.get('iframe_title_architecture', spec['title']))}" loading="lazy" referrerpolicy="origin" hidden></iframe>
      </div>'''
    return f'<section class="fx-section fx-section--dark ic-section--system" id="sistema" data-archify-scope><div class="fx-wrap">{inner}</div></section>'

def render_diagrama(d, spec):
    """Un solo diagrama Archify, cargado al entrar en pantalla.

    Usa el módulo genérico assets/project-archify.js (tema, altura, carga
    diferida y ocultación de controles internos). El `src` se inyecta desde
    build_site.py para poder versionar el asset.
    """
    inner = f'''<div class="fx-head"><h2>{spec["h2"]}</h2><p class="fx-intro">{e(spec["intro"])}</p></div>
      <div class="fx-archify">
        <iframe data-archify-frame="diagram" data-src="{e(spec["src"])}" title="{e(spec.get("iframe_title", spec.get("title", "Diagrama")))}" referrerpolicy="origin"></iframe>
      </div>'''
    if spec.get("note"):
        inner += f'<p class="fx-archify-note">{e(spec["note"])}</p>'
    return f'<section class="fx-section fx-archify-section" data-archify-scope><div class="fx-wrap"><p class="fx-eyebrow">{e(spec.get("eyebrow", "Cómo funciona"))}</p>{inner}</div></section>'

def render_modos(d, spec):
    """Dos registros de una misma propuesta (por ejemplo, dos ambientes
    visuales de una marca) en composicion editorial de dos columnas.

    Cada modo declara `kicker`, `title`, `text` y `points`. El bloque opcional
    `nota` conecta ambos registros y se dibuja como puente entre columnas.
    """
    cards = []
    for index, modo in enumerate(spec["modos"], 1):
        puntos = "".join(f"<li>{e(p)}</li>" for p in modo.get("points", []))
        lista = f'<ul class="fx-modo-points">{puntos}</ul>' if puntos else ""
        cards.append(
            f'<article class="fx-modo fx-modo--{index}">'
            f'<p class="fx-modo-kicker">{e(modo["kicker"])}</p>'
            f'<h3 class="fx-modo-title">{e(modo["title"])}</h3>'
            f'<p class="fx-modo-text">{e(modo["text"])}</p>'
            f'{lista}</article>'
        )
    puente = ""
    if spec.get("nota"):
        etiqueta = f'<p class="fx-modos-puente-label">{e(spec["nota_label"])}</p>' if spec.get("nota_label") else ""
        puente = f'<div class="fx-modos-puente">{etiqueta}<p class="fx-modos-nota">{e(spec["nota"])}</p></div>'
    inner = (f'<div class="fx-head"><h2>{spec["h2"]}</h2><p class="fx-intro">{e(spec["intro"])}</p></div>'
             f'<div class="fx-modos">{"".join(cards)}</div>{puente}')
    return (f'<section class="fx-section fx-modos-section"><div class="fx-wrap">'
            f'<p class="fx-eyebrow">{e(spec.get("eyebrow", "Dos registros"))}</p>{inner}</div></section>')


def render_platform(d, spec):
    items = "".join(
        f'<article class="fx-item"><span class="fx-item-num">{e(x["num"])}</span><div><h3>{e(x["title"])}</h3><p>{e(x["text"])}</p></div></article>'
        for x in spec["items"]
    )
    lead = spec.get("lead")
    lead_html = f'<p class="fx-lead">{lead}</p>' if lead else ""
    inner = fx_head(spec["h2"], spec["intro"]) + lead_html + f'<div class="fx-list">{items}</div>'
    return fx_section(spec.get("eyebrow", "Plataforma"), inner, "fx-section--alt")

def render_participacion_actions(d, spec):
    points = "".join(
        f'<div class="fx-point"><strong>{e(x["strong"])}</strong><p>{e(x["text"])}</p></div>'
        for x in spec["points"]
    )
    inner = fx_head(spec["h2"], spec["intro"]) + f'<div class="fx-points">{points}</div>'
    return fx_section(spec.get("eyebrow", "Mi participación"), inner, "fx-section--alt")

def render_actions(d, spec):
    links = []
    for kind, label, href in spec["actions"]:
        classes = {"primary": "fx-action fx-action--primary", "secondary": "fx-action"}.get(kind, "fx-action")
        links.append(f'<a class="{classes}" href="{e(href)}">{e(label)} {icon("arrow", True)}</a>')
    return '<div class="fx-actions">' + "".join(links) + "</div>"

def render_tecnologias(d, spec):
    """Tecnologias con icono.

    Reutiliza el chip compartido del sitio (`.tag.tech-badge`) y los iconos
    locales en `assets/tech-icons/`, de modo que el tratamiento sea el mismo que
    en el resto del portafolio y no un sistema duplicado.
    """
    chips = []
    for item in spec["items"]:
        nombre = item["name"]
        color = item.get("color")
        marker = f' style="--tech-color:{e(color)}"' if color else ""
        icono = item.get("icon")
        imagen = (f'<img src="{e(asset(d, icono))}" alt="" width="26" height="26"'
                  f' loading="lazy" decoding="async">') if icono else ""
        chips.append(f'<span class="tag tech-badge"{marker}>{imagen}{e(nombre)}</span>')
    body = (f'<h2>{e(spec.get("heading", "Tecnolog\u00edas"))}</h2>'
            f'<div class="fx-tech-list">{"".join(chips)}</div>')
    if spec.get("note"):
        body += f'<p class="fx-intro fx-tech-note">{e(spec["note"])}</p>'
    return fx_section(spec.get("eyebrow", "Tecnolog\u00edas"), body, spec.get("modifier", ""))


def render_tech(d, spec):
    if not spec.get("items"):
        return ""
    items = "".join(f"<span>{e(x)}</span>" for x in spec["items"])
    body = f'<h2>{e(spec.get("heading", "Tecnologías"))}</h2><div class="fx-tech">{items}</div>'
    if spec.get("repo"):
        body += f'<a class="fx-repo" href="{e(spec["repo"])}" target="_blank" rel="noopener noreferrer">Código y documentación {icon("arrow", True)}</a>'
    return fx_section(spec.get("eyebrow", "Tecnologías"), body)

def render_repo(d, spec):
    if not spec.get("repo"):
        return ""
    body = f'<h2>Recurso principal</h2><a class="fx-repo" href="{e(spec["repo"])}" target="_blank" rel="noopener noreferrer">{e(spec.get("label", "Ver repositorio"))} {icon("arrow", True)}</a>'
    return fx_section(spec.get("eyebrow", "Código"), body)

def render_metrics(d, spec):
    metrics = spec.get("metrics", [])
    if not metrics:
        return ""
    items = "".join(f'<div class="fx-metric"><b>{e(x["value"])}</b><small>{e(x["label"])}</small></div>' for x in metrics)
    return fx_section(spec.get("eyebrow", "Resultados"), f'<div class="fx-metrics">{items}</div>')

def render_galeria(d, spec):
    images = spec.get("images", [])
    if not images:
        return ""
    cells = "".join(
        f'<figure><img src="{e(src)}" alt="{e(alt)}" loading="lazy" width="{w}" height="{h}"><figcaption>{e(alt)}</figcaption></figure>'
        for alt, src, w, h in images
    )
    return fx_section(spec.get("eyebrow", "Galería"), f'<div class="fx-gallery">{cells}</div>')

def render_cierre(d, spec):
    inner = f'''<div class="fx-head fx-cierre-head fx-head--center"><h2 class="fx-cierre-title">{e(spec["h2"])}</h2><p class="fx-intro fx-cierre-text">{e(spec["text"])}</p></div>'''
    return f'<section class="fx-cierre"><div class="fx-wrap"><p class="fx-eyebrow">{e(spec.get("eyebrow", "El siguiente paso"))}</p>{inner}</section></section>'

_BUILDERS = {
    "hero": render_hero,
    "desafio": render_desafio,
    "perspectivas": render_perspectivas,
    "diagrama": render_diagrama,
    "modos": render_modos,
    "plataforma": render_platform,
    "participacion": render_participacion_actions,
    "tech": render_tech,
    "tecnologias": render_tecnologias,
    "repo": render_repo,
    "metrics": render_metrics,
    "galeria": render_galeria,
    "cierre": render_cierre,
}
def render_contacto(d, spec):
    eyebrow = spec.get("eyebrow", "¿Tienes un desafío en mente?")
    text = spec["text"]
    label = spec["label"]
    href = spec["href"]
    inner = (
        '<div class="fx-contact-copy">'
        f'<p class="fx-contact-lede">{e(text)}</p>'
        f'<a class="fx-contact-button" href="{e(href)}">{e(label)} {icon("arrow", False)}</a>'
        '</div>'
    )
    return ('<section class="fx-section fx-contact" id="contacto"><div class="fx-wrap">'
            f'<p class="fx-eyebrow fx-contact-eyebrow">{e(eyebrow)}</p>{inner}</div></section>')

_BUILDERS["contacto"] = render_contacto
# Bloque editorial de una sola idea (mismo render que el desafio, otro uso).
_BUILDERS["statement"] = render_desafio


def render_ficha(d, slug):
    from site_data import FICHAS
    spec = FICHAS[slug]
    sections_html = []
    for module in spec["sections"]:
        builder = _BUILDERS[module["type"]]
        out = builder(d, {**spec, **module})
        if out:
            sections_html.append(out)
    body = f'<div class="fx-ficha {spec.get("page_class", "")}">' + "".join(sections_html) + "</div>"
    return body, spec["page_title"], spec["description"]
