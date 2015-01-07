var _ = require('lodash');
var booter = require('./booter');

var marsConfig = require('./config/mars.conf.js');
var options = _.merge({}, marsConfig);
options.database = require('../knexfile').development;
booter.booting(options);