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
 day:{bg:['#E9E3D8','#E2DCCE','#D3CDC0','#BDB6A6','#08272C','#10333A','#C9C3B4','#F0EDE6'],
 ink:'#222327',cream:'#FCFAF5',petrol:'#23494E',coral:'#F45A3A',amber:'#E8B769',olive:'#737B69',stone:'#C9C8B7',ash:'#A5A18D',clay:'#D99B89'},
 night:{bg:['#131E23','#18262C','#1F2D33','#25353C','#08272C','#10333A','#16242A','#111B20'],
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
function drawBackdropWash(x,y,r,color,opacity){
 if(opacity<=.001)return;
 const gradient=fondoCtx.createRadialGradient(x,y,0,x,y,r);
 gradient.addColorStop(0,rgba(color,opacity));
 gradient.addColorStop(.36,rgba(color,opacity*.48));
 gradient.addColorStop(.74,rgba(color,opacity*.12));
 gradient.addColorStop(1,rgba(color,0));
 fondoCtx.fillStyle=gradient;fondoCtx.fillRect(0,0,W,H);
}
function drawSurfaceMaterial(scene,p){
 const isNight=night(),extent=Math.max(W,H),acto=scene<=1?0:scene<=3?1:scene<=5?2:3;
 if(!isNight){
  // Luz de superficie: un plano claro arriba y una caída tonal real hacia el borde.
  const plane=fondoCtx.createLinearGradient(0,0,W,H);
  plane.addColorStop(0,rgba(p.cream,.26));
  plane.addColorStop(.28,rgba(p.cream,.09));
  plane.addColorStop(.66,rgba(p.ink,.018));
  plane.addColorStop(1,rgba(p.ink,.10));
  fondoCtx.fillStyle=plane;fondoCtx.fillRect(0,0,W,H);
 }else if(acto===0){
  const sombra=fondoCtx.createLinearGradient(0,0,0,H);
  sombra.addColorStop(0,rgba('#050D12',.22));
  sombra.addColorStop(.55,'rgba(5,13,18,0)');
  sombra.addColorStop(1,rgba('#050D12',.30));
  fondoCtx.fillStyle=sombra;fondoCtx.fillRect(0,0,W,H);
 }
 // La textura se compone en soft-light, una sola vez por fotograma.
 if(grainPattern){
  fondoCtx.save();fondoCtx.globalCompositeOperation='soft-light';
  fondoCtx.globalAlpha*=isNight?.06:.135;
  if(grainReady)fondoCtx.drawImage(grainCanvas,0,0,W,H);
  else{fondoCtx.fillStyle=grainPattern;fondoCtx.fillRect(0,0,W,H);}
  fondoCtx.restore();
 }
}
function drawBackdropLayer(scene,p,alpha=1){
 if(alpha<=.002)return;
 const isNight=night(),extent=Math.max(W,H),acto=scene<=1?0:scene<=3?1:scene<=5?2:3;
 fondoCtx.save();fondoCtx.globalAlpha*=alpha;
 // Una luz diagonal común mantiene la identidad del recorrido sin uniformar sus actos.
 const directional=fondoCtx.createLinearGradient(0,0,W,H);
 directional.addColorStop(0,rgba(p.cream,isNight?.028:.15));
 directional.addColorStop(.48,rgba(p.cream,0));
 directional.addColorStop(1,rgba(isNight?'#050B10':p.ink,isNight?.075:.07));
 fondoCtx.fillStyle=directional;fondoCtx.fillRect(0,0,W,H);
 if(acto===0){
  // Marfil: apertura caliente con una masa a la derecha, donde vive la materia.
  const phase=idleMotion.time,idle=idleMotion.value;
  const lightX=W*(.66+Math.sin(phase*.10)*.02*idle);
  drawBackdropWash(lightX,H*.60,extent*.55,isNight?p.amber:p.petrol,isNight?.16:.10);
  drawBackdropWash(W*.16,H*.24,extent*.46,p.cream,isNight?.06:.20);
  if(!isNight)drawBackdropWash(W*.78,H*.86,extent*.48,p.olive,.055);
 }else if(acto===1){
  // Neutro en transición: la materia gana profundidad antes de encenderse.
  const lightX=W*(.50+Math.sin(idleMotion.time*.13+1.1)*.015*idleMotion.value);
  drawBackdropWash(lightX,H*.50,extent*.62,p.olive,isNight?.13:.15);
  drawBackdropWash(W*.50,H*.78,extent*.40,p.cream,isNight?.04:.08);
  drawBackdropWash(W*.16,H*.14,extent*.34,isNight?p.petrol:p.stone,isNight?.10:.42);
 }else if(acto===2){
  // Petróleo: el interior se enciende y el frente recorre la red.
  const ember=fondoCtx.createRadialGradient(W*.50,H*.58,0,W*.50,H*.58,extent*.66);
  ember.addColorStop(0,rgba(p.coral,isNight?.30:.34));
  ember.addColorStop(.34,rgba(p.amber,isNight?.12:.16));
  ember.addColorStop(.72,rgba(isNight?'#04303A':'#043038',isNight?.30:.42));
  ember.addColorStop(1,rgba('#000000',isNight?.28:.22));
  fondoCtx.fillStyle=ember;fondoCtx.fillRect(0,0,W,H);
  drawBackdropWash(W*.50,H*.44,extent*.40,p.petrol,isNight?.18:.22);
 }else{
  // Integración: la luz se disuelve y deja paso al papel del portafolio.
  const lift=fondoCtx.createLinearGradient(0,H*.40,0,H);
  lift.addColorStop(0,rgba(p.cream,isNight?.04:.28));
  lift.addColorStop(.55,rgba(p.cream,isNight?.02:.10));
  lift.addColorStop(1,'rgba(0,0,0,0)');
  fondoCtx.fillStyle=lift;fondoCtx.fillRect(0,0,W,H);
  drawBackdropWash(W*.50,H*.70,extent*.66,isNight?p.petrol:p.stone,isNight?.16:.22);
 }
 const edgeColor=isNight?'#050B10':p.ink;
 drawSurfaceMaterial(scene,p);
 const vignette=fondoCtx.createRadialGradient(W*.50,H*.48,Math.min(W,H)*.28,
  W*.50,H*.48,extent*.78);
 vignette.addColorStop(0,rgba(edgeColor,0));
 vignette.addColorStop(.68,rgba(edgeColor,isNight?.025:.025));
 vignette.addColorStop(1,rgba(edgeColor,isNight?.115:.07));
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
// Respiración ambiental: balizas lentas sobre la retícula y una luz que
// la barre de lado a lado. No toca el estado del relato; vive al ritmo
// del propio lienzo y nunca ensombrece la lectura.
function drawIdleSceneAmbient(scene,u,p,t){
 const acto=scene<=1?0:scene<=3?1:scene<=5?2:3;
 const acentos=[p.amber,p.coral,p.cream,p.amber];
 for(let j=0;j<4;j++){
  const i=(j*29+13)%PIONEER_N;
  if(!Number.isFinite(pioneerX[i]))continue;
  const v=.5+.5*Math.sin(t*.9+j*1.9);
  const x=pioneerX[i],y=pioneerY[i];
  idleBeacon(x,y,acentos[(j+acto)%4],t,j,.10+.24*v*v);
 }
 // Una luz fría recorre el conjunto con un ciclo muy largo.
 const barrido=(t*.055)%1;
 const sx=W*(.14+.72*barrido),sy=H*.56;
 idleGlow(sx,sy,p.petrol,.10+.07*Math.sin(t*.8),W<700?12:20);
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
/* Todas las escenas comparten la misma familia modular: proporciones variadas,
   sin fichas rígidas ni logos explicativos. El índice mantiene identidad y color. */
// La paleta se construye una vez por tema en lugar de en cada pieza.
const modulePalettes={};
function barAspect(){return W<700?2.1:3.55}
/* Lenguaje de encaje compartido: mismo módulo, mismo destino, giro reversible.
   Cada gesto vale exactamente cero en ambos extremos del recorrido y nunca
   altera la geometría ni las duraciones fijadas en la línea de tiempo. */
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
function syncSeedPulse(){
 const active=play.t>=6.6&&play.t<=8&&!prefersReduced.matches;
 if(active&&!seedPulseTween){
  seedPulseTween=gsap.to(seedPulse,{value:1,duration:1.55,repeat:-1,yoyo:true,
   ease:'sine.inOut',onUpdate:invalidateNarrative});
 }else if(!active&&seedPulseTween){
  seedPulseTween.kill();seedPulseTween=null;seedPulse.value=0;
 }
}
function drawScene(i,u,p){
 // El experimento sustituye el dibujo de las siete escenas por una sola
 // estructura parametrica: el estado lo da el avance global del recorrido.
 pioneerDibujar(p);
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

// ============================================================================
// ============================================================================
// INTRODUCCIÓN JMORGADO — la estructura que aprende
//
// Un único protagonista: 96 fragmentos de la misma materia que se ordenan,
// se encienden, crecen y se retiran para dejar paso al portafolio.
// El recorrido es continuo e inverso con el scroll; la cámara y el estado
// del mundo derivan del avance global `play.t / 8`.
//
//   Acto 1 · Fragmentos con potencial  la retícula deshecha; el polvo roza IDEA
//   Acto 2 · Organización y conexión   retícula en cúpula + red que se enciende
//   Acto 3 · Lo que funciona puede crecer  CRECER formado mediante partículas
//   Acto 4 · Integración               la estructura se abre y cede el sitio
//
// Inspiración de dirección: Pioneer (Corn Revolutionized). Sin copiar recursos
// ni identidad. Sin WebGL, sin vídeo, sin dependencias nuevas.
// Coste por fotograma: 96 rellenos + 64 partículas + ~127 trazos (actos 2 y 3)
// + 1 resplandor cacheado. Sin shadowBlur por pieza ni gradientes por pieza.
// ============================================================================
const PIONEER_N=96;
const PIONEER_ORDEN=.78;
const pioneerCaos=new Float32Array(PIONEER_N*3);
const pioneerOrden=new Float32Array(PIONEER_N*3);
const pioneerRetraso=new Float32Array(PIONEER_N);
const pioneerGrupo=new Uint8Array(PIONEER_N);   // 0 cuerpo · 1 banda · 2 envolvente
const pioneerRadio=new Float32Array(PIONEER_N);
const pioneerTinte=new Float32Array(PIONEER_N);
const pioneerPorRango=new Uint8Array(PIONEER_N);
const pioneerAristas=new Int32Array(2*128);
let pioneerAristasN=0;
const pioneerX=new Float32Array(PIONEER_N);
const pioneerY=new Float32Array(PIONEER_N);
const pioneerZ=new Float32Array(PIONEER_N);
const pioneerS=new Float32Array(PIONEER_N);
const pioneerFase=new Float32Array(PIONEER_N);
const pioneerIdx=new Uint8Array(PIONEER_N);
const pioneerWx=new Float32Array(PIONEER_N);
const pioneerWy=new Float32Array(PIONEER_N);
const PIONEER_CUERPO=56,PIONEER_BANDA=24,PIONEER_ENVOLVENTE=16;

// El resplandor interior es un sprite cacheado: un único gradiente radial.
let pioneerSprite=null;
let pioneerSpriteKey='';
function pioneerResplandor(color){
 const clave=color+'|'+Math.round(DPR*100);
 if(pioneerSprite&&pioneerSpriteKey===clave)return pioneerSprite;
 const s=192;
 const c=document.createElement('canvas');
 c.width=c.height=s;
 const g=c.getContext('2d');
 const grad=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
 grad.addColorStop(0,rgba(color,.95));
 grad.addColorStop(.42,rgba(color,.34));
 grad.addColorStop(1,rgba(color,0));
 g.fillStyle=grad;
 g.fillRect(0,0,s,s);
 pioneerSprite=c;
 pioneerSpriteKey=clave;
 return c;
}

function pioneerPreparar(){
 const golden=Math.PI*(3-Math.sqrt(5));
 const idx=[];
 for(let i=0;i<PIONEER_N;i++)idx.push(i);
 idx.sort((a,b)=>hash(a*13+3)-hash(b*13+3));
 for(let r=0;r<PIONEER_N;r++)pioneerPorRango[r]=idx[r];
 for(let r=0;r<PIONEER_N;r++){
  const i=pioneerPorRango[r];
  const g=r<PIONEER_CUERPO?0:(r<PIONEER_CUERPO+PIONEER_BANDA?1:2);
  pioneerGrupo[i]=g;
  // 2 · orden: retícula de Vogel en cúpula, con aro de banda y envolvente.
  const sr=Math.sqrt((r+.5)/PIONEER_N),sa=(r+.5)*golden;
  let rr=sr,yy=.30*(1-sr*sr);
  if(g===1){rr=.88+.08*hash(i*5+9);yy=.015;}
  if(g===2){rr=1.16+.07*Math.sin(r*1.7);yy=.34*Math.sin(r*.9);}
  const ox=rr*Math.cos(sa)*PIONEER_ORDEN;
  const oy=yy*PIONEER_ORDEN;
  const oz=rr*Math.sin(sa)*PIONEER_ORDEN;
  pioneerOrden[i*3]=ox;
  pioneerOrden[i*3+1]=oy;
  pioneerOrden[i*3+2]=oz;
  pioneerRadio[i]=rr*PIONEER_ORDEN;
  // 1 · dispersión: la materia deshecha nace de la propia retícula.
  const giro=(hash(i*29+3)-.5)*.90;
  const esc=.70+.58*hash(i*11+3);
  const cg=Math.cos(giro),sg=Math.sin(giro);
  const px=ox*esc,pz=oz*esc;
  pioneerCaos[i*3]=px*cg-pz*sg+(hash(i*37+11)-.5)*.20;
  pioneerCaos[i*3+1]=oy*esc*.85+(hash(i*41+17)-.5)*.46;
  pioneerCaos[i*3+2]=px*sg+pz*cg+(hash(i*43+19)-.5)*.20;
  pioneerRetraso[i]=hash(i*13+31)*.30;
  pioneerTinte[i]=hash(i*23+19);
 }
 // La red: la espiral y sus radios. Son las «uniones» del acto 2.
 let e=0;
 for(let r=0;r<PIONEER_N-1&&e<128;r++){
  pioneerAristas[e*2]=pioneerPorRango[r];
  pioneerAristas[e*2+1]=pioneerPorRango[r+1];
  e++;
 }
 for(let r=0;r<32&&e<128;r++){
  pioneerAristas[e*2]=pioneerPorRango[r];
  pioneerAristas[e*2+1]=pioneerPorRango[r+24];
  e++;
 }
 pioneerAristasN=e;
}
pioneerPreparar();

// ── Tipografía cinética: puntos de las letras ───────────────────────────────
// Un solo lienzo temporal para medir los puntos; el campo se cachea por palabra.
const pioneerCampos={};
function pioneerCampo(palabra){
 let v=pioneerCampos[palabra];
 if(v)return v;
 const temp=document.createElement('canvas');
 temp.width=1400;temp.height=340;
 const c=temp.getContext('2d',{willReadFrequently:true});
 c.clearRect(0,0,1400,340);c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';
 c.font='800 268px "Instrument Sans",sans-serif';c.fillText(palabra,700,172,1380);
 const data=c.getImageData(0,0,1400,340).data;
 const bruto=[];
 let minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9;
 for(let y=6;y<334;y+=3)for(let x=4;x<1396;x+=3){
  if(data[(y*1400+x)*4+3]>120){
   bruto.push({x,y});
   if(x<minX)minX=x; if(x>maxX)maxX=x;
   if(y<minY)minY=y; if(y>maxY)maxY=y;
  }
 }
 const ancho=Math.max(1,maxX-minX),alto=Math.max(1,maxY-minY);
 const cx0=(minX+maxX)/2,cy0=(minY+maxY)/2;
 const pts=new Array(bruto.length);
 for(let i=0;i<bruto.length;i++)pts[i]={x:(bruto[i].x-cx0)/ancho,y:(bruto[i].y-cy0)/alto};
 v={pts,aspecto:alto/ancho};
 pioneerCampos[palabra]=v;
 return v;
}
function pioneerCampoPunto(campo,i){
 const pts=campo.pts;
 if(!pts.length)return{x:0,y:0};
 return pts[(i*73+Math.floor(hash(i*7+3)*pts.length))%pts.length];
}

// Las partículas de polvo: la misma materia que los fragmentos, a otra escala.
const DUST_N=620;
const dustX=new Float32Array(DUST_N);
const dustY=new Float32Array(DUST_N);
const dustS=new Float32Array(DUST_N);
const dustTinte=new Uint8Array(DUST_N);
const dustAlpha=new Float32Array(DUST_N);
function pioneerPolvo(e,p,fondo){
 const tiempo=prefersReduced.matches?0:idleMotion.time;
 const cx=W*.5,cy=H*.485;   // la palabra CRECER vive algo por encima del centro
 const palabra='CRECER';
 const campo=pioneerCampo(palabra);
 const destinoW=Math.min(W*.70,860),destinoH=destinoW*campo.aspecto;
 // Compuertas por acto: el polvo existe en los momentos narrativos.
 const aIdea=1-smooth(.24,.30,e.g);
 const aCrecer=smooth(.40,.50,e.g)*(1-smooth(.64,.72,e.g));
 const aCaida=smooth(.68,.96,e.g);
 for(let i=0;i<DUST_N;i++){
  const h1=hash(i*3+11),h2=hash(i*5+17),h3=hash(i*7+29),h4=hash(i*11+43);
  const ph=h1*6.28318;
  let x,y,tam,tinta,surge;
  // Trayectoria base en deriva, distinta por partícula.
  const paso=tiempo*.16;
  const derivaX=Math.sin(paso*(.7+h2*.6)+ph);
  const derivaY=Math.cos(paso*(.62+h3*.5)+ph*1.7);
  const baseX=W*(.5+(h2-.5)*.62)+derivaX*W*.045;
  const baseY=H*(.40+h3*.34)+derivaY*H*.04;
  if(aCrecer>.001||aCaida>.001){
   // Acto 3/4 · el polvo converge y escribe CRECER en el centro.
   // El reparto es un barrido uniforme: cada partícula toma su propia
   // posición de la silueta, de modo que las letras quedan cubiertas.
  const total=campo.pts.length;
  const punto=campo.pts[Math.floor(i*(total-1)/(DUST_N-1))];
  const dx=cx+punto.x*destinoW;
  const dy=cy+punto.y*destinoH;
  const cp=clamp((e.expansion-.10-h2*.26)/.32,0,1);
  const ease=cp*cp*(3-2*cp);
  x=baseX+(dx-baseX)*ease;
  y=baseY+(dy-baseY)*ease;
  if(aCaida>0){y+=aCaida*(.22+.62*h3)*H;x+=(h2-.5)*W*.10*aCaida;}
  tam=(2.4+2.6*h4)*(Math.min(W,H)<520?.62:1);
  tinta=h4<.40?2:h4<.70?1:0;
  surge=aCrecer*(.34+.58*h4)+aCaida*(.62+.34*h4)*(1-aCaida*.55);
 }else{
  // Acto 1 · el polvo roza la palabra IDEA: deriva y se deja atraer.
  const rect=pioneerMedirTexto();
  x=baseX;y=baseY;
  if(rect){
   const dx=rect.cx-x,dy=rect.cy-y,d=Math.hypot(dx,dy)||1;
   const pull=clamp(1-d/(Math.min(W,H)*.44),0,1)*.62;
   x+=dx/d*pull*Math.min(W,H)*.16;
   y+=dy/d*pull*Math.min(W,H)*.16;
  }
  tam=(2.6+2.6*h4)*(Math.min(W,H)<520?.62:1);
  tinta=h4<.30?2:h4<.62?0:1;
  surge=(i<150?aIdea*(.26+.60*h4):0);
 }
 dustX[i]=x;dustY[i]=y;dustS[i]=tam;dustTinte[i]=tinta;
 dustAlpha[i]=surge;
}
}
function pioneerMedirTexto(){
 const ahora=performance.now();
 if(pioneerMedirTexto.cache&&ahora-pioneerMedirTexto.t<700)return pioneerMedirTexto.cache;
 const el=root.querySelector('[data-copy="0"] .study-key');
 if(!el){pioneerMedirTexto.cache=null;pioneerMedirTexto.t=ahora;return null;}
 const r=el.getBoundingClientRect();
 const rect={cx:r.left+r.width*.5,cy:r.top+r.height*.5};
 pioneerMedirTexto.cache=rect;
 pioneerMedirTexto.t=ahora;
 return rect;
}

// El recorrido global: 0 al principio, 1 al final.
function pioneerClave(valores,g){
 const n=valores.length-1;
 const f=clamp(g)*n;
 const i=Math.min(n-1,Math.floor(f));
 return lerp(valores[i],valores[i+1],f-i);
}
function pioneerEstado(){
 const g=clamp(play.t/8,0,1);
 const orden=smooth(.04,.28,g);
 const activacion=smooth(.28,.44,g);
 const expansion=smooth(.42,.62,g);
 const apertura=smooth(.60,.80,g);
 const huida=smooth(.76,.94,g);
 const tiempo=prefersReduced.matches?0:idleMotion.time;
 return {
  g,orden,activacion,expansion,apertura,huida,
  angulo:tiempo*.048+g*1.62,
  elevacion:pioneerClave([.40,.38,.46,.36,.30,.22],g),
  distancia:pioneerClave([3.70,3.60,3.26,3.02,3.22,3.55],g),
  centroX:pioneerClave([.67,.66,.33,.33,.50,.50,.50],g),
  centroY:pioneerClave([.575,.555,.545,.555,.60,.635],g),
  escala:pioneerClave([.57,.56,.53,.50,.47,.42],g),
 };
}
function pioneerFondo(){
 const t=clamp(play.t,0,7.9999),i=Math.min(7,Math.floor(t)),raw=t-i;
 const dissolve=i<7?smooth(.62,.995,raw):0;
 const p=PAL[night()?'night':'day'];
 return i<7?mix(p.bg[i],p.bg[i+1],dissolve):p.bg[7];
}
function pioneerLuz(color){
 const c=color.startsWith('rgb')?color.match(/[\d.]+/g).slice(0,3).map(Number):rgb(color);
 return (c[0]*.2126+c[1]*.7152+c[2]*.0722)/255;
}
function pioneerOscuro(color){
 return pioneerLuz(color)<.42;
}
// El acento de la marca (coral) desaparece sobre un fondo coral: cede cuando pasa.
function pioneerAcento(p,fondo,oscuro){
 if(Math.abs(pioneerLuz(p.coral)-pioneerLuz(fondo))<.15)return oscuro?p.cream:p.ink;
 return p.coral;
}

function pioneerDibujar(p){
 const e=pioneerEstado();
 const fondo=pioneerFondo();
 const oscuro=pioneerOscuro(fondo);
 const centroX=W*e.centroX,centroY=H*e.centroY;
 const escala=Math.min(W,H)*e.escala;
 const ang=e.angulo,elev=e.elevacion,dist=e.distancia;
 const ca=Math.cos(ang),sa=Math.sin(ang),ce=Math.cos(elev),se=Math.sin(elev);
 const focal=2.2;
 const calidez=smooth(.28,.52,e.g);
 const acento=pioneerAcento(p,fondo,oscuro);
 const colorCuerpo=oscuro?mix(p.cream,p.stone,.22):mix(p.ink,p.petrol,.30);
 const colorBanda=mix(acento,oscuro?p.amber:acento,.14+calidez*.26);
 const colorHalo=oscuro?mix(p.cream,p.ash,.46):mix(p.stone,p.ash,.34);
 const colorLinea=oscuro?mix(p.cream,p.petrol,.58):mix(p.petrol,p.cream,.20);
 const colorRed=mix(colorLinea,p.amber,.72);

 // 1 · posiciones en el mundo.
 const tamBase=escala*(.032+.026*e.orden);
 const fade=(1-e.huida*.85);
 for(let i=0;i<PIONEER_N;i++){
  const k=i*3;
  const ret=pioneerRetraso[i];
  const tO=clamp((e.orden-ret*.52)/(1-ret*.52));
  let x=pioneerCaos[k]*(1-tO)+pioneerOrden[k]*tO;
  let y=pioneerCaos[k+1]*(1-tO)+pioneerOrden[k+1]*tO;
  let z=pioneerCaos[k+2]*(1-tO)+pioneerOrden[k+2]*tO;
  // El perímetro se abre: el crecimiento nace del borde. En la apertura final
  // la estructura se aplana y cede el sitio al portafolio.
  const apertura=Math.max(e.expansion,e.apertura*1.15);
  if(apertura>0){
   const ext=Math.max(0,pioneerRadio[i]-.46);
   const push=1+apertura*(.12+.62*ext);
   x*=push;z*=push;
   y+=apertura*(.05+.78*ext)-e.apertura*.34;
  }
  // En el acto 4 la materia se desprende y cae (en el mundo 3D).
  y-=e.huida*.85;
  // La cámara: órbita continua, se acerca y se eleva.
  const x1=x*ca-z*sa,z1=x*sa+z*ca;
  const y2=y*ce-z1*se,z2=y*se+z1*ce;
  const zz=dist-z2;
  const prof=focal/Math.max(.4,zz);
  pioneerX[i]=centroX+x1*prof*escala;
  pioneerY[i]=centroY-y2*prof*escala;
  pioneerZ[i]=zz;
  pioneerS[i]=tamBase*prof;
  pioneerFase[i]=i*2.399963+e.angulo*.30;
 }
 // La palabra CRECER la escriben los propios fragmentos: la geometría responde
 // a las letras. Se calcula en espacio de pantalla para que la órbita de la
 // cámara no distorsione la tipografía.
 const tL=smooth(.40,.57,e.g);
 if(tL>0){
  const campo=pioneerCampo('CRECER');
  const destinoW=Math.min(W*.70,860),destinoH=destinoW*campo.aspecto;
  const total=campo.pts.length;
  const cyLetra=H*.50;
  for(let i=0;i<PIONEER_N;i++){
   // Dispersión por área: cada fragmento cae en un punto de la silueta
   // con cobertura uniforme, sin bandas diagonales.
   const punto=campo.pts[Math.floor(hash(i*13+7)*total)%total];
   pioneerWx[i]=centroX+punto.x*destinoW;
   pioneerWy[i]=cyLetra+punto.y*destinoH;
  }
 }
 // 2 · orden de profundidad: el pintor, de lejos a cerca.
 for(let i=0;i<PIONEER_N;i++)pioneerIdx[i]=i;
 for(let a=1;a<PIONEER_N;a++){
  const j=pioneerIdx[a],k=pioneerZ[j];
  let b=a-1;
  while(b>=0&&pioneerZ[pioneerIdx[b]]>k){pioneerIdx[b+1]=pioneerIdx[b];b--;}
  pioneerIdx[b+1]=j;
 }
 // 3 · la luz interior: un único resplandor cacheado.
 const radioLuz=escala*(.58+.32*e.activacion+.10*e.apertura);
 let colorLuz=p.amber;
 if(Math.abs(pioneerLuz(colorLuz)-pioneerLuz(fondo))>.13)colorLuz=mix(p.amber,p.coral,.28+calidez*.42);
 ctx.globalAlpha=(oscuro?.06:.04)+(.24*e.activacion*(1-e.apertura*.85))+(.07*e.apertura);
 ctx.drawImage(pioneerResplandor(colorLuz),centroX-radioLuz,centroY-radioLuz,radioLuz*2,radioLuz*2);
 ctx.globalAlpha=1;
 // 4 · la red de uniones: aparece en el acto 2 y se enciende en el 3.
 const web=smooth(.04,.22,e.g)*(1-smooth(.62,.80,e.g));
 if(web>.01){
  const frente=prefersReduced.matches?0:(idleMotion.time*.075)%1;
  const act=e.activacion;
  ctx.lineWidth=1;
  for(let a=0;a<pioneerAristasN;a++){
   const i=pioneerAristas[a*2],j=pioneerAristas[a*2+1];
   const prof=clamp((pioneerZ[i]+pioneerZ[j])*.5-1.1,0,2.6)/2.6;
   const s=a/Math.max(1,pioneerAristasN-1);
   const pulso=smooth(.10,0,Math.abs(s-frente));
   ctx.globalAlpha=web*(.30+.34*act+.55*act*pulso)*(1-prof*.70)*fade;
   ctx.strokeStyle=act>.02&&pulso>.04?colorRed:colorLinea;
   ctx.beginPath();
   ctx.moveTo(pioneerX[i],pioneerY[i]);
   ctx.lineTo(pioneerX[j],pioneerY[j]);
   ctx.stroke();
  }
  ctx.globalAlpha=1;
 }
 // 5 · los fragmentos, de lejos a cerca.
 const alcance=Math.min(W,H)*.34;
 for(let a=0;a<PIONEER_N;a++){
  const i=pioneerIdx[a];
  const g=pioneerGrupo[i];
  const ret=pioneerRetraso[i];
  const tO=clamp((e.orden-ret*.52)/(1-ret*.52));
  const niebla=clamp((pioneerZ[i]-1.15)/3.4,0,.62);
  const luz=clamp(1-(pioneerZ[i]-1.0)*.55,.18,1);
  const activo=e.activacion;
  let base=g===1?colorBanda:(g===2?colorHalo:colorCuerpo);
  base=mix(base,mix(base,p.cream,.60),luz*(.12+.46*activo));
  base=mix(base,fondo,niebla*.62);
  // La respuesta al puntero se mantiene localizada y sutil.
  const inf=pointerInfluenceAt(pioneerX[i],pioneerY[i],alcance);
  let sx=pioneerX[i],sy=pioneerY[i];
  if(tL>0){
   sx+=(pioneerWx[i]-sx)*tL;
   sy+=(pioneerWy[i]-sy)*tL+e.huida*(.20+.55*hash(i*3+5))*H;
  }
  if(inf.strength>.001){
   const d=Math.max(1,inf.distance);
   const off=inf.strength*escala*.085;
   sx+=inf.dx/d*off;
   sy+=inf.dy/d*off;
  }
  const tL2=smooth(.40,.57,e.g);
  const s=pioneerS[i]*(1+inf.strength*.35)*(1-tL2*.24);
  const c2=Math.cos(pioneerFase[i]),s2=Math.sin(pioneerFase[i]);
  const ex=s*.60,ey=s*.88;
  const apago=1-smooth(.55,.72,e.g)*.32;
  const alpha=(.72+.28*tO)*(.80+.20*activo)*(1-niebla*.30)*fade*apago;
  ctx.globalAlpha=alpha;
  ctx.fillStyle=base;
  ctx.beginPath();
  ctx.moveTo(sx+c2*ex,sy+s2*ex);
  ctx.lineTo(sx-s2*ey,sy+c2*ey);
  ctx.lineTo(sx-c2*ex,sy-s2*ex);
  ctx.lineTo(sx+s2*ey,sy-c2*ey);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha=alpha*.70;
  ctx.strokeStyle=mix(base,p.cream,oscuro?.42:.30);
  ctx.lineWidth=1;
  ctx.stroke();
 }
 ctx.globalAlpha=1;
 // 6 · el polvo: IDEA en el acto 1, CRECER en el acto 3, desprendimiento en el 4.
 if(e.huida>.96){ctx.globalAlpha=1;return;}
 pioneerPolvo(e,p,fondo);
 const tintaPolvo=[mix(p.cream,p.stone,.35),p.amber,acento];
 for(let i=0;i<DUST_N;i++){
  const alfa=dustAlpha[i]*fade;
  if(alfa<=.01)continue;
  ctx.globalAlpha=alfa;
  ctx.fillStyle=tintaPolvo[dustTinte[i]];
  const s=dustS[i];
  ctx.beginPath();
  ctx.moveTo(dustX[i],dustY[i]-s);
  ctx.lineTo(dustX[i]+s*.72,dustY[i]);
  ctx.lineTo(dustX[i],dustY[i]+s);
  ctx.lineTo(dustX[i]-s*.72,dustY[i]);
  ctx.closePath();
  ctx.fill();
 }
 ctx.globalAlpha=1;
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
  // La transicion entre escenas la resuelve la propia estructura: no hace
  // falta el bloque de transicion de piezas.
  drawScene(i,u,p);
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
 const finalChapterActive=play.t>=6.25;
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
 // Cuatro actos a dos escenas cada uno.
 if(scene<=1)return 0;
 if(scene<=3)return 1;
 if(scene<=5)return 2;
 return 3;
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
 // El ritmo reserva tiempo para que cada transformacion se complete y pueda leerse.
 const sceneLengths=[2.00,1.90,1.70,2.00,1.80,2.00,1.50,1.60];
 const sceneStarts=[0];
 sceneLengths.forEach((length,i)=>{
  master.to(play,{t:i+1,duration:length,ease:'none'},sceneStarts[i]);
  master.addLabel('chapter-'+i,sceneStarts[i]+length*.5);
  sceneStarts.push(sceneStarts[i]+length);
 });
 master.addLabel('finish',sceneStarts[8]+.02);
 // Cuatro composiciones, una por acto.
 const copyStarts=[0,2,4,6];
 const copyEnd=[2,4,6,8];
 const copyBegin=[0,.28,.30,.26];
 copies.forEach((copy,i)=>{
  const fragments=copy.querySelectorAll('.study-mask>span'),desc=copy.querySelector('.study-description');
  const rule=copy.querySelector('.study-rule');
  const begin=sceneStarts[copyStarts[i]]+copyBegin[i];
  const endScene=copyEnd[i];
  const fromX=i===1?-28:0;
  gsap.set(copy,{autoAlpha:i===0?1:0});
  gsap.set(fragments,{yPercent:105,xPercent:i===0?0:fromX});
  gsap.set(rule,{scaleX:0,transformOrigin:'left center'});
  if(desc)gsap.set(desc,{opacity:0,y:18});
  if(i===0){
   // La primera frase no espera al scroll: la primera linea es visible desde la carga.
   gsap.set(fragments[0],{yPercent:0,y:12,opacity:0});
  }else{
   master.to(copy,{autoAlpha:1,duration:.18},begin+.01);
   master.to(fragments,{yPercent:0,xPercent:0,duration:i===2?.72:i===1?.70:i===3?.66:.66,stagger:i===2?.21:i===1?.24:i===3?.34:.17,ease:'power3.out'},begin+.04);
   master.to(rule,{scaleX:1,duration:.44,ease:'sine.out'},begin+(i===3?0:.66));
   if(desc)master.to(desc,{opacity:1,y:0,duration:.52,ease:'power2.out'},begin+(i===3?.30:.86));
  }
  if(i<copies.length-1)master.to(copy,{autoAlpha:0,duration:.20},sceneStarts[endScene]-.18);
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
