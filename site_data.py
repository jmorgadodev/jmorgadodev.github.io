"""Contenido editorial de JMorgado. No es un inventario de datos privados.
Cada ficha respeta las restricciones de docs/PORTAFOLIO_PUBLICO_CONTENIDO.md."""
# Guion modular de siete escenas. Geometría: assets/modular/manifest.json.
JOURNEY_SCENES = [{'name': 'Fricción', 'title': 'Hay algo que podría funcionar mejor.', 'text': 'Una tarea que pesa. Una idea que no avanza. Algo que cuesta más de lo necesario.'}, {'name': 'Claridad', 'title': 'Antes de cambiar algo, hay que entenderlo.', 'text': 'Qué está pasando. Qué necesitas realmente. Y qué vale la pena resolver primero.'}, {'name': 'La base', 'title': 'No hace falta empezar en grande.', 'text': 'Hace falta empezar por algo que realmente funcione.'}, {'name': 'Estructura', 'title': 'Lo que funciona puede crecer.', 'text': 'Una nueva necesidad no significa volver al principio.'}, {'name': 'Expansión', 'title': 'Una buena base abre nuevos caminos.', 'text': 'Lo que comenzó resolviendo una necesidad ahora puede acompañar otras.'}, {'name': 'Integración', 'title': 'Cada pieza encuentra su lugar.', 'text': 'Lo que comenzó como algo pequeño ahora funciona como un conjunto.'}, {'name': 'La idea', 'title': 'Todo comienza con una idea.', 'text': ''}]
PROJECTS = [
 dict(slug="impulsacv",title="ImpulsaCV",area="Productos y plataformas",category="plataformas",label="Producto digital",state="Plataforma web",summary="Una plataforma que reúne currículum, compatibilidad ATS, postulaciones, entrevistas y herramientas de apoyo en un mismo recorrido.",problem="Preparar una postulación laboral exige trabajar documentos, comparar requisitos, organizar versiones y alternar entre herramientas desconectadas.",work="Desarrollo de una experiencia web con cuentas, membresías y pagos, módulos de edición y análisis de CV, preparación de entrevistas y componentes de inteligencia artificial integrados en un producto.",flow=["Documento y contexto","Motores de análisis y reglas","Resultado para la persona"],tech=["React / Vite","Hono","Cloudflare Workers","D1","Integraciones de IA"],caution="No todos los módulos utilizan IA generativa. Existen motores deterministas, servicios remotos y componentes locales opcionales; tampoco se afirma que todos los procesos auxiliares estén activos automáticamente.",site="https://impulsacv.cl",repo=None,related="desarrollo-web",accent="blue"),
 dict(slug="el-cambiometro",title="El Cambiómetro",area="Datos e información",category="plataformas",label="Ingeniería de datos",state="Plataforma de datos públicos",summary="De fuentes públicas dispersas a datos consultables: ingesta, validación, trazabilidad, API y visualización.",problem="La información pública está distribuida en distintos orígenes, formatos y fechas de actualización; consultarla y compararla exige trabajo de depuración.",work="Construcción de procesos de ingesta y ETL, normalización, controles de calidad, snapshots históricos, consultas y visualización. El sistema editorial de contenidos es un entorno separado.",flow=["Fuentes públicas","ETL y trazabilidad","API y visualización"],tech=["ETL","Python","Fuentes públicas","APIs","Dashboards"],caution="Las métricas disponibles en documentación son cortes históricos. El entorno editorial usa revisión humana; no debe describirse como publicación social enteramente automática.",site="https://cambiometro.impulsacv.cl",repo="https://github.com/jmorgadodev/cambiometro",related="datos-y-bi",accent="orange"),
 dict(slug="conecta",title="Conecta / ListoPorHoy",area="Productos y plataformas",category="plataformas",label="Integraciones",state="Plataforma e integraciones con límites por permisos",summary="Calendario, borradores, marcas, medios y servicios de publicación coordinados desde un mismo entorno.",problem="Operar contenido de distintas marcas obliga a manejar calendarios, archivos, cuentas y estados de publicación en sistemas separados.",work="Desarrollo de una plataforma web con dashboard, backend Hono, D1, biblioteca de medios y conexiones OAuth/APIs. Se organizaron entidades de marcas, usuarios, roles, calendario, publicaciones y métricas.",flow=["Marca y calendario","Backend, datos y permisos","API social habilitada"],tech=["Vite","Hono","Cloudflare Workers","D1","OAuth / APIs sociales"],caution="Las redes, los formatos y las automatizaciones no tienen la misma disponibilidad. Comentarios y mensajes automáticos no estaban habilitados en la evidencia revisada; no se prometen sin permisos.",site="https://listoporhoy.impulsacv.cl",repo=None,related="integraciones",accent="blue"),
 dict(slug="ryvolt",title="Ryvolt",area="Experiencia web",category="web",label="Sitio corporativo",state="Trabajo entregado",summary="Una presencia corporativa bilingüe con dos enfoques visuales, interacción y una base técnica preparada para buscadores.",problem="Explicar servicios de consultoría y conectar con públicos diferentes sin perder una identidad reconocible.",work="Implementación frontend responsive y bilingüe, experiencias Corporate/Rebel, componentes interactivos, formularios, analítica y técnicas de prerenderizado y SEO.",flow=["Servicios y audiencia","Experiencia visual dual","Exploración y contacto"],tech=["React","Vite","Tailwind","Animación","SEO técnico"],caution="Las verificaciones de build, lint y pruebas corresponden a la entrega documentada; no equivalen a una auditoría actual del sitio.",site="https://ryvolt.cl/",repo=None,related="desarrollo-web",accent="orange"),
 dict(slug="flor-de-almendro",title="Flor de Almendro",area="Experiencia web",category="web",label="Catálogo comercial",state="Sitio comercial",summary="Un catálogo de joyería conectado a las herramientas que el negocio ya utiliza para administrar productos y medios.",problem="Actualizar un catálogo y sus imágenes sin obligar a un negocio a aprender un sistema de gestión más complejo de lo necesario.",work="Desarrollo de un frontend de productos, categorías, filtros, stock y contacto por WhatsApp. Integración de Google Sheets como fuente de información y Drive para medios.",flow=["Edición en Sheets","Carga y normalización","Catálogo y consulta"],tech=["React","Vite","Google Sheets","Google Drive","WhatsApp"],caution="La lectura se realiza al cargar o consultar; no se describe como sincronización push en tiempo real ni como pasarela de pago propia.",site="https://flordealmendro.cl/",repo=None,related="integraciones",accent="blue"),
 dict(slug="exo-dream",title="Exo Dream",area="Experiencia web",category="web",label="Showroom configurable",state="Proyecto documentado; URL pública sin confirmar",summary="Un showroom multidisciplinario con catálogo, textos configurables, fichas, agenda y formularios.",problem="Presentar distintas líneas de trabajo con información que pueda actualizarse sin rehacer cada sección del sitio.",work="Construcción de frontend configurable con Google Sheets para catálogo y contenidos, Drive para recursos visuales, servicios de lectura y mecanismos de respaldo.",flow=["Configuración y catálogo","Servicios de lectura","Showroom y formularios"],tech=["Frontend web","Google Sheets","Google Drive","Servicios de lectura"],caution="La URL exacta de producción no está confirmada. No se inventa enlace público ni se atribuye sincronización instantánea.",site=None,repo=None,related="desarrollo-web",accent="orange"),
 dict(slug="tobys-warehouse",title="Toby's Warehouse",area="Sistemas operativos",category="sistemas",label="Tiempo real",state="Herramienta de gestión de torneos",summary="Control de sesiones, tiempos, clasificaciones y resultados compartidos para operadores y participantes.",problem="Administrar una competencia mientras ocurre requiere un estado común, resultados consistentes y una vista clara para quienes participan.",work="Sistema Race Control con sesiones, rondas, puntuaciones, sanciones, resultados y vista pública; almacenamiento de estado en Firebase Realtime Database y módulo personal Lapbook.",flow=["Operador registra tiempos","Firebase sincroniza estado","Participantes consultan resultados"],tech=["JavaScript","Firebase Realtime Database","Dashboard","Estado compartido"],caution="Los tiempos los introduce o administra el operador. No existe evidencia para afirmar que se extraiga telemetría automáticamente desde el simulador.",site="https://hangar354.web.app",repo=None,related="desarrollo-web",accent="blue"),
 dict(slug="kooke-portal",title="KOOOKE.AI — Portal",area="Automatización y contenido",category="sistemas",label="Portal multimedia",state="Portal y catálogo",summary="Colecciones multimedia organizadas mediante un catálogo alimentado por servicios de Google y Firebase.",problem="Organizar contenido creativo, metadatos y medios desde distintas fuentes y ofrecer una experiencia de exploración coherente.",work="Frontend web con Firebase Hosting y Realtime Database; automatizaciones de metadatos con Apps Script/Drive y un Worker independiente para entregar audio.",flow=["Google Workspace","Apps Script y Firebase","Portal y servicio de audio"],tech=["HTML / CSS / JavaScript","Firebase","Apps Script","Google Drive","Cloudflare Worker"],caution="El uso público de piezas audiovisuales o gráficas exige derechos/licencias apropiados. El portal no debe confundirse con el proyecto de automatización RRSS.",site="https://kokeai.web.app/",repo=None,related="integraciones",accent="orange"),
 dict(slug="kooke-rrss",title="KOOOKE — Operación RRSS",area="Automatización y contenido",category="sistemas",label="Automatización editorial",state="Sistema interno; sin URL de producto",summary="Coordinación de calendario, historial, generación asistida y composición programática de contenidos.",problem="Planificar contenidos, procesar ideas y mantener registros entre herramientas sin repetir tareas de manera manual.",work="Automatización con Sheets y Apps Script, scripts Python, apoyo de Gemini para análisis y redacción, composición con Pillow y conexiones con servicios sociales.",flow=["Calendario e historial","Python y composición","Preparación para publicación"],tech=["Python","Google Sheets","Apps Script","Gemini","Pillow"],caution="Es un sistema distinto al portal multimedia. No se afirma que sus activadores o publicaciones estén actualmente ejecutándose en remoto.",site=None,repo=None,related="automatizacion",accent="blue"),
]

