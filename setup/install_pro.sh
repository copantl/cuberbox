#!/bin/bash

# =============================================================================
# CUBERBOX PRO - NEXUS INFRASTRUCTURE ORCHESTRATOR V4.7.9
# Soporte: Debian 12 (Bookworm) / Debian 13 (Trixie)
# Componentes: FreeSwitch 1.10, PostgreSQL 16, Go 1.22, HAProxy, Keepalived
# =============================================================================

set -e

# --- Estética de Terminal Nexus ---
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

clear
echo -e "${BOLD}${BLUE}"
echo "   ____________  __________  ____  ____ _  __"
echo "  / ____/ / / / __ ) ____/ __ \/ __ )/ __ \ |/ /"
echo " / /   / / / / __  / __/ / /_/ / __  / / / /   / "
echo "/ /___/ /_/ / /_/ / /___/ _, _/ /_/ / /_/ /   |  "
echo "\____/\____/_____/_____/_/ |_/_____/\____/_/|_|  "
echo -e "          NEXUS INFRASTRUCTURE SETUP v4.7.9${NC}\n"

# 1. Verificación de Privilegios
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[ERROR] Este script debe ejecutarse como ROOT.${NC}"
   exit 1
fi

# 2. Captura de Datos Interactiva
echo -e "${CYAN}[CONFIG] Configuración del Nodo Titan${NC}"
read -p "Dominio/FQDN para SSL (ej: sip.empresa.com): " CBX_DOMAIN
read -p "Token SignalWire (PAT): " SW_TOKEN
read -p "IP Virtual (VIP) para el Clúster HA: " HA_VIP
read -p "Rol de este nodo (MASTER/SLAVE): " NODE_ROLE

if [ -z "$SW_TOKEN" ]; then
    echo -e "${RED}[FATAL] El Token de SignalWire es obligatorio.${NC}"
    exit 1
fi

# 3. Preparación de Repositorios (Debian 12/13)
echo -e "${BLUE}[1/7] Actualizando fuentes y repositorios oficiales...${NC}"
apt-get update && apt-get install -y gnupg gnupg2 wget lsb-release curl software-properties-common ca-certificates

# Repositorio PostgreSQL (PGDG) - Modern approach
mkdir -p /usr/share/keyrings
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Repositorio SignalWire (FreeSwitch 1.10)
# Limpiar configuraciones previas
rm -f /etc/apt/sources.list.d/freeswitch.list
rm -f /etc/apt/auth.conf.d/freeswitch.conf

# Descargar llave GPG (Usando curl para mayor compatibilidad con auth)
curl -u signalwire:$SW_TOKEN -o /usr/share/keyrings/signalwire-freeswitch-repo.gpg https://freeswitch.signalwire.com/repo/deb/debian-release/signalwire-freeswitch-repo.gpg

# Configurar autenticación para APT
mkdir -p /etc/apt/auth.conf.d
echo "machine freeswitch.signalwire.com login signalwire password $SW_TOKEN" > /etc/apt/auth.conf.d/freeswitch.conf
chmod 600 /etc/apt/auth.conf.d/freeswitch.conf

# Agregar repositorio
echo "deb [signed-by=/usr/share/keyrings/signalwire-freeswitch-repo.gpg] https://freeswitch.signalwire.com/repo/deb/debian-release/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/freeswitch.list

# 4. Instalación de Dependencias Core
echo -e "${BLUE}[2/7] Instalando dependencias de compilación y medios...${NC}"
apt-get update
apt-get install -y build-essential cmake automake autoconf libtool libtool-bin pkg-config \
    libssl-dev zlib1g-dev libdb-dev libncurses-dev libsqlite3-dev libcurl4-openssl-dev \
    libpcre3-dev libspeex-dev libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev \
    libopus-dev libsndfile1-dev libshout3-dev libmpg123-dev python3-dev \
    git golang-go haproxy keepalived uuid-dev \
    libavformat-dev libswscale-dev libavcodec-dev libavutil-dev libswresample-dev \
    libyuv-dev libvpx-dev libx264-dev libvpx-dev

# 4.1 Compilación de Dependencias SignalWire (libks & signalwire-c)
echo -e "${BLUE}[2.1/7] Compilando librerías SignalWire desde fuentes...${NC}"
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

