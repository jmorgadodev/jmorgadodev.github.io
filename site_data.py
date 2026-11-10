"""Contenido editorial de JMorgado. No es un inventario de datos privados.
Cada ficha respeta las restricciones de docs/PORTAFOLIO_PUBLICO_CONTENIDO.md."""
# Guion modular de siete escenas. Geometría: assets/modular/manifest.json.
JOURNEY_SCENES = [{'name': 'Fricción', 'title': 'Hay algo que podría funcionar mejor.', 'text': 'Una tarea que pesa. Una idea que no avanza. Algo que cuesta más de lo necesario.'}, {'name': 'Claridad', 'title': 'Antes de cambiar algo, hay que entenderlo.', 'text': 'Qué está pasando. Qué necesitas realmente. Y qué vale la pena resolver primero.'}, {'name': 'La base', 'title': 'No hace falta empezar en grande.', 'text': 'Hace falta empezar por algo que realmente funcione.'}, {'name': 'Estructura', 'title': 'Lo que funciona puede crecer.', 'text': 'Una nueva necesidad no significa volver al principio.'}, {'name': 'Expansión', 'title': 'Una buena base abre nuevos caminos.', 'text': 'Lo que comenzó resolviendo una necesidad ahora puede acompañar otras.'}, {'name': 'Integración', 'title': 'Cada pieza encuentra su lugar.', 'text': 'Lo que comenzó como algo pequeño ahora funciona como un conjunto.'}, {'name': 'La idea', 'title': 'Todo comienza con una idea.', 'text': ''}]
PROJECTS = [
 dict(slug="impulsacv",title="ImpulsaCV",area="Productos y plataformas",category="plataformas",label="Producto digital",state="Plataforma web",summary="Una plataforma que reúne currículum, compatibilidad ATS, postulaciones, entrevistas y herramientas de apoyo en un mismo recorrido.",problem="Preparar una postulación laboral exige trabajar documentos, comparar requisitos, organizar versiones y alternar entre herramientas desconectadas.",work="Desarrollo de una experiencia web con cuentas, membresías y pagos, módulos de edición y análisis de CV, preparación de entrevistas y componentes de inteligencia artificial integrados en un producto.",flow=["Documento y contexto","Motores de análisis y reglas","Resultado para la persona"],tech=["React / Vite","Hono","Cloudflare Workers","D1","Integraciones de IA"],caution="No todos los módulos utilizan IA generativa. Existen motores deterministas, servicios remotos y componentes locales opcionales; tampoco se afirma que todos los procesos auxiliares estén activos automáticamente.",site="https://impulsacv.cl",repo=None,related="desarrollo-web",accent="blue"),
 dict(slug="el-cambiometro",title="El Cambiómetro",area="Datos e información",category="plataformas",label="Ingeniería de datos",state="Plataforma de datos públicos",summary="De fuentes públicas dispersas a datos consultables: ingesta, validación, trazabilidad, API y visualización.",problem="La información pública está distribuida en distintos orígenes, formatos y fechas de actualización; consultarla y compararla exige trabajo de depuración.",work="Construcción de procesos de ingesta y ETL, normalización, controles de calidad, snapshots históricos, consultas y visualización. El sistema editorial de contenidos es un entorno separado.",flow=["Fuentes públicas","ETL y trazabilidad","API y visualización"],tech=["ETL","Python","Fuentes públicas","APIs","Dashboards"],caution="Las métricas disponibles en documentación son cortes históricos. El entorno editorial usa revisión humana; no debe describirse como publicación social enteramente automática.",site="https://cambiometro.impulsacv.cl",repo="https://github.com/jmorgadodev/cambiometro",related="datos-y-bi",accent="orange"),
 dict(slug="conecta",title="ListoPorHoy",area="Productos y plataformas",category="plataformas",label="Integraciones",state="Plataforma e integraciones con límites por permisos",summary="Calendario, borradores, marcas, medios y servicios de publicación coordinados desde un mismo entorno.",problem="Operar contenido de distintas marcas obliga a manejar calendarios, archivos, cuentas y estados de publicación en sistemas separados.",work="Desarrollo de una plataforma web con dashboard, backend Hono, D1, biblioteca de medios y conexiones OAuth/APIs. Se organizaron entidades de marcas, usuarios, roles, calendario, publicaciones y métricas.",flow=["Marca y calendario","Backend, datos y permisos","API social habilitada"],tech=["Vite","Hono","Cloudflare Workers","D1","OAuth / APIs sociales"],caution="Las redes, los formatos y las automatizaciones no tienen la misma disponibilidad. Comentarios y mensajes automáticos no estaban habilitados en la evidencia revisada; no se prometen sin permisos.",site="https://listoporhoy.impulsacv.cl",repo=None,related="integraciones",accent="blue"),
 dict(slug="ryvolt",title="Ryvolt",area="Experiencia web",category="web",label="Sitio corporativo",state="Trabajo entregado",summary="Una presencia corporativa bilingüe con dos enfoques visuales, interacción y una base técnica preparada para buscadores.",problem="Explicar servicios de consultoría y conectar con públicos diferentes sin perder una identidad reconocible.",work="Implementación frontend responsive y bilingüe, experiencias Corporate/Rebel, componentes interactivos, formularios, analítica y técnicas de prerenderizado y SEO.",flow=["Servicios y audiencia","Experiencia visual dual","Exploración y contacto"],tech=["React","Vite","Tailwind","Animación","SEO técnico"],caution="Las verificaciones de build, lint y pruebas corresponden a la entrega documentada; no equivalen a una auditoría actual del sitio.",site="https://ryvolt.cl/",repo=None,related="desarrollo-web",accent="orange"),
 dict(slug="flor-de-almendro",title="Flor de Almendro",area="Experiencia web",category="web",label="Catálogo comercial",state="Sitio comercial",summary="Un catálogo de joyería conectado a las herramientas que el negocio ya utiliza para administrar productos y medios.",problem="Actualizar un catálogo y sus imágenes sin obligar a un negocio a aprender un sistema de gestión más complejo de lo necesario.",work="Desarrollo de un frontend de productos, categorías, filtros, stock y contacto por WhatsApp. Integración de Google Sheets como fuente de información y Drive para medios.",flow=["Edición en Sheets","Carga y normalización","Catálogo y consulta"],tech=["React","Vite","Google Sheets","Google Drive","WhatsApp"],caution="La lectura se realiza al cargar o consultar; no se describe como sincronización push en tiempo real ni como pasarela de pago propia.",site="https://flordealmendro.cl/",repo=None,related="integraciones",accent="blue"),
 dict(slug="exo-dream",title="Exo Dream",area="Experiencia web",category="web",label="Showroom configurable",state="Proyecto documentado; URL pública sin confirmar",summary="Un showroom multidisciplinario con catálogo, textos configurables, fichas, agenda y formularios.",problem="Presentar distintas líneas de trabajo con información que pueda actualizarse sin rehacer cada sección del sitio.",work="Construcción de frontend configurable con Google Sheets para catálogo y contenidos, Drive para recursos visuales, servicios de lectura y mecanismos de respaldo.",flow=["Configuración y catálogo","Servicios de lectura","Showroom y formularios"],tech=["Frontend web","Google Sheets","Google Drive","Servicios de lectura"],caution="La URL exacta de producción no está confirmada. No se inventa enlace público ni se atribuye sincronización instantánea.",site=None,repo=None,related="desarrollo-web",accent="orange"),
 dict(slug="tobys-warehouse",title="Hangar354",area="Sistemas operativos",category="sistemas",label="Tiempo real",state="Herramienta de gestión de torneos",summary="Control de sesiones, tiempos, clasificaciones y resultados compartidos para operadores y participantes.",problem="Administrar una competencia mientras ocurre requiere un estado común, resultados consistentes y una vista clara para quienes participan.",work="Sistema Race Control con sesiones, rondas, puntuaciones, sanciones, resultados y vista pública; almacenamiento de estado en Firebase Realtime Database y módulo personal Lapbook.",flow=["Operador registra tiempos","Firebase sincroniza estado","Participantes consultan resultados"],tech=["JavaScript","Firebase Realtime Database","Dashboard","Estado compartido"],caution="Los tiempos los introduce o administra el operador. No existe evidencia para afirmar que se extraiga telemetría automáticamente desde el simulador.",site="https://hangar354.web.app",repo=None,related="desarrollo-web",accent="blue"),
 dict(slug="kooke-portal",title="kokeAI",area="Automatización y contenido",category="sistemas",label="Portal multimedia",state="Portal y catálogo",summary="Colecciones multimedia organizadas mediante un catálogo alimentado por servicios de Google y Firebase.",problem="Organizar contenido creativo, metadatos y medios desde distintas fuentes y ofrecer una experiencia de exploración coherente.",work="Frontend web con Firebase Hosting y Realtime Database; automatizaciones de metadatos con Apps Script/Drive y un Worker independiente para entregar audio.",flow=["Google Workspace","Apps Script y Firebase","Portal y servicio de audio"],tech=["HTML / CSS / JavaScript","Firebase","Apps Script","Google Drive","Cloudflare Worker"],caution="El uso público de piezas audiovisuales o gráficas exige derechos/licencias apropiados. El portal no debe confundirse con el proyecto de automatización RRSS.",site="https://kokeai.web.app/",repo=None,related="integraciones",accent="orange"),
 dict(slug="kooke-rrss",title="RRSS",area="Automatización y contenido",category="sistemas",label="Automatización editorial",state="Sistema interno; sin URL de producto",summary="Coordinación de calendario, historial, generación asistida y composición programática de contenidos.",problem="Planificar contenidos, procesar ideas y mantener registros entre herramientas sin repetir tareas de manera manual.",work="Automatización con Sheets y Apps Script, scripts Python, apoyo de Gemini para análisis y redacción, composición con Pillow y conexiones con servicios sociales.",flow=["Calendario e historial","Python y composición","Preparación para publicación"],tech=["Python","Google Sheets","Apps Script","Gemini","Pillow"],caution="Es un sistema distinto al portal multimedia. No se afirma que sus activadores o publicaciones estén actualmente ejecutándose en remoto.",site=None,repo=None,related="automatizacion",accent="blue"),
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
        description="Aplicación portable para realizar inventarios técnicos y documentar visitas presenciales a equipos Windows.",
        problem="Permite reunir información técnica de distintos computadores dentro de una auditoría organizada por empresa y fecha, manteniendo historial y generando informes.",
        platform="Windows 10 / 11 x64", state="Estable · 1.0.0",
        tech=[".NET 10", "WPF", "WMI"],
        features=[
            "Identificación de hardware y características del equipo.",
            "Información de Windows, software y componentes.",
            "Registro de observaciones e intervenciones.",
            "Historial de capturas.",
            "Notas de terreno y fotografías.",
            "Informes HTML individuales y consolidados.",
            "Exportación CSV y JSON.",
        ],
        note="Funciona localmente, es portable y no necesita conexión a Internet para el levantamiento habitual. Los datos quedan en el equipo: no se envían inventarios a servidores de terceros.",
        caution=("Límite", "AuditaPC consulta y documenta. No administra equipos, no realiza mantenimiento remoto ni modifica la configuración del sistema."),
        repo="https://github.com/jmorgadodev/AuditaPC",
        docs=("Guía de uso", "https://github.com/jmorgadodev/AuditaPC/blob/main/docs/GUIA_USO.md"),
        downloads=[("Descargar portable (.zip)", "https://github.com/jmorgadodev/AuditaPC/releases/latest/download/AuditaPC-win-x64-portable.zip")],
        extra_links=[("Releases y checksum", "https://github.com/jmorgadodev/AuditaPC/releases/latest")],
        licenses=[("Código fuente y ejecutable", "MIT"), ("Documentación", "CC BY 4.0")],
    ),
    dict(
        slug="nokto", title="Nokto", icon="gear", tone="clay",
        task="Automatizar una rutina de escritorio",
        sample_title="Nokto · Editor de disparadores y acciones",
        sample_images=("nokto-rutinas-light.webp", "nokto-rutinas-dark.webp"),
        sample_alt="Editor de rutinas de Nokto con un disparador y una lista de acciones",
        summary="Consola de escritorio para telemetría, audio y rutinas de automatización.",
        description="Consola de escritorio para telemetría, audio, operaciones y automatización de rutinas en Windows.",
        problem="Reúne información del equipo, controles cotidianos y acciones automatizadas en una consola local configurable.",
        platform="Windows 10 / 11 x64", state="Versión 2.0.3",
        tech=[".NET 8", "Avalonia", "WASAPI"],
        features=[
            "Telemetría de CPU, memoria, GPU y red.",
            "Control de dispositivos de audio y micrófono.",
            "Reproductor musical y funciones asociadas.",
            "Avisos y notificaciones del sistema.",
            "Temporizadores, alarmas y Pomodoro.",
            "Editor de rutinas mediante bloques y disparadores.",
            "Ejecución concurrente de tareas.",
            "Control desde dispositivos móviles dentro de la red local.",
            "Galería de evidencias de pantalla.",
        ],
        note="Su isla dinámica se personaliza con hasta tres módulos independientes, que se pueden ordenar y ubicar a cada lado del indicador. La automatización funciona localmente; el clima, las letras, el reconocimiento musical y la búsqueda de actualizaciones usan servicios en línea opcionales.",
        repo="https://github.com/jmorgadodev/Nokto",
        docs=("README en español", "https://github.com/jmorgadodev/Nokto/blob/master/README.es.md"),
        downloads=[
            ("Descargar portable (.exe)", "https://github.com/jmorgadodev/Nokto/releases/latest/download/Nokto-Portable-x64.exe"),
            ("Descargar instalador (.exe)", "https://github.com/jmorgadodev/Nokto/releases/latest/download/Nokto-Setup-x64.exe"),
        ],
        extra_links=[("Releases", "https://github.com/jmorgadodev/Nokto/releases/latest")],
        licenses=[("Código fuente", "MIT")],
    ),
    dict(
        slug="datosdemocl", title="DatosDemoCL", icon="data", tone="amber",
        task="Preparar datos para una prueba",
        sample_title="DatosDemoCL · Extracto de un lote sintético",
        summary="Generador local de datos de prueba con convenciones chilenas.",
        description="Generador local de datos sintéticos con convenciones chilenas para probar aplicaciones, formularios, importadores y sistemas de información.",
        problem="Evita tener que inventar registros manualmente o utilizar información real de clientes para realizar pruebas.",
        platform="Windows · Python 3.11+", state="Versión 0.8.0",
        tech=["Python 3.11+", "Tkinter", "Biblioteca estándar", "CSV / JSON"],
        features=[
            "Generación de RUT con dígito verificador coherente.",
            "Nombres y apellidos ficticios.",
            "Regiones y comunas chilenas.",
            "Fechas y montos en pesos chilenos.",
            "Datos de clientes, ventas y comercio de demostración.",
            "Selección de campos y perfiles.",
            "Vista previa de registros.",
            "Generación mediante interfaz gráfica.",
            "Interfaz CLI.",
            "Exportación CSV y JSON.",
            "Semillas reproducibles para repetir los mismos lotes.",
        ],
        note="Funciona localmente, sin conexión, sin cuentas y sin telemetría.",
        caution=("Advertencia", "Un RUT matemáticamente válido no garantiza una identidad ficticia: puede coincidir con el de una persona real. No es una herramienta de anonimización."),
        repo="https://github.com/jmorgadodev/DatosDemoCL",
        docs=("README", "https://github.com/jmorgadodev/DatosDemoCL/blob/main/README.md"),
        downloads=[("Descargar ejecutable (.exe)", "https://github.com/jmorgadodev/DatosDemoCL/raw/main/DatosDemoCL.exe")],
        extra_links=[],
        licenses=[("Código fuente", "MIT")],
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
    "tobys-warehouse": ("hangar354.svg", None),
    "kooke-portal": ("kokeai-mark.png", None),
    "kooke-rrss": ("rrss.svg", "rrss-night.svg"),
}

