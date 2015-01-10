var _ = require('lodash');
var booter = require('./booter');

var config = require('./config/app.conf.js');
var options = _.merge({}, config);
// ToDo: merge database configuration into app.conf.js
options.database = require('../knexfile').development;
booter.booting(options);