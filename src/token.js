function create(user) {
    // ToDo: use better hashing, like JWT
    return JSON.stringify({user: user.name, hashed: true});
}

function authenticate(authorization) {
    var match = /^Bearer (.*)$/.exec(authorization);
    if (!match) {
        return null; // Invalid syntax of authorization http header
    }
    var hashedToken = match[1];
    var token;

    try {
        token = JSON.parse(hashedToken);
    }
    catch(ex) {
        return null; // Invalid JSON
    }

    if(!token.hashed) {
        return null; // Not properly hashed
    }

    return token.user;
}

function requestParser() {
    return function (req, res, next) {
        // console.dir(req.authorization);
        req.userName = authenticate(req.headers.authorization);
        return next();
    };
}

module.exports = {
    create: create,
    authenticate: authenticate,
    requestParser: requestParser
};