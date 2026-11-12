# Continuidad — Unificación y animación de los diagramas de arquitectura

**Fecha:** 12 de noviembre de 2026
**Estado:** implementación completa, **sin commit** (pendiente de revisión visual de Jorge).
**Alcance:** los diagramas de arquitectura del portafolio. No se modifican las páginas de proyecto más allá de regenerar su HTML.

---

## 1. Commit y rama de respaldo de Contacto

| Elemento | Valor |
| --- | --- |
| Commit | `48085af` — *feat: finalizar refinamiento aprobado de contacto* |
| Rama de respaldo | `backup/jmorgado-contacto-aprobado` → `48085af` |
| Respaldo anterior | `backup/jmorgado-landing-aprobada` → `4e8a715` |

## 2. Rama utilizada para los diagramas

**`work/diagramas-arquitectura-proyectos`**, creada desde `48085af`. `main` sigue en `63e45ea`.

## 3. Archivos modificados

| Archivo | Cambio |
| --- | --- |
| `assets/project-archify.js` | Capa compartida: recorrido animado por las conexiones, panel de componente y bloque «Se conecta con» |
| `assets/project-archify.css` | Estilos del panel de componente en la página |
| `assets/impulsacv-archify-architecture.html` | Contenido público del diagrama de ImpulsaCV (etiquetas, rótulos, tarjetas y retirada de la evidencia de fuente) |
| `assets/kokeai-archify-recorrido.html` | «Cloudflare Worker» → «Entrega de audio» |

Fuera de Git, como material local del laboratorio: `Herramientas/archify-impulsacv/architecture.json` y `REVISION-PROYECTOS/proyectos/kokeai/diagramas/kokeai-recorrido-publico.json` (los candidatos de Archify con el mismo contenido público).

HTML regenerado por `python build_site.py`: `proyectos/impulsacv/`, `proyectos/exo-dream/`, `proyectos/el-cambiometro/`, `proyectos/conecta/`, `proyectos/flor-de-almendro/`, `proyectos/tobys-warehouse/`, `proyectos/kooke-portal/`, `proyectos/kooke-rrss/`.

## 4. Componente o sistema utilizado para los visores

No se creó un visor nuevo. Todo se apoya en el sistema existente:

- **Archify 3.2.0** genera los diagramas. `C:\Users\jorge\.agents\skills\archify\bin\archify.mjs` es el generador; el candidato JSON es la fuente y `assets/*.html` es el artefacto servido.
- **`assets/project-archify.js`** es el módulo genérico de integración que ya usa todas las fichas: sincroniza el tema, ajusta la altura, carga el diagrama al entrar en pantalla y oculta los controles internos. Ahí se añadió la capa compartida.
- Los artefactos de `assets/` están personalizados por JMorgado (traducidos, sin botones internos, con las tarjetas del proyecto), así que **no se regeneran**: se editan de forma quirúrgica sobre el HTML, y el candidato JSON se actualiza en paralelo. El candidato de ImpulsaCV sigue validando (`archify validate … --quality showcase` → `ok: true`).

## 5. Qué información se simplificó en ImpulsaCV

El diagrama mantiene la estructura real (7 nodos, 7 conexiones, 2 marcos y las categorías de color), pero cada componente se explica por su función:

| Antes | Ahora |
| --- | --- |
| Autenticación · Google OAuth · JWT HS256 | **Acceso de usuarios** · Identidad y sesión · Permisos por rol |
| Servicios de aplicación · Hono · Cloudflare Workers | **Lógica de la plataforma** · Reglas y servicios · Datos ya procesados |
| Persistencia · D1 SQLite · Usuarios · CV · Pagos | **Almacenamiento** · Perfiles, CV y pagos · Registro consultable |
| Pasarela de pago · MercadoPago · CLP · Webhook | **Gestión de pagos** · Cobros y suscripciones · Comprobantes y estado |
| Servicios de IA · Google Gemini · /api/generate | **Asistencia inteligente** · Generación de texto · Sugerencias y borradores |
| Experiencia web · React 19 · Vite · Tailwind | **Experiencia web** · Uso de la plataforma · Perfil, CV y herramientas |
| Rótulos: HTTPS, Google OAuth, verificar JWT, API, SQL, preferencia, /api/generate | **Acceso, Inicia sesión, Sesión validada, Solicitudes, Datos, Preferencia de pago, Petición de asistencia** |
| Marcos: «Cloudflare», «Autenticación» | **Plataforma**, **Acceso y permisos** |
| Tarjetas «Servicios» e «Integraciones» | Contenido funcional (interfaz, lógica, almacenamiento / pagos, asistencia, acceso) |
| Pasaporte semántico con repositorio, archivo y líneas | El bloque de evidencia desaparece; el panel conserva nombre, propósito, categoría y conexiones |

La evidencia de fuente (`archify-source-evidence-data`, `data-source-evidence-*`) se retiró **del modelo**, no se ocultó con estilo.

