# Nexus Core - Debian 12 ISO Personalizada

Esta guía detalla cómo crear una imagen ISO de Debian 12 que instala automáticamente Nexus Core mediante el script `nexus-installer.sh`.

## Requisitos
- Un sistema Linux (Debian/Ubuntu recomendado).
- Herramientas de creación de ISO: `xorriso`, `isolinux`, `wget`, `cpio`.

Puede instalarlas con el siguiente comando:
```bash
sudo apt-get update && sudo apt-get install -y xorriso isolinux wget cpio
```

## Pasos para la Creación

1. **Descargar el script de construcción:**
   Descargue el archivo `build-iso.sh` desde la aplicación Nexus Core.

2. **Dar permisos de ejecución:**
   ```bash
   chmod +x build-iso.sh
   ```

3. **Ejecutar el script:**
   ```bash
   sudo ./build-iso.sh
   ```
   El script descargará la ISO base de Debian, integrará el archivo `preseed.cfg` y generará una nueva ISO llamada `debian-12-nexus-core.iso`.

## ¿Qué incluye la ISO?
- **Debian 12 Netinstall:** Una base ligera y estable.
- **Instalación Automática:** Gracias al archivo `preseed.cfg`, la instalación de Debian no requiere intervención del usuario.
- **Nexus Installer:** Al finalizar la instalación de Debian, se descarga y ejecuta automáticamente `nexus-installer.sh`.
- **Configuración por Defecto:**
  - Usuario root: `nexus` / `nexus`
  - Hostname: `nexus-core`
  - Zona Horaria: `Europe/Madrid`

## Manuales Integrados
Todos los manuales técnicos están disponibles dentro de la aplicación Nexus Core en la sección **Manuales Nexus**.
- Guía de Instalación
- Guía de Configuración
- Resolución de Problemas

## Soporte
Para más información, consulte la documentación oficial en el panel de administración de Nexus Core.
