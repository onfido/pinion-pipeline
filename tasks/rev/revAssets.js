'use strict';

import gulp from 'gulp';
import path from 'path';
import rev from 'gulp-rev';
import revNapkin from 'gulp-rev-napkin';

export default (config) => {
  // Add md5 hashes to assets referenced by CSS and JS files
  gulp.task('rev-assets', () => {
    // Ignore files that may reference assets. We'll rev them next.
    const ignoreThese = '!' + path.join(config.root.dest,'/**/*+(css|js|json|html)');

    return gulp.src([path.join(config.root.dest,'/**/*'), ignoreThese])
      .pipe(rev())
      .pipe(gulp.dest(config.root.dest))
      .pipe(revNapkin({verbose: false}))
      .pipe(rev.manifest(path.join(config.root.dest, 'rev-manifest.json'), {merge: true}))
      .pipe(gulp.dest(''));
  });
};