# Páginas públicas que Cloudflare permite insertar desde JMorgado.
PROJECT_PORTAL_PAGES = {
    "impulsacv": (
        ("inicio", "Inicio", "https://impulsacv.cl/"),
        ("formatos", "Plantillas de CV", "https://impulsacv.cl/plantillas-cv/"),
    ),
    "el-cambiometro": (
        ("inicio", "Inicio", "https://cambiometro.impulsacv.cl/"),
        ("datos", "Fuentes y datos", "https://cambiometro.impulsacv.cl/datos/"),
    ),
    "conecta": (
        ("inicio", "Inicio", "https://listoporhoy.impulsacv.cl/"),
    ),
}

TOOLS = [
    dict(
        slug="auditapc", title="AuditaPC", icon="scan", tone="petrol",
        task="Documentar una visita técnica",
        sample_title="Inventario técnico · Demostración con datos ficticios",
        sample_images=("auditapc-inventario.webp", None),
        sample_alt="AuditaPC muestra el inventario y los componentes de un equipo de demostración",
        summary="Inventario técnico local de equipos, con historial e informes exportables.",
        problem="Reúne la evidencia de una visita técnica y genera informes HTML, CSV y JSON.",
        platform="Windows x64", state="Estable · 1.0.0", tech=[".NET", "WPF"],
        features=["Auditorías por empresa y fecha", "Historial de equipos y notas de terreno", "Informes HTML y exportación CSV / JSON"],
        repo="https://github.com/jmorgadodev/AuditaPC",
        docs="https://github.com/jmorgadodev/AuditaPC/blob/main/README.md",
        download="https://github.com/jmorgadodev/AuditaPC/releases/download/v1.0.0/AuditaPC-win-x64-portable.zip",
        license="MIT",
    ),
    dict(
        slug="nokto", title="Nokto", icon="gear", tone="clay",
        task="Automatizar una rutina de escritorio",
        sample_title="Nokto · Editor de disparadores y acciones",
        sample_images=("nokto-rutinas-light.webp", "nokto-rutinas-dark.webp"),
        sample_alt="Editor de rutinas de Nokto con un disparador y una lista de acciones",
        summary="Consola de escritorio para telemetría, audio y rutinas de automatización.",
        problem="Reúne información del equipo y acciones cotidianas en un escritorio configurable.",
        platform="Windows 10 / 11 x64", state="Estable · 2.0.3", tech=[".NET 8", "Avalonia", "WASAPI"],
        features=["Telemetría del equipo", "Controles de audio y escritorio", "Rutinas con disparadores y acciones locales"],
        repo="https://github.com/jmorgadodev/Nokto",
        docs="https://github.com/jmorgadodev/Nokto/blob/master/README.es.md",
        download="https://github.com/jmorgadodev/Nokto/releases/download/v2.0.3/Nokto-v2.0.3-Portable-x64.zip",
        license="MIT",
    ),
    dict(
        slug="datosdemocl", title="DatosDemoCL", icon="data", tone="amber",
        task="Preparar datos para una prueba",
        sample_title="DatosDemoCL · Extracto de un lote sintético",
        summary="Generador local de datos de prueba con convenciones chilenas.",
        problem="Prepara lotes sintéticos para probar formularios, importadores y planillas. Un RUT generado puede coincidir con uno real.",
        platform="Windows / Python 3.11+", state="0.8.0 · Código disponible",
        tech=["Python", "Tkinter", "CLI", "CSV / JSON"],
        features=["Perfiles y rangos configurables", "Vista previa antes de exportar", "Interfaz gráfica y línea de comandos"],
        repo="https://github.com/jmorgadodev/DatosDemoCL",
        docs="https://github.com/jmorgadodev/DatosDemoCL/blob/main/README.md",
        license="MIT",
    ),
]
LEGACY_TOOL_SLUGS = ("auditapc", "nokto")

