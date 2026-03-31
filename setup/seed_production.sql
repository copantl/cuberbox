-- NEXUS CORE - Production Seed Data V4.7.9
-- Datos iniciales para arranque en producción

-- 1. Usuario Administrador por defecto
-- Password: admin123 (Hash de ejemplo, se recomienda cambiar en el primer inicio)
INSERT INTO users (username, full_name, password_hash, role, email, extension, is_active)
VALUES (
    'admin', 
    'Administrador Nexus', 
    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaGuZNCPVWRXKCAfGuZNCPVWRXKCAfG', -- admin123
    'ADMIN', 
    'admin@nexus.com', 
    '1000', 
    TRUE
) ON CONFLICT (username) DO NOTHING;

-- 2. Campaña de Bienvenida
INSERT INTO campaigns (name, campaign_type, dial_method, auto_dial_level, hopper_level, amd_enabled)
VALUES (
    'Campaña de Bienvenida', 
    'OUTBOUND', 
    'RATIO', 
    1.5, 
    200, 
    TRUE
) ON CONFLICT DO NOTHING;

-- 3. Lista de Prueba vinculada a la campaña anterior
INSERT INTO lists (campaign_id, name, is_active)
SELECT id, 'Lista de Prueba Inicial', TRUE 
FROM campaigns 
WHERE name = 'Campaña de Bienvenida'
LIMIT 1;

-- 4. Nodo de Telefonía Maestro (Local)
INSERT INTO telephony_nodes (name, ip, port, password, role, status)
VALUES (
    'Nexus-Master-Local', 
    '127.0.0.1', 
    8021, 
    'ClueCon', 
    'MASTER', 
    'ONLINE'
) ON CONFLICT DO NOTHING;

-- 5. Mensaje Omnicanal de Bienvenida
INSERT INTO omnichannel_messages (channel, sender_id, content, direction, status)
VALUES (
    'SYSTEM', 
    'NEXUS-CORE', 
    'Sistema Nexus Core inicializado correctamente en entorno de producción.', 
    'inbound', 
    'delivered'
) ON CONFLICT DO NOTHING;
