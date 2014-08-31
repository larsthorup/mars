var users = require('./users');

function creating() {
    return users.creatingTestData();
}

module.exports = {
    creating: creating
};