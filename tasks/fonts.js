'use strict';

import changed from 'gulp-changed';
import gulp from 'gulp';
import gutil from 'gulp-util';
import debug from '../lib/gulpDebug';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';

const defaultTaskConfig = {
  src: 'fonts',
  dest: '.'
};

export default (config) => {
  var rawTaskConfig = config.tasks.fonts;
  if(!rawTaskConfig) return;

  const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  const rawTask = (options) => {
    gutil.log('Building fonts from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(debug({ title: 'fonts' }))
      .pipe(changed(options.dest)) // Ignore unchanged files
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('fonts', cookTask(rawTask, config.root, taskConfig));
};

export { defaultTaskConfig };
