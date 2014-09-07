var request = require('./request');

module.exports = function Controller(options) {

    this.getMethod = function (path, verb) {
        return options[path][verb];
    };

    this.map = function (server) {
        for (var path in options) {
            if(options.hasOwnProperty(path)) {
                var verbs = options[path];
                for (var verb in verbs) {
                    if(verbs.hasOwnProperty(verb)) {
                        server[verb](path, request.process(verbs[verb]));
                    }
                }
            }
        }
    };

};