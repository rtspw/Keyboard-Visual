'use strict';

const {
  src, dest, series, watch,
} = require('gulp');

const sass = require('gulp-sass');
const babel = require('gulp-babel');

const browserify = require('browserify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');

async function transpileSass() {
  src('app/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('app/css'));
}

async function transpileBabel() {
  src('app/dist/bundle.js')
    .pipe(babel())
    .pipe(dest('app'));
}

async function bundle() {
  browserify({
    entries: ['app/src/index.js'],
    debug: true,
  }).bundle()
    .on('error', (error) => {
      console.log(error.message);
    })
    .pipe(vinylSourceStream('dist/bundle.js'))
    .pipe(vinylBuffer())
    .pipe(dest('app'));
}

async function watchFiles() {
  watch('app/scss/*.scss', series('sass'));
  watch('app/src/*.js', series(bundle));
}

exports.sass = transpileSass;
exports.js = series(bundle);
exports.default = watchFiles;
