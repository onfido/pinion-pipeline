'use strict';

import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';
import { isProduction } from '../lib/env';
import * as colors from '../lib/colors';

export default () => {
  const productionTask = (cb) => {
    if(!isProduction()) {
      console.log(
        colors.red('WARNING!'),
        'You are running the production build, but your NODE_ENV is not \'production\''
      );
    }

    gulpSequence('clean', 'build', 'rev', cb);
  };

  gulp.task('production', productionTask);
};
