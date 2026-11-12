"""Introducción JMorgado — narrativa definitiva: tres actos y una transición.

El texto es semántico y accesible; el lienzo sólo contiene gráficos.
La identidad tipográfica de cierre (JMorgado.) es la existente del sitio:
no se inventa un nuevo logotipo ni se modifica la marca.
"""
from html import escape

# (linea 1, linea 2). La segunda línea, cuando existe, es la acentuada («key»).
TITLES = [
    ("Todo comienza", "con una idea."),
    ("Le damos", "forma."),
    ("Lo que funciona", "puede crecer."),
    ("JMorgado.", ""),
]
DESCRIPTIONS = [
    "Una necesidad puede convertirse en una oportunidad.",
    "Conectamos desarrollo, datos y procesos.",
    "Una buena base permite crecer sin rehacerlo todo.",
    "Desarrollo web, datos y automatización.",
]
# La identidad de cierre usa el wordmark existente: el punto va en coral.
CLOSING_HTML = '<span class="study-wordmark">JMorgado<span class="study-period">.</span></span>'


def render_study():
    chapters = []
    for i, (one, two) in enumerate(TITLES):
        tag = "h1" if i == 0 else "h2"
        if i == 3:
            aria = ' aria-label="JMorgado."'
            heading = f'<{tag} id="journey-title-{i}"{aria}>{CLOSING_HTML}</{tag}>'
        else:
            aria = ' aria-label="%s"' % escape(" ".join((one, two)))
            heading = (f'<{tag} id="journey-title-{i}"{aria}>'
                       f'<span class="study-mask"><span>{escape(one)}</span></span>'
                       f'<span class="study-mask study-key"><span>{escape(two)}</span></span>'
                       f'</{tag}>')
        description = f'<p class="study-description">{escape(DESCRIPTIONS[i])}</p>'
        chapters.append(
            f'<section class="study-copy copy-{i}" data-copy="{i}" aria-labelledby="journey-title-{i}">'
            '<div class="study-heading">'
            + heading +
            '<span class="study-rule" aria-hidden="true"></span>'
            '</div>'
            + description +
            '</section>'
        )
    return (
        '<noscript><style>.home-header{position:sticky!important;visibility:visible!important;'
        'opacity:1!important;transform:none!important}.study-copy{opacity:1!important;'
        'visibility:visible!important}</style></noscript>'
        '<section class="tech-study" id="home-start" data-study aria-label="Una idea toma forma">'
        '<div class="study-frame">'
        '<div class="study-topline">'
        '<span class="study-monogram" aria-hidden="true">JM<span class="study-period">.</span></span>'
        '<div class="study-topactions"><button type="button" class="study-theme"'
        ' aria-label="Cambiar tema">Modo noche</button>'
        '<a class="intro-skip" href="#explorar">Ir al sitio ↗</a></div></div>'
        '<div class="study-stage"><canvas class="study-canvas" aria-hidden="true"></canvas></div>'
        + ''.join(chapters) +
        '<p class="study-invitation"><span class="study-cue-line" aria-hidden="true"></span>'
        'Desplázate para continuar <span aria-hidden="true">↓</span></p>'
        '</div></section>'
    )
