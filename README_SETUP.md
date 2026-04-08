# 🚀 CUBERBOX Nexus Core - Nexus Cluster Orchestrator

Este instalador avanzado permite desplegar **CUBERBOX Nexus Core** tanto en un solo servidor como en una arquitectura distribuida (Clúster).

## 🛠 Modos de Instalación

### 1. Standalone (Local)
Ideal para desarrollo o servidores pequeños. Instala todos los componentes (DB, Web, FreeSwitch) en la máquina actual.

### 2. Cluster Orchestrator
Actúa como el cerebro del despliegue. 
- Permite definir la topología del clúster.
- Calcula automáticamente la cantidad de nodos de **FreeSwitch** necesarios según la cantidad de agentes (1 nodo por cada 500 agentes).
- Coordina la instalación en servidores remotos.

### 3. Node Agent
Este modo se debe ejecutar directamente en los servidores que formarán parte del clúster. Permite instalar únicamente el componente necesario:
- **Database Node**: Configura PostgreSQL.
- **Web Node**: Configura la aplicación CUBERBOX Nexus.
- **Media Node**: Configura FreeSwitch.

### 4. Auditoría de Conectividad
Una fase de verificación post-instalación que realiza pruebas de "handshake" (TCP) a todos los nodos definidos para asegurar que el clúster está operativo.

### 5. Datos de Producción
El instalador ahora incluye una opción para cargar datos iniciales de producción (`setup/seed_production.sql`), que incluye:
- Usuario administrador por defecto (`admin` / `admin123`).
- Campaña de bienvenida pre-configurada.
- Nodo de telefonía maestro local.
- Mensajes de sistema iniciales.

## 📋 Requisitos Previos
- Acceso SSH entre nodos (recomendado llaves SSH).
- Puertos abiertos:
  - **5432**: PostgreSQL
  - **3000**: CUBERBOX Nexus Web/API
  - **8021**: FreeSwitch ESL

## 🚀 Ejecución

```bash
chmod +x setup.sh
./setup.sh
```

## 📂 Estructura de Archivos
- `setup.sh`: Orquestador principal.
- `setup/standalone.sh`: Script de instalación local.
- `setup/node_agent.sh`: Script para nodos remotos.
- `cluster_setup.log`: Registro detallado de todas las operaciones.

---
**CUBERBOX Nexus Intelligence Center v4.7.9** - *Transformando la comunicación omnicanal.*
