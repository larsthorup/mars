var _ = require('lodash');
var booter = require('./booter');

var config = require('./config/app.conf.js');
var options = _.merge({}, config);
booter.booting(options);