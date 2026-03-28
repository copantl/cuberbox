
import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Zap, 
  Users, 
  Globe, 
  Server,
  MessageSquare,
  Phone,
  Mail,
  BarChart3,
  Settings,
  Download,
  Printer
} from 'lucide-react';
import { motion } from 'motion/react';

const RequirementsSpec: React.FC = () => {
  const sections = [
    {
      title: "1. Descripción General del Producto",
      icon: Globe,
      content: "Cuberbox Pro es un motor de medios avanzado y una plataforma de Contact Center omnicanal diseñada para operaciones de alta densidad. Integra telefonía IP (SIP), mensajería instantánea (WhatsApp), correo electrónico y herramientas de inteligencia artificial en una única interfaz unificada."
    },
    {
      title: "2. Requerimientos Funcionales",
      icon: CheckCircle2,
      subsections: [
        {
          name: "Motor de Telefonía (SIP/VoIP)",
          items: [
            "Integración con FreeSwitch 1.10 compilado desde fuentes.",
            "Soporte para WebRTC (WSS) con encriptación SSL.",
            "Gestión de troncales SIP y proveedores de terminación.",
            "Diseñador de IVR visual con lógica de ramificación.",
            "Grabación de llamadas en alta fidelidad con almacenamiento centralizado."
          ]
        },
        {
          name: "Omnicanalidad",
          items: [
            "Integración con la API oficial de WhatsApp Business Cloud.",
            "Soporte para múltiples cuentas y números de teléfono.",
            "Integración de Email para campañas de marketing y soporte.",
            "Bandeja de entrada unificada para agentes con historial cruzado.",
            "Webhooks para recepción de mensajes en tiempo real."
          ]
        },
        {
          name: "Gestión de Campañas y Listas",
          items: [
            "Marcación predictiva, progresiva y manual.",
            "Gestión de listas de contactos con segmentación avanzada.",
            "Listas de No Llamar (DNC) globales y por campaña.",
            "Programación de horarios de marcación y reintentos."
          ]
        },
        {
          name: "Inteligencia Artificial",
          items: [
            "AI Studio para creación de flujos conversacionales inteligentes.",
            "Broadcast AI para campañas masivas con síntesis de voz.",
            "Análisis de sentimiento en tiempo real (opcional).",
            "Transcripción automática de llamadas."
          ]
        }
      ]
    },
    {
      title: "3. Requerimientos Técnicos (Stack)",
      icon: Cpu,
      subsections: [
        {
          name: "Frontend",
          items: [
            "React 18+ con TypeScript.",
            "Vite como herramienta de construcción.",
            "Tailwind CSS para diseño responsivo y moderno.",
            "Lucide React para iconografía.",
            "Framer Motion para animaciones fluidas."
          ]
        },
        {
          name: "Backend",
          items: [
            "Node.js 20 (LTS) con Express para la API principal.",
            "Go 1.22 para procesos de alta concurrencia y monitoreo de clúster.",
            "PostgreSQL 16 como base de datos relacional principal.",
            "Redis para gestión de colas y caché en tiempo real."
          ]
        },
        {
          name: "Infraestructura",
          items: [
            "Despliegue On-Premise optimizado para Debian 12 y Proxmox.",
            "Soporte nativo para Docker y Docker Compose.",
            "Alta Disponibilidad (HA) mediante Keepalived y IP Virtual.",
            "Gestión dinámica de clúster multi-nodo vía base de datos PostgreSQL.",
            "Servidor de almacenamiento dedicado para grabaciones y logs."
          ]
        }
      ]
    },
    {
      title: "4. Requerimientos de Interfaz Externa",
      icon: Zap,
      items: [
        "API RESTful para integraciones con terceros.",
        "Webhooks para notificaciones de eventos en tiempo real.",
        "Integración con CRMs externos (Salesforce, Zoho, HubSpot).",
        "Conectores para pasarelas de pago y servicios de SMS."
      ]
    },
    {
      title: "5. Requerimientos No Funcionales",
      icon: ShieldCheck,
      subsections: [
        {
          name: "Seguridad",
          items: [
            "Control de acceso basado en roles (RBAC) con niveles de 1 a 9.",
            "Encriptación de datos en tránsito (TLS/SSL).",
            "Auditoría de sistema completa (logs de acciones de usuario).",
            "Protección contra ataques de fuerza bruta y denegación de servicio."
          ]
        },
        {
          name: "Rendimiento y Escalabilidad",
          items: [
            "Capacidad para manejar más de 500 llamadas concurrentes por nodo.",
            "Latencia de interfaz inferior a 100ms.",
            "Soporte para clústeres de hasta 50 nodos.",
            "Recuperación ante desastres con conmutación por error en < 5 segundos."
          ]
        }
      ]
    }
  ];

  const generateTextContent = () => {
    let text = "CUBERBOX PRO - ESPECIFICACIÓN DE REQUERIMIENTOS\n";
    text += "==============================================\n\n";
    
    sections.forEach(section => {
      text += `${section.title}\n`;
      text += "-".repeat(section.title.length) + "\n";
      
      if (section.content) {
        text += `${section.content}\n\n`;
      }
      
      if (section.items) {
        section.items.forEach(item => {
          text += `* ${item}\n`;
        });
        text += "\n";
      }
      
      if (section.subsections) {
        section.subsections.forEach(sub => {
          text += `  > ${sub.name}\n`;
          sub.items.forEach(item => {
            text += `    - ${item}\n`;
          });
          text += "\n";
        });
      }
    });
    
    return text;
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([generateTextContent()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Requerimientos_Cuberbox_Pro.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printAsPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 print:p-0 print:m-0">
      <div className="flex items-center justify-between border-b border-white/10 pb-6 print:border-slate-200">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent print:text-slate-900 print:bg-none">
            Especificación de Requerimientos
          </h1>
          <p className="text-slate-400 mt-2 print:text-slate-600">Documentación técnica completa del sistema Cuberbox Pro</p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button 
            onClick={printAsPDF}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-white/5 transition-all flex items-center gap-2"
            title="Imprimir / Guardar como PDF"
          >
            <Printer className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">PDF</span>
          </button>
          <button 
            onClick={downloadAsText}
            className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
            title="Descargar como TXT"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Descargar</span>
          </button>
        </div>
        <div className="hidden print:block text-slate-400 text-xs">
          Generado por Cuberbox Pro System
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 print:gap-4">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 hover:border-orange-500/20 transition-all duration-300 print:bg-white print:border-slate-200 print:p-4 print:shadow-none print:text-slate-900"
          >
            <div className="flex items-center gap-4 mb-6 print:mb-2">
              <div className="p-3 bg-orange-500/10 rounded-xl print:hidden">
                <section.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white print:text-slate-900 print:text-xl">{section.title}</h2>
            </div>

            {section.content && (
              <p className="text-slate-300 leading-relaxed text-lg print:text-slate-700 print:text-sm">
                {section.content}
              </p>
            )}

            {section.items && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1 print:gap-1">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 print:text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-orange-500/50 mt-0.5 flex-shrink-0 print:w-3 print:h-3 print:text-orange-500" />
                    <span className="print:text-xs">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.subsections && (
              <div className="space-y-8 print:space-y-4">
                {section.subsections.map((sub, i) => (
                  <div key={i} className="space-y-4 print:space-y-1">
                    <h3 className="text-lg font-medium text-orange-400 flex items-center gap-2 print:text-orange-600 print:text-sm">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      {sub.name}
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-1 print:gap-1">
                      {sub.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-slate-400 text-sm print:text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-orange-500/40 mt-0.5 flex-shrink-0 print:w-3 print:h-3 print:text-orange-500" />
                          <span className="print:text-xs">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-orange-500/5 border border-orange-500/10 rounded-3xl p-8 text-center print:hidden">
        <h3 className="text-xl font-semibold text-white mb-2">¿Necesita más detalles técnicos?</h3>
        <p className="text-slate-400 mb-6">Consulte el manual de instalación para procedimientos específicos de despliegue.</p>
        <button 
          onClick={() => window.location.hash = '#/manual'}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all"
        >
          Ver Manual de Instalación
        </button>
      </div>
    </div>
  );
};

export default RequirementsSpec;
