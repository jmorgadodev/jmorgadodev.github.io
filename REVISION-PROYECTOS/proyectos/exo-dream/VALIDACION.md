# Exo Dream — validacion Archify

> Resultado real de la ejecucion de Archify v3.2.0 (`node bin/archify.mjs finalize ...`) el 2026-11-10.
> Los receipts completos quedan en `diagramas/` y accompany a este informe.

## 1. Diagrama

| Dato | Valor |
|---|---|
| Tipo | `architecture` |
| Perfil de calidad | `showcase` |
| JSON candidato | `diagramas/exo-dream-arquitectura.json` |
| sha256 del candidato | `22e2a8f3618c3c3639c486dc1293c90fe506ba97a399469b6d7e5e2db0a34b00` |
| HTML generado | `diagramas/exo-dream-arquitectura.html` |
| sha256 del HTML | `121e2db9840a7833e1067ebd8390a08cf56233a9bd2910981835151b0422c71a` |
| Tamano | 847249 bytes |
| Estado final | `pass` |
| Duracion | 3789 ms |

## 2. Compuertas (gates)

| Gate | Resultado |
|---|---|
| `validate` | **pass** |
| `deliver` | **pass** |
| `check` | **pass** |
| `browser-check` | **pass** |

`finalize` encadena las cuatro compuertas. El diagrama se entrega solo si todas pasan.

## 3. Comprobacion en navegador

| Dato | Valor |
|---|---|
| Solicitada | True |
| Ejecutada | True |
| Receipt | `diagramas/exo-dream-arquitectura.browser-check.json` |

## 4. Diagnosticos

- Total: 0 | mostrados: 0 | truncado: False

## 5. Comandos ejecutados

```powershell
# validacion aislada
node bin/archify.mjs validate architecture diagramas/<candidato>.json --repo-root <repo> --quality showcase --json

# generacion + entrega + comprobaciones
node bin/archify.mjs finalize architecture diagramas/<candidato>.json diagramas/<salida>.html --repo-root <repo> --quality showcase --json
```

## 6. Procedencia

Este repositorio no tiene remote configurado, por lo que Archify no admite `meta.repository` con procedencia enlazada. La evidencia por nodo (archivo y lineas) queda en `diagramas/exo-dream-arquitectura.evidencias.json`.
