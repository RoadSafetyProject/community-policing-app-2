require('es6-promise').polyfill();
var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv;


/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');
var tslint = require('ionic-gulp-tslint');

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['images','sass', 'html', 'fonts', 'scripts','extendedscripts','extendedcss'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      gulpWatch('app/**/*.png', function(){ gulp.start('images'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});

gulp.task('build', ['clean'], function(done){
  runSequence(
    ['images','sass', 'html', 'fonts', 'scripts','extendedscripts','extendedcss'],
    function(){
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done);
    }
  );
});
gulp.task('images', function() {
  gulp.src('app/**/**/*.png')
    .pipe(gulp.dest('www/build'))
});
gulp.task('sass', buildSass);
gulp.task('extendedcss', function() {
  src = [
    'node_modules/leaflet/dist/leaflet.css'
  ];
  dest = 'www/build/css';

  return gulp.src(src)
    .pipe(gulp.dest(dest));
});
gulp.task('extendedscripts', function() {
  src = [
    'node_modules/leaflet/dist/leaflet.js'
  ];
  dest = 'www/build/js';

  return gulp.src(src)
    .pipe(gulp.dest(dest));
});
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);
gulp.task('clean', function(){
  return del('www/build');
});
gulp.task('lint', tslint);

otherTslint = require('gulp-tslint')
gulp.task('otherlint', function() {
  options = {
    src: ['typings/leaflet/leaflet.d.ts'],
    tslintOptions: {
      configuration: 'tslint.json'
    },
    reporter: "verbose",
    reportOptions: {}
  };

  return gulp.src(options.src)
    .pipe(otherTslint(options.tslintOptions))
    .pipe(otherTslint.report(options.reporter, options.reportOptions));
});
