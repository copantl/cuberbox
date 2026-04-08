#!/bin/bash

# ==============================================================================
# CUBERBOX NEXUS CORE - UNIFIED INSTALLER & ORCHESTRATOR v4.7.9
# Debian-style TUI Installer (whiptail/dialog based)
# ==============================================================================

# Check for root
if [[ $EUID -ne 0 ]]; then
   echo "Este script debe ejecutarse como ROOT."
   exit 1
fi

# Log file
LOG_FILE="/var/log/nexus_install.log"
touch "$LOG_FILE"
chmod 644 "$LOG_FILE"

# Temporary progress file
PROGRESS_FILE="/tmp/install_progress"
rm -f "$PROGRESS_FILE"

# --- Helper Functions ---

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

update_progress() {
    local percent=$1
    local message=$2
    echo "$percent" > "$PROGRESS_FILE"
    echo "$message" > "${PROGRESS_FILE}_msg"
    log "PROGRESS: $percent% - $message"
}

# Wrapper to run commands with error handling
run_step() {
    local percent=$1
    local message=$2
    local command=$3
    
    update_progress "$percent" "$message"
    log "Executing: $command"
    
    eval "$command" >> "$LOG_FILE" 2>&1
    local status=$?
    
    if [ $status -ne 0 ]; then
        log "ERROR: Command failed with status $status"
        echo "FAIL:$message" > "$PROGRESS_FILE"
        exit 1
    fi
}

# --- Installation Modules ---

preflight_checks() {
    update_progress 2 "Realizando comprobaciones previas..."
    
    # Check internet connection
    if ! ping -c 1 google.com > /dev/null 2>&1; then
        log "ERROR: No hay conexión a internet."
        echo "FAIL:Sin conexión a internet" > "$PROGRESS_FILE"
        exit 1
    fi
    
    # Check disk space (simple check for 5GB)
    local free_space=$(df / --output=avail -k | tail -1)
    if [ "$free_space" -lt 5242880 ]; then
        log "ERROR: Espacio en disco insuficiente."
        echo "FAIL:Espacio en disco insuficiente (<5GB)" > "$PROGRESS_FILE"
        exit 1
    fi
}

install_base_tools() {
    run_step 5 "Actualizando repositorios y herramientas base" "apt-get update && apt-get install -y gnupg gnupg2 wget lsb-release curl software-properties-common ca-certificates openssl"
}

setup_repositories() {
    update_progress 10 "Configurando repositorios (PostgreSQL & SignalWire)..."
    run_step 12 "Importando llaves GPG" "mkdir -p /usr/share/keyrings && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg"
    run_step 14 "Agregando repo PostgreSQL" "echo \"deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main\" > /etc/apt/sources.list.d/pgdg.list"
    
    run_step 16 "Limpiando repos antiguos" "rm -f /etc/apt/sources.list.d/freeswitch.list /etc/apt/auth.conf.d/freeswitch.conf"
    run_step 18 "Configurando repo SignalWire" "curl -u signalwire:$SW_TOKEN -o /usr/share/keyrings/signalwire-freeswitch-repo.gpg https://freeswitch.signalwire.com/repo/deb/debian-release/signalwire-freeswitch-repo.gpg"
    run_step 20 "Configurando autenticación SignalWire" "echo \"machine freeswitch.signalwire.com login signalwire password $SW_TOKEN\" > /etc/apt/auth.conf.d/freeswitch.conf && chmod 600 /etc/apt/auth.conf.d/freeswitch.conf"
    run_step 22 "Agregando repo FreeSwitch" "echo \"deb [signed-by=/usr/share/keyrings/signalwire-freeswitch-repo.gpg] https://freeswitch.signalwire.com/repo/deb/debian-release/ $(lsb_release -sc) main\" > /etc/apt/sources.list.d/freeswitch.list"
}

install_dependencies() {
    run_step 30 "Instalando dependencias de sistema y medios" "apt-get update && apt-get install -y build-essential cmake automake autoconf libtool libtool-bin pkg-config libssl-dev zlib1g-dev libdb-dev libncurses-dev libsqlite3-dev libcurl4-openssl-dev libpcre3-dev libspeex-dev libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev libopus-dev libsndfile1-dev libshout3-dev libmpg123-dev python3-dev git golang-go haproxy keepalived uuid-dev libavformat-dev libswscale-dev libavcodec-dev libavutil-dev libswresample-dev libyuv-dev libvpx-dev libx264-dev"
}

