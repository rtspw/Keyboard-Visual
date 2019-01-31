'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');

const browserify = require('browserify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');

gulp.task('sass', async () => {
  gulp.src('app/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'));
});

gulp.task('babel', async () => {
  gulp.src('app/src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('app/dist'));
});

gulp.task('browserify', async () => {
  browserify({
    entries: ['app/dist/index.js'],
    debug: true,
  })
    .bundle()
    .pipe(vinylSourceStream('bundle.js'))
    .pipe(vinylBuffer())
    .pipe(gulp.dest('app'));
});

gulp.task('watch', async () => {
  gulp.watch('app/scss/*.scss', gulp.series('sass'));
  gulp.watch('app/src/*.js', gulp.series('babel'));
  gulp.watch('app/dist/*.js', gulp.series('browserify'));
});
