# Inventario de proyectos

Fecha de corte: 2026-11-10. Todos los datos de esta tabla están verificados en el repositorio de
origen; la columna «afirmado» indica el tipo de evidencia disponible.

## 1. Tabla maestra

| # | Proyecto | Categoría | Estado | URL pública | Repositorio / revisión | Diagrama | Ficha actual |
|---|---|---|---|---|---|---|---|
| 1 | El Cambiómetro | Datos e información | Plataforma de datos públicos | cambiometro.impulsacv.cl | `github.com/jmorgadodev/cambiometro` · `8fb1fe9` | `architecture` | `proyectos/el-cambiometro/` |
| 2 | ListoPorHoy | Productos y plataformas | Plataforma e integraciones | listoporhoy.impulsacv.cl | `github.com/jmorgadodev/conecta` (privado) · `049a047` | `architecture` | `proyectos/conecta/` |
| 3 | Ryvolt | Experiencia web | Sitio corporativo | ryvolt.cl | local, sin remote · `4b52421` | **no** (justificado) | `proyectos/ryvolt/` |
| 4 | Flor de Almendro | Experiencia web | Catálogo comercial | flordealmendro.cl | local, sin remote · `de2a2b1` | `dataflow` | `proyectos/flor-de-almendro/` |
| 5 | Exo Dream | Experiencia web | Showroom configurable | **sin confirmar** | sin repositorio Git | `architecture` | `proyectos/exo-dream/` |
| 6 | Hangar354 | Sistemas operativos | Race Control en tiempo real | hangar354.web.app | local, sin remote · `d5b72c7` | `architecture` | `proyectos/tobys-warehouse/` |
| 7 | kokeAI | Automatización y contenido | Portal multimedia | kokeai.web.app | local, sin remote · `40986da` | `architecture` | `proyectos/kooke-portal/` |
| 8 | RRSS | Automatización y contenido | Automatización editorial | **sin URL de producto** | local, sin remote · `b0c478d` | `workflow` | `proyectos/kooke-rrss/` |

> Los slugs de carpeta (`conecta`, `tobys-warehouse`, `kooke-portal`, `kooke-rrss`) son los nombres
> técnicos que ya usa el sitio. Conviene decidir si se renombran al construir las fichas nuevas: el
> nombre público y el nombre de ruta deberían coincidir.

## 2. Qué hace cada uno, en una frase

| Proyecto | En una frase |
|---|---|
| El Cambiómetro | Une datos oficiales dispersos del Estado, los valida y los publica como API y sitio consultable. |
| ListoPorHoy | Calendario, borradores, medios y publicación por marca, desde un mismo entorno con permisos. |
| Ryvolt | Web corporativa bilingüe con dos registros visuales y prerenderizado verificado para buscadores. |
| Flor de Almendro | Catálogo de joyería que se edita en Google Sheets y se publica con contacto por WhatsApp. |
| Exo Dream | Showroom configurable: catálogo, textos, agenda y formularios leídos de Sheets y Drive. |
| Hangar354 | Control de carrera en vivo: el operador registra y todos ven el mismo estado en tiempo real. |
| kokeAI | Portal creativo alimentado automáticamente desde las carpetas de Drive, con audio servido por un Worker. |
| RRSS | Publicación programada: toma la pieza, redacta con IA, compone el formato y registra lo publicado. |

## 3. Familias técnicas (para decidir el orden de construcción)

| Familia | Proyectos | Qué comparten |
|---|---|---|
| Plataforma con backend propio | El Cambiómetro, ListoPorHoy | API, base de datos, despliegue en Cloudflare |
| Frontend sin backend | Ryvolt, Flor de Almendro, Exo Dream | Datos externos, catálogo o contenido, despliegue estático |
| Tiempo real / operación | Hangar354 | Estado compartido, reglas de base, pruebas |
| Automatización de contenido | kokeAI, RRSS | Google Workspace, automatización, medios |

## 4. Estado de la evidencia por proyecto

| Proyecto | Repositorio legible | Evidencia ejecutable | Métricas verificables | Riesgos detectados |
|---|---|---|---|---|
| El Cambiómetro | Sí (público, AGPL) | ETL, API, sitio, 479 tests | Cobertura de fuentes (corte 2026-09) | — |
| ListoPorHoy | Sí (privado) | Worker, migraciones, validaciones | Ninguna | Clave de cifrado por defecto en el código |
| Ryvolt | Sí (copia de entrega) | Build, lint, tests, prerender | Ninguna | Deriva menor en la documentación |
| Flor de Almendro | Sí (resguardo) | Frontend completo | Ninguna | Datos comerciales del cliente en el repo |
| Exo Dream | Sí (sin Git) | Frontend completo, scripts de operación | Ninguna | URL pública sin confirmar |
| Hangar354 | Sí (copia local) | Suite de pruebas completa | Ninguna | Credenciales de administrador en el repo |
| kokeAI | Sí (resguardo) | Portal, Worker, Apps Script | Ninguna | Derechos del material publicado |
| RRSS | Sí (resguardo) | Cloud Function, Apps Script | Ninguna | Token de Meta y secreto en el código |

## 5. Qué NO está en este inventario

- AuditoríaPC, Nokto y DatosDemoCL: pertenecen a la sección independiente de herramientas.
- Sammy Tarot y Taller JDM / Limit Import: línea complementaria, fuera del encargo.
- ImpulsaCV: ficha terminada; se usa como referencia de sistema, no se investiga aquí.