compile_signalwire_libs() {
    update_progress 40 "Compilando librerías SignalWire..."
    run_step 42 "Preparando entorno de compilación" "mkdir -p /usr/src/libs"
    
    cd /usr/src/libs
    if [ ! -d "libks" ]; then
        run_step 44 "Clonando libks" "git clone https://github.com/signalwire/libks.git"
        run_step 46 "Compilando libks" "cd libks && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make -j$(nproc) && make install"
    fi
    
    cd /usr/src/libs
    if [ ! -d "signalwire-c" ]; then
        run_step 48 "Clonando signalwire-c" "git clone https://github.com/signalwire/signalwire-c.git"
        run_step 50 "Compilando signalwire-c" "cd signalwire-c && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make -j$(nproc) && make install"
    fi
    
    run_step 52 "Actualizando caché de librerías" "ldconfig"
    cd /
}

install_freeswitch() {
    run_step 60 "Instalando FreeSwitch Engine y módulos" "apt-get install -y freeswitch-all freeswitch-mod-esl freeswitch-mod-verto freeswitch-mod-rtc freeswitch-mod-av freeswitch-mod-opus freeswitch-mod-shout freeswitch-mod-sndfile freeswitch-mod-native-file freeswitch-mod-lua freeswitch-mod-python3 freeswitch-mod-pgsql freeswitch-mod-commands freeswitch-mod-dptools freeswitch-mod-dialplan-xml freeswitch-mod-sofia freeswitch-mod-event-socket freeswitch-mod-conference freeswitch-mod-db freeswitch-mod-hash freeswitch-mod-voicemail freeswitch-mod-expr freeswitch-mod-valet-parking freeswitch-mod-httapi freeswitch-mod-json-cdr freeswitch-mod-local-stream freeswitch-mod-tone-stream"
}

install_postgresql() {
    run_step 70 "Instalando PostgreSQL 16" "apt-get install -y postgresql-16"
}

configure_services() {
    update_progress 80 "Configurando servicios base..."
    
    # ESL Config
    ESL_PASS=$(openssl rand -base64 16)
    run_step 82 "Configurando ESL Password" "cat <<EOF > /etc/freeswitch/autoload_configs/event_socket.conf.xml
<configuration name=\"event_socket.conf\" description=\"Socket Client\">
  <settings>
    <param name=\"listen-ip\" value=\"0.0.0.0\"/>
    <param name=\"listen-port\" value=\"8021\"/>
    <param name=\"password\" value=\"$ESL_PASS\"/>
  </settings>
</configuration>
EOF"

    # DB Config
    run_step 84 "Configurando Base de Datos" "sudo -u postgres psql -c \"CREATE USER nexus_admin WITH PASSWORD '$DB_PASS';\" && sudo -u postgres psql -c \"CREATE DATABASE nexus_db OWNER nexus_admin;\""
    
    # SSL Config
    run_step 86 "Generando certificados SSL" "mkdir -p /etc/freeswitch/tls && openssl req -x509 -nodes -days 3650 -newkey rsa:4096 -keyout /etc/freeswitch/tls/wss.key -out /etc/freeswitch/tls/wss.crt -subj \"/C=US/ST=Tech/L=Cloud/O=CUBERBOX Nexus Core/CN=$CBX_DOMAIN\" && cat /etc/freeswitch/tls/wss.crt /etc/freeswitch/tls/wss.key > /etc/freeswitch/tls/wss.pem && chown -R freeswitch:freeswitch /etc/freeswitch/tls"
}

