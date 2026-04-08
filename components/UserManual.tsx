
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Terminal, Cpu, ShieldCheck, Globe, Sliders, Bot, Users, 
  Database, HardDrive, Search, ChevronRight, X, Info, Zap, Shield, 
  Sparkles, Network, Layers, Smartphone, Box, Server, Key, History,
  Trash2, Lock, Activity, FileText, Code, CheckCircle2, AlertCircle,
  Play, Headphones, TerminalSquare, GitMerge, MessageCircle, Share2,
  Music, Smartphone as PhoneIcon, BarChart3, Target, Mic, PhoneIncoming,
  ListChecks, Copy, Settings, PieChart, Filter, Mail, MessageSquare, 
  Workflow, Globe2, ShieldAlert, Layout, Disc
} from 'lucide-react';
// Added missing useToast import
import { useToast } from '../ToastContext';

interface ManualStep {
  title: string;
  desc: string;
  code?: string;
}

interface ManualEntry {
  id: string;
  title: string;
  icon: any;
  category: 'OPERACIONES' | 'INFRAESTRUCTURA' | 'AI & NEURAL' | 'ADMINISTRACIÓN';
  summary: string;
  functionality: string;
  usage: string;
  steps: ManualStep[];
  technicalNote?: string;
  image?: string;
}

