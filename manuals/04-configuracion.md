# 04. Configuración Post-Instalación
## CUBERBOX NEXUS CORE v4.7.9 - AUTHORITY NODE

![Configuration Panel](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop)

Una vez instalado CUBERBOX Nexus Core, es necesario realizar algunas configuraciones básicas para que el sistema esté operativo.

## Configuración de Telefonía (ESL)

CUBERBOX Nexus Core se comunica con FreeSwitch mediante el Event Socket Layer (ESL).

1. **Host ESL**: Por defecto `127.0.0.1`.
2. **Puerto ESL**: Por defecto `8021`.
3. **Contraseña ESL**: Por defecto `ClueCon`.

Puede cambiar estos valores en la sección **Ajustes Core** del panel de administración.

## Configuración de Base de Datos (PostgreSQL)

CUBERBOX Nexus Core utiliza PostgreSQL para almacenar datos de campañas, agentes y registros de llamadas (CDR).

1. **Host DB**: Por defecto `localhost`.
2. **Nombre DB**: Por defecto `nexus_db`.
3. **Usuario DB**: Por defecto `nexus_admin`.
4. **Contraseña DB**: Por defecto `NexusPass2026!`.

## Certificados SSL (HTTPS)

Para habilitar WebRTC y seguridad en la interfaz web, se recomienda configurar un certificado SSL.

1. **Let's Encrypt**: CUBERBOX Nexus Core incluye una herramienta para generar certificados automáticamente.
2. **Certificados Propios**: Puede subir sus archivos `.crt` y `.key` en la sección de Ajustes.

## Configuración de Omnicanalidad

Para habilitar WhatsApp, TikTok y Facebook:

1. **WhatsApp**: Introduzca su `Phone Number ID` y `Access Token` de Meta.
2. **TikTok**: Configure su `Client Key` y `Client Secret` de TikTok Business.
3. **Facebook/Instagram**: Configure su `Page Access Token`.

No olvide configurar el **Webhook URL** en sus respectivos paneles de desarrollador para recibir mensajes en tiempo real.

© 2026 CUBERBOX Nexus Core. Todos los derechos reservados.
