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
  src('app/src/*.js')
    .pipe(babel())
    .pipe(dest('app/dist'));
}

async function bundle() {
  browserify({
    entries: ['app/dist/index.js'],
    debug: true,
  }).bundle()
    .pipe(vinylSourceStream('bundle.js'))
    .pipe(vinylBuffer())
    .pipe(dest('app'));
}

async function watchFiles() {
  watch('app/scss/*.scss', series('sass'));
  watch('app/src/*.js', series('babel', 'browserify'));
}

exports.sass = transpileSass;
exports.js = series(transpileBabel, bundle);
exports.default = watchFiles;
