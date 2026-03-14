#!/bin/bash

# =============================================================================
# CUBERBOX PRO - GATEWAY DEPLOYER V1.0
# Despliega configuraciones de Gateways en una instalación compilada.
# =============================================================================

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Cuberbox Gateway Deployer (Compiled FS) ===${NC}"

# 1. Detectar ruta base
FS_PATHS=("/usr/local/freeswitch" "/opt/freeswitch" "/usr/freeswitch")
FS_BASE=""
for path in "${FS_PATHS[@]}"; do
    if [ -d "$path/conf" ]; then FS_BASE=$path; break; fi
done

if [ -z "$FS_BASE" ]; then
    read -p "Ruta base de FreeSwitch (ej: /usr/local/freeswitch): " FS_BASE
fi

GW_DEST="$FS_BASE/conf/sip_profiles/external"

if [ ! -d "$GW_DEST" ]; then
    echo -e "${RED}[ERROR] No se encontró el directorio de perfiles externos: $GW_DEST${NC}"
    exit 1
fi

# 2. Desplegar Twilio
echo -e "${BLUE}[1/2] Desplegando Gateway Twilio...${NC}"
cp setup/gateway_twilio.xml "$GW_DEST/twilio.xml"
echo -e "${GREEN}[OK] Twilio configurado en: $GW_DEST/twilio.xml${NC}"

# 3. Desplegar Genérico
echo -e "${BLUE}[2/2] Desplegando Gateway Genérico...${NC}"
cp setup/gateway_generic.xml "$GW_DEST/generic_provider.xml"
echo -e "${GREEN}[OK] Genérico configurado en: $GW_DEST/generic_provider.xml${NC}"

# 4. Ajustar permisos
chown -R $(ls -ld "$FS_BASE/conf" | awk '{print $3":"$4}') "$GW_DEST"

echo -e "\n${GREEN}===================================================="
echo "   GATEWAYS DESPLEGADOS"
echo "===================================================="
echo -e "${NC}"
echo "IMPORTANTE: Edita los archivos en $GW_DEST con tus credenciales reales."
echo "Luego, ejecuta en tu fs_cli:"
echo -e "${BLUE}  sofia profile external rescan${NC}"
