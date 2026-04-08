# 03. Guía de Instalación
## CUBERBOX NEXUS CORE v4.7.9 - AUTHORITY NODE

![Installation Guide](https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1974&auto=format&fit=crop)

CUBERBOX Nexus Core ofrece dos métodos principales de instalación: automática mediante ISO y manual mediante script.

## Método 1: Instalación Automática (ISO)

Este es el método recomendado para servidores nuevos o máquinas virtuales.

1. **Descargar ISO**: Obtenga la imagen `debian-12-cuberbox-nexus.iso` desde el panel de administración.
2. **Grabar ISO**: Use una herramienta como Rufus o BalenaEtcher para crear un USB de arranque.
3. **Arrancar Servidor**: Seleccione el arranque desde el USB.
4. **Instalación Desatendida**: El sistema instalará Debian 12 y CUBERBOX Nexus Core automáticamente sin intervención del usuario.
5. **Finalización**: El servidor se reiniciará y estará listo para su uso.

## Método 2: Instalación Manual (Script)

Si ya tiene un servidor con Debian 12 instalado, puede usar el script de instalación.

1. **Acceso Root**: Inicie sesión como root en su servidor.
2. **Descargar Script**: Ejecute el siguiente comando:
   ```bash
   curl -sSL https://[TU-DOMINIO]/nexus-installer.sh | bash
   ```
3. **Seguir el Asistente**: El instalador TUI (Text User Interface) le guiará a través de los pasos:
   - **Standalone**: Instalación completa en un solo nodo.
   - **Cluster**: Configuración de alta disponibilidad (HA).
   - **Components**: Instalación de módulos específicos.

## Verificación de la Instalación

Una vez finalizado el proceso, puede verificar que los servicios estén activos:
```bash
systemctl status nexus-web
systemctl status nexus-core
systemctl status freeswitch
```

Acceda a la interfaz web mediante: `https://[IP-DEL-SERVIDOR]:3000`

© 2026 CUBERBOX Nexus Core. Todos los derechos reservados.
