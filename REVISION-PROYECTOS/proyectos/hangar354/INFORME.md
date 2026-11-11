# Hangar354 — informe de investigación

> Fase de investigación y preparación. No implementa la ficha.

## 1. Ficha de identidad

| Dato | Valor | Estado |
|---|---|---|
| Nombre público actual | Hangar354 | aprobado en el sitio |
| Nombre histórico / técnico | Toby's Warehouse | verificado (`AGENT_INSTRUCTIONS.md:1-4`) |
| Categoría JMorgado | Sistemas operativos · Tiempo real | aprobado |
| URL pública | https://hangar354.web.app | verificado (`AGENT_INSTRUCTIONS.md:19-22`) |
| URLs privadas/públicas | `/admin` (administrador), `/laps` (registro personal) | verificado |
| Repositorio | sin remote configurado (copia local) | verificado |
| Revisión auditada | `d5b72c7afe39e64043514f3629f03131871164a7` (rama `codex/race-director-v6-2`, 2026-07-29) | verificado |
| Ruta local auditada | `C:\Users\jorge\Proyectos\torneo` | sólo lectura |
| Fecha de revisión | 2026-11-10 | — |

> El working tree tiene cambios locales (`.interface-design/system.md`, `AGENT_INSTRUCTIONS.md`, artefactos de captura) y archivos eliminados; se registra, no se modifica.

## 2. Qué problema resuelve

