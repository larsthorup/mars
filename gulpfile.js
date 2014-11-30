var gulp = require('gulp');
// var debug = require('gulp-debug');

var paths = {
    src: 'src/**/*.js',
    test: {
        all: 'test/**/*.js',
        unit: 'test/unit/**/*.js',
        end2end: 'test/end2end/**/*.js'
    },
    tool: '*.js',
    demo: 'demo/**/*.js'
};
paths.code = [paths.src, paths.test.all, paths.tool, paths.demo];

// lint
var jshint = require('gulp-jshint');
gulp.task('lint', function () {
    return gulp
    .src(paths.code)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// test
var mocha = require('gulp-mocha');
gulp.task('test', function () {
    return gulp
    .src(paths.test.unit)
    .pipe(mocha({reporter: 'spec'}));
});

// cover
var istanbul = require('gulp-istanbul');
gulp.task('cover', function (done) {
    gulp
    .src(paths.src)
    .pipe(istanbul())
    .on('finish', function () {
        gulp
        .src(paths.test.unit)
        .pipe(mocha({reporter: 'dot'}))
        .pipe(istanbul.writeReports({
            dir: './coverage',
            reporters: ['text-summary', 'lcov', 'json']
        }))
        .on('end', done);
    })
    .resume();
});
var gulpOpen = require('gulp-open');
gulp.task('cover-report', function () {
    return gulp
    .src('coverage/lcov-report/index.html')
    .pipe(gulpOpen());
});

// end2end
gulp.task('end2end', function () {
    return gulp
    .src(paths.test.end2end)
    .pipe(mocha({reporter: 'spec'}));
});

// run
var shell = require('gulp-shell');
gulp.task('run', shell.task(['node src/mars.js']));

// demo
var webserver = require('gulp-webserver');
gulp.task('serve-demo', function () {
    gulp
    .src('demo/src')
    .pipe(webserver({
        port: 1718,
        https: true,
        fallback: 'index.html',
        open: true
    }));
});

// demo test
var mochaPhantomJS = require('gulp-mocha-phantomjs');
gulp.task('demotest', function () {
    return gulp
    .src('demo/test/demo.test.html')
    .pipe(mochaPhantomJS());
});


// watch
gulp.task('watch', function () {
    gulp.watch(paths.code, ['lint', 'cover']);
});

gulp.task('default', ['lint', 'cover', 'demotest', 'end2end']);
gulp.task('all', ['lint', 'test', 'cover', 'demotest', 'end2end']);
gulp.task('live', ['watch']);
gulp.task('demo', ['serve-demo', 'run']);