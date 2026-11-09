(() => {
  "use strict";

  const form = document.querySelector("[data-home-quick-calc]");
  const result = document.querySelector(".quick-calc-result");
  if (!form || !result) return;

  const before = form.querySelector("[data-time-before]");
  const after = form.querySelector("[data-time-after]");
  const frequency = form.querySelector("[data-frequency]");
  const label = result.querySelector("[data-quick-label]");
  const run = result.querySelector("[data-quick-run]");
  const week = result.querySelector("[data-quick-week]");
  const year = result.querySelector("[data-quick-year]");
  const weekLabel = result.querySelector("[data-quick-week-label]");
  const yearLabel = result.querySelector("[data-quick-year-label]");
  const status = result.querySelector("[data-quick-status]");
  if ([before, after, frequency, label, run, week, year, weekLabel, yearLabel, status].some(node => !node)) return;

  const number = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 });
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const fmt = value => number.format(Math.max(0, value));
  const units = [" min", " h", " h"];
  let desired = [0, 0, 0];
  let shown = [0, 0, 0];
  let animation = 0;
  let hasEntered = false;
  let valid = true;

  function paint(values) {
    shown = values.slice();
    [run, week, year].forEach((node, index) => {
      node.textContent = fmt(values[index]) + units[index];
    });
  }

  function stop() {
    if (animation) cancelAnimationFrame(animation);
    animation = 0;
  }

  function move(from, to, duration = 950) {
    stop();
    if (reduce || duration <= 0 || to.every((value, index) => Math.abs(value - from[index]) < .001)) {
      paint(to);
      return;
    }

    let start;
    const tick = time => {
      if (start === undefined) start = time;
      const t = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      paint(to.map((target, index) => from[index] + (target - from[index]) * eased));
      if (t < 1) animation = requestAnimationFrame(tick);
      else {
        animation = 0;
        paint(to);
      }
    };
    paint(from);
    animation = requestAnimationFrame(tick);
  }

  function update() {
    const values = [before.value, after.value, frequency.value].map(value =>
      value.trim() === "" ? NaN : Number(value));
    const [current, automated, repetitions] = values;
    valid = values.every(value => Number.isFinite(value) && value >= 0);

    if (!valid) {
      stop();
      label.textContent = "COMPLETA LOS DATOS";
      [run, week, year].forEach(node => node.textContent = "\u2014");
      weekLabel.textContent = "Por semana";
      yearLabel.textContent = "Por a\u00f1o";
      status.textContent = "Usa valores iguales o mayores que cero para comparar los dos escenarios.";
      return;
    }

    const difference = current - automated;
    desired = [Math.abs(difference), Math.abs(difference * repetitions / 60),
               Math.abs(difference * repetitions * 52 / 60)];
    if (difference > 0) {
      label.textContent = "TIEMPO RECUPERADO";
      weekLabel.textContent = "Por semana";
      yearLabel.textContent = "Por a\u00f1o";
      status.textContent = "Estimaci\u00f3n seg\u00fan la frecuencia indicada y el tiempo de revisi\u00f3n que permanece.";
    } else if (difference < 0) {
      label.textContent = "TIEMPO ADICIONAL";
      weekLabel.textContent = "Adicional por semana";
      yearLabel.textContent = "Adicional por a\u00f1o";
      status.textContent = "Con estos valores, la intervenci\u00f3n requiere m\u00e1s tiempo que el proceso actual.";
    } else {
      label.textContent = "SIN DIFERENCIA";
      weekLabel.textContent = "Por semana";
      yearLabel.textContent = "Por a\u00f1o";
      status.textContent = "Ambos escenarios requieren el mismo tiempo por ejecuci\u00f3n.";
    }

    if (hasEntered) move(shown, desired, 650);
    else paint(desired);
  }

  function enter() {
    if (hasEntered) return;
    hasEntered = true;
    if (valid) move([0, 0, 0], desired, 1100);
  }

  [before, after, frequency].forEach(input => input.addEventListener("input", update));
  update();

  // Animate measured savings when this chapter comes into view.
  // Never animate editable input values or run a counter in reduced-motion mode.
  if (reduce || !("IntersectionObserver" in window)) {
    hasEntered = true;
  } else {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        enter();
      }
    }, {threshold:.18, rootMargin:"0px 0px -5% 0px"});
    observer.observe(result);
  }
})();
