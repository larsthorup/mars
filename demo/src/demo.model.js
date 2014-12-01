function authenticating(options) {
    return requesting({
        method: 'POST',
        path: '/auth/authenticate/' + options.user,
        body: JSON.stringify({
            pass: options.pass
        })
    })
    .then(function (result) {
        return {
            token: result.token
        };
    });
}

function requesting(options) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(options.method, 'https://' + window.mars.apiServer + options.path, true);
        if(options.versionRange) {
            xhr.setRequestHeader('Accept-Version', options.versionRange);
        }
        if(window.mars.token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + window.mars.token);
        }
        if(options.method === 'PATCH' || options.method === 'POST') {
            xhr.setRequestHeader('Content-type', 'application/json');
        }
        if(options.version) {
            xhr.setRequestHeader('If-Match', options.version);
        }
        xhr.onload = function () {
            var response;
            try {
                response = JSON.parse(this.responseText);
            }
            catch(ex) {
                // Note: ignore
            }
            // ToDo: read ETag response header
            // console.dir(response);
            if(this.status === 200) {
                resolve(response);
            } else {
                reject(new Error(response ? response.message : this.statusText));
            }
        };
        xhr.onerror = function () {
            // console.dir(this);
            reject('failed');
        };
        xhr.send(options.body);
    });
}
