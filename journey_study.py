"""Introducción JMorgado — narrativa definitiva: cuatro escenas y una transición.

El texto es semántico y accesible; el lienzo sólo contiene gráficos.
Cada escena es un capítulo con su propio mensaje: el cierre no repite el
nombre de la marca, sólo sostiene la frase que da paso al sitio.
"""
from html import escape

# (linea 1, linea 2). La segunda línea, cuando existe, es la acentuada («key»).
TITLES = [
    ("Todo comienza", "con una idea."),
    ("Le damos", "forma."),
    ("Lo que funciona", "puede crecer."),
    ("Y esto es solo el", "comienzo."),
]
DESCRIPTIONS = [
    "O con algo que podría funcionar mejor.",
    "Transformando lo que imaginas en algo que funciona.",
    "Evolucionar, abrir nuevas posibilidades y llegar más lejos.",
    "",
]


def render_study():
    chapters = []
    for i, (one, two) in enumerate(TITLES):
        tag = "h1" if i == 0 else "h2"
        aria = ' aria-label="%s"' % escape(" ".join(part for part in (one, two) if part))
        if two:
            heading = (f'<{tag} id="journey-title-{i}"{aria}>'
                       f'<span class="study-mask"><span>{escape(one)}</span></span>'
                       f'<span class="study-mask study-key"><span>{escape(two)}</span></span>'
                       f'</{tag}>')
        else:
            # Un solo titular: una línea, sin segunda máscara.
            heading = (f'<{tag} id="journey-title-{i}"{aria}>'
                       f'<span class="study-mask"><span>{escape(one)}</span></span>'
                       f'</{tag}>')
        description = ""
        if DESCRIPTIONS[i]:
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
        '<div class="study-topactions"><button type="button" class="study-theme"'
        ' aria-label="Cambiar tema">Modo noche</button>'
        '<a class="intro-skip" href="#explorar">Ir al sitio ↗</a></div></div>'
        '<div class="study-stage"><canvas class="study-canvas" aria-hidden="true"></canvas></div>'
        + ''.join(chapters) +
        '</div></section>'
    )
