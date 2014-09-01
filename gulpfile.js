var gulp = require('gulp');

var paths = {
    src: 'src/**/*.js',
    test: {
        unit: 'test/unit/**/*.js',
        end2end: 'test/end2end/**/*.js'
    },
    tool: '*.js'
};
paths.code = [paths.src, paths.test.unit, paths.test.end2end, paths.tool];

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
    .pipe(mocha({reporter: 'dot'}));
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
    });
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
    .pipe(mocha({reporter: 'dot'}));
});

// run
var shell = require('gulp-shell');
gulp.task('run', shell.task(['node src/mars.js']));

// static
var webserver = require('gulp-webserver');
gulp.task('serve-static', function () {
    gulp
    .src('static')
    .pipe(webserver({
        port: 1718,
        https: true,
        fallback: 'index.html',
        open: true
    }));
});

// watch
gulp.task('watch', function () {
    gulp.watch(paths.code, ['lint', 'cover']);
});

gulp.task('default', ['lint', 'cover']);
gulp.task('all', ['lint', 'test', 'cover']);
gulp.task('live', ['watch']);
gulp.task('demo', ['serve-static', 'run']);