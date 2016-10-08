'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import del from 'del';

export default (config) => {
  const cleanTask = () => {
    gutil.log('Cleaning ' + config.root.dest);

    return del([config.root.dest]);
  };

  gulp.task('clean', cleanTask);
};
