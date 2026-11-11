# Informe general — comparación de los 8 proyectos

Fecha de corte: 2026-11-10. Documento de lectura para decidir **qué construir primero, qué contar y
con qué material**.

## 1. Qué proyectos tenemos realmente

Ocho proyectos de la línea principal, que se pueden agrupar en cuatro familias técnicas. Ninguno es
una repetición del anterior: la diferencia está en el tipo de problema, no en la tecnología.

| Familia | Proyectos | Naturaleza del problema |
|---|---|---|
| Plataforma con backend propio | El Cambiómetro, ListoPorHoy | Hay que servir datos a varias personas y permitir operar sobre ellos |
| Frontend sin backend | Ryvolt, Flor de Almendro, Exo Dream | Hay que presentar y mantener contenido sin imponer herramientas nuevas |
| Tiempo real / operación | Hangar354 | Hay que coordinar a varias personas mientras ocurre algo |
| Automatización de contenido | kokeAI, RRSS | Hay que mantener un ritmo de trabajo sin repetir tareas |

## 2. Qué hace cada uno

| Proyecto | Problema que resuelve | Resultado observable |
|---|---|---|
| El Cambiómetro | Datos públicos dispersos en formatos y fechas distintas | Catálogo unificado, cruces entre fuentes, API y sitio con trazabilidad |
| ListoPorHoy | Operar contenido de varias marcas con herramientas separadas | Un entorno por marca: calendario, borradores, medios, publicación y métricas |
| Ryvolt | Explicar servicios de consultoría a públicos distintos sin perder identidad | Un sitio con dos registros visuales, bilingüe y con prerenderizado verificado |
| Flor de Almendro | Publicar un catálogo sin obligar al negocio a aprender un panel | Catálogo vivo desde Sheets, con stock real y cierre de venta por WhatsApp |
| Exo Dream | Presentar líneas de trabajo heterogéneas con contenido cambiante | Showroom configurable: catálogo, textos, agenda, encuestas y contacto |
| Hangar354 | Administrar una competencia mientras ocurre | Estado común para operador, público y pilotos; historial que se recalcula |
| kokeAI | Organizar material creativo disperso y servirlo | Catálogo automático desde Drive, lector de cómics y reproductor de audio |
| RRSS | Mantener el ritmo de publicación sin trabajo manual repetido | Flujo automático: pieza → texto → composición → publicación → registro |

## 3. En qué se diferencian (lo que evita que las fichas se parezcan)

- **El Cambiómetro** es el único con **verificación de integridad como producto**: cada registro
  conserva su fuente oficial y el pipeline falla si no la tiene.
- **ListoPorHoy** es el único con **modelo de permisos y multi-tenancy** real, y el único con
  conexiones sociales Effectively conectadas a la base de datos.
- **Ryvolt** es el único **proyecto de experiencia e identidad**: no hay backend, hay diseño,
  movimiento, bilingüismo y una técnica de prerenderizado.
- **Flor de Almendro** y **Exo Dream** se parecen (Google Sheets + Drive), pero el primero es un
  catálogo comercial con cierre de venta y el segundo un showroom configurable con textos, agenda y
  formularios. Su ficha debe contar eso, no «leer de Sheets».
- **Hangar354** es el único con **tiempo real** y con un perfil de usuario que compara sus propias
  sesiones.
- **kokeAI** y **RRSS** pertenecen a la misma operación pero son piezas distintas: el portal publica
  el material; la automatización prepara y publica en redes. Nunca deben fundirse en una ficha.

## 4. Cuáles merecen mayor protagonismo

Propuesta de prioridad, con el criterio de que la ficha debe poder sostenerse con evidencia:

| Prioridad | Proyecto | Por qué |
|---|---|---|
| 1 | El Cambiómetro | Es el de mayor profundidad técnica verificable y el único con evidencia abierta (repositorio público, AGPL, cobertura de fuentes documentada). Su diagrama de pipeline es de los más claros del paquete. |
| 2 | ListoPorHoy | Es el sistema más complejo de los ocho y el que mejor justifica un diagrama de arquitectura. Su valor se entiende en un solo lienzo. |
| 3 | Hangar354 | Proyecto propio, con una idea clara (un estado, tres superficies) y con pruebas. Ideal para mostrar el portafolio técnico en operación. |
| 4 | kokeAI | Encaja con la línea de automatización y contenido, y su flujo Drive → Apps Script → base → portal es muy narrable. |
| 5 | RRSS | Convence si se cuenta como proceso; sin interfaz es más difícil, pero el diagrama `workflow` resuelve justo eso. |
| 6 | Exo Dream | Buen material, pero sin URL confirmada: la ficha quedaría sin chip de sitio. |
| 7 | Flor de Almendro | Sencillo y bien resuelto; su valor es la simplicidad y el trato con el negocio. |
| 8 | Ryvolt | La ficha se apoya en capturas, no en diagramas. Es la más fácil de hacer y la que menos información técnica aporta. |

## 5. Qué diagrama conviene en cada caso

