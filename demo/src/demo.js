document.addEventListener('DOMContentLoaded', main);

function main() {
    window.app = {
        subscriptions: []
    };
    window.app.apiServer = 'localhost:1719';
    showOnlineStatus(false);
    connectSocket();
    gotoAuth();
}

function connectSocket() {
    var apiSocket = new WebSocket('wss://' + window.app.apiServer);

    apiSocket.addEventListener('open', function () {
        window.app.apiSocket = apiSocket;
        showOnlineStatus(true);

        apiSocket.addEventListener('message', function (event) {
            var message = JSON.parse(event.data);
            // console.dir(message);
            switch(message.verb) {
                case 'SUBSCRIBED':
                    onSubscribed(message);
                    break;
                case 'EVENT':
                    switch(message.type) {
                        case 'PATCH':
                            onPatched(message);
                            break;
                        default:
                            handleError('Unknown message type: ' + message.type);
                    }
                    break;
                default:
                    handleError('Unknown message verb: ' + message.verb);
            }
        });

        resubscribe();
    });

    apiSocket.addEventListener('close', function () {
        window.app.apiSocket = null;
        showOnlineStatus(false);
        setTimeout(connectSocket, 500);
    });
}

function showOnlineStatus(isOnline) {
    var onlineStatus = document.getElementById('online-status');
    onlineStatus.classList.add('visible');
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
        handleError('Failed to login: ' + err.message);
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
        handleError('Greeting: ' + result.message);
    })
    .catch(function (err) {
        handleError('Failed to greet: ' + err.message);
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
        handleError('Failed to load entries: ' + err.message);
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
    // ToDo: subscribe to entry patch events from server
    // ToDo: use for(entryListItem of entryListItems) when supported by Chrome (v38?)
    for(var i = 0; i < entryListItems.length; ++i) {
        var entryListItem = entryListItems[i];
        entryListItem.addEventListener('click', openEntry);
    }
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
        // ToDo: notifyNow: true (to avoid doing a GET)?
        renderEntry(path, entry);
    })
    .catch(function (err) {
        handleError('Failed to load entry: ' + err.message);
    });
}

function resubscribe() {
    for(var i = 0; i < window.app.subscriptions.length; ++i) {
        var path = window.app.subscriptions[i];
        subscribe(path);
    }
}

function subscribe(path, patcher, element) {
    if (!window.app.subscriptions[path]) {
        if (window.app.apiSocket) {
            window.app.apiSocket.send(JSON.stringify({
                verb: 'SUBSCRIBE',
                auth: getAuthorizationHeader(),
                path: path
            }));
        }
        window.app.subscriptions[path] = [];
    }
    window.app.subscriptions[path].push({
        patcher: patcher,
        element: element
    });
}

function onSubscribed() {
    // Nothing to do for now
}

function onPatched(message) {
    window.app.subscriptions[message.path].forEach(function (subscription) {
        subscription.patcher.call(subscription.element, message);
    });
}

function renderEntry(path, entry) {
    var entryTemplate = document.getElementById('entryTemplate').innerHTML;
    var entryContainer = document.getElementById('entry');
    entryContainer.innerHTML = instantiateHtml(entryTemplate, entry);
    entryElement = entryContainer.getElementsByClassName('entry')[0];
    var titleInput = entryContainer.getElementsByClassName('title')[0];
    titleInput.addEventListener('input', onTitleChanged);
    subscribe(path, onTitlePatched, entryElement);
}

function onTitlePatched(message) {
    if (message.fromVersion == this.dataset.version) {
        var titleInput = this.getElementsByClassName('title')[0];
        titleInput.value = message.patch.title;
        this.dataset.version = message.toVersion;
    } else {
        // console.log('Ignoring patch from version ' + message.fromVersion + ' as we have version ' + this.dataset.version);
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

function handleError(message) {
    window.alert(message);
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