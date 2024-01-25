version="v1.0.0"
repo_url="https://github.com/pig0224/skyproxy"
file_path="skyproxy-manager.zip"
extracted_folder="/root/sky/"
service_name="sky-manager"
command_to_run="/root/sky/manager"

cat <<EOF | sudo tee "/etc/systemd/system/$service_name.service" > /dev/null
[Unit]
Description=Sky Manager

[Service]
Type=simple
WorkingDirectory=/root/sky/
ExecStart=/root/sky/manager
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

rm -rf "$extracted_folder" &&
wget "$repo_url/raw/main/v1.0.0/$file_path" -O sky-manager.zip &&
unzip -q sky-manager.zip -d "$extracted_folder" &&
chmod +x /root/sky/manager &&
sudo systemctl daemon-reload &&
sudo systemctl start "$service_name" &&
sudo systemctl enable "$service_name" &&
echo "sky-manager 启动成功"