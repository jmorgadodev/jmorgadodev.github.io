# Flor de Almendro — validacion Archify

> Resultado real de la ejecucion de Archify v3.2.0 (`node bin/archify.mjs finalize ...`) el 2026-11-10.
> Los receipts completos quedan en `diagramas/` y accompany a este informe.

## 1. Diagrama

| Dato | Valor |
|---|---|
| Tipo | `dataflow` |
| Perfil de calidad | `standard` |
| JSON candidato | `diagramas/flor-de-almendro-flujo.json` |
| sha256 del candidato | `27e33cbcfc43102d3fd61b4a00e94a402c38baa9705db6ce6cbdceccb0336486` |
| HTML generado | `diagramas/flor-de-almendro-flujo.html` |
| sha256 del HTML | `065e7fbb2d626281e0043b9cc3a08342a7ec16b75b757856bccd83f7f76e36a9` |
| Tamano | 838493 bytes |
| Estado final | `pass` |
| Duracion | 4402 ms |

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
| Receipt | `diagramas/flor-de-almendro-flujo.browser-check.json` |

## 4. Diagnosticos

- Total: 0 | mostrados: 0 | truncado: False

## 5. Comandos ejecutados

```powershell
# validacion aislada
node bin/archify.mjs validate dataflow diagramas/<candidato>.json --repo-root <repo> --quality standard --json

# generacion + entrega + comprobaciones
node bin/archify.mjs finalize dataflow diagramas/<candidato>.json diagramas/<salida>.html --repo-root <repo> --quality standard --json
```

## 6. Procedencia

Este repositorio no tiene remote configurado, por lo que Archify no admite `meta.repository` con procedencia enlazada. La evidencia por nodo (archivo y lineas) queda en `diagramas/flor-de-almendro-flujo.evidencias.json`.
