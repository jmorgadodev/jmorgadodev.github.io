(() => {
  "use strict";
  const drawer = document.querySelector("#calculator-drawer");
  const launcher = document.querySelector("[data-open-calculator]");
  if (!drawer || !launcher) return;

  const close = drawer.querySelector("[data-close-calculator]");
  const quick = document.querySelector("[data-home-quick-calc]");
  const prevWeek = drawer.querySelector("[data-preview-week]");
  const prevYear = drawer.querySelector("[data-preview-year]");
  const originalWeek = drawer.querySelector("#per-week");
  const originalYear = drawer.querySelector("#per-year");

  function fill(id, value) {
    const field = drawer.querySelector("#" + id);
    if (field) field.value = String(value);
  }

  function syncQuickValues() {
    if (!quick) return;
    const before = Number(quick.querySelector("[data-time-before]")?.value);
    const after = Number(quick.querySelector("[data-time-after]")?.value);
    const times = Number(quick.querySelector("[data-frequency]")?.value);
    if (![before, after, times].every(Number.isFinite) || before < 0 || after < 0 || times < 0) return;
    fill("before-h", Math.floor(before / 60));
    fill("before-m", Math.floor(before % 60));
    fill("after-h", Math.floor(after / 60));
    fill("after-m", Math.floor(after % 60));
    if (times > 0) fill("frequency", times);
    fill("period", "week");
    drawer.querySelector("#before-h")?.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function updatePreview() {
    if (prevWeek && originalWeek) prevWeek.textContent = originalWeek.textContent;
    if (prevYear && originalYear) prevYear.textContent = originalYear.textContent;
  }
  if (originalWeek && originalYear) {
    const observer = new MutationObserver(updatePreview);
    observer.observe(originalWeek, {childList:true, subtree:true, characterData:true});
    observer.observe(originalYear, {childList:true, subtree:true, characterData:true});
    updatePreview();
  }

  if (typeof drawer.showModal !== "function") return; // The anchor navigates to /calculadora/ in older browsers.

  launcher.addEventListener("click", event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (drawer.open) return;
    syncQuickValues();
    drawer.showModal();
    requestAnimationFrame(() => drawer.querySelector("#before-h")?.focus({preventScroll:true}));
  });
  close?.addEventListener("click", () => drawer.close());

  drawer.addEventListener("click", event => {
    if (event.target !== drawer) return;
    const box = drawer.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) drawer.close();
  });
  drawer.addEventListener("close", () => launcher.focus({preventScroll:true}));
})();