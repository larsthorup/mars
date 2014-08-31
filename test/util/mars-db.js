var fs = require('fs');
var assert = require('assert');
var knexfile = require('../../knexfile');

function recreate() {
    assert.equal(knexfile.development.client, 'sqlite3'); // ToDo: extend to other providers
    var dbfile = knexfile.development.connection.filename;
    if(fs.existsSync(dbfile)) {
        fs.unlinkSync(dbfile);
    }
}

module.exports = {
    recreate: recreate
};
