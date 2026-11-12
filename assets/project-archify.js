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

  /* -- Recorridos: pulso secuencial sobre las conexiones -------------------
   *
   * Un diagrama incrustado se sirve en modo «embed», donde Archify desactiva
   * su propia animacion de traza. Esta capa restituye un recorrido legible
   * reusing el mismo lenguaje visual del diagrama: un pulso que viaja por la
   * conexion y el nodo que la recibe responde con un brillo breve.
   *
   * Las conexiones se recorren en el orden en que estan documentadas en el
   * diagrama, de modo que la secuencia explica la arquitectura real y no una
   * decoracion. Con el movimiento reducido no se instala nada.
   */
  const FLOW = { travel: 1500, gap: 1700, glow: 950 };
  const KIND_VAR = {
    frontend: "--frontend-stroke",
    backend: "--backend-stroke",
    database: "--database-stroke",
    cloud: "--cloud-stroke",
    security: "--security-stroke",
    messagebus: "--messagebus-stroke",
    external: "--external-stroke",
  };

  const FLOW_STYLE = `
    svg .jm-flow-line{stroke-width:2.4;stroke-linecap:round;opacity:0;
      animation:jm-flow-travel var(--jm-travel) linear var(--jm-delay) infinite}
    @keyframes jm-flow-travel{
      0%{stroke-dashoffset:0;opacity:0}
      16%{opacity:.92}
      76%{opacity:.92}
      100%{stroke-dashoffset:var(--jm-len);opacity:0}}
    svg .jm-flow-node > rect:not(.c-mask){
      animation:jm-flow-node var(--jm-glow) ease-out var(--jm-node-delay) infinite}
    @keyframes jm-flow-node{
      0%{filter:none}
      26%{filter:drop-shadow(0 0 7px var(--jm-node-accent))}
      100%{filter:none}}
    svg.jm-flow-paused .jm-flow-line,
    svg.jm-flow-paused .jm-flow-node > rect:not(.c-mask){animation-play-state:paused}
    .jm-passport-links{display:flex;flex-direction:column;gap:.2rem;margin-top:.45rem;
      padding-top:.45rem;border-top:1px solid color-mix(in srgb,var(--toolbar-border,#2b3a3d) 70%,transparent)}
    .jm-passport-links-label{font-size:.5rem;letter-spacing:.04em;text-transform:uppercase;
      color:var(--text-faint);font-weight:700}
    .jm-passport-links-list{font-size:.66rem;line-height:1.45;color:var(--text,#e9e6de)}
  `;

  function installFlow(doc) {
    if (!doc || !doc.querySelector) return null;
    const svg = doc.querySelector('svg[data-animation="trace"]');
    if (!svg) return null;
    const edges = Array.from(svg.querySelectorAll('path[data-edge-from][data-edge-to]'));
    if (edges.length < 2) return null;
    const win = doc.defaultView;
    if (win && win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

    if (!doc.getElementById("jm-flow-style")) {
      const style = doc.createElement("style");
      style.id = "jm-flow-style";
      style.textContent = FLOW_STYLE;
      doc.head.appendChild(style);
    }

    const ns = "http://www.w3.org/2000/svg";
    const layer = doc.createElementNS(ns, "g");
    layer.setAttribute("class", "jm-flow-layer");
    layer.setAttribute("aria-hidden", "true");
    layer.setAttribute("pointer-events", "none");

    // La capa vive junto a las conexiones para compartir su sistema de coordenadas.
    const host = edges[edges.length - 1].parentNode;
    const isSvg = host && host.tagName && host.tagName.toLowerCase() === "svg";
    if (isSvg) {
      // En los diagramas de flujo las conexiones son hijas directas del svg.
      const first = host.querySelector("[data-node-id]");
      if (first) host.insertBefore(layer, first);
      else host.appendChild(layer);
    } else if (host && host.parentNode) {
      host.parentNode.insertBefore(layer, host.nextSibling);
    } else {
      svg.appendChild(layer);
    }

    const arrival = new Map();
    edges.forEach((edge, index) => {
      let length = 0;
      try { length = edge.getTotalLength(); } catch (e) {}
      if (!length) return;
      const line = doc.createElementNS(ns, "path");
      line.setAttribute("d", edge.getAttribute("d") || "");
      line.setAttribute("class", "jm-flow-line " + (edge.getAttribute("class") || ""));
      line.setAttribute("fill", "none");
      line.setAttribute("vector-effect", "non-scaling-stroke");
      line.setAttribute("pointer-events", "none");
      line.style.strokeDasharray = "7 " + length;
      line.style.setProperty("--jm-len", (-length) + "px");
      line.style.setProperty("--jm-travel", FLOW.travel + "ms");
      line.style.setProperty("--jm-delay", index * FLOW.gap + "ms");
      layer.appendChild(line);

      const to = edge.getAttribute("data-edge-to");
      const at = index * FLOW.gap + FLOW.travel - 260;
      if (!arrival.has(to)) arrival.set(to, at);
    });

    svg.querySelectorAll("g[data-node-id]").forEach((node) => {
      const id = node.getAttribute("data-node-id");
      const kind = node.getAttribute("data-node-kind");
      node.classList.add("jm-flow-node");
      node.style.setProperty("--jm-node-delay", (arrival.has(id) ? arrival.get(id) : 0) + "ms");
      node.style.setProperty("--jm-glow", FLOW.glow + "ms");
      node.style.setProperty("--jm-node-accent", "var(" + (KIND_VAR[kind] || "--external-stroke") + ")");
    });

    const setPaused = (paused) => svg.classList.toggle("jm-flow-paused", !!paused);
    doc.addEventListener("visibilitychange", () => setPaused(doc.hidden));
    if (win) win.JMFlow = { setPaused, svg };
    return { setPaused, svg };
  }

  /* -- Panel del componente (diagramas incrustados) ------------------------
   *
   * En modo «embed» Archify no abre su pasaporte semantico, asi que el
   * proyecto expone el componente seleccionado con su funcion y sus
   * conexiones. El panel vive en la pagina, no dentro del iframe: hereda la
   * identidad editorial de JMorgado y el tema del sitio.
   */
  const PANEL_KIND = {
    frontend: "Interfaz de usuario",
    backend: "Logica de la plataforma",
    database: "Almacenamiento",
    cloud: "Servicio en la nube",
    security: "Seguridad",
    messagebus: "Mensajeria",
    external: "Servicio externo",
  };

  function buildPanel(scope) {
    const panel = document.createElement("aside");
    panel.className = "jm-node-panel";
    panel.hidden = true;
    panel.setAttribute("aria-live", "polite");
    panel.innerHTML =
      '<button type="button" class="jm-node-panel-close" aria-label="Cerrar informacion del componente">\u00d7</button>' +
      '<p class="jm-node-panel-kind"></p>' +
      '<h3 class="jm-node-panel-title"></h3>' +
      '<p class="jm-node-panel-purpose"></p>' +
      '<p class="jm-node-panel-links"><span class="jm-node-panel-links-label">Se conecta con</span> <span class="jm-node-panel-links-list"></span></p>';
    scope.appendChild(panel);
    panel.querySelector(".jm-node-panel-close").addEventListener("click", () => {
      panel.hidden = true;
    });
    return panel;
  }

  function installPanel(scope, frame) {
    let panel = scope.querySelector(".jm-node-panel");
    if (!panel) panel = buildPanel(scope);
    const doc = frame.contentDocument;
    if (!doc) return;
    const svg = doc.querySelector("svg[data-animation=\"trace\"]");
    if (!svg) return;

    const labelOf = (id) => {
      const node = svg.querySelector('g[data-node-id="' + id + '"]');
      return node ? node.getAttribute("data-node-label") || id : id;
    };

    const neighboursOf = (id) => {
      const list = [];
      svg.querySelectorAll("path[data-edge-from][data-edge-to]").forEach((edge) => {
        const from = edge.getAttribute("data-edge-from");
        const to = edge.getAttribute("data-edge-to");
        if (from === id && list.indexOf(to) < 0) list.push(to);
        if (to === id && list.indexOf(from) < 0) list.push(from);
      });
      return list;
    };

    // Con pasaporte del visor (ImpulsaCV) las conexiones se anaden a su propia
    // ficha; sin pasaporte (diagramas incrustados) se muestra el panel propio.
    const fillPassport = (node) => {
      const lens = doc.querySelector(".relationship-lens");
      // En los diagramas incrustados el visor oculta su ficha: entonces
      // manda el panel propio del proyecto.
      if (!lens) return false;
      const estilo = doc.defaultView ? doc.defaultView.getComputedStyle(lens) : null;
      if (estilo && (estilo.display === "none" || estilo.visibility === "hidden")) return false;
      const copy = doc.querySelector(".relationship-lens-copy");
      if (!copy) return false;
      const id = node.getAttribute("data-node-id");
      const list = neighboursOf(id);
      if (!list.length) return false;
      let block = copy.querySelector(".jm-passport-links");
      if (!block) {
        block = doc.createElement("div");
        block.className = "jm-passport-links";
        const meta = copy.querySelector(".semantic-passport-meta");
        if (meta && meta.nextSibling) meta.parentNode.insertBefore(block, meta.nextSibling);
        else copy.appendChild(block);
      }
      block.innerHTML = '<span class="jm-passport-links-label">Se conecta con</span>' +
        '<span class="jm-passport-links-list"></span>';
      block.querySelector(".jm-passport-links-list").textContent = list.map(labelOf).join(" \u00b7 ");
      return true;
    };

    const show = (node) => {
      const id = node.getAttribute("data-node-id");
      const kind = node.getAttribute("data-node-kind") || "";
      const purpose = node.getAttribute("data-jm-purpose") || node.getAttribute("data-node-sublabel") || "";
      const neighbours = neighboursOf(id);
      if (fillPassport(node)) { panel.hidden = true; return; }
      panel.querySelector(".jm-node-panel-kind").textContent = PANEL_KIND[kind] || "Componente";
      panel.querySelector(".jm-node-panel-title").textContent = node.getAttribute("data-node-label") || id;
      panel.querySelector(".jm-node-panel-purpose").textContent = purpose;
      panel.querySelector(".jm-node-panel-links-list").textContent = neighbours.map(labelOf).join(" \u00b7 ");
      panel.querySelector(".jm-node-panel-links").hidden = !neighbours.length;
      panel.hidden = false;
    };

    const clear = () => { panel.hidden = true; };
    svg.addEventListener("click", (event) => {
      const node = event.target.closest && event.target.closest("g[data-node-id]");
      if (node) {
        // El visor construye su ficha despues del clic: se espera un instante.
        window.setTimeout(() => show(node), 120);
      } else {
        clear();
      }
    });
    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape") clear();
    });
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
      // Recorrido animado y panel de componente: solo en los diagramas que
      // Archify muestra incrustados (donde su animacion propia va apagada).
      try {
        const doc = frame.contentDocument;
        if (!doc) return;
        // El recorrido animado solo hace falta donde Archify va en modo «embed».
        if (doc.documentElement.getAttribute("data-embed") === "true") installFlow(doc);
        installPanel(scope, frame);
      } catch (e) {}
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
