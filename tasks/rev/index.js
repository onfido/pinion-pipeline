'use strict';

import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';

export default () => {
  // If you are familiar with Rails, this task the equivalent of the fingerprinting
  //  that occurs during the `rake assets:precompile` step
  const revTask = gulpSequence(
    // Add md5 hashes to assets referenced by CSS and JS files
    'rev-assets',

    // Rev CSS and JS files
    // (this is done after assets, so that if a referenced asset hash changes,
    // the parent hash will change as well)
    'rev-css-js',

    // Update asset references (images, fonts, etc) with reved filenames in compiled css + js
    'rev-update-references',

    // Finally, report filesizes
    'size-report'
  );

  gulp.task('rev', revTask);
};
