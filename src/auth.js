var token = require('./token');

function anyone() {
    return true;
}

function user(req) {
    return !!req.userName;
}

module.exports = {
    user: user,
    anyone: anyone
};