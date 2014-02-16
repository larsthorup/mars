var repo = require('./repo');
var server = require('./server');

function boot() {
    repo.connect();
    repo.sampleData().then(function () {
        server.start();
    });
}

module.exports = {
    boot: boot
};