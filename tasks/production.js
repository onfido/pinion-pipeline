'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpSequence from 'gulp-sequence';
import { isProduction } from '../lib/env';

export default () => {
  const productionTask = (cb) => {
    if(!isProduction()) {
      gutil.log(
        gutil.colors.red('WARNING!'),
        'You are running the production build, but your NODE_ENV is not \'production\''
      );
    }

    gulpSequence('clean', 'build', 'rev', cb);
  };

  gulp.task('production', productionTask);
};
