'use strict';

import gulp from 'gulp';
import path from 'path';
import rev from 'gulp-rev';
import revNapkin from 'gulp-rev-napkin';

export default (config) => {
  gulp.task('rev-css-js', () =>
    gulp.src(path.join(config.root.dest, '**/*.{css,js}'))
      .pipe(rev())
      .pipe(gulp.dest(config.root.dest))
      .pipe(revNapkin({verbose: false}))
      .pipe(rev.manifest(path.join(config.root.dest, 'rev-manifest.json'), {merge: true}))
      .pipe(gulp.dest(''))
  );
};