PROJECT_CONTEXT = {
    "impulsacv": ("Desarrollé la plataforma y sus módulos de edición y análisis de CV.", "Edición, análisis y preparación de entrevistas accesibles desde una misma cuenta."),
    "el-cambiometro": ("Construí la ingesta, los controles de calidad y el flujo de consulta.", "Fuentes públicas normalizadas que se pueden consultar por API y visualizar con trazabilidad."),
    "conecta": ("Desarrollé la plataforma, su modelo de permisos y las integraciones disponibles.", "Calendario, borradores y medios coordinados desde un entorno de trabajo por marca."),
    "ryvolt": ("Implementé el frontend bilingüe, las interacciones y el prerenderizado.", "Una web adaptable con dos registros visuales para presentar los servicios de la marca."),
    "flor-de-almendro": ("Desarrollé el catálogo e integré sus fuentes de productos e imágenes.", "El negocio puede actualizar su catálogo con Sheets y Drive."),
    "exo-dream": ("Construí el frontend configurable y los servicios de lectura del catálogo.", "El showroom puede actualizar contenidos y fichas desde sus fuentes de datos."),
    "tobys-warehouse": ("Implementé el sistema Race Control y las vistas conectadas al estado compartido.", "Operadores y participantes pueden consultar los resultados de las mismas sesiones."),
    "kooke-portal": ("Desarrollé el frontend, la automatización de metadatos y el servicio de audio.", "El portal reúne colecciones y medios en una experiencia de exploración común."),
    "kooke-rrss": ("Implementé el flujo de planificación, generación asistida y composición.", "El sistema conserva registros y prepara contenidos para revisión y publicación."),
}

