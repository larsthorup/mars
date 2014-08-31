var P = require('bluebird');
var https = require('https');

function requesting(options) {
    return new P(function (resolve, reject) {
        var req = https.request(options, function (response) {
            // Bundle the result
            var result = {
                'statusCode': response.statusCode,
                'headers': response.headers,
                'body': ''
            };

            // Build the body
            response.on('data', function(chunk) {
                result.body += chunk;
            });

            // Resolve the promise
            response.on('end', function () {
                // console.log(result);
                resolve(result);
            });
        });
        req.end();

        req.on('error', function (e) {
            reject(e);
        });
    });
}

module.exports = {
    requesting: requesting
};

