# kokeAI — validacion Archify

> Resultado real de la ejecucion de Archify v3.2.0 (`node bin/archify.mjs finalize ...`) el 2026-11-10.
> Los receipts completos quedan en `diagramas/` y accompany a este informe.

## 1. Diagrama

| Dato | Valor |
|---|---|
| Tipo | `architecture` |
| Perfil de calidad | `showcase` |
| JSON candidato | `diagramas/kokeai-arquitectura.json` |
| sha256 del candidato | `72cff0987497786eda6017bb11b91d57c78e3edecaf8fb8a98b656a17300a9e4` |
| HTML generado | `diagramas/kokeai-arquitectura.html` |
| sha256 del HTML | `55bf95e419fd9b3127f244a70aa2eba032303548a3ef8e05b73de7f516f04740` |
| Tamano | 842804 bytes |
| Estado final | `pass` |
| Duracion | 4009 ms |

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
| Receipt | `diagramas/kokeai-arquitectura.browser-check.json` |

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

Este repositorio no tiene remote configurado, por lo que Archify no admite `meta.repository` con procedencia enlazada. La evidencia por nodo (archivo y lineas) queda en `diagramas/kokeai-arquitectura.evidencias.json`.
