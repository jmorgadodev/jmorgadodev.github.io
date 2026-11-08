(() => {
  const portal = document.querySelector(".project-portal");
  const trigger = document.querySelector("[data-project-portal]");
  if (!portal?.showModal || !trigger) return;

  const frame = portal.querySelector("[data-portal-frame]");
  const template = portal.querySelector("[data-portal-template]");
  const filter = portal.querySelector("[data-portal-filter]");
  const pages = portal.querySelector("[data-portal-pages]");
  const status = portal.querySelector("[data-portal-status]");
  let selectedPage = template;
  let loadTimeout;
  trigger.setAttribute("aria-haspopup", "dialog");

  filter?.addEventListener("click", () => {
    const night = portal.toggleAttribute("data-filter-night");
    filter.setAttribute("aria-pressed", String(night));
  });

  function loadPage() {
    clearTimeout(loadTimeout);
    if (!selectedPage) return;
    const content = selectedPage.content.cloneNode(true);
    const iframe = content.querySelector("iframe");
    const setStatus = message => {
      if (portal.open && frame.contains(iframe)) status.textContent = message;
    };
    iframe.addEventListener("load", () => {
      if (!frame.contains(iframe)) return;
      clearTimeout(loadTimeout);
      setStatus("");
    }, {once: true});
    iframe.addEventListener("error", () => {
      if (!frame.contains(iframe)) return;
      clearTimeout(loadTimeout);
      setStatus("No se pudo cargar la vista. Puedes abrirla en otra pestaña.");
    }, {once: true});
    status.textContent = "Cargando la vista…";
    loadTimeout = setTimeout(() => setStatus("La vista está tardando. Puedes abrirla en otra pestaña."), 8000);
    frame.replaceChildren(content);
  }

  if (pages) {
    // Debe coincidir con los orígenes autorizados en Cloudflare.
    const canEmbed = ["https://jmorgadodev.github.io", "https://jmorgado.pages.dev", "http://127.0.0.1:8081"]
      .includes(location.origin);
    const choices = [...pages.querySelectorAll("[data-portal-choice]")];
    const templates = [...pages.querySelectorAll("[data-portal-page]")];
    pages.querySelector(".portal-pages-nav").hidden = !canEmbed || choices.length < 2;
    pages.querySelector("[data-portal-unavailable]").hidden = canEmbed;
    frame.hidden = !canEmbed;
    filter.hidden = !canEmbed;
    selectedPage = canEmbed ? templates[0] : null;
    for (const choice of choices) {
      choice.addEventListener("click", () => {
        for (const button of choices) button.setAttribute("aria-pressed", String(button === choice));
        selectedPage = templates.find(page => page.dataset.portalPage === choice.dataset.portalChoice);
        loadPage();
      });
    }
  }

  trigger.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (portal.open) return;
    portal.showModal();
    loadPage();
  });

  portal.addEventListener("close", () => {
    if (portal.open) return;
    clearTimeout(loadTimeout);
    status.textContent = "";
    frame?.replaceChildren();
    trigger.focus({preventScroll: true});
  });
})();
