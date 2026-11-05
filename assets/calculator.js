(()=>{
"use strict";
const form=document.getElementById("calculator");
if(!form)return;
const byId=id=>document.getElementById(id);
const ids=["before-h","before-m","after-h","after-m","frequency","period","days","people","workday","hour-cost","initial-cost","monthly-cost"];
const fr=new Intl.NumberFormat("es-CL",{maximumFractionDigits:1});
const clp=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0});
const num=id=>Number(byId(id).value);
const valid=id=>byId(id).value.trim()!==""&&Number.isFinite(num(id))&&num(id)>=0;
const duration=minutes=>{
 const total=Math.round(Math.abs(minutes));
 const h=Math.floor(total/60),m=total%60;
 return [h?fr.format(h)+" h":"",m?m+" min":(!h?"0 min":"")].filter(Boolean).join(" ");
};
function render(){
 const daily=byId("period").value==="day";
 byId("days-field").hidden=!daily;
 const required=["before-h","before-m","after-h","after-m","frequency","people","workday"];
 if(daily)required.push("days");
 const safe=required.every(valid)&&num("frequency")>0&&Number.isInteger(num("people"))&&num("people")>=1&&num("workday")>0
  &&num("before-m")<60&&num("after-m")<60&&(!daily||(num("days")>=1&&num("days")<=7&&Number.isInteger(num("days"))));
 const error=byId("calc-error");
 const output=byId("money-output");
 if(!safe){
  error.textContent="Revisa los valores. La frecuencia debe ser positiva, los minutos entre 0 y 59 y debe haber al menos una persona.";
  ["per-run","per-week","per-month","per-year","reduction","workdays","execs"].forEach(id=>byId(id).textContent="—");
  output.hidden=true;return;
 }
 error.textContent="";
 const before=num("before-h")*60+num("before-m");
 const after=num("after-h")*60+num("after-m");
 const delta=before-after;
 const weekly=num("frequency")*(daily?num("days"):byId("period").value==="month"?12/52:1);
 const monthly=weekly*52/12,annual=weekly*52;
 const people=num("people");
 byId("per-run").textContent=duration(delta);
 byId("calc-state").textContent=delta>0?"Tiempo activo recuperado por ejecución":delta<0?"Tiempo activo adicional por ejecución":"Sin variación de tiempo";
 byId("per-week").textContent=duration(delta*weekly*people);
 byId("per-month").textContent=duration(delta*monthly*people);
 byId("per-year").textContent=duration(delta*annual*people);
 byId("reduction").textContent=before>0?fr.format(delta/before*100)+" %":"No aplicable";
 byId("workdays").textContent=fr.format(delta*monthly*people/(num("workday")*60));
 byId("execs").textContent=fr.format(monthly);
 byId("assumptions").textContent="Aproximaciones: 52 semanas al año, 12 meses, "+fr.format(num("workday"))+" horas por jornada y "+people+" persona(s). No equivale a ahorro de caja garantizado.";
 output.hidden=true;output.textContent="";
 const present=id=>byId(id).value.trim()!=="";
 if(present("hour-cost")){
  if(!valid("hour-cost")){output.hidden=false;output.textContent="El valor por hora no puede ser negativo.";return;}
  const gross=delta*monthly*people/60*num("hour-cost");
  let message="Valor bruto estimado del tiempo liberado por mes: "+clp.format(gross)+". Es una equivalencia del tiempo, no dinero necesariamente ahorrado.";
  if(present("initial-cost")&&present("monthly-cost")&&valid("initial-cost")&&valid("monthly-cost")){
   const net=gross-num("monthly-cost");
   message+=" Valor neto mensual referencial: "+clp.format(net)+".";
   if(net>0)message+=" Recuperación referencial de inversión: "+fr.format(num("initial-cost")/net)+" meses.";
   else message+=" Con estos supuestos no se obtiene recuperación positiva.";
  }else if(present("initial-cost")||present("monthly-cost")){
   message+=" Para calcular recuperación, indica ambos costos como valores no negativos.";
  }
  output.hidden=false;output.textContent=message;
 }
}
ids.forEach(id=>{byId(id).addEventListener("input",render);if(byId(id).tagName==="SELECT")byId(id).addEventListener("change",render);});
render();
})();