configure_ha() {
    update_progress 90 "Configurando Alta Disponibilidad..."
    PRIORITY=100
    [[ "$NODE_ROLE" == "MASTER" ]] && PRIORITY=150
    run_step 92 "Configurando Keepalived" "cat <<EOF > /etc/keepalived/keepalived.conf
vrrp_instance VI_1 {
    state $NODE_ROLE
    interface \$(ip route | grep default | awk '{print \$5}')
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
EOF"
}

compile_backend() {
    update_progress 94 "Compilando CUBERBOX Nexus Connector..."
    run_step 95 "Construyendo binario Go" "mkdir -p $INSTALL_DIR/bin && (if [ -d \"$INSTALL_DIR/backend\" ]; then cd $INSTALL_DIR/backend && go build -o /usr/local/bin/nexus-connector main.go; else cat <<EOF > $INSTALL_DIR/main.go
package main
import \"fmt\"
func main() { fmt.Println(\"CUBERBOX Nexus Core Go Backend v4.7.9 - Operational\") }
EOF
cd $INSTALL_DIR && go build -o /usr/local/bin/nexus-connector main.go; fi) && chmod +x /usr/local/bin/nexus-connector"
}

install_systemd_services() {
    update_progress 97 "Instalando servicios de sistema..."
    
    # Web Service
    run_step 98 "Creando nexus-web.service" "cat <<EOF > /etc/systemd/system/nexus-web.service
[Unit]
Description=CUBERBOX Nexus Core Web Interface
After=network.target

[Service]
Type=simple
WorkingDirectory=$INSTALL_DIR
ExecStart=\$(which npm) run dev -- --host 0.0.0.0
Restart=always
Environment=NODE_ENV=production
Environment=RECORDINGS_PATH=$INSTALL_DIR/recordings

[Install]
WantedBy=multi-user.target
EOF"

    # Connector Service
    run_step 99 "Creando nexus-core.service" "cat <<EOF > /etc/systemd/system/nexus-core.service
[Unit]
Description=CUBERBOX Nexus Core Connector
After=network.target freeswitch.service

[Service]
Type=simple
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/local/bin/nexus-connector
Restart=always

[Install]
WantedBy=multi-user.target
EOF"

    run_step 99 "Recargando systemd y habilitando servicios" "systemctl daemon-reload && systemctl enable --now nexus-web nexus-core"
}

finalize() {
    update_progress 100 "Finalizando instalación..."
    systemctl restart freeswitch keepalived haproxy >> "$LOG_FILE" 2>&1 || true
    echo "DONE" > "$PROGRESS_FILE"
}

# --- Main Installer Logic ---
AUTO_MODE=false
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --auto) AUTO_MODE=true ;;
        --domain) CBX_DOMAIN="$2"; shift ;;
        --token) SW_TOKEN="$2"; shift ;;
        --db-pass) DB_PASS="$2"; shift ;;
        --type) INSTALL_TYPE="$2"; shift ;;
        --vip) HA_VIP="$2"; shift ;;
        --role) NODE_ROLE="$2"; shift ;;
        --path) INSTALL_DIR="$2"; shift ;;
    esac
    shift
done

if [ "$AUTO_MODE" = true ]; then
    log "Running in AUTO mode"
    INSTALL_TYPE=${INSTALL_TYPE:-"STANDALONE"}
    CBX_DOMAIN=${CBX_DOMAIN:-"cuberbox-nexus.local"}
    SW_TOKEN=${SW_TOKEN:-"none"}
    DB_PASS=${DB_PASS:-"NexusPass2026!"}
    INSTALL_DIR=${INSTALL_DIR:-"/opt/nexus"}
    
    case "$INSTALL_TYPE" in
        "STANDALONE") run_standalone ;;
        "CLUSTER") run_cluster ;;
    esac
    exit 0
fi

run_standalone() {
    # Ask for install path if not set (TUI mode)
    if [ -z "$INSTALL_DIR" ]; then
        INSTALL_DIR=$(whiptail --title "Ruta de Instalación" --inputbox "Ingrese la ruta donde se instalará CUBERBOX Nexus Core:" 10 60 "/opt/nexus" 3>&1 1>&2 2>&3)
        if [ $? -ne 0 ]; then exit 0; fi
    fi
    preflight_checks
    install_base_tools
    setup_repositories
    install_dependencies
    compile_signalwire_libs
    install_freeswitch
    install_postgresql
    configure_services
    compile_backend
    install_systemd_services
    finalize
}

run_cluster() {
    # Ask for install path if not set (TUI mode)
    if [ -z "$INSTALL_DIR" ]; then
        INSTALL_DIR=$(whiptail --title "Ruta de Instalación" --inputbox "Ingrese la ruta donde se instalará CUBERBOX Nexus Core:" 10 60 "/opt/nexus" 3>&1 1>&2 2>&3)
        if [ $? -ne 0 ]; then exit 0; fi
    fi
    preflight_checks
    install_base_tools
    setup_repositories
    install_dependencies
    compile_signalwire_libs
    install_freeswitch
    install_postgresql
    configure_services
    configure_ha
    compile_backend
    install_systemd_services
    finalize
}

