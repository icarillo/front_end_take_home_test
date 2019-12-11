const {src, dest, parallel, watch} = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const minify = require('gulp-minify');
const babel = require('gulp-babel');

function css() {
  return src('./src/sass/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(prefix())
  .pipe(cssmin())
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write('./maps'))
  .pipe(dest('./dist/css'));
}

function js() {
  return src('src/js/main.js')
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(minify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest('./dist/js'));
}

exports.default = function() {
  watch('./src/js/**/*.js', js);
  watch('./src/sass/**/*.scss', css);
};