/* global -Promise */
var Promise = require('bluebird');

// Note: poor mans async generator while we wait for es7
// Note: this channel is buffered and unbounded
function Channel () {
    this.messageQueue = [];
    this.messageResolvers = [];
}

// Note: add a value to the sequence
Channel.prototype.put = function (data) {
    if(this.messageResolvers.length > 0) {
        var resolve = this.messageResolvers.splice(0, 1)[0];
        resolve(data);
    } else {
        this.messageQueue.push(data);
    }
};

// Note: returns a promise that will resolve with the next value from the sequence
Channel.prototype.take = function () {
    var self = this;
    return new Promise(function (resolve) {
        if(self.messageQueue.length > 0) {
            var message = self.messageQueue.splice(0, 1)[0];
            resolve(message);
        } else {
            self.messageResolvers.push(resolve);
        }
    });
};

module.exports = Channel;