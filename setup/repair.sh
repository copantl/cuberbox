#!/bin/bash
# Cuberbox Pro - Script de Reparación de Repositorios
# Este script limpia archivos de fuentes mal configurados

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[REPAIR] Iniciando limpieza de repositorios...${NC}"

# 1. Eliminar archivos corruptos
echo -e "${BLUE}[1/3] Eliminando archivos de fuentes corruptos...${NC}"
rm -f /etc/apt/sources.list.d/freeswitch.list
rm -f /etc/apt/sources.list.d/pgdg.list

# 2. Limpiar llaves antiguas (Legacy Keyring)
echo -e "${BLUE}[2/3] Limpiando llaves GPG antiguas...${NC}"
apt-key del ACCC4CF8 2>/dev/null || true
rm -f /etc/apt/trusted.gpg.d/freeswitch.gpg 2>/dev/null || true

# 3. Actualizar listas
echo -e "${BLUE}[3/3] Actualizando listas de paquetes...${NC}"
apt-get update

echo -e "${GREEN}[SUCCESS] Repositorios limpios. Ahora puede volver a ejecutar la instalación.${NC}"
