#!/bin/bash

# =============================================================================
# CUBERBOX PRO - FREESWITCH NEXUS INSTALLER V4.7.9
# Soporte: Debian 11 (Bullseye) / Debian 12 (Bookworm)
# Reference: PieceByte Architecture Standard (blog.piecebyte.com)
# =============================================================================

set -e

# Estética de Terminal
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

clear
echo -e "${BOLD}${BLUE}"
echo "   ____________  __________  ____  ____ _  __"
echo "  / ____/ / / / __ ) ____/ __ \/ __ )/ __ \ |/ /"
echo " / /   / / / / __  / __/ / /_/ / __  / / / /   / "
echo "/ /___/ /_/ / /_/ / /___/ _, _/ /_/ / /_/ /   |  "
echo "\____/\____/_____/_____/_/ |_/_____/\____/_/|_|  "
echo -e "          NEXUS CORE ENGINE v4.7.9 (FreeSwitch 1.10)${NC}\n"

# 1. Validación de Root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[ERROR] Este script debe ejecutarse como ROOT.${NC}"
   exit 1
fi

# 2. Captura de Token de SignalWire (Requerido para Repo Oficial)
echo -e "${CYAN}[REQ] Por favor, ingresa tu Token Personal de SignalWire.${NC}"
echo -e "Consíguelo en: https://dashboard.signalwire.com"
read -p "Token (PAT): " SW_TOKEN

if [ -z "$SW_TOKEN" ]; then
    echo -e "${RED}[FATAL] El Token es obligatorio para descargar los binarios oficiales.${NC}"
    exit 1
fi

# 3. Detección de Versión de Debian
OS_VER=$(lsb_release -sc)
echo -e "${GREEN}[SYSTEM] Detectado Debian: ${OS_VER}${NC}"

# 4. Configuración de Repositorios SignalWire
echo -e "${BLUE}[1/5] Configurando repositorio oficial de FreeSwitch 1.10...${NC}"
echo "machine assignments.signalwire.com login signalwire password $SW_TOKEN" > /etc/apt/auth.conf.d/signalwire.conf
wget --http-user=signalwire --http-password=$SW_TOKEN -O - https://assignments.signalwire.com/reference/gpg/signalwire_pub.gpg | apt-key add -
echo "deb https://assignments.signalwire.com/reference/debian/$(lsb_release -sc) release main" > /etc/apt/sources.list.d/freeswitch.list

# 5. Instalación de Dependencias (Manual PieceByte)
echo -e "${BLUE}[2/5] Instalando dependencias de sistema y librerías de medios...${NC}"
apt-get update && apt-get install -y \
    gnupg2 wget lsb-release curl software-properties-common \
    build-essential cmake automake autoconf libtool libtool-bin \
    pkg-config libssl-dev zlib1g-dev libdb-dev libncurses5-dev \
    libsqlite3-dev libcurl4-openssl-dev libpcre3-dev libspeex-dev \
    libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev \
    libopus-dev libsndfile1-dev libshout3-dev libmpg123-dev \
    libavformat-dev libswscale-dev libavresample-dev python3-dev \
    libks-dev signalwire-client-c-dev

# 6. Instalación de FreeSwitch Core y Módulos ESL/Verto
echo -e "${BLUE}[3/5] Descargando e instalando FreeSwitch Engine...${NC}"
apt-get install -y freeswitch-all freeswitch-mod-esl freeswitch-mod-verto

# 7. Aprovisionamiento ESL y Seguridad (Puerto 8021)
echo -e "${BLUE}[4/5] Configurando Event Socket Layer (ESL)...${NC}"
ESL_PASS=$(openssl rand -base64 12)
cat <<EOF > /etc/freeswitch/autoload_configs/event_socket.conf.xml
<configuration name="event_socket.conf" description="Socket Client">
  <settings>
    <param name="listen-ip" value="0.0.0.0"/>
    <param name="listen-port" value="8021"/>
    <param name="password" value="$ESL_PASS"/>
  </settings>
</configuration>
EOF

# 8. Instalación de PostgreSQL 16
echo -e "${BLUE}[5/5] Instalando PostgreSQL 16 para Data Plane...${NC}"
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt-get update && apt-get install -y postgresql-16
sudo -u postgres psql -c "CREATE USER cuberbox_admin WITH PASSWORD 'TitanPass2024!';" || true
sudo -u postgres psql -c "CREATE DATABASE cuberbox_db OWNER cuberbox_admin;" || true

# 9. Finalización y Resumen
systemctl restart freeswitch
systemctl enable freeswitch

echo -e "\n${BOLD}${GREEN}===================================================="
echo "   CUBERBOX PRO v4.7.9 INSTALADO CORRECTAMENTE"
echo "===================================================="
echo -e "${NC}"
echo -e "ESL Port: ${BOLD}8021${NC}"
echo -e "ESL Secret: ${BOLD}$ESL_PASS${NC}"
echo -e "WebRTC WSS: ${BOLD}8089${NC}"
echo -e "SIP Port: ${BOLD}5060${NC}"
echo -e "\nConfiguración completada bajo estándares de PieceByte."
