function creating(repo, rows) {
    return repo.knex('entry').insert(rows);
}

function findingLatest(repo) {
    // ToDo: order by lastModified
    // ToDo: configurable limit
    return repo.knex.from('entry')
    .innerJoin('user', 'entry.authorId', 'user.id')
    .select(['entry.id as id', 'entry.version', 'title', 'user.name as authorName'])
    .orderBy('user.id', 'desc')
    .limit(10);
}

function findingById(repo, id) {
    return repo.knex.from('entry')
    .innerJoin('user', 'entry.authorId', 'user.id')
    .first(['entry.id as id', 'entry.version', 'title', 'user.name as authorName'])
    .where({'entry.id': id});
}

function patching(repo, id, version, patch) {
    // ToDo: use json patch?
    var newVersion = version + 1;
    patch.version = newVersion;
    return repo.knex.table('entry')
    .where({id: id, version: version})
    .update(patch)
    .then(function (rowCount) {
        if(rowCount === 1) {
            return {
                version: newVersion
            };
        } else {
            throw new Error('Invalid version');
        }
    })
    .catch(function (err) {
        repo.log.error('Failed to patch', id, version, patch, err);
        throw err;
    });
}

module.exports = {
    creating: creating,
    findingLatest: findingLatest,
    findingById: findingById,
    patching: patching
};