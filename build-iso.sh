#!/bin/bash

# CUBERBOX Nexus Core - Debian 12 ISO Builder Script
# Este script automatiza la creación de una ISO personalizada de Debian 12
# que incluye el instalador de CUBERBOX Nexus Core y configuración preseed.

# Requisitos: xorriso, isolinux, wget, cpio

set -e

# 0. Verificación de Dependencias
echo "Verificando dependencias necesarias..."
DEPS=("xorriso" "isolinux" "wget" "cpio")
MISSING_DEPS=()

for dep in "${DEPS[@]}"; do
    if ! command -v "$dep" &> /dev/null; then
        MISSING_DEPS+=("$dep")
    fi
done

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo "Faltan las siguientes dependencias: ${MISSING_DEPS[*]}"
    if [[ $EUID -eq 0 ]]; then
        echo "Intentando instalar dependencias automáticamente..."
        apt-get update && apt-get install -y xorriso isolinux wget cpio
    else
        echo "Por favor, instale las dependencias manualmente: sudo apt-get install xorriso isolinux wget cpio"
        exit 1
    fi
fi

# Variables
ISO_URL="https://cdimage.debian.org/cdimage/archive/12.9.0/amd64/iso-cd/debian-12.9.0-amd64-netinst.iso"
ISO_NAME="debian-12-cuberbox-nexus.iso"
WORKING_DIR="iso_build"
NEXUS_INSTALLER_URL="https://[TU-DOMINIO]/nexus-installer.sh"
PRESEED_URL="https://[TU-DOMINIO]/iso/preseed.cfg"

echo "--- Iniciando creación de ISO personalizada de CUBERBOX Nexus Core ---"

# Preguntar por la ruta de instalación de CUBERBOX Nexus en el sistema destino
read -p "Ingrese la ruta de instalación por defecto para CUBERBOX Nexus Core (ej: /opt/nexus): " INSTALL_PATH
INSTALL_PATH=${INSTALL_PATH:-"/opt/nexus"}
echo "Usando ruta de instalación: $INSTALL_PATH"

# 1. Limpieza y preparación
rm -rf $WORKING_DIR
mkdir -p $WORKING_DIR/iso_content

# 2. Descargar ISO base
if [ ! -f "debian-base.iso" ]; then
    echo "Descargando ISO base de Debian 12..."
    if ! wget -O debian-base.iso $ISO_URL; then
        echo "Error: No se pudo descargar la ISO de Debian. Es posible que la versión 12.9.0 haya sido actualizada."
        echo "Por favor, verifica la URL actual en: https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/"
        exit 1
    fi
fi

# 3. Extraer contenido de la ISO
echo "Extrayendo contenido de la ISO..."
xorriso -osirrox on -indev debian-base.iso -extract / $WORKING_DIR/iso_content

# 4. Añadir archivo preseed
echo "Añadiendo archivo preseed..."
wget -O $WORKING_DIR/iso_content/preseed.cfg $PRESEED_URL
# Personalizar la ruta de instalación en el preseed
sed -i "s|/root/nexus-installer.sh --auto|/root/nexus-installer.sh --auto --path $INSTALL_PATH|" $WORKING_DIR/iso_content/preseed.cfg

# 5. Modificar configuración de arranque (isolinux)
echo "Configurando arranque automático..."
chmod +w $WORKING_DIR/iso_content/isolinux/isolinux.cfg
sed -i 's/default install/default nexus-install/' $WORKING_DIR/iso_content/isolinux/isolinux.cfg
cat <<EOF >> $WORKING_DIR/iso_content/isolinux/isolinux.cfg

label nexus-install
	menu label ^CUBERBOX Nexus Core Automated Install
	kernel /install.amd/vmlinuz
	append vga=788 initrd=/install.amd/initrd.gz auto=true priority=critical preseed/file=/cdrom/preseed.cfg --- quiet
EOF

# 6. Reconstruir la ISO
echo "Reconstruyendo la ISO..."
xorriso -as mkisofs \
    -o $ISO_NAME \
    -isohybrid-mbr /usr/lib/ISOLINUX/isohdpfx.bin \
    -c isolinux/boot.cat \
    -b isolinux/isolinux.bin \
    -no-emul-boot -boot-load-size 4 -boot-info-table \
    -eltorito-alt-boot \
    -e boot/grub/efi.img \
    -no-emul-boot -isohybrid-gpt-basdat \
    $WORKING_DIR/iso_content

echo "--- ISO Creada con éxito: $ISO_NAME ---"
echo "Puede grabarla en un USB o usarla en una VM."
