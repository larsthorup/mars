var bcrypt = require('bcryptjs');

module.exports = {
    generate: bcrypt.hashSync,
    verify: bcrypt.compareSync
};
