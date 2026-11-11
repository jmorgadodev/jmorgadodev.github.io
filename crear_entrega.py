# -*- coding: utf-8 -*-
"""crear_entrega.py — genera el paquete ZIP de documentación de una entrega.

Regla permanente del proyecto: cada fase, tarea o intervención se entrega con un
ZIP autónomo que contenga todo lo necesario para revisar, comprender y continuar
el trabajo sin depender del resumen de un agente.

Uso:
    python crear_entrega.py --numero 02 --nombre fase-1-control-de-frecuencia \
        --titulo "Fase 1 · Control de frecuencia del motor narrativo" \
        --descripcion "..." --documentos docs/performance-audit/JMORGADO-AUDITORIA-Y-FASE-1.md \
        --mediciones docs/performance-audit/mediciones-fase1 docs/performance-audit/mediciones-originales \
        --capturas docs/performance-audit/capturas/base docs/performance-audit/capturas/fase1 \
        --diff --estado-git --scripts \
        --continuar "docs/performance-audit/..." --notas "Notas adicionales"

El ZIP se escribe en docs/entregas/<numero>-<nombre>.zip. Nunca borra los
originales: solo los copia.
"""
import argparse, io, os, re, shutil, subprocess, sys, zipfile
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent
DESTINO = REPO / "docs" / "entregas"
TMP = Path(os.environ.get("TEMP", ".")) / "entrega_build"


def run(cmd, cwd=REPO):
    try:
        r = subprocess.run(cmd, cwd=str(cwd), capture_output=True)
        return r.stdout.decode("utf-8", "replace")
    except Exception as e:
        return "ERROR: %s" % e


def recoge(paths):
    """Devuelve [(ruta_relativa_al_destino, ruta_absoluta)] de ficheros y carpetas.

    Un fichero suelto entra con su nombre; una carpeta, con su nombre como raiz.
    Así el paquete no arrastra la ruta del repositorio. Las rutas que no existen
    se avisan: un paquete silenciosamente incompleto es peor que uno que falla.
    """
    out = []
    for p in paths:
        p = Path(p)
        if not p.is_absolute():
            p = REPO / p
        if not p.exists():
            print("  AVISO: la ruta no existe y no se incluye: %s" % p)
            continue
        if p.is_file():
            out.append((p.name, p))
        elif p.is_dir():
            for f in sorted(p.rglob("*")):
                if f.is_file():
                    rel = Path(p.name) / f.relative_to(p)
                    out.append((str(rel).replace("\\", "/"), f))
    return out


def tamano(p):
    try:
        return p.stat().st_size
    except OSError:
        return 0


