/* global -Promise */
var Promise = require('bluebird');

var auth = require('../auth');
var clients = require('../clients');
var Controller = require('../controller');
var repo = require('../repo');

module.exports = new Controller({
    'latest': {
        '0.1.0': {
            get: {
                authorize: auth.user,
                processing: function getLatest(req) {
                    return repo.entry.findingLatest(req.app.repo).then(function (entry) {
                        // ToDo: add ETag header with version
                        return {
                            entry: entry
                        };
                    });
                }
            }
        }
    },
    ':id': {
        '0.1.0': {
            get: {
                authorize: auth.user,
                processing: function getById(req) {
                    return repo.entry.findingById(req.app.repo, req.params.id);
                }
            },
            patch: {
                // ToDo: auth.author??
                authorize: auth.user,
                processing: function patchById(req) {
                    // ToDo: move extraction of IF-Match header and req.body to server plugin
                    // guided by the mime type
                    var id = req.params.id;
                    var version = parseInt(req.headers['if-match']);
                    var patch = req.body;
                    return repo.entry.patching(req.app.repo, id, version, patch)
                    .then(function (result) {
                        req.app.clients.notifyPatch({
                            path: req.url,
                            fromVersion: version.toString(),
                            patch: patch,
                            toVersion: result.version.toString()
                        });
                        return result;
                    });
                }
            }
        }
    }

});