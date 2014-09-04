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
    requesting('POST', '/auth/authenticate/' + user, {pass: pass})
    .then(function (result) {
        window.mars.token = result.token;
        document.getElementById('authPage').style.display = 'none';
        gotoGreeting();
    })
    .catch(function (err) {
        window.alert('Failed to login: ' + err.message);
    });
}

function gotoGreeting() {
    document.getElementById('greetingPage').style.display = 'block';
    document.getElementById('helloButton').addEventListener('click', hello);
}

function hello() {
    var name = document.getElementById('name').value;
    requesting('GET', '/hello/' + name)
    .then(function (result) {
        window.alert('Greeting: ' + result);
    })
    .catch(function (err) {
        window.alert('Failed to greet: ' + err.message);
    });
}

function requesting(method, path, args) {
    return new Promise(function (resolve, reject) {
        var data = new FormData();

        if(args) {
            // ToDo: not multipart/form-data
            // ToDo: iterate over args
            data.append('pass', args.pass);
        }

        var xhr = new XMLHttpRequest();
        xhr.open(method, 'https://localhost:1719' + path, true);
        if(window.mars.token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + window.mars.token);
        }
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