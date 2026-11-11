# El Cambiómetro — validacion Archify

> Resultado real de la ejecucion de Archify v3.2.0 (`node bin/archify.mjs finalize ...`) el 2026-11-10.
> Los receipts completos quedan en `diagramas/` y accompany a este informe.

## 1. Diagrama

| Dato | Valor |
|---|---|
| Tipo | `architecture` |
| Perfil de calidad | `showcase` |
| JSON candidato | `diagramas/el-cambiometro-arquitectura.json` |
| sha256 del candidato | `f6a5793eb488c32068053fe8628e4685bf7bb5b7f86dba2ebb7f29f3a519dc5a` |
| HTML generado | `diagramas/el-cambiometro-arquitectura.html` |
| sha256 del HTML | `fb45a90f84f674a368ed02cea2ef3c0ed285f094f5745d06cae737d3bb90330e` |
| Tamano | 850966 bytes |
| Estado final | `pass` |
| Duracion | 5050 ms |

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
| Receipt | `diagramas/el-cambiometro-arquitectura.browser-check.json` |

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

El candidato declara `meta.repository` con la URL del remote y la revision auditada, y los nodos referencian archivo y lineas del repositorio.
