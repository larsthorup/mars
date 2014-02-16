var repo = require('./repo');
var server = require('./server');

repo.connect();
repo.sampleData().then(function () {
    server.start();
});