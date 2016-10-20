'use strict';

import gulp from 'gulp';
import del from 'del';

export default (config) => {
  const cleanTask = () => {
    console.log('Cleaning ' + config.root.dest);

    return del([config.root.dest]);
  };

  gulp.task('clean', cleanTask);
};