# Copias de los originales locales. La segunda variante, si existe, es para noche.
PROJECT_MARKS = {
    "impulsacv": ("impulsacv-day.png", "impulsacv.png"),
    "el-cambiometro": ("el-cambiometro-day.svg", "el-cambiometro.svg"),
    "ryvolt": ("ryvolt.svg", "ryvolt-night.svg"),
    "flor-de-almendro": ("flor-de-almendro.webp", None),
    "conecta": ("conecta.webp", "conecta-night.webp"),
    "exo-dream": ("exo-dream.svg", None),
}

PROJECT_DECISIONS = {
    "impulsacv": "Separé la edición de documentos, el análisis y los módulos de apoyo para que cada paso conserve su propio contexto. La interfaz de React reúne el recorrido; Hono, Workers y D1 atienden las operaciones que requieren cuenta y persistencia.",
    "el-cambiometro": "Separé ingesta, validación y consulta porque las fuentes publican con formatos y cortes distintos. Los procesos ETL normalizan los registros y conservan el origen antes de servirlos por API y en las visualizaciones.",
    "conecta": "Organicé los datos por marca y rol para que los permisos de publicación no dependan de la pantalla que se esté usando. El backend centraliza el calendario y las conexiones OAuth, cada una con el alcance que concede la plataforma.",
    "ryvolt": "Usé componentes de React para sostener las dos propuestas visuales y la navegación bilingüe. El prerenderizado entrega contenido inicial a buscadores y conserva las interacciones en el navegador.",
    "flor-de-almendro": "El catálogo lee productos desde Sheets y medios desde Drive para mantener la edición en herramientas conocidas por el negocio. El sitio presenta stock y categorías y deja la conversación de compra en WhatsApp.",
    "exo-dream": "Separé catálogo, textos y configuración de la interfaz para actualizar el showroom sin reconstruir las páginas. Los servicios de lectura conectan esas fuentes con las fichas, la agenda y los formularios.",
    "tobys-warehouse": "Separé el registro del operador de la vista de participantes. Firebase Realtime Database comparte el estado de la sesión para que rondas, sanciones y resultados se consulten desde el mismo conjunto de datos.",
    "kooke-portal": "El catálogo y los medios siguen recorridos distintos. Apps Script organiza los metadatos, Firebase sirve la experiencia web y un Worker entrega el audio sin mezclarlo con la gestión del catálogo.",
    "kooke-rrss": "El calendario y el historial quedan en Sheets, mientras Python y Pillow se encargan del procesamiento y la composición. Así cada paso puede revisarse antes de preparar una publicación.",
}

