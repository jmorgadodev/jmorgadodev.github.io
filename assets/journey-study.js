/* JMorgado · Reel interactivo. Motion graphics originales dibujados en Canvas 2D.
   La coreografía principal es determinista y reversible; la entrada inicial es breve.
   Las palabras visibles para lectores de pantalla siguen siendo HTML.
*/
(()=>{
'use strict';
const root=document.querySelector('[data-study]');
if(!root||!window.gsap||!window.ScrollTrigger)return;
if('scrollRestoration' in history)history.scrollRestoration='manual';
if(!location.hash&&window.scrollY>0)window.scrollTo(0,0);
gsap.registerPlugin(ScrollTrigger);
const canvas=root.querySelector('.study-canvas'),ctx=canvas.getContext('2d',{alpha:false});
// Una superficie transparente independiente: los detalles en reposo nunca
// mueven ni reemplazan las piezas de la coreografía principal.
const idleCanvas=document.createElement('canvas');
idleCanvas.className='study-idle-canvas';
idleCanvas.setAttribute('aria-hidden','true');
Object.assign(idleCanvas.style,{
 position:'absolute',inset:'0',width:'100%',height:'100%',
 pointerEvents:'none',zIndex:'1'
});
canvas.insertAdjacentElement('afterend',idleCanvas);
const idleCtx=idleCanvas.getContext('2d',{alpha:true});
const header=document.querySelector('.home-header'),destination=document.getElementById('explorar');
const themeButton=root.querySelector('.study-theme'),siteTheme=document.querySelector('[data-theme-toggle]');
const skip=root.querySelector('.intro-skip'),copies=[...root.querySelectorAll('[data-copy]')];
const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');
const mqMobile=matchMedia('(max-width:900px)');
let W=0,H=0,DPR=1,idleDPR=1,wordPoints=[],play={t:0},master,trigger,resizeId;
// C · Cadencia propia de la capa ambiental: 29,4 fps en escritorio y 23,8 fps
// en pantallas estrechas. No se cambia el valor: ya está dentro del rango
// pedido y forma parte de la sensación de profundidad del reposo.
const ambientInterval=()=>W<700?42:34;
// C · Cache de las capas del fondo, una por escena. El fondo completo ya no se
// cachea como imagen fija: el color base se mezcla en cada fotograma y las
// capas se componen con el mismo crossfade que ya hacia el motor.
const capaCanvasA=document.createElement('canvas');
const capaCanvasB=document.createElement('canvas');
const capaCtxA=capaCanvasA.getContext('2d',{alpha:true});
const capaCtxB=capaCanvasB.getContext('2d',{alpha:true});
let capaTramoA=-1,capaTramoB=-1,capaTema='',capaAncho=0,capaAlto=0,capaDPR=0,capaListoA=false,capaListoB=false;
function capaClaveValida(){
 return capaTema===(night()?'night':'day')&&capaAncho===W&&capaAlto===H&&capaDPR===DPR;
}
function capaInvalidar(){
 capaListoA=false;capaListoB=false;capaTramoA=-1;capaTramoB=-1;
}
function capaGenerar(scene,destino,destinoCtx){
 if(scene<0||scene>7)return false;
 const pw=Math.max(1,Math.round(W*DPR)),ph=Math.max(1,Math.round(H*DPR));
 destino.width=pw;destino.height=ph;
 destinoCtx.setTransform(1,0,0,1,0,0);
 destinoCtx.clearRect(0,0,pw,ph);
 destinoCtx.setTransform(DPR,0,0,DPR,0,0);
 const anterior=fondoCtx;
 fondoCtx=destinoCtx;
 try{ drawBackdropLayer(scene,PAL[night()?'night':'day'],1); }
 finally{ fondoCtx=anterior; }
 return true;
}
// D · Control del área de renderizado.
//
// El coste de rasterización es proporcional al área del lienzo, así que la
// palanca más directa sobre el intervalo entre fotogramas es la resolución
// interna. El tamaño en CSS no cambia nunca: sólo cambia cuántos píxeles
// reales se pintan por cada píxel de la pantalla.
//
//   1. Un tope por defecto según el tipo de dispositivo y su potencia.
//   2. Un ajuste en vivo: el motor mide el intervalo real entre fotogramas y
//      baja la resolución interna en escalones cuando el equipo no sostiene
//      el ritmo, con histeresis y enfriamiento para que la calidad no oscile.
// Niveles de resolucion interna. El suelo es 0,85: por debajo el grafico
// pierde nitidez y el equipo tampoco gana fluidez suficiente.
const DPR_NIVELES=[0.85,1,1.25,1.5];
let dprNivel=-1,dprTope=-1,frameSonda=0,frameAnterior=0;
let frameMuestras=[],frameEnfriamiento=0,frameEstable=0;

// Tope por defecto: nunca se supera el límite anterior de 1,65, de modo que la
// calidad visual no puede empeorar respecto del estado previo en ningún equipo.
function dprCapBase(){
 // El lado corto de la pantalla es el que delata un equipo estrecho: en un
 // movil en vertical, el alto es mayor que el ancho.
 const corto=Math.min(innerWidth||0,innerHeight||0);
 const largo=Math.max(innerWidth||0,innerHeight||0);
 const nucleos=navigator.hardwareConcurrency||4;
 const memoria=navigator.deviceMemory||4;
 const tactil=matchMedia('(pointer:coarse)').matches;
 if(tactil||corto<900)return(nucleos>=8&&memoria>=6)?1.25:1;
 return(nucleos>=8&&memoria>=8&&largo>=1600)?1.5:1.25;
}
function dprInicializar(){
 if(dprNivel>=0)return;
 const base=dprCapBase();
 // El mayor nivel que no supera el tope: nunca se baja de la resolucion
 // basandose en el orden del array, sino en el limite real del equipo.
 let indice=0;
 for(let n=0;n<DPR_NIVELES.length;n++){
  if(DPR_NIVELES[n]<=base+0.1)indice=n;
 }
 dprNivel=indice;dprTope=indice;
}
function dprCap(){dprInicializar();return DPR_NIVELES[dprNivel]}
function dprAjustable(){
 // El ajuste en vivo se reserva a los equipos donde el area es el factor
 // dominante. En escritorio, la medicion demuestra que reducir el area no
 // mejora el intervalo: ahi el cuello es el numero de operaciones de dibujo.
 // El nivel ya se inicializa antes de esta comprobacion.
 const corto=Math.min(innerWidth||0,innerHeight||0);
 return matchMedia('(pointer:coarse)').matches||corto<900;
}

// El sondeo usa un unico callback propio: sus ejecuciones son una por
// fotograma, de modo que la diferencia entre dos Sellos es el intervalo real.
function frameSondaTick(sello){
 if(frameAnterior){
  const delta=sello-frameAnterior;
  if(delta>0&&delta<2000)frameMuestras.push(delta);
  if(frameMuestras.length>40)frameMuestras.shift();
 }
 frameAnterior=sello;
 frameSonda=requestAnimationFrame(frameSondaTick);
}
function ajustarResolucion(){
 if(!dprAjustable()||prefersReduced.matches||dprNivel<0)return;
 const ahora=performance.now();
 if(ahora<frameEnfriamiento)return;
 if(frameMuestras.length<12)return;
 const orden=frameMuestras.slice().sort((a,b)=>a-b);
 const mediana=orden[orden.length>>1];
 let nivel=dprNivel;
 if(mediana>55&&nivel>0)nivel--;
 else if(mediana<20&&nivel<dprTope){
  frameEstable++;
  if(frameEstable>=8)nivel++;
 }else frameEstable=0;
 if(nivel===dprNivel)return;
 dprNivel=nivel;
 frameMuestras.length=0;
 frameEstable=0;
 frameEnfriamiento=ahora+(nivel<dprTope?1500:6000);
 resize();
}
const seedPulse={value:0},introReveal={value:1},sceneAmbient={value:0},idleMotion={value:0,time:0};
const homeReturn={scale:1,turn:0,lift:0,glow:0,ring:0,opacity:1};
let seedPulseTween=null,introTween=null,introTextTween=null,sceneAmbientTimer=0,homeReturnTween=null;
let idleLastRender=0,idleLastFrame=0,idleClock=0,ambientRunning=false;
const pointer={x:0,y:0,energy:0,active:false,down:false,dirX:0,dirY:0,speed:0,lastMoveAt:0,lastSpeedUpdateAt:0,hasPosition:false};
let pointerTween=null,pointerFade=null,scrollIdle=true,scrollIdleTimer=0;

// ═══════════════════════════════════════════════════════════════════════════
// Arquitectura del motor
//
//   A · Motor narrativo     → capa 'narrative'. Las siete escenas, sus estados,
//                              geometrías y transiciones. No sabe nada del pintado.
//   B · Motor de interacción → el puntero. Anota la posición; no dibuja.
//   C · Capas visuales      → capa 'ambient'. Atmósferas y profundidad del
//                              reposo. Tiene su propio ritmo y su propio lienzo.
//   D · Control de rendimiento → invalidez, visibilidad y cadencia.
//
// Un único ciclo de fotogramas (el ticker de GSAP) recorre las capas. Cada capa
// declara si necesita repintado: así una capa nunca obliga a redibujar a otra.
// El ambiente respira sin forzar el relato, y el relato sólo se repinta cuando
// su estado ha cambiado de verdad.
//
// Para añadir una capa nueva no hay que tocar las escenas: se registra aquí con
// su propio ritmo, su propia visibilidad y su propia invalidez.
// ═══════════════════════════════════════════════════════════════════════════
// C · Contexto de destino del bloque de fondo. Apunta al lienzo principal
// salvo mientras se rasteriza un bitmap de capas, de modo que el mismo
// codigo sirve para pintar en el lienzo y en la cache.
let fondoCtx=ctx;

const layers={};
function registerLayer(layer){layers[layer.id]=layer;return layer}
function invalidate(id){const l=layers[id];if(l)l.dirty=true}
function invalidateAll(){for(const id in layers)layers[id].dirty=true}

// A · La capa narrativa sólo se repinta si algo del relato ha cambiado:
// cambio de tramo, puntero, pulso de semilla, tema, tamaño o entrada inicial.
const narrativeLayer=registerLayer({
 id:'narrative',dirty:true,
 due(){return this.dirty},
 paint(){this.dirty=false;paintNarrative()}
});
// C · La capa ambiental tiene su propio ritmo (24-30 fps) y su propia
// visibilidad. Nunca provoca un repintado completo del motor principal.
const ambientLayer=registerLayer({
 id:'ambient',dirty:false,
 due(now){return this.dirty||(ambientRunning&&now-idleLastRender>=ambientInterval())},
 paint(now){this.dirty=false;drawIdleAmbient(now);idleLastRender=now}
});

// B · El puntero anota la posición y la aplica una sola vez por ciclo de
// fotogramas, con el último valor recibido. Un ratón rápido genera un
// repintado por fotograma, no uno por evento.
const pendingPointer={clientX:0,clientY:0,pointerType:'mouse',has:false};
let pointerDirty=false;
function queuePointer(event){
 pendingPointer.clientX=event.clientX;
 pendingPointer.clientY=event.clientY;
 pendingPointer.pointerType=event.pointerType;
 pendingPointer.has=true;
 pointerDirty=true;
}
function invalidateNarrative(){narrativeLayer.dirty=true}
const N=3600,particles=[],PHI=(1+Math.sqrt(5))/2;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{let t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
function pointerInfluenceAt(x,y,reach){
 if(!pointer.active||pointer.energy<=.001)return {strength:0,proximity:0,dx:0,dy:0,distance:Infinity,speed:0,direction:0};
 const dx=x-pointer.x,dy=y-pointer.y,distance=Math.hypot(dx,dy);
 const proximity=1-smooth(reach*.10,reach,distance);
 const speed=clamp(pointer.speed);
 const direction=clamp((dx*pointer.dirX+dy*pointer.dirY)/Math.max(reach,1),-1,1);
 const directional=clamp(.88+.18*speed*direction,.68,1.08);
 return {strength:proximity*proximity*pointer.energy*directional,
  proximity,dx,dy,distance,speed,direction};
}
const hashCache=new Map();
const hash=n=>{
 let valor=hashCache.get(n);
 if(valor!==undefined)return valor;
 const v=Math.sin(n*127.1+83.17)*43758.5453;
 valor=v-Math.floor(v);
 hashCache.set(n,valor);
 return valor;
};
const rad=Math.PI/180;
for(let i=0;i<N;i++)particles.push({r:hash(i*2),s:hash(i*2+1),k:hash(i*3+7)});
const PAL={
 // Cada capítulo conserva la misma familia cromática, pero tiene una superficie propia.
 // Las diferencias son tonales y materiales: papel, salvia, coral, mineral, petróleo,
 // piedra fría, arena y cierre profundo. La pareja día/noche mantiene el mismo mapa.
 day:{bg:['#E8EAE6','#D5E2DB','#F45A3A','#D8D8CC','#102E38','#CCD9D5','#E4DFD6','#102E38'],
 ink:'#222327',cream:'#FCFAF5',petrol:'#23494E',coral:'#F45A3A',amber:'#E8B769',olive:'#737B69',stone:'#C9C8B7',ash:'#A5A18D',clay:'#D99B89'},
 night:{bg:['#111B20','#1A3030','#F45A3A','#263536','#0B141C','#1A3239','#353129','#0B141C'],
 ink:'#F3F0E8',cream:'#F3F0E8',petrol:'#477982',coral:'#FF785C',amber:'#EEC47D',olive:'#ADB29C',stone:'#818578',ash:'#B5B19F',clay:'#DDA294'}
};
// D · Cache de operaciones puras. El motor repite estas cuatro llamadas
// decenas de miles de veces por fotograma y todas son deterministas.
const rgbCache=new Map();
const rgb=h=>{
 const clave=h;
 let valor=rgbCache.get(clave);
 if(valor)return valor;
 valor=h.startsWith('rgb')?h.match(/[\d.]+/g).slice(0,3).map(Number):[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 rgbCache.set(clave,valor);
 return valor;
};
const mixCache=new Map();
const mix=(a,b,u)=>{
 const clave=a+'|'+b+'|'+Math.round(u*100);
 let valor=mixCache.get(clave);
 if(valor)return valor;
 const A=rgb(a),B=rgb(b);
 valor='rgb('+A.map((v,k)=>Math.round(lerp(v,B[k],u))).join(',')+')';
 mixCache.set(clave,valor);
 return valor;
};
const rgba=(color,alpha)=>'rgba('+rgb(color).map(Math.round).join(',')+','+alpha+')';
// Grano físico determinista: una sola textura repetible, no ruido nuevo por fotograma.
const grainTile=document.createElement('canvas');
grainTile.width=grainTile.height=192;
const grainContext=grainTile.getContext('2d');
const grainImage=grainContext.createImageData(grainTile.width,grainTile.height);
let grainSeed=0x6D2B79F5;
for(let i=0;i<grainImage.data.length;i+=4){
 grainSeed=(grainSeed*1664525+1013904223)>>>0;
 const value=104+((grainSeed>>>24)%49);
 grainImage.data[i]=grainImage.data[i+1]=grainImage.data[i+2]=value;
 grainImage.data[i+3]=255;
}
grainContext.putImageData(grainImage,0,0);
const grainPattern=ctx.createPattern(grainTile,'repeat');
// El grano es una textura estatica: se rasteriza una sola vez en un bitmap
// del tamano del lienzo y se compone con un unico drawImage. Antes se
// muestreaba el patron repetido sobre toda la superficie en cada fotograma,
// en modo soft-light, y era el mayor coste individual del fondo.
const grainCanvas=document.createElement('canvas');
const grainCtx=grainCanvas.getContext('2d',{alpha:true});
let grainReady=false;
function rebuildGrain(){
 if(!W||!H)return;
 const pw=Math.max(1,Math.round(W*DPR)),ph=Math.max(1,Math.round(H*DPR));
 grainCanvas.width=pw;grainCanvas.height=ph;
 grainCtx.setTransform(1,0,0,1,0,0);
 grainCtx.clearRect(0,0,pw,ph);
 const patron=grainCtx.createPattern(grainTile,'repeat');
 if(patron){
  grainCtx.fillStyle=patron;
  grainCtx.fillRect(0,0,pw,ph);
 }
 grainReady=true;
}
function contrastFor(background){
 const channels=background.startsWith('rgb')?background.match(/\d+/g).slice(0,3).map(Number):rgb(background);
 const linear=channels.map(v=>{const c=v/255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)});
 const luminance=.2126*linear[0]+.7152*linear[1]+.0722*linear[2];
 return luminance>.19?'#222327':'#F3F0E8';
}
const night=()=>document.documentElement.dataset.jmTheme==='night';
function line(x1,y1,x2,y2,color,width=1,opacity=1){
 ctx.save();ctx.globalAlpha*=opacity;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
 ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke();ctx.restore();
}
function rounded(x,y,w,h,r,color,alpha=1){
 ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle=color;ctx.beginPath();
 ctx.roundRect(x,y,w,h,Math.min(Math.max(0,r),w/2,h/2));ctx.fill();ctx.restore();
}
function drawBeveledBlock(x,y,w,h,r,color,p,ambient=0,depthMultiplier=1){
 const depth=Math.max(.8,Math.min(Math.min(w,h)*.18,W<700?2.5:4.8))*depthMultiplier;
 const dx=depth*.72,dy=depth*.92,x0=-w/2,x1=w/2,y0=-h/2,y1=h/2;
 const radius=Math.min(Math.max(0,r),w/2,h/2);
 const shadowDetail=Math.min(w,h)>24?1:.46;
 ctx.save();ctx.translate(x,y);
 ctx.shadowColor=night()?'rgba(0,0,0,.30)':'rgba(24,39,38,.18)';
 ctx.shadowBlur=depth*(.82+ambient*.36)*shadowDetail;
 ctx.shadowOffsetX=dx*.30*shadowDetail;ctx.shadowOffsetY=dy*.62*shadowDetail;
 // Las caras laterales usan valores sólidos distintos: profundidad clara sin gradientes por pieza.
 ctx.beginPath();ctx.moveTo(x0+radius,y1-radius*.12);ctx.lineTo(x1-radius,y1-radius*.12);
 ctx.lineTo(x1-radius+dx,y1+dy);ctx.lineTo(x0+radius+dx,y1+dy);ctx.closePath();
 ctx.fillStyle=mix(color,p.bg[0],.48);ctx.fill();
 ctx.beginPath();ctx.moveTo(x1-radius*.10,y0+radius);ctx.lineTo(x1-radius*.10,y1-radius);
 ctx.lineTo(x1+dx,y1-radius+dy);ctx.lineTo(x1+dx,y0+radius+dy);ctx.closePath();
 ctx.fillStyle=mix(color,p.bg[0],.60);ctx.fill();
 const face=ctx.createLinearGradient(x0,y0,x1,y1);
 face.addColorStop(0,mix(color,p.cream,.19+ambient*.09));
 face.addColorStop(.56,color);
 face.addColorStop(1,mix(color,p.bg[0],.16));
 ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
 ctx.beginPath();ctx.roundRect(x0,y0,w,h,radius);ctx.fillStyle=face;ctx.fill();
 ctx.lineJoin='round';ctx.lineWidth=.8;
 ctx.strokeStyle=mix(color,p.bg[0],.22);ctx.stroke();
 // El bisel superior y el canto izquierdo reciben la luz; el lado opuesto conserva peso.
 ctx.save();ctx.globalAlpha*=.48+ambient*.16;ctx.beginPath();
 ctx.moveTo(x0+radius,y0+.65);ctx.lineTo(x1-radius,y0+.65);
 ctx.strokeStyle=p.cream;ctx.lineWidth=.72;ctx.stroke();
 ctx.beginPath();ctx.moveTo(x0+.65,y0+radius);ctx.lineTo(x0+.65,y1-radius);
 ctx.globalAlpha*=.58;ctx.lineWidth=.58;ctx.stroke();
 ctx.restore();
 ctx.save();ctx.globalAlpha*=.34;ctx.beginPath();
 ctx.moveTo(x1-.45,y0+radius);ctx.lineTo(x1-.45,y1-radius);
 ctx.lineTo(x1-radius,y1-.45);
 ctx.strokeStyle=mix(color,p.bg[0],.62);ctx.lineWidth=.7;ctx.stroke();ctx.restore();
 // Reflejo especular lento: aporta volumen a las barras sin mover su retícula.
 if(ambient>.16&&w>h*1.35&&h>5){
  const phase=(idleMotion.time*.105+(x/Math.max(W,1))*.17)%1;
  const sweepX=lerp(x0-w*.34,x1+w*.34,phase);
  const sheen=ctx.createLinearGradient(sweepX-w*.24,0,sweepX+w*.24,0);
  sheen.addColorStop(0,rgba(p.cream,0));
  sheen.addColorStop(.46,rgba(p.cream,0));
  sheen.addColorStop(.52,rgba(p.cream,.20));
  sheen.addColorStop(.62,rgba(p.cream,.045));
  sheen.addColorStop(1,rgba(p.cream,0));
  ctx.save();ctx.beginPath();ctx.roundRect(x0,y0,w,h,radius);ctx.clip();
  ctx.globalAlpha*=clamp(ambient*.42,0,.30);
  ctx.fillStyle=sheen;ctx.fillRect(x0,y0,w,h);ctx.restore();
 }
 ctx.restore();
}
function drawBackdropWash(x,y,r,color,opacity){
 if(opacity<=.001)return;
 const gradient=fondoCtx.createRadialGradient(x,y,0,x,y,r);
 gradient.addColorStop(0,rgba(color,opacity));
 gradient.addColorStop(.36,rgba(color,opacity*.48));
 gradient.addColorStop(.74,rgba(color,opacity*.12));
 gradient.addColorStop(1,rgba(color,0));
 fondoCtx.fillStyle=gradient;fondoCtx.fillRect(0,0,W,H);
}
function drawSoftEllipse(x,y,rx,ry,color,opacity){
 if(opacity<=.001)return;
 fondoCtx.save();fondoCtx.translate(x,y);fondoCtx.scale(1,ry/rx);
 const gradient=fondoCtx.createRadialGradient(0,0,0,0,0,rx);
 gradient.addColorStop(0,rgba(color,opacity));
 gradient.addColorStop(.42,rgba(color,opacity*.42));
 gradient.addColorStop(1,rgba(color,0));
 fondoCtx.fillStyle=gradient;fondoCtx.beginPath();fondoCtx.arc(0,0,rx,0,Math.PI*2);fondoCtx.fill();
 fondoCtx.restore();
}
function drawSurfaceMaterial(scene,p){
 const isNight=night(),extent=Math.max(W,H);
 if(!isNight){
  // Luz de superficie: un plano claro arriba y una caída tonal real hacia el borde.
  const plane=fondoCtx.createLinearGradient(0,0,W,H);
  plane.addColorStop(0,rgba(p.cream,.30));
  plane.addColorStop(.28,rgba(p.cream,.11));
  plane.addColorStop(.66,rgba(p.ink,.018));
  plane.addColorStop(1,rgba(p.ink,.115));
  fondoCtx.fillStyle=plane;fondoCtx.fillRect(0,0,W,H);
  if(scene===0){
   // Papel mineral neutro: el modo día necesita contraste de volumen, no un velo ámbar.
   drawBackdropWash(W*.49,H*.65,extent*.63,p.petrol,.115);
   drawBackdropWash(W*.12,H*.18,extent*.47,p.cream,.20);
   drawBackdropWash(W*.91,H*.88,extent*.42,p.olive,.060);
   // Tres sombras de contacto discretas bajo la masa real de cada conjunto.
   const rx=W*(W<700?.108:.092),ry=H*(W<700?.018:.023);
   [0,1,2].forEach(group=>{
    const center=openingGroupCenter(group),formation=openingGroupEntry(group).formation;
    // La huella acompaña el asentamiento; no hay sombras esperando piezas ausentes.
    if(formation<=.002)return;
    const x=lerp(W*.5,center.x,formation);
    const floorY=lerp(H*.66,center.y+H*(W<700?.077:.095),formation);
    const width=rx*(.62+.38*formation);
    drawSoftEllipse(x,floorY,width,ry,p.petrol,.18*formation);
    drawSoftEllipse(x,floorY+H*.006,width*.68,ry*.48,p.ink,.072*formation);
   });
  }else if(scene===1){
   drawBackdropWash(W*.24,H*.20,extent*.58,p.cream,.16);
   drawBackdropWash(W*.84,H*.82,extent*.48,p.petrol,.105);
  }else if(scene===3){
   drawBackdropWash(W*.50,H*.56,extent*.68,p.olive,.145);
   drawBackdropWash(W*.12,H*.88,extent*.45,p.ink,.065);
  }else if(scene===5){
   drawBackdropWash(W*.22,H*.20,extent*.56,p.cream,.18);
   drawBackdropWash(W*.86,H*.82,extent*.50,p.petrol,.12);
  }else if(scene===6){
   // La escena de orden necesita plano mineral, no neblina amarilla.
   drawBackdropWash(W*.58,H*.58,extent*.61,p.amber,.065);
   drawBackdropWash(W*.14,H*.82,extent*.47,p.clay,.04);
   drawBackdropWash(W*.55,H*.76,extent*.53,p.petrol,.10);
   drawSoftEllipse(W*.50,H*.83,W*.33,H*.038,p.ink,.10);
  }
 }
 // La textura se compone en soft-light: material visible, sin patrón ornamental.
 // La textura se compone en soft-light: material visible, sin patron ornamental.
 // Se aplica aqui, una sola vez por fotograma, sobre el fondo ya compuesto.
 if(grainPattern){
  fondoCtx.save();fondoCtx.globalCompositeOperation='soft-light';
  fondoCtx.globalAlpha*=isNight?.055:.145;
  if(grainReady)fondoCtx.drawImage(grainCanvas,0,0,W,H);
  else{fondoCtx.fillStyle=grainPattern;fondoCtx.fillRect(0,0,W,H);}
  fondoCtx.restore();
 }
}
function drawBackdropLayer(scene,p,alpha=1){
 if(alpha<=.002)return;
 const isNight=night(),extent=Math.max(W,H);
 fondoCtx.save();fondoCtx.globalAlpha*=alpha;
 // Una luz diagonal común mantiene la identidad del recorrido sin uniformar sus escenas.
 const directional=fondoCtx.createLinearGradient(0,0,W,H);
 directional.addColorStop(0,rgba(p.cream,isNight?.035:.18));
 directional.addColorStop(.48,rgba(p.cream,0));
 directional.addColorStop(1,rgba(isNight?'#050B10':p.ink,isNight?.075:.075));
 fondoCtx.fillStyle=directional;fondoCtx.fillRect(0,0,W,H);
 if(scene===0){
  // En noche, contraluz cálida; en día, profundidad fría con un reflejo bajo.
  const phase=idleMotion.time,idle=idleMotion.value;
  const lightX=W*(.50+Math.sin(phase*.12)*.018*idle);
  const lightY=H*(.69+Math.cos(phase*.16)*.012*idle);
  drawBackdropWash(lightX,lightY,extent*.52,
   isNight?p.amber:p.petrol,isNight?.075:.095);
  drawBackdropWash(W*.20,H*.36,extent*.28,p.cream,isNight?.04:.13);
  if(!isNight)drawBackdropWash(W*.77,H*.80,extent*.37,p.amber,.045);
 }else if(scene===1){
  // Salvia fría: un campo petrolero suave diferencia la escena de conexiones.
  const phase=idleMotion.time,idle=idleMotion.value;
  const lightX=W*(.50+Math.sin(phase*.11+1.2)*.02*idle);
  drawBackdropWash(lightX,H*.48,extent*.48,p.petrol,isNight?.16:.18);
  drawBackdropWash(W*.50,H*.58,extent*.28,p.amber,isNight?.055:.12);
 }else if(scene===2){
  // El coral conserva su protagonismo, pero gana luz central y profundidad periférica.
  const ember=fondoCtx.createRadialGradient(W*.50,H*.64,0,W*.50,H*.64,extent*.70);
  ember.addColorStop(0,rgba(p.amber,isNight?.22:.20));
  ember.addColorStop(.30,rgba(p.coral,.035));
  ember.addColorStop(.68,rgba('#9E3A2C',isNight?.08:.065));
  ember.addColorStop(1,rgba('#6F2D27',isNight?.15:.12));
  fondoCtx.fillStyle=ember;fondoCtx.fillRect(0,0,W,H);
 }else if(scene===3){
  // Superficie mineral: la luz oliva acompaña la palabra sin competir con CRECER.
  const phase=idleMotion.time,idle=idleMotion.value;
  const lightX=W*(.50+Math.cos(phase*.13)*.016*idle);
  drawBackdropWash(lightX,H*.57,extent*.60,p.olive,isNight?.15:.17);
  drawBackdropWash(W*.50,H*.57,extent*.34,p.cream,isNight?.045:.12);
 }else if(scene===4){
  // Luz de ambiente y horizonte suave: el piso conserva su retícula y perspectiva.
  drawBackdropWash(W*.50,H*.57,extent*.58,p.petrol,isNight?.16:.11);
  drawBackdropWash(W*.50,H*.73,extent*.45,p.cream,isNight?.06:.08);
  const horizon=fondoCtx.createLinearGradient(0,H*.66,0,H);
  horizon.addColorStop(0,rgba(p.petrol,0));
  horizon.addColorStop(.48,rgba(p.petrol,isNight?.075:.045));
  horizon.addColorStop(1,rgba(p.petrol,0));
  fondoCtx.fillStyle=horizon;fondoCtx.fillRect(0,0,W,H);
 }else if(scene===5){
  // Piedra fría: cuatro luces locales relacionan cada plataforma con su acento.
  const radius=extent*.25,phase=idleMotion.time,idle=idleMotion.value;
  [[.50,.43,p.coral,.075],[.22,.62,p.olive,.064],
   [.78,.62,p.amber,.072],[.50,.80,p.petrol,.052]].forEach(([x,y,color,amount],i)=>
    drawBackdropWash(W*(x+Math.sin(phase*.10+i*2)*.008*idle),
     H*(y+Math.cos(phase*.12+i)*.006*idle),radius,color,amount*(isNight?1.12:1.65)));
 }else if(scene===6){
  // Arena cálida: el ámbar recoge la gráfica y el petróleo queda como contraluz.
  const phase=idleMotion.time,idle=idleMotion.value;
  const lightX=W*(.50+Math.sin(phase*.12)*.012*idle);
  drawBackdropWash(lightX,H*.68,extent*.62,p.amber,isNight?.09:.075);
  drawBackdropWash(W*.50,H*.42,extent*.36,p.petrol,isNight?.045:.13);
 }else if(scene===7){
  // A restrained band of light focuses the last composition on the seed.
  const waveBand=fondoCtx.createLinearGradient(0,H*.42,0,H*.84);
  waveBand.addColorStop(0,rgba(p.petrol,0));
  waveBand.addColorStop(.48,rgba(p.petrol,isNight?.095:.055));
  waveBand.addColorStop(1,rgba(p.petrol,0));
  fondoCtx.fillStyle=waveBand;fondoCtx.fillRect(0,0,W,H);
  drawBackdropWash(W*.50,H*.62,extent*.72,p.petrol,isNight?.13:.075);
  drawBackdropWash(W*.50,H*.74,extent*.28,p.coral,isNight?.055:.045);
 }
 const edgeColor=isNight?'#050B10':p.ink;
 drawSurfaceMaterial(scene,p);
 const vignette=fondoCtx.createRadialGradient(W*.50,H*.48,Math.min(W,H)*.27,
  W*.50,H*.48,extent*.78);
 vignette.addColorStop(0,rgba(edgeColor,0));
 vignette.addColorStop(.68,rgba(edgeColor,isNight?.025:.025));
 vignette.addColorStop(1,rgba(edgeColor,isNight?.12:.075));
 fondoCtx.fillStyle=vignette;fondoCtx.fillRect(0,0,W,H);
 fondoCtx.restore();
}
function drawSceneAtmosphere(scene,p){
 const value=sceneAmbient.value;
 if(value<=.002||scene===4)return;
 const centers=[.46,.50,.50,.50,.50,.50,.50,.52],ys=[.66,.54,.64,.60,.62,.67,.62,.60];
 const centerX=W*(centers[scene]||.5),centerY=H*(ys[scene]||.62);
 const field=pointerInfluenceAt(centerX,centerY,Math.max(W,H)*.62);
 const x=centerX+pointer.dirX*field.strength*W*.012;
 const y=centerY+pointer.dirY*field.strength*H*.014,radius=Math.max(W,H)*.62;
 const tint=scene===0||scene===1?p.amber:scene===2?p.cream:scene===5?p.coral:scene===6?p.amber:p.petrol;
 const glow=ctx.createRadialGradient(x,y,0,x,y,radius);
 glow.addColorStop(0,rgba(tint,night()?.12:.085));
 glow.addColorStop(.42,rgba(tint,night()?.045:.026));
 glow.addColorStop(1,rgba(tint,0));
 ctx.save();ctx.globalAlpha*=value*.72+field.strength*.075;ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);ctx.restore();
}
/* Señales ambientales: viven en un lienzo independiente y nunca modifican
   la coreografía, la orientación ni el destino de una sola pieza. */
function idleGlow(x,y,color,opacity=1,r=18){
 if(opacity<=.005||!Number.isFinite(x)||!Number.isFinite(y))return;
 const halo=idleCtx.createRadialGradient(x,y,.4,x,y,r);
 halo.addColorStop(0,rgba(color,.45*opacity));
 halo.addColorStop(.32,rgba(color,.19*opacity));
 halo.addColorStop(1,rgba(color,0));
 idleCtx.fillStyle=halo;idleCtx.beginPath();idleCtx.arc(x,y,r,0,Math.PI*2);idleCtx.fill();
 idleCtx.fillStyle=rgba(color,.80*opacity);
 idleCtx.beginPath();idleCtx.arc(x,y,W<700?1.5:2.1,0,Math.PI*2);idleCtx.fill();
}
function idleBeacon(x,y,color,t,index=0,opacity=1){
 const wave=.5+.5*Math.sin(t*1.15+index*2.1),strength=(.48+.48*wave)*opacity;
 idleGlow(x,y,color,strength,W<700?13:21);
 idleCtx.beginPath();idleCtx.arc(x,y,(W<700?3.3:4.3)+wave*3,0,Math.PI*2);
 idleCtx.strokeStyle=rgba(color,.22*(1-wave*.52)*opacity);
 idleCtx.lineWidth=.85;idleCtx.stroke();
}
function idleCubic(a,c1,c2,b,t){
 const v=1-t;return{
  x:v*v*v*a.x+3*v*v*t*c1.x+3*v*t*t*c2.x+t*t*t*b.x,
  y:v*v*v*a.y+3*v*v*t*c1.y+3*v*t*t*c2.y+t*t*t*b.y
 };
}
function idleFlow(point,color,t,offset=0,opacity=1,extent=1){
 if(opacity<=.005||extent<=.03)return;
 const phase=(t*.085+offset)%1,q=phase*extent;
 // Desvanecer la señal al cerrar el recorrido evita saltos visibles en el bucle.
 const visibility=smooth(0,.07,phase)*(1-smooth(.92,1,phase));
 const strength=opacity*visibility,tail=Math.min(.048*extent,q);
 const start=point(Math.max(0,q-tail)),end=point(q);
 idleCtx.beginPath();idleCtx.moveTo(start.x,start.y);idleCtx.lineTo(end.x,end.y);
 idleCtx.strokeStyle=rgba(color,.48*strength);idleCtx.lineWidth=W<700?1:1.3;
 idleCtx.lineCap='round';idleCtx.stroke();
 idleGlow(end.x,end.y,color,.80*strength,W<700?12:19);
}
function drawIdleSceneAmbient(scene,u,p,t){
 const reveal=smooth(.08,.35,u);
 if(scene===0){
  // Un pulso enlaza TAREA → IDEA → FORMA; cada nodo responde cuando lo alcanza.
  const circuit=openingCircuitGeometry(),travel=(t*.085)%1;
  const scrollProgress=smooth(.06,.84,u);
  const openingRest=(1-smooth(.02,.22,scrollProgress))*smooth(.48,.92,introReveal.value);
  const fieldMotion=idleMotion.value*openingRest;
  // La línea inferior permanece como apoyo; la actividad principal vive en los grupos.
  idleFlow(circuit.pointAt,p.coral,t,.08,.38,1);
  circuit.anchors.forEach((anchor,group)=>{
   const target=[.06,.50,.94][group],raw=Math.abs(travel-target);
   const distance=Math.min(raw,1-raw);
   const activation=Math.exp(-Math.pow(distance/.105,2));
   const color=group===1?p.coral:p.amber;
   idleBeacon(anchor.x,anchor.y,color,t,group,.16+activation*.30);
   const center=openingGroupCenter(group),drift=openingGroupDrift(group,t,fieldMotion);
   idleGlow(center.x+drift.x,center.y+drift.y,color,
    .055+activation*.11,W<700?24:38);
  });
 }else if(scene===1){
  const {mobile,nodes,segments,bezier}=scene1Geometry();
  const extent=smooth(.025,.89,u);
  // Un único paquete cruza los dos tramos. El mismo reloj activa
  // los nodos y sus módulos: no son luces independientes.
  const path=q=>{
   const index=q<.5?0:1;
   return bezier(segments[index],index===0?q*2:(q-.5)*2);
  };
  idleFlow(path,p.coral,t,0,1.05*reveal,extent);
  nodes.forEach((q,i)=>{
   const arrival=chapterPulse([.04,.47,.89][i],t);
   idleBeacon(q.x,q.y,i===1?p.coral:p.amber,t,i,
    (.32+.50*arrival)*extent*reveal);
  });
  // Un pulso fino desciende por el eje central, reforzando la lectura vertical.
  const gapY=H*(mobile?.027:.035),moduleSize=mobile?9:18;
  const groupBase=H*(mobile?.625:.667)-H*.018;
  const firstRowY=groupBase-3*gapY,moduleTop=firstRowY-moduleSize/2;
  const terminalHalf=mobile?4:5,terminalY=moduleTop-terminalHalf-4;
  const branchStart=nodes[1].y+(mobile?8:10),branchEnd=terminalY-terminalHalf;
  idleFlow(q=>({x:nodes[1].x,y:lerp(branchStart,branchEnd,q)}),
   p.coral,t,.48,.34*extent*reveal,extent);
 }else if(scene===2){
  const compact=H<620,cx=W*.5,cy=H*(compact?.75:W<700?.66:.64);
  const cloud=[4,11,17,23,29,37,43,51];
  cloud.forEach((i,j)=>{
   const q=cloudPoint(i);
   const x=lerp(cx,q.x,smooth(.20,.65,u)),y=lerp(cy,q.y,smooth(.20,.65,u));
   idleBeacon(x,y,j%3===0?p.coral:j%2?p.cream:p.amber,t,j,.64*reveal);
  });
 }else if(scene===3){
  const compact=H<620,mobile=W<700;
  const size=Math.min(W*(mobile?.92:.84),1120),height=mobile?H*.16:H*.275;
  const cy=H*(compact?(mobile?.65:.58):(mobile?.70:.565));
  [31,222,489,850,1200,1780,2400,3200].forEach((i,j)=>{
   const q=wordPoint(i),x=W*.5+q.x*size,y=cy+q.y*height*2;
   idleBeacon(x+Math.sin(t*.55+j)*2*idleMotion.value,y,
    j%3===0?p.coral:p.olive,t,j,.68*reveal);
  });
 }else if(scene===4){
  const compact=H<620,mobile=W<700;
  const cx=W*.5,cy=H*(compact?.70:.64);
  const r=Math.min(W*(compact?.30:mobile?.34:.255),H*(compact?.22:.33));
  const show=smooth(.13,.68,u)*reveal;
  [0,1,2].forEach(i=>{
   const phase=t*.21*idleMotion.value+i*Math.PI*2/3;
   const x=cx+Math.cos(phase)*r*.76,y=cy+Math.sin(phase)*r*.42;
   idleGlow(x,y,i===1?p.coral:p.amber,.66*show,W<700?12:18);
  });
  // Reflejos adheridos a la superficie: hacen visible la rotación tridimensional.
  const count=mobile?2100:N,spin=t*.235*idleMotion.value,pitch=Math.sin(t*.31)*.085*idleMotion.value;
  [120,420,760,1100,1460,1980].forEach((index,j)=>{
   const a=spherePoint(index,1,count,spin,pitch),near=1+.15*a.z;
   const x=cx+a.x*r*near,y=cy-a.y*r*near;
   const front=smooth(-.24,.34,a.z);
   idleGlow(x,y,j%3===0?p.coral:p.cream,.62*show*front,W<700?9:14);
  });
 }else if(scene===5){
  // Los reflejos siguen exactamente las mismas rutas que se despliegan con el scroll.
  scene5Routes(u,p).forEach((route,i)=>{
   idleFlow(q=>idleCubic(route.start,route.c1,route.c2,route.end,q),
    route.accent,t,i*.32,.98*reveal,route.progress);
   idleBeacon(route.end.x,route.end.y,route.accent,t,i,.58*route.progress*reveal);
  });
 }else if(scene===6){
  const extent=smooth(.40,.78,u)*u;
  idleFlow(ribbonCurvePoint,p.amber,t,.18,1.02*reveal,extent);
  idleFlow(ribbonCurvePoint,p.petrol,t,.70,.78*reveal,extent);
 }else if(scene===7){
  const visibility=smooth(.08,.34,u)*(1-smooth(.64,.95,u));
  [4,19].forEach((index,i)=>{
   const base=H*(.55+.15*index/34),phase=index*.19,spread=smooth(.10,.48,u);
   const point=q=>{
    const old=ribbonCurvePoint(q),targetX=-W*.075+W*1.15*q;
    const targetY=base+H*(.035+.022*Math.sin(index*.45))*Math.sin(q*9.4+u*7.4+phase)+H*.06*Math.cos(q*4+phase);
    return {x:lerp(old.x,targetX,spread),y:lerp(old.y,targetY,spread)};
   };
   idleFlow(point,i?p.amber:p.coral,t,.22+i*.46,.85*visibility);
  });
 }
}
function drawIdleAmbient(now){
 idleCtx.setTransform(idleDPR,0,0,idleDPR,0,0);
 idleCtx.clearRect(0,0,W,H);
 if(!ambientRunning||prefersReduced.matches||!root.classList.contains('is-linked'))return;
 const t=idleMotion.time;
 const scene=Math.min(7,Math.floor(clamp(play.t,0,7.9999)));
 const raw=clamp(play.t-scene);
 const u=scene===1?smooth(.015,.91,raw):scene===5?smooth(.015,.97,raw):smooth(.015,.72,raw);
 const p=PAL[night()?'night':'day'];
 const fade=clamp(idleMotion.value*1.2);
 const dissolve=scene<7?smooth(.62,.995,raw):0;
 if(fade<=.002)return;
 // El mismo fundido de la escena principal gobierna las señales ambientales.
 idleCtx.save();idleCtx.globalAlpha*=fade*(1-dissolve);
 drawIdleSceneAmbient(scene,u,p,t);
 idleCtx.restore();
 if(scene<7&&dissolve>.001){
  idleCtx.save();idleCtx.globalAlpha*=fade*dissolve;
  drawIdleSceneAmbient(scene+1,0,p,t);
  idleCtx.restore();
 }
}
function circle(x,y,r,color,opacity=1){
 if(r<=0)return;
 ctx.save();ctx.globalAlpha*=opacity;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();
}
function strokeCircle(x,y,r,color,width=1,opacity=1){
 if(r<=0)return;
 ctx.save();ctx.globalAlpha*=opacity;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();
 ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function typography(text,size,x,y,color,weight='800',stroke=false,alpha=1){
 ctx.save();ctx.globalAlpha*=alpha;ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.font=weight+' '+size+'px "Instrument Sans",sans-serif';
 if(stroke){ctx.strokeStyle=color;ctx.lineWidth=1;ctx.strokeText(text,x,y)}
 else{ctx.fillStyle=color;ctx.fillText(text,x,y)}
 ctx.restore();
}
function drawHairlines(c,brightness=.15){
 const s=Math.min(W,H),cy=H*.64;
 line(W*.055,cy,W*.945,cy,c,1,brightness);
 line(W*.5,cy-s*.19,W*.5,cy+s*.19,c,1,brightness*.54);
 for(let i=0;i<15;i++){
  let x=W*(.055+i*.89/14);
  line(x,cy-3,x,cy+3,c,1,brightness*.7);
 }
}
/* Todas las escenas comparten la misma familia modular: proporciones variadas,
   sin fichas rígidas ni logos explicativos. El índice mantiene identidad y color. */
// La paleta se construye una vez por tema en lugar de en cada pieza.
const modulePalettes={};
function modulePalette(p){
 const clave=night()?'night':'day';
 let valor=modulePalettes[clave];
 if(!valor){
  valor=[night()?'#5A9D72':'#347953',p.amber,p.petrol,p.coral,p.clay,p.olive,p.stone,p.ash];
  modulePalettes[clave]=valor;
 }
 return valor;
}
function sceneDisorderColor(i,p){
 const colors=modulePalette(p),batch=Math.floor(i/colors.length),slot=i%colors.length;
 // Cada bloque de ocho piezas contiene toda la paleta, pero en un orden distinto.
 // Así las columnas dejan de leerse por color sin perder el equilibrio cromático.
 const shift=Math.floor(hash(batch*19+7)*colors.length),stride=batch%2?3:5;
 return colors[(slot*stride+shift)%colors.length];
}
function barAspect(){return W<700?2.1:3.55}
/* Lenguaje de encaje compartido: mismo módulo, mismo destino, giro reversible.
   Cada gesto vale exactamente cero en ambos extremos del recorrido y nunca
   altera la geometría ni las duraciones fijadas en la línea de tiempo. */
function fitGesture(scene,i,progress,scale=.95){
 if(prefersReduced.matches)return {turn:0,tilt:0,compression:1,lift:0};
 const t=clamp(progress),pulse=Math.sin(Math.PI*t);
 const recovery=Math.sin(Math.PI*smooth(.63,1,t))*smooth(.63,.78,t);
 const sign=hash(i*19+43)>.5?1:-1;
 const strength=[.27,.21,.35,.16,.115,.51,.38,.18][scene]||.18;
 const variation=.78+.42*hash(i*23+27);
 const wave=pulse*(.82+.18*Math.sin(t*Math.PI*1.6));
 return {
  turn:sign*strength*variation*(wave-.28*recovery),
  tilt:sign*(.12+.055*hash(i*11+31))*pulse,
  compression:1-.055*pulse+.025*recovery,
  lift:Math.min(W<700?3.2:6.5,scale*.42+2)*pulse*(.75+.35*hash(i+7))
 };
}
function orientGesture(pose){
 if(!pose||prefersReduced.matches)return;
 ctx.rotate(pose.turn);
 const bend=pose.tilt;
 ctx.transform(1-Math.abs(bend)*.42,bend*.27,bend,1-Math.abs(bend)*.21,0,0);
}
function combinedGesture(scene,i,first,second,firstWeight=.6,size=12){
 const a=fitGesture(scene,i,first,size),b=fitGesture(scene,i,second,size);
 return {turn:a.turn*firstWeight+b.turn,tilt:a.tilt*firstWeight+b.tilt,
  compression:1+(a.compression-1)*firstWeight+(b.compression-1),
  lift:a.lift*firstWeight+b.lift};
}
function drawModule(i,x,y,size,p,opacity=1,rotation=0,aspect=1,colorOverride=null,depthEnabled=true,pose=null){
 if(opacity<=.001)return;
 const color=colorOverride||modulePalette(p)[moduleMeta(i).column];
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);orientGesture(pose);ctx.globalAlpha*=clamp(opacity);
 // En las escenas de apilado, las formas se convierten gradualmente en barras.
 // La extrusión se mantiene corta para dar volumen sin convertir cada pieza en un cubo.
 const blockMix=smooth(1.02,barAspect(),aspect);
 if(blockMix>.001){
  const bw=size*aspect*(.98+.04*hash(i*4+16));
  const bh=size*(.94+.08*hash(i*4+18));
  if(depthEnabled){
   ctx.save();ctx.globalAlpha*=blockMix;
   drawBeveledBlock(0,0,bw,bh,Math.min(3.5,size*.13),color,p,sceneAmbient.value*blockMix);
   ctx.restore();
  }else rounded(-bw/2,-bh/2,bw,bh,Math.min(3.5,size*.13),color,blockMix);
 }
 if(blockMix<.999){
  ctx.save();ctx.globalAlpha*=1-blockMix;
  const width=size*(.76+.72*hash(i*4+16)),height=size*(.68+.54*hash(i*4+18));
  const form=i%13;
  if(depthEnabled){
   ctx.shadowColor=night()?'rgba(0,0,0,.28)':'rgba(24,39,38,.17)';
   ctx.shadowBlur=Math.max(.7,size*.16);ctx.shadowOffsetX=size*.035;ctx.shadowOffsetY=size*.075;
  }
  const face=ctx.createLinearGradient(-width/2,-height/2,width/2,height/2);
  face.addColorStop(0,depthEnabled?mix(color,p.cream,.16):color);
  face.addColorStop(.62,color);
  face.addColorStop(1,depthEnabled?mix(color,p.bg[0],.14):color);
  if(form===0||form===9){
   ctx.lineWidth=1.45;ctx.strokeStyle=depthEnabled?mix(color,p.bg[0],.22):color;
   ctx.strokeRect(-width/2,-height/2,width,height);
   if(depthEnabled&&size>7){
    ctx.save();ctx.globalAlpha*=.34+sceneAmbient.value*.14;
    ctx.strokeStyle=p.cream;ctx.lineWidth=.68;
    ctx.beginPath();ctx.moveTo(-width*.38,-height*.34);ctx.lineTo(width*.38,-height*.34);
    ctx.moveTo(-width*.38,-height*.34);ctx.lineTo(-width*.38,height*.30);ctx.stroke();
    ctx.globalAlpha*=.62;ctx.strokeStyle=mix(color,p.bg[0],.52);ctx.lineWidth=.62;
    ctx.beginPath();ctx.moveTo(width*.38,-height*.24);ctx.lineTo(width*.38,height*.34);
    ctx.lineTo(-width*.28,height*.34);ctx.stroke();ctx.restore();
   }
  }else if(form===4||form===11){
   const sphere=ctx.createRadialGradient(-width*.16,-height*.18,0,0,0,width*.48);
   sphere.addColorStop(0,depthEnabled?mix(color,p.cream,.34):color);
   sphere.addColorStop(.58,color);sphere.addColorStop(1,depthEnabled?mix(color,p.bg[0],.24):color);
   ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(0,0,width*.39,0,Math.PI*2);ctx.fill();
   if(depthEnabled&&size>8){
    ctx.save();ctx.globalAlpha*=.34;ctx.strokeStyle=p.cream;ctx.lineWidth=.62;
    ctx.beginPath();ctx.arc(-width*.045,-height*.045,width*.29,Math.PI*1.08,Math.PI*1.72);ctx.stroke();
    ctx.restore();
   }
  }else if(form===7){
   ctx.fillStyle=face;ctx.beginPath();
   ctx.moveTo(-width/2,-height/2);ctx.lineTo(width/2,-height/2);
   ctx.lineTo(width/2,height*.16);ctx.lineTo(width*.15,height*.16);
   ctx.lineTo(width*.15,height/2);ctx.lineTo(-width/2,height/2);ctx.closePath();ctx.fill();
   if(depthEnabled){ctx.strokeStyle=mix(color,p.bg[0],.28);ctx.lineWidth=.68;ctx.stroke();}
  }else{
   ctx.fillStyle=face;ctx.beginPath();
   ctx.roundRect(-width/2,-height/2,width,height,Math.min(3,size*.11));ctx.fill();
   if(depthEnabled){ctx.strokeStyle=mix(color,p.cream,.20);ctx.lineWidth=.62;ctx.stroke();}
  }
  ctx.restore();
 }
 ctx.restore();
}
function loosePoint(i){
 return {x:W*(.17+.66*hash(i*3+47)),y:H*(.49+.35*hash(i*3+71))};
}
function groupedPoint(i){
 const group=i%3,col=Math.floor(i/3)%4,row=Math.floor(i/12);
 const gap=Math.min(W*.047,32);
 return {x:W*(.19+group*.155)+(col-1.5)*gap,
         y:H*(.57+group*.035)+(row-1.2)*gap};
}
function cloudPoint(i,count){
 const radius=Math.sqrt(hash(i*9+6)),angle=hash(i*9+7)*Math.PI*2;
 return {x:W*.50+Math.cos(angle)*radius*W*(W<700?.38:.34),
         y:H*.64+Math.sin(angle)*radius*H*(W<700?.185:.205),
         size:W<700?8:15,rotation:(hash(i+72)-.5)*.12};
}
const MODULE_COUNT=56;
const CHART_COUNTS=[9,8,4,5,9,9,6,6];
const MODULE_META=(()=>{
 const tabla=[];
 for(let i=0;i<MODULE_COUNT;i++){
  let offset=i,column=0,row=0;
  for(column=0;column<CHART_COUNTS.length;column++){
   if(offset<CHART_COUNTS[column]){row=offset;break;}
   offset-=CHART_COUNTS[column];
  }
  tabla.push({column,row});
 }
 return tabla;
})();
function moduleMeta(i){return MODULE_META[i]||{column:7,row:5}};
function stackPoint(i,chart=false){
 const mobile=W<700,m=moduleMeta(i),aspect=barAspect();
 // Las ocho columnas comparten el centro geométrico del lienzo en ambas
 // composiciones; así la gráfica final no queda desplazada hacia la derecha.
 const cellW=W*(chart?(mobile?.055:.058):(mobile?.075:.071));
 const gapX=W*(chart?(mobile?.009:.012):(mobile?.010:.014));
 const total=8*cellW+7*gapX;
 const left=(W-total)/2;
 const x=left+m.column*(cellW+gapX)+cellW/2;
 const cellH=mobile?Math.min(H*.021,W*.043):Math.min(H*.032,W*.055);
 const size=Math.min(cellH*.92,cellW/(aspect*1.04));
 const gapY=cellH*.16,base=H*(chart?.84:.83);
 return {x,y:base-(m.row+.5)*(cellH+gapY),size,rotation:0};
}
function scatteredPoint(i){
 const angle=i*2.399963,radial=.24+.72*Math.sqrt(hash(i+91));
 return {x:W*.5+Math.cos(angle)*W*.37*radial,
  y:H*.60+Math.sin(angle)*H*.20*radial,
  size:W<700?10:21,rotation:(hash(i+33)-.5)*.32};
}
// La geometría del campo y el movimiento de las piezas comparten los mismos centros.
// En móvil vertical el sistema sube ligeramente para cerrar el vacío bajo el titular.
function openingGroupCenter(group){
 const portraitMobile=W<700&&H>W*1.2,compact=H<620&&W<900;
 return {
  x:W*(.23+group*.27),
  y:H*(portraitMobile?(group===1?.57:.59):
   compact?(group===1?.64:.66):(group===1?.60:.62))
 };
}
function openingGroupDrift(group,phase=idleMotion.time,strength=idleMotion.value){
 return {
  x:Math.sin(phase*.145+group*1.9)*2.4*strength,
  y:Math.cos(phase*.17+group*1.7)*2.0*strength
 };
}
function openingGroupOrbit(group,phase,motion){
 if(group===0)return Math.sin(phase*.18+.35)*.105*motion;
 if(group===1)return Math.sin(phase*.17+.75)*.20*motion;
 return Math.sin(phase*.18+2.15)*.11*motion;
}
// La entrada tiene tres tiempos solapados: cada conjunto aparece, encuentra
// su posición y sólo después entrega el movimiento al sistema de conexiones.
function openingGroupEntry(group,value=introReveal.value,stagger=0){
 const start=[.025,.115,.205][group];
 return {
  // Un único acontecimiento: las tres corrientes se solapan, no tres «diapositivas».
  reveal:smooth(start+stagger,start+.23+stagger,value),
  formation:smooth(start+.025+stagger,start+.58+group*.045+stagger,value)
 };
}
// Una señal recorre el mismo organismo e impulsa cada grupo a su llegada.
function openingPulse(group,phase){
 const cycle=(phase*.14)%1,mark=[.04,.47,.88][group];
 const raw=Math.abs(cycle-mark),distance=Math.min(raw,1-raw);
 return Math.exp(-Math.pow(distance/.105,2));
}
// Cada capítulo puede tener un ritmo propio; la señal visual y la respuesta
// de los módulos comparten exactamente este reloj (sin nuevos tweens).
function chapterPulse(position,phase,rate=.085,width=.10){
 const travel=((phase*rate)%1+1)%1;
 const diff=Math.abs(travel-position),distance=Math.min(diff,1-diff);
 return Math.exp(-Math.pow(distance/width,2));
}
function traceOpeningCurve(path,progress){
 const amount=clamp(progress);
 if(amount<=.001)return;
 const steps=Math.max(3,Math.ceil(52*amount));
 ctx.beginPath();
 for(let i=0;i<=steps;i++){
  const point=idleCubic(path.a,path.c1,path.c2,path.b,amount*i/steps);
  if(i===0)ctx.moveTo(point.x,point.y);else ctx.lineTo(point.x,point.y);
 }
}
// Primera impresión: tres concentraciones de piezas reconocibles, aún
// sin conectar. El scroll las reorganiza en el mismo stackPoint con el que
// comienza el siguiente capítulo (no se altera la continuidad entre escenas).
function openingPoint(i){
 const group=i%3,local=Math.floor(i/3),col=local%4,row=Math.floor(local/4);
 const dx=W*(W<700?.036:.032),dy=H*(W<700?.031:.038),center=openingGroupCenter(group);
 let x,y;
 if(group===0){
  // Tarea: una retícula con pequeñas desviaciones, como piezas acumuladas.
  x=center.x+(col-1.5)*dx-(row%2)*dx*.14;
  y=center.y+(row-2)*dy;
 }else if(group===1){
  // Idea: un núcleo abierto; las piezas orbitan sin encontrar todavía un eje.
  const angle=local*2.399963,spread=Math.sqrt((local+.5)/19);
  x=center.x+Math.cos(angle)*dx*2.3*spread;
  y=center.y+Math.sin(angle)*dy*2.25*spread;
 }else{
  // Forma: piezas cercanas a una retícula, todavía con un pequeño desfase.
  x=center.x+(col-1.5)*dx+row*dx*.16;
  y=center.y+(row-2)*dy+(col-1.5)*dy*.27;
 }
 return {x:x+(hash(i*3+9)-.5)*dx*.12,
  y:y+(hash(i*5+4)-.5)*dy*.11,
  size:W<700?12:20,rotation:(hash(i+33)-.5)*.10};
}
function openingCircuitGeometry(){
 const portraitMobile=W<700&&H>W*1.2;
 const y=H*(portraitMobile?.755:W<700?.79:.785);
 const anchors=[{x:W*.23,y},{x:W*.50,y},{x:W*.77,y}];
 const curves=[
  {a:anchors[0],c1:{x:W*.34,y:y+H*.035},c2:{x:W*.41,y:y+H*.035},b:anchors[1]},
  {a:anchors[1],c1:{x:W*.59,y:y-H*.035},c2:{x:W*.66,y:y-H*.035},b:anchors[2]}
 ];
 const pointAt=q=>{
  q=clamp(q);
  const index=q<.5?0:1,t=q<.5?q*2:(q-.5)*2,s=curves[index],v=1-t;
  return {
   x:v*v*v*s.a.x+3*v*v*t*s.c1.x+3*v*t*t*s.c2.x+t*t*t*s.b.x,
   y:v*v*v*s.a.y+3*v*v*t*s.c1.y+3*v*t*t*s.c2.y+t*t*t*s.b.y
  };
 };
 return {anchors,curves,pointAt};
}
function drawOpeningCircuit(p,alpha=1,progress=1){
 if(alpha<=.002)return;
 const {anchors,curves}=openingCircuitGeometry(),mobile=W<700,portraitMobile=mobile&&H>W*1.2;
 ctx.save();ctx.globalAlpha*=alpha;
 ctx.lineCap='round';ctx.lineJoin='round';
 // El circuito inferior se dibuja en dos entregas: TAREA → IDEA y después IDEA → FORMA.
 curves.forEach((curve,index)=>{
  const trace=clamp(progress*2-index);
  if(trace<=.001)return;
  traceOpeningCurve(curve,trace);
  ctx.strokeStyle=rgba(night()?p.olive:p.petrol,night()?.42:.45);ctx.lineWidth=mobile?1:1.25;ctx.stroke();
  traceOpeningCurve(curve,trace);
  ctx.strokeStyle=rgba(p.cream,night()?.16:.50);ctx.lineWidth=.55;ctx.stroke();
 });
 ctx.restore();
 const branchTop=H*(portraitMobile?.685:H<620&&W<900?.765:mobile?.715:.72);
 const labelY=H*(portraitMobile?.45:H<620&&W<900?.45:mobile?.475:.485),labelSize=mobile?8.5:10;
 ['TAREA','IDEA','FORMA'].forEach((label,i)=>{
  const entry=openingGroupEntry(i),nodeReveal=smooth(.58,.97,entry.formation);
  if(nodeReveal<=.001)return;
  const a=anchors[i],groupAlpha=alpha*nodeReveal;
  line(a.x,branchTop,a.x,a.y,p.olive,mobile?.75:1,.34*groupAlpha);
  strokeCircle(a.x,a.y,mobile?4.2:5.2,p.olive,.8,.46*groupAlpha);
  circle(a.x,a.y,i===1?2.3:1.8,i===1?p.coral:p.amber,.9*groupAlpha);
  const labelAlpha=alpha*smooth(.71,.99,entry.formation);
  if(labelAlpha<=.001)return;
  typography(label,labelSize,a.x,labelY,p.ink,'600',false,.76*labelAlpha);
  line(a.x-(mobile?19:24),labelY+10,a.x+(mobile?19:24),labelY+10,
   i===1?p.coral:p.olive,.7,.38*labelAlpha);
 });
}
function groupedModulePoint(i){
 // Tres conjuntos visibles, con una retícula modular clara y espacio entre ellos.
 // La composición se lee como piezas relacionadas, no como una nube de partículas.
 const group=i%3,local=Math.floor(i/3),col=local%3,row=Math.floor(local/3);
 const gapX=W*(W<700?.026:.032),gapY=H*(W<700?.027:.035);
 return {x:W*(.25+group*.25)+(col-1)*gapX,
  y:H*(W<700?.625:.667)+(group===1?-.018:.018)*H+(row-3)*gapY,
  size:W<700?9:18,rotation:(hash(i+15)-.5)*.035};
}
function wordModulePoint(i){
 const q=wordPoint(i),size=Math.min(W*(W<700?.92:.84),1120);
 return {x:W*.5+q.x*size,y:H*(H<620?(W<700?.65:.58):(W<700?.70:.565))+q.y*H*(W<700?.32:.55),
  size:W<700?6:11,rotation:0};
}
function sphereModulePoint(i,u=1){
 const mobile=W<700,compact=H<620,cx=W*.5,cy=H*(compact?.70:.64);
 const R=Math.min(W*(compact?.30:mobile?.34:.255),H*(compact?.22:.33));
 // Reutiliza la proyección exacta de draw4: giro, inclinación y perspectiva
 // comparten origen, fase y respuesta al puntero con la nube de partículas.
 const v=smooth(.035,.79,u),idle=idleMotion.value,phase=idleMotion.time;
 const formation=smooth(.42,.88,v),pointerField=pointerInfluenceAt(cx,cy,R*2.25);
 const pointerX=pointer.active?(pointer.x-cx)/Math.max(W*.5,1):0;
 const pointerY=pointer.active?(pointer.y-cy)/Math.max(H*.5,1):0;
 const spin=phase*.235*idle*formation+
  pointerX*.14*pointerField.strength+pointer.dirX*pointer.speed*.08*pointerField.strength;
 const pitch=Math.sin(phase*.31)*.085*idle*formation+
  pointerY*.11*pointerField.strength+pointer.dirY*pointer.speed*.06*pointerField.strength;
 const roll=Math.sin(phase*.22)*.022*idle*formation;
 const a=spherePoint(i,u,MODULE_COUNT,spin,pitch),near=1+.15*a.z;
 const rotatedX=a.x*Math.cos(roll)-a.y*Math.sin(roll);
 const rotatedY=a.y*Math.cos(roll)+a.x*Math.sin(roll);
 let x=cx+rotatedX*R*near,y=cy-rotatedY*R*near;
 const size=mobile?7:13,distance=Math.hypot(x-cx,y-cy);
 // El centro de cada pieza queda dentro del campo visible y conserva
 // un margen suficiente para que sus bordes no sobresalgan del volumen.
 const safeRadius=Math.max(0,R*1.035-size*.95);
 if(distance>safeRadius){
  const inset=safeRadius/distance;
  x=cx+(x-cx)*inset;y=cy+(y-cy)*inset;
 }
 return {x,y,size,rotation:(hash(i+23)-.5)*.12};
}
function platformModulePoint(i){return expansionPoint(i)}
function chartPoint(i){return stackPoint(i,true)}
function scene5Geometry(){
 const mobile=W<700,compact=H<620,compactMobile=mobile&&compact;
 const positions=compactMobile?[
  {cx:.20,cy:.66},{cx:.50,cy:.49},{cx:.80,cy:.66},{cx:.50,cy:.86}
 ]:mobile?[
  {cx:.20,cy:.70},{cx:.50,cy:.49},{cx:.80,cy:.70},{cx:.50,cy:.88}
 ]:compact?[
  {cx:.22,cy:.65},{cx:.50,cy:.52},{cx:.78,cy:.65},{cx:.50,cy:.83}
 ]:[
  {cx:.22,cy:.61},{cx:.50,cy:.43},{cx:.78,cy:.61},{cx:.50,cy:.82}
 ];
 return positions.map((q,i)=>({
  ...q,
  rx:i===3?(mobile?.12:.135):(mobile?.105:.118),
  ry:i===3?(mobile?.058:.076):(mobile?.056:.074)
 }));
}
function scene5Motion(group){
 // Giro de guiñada muy contenido: cada placa cambia de orientación sin
 // llegar a ponerse de canto. El movimiento oscila lentamente, no se vence.
 // La fase se conserva al desplazar y volver a detener el scroll.
 const rates=[.31,-.27,.34];
 const spin=group<3?Math.sin(idleMotion.time*rates[group])*.12:0;
 return {spin};
}
function scene5Deployment(group,u=1){
 const timing=[
  {start:.08,end:.84,angle:-.28},
  {start:.14,end:.89,angle:.12},
  {start:.20,end:.94,angle:.28},
  {start:.015,end:.34,angle:0}
 ][clamp(group,0,3)];
 const progress=smooth(timing.start,timing.end,u);
 return {
  progress,
  angle:timing.angle*(1-progress),
  lift:group===3?(1-progress)*H*.012:Math.sin(progress*Math.PI)*H*.014
 };
}
function scene5Project(group,x,y,progress=1){
 const geometry=scene5Geometry(),g=geometry[clamp(group,0,3)],base=geometry[3];
 const cx=W*g.cx,cy=H*g.cy,deployment=scene5Deployment(group,progress);
 const scale=group===3?lerp(.90,1,deployment.progress):lerp(.13,1,deployment.progress);
 const dx=x-cx,dy=y-cy,angle=deployment.angle;
 const localX=cx+(dx*Math.cos(angle)-dy*Math.sin(angle))*scale;
 const localY=cy+(dx*Math.sin(angle)+dy*Math.cos(angle))*scale;
 let px=localX,py=localY;
 if(group!==3){
  // Las alas nacen juntas en el núcleo y se despliegan hacia sus destinos.
  const anchorX=W*base.cx,anchorY=H*(base.cy-base.ry*.54);
  const originX=anchorX+(localX-cx)*.12,originY=anchorY+(localY-cy)*.12;
  px=lerp(originX,localX,deployment.progress);
  py=lerp(originY,localY,deployment.progress)-deployment.lift;
 }else py+=deployment.lift;
 const projectX=px-cx,projectY=py-cy,{spin}=scene5Motion(group);
 // Giro rígido en el plano de la propia plataforma. La proyección isométrica
 // permanece intacta: no se estrecha, no cabecea y nunca parece volcarse.
 const cosine=Math.cos(spin),sine=Math.sin(spin);
 const projectedX=projectX*cosine+projectY*Math.sqrt(3)*sine;
 const projectedY=projectY*cosine-projectX*sine/Math.sqrt(3);
 return {x:cx+projectedX,y:cy+projectedY};
}
function scene5PlaneOffset(group,dx,dy,progress=1){
 const deployment=scene5Deployment(group,progress),angle=deployment.angle;
 const localX=dx*Math.cos(angle)-dy*Math.sin(angle);
 const localY=dx*Math.sin(angle)+dy*Math.cos(angle);
 const {spin}=scene5Motion(group),cosine=Math.cos(spin),sine=Math.sin(spin);
 // Las huellas giran con la superficie, pero los edificios conservan sus verticales.
 return {
  x:localX*cosine+localY*Math.sqrt(3)*sine,
  y:localY*cosine-localX*sine/Math.sqrt(3)
 };
}
function scene5GridPoint(group,slot,progress=1){
 const mobile=W<700,g=scene5Geometry()[clamp(group,0,3)];
 const col=slot%4,row=Math.floor(slot/4);
 const size=mobile?Math.max(7,Math.min(W*.027,H*.036)):Math.max(10,Math.min(W*.020,H*.026));
 const dx=size*(mobile?1.25:1.42),dy=size*.68;
 const x=W*g.cx+(col-row)*dx,y=H*g.cy+(col+row-3)*dy;
 return {...scene5Project(group,x,y,progress),size,rotation:0,group,slot};
}
function expansionPoint(i,progress=1){return scene5GridPoint(Math.floor(i/14),i%14,progress)}
function ribbonCurvePoint(q){
 // Una sola curva gobierna el trazo y la posición final de cada módulo.
 // En reposo recibe una onda de profundidad mínima, compartida por línea y piezas.
 q=clamp(q);
 const phase=idleMotion.time;
 const depth=(Math.sin(q*7.8+phase*.62)+.45*Math.sin(q*3.2-phase*.39))*H*.0038*idleMotion.value;
 return {x:W*(.16+.68*q),
  y:H*(.63+.075*Math.sin(q*9.4+1.3)+.045*Math.cos(q*4.1))+depth};
}
function ribbonPoint(i){
 const q=i/(MODULE_COUNT-1);
 return {...ribbonCurvePoint(q),
  size:W<700?5:10,rotation:(hash(i+4)-.5)*.2};
}
function centerPoint(i){
 return {x:W*.5+(hash(i+10)-.5)*2,y:H*.66+(hash(i+20)-.5)*2,
  size:W<700?2:3,rotation:0};
}
const MODULE_LAYOUTS=[stackPoint,scatteredPoint,groupedModulePoint,cloudPoint,
 wordModulePoint,sphereModulePoint,platformModulePoint,chartPoint,ribbonPoint,centerPoint];
function openingFieldGeometry(motion=0,phase=idleMotion.time){
 const compact=H<620&&W<900,mobile=W<700;
 // Los centros derivan exactamente lo mismo que las piezas; la órbita ya no queda fija detrás.
 const centers=[0,1,2].map(group=>{
  const base=openingGroupCenter(group),drift=openingGroupDrift(group,phase,motion);
  return {x:base.x+drift.x,y:base.y+drift.y};
 });
 const orbits=[
  {rx:W*(mobile?.085:.067),ry:H*(compact?.095:.10),rotation:-.34,start:-2.72,end:1.18},
  {rx:W*(mobile?.12:.105),ry:H*(compact?.112:.115),rotation:.28,start:-.76,end:2.62},
  {rx:W*(mobile?.085:.067),ry:H*(compact?.095:.10),rotation:.39,start:-2.18,end:1.72}
 ];
 const paths=[
  {a:{x:centers[0].x+W*.035,y:centers[0].y-H*.018},
   c1:{x:lerp(centers[0].x,centers[1].x,.41),y:H*(compact?.47:.425)},
   c2:{x:lerp(centers[0].x,centers[1].x,.70),y:H*(compact?.47:.445)},
   b:{x:centers[1].x-W*.055,y:centers[1].y+H*.018}},
  {a:{x:centers[1].x+W*.055,y:centers[1].y+H*.018},
   c1:{x:lerp(centers[1].x,centers[2].x,.30),y:H*(compact?.75:.735)},
   c2:{x:lerp(centers[1].x,centers[2].x,.63),y:H*(compact?.75:.735)},
   b:{x:centers[2].x-W*.035,y:centers[2].y-H*.018}}
 ];
 return {centers,orbits,paths};
}
function drawOpeningField(p,alpha=1,motion=0,progress=1){
 if(alpha<=.002)return;
 const phase=idleMotion.time,{centers,orbits,paths}=openingFieldGeometry(motion,phase);
 const fieldColor=night()?p.petrol:p.petrol;
 ctx.save();ctx.globalAlpha*=alpha;
 ctx.lineCap='round';ctx.lineJoin='round';
 // Las trayectorias se escriben en orden: primero llegan a IDEA y después continúan a FORMA.
 paths.forEach((path,index)=>{
  const trace=clamp(progress*2-index);
  if(trace<=.001)return;
  traceOpeningCurve(path,trace);
  ctx.strokeStyle=rgba(fieldColor,(night()?.145:.355)+motion*.045);ctx.lineWidth=W<700?.8:1.05;ctx.stroke();
  traceOpeningCurve(path,trace);
  ctx.strokeStyle=rgba(p.cream,(night()?.075:.095)+motion*.045);ctx.lineWidth=.48;ctx.stroke();
 });
 // Cada órbita se completa después de que su conjunto ya encontró posición.
 orbits.forEach((orbit,index)=>{
  const orbitReveal=smooth(index*.20,index*.20+.38,progress);
  if(orbitReveal<=.001)return;
  const pulse=.5+.5*Math.sin(phase*.24+index*1.75);
  const accent=index===1?p.coral:p.amber;
  const orbitAngle=orbit.rotation+openingGroupOrbit(index,phase,motion)+
   Math.sin(phase*.12+index*1.4)*.018*motion;
  const orbitScale=1+Math.sin(phase*.17+index*1.6)*.012*motion;
  const orbitEnd=lerp(orbit.start,orbit.end,orbitReveal);
  ctx.beginPath();
  ctx.ellipse(centers[index].x,centers[index].y,orbit.rx*orbitScale,orbit.ry*orbitScale,
   orbitAngle,orbit.start,orbitEnd);
  ctx.strokeStyle=rgba(fieldColor,(night()?.12:.255)+motion*.055+pulse*.025);
  ctx.lineWidth=W<700?.72:.92;ctx.stroke();
  // El satélite sólo aparece cuando el arco ya tiene recorrido suficiente.
  const q=(phase*[.085,.095,.080][index]+[.08,.39,.70][index])%1;
  const angle=lerp(orbit.start+.07,orbitEnd-.07,q);
  const lx=Math.cos(angle)*orbit.rx*orbitScale,ly=Math.sin(angle)*orbit.ry*orbitScale;
  const cosine=Math.cos(orbitAngle),sine=Math.sin(orbitAngle);
  const x=centers[index].x+lx*cosine-ly*sine;
  const y=centers[index].y+lx*sine+ly*cosine;
  const visibility=Math.pow(Math.max(0,Math.sin(Math.PI*q)),.38);
  const dotAlpha=alpha*(.25+motion*.60)*visibility*orbitReveal;
  ctx.save();ctx.globalAlpha=dotAlpha;
  ctx.shadowColor=accent;ctx.shadowBlur=W<700?5:8;
  ctx.fillStyle=accent;ctx.beginPath();
  ctx.arc(x,y,W<700?2.1:2.8,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.beginPath();
  ctx.arc(x,y,W<700?4.8:6.3,0,Math.PI*2);
  ctx.strokeStyle=rgba(accent,.34);ctx.lineWidth=.7;ctx.stroke();
  ctx.restore();
 });
 // El núcleo de IDEA se enciende después de que ambas rutas han encontrado su eje.
 const core=centers[1],corePulse=.5+.5*Math.sin(phase*.31),coreReveal=smooth(.88,.99,progress);
 ctx.save();ctx.globalAlpha*=alpha*(.48+motion*.42)*coreReveal;
 ctx.beginPath();ctx.arc(core.x,core.y,3.0+corePulse*.7,0,Math.PI*2);
 ctx.fillStyle=p.coral;ctx.fill();
 ctx.beginPath();ctx.arc(core.x,core.y,7.5+corePulse*2.2,0,Math.PI*2);
 ctx.strokeStyle=rgba(p.coral,.18+corePulse*.12);ctx.lineWidth=.8;ctx.stroke();
 ctx.restore();
 // Los paquetes viajan sólo después de completar la formación del campo.
 if(motion>.015&&progress>.45)paths.forEach((path,index)=>{
  const cycle=(phase*.14)%1;
  const q=smooth(index===0?.04:.47,index===0?.43:.86,cycle);
  const head=idleCubic(path.a,path.c1,path.c2,path.b,q);
  const tail=idleCubic(path.a,path.c1,path.c2,path.b,Math.max(0,q-.065));
  const envelope=smooth(0,.075,q)*(1-smooth(.91,1,q));
  const packetAlpha=alpha*motion*envelope*smooth(.45,.78,progress);
  const color=index===0?p.coral:p.amber;
  ctx.save();ctx.globalAlpha=packetAlpha;
  ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(head.x,head.y);
  ctx.strokeStyle=rgba(color,.44);ctx.lineWidth=1.1;ctx.stroke();
  ctx.translate(head.x,head.y);ctx.rotate(Math.PI/4+Math.sin(phase*.22+index)*.16);
  const size=W<700?3.2:4.6;
  ctx.shadowColor=color;ctx.shadowBlur=W<700?5:8;
  ctx.fillStyle=color;ctx.fillRect(-size/2,-size/2,size,size);
  ctx.restore();
 });
 ctx.restore();
}
function drawModuleTransition(scene,u,p){
 if(scene===0){
  const scrollProgress=smooth(.06,.84,u);
  const fieldProgress=smooth(.31,.95,introReveal.value);
  const rest=1-smooth(.02,.22,scrollProgress);
  const motion=idleMotion.value*rest*smooth(.48,.92,introReveal.value);
  drawOpeningField(p,smooth(.38,.84,introReveal.value)*
   (1-smooth(.18,.72,scrollProgress)),motion,fieldProgress);
 }
 for(let i=0;i<MODULE_COUNT;i++){
  let x,y,size,rotation,aspect,opacity=1,sceneProgress=0,pose=null;
  // La mezcla cromática se mantiene durante el desorden inicial. Al desplegarse
  // la base, cada pieza recupera gradualmente el color de su grupo definitivo.
  const disorderColor=sceneDisorderColor(i,p);
  // Algunas piezas de piedra se perdían contra el fondo claro de la portada.
  const openingColor=scene===0&&!night()&&disorderColor===p.stone?
   mix(disorderColor,p.petrol,.24):disorderColor;
  const organizedColor=modulePalette(p)[moduleMeta(i).column];
  const chartGroup=Math.floor(i/14);
  const chartColor=scene===6?
   mix(scene5TileColor(chartGroup,i%14,p),organizedColor,smooth(.12,.88,u)):null;
  const readableChartColor=scene===6&&!night()?
   mix(chartColor,p.petrol,chartGroup===3?.25:chartGroup===2?.08:.025):chartColor;
  const colorOverride=scene===0?openingColor:scene<=4?disorderColor:
   scene===5?mix(disorderColor,organizedColor,smooth(.14,.88,u)):
   scene===6?readableChartColor:null;
  if(scene===0){
   const a=openingPoint(i),b=stackPoint(i,false),meta=moduleMeta(i);
   // El scroll conserva el reordenamiento aprobado; la carga tiene su propia
   // entrada en tres tiempos, siguiendo los tres grupos que ve el visitante.
   const delay=meta.column*.07+meta.row*.006+hash(i*7+9)*.018;
   const amount=smooth(delay,Math.min(.91,delay+.34),u);
   const group=i%3,stagger=hash(i*13+71)*.035;
   const entry=openingGroupEntry(group,introReveal.value,stagger);
   const reveal=entry.reveal,settle=entry.formation;
   const targetX=lerp(a.x,b.x,amount),targetY=lerp(a.y,b.y,amount);
   // Corrientes que se separan desde un núcleo común: curvas distintas por pieza,
   // sin trayectos rectos por columnas ni cortes de tipo diapositiva.
   const angle=hash(i*7+31)*Math.PI*2;
   const from={x:W*.5+Math.cos(angle)*W*(W<700?.025:.037),
    y:H*(W<700?.555:.535)+Math.sin(angle)*H*.029};
   const lateral=group-1,arc=(hash(i*11+37)-.5);
   const c1={x:from.x+lateral*W*.12+arc*W*.023,
    y:from.y-H*(.065+hash(i+29)*.055)};
   const c2={x:targetX-lateral*W*.072+arc*W*.025,
    y:targetY+H*(group===1?-.05:.055)+arc*H*.018};
   const flight=idleCubic(from,c1,c2,{x:targetX,y:targetY},settle);
   x=flight.x;y=flight.y;
   const kinetic=Math.sin(Math.PI*settle);
   size=lerp(a.size||b.size,b.size,amount)*(.57+.43*settle)*(1+.10*kinetic);
   rotation=lerp(a.rotation||0,0,amount)+
    kinetic*(hash(i*17+3)-.5)*.42+(1-settle)*lateral*.10;
   // El scroll sigue siendo dueño de las barras: no se modifican los destinos.
   aspect=lerp(1,barAspect(),smooth(.62,1,amount));
   opacity=reveal*(.80+.20*settle);
   pose=fitGesture(scene,i,amount,size);
  }else if(scene===1){
   const start=stackPoint(i,false),loose=scatteredPoint(i),target=groupedModulePoint(i);
   if(i%3===1){
    // Un conjunto central encuentra su forma primero y permanece legible
    // mientras las demás piezas se separan y vuelven a organizarse.
    const amount=smooth(.015,.60,u);
    x=lerp(start.x,target.x,amount);y=lerp(start.y,target.y,amount);
    size=lerp(start.size,target.size,amount);
    rotation=lerp(0,target.rotation||0,amount);
    aspect=lerp(barAspect(),1,amount);
     pose=fitGesture(scene,i,amount,size);
   }else{
    const scatter=smooth(.005,.23,u),regroup=smooth(.26,.90,u);
    const looseX=lerp(start.x,loose.x,scatter),looseY=lerp(start.y,loose.y,scatter);
    x=lerp(looseX,target.x,regroup);y=lerp(looseY,target.y,regroup);
    size=lerp(start.size,target.size,scatter);
    rotation=lerp(0,loose.rotation||0,scatter)*(1-regroup);
    aspect=lerp(barAspect(),1,scatter);
     pose=combinedGesture(scene,i,scatter,regroup,.54,size);
   }
  }else if(scene===2){
   const a=groupedModulePoint(i),b=cloudPoint(i);
   const cx=W*.5,cy=H*(H<620?.75:(W<700?.66:.64));
   const group=i%3,angle=hash(i*13+41)*Math.PI*2;
   const cluster=(W<700?11:20)*(.42+hash(i*17+5)*.68);
   const centerX=cx+Math.cos(angle)*cluster;
   const centerY=cy+Math.sin(angle)*cluster*.72;
   // Los tres conjuntos se recogen en una semilla común antes de abrirse.
   // La llegada y la salida escalonadas convierten la nube en consecuencia del núcleo.
   const inwardDelay=(group===1?0:group===0?.025:.05)+hash(i*5+29)*.03;
   const converge=smooth(inwardDelay,.22+inwardDelay,u);
   const launchDelay=(group===1?0:group===0?.025:.05)+hash(i*7+53)*.09;
   const explode=smooth(.34+launchDelay,.80+launchDelay,u);
   const pulledX=lerp(a.x,centerX,converge);
   const pulledY=lerp(a.y,centerY,converge);
   x=lerp(pulledX,b.x,explode);
   y=lerp(pulledY,b.y,explode);
   const compressedSize=lerp(a.size||12,(a.size||12)*.72,converge);
   size=lerp(compressedSize,b.size||12,explode);
   const compressedRotation=lerp(a.rotation||0,angle*.16,converge);
   rotation=lerp(compressedRotation,b.rotation||0,explode);
   opacity=lerp(1,.58,converge);
   opacity=lerp(opacity,1,explode);
    pose=combinedGesture(scene,i,converge,explode,.75,size);
   aspect=1;
  }else if(scene===5){
   const a=sphereModulePoint(i,1),expanded=expansionPoint(i,u),target=expanded;
   const group=Math.floor(i/14),routes=[
    {c1:{x:W*.43,y:H*.76},c2:{x:W*.34,y:H*.69}},
    {c1:{x:W*.50,y:H*.74},c2:{x:W*.50,y:H*.56}},
    {c1:{x:W*.57,y:H*.76},c2:{x:W*.66,y:H*.69}},
    {c1:{x:W*.50,y:H*.70},c2:{x:W*.50,y:H*.78}}
   ],route=routes[group];
   // Cada pieza sale de la esfera, pasa por el nodo de la base y sigue
   // una ruta propia hasta encajar en la retícula de su plataforma.
   const delay=group*.025+hash(i*7+61)*.075;
   // El viaje conserva el mismo recorrido, pero ocupa casi todo el capítulo:
   // las piezas siguen avanzando mientras las plataformas terminan de desplegarse.
   const travel=smooth(.04+delay,.84+delay,u),v=1-travel;
   const pathX=v*v*v*a.x+3*v*v*travel*route.c1.x+
    3*v*travel*travel*route.c2.x+travel*travel*travel*expanded.x;
   const pathY=v*v*v*a.y+3*v*v*travel*route.c1.y+
    3*v*travel*travel*route.c2.y+travel*travel*travel*expanded.y;
   // Cada grupo encaja después de llegar; el último termina antes del cierre del tramo.
   const settle=smooth(.34+group*.035+hash(i*7+61)*.015,.90+group*.025,u);
   x=lerp(pathX,target.x,settle);y=lerp(pathY,target.y,settle);
   size=lerp(lerp(a.size||12,expanded.size||12,travel),target.size||12,settle);
   rotation=lerp(lerp(a.rotation||0,0,travel),target.rotation||0,settle);
   aspect=lerp(1,barAspect(),settle);
    pose=combinedGesture(scene,i,travel,settle,.32,size);
    size*=pose.compression;y-=pose.lift;
   if(idleMotion.value>.001){
    const phase=idleMotion.time,seed=hash(i*17+53)*Math.PI*2;
    // Las bases giran; los bloques de datos permanecen verticales y legibles.
    pose={
     turn:(pose.turn||0)+Math.sin(phase*.48+seed)*.018*idleMotion.value,
     tilt:(pose.tilt||0)+Math.cos(phase*.36+seed)*.022*idleMotion.value,
     compression:1,lift:0
    };
    size*=1+Math.sin(phase*.66+seed)*.009*idleMotion.value;
   }
   const tileReveal=smooth(.06,.25,u);
   drawModule(i,x,y,size,p,1-tileReveal,rotation,aspect,colorOverride,true,pose);
   drawScene5Tile(i,x,y,size,p,tileReveal,group,pose,u);
   continue;
  }else{
   const a=MODULE_LAYOUTS[scene](i),b=MODULE_LAYOUTS[scene+1](i,u);
   let delay=scene===6?Math.floor(i/14)*.12+hash(i*31+9)*.025:hash(i+scene*31)*.055;
   // La esfera y sus módulos terminan de formarse en el mismo tramo.
   // En los demás capítulos se conserva el asentamiento prolongado original.
   const amount=scene===4?smooth(delay,.79,u):smooth(delay,.985,u);
   if(scene===6)sceneProgress=amount;
   x=lerp(a.x,b.x,amount);y=lerp(a.y,b.y,amount);
   size=lerp(a.size||12,b.size||12,amount);
   if(scene===6){
    // Un pequeño asentamiento hace que cada módulo parezca encajar en la curva.
    const dock=Math.sin(Math.PI*smooth(.78,.985,amount))*.035;
    size*=1+dock;
   }
   rotation=lerp(a.rotation||0,b.rotation||0,amount);
   const aspectFrom=scene===7?barAspect():1;
   const aspectTo=scene===6||scene+1===7?barAspect():1;
   aspect=lerp(aspectFrom,aspectTo,amount);
   opacity=scene===7?1-smooth(.22,.94,amount):1;
    pose=fitGesture(scene,i,amount,size);
  }
  if(pose){size*=pose.compression;y-=pose.lift}
   if(scene===6)opacity=sceneProgress;
  if(pointer.energy>.01&&(scene===0||scene===2)){
   const field=pointerInfluenceAt(x,y,Math.min(W*.34,190));
   if(field.strength>.001){
    const inverse=field.distance>0?1/field.distance:0;
    const push=field.strength*(1.6+field.speed*1.2);
    x+=(field.dx*inverse*.76+pointer.dirX*.24)*push;
    y+=(field.dy*inverse*.76+pointer.dirY*.24)*push;
    size*=1+field.strength*.035;
   }
  }
  // Movimiento autónomo por lenguaje visual: cada escena respira distinto.
  // Las composiciones de columnas conservan sus ejes; las de partículas pueden orbitar.
  const idle=idleMotion.value;
  if(idle>.001){
   const phase=idleMotion.time,seed=hash(i*13+scene*97)*Math.PI*2;
   const meta=moduleMeta(i),mobile=W<700;
   let idleTurn=0,idleTilt=0,idleScale=1,dx=0,dy=0;
   if(scene===0){
    // El campo común anima los tres conjuntos sin desarmar su composición.
    const group=i%3,local=Math.floor(i/3),column=local%4,row=Math.floor(local/4);
    const center=openingGroupCenter(group),centerX=center.x,centerY=center.y;
    const openingRest=(1-smooth(.02,.22,smooth(.06,.84,u)))*
     smooth(.48,.92,introReveal.value);
    const strength=idle*openingRest;
    if(strength>.001){
     const drift=openingGroupDrift(group,phase,strength);
     const driftX=drift.x,driftY=drift.y;
     let orbitAngle=0,radial=1;
     if(group===0){
      // TAREA: una masa compacta que carga peso y gira apenas sobre su eje.
      const load=.5+.5*Math.sin(phase*.27+1.1);
      orbitAngle=Math.sin(phase*.18+.35)*.105*strength;
      radial=1-(.014+.028*load)*strength;
      dy+=(Math.sin(phase*.31+row*.54)*2.1+(load-.5)*2.0)*strength;
      idleTurn=(Math.sin(phase*.28+row*.48)*.036+load*.018)*strength;
      idleTilt=Math.cos(phase*.24+column*.55+row*.22)*.034*strength;
      idleScale=1+Math.sin(phase*.42+row*.38)*.013*strength;
     }else if(group===1){
      // IDEA: órbita más abierta; cada pieza conserva una fase propia alrededor del núcleo.
      orbitAngle=Math.sin(phase*.17+.75)*.20*strength+
       Math.sin(phase*.25+local*.37)*.032*strength;
      radial=1+Math.sin(phase*.23+local*.43)*.055*strength;
      dy+=Math.sin(phase*.34+local*.57)*2.8*strength;
      idleTurn=Math.sin(phase*.31+local*.29)*.052*strength;
      idleTilt=Math.cos(phase*.24+local*.31)*.046*strength;
      idleScale=1+Math.sin(phase*.29+local*.47)*.018*strength;
     }else{
      // FORMA: una órbita más rígida recibe una onda que alinea sus filas por turnos.
      const scan=.5+.5*Math.sin(phase*.29-row*.86);
      orbitAngle=Math.sin(phase*.18+2.15)*.11*strength;
      radial=1+(scan-.5)*.035*strength;
      dx+=(column-1.5)*(scan-.5)*4.6*strength;
      dy+=(scan-.5)*5.1*strength-(row-2)*(1-scan)*1.6*strength;
      idleTurn=(scan-.5)*.12*strength+
       Math.sin(phase*.27+column*.62)*.025*strength;
      idleTilt=Math.sin(phase*.29+column*.55)*.038*strength;
      idleScale=1+(scan-.5)*.026*strength;
     }
     const arrival=openingPulse(group,phase);
     radial*=1+.058*arrival*strength;
     dy-=arrival*3.4*strength;
     idleScale+=arrival*.046*strength;
     idleTurn+=arrival*.037*strength;
     const ox=x-centerX,oy=y-centerY,cos=Math.cos(orbitAngle),sin=Math.sin(orbitAngle);
     x=centerX+driftX+(ox*cos-oy*sin)*radial+dx;
     y=centerY+driftY+(ox*sin+oy*cos)*radial+dy;
    }
   }else if(scene===1){
    // El paquete de la curva activa sus tres nodos y propaga el gesto a las piezas.
    const group=i%3,arrival=chapterPulse([.04,.47,.89][group],phase);
    const wave=Math.sin(phase*.34+group*.92+meta.row*.23);
    const strength=idle*smooth(.30,.82,u);
    dx=Math.sin(phase*.22+group*.8)*.42*idle+
     (x-W*.5)*.009*arrival*strength;
    dy=wave*(mobile?.42:.70)*idle-arrival*(mobile?2.0:3.0)*strength;
    idleTurn=(wave*.018+arrival*.038)*strength;
    idleTilt=(Math.cos(phase*.31+seed)*.022+arrival*.026)*strength;
    idleScale=1+wave*.006*strength+arrival*.031*strength;
   }else if(scene===2){
    // Una expansión elástica real atraviesa la nube: no se añaden aros decorativos.
    const cx=W*.5,cy=H*(H<620?.75:mobile?.66:.64),orbit=Math.sin(phase*.16+seed)*.009*idle;
    const ox=x-cx,oy=y-cy,dist=Math.hypot(ox,oy);
    x=cx+ox*Math.cos(orbit)-oy*Math.sin(orbit);
    y=cy+ox*Math.sin(orbit)+oy*Math.cos(orbit);
    const strength=idle*smooth(.50,.91,u);
    const front=(phase*.12%1)*Math.min(W*.35,H*.31);
    const band=Math.exp(-Math.pow((dist-front)/(mobile?25:43),2))*strength;
    x+=ox/Math.max(1,dist)*band*(mobile?2.5:4.6);
    y+=oy/Math.max(1,dist)*band*(mobile?2.5:4.6);
    dy+=Math.cos(phase*.36+seed)*.82*idle-band*1.0;
    idleTurn=Math.sin(phase*.40+seed)*.030*idle+band*.042;
    idleTilt=Math.cos(phase*.28+seed)*.042*idle;
    idleScale=1+Math.sin(phase*.33+seed)*.008*idle+band*.045;
   }else if(scene===3){
    // La palabra mantiene su silueta; el relieve de partículas hace el movimiento principal.
    const depth=Math.sin(phase*.31+seed)*idle;
    dx=depth*(mobile?.16:.32);dy=depth*(mobile?.48:.86);
    idleTurn=depth*.018;idleTilt=Math.cos(phase*.25+seed)*.024*idle;
    idleScale=1+depth*.004;
   }else if(scene===4){
    // La posición ya comparte la proyección tridimensional de la esfera.
    // Sólo respira la forma del módulo: no se le aplica otra órbita independiente.
    idleTurn=Math.sin(phase*.34+seed)*.022*idle;
    idleTilt=Math.cos(phase*.26+seed)*.032*idle;
    idleScale=1+Math.sin(phase*.42+seed)*.006*idle;
   }else if(scene===6){
    // La gráfica conserva sus anclajes; la onda del eje recorre las barras en orden.
    const wave=Math.sin(phase*.28+meta.column*.72);
    const arrival=chapterPulse((meta.column+.5)/CHART_COUNTS.length,phase,.11,.12);
    const strength=idle*smooth(.55,.89,u);
    idleTurn=(wave*.0028+arrival*.006)*strength;
    idleTilt=(Math.cos(phase*.24+meta.column*.72)*.0045+arrival*.007)*strength;
    idleScale=1+wave*.003*strength+arrival*.020*strength;
   }else if(scene===7){
    // El cierre acompaña la semilla con una respiración casi imperceptible.
    dy=Math.sin(phase*.30+seed)*.34*idle;
    idleTurn=Math.sin(phase*.25+seed)*.012*idle;
    idleTilt=Math.cos(phase*.22+seed)*.018*idle;
    idleScale=1+Math.sin(phase*.36+seed)*.004*idle;
   }
   x+=dx;y+=dy;rotation+=idleTurn*.62;
   pose={
    turn:(pose?.turn||0)+idleTurn,
    tilt:(pose?.tilt||0)+idleTilt,
    compression:pose?.compression??1,
    lift:pose?.lift||0
   };
   size*=idleScale;
  }
  if(scene===6){
   // La ficha isométrica se retira debajo de la barra nueva, no por encima de ella.
   const tileFade=1-sceneProgress;
   drawScene5Tile(i,x,y,size,p,tileFade,Math.floor(i/14),pose,1);
  }
  drawModule(i,x,y,size*1.08,p,opacity,rotation,aspect,colorOverride,scene!==4,pose);
 }
}
function applyPointer(event){
 const rect=canvas.getBoundingClientRect();
 const x=clamp(event.clientX-rect.left,0,W),y=clamp(event.clientY-rect.top,0,H);
 const now=performance.now();
 if(pointer.hasPosition){
  const dx=x-pointer.x,dy=y-pointer.y,distance=Math.hypot(dx,dy);
  if(distance>.75){
   const elapsed=Math.max(8,now-pointer.lastMoveAt);
   pointer.dirX=lerp(pointer.dirX,dx/distance,.38);
   pointer.dirY=lerp(pointer.dirY,dy/distance,.38);
   pointer.speed=Math.max(pointer.speed,clamp(distance/elapsed/1.15));
  }
 }else{
  pointer.dirX=0;pointer.dirY=0;pointer.speed=0;pointer.hasPosition=true;
 }
 pointer.x=x;pointer.y=y;pointer.lastMoveAt=now;pointer.lastSpeedUpdateAt=now;
 pointer.active=true;
 pointerTween?.kill();pointerFade?.kill();pointerFade=null;
 if(pointer.energy<.98){
  pointerTween=gsap.to(pointer,{energy:1,duration:.22,ease:'power2.out',onUpdate:invalidateNarrative});
 }else invalidateNarrative();
}
function fadePointer(){
 pointerTween?.kill();pointerFade?.kill();pointerFade=null;
 pointerTween=gsap.to(pointer,{energy:0,duration:.62,ease:'power2.out',
  onUpdate:invalidateNarrative,onComplete:()=>{
   pointer.active=false;pointer.down=false;pointer.speed=0;pointer.hasPosition=false;
   pointer.dirX=0;pointer.dirY=0;invalidateNarrative();
  }});
}
canvas.addEventListener('pointermove',event=>{
 if(prefersReduced.matches||!root.classList.contains('is-linked'))return;
 if(event.pointerType==='touch'&&!pointer.down)return;
 queuePointer(event);
},{passive:true});
canvas.addEventListener('pointerdown',event=>{
 if(prefersReduced.matches||!root.classList.contains('is-linked'))return;
 pointer.down=true;pointerFade?.kill();pointerFade=null;
 queuePointer(event);
},{passive:true});
window.addEventListener('pointerup',event=>{
 if(!pointer.down)return;
 pointer.down=false;
 if(event.pointerType==='touch')pointerFade=gsap.delayedCall(.68,fadePointer);
},{passive:true});
canvas.addEventListener('pointercancel',()=>{pointer.down=false;fadePointer()},{passive:true});
canvas.addEventListener('pointerleave',()=>{if(!pointer.down)fadePointer()},{passive:true});
function stopSceneAmbient(){
  clearTimeout(sceneAmbientTimer);
  ambientRunning=false;idleLastFrame=0;idleLastRender=0;
  if(W&&H){idleCtx.setTransform(idleDPR,0,0,idleDPR,0,0);idleCtx.clearRect(0,0,W,H)}
}
function startSceneAmbient(){
  if(ambientRunning||prefersReduced.matches||document.hidden||!document.hasFocus()||
   !root.classList.contains('is-linked'))return;
  const bounds=root.getBoundingClientRect();
  if(bounds.bottom<=0||bounds.top>=innerHeight)return;
  ambientRunning=true;idleLastRender=0;idleLastFrame=0;
}
// C · La capa ambiental avanza su propio reloj y respira a su propio ritmo.
// No llama a paintNarrative: el ambiente nunca obliga a redibujar el relato.
function ambientTick(now){
  if(!ambientRunning)return;
  if(document.hidden||!document.hasFocus()||prefersReduced.matches||!root.classList.contains('is-linked')){
   stopSceneAmbient();return;
  }
  const bounds=root.getBoundingClientRect();
  if(bounds.bottom<=0||bounds.top>=innerHeight){stopSceneAmbient();return}
  // El reloj sólo avanza mientras la escena está visible. Al volver a ella,
  // la fase continúa donde quedó, sin saltar ni comenzar otro ciclo.
  const delta=idleLastFrame?Math.min(.08,Math.max(0,(now-idleLastFrame)/1000)):0;
  idleClock+=delta;
  idleLastFrame=now;
  idleMotion.time=idleClock;
  // Durante el scroll el movimiento permanece casi imperceptible; al detenerse
  // gana presencia con una interpolación temporal, nunca con un reinicio.
  const target=scrollIdle?.84:.18;
  const response=1-Math.exp(-delta/(scrollIdle?.72:.30));
  idleMotion.value=lerp(idleMotion.value,target,response);
  if(now-idleLastRender>=ambientInterval()){
   const breathing=.50+.50*Math.sin(idleClock*.90);
   sceneAmbient.value=idleMotion.value*(.35+.58*breathing);
   invalidate('ambient');
  }
}

function scheduleSceneAmbient(delay=350){
 clearTimeout(sceneAmbientTimer);
 sceneAmbientTimer=setTimeout(()=>{
  if(!scrollIdle||prefersReduced.matches||document.hidden||!document.hasFocus())return;
  startSceneAmbient();
 },delay);
}
window.addEventListener('scroll',()=>{
 // Si se desplaza antes de completar la presentación, dejar el titular
 // totalmente legible; el resto de la coreografía sigue unido al scroll.
 if(introTextTween&&window.scrollY>16)introTextTween.progress(1);
 if(introTween&&window.scrollY>16)introTween.progress(1);
 scrollIdle=false;clearTimeout(scrollIdleTimer);
 // La posición del puntero conserva su referencia mientras las escenas cambian.
 // Sólo cambia la intensidad del reposo; la interacción no se desconecta.
 startSceneAmbient();
 scrollIdleTimer=setTimeout(()=>{scrollIdle=true;scheduleSceneAmbient(80)},170);
},{passive:true});
window.addEventListener('blur',()=>{pointer.down=false;stopSceneAmbient();fadePointer()});
window.addEventListener('focus',()=>{if(scrollIdle)scheduleSceneAmbient(350);else startSceneAmbient()});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){stopSceneAmbient();fadePointer()}
 else if(scrollIdle)scheduleSceneAmbient(350);
 else startSceneAmbient();
});