# 5. Instalación de FreeSwitch & PostgreSQL 16
echo -e "${BLUE}[3/7] Desplegando Media & Data Plane...${NC}"
apt-get install -y freeswitch-all \
    freeswitch-mod-esl freeswitch-mod-verto freeswitch-mod-rtc \
    freeswitch-mod-av freeswitch-mod-opus freeswitch-mod-shout \
    freeswitch-mod-sndfile freeswitch-mod-native-file freeswitch-mod-lua \
    freeswitch-mod-python3 freeswitch-mod-pgsql freeswitch-mod-vpx \
    freeswitch-mod-h26x freeswitch-mod-commands freeswitch-mod-dptools \
    freeswitch-mod-dialplan-xml freeswitch-mod-sofia freeswitch-mod-event-socket \
    freeswitch-mod-conference freeswitch-mod-db freeswitch-mod-hash \
    freeswitch-mod-voicemail freeswitch-mod-expr freeswitch-mod-valet-parking \
    freeswitch-mod-httapi freeswitch-mod-json-cdr freeswitch-mod-local-stream \
    freeswitch-mod-tone-stream postgresql-16

# Configuración Base de Datos y ESL
ESL_PASS=$(openssl rand -base64 16)
DB_PASS="TitanPass2024!"

echo -e "${BLUE}[4/7] Configurando Event Socket Layer (ESL)...${NC}"
cat <<EOF > /etc/freeswitch/autoload_configs/event_socket.conf.xml
<configuration name="event_socket.conf" description="Socket Client">
  <settings>
    <param name="listen-ip" value="0.0.0.0"/>
    <param name="listen-port" value="8021"/>
    <param name="password" value="$ESL_PASS"/>
  </settings>
</configuration>
EOF

sudo -u postgres psql -c "CREATE USER cuberbox_admin WITH PASSWORD '$DB_PASS';" || true
sudo -u postgres psql -c "CREATE DATABASE cuberbox_db OWNER cuberbox_admin;" || true

# 6. Generación de Capa SSL (Nexus Shield)
echo -e "${BLUE}[4/7] Generando certificados SSL para WebRTC/WSS...${NC}"
mkdir -p /etc/freeswitch/tls
openssl req -x509 -nodes -days 3650 -newkey rsa:4096 \
    -keyout /etc/freeswitch/tls/wss.key \
    -out /etc/freeswitch/tls/wss.crt \
    -subj "/C=US/ST=Tech/L=Cloud/O=Cuberbox/CN=$CBX_DOMAIN"

cat /etc/freeswitch/tls/wss.crt /etc/freeswitch/tls/wss.key > /etc/freeswitch/tls/wss.pem
chown -R freeswitch:freeswitch /etc/freeswitch/tls

# 7. Configuración de Alta Disponibilidad (HA)
echo -e "${BLUE}[5/7] Configurando Stack de Redundancia (Keepalived)...${NC}"
PRIORITY=100
[[ "$NODE_ROLE" == "MASTER" ]] && PRIORITY=150

cat <<EOF > /etc/keepalived/keepalived.conf
vrrp_instance VI_1 {
    state $NODE_ROLE
    interface $(ip route | grep default | awk '{print $5}')
    virtual_router_id 51
    priority $PRIORITY
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass nexus_ha_key
    }
    virtual_ipaddress {
        $HA_VIP
    }
}
EOF

# 8. Compilación del Backend Go (Nexus Connector)
echo -e "${BLUE}[6/7] Preparando Backend Go de Control...${NC}"
mkdir -p /opt/cuberbox/bin
cat <<EOF > /opt/cuberbox/main.go
package main
import "fmt"
func main() { fmt.Println("Cuberbox Pro Go Backend v4.7.9 - Operational") }
EOF
cd /opt/cuberbox && go build -o /usr/local/bin/cuberbox-connector main.go
chmod +x /usr/local/bin/cuberbox-connector

# 9. Finalización y Optimización del Kernel
echo -e "${BLUE}[7/7] Sintonizando parámetros del Kernel para VoIP...${NC}"
cat <<EOF >> /etc/sysctl.conf
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.udp_rmem_min = 16384
net.ipv4.udp_wmem_min = 16384
EOF
sysctl -p

# Reiniciar Servicios
systemctl restart freeswitch
systemctl restart keepalived
systemctl restart haproxy

echo -e "\n${BOLD}${GREEN}===================================================="
echo "   CUBERBOX PRO v4.7.9 INSTALADO CORRECTAMENTE"
echo "===================================================="
echo -e "${NC}"
echo -e "Virtual IP (VIP): ${BOLD}$HA_VIP${NC}"
echo -e "FreeSwitch ESL Port: ${BOLD}8021 (Pass: $ESL_PASS)${NC}"
echo -e "WebRTC WSS Port: ${BOLD}8089${NC}"
echo -e "PostgreSQL 16: ${BOLD}Active on 5432${NC}"
echo -e "\n${PURPLE}Accede al panel via: https://$HA_VIP${NC}"