//const { Script } = require('vm');
const { series, task } = require('gulp');


//import {src, dest} from 'gulp'
var browserSync = require('browser-sync').create(),
gulp = require('gulp'),
babel = require('gulp-babel'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
reload = browserSync.reload,
plumber = require('gulp-plumber'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
minifycss = require('gulp-minify-css'),
concat = require('gulp-concat'),
jade = require('gulp-jade'),
compass = require('gulp-compass'),
imp = require('compass-importer');


function browsersync() {
  browserSync.init({
    server: {
        baseDir: "./"
    }
  });
}

function scriptTaskMin() {
  
  return (
    gulp.src('./build/js/*.js')
    .pipe(plumber())
    .pipe(concat('all.js'))
    .pipe(babel({
      presets: ['@babel/env'],
      "plugins": ["@babel/plugin-proposal-class-properties"]
    }))
    .pipe(uglify())
    .pipe(rename('app.min.js'))   
    .pipe(gulp.dest('./app/js/'))
  );
};
function scriptTask() {
  
  return (
    gulp.src('./build/js/*.js')
    .pipe(plumber())
    .pipe(concat('all.js'))
    .pipe(rename('app.js'))   
    .pipe(gulp.dest('./app/js/'))
  );
};

function style() {
  // Where should gulp look for the sass files?
  // My .sass files are stored in the styles folder
  // (If you want to use scss files, simply look for *.scss files instead)
  return (
      gulp
          .src("./build/sass/*.scss")
          .pipe(sass())
          .on("error", sass.logError)
          .pipe(rename({ suffix: '.min' }))
          .pipe(minifycss())
          .pipe(gulp.dest("./app/css/"))
  );
}

function html (){
    gulp.src('*.html')
   .pipe(reload({stream:true}));
};

function js() {
    gulp.src('build/js/*.js')
    .pipe(reload({stream:true}));
};

function watch() { 
  gulp.watch('build/sass/**/*.scss', style).on('change',browserSync.reload);
  gulp.watch('build/templates/**/*.jade',jadeTo).on('change',browserSync.reload);
  gulp.watch('build/js/*.js', scriptTask).on('change',browserSync.reload);
  gulp.watch('index.html', html).on('change', browserSync.reload);
};

function jadeTo() {
  return (
  gulp.src('build/templates/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('./')) 
  )
};
exports.build = gulp.parallel(style,jadeTo,scriptTask,scriptTaskMin);
exports.default = gulp.parallel(watch,browsersync);
exports.jadeTo = jadeTo
exports.style = style;
exports.watch = watch
exports.scriptTaskMin = scriptTaskMin
exports.scriptTask= scriptTask