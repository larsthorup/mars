var token = require('./token');

function anyone() {
    return true;
}

function user(req) {
    // console.dir(req.authorization);
    return token.authenticate(req.headers.authorization); // ToDo: extract to a handler to set req.userName
}

module.exports = {
    user: user,
    anyone: anyone
};