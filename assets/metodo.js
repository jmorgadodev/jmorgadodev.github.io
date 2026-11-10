/* JMorgado — Método.
   Comparador vivo, recorrido de decisión con hover, evolución escalonada,
   matriz de recursos, aparición suave de bloques. Sin dependencias.
   Respeta prefers-reduced-motion. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  /* ============================================ aparición suave de bloques */
  const REVEAL = [".section-head", ".met-compare", ".met-flow2", ".met-evo2", ".met-matrix",
                  ".met-shield-head", ".met-shield-rail", ".met-examples", ".met-diag",
                  ".met-close .contact-board"];
  if (!reduce.matches) {
    const targets = document.querySelectorAll(REVEAL.join(","));
    targets.forEach(el => el.classList.add("met-reveal"));
    const revealer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(el => revealer.observe(el));
  }

  /* ============================================ 01 comparador vivo */
  const compare = document.querySelector("[data-met-compare]");
  if (compare) {
    const panes = [...compare.querySelectorAll(".met-pane")];
    const tabs = [...compare.parentElement.querySelectorAll(".met-compare-tab")];
    const order = ["a", "b"];
    let timer = null;

    const sync = key => {
      compare.dataset.active = key;
      panes.forEach(p => (p.dataset.active = String(p.dataset.pane === key)));
      tabs.forEach(t => t.setAttribute("aria-pressed", String(t.dataset.paneTab === key)));
    };
    const rearmar = ms => {
      clearTimeout(timer);
      if (reduce.matches) return;
      timer = setTimeout(alternate, ms);
    };
    const alternate = () => {
      const visible = () => {
        const r = compare.getBoundingClientRect();
        return r.top < innerHeight && r.bottom > 0;
      };
      if (visible()) sync(order.find(k => k !== compare.dataset.active));
      rearmar(4600);
    };

    panes.forEach(pane => {
      pane.addEventListener("mouseenter", () => { clearTimeout(timer); sync(pane.dataset.pane); });
      pane.addEventListener("focusin", () => { clearTimeout(timer); sync(pane.dataset.pane); });
      pane.addEventListener("mouseleave", () => rearmar(4600));
      pane.addEventListener("focusout", () => { if (!compare.contains(document.activeElement)) rearmar(4600); });
      pane.addEventListener("click", () => { sync(pane.dataset.pane); rearmar(6000); });
    });
    tabs.forEach(tab => tab.addEventListener("click", () => { sync(tab.dataset.paneTab); rearmar(6000); }));

    sync(compare.dataset.active === "a" ? "a" : "b");
    rearmar(4600);
  }

  /* ============================================ 02 recorrido de decisión */
  const flow = document.querySelector("[data-met-flow]");
  if (flow) {
    const STEPS = [...flow.querySelectorAll(".met-step")];
    const PATHS = [...flow.querySelectorAll(".met-path")];
    const PANEL = flow.querySelector(".met-flow2-panel");
    const KICKER = PANEL.querySelector("[data-kicker]");
    const KICKER_OF = PANEL.querySelector("[data-kicker-of]");
    const TITLE = PANEL.querySelector("[data-title]");
    const BODY = PANEL.querySelector("[data-body]");
    const PATHS_BOX = PANEL.querySelector("[data-paths]");

    const HEADINGS = {
      need: "Siempre escuchar primero.",
      analysis: "Entender el proceso real.",
      decision: "El camino se elige aquí.",
      implementation: "Una base sólida y ordenada.",
      validation: "Medir antes de dar por bueno.",
      evolution: "Una solución que crece.",
    };
    const order = ["need", "analysis", "decision", "implementation", "validation", "evolution"];
    const numOf = k => {
      const b = STEPS.find(s => s.dataset.step === k);
      return b ? b.querySelector(".met-step-num").textContent.trim() : "00";
    };

    const byKey = {};
    STEPS.forEach(s => { byKey[s.dataset.step] = { kicker: s.dataset.kicker, title: s.dataset.title, detail: s.dataset.detail }; });
    PATHS.forEach(p => { byKey[p.dataset.path] = { kicker: p.dataset.kicker, title: p.dataset.title, detail: p.dataset.detail }; });

    const pintar = key => {
      const data = byKey[key];
      if (!data) return;
      const isPath = key.startsWith("camino");
      const stepKey = isPath ? "decision" : key;

      KICKER.textContent = data.kicker;
      KICKER_OF.textContent = isPath ? "Decisión" : data.title;
      TITLE.textContent = isPath ? data.title : HEADINGS[stepKey];
      BODY.textContent = data.detail;
      PANEL.setAttribute("data-watermark", numOf(stepKey));
      PANEL.dataset.active = key;
      PATHS_BOX.hidden = stepKey !== "decision";

      STEPS.forEach(s => {
        const activo = s.dataset.step === stepKey;
        s.setAttribute("aria-current", String(activo));
        s.dataset.done = String(order.indexOf(s.dataset.step) < order.indexOf(stepKey));
      });
      PATHS.forEach(p => p.setAttribute("aria-current", String(p.dataset.path === key)));
    };

    const render = key => {
      if (reduce.matches) return pintar(key);
      PANEL.classList.add("is-swapping");
      setTimeout(() => { pintar(key); PANEL.classList.remove("is-swapping"); }, 150);
    };

    STEPS.forEach(s => {
      s.addEventListener("mouseenter", () => render(s.dataset.step));
      s.addEventListener("focus", () => render(s.dataset.step));
      s.addEventListener("click", () => render(s.dataset.step));
    });
    PATHS.forEach(p => {
      p.addEventListener("mouseenter", () => render(p.dataset.path));
      p.addEventListener("focus", () => render(p.dataset.path));
      p.addEventListener("click", () => render(p.dataset.path));
    });

    pintar("decision");
  }

  /* ============================================ 03 evolución escalonada */
  const evo = document.querySelector("[data-met-evolution]");
  if (evo) {
    const stages = [...evo.querySelectorAll(".met-stage")];
    const paneles = [...evo.querySelectorAll("[data-met-evo-panel]")];
    const progress = evo.querySelector(".met-stage-progress");
    const FILL = [0.18, 0.55, 1];
    let indice = 0, timer = null;

    const mueve = i => {
      indice = i;
      stages.forEach((s, n) => s.setAttribute("aria-expanded", String(n === i)));
      paneles.forEach((p, n) => (p.hidden = n !== i));
      if (progress) progress.style.setProperty("--fill", FILL[i]);
      evo.dataset.active = String(i);
    };
    const reprograma = ms => {
      clearTimeout(timer);
      if (reduce.matches) return;
      timer = setTimeout(() => {
        mueve((indice + 1) % stages.length);
        reprograma(4200);
      }, ms);
    };

    stages.forEach((stage, i) => {
      stage.addEventListener("mouseenter", () => { mueve(i); reprograma(4200); });
      stage.addEventListener("focus", () => mueve(i));
      stage.addEventListener("click", () => { mueve(i); reprograma(4200); });
    });

    evo.addEventListener("mouseleave", () => reprograma(4200));
    mueve(0);
    reprograma(4200);
  }

  /* ============================================ 04 matriz de recursos */
  const matrix = document.querySelector("[data-met-matrix]");
  if (matrix) {
    const rows = [...matrix.querySelectorAll(".met-matrix-row")];
    const panel = matrix.querySelector(".met-matrix-panel");
    const NAME = panel.querySelector("[data-name]");
    const DESC = panel.querySelector("[data-desc]");
    const TOOLS = panel.querySelector("[data-tools]");
    const FACTORS = panel.querySelector("[data-factors]");
    const NOTE = panel.querySelector("[data-note]");

    const fill = row => {
      NAME.textContent = row.dataset.name;
      DESC.textContent = row.dataset.desc;
      TOOLS.innerHTML = row.dataset.tools.split("|").map(t => `<span>${t}</span>`).join("");
      FACTORS.innerHTML = row.dataset.factors.split("|").map(f => `<li>${f}</li>`).join("");
      NOTE.textContent = row.dataset.note;
      rows.forEach(r => r.setAttribute("aria-selected", String(r === row)));
      matrix.dataset.active = row.dataset.kind;
    };
    const select = row => {
      if (reduce.matches) return fill(row);
      if (panel.classList.contains("is-swapping")) return;
      panel.classList.add("is-swapping");
      setTimeout(() => { fill(row); panel.classList.remove("is-swapping"); }, 150);
    };

    rows.forEach(row => {
      row.addEventListener("mouseenter", () => select(row));
      row.addEventListener("focus", () => select(row));
      row.addEventListener("click", () => select(row));
    });

    fill(rows.find(r => r.dataset.kind === "tecnica") || rows[0]);
  }
})();