| Proyecto | Diagrama | Razón |
|---|---|---|
| El Cambiómetro | `architecture` | Una cadena verificable: fuentes → validación → lago → D1 → API y sitio |
| ListoPorHoy | `architecture` | El valor está en las conexiones y los permisos, no en una foto de pantalla |
| Hangar354 | `architecture` | Un estado compartido que alimenta tres superficies distintas |
| kokeAI | `architecture` | Cuatro piezas encadenadas (Drive, Apps Script, base, portal) más el Worker de audio |
| Exo Dream | `architecture` | Configuración desde planilla hacia una experiencia con muchas piezas |
| Flor de Almendro | `dataflow` | El proyecto **es** un flujo de datos: planilla → lectura → catálogo → contacto |
| RRSS | `workflow` | Es un proceso en el tiempo, sin interfaz y sin servicios que desplegar |
| Ryvolt | ninguno | Un diagrama de «React + Tailwind + Analytics» no informa a un visitante; lo informa una captura de los dos registros visuales |

## 6. Qué funcionalidades debería destacar cada ficha

| Proyecto | Tres cosas a destacar |
|---|---|
| El Cambiómetro | Ingesta con evidencia por registro · snapshots que no se sobrescriben · continuidad cuando una fuente falla |
| ListoPorHoy | Un contexto por marca · permisos que se ven · publicación con trazabilidad y métricas |
| Ryvolt | Dos registros, una dirección · bilingüismo real · prerenderizado verificado |
| Flor de Almendro | La planilla como panel · estado real de stock · contacto que ya lleva el producto |
| Exo Dream | Configurar sin código · lectura con respaldo · agenda y formularios en la misma experiencia |
| Hangar354 | Un solo estado para todos · operación por pasos · historial que se recalcula |
| kokeAI | Catálogo que se arma solo · lector que retoma donde quedaste · audio resuelto con un Worker |
| RRSS | Ritmo con proceso · la IA redacta, el sistema compone · cada publicación queda registrada |

## 7. Qué información falta

| Proyecto | Falta | Impacto |
|---|---|---|
| Exo Dream | URL pública de producción; existencia de repositorio | Bloqueante: sin URL la ficha no lleva chip ni portal |
| Hangar354 | Confirmación del nombre vigente (Hangar354 vs Toby's Warehouse) | Alto: define título y ruta |
| Todos | Reparto de autoría dentro de los equipos | Medio: hoy la primera persona se apoya sólo en lo verificable |
| Todos | Cifras de uso, tráfico o resultados de negocio | Alto si se quieren usar: hoy no hay ninguna verificable |
| El Cambiómetro | Vigencia de las cifras del README (corte 2026-09) | Medio: usarlas con fecha o no usarlas |
| Flor de Almendro, Exo Dream, kokeAI | Derechos de las imágenes y piezas para el portafolio | Alto para publicar capturas |
| Ryvolt | Estado actual del sitio en producción | Bajo: la ficha es descriptiva |
| ListoPorHoy | Estado real de las automatizaciones de comentarios y DM | Medio: el modelo las contempla, la evidencia dice que están desactivadas |

## 8. Cómo se aprovecha ImpulsaCV como base

ImpulsaCV aporta el **andamiaje**, no la plantilla:

1. `ficha.py` + `assets/ficha.css` + `site_data.py::FICHAS` ya resuelven hero, desafío, contenido,
   participación, cierre y contacto. Ninguna ficha nueva necesita duplicar nada.
2. El módulo `perspectivas` (iframes Archify con tabs y carga diferida) es el que aporta el diagrama;
   se reutiliza tal cual, con los `src` apuntando al asset del proyecto correspondiente.
3. `assets/project-impulsacv.css` y `assets/project-impulsacv.js` resuelven la sincronía de tema y la
   carga diferida: son la referencia a copiar **una vez** para el primer proyecto con diagramas, y
   después generalizarlos en `assets/project-archify.css` / `.js` para no repetir el patrón por ficha.
4. El resto del sitio (header, footer, temas, `qa_smoke.py`) no se toca.

## 9. Esfuerzo de adaptación por ficha

Estimación en unidades relativas de trabajo (1 = ficha sencilla):

| Proyecto | Esfuerzo | Motivo |
|---|---|---|
| Ryvolt | Bajo (1) | Sin diagrama, sin integraciones; la ficha es `hero`, `desafio`, `plataforma`, `participacion`, `galeria`, `cierre`, `contacto` |
| Flor de Almendro | Bajo-medio (1,5) | Un diagrama, sin override propio; sólo ajustar el `dataflow` al asset del proyecto |
| Exo Dream | Medio (2) | Un diagrama y resolver antes la URL pública y el destino del asset |
| kokeAI | Medio (2) | Un diagrama y revisar los derechos de las capturas |
| RRSS | Medio (2) | Un diagrama `workflow` y decidir si se muestran piezas de ejemplo |
| Hangar354 | Medio-alto (2,5) | Un diagrama, decidir el nombre público y revisar credenciales antes de publicar nada del repo |
| ListoPorHoy | Medio-alto (2,5) | Un diagrama, repositorio privado (sin sección `repo`) y posible override para el portal |
| El Cambiómetro | Medio-alto (3) | Único con portal embebido multipágina, métricas y repositorio público: es la ficha más completa |

**Trabajo común que conviene hacer una sola vez** (y que hoy está dentro de ImpulsaCV):

1. Extraer `assets/project-impulsacv.css` / `.js` a un par genérico `assets/project-archify.css` / `.js`
   con la sincronía de tema y la carga diferida.
2. Añadir al sistema `ficha.py` un módulo `diagrama` (un solo iframe, sin tabs) para las fichas que
   llevan **un** diagrama, y dejar `perspectivas` sólo para ImpulsaCV.
3. Añadir una regla de resolución de rutas para los assets de diagramas (`assets/<slug>-archify-*.html`).