## 6. Cómo se implementó la animación de recorridos

Dentro del iframe, `installFlow()` clona cada conexión (`path[data-edge-from][data-edge-to]`) en una capa propia y le aplica un pulso de trazo discontinuo que viaja del origen al destino. Después se aplica a cada nodo un brillo breve en el color de su categoría. La capa comparte sistema de coordenadas con las conexiones y hereda su color.

- Tiempos: pulso 1.500 ms, separación entre conexiones 1.700 ms, brillo 950 ms. Las conexiones **no** se animan a la vez: cada una empieza cuando la anterior termina.
- El orden es el del diagrama, que es el orden documentado de la arquitectura.
- El brillo del nodo se sincroniza con la llegada del pulso (`índice × 1.700 − 260 ms`).
- Con `prefers-reduced-motion: reduce` no se instala nada: el diagrama queda estático y legible.
- El recorrido se pausa cuando la pestaña se oculta (`visibilitychange`).

## 7. Qué se aplicó a Exo Dream

Exo Dream se sirve incrustado (`&embed=1`), donde Archify desactiva su propia animación de traza. Con la capa compartida ahora muestra el recorrido real de su arquitectura documentada:

`Google Sheets (catálogo) → Proxy de lectura → Organización → Showroom → Agenda y formularios → Google Calendar`, con la rama `Google Drive → Resolución de medios → Organización`.

Al seleccionar un bloque se muestra el panel propio del proyecto con la función del componente y sus conexiones, y el resto del diagrama pierde protagonismo sin desaparecer.

## 8. Qué otros diagramas se adaptaron

Los siete diagramas incrustados del portafolio reciben la misma capa, sin excepciones:

| Proyecto | Nodos | Conexiones |
| --- | --- | --- |
| Exo Dream | 9 | 8 |
| El Cambiómetro | 8 | 8 |
| Conecta | 8 | 7 |
| Flor de Almendro | 7 | 6 |
| Hangar354 (Toby's Warehouse) | 6 | 5 |
| kokeAI | 8 | 7 |
| kokeAI RRSS | 13 | 12 |

ImpulsaCV mantiene su visor completo (zoom, «Ruta», «Lente», roam y panel «Pasaporte semántico»): su diagrama de arquitectura no va incrustado y ya animaba con el motor de Archify.

## 9. Qué diagramas quedaron sin adaptar y por qué

- **Ryvolt** no tiene diagrama de arquitectura. No se inventó ninguno.
- **El diagrama de flujo de ImpulsaCV** (pestaña «Cómo funciona ImpulsaCV») ya está en lenguaje funcional y conserva su propio motor.
- **Las etiquetas de los seis diagramas distintos de ImpulsaCV** se mantienen tal como las documentó cada proyecto. FASE 2 pedía simplificar el diagrama de ImpulsaCV de forma expresa; extender esa simplificación a los demás exigiría reescribir la arquitectura de cada uno, y la instrucción era no reconstruir arquitecturas desde suposiciones. **Queda como decisión pendiente de Jorge** si se desea el mismo tratamiento para, por ejemplo, «Cloudflare Workers» en El Cambiómetro o Conecta.
- Se corregió un único título claramente técnico fuera de ImpulsaCV: «Cloudflare Worker» → «Entrega de audio» en el recorrido de kokeAI. El diagrama hermano de ese proyecto ya usaba «Herramientas de IA» en lugar de nombrar el proveedor.

## 10. Cómo comprobar los resultados localmente

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

| Qué mirar | Dónde |
| --- | --- |
| Diagrama público de ImpulsaCV | `http://127.0.0.1:8765/proyectos/impulsacv/` → pestaña «Arquitectura de ImpulsaCV» |
| Panel del componente (ImpulsaCV) | pulsar un nodo → «Se conecta con» en el pasaporte semántico |
| Recorrido animado (Exo Dream) | `http://127.0.0.1:8765/proyectos/exo-dream/` → esperar 8 s y observar los pulsos |
| Panel propio (diagramas incrustados) | pulsar un nodo → tarjeta abajo a la izquierda |
| Movimiento reducido | activar «reducir movimiento» en el sistema: no debe instalarse ningún pulso |

Comprobaciones técnicas: `python build_site.py`, `python qa_smoke.py` y `node --check assets/project-archify.js`.

---

## 11. Nota para quien continúe

- Los diagramas son artefactos de Archify personalizados. **No los regenerues sin revisar**: `assets/project-archify.js` los trata como una caja negra y solo les inyecta una capa.
- La capa compartida vive en `assets/project-archify.js` (`installFlow`, `installPanel`) y sus estilos en `assets/project-archify.css` (panel del host) y en el propio iframe (bloque «Se conecta con»).
- La ficha del pasaporte solo se rellena si el visor la muestra visible; en los diagramas incrustados manda el panel del host.
- `assets/site-particles.js` y `videos/*.webm` siguen sin seguimiento y fuera del sitio: pertenecen a otro frente.
