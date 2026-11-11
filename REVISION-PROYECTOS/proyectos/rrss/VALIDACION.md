# RRSS — validacion Archify

> Resultado real de la ejecucion de Archify v3.2.0 (`node bin/archify.mjs finalize ...`) el 2026-11-10.
> Los receipts completos quedan en `diagramas/` y accompany a este informe.

## 1. Diagrama

| Dato | Valor |
|---|---|
| Tipo | `workflow` |
| Perfil de calidad | `showcase` |
| JSON candidato | `diagramas/rrss-recorrido.json` |
| sha256 del candidato | `565dfd748b998f4376448d6c4d056aabbf66409b7e80ffb56035f5c444d25eed` |
| HTML generado | `diagramas/rrss-recorrido.html` |
| sha256 del HTML | `95d56c35ee9a87b50fb4fa7dfb3cacb4bde75a2ac709ee6a6ff064d81e8a909b` |
| Tamano | 836639 bytes |
| Estado final | `pass` |
| Duracion | 3539 ms |

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
| Receipt | `diagramas/rrss-recorrido.browser-check.json` |

## 4. Diagnosticos

- Total: 0 | mostrados: 0 | truncado: False

## 5. Comandos ejecutados

```powershell
# validacion aislada
node bin/archify.mjs validate workflow diagramas/<candidato>.json --repo-root <repo> --quality showcase --json

# generacion + entrega + comprobaciones
node bin/archify.mjs finalize workflow diagramas/<candidato>.json diagramas/<salida>.html --repo-root <repo> --quality showcase --json
```

## 6. Procedencia

Este repositorio no tiene remote configurado, por lo que Archify no admite `meta.repository` con procedencia enlazada. La evidencia por nodo (archivo y lineas) queda en `diagramas/rrss-recorrido.evidencias.json`.
