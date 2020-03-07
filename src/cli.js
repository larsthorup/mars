var meow = require('meow');
var _ = require('lodash');
var booter = require('./booter');

var args = meow({
    pkg: require('../package.json'),
    help: [
        'Usage',
        '  node src/cli [options]',
        'Options',
        '    --db-recreate'
    ].join('\n')
});

var config = require('./config/app.conf.js');
var options = _.merge({}, config);
options.app.args = args;

booter.booting(options);
