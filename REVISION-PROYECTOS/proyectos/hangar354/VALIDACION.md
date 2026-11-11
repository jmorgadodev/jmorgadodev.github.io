# Hangar354 — validacion Archify

> Resultado real de la ejecucion de Archify v3.2.0 (`node bin/archify.mjs finalize ...`) el 2026-11-10.
> Los receipts completos quedan en `diagramas/` y accompany a este informe.

## 1. Diagrama

| Dato | Valor |
|---|---|
| Tipo | `architecture` |
| Perfil de calidad | `showcase` |
| JSON candidato | `diagramas/hangar354-arquitectura.json` |
| sha256 del candidato | `540901b4ed5fb527c5d8eb2dbf7bbddf1a17b4991d2021898e37bab3f804c791` |
| HTML generado | `diagramas/hangar354-arquitectura.html` |
| sha256 del HTML | `3f12affab374d776e4a780d734dfa7de74eee5cc231a43d7b1cf43e3a7dcfc8c` |
| Tamano | 842856 bytes |
| Estado final | `pass` |
| Duracion | 4129 ms |

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
| Receipt | `diagramas/hangar354-arquitectura.browser-check.json` |

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

Este repositorio no tiene remote configurado, por lo que Archify no admite `meta.repository` con procedencia enlazada. La evidencia por nodo (archivo y lineas) queda en `diagramas/hangar354-arquitectura.evidencias.json`.
