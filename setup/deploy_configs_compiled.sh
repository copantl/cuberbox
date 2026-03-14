#!/bin/bash

# =============================================================================
# CUBERBOX PRO - COMPILED FREESWITCH CONFIG DEPLOYER V1.0
# Despliega el Dialplan y las Extensiones tácticas en una instalación compilada.
# =============================================================================

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Cuberbox Config Deployer (Compiled FS) ===${NC}"

# 1. Detectar ruta base (reutilizando lógica de sync)
FS_PATHS=("/usr/local/freeswitch" "/opt/freeswitch" "/usr/freeswitch")
FS_BASE=""
for path in "${FS_PATHS[@]}"; do
    if [ -d "$path/conf" ]; then FS_BASE=$path; break; fi
done

if [ -z "$FS_BASE" ]; then
    read -p "Ruta base de FreeSwitch (ej: /usr/local/freeswitch): " FS_BASE
fi

if [ ! -d "$FS_BASE/conf" ]; then
    echo -e "${RED}[ERROR] Ruta inválida.${NC}"
    exit 1
fi

# 2. Desplegar Dialplan Táctico
echo -e "${BLUE}[1/3] Desplegando Dialplan Táctico...${NC}"
DIALPLAN_DEST="$FS_BASE/conf/dialplan/default/01_cuberbox_pro.xml"
cp setup/dialplan.xml "$DIALPLAN_DEST"
chown -R $(ls -ld "$FS_BASE/conf" | awk '{print $3":"$4}') "$DIALPLAN_DEST"
echo -e "${GREEN}[OK] Dialplan copiado a: $DIALPLAN_DEST${NC}"

# 3. Desplegar Script LUA de Enrutamiento
echo -e "${BLUE}[2/3] Desplegando Script LUA de Telemetría...${NC}"
LUA_DEST="$FS_BASE/scripts/cuberbox_router.lua"
cp setup/cuberbox_router.lua "$LUA_DEST"
chown -R $(ls -ld "$FS_BASE/conf" | awk '{print $3":"$4}') "$LUA_DEST"
echo -e "${GREEN}[OK] Script LUA copiado a: $LUA_DEST${NC}"

# 4. Crear Directorio de Grabaciones
echo -e "${BLUE}[3/3] Configurando directorio de grabaciones...${NC}"
mkdir -p /opt/cuberbox/recordings
chown -R $(ls -ld "$FS_BASE/conf" | awk '{print $3":"$4}') /opt/cuberbox/recordings
echo -e "${GREEN}[OK] Directorio /opt/cuberbox/recordings listo.${NC}"

# 5. Instrucciones de Recarga
echo -e "\n${GREEN}===================================================="
echo "   CONFIGURACIÓN DESPLEGADA CORRECTAMENTE"
echo "===================================================="
echo -e "${NC}"
echo "Para aplicar los cambios, ejecuta en tu fs_cli:"
echo -e "${BLUE}  reloadxml${NC}"
echo -e "${BLUE}  reload mod_lua${NC}"
echo -e "\nNota: Asegúrate de que el gateway 'twilio' esté configurado si vas a usar la inyección de leads."
