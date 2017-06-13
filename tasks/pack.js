import gulp from 'gulp';
import { colors, log } from 'gulp-util';
import zip from 'gulp-zip';
import packageDetails from '../package.json';

gulp.task('pack', () => {
  let name = packageDetails.name;
  let version = packageDetails.version;
  let filetype = '.zip';
  let filename = `${name}-${version}${filetype}`;
  return gulp.src(`dist/**/*`)
    .pipe(zip(filename))
    .pipe(gulp.dest('./packages'))
    .on('end', () => {
      let distStyled = colors.magenta(`dist/`);
      let filenameStyled = colors.magenta(`./packages/${filename}`);
      log(`Packed ${distStyled} to ${filenameStyled}`);
    });
});
