document.addEventListener('DOMContentLoaded', main);

function main() {
    window.app = {};
    window.app.apiServer = 'localhost:1719';
    showOnlineStatus(false);
    connectSocket();
    gotoAuth();
}

function connectSocket() {
    // ToDo: consider using https://github.com/joewalnes/reconnecting-websocket
    var apiSocket = new WebSocket('wss://' + window.app.apiServer);

    // ToDo: authentication

    apiSocket.addEventListener('open', function () {
        window.app.apiSocket = apiSocket;

        apiSocket.addEventListener('message', function (event) {
            // console.log('Received WebSocket message');
            var message = JSON.parse(event.data);
            // console.dir(message);
            patchEntry(message);
            // ToDo: dispatch to listeners[message.path]
        });

        showOnlineStatus(true);
    });

    apiSocket.addEventListener('close', function () {
        window.app.apiSocket = null;
        showOnlineStatus(false);
        setTimeout(connectSocket, 500);
    });
}

function showOnlineStatus(isOnline) {
    var onlineStatus = document.getElementById('online-status');
    var spans = onlineStatus.getElementsByTagName('span');
    for(var i = 0; i < spans.length; ++i) {
        var span = spans[i];
        span.classList.remove(isOnline ? 'is-offline' : 'is-online');
        span.classList.add(isOnline ? 'is-online' : 'is-offline');
    }
}

function gotoAuth() {
    document.getElementById('authPage').style.display = 'block';
    document.getElementById('authButton').addEventListener('click', authenticate);
}

function authenticate() {
    var user = document.getElementById('user').value;
    var pass = document.getElementById('pass').value;
    authenticating({user: user, pass: pass})
    .then(function (result) {
        window.app.token = result.token;
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
    greeting({name: name})
    .then(function (result) {
        window.alert('Greeting: ' + result.message);
    })
    .catch(function (err) {
        window.alert('Failed to greet: ' + err.message);
    });
}

function gotoEntryList() {
    document.getElementById('greetingPage').style.display = 'none';
    document.getElementById('entryListPage').style.display = 'block';
    gettingLatestEntries()
    .then(function (result) {
        renderEntryList(result.entries);
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
        if(window.app.apiSocket) {
            window.app.apiSocket.send(JSON.stringify({
                verb: 'SUBSCRIBE',
                path: path
            }));
        }
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
    return patchingEntry({id: id, version: version, patch: patch})
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