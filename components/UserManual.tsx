
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Terminal, Cpu, ShieldCheck, Globe, Sliders, Bot, Users, 
  Database, HardDrive, Search, ChevronRight, X, Info, Zap, Shield, 
  Sparkles, Network, Layers, Smartphone, Box, Server, Key, History,
  Trash2, Lock, Activity, FileText, Code, CheckCircle2, AlertCircle,
  Play, Headphones, TerminalSquare, GitMerge, MessageCircle, Share2,
  Music, Smartphone as PhoneIcon, BarChart3, Target, Mic, PhoneIncoming,
  ListChecks, Copy, Settings, PieChart, Filter, Mail, MessageSquare, 
  Workflow, Globe2, ShieldAlert, Layout
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
    ]
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
    ]
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
    ]
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
    ]
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
      { title: 'Paso 4: Auditoría de Logs', desc: 'Revise quién entró al sistema, desde qué IP y qué cambios realizó en la configuración.' }
    ]
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
      { title: 'Paso 1: Configuración de URL de Destino', desc: 'Ingrese la URL de su CRM donde Cuberbox debe enviar la información de las llamadas.' },
      { title: 'Paso 2: Mapeo de Campos', desc: 'Indique qué dato de Cuberbox (ej. Teléfono) corresponde a qué campo en su CRM.' },
      { title: 'Paso 3: Definición de Triggers', desc: 'Elija en qué momento enviar los datos: ¿Al iniciar la llamada o solo cuando se tipifica como "Venta"?' },
      { title: 'Paso 4: Prueba de Conectividad', desc: 'Use el botón de "Test" para verificar que su CRM está recibiendo los datos correctamente.' }
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
        code: 'systemctl status cuberbox-web\nsystemctl status cuberbox'
      }
    ]
  },
  {
    id: 'systemd-unit-creation',
    title: 'Creación de Servicios (Unit Files)',
    icon: FileText,
    category: 'ADMINISTRACIÓN',
    summary: 'Cómo crear manualmente los archivos .service si no existen.',
    functionality: 'Proporciona los comandos exactos para generar los archivos de configuración que systemd requiere para administrar Cuberbox como un servicio del sistema.',
    usage: 'Use esta guía si recibe el error "Unit file does not exist" al intentar usar systemctl.',
    steps: [
      { 
        title: 'Crear cuberbox-web.service', 
        desc: 'Ejecute este bloque completo para crear el servicio del servidor web (Puerto 3000).',
        code: 'cat <<EOF > /etc/systemd/system/cuberbox-web.service\n[Unit]\nDescription=Cuberbox Web Interface\nAfter=network.target\n\n[Service]\nType=simple\nWorkingDirectory=/opt/cuberbox\nExecStart=/usr/bin/npm run dev -- --host 0.0.0.0\nRestart=always\nEnvironment=NODE_ENV=production\n\n[Install]\nWantedBy=multi-user.target\nEOF'
      },
      { 
        title: 'Crear cuberbox-connector.service', 
        desc: 'Ejecute este bloque para crear el servicio del motor de eventos (Puerto 8021).',
        code: 'cat <<EOF > /etc/systemd/system/cuberbox.service\n[Unit]\nDescription=Cuberbox Pro Connector\nAfter=network.target freeswitch.service\n\n[Service]\nType=simple\nWorkingDirectory=/opt/cuberbox\nExecStart=/usr/local/bin/cuberbox-connector\nRestart=always\n\n[Install]\nWantedBy=multi-user.target\nEOF'
      },
      { 
        title: 'Activar Servicios', 
        desc: 'Después de crear los archivos, ejecute estos comandos para ponerlos en marcha.',
        code: 'systemctl daemon-reload\nsystemctl enable --now cuberbox-web\nsystemctl enable --now cuberbox'
      }
    ]
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
        desc: 'Una vez que funcione manualmente, asegúrese de que el servicio cuberbox-web esté activo para que inicie con el servidor.',
        code: 'systemctl daemon-reload && systemctl enable --now cuberbox-web'
      }
    ]
  },
  {
    id: 'troubleshooting-service',
    title: 'Resolución de Errores: Systemd',
    icon: ShieldAlert,
    category: 'ADMINISTRACIÓN',
    summary: 'Guía para corregir fallos de inicio del servicio (Error 203/EXEC).',
    functionality: 'Explica cómo diagnosticar y reparar el error 203/EXEC que ocurre cuando el binario del conector no es ejecutable o no existe en la ruta /usr/local/bin.',
    usage: 'Si el comando "systemctl status cuberbox" muestra un error en rojo, siga estos pasos para restaurar el servicio.',
    steps: [
      { 
        title: 'Paso 1: Verificar Existencia del Binario', 
        desc: 'Asegúrese de que el archivo realmente exista en la ruta. Si no aparece, el proceso de compilación falló.',
        code: 'ls -lh /usr/local/bin/cuberbox-connector'
      },
      { 
        title: 'Paso 2: Corregir Permisos de Ejecución', 
        desc: 'A veces el archivo se copia pero pierde el bit de ejecución. Este comando le otorga los permisos necesarios.',
        code: 'chmod +x /usr/local/bin/cuberbox-connector'
      },
      { 
        title: 'Paso 3: Recompilar el Conector (Si no existe)', 
        desc: 'Si el binario falta, debe entrar a la carpeta del backend y volver a generarlo con Go.',
        code: 'cd /opt/cuberbox/backend\ngo build -o cuberbox-connector main.go\ncp cuberbox-connector /usr/local/bin/\nsystemctl restart cuberbox'
      },
      { 
        title: 'Paso 4: Verificar Logs del Sistema', 
        desc: 'Si el error persiste, revise los mensajes detallados del kernel para ver si falta alguna librería.',
        code: 'journalctl -u cuberbox.service -f'
      }
    ]
  },
  {
    id: 'network-ports-matrix',
    title: 'Matriz de Puertos y Red',
    icon: Globe2,
    category: 'INFRAESTRUCTURA',
    summary: 'Configuración de Firewall y conectividad requerida para el ecosistema Nexus.',
    functionality: 'Detalla los puertos lógicos que deben estar abiertos en el Firewall perimetral y del servidor para permitir el tráfico de señalización SIP, medios RTP y gestión de datos.',
    usage: 'Asegúrese de que su proveedor de red o administrador de IT habilite estos puertos para evitar llamadas sin audio o errores de conexión en la terminal.',
    steps: [
      { title: 'Señalización SIP (5060-5061)', desc: 'Puerto 5060 (UDP/TCP) para tráfico estándar y 5061 (TLS) para tráfico encriptado. Vital para el registro de teléfonos físicos y troncales.' },
      { title: 'WebRTC Verto (8081-8082)', desc: 'Puertos seguros (WSS) utilizados por la terminal del agente en el navegador. Deben estar abiertos para que el "Anclaje de Audio" funcione.' },
      { title: 'Rango de Medios RTP (16384-32768)', desc: 'Rango UDP masivo para el transporte de la voz. Si estos puertos están cerrados, las llamadas se conectarán pero no habrá audio (One-way audio).' },
      { title: 'Gestión y Datos (3000, 5432, 8021)', desc: '3000: Interfaz Web Cuberbox. 5432: Base de Datos PostgreSQL. 8021: Event Socket Layer (ESL) para control del motor desde el backend.' }
    ]
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
    ]
  },
  {
    id: 'ai-studio-gemini',
    title: 'AI Studio & Coaching',
    icon: Bot,
    category: 'AI & NEURAL',
    summary: 'Integración de Gemini 3 Pro para análisis semántico y asistencia en vivo.',
    functionality: 'Utiliza modelos LLM para auditar el 100% de las grabaciones, detectar sentimientos, extraer compromisos de pago y sugerir respuestas al agente en el Hub Omnicanal.',
    usage: 'Configure su asistente virtual para que aprenda sobre su negocio y ayude a sus agentes a cerrar más ventas.',
    steps: [
      { title: 'Paso 1: Definir la Personalidad de la IA', desc: 'En el AI Studio, escriba las instrucciones del sistema. Dígale a la IA quién es (ej: "Eres un experto en ventas inmobiliarias") y qué debe buscar en las llamadas.' },
      { title: 'Paso 2: Configurar Reglas de Evaluación', desc: 'Indique qué criterios debe calificar la IA: ¿El agente saludó correctamente? ¿Mencionó el precio? ¿Fue amable?' },
      { title: 'Paso 3: Revisión de Sentimientos', desc: 'Acceda al panel de analítica para ver el "clima" de sus llamadas. La IA marcará en rojo las conversaciones donde el cliente se notó molesto para que usted pueda intervenir.' },
      { title: 'Paso 4: Uso de Sugerencias en Vivo', desc: 'Active la asistencia para agentes. Mientras chatean por WhatsApp, la IA les sugerirá la mejor respuesta basada en el historial de la conversación.' }
    ]
  },
  {
    id: 'manual-installation-nexus',
    title: 'Guía de Instalación Manual',
    icon: TerminalSquare,
    category: 'ADMINISTRACIÓN',
    summary: 'Procedimiento paso a paso para el despliegue de la infraestructura Nexus desde cero.',
    functionality: 'Esta guía detalla la secuencia técnica necesaria para instalar FreeSwitch 1.10, PostgreSQL 16 y el stack de alta disponibilidad en servidores Debian 12/13 limpios.',
    usage: 'Esta guía es para técnicos. Siga cada paso con calma. Si un comando falla, no continúe al siguiente sin resolver el error.',
    steps: [
      { 
        title: 'Paso 0: Limpieza (Solo si tiene errores)', 
        desc: 'Si recibió errores de "Tipo echo desconocido", ejecute este comando para limpiar los archivos corruptos antes de continuar.',
        code: 'rm -f /etc/apt/sources.list.d/freeswitch.list /etc/apt/sources.list.d/pgdg.list && apt-get update'
      },
      { 
        title: 'Paso 1: Preparar el Terreno', 
        desc: 'Primero, debemos limpiar y preparar el servidor con todas las herramientas básicas que FreeSwitch necesitará.',
        code: 'apt-get update && apt-get install -y gnupg2 wget lsb-release curl build-essential cmake automake autoconf libtool libtool-bin pkg-config libssl-dev zlib1g-dev libdb-dev libncurses5-dev libsqlite3-dev libcurl4-openssl-dev libpcre3-dev libspeex-dev libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev libopus-dev libsndfile1-dev libshout3-dev libmpg123-dev python3-dev git golang-go haproxy keepalived'
      },
      { 
        title: 'Paso 2: Conectar con SignalWire', 
        desc: 'FreeSwitch requiere un token oficial para descargar sus archivos. Ingrese su token donde dice [TOKEN]. Esto le da acceso a la versión más estable y segura.',
        code: 'wget --http-user=signalwire --http-password=[TOKEN] -O - https://assignments.signalwire.com/reference/gpg/signalwire_pub.gpg | gpg --dearmor -o /usr/share/keyrings/signalwire-freeswitch-repo.gpg\necho "deb [signed-by=/usr/share/keyrings/signalwire-freeswitch-repo.gpg] https://signalwire:[TOKEN]@assignments.signalwire.com/reference/debian/$(lsb_release -sc) release main" | tee /etc/apt/sources.list.d/freeswitch.list > /dev/null\nwget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg\necho "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list > /dev/null'
      },
      { 
        title: 'Paso 3: Instalación del Corazón del Sistema', 
        desc: 'Ahora instalamos las librerías de SignalWire, el motor de llamadas FreeSwitch y PostgreSQL.',
        code: 'apt-get update && apt-get install -y libks-dev signalwire-client-c-dev freeswitch-all freeswitch-mod-esl freeswitch-mod-verto postgresql-16'
      },
      { 
        title: 'Paso 4: Configurar la Base de Datos', 
        desc: 'Creamos un usuario y una base de datos segura. Piense en esto como crear la oficina donde el sistema guardará todos sus archivos importantes.',
        code: 'sudo -u postgres psql -c "CREATE USER cuberbox_admin WITH PASSWORD \'TitanPass2024!\';" \nsudo -u postgres psql -c "CREATE DATABASE cuberbox_db OWNER cuberbox_admin;"'
      },
      { 
        title: 'Paso 5: Seguridad SSL (El Candado)', 
        desc: 'Para que las llamadas por navegador funcionen, necesitamos certificados de seguridad. Esto encripta la voz para que nadie pueda escucharla externamente.',
        code: 'mkdir -p /etc/freeswitch/tls\nopenssl req -x509 -nodes -days 3650 -newkey rsa:4096 -keyout /etc/freeswitch/tls/wss.key -out /etc/freeswitch/tls/wss.crt -subj "/C=US/ST=Tech/L=Cloud/O=Cuberbox/CN=sip.tu-dominio.com"\ncat /etc/freeswitch/tls/wss.crt /etc/freeswitch/tls/wss.key > /etc/freeswitch/tls/wss.pem\nchown -R freeswitch:freeswitch /etc/freeswitch/tls'
      },
      { 
        title: 'Paso 6: Alta Disponibilidad (El Respaldo)', 
        desc: 'Configuramos un sistema que vigila el servidor. Si algo falla, el sistema de respaldo toma el control automáticamente sin que usted lo note.',
        code: 'mkdir -p /etc/keepalived\ncat <<EOF > /etc/keepalived/keepalived.conf\nvrrp_instance VI_1 {\n    state MASTER\n    interface eth0\n    virtual_router_id 51\n    priority 150\n    advert_int 1\n    authentication {\n        auth_type PASS\n        auth_pass nexus_ha_key\n    }\n    virtual_ipaddress {\n        192.168.1.100\n    }\n}\nEOF'
      },
      {
        title: 'Paso 7: Instalación del Aplicativo Web (Puerto 3000)',
        desc: 'Para que la interfaz sea accesible, debemos levantar el servidor Node.js. Esto habilitará el puerto 3000 que usted reportó como cerrado.',
        code: '# 1. Instalar dependencias\ncd /opt/cuberbox\nnpm install\n\n# 2. Construir el sitio\nnpm run build\n\n# 3. Crear servicio para el Web Server\ncat <<EOF > /etc/systemd/system/cuberbox-web.service\n[Unit]\nDescription=Cuberbox Web Interface\nAfter=network.target\n\n[Service]\nType=simple\nWorkingDirectory=/opt/cuberbox\nExecStart=/usr/bin/npm run dev\nRestart=always\nEnvironment=NODE_ENV=production\n\n[Install]\nWantedBy=multi-user.target\nEOF\n\n# 4. Activar y verificar\nsystemctl enable --now cuberbox-web\nsystemctl status cuberbox-web'
      },
      {
        title: 'Paso 8: Verificación de Puertos',
        desc: 'Una vez activados ambos servicios, verifique que los puertos 3000 (Web) y 8021 (ESL) estén en estado LISTEN.',
        code: 'netstat -tulpn | grep -E "3000|8021"'
      }
    ]
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
          <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em]">Nexus Knowledge Base v4.7.9</span>
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
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                <BookOpen size={120} className="mb-8" />
                <h3 className="text-3xl font-black uppercase tracking-[0.4em]">Wiki Nexus Pro</h3>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UserManual;
