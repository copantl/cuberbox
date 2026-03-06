#!/bin/bash

# Cuberbox Pro - Systemd Service Installer
# This script creates the necessary systemd unit files for Cuberbox Pro.

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)" 
   exit 1
fi

echo "Creating cuberbox-web.service..."
cat <<EOF > /etc/systemd/system/cuberbox-web.service
[Unit]
Description=Cuberbox Web Interface
After=network.target

[Service]
Type=simple
WorkingDirectory=$(pwd)
ExecStart=$(which npm) run dev -- --host 0.0.0.0
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

echo "Creating cuberbox.service (Connector)..."
cat <<EOF > /etc/systemd/system/cuberbox.service
[Unit]
Description=Cuberbox Pro Connector
After=network.target freeswitch.service

[Service]
Type=simple
WorkingDirectory=$(pwd)
ExecStart=/usr/local/bin/cuberbox-connector
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "Reloading systemd daemon..."
systemctl daemon-reload

echo "Enabling and starting services..."
systemctl enable --now cuberbox-web
systemctl enable --now cuberbox

echo "------------------------------------------------"
echo "Setup complete!"
echo "Check status with: systemctl status cuberbox-web"
echo "Check status with: systemctl status cuberbox"
echo "------------------------------------------------"
