var booter = require('./booter');

var options = require('./config/mars.conf.js');
options.database = require('../knexfile').development;
booter.boot(options);