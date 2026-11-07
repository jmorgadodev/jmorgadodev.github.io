/* Reutiliza la ficha del catálogo y conserva el details como alternativa sin JS. */
(() => {
  const panel = document.querySelector(".tool-panel");
  if (!panel?.showModal) return;
  const title = panel.querySelector("#tool-panel-title");
  const slot = panel.querySelector("[data-tool-content]");
  let opened = null;

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

  for (const details of document.querySelectorAll(".tool-details")) {
    const trigger = details.querySelector("summary");
    const body = details.querySelector(".tool-detail-body");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.addEventListener("click", event => {
      if (panel.open) return;
      event.preventDefault();
      opened = {details, trigger, body};
      title.textContent = details.closest(".tool-card").querySelector(".tool-name").textContent;
      slot.append(body);
      panel.showModal();
    });
  }

  panel.querySelector("[data-tool-close]").addEventListener("click", () => panel.close());
  let outside = false;
  panel.addEventListener("pointerdown", event => { outside = event.target === panel; });
  panel.addEventListener("click", event => {
    if (outside && event.target === panel) panel.close();
  });
  panel.addEventListener("close", () => {
    if (!opened) return;
    const {details, trigger, body} = opened;
    details.append(body);
    opened = null;
    trigger.focus({preventScroll:true});
  });
})();
