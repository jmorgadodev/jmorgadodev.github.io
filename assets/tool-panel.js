/* Panel de detalle de Herramientas.
   La ficha se despliega desde la derecha, hasta un maximo de la mitad de la pantalla,
   y se abre desde cualquier punto de la tarjeta de la herramienta.
   El details de cada tarjeta se conserva como alternativa sin JavaScript. */
(() => {
  const panel = document.querySelector(".tool-panel");
  if (!panel?.showModal) return;
  const title = panel.querySelector("#tool-panel-title");
  const kicker = panel.querySelector("[data-tool-kicker]");
  const glyph = panel.querySelector("[data-tool-glyph]");
  const slot = panel.querySelector("[data-tool-content]");
  let opened = null;
  let listScroll = 0;

  const workbench = document.querySelector("[data-tool-workbench]");
  if (workbench) {
    const choices = [...workbench.querySelectorAll("button[aria-controls]")];
    const tools = [...workbench.querySelectorAll(".tool-card")];
    function select(choice) {
      const active = choice.getAttribute("aria-controls");
      for (const button of choices) button.setAttribute("aria-pressed", String(button === choice));
      for (const tool of tools) tool.hidden = tool.id !== active;
    }
    for (const choice of choices) choice.addEventListener("click", () => select(choice));
    const direct = choices.find(choice => "#" + choice.getAttribute("aria-controls") === location.hash);
    select(direct || choices[0]);
    workbench.querySelector(".tool-choices").hidden = false;
  }

  function openPanel(card, details, trigger, opener) {
    if (panel.open) return;
    listScroll = window.scrollY;
    opened = {details, trigger, body: details.querySelector(".tool-detail-body"), opener};
    title.textContent = card.querySelector(".tool-name").textContent;
    const template = panel.querySelector(`[data-tool-template="${card.id}"]`);
    if (template) {
      panel.dataset.tone = template.dataset.tone || "";
      const source = template.content.querySelector(".tool-panel-glyph");
      const sourceKicker = template.content.querySelector(".tool-panel-kicker");
      if (source && glyph) glyph.innerHTML = source.innerHTML;
      if (sourceKicker && kicker) kicker.textContent = sourceKicker.textContent;
    }
    slot.append(opened.body);
    panel.showModal();
    slot.scrollTop = 0;
  }

  for (const details of document.querySelectorAll(".tool-details")) {
    const trigger = details.querySelector("summary");
    const card = details.closest(".tool-card");
    trigger.setAttribute("aria-haspopup", "dialog");
    // ruta de teclado: el resumen sigue siendo el disparador accesible
    trigger.addEventListener("click", event => {
      event.preventDefault();
      openPanel(card, details, trigger, trigger);
    });
    // ruta de puntero: toda la tarjeta abre la ficha
    const opener = document.createElement("button");
    opener.type = "button";
    opener.className = "tool-card-open";
    opener.setAttribute("aria-label", `Ver ficha de ${card.querySelector(".tool-name").textContent}`);
    card.append(opener);
    opener.addEventListener("click", () => openPanel(card, details, trigger, opener));
  }

  panel.querySelector("[data-tool-close]").addEventListener("click", () => panel.close());
  let outside = false;
  panel.addEventListener("pointerdown", event => { outside = event.target === panel; });
  panel.addEventListener("click", event => {
    if (outside && event.target === panel) panel.close();
  });
  panel.addEventListener("close", () => {
    if (!opened) return;
    const {details, trigger, body, opener} = opened;
    details.append(body);
    opened = null;
    (opener || trigger).focus({preventScroll: true});
    // volver al listado conservando la posición de desplazamiento
    if (listScroll) window.scrollTo(0, listScroll);
  });
})();