const MANUAL_DATABASE: ManualEntry[] = [
  {
    id: 'agent-terminal-pro',
    title: 'Terminal de Agente Blended',
    icon: Headphones,
    category: 'OPERACIONES',
    summary: 'Interfaz unificada para la gestión de tráfico entrante, saliente y omnicanal.',
    functionality: 'La terminal opera sobre el protocolo Verto (WebRTC), permitiendo comunicación de baja latencia sin necesidad de softphones externos. Gestiona estados de pausa, marcación manual, scripts dinámicos y matrices de tipificación con hotkeys.',
    usage: 'Para comenzar a trabajar, el agente debe seguir un flujo lógico que garantiza que el sistema lo reconozca como activo y listo para recibir clientes.',
    steps: [
      { title: 'Paso 1: Inicio de Sesión y Anclaje', desc: 'Ingrese sus credenciales y extensión. El sistema realizará automáticamente una llamada a su navegador. Debe contestar esta llamada; es el "puente de audio" que lo mantendrá conectado con el servidor durante toda su jornada.' },
      { title: 'Paso 2: Selección de Campaña', desc: 'Elija la campaña en la que va a trabajar. Esto cargará los scripts, bases de datos y reglas de marcación específicas para ese proyecto.' },
      { title: 'Paso 3: Ponerse en modo "Ready"', desc: 'Haga clic en el botón verde de "Ready". A partir de este momento, el motor predictivo comenzará a enviarle llamadas o mensajes de redes sociales de forma automática.' },
      { title: 'Paso 4: Gestión de la Interacción', desc: 'Cuando entre una llamada, verá los datos del cliente en pantalla. Siga el script sugerido. Al terminar, use la matriz de botones a la derecha para indicar qué sucedió (Venta, No Contesta, etc.).' },
      { title: 'Paso 5: Uso de Pausas', desc: 'Si necesita retirarse de su puesto, use el menú de Pausas. Elija el motivo correcto (Almuerzo, Capacitación, etc.). Esto es vital para que el supervisor sepa por qué no está recibiendo llamadas.' }
    ],
    image: 'https://picsum.photos/seed/agent-terminal/1200/600'
  },
  {
    id: 'campaigns-manager',
    title: 'Gestión de Campañas',
    icon: Target,
    category: 'OPERACIONES',
    summary: 'Configuración de estrategias de contacto masivo y atención entrante.',
    functionality: 'Permite definir el comportamiento del marcador, asignar bases de datos, configurar scripts de venta y establecer horarios de operación. Soporta campañas predictivas, progresivas, manuales e inbound con colas ACD.',
    usage: 'Diseñe campañas eficientes equilibrando la carga de trabajo de los agentes con la calidad del contacto.',
    steps: [
      { title: 'Paso 1: Creación de Campaña', desc: 'Defina el nombre, tipo (Outbound/Inbound) y el método de marcación (Predictivo es el recomendado para ventas).' },
      { title: 'Paso 2: Asignación de Listas', desc: 'Vincule las bases de datos cargadas previamente. Puede asignar múltiples listas a una sola campaña y priorizarlas.' },
      { title: 'Paso 3: Configuración de CID', desc: 'Establezca los números de máscara (Caller ID) que verán los clientes. Use rotación de números para mejorar la tasa de respuesta.' },
      { title: 'Paso 4: Definición de Horarios', desc: 'Configure los "Call Times" para cumplir con las regulaciones locales y evitar llamar en horarios no permitidos.' }
    ],
    image: 'https://picsum.photos/seed/campaigns/1200/600'
  },
  {
    id: 'real-time-monitor',
    title: 'Monitoreo en Tiempo Real',
    icon: Activity,
    category: 'OPERACIONES',
    summary: 'Supervisión en vivo de agentes, llamadas y métricas críticas de nivel de servicio.',
    functionality: 'Visualiza el estado exacto de cada extensión, el tiempo en llamada, el ratio de ocupación y las llamadas en espera. Permite realizar escucha silenciosa (Barge), susurro (Whisper) e intervención (Join).',
    usage: 'Utilice este panel para detectar cuellos de botella y asistir a agentes que tengan dificultades en vivo.',
    steps: [
      { title: 'Paso 1: Vista General del Clúster', desc: 'Observe el estado global: agentes logueados vs. agentes en llamada. El color azul indica conversación activa.' },
      { title: 'Paso 2: Escucha Activa', desc: 'Haga clic en el icono de audífono junto a un agente para escuchar su llamada sin que el cliente ni el agente lo noten.' },
      { title: 'Paso 3: Susurro de Coaching', desc: 'Use el modo "Whisper" para hablarle solo al agente y darle instrucciones durante una negociación difícil.' },
      { title: 'Paso 4: Gestión de Pausas', desc: 'Si un agente excede el tiempo de pausa permitido, puede forzar su cambio a estado "Ready" o desloguearlo desde el panel.' }
    ],
    image: 'https://picsum.photos/seed/realtime/1200/600'
  },
  {
    id: 'local-deployment-debian12',
    title: 'Despliegue Local (Debian 12)',
    icon: HardDrive,
    category: 'INFRAESTRUCTURA',
    summary: 'Guía para instalar el sistema en servidores físicos o virtuales usando Proxmox.',
    functionality: 'Permite el control total del hardware y la privacidad de los datos al operar en infraestructura propia (On-Premise). Optimizado para Debian 12 Bookworm.',
    usage: 'Siga estos pasos para preparar el sistema operativo y las dependencias críticas en su servidor local.',
    steps: [
      { 
        title: 'Paso 1: Preparación de Debian 12', 
        desc: 'Instale Debian 12 (Netinstall). Asegúrese de tener acceso SSH y privilegios de sudo.',
        code: 'apt update && apt upgrade -y\napt install -y curl git build-essential'
      },
      { 
        title: 'Paso 2: Base de Datos PostgreSQL 16', 
        desc: 'Instale y configure PostgreSQL. Cree el usuario y la base de datos para la aplicación.',
        code: 'apt install -y postgresql-16\nsudo -u postgres psql -c "CREATE USER nexus_admin WITH PASSWORD \'TuPassword\';" \nsudo -u postgres psql -c "CREATE DATABASE nexus_db OWNER nexus_admin;"'
      },
      { 
        title: 'Paso 3: Entorno Node.js y App', 
        desc: 'Instale Node.js 20+ y clone el repositorio. Instale las dependencias de npm.',
        code: 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -\napt install -y nodejs\ngit clone https://github.com/tu-repo/nexus-core.git\ncd nexus-core && npm install'
      },
      { 
        title: 'Paso 4: Persistencia con Systemd', 
        desc: 'Cree un servicio para que la app inicie automáticamente con el servidor.',
        code: 'cat <<EOF > /etc/systemd/system/nexus-core.service\n[Unit]\nDescription=CUBERBOX Nexus Core App\nAfter=network.target\n\n[Service]\nType=simple\nWorkingDirectory=/opt/nexus-core\nExecStart=/usr/bin/npm run dev -- --host 0.0.0.0\nRestart=always\n\n[Install]\nWantedBy=multi-user.target\nEOF\nsystemctl enable --now nexus-core'
      }
    ],
    image: 'https://picsum.photos/seed/debian/1200/600'
  },
  {
    id: 'whatsapp-api-setup',
    title: 'Configuración WhatsApp Business',
    icon: MessageSquare,
    category: 'ADMINISTRACIÓN',
    summary: 'Pasos para conectar la API oficial de Meta y configurar Webhooks.',
    functionality: 'Habilita la recepción y envío de mensajes reales a través de la plataforma de WhatsApp Business Cloud API.',
    usage: 'Requiere una cuenta en Meta for Developers y un número de teléfono verificado.',
    steps: [
      { title: 'Paso 1: Credenciales de Meta', desc: 'Obtenga su WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID desde el panel de Meta for Developers.' },
      { 
        title: 'Paso 2: Configuración de Webhook', 
        desc: 'Configure la URL de callback en Meta: https://tu-ip-o-dominio/api/webhook/whatsapp. Use el Verify Token configurado en su .env.',
        code: 'WHATSAPP_VERIFY_TOKEN=nexus_token_2026'
      },
      { title: 'Paso 1: Variables de Entorno', desc: 'Añada las credenciales a su archivo .env local para que el servidor pueda autenticarse con Meta.' },
      { title: 'Paso 2: Verificación de Conexión', desc: 'Envíe un mensaje de prueba desde la interfaz de WhatsApp de la app. Si el estado cambia a "Entregado", la conexión es exitosa.' }
    ],
    image: 'https://picsum.photos/seed/whatsapp/1200/600'
  },
  {
    id: 'tiktok-api-setup',
    title: 'Configuración TikTok Business',
    icon: MessageSquare,
    category: 'ADMINISTRACIÓN',
    summary: 'Pasos para conectar la API de TikTok Business y configurar Webhooks.',
    functionality: 'Habilita la recepción y envío de mensajes de seguidores de TikTok directamente desde la plataforma.',
    usage: 'Requiere una cuenta de desarrollador en TikTok for Business y una App configurada.',
    steps: [
      { title: 'Paso 1: Credenciales de TikTok', desc: 'Obtenga su TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET y TIKTOK_ACCESS_TOKEN desde el portal de desarrolladores de TikTok.' },
      { 
        title: 'Paso 2: Configuración de Webhook', 
        desc: 'Configure la URL de callback en TikTok: https://tu-ip-o-dominio/api/webhook/tiktok. Use el Verify Token configurado en su .env.',
        code: 'TIKTOK_VERIFY_TOKEN=nexus_tiktok_token_2026'
      },
      { title: 'Paso 3: Variables de Entorno', desc: 'Añada las credenciales a su archivo .env local para que el servidor pueda autenticarse con TikTok.' },
      { title: 'Paso 4: Verificación de Conexión', desc: 'Envíe un mensaje de prueba desde la interfaz de TikTok de la app. Si el estado cambia a "Entregado", la conexión es exitosa.' }
    ],
    image: 'https://picsum.photos/seed/tiktok/1200/600'
  },
  {
    id: 'facebook-messenger-setup',
    title: 'Configuración Facebook Messenger',
    icon: MessageSquare,
    category: 'ADMINISTRACIÓN',
    summary: 'Conecte su página de Facebook para recibir mensajes en la bandeja unificada.',
    functionality: 'Permite la gestión de chats de Messenger mediante la API de Meta Graph.',
    usage: 'Requiere una página de Facebook y una App en Meta for Developers con el producto Messenger configurado.',
    steps: [
      { title: 'Paso 1: App en Meta', desc: 'Cree una App en Meta for Developers y agregue el producto "Messenger".' },
      { title: 'Paso 2: Token de Acceso', desc: 'Genere un Page Access Token para la página que desea conectar.' },
      { 
        title: 'Paso 3: Webhook de Messenger', 
        desc: 'Configure el Webhook apuntando a /api/webhook/facebook y suscríbase al campo "messages".',
        code: 'META_VERIFY_TOKEN=nexus_meta_token_2026'
      }
    ],
    image: 'https://picsum.photos/seed/facebook/1200/600'
  },
  {
    id: 'instagram-direct-setup',
    title: 'Configuración Instagram Direct',
    icon: Globe,
    category: 'ADMINISTRACIÓN',
    summary: 'Gestione los mensajes directos de su cuenta de Instagram Business.',
    functionality: 'Integración con Instagram Graph API para mensajería bidireccional.',
    usage: 'La cuenta de Instagram debe estar vinculada a una página de Facebook y ser de tipo "Business" o "Creator".',
    steps: [
      { title: 'Paso 1: Vincular Cuentas', desc: 'Asegúrese de que su cuenta de Instagram esté vinculada a su página de Facebook.' },
      { title: 'Paso 2: Permisos de Mensajes', desc: 'En la configuración de Instagram, habilite el "Acceso a mensajes" para herramientas de terceros.' },
      { 
        title: 'Paso 3: Webhook de Instagram', 
        desc: 'Configure el Webhook apuntando a /api/webhook/instagram y suscríbase al campo "messages".',
        code: 'META_VERIFY_TOKEN=nexus_meta_token_2026'
      }
    ],
    image: 'https://picsum.photos/seed/instagram/1200/600'
  },
  {
    id: 'multi-node-freeswitch',
    title: 'Clúster Multi-Nodo FreeSwitch',
    icon: Network,
    category: 'INFRAESTRUCTURA',
    summary: 'Configuración de múltiples servidores de telefonía distribuidos.',
    functionality: 'Permite escalar la capacidad de llamadas y asegurar la redundancia geográfica conectando varios servidores FreeSwitch a una sola interfaz.',
    usage: 'Utilice la tabla telephony_nodes para registrar sus servidores remotos y monitorear su salud.',
    steps: [
      { 
        title: 'Paso 1: Habilitar Event Socket', 
        desc: 'En cada nodo FreeSwitch, permita conexiones externas en el archivo event_socket.conf.xml.',
        code: '<param name="listen-ip" value="0.0.0.0"/>\n<param name="listen-port" value="8021"/>'
      },
      { title: 'Paso 2: Firewall y Puertos', desc: 'Abra el puerto 8021 (TCP) en el firewall de cada nodo, permitiendo solo la IP de su servidor principal de Debian.' },
      { 
        title: 'Paso 3: Registro de Nodos', 
        desc: 'Use el endpoint /api/telephony/nodes para añadir la IP y contraseña de cada servidor al clúster.',
        code: 'INSERT INTO telephony_nodes (name, ip, password) VALUES (\'Nodo Miami\', \'192.168.1.60\', \'ClueCon\');'
      },
      { title: 'Paso 4: Monitoreo de Salud', desc: 'Revise el "Cluster Monitor" para ver el estado ONLINE/OFFLINE de cada nodo en tiempo real.' }
    ],
    image: 'https://picsum.photos/seed/freeswitch/1200/600'
  },
  {
    id: 'reports-analytics',
    title: 'Reportes & Business Intelligence',
    icon: BarChart3,
    category: 'OPERACIONES',
    summary: 'Extracción de datos históricos y análisis de productividad profunda.',
    functionality: 'Genera reportes detallados de llamadas (CDR), productividad por agente, efectividad de listas y costos de telefonía. Exportación nativa a CSV, PDF y JSON para integración con PowerBI.',
    usage: 'Tome decisiones basadas en datos analizando las tendencias semanales y mensuales de su operación.',
    steps: [
      { title: 'Paso 1: Selección de Filtros', desc: 'Elija el rango de fechas, las campañas y los agentes específicos que desea analizar.' },
      { title: 'Paso 2: Reporte de Productividad', desc: 'Revise el tiempo "Talk", "Wait", "Pause" y "Wrap-up" para identificar a sus mejores talentos.' },
      { title: 'Paso 3: Análisis de Disposiciones', desc: 'Vea qué porcentaje de sus llamadas terminan en Venta, Buzón o No Interesado para ajustar su base de datos.' },
      { title: 'Paso 4: Programación de Envíos', desc: 'Configure el sistema para que envíe automáticamente los reportes diarios a su correo electrónico cada mañana.' }
    ],
    image: 'https://picsum.photos/seed/analytics/1200/600'
  },
  {
    id: 'users-permissions-pro',
    title: 'Usuarios y Seguridad',
    icon: Users,
    category: 'ADMINISTRACIÓN',
    summary: 'Control de acceso granular y gestión de perfiles de usuario.',
    functionality: 'Administra credenciales, niveles de acceso (Agente, Supervisor, Admin) y pertenencia a grupos. Implementa MFA (Autenticación de Dos Factores) para accesos remotos.',
    usage: 'Mantenga la seguridad de su información limitando el acceso solo a lo estrictamente necesario para cada rol.',
    steps: [
      { title: 'Paso 1: Creación de Perfiles', desc: 'Defina qué botones y menús puede ver un usuario. Un agente no debería ver reportes de costos, por ejemplo.' },
      { title: 'Paso 2: Alta de Usuarios', desc: 'Asigne una extensión única y una contraseña robusta. Vincule al usuario con un grupo de supervisión.' },
      { title: 'Paso 3: Configuración de MFA', desc: 'Active el código de seguridad por aplicación (Google Authenticator) para proteger las cuentas de administrador.' },
      { title: 'Paso 4: Importación y Exportación', desc: 'Use los botones de "Importar" y "Exportar" para gestionar bases de usuarios masivas en formato JSON, facilitando la migración entre clústeres.' },
      { title: 'Paso 5: Auditoría de Logs', desc: 'Revise quién entró al sistema, desde qué IP y qué cambios realizó en la configuración.' }
    ],
    image: 'https://picsum.photos/seed/security/1200/600'
  },
  {
    id: 'crm-integrations-hub',
    title: 'Integraciones CRM & Webhooks',
    icon: Network,
    category: 'ADMINISTRACIÓN',
    summary: 'Sincronización de datos con sistemas externos en tiempo real.',
    functionality: 'Permite disparar eventos (Webhooks) cuando ocurre una venta o una llamada termina. Integración nativa con Salesforce, Zoho, HubSpot y bases de datos SQL externas.',
    usage: 'Automatice el flujo de información para que sus agentes no tengan que capturar datos en dos sistemas diferentes.',
    steps: [
      { title: 'Paso 1: Configuración de URL de Destino', desc: 'Ingrese la URL de su CRM donde CUBERBOX Nexus Core debe enviar la información de las llamadas.' },
      { title: 'Paso 2: Mapeo de Campos', desc: 'Indique qué dato de CUBERBOX Nexus Core (ej. Teléfono) corresponde a qué campo en su CRM.' },
      { title: 'Paso 3: Definición de Triggers', desc: 'Elija en qué momento enviar los datos: ¿Al iniciar la llamada o solo cuando se tipifica como "Venta"?' },
      { title: 'Paso 4: Prueba de Conectividad', desc: 'Use el botón de "Test" para verificar que su CRM está recibiendo los datos correctamente.' }
    ],
    image: 'https://picsum.photos/seed/crm/1200/600'
  },
  {
    id: 'omnichannel-whatsapp',
    title: 'Módulo Omnicanal (WhatsApp/Email)',
    icon: MessageCircle,
    category: 'OPERACIONES',
    summary: 'Gestión de chats y correos electrónicos desde la misma interfaz de voz.',
    functionality: 'Integra la API oficial de WhatsApp Business y servidores SMTP/IMAP. Permite el uso de plantillas, bots de auto-respuesta y transferencia de chats entre agentes.',
    usage: 'Atienda a sus clientes por el canal de su preferencia sin que el agente cambie de aplicación.',
    steps: [
      { title: 'Paso 1: Vinculación de Canales', desc: 'Escanee el código QR o configure los tokens de la API para activar sus líneas de WhatsApp.' },
      { title: 'Paso 2: Creación de Plantillas', desc: 'Diseñe mensajes pre-aprobados para iniciar conversaciones de forma masiva y legal.' },
      { title: 'Paso 3: Configuración de Chatbots', desc: 'Cree flujos de auto-atención para resolver dudas frecuentes antes de pasar con un humano.' },
      { title: 'Paso 4: Bandeja de Entrada Unificada', desc: 'Los agentes recibirán los chats en la misma pantalla donde reciben las llamadas, manteniendo el historial completo.' }
    ],
    image: 'https://picsum.photos/seed/omnichannel/1200/600'
  },
  {
    id: 'cluster-ha-nexus',
    title: 'Gestión de Clúster & HA',
    icon: Server,
    category: 'INFRAESTRUCTURA',
    summary: 'Control de nodos, balanceo de carga y redundancia geográfica.',
    functionality: 'Administra múltiples servidores FreeSwitch trabajando como uno solo. Gestiona el "Failover" automático mediante Keepalived y la replicación de base de datos en tiempo real.',
    usage: 'Asegure que su operación nunca se detenga, incluso si un servidor físico falla por completo.',
    steps: [
      { title: 'Paso 1: Registro de Nodos', desc: 'Agregue las IPs de sus servidores esclavos al panel central para que el clúster los reconozca.' },
      { title: 'Paso 2: Sincronización de Archivos', desc: 'Active rsync para que las grabaciones y configuraciones de audio estén presentes en todos los nodos.' },
      { title: 'Paso 3: Monitoreo de Heartbeat', desc: 'Verifique que los nodos se "saluden" constantemente. Si uno deja de responder, el tráfico se moverá al otro.' },
      { title: 'Paso 4: Mantenimiento Programado', desc: 'Ponga un nodo en modo "Drain" para realizar actualizaciones sin desconectar las llamadas activas.' }
    ],
    image: 'https://picsum.photos/seed/cluster/1200/600'
  },
  {
    id: 'broadcast-ai-voice',
    title: 'Broadcast AI & Voicebots',
    icon: Mic,
    category: 'AI & NEURAL',
    summary: 'Campañas masivas de audio con interacción inteligente y TTS natural.',
    functionality: 'Envía miles de llamadas simultáneas con voces humanas generadas por IA. El bot puede escuchar al cliente, entender su intención y transferir a un agente solo si hay interés real.',
    usage: 'Ideal para cobranza masiva, confirmación de citas y encuestas de satisfacción automatizadas.',
    steps: [
      { title: 'Paso 1: Diseño del Diálogo', desc: 'Escriba el guion que el bot dirá. Use variables como [Nombre] para que la llamada sea personalizada.' },
      { title: 'Paso 2: Entrenamiento de Intenciones', desc: 'Dígale al bot qué hacer si el cliente dice "Sí", "No", "No puedo" o "Llamen más tarde".' },
      { title: 'Paso 3: Selección de Voz Neural', desc: 'Elija entre voces masculinas o femeninas con acentos locales para generar confianza en el cliente.' },
      { title: 'Paso 4: Lanzamiento y Escalado', desc: 'Inicie la campaña. El sistema detectará automáticamente cuántos canales de telefonía tiene disponibles para no saturar su troncal.' }
    ],
    image: 'https://picsum.photos/seed/voicebot/1200/600'
  },
  {
    id: 'manual-dialer-callbacks',
    title: 'Marcación Manual & Callbacks',
    icon: PhoneIcon,
    category: 'OPERACIONES',
    summary: 'Control de llamadas directas y programación de seguimientos personalizados.',
    functionality: 'Permite a los agentes realizar llamadas a números específicos fuera de la cola predictiva y programar recordatorios automáticos (Callbacks) que el sistema inyectará en la terminal en la fecha y hora acordada con el cliente.',
    usage: 'Utilice la marcación manual para gestiones especiales y el agendamiento de callbacks para asegurar el cierre de ventas diferidas.',
    steps: [
      { title: 'Paso 1: Acceso al Dialer Manual', desc: 'En la pantalla de agente, localice el panel de "Marcación Manual". Ingrese el número con el prefijo correspondiente.' },
      { title: 'Paso 2: Ejecución de Llamada', desc: 'Haga clic en el botón de llamar. El sistema utilizará la troncal configurada para establecer la comunicación mediante ESL.' },
      { title: 'Paso 3: Programación de Callback', desc: 'Si el cliente solicita ser llamado después, haga clic en "Agendar Callback". Seleccione la fecha, hora y el tipo (Privado o Público).' },
      { title: 'Paso 4: Gestión de Agenda', desc: 'El sistema le notificará cuando un callback esté vencido. Podrá ver su lista de compromisos pendientes en el panel lateral.' }
    ],
    image: 'https://picsum.photos/seed/dialer/1200/600'
  },
  {
    id: 'ivr-designer-pro',
    title: 'Diseñador de IVR Visual',
    icon: Network,
    category: 'INFRAESTRUCTURA',
    summary: 'Interfaz drag-and-drop para la creación de flujos de atención telefónica.',
    functionality: 'Permite construir árboles de decisión complejos, menús multinivel, consultas a bases de datos en tiempo real y transferencias inteligentes basadas en el horario o la disponibilidad de agentes.',
    usage: 'Cree experiencias de usuario fluidas que resuelvan dudas rápidamente sin intervención humana.',
    steps: [
      { title: 'Paso 1: Lienzo de Diseño', desc: 'Arrastre los bloques de "Reproducir Audio", "Capturar Dígitos" o "Transferir" al lienzo.' },
      { title: 'Paso 2: Configuración de Nodos', desc: 'Haga doble clic en un nodo para subir el archivo de audio o definir qué sucede si el cliente presiona la opción 1.' },
      { title: 'Paso 3: Integración de Datos', desc: 'Use el nodo "Data Query" para validar el número de cuenta del cliente contra su base de datos antes de pasarlo con un agente.' },
      { title: 'Paso 4: Publicación en Vivo', desc: 'Guarde y asigne el IVR a un número de teléfono entrante (DID) para que los cambios surtan efecto inmediatamente.' }
    ],
    image: 'https://picsum.photos/seed/ivr/1200/600'
  },
  {
    id: 'quality-assurance-audit',
    title: 'Auditoría de Calidad (QA)',
    icon: ShieldCheck,
    category: 'OPERACIONES',
    summary: 'Evaluación sistemática de interacciones para mejora continua.',
    functionality: 'Proporciona formularios de evaluación personalizables, reproducción de grabaciones con marcadores de tiempo y reportes de desempeño por agente o supervisor.',
    usage: 'Identifique áreas de mejora y reconozca el buen desempeño mediante auditorías objetivas.',
    steps: [
      { title: 'Paso 1: Búsqueda de Grabaciones', desc: 'Filtre por fecha, agente o duración para encontrar las llamadas que desea auditar.' },
      { title: 'Paso 2: Aplicación de Formulario', desc: 'Escuche la llamada y califique los ítems (ej. ¿Cerró la venta?, ¿Siguió el script?).' },
      { title: 'Paso 3: Retroalimentación', desc: 'Deje comentarios específicos en el minuto exacto donde el agente cometió un error o tuvo un acierto.' },
      { title: 'Paso 4: Calibración', desc: 'Compare las notas de diferentes auditores para asegurar que todos están evaluando bajo los mismos criterios.' }
    ],
    image: 'https://picsum.photos/seed/qa/1200/600'
  },
  {
    id: 'workflows-automation-engine',
    title: 'Motor de Workflows',
    icon: Workflow,
    category: 'AI & NEURAL',
    summary: 'Automatización de tareas post-llamada y procesos de negocio.',
    functionality: 'Ejecuta acciones automáticas basadas en eventos del sistema. Por ejemplo: enviar un SMS de agradecimiento después de una venta o alertar a un supervisor si una llamada dura más de 20 minutos.',
    usage: 'Elimine tareas repetitivas y asegure que ningún lead se pierda por falta de seguimiento.',
    steps: [
      { title: 'Paso 1: Definición del Disparador', desc: 'Elija qué evento inicia el flujo (ej. "Llamada Finalizada con éxito").' },
      { title: 'Paso 2: Establecimiento de Condiciones', desc: 'Añada filtros: "Solo si el monto es mayor a $1000" o "Solo para clientes nuevos".' },
      { title: 'Paso 3: Configuración de Acciones', desc: 'Defina qué debe pasar: ¿Enviar un correo?, ¿Actualizar el CRM?, ¿Notificar por Slack?' },
      { title: 'Paso 4: Monitoreo de Ejecución', desc: 'Revise el historial para confirmar que todos los flujos se están ejecutando correctamente.' }
    ],
    image: 'https://picsum.photos/seed/workflow/1200/600'
  },
  {
    id: 'lists-dnc-management',
    title: 'Gestión de Listas & DNC',
    icon: ListChecks,
    category: 'ADMINISTRACIÓN',
    summary: 'Control de bases de datos y cumplimiento legal (Do Not Call).',
    functionality: 'Permite la carga masiva de contactos, limpieza de duplicados y gestión de la lista negra global (DNC) para evitar multas legales por llamar a personas que no lo desean.',
    usage: 'Mantenga sus bases de datos limpias y productivas cumpliendo siempre con la normativa vigente.',
    steps: [
      { title: 'Paso 1: Carga de Contactos', desc: 'Suba archivos CSV/Excel. El sistema mapeará automáticamente los campos de teléfono y nombre.' },
      { title: 'Paso 2: Limpieza de Base', desc: 'Use la herramienta de "Deduplicación" para eliminar registros repetidos y ahorrar canales de marcación.' },
      { title: 'Paso 3: Gestión de DNC', desc: 'Añada números a la lista negra. El marcador filtrará estos números automáticamente incluso si están en sus listas de campaña.' },
      { title: 'Paso 4: Reciclaje de Listas', desc: 'Configure cuándo volver a llamar a los números que no contestaron (ej. "Llamar de nuevo en 4 horas").' }
    ],
    image: 'https://picsum.photos/seed/lists/1200/600'
  },
  {
    id: 'github-clone-nexus',
    title: 'Descarga desde GitHub',
    icon: Code,
    category: 'ADMINISTRACIÓN',
    summary: 'Pasos para clonar el repositorio oficial y preparar el entorno.',
    functionality: 'Permite obtener la última versión estable del código fuente directamente desde los servidores de control de versiones.',
    usage: 'Use este procedimiento para instalaciones nuevas o para actualizar su entorno de desarrollo.',
    steps: [
      { 
        title: 'Paso 1: Clonar Repositorio', 
        desc: 'Use git para descargar los archivos. Asegúrese de tener sus llaves SSH configuradas o use el token de acceso personal.',
        code: 'git clone https://github.com/tu-organizacion/nexus-core.git\ncd nexus-core'
      },
      { 
        title: 'Paso 2: Configurar Ramas', 
        desc: 'Cambie a la rama de producción para asegurar estabilidad.',
        code: 'git checkout main\ngit pull origin main'
      },
      { 
        title: 'Paso 3: Inicializar Submódulos', 
        desc: 'Si el proyecto usa submódulos para el motor de audio, inicialícelos ahora.',
        code: 'git submodule update --init --recursive'
      }
    ],
    image: 'https://picsum.photos/seed/github/1200/600'
  },
  {
    id: 'network-ports-matrix',
    title: 'Matriz de Puertos y Red',
    icon: Globe2,
    category: 'INFRAESTRUCTURA',
    summary: 'Configuración de Firewall y conectividad requerida para el ecosistema CUBERBOX Nexus.',
    functionality: 'Detalla los puertos lógicos que deben estar abiertos en el Firewall perimetral y del servidor para permitir el tráfico de señalización SIP, medios RTP y gestión de datos.',
    usage: 'Asegúrese de que su proveedor de red o administrador de IT habilite estos puertos para evitar llamadas sin audio o errores de conexión en la terminal.',
    steps: [
      { title: 'Señalización SIP (5060-5061)', desc: 'Puerto 5060 (UDP/TCP) para tráfico estándar y 5061 (TLS) para tráfico encriptado. Vital para el registro de teléfonos físicos y troncales.' },
      { title: 'WebRTC Verto (8081-8082)', desc: 'Puertos seguros (WSS) utilizados por la terminal del agente en el navegador. Deben estar abiertos para que el "Anclaje de Audio" funcione.' },
      { title: 'Rango de Medios RTP (16384-32768)', desc: 'Rango UDP masivo para el transporte de la voz. Si estos puertos están cerrados, las llamadas se conectarán pero no habrá audio (One-way audio).' },
      { title: 'Gestión y Datos (3000, 5432, 8021)', desc: '3000: Interfaz Web CUBERBOX Nexus Core. 5432: Base de Datos PostgreSQL. 8021: Event Socket Layer (ESL) para control del motor desde el backend.' }
    ],
    image: 'https://picsum.photos/seed/network/1200/600'
  },
  {
    id: 'predictive-dialer-core',
    title: 'Motor Predictivo & Hopper',
    icon: Zap,
    category: 'INFRAESTRUCTURA',
    summary: 'Algoritmo de marcación adaptativa basado en probabilidad y tasa de abandono.',
    functionality: 'El motor calcula el "Dial Ratio" dinámicamente. El Hopper actúa como un búfer de memoria pre-cargando los mejores leads de la base de datos para inyectarlos en el marcador en microsegundos cuando un agente queda libre.',
    usage: 'Como administrador, su objetivo es mantener a los agentes hablando el mayor tiempo posible sin generar demasiadas llamadas abandonadas.',
    steps: [
      { title: 'Paso 1: Carga de Bases de Datos', desc: 'Suba sus archivos CSV con los contactos. El sistema los procesará y los asignará a las listas correspondientes de la campaña.' },
      { title: 'Paso 2: Configuración del Hopper', desc: 'Defina cuántos leads quiere que el sistema tenga "listos" en memoria. Un valor de 500 es ideal para la mayoría de las operaciones medianas.' },
      { title: 'Paso 3: Ajuste del Nivel de Marcación', desc: 'Comience con un ratio bajo (ej. 1.5). Si nota que los agentes esperan mucho, suba el ratio. Si nota que entran llamadas y no hay agentes libres (Drop), baje el ratio inmediatamente.' },
      { title: 'Paso 4: Activación de AMD', desc: 'Habilite la detección de contestadoras. Esto ahorra tiempo a sus agentes al filtrar automáticamente los buzones de voz, entregándoles solo personas reales.' }
    ],
    image: 'https://picsum.photos/seed/predictive/1200/600'
  },
  {
    id: 'telephony-config-nexus',
    title: 'Configuración de Telefonía (SIP/DID)',
    icon: PhoneIncoming,
    category: 'INFRAESTRUCTURA',
    summary: 'Gestión de troncales SIP, numeración DID y rutas de entrada/salida.',
    functionality: 'Permite la interconexión con carriers externos mediante el protocolo SIP. Gestiona la autenticación de troncales, la asignación de DIDs a campañas o IVRs, y la configuración de codecs de audio.',
    usage: 'Configure sus troncales para permitir el flujo de llamadas hacia la red pública (PSTN).',
    steps: [
      { title: 'Paso 1: Registro de Troncal SIP', desc: 'Ingrese los datos de su proveedor (Host, Usuario, Password). El sistema intentará registrarse automáticamente con el motor FreeSwitch.' },
      { title: 'Paso 2: Alta de DIDs', desc: 'Registre los números de teléfono adquiridos. Puede asignarlos directamente a una campaña entrante o a un flujo de IVR.' },
      { title: 'Paso 3: Configuración de Rutas', desc: 'Defina las reglas de marcado (Dialplan). Por ejemplo, anteponer un prefijo para llamadas internacionales o bloquear ciertos destinos.' },
      { title: 'Paso 4: Monitoreo de Registro', desc: 'Verifique en el panel que la troncal aparezca como "Registered". Si falla, revise sus credenciales y el firewall (Puerto 5060).' }
    ],
    image: 'https://picsum.photos/seed/telephony/1200/600'
  },
  {
    id: 'ai-studio-gemini',
    title: 'AI Studio & Gemini Pro',
    icon: Bot,
    category: 'AI & NEURAL',
    summary: 'Integración de Gemini 3 Pro para asistencia en vivo y análisis semántico.',
    functionality: 'Utiliza modelos LLM de Google para asistir a los agentes en tiempo real, auditar grabaciones y detectar sentimientos. Requiere una GEMINI_API_KEY válida configurada en el entorno.',
    usage: 'Active el asistente en la pantalla del agente para que este pueda realizar consultas sobre el script o dudas del cliente.',
    steps: [
      { title: 'Paso 1: Configuración de API Key', desc: 'Asegúrese de que la variable GEMINI_API_KEY esté presente en su archivo .env o configuración de servidor.' },
      { title: 'Paso 2: Prompting de Sistema', desc: 'Defina las instrucciones base para la IA. Esto determina el tono y el conocimiento experto del asistente.' },
      { title: 'Paso 3: Consulta en Vivo', desc: 'El agente puede escribir dudas en el panel lateral. La IA responderá basándose en el contexto de la campaña y el manual del producto.' },
      { title: 'Paso 4: Análisis de Sentimiento', desc: 'El sistema procesa el texto de la interacción para alertar sobre clientes insatisfechos o oportunidades de cierre perdidas.' }
    ],
    image: 'https://picsum.photos/seed/gemini/1200/600'
  },
  {
    id: 'manual-installation-nexus',
    title: 'Instalación Automática (CUBERBOX Nexus Pro)',
    icon: Zap,
    category: 'ADMINISTRACIÓN',
    summary: 'Despliegue ultra-rápido de CUBERBOX Nexus Core mediante el script de orquestación inteligente.',
    functionality: 'El script install_pro.sh automatiza la configuración de repositorios, instalación de binarios de FreeSwitch 1.10, PostgreSQL 16, Go 1.22, y el stack de Alta Disponibilidad (Keepalived/HAProxy). Detecta automáticamente la versión de Debian (12/13) y aplica optimizaciones de kernel para VoIP.',
    usage: 'Este es el método recomendado para servidores de producción. Requiere un Token de SignalWire (PAT) válido.',
    steps: [
      { 
        title: 'Paso 1: Preparación y Permisos', 
        desc: 'Asegúrese de estar en una sesión de ROOT y otorgue permisos de ejecución al instalador.',
        code: 'chmod +x setup/install_pro.sh'
      },
      { 
        title: 'Paso 2: Ejecución del Instalador', 
        desc: 'Inicie el script. Se le solicitará el Dominio para SSL, el Token de SignalWire, la IP Virtual (VIP) y el Rol del nodo (MASTER/SLAVE).',
        code: 'sudo ./setup/install_pro.sh'
      },
      { 
        title: 'Paso 3: Verificación de Servicios', 
        desc: 'Al finalizar, el script mostrará un resumen con las credenciales de ESL y el estado de los servicios. Verifique que todo esté en orden.',
        code: 'systemctl status freeswitch postgresql keepalived haproxy'
      },
      { 
        title: 'Paso 4: Acceso al Panel', 
        desc: 'Abra su navegador e ingrese a la IP Virtual o el Dominio configurado para acceder a la interfaz de administración.',
        code: 'https://tu-dominio-o-vip.com'
      }
    ],
    image: 'https://picsum.photos/seed/install/1200/600'
  },
  {
    id: 'manual-compilacion-detallada',
    title: 'Compilación desde Fuentes (Debian 12)',
    icon: Cpu,
    category: 'INFRAESTRUCTURA',
    summary: 'Guía técnica para compilar FreeSwitch 1.10 y dependencias críticas en Debian 12 Bookworm.',
    functionality: 'Cubre la compilación manual de libks, signalwire-c, sofia-sip, spandsp y FreeSwitch 1.10 con soporte para PostgreSQL.',
    usage: 'Use este método solo si necesita personalizaciones extremas o si los binarios oficiales no están disponibles para su arquitectura.',
    steps: [
      {
        title: '1. Dependencias de Sistema',
        desc: 'Instale las herramientas de desarrollo y librerías de medios actuales para Debian 12.',
        code: 'apt-get update && apt-get install -y \\\n  git build-essential cmake automake autoconf libtool libtool-bin \\\n  pkg-config libssl-dev zlib1g-dev libdb-dev libncurses-dev \\\n  libsqlite3-dev libcurl4-openssl-dev libpcre3-dev libspeex-dev \\\n  libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev libopus-dev \\\n  libsndfile1-dev libshout3-dev libmpg123-dev python3-dev uuid-dev \\\n  libjpeg-dev libtiff-dev libpq-dev libavformat-dev libswscale-dev \\\n  libswresample-dev libyaml-dev libexpat1-dev libgdbm-dev libvpx-dev \\\n  libx264-dev libyuv-dev'
      },
      {
        title: '2. Librerías SignalWire (libks & signalwire-c)',
        desc: 'Compilación de las bases de comunicación moderna.',
        code: 'cd /usr/src\ngit clone https://github.com/signalwire/libks.git && cd libks && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make -j$(nproc) && make install && ldconfig\ncd /usr/src\ngit clone https://github.com/signalwire/signalwire-c.git && cd signalwire-c && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make -j$(nproc) && make install && ldconfig'
      },
      {
        title: '3. Sofia-SIP & SpanDSP',
        desc: 'Componentes esenciales para señalización y procesamiento de audio.',
        code: 'cd /usr/src\ngit clone https://github.com/freeswitch/sofia-sip.git && cd sofia-sip && ./bootstrap.sh && ./configure --prefix=/usr && make -j$(nproc) && make install && ldconfig\ncd /usr/src\ngit clone https://github.com/freeswitch/spandsp.git && cd spandsp && ./bootstrap.sh && ./configure --prefix=/usr && make -j$(nproc) && make install && ldconfig'
      },
      {
        title: '4. FreeSwitch 1.10 Core',
        desc: 'Compilación del núcleo con soporte PostgreSQL.',
        code: 'cd /usr/src\ngit clone https://github.com/signalwire/freeswitch.git -b v1.10 freeswitch\ncd freeswitch\n./bootstrap.sh -j\n# Habilitar mod_av, mod_opus, mod_pgsql en modules.conf\n./configure --enable-core-pgsql-support\nmake -j$(nproc) && make install && make cd-sounds-install && make cd-moh-install'
      }
    ],
    image: 'https://picsum.photos/seed/compile/1200/600'
  },
  {
    id: 'docker-deployment-debian12',
    title: 'Despliegue Docker (Debian 12)',
    icon: Box,
    category: 'ADMINISTRACIÓN',
    summary: 'Guía para instalar CUBERBOX Nexus Core usando contenedores Docker en Debian 12.',
    functionality: 'Aísla cada componente (Base de datos, Telefonía, Backend, Frontend) en contenedores independientes, facilitando la portabilidad y escalabilidad.',
    usage: 'Ideal para entornos de producción modernos y despliegues rápidos en la nube.',
    steps: [
      { 
        title: 'Paso 1: Instalar Docker y Compose', 
        desc: 'Prepare su Debian 12 instalando el motor de Docker y el plugin de Compose.',
        code: 'apt-get update\napt-get install -y ca-certificates curl gnupg\ninstall -m 0755 -d /etc/apt/keyrings\ncurl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg\nchmod a+r /etc/apt/keyrings/docker.gpg\necho "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null\napt-get update\napt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin'
      },
      {
        title: 'Paso 2: Descargar el Proyecto de GitHub',
        desc: 'Clonamos el repositorio oficial para obtener los archivos de configuración de Docker.',
        code: 'cd /opt\ngit clone https://github.com/tu-usuario/nexus-core.git\ncd nexus-core'
      },
      { 
        title: 'Paso 3: Preparar Archivos de Configuración', 
        desc: 'Asegúrese de tener el archivo docker-compose.yml y los Dockerfiles en la raíz del proyecto.',
        code: 'ls -R | grep Dockerfile\nls docker-compose.yml'
      },
      { 
        title: 'Paso 4: Solución al Error "Pull Access Denied"', 
        desc: 'Si recibe un error al descargar "signalwire/freeswitch", es porque la imagen oficial ahora es privada. La solución profesional es construir su propia imagen desde los fuentes.',
        code: '# 1. Crear el archivo Dockerfile.freeswitch\ncat <<EOF > Dockerfile.freeswitch\nFROM debian:12\n\nRUN apt-get update && apt-get install -y \\\n    git build-essential cmake automake autoconf libtool libtool-bin pkg-config \\\n    libssl-dev zlib1g-dev libdb-dev libncurses-dev libsqlite3-dev libcurl4-openssl-dev \\\n    libpcre3-dev libspeex-dev libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev \\\n    libopus-dev libsndfile1-dev libshout3-dev libmpg123-dev python3-dev uuid-dev \\\n    libavformat-dev libswscale-dev libswresample-dev libyuv-dev libvpx-dev\n\n# Compilar libks y signalwire-c desde fuentes\nRUN cd /usr/src && git clone https://github.com/signalwire/libks.git && cd libks && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make -j$(nproc) && make install && ldconfig && \\\n    cd /usr/src && git clone https://github.com/signalwire/signalwire-c.git && cd signalwire-c && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make -j$(nproc) && make install && ldconfig\n\nRUN cd /usr/src && git clone https://github.com/signalwire/freeswitch.git -b v1.10 freeswitch && \\\n    cd freeswitch && ./bootstrap.sh -j && ./configure --enable-core-pgsql-support && \\\n    make -j$(nproc) && make install && make cd-sounds-install && make cd-moh-install\n\nENTRYPOINT ["/usr/local/freeswitch/bin/freeswitch", "-nf"]\nEOF\n\n# 2. Actualizar su docker-compose.yml\n# Cambie "image: signalwire/freeswitch" por:\n# build: \n#   context: .\n#   dockerfile: Dockerfile.freeswitch'
      },
      { 
        title: 'Paso 5: Levantar el Stack', 
        desc: 'Inicie todos los servicios. Docker construirá la imagen de FreeSwitch localmente, evitando el error de acceso denegado.',
        code: 'docker compose up -d --build'
      },
      { 
        title: 'Paso 6: Verificación de Contenedores', 
        desc: 'Compruebe que todos los servicios estén en estado "Running".',
        code: 'docker compose ps'
      }
    ],
    image: 'https://picsum.photos/seed/docker/1200/600'
  },
  {
    id: 'docker-cluster-ha',
    title: 'Cluster & HA con Docker',
    icon: Layers,
    category: 'INFRAESTRUCTURA',
    summary: 'Configuración de Alta Disponibilidad y Clúster usando Docker Swarm o Compose.',
    functionality: 'Permite replicar el servicio web y el conector para distribuir la carga y asegurar que el sistema siga operando si un contenedor falla.',
    usage: 'Utilice esta configuración para operaciones de misión crítica que no pueden permitirse tiempo de inactividad.',
    steps: [
      { 
        title: 'Paso 1: Replicación de Servicios', 
        desc: 'En su docker-compose.yml, puede definir el número de réplicas para el servicio web.',
        code: 'services:\n  web:\n    deploy:\n      replicas: 3\n      restart_policy:\n        condition: on-failure'
      },
      { 
        title: 'Paso 2: Balanceo de Carga con HAProxy', 
        desc: 'El contenedor de HAProxy distribuirá el tráfico entre las réplicas del servicio web.',
        code: 'docker compose up -d --scale web=3'
      },
      { 
        title: 'Paso 3: Persistencia de Datos Compartida', 
        desc: 'Para un clúster real, use volúmenes externos o un sistema de archivos compartido (NFS) para las grabaciones y la base de datos.',
        code: 'volumes:\n  postgres_data:\n    driver: local\n    driver_opts:\n      type: nfs\n      o: addr=192.168.1.50,rw\n      device: ":/export/postgres_data"'
      }
    ],
    image: 'https://picsum.photos/seed/docker-cluster/1200/600'
  },
  {
    id: 'systemd-automation',
    title: 'Automatización de Servicios',
    icon: Terminal,
    category: 'ADMINISTRACIÓN',
    summary: 'Script de instalación automática para systemd.',
    functionality: 'Proporciona un script que detecta automáticamente las rutas de su sistema y crea los archivos .service necesarios sin errores manuales.',
    usage: 'Ejecute el script setup-service.sh que se encuentra en la raíz del proyecto.',
    steps: [
      { 
        title: 'Ejecutar Script de Configuración', 
        desc: 'Este comando le dará permisos de ejecución al script y lo ejecutará como root para configurar los servicios.',
        code: 'chmod +x setup-service.sh\nsudo ./setup-service.sh'
      },
      { 
        title: 'Verificación de Estado', 
        desc: 'Confirme que ambos servicios estén corriendo correctamente.',
        code: 'systemctl status nexus-web\nsystemctl status nexus-core'
      }
    ],
    image: 'https://picsum.photos/seed/systemd/1200/600'
  },
  {
    id: 'systemd-unit-creation',
    title: 'Creación de Servicios (Unit Files)',
    icon: FileText,
    category: 'ADMINISTRACIÓN',
    summary: 'Cómo crear manualmente los archivos .service si no existen.',
    functionality: 'Proporciona los comandos exactos para generar los archivos de configuración que systemd requiere para administrar CUBERBOX Nexus Core como un servicio del sistema.',
    usage: 'Use esta guía si recibe el error "Unit file does not exist" al intentar usar systemctl.',
    steps: [
      { 
        title: 'Crear nexus-web.service', 
        desc: 'Ejecute este bloque completo para crear el servicio del servidor web (Puerto 3000).',
        code: 'cat <<EOF > /etc/systemd/system/nexus-web.service\n[Unit]\nDescription=CUBERBOX Nexus Core Web Interface\nAfter=network.target\n\n[Service]\nType=simple\nWorkingDirectory=/opt/nexus-core\nExecStart=/usr/bin/npm run dev -- --host 0.0.0.0\nRestart=always\nEnvironment=NODE_ENV=production\n\n[Install]\nWantedBy=multi-user.target\nEOF'
      },
      { 
        title: 'Crear nexus-connector.service', 
        desc: 'Ejecute este bloque para crear el servicio del motor de eventos (Puerto 8021).',
        code: 'cat <<EOF > /etc/systemd/system/nexus-core.service\n[Unit]\nDescription=CUBERBOX Nexus Core Connector\nAfter=network.target freeswitch.service\n\n[Service]\nType=simple\nWorkingDirectory=/opt/nexus-core\nExecStart=/usr/local/bin/nexus-connector\nRestart=always\n\n[Install]\nWantedBy=multi-user.target\nEOF'
      },
      { 
        title: 'Activar Servicios', 
        desc: 'Después de crear los archivos, ejecute estos comandos para ponerlos en marcha.',
        code: 'systemctl daemon-reload\nsystemctl enable --now nexus-web\nsystemctl enable --now nexus-core'
      }
    ],
    image: 'https://picsum.photos/seed/unit/1200/600'
  },
  {
    id: 'emergency-port-3000',
    title: 'Emergencia: Puerto 3000 Down',
    icon: Zap,
    category: 'ADMINISTRACIÓN',
    summary: 'Procedimiento de rescate cuando la interfaz web no carga.',
    functionality: 'Diagnostica si el fallo es por dependencias faltantes, errores de compilación de Vite o si el proceso de Node.js se detuvo.',
    usage: 'Use esta guía si puede hacer ping al servidor pero el navegador muestra "Conexión rechazada" en el puerto 3000.',
    steps: [
      { 
        title: 'Paso 1: Test de Proceso Vivo', 
        desc: 'Verifique si hay algún proceso de Node escuchando. Si no sale nada, el servidor está apagado.',
        code: 'ps aux | grep node'
      },
      { 
        title: 'Paso 2: Reinstalación de Módulos', 
        desc: 'A veces la carpeta node_modules se corrompe. Borre y reinstale para asegurar integridad.',
        code: 'rm -rf node_modules && npm install'
      },
      { 
        title: 'Paso 3: Forzar Inicio Manual', 
        desc: 'Intente arrancar el servidor manualmente para ver los errores en tiempo real en la consola.',
        code: 'npm run dev -- --host 0.0.0.0'
      },
      { 
        title: 'Paso 4: Persistencia con Systemd', 
        desc: 'Una vez que funcione manualmente, asegúrese de que el servicio nexus-web esté activo para que inicie con el servidor.',
        code: 'systemctl daemon-reload && systemctl enable --now nexus-web'
      }
    ],
    image: 'https://picsum.photos/seed/emergency/1200/600'
  },
  {
    id: 'troubleshooting-service',
    title: 'Resolución de Errores: Systemd',
    icon: ShieldAlert,
    category: 'ADMINISTRACIÓN',
    summary: 'Guía para corregir fallos de inicio del servicio (Error 203/EXEC).',
    functionality: 'Explica cómo diagnosticar y reparar el error 203/EXEC que ocurre cuando el binario del conector no es ejecutable o no existe en la ruta /usr/local/bin.',
    usage: 'Si el comando "systemctl status nexus-core" muestra un error en rojo, siga estos pasos para restaurar el servicio.',
    steps: [
      { 
        title: 'Paso 1: Verificar Existencia del Binario', 
        desc: 'Asegúrese de que el archivo realmente exista en la ruta. Si no aparece, el proceso de compilación falló.',
        code: 'ls -lh /usr/local/bin/nexus-connector'
      },
      { 
        title: 'Paso 2: Corregir Permisos de Ejecución', 
        desc: 'A veces el archivo se copia pero pierde el bit de ejecución. Este comando le otorga los permisos necesarios.',
        code: 'chmod +x /usr/local/bin/nexus-connector'
      },
      { 
        title: 'Paso 3: Recompilar el Conector (Si no existe)', 
        desc: 'Si el binario falta, debe entrar a la carpeta del backend y volver a generarlo con Go.',
        code: 'cd /opt/nexus-core/backend\ngo build -o nexus-connector main.go\ncp nexus-connector /usr/local/bin/\nsystemctl restart nexus-core'
      },
      { 
        title: 'Paso 4: Verificar Logs del Sistema', 
        desc: 'Si el error persiste, revise los mensajes detallados del kernel para ver si falta alguna librería.',
        code: 'journalctl -u nexus-core.service -f'
      }
    ],
    image: 'https://picsum.photos/seed/troubleshoot/1200/600'
  },
  {
    id: 'keycloak-sso-setup',
    title: 'Integración Keycloak SSO',
    icon: Key,
    category: 'ADMINISTRACIÓN',
    summary: 'Configuración de autenticación centralizada y Single Sign-On.',
    functionality: 'Permite delegar la autenticación a un servidor Keycloak externo, facilitando la gestión de usuarios corporativos y el cumplimiento de políticas de seguridad.',
    usage: 'Configure el Realm y el Client ID en Keycloak y actualice las variables de entorno en CUBERBOX Nexus Core.',
    steps: [
      { title: 'Paso 1: Crear Realm en Keycloak', desc: 'Cree un nuevo Realm llamado "nexus" en su consola de Keycloak.' },
      { title: 'Paso 2: Configurar Cliente', desc: 'Cree un cliente "nexus-core" con el protocolo openid-connect y configure las URLs de redirección.' },
      { title: 'Paso 3: Variables de Entorno', desc: 'Añada KEYCLOAK_URL, KEYCLOAK_REALM y KEYCLOAK_CLIENT_ID a su archivo .env.', code: 'KEYCLOAK_URL=https://sso.tu-dominio.com\nKEYCLOAK_REALM=nexus\nKEYCLOAK_CLIENT_ID=nexus-core' },
      { title: 'Paso 4: Prueba de Login', desc: 'Cierre sesión y verifique que el botón de "Login con Keycloak" aparezca y funcione correctamente.' }
    ],
    image: 'https://picsum.photos/seed/keycloak/1200/600'
  },
  {
    id: 'iso-installation-nexus',
    title: 'Instalación vía Imagen ISO',
    icon: Disc,
    category: 'INFRAESTRUCTURA',
    summary: 'Despliegue del sistema operativo pre-configurado mediante imagen ISO.',
    functionality: 'Proporciona una imagen de Debian 12 con todos los componentes de CUBERBOX Nexus Core pre-instalados y listos para el primer arranque.',
    usage: 'Ideal para despliegues masivos en hardware físico donde se busca consistencia total.',
    steps: [
      { title: 'Paso 1: Descargar ISO', desc: 'Obtenga la última versión de la ISO desde el portal de soporte de CUBERBOX Nexus Core.' },
      { title: 'Paso 2: Crear Medio de Arranque', desc: 'Use herramientas como Rufus o BalenaEtcher para grabar la ISO en un pendrive USB.' },
      { title: 'Paso 3: Instalación Desatendida', desc: 'Arranque el servidor desde el USB. El instalador automático particionará el disco y configurará el entorno.' },
      { title: 'Paso 4: Post-Instalación', desc: 'Al terminar, retire el USB y reinicie. El sistema estará listo en la IP asignada por DHCP.' }
    ],
    image: 'https://picsum.photos/seed/iso/1200/600'
  },
  {
    id: 'erp-crm-advanced-sync',
    title: 'Sincronización Avanzada ERP/CRM',
    icon: Network,
    category: 'ADMINISTRACIÓN',
    summary: 'Integración profunda con sistemas SAP, Odoo y Microsoft Dynamics.',
    functionality: 'Habilita flujos de datos bidireccionales complejos, permitiendo que CUBERBOX Nexus Core actualice inventarios o estados de pedidos directamente en el ERP durante la llamada.',
    usage: 'Configure los conectores específicos para su sistema de gestión empresarial.',
    steps: [
      { title: 'Paso 1: Configurar API Endpoints', desc: 'Defina las URLs de la API de su ERP/CRM y las credenciales de autenticación (OAuth2/API Key).' },
      { title: 'Paso 2: Mapeo de Objetos', desc: 'Vincule los campos de CUBERBOX Nexus Core con los objetos del ERP (ej. Lead -> Odoo Opportunity).' },
      { title: 'Paso 3: Flujos de Automatización', desc: 'Cree reglas: "Si la llamada termina en Venta, crear Factura en SAP automáticamente".' },
      { title: 'Paso 4: Logs de Sincronización', desc: 'Monitoree el panel de integraciones para asegurar que no haya errores de comunicación entre sistemas.' }
    ],
    image: 'https://picsum.photos/seed/erp/1200/600'
  }
];

