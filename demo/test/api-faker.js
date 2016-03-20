/* globals Promise, sinonHarServer */
(function (window) {

    function add(harFile, exchange) {
        var harEntry = {
            request: {
                method: exchange.method,
                url: {
                    href: exchange.uri
                },
                headers: [
                    { name: 'accept-version', value: exchange.version }
                ],
                postData: exchange.requestBody ? {
                    text: exchange.requestBody
                } : undefined
            },
            response: {
                status: exchange.statusCode,
                content: {
                    text: exchange.responseBody
                }
            }
        };
        harFile.log.entries.push(harEntry);
    }

    function loading(path) {
        return new Promise(function (resolve, reject) {
            var api;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);
            xhr.onload = function () {
                var harFile = JSON.parse(this.responseText);
                resolve(harFile);
            };
            xhr.send();
        });
    }

    function fake(options) {
        options.server.autoRespond = true;
        options.server.autoRespondAfter = 1;
        return sinonHarServer.load(options.server, options.api);
    }

    window.apiFaker = {
        loading: loading,
        fake: fake,
        add: add
    };

})(window);