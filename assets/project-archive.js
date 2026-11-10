/* JMorgado — Archivo de proyectos.
   Sólo activo en /proyectos/. Sincroniza el índice con el panel contextual.
   Sin dependencias; respeta prefers-reduced-motion. */
(() => {
  "use strict";

  const page = document.querySelector("[data-archive]");
  if (!page) return;

  const rows = [...page.querySelectorAll(".archive-row")];
  const filters = [...page.querySelectorAll(".archive-filter")];
  const inspector = page.querySelector(".archive-inspector");
  const body = page.querySelector(".archive-inspector-body");
  const position = page.querySelector(".archive-position");
  const resultCount = page.querySelector(".archive-result");
  const label = page.querySelector("#archive-inspector-label");
  const name = page.querySelector("#archive-inspector-name");
  const problem = page.querySelector("#archive-problem");
  const solution = page.querySelector("#archive-solution");
  const role = page.querySelector("#archive-role");
  const link = page.querySelector("#archive-link");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pad = value => String(value).padStart(2, "0");

  function select(index, animate = true) {
    const row = rows[index];
    if (!row) return;

    rows.forEach(item => item.classList.toggle("is-selected", item === row));

    const data = row.dataset;
    label.textContent = data.label;
    name.textContent = data.name;
    problem.textContent = data.problem;
    solution.textContent = data.solution;
    role.textContent = data.role;
    link.href = row.href;
    position.textContent = `${pad(index + 1)} / ${pad(rows.length)}`;

    if (animate && !reduced.matches) {
      body.classList.remove("is-swapping");
      void body.offsetWidth;
      body.classList.add("is-swapping");
    }
  }

  rows.forEach((row, index) => {
    row.addEventListener("pointerenter", () => select(index));
    row.addEventListener("focus", () => select(index));
  });

  filters.forEach(button => {
    button.addEventListener("click", () => {
      filters.forEach(item => item.setAttribute("aria-pressed", String(item === button)));

      const category = button.dataset.filter;
      let firstVisible = -1;
      let visible = 0;

      rows.forEach((row, index) => {
        const families = (row.dataset.projectCategory || "").split(/\s+/);
        const show = category === "todos" || families.includes(category);
        row.hidden = !show;
        if (show) {
          visible += 1;
          if (firstVisible < 0) firstVisible = index;
        }
      });

      resultCount.textContent = visible === 1
        ? "1 proyecto disponible"
        : `${visible} proyectos disponibles`;

      if (firstVisible >= 0) select(firstVisible, false);
    });
  });

  if (rows.length) select(0, false);
})();