function draw0(u,p){
 // La portada no es una línea de carga: presenta tres estados de trabajo
 // conectados entre sí. Al comenzar el recorrido, la relación se disuelve
 // mientras las mismas piezas encuentran la siguiente composición.
 const scrollProgress=smooth(.06,.84,u);
 const visibility=1-smooth(.18,.72,scrollProgress);
 const connection=smooth(.43,.96,introReveal.value);
 drawOpeningCircuit(p,visibility,connection);
}
function scene1Geometry(){
 const mobile=W<700,compact=H<620;
 const nodes=[
  {x:W*.25,y:H*(compact?.475:.505),color:PAL[night()?'night':'day'].amber},
  {x:W*.50,y:H*(compact?.415:.445),color:PAL[night()?'night':'day'].coral},
  {x:W*.75,y:H*(compact?.475:.505),color:PAL[night()?'night':'day'].amber}
 ];
 const peakY=H*(compact?.365:.395);
 const segments=[
  {a:nodes[0],c1:{x:W*.34,y:peakY},c2:{x:W*.42,y:nodes[1].y},b:nodes[1]},
  {a:nodes[1],c1:{x:W*.58,y:nodes[1].y},c2:{x:W*.66,y:peakY},b:nodes[2]}
 ];
 // La segunda curva queda por debajo de la principal y pasa detrás de las piezas:
 // sólo reaparece en los espacios entre columnas, como una relación secundaria.
 const lowerY=H*(compact?.565:.59);
 const secondary=[
  {a:nodes[0],c1:{x:W*.34,y:lowerY},c2:{x:W*.42,y:lowerY},b:nodes[1]},
  {a:nodes[1],c1:{x:W*.58,y:lowerY},c2:{x:W*.66,y:lowerY},b:nodes[2]}
 ];
 const bezier=(s,t)=>{
  const v=1-t;
  return {
   x:v*v*v*s.a.x+3*v*v*t*s.c1.x+3*v*t*t*s.c2.x+t*t*t*s.b.x,
   y:v*v*v*s.a.y+3*v*v*t*s.c1.y+3*v*t*t*s.c2.y+t*t*t*s.b.y
  };
 };
 return {mobile,nodes,segments,secondary,bezier};
}
function draw1(u,p,layer='all'){
 const {mobile,nodes,segments,secondary,bezier}=scene1Geometry();
 const show=smooth(.015,.32,u),pathProgress=smooth(.025,.89,u);
 const drawRail=(paths,width,color,alpha)=>{
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;
  ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha*=alpha*show;
  ctx.beginPath();
  const steps=120,limit=Math.max(1,Math.ceil(steps*pathProgress));
  for(let k=0;k<=limit;k++){
   const q=k/steps*2,segment=paths[q<=1?0:1];
   const point=bezier(segment,q<=1?q:q-1);
   if(k===0)ctx.moveTo(point.x,point.y);else ctx.lineTo(point.x,point.y);
  }
  if(width>=1.1){
   ctx.shadowColor=night()?'rgba(0,0,0,.30)':'rgba(24,39,38,.20)';
   ctx.shadowBlur=mobile?1.2:2.1;ctx.shadowOffsetY=mobile?.7:1.1;
  }
  ctx.stroke();ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.restore();
 };
 if(layer!=='nodes'){
  // La línea secundaria es fina y tenue; no compite con la curva de dirección.
  drawRail(secondary,mobile?.75:.95,p.olive,.22);
  // La curva principal conserva su recorrido, pero con menos halo y contraste.
  drawRail(segments,mobile?4.4:5.8,mix(p.ink,p.bg[0],.72),.075);
  drawRail(segments,mobile?2.4:3.2,p.petrol,.12);
  drawRail(segments,mobile?1.1:1.45,p.petrol,.70);
  drawRail(segments,mobile?.5:.65,p.cream,.16);
  if(pointer.energy>.02){
   let nearest=null,best=Infinity;
   segments.forEach((segment,index)=>{
    for(let j=0;j<=32;j++){
     const t=pathProgress*j/32,point=bezier(segment,t);
     const dx=point.x-pointer.x,dy=point.y-pointer.y,distance=dx*dx+dy*dy;
     if(distance<best){best=distance;nearest={segment,index,t,point}}
    }
   });
   if(nearest){
    const field=pointerInfluenceAt(nearest.point.x,nearest.point.y,mobile?70:112);
    if(field.strength>.02){
     const span=.075*(pointer.dirX<0?-1:1);
     const from=bezier(nearest.segment,clamp(nearest.t-span,0,pathProgress));
     const to=bezier(nearest.segment,clamp(nearest.t+span,0,pathProgress));
     ctx.save();ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);
     ctx.lineCap='round';ctx.lineWidth=mobile?1.45:1.9;ctx.strokeStyle=p.cream;
     ctx.globalAlpha*=field.strength*.40;ctx.stroke();ctx.restore();
    }
   }
  }
 }
 if(layer!=='rails'){
  const socket=(x,y,half,fill,alpha,active=false,scale=1)=>{
   ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalAlpha*=alpha;
   const cut=Math.max(1.4,half*.27);
   ctx.beginPath();
   ctx.moveTo(-half+cut,-half);ctx.lineTo(half-cut,-half);
   ctx.lineTo(half,-half+cut);ctx.lineTo(half,half-cut);
   ctx.lineTo(half-cut,half);ctx.lineTo(-half+cut,half);
   ctx.lineTo(-half,half-cut);ctx.lineTo(-half,-half+cut);ctx.closePath();
   ctx.shadowColor=night()?'rgba(0,0,0,.30)':'rgba(18,34,36,.18)';
   ctx.shadowBlur=half*.22;ctx.shadowOffsetY=half*.09;
   ctx.fillStyle=mix(p.bg[0],p.petrol,night()?.38:.16);ctx.fill();
   ctx.strokeStyle=active?p.coral:p.petrol;ctx.lineWidth=mobile?1:1.15;ctx.stroke();
   ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
   ctx.save();ctx.globalAlpha*=.34;ctx.strokeStyle=p.cream;ctx.lineWidth=.58;
   ctx.beginPath();ctx.moveTo(-half+cut*.9,-half+.65);ctx.lineTo(half-cut*.9,-half+.65);
   ctx.moveTo(-half+.65,-half+cut);ctx.lineTo(-half+.65,half-cut);ctx.stroke();
   ctx.globalAlpha*=.55;ctx.strokeStyle=mix(p.petrol,p.bg[0],.55);
   ctx.beginPath();ctx.moveTo(half-.65,-half+cut);ctx.lineTo(half-.65,half-cut);
   ctx.lineTo(half-cut,half-.65);ctx.stroke();ctx.restore();
   const core=half*.66;
   drawBeveledBlock(0,0,core,core,1.1,fill,p,sceneAmbient.value);
   ctx.restore();
  };
  const gapY=H*(mobile?.027:.035),moduleSize=mobile?9:18;
  nodes.forEach((node,i)=>{
   // Los laterales son derivaciones discretas; el eje central lleva la lectura principal.
   const groupBase=H*(mobile?.625:.667)+(i===1?-.018:.018)*H;
   const firstRowY=groupBase-3*gapY;
   const moduleTop=firstRowY-moduleSize/2;
   const terminalHalf=mobile?4:5;
   const terminalY=moduleTop-terminalHalf-4;
   const branchReveal=smooth([.10,.50,.90][i],[.30,.68,1][i],pathProgress);
   const branchStart=node.y+(mobile?8:10);
   const branchEnd=terminalY-terminalHalf;
   if(i===1){
    line(node.x,branchStart,node.x,branchEnd,p.olive,mobile?.95:1.12,.08*branchReveal);
    line(node.x,branchStart,node.x,branchEnd,p.olive,mobile?.72:.86,.60*branchReveal);
    line(node.x+.55,branchStart,node.x+.55,branchEnd,p.cream,.42,.22*branchReveal);
   }else{
    line(node.x,branchStart,node.x,branchEnd,p.olive,mobile?1.25:1.55,.045*branchReveal);
    line(node.x,branchStart,node.x,branchEnd,p.olive,mobile?.62:.75,.36*branchReveal);
   }
   socket(node.x,terminalY,terminalHalf,node.color,branchReveal);
   const nodeReveal=smooth([0,.44,.86][i],[.08,.56,.98][i],pathProgress);
   const field=pointerInfluenceAt(node.x,node.y,mobile?92:142);
   const proximity=field.strength;
   const arrival=chapterPulse([.04,.47,.89][i],idleMotion.time);
   const idlePulse=idleMotion.value*(.014+.060*arrival);
   if(i===1){
    const breathe=.5+.5*Math.sin(idleMotion.time*.72);
    strokeCircle(node.x,node.y,mobile?11.5:14,p.coral,.8,nodeReveal*
     (.06+idleMotion.value*(.06*breathe+.24*arrival)));
   }
   // El mismo paquete que viaja por el rail activa los puertos cuando llega.
   socket(node.x,node.y,mobile?7.5:9,node.color,nodeReveal,proximity>.035,
    1+proximity*.055+idlePulse);
   if(proximity>.045)strokeCircle(node.x,node.y,mobile?12:15,p.cream,.65,nodeReveal*proximity*.20);
  });
 }
}
function draw2(u,p){
 const mobile=W<700,compact=H<620,cx=W*.5,cy=H*(compact?.75:(mobile?.66:.64));
 const seedBase=mobile?20:32;
 const maxRadius=Math.min(W*.30,H*.25);
 const charge=smooth(.04,.24,u),launch=smooth(.34,.70,u);
 const seedAlpha=smooth(.015,.10,u)*(1-smooth(.50,.66,u));
 const pointerField=pointerInfluenceAt(cx,cy,Math.min(maxRadius*.92,compact?104:158));
 const seedScale=lerp(.72,1,smooth(.04,.16,u))*(1-.20*charge)*(1+.12*smooth(.26,.38,u))*(1+.018*Math.sin(idleMotion.time*.72)*idleMotion.value)*(1+pointerField.strength*.035);
 const seed=seedBase*seedScale;
 // El núcleo se cierra antes de liberar la energía: una onda, no tres aros decorativos.
 const chargeRadius=lerp(seed*1.38,seed*.78,charge)*(1+pointerField.strength*.08);
 const chargeAlpha=.44*(1-smooth(.24,.36,u))+.035*pointerField.strength;
 strokeCircle(cx,cy,chargeRadius,p.cream,mobile?1:1.2,chargeAlpha);
 // La onda expansiva acompaña a las mismas piezas que salen desde el centro.
 const waveProgress=smooth(.34,.72,u);
 const waveRadius=lerp(seed*.82,maxRadius,waveProgress);
 const waveAlpha=.32*(1-smooth(.64,.92,u));
 strokeCircle(cx,cy,waveRadius,p.cream,mobile?1:1.25,waveAlpha);
 const echoProgress=smooth(.44,.82,u);
 const echoRadius=lerp(seed*.80,maxRadius*.78,echoProgress);
 const echoAlpha=.14*(1-smooth(.72,.98,u));
 strokeCircle(cx,cy,echoRadius,p.cream,1,echoAlpha);
 // Trazos breves señalan la dirección de salida de módulos reales, no partículas nuevas.
 const rayProgress=smooth(.34,.78,u),rayFade=1-smooth(.68,.94,u);
 for(let i=0;i<9;i++){
  const target=cloudPoint(i*6);
  const x=lerp(cx,target.x,rayProgress),y=lerp(cy,target.y,rayProgress);
  line(cx,cy,x,y,p.cream,mobile?.55:.75,.12*rayProgress*rayFade);
 }
 // La semilla tiene contraste sobre el coral y desaparece cuando sus piezas ya salieron.
 if(seedAlpha>.01){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.035+.20*launch+Math.sin(idleMotion.time*.48)*.16*idleMotion.value);
  orientGesture(fitGesture(2,0,launch,seed));
  ctx.globalAlpha*=seedAlpha;
  drawBeveledBlock(0,0,seed,seed,Math.min(3,seed*.12),p.petrol,p,sceneAmbient.value);
  rounded(-seed*.18,-seed*.18,seed*.36,seed*.36,1.2,p.cream,.98);
  line(-seed*.12,-seed*.12,seed*.12,-seed*.12,p.petrol,.7,.28);
  ctx.restore();
 }
 line(W*.12,H*.86,W*.88,H*.86,p.ink,1,.18);
 for(let i=0;i<8;i++){
  const x=W*(.17+.66*i/7);line(x,H*.86-3,x,H*.86+3,p.ink,1,.16);
 }
 if(pointerField.strength>.025){
  strokeCircle(cx,cy,seed*1.22,p.amber,.8,.20*pointerField.strength);
 }
}
function buildWord(){
 const temp=document.createElement('canvas');temp.width=1000;temp.height=260;
 const c=temp.getContext('2d',{willReadFrequently:true});
 c.clearRect(0,0,1000,260);c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';
 c.font='800 194px "Instrument Sans",sans-serif';c.fillText('CRECER',500,132,945);
 const data=c.getImageData(0,0,1000,260).data,pts=[];
 for(let y=8;y<252;y+=4)for(let x=15;x<985;x+=4)
  if(data[(y*1000+x)*4+3]>135)pts.push({x:(x-500)/1000,y:(y-130)/260});
 wordPoints=pts;
}
function wordPoint(i){
 if(!wordPoints.length)return{x:0,y:0};
 return wordPoints[(i*59+Math.floor(hash(i)*157))%wordPoints.length];
}
function draw3(u,p){
 const v=smooth(.04,.58,u),mobile=W<700,compact=H<620;
 const size=Math.min(W*(mobile?.92:.84),1120),height=mobile?H*.16:H*.275;
 const cx=W*.50,cy=H*(compact?(mobile?.65:.58):(mobile?.70:.565)),hold=1+.012*Math.sin(u*5.4)*(1-smooth(.70,1,u));
 const idle=idleMotion.value,phase=idleMotion.time;
 const count=mobile?2600:N,baseAlpha=ctx.globalAlpha;
 // CRECER se construye sólo con partículas; el titular HTML conserva la frase accesible.
 for(let i=0;i<count;i++){
  const q=particles[i],word=wordPoint(i),angle=i*2.39996;
  const r=Math.sqrt((i+.5)/count),px=cx+Math.cos(angle)*r*W*.53,
        py=cy+Math.sin(angle)*r*H*.30;
  let x=lerp(px,cx+word.x*size*hold,v),y=lerp(py,cy+word.y*height*2*hold,v);
  // Una onda volumétrica recorre la palabra; la silueta y el espaciado siguen legibles.
  // Una misma onda cruza las letras de izquierda a derecha: los puntos
  // comparten fase, mientras la variación individual sólo aporta materialidad.
  const traveling=Math.sin(phase*.52-word.x*10.2+word.y*.65);
  const depth=(traveling*.80+Math.sin(phase*.25+q.k*3.2)*.20)*idle*v;
  const perspective=1+depth*.085;
  x+=(word.x*.9+q.k*.22)*depth*(mobile?3.1:4.1);
  y+=depth*(mobile?3.3:5.6);
  if(pointer.energy>.01){
   const reach=mobile?72:118,dx=x-pointer.x,dy=y-pointer.y,distanceSq=dx*dx+dy*dy;
   if(distanceSq<reach*reach){
    const distance=Math.sqrt(distanceSq),proximity=1-smooth(reach*.10,reach,distance);
    const direction=clamp((dx*pointer.dirX+dy*pointer.dirY)/reach,-1,1);
    const strength=proximity*proximity*pointer.energy*clamp(.88+.18*pointer.speed*direction,.68,1.08);
    if(strength>.001){
     const inverse=distance>0?1/distance:0,force=strength*(mobile?5.5:9.2);
     // La palabra abre una estela breve en la dirección del recorrido del puntero.
     x+=dx*inverse*force+pointer.dirX*strength*(1+pointer.speed)*1.15;
     y+=dy*inverse*force+pointer.dirY*strength*(1+pointer.speed)*1.15;
    }
   }
  }
  const hue=i%19===0?'#5A9D72':i%13===0?p.coral:i%11===0?p.amber:p.olive;
  const r0=((mobile?1.15:1.45)+q.r*(mobile?1.2:1.65))*perspective;
  ctx.globalAlpha=baseAlpha*(.34+(.66*v)*(q.r*.48+.5))*
   (night()?.89:.94+.06*Math.max(0,depth))*(.90+.10*(depth+1)*.5);
  ctx.fillStyle=hue;
  if(i%17===0){
   const s=r0*(i%51===0?3.2:2.25);
   ctx.save();ctx.translate(x,y);ctx.rotate(depth*.15*idle);orientGesture(fitGesture(3,i,v,s));
   ctx.fillRect(-s/2,-s*.41,s,s*.82);ctx.restore();
  }
  else{ctx.beginPath();ctx.arc(x,y,r0,0,Math.PI*2);ctx.fill()}
 }
 ctx.globalAlpha=baseAlpha;
 // Sin línea inferior: evita cruzar la descripción original en pantallas compactas.
 if(v>.82){
  const pulse=1+.025*Math.sin(u*8);
  strokeCircle(cx,cy,Math.min(W*.34,H*.18)*pulse,p.coral,1,.16);
 }
}
function drawPerspective(p,opacity){
 const horizon=H*.75,isNight=night();
 const ink=isNight?p.petrol:mix(p.petrol,p.cream,.22);
 // El modo día necesita algo más de presencia para que el plano se lea
 // con la misma profundidad que en noche. La perspectiva no cambia.
 const radialAlpha=isNight ? 0.35 : 0.48;
 const horizontalBase=isNight ? 0.07 : 0.10;
 const horizontalRange=isNight ? 0.14 : 0.18;
 for(let i=-12;i<=12;i++){
  const xx=W*.5+i*W*.075;
  line(W*.5,horizon-30,xx,H,ink,1,opacity*radialAlpha);
 }
 for(let j=1;j<=8;j++){
  let q=j/8,yy=horizon+Math.pow(q,1.7)*(H-horizon);
  line(W*.04,yy,W*.96,yy,ink,1,opacity*(horizontalBase+horizontalRange*q));
 }
}
function spherePoint(i,u,count,spin=0,pitch=0){
 const y=1-2*(i+.5)/count,a=2*Math.PI*i/PHI;
 const r=Math.sqrt(1-y*y),theta=a+u*2.7+spin;
 let x=Math.cos(theta)*r,z=Math.sin(theta)*r;
 const bend=.15*Math.sin(u*7+y*4);
 x+=bend;
 const vertical=y+.08*Math.sin(theta*2+u*3);
 const rotatedY=vertical*Math.cos(pitch)-z*Math.sin(pitch);
 const rotatedZ=vertical*Math.sin(pitch)+z*Math.cos(pitch);
 return {x,y:rotatedY,z:rotatedZ};
}
function draw4(u,p){
 const mobile=W<700,compact=H<620,cx=W*.5,cy=H*(compact?.70:.64);
 const R=Math.min(W*(compact?.30:mobile?.34:.255),H*(compact?.22:.33));
 const v=smooth(.035,.79,u),baseAlpha=ctx.globalAlpha;
 const idle=idleMotion.value,phase=idleMotion.time,formation=smooth(.42,.88,v);
 const pointerField=pointerInfluenceAt(cx,cy,R*2.25);
 const pointerX=pointer.active?(pointer.x-cx)/Math.max(W*.5,1):0;
 const pointerY=pointer.active?(pointer.y-cy)/Math.max(H*.5,1):0;
 // El puntero inclina apenas el campo completo; el reposo conserva su propio eje de giro.
 const spin=phase*.235*idle*formation+
  pointerX*.14*pointerField.strength+pointer.dirX*pointer.speed*.08*pointerField.strength;
 const pitch=Math.sin(phase*.31)*.085*idle*formation+
  pointerY*.11*pointerField.strength+pointer.dirY*pointer.speed*.06*pointerField.strength;
 const roll=Math.sin(phase*.22)*.022*idle*formation;
 drawPerspective(p,v);
 const orbital=1+.045*Math.sin(u*6)+.018*Math.sin(phase*.42)*idle;
 strokeCircle(cx,cy,R*orbital*1.2,p.petrol,1,.24);
 const count=mobile?2100:N;
 // Tres valores de luz por material: la profundidad se lee por tono y no por halos.
 const materials=['#5A9D72',p.coral,p.amber,p.olive];
 const highlights=materials.map(color=>mix(color,p.cream,.20));
 const shadows=materials.map(color=>mix(color,p.bg[0],.28));
 for(let i=0;i<count;i++){
  const q=particles[i],a=spherePoint(i,u,count,spin,pitch),wp=wordPoint(i);
  const near=1+.15*a.z;
  const rotatedX=a.x*Math.cos(roll)-a.y*Math.sin(roll);
  const rotatedY=a.y*Math.cos(roll)+a.x*Math.sin(roll);
  const x3=cx+rotatedX*R*near,y3=cy-rotatedY*R*near;
  // Mismo origen exacto que CRECER al terminar el capitulo anterior.
   const wordCX=W*.50,wordCY=H*(compact?(mobile?.65:.58):(mobile?.70:.565));
   const wordSize=Math.min(W*(mobile?.92:.84),1120),wordHeight=mobile?H*.16:H*.275;
   const x0=wordCX+wp.x*wordSize,y0=wordCY+wp.y*wordHeight*2;
  let x=lerp(x0,x3,v),y=lerp(y0,y3,v),localInfluence=0;
  if(pointer.energy>.01){
   const reach=mobile?88:136,dx=x-pointer.x,dy=y-pointer.y,distanceSq=dx*dx+dy*dy;
   if(distanceSq<reach*reach){
    const distance=Math.sqrt(distanceSq),proximity=1-smooth(reach*.10,reach,distance);
    const direction=clamp((dx*pointer.dirX+dy*pointer.dirY)/reach,-1,1);
    localInfluence=proximity*proximity*pointer.energy*clamp(.88+.18*pointer.speed*direction,.68,1.08);
    if(localInfluence>.001){
     const inverse=distance>0?1/distance:0,force=localInfluence*(mobile?3.0:4.5);
     x+=dx*inverse*force+pointer.dirX*localInfluence*.85;
     y+=dy*inverse*force+pointer.dirY*localInfluence*.85;
    }
   }
  }
  const material=i%19===0?0:i%13===0?1:i%11===0?2:3;
  const hue=a.z>.34?highlights[material]:a.z<-.34?shadows[material]:materials[material];
  const oldAlpha=.34+.66*(q.r*.48+.5);
   const newAlpha=clamp(.25+.48*a.z+.27*v,.06,.98);
   ctx.globalAlpha=baseAlpha*lerp(oldAlpha,newAlpha,v);
  const oldRadius=1.45+q.r*1.65;
   const newRadius=(.65+q.s*1.12)*(1+.44*a.z)*(1+.035*Math.sin(phase*.8+i*.09)*idle)*(1+localInfluence*.09);
   const r=lerp(mobile?1.15+q.r*1.2:oldRadius,newRadius,v);
  ctx.globalAlpha*=1+localInfluence*.34;
  ctx.fillStyle=localInfluence>.18&&i%7===0?p.cream:hue;
  if(i%17===0&&v<.999){
   const s=r*(i%51===0?3.2:2.25);
   ctx.save();ctx.translate(x,y);orientGesture(fitGesture(4,i,v,s));
   ctx.fillRect(-s/2,-s*.41,s,s*.82);ctx.restore();
  }
   else if(i%29===0){
    const s=r*(a.z>.1?3.8:2.4);
    ctx.save();ctx.translate(x,y);orientGesture(fitGesture(4,i,v,s));
    ctx.fillRect(-s/2,-s*.425,s,s*.85);ctx.restore();
   }
  else{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
 }
 ctx.globalAlpha=baseAlpha;
 ctx.save();ctx.translate(cx,cy);ctx.scale(1,.39);
 strokeCircle(0,0,R*1.22,p.coral,1.3,.2*v);ctx.restore();
 if(pointerField.strength>.035){
  strokeCircle(cx,cy,R*1.16,p.amber,.8,.16*pointerField.strength);
 }
}
function drawChart(p,progress,opacity=1){
 const mobile=W<700,ink=night()?p.cream:p.ink;
 const x=W*.16,width=W*.68,base=H*.84,top=H*.49;
 const end=clamp(progress),axisFade=smooth(.80,.95,end);
 // Los ejes se retiran a medida que la gráfica deja de ser columnas.
 line(x,base,x+width,base,ink,1,.36*opacity*axisFade);
 line(x,top,x,base,ink,1,.24*opacity*axisFade);
 for(let i=0;i<5;i++){
  const xx=x+width*(.12+i*.19);
  line(xx,base+13,xx,base+31,ink,1,.24*opacity*axisFade);
 }
 if(end<=.001)return;
 const start=ribbonCurvePoint(0),finish=ribbonCurvePoint(1);
 const samples=Math.max(3,Math.ceil(150*end)),points=[];
 for(let i=0;i<=samples;i++)points.push(ribbonCurvePoint(end*i/samples));
 const colors=modulePalette(p);
 const gradient=ctx.createLinearGradient(start.x,start.y,finish.x,finish.y);
 gradient.addColorStop(0,colors[0]);
 let offset=0;
 CHART_COUNTS.forEach((count,i)=>{
  offset+=count;
  gradient.addColorStop(offset/MODULE_COUNT,colors[Math.min(i+1,colors.length-1)]);
 });
 const trace=(color,lineWidth,alpha)=>{
  ctx.save();ctx.beginPath();
  points.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));
  ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=lineWidth;
  ctx.strokeStyle=color;ctx.globalAlpha*=opacity*alpha;
  ctx.shadowColor=rgba(night()?p.bg[0]:p.ink,night()?.30:.16);ctx.shadowBlur=mobile?2.2:3.8;
  ctx.shadowOffsetY=mobile?1:1.8;ctx.stroke();
  ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.globalAlpha*=.18+sceneAmbient.value*.12;
  ctx.lineWidth=Math.max(.55,lineWidth*.24);ctx.strokeStyle=p.cream;ctx.stroke();
  ctx.restore();
 };
 const reveal=smooth(.40,.78,end);
 // El halo apenas separa el recorrido del fondo; la línea toma los mismos
 // colores que las columnas y queda debajo de los módulos que van encajando.
 trace(p.amber,mobile?4:6,.11*reveal);
 trace(gradient,mobile?1.45:1.9,.78*reveal);
 // Un reflejo viaja por el mismo recorrido que las barras, sin mover sus ejes.
 // La onda de las fichas usa este reloj para que el efecto tenga una causa.
 if(Math.floor(play.t)===6&&end>.80&&idleMotion.value>.015){
  const travel=(idleMotion.time*.11)%1,q=Math.min(end,travel);
  const head=ribbonCurvePoint(q),tail=ribbonCurvePoint(Math.max(0,q-.035));
  const envelope=smooth(0,.07,q)*(1-smooth(.92,1,q));
  ctx.save();ctx.globalAlpha*=opacity*reveal*idleMotion.value*envelope;
  ctx.lineCap='round';ctx.lineWidth=mobile?1.5:2;
  ctx.strokeStyle=night()?p.cream:p.petrol;
  ctx.shadowColor=p.amber;ctx.shadowBlur=mobile?3:5;
  ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(head.x,head.y);ctx.stroke();
  ctx.restore();
 }
 // El recorrido responde localmente: sólo se ilumina el tramo cercano,
 // y la dirección del puntero determina hacia qué lado se extiende el acento.
 if(pointer.energy>.02&&reveal>.02){
  let nearestQ=0,nearest=null,best=Infinity;
  const samplesNear=36;
  for(let i=0;i<=samplesNear;i++){
   const q=end*i/samplesNear,point=ribbonCurvePoint(q);
   const dx=point.x-pointer.x,dy=point.y-pointer.y,distance=dx*dx+dy*dy;
   if(distance<best){best=distance;nearestQ=q;nearest=point}
  }
  const field=nearest?pointerInfluenceAt(nearest.x,nearest.y,mobile?72:116):{strength:0};
  if(field.strength>.018){
   const span=Math.min(end*.075,.045)*(pointer.dirX<0?-1:1);
   const from=ribbonCurvePoint(clamp(nearestQ-span,0,end));
   const to=ribbonCurvePoint(clamp(nearestQ+span,0,end));
   ctx.save();ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);
   ctx.lineCap='round';ctx.lineWidth=mobile?2.1:2.8;ctx.strokeStyle=p.cream;
   ctx.globalAlpha*=opacity*field.strength*.46;ctx.stroke();ctx.restore();
  }
 }
}
function drawScene5Polygon(points,fill,stroke,alpha,width=1){
 ctx.save();ctx.globalAlpha*=clamp(alpha);ctx.beginPath();
 points.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));
 ctx.closePath();
 if(fill){ctx.fillStyle=fill;ctx.fill()}
 if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
 ctx.restore();
}
// La señal pertenece a las conexiones, superficies y fichas por igual.
// El mismo reloj evita pequeñas animaciones que parecen independientes.
function scene5FlowPhase(group,progress){
 return (progress*.78+idleMotion.time*.055+group*.23)%1;
}
function drawScene5Platform(g,p,alpha,accent,group=0,progress=1){
 if(alpha<=.002)return;
 const project=(x,y)=>scene5Project(group,x,y,progress);
 const top=project(W*g.cx,H*(g.cy-g.ry));
 const right=project(W*(g.cx+g.rx),H*g.cy);
 const bottom=project(W*g.cx,H*(g.cy+g.ry));
 const left=project(W*(g.cx-g.rx),H*g.cy);
 const center=project(W*g.cx,H*g.cy),mobile=W<700;
 // La cara del plano toma como referencia su escena, no el papel de portada.
 // Noche conserva su material aprobado; día usa la piedra fría del capítulo.
 const materialBase=night()?p.bg[0]:p.bg[5];
 const depth=H*(mobile?.013:.018),down=q=>({x:q.x,y:q.y+depth});
 const shadow=H*(mobile?.018:.025),drop=q=>({x:q.x+depth*.16,y:q.y+shadow});
 const midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5});
 // Sombra de contacto y bastidor inferior: ahora se percibe como una pieza construida.
 ctx.save();ctx.shadowColor=night()?rgba(p.bg[0],.58):rgba(p.ink,.24);
 ctx.shadowBlur=depth*(1.65+sceneAmbient.value*.55);ctx.shadowOffsetY=depth*.72;
 drawScene5Polygon([drop(top),drop(right),drop(bottom),drop(left)],
  rgba(night()?p.bg[0]:p.ink,night()?.40:.18),null,alpha*.76);
 ctx.restore();
 const frame=[midpoint(top,left),midpoint(top,right),midpoint(right,bottom),midpoint(bottom,left)].map(down);
 drawScene5Polygon(frame,mix(p.petrol,materialBase,night()?.48:.35),
  mix(accent,materialBase,night()?.32:.24),alpha*.86,.8);
 line(frame[0].x,frame[0].y,frame[2].x,frame[2].y,p.cream,mobile?1:1.5,alpha*.20);
 line(frame[1].x,frame[1].y,frame[3].x,frame[3].y,p.cream,mobile?1:1.5,alpha*.20);
 // Las caras laterales reciben valores distintos según su orientación.
 drawScene5Polygon([left,bottom,down(bottom),down(left)],
  mix(p.petrol,materialBase,night()?.48:.33),null,alpha);
 drawScene5Polygon([bottom,right,down(right),down(bottom)],
  mix(p.petrol,materialBase,night()?.62:.48),null,alpha);
 const surface=ctx.createLinearGradient(top.x,top.y,right.x,bottom.y);
 // En día el plano retiene más petróleo: las aristas no se pierden en la piedra.
 surface.addColorStop(0,mix(p.petrol,p.cream,(night()?.23:.12)+sceneAmbient.value*.05));
 surface.addColorStop(.52,mix(p.petrol,materialBase,.025));
 surface.addColorStop(1,mix(p.petrol,materialBase,night()?.23:.12));
 // La cara superior no lleva un contorno blanco uniforme: cada canto expresa su orientación.
 drawScene5Polygon([top,right,bottom,left],surface,null,alpha*.92);
 // La superficie recibe la luz del puntero como una variación de material,
 // recortada por su propia geometría; nunca aparece un aro alrededor del cursor.
 const pointerField=pointerInfluenceAt(center.x,center.y,Math.min(W*.30,190));
 if(pointerField.strength>.012){
  ctx.save();ctx.beginPath();
  [top,right,bottom,left].forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));
  ctx.closePath();ctx.clip();
  const reach=Math.min(W*.22,150),glow=ctx.createRadialGradient(
   pointer.x-pointer.dirX*reach*.12,pointer.y-pointer.dirY*reach*.12,0,
   pointer.x,pointer.y,reach);
  glow.addColorStop(0,rgba(p.cream,.22));
  glow.addColorStop(.38,rgba(accent,.11));
  glow.addColorStop(1,rgba(accent,0));
  ctx.globalAlpha*=alpha*pointerField.strength*.62;
  ctx.fillStyle=glow;ctx.fillRect(Math.min(left.x,right.x)-4,Math.min(top.y,bottom.y)-4,
   Math.abs(right.x-left.x)+8,Math.abs(bottom.y-top.y)+8);
  ctx.restore();
 }
 // La luz recorre el plano también durante el desplazamiento, no sólo al detenerse.
 const sweepStrength=Math.max(sceneAmbient.value*.62,
  smooth(.06,.22,progress)*(1-smooth(.88,.99,progress))*.74);
 if(sweepStrength>.025){
  ctx.save();ctx.beginPath();
  [top,right,bottom,left].forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));
  ctx.closePath();ctx.clip();
  const sweep=scene5FlowPhase(group,progress);
  const sweepX=lerp(left.x,right.x,sweep);
  const sheen=ctx.createLinearGradient(sweepX-H*.055,top.y,sweepX+H*.055,bottom.y);
  sheen.addColorStop(0,rgba(p.cream,0));
  sheen.addColorStop(.46,rgba(p.cream,.015));
  sheen.addColorStop(.53,rgba(p.cream,.29));
  sheen.addColorStop(.66,rgba(p.cream,.05));
  sheen.addColorStop(1,rgba(p.cream,0));
  ctx.globalAlpha*=alpha*sweepStrength*.76;
  ctx.fillStyle=sheen;ctx.fillRect(Math.min(left.x,right.x)-4,Math.min(top.y,bottom.y)-4,
   Math.abs(right.x-left.x)+8,Math.abs(bottom.y-top.y)+8);
  ctx.restore();
 }
 // Retícula fina e unida a la perspectiva del mismo plano.
 for(const t of [.33,.66]){
  const a={x:lerp(left.x,top.x,t),y:lerp(left.y,top.y,t)};
  const b={x:lerp(bottom.x,right.x,t),y:lerp(bottom.y,right.y,t)};
  line(a.x,a.y,b.x,b.y,p.cream,.7,alpha*.16);
  const c={x:lerp(top.x,right.x,t),y:lerp(top.y,right.y,t)};
  const d={x:lerp(left.x,bottom.x,t),y:lerp(left.y,bottom.y,t)};
  line(c.x,c.y,d.x,d.y,p.cream,.7,alpha*.16);
 }
 // Un segundo bisel interior y fijaciones pequeñas hacen legible el ensamblaje.
 const inner=[top,right,bottom,left].map(q=>({
  x:lerp(center.x,q.x,.90),y:lerp(center.y,q.y,.90)
 }));
 drawScene5Polygon(inner,null,rgba(p.cream,.42),alpha*.58,.7);
 [top,right,bottom,left].forEach((q,i)=>{
  circle(q.x,q.y,mobile?1.8:2.6,p.bg[0],alpha*.55);
  circle(q.x,q.y,mobile?1.05:1.55,accent,alpha*.92);
 });
 // Un reflejo recorre el canto y da una señal de movimiento a la plataforma completa.
 const perimeter=[top,right,bottom,left,top],phase=scene5FlowPhase(group,progress);
 const segment=Math.min(3,Math.floor(phase*4)),local=phase*4-segment;
 const marker={x:lerp(perimeter[segment].x,perimeter[segment+1].x,local),
  y:lerp(perimeter[segment].y,perimeter[segment+1].y,local)};
 circle(marker.x,marker.y,mobile?2.2:3.2,p.cream,alpha*.88);
 strokeCircle(marker.x,marker.y,mobile?4.3:6.2,accent,.9,alpha*.68);
 // Bisel exterior con reflectancia distinta en cada arista.
 line(top.x,top.y,right.x,right.y,accent,mobile?1.55:2.05,alpha*.88);
 line(top.x,top.y,left.x,left.y,p.cream,1.1,alpha*(.42+sceneAmbient.value*.10));
 line(left.x,left.y,bottom.x,bottom.y,mix(p.petrol,p.cream,.24),.85,alpha*.48);
 line(bottom.x,bottom.y,right.x,right.y,mix(p.petrol,p.bg[0],.46),.95,alpha*.58);
 line(down(left).x,down(left).y,down(bottom).x,down(bottom).y,accent,1.1,alpha*.62);
 // El canto inferior se separa del fondo con una sombra estrecha, no con un halo.
 line(down(bottom).x,down(bottom).y,down(right).x,down(right).y,
  rgba(night()?p.bg[0]:p.ink,.72),mobile?1.05:1.4,alpha*.48);
}
function drawScene5Bridge(start,c1,c2,end,progress,p,accent,alpha,phase=0,group=0){
 if(progress<=.001||alpha<=.001)return;
 const pointAt=t=>idleCubic(start,c1,c2,end,clamp(t));
 const steps=Math.max(2,Math.ceil(64*progress)),points=[];
 for(let i=0;i<=steps;i++)points.push(pointAt(progress*i/steps));
 const trace=(width,color,opacity,offsetY=0,blur=0)=>{
  ctx.save();ctx.translate(0,offsetY);ctx.beginPath();
  points.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));
  ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=width;ctx.strokeStyle=color;
  if(blur>.01){ctx.shadowColor=rgba(night()?p.bg[0]:p.ink,.42);ctx.shadowBlur=blur}
  ctx.globalAlpha*=alpha*opacity;ctx.stroke();ctx.restore();
 };
 // La conexión tiene un contacto oscuro muy corto, un cuerpo cromático y una arista de luz.
 const wireShadow=night()?mix(p.bg[0],p.ink,.20):mix(p.ink,p.bg[0],.54);
 trace(W<700?2.8:3.5,wireShadow,.30,W<700?1:1.35,W<700?.65:1.05);
 trace(W<700?4:5,accent,.095);
 const wire=ctx.createLinearGradient(start.x,start.y,end.x,end.y);
 wire.addColorStop(0,mix(accent,p.bg[0],.12));
 wire.addColorStop(.52,accent);
 wire.addColorStop(1,mix(accent,p.cream,.18));
 trace(W<700?1.25:1.65,wire,.88);
 trace(.58,p.cream,.36);
 // Un paquete luminoso recorre la línea sin ensancharla ni formar una carretera.
 const signal=scene5FlowPhase(group,phase);
 const q=progress*(.10+.82*signal),tail=pointAt(Math.max(0,q-progress*.055)),head=pointAt(q);
 const field=pointerInfluenceAt(head.x,head.y,W<700?76:120);
 ctx.save();ctx.lineCap='round';ctx.strokeStyle=p.cream;
 ctx.lineWidth=(W<700?1.35:1.8)*(1+field.strength*.12);
 ctx.shadowColor=accent;ctx.shadowBlur=(W<700?4:6)+field.strength*3;
 ctx.globalAlpha*=alpha*(.88+field.strength*.42);
 ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(head.x,head.y);ctx.stroke();
 ctx.restore();
 circle(head.x,head.y,W<700?1.55:2.0,p.cream,alpha*(.96+field.strength*.24));
 // Dos pequeños contactos marcan la continuidad eléctrica del tramo vertical.
 if(group===1){
  [.32,.66].forEach(t=>{
   if(t>progress)return;
   const q=pointAt(t),r=W<700?1.7:2.2;
   ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.PI/4);
   ctx.fillStyle=p.bg[0];ctx.globalAlpha*=alpha*.92;
   ctx.fillRect(-r,-r,r*2,r*2);
   ctx.strokeStyle=accent;ctx.lineWidth=.85;ctx.strokeRect(-r,-r,r*2,r*2);
   ctx.restore();
  });
 }
}
function scene5TileColor(group,slot,p){
 const palettes=[
  [night()?'#4C936D':'#347953',p.olive,p.petrol],
  [p.coral,p.clay,p.coral],
  [p.amber,p.stone,p.ash],
  [p.stone,p.cream,p.olive,p.petrol,p.amber]
 ];
 const colors=palettes[group]||palettes[3];
 return colors[(slot+Math.floor(slot/4))%colors.length];
}
function drawScene5Tile(i,x,y,size,p,opacity,group,pose=null,progress=1){
 if(opacity<=.002)return;
 // Cada ficha crece desde su huella: pequeños edificios de datos, no cubos flotantes.
 ctx.save();ctx.translate(x,y);orientGesture(pose);ctx.translate(-x,-y);
 const slot=i%14,color=scene5TileColor(group,slot,p),mobile=W<700;
 const scale=mobile?1.28:1.22;
 const w=size*(.43+.035*hash(i*5+17))*scale,h=size*.22*scale;
 // Las piezas ganan altura mientras recorren la escena, no aparecen terminadas de golpe.
 const growth=smooth(.18,.98,progress)*smooth(.02,.98,opacity);
 const travel=scene5FlowPhase(group,progress),position=slot/14;
 const raw=Math.abs(position-travel),distance=Math.min(raw,1-raw);
 const activation=Math.exp(-Math.pow(distance/.15,2))*
  idleMotion.value*smooth(.47,.89,progress);
 const height=size*(.38+.84*hash(i*29+slot*7+11))*scale*growth*
  (1+.065*activation);
 const footprint=(dx,dy)=>{
  const q=scene5PlaneOffset(group,dx,dy,progress);
  return {x:x+q.x,y:y+q.y};
 };
 const base=[footprint(0,-h),footprint(w,0),footprint(0,h),footprint(-w,0)];
 const roof=base.map(q=>({x:q.x,y:q.y-height}));
 const shadow=base.map(q=>({x:q.x+size*.035,y:q.y+size*.085}));
 // Sombra de contacto plana y contenida: la construcción permanece anclada a la retícula.
 drawScene5Polygon(shadow,rgba(night()?p.bg[0]:p.ink,night()?.40:.20),null,opacity*.70);
 // La cara más cercana cambia con el giro; así el volumen acompaña la órbita.
 let front=0;
 for(let k=1;k<4;k++)if(base[k].y>base[front].y)front=k;
 const previous=(front+3)%4,next=(front+1)%4;
 const facade=(a,b,shade)=>{
  // Las fachadas usan tonos sólidos distintos; la cubierta conserva el único gradiente del módulo.
  drawScene5Polygon([base[a],base[b],roof[b],roof[a]],mix(color,p.bg[0],shade),null,opacity);
 };
 // Dos fachadas visibles y una cubierta superior, con alturas diferentes por dato.
 facade(previous,front,.36);
 facade(front,next,.22);
 // Ventanas técnicas finas que giran junto con la orientación de cada edificio.
 [.34,.64].forEach(level=>{
  const a={x:lerp(base[previous].x,roof[previous].x,level),y:lerp(base[previous].y,roof[previous].y,level)};
  const b={x:lerp(base[front].x,roof[front].x,level),y:lerp(base[front].y,roof[front].y,level)};
  line(a.x,a.y,b.x,b.y,p.cream,.55,opacity*.28);
 });
 const signalTop={x:lerp(roof[front].x,roof[next].x,.30),y:lerp(roof[front].y,roof[next].y,.30)};
 const signalBase={x:lerp(base[front].x,base[next].x,.30),y:lerp(base[front].y,base[next].y,.30)};
 line(signalBase.x,signalBase.y,signalTop.x,signalTop.y,mix(color,p.cream,.42),Math.max(.7,size*.035),opacity*.78);
 const face=ctx.createLinearGradient(roof[0].x,roof[0].y,roof[2].x,roof[2].y);
 face.addColorStop(0,mix(color,p.cream,.31+sceneAmbient.value*.06));
 face.addColorStop(.62,color);face.addColorStop(1,mix(color,p.bg[0],.12));
 drawScene5Polygon(roof,face,null,opacity);
 // La cubierta conserva una arista iluminada y otra en sombra, sin contornear todo el volumen.
 line(roof[0].x,roof[0].y,roof[1].x,roof[1].y,p.cream,.72,opacity*.58);
 line(roof[1].x,roof[1].y,roof[2].x,roof[2].y,mix(color,p.bg[0],.42),.68,opacity*.46);
 circle(x,y-height,Math.max(.7,size*.035),p.cream,opacity*.62);
 ctx.restore();
}
function drawScene5Slot(group,slot,p,opacity,progress=1){
 if(opacity<=.002)return;
 const q=scene5GridPoint(group,slot,progress),w=q.size*.50,h=q.size*.25;
 const points=[[0,-h],[w,0],[0,h],[-w,0]].map(([dx,dy])=>{
  const v=scene5PlaneOffset(group,dx,dy,progress);
  return {x:q.x+v.x,y:q.y+v.y};
 });
 drawScene5Polygon(points,null,scene5TileColor(group,slot,p),opacity*.78,W<700?1:1.25);
}
function scene5Routes(u,p){
 const g=scene5Geometry(),left=g[0],top=g[1],right=g[2],base=g[3];
 const point=(x,y)=>({x:W*x,y:H*y});
 const blend=(a,b,t)=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});
 const resolve=q=>Array.isArray(q)?point(q[0],q[1]):q;
 const route=(group,start,end,c1,c2,accent)=>{
  const progress=scene5Deployment(group,u).progress;
  return {
   group,start,end,accent,progress,
   c1:blend(start,resolve(c1),progress),
   c2:blend(start,resolve(c2),progress)
  };
 };
 // Cada cable termina bajo el centro de la placa y se acerca desde
 // el punto medio de su borde inferior, mientras la superficie gira encima.
 const leftEntry=point(left.cx,.82);
 const topEntry=point(top.cx,.54);
 const rightEntry=point(right.cx,.82);
 return [
  route(0,
   scene5Project(3,W*(base.cx-base.rx*.58),H*(base.cy-base.ry*.40),u),
   scene5Project(0,W*left.cx,H*left.cy,u),
   [.34,.78],leftEntry,night()?'#6FAE86':'#347953'),
  route(1,
   scene5Project(3,W*base.cx,H*(base.cy-base.ry*.96),u),
   scene5Project(1,W*top.cx,H*top.cy,u),
   [.50,.70],topEntry,p.coral),
  route(2,
   scene5Project(3,W*(base.cx+base.rx*.58),H*(base.cy-base.ry*.40),u),
   scene5Project(2,W*right.cx,H*right.cy,u),
   [.66,.78],rightEntry,p.amber)
 ];
}
function drawScene5Joint(x,y,p,accent,alpha,scale=1){
 if(alpha<=.002)return;
 // Puerto cuadrado y discreto: la unión pertenece al sistema, no parece una rotonda.
 const field=pointerInfluenceAt(x,y,W<700?74:118);
 const r=(W<700?2.15:2.85)*scale*(1+field.strength*.07);
 ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);
 ctx.globalAlpha*=alpha*.92;
 const box=r*2.9;
 ctx.shadowColor=rgba(night()?p.bg[0]:p.ink,.42);ctx.shadowBlur=r*.58;ctx.shadowOffsetY=r*.32;
 ctx.fillStyle=mix(p.petrol,p.bg[0],.34);ctx.fillRect(-box/2,-box/2,box,box);
 ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 const inset=r*1.30;
 ctx.fillStyle=mix(p.petrol,p.bg[0],.18);ctx.fillRect(-inset,-inset,inset*2,inset*2);
 ctx.strokeStyle=field.strength>.035?mix(accent,p.cream,field.strength*.24):accent;
 ctx.lineWidth=.95;ctx.strokeRect(-inset,-inset,inset*2,inset*2);
 ctx.save();ctx.globalAlpha*=.42;ctx.strokeStyle=p.cream;ctx.lineWidth=.58;
 ctx.beginPath();ctx.moveTo(-inset+.5,-inset+.5);ctx.lineTo(inset-.5,-inset+.5);
 ctx.moveTo(-inset+.5,-inset+.5);ctx.lineTo(-inset+.5,inset-.5);ctx.stroke();
 ctx.globalAlpha*=.52;ctx.strokeStyle=mix(p.petrol,p.bg[0],.62);
 ctx.beginPath();ctx.moveTo(inset-.5,-inset+.5);ctx.lineTo(inset-.5,inset-.5);
 ctx.lineTo(-inset+.5,inset-.5);ctx.stroke();ctx.restore();
 ctx.fillStyle=p.cream;ctx.globalAlpha*=.76+field.strength*.12;
 ctx.fillRect(-r*.34,-r*.34,r*.68,r*.68);
 ctx.restore();
}
function drawScene5Joints(u,p,fade=1){
 scene5Routes(u,p).forEach(route=>{
  const visibility=typeof fade==='function'?fade(route.group):fade;
  const alpha=visibility*route.progress;
  drawScene5Joint(route.start.x,route.start.y,p,route.accent,alpha,.92);
  drawScene5Joint(route.end.x,route.end.y,p,route.accent,alpha,1);
 });
}
function drawScene5Connections(u,p,fade=1){
 const phase=u;
 scene5Routes(u,p).forEach(route=>{
  const visibility=typeof fade==='function'?fade(route.group):fade;
  drawScene5Bridge(route.start,route.c1,route.c2,route.end,route.progress,
   p,route.accent,visibility,phase,route.group);
 });
}
function draw5(u,p){
 const fade=1,g=scene5Geometry();
 const left=g[0],top=g[1],right=g[2],base=g[3];
 // Los conectores y sus puertos se dibujan primero: las placas los cubren
 // y hacen que las líneas entren por debajo, no que aterricen sobre el borde.
 drawScene5Connections(u,p,fade);
 drawScene5Joints(u,p,fade);
 drawScene5Platform(left,p,smooth(.12,.55,u)*fade,night()?'#6FAE86':'#347953',0,u);
 drawScene5Platform(top,p,smooth(.18,.62,u)*fade,p.coral,1,u);
 drawScene5Platform(right,p,smooth(.24,.69,u)*fade,p.amber,2,u);
 drawScene5Platform(base,p,smooth(.02,.22,u)*fade,p.cream,3,u);
 const slotReveal=smooth(.36,.60,u)*fade;
 [[0,14],[0,15],[1,15],[3,14]].forEach(([group,slot])=>
  drawScene5Slot(group,slot,p,slotReveal,u));
}
function drawRibbon(p,u,index,total){
 const base=H*(.55+.15*index/total),a=smooth(.08,.34,u),fade=1-smooth(.63,.98,u);
 if(a*fade<=.001)return;
 const xSpan=W*1.15,phase=index*.19,spread=smooth(.10,.48,u);
 const colors=[p.coral,p.clay,p.amber,p.petrol,p.olive];
 const startAlpha=.006+.012*(index/total),endAlpha=.16+.25*(index/total);
 const pointAt=q=>{
  const curve=ribbonCurvePoint(q),targetX=-W*.075+xSpan*q;
  const targetY=base+H*(.035+.022*Math.sin(index*.45))*Math.sin(q*9.4+u*7.4+phase+idleMotion.time*.34)+H*.06*Math.cos(q*4+phase)+Math.sin(q*6.2+idleMotion.time*.48)*H*.0028*idleMotion.value;
  return {x:lerp(curve.x,targetX,spread),y:lerp(curve.y,targetY,spread)};
 };
 let nearestQ=0,nearest=null,best=Infinity;
 const trackPointer=pointer.energy>.02&&index%4===0;
 ctx.save();
 ctx.globalAlpha*=a*fade*lerp(startAlpha,endAlpha,spread);
 ctx.lineWidth=lerp(1,1.1+(index%4)*.46,spread);
 ctx.strokeStyle=colors[index%colors.length];ctx.beginPath();
 for(let j=0;j<=130;j++){
  const q=j/130,point=pointAt(q);
  if(j===0)ctx.moveTo(point.x,point.y);else ctx.lineTo(point.x,point.y);
  if(trackPointer){
   const dx=point.x-pointer.x,dy=point.y-pointer.y,distance=dx*dx+dy*dy;
   if(distance<best){best=distance;nearestQ=q;nearest=point}
  }
 }
 ctx.shadowColor=rgba(night()?p.bg[0]:p.ink,night()?.28:.14);ctx.shadowBlur=2.4+sceneAmbient.value*1.6;
 ctx.shadowOffsetY=1.1;ctx.stroke();
 ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 ctx.globalAlpha*=.20+sceneAmbient.value*.16;
 ctx.lineWidth=Math.max(.55,ctx.lineWidth*.24);ctx.strokeStyle=p.cream;ctx.stroke();
 ctx.restore();
 // Una sola señal recorre cada pequeño conjunto de ondas. No crea nuevas
 // partículas: es luz sobre la misma curva que ya entrega energía a la semilla.
 if(index%7===0&&idleMotion.value>.025&&a*fade>.012){
  const q=(idleMotion.time*.10+index/total*.24)%1;
  const head=pointAt(q),tail=pointAt(Math.max(0,q-.027));
  const envelope=smooth(.02,.11,q)*(1-smooth(.89,.98,q));
  ctx.save();ctx.globalAlpha*=a*fade*idleMotion.value*envelope*.84;
  ctx.lineCap='round';ctx.lineWidth=W<700?1.15:1.55;
  ctx.strokeStyle=night()?p.cream:p.petrol;
  ctx.shadowColor=colors[index%colors.length];ctx.shadowBlur=W<700?3:5;
  ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(head.x,head.y);ctx.stroke();
  ctx.restore();
 }
 if(trackPointer&&nearest){
  const field=pointerInfluenceAt(nearest.x,nearest.y,W<700?64:104);
  if(field.strength>.018){
   const span=.026*(pointer.dirX<0?-1:1),from=pointAt(clamp(nearestQ-span)),to=pointAt(clamp(nearestQ+span));
   ctx.save();ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);
   ctx.lineCap='round';ctx.lineWidth=W<700?1.2:1.65;ctx.strokeStyle=p.cream;
   ctx.globalAlpha*=a*fade*field.strength*.48;ctx.stroke();ctx.restore();
  }
 }
}
function draw6(u,p){
 const g=scene5Geometry();
 // La transformación no abandona todas las bases a la vez: la retirada acompaña
 // el avance de cada grupo hacia su columna, de izquierda a derecha.
 const withdraw=group=>1-smooth(.14+group*.085,.65+group*.085,u);
 // La curva nueva toma el relevo mientras cada conector y su base se retiran.
 drawChart(p,u,1);
 drawScene5Connections(1,p,withdraw);
 drawScene5Joints(1,p,withdraw);
 drawScene5Platform(g[0],p,withdraw(0),night()?'#6FAE86':'#347953',0,1);
 drawScene5Platform(g[1],p,withdraw(1),p.coral,1,1);
 drawScene5Platform(g[2],p,withdraw(2),p.amber,2,1);
 drawScene5Platform(g[3],p,withdraw(3),p.cream,3,1);
}
function draw7(u,p){
 // La curva del gráfico se entrega a las ondas: primero se atenúa y luego las líneas toman el relevo.
 drawChart(p,1,1-smooth(.04,.30,u));
 for(let i=0;i<34;i++)drawRibbon(p,u,i,34);
 const settle=smooth(.10,.42,u),travel=smooth(.34,.90,u)*.45,cx=W*.5;
 const cy=lerp(H*.57,H*1.08,travel);
 const pulse=seedPulse.value,pointerField=pointerInfluenceAt(cx,cy,Math.min(W*.22,148));
 const size=Math.min(W,H)*(W<700?.077:.062)*settle*(1+.045*pulse)*(1+.018*Math.sin(idleMotion.time*.68)*idleMotion.value)*(1+pointerField.strength*.025);
 if(size>1){
  ctx.save();
  ctx.translate(cx,cy+homeReturn.lift*size);
  ctx.rotate(-.045+travel*.085+pulse*.025+Math.sin(idleMotion.time*.52)*.19*idleMotion.value+homeReturn.turn);
  ctx.scale(homeReturn.scale,homeReturn.scale);
  orientGesture(fitGesture(7,0,settle,size));
  ctx.globalAlpha*=settle*homeReturn.opacity;
  drawBeveledBlock(0,0,size,size,Math.min(4,size*.12),p.coral,p,sceneAmbient.value+homeReturn.glow*.9,1.9);
  strokeCircle(0,0,size*.76,p.coral,1.1,.16*(1-pulse)+homeReturn.glow*.18);
  strokeCircle(0,0,size*(1.18+homeReturn.ring*.58),p.amber,.85,.12*idleMotion.value+homeReturn.glow*.24);
  if(pointerField.strength>.025)strokeCircle(0,0,size*1.12,p.amber,.75,.18*pointerField.strength);
  ctx.restore();
  // Un pequeño satélite de luz mantiene viva la idea sin competir con el titular.
  if(idleMotion.value>.001){
   const angle=idleMotion.time*.34*idleMotion.value,orbitX=Math.cos(angle)*size*1.34,orbitY=Math.sin(angle)*size*.72;
   ctx.save();ctx.translate(cx,cy);ctx.scale(1,.72);
   strokeCircle(0,0,size*1.58,p.petrol,.85,.18*idleMotion.value);
   circle(orbitX,orbitY,size*.075,p.cream,.72*idleMotion.value);
   strokeCircle(orbitX,orbitY,size*.18,p.amber,.7,.22*idleMotion.value);
   ctx.restore();
  }
  // La semilla desciende con el scroll y cruza el borde inferior para entregar
  // el movimiento al contenido real, en lugar de quedarse como un adorno fijo.
  line(cx,Math.max(0,cy-size*1.7),cx,Math.max(0,cy-size*.7),p.coral,1,.32*settle*(1-travel*.55));
 }
}
function syncSeedPulse(){
 const active=play.t>=7&&play.t<=8&&!prefersReduced.matches;
 if(active&&!seedPulseTween){
  seedPulseTween=gsap.to(seedPulse,{value:1,duration:1.55,repeat:-1,yoyo:true,
   ease:'sine.inOut',onUpdate:invalidateNarrative});
 }else if(!active&&seedPulseTween){
  seedPulseTween.kill();seedPulseTween=null;seedPulse.value=0;
 }
}
function drawScene(i,u,p){
 if(i===0)draw0(u,p);
 if(i===1)draw1(u,p);
 if(i===2)draw2(u,p);
 if(i===3)draw3(u,p);
 if(i===4)draw4(u,p);
 if(i===5)draw5(u,p);
 if(i===6)draw6(u,p);
 if(i===7)draw7(u,p);
}
function resize(){
 const box=canvas.getBoundingClientRect();
 W=Math.max(1,box.width);H=Math.max(1,box.height);
 DPR=Math.min(dprCap(),window.devicePixelRatio||1);
 canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);
 // La capa ambiental es decorativa: su resolución interna puede ser menor
 // sin que se note, y así deja de competir con el relato por el ancho de banda.
 idleDPR=Math.min(1,DPR);
 rebuildGrain();
 capaInvalidar();
 idleCanvas.width=Math.round(W*idleDPR);idleCanvas.height=Math.round(H*idleDPR);
 idleCtx.setTransform(idleDPR,0,0,idleDPR,0,0);
 ctx.setTransform(DPR,0,0,DPR,0,0);
 // El lienzo principal se repinta aquí porque ha cambiado su tamaño de respaldo;
 // el resto de capas recalculan su geometría por su propia cuenta.
 paintNarrative();
 invalidate('ambient');
}
// C · El grano, por separado: se aplica una sola vez por fotograma sobre el
// fondo ya compuesto, con el mismo modo y la misma opacidad que antes.
function pintarGrano(c){
 c.save();c.globalCompositeOperation='soft-light';
 c.globalAlpha*=night()?.055:.145;
 if(grainReady)c.drawImage(grainCanvas,0,0,W,H);
 else{c.fillStyle=grainPattern;c.fillRect(0,0,W,H);}
 c.restore();
}

