var P = require('bluebird');
var https = require('https');

function getting(options) {
    return new P(function (resolve, reject) {
        https.get(options, function (response) {
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
        })
        .on('error', function (e) {
            reject(e);
        });
    });
}

module.exports = {
    getting: getting
};

