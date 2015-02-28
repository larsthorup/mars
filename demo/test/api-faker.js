/* globals Promise */
(function (window) {

    function add(api, exchange) {
        // console.dir(exchange);
        var key = JSON.stringify({method: exchange.method, uri: exchange.uri});
        var exchangeList = api[key] || [];
        exchangeList.push(exchange);
        api[key] = exchangeList;
    }

    function loading(path) {
        return new Promise(function (resolve, reject) {
            var api;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);
            xhr.onload = function () {
                var apiSample = JSON.parse(this.responseText);
                api = {};
                apiSample.forEach(function (sampleExchange) {
                    var exchange = {
                        method: sampleExchange.request.method,
                        uri: sampleExchange.request.uri,
                        version: sampleExchange.request.headers['accept-version'],
                        requestBody: JSON.stringify(sampleExchange.request.body),
                        statusCode: sampleExchange.response.statusCode,
                        headers: {},
                        responseBody: JSON.stringify(sampleExchange.response.body)
                    };
                    add(api, exchange);
                });
                resolve(api);
            };
            xhr.send();
        });
    }

    function fake(options) {
        options.server.respondWith(function (request) {
            var keyString = JSON.stringify({method: request.method, uri: request.url});
            var acceptVersion = request.requestHeaders['Accept-Version'];
            // console.log(keyString);
            var fakeExchangeList = options.api[keyString];
            var mockExchange;
            if(fakeExchangeList) {
                for (var i = 0; i < fakeExchangeList.length; ++i) {
                    var fakeExchange = fakeExchangeList[i];
                    if (fakeExchange.version === acceptVersion) {
                        if (request.method === 'GET' || fakeExchange.requestBody === request.requestBody) {
                            mockExchange = fakeExchange;
                            break;
                        }
                    }
                }
            }
            if(mockExchange) {
                // console.log(mockExchange.method, mockExchange.uri, mockExchange.version, mockExchange.requestBody, mockExchange.statusCode, mockExchange.responseBody);
                request.respond(mockExchange.statusCode, mockExchange.headers, mockExchange.responseBody);
            } else {
                request.respond(404, {}, 'Not Found');
            }
        });
    }

    window.apiFaker = {
        loading: loading,
        fake: fake,
        add: add
    };

})(window);