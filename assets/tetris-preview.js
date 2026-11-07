(() => {
  const preview = document.querySelector("[data-tetris-preview]");
  if (!preview) return;
  const button = preview.querySelector("button");
  const status = preview.querySelector("[role='status']");

  button.hidden = false;
  button.addEventListener("click", () => {
    const cleared = preview.toggleAttribute("data-cleared");
    button.textContent = cleared ? "Repetir jugada" : "Encajar la pieza";
    status.textContent = cleared ? "Cuatro líneas de una vez." : "Queda un hueco de cuatro filas.";
  });
})();
