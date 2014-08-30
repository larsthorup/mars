var booter = require('./booter');

var options = require('../conf/mars.json');
options.database = require('../knexfile').development;
booter.boot(options);