# Presentación del Archivo de proyectos (/proyectos/).
# Las familias y los textos se derivan de la información verificada de cada
# ficha; no añaden resultados, métricas ni responsabilidades nuevas.
PROJECT_ARCHIVE = {
    "impulsacv": dict(
        families=("software",),
        brief="Currículum, postulaciones y preparación laboral en un solo recorrido.",
        solution="Plataforma web con edición de CV, compatibilidad ATS, análisis, preparación de entrevistas y herramientas de apoyo.",
        accent="#E66A4E",
    ),
    "el-cambiometro": dict(
        families=("datos",),
        brief="De fuentes públicas dispersas a información consultable.",
        solution="Ingesta y ETL, validación, snapshots históricos, API y visualizaciones con trazabilidad.",
        accent="#7F9384",
    ),
    "conecta": dict(
        families=("software",),
        brief="Calendario, borradores, marcas y medios coordinados en un mismo entorno.",
        solution="Plataforma con dashboard, backend Hono, D1, biblioteca de medios y conexiones OAuth y APIs.",
        accent="#E49B59",
    ),
    "ryvolt": dict(
        families=("web",),
        brief="Una presencia corporativa bilingüe con dos enfoques visuales.",
        solution="Frontend responsive y bilingüe con experiencias Corporate/Rebel, componentes interactivos, formularios y prerenderizado SEO.",
        accent="#33BFD0",
    ),
    "flor-de-almendro": dict(
        families=("web",),
        brief="Productos, imágenes y catálogo conectados a la operación diaria.",
        solution="Catálogo con categorías, filtros, stock y contacto por WhatsApp, alimentado desde Google Sheets y Drive.",
        accent="#B78A73",
    ),
    "exo-dream": dict(
        families=("web",),
        brief="Un showroom digital configurable que se adapta a distintos contenidos.",
        solution="Frontend configurable con catálogo, fichas, agenda y formularios, conectado a Google Sheets y Drive.",
        accent="#7D92AA",
    ),
    "tobys-warehouse": dict(
        families=("software",),
        brief="Sesiones, tiempos y resultados compartidos entre operadores y participantes.",
        solution="Sistema Race Control con sesiones, rondas, puntuaciones, sanciones, resultados y vista pública sobre Firebase Realtime Database.",
        accent="#F26236",
    ),
    "kooke-portal": dict(
        families=("web",),
        brief="Colecciones multimedia organizadas en un entorno de consulta.",
        solution="Portal web con catálogo multimedia, automatización de metadatos y servicio de audio independiente.",
        accent="#00C6DE",
    ),
    "kooke-rrss": dict(
        families=("automatizacion", "datos"),
        brief="Planificación, composición y registro de publicaciones.",
        solution="Flujo con Sheets y Apps Script, scripts en Python, apoyo de Gemini y composición programática con Pillow.",
        accent="#E66A4E",
    ),
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

# Mapa de iconos de tecnologia (assets/tech-icons). Representaciones propias.
TECH_ICON = {
    "Google Sheets": "google-sheets.svg",
    "Google Drive": "google-drive.svg",
    "Google Calendar": "google-calendar.svg",
    "Google Apps Script": "google-apps-script.svg",
    "Google Cloud": "google-cloud.svg",
    "BigQuery": "bigquery.svg",
    "Firebase": "firebase.svg",
    "Google Cloud SDK / CLI": "google-cloud-cli.svg",
    "Python": "python.svg",
    "Excel": "excel.svg",
    "Power Query": "power-query.svg",
    "Power BI": "power-bi.svg",
    "Tableau": "tableau.svg",
    "Looker Studio": "looker-studio.svg",
    "React": "react.svg",
    "Vite": "vite.svg",
    "TypeScript": "typescript.svg",
    "Hono": "hono.svg",
    "Cloudflare Workers": "cloudflare-workers.svg",
    "Cloudflare D1": "cloudflare-d1.svg",
    "APIs REST": "apis-rest.svg",
    "OAuth": "oauth.svg",
    "Gemini API": "gemini.svg",
    "Google AI Studio": "google-ai-studio.svg",
    "NotebookLM": "notebooklm.svg",
    "Nano Banana": "nano-banana.svg",
    "Google Flow": "google-flow.svg",
    "Google Flow Music": "google-flow-music.svg",
    "Pillow": "pillow.svg",
    "CapCut": "capcut.svg",
    "n8n": "n8n.svg",
    "Make": "make.svg",
    "Apps Script": "google-apps-script.svg",
    "APIs": "apis-rest.svg",
    "Ollama": "ollama.svg",
    "LM Studio": "lm-studio.svg",
    "Gemma": "gemma.svg",
    "Qwen": "qwen.svg",
    "DeepSeek": "deepseek.svg",
    "Windows": "windows.svg",
    "Herramientas locales": "herramientas-locales.svg",
    "Informes HTML": "informes-html.svg",
    "Inventario técnico": "inventario-tecnico.svg",
    "Pasarelas de pago": "pasarelas-pago.svg",
    "CRM": "crm.svg",
    "Servicios de comunicación": "servicios-de-comunicacion.svg",
    "Calendario editorial": "calendario-editorial.svg",
    "Programación de publicaciones": "programacion-publicaciones.svg",
    "Métricas por plataforma": "metricas-plataforma.svg",
    "Hojas de calendario": "hojas-calendario.svg",
    "Claude Code": "claude-code.svg",
    "OpenCode": "opencode.svg",
    "Antigravity": "antigravity.svg",
    "Codex": "codex.svg",
    "Traycer": "tracer.svg",
    "MiniMax": "minimax.svg",
}

# Ecosistemas tecnologicos del indice. Se muestran con icono, no como lista de palabras.
TECNOLOGIAS = [
    ("Google Workspace y Cloud", ["Google Sheets", "Google Drive", "Google Calendar", "Google Apps Script",
                                  "Google Cloud", "BigQuery", "Firebase", "Google Cloud SDK / CLI"]),
    ("Datos y Business Intelligence", ["Python", "Excel", "Power Query", "Power BI", "Tableau", "Looker Studio"]),
    ("Desarrollo e integraciones", ["React", "Vite", "TypeScript", "Hono", "Cloudflare Workers",
                                    "Cloudflare D1", "APIs REST", "OAuth"]),
    ("Inteligencia artificial y contenido", ["Gemini API", "Google AI Studio", "NotebookLM", "Nano Banana",
                                             "Google Flow", "Google Flow Music", "Pillow", "CapCut"]),
    ("Agentes y entornos de desarrollo", ["Claude Code", "OpenCode", "Antigravity", "Codex", "Traycer"]),
    ("Modelos y ejecución local", ["Qwen", "DeepSeek", "MiniMax", "Gemma", "Ollama", "LM Studio"]),
    ("Automatización", ["n8n", "Make", "Python", "Apps Script"]),
]

SERVICES=[
 dict(
  slug="automatizacion", title="Automatización de procesos",
  short="Convierto tareas que se repiten en procesos que corren solos: datos, avisos, reservas y atención.",
  eyebrow="Soluciones a medida",
  seo_title="Automatización de procesos y tareas repetitivas",
  meta_description="Automatizo tareas que se repiten: validación de datos, flujos entre planillas y correo, reservas y atención con bots. Python, n8n, Make y Apps Script.",
  descripcion="Cuando la misma tarea pasa por planillas, correos y aplicaciones, el tiempo se va en copiar, pegar y revisar. Automatizo ese tramo para que el proceso siga solo y tú controles cuándo, con qué y con quién.",
  situacion="Copiar registros, validar datos, transferir información y preparar reportes de forma repetitiva consume horas y multiplica el riesgo de error. Cuando además hay que atender consultas, gestionar reservas o administrar membresías, el cuello de botella aparece en el mismo lugar: alguien haciendo de puente entre sistemas.",
  enfoque="Primero entiendo el proceso, su frecuencia, quién lo ejecuta y qué excepciones aparecen. Después evalúo, según el costo de mantenimiento y las condiciones del cliente, desde Power Query y Apps Script hasta n8n, Make, Python o un bot propio. Si un paso necesita que una persona resuelva algo, el flujo lo deriva; si no, lo resuelve solo.",
  aside="Un proceso que se ejecuta solo, con reglas claras, avisos cuando corresponde y documentación de cómo operarlo.",
  entregables=[
    ("Automatización de tareas repetitivas", "Procesos entre planillas, correo y herramientas que hoy se hacen a mano."),
    ("Bots de consultas y atención comercial", "Respuestas frecuentes, derivación a una persona y registro de cada conversación."),
    ("Asistentes automatizados", "Asistentes que guiding consultas y dejan prepared el siguiente paso."),
    ("Sistemas de reservas", "Disponibilidad, confirmación y aviso, con registro de cada operación."),
    ("Automatización de membresías", "Altas, renovaciones y bajas controladas desde un solo lugar."),
    ("Confirmación de pagos y gestión de accesos", "Verificación del pago y activación o revocación del acceso correspondiente."),
    ("Notificaciones y recordatorios", "Avisos en el canal que corresponde, con seguimiento de lo que quedó pendiente."),
    ("Flujos de trabajo entre plataformas", "Cuando el dato tiene que pasar de un sistema a otro sin intervención."),
    ("Procesamiento y validación de información", "Control de errores y excepciones antes de que lleguen al destino."),
    ("Documentación de operación", "Cómo funciona el proceso y qué hacer cuando algo se detiene."),
  ],
  stack=["Python", "n8n", "Make", "Google Apps Script", "Excel", "Power Query", "APIs REST"],
  nota="La selección final depende del problema; no todas las herramientas se usan en todos los encargos.",
  proyectos=[
    ("Sistema de automatización comercial y membresías", None, "Atención comercial por bots, reservas, membresías, confirmación de pagos y control de accesos a material en la nube. Trabajo con un cliente, bajo confidencialidad: ni la marca, ni los datos del negocio, ni la información de sus usuarios se hacen públicos."),
    ("RRSS", "/proyectos/kooke-rrss/", "Coordinación de calendario, historial, generación asistida y composición programática de contenidos con Sheets, Apps Script y Python."),
    ("ListoPorHoy", "/proyectos/conecta/", "Plataforma con calendario, borradores, marcas, medios y conexiones por API desde un mismo entorno."),
  ],
  herramientas=[
    ("Nokto", "/herramientas/#nokto", "Consola de escritorio con automatización de rutinas por bloques y disparadores, ejecutadas en local."),
  ],
  cta_h2="¿Cuánto tiempo se te va en tareas que se repiten?",
  cta_p="Cuéntame qué se repite hoy y en qué parte se atasca. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.",
  cta_label="Revisar mi proceso",
 ),
 dict(
  slug="desarrollo-web", title="Desarrollo web y plataformas",
  short="Sitios, catálogos, paneles y plataformas con usuarios y lógica propia, diseñados para la operación que sostienen.",
  eyebrow="Soluciones a medida",
  seo_title="Desarrollo web y plataformas a medida",
  meta_description="Sitios, catálogos, paneles y plataformas con usuarios y lógica propia. La arquitectura se decide por el problema, no por la tecnología de moda.",
  descripcion="Construyo sitios, catálogos, paneles y plataformas según la operación que tienen que sostener: no todos los problemas necesitan una aplicación completa, y la arquitectura se decide antes de elegir la tecnología.",
  situacion="Una presencia digital no resuelve por sí sola un proceso. A veces hace falta conectar datos, crear permisos o integrar una operación que hoy se realiza a mano, y aun así un catálogo o un sitio bien hecho se queda corto.",
  enfoque="Defino objetivos, usuarios y flujos antes de elegir el stack. Arquitectura, frontend, backend, datos e interacción se justifican por lo que la solución debe hacer, no por la moda del momento. Si un sitio administrable cumple el objetivo, no construyo una plataforma que nadie va a mantener.",
  aside="Un sistema web que se sostiene en el tiempo, con lo que el negocio necesita operar y nada más.",
  entregables=[
    ("Sitios corporativos y comerciales", "Presencia clara de la marca, con contenidos que se pueden mantener sin depender del desarrollo."),
    ("Catálogos administrables", "Productos, categorías, stock y consultas conectados a la fuente de información que ya usas."),
    ("Aplicaciones web", "Herramientas internas con formularios, flujos y estados propios del proceso."),
    ("Paneles de administración", "Control y seguimiento de la operación para quien la ejecuta, no sólo para quien la desarrolla."),
    ("Plataformas con usuarios y permisos", "Cuentas, roles y suscripciones cuando el caso lo exige."),
    ("Sistemas conectados a datos y servicios", "Cuando la aplicación necesita hablar con una base de datos o un servicio externo."),
  ],
  stack=["React", "Vite", "TypeScript", "Hono", "Cloudflare Workers", "Cloudflare D1", "Firebase"],
  nota="La selección final depende del problema; no todas las herramientas se usan en todos los encargos.",
  proyectos=[
    ("ImpulsaCV", "/proyectos/impulsacv/", "Producto digital con cuentas, membresías y pagos, módulos de análisis de CV y entrevista."),
    ("Ryvolt", "/proyectos/ryvolt/", "Sitio corporativo bilingüe, responsive, con dos registros visuales y base técnica preparada para buscadores."),
    ("Hangar354", "/proyectos/tobys-warehouse/", "Sistema de operación en tiempo real con sesiones, tiempos, resultados y vista pública."),
  ],
  herramientas=[],
  cta_h2="¿Tienes un proceso que necesita su propio sistema?",
  cta_p="Cuéntame cómo trabajas hoy y qué te falta. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.",
  cta_label="Plantear mi plataforma",
 ),
 dict(
  slug="datos-y-bi", title="Datos, planillas y BI",
  short="Convierto datos dispersos en indicadores que se pueden mirar, comparar y usar para decidir.",
  eyebrow="Soluciones a medida",
  seo_title="Datos, planillas y BI: reportes y dashboards",
  meta_description="Consolido y limpio datos dispersos, automatizo informes y construyo dashboards con Power BI, Tableau, Excel, Python, BigQuery y Looker Studio.",
  descripcion="Ordeno flujos de datos, depuro y combino fuentes y preparo los reportes que permiten decidir sin reconstruir nada a mano. El objetivo es que el dato llegue a tiempo y en un formato que se pueda leer.",
  situacion="Varias versiones de una misma planilla, columnas que no coinciden entre archivos o reportes montados a mano dificultan el seguimiento de cualquier operación. Cuando nadie tiene un número fiable, cada decisión se toma con la información que hay, no con la que debería haber.",
  enfoque="Reviso qué datos existen, cómo se relacionan y qué decisiones deben respaldar. Utilizo la tecnología más proporcional al problema: Excel y Power Query para lo cercano, Python y BigQuery para lo que pide escala, Power BI o Tableau para lo que debe observarse y Looker Studio cuando el acceso tiene que ser sencillo y compartido. Cada reporte se diseña alrededor de las preguntas que el negocio necesita responder.",
  aside="Datos consolidados y un tablero que se mira, no un excel más grande que nadie abre.",
  entregables=[
    ("Consolidación y limpieza de archivos", "Unir versiones, normalizar columnas y dejar una fuente que se pueda mantener."),
    ("Transformaciones y procesos ETL", "Extracción, normalización y carga de datos desde múltiples orígenes."),
    ("Modelos de datos", "Estructuras que respondan preguntas y no sólo lo que refleja cómo está guardado cada cosa."),
    ("Dashboards e informes personalizados", "Indicadores de gestión diseñados según las preguntas de cada negocio."),
    ("Automatización de reportes", "Reportes que se actualizan solos y se distribuyen sin que nadie los monte a mano."),
    ("Procesamiento de múltiples fuentes", "Cuando la información está repartida entre sistemas distintos."),
    ("Indicadores de gestión y análisis", "Medir lo que importa, con histórico para comparar y no sólo con la foto del momento."),
  ],
  stack=["Excel", "Power Query", "Python", "Power BI", "Tableau", "BigQuery", "Looker Studio", "Google Cloud"],
  nota="Power BI y Tableau son herramientas de trabajo habitual en esta línea. Cada reporte, modelo o tablero se construye sobre las preguntas del negocio y sobre sus propios datos.",
  proyectos=[
    ("El Cambiómetro", "/proyectos/el-cambiometro/", "Ingesta y validación de fuentes públicas, instantáneos históricos, consultas, API y visualización con trazabilidad."),
    ("Flor de Almendro", "/proyectos/flor-de-almendro/", "Catálogo alimentado por Sheets como fuente de información y Drive para medios."),
  ],
  herramientas=[
    ("AuditaPC", "/herramientas/#auditapc", "Herramienta propia que recoge el inventario técnico de un equipo y exporta HTML, CSV y JSON."),
    ("DatosDemoCL", "/herramientas/#datosdemocl", "Generador de datos sintéticos para probar formularios, importadores y sistemas sin usar datos reales."),
  ],
  cta_h2="¿Cómo decides hoy con tus datos?",
  cta_p="Cuéntame qué información necesitas para decidir y de dónde viene. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.",
  cta_label="Ordenar mis datos",
 ),
 dict(
  slug="integraciones", title="Integraciones y APIs",
  short="Hago que tus sistemas se comuniquen y dejen de depender de copiar y pegar a mano.",
  eyebrow="Soluciones a medida",
  seo_title="Integraciones y APIs entre sistemas",
  meta_description="Conecto planillas, calendarios, CRM y pasarelas de pago con APIs, OAuth y automatización, para eliminar el copiar y pegar manual.",
  descripcion="El objetivo no siempre es crear una aplicación nueva. A veces basta con que la planilla, el calendario, el CRM y el servicio externo intercambien información correctamente, y con eso la operación deja de depender de alguien copiando datos de un lado a otro.",
  situacion="Cuando la información queda aislada en distintas herramientas, alguien termina haciendo de puente manual entre sistemas: copia un dato de un lado, lo pega en otro y reza para que no se desincronice. El costo no es el copiado, es la demora y el error.",
  enfoque="Defino responsabilidades de cada sistema, permisos, formato de datos, frecuencia de actualización y respuesta ante fallos. Elijo entre integración directa, Apps Script, un servicio intermedio o automatización visual según lo que exista en cada caso, y dejo claro quién es el dueño de cada dato. Cada conexión se abre con credenciales propias y el mínimo alcance necesario, y los webhooks se validan por firma antes de aceptarse. Cuando la integración toca Meta o TikTok, se trabaja con sus APIs oficiales y los permisos autorizados, no con agentes que operen las cuentas por métodos no oficiales ni con simulaciones de navegación.",
  aside="Sistemas que se hablan entre sí con reglas claras, no con copias manuales.",
  entregables=[
    ("Conexiones entre APIs y servicios", "Integraciones directas donde la plataforma lo permite y el caso lo justifica."),
    ("Integraciones con Google Workspace", "Sheets, Drive, Calendar y Apps Script cuando el negocio ya trabaja con ahí."),
    ("Plataformas de pago", "Confirmación y registro de operaciones para dejar de seguir el estado a mano."),
    ("Servicios de comunicación", "Avisos, consultas y respuestas por el canal que ya usan tus clientes o tu equipo."),
    ("Sincronización entre sistemas", "Mantener una única fuente de verdad cuando hay varias copias del mismo dato."),
    ("Flujos con controles de error", "Reintentos, avisos y registro de lo que falló, para que nada se pierda en silencio."),
    ("Almacenamiento y consulta", "Datos ordenados y disponibles donde el negocio los necesita, sin cambiar su operación."),
  ],
  stack=["Google Sheets", "Google Drive", "Google Calendar", "Google Apps Script", "Firebase", "Google Cloud",
         "BigQuery", "APIs REST", "OAuth", "Pasarelas de pago", "Servicios de comunicación", "CRM", "Cloudflare Workers"],
  nota="Las integraciones conectan herramientas que el cliente ya utiliza; no obligan a reemplazar toda la operación.",
  proyectos=[
    ("ListoPorHoy", "/proyectos/conecta/", "Backend, base de datos y conexiones por OAuth con servicios sociales, con permisos por rol."),
    ("kokeAI", "/proyectos/kooke-portal/", "Automatizaciones de metadatos con Apps Script y Drive, portal en Firebase y un Worker independiente para servir audio."),
    ("Flor de Almendro", "/proyectos/flor-de-almendro/", "Catálogo y medios conectados a Sheets y Drive, con contacto por WhatsApp."),
  ],
  herramientas=[],
  cta_h2="¿Qué sistemas tienes que unir a mano?",
  cta_p="Cuéntame qué se copia hoy y entre quiénes. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.",
  cta_label="Conectar mis sistemas",
 ),
 dict(
  slug="ia-aplicada", title="IA aplicada con criterio",
  short="Uso modelos de IA donde aportan valor real, con revisión humana y sin prometer más de lo que hacen.",
  eyebrow="Soluciones a medida",
  seo_title="IA aplicada: agentes, modelos y control de costos",
  meta_description="Orquesto agentes y modelos según la tarea, elijo entre ejecución local y API, y administro tokens y costos sin perder la revisión humana.",
  descripcion="Trabajo con modelos locales y servicios externos según privacidad, precisión, costo y rendimiento. La IA entra donde aporta valor y queda dentro de un proceso verificable, con revisión humana y sin prometer más de lo que un modelo puede hacer.",
  situacion="Clasificar texto, extraer información, analizar documentos o preparar contenido puede requerir modelos; otros problemas funcionan mejor con reglas simples. La pregunta correcta no es «¿puedo usar IA?», sino «¿qué parte de esta tarea se resuelve mejor con un modelo y cuál con una regla?».",
  enfoque="Evalúo dónde se ejecutan los datos, qué grado de revisión necesita la salida y qué ocurre cuando el modelo se equivoca. No prometo ejecución local en flujos que dependen de servicios externos, y no presento como inteligencia artificial una automatización tradicional que ya funcionaba. También se decide con criterio qué datos salen del entorno: lo que no necesita salir se resuelve en local. Cuando la tarea lo pide, construyo la aplicación propia que la sostiene.",
  aside="IA dentro de un proceso que se puede revisar, medir y corregir, no una demo suelta.",
  entregables=[
    ("Integración de modelos mediante API", "Elección del modelo según el lugar donde deben ejecutarse los datos."),
    ("Procesamiento de documentos", "Lectura y extracción estructurada de PDF, planillas y textos largos."),
    ("Clasificación y extracción de información", "Etiquetado y rescate de datos de mensajes, archivos o formularios."),
    ("Generación asistida de contenido", "Borradores, resúmenes o propuestas que una persona revisa antes de publicarse."),
    ("Producción de guiones", "Guiones para video y piezas学生的 con apoyo de modelos, revisados antes de grabarse."),
    ("Generación de imágenes y recursos audiovisuales", "Material visual y sonoro cuando el proyecto lo necesita."),
    ("Aplicaciones propias conectadas a modelos", "Herramientas desarrolladas para una necesidad concreta, no integraciones genéricas."),
    ("Orquestación de agentes y herramientas", "Cuando el trabajo requiere encadenar modelos, búsquedas y pasos con criterios."),
    ("Voz y subtítulos con aplicaciones auxiliares", "Aplicación propia para generar la locución y el subtítulo con la voz que cada proyecto necesita."),
    ("Validación y supervisión de resultados", "Reglas de calidad, métricas de coincidencia y trazabilidad de lo que el modelo decidió."),
  ],
  stack=["Claude Code", "OpenCode", "Antigravity", "Codex", "Traycer", "Gemini API", "Google AI Studio",
         "NotebookLM", "Nano Banana", "Google Flow", "Google Flow Music", "Qwen", "DeepSeek", "MiniMax",
         "Gemma", "Ollama", "LM Studio", "Python"],
  nota="Una automatización tradicional no se presenta como inteligencia artificial cuando no lo es.",
  proyectos=[
    ("ImpulsaCV", "/proyectos/impulsacv/", "Producto con componentes de IA integrados junto a motores deterministas y servicios remotos."),
    ("RRSS", "/proyectos/kooke-rrss/", "Generación asistida de texto con Gemini y composición programática de la pieza gráfica."),
  ],
  herramientas=[],
  cta_h2="¿Dónde te serviría la IA de verdad?",
  cta_p="Cuéntame qué tarea te cuesta y qué parte te molesta. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.",
  cta_label="Revisar un caso con IA",
 ),
 dict(
  slug="soporte-ti", title="Soporte técnico",
  short="Diagnóstico y puesta en marcha de equipos y software, en el lugar o a distancia, con hallazgos documentados.",
  eyebrow="Soluciones a medida",
  seo_title="Soporte técnico de equipos y software",
  meta_description="Diagnóstico, instalación, configuración, formateo y reinstalación de equipos y software, en el lugar o a distancia, con levantamientos e informes técnicos.",
  descripcion="Diagnóstico y puesta en marcha de equipos y software, en el lugar o a distancia. Atiendo lo que está fallando, documento lo que encontré y dejo el equipo funcionando y explicado, no resuelto a medias.",
  situacion="Un equipo, una instalación o una configuración problemática puede detener una tarea entera. Lo que suele faltar no es la acción, sino saber qué está pasando antes de cambiar nada y dejar registro de lo que se hizo.",
  enfoque="Reviso la necesidad, acuerdo el alcance y el acceso, realizo el levantamiento técnico necesario, documento los hallazgos y explico los siguientes pasos. Trabajo presencialmente o de forma remota según lo que permita el caso, y dejo cada equipo en un estado conocido y reproducible.",
  aside="Equipos y software que vuelven a funcionar, con lo encontrado y lo hecho anotado.",
  entregables=[
    ("Atención presencial y remota", "Visitas al lugar o soporte por conexión, según lo que requiera el caso."),
    ("Diagnóstico de equipos", "Identificación de hardware, sistema, software y estado real del equipo."),
    ("Instalación y configuración de software", "Programas, licencias y ajustes de configuración para el uso previsto."),
    ("Formateo y reinstalación de sistemas", "Reinstalación del sistema operativo con respaldo previo de la información del equipo."),
    ("Carga y restauración de imágenes de sistema", "Implantación de la imagen corporativa o restauración de un equipo."),
    ("Instalación de controladores", "Drivers de impresoras, tarjetas y periféricos para que el equipo los reconozca."),
    ("Configuración de equipos y periféricos", "Red, impresoras, pantalla, actualizaciones y todo lo que hace falta para operar."),
    ("Resolución de incidencias", "Diagnóstico y resolución de fallas de software, red o arranque."),
    ("Levantamientos e informes técnicos", "Inventario, fotografías, notas de terreno e informe comprensible para quien recibe el equipo."),
  ],
  stack=["Windows", "Herramientas locales", "Informes HTML", "Inventario técnico"],
  nota="El alcance cubre configuración y puesta en marcha; no incluye reparación de hardware ni recuperación de información.",
  proyectos=[],
  herramientas=[
    ("AuditaPC", "/herramientas/#auditapc", "Herramienta propia para inventarios técnicos, con informes HTML individuales y consolidados, exportación CSV y JSON y funcionamiento portable sin conexión."),
    ("Nokto", "/herramientas/#nokto", "Consola de escritorio para telemetría del equipo y control de audio, con rutinas de mantenimiento configurables."),
  ],
  cta_h2="¿Un equipo que no está funcionando como debería?",
  cta_p="Cuéntame qué pasa y qué necesitas del equipo. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.",
  cta_label="Revisar mi equipo",
 ),
 dict(
  slug="redes-sociales", title="Gestión de redes sociales",
  short="Planifico, preparo y publico contenido con un calendario que puedes sostener.",
  eyebrow="Servicio editorial",
  seo_title="Gestión de redes sociales y contenido",
  meta_description="Planifico calendarios editoriales, preparo textos y piezas, organizo perfiles y coordino publicación y revisión. Sin automatizar la atención comercial.",
  descripcion="Organizo contigo el trabajo de contenido: las ideas, el calendario, la preparación de las publicaciones y la revisión de lo que funcionó. Un perfil ordenado se sostiene; uno improvisado se abandona.",
  situacion="Publicar de forma irregular y a la carrera produce un perfil que no dice nada y una carga de trabajo que se termina abandonando. El problema no suele ser la falta de ideas, sino la falta de un proceso que se pueda sostener con el tiempo disponible.",
  enfoque="Partimos por tus perfiles, el público al que quieres llegar y los recursos que ya tienes. Acordamos qué puedo asumir y qué necesita tu aprobación, y de ahí sale un calendario que se puede mantener en lugar de uno que se abandona a la segunda semana.",
  aside="Contenido planificado y publicado con un proceso que se sostiene en el tiempo.",
  entregables=[
    ("Generación de publicaciones desde información existente", "El trabajo parte de los datos que la marca ya tiene: un alta de catálogo, un ficha de producto o la actividad de la semana se convierten en contenido."),
    ("Generación y composición de contenido", "Los textos se generan con IA y las piezas se componen por programación, con apoyo visual de IA cuando hace falta."),
    ("Calendario editorial", "El usuario decide fecha, hora, tipo de publicación, perfil o marca, y si aprueba antes de publicar o deja que el flujo continúe."),
    ("Publicación e integraciones", "Las conexiones con las plataformas sociales se hacen mediante sus APIs oficiales y los permisos autorizados."),
    ("Registro y seguimiento", "La versión desarrollada registra la programación y el horario de cada publicación."),
    ("Revisión de resultados", "Lectura de lo que cada plataforma entrega y ajuste de las próximas publicaciones."),
    ("Producción audiovisual", "Guiones asistidos por IA, generación audiovisual, edición y una aplicación auxiliar para voz y subtítulos."),
  ],
  stack=["Gemini API", "Google AI Studio", "Pillow", "Nano Banana", "Google Flow", "Google Flow Music",
         "CapCut", "Python", "Google Sheets", "Google Apps Script", "Google Drive"],
  nota="La línea es editorial: calendario, producción de piezas, publicación y revisión de resultados.",
  proyectos=[
    ("RRSS", "/proyectos/kooke-rrss/", "Coordinación de calendario e historial de publicaciones, con generación asistida y composición programática de las piezas."),
    ("ListoPorHoy", "/proyectos/conecta/", "Calendario, borradores, marcas y medios coordinados desde un mismo entorno, con conexiones por API."),
  ],
  herramientas=[],
  cta_h2="¿Tu contenido depende de que alguien tenga tiempo?",
  cta_p="Cuéntame qué publicas hoy y con qué frecuencia puedes sostenerlo. La primera conversación es gratuita; una auditoría o intervención técnica se acuerda por separado.",
  cta_label="Planificar mi contenido",
 ),
]



# ---------------------------------------------------------------------------
# FASE 2 — Representaciones visuales propias de cada servicio.
# Cada servicio explica con una composición distinta cómo se trabaja en su línea.
# ---------------------------------------------------------------------------
SERVICE_VISUALS = {
    "automatizacion": {
        "tipo": "flujo",
        "titulo": "De una tarea manual a un proceso que se ejecuta solo",
        "desc": "Cada paso tiene su regla, su comprobación y su aviso. Cuando algo se detiene, se sabe en qué paso y por qué.",
        "pasos": [
            ("01", "Disparador", "Una tarea, una fecha o un evento externo."),
            ("02", "Procesamiento", "La regla se aplica y se reúne la información."),
            ("03", "Validación", "Se comprueban los datos antes de continuar."),
            ("04", "Acción", "Se escribe, se publica o se notifica."),
            ("05", "Notificación", "El resultado llega a quien lo espera."),
        ],
    },
    "desarrollo-web": {
        "tipo": "capas",
        "titulo": "Las capas de una solución",
        "desc": "La seguridad no se agrega al final: se diseña desde la interfaz y condiciona las capas siguientes.",
        "pasos": [
            ("Interfaz", "Lo que usa la persona y lo que puede pedir."),
            ("Aplicación", "Reglas, sesión y flujo de trabajo."),
            ("Datos", "La información y el modelo que la sostiene."),
            ("Servicios externos", "Pagos, correo, plataformas y storage."),
            ("Seguridad", "Permisos, límites, validación y trazabilidad."),
        ],
    },
    "datos-y-bi": {
        "tipo": "cadena",
        "titulo": "De archivos dispersos a un tablero que se mira",
        "desc": "El reporte se diseña alrededor de la pregunta que necesita responder el negocio, no alrededor de las columnas que hay en la planilla.",
        "pasos": [
            ("Fuentes", "Planillas, sistemas y exportaciones."),
            ("Limpieza", "Unificar versiones y alinear columnas."),
            ("Transformación", "ETL y reglas de negocio."),
            ("Modelo", "Estructuras que respondan preguntas."),
            ("Dashboard", "Indicadores e informes personalizados."),
        ],
    },
    "integraciones": {
        "tipo": "hub",
        "titulo": "Conectar sin reemplazar",
        "desc": "Las herramientas que ya usas siguen en su lugar. Lo que cambia es que ahora se hablan, con autenticación, permisos y trazabilidad.",
        "centro": ("API y webhooks", "Autenticación, reintentos y registro"),
        "ramas": [
            ("Planillas", "Datos de trabajo"),
            ("Calendario", "Agenda y reservas"),
            ("CRM", "Clientes y seguimiento"),
            ("Pagos", "Cobro y confirmación"),
            ("Comunicación", "Avisos y respuestas"),
            ("Almacenamiento", "Archivos y medios"),
        ],
    },
    "soporte-ti": {
        "tipo": "ciclo",
        "titulo": "Un proceso con resultado comprobable",
        "desc": "El equipo queda funcionando y explicado, no resuelto a medias. La intervención se puede hacer en el lugar o a distancia.",
        "pasos": [
            ("01", "Diagnóstico", "Qué falla, qué lo causa y qué se puede descartar."),
            ("02", "Intervención", "Cambios concretos, acotados y acordados."),
            ("03", "Verificación", "Comprobación de que el equipo funciona."),
            ("04", "Documentación", "Qué se hizo y cómo se mantiene."),
        ],
        "modalidades": ["Presencial", "Remoto"],
    },
    "redes-sociales": {
        "tipo": "dos-vias",
        "titulo": "Del dato del negocio al contenido publicable",
        "desc": "El calendario es el eje: la información entra por un lado, la publicación sale por otro, y la aprobación decide en qué punto se detiene.",
        "vias": [
            ("Publicaciones", [
                ("Información", "Lo que la marca ya tiene."),
                ("Generación", "Texto completo a partir del dato."),
                ("Composición", "Pieza gráfica construida por código."),
                ("Aprobación", "Revisión humana o flujo automático."),
                ("Calendario", "Fecha, hora, formato y perfil."),
                ("Publicación", "Distribución por API oficial."),
            ]),
            ("Audiovisual", [
                ("Guion", "Preparado con asistencia de IA."),
                ("Generación", "Material audiovisual."),
                ("Edición", "Montaje y ajuste con la herramienta de edición."),
                ("Voz y subtítulos", "Aplicación auxiliar conectada al modelo."),
            ]),
        ],
    },
}

# Apartados propios que se intercalan entre "Qué entrego" y "Qué experiencia respalda".
SERVICE_EXTRAS = {
    "ia-aplicada": [
        {
            "overline": "Orquestación de agentes y modelos",
            "titulo": "Cada tarea, con la herramienta que le corresponde.",
            "cuerpo": "Trabajo con distintos entornos y agentes de desarrollo, y con familias de modelos que se ejecutan en local o se consumen mediante API. El objetivo no es usar más agentes, sino asignar bien: uno planifica, otro implementa y otro revisa, cuando el proyecto lo justifica. También hay tareas que un modelo potente resuelve mal y una regla bien escrita resuelve perfecto.",
            "puntos": [
                "Planificación y análisis del problema antes de escribir una línea.",
                "Desarrollo e implementación con el entorno más adecuado para la tarea.",
                "Revisión de código y comprobación de que lo entregado funciona.",
                "Pruebas y corrección sobre lo que falló, no sobre lo que se supone.",
                "Documentación del resultado y de las decisiones tomadas.",
                "Procesamiento de información y tareas específicas resueltas en local.",
            ],
            "visual": {
                "tipo": "orquestacion",
                "pasos": [
                    ("Tarea", "Qué hay que resolver."),
                    ("Selección", "Agente, modelo o herramienta."),
                    ("Ejecución", "Planificación, código o análisis."),
                    ("Revisión", "Comprobación y corrección."),
                    ("Resultado", "Entregable verificado."),
                ],
                "capa": ["Costos y tokens", "Privacidad de los datos", "Supervisión humana"],
            },
        },
        {
            "overline": "Gestión inteligente de tokens y costos",
            "titulo": "Administrar el consumo de IA es parte del desarrollo.",
            "cuerpo": "No todas las tareas necesitan el modelo más potente ni todas requieren consumir tokens mediante una API. Seleccionar correctamente las herramientas permite acelerar el desarrollo y mantener los costos bajo control, siempre respetando las políticas, las cuotas y las condiciones de uso de cada proveedor.",
            "puntos": [
                "Selección del modelo según la complejidad y la naturaleza de la tarea.",
                "Administración de tokens y de la ventana de contexto disponible.",
                "Optimización de instrucciones y reutilización del contexto ya elaborado.",
                "Elección entre consumo por API y uso de las suscripciones disponibles.",
                "Aprovechamiento responsable de las suscripciones y de los límites de cada plan.",
                "Modelos locales para las tareas específicas donde conviene.",
                "Control de cuotas y seguimiento del consumo para evitar facturas inesperadas.",
                "Derivación a un modelo alternativo cuando la tarea no necesita el más costoso.",
            ],
            "visual": {
                "tipo": "escalera",
                "niveles": [
                    ("Tarea simple", "Regla o modelo local", "Sin consumo de tokens"),
                    ("Tarea intermedia", "Modelo por API o suscripción", "Costo acotado y previsible"),
                    ("Tarea compleja", "Modelo potente con revisión", "Se reserva para lo que lo requiere"),
                ],
            },
        },
    ],
    "desarrollo-web": [
        {
            "overline": "Seguridad desde el diseño",
            "titulo": "La protección se diseña con la solución, no se agrega después.",
            "cuerpo": "Cada proyecto se construye considerando la protección de sus datos, sus accesos y sus conexiones. La matriz de controles se revisa proyecto por proyecto, porque no todos usan la misma arquitectura ni necesitan el mismo nivel. Lo que se publica aquí son medidas verificadas en los trabajos entregados.",
            "medidas": [
                ("Transporte y cabeceras", "HTTPS y HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy y Permissions-Policy donde la arquitectura lo requiere."),
                ("Credenciales y secretos", "Claves y tokens desde variables de entorno o gestor de secretos, nunca escritos en el código."),
                ("Acceso y permisos", "Contraseñas derivadas con PBKDF2, sesiones firmadas y roles por proyecto o por cliente."),
                ("Datos y consultas", "Consultas parametrizadas, cifrado en reposo de tokens sensibles y validación de la entrada."),
                ("Integraciones y webhooks", "Firmas verificadas, handshake, CORS con lista blanca de orígenes y permisos mínimos por servicio."),
                ("Operación y límites", "Cuotas, control de tamaño de las solicitudes, registro de errores y copias de seguridad cuando la arquitectura las necesita."),
            ],
        },
    ],
}

# Cierre del indice: primer contacto.
SERVICE_CONTACT = {
    "eyebrow": "Primer contacto · Sin costo",
    "titulo": "Primero entendemos el problema. Después definimos la solución.",
    "descripcion": "Cuéntame qué necesitas resolver, cómo funciona actualmente tu operación y qué resultado buscas. Revisamos el contexto y definimos si tiene sentido avanzar. La primera conversación no tiene costo. Las auditorías e intervenciones técnicas se acuerdan por separado.",
    "pasos": [
        ("01", "Cuéntame el contexto"),
        ("02", "Revisamos el alcance"),
        ("03", "Definimos el siguiente paso"),
    ],
    "cta": ("Conversar sobre mi proyecto", "contacto/"),
    "secundario": ("Conocer el método", "metodo/"),
}

# ---------------------------------------------------------------------------
# FICHAS — Sistema reutilizable de fichas de proyectos (ver assets/ficha.css)
# Cada entrada describe la ficha: identidad, módulos y contenido.
# Incrementar sólo cuando se apruebe publicar una nueva ficha.
# ---------------------------------------------------------------------------
_P = {p["slug"]: p for p in PROJECTS}
FICHAS = {
    "impulsacv": {
        "slug": "impulsacv",
        "eyebrow": "Producto digital · HR Tech",
        "tags": ["Producto digital", "Infraestructura", "IA aplicada"],
        "topline": [("", "Archivo"), ("", "Software y plataformas"), (None, "ImpulsaCV")],
        "title": "ImpulsaCV", "title_accent": ".",
        "page_class": "project-impulsacv-page",
        "page_title": "ImpulsaCV — ficha técnica y arquitectura",
        "description": "Una plataforma que reúne currículum, compatibilidad ATS, postulaciones, entrevistas y herramientas de apoyo en un mismo recorrido.",
        "summary": _P["impulsacv"]["summary"],
        "site": _P["impulsacv"]["site"],
        "sections": [
            {"type": "hero"},
            {
                "type": "desafio",
                "eyebrow": "El desafío",
                "h2": "Preparar una postulación no debería ser un trabajo fragmentado<span class='fx-coral'>.</span>",
                "intro": _P["impulsacv"]["problem"],
                "modifier": "fx-section--alt",
            },
            {
                "type": "perspectivas",
                "eyebrow": "Así funciona ImpulsaCV",
                "h2": "Una plataforma.<br>Dos perspectivas interactivas<span class='ic-coral'>.</span>",
                "intro": (
                    "Explora cómo funciona el producto y cómo está construida su arquitectura técnica. "
                    "Selecciona cada componente para ver su función; usa zoom, desplazamiento y el "
                    "control de animación para recorrer el diagrama. El tema acompaña el del sitio."
                ),
                "title": "ImpulsaCV",
                "iframe_title": "Diagrama interactivo de ImpulsaCV",
                "iframe_title_architecture": "Diagrama interactivo de arquitectura de ImpulsaCV",
                "labels": ["Cómo funciona ImpulsaCV", "Arquitectura de ImpulsaCV"],
                "arch_src": "",
                "flow_src": "",
            },
            {
                "type": "plataforma",
                "eyebrow": "04 · Cómo funciona la plataforma",
                "h2": "Todo conectado para acompañar cada postulación<span class='fx-coral'>.</span>",
                "intro": (
                    "ImpulsaCV reúne distintas herramientas para ayudar a las personas a preparar su "
                    "currículum y avanzar en sus postulaciones. Conecté sus funciones para que la "
                    "información y el trabajo realizado tengan continuidad durante todo el proceso."
                ),
                "lead": (
                    "Una persona avanza del currículum a la entrevista <span class='fx-coral'>sin cambiar de "
                    "solución.</span>"
                ),
                "items": [
                    {"num": "01", "title": "Una experiencia conectada",
                     "text": "Herramientas para trabajar el currículum, revisar oportunidades y preparar entrevistas."},
                    {"num": "02", "title": "Asistencia inteligente",
                     "text": "Apoyo de IA para mejorar documentos, adaptar contenidos y orientar durante el proceso."},
                    {"num": "03", "title": "Acceso y planes",
                     "text": "Servicios que permiten guardar el avance y acceder a funciones adicionales mediante planes premium."},
                ],
            },
            {
                "type": "participacion",
                "eyebrow": "05 · Mi participación",
                "h2": "De distintas herramientas a una experiencia completa<span class='fx-coral'>.</span>",
                "intro": (
                    "Mi trabajo consistió en desarrollar y conectar las distintas herramientas para que "
                    "ImpulsaCV funcionara como una plataforma integrada. La idea fue que una persona pudiera "
                    "avanzar desde la organización de su currículum hasta la preparación de sus postulaciones "
                    "y entrevistas sin tener que trabajar con soluciones desconectadas."
                ),
                "points": [
                    {"strong": "Desarrollo", "text": "Creación de las herramientas que permiten trabajar y mejorar el currículum."},
                    {"strong": "Integración", "text": "Conexión de las distintas funciones para dar continuidad al proceso."},
                    {"strong": "Asistencia", "text": "Incorporación de herramientas inteligentes que ayudan a orientar y preparar a cada persona."},
                ],

            },
            {
                "type": "cierre",
                "eyebrow": "El siguiente paso",
                "h2": "Cada solución comienza con una necesidad concreta.",
                "text": (
                    "ImpulsaCV nació para reunir herramientas que antes funcionaban por separado. "
                    "Ese mismo enfoque guía mi trabajo: entender un problema, desarrollar una solución "
                    "útil y conectar las piezas para que funcionen juntas."
                ),
            },
            {
                "type": "contacto",
                "eyebrow": "¿Tienes un desafío en mente?",
                "text": "Cuéntame qué necesitas mejorar, desarrollar o resolver. Podemos conversar sobre el problema y encontrar una forma de abordarlo.",
                "label": "Cuéntame qué necesitas resolver",
                "href": "",  # href se inyecta en build_site.py
            },
        ],
    },
    "el-cambiometro": {
        "slug": "el-cambiometro",
        "eyebrow": "Datos e ingeniería · Plataforma de datos públicos",
        "tags": ["Datos públicos", "Ingesta y validación", "API y visualización"],
        "topline": [("../../", "Archivo"), ("../../proyectos/", "Datos e información"), (None, "El Cambiómetro")],
        "title": "El Cambiómetro", "title_accent": ".",
        "page_class": "project-cambiometro-page",
        "page_title": "El Cambiómetro — ficha técnica y recorrido de los datos",
        "description": "Fuentes oficiales del Estado reunidas, validadas y servidas como API y sitio consultable. Conoce el alcance, los controles y las tecnologías de este trabajo de JMorgado.",
        "summary": _P["el-cambiometro"]["summary"],
        "site": _P["el-cambiometro"]["site"],
        "sections": [
            {"type": "hero"},
            {
                "type": "desafio",
                "eyebrow": "El desafío",
                "h2": "Datos públicos, fuentes distintas, una lectura más clara<span class='fx-coral'>.</span>",
                "intro": _P["el-cambiometro"]["problem"],
                "modifier": "fx-section--alt",
            },
            {
                "type": "diagrama",
                "eyebrow": "Cómo funciona",
                "h2": "De la fuente oficial a la consulta<span class='fx-coral'>.</span>",
                "intro": (
                    "El diagrama muestra el recorrido completo: las fuentes oficiales, la validación que "
                    "conserva la evidencia de cada registro, el lago de datos y, al final, la API y el "
                    "sitio. Selecciona cada bloque para ver su función; el tema acompaña al del sitio."
                ),
                "title": "El Cambiómetro",
                "iframe_title": "Diagrama interactivo del recorrido de datos de El Cambiómetro",
                "src": "",  # src se inyecta en build_site.py
            },
            {
                "type": "plataforma",
                "eyebrow": "La solución",
                "h2": "Un proceso con la evidencia a la vista<span class='fx-coral'>.</span>",
                "intro": (
                    "El sistema separa lo que ocurre antes y después de publicar: la ingesta reúne y "
                    "normaliza, la validación exige que cada registro conserve su origen, el lago conserva "
                    "el histórico y las capas finales responden consultas."
                ),
                "lead": "La misma fuente, verificada en cada etapa<span class='fx-coral'>.</span>",
                "items": [
                    {"num": "01", "title": "Recopilar",
                     "text": "Once fuentes oficiales del Estado se descargan por rangos y se normalizan con un conector por fuente."},
                    {"num": "02", "title": "Verificar",
                     "text": "Cada registro conserva su URL oficial y un checksum; el proceso se detiene si un lote pierde evidencia o cae de tamaño."},
                    {"num": "03", "title": "Consultar",
                     "text": "El lago alimenta una API pública y un sitio con fichas, cruces y rankings, siempre con su origen a la vista."},
                ],
            },
            {
                "type": "participacion",
                "eyebrow": "Mi participación",
                "h2": "Construí la ingesta, los controles y la consulta<span class='fx-coral'>.</span>",
                "intro": (
                    "Mi trabajo consistió en construir el proceso completo: los conectores que leen cada "
                    "fuente, las validaciones que garantizan la trazabilidad, el lago que conserva el "
                    "histórico y las capas finales que lo hacen consultable."
                ),
                "points": [
                    {"strong": "Ingesta", "text": "Conectores y normalización para cada fuente oficial."},
                    {"strong": "Integridad", "text": "Controles de calidad, checksums e instantáneas que no se sobrescriben."},
                    {"strong": "Consulta", "text": "Lago de datos, materialización, API pública y sitio con fichas y cruces."},
                ],
            },
            {
                "type": "tech",
                "eyebrow": "Con qué está construido",
                "heading": "Tecnologías",
                "items": ["Fuentes oficiales", "ETL", "Python", "Node.js", "Cloudflare R2", "Cloudflare D1", "Cloudflare Workers", "Next.js"],
            },
            {
                "type": "cierre",
                "eyebrow": "El siguiente paso",
                "h2": "Primero entender de dónde viene la información.",
                "text": (
                    "El Cambiómetro nació de una pregunta simple: si la información pública ya existe, "
                    "¿por qué cuesta tanto compararla? La respuesta fue ordenar el proceso antes de "
                    "publicar los datos. Ese mismo enfoque guía mi trabajo: entender el problema, "
                    "construir la base y recién después abrir la puerta."
                ),
            },
            {
                "type": "contacto",
                "eyebrow": "¿Tienes un desafío en mente?",
                "text": "Cuéntame qué necesitas mejorar, desarrollar o resolver. Podemos conversar sobre el problema y encontrar una forma de abordarlo.",
                "label": "Cuéntame qué necesitas resolver",
                "href": "",  # href se inyecta en build_site.py
            },
        ],
    },
    "conecta": {
        "slug": "conecta",
        "eyebrow": "Productos y plataformas · Integraciones",
        "tags": ["Multi-marca", "Calendario y medios", "Publicación social"],
        "topline": [("../../", "Archivo"), ("../../proyectos/", "Productos y plataformas"), (None, "ListoPorHoy")],
        "title": "ListoPorHoy", "title_accent": ".",
        "page_class": "project-listoporhoy-page",
        "page_title": "ListoPorHoy — ficha de producto y arquitectura",
        "description": "Calendario, borradores, marcas, medios y servicios de publicación coordinados desde un mismo entorno. Conoce el alcance, los límites y las tecnologías de este trabajo de JMorgado.",
        "summary": _P["conecta"]["summary"],
        "site": _P["conecta"]["site"],
        "sections": [
            {"type": "hero"},
            {
                "type": "desafio",
                "eyebrow": "El desafío",
                "h2": "Distintas marcas. Una operación conectada<span class='fx-coral'>.</span>",
                "intro": _P["conecta"]["problem"],
                "modifier": "fx-section--alt",
            },
            {
                "type": "diagrama",
                "eyebrow": "Cómo funciona",
                "h2": "Cada pieza en su lugar, cada conexión con permiso<span class='fx-coral'>.</span>",
                "intro": (
                    "El diagrama muestra el recorrido de una publicación: el panel de trabajo por marca, "
                    "los servicios que aplican los permisos, el calendario y los datos de la operación, la "
                    "biblioteca de medios en Drive y las conexiones con las redes sociales. Selecciona cada "
                    "bloque para ver su función; el tema acompaña al del sitio."
                ),
                "title": "ListoPorHoy",
                "iframe_title": "Diagrama interactivo de la arquitectura de ListoPorHoy",
                "src": "",  # src se inyecta en build_site.py
            },
            {
                "type": "plataforma",
                "eyebrow": "Una operación conectada",
                "h2": "Del calendario a la publicación sin cambiar de herramienta<span class='fx-coral'>.</span>",
                "intro": (
                    "Organicé el trabajo en tres planos: cómo se organiza, cómo se conecta y cómo se "
                    "publica. Lo que cada marca puede hacer depende de los permisos de sus cuentas, y hay "
                    "funciones que permanecen apagadas por defecto."
                ),
                "lead": "Una marca, un contexto, sus propias conexiones<span class='fx-coral'>.</span>",
                "items": [
                    {"num": "01", "title": "Organización",
                     "text": "Cada marca trabaja con su propio calendario, sus ideas, sus borradores y sus usuarios, con roles que deciden qué ve cada persona."},
                    {"num": "02", "title": "Integración",
                     "text": "Los medios viven en Google Drive y se suben por un puente que verifica el espacio disponible; las cuentas se conectan por OAuth y quedan con su estado y sus permisos."},
                    {"num": "03", "title": "Publicación",
                     "text": "Cada publicación se programa, se registra con su estado y su error si falla, y deja historial de métricas por cuenta y plataforma."},
                ],
            },
            {
                "type": "participacion",
                "eyebrow": "Mi participación",
                "h2": "Construí la plataforma, sus permisos y sus conexiones<span class='fx-coral'>.</span>",
                "intro": (
                    "Mi trabajo consistió en desarrollar la plataforma completa y en conectar sus partes: "
                    "el modelo de datos por marca y rol, el backend que aplica esos permisos, el puente con el "
                    "almacenamiento de archivos y las conexiones con las redes sociales."
                ),
                "points": [
                    {"strong": "Desarrollo", "text": "Panel de trabajo, calendario, ideas, borradores y estados de publicación."},
                    {"strong": "Permisos", "text": "Marcas, usuarios y roles; el permiso no depende de la pantalla que se esté usando."},
                    {"strong": "Integración", "text": "Medios, datos y redes sociales unidos, con el estado de cada conexión a la vista."},
                ],
            },
            {
                "type": "tech",
                "eyebrow": "Con qué está construido",
                "heading": "Tecnologías",
                "items": ["Vite", "Hono", "Cloudflare Workers", "D1", "Google Drive", "Apps Script", "OAuth / APIs sociales"],
            },
            {
                "type": "cierre",
                "eyebrow": "El siguiente paso",
                "h2": "Cuando las herramientas se conectan, el trabajo se ordena.",
                "text": (
                    "ListoPorHoy nació de una idea simple: gestionar contenido de varias marcas no debería "
                    "obligar a trabajar en un sistema distinto para cada una. Reuní el calendario, los archivos, "
                    "los permisos y las conexiones en un mismo entorno, con cada paso a la vista. Es el mismo "
                    "enfoque que aplico a cualquier proyecto: entender el proceso real, conectar las piezas que ya "
                    "existen y construir una base que siga funcionando cuando el trabajo crece."
                ),
            },
            {
                "type": "contacto",
                "eyebrow": "¿Tienes un desafío en mente?",
                "text": "Cuéntame qué necesitas mejorar, desarrollar o resolver. Podemos conversar sobre el problema y encontrar una forma de abordarlo.",
                "label": "Cuéntame qué necesitas resolver",
                "href": "",  # href se inyecta en build_site.py
            },
        ],
    },
    "ryvolt": {
        "slug": "ryvolt",
        "eyebrow": "Experiencia web · Sitio corporativo",
        "tags": ["Corporate", "Rebel", "Bilingüe es/en"],
        "topline": [("../../", "Archivo"), ("../../proyectos/", "Experiencia web"), (None, "Ryvolt")],
        "title": "Ryvolt", "title_accent": ".",
        "page_class": "project-ryvolt-page",
        "page_title": "Ryvolt — ficha de experiencia web y diseño de marca",
        "description": "Una presencia corporativa bilingüe con dos experiencias visuales conectadas por una transición propia, y una base técnica preparada para buscadores.",
        "summary": _P["ryvolt"]["summary"],
        "site": _P["ryvolt"]["site"],
        "sections": [
            {"type": "hero"},
            {
                "type": "desafio",
                "eyebrow": "El desafío",
                "h2": "Una marca, dos públicos, una sola identidad<span class='fx-coral'>.</span>",
                "intro": _P["ryvolt"]["problem"],
                "modifier": "fx-section--alt",
            },
            {
                "type": "modos",
                "eyebrow": "Dos experiencias, una identidad",
                "h2": "Corporate y Rebel no son dos sitios<span class='fx-coral'>.</span>",
                "intro": (
                    "Ryvolt habla con públicos distintos: quien busca una consultora con orden y quién "
                    "responde a una estética tecnológica. En lugar de dos webs, construí una sola "
                    "experiencia con dos registros que conviven en la misma dirección."
                ),
                "modos": [
                    {
                        "kicker": "Corporate",
                        "title": "Lenguaje sobrio, propuesta clara",
                        "text": "Fondo claro, tipografía limpia y una presentación ordenada de los servicios: el rigor de una consultora, sin ruido visual.",
                        "points": [
                            "Servicios presentados con claridad",
                            "Lectura profesional y directa",
                            "Propuesta, bases y contacto en un mismo recorrido",
                        ],
                    },
                    {
                        "kicker": "Rebel",
                        "title": "Actitud tecnológica, más pulso",
                        "text": "Fondo profundo, acento turquesa y recursos técnicos: la misma propuesta contada con más personalidad visual.",
                        "points": [
                            "Identidad con más carácter",
                            "Menú orbital, partículas y glitch",
                            "Marcadores técnicos y capas de efecto",
                        ],
                    },
                ],
                "nota_label": "Transición",
                "nota": (
                    "El cambio ocurre sobre la marcha: ruido, glitch y capas de distorsión devuelven el "
                    "control al visitante en el mismo gesto. Son dos formas de presentar la misma marca, "
                    "no dos marcas distintas."
                ),
            },
            {
                "type": "plataforma",
                "eyebrow": "Más allá de lo visual",
                "h2": "Lo que hace posible la experiencia<span class='fx-coral'>.</span>",
                "intro": (
                    "La dualidad visual es la parte que se ve; debajo hay un trabajo de contenido, "
                    "arquitectura y rendimiento que la sostiene."
                ),
                "lead": "Cada registro cambia; la base técnica no<span class='fx-coral'>.</span>",
                "items": [
                    {"num": "01", "title": "Bilingüeismo",
                     "text": "Contenido, navegación y metadatos en español e inglés, con títulos y descripciones que cambian según el idioma y el registro activo."},
                    {"num": "02", "title": "Experiencia interactiva",
                     "text": "Menú orbital de servicios en escritorio, profundidad en móvil, calculadora de ROI y formulario de contacto con salida por WhatsApp."},
                    {"num": "03", "title": "SEO y rendimiento",
                     "text": "Prerenderizado del contenido principal, verificación de SEO en la construcción y detección de equipos con recursos limitados para aligerar efectos."},
                ],
            },
            {
                "type": "participacion",
                "eyebrow": "Mi participación",
                "h2": "Construí la experiencia, las interacciones y la entrega<span class='fx-coral'>.</span>",
                "intro": (
                    "Implementé la experiencia frontend bilingüe, las interacciones que conectan ambos "
                    "registros y el sistema de prerenderizado para preparar el sitio para buscadores. También "
                    "el formulario conectado a Google Apps Script, la analítica de eventos y el ajuste de "
                    "efectos en equipos con recursos limitados."
                ),
                "points": [
                    {"strong": "Frontend", "text": "Sitio responsive en React con dos registros visuales sobre la misma base de componentes."},
                    {"strong": "Experiencia", "text": "Transición entre modos, menú orbital de servicios y calculadora de ROI."},
                    {"strong": "SEO y entrega", "text": "Prerenderizado, verificación de SEO en el build y despliegue estático en Cloudflare Pages."},
                ],
            },
            {
                "type": "tech",
                "eyebrow": "Con qué está construido",
                "heading": "Tecnologías",
                "items": ["React", "Vite", "Tailwind CSS", "Framer Motion", "Google Apps Script", "Google Analytics 4", "Cloudflare Pages"],
            },
            {
                "type": "cierre",
                "eyebrow": "El siguiente paso",
                "h2": "Una experiencia puede hablar con dos públicos sin dejar de ser una sola marca.",
                "text": (
                    "Ryvolt me recordó que la coherencia no es repetir el mismo tono, sino sostener la misma "
                    "promesa con registros distintos. Ese principio se repite en mi forma de trabajar: "
                    "entender a quién hablas, elegir el registro adecuado y cuidar que la pieza siga siendo "
                    "reconocible, mida lo que mida."
                ),
            },
            {
                "type": "contacto",
                "eyebrow": "¿Tienes un desafío en mente?",
                "text": "Cuéntame qué necesitas mejorar, desarrollar o resolver. Podemos conversar sobre el problema y encontrar una forma de abordarlo.",
                "label": "Cuéntame qué necesitas resolver",
                "href": "",  # href se inyecta en build_site.py
            },
        ],
    },
    "flor-de-almendro": {
        "slug": "flor-de-almendro",
        "eyebrow": "Web y catálogos · Joyería artesanal",
        "tags": ["Catálogo administrable", "Google Sheets", "Google Drive"],
        "topline": [("../../", "Archivo"), ("../../proyectos/", "Web y catálogos"), (None, "Flor de Almendro")],
        "title": "Flor de Almendro", "title_accent": ".",
        "page_class": "project-flor-page",
        "page_title": "Flor de Almendro — ficha de catálogo y experiencia comercial",
        "description": "Un catálogo de joyería que se actualiza desde la planilla del negocio, con imágenes en Google Drive y contacto comercial por WhatsApp. Conoce el alcance y las tecnologías de este trabajo de JMorgado.",
        "summary": _P["flor-de-almendro"]["summary"],
        "site": _P["flor-de-almendro"]["site"],
        "logo": {
            "src": "",  # src se inyecta en build_site.py
            "alt": "Flor de Almendro, joyería artesanal",
            "w": 104,
            "h": 104,
        },
        "sections": [
            {"type": "hero"},
            {
                "type": "desafio",
                "eyebrow": "El desafío",
                "h2": "Un catálogo que no debería depender de otra plataforma<span class='fx-coral'>.</span>",
                "intro": _P["flor-de-almendro"]["problem"],
                "modifier": "fx-section--alt",
            },
            {
                "type": "diagrama",
                "eyebrow": "Cómo funciona",
                "h2": "De la planilla a la vitrina, sin pasos intermedios<span class='fx-coral'>.</span>",
                "intro": (
                    "El diagrama muestra el recorrido completo: los productos se administran en Google Sheets y "
                    "las imágenes y los vídeos se gestionan en Google Drive. La aplicación lee ambas "
                    "fuentes, las ordena y las presenta como un catálogo que se puede consultar y contactar. "
                    "Selecciona cada bloque para ver su función; el tema acompaña al del sitio."
                ),
                "title": "Flor de Almendro",
                "iframe_title": "Diagrama interactivo del flujo del catálogo de Flor de Almendro",
                "src": "",  # src se inyecta en build_site.py
            },
            {
                "type": "plataforma",
                "eyebrow": "Una experiencia comercial conectada",
                "h2": "Administrar lo de siempre, mostrarlo de otra manera<span class='fx-coral'>.</span>",
                "intro": (
                    "El negocio sigue trabajando con las herramientas que ya conoce; el trabajo de desarrollo "
                    "está en que esa información llegue al visitante con forma de catálogo."
                ),
                "lead": "Sin panel nuevo: la planilla del negocio es el panel<span class='fx-coral'>.</span>",
                "items": [
                    {"num": "01", "title": "Administración sencilla",
                     "text": "Los productos se editan en Google Sheets, con la información estructurada y normalizada para que el catálogo se actualice solo al cargar."},
                    {"num": "02", "title": "Contenido visual",
                     "text": "Las imágenes y los vídeos se gestionan en Google Drive y llegan a cada ficha optimizados, con galería y zoom en el celular."},
                    {"num": "03", "title": "Experiencia de consulta",
                     "text": "Navegación por categorías, búsqueda y detalle de cada joya, con acceso directo al contacto comercial por WhatsApp."},
                ],
            },
            {
                "type": "participacion",
                "eyebrow": "Mi participación",
                "h2": "Desarrollí la experiencia y conecté sus fuentes<span class='fx-coral'>.</span>",
                "intro": (
                    "Mi trabajo fue construir la experiencia web y conectar sus fuentes: la lectura del catálogo, "
                    "la organización de categorías y stock, el tratamiento de los medios y la forma en que "
                    "el visitante encuentra una joya y contacta con el negocio."
                ),
                "points": [
                    {"strong": "Experiencia web", "text": "Catálogo responsive con navegación, búsqueda, ficha de producto y modo claro y oscuro."},
                    {"strong": "Integración de fuentes", "text": "Lectura de la planilla del negocio y normalización de sus columnas."},
                    {"strong": "Conexión de medios", "text": "Imágenes y vídeos desde Drive, con galería, zoom y contacto que lleva el producto."},
                ],
            },
            {
                "type": "tech",
                "eyebrow": "Con qué está construido",
                "heading": "Tecnologías",
                "items": ["React", "Vite", "Google Sheets", "Google Drive", "Google Apps Script"],
            },
            {
                "type": "cierre",
                "eyebrow": "El siguiente paso",
                "h2": "A veces la mejor herramienta es conectar mejor las que ya existen.",
                "text": (
                    "Flor de Almendro recordó que una buena solución no siempre necesita más "
                    "herramientas, sino mejor conectadas. Aquí no había que sumar un CMS ni un panel "
                    "nuevo: bastó con ordenar la información que el negocio ya manejaba y darle una forma "
                    "digna de vitrine. Ese es el enfoque que repito en cada proyecto: partir de lo que ya "
                    "funciona y construir encima."
                ),
            },
            {
                "type": "contacto",
                "eyebrow": "¿Tienes un desafío en mente?",
                "text": "Cuéntame qué necesitas mejorar, desarrollar o resolver. Podemos conversar sobre el problema y encontrar una forma de abordarlo.",
                "label": "Cuéntame qué necesitas resolver",
                "href": "",  # href se inyecta en build_site.py
            },
        ],
    },
    "exo-dream": {
        "slug": "exo-dream",
        "eyebrow": "Experiencia web · Showroom configurable",
        "estado": "Desarrollo entregado · Publicación pendiente",
        "tags": ["Showroom configurable", "Administración de contenido", "Agenda integrada"],
        "topline": [("../../", "Archivo"), ("../../proyectos/", "Experiencia web"), (None, "Exo Dream")],
        "title": "Exo Dream", "title_accent": ".",
        "page_class": "project-exo-page",
        "page_title": "Exo Dream — ficha de showroom configurable y administración de contenido",
        "description": "Un showroom digital configurable: el cliente administra el catálogo, los textos y los medios, y el visitante explora, consulta y agenda sin salir del sitio.",
        "summary": _P["exo-dream"]["summary"],
        "logo": {
            "src": "",  # src se inyecta en build_site.py
            "alt": "Exo Dream",
            "w": 320,
            "h": 109,
        },
        "sections": [
            {"type": "hero"},
            {
                "type": "desafio",
                "eyebrow": "El desafío",
                "h2": "Distintas líneas de trabajo, un solo lugar donde mantenerlas<span class='fx-coral'>.</span>",
                "intro": _P["exo-dream"]["problem"],
                "modifier": "fx-section--alt",
            },
            {
                "type": "diagrama",
                "eyebrow": "Cómo funciona Exo Dream",
                "h2": "Administrar y explorar, sin reconstruir el sitio<span class='fx-coral'>.</span>",
                "intro": (
                    "El diagrama muestra el recorrido completo: el cliente administra el catálogo, los textos y "
                    "los medios en sus propias herramientas; el sistema los lee, los ordena y los publica como un "
                    "showroom. La agenda se abre dentro del propio sitio, con la disponibilidad de Google Calendar "
                    "en vivo. Selecciona cada bloque para ver su función; el tema acompaña al del sitio."
                ),
                "title": "Exo Dream",
                "iframe_title": "Diagrama interactivo de la arquitectura de Exo Dream",
                "src": "",  # src se inyecta en build_site.py
            },
            {
                "type": "modos",
                "eyebrow": "Administración tipo CMS",
                "h2": "El cliente administra el contenido con las herramientas que ya usa<span class='fx-coral'>.</span>",
                "intro": (
                    "La entrega no es solo una web: incluye las piezas para mantenerla al día. El cliente "
                    "cambia lo que quiere mostrar sin pedir un despliegue, y la operación queda documentada."
                ),
                "modos": [
                    {
                        "kicker": "Contenido y catálogo",
                        "title": "Textos, fichas y datos que el cliente cambia",
                        "text": "El catálogo, los textos y los datos de contacto se editan en la planilla; el sitio los lee y los presenta sin tocar una línea de código.",
                        "points": [
                            "Categorías, fichas y búsqueda alimentadas por la planilla",
                            "Textos, contacto y presentación configurables",
                            "Cada servicio con su enlace de encuesta y su agenda",
                        ],
                    },
                    {
                        "kicker": "Medios y operación",
                        "title": "Recursos visuales y herramientas para mantenerlo",
                        "text": "Las imágenes y los vídeos se administran en Google Drive, y la entrega incluye utilidades de actualización, auditorías y un manual operativo.",
                        "points": [
                            "Galerías, zoom y video con medios desde Drive",
                            "Herramientas de actualización y auditoría entregadas",
                            "Manual operativo de administración para el negocio",
                        ],
                    },
                ],
                "nota_label": "Resultado",
                "nota": "El cliente no aprende un panel nuevo: mantiene lo que ya usa y el sitio se reconstruye con esa información.",
            },
            {
                "type": "plataforma",
                "eyebrow": "Toda la experiencia en un mismo sitio",
                "h2": "Explorar, consultar, interactuar y agendar sin perder el contexto<span class='fx-coral'>.</span>",
                "intro": (
                    "Las acciones principales ocurren dentro del propio sitio: las categorías, las fichas, las "
                    "galerías, el vídeo, los formularios y la agenda se encadenan sin convertir la "
                    "navegación en un salto a otra página."
                ),
                "lead": "El contexto se conserva de principio a fin<span class='fx-coral'>.</span>",
                "items": [
                    {"num": "01", "title": "Explorar",
                     "text": "Navegación por categorías y búsqueda para llegar a la propuesta que interesa."},
                    {"num": "02", "title": "Consultar",
                     "text": "Ficha con galería ampliada, zoom de imágenes y reproducción de vídeo."},
                    {"num": "03", "title": "Interactuar",
                     "text": "Formularios, encuestas y contacto se resuelven en ventanas dentro del propio sitio."},
                    {"num": "04", "title": "Agendar",
                     "text": "La reserva se abre con la disponibilidad real de Google Calendar, sin abandonar la página."},
                ],
            },
            {
                "type": "statement",
                "eyebrow": "Agenda con Google Calendar",
                "h2": "Del interés a la reserva, sin cambiar de sitio.",
                "intro": (
                    "Cada propuesta puede abrir su propia agenda: la disponibilidad se consulta en vivo en Google "
                    "Calendar y la reserva se completa dentro de la misma ventana, sobre el contexto del "
                    "servicio que la persona estaba viendo. El enlace de cada agenda se configura desde la "
                    "planilla, de modo que el cliente puede asociar el calendario correcto a cada línea de trabajo."
                ),
                "modifier": "fx-section--dark",
            },
            {
                "type": "participacion",
                "eyebrow": "Mi participación",
                "h2": "Construí la experiencia, las herramientas y la agenda<span class='fx-coral'>.</span>",
                "intro": (
                    "Mi trabajo fue la experiencia web completa y, con ella, las piezas que permiten mantenerla: "
                    "la lectura y organización de la información, las herramientas de configuración y "
                    "operación, y la integración de la agenda con Google Calendar."
                ),
                "points": [
                    {"strong": "Experiencia", "text": "Showroom con navegación por categorías, fichas, galerías, video y formularios integrados."},
                    {"strong": "Administración", "text": "Herramientas de configuración y mantenimiento del contenido, con manual operativo para el cliente."},
                    {"strong": "Integración", "text": "Google Sheets y Google Drive como fuentes, y el agendamiento con Google Calendar dentro del sitio."},
                ],
            },
            {
                "type": "tech",
                "eyebrow": "Con qué está construido",
                "heading": "Tecnologías",
                "items": ["React", "Vite", "Tailwind CSS", "Google Sheets", "Google Drive", "Google Calendar", "PapaParse"],
            },
            {
                "type": "cierre",
                "eyebrow": "El siguiente paso",
                "h2": "Una experiencia digital no termina cuando se entrega el diseño.",
                "text": (
                    "También tiene que ser sencilla de administrar y de usar. En Exo Dream construí las dos "
                    "caras: el showroom que explora quien llega de visita y las herramientas con las que el "
                    "cliente lo mantiene al día. Ese es el orden con el que trabajo: que la entrega funcione "
                    "el primer día y siga funcionando el mes siguiente."
                ),
            },
            {
                "type": "contacto",
                "eyebrow": "¿Tienes un desafío en mente?",
                "text": "Cuéntame qué necesitas mejorar, desarrollar o resolver. Podemos conversar sobre el problema y encontrar una forma de abordarlo.",
                "label": "Cuéntame qué necesitas resolver",
                "href": "",  # href se inyecta en build_site.py
            },
        ],
    },
    "tobys-warehouse": {
        "slug": "tobys-warehouse",
        "eyebrow": "Sistemas en tiempo real · Operación y seguimiento",
        "tags": ["Estado compartido", "Actualización en tiempo real", "Operación y seguimiento"],
        "topline": [("../../", "Archivo"), ("../../proyectos/", "Sistemas en tiempo real"), (None, "Hangar354")],
        "title": "Hangar354", "title_accent": ".",
        "page_class": "project-hangar-page",
        "page_title": "Hangar354 — ficha de estado compartido y control de competición",
        "description": "Un Race Control que registra tiempos y resultados, y los comparte en vivo con espectadores y pilotos. Un mismo estado, varias experiencias conectadas.",
        "summary": _P["tobys-warehouse"]["summary"],
        "site": _P["tobys-warehouse"]["site"],
        "logo": {
            "src": "",  # src se inyecta en build_site.py
            "alt": "Hangar354",
            "w": 92,
            "h": 92,
        },
        "sections": [
            {"type": "hero"},
            {
                "type": "desafio",
                "eyebrow": "El desafío",
                "h2": "Cuando varias personas necesitan la misma información, mantenerla actualizada es parte del desafío<span class='fx-coral'>.</span>",
                "intro": _P["tobys-warehouse"]["problem"],
                "modifier": "fx-section--alt",
            },
            {
                "type": "diagrama",
                "eyebrow": "Cómo funciona Hangar354",
                "h2": "Un origen de información, muchas vistas conectadas<span class='fx-coral'>.</span>",
                "intro": (
                    "El diagrama muestra el recorrido: el operador configura la competencia y registra tiempos; "
                    "ese estado se guarda en un único lugar y llega en vivo a las vistas conectadas. "
                    "Al mismo tiempo, el historial y las estadísticas se recalculan para que el resultado "
                    "siga siendo coherente después del evento. Selecciona cada bloque para ver su "
                    "función; el tema acompaña al del sitio."
                ),
                "title": "Hangar354",
                "iframe_title": "Diagrama interactivo de la arquitectura de Hangar354",
                "src": "",  # src se inyecta en build_site.py
            },
            {
                "type": "plataforma",
                "eyebrow": "Del control de carrera al espectador",
                "h2": "Una operación, tres experiencias sobre la misma información<span class='fx-coral'>.</span>",
                "intro": (
                    "La misma base de datos sostiene herramientas que usan personas muy distintas: quien "
                    "organiza, quien sigue y quien compite."
                ),
                "lead": "El operador escribe una vez; el resto se actualiza<span class='fx-coral'>.</span>",
                "items": [
                    {"num": "01", "title": "Operación",
                     "text": "Configuración de participantes, organización de parrillas, elección de pistas y vehículos, sistemas de puntuación y registro de tiempos."},
                    {"num": "02", "title": "Seguimiento",
                     "text": "Las vistas conectadas reciben el estado de la competencia mientras ocurre, sin depender de recargas ni de consultas manuales."},
                    {"num": "03", "title": "Resultados",
                     "text": "Historial de torneos, estadísticas acumuladas y salón de la fama permanecen después del evento y se recalculan al corregir un tiempo."},
                ],
            },
            {
                "type": "statement",
                "eyebrow": "Lapbook · la experiencia del piloto",
                "h2": "Un perfil propio dentro de una plataforma compartida",
                "intro": (
                    "Cada piloto entra con su cuenta y encuentra su registro de vueltas, sus mejores tiempos y "
                    "su historial de sesiones. Es la misma plataforma servida a otro tipo de usuario: con su "
                    "acceso, con sus datos y con su privacidad."
                ),
                "modifier": "fx-section--dark",
            },
            {
                "type": "modos",
                "eyebrow": "Más allá de una competencia",
                "h2": "El mismo principio, distintas aplicaciones<span class='fx-coral'>.</span>",
                "intro": (
                    "Hangar354 nació para coordinar competencias, pero su lógica responde a una "
                    "necesidad más amplia: mantener información actualizada entre personas que "
                    "cumplen funciones diferentes."
                ),
                "modos": [
                    {
                        "kicker": "El patrón",
                        "title": "Un origen de información, muchas vistas",
                        "text": "La información se actualiza en un lugar y llega a las experiencias que la necesitan, con un historial coherente para consultar después.",
                        "points": [
                            "Un solo punto donde se actualiza el estado",
                            "Distintas interfaces conectadas a ese estado",
                            "Historial consistente una vez terminado el evento",
                        ],
                    },
                    {
                        "kicker": "Dónde puede servir",
                        "title": "Aplicaciones del mismo enfoque",
                        "text": "El principio no depende del tipo de información: sirve donde varias personas necesitan ver lo mismo, al mismo tiempo.",
                        "points": [
                            "Operaciones: avances y estados de un proceso",
                            "Eventos: resultados, turnos e información al día",
                            "Monitoreo y gestión: varias vistas sobre un estado común",
                        ],
                    },
                ],
                "nota_label": "Contexto",
                "nota": "No es un producto listo para cualquier industria: cada adaptación depende del contexto y de sus requisitos técnicos. Lo que se transfiere es el enfoque, no el código.",
            },
            {
                "type": "participacion",
                "eyebrow": "Mi participación",
                "h2": "Diseñar sistemas donde distintas interfaces trabajan sobre información compartida<span class='fx-coral'>.</span>",
                "intro": (
                    "Mi trabajo consistió en construir el control de la competencia, las interfaces de "
                    "operación y seguimiento, la integración del estado compartido y la actualización en "
                    "tiempo real, además del historial con sus estadísticas y del módulo personal del piloto."
                ),
                "points": [
                    {"strong": "Race Control", "text": "Herramientas para configurar la sesión, registrar tiempos y cerrar resultados."},
                    {"strong": "Estado compartido", "text": "La actualización en un punto y su reparto a las vistas conectadas."},
                    {"strong": "Experiencias", "text": "Interfaz de espectador, historial con estadísticas y el módulo personal del piloto."},
                ],
            },
            {
                "type": "tech",
                "eyebrow": "Con qué está construido",
                "heading": "Tecnologías",
                "items": ["JavaScript", "HTML5", "CSS3", "Firebase Realtime Database", "Firebase Authentication", "Firebase Hosting"],
            },
            {
                "type": "cierre",
                "eyebrow": "El siguiente paso",
                "h2": "Una solución en tiempo real depende de cómo conectamos la información con quienes la necesitan, no del tipo de dato.",
                "text": (
                    "Hangar354 resolvió un problema muy concreto: coordinar una competencia en directo y "
                    "guardar sus resultados. La capacidad que deja detrás es más general: diseñar "
                    "sistemas donde la información se escribe en un lugar, llega a las interfaces que la "
                    "necesitan y permanece como historial coherente. Ese enfoque se puede trasladar a otros "
                    "contextos con otros requisitos, y en cada uno el trabajo empieza por el mismo sitio: "
                    "entender quién necesita qué y con qué frecuencia."
                ),
            },
            {
                "type": "contacto",
                "eyebrow": "¿Tienes un desafío en mente?",
                "text": "Cuéntame qué necesitas mejorar, desarrollar o resolver. Podemos conversar sobre el problema y encontrar una forma de abordarlo.",
                "label": "Cuéntame qué necesitas resolver",
                "href": "",  # href se inyecta en build_site.py
            },
        ],
    },
    "kooke-portal": {
        "slug": "kooke-portal",
        "eyebrow": "Laboratorio multimedia · Automatización con IA",
        "tags": ["Producción con IA", "Automatización", "Lectura multimedia"],
        "topline": [("../../", "Archivo"), ("../../proyectos/", "Laboratorio multimedia"), (None, "kokeAI")],
        "title": "kokeAI", "title_accent": ".",
        "page_class": "project-kokeai-page",
        "page_title": "kokeAI — ficha de laboratorio multimedia y automatización con IA",
        "description": "Un laboratorio que unió distintas herramientas de IA para crear contenido, automatizar su procesamiento y almacenamiento, y entregarlo como experiencia de lectura multimedia con música.",
        "summary": "Un laboratorio que unió distintas herramientas de IA para crear contenido, automatizar su procesamiento y almacenamiento, y entregarlo como experiencia de lectura multimedia.",
        "site": _P["kooke-portal"]["site"],
        "logo": {
            "src": "",  # src se inyecta en build_site.py
            "alt": "kokeAI",
            "w": 88,
            "h": 88,
        },
        "sections": [
            {"type": "hero"},
            {
                "type": "desafio",
                "eyebrow": "El desafío",
                "h2": "El contenido creado con IA se quedaba disperso entre las herramientas<span class='fx-coral'>.</span>",
                "intro": (
                    "Cada herramienta generativa resolvía bien una parte, pero el resultado se quedaba "
                    "en su carpeta, sin catálogo, sin organización y sin una forma de consumirlo. La "
                    "pregunta del laboratorio era si ese proceso completo podría automatizarse y "
                    "entregarse desde una plataforma propia."
                ),
                "modifier": "fx-section--alt",
            },
            {
                "type": "diagrama",
                "eyebrow": "El recorrido, paso a paso",
                "h2": "Crear, automatizar, publicar y leer<span class='fx-coral'>.</span>",
                "intro": (
                    "Este es el camino que sigue un contenido desde que se crea hasta que alguien lo lee: "
                    "las herramientas de IA producen las piezas, un proceso automático las organiza y las "
                    "publica, el portal las presenta y el lector acompaña la lectura con música. "
                    "Selecciona cada bloque para ver su función; el tema acompaña al del sitio."
                ),
                "title": "kokeAI",
                "iframe_title": "Diagrama interactivo del recorrido de contenido en kokeAI",
                "src": "",  # src se inyecta en build_site.py
            },
            {
                "type": "plataforma",
                "eyebrow": "El laboratorio de creación con IA",
                "h2": "Tres formas de crear, un mismo ecosistema<span class='fx-coral'>.</span>",
                "intro": (
                    "El laboratorio usaba una herramienta distinta según el tipo de contenido, porque cada "
                    "formato pedía algo diferente. Lo común era el destino: todo terminaba en la misma "
                    "biblioteca, automatizada y publicada."
                ),
                "lead": "La IA produce; el sistema se encarga del resto<span class='fx-coral'>.</span>",
                "items": [
                    {"num": "01", "title": "Cómics",
                     "text": "Se elaboraban con NotebookLM a partir de guiones preparados con inteligencia artificial, convirtiendo una idea en contenido narrativo para el portal."},
                    {"num": "02", "title": "Música",
                     "text": "La banda sonora se creaba con Google Flow Music (antes ProducerAI) y formaba parte de la experiencia del sitio, no como adorno posterior."},
                    {"num": "03", "title": "Publicaciones",
                     "text": "Los posts se generaban con la API de Gemini de Google AI Studio, para incorporar contenido generado al ecosistema del estudio."},
                ],
            },
            {
                "type": "statement",
                "eyebrow": "La experiencia de lectura",
                "h2": "Un lector que acompaña, recuerda y se adapta",
                "intro": (
                    "El portal no solo alojaba los cómics: permitía consumirlos. Se abre un cómic, se "
                    "avanza con zoom, flechas y salto de página, la música sigue sonando mientras se lee y "
                    "el lector retoma donde quedó la última vez. El diseño está pensado para "
                    "consumirse también desde el móvil."
                ),
                "modifier": "fx-section--dark",
            },
            {
                "type": "statement",
                "eyebrow": "Administración de infraestructura",
                "h2": "Conectar los servicios también es desarrollo",
                "intro": (
                    "Para que las piezas pudieran comunicarse hubo que administrar los accesos y la "
                    "configuración de cada servicio: la CLI y el SDK de Google Cloud, y los permisos que "
                    "necesitaban el almacenamiento, la base de datos y el despliegue. Son tareas de "
                    "configuración y permisos, ejecutadas por separado y no parte del funcionamiento "
                    "cotidiano del portal."
                ),
                "modifier": "",
            },
            {
                "type": "diagrama",
                "eyebrow": "La arquitectura por dentro",
                "h2": "Quién produce, quién guarda y quién entrega<span class='fx-coral'>.</span>",
                "intro": (
                    "El diagrama separa las capas: generación con herramientas de IA, alojamiento de "
                    "medios en Drive, automatización con Apps Script, metadatos en Firebase, el portal y "
                    "el worker que entrega el audio. La capa de administración es transversal: prepara "
                    "los permisos para que el resto se comunique. Selecciona cada bloque para ver su "
                    "función; el tema acompaña al del sitio."
                ),
                "title": "kokeAI",
                "iframe_title": "Diagrama interactivo de la arquitectura de kokeAI",
                "src": "",  # src se inyecta en build_site.py
            },
            {
                "type": "modos",
                "eyebrow": "El valor del desarrollo",
                "h2": "No era usar IA, sino construir el sistema alrededor<span class='fx-coral'>.</span>",
                "intro": (
                    "Un laboratorio sirve para responder una pregunta con una plataforma entera: "
                    "¿es posible que distintas herramientas generativas alimenten una misma plataforma, "
                    "automatizada de punta a punta y consumible como producto?"
                ),
                "modos": [
                    {
                        "kicker": "Del lado de la producción",
                        "title": "Producción asistida y automatización",
                        "text": "Cada tipo de contenido con la herramienta que mejor le sirve, y después un proceso automático que empaqueta y publica lo producido.",
                        "points": [
                            "Cómics, música y publicaciones con herramientas distintas",
                            "Empaquetado y publicación automática del catálogo",
                            "Biblioteca ordenada en Drive con clasificación local",
                        ],
                    },
                    {
                        "kicker": "Del lado de la plataforma",
                        "title": "Integración y experiencia",
                        "text": "La parte difícil: hacer que todo eso se conectara, se sirviera sin fricción y se pudiera consumir.",
                        "points": [
                            "Servicios externos, almacenamiento y base de datos conectados",
                            "Permisos y configuración administrados con Google Cloud",
                            "Lector con música, continuidad de lectura y adaptación móvil",
                        ],
                    },
                ],
            },
            {
                "type": "participacion",
                "eyebrow": "Mi participación",
                "h2": "Conectar tecnologías distintas para que el flujo funcionara<span class='fx-coral'>.</span>",
                "intro": (
                    "Mi trabajo no fue desarrollar las herramientas externas, sino conectarlas: el portal, la "
                    "automatización del empaquetado, la integración con Drive y Firebase, la "
                    "configuración de permisos con las herramientas de Google Cloud, y el lector con su "
                    "música, su continuidad y su adaptación a móvil."
                ),
                "points": [
                    {"strong": "Portal y lector", "text": "Diseño y desarrollo del portal, el lector de cómics, la playlist y el reproductor."},
                    {"strong": "Automatización", "text": "Del recorrido de carpetas al catálogo publicado, con la organización de la biblioteca."},
                    {"strong": "Infraestructura", "text": "Integración con Drive y Firebase, y administración de permisos y despliegue."},
                ],
            },
            {
                "type": "tech",
                "eyebrow": "Con qué está construido",
                "heading": "Tecnologías",
                "items": ["JavaScript", "HTML5", "CSS3", "Firebase Realtime Database", "Firebase Hosting", "Google Apps Script", "Google Drive", "Cloudflare Worker"],
            },
            {
                "type": "cierre",
                "eyebrow": "El siguiente paso",
                "h2": "Crear contenido es solo una parte: el resto es conectarlo y automatizarlo.",
                "text": (
                    "kokeAI se construyó para responder una pregunta con una plataforma entera: si distintas "
                    "herramientas de IA pueden producir contenido, automatizar su procesamiento y "
                    "almacenamiento, y llegar a una persona en forma de experiencia. La respuesta fue sí, y "
                    "el aprendizaje más útil fue que el valor no estaba en las herramientas, sino en el "
                    "sistema construido alrededor de ellas."
                ),
            },
            {
                "type": "contacto",
                "eyebrow": "¿Tienes un desafío en mente?",
                "text": "Cuéntame qué necesitas mejorar, desarrollar o resolver. Podemos conversar sobre el problema y encontrar una forma de abordarlo.",
                "label": "Cuéntame qué necesitas resolver",
                "href": "",  # href se inyecta en build_site.py
            },
        ],
    },
    "kooke-rrss": {
        "slug": "kooke-rrss",
        "eyebrow": "Automatización · Inteligencia artificial · Marketing digital",
        "estado": "Prototipo de automatización entregado",
        "tags": ["Contenido contextual", "Producción multimodal", "Distribución configurable"],
        "topline": [("../../", "Archivo"), ("../../proyectos/", "Automatización"), (None, "RRSS")],
        "title": "RRSS", "title_accent": ".",
        "page_class": "project-rrss-page",
        "page_title": "RRSS — ficha de automatización de contenido y publicación",
        "description": "De la información de un negocio a contenido listo para publicar: generación con IA, composición gráfica, programación con aprobación configurable y distribución por la API oficial de Meta.",
        "summary": "Operación de contenido: de la información de un negocio a contenido listo para publicar.",
        "site": None,  # el prototipo no tiene interfaz publica: no se inventa un portal
        "logo": {
            "src": "",  # src se inyecta en build_site.py
            "alt": "RRSS",
            "w": 84,
            "h": 84,
        },
        "sections": [
            {"type": "hero"},
            {
                "type": "desafio",
                "eyebrow": "El desafío",
                "h2": "Convertir información de negocio en contenido publicado, sin pasos manuales<span class='fx-coral'>.</span>",
                "intro": (
                    "Publicar no es el problema: es el proceso. Buscar el producto, escribir el texto, "
                    "componer la pieza, elegir el momento y enviarlo eran etapas manuales y repetitivas. "
                    "El prototipo se construyó para encadenarlas y devolverle el control a quien "
                    "programa la publicación."
                ),
                "modifier": "fx-section--alt",
            },
            {
                "type": "diagrama",
                "eyebrow": "Cómo funciona RRSS",
                "h2": "De la información del negocio al contenido publicado<span class='fx-coral'>.</span>",
                "intro": (
                    "El diagrama muestra el recorrido de una publicación y, en paralelo, la línea "
                    "audiovisual del laboratorio. La información del negocio alimenta la generación, la "
                    "composición gráfica y el calendario; la distribución sale por la API oficial de "
                    "Meta y queda registrada. Selecciona cada bloque para ver su función; el tema "
                    "acompaña al del sitio."
                ),
                "title": "RRSS",
                "iframe_title": "Diagrama interactivo del flujo de RRSS",
                "src": "",  # src se inyecta en build_site.py
            },
            {
                "type": "plataforma",
                "eyebrow": "Del catálogo a una publicación",
                "h2": "Un disco nuevo en el catálogo, una publicación preparada<span class='fx-coral'>.</span>",
                "intro": (
                    "El caso que ordenó el proyecto fue una tienda de discos. El negocio incorporaba un "
                    "producto nuevo a su catálogo y el sistema tomaba esa información, buscaba la carátula "
                    "correspondiente y preparaba la publicación anunciando su disponibilidad. No era una "
                    "integración universal con cualquier catálogo: la conexión dependía de la fuente y de "
                    "lo que permitiera cada una."
                ),
                "lead": "El contenido nace de información real del negocio<span class='fx-coral'>.</span>",
                "items": [
                    {"num": "01", "title": "El negocio incorpora el producto",
                     "text": "El alta de una novedad en el catálogo era el punto de partida, con sus datos y su carátula."},
                    {"num": "02", "title": "El sistema prepara la pieza",
                     "text": "Capturaba la información, generaba el texto con IA y componía la pieza gráfica."},
                    {"num": "03", "title": "El usuario decide cuándo se publica",
                     "text": "Fecha, hora, formato y revisión previa quedaban decididos antes de que la publicación saliera."},
                ],
            },
            {
                "type": "statement",
                "eyebrow": "Producción gráfica y generación con IA",
                "h2": "Gemini redacta; Pillow compone la pieza.",
                "intro": (
                    "La publicación no era un texto con una foto pegada. Gemini recibía la información del "
                    "producto y devolvía el copy con sus hashtags; Pillow componía la pieza final en "
                    "formato vertical, combinando el recurso del producto, la carátula y el texto. Cuando la "
                    "pieza necesitaba recursos visuales adicionales se recurría a la generación de imágenes "
                    "con IA, que no estaba presente en todas las publicaciones."
                ),
                "modifier": "fx-section--dark",
            },
            {
                "type": "modos",
                "eyebrow": "Calendario, control del usuario y distribución",
                "h2": "El usuario decide cuándo, cómo y con qué condiciones.",
                "intro": (
                    "La automatización no quitaba el control: lo delimitaba. Cada publicación tenía fecha, "
                    "hora, tipo de contenido y formato, y podía pasar por una aprobación previa antes de "
                    "distribuirse."
                ),
                "modos": [
                    {
                        "kicker": "El control del usuario",
                        "title": "Programación y revisión",
                        "text": "La decisión se tomaba antes de automatizar, no después.",
                        "points": [
                            "Fecha y hora de publicación",
                            "Formato: post, historia o reel",
                            "Con aprobación: se revisa antes de salir",
                            "Sin aprobación: el flujo sigue lo programado",
                        ],
                    },
                    {
                        "kicker": "La distribución",
                        "title": "API oficial de Meta",
                        "text": "La salida hacia las redes se apoyó en las APIs oficiales de la marca.",
                        "points": [
                            "Publicación con la API oficial de Meta",
                            "Registro de lo publicado y de su hora",
                            "Sin automatizaciones que simulen a una persona",
                        ],
                    },
                ],
                "nota_label": "Alcance",
                "nota": (
                    "El prototipo registraba la publicación y su hora. Las métricas —likes, comentarios, "
                    "alcance— eran una ampliación posible del sistema, no una función terminada."
                ),
            },
            {
                "type": "statement",
                "eyebrow": "Producción audiovisual asistida",
                "h2": "Del guión a la pieza con voz y subtítulos.",
                "intro": (
                    "Además de las publicaciones estáticas, el laboratorio se amplió hacia el audiovisual: "
                    "los guiones se preparaban con asistencia de IA, Google Flow generaba el material y CapCut "
                    "completaba la edición. Para la locución y los subtítulos desarrollí una "
                    "aplicación propia que permite elegir voz y velocidad, genera el audio y el subtítulo "
                    "palabra por palabra, y deja el proyecto montado para abrir en CapCut."
                ),
                "modifier": "fx-section--dark",
            },
            {
                "type": "participacion",
                "eyebrow": "Mi participación",
                "h2": "Diseñar, conectar y automatizar el proceso completo<span class='fx-coral'>.</span>",
                "intro": (
                    "Mi trabajo fue diseñar el flujo, integrar la API de Gemini, el procesamiento gráfico con "
                    "Pillow, la conexión con las APIs oficiales de Meta, la programación con aprobación "
                    "configurable y el registro de publicaciones. Y ampliar el laboratorio hacia lo audiovisual con "
                    "Google Flow, CapCut y una aplicación propia de voz y subtítulos."
                ),
                "points": [
                    {"strong": "Automatización", "text": "Flujo de publicación con programación, formato y aprobación configurable."},
                    {"strong": "Generación y gráfico", "text": "Integración de Gemini y composición de la pieza con Pillow."},
                    {"strong": "Audiovisual", "text": "Guiones, Flow, edición con CapCut y la aplicación de voz y subtítulos."},
                ],
            },
            {
                "type": "tecnologias",
                "eyebrow": "Con qué está construido",
                "heading": "Tecnologías",
                "items": [
                    {"name": "Python", "icon": "assets/tech-icons/python.svg", "color": "#2b6595"},
                    {"name": "Google Sheets", "icon": "assets/tech-icons/google-sheets.svg", "color": "#217244"},
                    {"name": "Google Apps Script", "icon": "assets/tech-icons/google-apps-script.svg", "color": "#376bbb"},
                    {"name": "Google Drive", "icon": "assets/tech-icons/google-drive.svg", "color": "#277e63"},
                    {"name": "Gemini", "icon": "assets/tech-icons/gemini.svg", "color": "#4f8cff"},
                    {"name": "Google AI Studio", "icon": "assets/tech-icons/google-ai-studio.svg", "color": "#1a73e8"},
                    {"name": "Nano Banana", "icon": "assets/tech-icons/nano-banana.svg", "color": "#c9a227"},
                    {"name": "Pillow", "icon": "assets/tech-icons/pillow.svg", "color": "#7b6bd6"},
                    {"name": "Meta Graph API", "icon": "assets/tech-icons/meta-graph-api.svg", "color": "#0866ff"},
                    {"name": "Google Flow", "icon": "assets/tech-icons/google-flow.svg", "color": "#1a73e8"},
                    {"name": "CapCut", "icon": "assets/tech-icons/capcut.svg", "color": "#1f2430"},
                ],
                "note": (
                    "La distribución se apoyó en la API oficial de Meta. Se exploraron agentes que "
                    "automatizaban la interacción con las plataformas, pero no es un mecanismo recomendable en "
                    "producción: puede derivar en restricciones o bloqueos de la cuenta."
                ),
            },
            {
                "type": "cierre",
                "eyebrow": "El siguiente paso",
                "h2": "Crear contenido es solo una parte: el resto es conectarlo y automatizarlo.",
                "text": (
                    "RRSS se construyó para responder una pregunta con un sistema entero: si la información de "
                    "un negocio puede convertirse en contenido publicado sin que nadie tenga que hacer cada "
                    "etapa a mano. La respuesta fue sí, y el aprendizaje más útil fue que el valor no está "
                    "en las herramientas, sino en el proceso construido alrededor de ellas. Ese enfoque reaparece "
                    "después, con más alcance, en soluciones como ListoPorHoy."
                ),
            },
            {
                "type": "contacto",
                "eyebrow": "¿Tienes un desafío en mente?",
                "text": "Cuéntame qué necesitas mejorar, desarrollar o resolver. Podemos conversar sobre el problema y encontrar una forma de abordarlo.",
                "label": "Cuéntame qué necesitas resolver",
                "href": "",  # href se inyecta en build_site.py
            },
        ],
    },
}
