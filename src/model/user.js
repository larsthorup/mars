function creating(repo, rows) {
    return repo.knex('user').insert(rows);
}

function counting(repo) {
    return repo.knex('user').count('name as userCount').then(function (result) {
        if(result.length < 1) {
            return 0;
        } else {
            return result[0].userCount;
        }
    });
}

function findingByName(repo, name) {
    return repo.knex('user').where({name: name}).select();
}

function mappingByName(repo, names) {
    return repo.knex('user').where('name', 'in', names).select().then(function (users) {
        var map = {};
        users.forEach(function (user) {
            map[user.name] = { id: user.id };
        });
        return map;
    });
}

module.exports = {
    creating: creating,
    findingByName: findingByName,
    counting: counting,
    mappingByName: mappingByName
};