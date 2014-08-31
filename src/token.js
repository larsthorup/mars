function create(user) {
    // ToDo: use better hashing, like JWT
    return JSON.stringify({user: user.name, hashed: true});
}

module.exports = {
    create: create
};