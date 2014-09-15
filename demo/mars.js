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
    requesting('POST', '/auth/authenticate/' + user, null, {pass: pass})
    .then(function (result) {
        window.mars.token = result.token;
        document.getElementById('authPage').style.display = 'none';
        gotoMenu();
    })
    .catch(function (err) {
        window.alert('Failed to login: ' + err.message);
    });
}

function gotoMenu() {
    document.getElementById('menuPage').style.display = 'block';
    document.getElementById('gotoGreetingButton').addEventListener('click', gotoGreeting);
    document.getElementById('gotoEntryButton').addEventListener('click', gotoEntry);
}

function gotoGreeting() {
    document.getElementById('entryPage').style.display = 'none';
    document.getElementById('greetingPage').style.display = 'block';
    document.getElementById('helloButton').addEventListener('click', hello);
}

function hello() {
    var name = document.getElementById('name').value;
    requesting('GET', '/hello/' + name, '0.1.0')
    .then(function (result) {
        window.alert('Greeting: ' + result);
    })
    .catch(function (err) {
        window.alert('Failed to greet: ' + err.message);
    });
}

function gotoEntry() {
    document.getElementById('greetingPage').style.display = 'none';
    document.getElementById('entryPage').style.display = 'block';
    requesting('GET', '/entry/latest', '0.1.0')
    .then(function (result) {
        renderEntryList(result.entry);
    })
    .catch(function (err) {
        window.alert('Failed to load entries: ' + err.message);
    });
}

function renderEntryList(entries) {
    var entryListItemTemplate = document.getElementById('entryListItemTemplate').innerHTML;
    var entryListContainer = document.getElementById('entryList');
    entryListContainer.innerHTML = '';
    entries.forEach(function (entry) {
        entryListContainer.innerHTML += instantiateHtml(entryListItemTemplate, entry);
    });
    var entryListItems = entryListContainer.getElementsByClassName('entryListItem');
    for(entryListItem of entryListItems) {
        entryListItem.addEventListener('click', openEntry);
    }
}

function openEntry() {
    var id = this.dataset.id;
    requesting('GET', '/entry/' + id, '0.1.0')
    .then(function (entry) {
        renderEntry(entry);
    })
    .catch(function (err) {
        window.alert('Failed to load entry: ' + err.message);
    });
}

function renderEntry(entry) {
    var entryTemplate = document.getElementById('entryTemplate').innerHTML;
    var entryContainer = document.getElementById('entry');
    entryContainer.innerHTML = instantiateHtml(entryTemplate, entry);
}

function instantiateHtml(template, options) {
    return template.replace(/{{([^{}]*)}}/g, function (match, key) {
        var value = options[key];
        if(!value) {
            value = match;
        }
        if(typeof value !== 'string') {
            value = value.toString();
        }
        return value;
    });
}

function requesting(method, path, versionRange, args) {
    return new Promise(function (resolve, reject) {
        var data = new FormData();

        if(args) {
            // ToDo: not multipart/form-data
            // ToDo: iterate over args
            data.append('pass', args.pass);
        }

        var xhr = new XMLHttpRequest();
        xhr.open(method, 'https://localhost:1719' + path, true);
        if(versionRange) {
            xhr.setRequestHeader('Accept-Version', versionRange);
        }
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

// From: http://stackoverflow.com/a/4835406/975539
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}