# Informe — Ajustes finales de Servicios

**JMorgado · Revisión de la fase 2: corrección editorial, composición y distribución del espacio**

Fecha: 2026-11-10 · Base: fase 2 de Servicios ya implementada y validada. Trabajo **sobre** la implementación existente: no se rehizo la sección ni se eliminó ninguna mejora de la fase anterior.

Todo quedó **local**: sin commit, sin push, sin despliegue. Las ocho URLs se conservan.

---

## Índice

1. [Corrección del tratamiento de proyectos confidenciales](#1-corrección-del-tratamiento-de-proyectos-confidenciales)
2. [Sección 02 · Tecnologías y ecosistemas](#2-sección-02--tecnologías-y-ecosistemas)
3. [Sección 03 · Primer contacto](#3-sección-03--primer-contacto)
4. [Las siete fichas: reparto del espacio](#4-las-siete-fichas-reparto-del-espacio)
5. [Corrección visual de la composición](#5-corrección-visual-de-la-composición)
6. [Reglas de diseño aplicadas](#6-reglas-de-diseño-aplicadas)
7. [QA](#7-qa)
8. [Archivos modificados y creados](#8-archivos-modificados-y-creados)
9. [Decisiones que requieren confirmación](#9-decisiones-que-requieren-confirmación)

---

## 1. Corrección del tratamiento de proyectos confidenciales

### 1.1 Qué se eliminó

En la ficha de Automatización de procesos, el caso de sistema comercial y membresías terminaba así:

> «…Caso presentado de forma anónima y como antecedente de la línea: no se afirma que todos sus componentes sigan operativos.»

Esa fórmula introducía dudas sobre un trabajo que sí existe. Se elimina **completa**, junto con cualquier enunciado equivalente:

| Texto retirado | Dónde | Motivo |
|---|---|---|
| «Caso presentado de forma anónima y como antecedente de la línea: no se afirma que todos sus componentes sigan operativos.» | Automatización · Proyectos realizados | Sugería abandonment o falta de seguimiento |
| «Power BI y Tableau son herramientas de trabajo habitual en esta línea; no se atribuyen a un proyecto concreto sin evidencia documentada.» | Datos, planillas y BI · nota de alcance | Cuestionaba la capacidad de_reportes, Power BI y Tableau |
| «Esta área es editorial. Los bots de consultas y reservas pertenecen a Automatización de procesos.» | Redes sociales · nota de alcance | Aviso explicativo redundante |

### 1.2 Cómo se presenta ahora

El proyecto se nombra por su capacidad, sin advertencias sobre su estado y sin identificar al cliente:

> **Sistema de automatización comercial y membresías**
>
> Atención comercial por bots, reservas, membresías, confirmación de pagos y control de accesos a material en la nube. Trabajo con un cliente, bajo confidencialidad: ni la marca, ni los datos del negocio, ni la información de sus usuarios se hacen públicos.

La confidencialidad aparece como **condición profesional**, no como límite de experiencia. Lo mismo se aplica a los reportes personalizados, Power BI y Tableau, que se presentan como capacidad de trabajo habitual:

> **Datos, planillas y BI** — nota de alcance: «Power BI y Tableau son herramientas de trabajo habitual en esta línea. Cada reporte, modelo o tablero se construye sobre las preguntas del negocio y sobre sus propios datos.»

Y la línea editorial de redes sociales se define por lo que entrega, no por lo que excluye:

> **Gestión de redes sociales** — nota de alcance: «La línea es editorial: calendario, producción de piezas, publicación y revisión de resultados.»

**No se publica ningún dato comercial, financiero ni de usuarios**, y no se inventan cifras. Lo único que cambia es que se deja de sugerir que la experiencia es dudosa por no ser publicable.

### 1.3 Corrección de nombre

`Tracer` pasa a **«Traycer»** en el grupo «Agentes y entornos de desarrollo», en el mapa de iconos y en el stack de la ficha de IA aplicada. El icono `assets/tech-icons/tracer.svg` se mantiene.

---

## 2. Sección 02 · Tecnologías y ecosistemas

### 2.1 El encabezado

`02 · TECNOLOGÍAS Y ECOSISTEMAS` se mantiene **en una sola línea** en escritorio, con el filete continuando a su derecha. Se añadió `white-space:nowrap` a la regla compartida `.overline`, que afecta a todas las secciones con overline de la sección.

### 2.2 La distribución

La rejilla pasa de **columnas múltiples con altura equilibrada** (que dejaba huecos y repartía los grupos en vertical) a una **rejilla de doce columnas** con reparto explícito:

| Pantalla | Columnas | Reparto |
|---|---|---|
| Escritorio (≥1180 px) | 4 | Los cuatro primeros grupos a 3 columnas cada uno; los tres restantes a 4 columnas. **Sin huecos** |
| Tablet (760–1179 px) | 2 | Seis grupos a pares; el séptimo ocupa el ancho completo |
| Móvil (<760 px) | 1 | Una columna |

Los títulos de cada grupo mantienen la misma alineación superior dentro de su fila y los chips conservan tamaño, icono y legibilidad.

### 2.3 La nota

La nota explicativa **ocupa ahora una fila completa** debajo de los siete grupos, con filete propio y sin límite de medida. El texto se conserva íntegro:

> «El stack se selecciona según las necesidades de cada proyecto. No todas las tecnologías se utilizan en todos los encargos. Los modelos de ejecución local y los agentes de desarrollo se combinan con los servicios externos según lo que cada tarea necesita».

---

## 3. Sección 03 · Primer contacto

El bloque oscuro se rehace con una **rejilla de doce columnas** en tres filas:

```
fila 1   título (7 columnas)              │ descripción (5 columnas)
fila 2   01 Cuéntame el contexto           │ 02 Revisamos el alcance      │ 03 Definimos el siguiente paso
fila 3   [ Conversar sobre mi proyecto ]                                        │ [ Conocer el método ]
```

- El título y la descripción quedan alineados verticalmente; la descripción se apoya en su base.
- Los tres pasos se reparten a lo ancho completo, en tres columnas equilibradas.
- Las dos llamadas a la acción se distribuyen con `justify-content:space-between`: la principal a la izquierda y la secundaria a la derecha, en vez de agrupadas en una esquina.
- Se conservan el fondo oscuro, la tipografía y el acento coral del botón principal. **No se añaden tarjetas.**

---

## 4. Las siete fichas: reparto del espacio

### 4.1 Los indicadores comerciales bajan al cierre

La línea `Evaluación caso a caso · Primer diagnóstico conversado: gratuito` desaparece del hero. El hero queda con **migas, categoría, título y descripción**, que es lo que el visitante necesita antes de decidir.

Los dos indicadores se incorporan al bloque de conversión, en una misma línea y justo encima del CTA:

```
Evaluación caso a caso  |  Primer diagnóstico conversado: gratuito
```

Así la información comercial acompaña la decisión de contacto en lugar de ocupar protagonismo al entrar.

### 4.2 Problema y enfoque

El reparto pasa de una rejilla fija `1,15fr / minmax(300px,.55fr)` con un hueco de hasta 112 px a una **rejilla de doce columnas**: el texto ocupa 7 y la ficha complementaria 5. La columna de texto deja de ser demasiado estrecha y la ficha lateral deja de quedar apretada. En móvil ambas ocupan el ancho completo.

### 4.3 Representación visual

Las composiciones siguen siendo las construidas en la fase 2 (cadena, capas, núcleo con satélites, ciclo, dos vías, orquestación y escalera). Se conserva el ancho completo y se amplía el ancho mínimo de cada paso para que no queden comprimidos; en móvil se apilan en una columna.

### 4.4 Entregables

La rejilla pasa de dos columnas fijas a `repeat(auto-fit, minmax(330px, 1fr))`: mantiene dos o tres columnas según el ancho disponible y **evita columnas demasiado estrechas** en pantallas intermedias.

### 4.5 Experiencia y proyectos

Es el cambio más visible. Antes las dos categorías ocupaban **columnas del mismo tamaño** aunque tuvieran contenido muy distinto, y cuando no había herramientas propias la columna vacía se llevaba media pantalla.

Ahora el reparto es **proporcional al contenido**, sobre una rejilla de doce columnas:

| Ficha | Proyectos realizados | Herramientas propias | Reparto |
|---|---|---|---|
| Automatización de procesos | 3 | 1 | 8 / 4 |
| Desarrollo web y plataformas | 3 | 0 | 12 / — |
| Datos, planillas y BI | 2 | 2 | 6 / 6 |
| Integraciones y APIs | 3 | 0 | 12 / — |
| IA aplicada con criterio | 2 | 0 | 12 / — |
| Soporte técnico | 0 | 2 | — / 12 |
| Gestión de redes sociales | 2 | 0 | 12 / — |

Reglas aplicadas:

- Las dos categorías mantienen su separación obligatoria: **Proyectos realizados** y **Herramientas propias**.
- Una categoría con menos elementos recibe menos ancho, en proporción a su contenido.
- **Una ficha sin herramientas propias no deja ninguna columna vacía**: sus proyectos ocupan el ancho completo.
- La nota sobre el software propio y el enlace «Ver todas las herramientas» acompañan al grupo corresponding, no cuelgan de una columna vacía.

### 4.6 Cierre y navegación

El tablón de contacto mantiene su composición a dos campos (pregunta y CTA) sobre el ancho completo, ahora con los indicadores comerciales incorporados. La franja «Otras áreas» sigue como navegación clara entre las siete áreas.

---

## 5. Corrección visual de la composición

La ronda anterior cambiaba `grid-template-columns` sin comprobar el resultado. Esta ronda **mide la geometría real** de cada bloque en el navegador y corrige las restricciones que la mantenían concentrado.

### 5.1 Hero de las siete fichas

El hero era una columna: el titular y la descripción apilados a la izquierda, con **488 px libres a la derecha**. Ahora el titular y la descripción forman una fila:

```
migas · categoría
Automatización de procesos.        │  Cuando la misma tarea pasa por planillas, correos y
(7 columnas, 89 px)                │  aplicaciones, el tiempo se va en copiar, pegar…
                                     │  (5 columnas, ancho de lectura cómodo)
```

| Medición | Antes | Ahora |
|---|---|---|
| Espacio libre a la derecha | 488 px | **0 px** |
| Separación entre titular y descripción | 194 px (vertical) | **58 px** (horizontal) |
| Alineación vertical | — | centrados en la misma fila |
| Tamaño del titular | 89,28 px | **89,28 px, sin reducir** |

Por debajo de 1000 px la fila pasa a una columna, con separación vertical clara. La solución se aplica a las siete fichas, no sólo a Automatización.

### 5.2 Encabezados de las secciones interiores

`.section-head` usaba `align-items:end`: el párrafo explanatory quedaba pegado al borde inferior, **182–234 px por debajo** del titular. Ahora:

| Medición | Antes | Ahora |
|---|---|---|
| Desvío vertical entre titular y párrafo | 182–234 px | **11–46 px**, centrados |
| Líneas del titular | 3 | **1–2** |

El tamaño del titular de sección baja de 72 px a **53 px**, que es lo que lo devuelve a una o dos líneas dentro de su columna. Los títulosaffected son: «Qué problema resuelvo», «Qué entrego, en concreto», «Trabajos y herramientas que aportan contexto» y los dos apartados nuevos de IA y seguridad.

### 5.3 Tablón de contacto

El bloque coral tenía el mismo `align-items:end`, así que el conjunto izquierdo (eyebrow + titular) quedaba **96 px más abajo** que el derecho. Ahora:

- El conjunto izquierdo se **centra verticalmente** respecto al derecho: la diferencia entre los centros de ambos bloques es de **0–1 px** en las siete fichas.
- El eyebrow «Contacto» deja de hundirse en la mitad inferior.
- La columna derecha pasa de `.6fr` a `.82fr` para que los dos indicadores quepan **en una sola línea** (445 px de texto en 489 px disponibles). Cuando no caben, se apilan como dos frases completas, nunca partidas a mitad de palabra.
- **No se reduce el tamaño del bloque coral**: conserva su padding, su tipografía y el acento.

### 5.4 Reparto de la experiencia

La rejilla de doce columnas reparte las categorías de forma proporcional al contenido, y una ficha sin herramientas propias no deja ninguna columna vacía:

| Ficha | Proyectos | Herramientas | Anchos reales a 1440 px |
|---|---|---|---|
| Automatización de procesos | 3 | 1 | 914 px + 428 px |
| Desarrollo web y plataformas | 3 | 0 | **1400 px** (una sola columna) |
| Datos, planillas y BI | 2 | 2 | 671 px + 671 px |
| Integraciones y APIs | 3 | 0 | **1400 px** |
| IA aplicada con criterio | 2 | 0 | **1400 px** |
| Soporte técnico | 0 | 2 | **1400 px** |
| Gestión de redes sociales | 2 | 0 | **1400 px** |

### 5.5 Adaptación a pantallas estrechas

Las rejillas de doce columnas necesitan margen para once uniones. Con separadores grandes desbordaban **48 px a 320 px** y **274 px a 390 px**. Se corrigió con dos medidas:

- **Separadores elásticos**: el `gap` se estrecha con el viewport (`clamp()` con mínimo bajo).
- **Una sola columna por debajo de 700 px** en el reparto del problema, la experiencia, el primer contacto y los ecosistemas; el hero colapsa por debajo de 1000 px.

---

## 6. Reglas de diseño aplicadas

| Regla | Cómo se resuelve |
|---|---|
| No cargar sistemáticamente los elementos a la izquierda | Rejillas de doce columnas en el encabezado, el cierre, el reparto del problema y la experiencia |
| No confundir alineación editorial con media pantalla vacía | La experiencia reparte de forma proporcional; una categoría ausente no ocupa sitio |
| Usar composiciones de doce columnas cuando ayudan | Cuatro rejillas nuevas con doce columnas de base |
| Mantener jerarquía tipográfica y espacios respirables | Sin cambios en escala ni ritmo; sólo en la distribución |
| No agregar elementos decorativos | Ninguno |
| No crear tarjetas innecesarias | Ninguna; las medidas de seguridad y los puntos siguen siendo listas con filete |
| Las notas explicativas ocupan todo el ancho | La nota del ecosistema y las descripciones de las fichas dejar de estar limitadas a una columna |
| Mantener la identidad y las diferencias entre servicios | Sin cambios en color, tipografía, iconografía ni en las composiciones visuales propias |
| No alterar otras secciones | Ninguna clase nueva aparece fuera de `/servicios/` |

---

## 7. QA

### 6.1 Sección Servicios

**8 páginas × 5 anchos (1440, 1024, 768, 390, 320) × día y noche = 80 combinaciones.**

| Comprobación | Resultado |
|---|---|
| Desbordamiento horizontal | 0 |
| Iconos de tecnología rotos | 0 |
| Chips de tecnología sin icono | 0 |
| Errores de consola | 0 |
| Navegación desde el índice | las 7 filas llevan a su ficha |
| «Otras áreas» | 6 enlaces por ficha |
| CTA | cada ficha con su texto y destino `/contacto/` |

**Particularidades corregidas en esta ronda:** las rejillas de doce columnas necesitan margen para once uniones, lo que desbordaba 48 px a 320 px y 274 px a 390 px. Se corrigió con separadores elásticos y pasando las cuatro rejillas a una sola columna por debajo de 700 px.

### 6.2 Revisión visual real

Además del QA técnico se midió la geometría de cada bloque en el navegador, en las ocho páginas y en las cinco resoluciones. Resultado a 1440 px:

| Comprobación | Índice | Las siete fichas |
|---|---|---|
| Espacio libre a la derecha del hero | 0 px | **0 px** |
| Separación entre titular y descripción | — | **41–58 px**, nunca solapada |
| Desvío vertical en los encabezados de sección | — | **11–46 px** (antes 182–234) |
| Diferencia entre los centros del tablón de contacto | — | **0–1 px** |
| Columnas de la experiencia | — | proporcionales, sin columnas vacías |
| Espacio muerto en la zona derecha | — | ninguno |

Se revisaron también las capturas completas de las ocho páginas en día y noche, los bloques de hero y de cierre por separado, y las cuatro fichas con composición propia (capas, núcleo con satélites, ciclo con marcadores y dos vías). En móvil, la lectura natural se comprobó a 390 y 320 px.

### 6.3 Sitio completo

### 6.2 Sitio completo

| Prueba | Resultado |
|---|---|
| `python build_site.py` | OK |
| `python qa_smoke.py` | OK — 26 rutas, 24 canónicas, JS deshabilitado y movimiento reducido |
| `node qa_tetris.cjs` | OK — motor completo |
| `python Herramientas/qa_fichas.py` | OK — las nueve fichas de proyectos |
| `git diff --check` | exit 0 |
| Paridad del resto del sitio | Todas las páginas fuera de `/servicios/` difieren **sólo en el hash de caché** de `assets/site.css` |
| Aislamiento de estilos | Ninguna clase nueva aparece fuera de `/servicios/` |

---

## 8. Archivos modificados y creados

### Modificados

| Archivo | Cambio |
|---|---|
| `site_data.py` | Redacción del caso comercial y membresías sin advertencias; notas de alcance de Datos y de Redes Sociales; `Tracer` → `Traycer`; corrección de redacción en la nota de Soporte técnico |
| `build_site.py` | Indicadores comerciales retirados del hero y trasladados al cierre; reparto proporcional de la experiencia; nota del ecosistema dentro de la rejilla; bloque de primer contacto en doce columnas |
| `assets/site.css` | Overline en una línea; rejilla de doce columnas para ecosistemas, primer contacto, reparto del problema y experiencia; entregables fluidos; indicadores del cierre; separadores elásticos y columna única en móvil |

### Creados

| Archivo | Detalle |
|---|---|
| `REVISION-SERVICIOS/INFORME-AJUSTES-SERVICIOS.md` | Este informe |
| `Herramientas/ENTREGA-FICHAS-JMORGADO.zip` | Paquete de entrega regenerado |

### Sin tocar

Las páginas de proyectos, la sección de Herramientas, la landing, contacto, método, calculadora, juego, el sistema Archify y las ocho URLs.

---

## 9. Decisiones que requieren confirmación

| # | Punto | Estado |
|---|---|---|
| 1 | El nombre público del caso comercial y membresías sigue siendo genérico | Confirmado: sin autorización para nombrarlo |
| 2 | `Traycer` corregido en el grupo, el mapa de iconos y el stack de IA | Aplicado |
| 3 | Los indicadores comerciales bajan del hero al cierre en las siete fichas | Aplicado |
| 4 | Las notas de alcance de Datos y de Redes sociales se reescriben en positivo | Aplicado |
| 5 | Reparto proporcional de la experiencia y colapso a una columna cuando no hay herramientas propias | Aplicado |
| 6 | Reparto 4 / 3 de los siete grupos de tecnologías, con la nota a ancho completo | Aplicado |

---

## Fin del informe

Ajustes finales de Servicios aplicados el 2026-11-10. Todo quedó local, sin commit, sin push y sin despliegue.