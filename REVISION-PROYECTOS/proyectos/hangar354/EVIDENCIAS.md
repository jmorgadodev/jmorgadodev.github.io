# Hangar354 (torneo / Toby's Warehouse) — evidencias

> Fuente: repositorio local `C:\Users\jorge\Proyectos\torneo` (sólo lectura).
> Revisión auditada: `d5b72c7afe39e64043514f3629f03131871164a7` (rama `codex/race-director-v6-2`, 2026-07-29 00:04 -0400).
> Sin remote configurado. Working tree con cambios locales y artefactos eliminados (registrado, no modificado).
> Fecha de revisión: 2026-11-10.

## 1. Afirmaciones y respaldo

| # | Afirmación | Respaldo | Qué demuestra | Estado |
|---|---|---|---|---|
| 1 | Es un Race Control para Assetto Corsa / ACC | `AGENT_INSTRUCTIONS.md:1-4` | naturaleza del producto | verificado |
| 2 | La aplicación es JavaScript vanilla + CSS propio, sin frameworks | `AGENT_INSTRUCTIONS.md:8-13` | stack | verificado |
| 3 | El estado vive en Firebase RTDB bajo `torneo_hangar354` | `AGENT_INSTRUCTIONS.md:14-16`, `public/index.html:3505-3506` | estado compartido | verificado |
| 4 | La sincronización en vivo usa listeners `value` | `public/index.html:3504-3524` | tiempo real | verificado |
| 5 | El historial recalcula estadísticas acumuladas | `public/index.html:3526-3544` | persistencia histórica | verificado |
| 6 | `/` es sólo espectador e historial, sin controles de gestión | `AGENT_INSTRUCTIONS.md:48-53`, `public/index.html:3893` | separación de superficies | verificado |
| 7 | `/admin` concentra la operación y `/laps` el perfil personal | `AGENT_INSTRUCTIONS.md:19-22`, `public/index.html:3813-3820` | rutas | verificado |
| 8 | La configuración va por pasos (parrilla, formato, pistas, carrera) | `AGENT_INSTRUCTIONS.md:32-43` | flujo de operador | verificado |
| 9 | Editar tiempos de un torneo archivado recalcula tabla y acumulados | `AGENT_INSTRUCTIONS.md:40-42` | lógica de resultados | verificado |
| 10 | Google Sign-In se usa sólo en `/laps` | `AGENT_INSTRUCTIONS.md:17-18` | alcance de la autenticación | verificado |
| 11 | Las reglas de RTDB exigen UID y moderador para el Lapbook | `database.rules.json:11-40` | control de acceso | verificado |
| 12 | Existe hosting propio (target `hangar354`) con cabeceras | `firebase.json:15-40` | entrega | verificado |
| 13 | Hay pruebas unitarias, de reglas y de navegador | `tests/` (8 archivos) | verificación | verificado |
| 14 | Los tiempos los introduce el operador (no hay telemetría automática) | `AGENT_INSTRUCTIONS.md:36` | límite de alcance | verificado |
| 15 | Credenciales de administrador en texto plano | `AGENT_INSTRUCTIONS.md:26-31` | riesgo de seguridad (no se reproducen) | verificado — **no reproducido aquí** |
| 16 | Telemetría automática desde el simulador | — | sin evidencia | no afirmable |
| 17 | Nombre comercial vigente (Hangar354 vs Toby's Warehouse) | — | discrepancia entre sitio y repositorio | pendiente |

## 2. Comandos ejecutados (sólo lectura)

```powershell
git -C C:\Users\jorge\Proyectos\torneo rev-parse HEAD
git -C C:\Users\jorge\Proyectos\torneo remote get-url origin      # (sin remote)
git -C C:\Users\jorge\Proyectos\torneo log -1 --format="%H %ci %s"
git -C C:\Users\jorge\Proyectos\torneo status --short
Get-Content AGENT_INSTRUCTIONS.md -TotalCount 90
Get-Content firebase.json -TotalCount 45
Get-Content database.rules.json -TotalCount 45
Select-String -Path public\index.html -Pattern "initializeApp|rtdbRef =|rtdbHistoryRef|careerStats|hasStartedTournament|window.location.pathname|TWLapbook"
Get-Content public\index.html | Select-Object -Skip 3495 -First 60
Get-Content public\lapbook.js -TotalCount 40
Get-ChildItem tests -File
```

No se ejecutó `firebase deploy`, ni los scripts de pruebas de navegador (que consultan el sitio publicado).

## 3. Extractos mínimos

`public/index.html:3504-3512` (extracto)

```
var attachListener = function() {
  rtdbRef = firebase.database().ref('torneo_hangar354/state');
  rtdbHistoryRef = firebase.database().ref('torneo_hangar354/history');
  rtdbRef.on('value', function(snapshot) {
    var remoteState = snapshot.val();
    isSyncingFromRemote = true;
    try {
      applyRemoteState(remoteState && typeof remoteState === 'object' ... ? remoteState : getInitialState());
```

`database.rules.json:31-32` (extracto)

```
".read": "auth != null && (auth.uid === $uid || root.child('warehouse_lapbook/moderators').child(auth.uid).val() === true)",
".write": "auth != null && auth.uid === $uid && auth.token.firebase.sign_in_provider === 'google.com' && ...",
```

## 4. Archivos clave

| Archivo | Propósito |
|---|---|
| `AGENT_INSTRUCTIONS.md` | especificación de arquitectura, esquema de datos y flujos (contiene credenciales: ver riesgo) |
| `.interface-design/system.md` | sistema de diseño del producto |
| `firebase.json` | hosting (target `hangar354`), proveedor de Google y cabeceras |
| `database.rules.json` | reglas de RTDB compartidas con el proyecto kokeAI |
| `public/index.html` | aplicación completa (SPA, dashboard, admin, espectador) |
| `public/lapbook.js` / `public/lapbook.css` | módulo personal del piloto |
| `public/og-image.jpg` / `.png` | imagen social |
| `tests/lapbook.test.js` | pruebas del módulo Lapbook |
| `tests/routing.test.js` | pruebas de rutas y comportamiento del dashboard |
| `tests/database-rules.test.js` + `tests/database-rules-emulator.js` | pruebas de reglas con emulador |
| `tests/browser_lapbook.js`, `tests/browser_production_smoke.js`, `tests/browser_spectator_timing.js` | pruebas de navegador |
| `tests/static_server.js` | servidor estático para pruebas |
| `tasks/plan.md`, `tasks/todo.md` | planificación del trabajo |

## 5. Riesgos detectados (no reproducidos aquí)

1. **Credenciales de administrador en texto plano** dentro de `AGENT_INSTRUCTIONS.md:26-31`. Deberían rotarse y migrarse a un gestor de secretos o a variables de entorno. No se copiaron a esta entrega.
2. **Reglas de RTDB abiertas** para `torneo_hangar354` (`.read` y `.write` en `true`, `database.rules.json:7-10`). Es coherente con un estado de tournament público, pero conviene revisarlo si el proyecto se mantiene en producción.
3. La base de datos RTDB es **compartida** con el portal kokeAI (`docs_kokeai.md:43` del repositorio kokeAI): un cambio de reglas afecta a ambos proyectos.
