/* Ejecutado antes del CSS para evitar destellos al navegar. */
(()=>{let chosen;try{chosen=localStorage.getItem('jm-theme')}catch(_){}document.documentElement.dataset.jmTheme=chosen==='day'||chosen==='night'?chosen:matchMedia('(prefers-color-scheme:dark)').matches?'night':'day';})();
