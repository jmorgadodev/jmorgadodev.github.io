/* JMorgado — Integración genérica de diagramas Archify para las fichas (fx-*).
 *
 * Reúne el comportamiento que antes vivía en assets/project-impulsacv.js, de modo
 * que cualquier ficha pueda incrustar un diagrama sin reprogramar nada:
 *
 *   · carga diferida (por pestaña o al entrar en pantalla),
 *   · sincronía del tema del sitio con el tema interno del diagrama,
 *   · altura automática del iframe según el contenido,
 *   · ocultación de los controles internos de Archify,
 *   · bloqueo de los atajos que no existen en la experiencia pública,
 *   · navegación por teclado entre pestañas.
 *
 * Marcado esperado (ambos opcionales, pero el primero es el contenedor):
 *
 *   <section data-archify-scope>
 *     <button data-archify-view="workflow" data-src="...">…</button>   ← pestañas
 *     <iframe data-archify-frame="workflow" src="..."></iframe>        ← diagramas
 *     <iframe data-archify-frame="arquitectura" data-src="..."></iframe>
 *   </section>
 *
 * Sin pestañas, un único <iframe data-archify-frame> con data-src se carga
 * cuando el bloque entra en pantalla (o de inmediato si no hay IntersectionObserver).
 */
(() => {
  "use strict";

  const CONTROLS = [
    "#btn-export", "#export-menu", "#btn-present", "#btn-preset",
    ".preset-wrap", "#preset-menu", "#btn-theme", "#node-outline", ".node-finder",
  ].join(",");

  const OVERRIDES = `${CONTROLS}{display:none!important;visibility:hidden!important}`;

  function toArchifyTheme(theme) {
    return theme === "night" ? "dark" : "light";
  }

  function createScope(scope) {
    const tabs = [...scope.querySelectorAll("[data-archify-view]")];
    const frames = [...scope.querySelectorAll("[data-archify-frame]")];
    if (!frames.length) return null;

    const frameByView = new Map();
    frames.forEach((frame) => {
      const view = frame.dataset.archifyFrame || frame.dataset.archifyView || "diagram";
      frameByView.set(view, frame);
    });

    const sourceByView = new Map();
    tabs.forEach((btn) => sourceByView.set(btn.dataset.archifyView, btn.dataset.src));
    frames.forEach((frame) => {
      const view = frame.dataset.archifyFrame || frame.dataset.archifyView || "diagram";
      if (frame.dataset.src && !sourceByView.has(view)) sourceByView.set(view, frame.dataset.src);
    });

    const loaded = new Set();
    const active = tabs.find((b) => b.getAttribute("aria-selected") === "true");
    if (active) {
      loaded.add(active.dataset.archifyView);
      const frame = frameByView.get(active.dataset.archifyView);
      if (frame && frame.dataset.src && !frame.getAttribute("src")) {
        frame.setAttribute("src", frame.dataset.src);
      }
    }

    function syncFrameTheme(frame) {
      if (!frame || !frame.contentDocument) return;
      try {
        frame.contentDocument.documentElement.dataset.theme = toArchifyTheme(document.documentElement.dataset.jmTheme);
      } catch (e) {}
    }

    function resizeFrame(frame) {
      if (!frame || !frame.contentDocument) return;
      try {
        const doc = frame.contentDocument;
        // Se mide el contenido real (body) y no la ventana del iframe: en incrustado
        // el documento puede medir mas que el diagrama y dejaria un hueco vacio.
        const content = doc.body ? doc.body.scrollHeight : 0;
        const h = content > 0 ? content : doc.documentElement.scrollHeight;
        if (h > 0) frame.style.height = h + "px";
      } catch (e) {}
    }

    function resizeAll() {
      frameByView.forEach((frame) => resizeFrame(frame));
    }

    function syncAll() {
      frameByView.forEach((frame) => syncFrameTheme(frame));
    }

    function hideInternalControls(frame) {
      if (!frame || !frame.contentDocument) return false;
      try {
        const doc = frame.contentDocument;
        if (doc.querySelector("#jm-overrides")) return true;
        const style = doc.createElement("style");
        style.id = "jm-overrides";
        style.textContent = OVERRIDES;
        doc.head.appendChild(style);
        const disable = () => {
          const A = doc.defaultView && doc.defaultView.Archify;
          if (!A) return;
          if (A.exportMenu) {
            A.exportMenu.open = function () { return false; };
            A.exportMenu.toggle = function () { return false; };
            A.exportMenu.isOpen = function () { return false; };
          }
          if (A.presentation) {
            A.presentation.toggle = function () { return false; };
            A.presentation.enter = function () { return false; };
          }
          if (A.preset) {
            A.preset.cycle = function () { return false; };
            A.preset.open = function () { return false; };
            A.preset.toggle = function () { return false; };
          }
        };
        disable();
        setTimeout(disable, 500);
        setTimeout(disable, 1500);
        return true;
      } catch (e) {
        return false;
      }
    }

    function onLoad(frame) {
      syncFrameTheme(frame);
      let tries = 0;
      const interval = setInterval(() => {
        if (hideInternalControls(frame) || tries > 25) clearInterval(interval);
        tries++;
      }, 200);
      resizeFrame(frame);
      setTimeout(() => resizeFrame(frame), 300);
      setTimeout(() => resizeFrame(frame), 1200);
      setTimeout(() => syncFrameTheme(frame), 800);
      try {
        const ro = new ResizeObserver(() => resizeFrame(frame));
        ro.observe(frame.contentDocument.documentElement);
        ro.observe(frame.contentDocument.body);
      } catch (e) {}
      // Atajos no expuestos en la experiencia pública: E (Exportar), F (presentación), S (estilo), T (tema interno)
      try {
        frame.contentDocument.addEventListener("keydown", (e) => {
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          if (e.key === "e" || e.key === "E" || e.key === "f" || e.key === "F" || e.key === "s" || e.key === "S" || e.key === "t" || e.key === "T") {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        }, true);
      } catch (e) {}
    }

    function loadFrame(frame, view) {
      const src = sourceByView.get(view) || (frame && frame.dataset.src);
      if (!frame || !src || loaded.has(view)) return;
      loaded.add(view);
      frame.setAttribute("src", src); // el segundo diagrama se monta sólo al primer uso
    }

    function activate(btn, focus = false) {
      const view = btn.dataset.archifyView;
      const frame = frameByView.get(view);
      if (!frame) return;
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === btn)));
      if (focus) btn.focus();
      loadFrame(frame, view);
      frameByView.forEach((f, v) => { f.hidden = v !== view; });
      resizeFrame(frame);
    }

    frames.forEach((frame) => frame.addEventListener("load", () => onLoad(frame)));

    if (tabs.length) {
      tabs.forEach((btn) => {
        btn.addEventListener("click", () => activate(btn));
        btn.addEventListener("keydown", (e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          const idx = tabs.indexOf(btn);
          const next = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
          activate(tabs[next], true);
        });
      });
    } else {
      // Diagrama único: carga diferida al entrar en pantalla.
      // Si el bloque ya está a la vista al cargar, se pide de inmediato.
      frames.forEach((frame) => {
        const view = frame.dataset.archifyFrame || "diagram";
        if (frame.getAttribute("src") || !frame.dataset.src) return;

        let done = false;
        const near = () => {
          const rect = scope.getBoundingClientRect();
          const margin = 300;
          return rect.top - margin < window.innerHeight && rect.bottom + margin > 0;
        };
        const onScroll = () => { if (near()) load(); };
        const load = () => {
          if (done) return;
          done = true;
          loadFrame(frame, view);
          window.removeEventListener("scroll", onScroll);
        };

        if (near()) { load(); return; }

        if (typeof IntersectionObserver === "function") {
          const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              io.disconnect();
              load();
            });
          }, { rootMargin: "300px 0px" });
          io.observe(scope);
        }
        // Respaldo para navegadores que no delivers actualizaciones de render:
        // se comprueba la posición en cada desplazamiento.
        window.addEventListener("scroll", onScroll, { passive: true });
      });
    }

    const observer = new MutationObserver(syncAll);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-jm-theme"] });
    window.addEventListener("resize", resizeAll);

    return { scope, tabs, frameByView, syncAll, resizeAll };
  }

  const instances = [];

  function init(root) {
    const scopes = (root || document).querySelectorAll("[data-archify-scope]");
    scopes.forEach((scope) => {
      const instance = createScope(scope);
      if (instance) instances.push(instance);
    });
    return instances;
  }

  function syncAll() {
    instances.forEach((instance) => instance.syncAll());
  }

  window.JMArchify = { init, syncAll, instances };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init(document));
  } else {
    init(document);
  }
})();
