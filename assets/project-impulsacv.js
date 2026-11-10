/* JMorgado — Ficha de ImpulsaCV: perspectivas Archify, carga diferida y tema. */
(() => {
  "use strict";

  const page = document.querySelector(".project-impulsacv-page");
  if (!page) return;

  const tabs = [...page.querySelectorAll("[data-archify-view]")];
  if (!tabs.length) return;

  const sources = new Map(tabs.map((btn) => [btn.dataset.archifyView, btn.dataset.src]));
  const frames = new Map(tabs.map((btn) => [btn.dataset.archifyView, page.querySelector(`[data-archify-frame="${btn.dataset.archifyView}"]`)]));
  const loaded = new Set([tabs.find((b) => b.getAttribute("aria-selected") === "true")?.dataset.archifyView || "workflow"]);

  function toArchifyTheme(theme) {
    return theme === "night" ? "dark" : "light";
  }

  function activeFrame() {
    const view = tabs.find((t) => t.getAttribute("aria-selected") === "true")?.dataset.archifyView;
    return frames.get(view);
  }

  function syncFrameTheme(frame) {
    if (!frame || !frame.contentDocument) return;
    try {
      frame.contentDocument.documentElement.dataset.theme = toArchifyTheme(document.documentElement.dataset.jmTheme);
    } catch (e) {}
  }

  function syncTheme() {
    frames.forEach(syncFrameTheme);
  }

  function resizeFrame(frame) {
    if (!frame || !frame.contentDocument) return;
    try {
      const h = frame.contentDocument.documentElement.scrollHeight;
      if (h > 0) frame.style.height = h + "px";
    } catch (e) {}
  }

  function resizeAll() {
    frames.forEach(resizeFrame);
  }

  function onLoad(frame) {
    syncFrameTheme(frame);
    let tries = 0;
    const interval = setInterval(() => {
      if (hideExport(frame) || tries > 25) clearInterval(interval);
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
    // Atajos no expuestos de la experiencia pública: E (Exportar), F (presentación), S (estilo), T (tema interno)
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

  function hideExport(frame) {
    if (!frame.contentDocument) return false;
    try {
      const doc = frame.contentDocument;
      if (doc.querySelector("#jm-overrides")) return true;
      const style = doc.createElement("style");
      style.id = "jm-overrides";
      style.textContent = "#btn-export,#export-menu,#btn-present,#btn-preset,.preset-wrap,#preset-menu,#btn-theme{display:none!important;visibility:hidden!important}";
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

  frames.forEach((frame, view) => {
    if (!frame) return;
    frame.addEventListener("load", () => onLoad(frame));
  });

  const observer = new MutationObserver(syncTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-jm-theme"] });
  window.addEventListener("resize", resizeAll);

  function activate(btn, focus = false) {
    const view = btn.dataset.archifyView;
    const frame = frames.get(view);
    if (!frame) return;
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t === btn)));
    if (focus) btn.focus();
    if (!loaded.has(view) && sources.get(view)) {
      loaded.add(view);
      frame.setAttribute("src", sources.get(view)); // arquitectura: carga solo al primer uso
    }
    frames.forEach((f, v) => { f.hidden = v !== view; });
    resizeFrame(frame);
  }

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
})();
