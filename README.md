mars
====

Libs: NodeJS, Bookshelf, Restify
Tools: Mocha, Istanbul, Grunt


Install:

    npm install -g mocha
    npm install -g istanbul
    npm install

Run tests:

    mocha --recursive

Report coverage:

    istanbul cover node_modules/mocha/bin/_mocha -- --recursive

