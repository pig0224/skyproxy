#!/usr/bin/env node
async function main() {
    const { Command } = require('commander');
    const program = new Command();

    const os = require('os');
    const path = require('path');
    const userHome = os.homedir();
    const fs = require('fs');
    const PM2 = require("./pm2.js");
    const name = "skyproxy";
    const { isWin } = require('./utils.js');

    program.version("v" + require("../package.json").version).name(name).usage('<command> [options]');

    program.command('start').description('start sky manager').action(async () => {
        const skyPath = path.resolve(__dirname, "..", "sky")
        const configPath = path.join(skyPath, "config")
        if(!fs.existsSync(path.join(userHome, "sky"))){
            fs.mkdirSync(path.join(userHome, "sky"), { recursive: true });
        }
        const dbPath = path.join(path.join(userHome, "sky"), "manager.sqlite3")
        const logPath = path.join(path.join(userHome, "sky"), "logs")
        const managerJSON = {
            "mode": "prod",
            "logger": {
                "path": logPath,
                "level": "prod",
                "stdout": false,
                "RotateExpire": "1d",
                "RotateBackupLimit": 100,
                "RotateBackupExpire": "7d"
            },
            "database": {
                "manager": {
                    "type": "sqlite",
                    "timezone": "UTC",
                    "link": `sqlite::@file(${dbPath})`
                }
            },
            "server": {
                "gateway": "http://proxy-manager-api.skyproxy.cn/api",
                "super_protocol": "socks",
                "super_server": "proxy.skyproxy.cn",
                "super_port": 52222
            }
        }
        const managerProxyJSON = {
            "inbounds": [],
            "outbounds": [
                {
                    "type": "direct",
                    "tag": "direct"
                },
                {
                    "type": "block",
                    "tag": "block"
                }
            ]
        }
        if (!fs.existsSync(dbPath)) {
            fs.copyFile(path.resolve(__dirname, "..", "manager.sqlite3"), dbPath, (err) => {
                if (err) {
                    console.error(err);
                    process.exit(2)
                }
            })
        }
        if (!fs.existsSync(path.join(configPath, "manager.json"))) {
            fs.writeFile(path.join(configPath, "manager.json"), JSON.stringify(managerJSON, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    process.exit(2)
                }
            });
        }
        if (!fs.existsSync(path.join(configPath, "manager-proxy.json"))) {
            fs.writeFile(path.join(configPath, "manager-proxy.json"), JSON.stringify(managerProxyJSON, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    process.exit(2)
                }
            });
        }
        try {
            await PM2.connect()
            await PM2.start(path.resolve(__dirname, "..", "sky"), isWin ? 'manager.exe' : 'manager', name)
            PM2.disconnect()
            console.info("Skyproxy started")
        } catch (err) {
            PM2.disconnect()
            console.error(err);
            process.exit(2)
        }
    })

    program.command('status').description('sky manager status').action(async () => {
        try {
            await PM2.connect()
            const data = await PM2.status(name)
            console.info("skyproxy status: " + data.pm2_env.status)
            PM2.disconnect()
        } catch (err) {
            PM2.disconnect()
            console.error(err);
            process.exit(2)
        }
    })

    program.command('stop').description('stop sky manager').action(async () => {
        try {
            await PM2.connect()
            await PM2.stop(name)
            PM2.disconnect()
            console.info("skyproxy stopped")
        } catch (err) {
            PM2.disconnect()
            console.error(err);
            process.exit(2)
        }
    })

    program.command('update',  { isDefault: true }).action(()=>{
        
    })

    program.command('version',  { isDefault: true }).action(()=>{
        console.info("v" + require("../package.json").version)
    })

    await program.parseAsync(process.argv);
    process.exit();
}
main();