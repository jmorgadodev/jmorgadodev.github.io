"""Genera una ficha AL demonstración sin publicar (ejemplo de reutilización).

Glaciar es un proyecto ficticio. El script usa exactamente la misma ruta de
renderizado que ImpulsaCV: `ficha.render_ficha()` + `site_data.FICHAS`.

Uso:
    python Herramientas/ficha-ejemplo/build_demo.py
seguido de un servidor en la raíz del repositorio.
"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

import site_data
import ficha as F

GLACIAR = {
    "slug": "glaciar",
    "eyebrow": "Proyecto ficticio · Datos",
    "tags": ["Datos públicos", "Visualización", "Frontend"],
    "topline": [("", "Archivo"), ("", "Datos e ingeniería"), (None, "Glaciar")],
    "title": "Glaciar", "title_accent": ".",
    "page_class": "fx-ficha--glaciar",
    "page_title": "Glaciar — proyecto de demostración (no publicado)",
    "description": "Observatorio climático ficticio para demostrar el sistema de fichas de JMorgado.",
    "summary": "Un observatorio climático que convierte los datos públicos dispersos en una experiencia legible.",
    "sections": [
        {"type": "hero"},
        {
            "type": "desafio",
            "eyebrow": "El desafío",
            "h2": "Datos que nadie combina, decisiones que no llegan.<span class='fx-coral'>.</span>",
            "intro": "El problema no era la falta de datos, sino la fragmentación de sus fuentes: formatos distintos, cortes distintos y cero unificación para la persona que consulta.",
        },
        {
            "type": "plataforma",
            "eyebrow": "04 · Cómo funciona Glaciar",
            "h2": "Datos que se leen sin leerlos.<span class='fx-coral'>.</span>",
            "intro": "Glaciar toma fuentes climáticas públicas y las convierte en una lectura continua para cada comuna.",
            "lead": "Un solo recorrido: de la medición a la consulta.<span class='fx-coral'> Sin descarga técnica.</span>",
            "items": [
                {"num": "01", "title": "Ingesta y normalización", "text": "API pública → Python → tablas normalizadas."},
                {"num": "02", "title": "Consulta local", "text": "El frontend resuelve la consulta por comuna sin servidor propio."},
                {"num": "03", "title": "Visualización", "text": "Serie histórica, acumulado anual y tendencia."},
            ],
        },
        {
            "type": "repo",
            "eyebrow": "Código",
            "repo": "https://github.com/jmorgadodev/jmorgadodev.github.io",
            "label": "Ver repositorio",
        },
        {
            "type": "metrics",
            "eyebrow": "Resultados (ficticios)",
            "metrics": [
                {"value": "342", "label": "Series por comuna"},
                {"value": "100%", "label": "Datos con fuente documentada"},
                {"value": "1", "label": "Demo: reutiliza la plantilla"},
            ],
        },
        {
            "type": "cierre",
            "eyebrow": "El siguiente paso",
            "h2": "Los datos públicos también merecen ser claros.",
            "text": "Este proyecto ficticio demuestra que la plantilla admite módulos opcionales: hero, desafío, plataforma, repositorio, métricas y cierre — sin perspectivas Archify, sin portales.",
        },
    ],
}

body, title, description = None, None, None
import importlib
importlib.reload(site_data)
site_data.FICHAS["glaciar"] = GLACIAR
body, title, description = F.render_ficha(2, "glaciar")
out = pathlib.Path(__file__).with_name("demo-glaciar.html")
out.write_text(
    "<!doctype html><html lang='es' data-jm-theme='day'><head><meta charset='UTF-8'>"
    "<title>Glaciar — demostración del sistema de fichas (no publicado)</title>"
    f"<link rel='stylesheet' href='../../assets/site.css?v=87e262513c9a'>"
    f"<link rel='stylesheet' href='../../assets/themes.css'>"
    f"<link rel='stylesheet' href='../../assets/interior.css?v=68f9a46d599c'>"
    f"<link rel='stylesheet' href='{F.asset(2, 'assets/ficha.css')}'>"
    f"<link rel='stylesheet' href='{F.asset(2, 'assets/project-impulsacv.css')}'>"
    f"<script src='../../assets/theme-init.js'></script>"
    "<body>" + body + "<script src='../../assets/site.js?v=aceae9b15480' defer></script></body></html>",
    encoding="utf-8",
)
print("written", out)
