'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import watch from 'gulp-watch';
import merge from 'merge-stream';
import { isProduction } from '../lib/env';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';

const nonEmptyFilter = (x) => x && !(Array.isArray(x) && !x.length);

export default (config) => {
  const watchableTasks = ['fonts', 'images', 'svgSprite', 'resources', 'css'];

  const watchTask = () => {
    const watchStreams = watchableTasks.map((taskName) => {
      const rawTaskConfig = config.tasks[taskName];
      if(!rawTaskConfig) return;

      const defaultTaskConfig = require('./' + taskName).defaultTaskConfig;

      const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

      const rawTask = (options) => {
        if(isProduction()) {
          throw new Error('Cannot run the `watch` task in production mode!');
        }

        gutil.log('Watching ' + JSON.stringify(options.src) + ' to trigger ' + taskName);

        return watch(
          options.src,
          { usePolling: true },
          () => gulp.start(taskName)
        );
      };

      return cookTask(rawTask, config.root, taskConfig)();
    });

    return merge.apply(merge, watchStreams.filter(nonEmptyFilter));
  };

  gulp.task('watch', ['build:watch'], watchTask);
};