Administrar una competencia mientras ocurre exige tres cosas que no conviven bien: un operador que registra tiempos y sanciones, un estado común que todos vean igual, y un historial que sobreviva a la jornada. Hangar354 (antes Toby's Warehouse) es un **Race Control** para Assetto Corsa / ACC: el operador ordena la sesión, el público ve la telemetría en vivo y cada participante conserva su propio registro.

## 3. Qué se desarrolló realmente

1. **SPA en JavaScript sin framework.** HTML5 semántico + JavaScript vanilla, CSS propio sin frameworks, tipografías y animaciones de broadcast (`AGENT_INSTRUCTIONS.md:8-13`). `public/index.html` (631 KB) contiene la aplicación completa; `public/lapbook.js` (86 KB) el módulo personal.
2. **Estado compartido en Firebase Realtime Database.** Nodo base `torneo_hangar354` con `state`, `history` y `careerStats` (`AGENT_INSTRUCTIONS.md:14-16`, `public/index.html:3505-3506`, `public/index.html:3535`).
3. **Sincronización en vivo por listener.** `rtdbRef.on('value', …)` aplica el snapshot remoto al estado local, con control de reentrada para no pisar ediciones del administrador (`public/index.html:3504-3524`).
4. **Historial y estadísticas acumuladas.** El historial se lee y se recalculan las estadísticas de carrera (`public/index.html:3526-3544`).
5. **Separación de superficies.** La ruta `/` es el dashboard de espectador y el historial, **sin botones de gestión**; `/admin` concentra la operación; `/laps` es el perfil personal (`AGENT_INSTRUCTIONS.md:46-53`, `public/index.html:3813-3820`, `public/index.html:3893-3895`).
6. **Configuración del torneo en pasos.** Parrilla de pilotos con cascos, formato de puntuación, pistas y vehículos, y luego carrera y tiempos (`AGENT_INSTRUCTIONS.md:32-43`).
7. **Cálculo de resultados.** Puntuación tipo F1 y recálculo de tabla, campeón, vuelta rápida y acumulado del salón de la fama al editar tiempos de un torneo archivado (`AGENT_INSTRUCTIONS.md:40-42`).
8. **Módulo Lapbook con autenticación.** Google Sign-In sólo para `/laps`, con persistencia local y retorno OAuth en el mismo dominio para móvil (`AGENT_INSTRUCTIONS.md:17-18`, `AGENT_INSTRUCTIONS.md:148-155`, `public/lapbook.js:1-35`).
9. **Reglas de base de datos.** `warehouse_lapbook` exige UID, proveedor Google y moderación para configuración; `torneo_hangar354` es de lectura y escritura pública (`database.rules.json:7-40`).
10. **Despliegue en Firebase Hosting con target propio y reglas de reescritura** (`firebase.json:15-40`, `firebase.json:1-11`).
11. **Pruebas.** Suite en Node (`tests/lapbook.test.js`, `tests/routing.test.js`, `tests/database-rules.test.js`), pruebas con emulador de reglas y pruebas de navegador (`tests/browser_lapbook.js`, `tests/browser_production_smoke.js`, `tests/browser_spectator_timing.js`).

## 4. Funcionalidades principales

| # | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| 1 | Race Control por pasos (parrilla, formato, pistas, carrera) | `AGENT_INSTRUCTIONS.md:32-43` | verificado |
| 2 | Telemetría en vivo compartida con el público | `public/index.html:3504-3524`, `AGENT_INSTRUCTIONS.md:48-53` | verificado |
| 3 | Historial de torneos y salón de la fama con recálculo | `public/index.html:3526-3544`, `AGENT_INSTRUCTIONS.md:37-42` | verificado |
| 4 | Lapbook personal por piloto (vueltas, mejores tiempos, sesiones) | `public/lapbook.js:8-35`, `AGENT_INSTRUCTIONS.md:17-18` | verificado |
| 5 | Moderación y reglas por UID | `database.rules.json:11-40` | verificado |
| 6 | Pruebas unitarias, de reglas y de navegador | `tests/` | verificado |

## 5. Arquitectura y flujo

```
Operador (/admin)
   │  registra tiempos, rondas, sanciones
   ▼
Firebase RTDB — nodo torneo_hangar354
   ├── state        (estado de la sesión en curso)
   ├── history      (torneos finalizados)
   └── careerStats  (acumulados del salón de la fama)
        │  listeners 'value' en vivo
        ├──────────────► Espectador (/)      · telemetría e historial
        └──────────────► Lapbook (/laps)    · perfil personal con Google Sign-In
```

El estado es la fuente de verdad única: el dashboard público y el perfil personal leen el mismo conjunto de datos.

## 6. Tecnologías verificadas

JavaScript (ES5/ES6) sin framework · HTML5 · CSS3 propio · Firebase Realtime Database v9 (compat) · Firebase Auth (Google Sign-In) · Firebase Hosting (target `hangar354`) · Google Sign-In con persistencia local en `/laps` (`AGENT_INSTRUCTIONS.md:8-22`).

## 7. Mi participación

**Afirmable:** el repositorio incluye la especificación de arquitectura y la guía de agentes con historial de cambios aplicados (`AGENT_INSTRUCTIONS.md:1-4`), el sistema de diseño (`.interface-design/system.md`), la suite de pruebas (`tests/`) y scripts de despliegue propios (`firebase.json`).

**No afirmable:** autoría individual (sin remote ni coautores) y métricas de uso.

## 8. Capacidades que merece la pena mostrar

1. **Un solo estado para todos:** operador, público y participantes ven la misma sesión (`public/index.html:3504-3535`).
2. **Operación por pasos:** de la parrilla al resultado, con formato de puntuación configurable (`AGENT_INSTRUCTIONS.md:32-43`).
3. **Historial que se recalcula:** editar tiempos de un torneo archivado recalcula tabla, campeón y acumulados (`AGENT_INSTRUCTIONS.md:40-42`).

## 9. Propuesta de ficha JMorgado

- **Título editorial:** «Hangar354» + acento coral. Bajada: «Control de carrera en vivo: el operador registra, todos ven lo mismo».
- **Descripción breve:** mantener la aprobada.
- **Desafío:** administrar una competencia mientras ocurre, con estado común y resultados consistentes.
- **Solución:** Race Control en JavaScript con Firebase Realtime Database como estado compartido, superficie pública de telemetría e historial, y módulo personal Lapbook con Google Sign-In.
- **Funcionalidades destacadas:** sesión en vivo compartida · configuración por pasos · historial y estadísticas recalculables · perfil personal del piloto.
- **Participación:** «Implementé el sistema Race Control y las vistas conectadas al estado compartido».
- **Tecnologías:** JavaScript · Firebase Realtime Database · Firebase Auth · Dashboard · Estado compartido.
- **Demostraciones posibles:** diagrama de arquitectura del estado compartido; captura de la vista de espectador.
- **Estructura sugerida de módulos `fx-*`:**
  - `hero` — sí, con chip «Ver sitio».
  - `desafio` — sí.
  - `perspectivas` — **sí, un solo diagrama `architecture`** centrado en el estado compartido y las tres superficies.
  - `plataforma` — sí (Operador / Estado compartido / Participantes).
  - `participacion` — sí (Race Control / Sincronización / Superficies).
  - `tech` — sí.
  - `repo` — no: sin repositorio público.
  - `metrics` — no: los datos son de torneos de prueba, no métricas de producto.
  - `galeria` — opcional, con capturas de la vista pública.
  - `cierre` + `contacto` — sí, CTA único a `/contacto/`.
- **Qué omitir:** nombres de pilotos y datos de torneos (son de terceros), el detalle de puntuación y el sistema de estilos interno. **No** afirmar telemetría automática desde el simulador: los tiempos los introduce el operador (`AGENT_INSTRUCTIONS.md:36`).

## 10. Diagrama Archify recomendado

**Tipo: `architecture`** (6 nodos). Justificación: el valor está en que un mismo estado alimenta tres superficies distintas; eso se ve mejor en un diagrama que en un párrafo. Un `workflow` supondría un recorrido del usuario que aquí no existe (no hay una persona que "use" un flujo de carrera: hay un operador y un público que observan).

Nodos propuestos:

| id | etiqueta | tipo | evidencia |
|---|---|---|---|
| `admin` | Operador · Race Control (`/admin`) | frontend | `AGENT_INSTRUCTIONS.md:30-43`, `public/index.html:3895` |
| `rtdb` | RTDB · `torneo_hangar354` | database | `public/index.html:3505-3506` |
| `state` | Estado de sesión | database | `AGENT_INSTRUCTIONS.md:59-78` |
| `history` | Historial y estadísticas | database | `public/index.html:3526-3544`, `AGENT_INSTRUCTIONS.md:79-80` |
| `spectator` | Espectador (`/`) | frontend | `AGENT_INSTRUCTIONS.md:48-53`, `public/index.html:3725` |
| `lapbook` | Lapbook (`/laps`) | frontend | `public/lapbook.js:8-35`, `AGENT_INSTRUCTIONS.md:17-18` |

Conexiones: `admin→state` (escribe tiempos, rondas y sanciones), `admin→history` (cierre de torneo), `state→spectator` (listener en vivo), `history→spectator` (archivo y sala de la fama), `state→lapbook` (sesiones del piloto), `history→lapbook` (mejores tiempos y comparación de sesiones).

**Segundo diagrama:** no recomendado; un `workflow` del operador repetiría el mismo contenido.

## 11. Información pendiente de confirmar

- **Nombre público:** la ficha actual usa «Hangar354»; el repositorio y el producto todavía se refieren a «Toby's Warehouse». Conviene confirmar cuál es la marca vigente antes de publicar.
- Credenciales de administrador embebidas en la documentación del repositorio (`AGENT_INSTRUCTIONS.md:26-31`): **no se reproducen aquí** y deberían rotarse y moverse a un gestor de secretos. Es un riesgo real, no teórico.
- Si el sitio sigue activo y con los mismos datos de ejemplo.
- Derechos sobre nombres de pilotos y circuitos mostrados en las vistas.

## 12. Fuentes consultadas

`AGENT_INSTRUCTIONS.md` · `.interface-design/system.md` (índice) · `firebase.json` · `database.rules.json` · `public/index.html` (segmentos 1837, 2630-2650, 3439-3560, 3684-3700, 3720-3730, 3787-3900) · `public/lapbook.js` (cabecera y estado) · `public/lapbook.css` (índice) · `tests/lapbook.test.js` · `tests/routing.test.js` · `tests/database-rules.test.js` · `tests/browser_production_smoke.js` · `tasks/plan.md` y `tasks/todo.md` (índice).
