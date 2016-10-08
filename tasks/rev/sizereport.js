'use strict';

import gulp from 'gulp';
import sizereport from 'gulp-sizereport';

export default (config) =>
  // Report sizes
  gulp.task('size-report', () =>
    gulp.src(config.root.dest + '**/*', { base: config.root.dest })
      .pipe(sizereport({ gzip: true }))
  );
