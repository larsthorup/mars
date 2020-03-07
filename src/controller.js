var request = require('./request');
var restify = require('restify');
var semver = require('semver');

module.exports = function Controller(options) {

    this.getMethod = function (path, versionRange, verb) {
        var versions = options[path];
        for(var version in versions) {
            if(semver.satisfies(version, versionRange)) {
                return versions[version][verb];
            }
        }
        throw new Error('No match for version ' + versionRange + ' of method ' + path);
    };

    this.map = function (server, controllerName) {
        Object.keys(options).forEach(function (path) {
            var versions = options[path];
            var fullPath = path[0] === '/' ? path : '/' + controllerName + '/' + path;
            var handlersPerVerb = {};
            Object.keys(versions).forEach(function (version) {
                var verbs = versions[version];
                Object.keys(verbs).forEach(function (verb) {
                    var handler = verbs[verb];
                    handlersPerVerb[verb] = handlersPerVerb[verb] || [];
                    handlersPerVerb[verb].push({
                        version: version,
                        handler: request.process(handler)
                    });
                });
            });
            Object.keys(handlersPerVerb).forEach(function (verb) {
                var register = server[verb];
                if(!register) {
                    throw new Error('Cannot register verb ' + verb);
                }
                var handler = restify.plugins.conditionalHandler(handlersPerVerb[verb]);
                register.call(server, fullPath, handler);
            });
        });
    };

};
