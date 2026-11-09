(() => {
  "use strict";

  // The primary header is the only navigation layer on the landing page.

  // El diálogo es un cajón desde la izquierda. Mantiene las fórmulas originales
  // de calculator.js: no existe un segundo cálculo ni se envían datos a un servidor.
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
  // The commercial landing has its own entrance score, not an extension of scene choreography.
  const groups=[
    {section:"#explorar",targets:[[".section-head","rise"],[".home-offer","item"]]},
    {section:"#como-trabajo",targets:[[".method-copy","from-right"],[".method-step","from-left"],[".method-bottom-link","rise"]]},
    {section:"#ahorro",targets:[[".impact-heading","rise"],[".quick-calc-field","item"],[".quick-calc-result","soft"]]},
    {section:"#trabajos",targets:[[".section-head","rise"],[".projects-carousel","soft"],[".section-action","rise"]]},
    {section:"#quien-soy",targets:[[".persona-identity","from-left"],[".persona-story > p, .persona-story > a","rise"]]},
    {section:"#recursos",targets:[[".section-head","from-right"],[".home-tool-card","item"]]},
    {section:"#contacto",targets:[[".contact-board-intro","rise"],[".contact-board-copy","soft"]]},
    {section:"#una-partida",targets:[[".pause-copy","rise"],[".pause-figure","soft"]]}
  ];
  const targets=[];
  groups.forEach(({section,targets:rules})=>{
    const root=document.querySelector(section);
    if(!root)return;
    let index=0;
    rules.forEach(([selector,kind])=>{
      root.querySelectorAll(selector).forEach(node=>{
        node.classList.add("home-reveal");
        node.dataset.revealKind=kind;
        node.style.setProperty("--home-reveal-delay",Math.min(index,8)*70+"ms");
        index++;
        targets.push(node);
      });
    });
  });
  if(!reduce&&"IntersectionObserver" in window){
    body.classList.add("home-motion-ready");
    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },{threshold:.08,rootMargin:"0px 0px -4% 0px"});
    targets.forEach(node=>{
      if(node.getBoundingClientRect().top<innerHeight*.92)node.classList.add("is-visible");
      else revealObserver.observe(node);
    });
  }

  if(reduce||!("IntersectionObserver" in window))return;
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
