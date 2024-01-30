const fs = require('fs');

module.exports = {
    isWin: () => {
        if (process.platform === 'win32') {
            return true;
        }
        return false;
    }
}