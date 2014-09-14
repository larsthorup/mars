var request = require('./request');
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

    this.map = function (server) {
        Object.keys(options).forEach(function (path) {
            var versions = options[path];
            Object.keys(versions).forEach(function (version) {
                var verbs = versions[version];
                Object.keys(verbs).forEach(function (verb) {
                    var pathAndVersion = {
                        path: path,
                        version: version
                    };
                    var handler = verbs[verb];
                    var register = server[verb];
                    if(!register) {
                        throw new Error('Cannot register verb ' + verb);
                    }
                    register.call(server, pathAndVersion, request.process(handler));
                });
            });
        });
    };

};