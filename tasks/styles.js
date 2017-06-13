import gulp from 'gulp';
import gulpif from 'gulp-if';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import args from './args';

gulp.task('styles', function() {
  return gulp.src('app/styles/contentscript.scss')
    .pipe(sass({ includePaths: ['./app']}).on('error', function(error) {
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      this.emit('end');
    }))
    .pipe(gulpif(args.production, cleanCSS()))
    .pipe(gulp.dest(`dist/styles`))
});

