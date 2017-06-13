import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import tsify from 'tsify';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import buffer from 'vinyl-buffer';

gulp.task("scripts", function () {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['app/scripts/contentscript.tsx'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .transform('babelify', {
    presets: ['es2015'],
    extensions: ['.ts', '.tsx']
  })
  .bundle()
  .pipe(source('dist/scripts/contentscript.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest("."));
});
