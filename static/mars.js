document.addEventListener('DOMContentLoaded', main);

function main() {
    window.mars = {};
    gotoAuth();
}

function gotoAuth() {
    document.getElementById('authPage').style.display = 'block';
    document.getElementById('authButton').addEventListener('click', authenticate);
}

function authenticate() {
    var user = document.getElementById('user').value;
    var pass = document.getElementById('pass').value;
    posting('/auth/authenticate/' + user, {pass: pass})
    .then(function (result) {
        window.mars.token = result.token;
        gotoGreeting();
    })
    .catch(function (err) {
        window.alert(err.message);
    });
}

function gotoGreeting() {
}

function posting(path, args) {
    return new Promise(function (resolve, reject) {
        var data = new FormData();
        data.append('pass', args.pass); // ToDo: iterate
        // data.append('user', args.user); // ToDo: iterate

        // ToDo: https non-strict
        // ToDo: authorization header
        // ToDo: CORS
        // ToDo: not multipart/form-data

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://localhost:1719' + path, true);
        xhr.onload = function () {
            var response = JSON.parse(this.responseText);
            console.dir(response);
            if(this.status == 200) {
                resolve(response);
            } else {
                reject(new Error(response.message));
            }
        };
        xhr.onerror = function () {
            console.dir(this);
            reject('failed');
        };
        xhr.send(data);
    });
}