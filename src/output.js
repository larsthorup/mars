function log() {
    console.log.apply(console, arguments);
}

module.exports = {
    log: log
};
