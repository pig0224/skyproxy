repo_url="https://github.com/pig0224/skyproxy"
file_path="lastest.zip"
extracted_folder="/root/sky/"
service_name="sky-manager"
command_to_run="/root/sky/manager"

cat <<EOF | sudo tee "/etc/systemd/system/$service_name.service" > /dev/null
[Unit]
Description=Sky Manager

[Service]
Type=simple
WorkingDirectory=/root/sky/
ExecStart=/root/sky/manager start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

rm -rf "$extracted_folder" &&
wget "$repo_url/raw/main/$file_path" -O sky-manager.zip &&
unzip -q sky-manager.zip -d "$extracted_folder" &&
chmod +x /root/sky/manager &&
sudo systemctl daemon-reload &&
sudo systemctl start "$service_name" &&
sudo systemctl enable "$service_name" &&
echo "sky-manager started"