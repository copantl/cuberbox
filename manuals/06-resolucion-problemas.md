# 06. Resolución de Problemas
## CUBERBOX NEXUS CORE v4.7.9 - AUTHORITY NODE

![Troubleshooting Guide](https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop)

CUBERBOX Nexus Core está diseñado para ser robusto, pero pueden surgir problemas técnicos. Aquí tiene una guía rápida para solucionarlos.

## Problemas de FreeSwitch

Si FreeSwitch no arranca o no responde:

1. **Verificar Servicio**: `systemctl status freeswitch`
2. **Reiniciar Servicio**: `systemctl restart freeswitch`
3. **Verificar Logs**: `tail -f /var/log/freeswitch/freeswitch.log`

## Error de Conexión ESL (8021)

Si el panel de administración muestra "Error de conexión ESL":

1. **Verificar Puerto**: `netstat -tuln | grep 8021`
2. **Verificar Contraseña**: Asegúrese de que la contraseña en `event_socket.conf.xml` coincida con la de Ajustes Core.
3. **Verificar IP**: Asegúrese de que FreeSwitch esté escuchando en la IP correcta (por defecto `127.0.0.1`).

## Problemas de Audio WebRTC

Si los agentes no pueden escuchar o ser escuchados:

1. **Verificar HTTPS**: WebRTC requiere HTTPS obligatorio.
2. **Verificar Puertos RTP**: Asegúrese de que los puertos UDP 16384-32768 estén abiertos en el firewall.
3. **Verificar Códecs**: CUBERBOX Nexus Core prefiere Opus y G.711 (PCMU/PCMA).
4. **Verificar Micrófono**: Asegúrese de que el navegador tenga permisos de micrófono.

## Problemas de Base de Datos

Si el sistema no guarda registros o campañas:

1. **Verificar Servicio**: `systemctl status postgresql`
2. **Verificar Conexión**: Pruebe la conexión manual: `psql -h localhost -U nexus_admin -d nexus_db`
3. **Verificar Espacio en Disco**: `df -h`

## Soporte Técnico

Si el problema persiste, contacte con el equipo de soporte de CUBERBOX Nexus Core proporcionando los logs del sistema (`journalctl -u nexus-web`).

© 2026 CUBERBOX Nexus Core. Todos los derechos reservados.