def formato(n):
    for u in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return "%.1f %s" % (n, u)
        n /= 1024.0
    return "%.1f TB" % n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--numero", required=True)
    ap.add_argument("--nombre", required=True)
    ap.add_argument("--titulo", required=True)
    ap.add_argument("--descripcion", required=True)
    ap.add_argument("--documentos", nargs="*", default=[])
    ap.add_argument("--mediciones", nargs="*", default=[])
    ap.add_argument("--capturas", nargs="*", default=[])
    ap.add_argument("--diff", action="store_true")
    ap.add_argument("--diff-commit", nargs=2, default=None,
                    help="Parche del commit indicado: <ref_base> <ref_cabeza>")
    ap.add_argument("--estado-git", action="store_true")
    ap.add_argument("--scripts", action="store_true")
    ap.add_argument("--continuar", nargs="*", default=[])
    ap.add_argument("--notas", default="")
    ap.add_argument("--raiz-paquete", default=None)
    args = ap.parse_args()

    raiz = args.raiz_paquete or ("%s-%s" % (args.numero, args.nombre))
    DESTINO.mkdir(parents=True, exist_ok=True)
    zip_path = DESTINO / ("%s-%s.zip" % (args.numero, args.nombre))

    if TMP.exists():
        shutil.rmtree(TMP)
    base = TMP / raiz
    base.mkdir(parents=True)

    # ── README del paquete ────────────────────────────────────────────────
    readme = io.open(base / "README.md", "w", encoding="utf-8", newline="\n")
    W = readme.write
    W("# %s\n\n" % args.titulo)
    W("**Proyecto:** JMorgado · `jmorgadodev.github.io`  \n")
    W("**Paquete:** `%s`  \n" % zip_path.name)
    W("**Generado:** %s  \n" % datetime.now().strftime("%Y-%m-%d %H:%M"))
    W("**Base del trabajo:** `63e45ea86597f318f4e1ff869ab315ce078ff4ef` (checkpoint aprobado)\n\n")
    W("%s\n\n" % args.descripcion)
    W("## Cómo está organizado\n\n")
    W("| Carpeta | Contenido |\n|---|---|\n")
    W("| `01-documentacion/` | Informes y documentación Markdown de la entrega |\n")
    W("| `02-mediciones/` | Logs, resultados y comparativas de las mediciones, e informe de QA con la salida íntegra de cada comprobación |\n")
    W("| `03-capturas/` | Capturas de referencia (antes / después) |\n")
    W("| `04-cambios/` | Diff, parche y versión anterior de los ficheros modificados |\n")
    W("| `05-continuidad/` | Estado de Git, decisiones, limitaciones, pendientes e instrucciones para la siguiente fase |\n")
    W("| `scripts/` | Instrumentación y QA reproducible (sólo si la entrega los incluye) |\n\n")
    if args.notas:
        W("## Notas\n\n%s\n\n" % args.notas)
    W("## Cómo reproducir las mediciones\n\n")
    W("```bash\n"
      "# Requiere Playwright (Python) con Chromium headless.\n"
      "# Los scripts están en scripts/ (o en docs/performance-audit/mediciones-*/).\n"
      "python medicion_v3.py --smoke desktop-plain   # prueba rápida\n"
      "python medicion_v3.py                        # batería completa\n"
      "```\n\n")
    W("**Advertencia:** todas las cifras provienen de Chromium headless con **SwiftShader** ")
    W("(rasterizado por software, sin GPU). **Ninguna cifra procede de un teléfono físico.**\n")
    readme.close()

    def volcar(destino_rel, items):
        d = base / destino_rel
        d.mkdir(parents=True, exist_ok=True)
        for rel, abs_p in items:
            destino = d / rel
            destino.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(abs_p, destino)

    # ── 01 documentación ──────────────────────────────────────────────────
    volcar("01-documentacion", recoge(args.documentos))
    # ── 02 mediciones ─────────────────────────────────────────────────────
    volcar("02-mediciones", recoge(args.mediciones))
    # ── 03 capturas ───────────────────────────────────────────────────────
    volcar("03-capturas", recoge(args.capturas))
    # ── 04 cambios ────────────────────────────────────────────────────────
    if args.diff:
        d = base / "04-cambios"
        d.mkdir(parents=True, exist_ok=True)
        io.open(d / "diff-journey-study.patch", "w", encoding="utf-8", newline="\n").write(
            run(["git", "diff", "--", "assets/journey-study.js"]))
        io.open(d / "diff-completo.patch", "w", encoding="utf-8", newline="\n").write(run(["git", "diff"]))
        io.open(d / "diff-estadisticas.txt", "w", encoding="utf-8", newline="\n").write(
            run(["git", "diff", "--stat"]) + "\n" + run(["git", "status", "--short"]))
        # version anterior (checkpoint) para comparar
        try:
            base_js = run(["git", "show", "63e45ea:assets/journey-study.js"]).encode("utf-8")
            (d / "journey-study-CHECKPOINT-63e45ea.js").write_bytes(base_js)
        except Exception:
            pass
        for f in sorted((REPO / "assets").glob("journey-study.*")):
            shutil.copy2(f, d / f.name)
    if args.diff_commit:
        d = base / "04-cambios"
        d.mkdir(parents=True, exist_ok=True)
        a, b = args.diff_commit
        io.open(d / ("diff-%s..%s.patch" % (a[:7], b[:7])), "w", encoding="utf-8", newline="\n").write(
            run(["git", "diff", a, b]))
        io.open(d / "diff-estadisticas.txt", "w", encoding="utf-8", newline="\n").write(
            run(["git", "diff", "--stat", a, b]) + "\n" + run(["git", "show", "--stat", "--oneline", b]))
    # ── 05 continuidad ─────────────────────────────────────────────────────
    if args.estado_git:
        d = base / "05-continuidad"
        d.mkdir(parents=True, exist_ok=True)
        io.open(d / "ESTADO-GIT.txt", "w", encoding="utf-8", newline="\n").write(
            "=== git status --short ===\n" + run(["git", "status", "--short"]) +
            "\n=== git branch -v ===\n" + run(["git", "branch", "-v"]) +
            "\n=== git log --oneline -5 ===\n" + run(["git", "log", "--oneline", "-5"]) +
            "\n=== punto de restauracion ===\n63e45ea86597f318f4e1ff869ab315ce078ff4ef\n"
            "rama: backup/jmorgado-pre-optimizacion-escenas\n")
    if args.continuar:
        volcar("05-continuidad", recoge(args.continuar))
    # ── scripts ───────────────────────────────────────────────────────────
    if args.scripts:
        volcar("scripts", recoge(["docs/performance-audit/mediciones-fase1",
                                  "docs/performance-audit/mediciones-originales"]))

    # ── índice de contenidos ──────────────────────────────────────────────
    entradas = []
    for f in sorted(base.rglob("*")):
        if f.is_file() and f.name != "INDICE.txt":
            entradas.append("%-70s %10s" % (str(f.relative_to(base)).replace("\\", "/"), formato(tamano(f))))
    io.open(base / "INDICE.txt", "w", encoding="utf-8", newline="\n").write(
        "CONTENIDO DEL PAQUETE %s\n%s\n" % (raiz, "=" * 78) + "\n".join(entradas) + "\n")

    # ── zip ───────────────────────────────────────────────────────────────
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for f in sorted(base.rglob("*")):
            if f.is_file():
                z.write(f, str(Path(raiz) / f.relative_to(base)))

    shutil.rmtree(TMP, ignore_errors=True)

    print("ZIP generado: %s" % zip_path)
    print("  tamano: %s" % formato(tamano(zip_path)))
    with zipfile.ZipFile(zip_path) as z:
        n = len(z.namelist())
        malos = z.testzip()
    print("  entradas: %d · integridad: %s" % (n, "OK" if malos is None else "CORRUPTO: " + str(malos)))


if __name__ == "__main__":
    main()