function paintNarrative(){
 if(!W||!H)return;
 const now=performance.now();
 if(pointer.speed>.001){
  const elapsed=Math.max(0,now-(pointer.lastSpeedUpdateAt||now));
  pointer.speed*=Math.exp(-elapsed/230);
 }
 pointer.lastSpeedUpdateAt=now;
 const p=PAL[night()?'night':'day'];
 const t=clamp(play.t,0,7.9999),i=Math.min(7,Math.floor(t)),raw=t-i;
 // Cada tramo termina exactamente donde comienza el siguiente: las mismas piezas
 // viajan entre posiciones compartidas, en lugar de aparecer como dibujos distintos.
 // Cada capítulo alcanza su composición máxima antes del final del tramo
 // y conserva una pausa visual para leer e interactuar sin que se desarme.
 const u=i===1?smooth(.015,.91,raw):i===5?smooth(.015,.97,raw):smooth(.015,.72,raw);
 const dissolve=i<7?smooth(.62,.995,raw):0;
 ctx.setTransform(DPR,0,0,DPR,0,0);
 const background=i<7?mix(p.bg[i],p.bg[i+1],dissolve):p.bg[7];
 const contrast=contrastFor(background);
 // El texto y la navegación siguen el mismo fundido que el fondo, incluso
 // durante los fotogramas intermedios entre dos escenas.
 if(root.dataset.contrastInk!==contrast){
  root.dataset.contrastInk=contrast;
  root.style.setProperty('--ui-color',contrast);
  root.style.setProperty('--copy-contrast',contrast);
 }
 // El fondo se reutiliza desde el cache cuando el tramo no esta en
 // transicion; en transicion se repinta en vivo porque el color base se mueve.
 // El color base se mezcla en cada fotograma; las capas del fondo salen de
 // la cache por escena y se componen con el mismo crossfade que hacia el
 // motor, de modo que la transicion tambien pasa a ser un par de blits.
 ctx.clearRect(0,0,W,H);
 ctx.fillStyle=background;
 ctx.fillRect(0,0,W,H);
 if(!capaClaveValida()){
  capaTema=night()?'night':'day';capaAncho=W;capaAlto=H;capaDPR=DPR;
  capaInvalidar();
 }
 if(!capaListoA||capaTramoA!==i){
  capaGenerar(i,capaCanvasA,capaCtxA);capaTramoA=i;capaListoA=true;
 }
 if(i<7){
  if(!capaListoB||capaTramoB!==i+1){
   capaGenerar(i+1,capaCanvasB,capaCtxB);capaTramoB=i+1;capaListoB=true;
  }
 }else{capaListoB=false;capaTramoB=-1;}
 ctx.globalAlpha=1-dissolve;
 ctx.drawImage(capaCanvasA,0,0,W,H);
 if(capaListoB&&dissolve>.001){
  ctx.globalAlpha=dissolve;
  ctx.drawImage(capaCanvasB,0,0,W,H);
 }
 ctx.globalAlpha=1;
 pintarGrano(ctx);
 drawSceneAtmosphere(i,p);
 // La primera escena comienza mezclada y el propio scroll lleva las piezas
 // hasta su composición ordenada; no hay una animación automática que la adelante.
 if(i===1){
  // En esta escena las curvas quedan detrás de las piezas y reaparecen
  // entre columnas; nodos y puertos se dibujan encima para cerrar las uniones.
  draw1(u,p,'rails');
  drawModuleTransition(i,u,p);
  draw1(u,p,'nodes');
 }else if(i>=5){
  // Plataformas, conectores y ondas forman el fondo; las piezas siempre quedan delante.
  drawScene(i,u,p);
  drawModuleTransition(i,u,p);
 }else{
  drawModuleTransition(i,u,p);
  drawScene(i,u,p);
 }
}
// El tema afecta a todas las capas: cada una lee su paleta en su propio pintado.
function syncTheme(){themeButton.textContent=night()?'Modo día':'Modo noche';invalidateAll()}
themeButton.addEventListener('click',()=>{siteTheme?.click();syncTheme()});
document.addEventListener('click',e=>{if(e.target.closest('[data-theme-toggle]'))requestAnimationFrame(syncTheme)});
window.addEventListener('storage',syncTheme);
const themes=new MutationObserver(syncTheme);
themes.observe(document.documentElement,{attributes:true,attributeFilter:['data-jm-theme']});
syncTheme();
function navStatus(){
 // La cabecera también acompaña el último capítulo: el logo debe seguir disponible
 // cuando alguien vuelve hacia arriba y llega a "Todo comienza con una idea".
 const finalChapterActive=play.t>=7.25;
 const active=destination.getBoundingClientRect().top<=innerHeight*.92||finalChapterActive;
 document.body.classList.toggle('intro-in-content',active);
 header.inert=!active;header.setAttribute('aria-hidden',String(!active));
}
function skipJourney(e){
 e.preventDefault();destination.scrollIntoView({block:'start',behavior:'instant'});
 destination.focus({preventScroll:true});ScrollTrigger.update();navStatus();
}
skip.addEventListener('click',skipJourney);
function animateHomeReturn(){
 if(prefersReduced.matches)return;
 homeReturnTween?.kill();
 gsap.set(homeReturn,{scale:.42,turn:-1.18,lift:-1.08,glow:0,ring:0,opacity:0});
 homeReturnTween=gsap.timeline({onUpdate:invalidateNarrative,onComplete:()=>{homeReturnTween=null}});
 homeReturnTween
  .to(homeReturn,{scale:1.12,turn:.16,lift:.16,glow:1,ring:1,opacity:1,
   duration:.88,ease:'power3.out'},0)
  .to(homeReturn,{scale:1,turn:0,lift:0,duration:.76,ease:'back.out(1.35)'},.66)
  .to(homeReturn,{glow:0,ring:0,duration:1.28,ease:'sine.out'},.72);
}
function goToHomeStart(event){
 if(event){
  if(event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
 }
 if(location.hash!=='#home-start'){
  history.replaceState(history.state,'',location.pathname+location.search+'#home-start');
 }
 if(!trigger||!master){
  document.getElementById('home-start')?.scrollIntoView({block:'center',behavior:'instant'});
  return;
 }
 const html=document.documentElement,previousScrollBehavior=html.style.scrollBehavior;
 html.style.scrollBehavior='auto';
 trigger.scrubDuration(0);
 const finalCopy=copies[copies.length-1];
 const copyTopAtEnd=finalCopy.getBoundingClientRect().top+Math.max(0,window.scrollY-trigger.end);
 const desiredCopyTop=Math.max(header.getBoundingClientRect().height+24,innerHeight*.12);
 const targetY=trigger.end+Math.max(0,copyTopAtEnd-desiredCopyTop);
 window.scrollTo(0,targetY);
 ScrollTrigger.update();
 trigger.update();
 master.progress(1);
 syncSceneState();invalidateNarrative();navStatus();
 requestAnimationFrame(()=>{
  trigger.scrubDuration(.42);
  html.style.scrollBehavior=previousScrollBehavior;
  ScrollTrigger.update();navStatus();
 });
 animateHomeReturn();
}
document.querySelectorAll('[data-home-return]').forEach(link=>link.addEventListener('click',goToHomeStart));
function activeCopyForScene(scene){
 if(scene<=0)return 0;
 if(scene===1)return 1;
 if(scene===2)return 2;
 if(scene===3)return 3;
 if(scene<=5)return 4;
 if(scene===6)return 5;
 return 6;
}
let activeCopyIndex=-1;
function syncSceneState(){
 const scene=Math.min(7,Math.floor(play.t)),active=activeCopyForScene(scene);
 root.dataset.scene=String(scene);
 if(active!==activeCopyIndex){
  copies.forEach((c,i)=>{c.inert=i!==active;c.setAttribute('aria-hidden',String(i!==active))});
  activeCopyIndex=active;
 }
}
function setup(){
 stopSceneAmbient();
 if(prefersReduced.matches){idleMotion.value=0;sceneAmbient.value=0}
 homeReturnTween?.kill();homeReturnTween=null;
 Object.assign(homeReturn,{scale:1,turn:0,lift:0,glow:0,ring:0,opacity:1});
 master?.kill();trigger?.kill();seedPulseTween?.kill();seedPulseTween=null;seedPulse.value=0;
 introTween?.kill();introTween=null;introTextTween?.kill();introTextTween=null;
 introReveal.value=prefersReduced.matches?1:0;
 pointerTween?.kill();pointerFade?.kill();pointerTween=null;pointerFade=null;
 Object.assign(pointer,{x:0,y:0,energy:0,active:false,down:false,dirX:0,dirY:0,
  speed:0,lastMoveAt:0,lastSpeedUpdateAt:0,hasPosition:false});
 activeCopyIndex=-1;
 const compact=matchMedia('(max-height:620px)').matches,reduce=prefersReduced.matches,simple=reduce;
 root.classList.toggle('is-compact',compact);root.classList.toggle('is-mobile',mqMobile.matches);
 root.classList.toggle('is-static',simple);root.classList.toggle('is-linked',!simple);
 document.body.classList.add('intro-ready');
 buildWord();
 if(simple){
  root.dataset.scene='0';
  root.classList.add('all-copies');
  introReveal.value=1;
  play.t=0;
  copies.forEach(c=>{c.inert=false;c.removeAttribute('aria-hidden');gsap.set(c,{clearProps:'all'})});
  document.body.classList.add('intro-in-content');
  header.inert=false;header.removeAttribute('aria-hidden');
  resize();return;
 }
 root.classList.remove('all-copies');
 master=gsap.timeline({paused:true,onUpdate:()=>{
  invalidateNarrative();syncSeedPulse();syncSceneState();
 }});
 play.t=0;
 // El ritmo reserva tiempo para que cada transformación se complete y pueda leerse.
 // La escena de encaje recibe más recorrido para que el movimiento tenga tiempo de leerse y reposar.
  const sceneLengths=[1.48,2.20,1.88,1.72,1.54,1.88,1.62,1.38];
 const sceneStarts=[0];
 sceneLengths.forEach((length,i)=>{
  master.to(play,{t:i+1,duration:length,ease:'none'},sceneStarts[i]);
  master.addLabel('chapter-'+i,sceneStarts[i]+length*.5);
  sceneStarts.push(sceneStarts[i]+length);
 });
 master.addLabel('finish',sceneStarts[8]+.02);
 const copyStarts=[0,1,2,3,4,6,7];
 copies.forEach((copy,i)=>{
  const fragments=copy.querySelectorAll('.study-mask>span'),desc=copy.querySelector('.study-description');
  const rule=copy.querySelector('.study-rule'),begin=sceneStarts[copyStarts[i]]+(i===1?.38:i===2?.08:i===3?.02:i===4?.28:i===5?.36:i===6?.32:i>0?-.12:0);
  const endScene=i===4?6:copyStarts[i+1],fromX=i===1?24:i===3?-20:0;
  gsap.set(copy,{autoAlpha:i===0?1:0});
  gsap.set(fragments,{yPercent:105,xPercent:i===0?0:fromX});
  gsap.set(rule,{scaleX:0,transformOrigin:'left center'});
  if(desc)gsap.set(desc,{opacity:0,y:18});
  if(i===0){
   // La primera frase no debe esperar a que el visitante haga scroll.
   // La primera línea es visible desde la carga; la segunda se revela.
   gsap.set(fragments[0],{yPercent:0,y:12,opacity:0});
  }else{
   master.to(copy,{autoAlpha:1,duration:.16},begin+.01);
   master.to(fragments,{yPercent:0,xPercent:0,duration:i===2?.66:i===1?.62:i===3?.62:i===4?.58:.48,stagger:i===2?.25:i===1?.19:i===4?.22:.15,ease:'power3.out'},begin+.04);
   master.to(rule,{scaleX:1,duration:i===2?.46:.36,ease:'sine.out'},begin+(i===2?.77:i===1?.76:i===4?.72:.57));
   if(desc)master.to(desc,{opacity:1,y:0,duration:i===2?.56:i===3?.48:i===4?.50:.42,ease:'power2.out'},begin+(i===2?.98:i===1?.85:i===3?.82:i===4?.88:.70));
  }
  if(i<6)master.to(copy,{autoAlpha:0,duration:.18},sceneStarts[endScene]-.18);
 });
 master.to({},{duration:.02},sceneStarts[8]+.02);
 trigger=ScrollTrigger.create({id:'jmorgado-journey',trigger:root,start:'top top',end:'bottom bottom',
  animation:master,scrub:.42,anticipatePin:1,invalidateOnRefresh:true,
  onUpdate:()=>{syncSceneState();navStatus()}});
 master.progress(trigger.progress);
 syncSceneState();
 resize();navStatus();
 const first=copies[0],fragments=first.querySelectorAll('.study-mask>span');
 const rule=first.querySelector('.study-rule'),desc=first.querySelector('.study-description');
 introTextTween=gsap.timeline({onComplete:()=>{introTextTween=null}});
 introTextTween.to(fragments[0],{opacity:1,y:0,duration:.58,ease:'power2.out'},0);
 if(fragments[1])introTextTween.to(fragments[1],{yPercent:0,duration:.68,ease:'power3.out'},.16);
 introTextTween.to(rule,{scaleX:1,duration:.38,ease:'sine.out'},.52);
 if(desc)introTextTween.to(desc,{opacity:1,y:0,duration:.46,ease:'power2.out'},.70);
 if(window.scrollY>16)introTextTween.progress(1);
 introTween=gsap.to(introReveal,{value:1,duration:2.68,ease:'none',onUpdate:invalidateNarrative});
 scheduleSceneAmbient(1100);
}
let resizeTick=0;
window.addEventListener('resize',()=>{
 cancelAnimationFrame(resizeTick);resizeTick=requestAnimationFrame(()=>{resize();ScrollTrigger.refresh()});
});
prefersReduced.addEventListener('change',setup);
mqMobile.addEventListener('change',setup);
document.fonts.ready.then(()=>{buildWord();resize();ScrollTrigger.refresh()});

// D · Ciclo de fotogramas del motor. Un solo ciclo gobierna todas las capas:
// el puntero se aplica una vez, el ambiente respira a su ritmo y el relato se
// repinta sólo cuando ha cambiado. Cuando la escena está detenida el motor no
// mantiene trabajo de pintado: si nada está sucio, no se pinta nada.
function engineTick(){
 // El reloj propio del navegador. El tiempo que entrega el ticker de GSAP es un
 // tiempo de animación relativo y puede saltar hacia atrás al corregir el retardo
 // (lag smoothing), así que no sirve para medir cadencias.
 const now=performance.now();
 if(pointerDirty){pointerDirty=false;applyPointer(pendingPointer)}
 ambientTick(now);
 ajustarResolucion();
 // C · El ambiente se pinta a su propio ritmo y nunca arrastra al relato.
 if(ambientLayer.due(now))ambientLayer.paint(now);
 // A · El relato sólo se repinta si su estado ha cambiado de verdad.
 if(narrativeLayer.due(now))narrativeLayer.paint(now);
}
gsap.ticker.add(engineTick);
 // El sondeo arranca una sola vez y mide el intervalo real entre fotogramas.
 // El nivel de resolucion se inicializa ANTES de decidir: dprAjustable()
 // depende de el y, al evaluarse antes, el sondeo nunca llegaba a arrancar.
 dprInicializar();
 if(dprAjustable()&&!frameSonda){
  frameSonda=requestAnimationFrame(frameSondaTick);
 }

setup();
window.addEventListener('scroll',navStatus,{passive:true});
if(location.hash==='#home-start'){
 requestAnimationFrame(()=>requestAnimationFrame(()=>goToHomeStart()));
}
})();
