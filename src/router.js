var path = require('path');
var controllers = require('require-all')(path.resolve(__dirname, 'controller/'));

function map(server) {
    for (var controllerName in controllers) {
        if(controllers.hasOwnProperty(controllerName)) {
            var controller = controllers[controllerName];
            controller.map(server);
        }
    }
}

module.exports = {
    map: map
};