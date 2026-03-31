#!/bin/bash

# Nexus Core - Systemd Service Installer
# This script creates the necessary systemd unit files for Nexus Core.

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)" 
   exit 1
fi

echo "Creating nexus-web.service..."
cat <<EOF > /etc/systemd/system/nexus-web.service
[Unit]
Description=Nexus Core Web Interface
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/nexus
ExecStart=$(which npm) run dev -- --host 0.0.0.0
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

echo "Creating nexus-core.service (Connector)..."
cat <<EOF > /etc/systemd/system/nexus-core.service
[Unit]
Description=Nexus Core Connector
After=network.target freeswitch.service

[Service]
Type=simple
WorkingDirectory=/opt/nexus
ExecStart=/usr/local/bin/nexus-connector
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "Reloading systemd daemon..."
systemctl daemon-reload

echo "Enabling and starting services..."
systemctl enable --now nexus-web
systemctl enable --now nexus-core

echo "------------------------------------------------"
echo "Setup complete!"
echo "Check status with: systemctl status nexus-web"
echo "Check status with: systemctl status nexus-core"
echo "------------------------------------------------"
