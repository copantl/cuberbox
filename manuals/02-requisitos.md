# 02. Requisitos del Sistema

Antes de iniciar la instalación de Nexus Core, asegúrese de que su servidor cumpla con los siguientes requisitos mínimos y recomendados.

## Hardware Recomendado

| Componente | Mínimo | Recomendado |
| :--- | :--- | :--- |
| **CPU** | 2 Cores (Intel/AMD) | 4+ Cores (Xeon/EPYC) |
| **RAM** | 4 GB | 8 GB+ |
| **Disco** | 20 GB SSD | 100 GB+ NVMe |
| **Red** | 100 Mbps | 1 Gbps |

## Sistema Operativo

Nexus Core está optimizado exclusivamente para:
- **Debian 12 (Bookworm)**: Instalación limpia (netinst recomendada).

## Requisitos de Red y Firewall

Nexus Core requiere que los siguientes puertos estén abiertos para su correcto funcionamiento:

- **80/443 (TCP)**: Interfaz Web (HTTP/HTTPS).
- **5060/5061 (TCP/UDP)**: Señalización SIP (SIP/SIPS).
- **16384-32768 (UDP)**: Tráfico de Audio (RTP).
- **8021 (TCP)**: FreeSwitch Event Socket (ESL).
- **5432 (TCP)**: Base de Datos PostgreSQL (si es externa).

## Credenciales Externas

Para habilitar todas las funcionalidades, necesitará:
- **SignalWire PAT**: Token de acceso personal para el motor de telefonía.
- **Gemini API Key**: Para transcripción y análisis de IA.
- **Meta App ID/Secret**: Para integración con WhatsApp y Facebook.
