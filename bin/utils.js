
module.exports = {
    isWin: () => {
        if (process.platform === 'win32') {
            return true;
        }
        return false;
    }
}