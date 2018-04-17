const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const mocha = require('gulp-mocha');

gulp.task('clean', () => {
  del(['./lib/**']);
});

gulp.task('test', () => {
  return gulp.src('test/**/*.js', { read: false })
    .pipe(mocha({ require: ['babel-core/register'] }));
});

gulp.task('build', () => {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('index.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'));
});

gulp.task('default', ['clean', 'build']);
