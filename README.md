mars
====

[![Build Status](https://travis-ci.org/larsthorup/mars.png)](https://travis-ci.org/larsthorup/mars)
[![Coverage Status](https://coveralls.io/repos/larsthorup/mars/badge.png?branch=master)](https://coveralls.io/r/larsthorup/mars?branch=master)
[![Dependency Status](https://david-dm.org/larsthorup/mars.png)](https://david-dm.org/larsthorup/mars#info=dependencies)
[![devDependency Status](https://david-dm.org/larsthorup/mars/dev-status.png)](https://david-dm.org/larsthorup/mars#info=devDependencies)

Platform: NodeJS, Vagrant

Libs: Restify, Knex, SQLite, Crypto

Tools: Gulp, Mocha, Sinon, Istanbul, JSHint

Quick start:

    install NodeJS
    $ npm run dev

Install:

    $ npm install

Run static analysis:

    $ npm run lint

Run unit tests:

    $ npm run test

Report coverage:

    $ npm run cover

Run end2end tests:

    $ npm run end2end

Open demo in browser:

    $ npm run demo


Development
-----------

Add a new migration

    node_modules\.bin\knex migrate:make entry-version


Vagrant
-------

Quick start:

    install Vagrant
    $ npm run deploy

Package for deployment:

    $ npm run package

Start virtual machine:

    $ npm run up

Install on virtual machine:

    $ npm run install-remote

Start server on virtual machine:

    $ npm run start-remote

Smoke test server on virtual machine:

    $ npm run test-remote
