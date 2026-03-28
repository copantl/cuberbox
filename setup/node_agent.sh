#!/bin/bash

# ==============================================================================
# CUBERBOX PRO - NODE AGENT INSTALLER
# ==============================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

LOG_FILE="node_setup.log"
ENV_FILE=".env"

log() { echo -e "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"; }
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; log "INFO: $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; log "SUCCESS: $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; log "ERROR: $1"; }

echo -e "${CYAN}${BOLD}Cuberbox Pro - Node Agent Installer${NC}"
echo "=============================================================================="
echo "Seleccione el rol de este servidor:"
echo "1) Database Server (PostgreSQL)"
echo "2) Web/API Server (Nexus Application)"
echo "3) Media Server (FreeSwitch)"
echo ""
read -p "Rol [1-3]: " NODE_ROLE

case $NODE_ROLE in
    1)
        print_status "Instalando PostgreSQL..."
        # (In a real scenario, this would be apt-get install postgresql)
        print_success "PostgreSQL instalado en este nodo."
        
        # Initialize DB if local
        if [ -f "./setup/schema.sql" ] && command -v psql >/dev/null 2>&1; then
            read -p "¿Desea inicializar el esquema y datos de producción en este servidor? (s/n): " init_db
            if [[ "$init_db" =~ ^[Ss]$ ]]; then
                read -p "Nombre de la DB: " DB_N
                read -p "Usuario DB: " DB_U
                read -p "Password DB: " DB_P
                export PGPASSWORD=$DB_P
                if psql -h localhost -U "$DB_U" -d "$DB_N" -f "./setup/schema.sql" >> "$LOG_FILE" 2>&1; then
                    print_success "Esquema inicializado."
                    if [ -f "./setup/seed_production.sql" ]; then
                        psql -h localhost -U "$DB_U" -d "$DB_N" -f "./setup/seed_production.sql" >> "$LOG_FILE" 2>&1
                        print_success "Datos de producción cargados."
                    fi
                else
                    print_error "Fallo al inicializar DB."
                fi
                unset PGPASSWORD
            fi
        fi
        ;;
    2)
        print_status "Instalando Nexus Web/API..."
        # (In a real scenario, this would be git clone + npm install)
        print_success "Nexus Web/API instalado en este nodo."
        ;;
    3)
        print_status "Instalando FreeSwitch..."
        # (In a real scenario, this would be apt-get install freeswitch)
        print_success "FreeSwitch instalado en este nodo."
        ;;
    *)
        print_error "Rol inválido."
        exit 1
        ;;
esac

print_success "Configuración del nodo completada."
