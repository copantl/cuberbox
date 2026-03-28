#!/bin/bash

# ==============================================================================
# CUBERBOX PRO - STANDALONE INSTALLER
# ==============================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

LOG_FILE="setup.log"
ENV_FILE=".env"
SCHEMA_FILE="./setup/schema.sql"

log() { echo -e "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"; }
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; log "INFO: $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; log "SUCCESS: $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; log "ERROR: $1"; }

show_progress() {
    local progress=0
    while [ $progress -le 100 ]; do
        printf "\r${CYAN}[${NC}%-40s${CYAN}]${NC} %d%%" "$(printf '█%.0s' $(seq 1 $((progress / 2))))" "$progress"
        sleep 0.05
        progress=$((progress + 5))
    done
    echo ""
}

echo -e "${CYAN}${BOLD}Iniciando Instalación Standalone (Local)...${NC}"

# 1. Deps
print_status "Verificando dependencias..."
command -v node >/dev/null 2>&1 || { print_error "Node.js no encontrado."; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "NPM no encontrado."; exit 1; }

# 2. Env
if [ ! -f "$ENV_FILE" ]; then
    print_status "Configurando variables de entorno..."
    # (Simplified prompt for brevity in this sub-script)
    read -p "Gemini API Key: " G_KEY
    echo "GEMINI_API_KEY=$G_KEY" > "$ENV_FILE"
    echo "DB_HOST=localhost" >> "$ENV_FILE"
    echo "DB_PORT=5432" >> "$ENV_FILE"
    echo "DB_USER=cuberbox_admin" >> "$ENV_FILE"
    echo "DB_PASSWORD=TitanPass2024!" >> "$ENV_FILE"
    echo "DB_NAME=cuberbox_db" >> "$ENV_FILE"
    echo "ESL_HOST=127.0.0.1" >> "$ENV_FILE"
    echo "ESL_PORT=8021" >> "$ENV_FILE"
    echo "ESL_PASSWORD=ClueCon" >> "$ENV_FILE"
fi

# 3. NPM
print_status "Instalando módulos de Node.js..."
npm install >> "$LOG_FILE" 2>&1
print_success "Módulos instalados."

# 4. DB
if [ -f "$SCHEMA_FILE" ] && command -v psql >/dev/null 2>&1; then
    print_status "Inicializando base de datos local..."
    export PGPASSWORD="TitanPass2024!"
    if psql -h localhost -U cuberbox_admin -d cuberbox_db -f "$SCHEMA_FILE" >> "$LOG_FILE" 2>&1; then
        print_success "Esquema de base de datos inicializado."
        
        # Seed Production Data
        if [ -f "./setup/seed_production.sql" ]; then
            read -p "¿Desea cargar los datos iniciales de producción (admin, campañas base)? (s/n): " seed_db
            if [[ "$seed_db" =~ ^[Ss]$ ]]; then
                if psql -h localhost -U cuberbox_admin -d cuberbox_db -f "./setup/seed_production.sql" >> "$LOG_FILE" 2>&1; then
                    print_success "Datos de producción cargados correctamente."
                else
                    print_error "Error al cargar datos de producción."
                fi
            fi
        fi
    else
        print_error "Error al inicializar el esquema de base de datos."
    fi
    unset PGPASSWORD
fi

print_success "Instalación Standalone completada."
