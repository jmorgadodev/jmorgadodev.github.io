/* El viaje: deterministic poses, native scrolling, no perpetual animation loop. */
(() => {
  "use strict";
  const journey = document.querySelector("[data-journey]");
  if (!journey) return;
  const chapters = [...journey.querySelectorAll("[data-chapter]")];
  const copies = chapters.map(chapter => chapter.querySelector(".chapter-copy"));
  const stage = journey.querySelector("[data-journey-stage]");
  const world = stage.querySelector(".stage-world");
  const header = document.querySelector(".home-header");
  const progressBar = header.querySelector(".journey-progress");
  const progressFill = header.querySelector("[data-journey-progress]");
  const counter = header.querySelector("[data-scene-count]");
  const stageName = stage.querySelector("[data-stage-name]");
  const stageStatus = stage.querySelector("[data-stage-status]");
  const panel = journey.querySelector("#journey-detail");
  const closeButton = panel.querySelector(".detail-close");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = matchMedia("(max-width: 900px)");
  const sources = [...world.querySelectorAll("[data-source]")];
  const clues = [...world.querySelectorAll("[data-clue]")];
  const branches = [...world.querySelectorAll("[data-branch]")];
  const techLevels = [...world.querySelectorAll("[data-tech-level]")];
  const words = [...world.querySelectorAll("[data-universe-word]")];
  const sourceWires = [...world.querySelectorAll("[data-source-wire]")];
  const branchWires = [...world.querySelectorAll("[data-branch-wire]")];
  const outputWire = world.querySelector("[data-output-wire]");
  const layer = name => world.querySelector(`[data-layer="${name}"]`);
  const engine = layer("engine"), report = layer("report"), techmap = layer("techmap");
  const resilience = layer("resilience"), universe = layer("universe");
  const engineBar = world.querySelector("[data-engine-bar]");
  const rule = world.querySelector("[data-rule-node]");
  const ruleState = world.querySelector("[data-rule-state]");
  const recoveryText = world.querySelector("[data-recovery-text]");
  const reportLabel = world.querySelector("[data-report-label]");
  const reportTitle = world.querySelector("[data-report-title]");
  const reportCaption = world.querySelector("[data-report-caption]");
  const reportState = world.querySelector("[data-report-state]");
  const detailSources = new Map([...journey.querySelectorAll(".journey-detail-source")].map(details => {
    const summary = details.querySelector("summary");
    summary.setAttribute("aria-controls", "journey-detail");
    summary.setAttribute("aria-expanded", "false");
    return [summary.dataset.detail, { summary, label: details.querySelector(".j-label").textContent,
      title: details.querySelector("h3").textContent, text: details.querySelector(".detail-content>p:last-child").textContent }];
  }));
  let anchors = [], width = 1, height = 1, activeScene = -1, compact = false;
  let frame = 0, needsMeasure = true, opener = null, openDetail = null, pendingFocus = null;
  let lastProgress = -1, previousCorrected = null, previousEvolving = null;
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = (value, start, end) => { const t = clamp((value - start) / (end - start)); return t * t * (3 - 2 * t); };
  const windowAt = (p, start, end) => ease(p, start, start + .22) * (1 - ease(p, end - .22, end));
  const pose = (element, x, y, scale = 1, rotation = 0, opacity = 1) => {
    element.style.transform = `translate3d(${(x * width).toFixed(2)}px,${(y * height).toFixed(2)}px,0) translate(-50%,-50%) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    element.style.opacity = opacity.toFixed(4);
    // Faded controls cannot accidentally intercept a tap or keyboard focus.
    if (element.matches("button")) {
      const unavailable = opacity < .12 || compact;
      element.inert = unavailable;
      element.setAttribute("aria-hidden", String(unavailable));
      element.style.pointerEvents = unavailable ? "none" : "auto";
    }
  };
  const wire = (path, from, to, amount, alpha = 1) => {
    const middle = (from[1] + to[1]) * 50;
    path.setAttribute("d", `M${from[0] * 100},${from[1] * 100} C${from[0] * 100},${middle} ${to[0] * 100},${middle} ${to[0] * 100},${to[1] * 100}`);
    path.style.strokeDashoffset = String(1 - amount);
    path.style.opacity = String(alpha * .65);
  };
  const requestRender = (measure = false) => {
    needsMeasure ||= measure;
    if (!frame) frame = requestAnimationFrame(render);
  };
  const positionAt = scroll => {
    let index = 0;
    while (index < 6 && scroll >= anchors[index + 1]) index++;
    return index + clamp((scroll - anchors[index]) / Math.max(1, anchors[index + 1] - anchors[index]));
  };
  const measure = () => {
    const headerHeight = header.offsetHeight;
    document.body.style.setProperty("--journey-header", `${headerHeight}px`);
    const mobile = mobileQuery.matches;
    const maxCopyHeight = Math.max(...copies.map((copy, i) => copy.offsetHeight -
      (compact && (i === 1 || i === 4) ? copy.querySelector(".chapter-details").offsetHeight : 0)));
    const nextCompact = reducedMotion.matches || innerHeight < 700 || maxCopyHeight >
      (mobile ? (innerHeight - headerHeight) * .45 - 35 : innerHeight - headerHeight - 120) ||
      (mobile && openDetail !== null);
    const oldProgress = anchors.length ? positionAt(scrollY) : null;
    const layoutChanged = nextCompact !== compact;
    compact = nextCompact;
    journey.classList.toggle("is-compact", compact);
    const y = scrollY;
    const offset = headerHeight + (compact ? stage.offsetHeight + 24 : 0);
    anchors = chapters.map(chapter => chapter.getBoundingClientRect().top + y - offset);
    const end = journey.querySelector(".journey-shell").getBoundingClientRect().bottom + y - innerHeight;
    anchors.push(Math.max(anchors[6] + innerHeight * .55, end));
    width = world.clientWidth; height = world.clientHeight;
    if (layoutChanged && oldProgress !== null && oldProgress < 7 && activeScene >= 0) {
      const i = Math.min(6, Math.floor(oldProgress));
      const newY = mix(anchors[i], anchors[i + 1], oldProgress - i);
      // Keep the reader in the same chapter when an inline detail changes the layout.
      window.scrollTo({ top: newY, behavior: "instant" });
    }
    if (openDetail !== null) placePanel();
    lastProgress = -1;
    needsMeasure = false;
  };
  const closePanel = (restore = true) => {
    if (openDetail === null) return;
    const focusedInside = panel.contains(document.activeElement);
    panel.hidden = true;
    journey.querySelectorAll('[data-detail][aria-expanded="true"]').forEach(control => control.setAttribute("aria-expanded", "false"));
    openDetail = null;
    if (restore && opener) pendingFocus = opener;
    else if (focusedInside) header.querySelector(".journey-skip").focus({ preventScroll: true });
    opener = null;
    requestRender(true);
  };
  const placePanel = () => {
    const target = mobileQuery.matches || compact ? copies[Math.max(0, activeScene)] : journey;
    if (panel.parentElement !== target) target.append(panel);
  };
  const openPanel = control => {
    const id = control.dataset.detail, content = detailSources.get(id);
    if (!content) return;
    if (id === openDetail) { closePanel(); return; }
    closePanel(false);
    opener = control; openDetail = id;
    panel.querySelector("[data-detail-label]").textContent = content.label;
    panel.querySelector("h3").textContent = content.title;
    panel.querySelector("[data-detail-text]").textContent = content.text;
    panel.hidden = false;
    journey.querySelectorAll(`[data-detail="${id}"]`).forEach(button => button.setAttribute("aria-expanded", "true"));
    if (content.summary.closest("[data-chapter]").dataset.chapter === "4") {
      branches.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.choice === id)));
    }
    placePanel();
    closeButton.focus({ preventScroll: true });
    requestRender(true);
  };
  function render() {
    frame = 0;
    if (needsMeasure) measure();
    const p = positionAt(scrollY);
    const scene = Math.min(6, Math.floor(p));
    const outside = scrollY > anchors[7] + innerHeight;
    const mobile = mobileQuery.matches;
    if (scene !== activeScene) {
      closePanel(false);
      activeScene = scene;
      counter.textContent = String(scene + 1).padStart(2, "0");
      stageName.textContent = chapters[scene].dataset.sceneName;
      stage.querySelector("[data-stage-note]").textContent = scene < 6 ? "EJEMPLO FICTICIO" : "JMORGADO";
      stageStatus.textContent = chapters[scene].dataset.status;
      journey.dataset.scene = String(scene + 1);
      chapters.forEach((chapter, i) => chapter.classList.toggle("is-active", i === scene));
    }
    const percent = Math.round(clamp(p / 7) * 100);
    progressFill.style.transform = `scaleX(${clamp(p / 7)})`;
    progressBar.setAttribute("aria-valuenow", String(percent));
    progressBar.setAttribute("aria-valuetext", `${percent} %, escena ${scene + 1} de 7`);
    header.classList.toggle("is-exploring", scrollY >= anchors[7]);
    copies.forEach((copy, i) => {
      const local = p - i;
      const alpha = compact || reducedMotion.matches ? 1 :
        (i === 0 ? 1 : ease(local, -.05, .1)) * (1 - ease(local, .77, 1));
      copy.style.opacity = alpha.toFixed(4);
      copy.querySelectorAll("summary,a").forEach(control => {
        control.tabIndex = compact || (i === scene && alpha > .1) ? 0 : -1;
        control.style.pointerEvents = compact || (i === scene && alpha > .1) ? "auto" : "none";
      });
    });
    // Offscreen scroll still updates navigation, but does not repaint the graphic world.
    if (outside || p === lastProgress) return;
    lastProgress = p;
    const t = reducedMotion.matches ? [0, 1.35, 2.94, 3.75, 4.85, 5.92, 6.9][scene] : p;
    const align = ease(t, .55, 1.25), converge = ease(t, 1.78, 2.58);
    const sourceOpacity = 1 - ease(t, 2.23, 2.58);
    const scattered = mobile ? [[.22,.2,-8],[.75,.39,7],[.35,.76,-5]] : [[.30,.20,-9],[.72,.46,8],[.31,.77,-5]];
    sources.forEach((source, i) => {
      const start = scattered[i];
      const drift = ease(t, 0, .55);
      let x = mix(start[0] + (i === 1 ? .012 : -.012) * drift, .24, align);
      let y = mix(start[1] + .008 * drift, .16 + i * .33, align);
      x = mix(x, mobile ? .2 + i * .3 : .40, converge);
      y = mix(y, mobile ? .13 : .28 + i * .2, converge);
      const sourceScale = mix(mix(1, .86, align), mobile ? .64 : .55, converge);
      pose(source, x, y, sourceScale, mix(start[2], 0, align), sourceOpacity);
      const clueAlpha = windowAt(t, .8 + i * .07, 2.05);
      pose(clues[i], mobile ? .72 : .74, .16 + i * .33, 1, 0, clueAlpha);
      const clueEnd = mobile ? .495 : .56;
      const processEnd = mobile ? [.5, .42] : [.6, .49];
      wire(sourceWires[i], [x + .16 * sourceScale, y],
        [mix(clueEnd, processEnd[0], converge), mix(.16 + i * .33, processEnd[1], converge)],
        ease(t, .88 + i * .07, 1.3 + i * .07), windowAt(t, .82, 2.95));
    });
    const engineAlpha = windowAt(t, 1.86, 2.86);
    pose(engine, mobile ? .5 : .60, mobile ? .44 : .49, mix(.88, 1, ease(t, 1.86, 2.25)), 0, engineAlpha);
    engineBar.style.transform = `scaleX(${ease(t, 2.06, 2.65)})`;
    wire(outputWire, mobile ? [.5,.52] : [.6,.55], mobile ? [.5,.78] : [.68,.77], ease(t, 2.32, 2.7), windowAt(t, 2.15, 3.12));
    const reveal = ease(t, 2.95, 3.35), evolve = ease(t, 3.75, 4.2);
    const reportX = mix(mix(mobile ? .5 : .64, mobile ? .7 : .79, reveal), .5, evolve);
    const reportY = mix(mix(mobile ? .77 : .66, compact ? .24 : mobile ? .14 : .08, reveal), mobile ? .20 : .22, evolve);
    const reportScale = mix(mix(.95, .48, reveal), mobile ? .72 : .82, evolve);
    pose(report, reportX, reportY, reportScale, mix(-3,0,ease(t,2.68,2.94)), windowAt(t, 2.68, 5.19));
    const evolving = t >= 3.9;
    if (evolving !== previousEvolving) {
      reportLabel.textContent = evolving ? "INFORME AUTOMATIZADO" : "INFORME CONSOLIDADO";
      reportTitle.textContent = evolving ? "Informe automatizado" : "Una sola vista.";
      reportCaption.textContent = evolving ? "La base que ya funciona" : "Datos organizados y listos para revisar";
      reportState.textContent = evolving ? "ACTIVO" : "LISTO PARA REVISAR";
      previousEvolving = evolving;
    }
    pose(techmap, .5, .57, 1, 0, windowAt(t, 3.06, 4.27));
    techmap.style.setProperty("--tech-progress", ease(t, 3.15, 3.65));
    techLevels.forEach((element, i) => {
      const a = ease(t, 3.08 + i * .12, 3.4 + i * .12);
      element.style.opacity = String(a);
      element.style.transform = `translateY(${(1-a)*18}px)`;
    });
    const branchPositions = mobile && !compact ? [[.23,.58],[.77,.58],[.5,.87]] : [[.18,.73],[.5,.73],[.82,.73]];
    branches.forEach((branch, i) => {
      const pos = branchPositions[i], a = windowAt(t, 4.03 + i * .14, 5.29);
      pose(branch, pos[0], pos[1] + .06 * (1 - ease(t,4.03+i*.14,4.44+i*.14)), 1, 0, a);
      wire(branchWires[i], [.5, mobile ? .28 : .39], [pos[0],pos[1]-.13], ease(t,4.04+i*.14,4.38+i*.14), windowAt(t,4,5.27));
    });
    pose(resilience, .5, .5, 1, 0, windowAt(t,5.04,6.28));
    const corrected = t >= 5.66;
    if (corrected !== previousCorrected) {
      rule.classList.toggle("is-corrected", corrected);
      ruleState.textContent = corrected ? "✓ Regla corregida" : "! Cambio detectado";
      recoveryText.textContent = corrected ? "La validación se recupera. No se reconstruye el sistema." : "Se identifica la parte afectada. El resto permanece.";
      previousCorrected = corrected;
    }
    pose(universe, .5, .5, mix(.8,1,ease(t,6.03,6.6)), 0, ease(t,6.03,6.35));
    words.forEach((word, i) => {
      const a = ease(t, 6.18 + i * .07, 6.45 + i * .07);
      word.style.opacity = String(a);
      word.style.transform = `translateY(${(1-a)*12}px)`;
    });
    if (pendingFocus) {
      const target = !pendingFocus.inert && pendingFocus.tabIndex >= 0 && pendingFocus.getClientRects().length ? pendingFocus : header.querySelector(".journey-skip");
      target.focus({ preventScroll: true });
      pendingFocus = null;
    }
  }
  journey.addEventListener("click", event => {
    const control = event.target.closest("[data-detail]");
    if (!control || control.inert) return;
    event.preventDefault();
    openPanel(control);
  });
  closeButton.addEventListener("click", () => closePanel());
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (openDetail !== null) { closePanel(); return; }
    const nav = header.querySelector("[data-nav]");
    if (nav.dataset.open === "true") {
      header.querySelector("[data-menu-toggle]").click();
      header.querySelector("[data-menu-toggle]").focus();
    }
  });
  document.querySelectorAll('a[href="#explorar"]').forEach(link => link.addEventListener("click", () => {
    closePanel(false);
    document.querySelector("#explorar").focus({ preventScroll: true });
  }));
  addEventListener("scroll", () => requestRender(), { passive: true });
  addEventListener("resize", () => { lastProgress = -1; requestRender(true); }, { passive: true });
  addEventListener("pageshow", () => { lastProgress = -1; requestRender(true); });
  reducedMotion.addEventListener("change", () => { lastProgress = -1; requestRender(true); });
  const resizeObserver = new ResizeObserver(() => { lastProgress = -1; requestRender(true); });
  copies.forEach(copy => resizeObserver.observe(copy));
  journey.classList.add("is-ready");
  document.body.classList.add("journey-enhanced");
  requestRender(true);
})();
