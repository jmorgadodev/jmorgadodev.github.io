/* JMorgado · Cover Flow circular de proyectos.
   Arrastre con ratón y dedo, rueda horizontal, teclado y selección directa.
   El avance automático se detiene durante cualquier interacción y nunca se
   activa con movimiento reducido. Sin flechas, contadores ni instrucciones. */
(() => {
  "use strict";
  const root = document.querySelector("[data-project-carousel]");
  if (!root) return;
  const stage = root.querySelector("[data-project-track]");
  const cards = Array.from(root.querySelectorAll("[data-project-card]"));
  const status = root.querySelector("[data-flow-status]");
  if (!stage || cards.length < 2) return;

  const motionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false, addEventListener: null };
  const total = cards.length;
  const half = Math.floor(total / 2);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = value => ((value % total) + total) % total;

  let position = 0;            // índice fraccionario mientras se arrastra
  let active = 0;              // proyecto centrado (entero)
  let drag = null;             // gesto en curso
  let press = null;            // tarjeta pulsada antes del clic
  let blockClickUntil = 0;     // evita abrir tras un arrastre
  let pauseUntil = 0;          // silencio posterior a una interacción
  let wheelLockedUntil = 0;
  let hovering = false;
  let focusInside = false;
  let visible = false;
  let resizeFrame = 0;

  // Distancias de referencia: el central manda y los laterales entran en profundidad.
  function layout() {
    const width = stage.clientWidth || 1;
    const cardWidth = cards[0].offsetWidth || 260;
    return {
      width,
      cardWidth,
      narrow: width < 660,
      x1: Math.min(cardWidth * 0.86, width * 0.38),
      x2: Math.min(cardWidth * 1.45, width * 0.52)
    };
  }

  function relative(index, at) {
    return wrap(index - at + half) - half;
  }

  const opacityWide = [1, 0.8, 0.32, 0.07, 0];
  const opacityNarrow = [1, 0.6, 0.16, 0, 0];

  function render(at = position, announce = false) {
    const { x1, x2, narrow } = layout();
    const opacityStops = narrow ? opacityNarrow : opacityWide;
    const selected = wrap(Math.round(at));
    active = selected;

    cards.forEach((card, index) => {
      const distance = Math.abs(relative(index, at));
      const sign = Math.sign(relative(index, at));
      let x = 0;
      if (distance > 0) {
        x = distance <= 1
          ? x1 * distance
          : x1 + (x2 - x1) * Math.min(distance - 1, 1) + Math.max(0, distance - 2) * x1 * 0.16;
        x *= sign;
      }
      const depth = -(170 * Math.min(distance, 1)
        + 250 * clamp(distance - 1, 0, 1)
        + 160 * clamp(distance - 2, 0, 1));
      const rotate = distance === 0 ? 0 : -sign * Math.min(64, 56 * distance);
      const scale = 1 - Math.min(distance, 2) * 0.02;
      const step = Math.min(Math.floor(distance), 3);
      const opacity = distance >= 4
        ? 0
        : opacityStops[step] + (opacityStops[step + 1] - opacityStops[step]) * (distance - step);
      const shown = distance < 2.6;

      card.style.setProperty("--pf-x", Math.round(x) + "px");
      card.style.setProperty("--pf-y", Math.round(distance * 5) + "px");
      card.style.setProperty("--pf-z", Math.round(depth) + "px");
      card.style.setProperty("--pf-rot", rotate.toFixed(2) + "deg");
      card.style.setProperty("--pf-scale", scale.toFixed(3));
      card.style.setProperty("--pf-opacity", opacity.toFixed(3));
      card.style.setProperty("--pf-order", String(40 - Math.round(distance * 10)));
      card.style.setProperty("--pf-events", distance <= 2 ? "auto" : "none");
      card.dataset.selected = String(distance < 0.5);
      card.tabIndex = distance < 0.5 ? 0 : -1;
      if (index === selected) {
        card.setAttribute("aria-label", "Abrir la ficha de " + card.dataset.projectName);
      } else {
        card.setAttribute("aria-label", "Seleccionar " + card.dataset.projectName);
      }
      card.toggleAttribute("inert", !shown);
    });

    if (status && announce) {
      status.textContent = "Proyecto " + (selected + 1) + " de " + total + ": " + cards[selected].dataset.projectName + ".";
    }
  }

  function focusCard(index) {
    const card = cards[index];
    if (!card || typeof card.focus !== "function") return;
    card.focus({ preventScroll: true });
  }

  function select(index, { focus = false, announce = true } = {}) {
    const target = wrap(index);
    let delta = target - active;
    if (delta > total / 2) delta -= total;
    if (delta < -total / 2) delta += total;
    if (delta === 0) {
      if (focus) focusCard(target);
      return;
    }
    position = active + delta;
    render(position, announce);
    position = active;
    if (focus) focusCard(target);
  }

  function move(steps, options = {}) {
    if (options.user) pauseUntil = Date.now() + 9000;
    select(active + steps, { focus: options.focus, announce: true });
  }

  // Tras un arrastre la posición puede quedar entre dos piezas: siempre se reasienta.
  function snapTo(index, announce = true) {
    active = wrap(index);
    position = active;
    render(position, announce);
  }

  /* ---------- Selección y apertura ---------- */
  stage.addEventListener("click", event => {
    const card = event.target.closest("[data-project-card]");
    if (!card) return;
    if (Date.now() < blockClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const index = cards.indexOf(card);
    const wasSelected = index === active;
    pauseUntil = Date.now() + 9000;
    if (press && press.index === index && !press.wasSelected) {
      // Un lateral primero se centra; el central abre su ficha.
      event.preventDefault();
      select(index, { announce: true });
      press = null;
      return;
    }
    if (!wasSelected) {
      event.preventDefault();
      select(index, { announce: true });
      return;
    }
  }, true);

  /* ---------- Teclado ---------- */
  stage.addEventListener("keydown", event => {
    const key = event.key;
    if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") return;
    if (event.target.closest("input,textarea,select,button")) return;
    event.preventDefault();
    pauseUntil = Date.now() + 9000;
    if (key === "Home") select(0, { focus: true });
    else if (key === "End") select(total - 1, { focus: true });
    else move(key === "ArrowRight" ? 1 : -1, { focus: true, user: true });
  });

  stage.addEventListener("focusin", event => {
    focusInside = true;
    const card = event.target.closest("[data-project-card]");
    if (!card || drag) return;
    const index = cards.indexOf(card);
    if (index >= 0 && index !== active) select(index, { announce: false });
  });
  stage.addEventListener("focusout", event => {
    if (!stage.contains(event.relatedTarget)) focusInside = false;
  });

  /* ---------- Ratón y gesto táctil ---------- */
  stage.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const card = event.target.closest("[data-project-card]");
    const index = card ? cards.indexOf(card) : -1;
    press = index >= 0 ? { index, wasSelected: index === active } : null;
    drag = {
      id: event.pointerId,
      x0: event.clientX,
      y0: event.clientY,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      startPosition: position,
      started: false,
      vertical: false
    };
  });

  stage.addEventListener("pointermove", event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x0;
    const dy = event.clientY - drag.y0;

    if (!drag.started && !drag.vertical) {
      if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx) * 1.15) {
        drag.vertical = true;
        return;
      }
      if (Math.abs(dx) > 9 && Math.abs(dx) > Math.abs(dy) * 1.1) {
        drag.started = true;
        pauseUntil = Date.now() + 9000;
        stage.classList.add("is-dragging");
        if (stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
      }
    }
    if (!drag.started) return;
    if (event.cancelable) event.preventDefault();

    const now = performance.now();
    const elapsed = Math.max(1, now - drag.lastTime);
    drag.velocity = (event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = now;

    const stride = clamp(stage.clientWidth * 0.2, 128, 300);
    position = drag.startPosition - dx / stride;
    render(position);
  }, { passive: false });

  function endGesture(event) {
    if (!drag || drag.id !== event.pointerId) return;
    const gesture = drag;
    drag = null;
    stage.classList.remove("is-dragging");
    if (stage.hasPointerCapture && stage.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId);
    }
    if (!gesture.started) return;

    blockClickUntil = Date.now() + 450;
    const stride = clamp(stage.clientWidth * 0.2, 128, 300);
    const projected = clamp(
      position - (gesture.velocity * 280) / stride,
      position - 2.6,
      position + 2.6
    );
    snapTo(Math.round(projected));
  }

  stage.addEventListener("pointerup", endGesture);
  stage.addEventListener("pointercancel", endGesture);
  stage.addEventListener("dragstart", event => event.preventDefault());

  /* ---------- Seleccion con el puntero ----------
     Al detenerse sobre una tarjeta lateral, esta pasa al centro. Hay una
     demora breve para que el puntero pueda cruzar entre tarjetas sin que la
     escena cambie sola, y la seleccion se mantiene hasta otra interaccion.
     Nunca se navega: el clic sigue abriendo la ficha del proyecto. */
  let hoverTimer = 0;
  const finePointer = window.matchMedia
    ? window.matchMedia("(hover: hover) and (pointer: fine)")
    : { matches: false };
  cards.forEach((card, index) => {
    card.addEventListener("pointerenter", event => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      if (drag || press) return;
      clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => {
        if (index === active || drag) return;
        select(index, { announce: true });
      }, 240);
    });
    card.addEventListener("pointerleave", () => clearTimeout(hoverTimer));
  });

  /* ---------- Rueda o trackpad horizontal ---------- */
  stage.addEventListener("wheel", event => {
    if (event.ctrlKey) return;
    const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.9;
    if (!horizontal) return; // el scroll vertical de la página se conserva
    if (event.cancelable) event.preventDefault();
    if (Date.now() < wheelLockedUntil) return;
    wheelLockedUntil = Date.now() + 520;
    const amount = event.deltaX;
    if (Math.abs(amount) >= 1) move(amount > 0 ? 1 : -1, { user: true });
  }, { passive: false });

  /* ---------- Pausa e inactividad ---------- */
  stage.addEventListener("pointerenter", () => { hovering = true; });
  stage.addEventListener("pointerleave", () => { hovering = false; });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
    }, { threshold: 0.35 });
    observer.observe(stage);
  } else {
    visible = true;
  }

  const autoplay = window.setInterval(() => {
    if (motionQuery.matches || document.hidden || !visible || hovering || focusInside || drag) return;
    if (Date.now() < pauseUntil) return;
    // El avance automático no debe hablar por el lector de pantalla.
    select(active + 1, { announce: false });
  }, 6500);
  window.addEventListener("pagehide", () => window.clearInterval(autoplay), { once: true });

  /* ---------- Cambios de tamaño y preferencias ---------- */
  const relayout = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      render(position, false);
    });
  };
  window.addEventListener("resize", relayout, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(stage);
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", () => render(position, false));
  }

  stage.classList.add("is-enhanced");
  render(0, false);
})();
