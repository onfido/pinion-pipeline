'use strict';

import gulp from 'gulp';
import path from 'path';
import revReplace from 'gulp-rev-replace';

export default (config) =>
  // Update asset references with reved filenames in compiled css + js
  gulp.task('rev-update-references', () => {
    const manifest = gulp.src(path.join(config.root.dest, 'rev-manifest.json'));

    return gulp.src(path.join(config.root.dest,'/**/**.{css,js,json,html}'))
      .pipe(revReplace({manifest: manifest}))
      .pipe(gulp.dest(config.root.dest));
  });