SERVICES=[
 dict(slug="automatizacion",title="Automatización de procesos",short="Quitar trabajo repetitivo sin crear un sistema innecesario.",lead="Cuando una misma tarea pasa por planillas, correos y aplicaciones, la solución puede ser una fórmula, una rutina de Python, un flujo en Make o una integración de API.",situation="Copiar registros, validar datos, transferir información y preparar reportes de forma repetitiva consume horas y eleva el riesgo de errores.",approach="Primero entiendo el proceso, su frecuencia, quién lo ejecuta y qué excepciones aparecen. Luego evalúo desde Power Query y Apps Script hasta n8n, Make o código, según el costo de mantenimiento y las condiciones del cliente.",outputs=["Automatización de tareas entre herramientas","Procesamiento y validación de datos","Registros y control de excepciones","Documentación de operación"],stack=["Python","n8n / Make","Apps Script","Excel / Power Query","APIs"],examples=["kooke-rrss","conecta","auditapc"]),
 dict(slug="desarrollo-web",title="Desarrollo web y plataformas",short="De una web comercial a una aplicación con usuarios y lógica propia.",lead="Construyo interfaces y sistemas web en función de la operación: una web corporativa, un catálogo administrable, un panel de control o un producto digital completo.",situation="Una presencia digital no resuelve por sí sola un proceso. A veces hace falta conectar datos, crear permisos o integrar una operación que hoy se realiza manualmente.",approach="Definir objetivos, usuarios y flujos antes de elegir el stack. Arquitectura, frontend, backend, datos e interacción se justifican por lo que la solución debe hacer.",outputs=["Sitios y catálogos conectados","Aplicaciones y paneles internos","Experiencias responsive y accesibles","Integración de servicios y formularios"],stack=["React / Vite","TypeScript","Hono / Workers","Firebase","Cloudflare D1"],examples=["impulsacv","ryvolt","tobys-warehouse"]),
 dict(slug="datos-y-bi",title="Datos, planillas y BI",short="De archivos dispersos a información que se puede trabajar.",lead="Ordeno flujos de datos, depuro y combino fuentes, y preparo reportes y paneles que ayuden a interpretar la operación sin rehacer procesos manuales.",situation="Varias versiones de una planilla, columnas inconsistentes o reportes montados a mano dificultan el seguimiento de cualquier operación.",approach="Reviso qué datos existen, cómo se relacionan y qué decisiones deben respaldar. Utilizo la tecnología más proporcional: Excel, Power Query, Python, Power BI, BigQuery o Looker Studio.",outputs=["Consolidación y limpieza de archivos","Transformaciones y procesos ETL","Dashboards e informes","Modelos de datos y automatizaciones"],stack=["Excel","Power Query","Python","Power BI","GCP / BigQuery","Looker Studio"],examples=["el-cambiometro","flor-de-almendro"]),
 dict(slug="integraciones",title="Integraciones y APIs",short="Conectar herramientas que ya forman parte del negocio.",lead="El objetivo no siempre es crear una aplicación nueva. A veces basta con permitir que la planilla, el catálogo, la base de datos y el servicio externo intercambien información correctamente.",situation="Cuando la información queda aislada en distintas herramientas, alguien termina haciendo de puente manual entre sistemas.",approach="Definir responsabilidades de cada sistema, permisos, formato de datos, frecuencia de actualización y respuesta ante fallos. Elegir integración directa, Apps Script, servicio intermedio o automatización visual.",outputs=["Conexiones entre APIs y servicios","Integraciones con Google Workspace","Flujos con controles de error","Almacenamiento y sincronización cuando corresponda"],stack=["APIs REST","OAuth","Google Sheets","Apps Script","Firebase","Cloudflare Workers"],examples=["conecta","flor-de-almendro","kooke-portal"]),
 dict(slug="ia-aplicada",title="IA aplicada con criterio",short="Modelos y agentes cuando aportan valor, no por tendencia.",lead="Trabajo con modelos locales y servicios externos según precisión, privacidad, rendimiento y costo. La IA se integra dentro de un proceso verificable y con supervisión.",situation="Clasificar texto, extraer información, analizar documentos o generar contenido puede requerir modelos; otros problemas funcionan mejor con reglas simples.",approach="Evaluar dónde se ejecutan los datos, qué grado de revisión necesita la salida y qué ocurre cuando el modelo se equivoca. No prometer ejecución local en flujos que dependen de servicios externos.",outputs=["Integración de modelos vía API o local","Análisis y clasificación asistidos","Orquestación de agentes y herramientas","Validación y supervisión de resultados"],stack=["Ollama / LM Studio","Gemma / Qwen / DeepSeek","APIs de modelos","CLI y agentes","Python"],examples=["impulsacv","kooke-rrss"]),
 dict(slug="soporte-ti",title="Soporte técnico independiente",short="Diagnóstico, levantamientos y resolución de incidencias concretas.",lead="Apoyo en problemas de configuración y operación tecnológica, con información clara de lo encontrado y de las acciones realizadas.",situation="Un equipo, una instalación o una configuración problemática puede detener una tarea. La intervención debe identificar hechos antes de recomendar cambios.",approach="Revisar la necesidad, acordar acceso y alcance, realizar el levantamiento técnico necesario, documentar hallazgos y explicar siguientes pasos.",outputs=["Diagnóstico inicial y alcance","Levantamiento técnico de equipos","Registro de incidencias","Informes técnicos comprensibles"],stack=["Windows","Herramientas locales","Informes HTML","Inventario técnico"],examples=["auditapc"]),
 dict(slug="redes-sociales", title="Gestión de redes sociales",
      short="Planificar contenido, organizar publicaciones y revisar qué está funcionando.",
      lead="Organizo contigo el trabajo de contenido, desde las ideas y el calendario hasta la revisión de las publicaciones."),

]
