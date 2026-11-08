"""Introducción JMorgado: siete capítulos accesibles sobre motion graphics Canvas.
El lienzo contiene solo gráficos; títulos y botones son HTML semántico.
"""
from html import escape

TITLES = [
    ("Hay algo que podría", "funcionar mejor."),
    ("Antes de cambiar algo,", "hay que entenderlo."),
    ("Empezar por algo", "que funcione."),
    ("Lo que funciona puede", ""),
    ("Una buena base abre", "nuevos caminos."),
    ("Cada pieza encuentra", "su lugar."),
    ("Todo comienza", "con una idea."),
]
DESCRIPTIONS = [
    "Una tarea que pesa. Una idea que todavía no encuentra su forma.",
    "Comprender las relaciones cambia la manera de resolver.",
    "Una solución pequeña también puede transformar el trabajo.",
    "Una buena idea se desarrolla sin empezar otra vez.",
    "Cada nueva capacidad amplía las posibilidades.",
    "Las partes se convierten en un conjunto.",
    "",
]

def render_study():
    chapters=[]
    for i,(one,two) in enumerate(TITLES):
        tag = "h1" if i == 0 else "h2"
        description = (f'<p class="study-description">{escape(DESCRIPTIONS[i])}</p>'
                       if DESCRIPTIONS[i] else "")
        chapters.append(
            f'<section class="study-copy copy-{i}" data-copy="{i}" aria-labelledby="journey-title-{i}">'
            '<div class="study-heading">'
            f'<{tag} id="journey-title-{i}"' + (' aria-label="Lo que funciona puede crecer."' if i == 3 else '') + '>'
            f'<span class="study-mask"><span>{escape(one)}</span></span>'
            + (f'<span class="study-mask study-key"><span>{escape(two)}</span></span>' if two else '')
            + f'</{tag}>'
            '<span class="study-rule" aria-hidden="true"></span>'
            '</div>'
            +description+
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
        +''.join(chapters)+
        '<p class="study-invitation"><span class="study-cue-line" aria-hidden="true"></span>'
        'Desplázate para continuar <span aria-hidden="true">↓</span></p>'
        '</div></section>'
    )
