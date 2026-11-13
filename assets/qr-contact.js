(() => {
  const form = document.querySelector("[data-contact-form]");
  if (!form || !window.fetch) return;

  const status = form.querySelector("[data-contact-status]");
  const button = form.querySelector("button[type=submit]");
  const endpoint = location.hostname === "jmorgadodev.github.io"
    ? "https://jmorgado.pages.dev/api/contacto"
    : "/api/contacto";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) return;

    const data = new FormData(form);
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.dataset.state = "pending";
    status.textContent = "Enviando tu mensaje…";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(Object.fromEntries(data)),
        signal: AbortSignal.timeout(14000),
      });
      if (!response.ok || (await response.json()).sent !== true) throw new Error("Unconfirmed");
      form.reset();
      status.dataset.state = "success";
      status.textContent = "Gracias por escribirme. Te responderé por correo.";
    } catch {
      status.dataset.state = "error";
      status.textContent = "No pude confirmar el envío. Puedes reintentar o escribirme por correo o WhatsApp.";
    } finally {
      button.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });

  form.hidden = false;
  document.querySelector(".qr-form-fallback").hidden = true;
})();