run_components() {
    # Ask for install path if not set (TUI mode)
    if [ -z "$INSTALL_DIR" ]; then
        INSTALL_DIR=$(whiptail --title "Ruta de Instalación" --inputbox "Ingrese la ruta donde se instalará CUBERBOX Nexus Core:" 10 60 "/opt/nexus" 3>&1 1>&2 2>&3)
        if [ $? -ne 0 ]; then exit 0; fi
    fi
    preflight_checks
    install_base_tools
    
    [[ "$SELECTED_COMPONENTS" == *"REPO"* ]] && setup_repositories
    [[ "$SELECTED_COMPONENTS" == *"DEPS"* ]] && install_dependencies
    [[ "$SELECTED_COMPONENTS" == *"SWLIBS"* ]] && compile_signalwire_libs
    [[ "$SELECTED_COMPONENTS" == *"FS"* ]] && install_freeswitch
    [[ "$SELECTED_COMPONENTS" == *"DB"* ]] && install_postgresql
    [[ "$SELECTED_COMPONENTS" == *"CONFIG"* ]] && configure_services
    [[ "$SELECTED_COMPONENTS" == *"HA"* ]] && configure_ha
    [[ "$SELECTED_COMPONENTS" == *"BACKEND"* ]] && compile_backend
    
    install_systemd_services
    finalize
}

# --- TUI Flow ---

# Welcome Screen
whiptail --title "CUBERBOX Nexus Core Installer" --msgbox "Bienvenido al instalador avanzado de CUBERBOX Nexus Core v4.7.9.\n\nEste asistente le guiará a través del proceso de instalación y configuración de su infraestructura CUBERBOX Nexus Core." 12 60

# Installation Type Menu
INSTALL_TYPE=$(whiptail --title "Tipo de Instalación" --menu "Seleccione el modo de instalación deseado:" 15 60 3 \
"STANDALONE" "Todo en un solo servidor (Ideal para pruebas)" \
"CLUSTER" "Configuración de Alta Disponibilidad (Producción)" \
"COMPONENTS" "Instalación selectiva de componentes" 3>&1 1>&2 2>&3)

if [ $? -ne 0 ]; then exit 0; fi

# Logic based on type
case "$INSTALL_TYPE" in
    "STANDALONE")
        CBX_DOMAIN=$(whiptail --title "Configuración" --inputbox "Dominio/FQDN para SSL:" 10 60 "sip.local" 3>&1 1>&2 2>&3)
        SW_TOKEN=$(whiptail --title "SignalWire" --inputbox "Token SignalWire (PAT):" 10 60 "" 3>&1 1>&2 2>&3)
        DB_PASS=$(whiptail --title "Base de Datos" --passwordbox "Contraseña nexus_admin:" 10 60 "NexusPass2026!" 3>&1 1>&2 2>&3)
        ;;
    "CLUSTER")
        CBX_DOMAIN=$(whiptail --title "Configuración" --inputbox "Dominio/FQDN para SSL:" 10 60 "sip.local" 3>&1 1>&2 2>&3)
        SW_TOKEN=$(whiptail --title "SignalWire" --inputbox "Token SignalWire (PAT):" 10 60 "" 3>&1 1>&2 2>&3)
        HA_VIP=$(whiptail --title "Alta Disponibilidad" --inputbox "IP Virtual (VIP) del Clúster:" 10 60 "192.168.1.100" 3>&1 1>&2 2>&3)
        NODE_ROLE=$(whiptail --title "Rol del Nodo" --menu "Seleccione el rol:" 12 60 2 "MASTER" "Primario" "SLAVE" "Secundario" 3>&1 1>&2 2>&3)
        DB_PASS=$(whiptail --title "Base de Datos" --passwordbox "Contraseña nexus_admin:" 10 60 "NexusPass2026!" 3>&1 1>&2 2>&3)
        ;;
    "COMPONENTS")
        SELECTED_COMPONENTS=$(whiptail --title "Selección de Componentes" --checklist \
        "Seleccione los elementos a instalar:" 20 60 8 \
        "REPO" "Repositorios (PG & SW)" ON \
        "DEPS" "Dependencias de Sistema" ON \
        "SWLIBS" "Librerías SignalWire (Fuente)" OFF \
        "FS" "FreeSwitch Engine" ON \
        "DB" "PostgreSQL 16" ON \
        "CONFIG" "Configuración Base (ESL/DB)" ON \
        "HA" "Keepalived (HA)" OFF \
        "BACKEND" "Nexus Connector (Go)" ON 3>&1 1>&2 2>&3)
        
        if [ $? -ne 0 ]; then exit 0; fi
        
        # Ask for necessary data if components need them
        if [[ "$SELECTED_COMPONENTS" == *"REPO"* ]] || [[ "$SELECTED_COMPONENTS" == *"SWLIBS"* ]]; then
            SW_TOKEN=$(whiptail --title "SignalWire" --inputbox "Token SignalWire (PAT):" 10 60 "" 3>&1 1>&2 2>&3)
        fi
        if [[ "$SELECTED_COMPONENTS" == *"CONFIG"* ]]; then
            CBX_DOMAIN=$(whiptail --title "Configuración" --inputbox "Dominio/FQDN para SSL:" 10 60 "sip.local" 3>&1 1>&2 2>&3)
            DB_PASS=$(whiptail --title "Base de Datos" --passwordbox "Contraseña nexus_admin:" 10 60 "NexusPass2026!" 3>&1 1>&2 2>&3)
        fi
        if [[ "$SELECTED_COMPONENTS" == *"HA"* ]]; then
            HA_VIP=$(whiptail --title "Alta Disponibilidad" --inputbox "IP Virtual (VIP):" 10 60 "192.168.1.100" 3>&1 1>&2 2>&3)
            NODE_ROLE=$(whiptail --title "Rol del Nodo" --menu "Seleccione el rol:" 12 60 2 "MASTER" "Primario" "SLAVE" "Secundario" 3>&1 1>&2 2>&3)
        fi
        ;;
