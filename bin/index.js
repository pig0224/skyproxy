#!/usr/bin/env node
const os = require('os');
const path = require('path');
const userHome = os.homedir();
const fs = require('fs-extra')
const PM2 = require("./pm2.js");
const name = "skyproxy";
const { isWin } = require('./utils.js');

async function start() {
    const skyPath = path.join(userHome, "sky")
    const configPath = path.join(skyPath, "config")
    const dbPath = path.join(skyPath, "db")
    const logPath = path.join(skyPath, "logs")
    const versionFile = path.join(skyPath, "version.json")
    await fs.pathExists(skyPath).then(async (exists) => {
        if (!exists) {
            await fs.ensureDir(skyPath)
            await fs.copy(path.resolve(__dirname, "..", "sky"), skyPath)
        }
    })
    await fs.pathExists(configPath).then(async (exists) => {
        if (!exists) {
            await fs.ensureDir(configPath)
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
                        "link": `sqlite::@file(${path.join(dbPath, "manager.sqlite3")})`
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
                "dns": {
                    "strategy": "prefer_ipv4",
                    "disable_cache": true,
                    "disable_expire": true,
                    "independent_cache": true
                },
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
            const managerConfigFile = path.join(configPath, "manager.json")
            const managerProxyConfigFile = path.join(configPath, "manager-proxy.json")
            await fs.ensureFile(managerConfigFile)
            await fs.ensureFile(managerProxyConfigFile)
            await fs.writeJson(managerConfigFile, managerJSON)
            await fs.writeJson(managerProxyConfigFile, managerProxyJSON)
        }
    })
    await fs.pathExists(path.join(skyPath, "www")).then(async (exists) => {
        if (!exists) {
            await fs.copy(path.resolve(__dirname, "..", "sky", "www"), path.join(skyPath, "www"))
        }
    })
    await fs.pathExists(path.join(skyPath, "manager")).then(async (exists) => {
        if (!exists) {
            await fs.copy(path.resolve(__dirname, "..", "sky", "manager"), path.join(skyPath, "manager"))
        }
    })
    await fs.pathExists(path.join(skyPath, "manager.exe")).then(async (exists) => {
        if (!exists) {
            await fs.copy(path.resolve(__dirname, "..", "sky", "manager.exe"), path.join(skyPath, "manager.exe"))
        }
    })
    await fs.remove(versionFile)
    await fs.writeJSON(versionFile, { version: require("../package.json").version })
    const xPermissions = 0o755;
    fs.chmod(path.join(skyPath, "manager"), xPermissions, (err) => {
        if (err) {
            console.error(`not permissions: ${err.message}`);
            process.exit(2);
        }
    });
    fs.chmod(path.join(skyPath, "manager.exe"), xPermissions, (err) => {
        if (err) {
            console.error(`not permissions: ${err.message}`);
            process.exit(2);
        }
    });
    try {
        await PM2.connect()
        await PM2.start(skyPath, isWin() ? 'manager.exe' : 'manager', name)
        PM2.disconnect()
    } catch (err) {
        PM2.disconnect()
        console.error(err);
        process.exit(2)
    }
}

async function update() {
    const { exec } = require('child_process');
    const packageName = require("../package.json").name;
    const updateCommand = `npm install -g ${packageName}@latest`;
    const skyPath = path.join(userHome, "sky")
    const configPath = path.join(skyPath, "config")

    return new Promise((resolve, reject) => {
        exec(updateCommand, async (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            await fs.remove(path.join(skyPath, "manager"))
            await fs.remove(path.join(skyPath, "manager.exe"))
            await fs.remove(path.join(skyPath, "www"))
            await fs.remove(path.join(configPath, "manager.json"))
            await fs.remove(path.join(configPath, "manager-proxy.json"))
            resolve()
        });
    })
}

async function main() {
    const { Command } = require('commander');
    const program = new Command();

    program.version("v" + require("../package.json").version).name(name).usage('<command> [options]');

    program.command('start').description('start sky manager').action(async () => {
        try {
            console.info("starting...")
            await start();
            console.info("visit to manager pannel: http://your_ip:30000/")
            console.info("Skyproxy started")
        } catch (err) {
            console.error("error: " + err)
            process.exit(2)
        }
    })

    program.command('status').description('sky manager status').action(async () => {
        try {
            await PM2.connect()
            const status = await PM2.status(name)
            console.info("skyproxy status: " + status)
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
            await PM2.delete(name)
            PM2.disconnect()
            console.info("skyproxy stopped")
        } catch (err) {
            PM2.disconnect()
            console.error(err);
            process.exit(2)
        }
    })

    program.command('update', { isDefault: true }).action(async () => {
        try {
            console.info("updating...")
            await update();
            await PM2.connect()
            const status = await PM2.status(name)
            if (status == "online") {
                await PM2.stop(name)
            }
            await PM2.delete(name)
            await start();
            PM2.disconnect()
            console.info("update success")
        } catch (err) {
            PM2.disconnect()
            console.error("update error: " + err)
            process.exit(2)
        }
    })

    program.command('version', { isDefault: true }).action(() => {
        console.info("v" + require("../package.json").version)
    })

    await program.parseAsync(process.argv);
    process.exit();
}
main();