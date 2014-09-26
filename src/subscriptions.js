function Subscriptions() {
    var clients = {};
    var paths = {};

    this.subscribe = function subscribe(client, path) {
        paths[path] = paths[path] || {};
        paths[path][client] = true;
        clients[client] = clients[client] || {};
        clients[client][path] = true;
    };

    this.unsubscribe = function unsubscribe(client, path) {
        delete paths[path][client];
        delete clients[client][path];
    };

    this.getClients = function getClients(path) {
        var set = paths[path];
        if(set) {
            return Object.keys(set);
        } else {
            return [];
        }
    };

    this.getPaths = function getPaths(client) {
        var set = clients[client];
        if(set) {
            return Object.keys(set);
        } else {
            return [];
        }
    };


    this.unsubscribeClient = function unsubscribeClient(client) {
        this.getPaths(client).forEach(function (path) {
            delete paths[path][client];
        });
        delete clients[client];
    };
}

module.exports = {
    Subscriptions: Subscriptions
};