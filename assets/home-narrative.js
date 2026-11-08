(() => {
  "use strict";

  // The primary header is the only navigation layer on the landing page.

  // El diálogo es un cajón desde la izquierda. Mantiene las fórmulas originales
  // de calculator.js: no existe un segundo cálculo ni se envían datos a un servidor.
  const drawer = document.querySelector("#calculator-drawer");
  const opener = document.querySelector("[data-open-calculator]");
  const closer = drawer?.querySelector("[data-close-calculator]");
  if (drawer && typeof drawer.showModal === "function" && opener) {
    opener.addEventListener("click", () => {
      if (drawer.open) return;
      drawer.showModal();
      const input = drawer.querySelector("#before-h");
      requestAnimationFrame(() => input?.focus({preventScroll: true}));
    });
    closer?.addEventListener("click", () => drawer.close());
    drawer.addEventListener("click", event => {
      if (event.target === drawer) drawer.close();
    });
    drawer.addEventListener("close", () => opener.focus({preventScroll: true}));
  } else {
    // Navegación convencional cuando no existe soporte para <dialog>.
    opener?.addEventListener("click", () => location.assign("calculadora/"));
  }

  // Resumen visible con el mismo resultado del motor oficial, sin repetir fórmulas.
  if (drawer) {
    const week = drawer.querySelector("#per-week");
    const year = drawer.querySelector("#per-year");
    const weekPreview = drawer.querySelector("[data-preview-week]");
    const yearPreview = drawer.querySelector("[data-preview-year]");
    const updatePreview = () => {
      if (week && weekPreview) weekPreview.textContent = week.textContent;
      if (year && yearPreview) yearPreview.textContent = year.textContent;
    };
    if (week && year && weekPreview && yearPreview) {
      new MutationObserver(updatePreview).observe(week, {childList: true, characterData: true, subtree: true});
      new MutationObserver(updatePreview).observe(year, {childList: true, characterData: true, subtree: true});
      updatePreview();
    }
  }

  // El enlace del footer abre el mismo Calendar integrado: nunca duplica portales.
  const footerBooking = document.querySelector("[data-footer-booking]");
  const primaryBooking = document.querySelector("[data-project-portal]");
  const bookingDialog = document.querySelector(".booking-portal");
  let openedFromFooter = false;
  footerBooking?.addEventListener("click", event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey || !primaryBooking) return;
    event.preventDefault();
    openedFromFooter = true;
    primaryBooking.click();
  });
  bookingDialog?.addEventListener("close", () => {
    if (!openedFromFooter) return;
    openedFromFooter = false;
    footerBooking?.focus({preventScroll: true});
  });

})();


// Entrada editorial de los apartados posteriores a las escenas narrativas.
(() => {
  "use strict";
  const body=document.body;
  if(!body?.classList.contains("home-page"))return;
  const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const groups=[
    ["#explorar",".section-head, .home-offer"],
    ["#como-trabajo",".method-copy, .method-step"],
    ["#ahorro",".impact-heading, .impact-bar-row, .impact-metrics, .impact-equation, .impact-footer"],
    ["#trabajos",".section-head, .feature, .section-action"],
    ["#quien-soy",".persona-identity, .persona-story"],
    ["#recursos",".section-head, .home-tool-card"],
    ["#una-partida",".pause-copy, .pause-figure"],
    ["#contacto",".contact-board-intro, .contact-board-copy"]
  ];
  const targets=[];
  groups.forEach(([sectionSelector,itemSelector])=>{
    const section=document.querySelector(sectionSelector);
    if(!section)return;
    section.querySelectorAll(itemSelector).forEach((node,index)=>{
      node.classList.add("home-reveal");
      node.style.setProperty("--home-reveal-delay",String(Math.min(index,6)*85)+"ms");
      targets.push(node);
    });
  });
  if(reduce||!("IntersectionObserver" in window))return;
  body.classList.add("home-motion-ready");
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:"0px 0px -7% 0px"});
  targets.forEach(node=>revealObserver.observe(node));

  const numberFormat=new Intl.NumberFormat("es-CL",{maximumFractionDigits:1});
  const countObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const node=entry.target;
      countObserver.unobserve(node);
      const target=Number(node.dataset.count);
      if(!Number.isFinite(target))return;
      const duration=700;
      let start=null;
      node.textContent="0";
      const tick=now=>{
        if(start===null)start=now;
        const progress=Math.min((now-start)/duration,1);
        const eased=1-Math.pow(1-progress,3);
        node.textContent=numberFormat.format(target*eased);
        if(progress<1)requestAnimationFrame(tick);
        else node.textContent=numberFormat.format(target);
      };
      requestAnimationFrame(tick);
    });
  },{threshold:.6,rootMargin:"0px 0px -5% 0px"});
  document.querySelectorAll(".home-page [data-count]").forEach(node=>countObserver.observe(node));
})();
