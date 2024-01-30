const pm2 = require('pm2');

module.exports = {
    connect: () => {
        return new Promise((resolve, reject) => {
            pm2.connect((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve()
            })
        })
    },
    start: (cwd, script, name) => {
        return new Promise((resolve, reject) => {
            pm2.start({
                cwd: cwd,
                script: script,
                name: name,
                watch: false,
                instances: 1,
                autorestart: true,
            }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve()
            });
        })
    },
    stop: (name) => {
        return new Promise((resolve, reject) => {
            pm2.stop(name, (err)=>{
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        })
    },
    status: (name) =>{
        return new Promise((resolve, reject) => {
            pm2.describe(name, (err, data)=>{
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data[0]);
            })
        })
    },
    disconnect: () =>{
        pm2.disconnect();
    }
}