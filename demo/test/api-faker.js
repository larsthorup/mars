(function (window) {

    function loading(path) {
        return new Promise(function (resolve, reject) {
            var api;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);
            xhr.onload = function () {
                var apiSample = JSON.parse(this.responseText);
                api = {};
                apiSample.forEach(function (sampleExchange) {
                    var fakeExchange = {
                        method: sampleExchange.request.method,
                        uri: sampleExchange.request.uri,
                        version: sampleExchange.request.headers['accept-version'],
                        requestBody: JSON.stringify(sampleExchange.request.body),
                        statusCode: sampleExchange.response.statusCode,
                        headers: {},
                        responseBody: JSON.stringify(sampleExchange.response.body)
                    };
                    // console.log(fakeExchange.method, fakeExchange.uri, fakeExchange.version, fakeExchange.requestBody, fakeExchange.statusCode, fakeExchange.responseBody);
                    var key = JSON.stringify({method: fakeExchange.method, uri: fakeExchange.uri});
                    var fakeExchangeList = api[key] || [];
                    fakeExchangeList.push(fakeExchange);
                    api[key] = fakeExchangeList;
                });
                // Note: adding test specific data
                // ToDo: move back to test
                var key = JSON.stringify({method: 'GET', uri: 'https://mars.com/weather/'});
                api[key] = [{
                    version: '^0.9.4',
                    requestBody: JSON.stringify({}),
                    statusCode: 200,
                    headers: {},
                    responseBody: JSON.stringify({text: 'dim'})
                }];
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
        fake: fake
    };

})(window);