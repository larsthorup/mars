/* global -Promise */
var Promise = require('bluebird');
var path = require('path');
var models = require('require-all')(path.resolve(__dirname, 'model/'));

function runningTasksInSequence(steps) {
    var chain = Promise.resolve();
    while(steps.length){
        chain = chain.then(steps.shift());
    }
    return chain;
}

function creating(repo) {
    // ToDo: auto generate dependency graph from columnInfo()
    var orderedModels = [models.user, models.entry];
    var testDataCreationTasks = orderedModels.map(function (model) {
        return function () {
            return model.creatingTestData(repo);
        };
    });
    return runningTasksInSequence(testDataCreationTasks);
}

module.exports = {
    creating: creating
};