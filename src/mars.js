var booter = require('./booter');

var options = require('../conf/mars.conf.js');
options.database = require('../knexfile').development;
booter.boot(options);