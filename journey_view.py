"""Escenario persistente a partir de las piezas originales del kit modular."""
from html import escape
from pathlib import Path
import json, re
ROOT = Path(__file__).resolve().parent

def render_journey(scenes):
    folder = ROOT / "assets/modular"
    manifest = json.loads((folder / "manifest.json").read_text(encoding="utf-8"))
    def svg(name):
        source = (folder / (name + ".svg")).read_text(encoding="utf-8")
        source = re.sub(r' role="img"| aria-label="[^"]*"', '', source)
        if "width=" not in source.split(">",1)[0]:
            box=re.search(r'viewBox="([^"]+)"',source).group(1).split()
            source=source.replace("<svg ",f'<svg width="{box[2]}" height="{box[3]}" ',1)
        return source
    choreography = json.loads((folder / 'choreography.json').read_text(encoding='utf-8'))
    final = choreography['desktop']['foundation'] + choreography['desktop']['extensions']
    pieces = []
    for p, pose in zip(manifest['pieces'], final):
        x,y,sx,sy,rotation = pose
        width,height=p['viewBox']
        pieces.append(f'<g transform="translate({x} {y}) scale({sx} {sy})" data-piece-id="{p["id"]}" data-width="{width}" data-height="{height}">{svg(p["id"])}</g>')
    layers = ''
    extras = f'<g transform="translate(560 440)" opacity="0" data-element="E06-semilla">{svg("E06-semilla")}</g>'
    keys = ['funcionar mejor.', 'entenderlo.', 'en grande.', 'puede crecer.', 'nuevos caminos.', 'encuentra su lugar.', 'una idea.']
    chapters = []
    for i,s in enumerate(scenes):
        tag = "h1" if i == 0 else "h2"
        assert s['title'].endswith(keys[i]), 'El énfasis debe pertenecer al titular editorial'
        prefix, key = s['title'].rsplit(keys[i], 1)[0].rstrip(), keys[i]
        title = f'<span class="type-mask"><span class="type-fragment">{escape(prefix)}</span></span> <span class="type-mask type-key"><span class="type-band" aria-hidden="true"></span><span class="type-fragment">{escape(key)}</span></span>'
        chapters.append(f'<section class="chapter" data-chapter="{i}" id="escena-{i+1:02}" aria-labelledby="capitulo-{i+1:02}"><div class="chapter-copy"><span class="type-frame" aria-hidden="true"></span><p class="j-label">{i+1:02} / 07 · {escape(s["name"])}</p><{tag} id="capitulo-{i+1:02}">{title}</{tag}><span class="type-rule" aria-hidden="true"></span>'+ (f'<p class="chapter-text">{escape(s["text"])}</p>' if s['text'] else '')+'</div></section>')
    states = json.dumps(choreography, ensure_ascii=False)
    return f'<section class="journey" data-journey aria-label="De una dificultad a una idea construida"><div class="journey-frame"><svg class="modular-art" data-journey-stage viewBox="0 0 1200 720" aria-hidden="true" focusable="false"><g class="construction">{layers}{"".join(pieces)}</g>{extras}</svg><div class="chapters">{"".join(chapters)}</div><p class="journey-invitation">Avanza para construir · <a href="#explorar">Ir a proyectos ↓</a></p></div><script type="application/json" id="journey-states">{states}</script></section>'
