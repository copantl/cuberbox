#!/bin/bash

# =============================================================================
# CUBERBOX PRO - COMPILED FREESWITCH SYNC TOOL V1.0
# Este script sincroniza una instalación de FreeSwitch compilada manualmente
# con la configuración de la aplicación Cuberbox.
# =============================================================================

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== Cuberbox Compiled FreeSwitch Sync ===${NC}"

# 1. Buscar la ruta de instalación de FreeSwitch
FS_PATHS=("/usr/local/freeswitch" "/opt/freeswitch" "/usr/freeswitch")
FS_BASE=""

for path in "${FS_PATHS[@]}"; do
    if [ -d "$path/conf" ]; then
        FS_BASE=$path
        break
    fi
done

if [ -z "$FS_BASE" ]; then
    echo -e "${RED}[ERROR] No se encontró la base de FreeSwitch en rutas comunes.${NC}"
    read -p "Por favor, ingresa la ruta manual (ej: /home/user/freeswitch): " FS_BASE
fi

if [ ! -d "$FS_BASE/conf" ]; then
    echo -e "${RED}[FATAL] La ruta $FS_BASE no parece ser una instalación válida de FreeSwitch.${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] FreeSwitch detectado en: $FS_BASE${NC}"

# 2. Localizar event_socket.conf.xml
ESL_CONFIG="$FS_BASE/conf/autoload_configs/event_socket.conf.xml"

if [ ! -f "$ESL_CONFIG" ]; then
    echo -e "${RED}[ERROR] No se encontró event_socket.conf.xml en $ESL_CONFIG${NC}"
    exit 1
fi

# 3. Extraer Contraseña y IP de Escucha
ESL_PASS=$(grep 'name="password"' "$ESL_CONFIG" | sed -E 's/.*value="([^"]+)".*/\1/')
ESL_IP=$(grep 'name="listen-ip"' "$ESL_CONFIG" | sed -E 's/.*value="([^"]+)".*/\1/')
ESL_PORT=$(grep 'name="listen-port"' "$ESL_CONFIG" | sed -E 's/.*value="([^"]+)".*/\1/')

[ -z "$ESL_PORT" ] && ESL_PORT="8021"

echo -e "${BLUE}[INFO] Configuración actual de ESL:${NC}"
echo -e "  - IP: $ESL_IP"
echo -e "  - Puerto: $ESL_PORT"
echo -e "  - Password: $ESL_PASS"

# 4. Validar IP de Escucha (Debe ser 0.0.0.0 para acceso externo)
if [ "$ESL_IP" == "127.0.0.1" ]; then
    echo -e "${YELLOW}[WARN] ESL está escuchando solo en Localhost (127.0.0.1).${NC}"
    read -p "¿Deseas cambiarlo a 0.0.0.0 para permitir conexiones externas? (s/n): " CHANGE_IP
    if [ "$CHANGE_IP" == "s" ]; then
        sed -i 's/name="listen-ip" value="127.0.0.1"/name="listen-ip" value="0.0.0.0"/' "$ESL_CONFIG"
        echo -e "${GREEN}[OK] IP cambiada a 0.0.0.0. Recuerda reiniciar FreeSwitch.${NC}"
        ESL_IP="0.0.0.0"
    fi
fi

# 5. Generar archivo .env para la aplicación
ENV_FILE=".env"
echo -e "${BLUE}[STEP] Generando archivo $ENV_FILE para la aplicación...${NC}"

cat <<EOF > $ENV_FILE
# Generado automáticamente por sync_compiled_fs.sh
ESL_HOST=$ESL_IP
ESL_PORT=$ESL_PORT
ESL_PASSWORD=$ESL_PASS
MOCK_ESL=false
NODE_ENV=production
EOF

echo -e "${GREEN}[SUCCESS] Sincronización completada.${NC}"
echo -e "Ahora puedes iniciar tu aplicación y se conectará a FreeSwitch automáticamente."
echo -e "Comando sugerido: ${BOLD}npm start${NC}"
