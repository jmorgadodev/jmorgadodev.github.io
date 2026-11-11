# ListoPorHoy — validacion Archify

> Resultado real de la ejecucion de Archify v3.2.0 (`node bin/archify.mjs finalize ...`) el 2026-11-10.
> Los receipts completos quedan en `diagramas/` y accompany a este informe.

## 1. Diagrama

| Dato | Valor |
|---|---|
| Tipo | `architecture` |
| Perfil de calidad | `showcase` |
| JSON candidato | `diagramas/listoporhoy-arquitectura.json` |
| sha256 del candidato | `88b94900d1697d9c4c696c244028e3f3696eb799d973a31c36549f2801d87fd8` |
| HTML generado | `diagramas/listoporhoy-arquitectura.html` |
| sha256 del HTML | `585783251fa90b396eb7fb6c4039059314caf3da851dec6569f5219f497eeb72` |
| Tamano | 849506 bytes |
| Estado final | `pass` |
| Duracion | 5775 ms |

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
| Receipt | `diagramas/listoporhoy-arquitectura.browser-check.json` |

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
