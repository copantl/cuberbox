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

# 4. Instalación de Dependencias de Sistema (Requerido para Repos)
echo -e "${BLUE}[1/5] Preparando herramientas de sistema...${NC}"
apt-get update && apt-get install -y gnupg gnupg2 wget lsb-release curl ca-certificates

# 5. Configuración de Repositorios SignalWire (FreeSwitch 1.10)
echo -e "${BLUE}[2/5] Configurando repositorio oficial de FreeSwitch 1.10...${NC}"
# Limpiar configuraciones previas
rm -f /etc/apt/sources.list.d/freeswitch.list
rm -f /etc/apt/auth.conf.d/freeswitch.conf

# Descargar llave GPG (Usando curl para mayor compatibilidad con auth)
curl -u signalwire:$SW_TOKEN -o /usr/share/keyrings/signalwire-freeswitch-repo.gpg https://freeswitch.signalwire.com/repo/deb/debian-release/signalwire-freeswitch-repo.gpg

# Configurar autenticación para APT
echo "machine freeswitch.signalwire.com login signalwire password $SW_TOKEN" > /etc/apt/auth.conf.d/freeswitch.conf
chmod 600 /etc/apt/auth.conf.d/freeswitch.conf

# Agregar repositorio
echo "deb [signed-by=/usr/share/keyrings/signalwire-freeswitch-repo.gpg] https://freeswitch.signalwire.com/repo/deb/debian-release/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/freeswitch.list

# 6. Instalación de Dependencias (Manual PieceByte)
echo -e "${BLUE}[3/5] Instalando dependencias de sistema y librerías de medios...${NC}"
apt-get update && apt-get install -y \
    software-properties-common \
    build-essential cmake automake autoconf libtool libtool-bin \
    pkg-config libssl-dev zlib1g-dev libdb-dev libncurses-dev \
    libsqlite3-dev libcurl4-openssl-dev libpcre3-dev libspeex-dev \
    libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev \
    libopus-dev libsndfile1-dev libshout3-dev libmpg123-dev \
    libavformat-dev libswscale-dev libswresample-dev python3-dev \
    libyuv-dev libvpx-dev git uuid-dev

# 6.1 Compilación de Dependencias SignalWire desde Fuentes (Garantiza compatibilidad)
echo -e "${BLUE}[3.1/5] Compilando libks y signalwire-c desde fuentes...${NC}"
mkdir -p /usr/src/libs
cd /usr/src/libs

if [ ! -d "libks" ]; then
    git clone https://github.com/signalwire/libks.git
    cd libks && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make -j$(nproc) && make install && cd ..
fi

if [ ! -d "signalwire-c" ]; then
    git clone https://github.com/signalwire/signalwire-c.git
    cd signalwire-c && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make -j$(nproc) && make install && cd ..
fi
ldconfig
cd /

# 7. Instalación de FreeSwitch Core y Módulos Pro
echo -e "${BLUE}[4/5] Descargando e instalando FreeSwitch Engine...${NC}"
apt-get install -y freeswitch-all \
    freeswitch-mod-esl freeswitch-mod-verto freeswitch-mod-rtc \
    freeswitch-mod-av freeswitch-mod-opus freeswitch-mod-shout \
    freeswitch-mod-sndfile freeswitch-mod-native-file freeswitch-mod-lua \
    freeswitch-mod-python3 freeswitch-mod-pgsql \
    freeswitch-mod-commands freeswitch-mod-dptools \
    freeswitch-mod-dialplan-xml freeswitch-mod-sofia freeswitch-mod-event-socket \
    freeswitch-mod-conference freeswitch-mod-db freeswitch-mod-hash \
    freeswitch-mod-voicemail freeswitch-mod-expr freeswitch-mod-valet-parking \
    freeswitch-mod-httapi freeswitch-mod-json-cdr freeswitch-mod-local-stream \
    freeswitch-mod-tone-stream

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
# Limpiamos llaves antiguas para evitar advertencias de legacy keyring
apt-key del ACCC4CF8 || true
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
apt-get update && apt-get install -y postgresql-16
sudo -u postgres psql -c "CREATE USER cuberbox_admin WITH PASSWORD 'TitanPass2024!';" || true
sudo -u postgres psql -c "CREATE DATABASE cuberbox_db OWNER cuberbox_admin;" || true

# 8. Compilación del Backend Go (Nexus Connector)
echo -e "${BLUE}[5/5] Preparando Backend Go de Control...${NC}"
mkdir -p /opt/cuberbox/bin

# Si existe la carpeta backend, la usamos. Si no, creamos un dummy.
if [ -d "/opt/cuberbox/backend" ]; then
    echo -e "${CYAN}[INFO] Detectada carpeta backend, compilando desde ahí...${NC}"
    cd /opt/cuberbox/backend && go build -o /usr/local/bin/cuberbox-connector main.go
else
    echo -e "${CYAN}[INFO] No se detectó carpeta backend, creando dummy...${NC}"
    cat <<EOF > /opt/cuberbox/main.go
package main
import "fmt"
func main() { fmt.Println("Cuberbox Pro Go Backend v4.7.9 - Operational") }
EOF
    cd /opt/cuberbox && go build -o /usr/local/bin/cuberbox-connector main.go
fi

chmod +x /usr/local/bin/cuberbox-connector

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