const UserManual: React.FC = () => {
  // Initialized useToast hook
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<ManualEntry | null>(MANUAL_DATABASE[0]);

  const filteredManual = useMemo(() => {
    if (!searchQuery) return MANUAL_DATABASE;
    return MANUAL_DATABASE.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.functionality.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3 bg-blue-500/10 border border-blue-500/20 px-6 py-2.5 rounded-full mb-2">
          <Sparkles size={18} className="text-blue-400 animate-pulse" />
          <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em]">CUBERBOX Knowledge Base v4.7.9</span>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">Manual de Operación Crítica</h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto font-bold uppercase tracking-widest">Documentación exhaustiva para administradores y operadores de alto rendimiento.</p>
        <div className="relative max-w-2xl mx-auto mt-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
          <input 
            type="text"
            placeholder="Buscar por componente (Hopper, Dialer, Verto, Gemini)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-[32px] pl-16 pr-12 py-6 text-base text-white outline-none focus:border-blue-500 transition-all shadow-inner font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10 flex-1 min-h-0">
        {/* Sidebar de Navegación */}
        <div className="col-span-12 lg:col-span-4 space-y-8 overflow-y-auto scrollbar-hide pr-2">
           {['OPERACIONES', 'AI & NEURAL', 'INFRAESTRUCTURA', 'ADMINISTRACIÓN'].map(cat => {
             const items = filteredManual.filter(e => e.category === cat);
             if (items.length === 0) return null;
             return (
               <div key={cat} className="space-y-4">
                  <div className="flex items-center space-x-3 px-4">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">{cat}</h4>
                  </div>
                  <div className="space-y-2">
                     {items.map(entry => (
                       <button
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className={`w-full flex items-center p-5 rounded-[28px] border-2 transition-all relative overflow-hidden group ${
                          selectedEntry?.id === entry.id ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'glass border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                        }`}
                       >
                          <div className={`p-3 rounded-2xl mr-5 transition-all ${selectedEntry?.id === entry.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-600 group-hover:text-blue-400'}`}>
                             <entry.icon size={22} />
                          </div>
                          <div className="text-left min-w-0">
                            <span className={`text-[12px] font-black uppercase tracking-widest block truncate ${selectedEntry?.id === entry.id ? 'text-white' : 'text-slate-400'}`}>{entry.title}</span>
                            <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest truncate">{entry.summary.slice(0, 40)}...</span>
                          </div>
                          {selectedEntry?.id === entry.id && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                       </button>
                     ))}
                  </div>
               </div>
             );
           })}
        </div>

        {/* Contenido Detallado */}
        <div className="col-span-12 lg:col-span-8 h-full">
           {selectedEntry ? (
             <div className="glass h-full rounded-[64px] border border-slate-700/50 shadow-2xl overflow-y-auto scrollbar-hide p-14 space-y-12 animate-in slide-in-from-right-10 duration-500 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.03),_transparent)]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-10">
                   <div className="flex items-center space-x-8">
                      <div className="w-24 h-24 rounded-[36px] flex items-center justify-center shadow-2xl border-4 border-white/5 bg-blue-600 text-white transform -rotate-3 group-hover:rotate-0 transition-transform">
                          <selectedEntry.icon size={48} />
                      </div>
                      <div>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-3 block">{selectedEntry.category}</span>
                          <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{selectedEntry.title}</h2>
                      </div>
                   </div>
                   <div className="text-right hidden xl:block">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol ID</p>
                      <p className="text-xs font-mono font-black text-slate-400 mt-1">{selectedEntry.id}</p>
                   </div>
                </div>

                <section className="space-y-6">
                   <div className="flex items-center space-x-4">
                      <Info className="text-blue-400" size={24} />
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Funcionalidad del Componente</h3>
                   </div>
                   <p className="text-lg text-slate-400 leading-relaxed font-medium bg-slate-900/40 p-8 rounded-[40px] border border-slate-800 shadow-inner">
                      {selectedEntry.functionality}
                   </p>
                </section>

                <section className="space-y-6">
                   <div className="flex items-center space-x-4">
                      <Smartphone className="text-emerald-400" size={24} />
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Guía de Manejo y Uso</h3>
                   </div>
                   <p className="text-base text-slate-400 leading-relaxed font-medium border-l-4 border-emerald-500 pl-8">
                      {selectedEntry.usage}
                   </p>
                </section>

                <div className="space-y-10">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center">
                     <ListChecks className="mr-4 text-amber-500" /> Secuencia Lógica Paso a Paso
                   </h3>
                   {selectedEntry.steps.map((step, i) => (
                      <div key={i} className="p-10 bg-slate-950 border border-slate-800 rounded-[48px] shadow-xl space-y-6 group hover:border-blue-500/30 transition-all">
                         <div className="flex items-center space-x-5">
                            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center font-black text-sm text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                               {i+1}
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tight">{step.title}</h4>
                         </div>
                         <p className="text-slate-500 font-medium pl-14 group-hover:text-slate-300 transition-colors">{step.desc}</p>
                         {step.code && (
                            <div className="mt-4 ml-14 bg-black rounded-3xl p-8 border border-slate-800 shadow-inner relative group/code">
                               <div className="flex justify-between items-center mb-5">
                                  <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Engine Logic / Configuration Script</span>
                                  <Code size={14} className="text-blue-500 opacity-40" />
                               </div>
                               <pre className="text-sm font-mono text-blue-400/90 overflow-x-auto scrollbar-hide"><code>{step.code}</code></pre>
                               <button onClick={() => { navigator.clipboard.writeText(step.code!); toast('Código copiado.', 'info'); }} className="absolute bottom-6 right-6 p-3 bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-all opacity-0 group-hover/code:opacity-100">
                                  <Copy size={16} />
                                </button>
                            </div>
                         )}
                      </div>
                   ))}
                </div>

                <div className="p-10 bg-blue-600/5 border border-blue-500/20 rounded-[48px] flex items-start space-x-8 group">
                   <div className="p-4 rounded-3xl bg-blue-600/10 text-blue-400 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={32} />
                   </div>
                   <div>
                      <h5 className="text-lg font-black text-white uppercase tracking-widest mb-2">Certificación de Integridad</h5>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-wider">
                         Esta documentación es generada dinámicamente y sincronizada con el <span className="text-blue-400">Core Engine v4.7.9</span>. Cualquier discrepancia técnica debe ser reportada al administrador del clúster inmediatamente.
                      </p>
                   </div>
                </div>

                {selectedEntry.image && (
                  <div className="mt-12 rounded-[48px] overflow-hidden border border-slate-800 shadow-2xl">
                    <img 
                      src={selectedEntry.image} 
                      alt={selectedEntry.title} 
                      className="w-full h-auto object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                <BookOpen size={120} className="mb-8" />
                <h3 className="text-3xl font-black uppercase tracking-[0.4em]">Wiki CUBERBOX Nexus Pro</h3>
             </div>
           )}
        </div>
      </div>
      
      <footer className="mt-20 pt-10 border-t border-slate-800 text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">C</div>
          <span className="text-2xl font-black text-white uppercase tracking-tighter">CUBERBOX</span>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">
          © 2026 CUBERBOX Systems • Todos los derechos reservados • CUBERBOX Nexus Core v4.7.9
        </p>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
          Este documento contiene información confidencial y propietaria de CUBERBOX. El acceso no autorizado, reproducción o distribución está estrictamente prohibido y sujeto a acciones legales internacionales.
        </p>
      </footer>
    </div>
  );
};

export default UserManual;
