var passwordHash = require('password-hash');

module.exports = {
    generate: passwordHash.generate,
    verify: passwordHash.verify
};