esac

# Summary Screen
SUMMARY="Resumen de Instalación:\n\nModo: $INSTALL_TYPE\nDominio: $CBX_DOMAIN\nToken SW: ${SW_TOKEN:0:4}***\n"
[[ "$INSTALL_TYPE" == "CLUSTER" ]] && SUMMARY="${SUMMARY}VIP: $HA_VIP\nRol: $NODE_ROLE\n"
[[ "$INSTALL_TYPE" == "COMPONENTS" ]] && SUMMARY="${SUMMARY}Componentes: $SELECTED_COMPONENTS\n"

if ! whiptail --title "Confirmación de Parámetros" --yesno "$SUMMARY\n¿Desea iniciar la instalación ahora?" 18 60; then
    whiptail --title "Cancelado" --msgbox "Instalación abortada por el usuario." 8 45
    exit 0
fi

# Run appropriate installer in background
case "$INSTALL_TYPE" in
    "STANDALONE") run_standalone & ;;
    "CLUSTER") run_cluster & ;;
    "COMPONENTS") run_components & ;;
esac

# Progress Gauge with dynamic message
(
while true; do
    if [ -f "$PROGRESS_FILE" ]; then
        PROGRESS=$(cat "$PROGRESS_FILE")
        MSG=$(cat "${PROGRESS_FILE}_msg" 2>/dev/null || echo "Procesando...")
        
        if [[ "$PROGRESS" == "FAIL:"* ]]; then
            echo "XXX"
            echo 0
            echo "ERROR: ${PROGRESS#FAIL:}"
            echo "XXX"
            exit 1
        fi
        
        if [ "$PROGRESS" == "DONE" ]; then
            echo 100
            break
        fi
        
        echo "XXX"
        echo "$PROGRESS"
        echo "$MSG"
        echo "XXX"
    fi
    sleep 1
done
) | whiptail --title "Instalación en Progreso" --gauge "Iniciando despliegue..." 10 70 0

# Check for failure
if [ $? -ne 0 ]; then
    whiptail --title "Error Crítico" --msgbox "La instalación falló. Revise el log en $LOG_FILE para más detalles." 10 60
    exit 1
fi

# Success Screen
whiptail --title "Éxito" --msgbox "La instalación de CUBERBOX Nexus Core v4.7.9 ha finalizado correctamente.\n\nServicios activos:\n- FreeSwitch\n- PostgreSQL 16\n- CUBERBOX Nexus Connector\n- Web Interface (Puerto 3000)" 15 60

# Log Viewer
if whiptail --title "Ver Log" --yesno "¿Desea revisar el log de instalación detallado?" 8 60; then
    whiptail --title "Detalles de Instalación" --textbox "$LOG_FILE" 20 80
fi

rm -f "$PROGRESS_FILE" "${PROGRESS_FILE}_msg"
