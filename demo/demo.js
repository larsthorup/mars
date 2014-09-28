document.addEventListener('DOMContentLoaded', main);

function main() {
    window.mars = {};
    window.mars.apiServer = 'localhost:1719';
    window.mars.apiSocket = new WebSocket('wss://' + window.mars.apiServer);
    // ToDo: authentication
    // ToDo: wait for 'open' event
    window.mars.apiSocket.onmessage = function (event) {
        // console.log('Received WebSocket message');
        var message = JSON.parse(event.data);
        // console.dir(message);
        patchEntry(message);
        // ToDo: dispatch to listeners[message.path]
    };
    gotoAuth();
}

function gotoAuth() {
    document.getElementById('authPage').style.display = 'block';
    document.getElementById('authButton').addEventListener('click', authenticate);
}

function authenticate() {
    var user = document.getElementById('user').value;
    var pass = document.getElementById('pass').value;
    requesting({
        method: 'POST',
        path: '/auth/authenticate/' + user,
        args: {
            pass: pass
        }
    })
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
    document.getElementById('gotoEntryListButton').addEventListener('click', gotoEntryList);
}

function gotoGreeting() {
    document.getElementById('entryListPage').style.display = 'none';
    document.getElementById('greetingPage').style.display = 'block';
    document.getElementById('helloButton').addEventListener('click', hello);
}

function hello() {
    var name = document.getElementById('name').value;
    requesting({
        method: 'GET',
        path: '/hello/' + name,
        versionRange: '0.1.0'
    })
    .then(function (result) {
        window.alert('Greeting: ' + result);
    })
    .catch(function (err) {
        window.alert('Failed to greet: ' + err.message);
    });
}

function gotoEntryList() {
    document.getElementById('greetingPage').style.display = 'none';
    document.getElementById('entryListPage').style.display = 'block';
    requesting({
        method: 'GET',
        path: '/entry/latest'
    })
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
    // ToDo: use for(entryListItem of entryListItems) when supported by Chrome (v38?)
    for(var i = 0; i < entryListItems.length; ++i) {
        var entryListItem = entryListItems[i];
        entryListItem.addEventListener('click', openEntry);
    }
    // ToDo: subscribe to entry patch events from server
    // ToDo ignore entry patch events if version is already satisfied
    // Note: open first entry for convenience
    openEntry.call(entryListItems[0]);
}

function openEntry() {
    var id = this.dataset.id;
    var path = '/entry/' + id;
    requesting({
        method: 'GET',
        path: path
    })
    .then(function (entry) {
        // ToDo: refactor
        // ToDo: notifyNow: true (to avoid doing a GET)?
        window.mars.apiSocket.send(JSON.stringify({
            verb: 'SUBSCRIBE',
            path: path
        }));
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
    var titleInput = entryContainer.getElementsByClassName('title')[0];
    titleInput.addEventListener('input', onTitleChanged);
}

function patchEntry(message) {
    var entryContainer = document.getElementById('entry');
    var entryDiv = entryContainer.getElementsByClassName('entry')[0];
    var currentVersion = entryDiv.dataset.version;
    if(message.fromVersion === currentVersion) {
        var titleInput = entryContainer.getElementsByClassName('title')[0];
        titleInput.value = message.patch.title;
        entryDiv.dataset.version = message.toVersion;
    }
}

function onTitleChanged() {
    // ToDo: collapse input events (and ignore patch events?) until done
    savingTitle(this);
}

function savingTitle(titleInput) {
    var entryDiv = titleInput.parentNode.parentNode;
    var id = entryDiv.dataset.id;
    var version = entryDiv.dataset.version;
    var title = titleInput.value;
    var patch = {
        title: title
    };
    return requesting({
        method: 'PATCH',
        path: '/entry/' + id,
        version: version,
        body: JSON.stringify(patch)
    })
    .then(function (result) {
        entryDiv.dataset.version = result.version;
    });
    // ToDo: reload on error
}

function instantiateHtml(template, options) {
    return template.replace(/{{([^{}]*)}}/g, function (match, key) {
        var value = options[key];
        if(!value) {
            return match;
        }
        if(typeof value !== 'string') {
            value = value.toString();
        }
        return escapeHtml(value);
    });
}

function requesting(options) {
    return new Promise(function (resolve, reject) {
        var data;

        if(options.args) {
            // ToDo: not multipart/form-data
            // ToDo: iterate over args
            data = new FormData();
            data.append('pass', options.args.pass);
        } else if(options.body) {
            data = options.body;
        }

        var xhr = new XMLHttpRequest();
        xhr.open(options.method, 'https://' + window.mars.apiServer + options.path, true);
        if(options.versionRange) {
            xhr.setRequestHeader('Accept-Version', options.versionRange);
        }
        if(window.mars.token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + window.mars.token);
        }
        if(options.method === 'PATCH') {
            xhr.setRequestHeader('Content-type', 'application/json');
        }
        if(options.version) {
            xhr.setRequestHeader('If-Match', options.version);
        }
        xhr.onload = function () {
            var response = JSON.parse(this.responseText);
            // ToDo: read ETag response header
            // console.dir(response);
            if(this.status === 200) {
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