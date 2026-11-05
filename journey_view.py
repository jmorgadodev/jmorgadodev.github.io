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
    pieces = []
    for p in manifest["pieces"]:
        pose=next(x for x in manifest["scenes"][5]["pieces"] if x["id"]==p["id"])
        pieces.append(f'<g transform="translate({pose["x"]} {pose["y"]})" data-piece-id="{p["id"]}">{svg(p["id"])}</g>')
    extras = ''.join(f'<g transform="translate(240 630)" opacity="{1 if name=="E07-basamento" else 0}" data-element="{name}">{svg(name)}</g>' for name in ['E07-basamento','E01-conector-recto','E02-conector-codo','E04-guia-alineacion','E05-cierre-union','E06-semilla'])
    chapters = []
    for i,s in enumerate(scenes):
        tag = "h1" if i == 0 else "h2"
        chapters.append(f'<section class="chapter" data-chapter="{i}" id="escena-{i+1:02}" aria-labelledby="capitulo-{i+1:02}"><div class="chapter-copy"><p class="j-label">{i+1:02} / 07 · {escape(s["name"])}</p><{tag} id="capitulo-{i+1:02}">{escape(s["title"])}</{tag}>'+ (f'<p class="chapter-text">{escape(s["text"])}</p>' if s['text'] else '')+'</div></section>')
    states = json.dumps(manifest['scenes'], ensure_ascii=False)
    return f'<section class="journey" data-journey aria-label="De una dificultad a una idea construida"><div class="journey-frame"><svg class="modular-art" data-journey-stage viewBox="0 0 1200 720" aria-hidden="true" focusable="false"><g class="construction">{extras}{"".join(pieces)}</g></svg><div class="chapters">{"".join(chapters)}</div><p class="journey-invitation">Avanza para construir · <a href="#explorar">Ir a proyectos ↓</a></p></div><script type="application/json" id="journey-states">{states}</script></section>'
