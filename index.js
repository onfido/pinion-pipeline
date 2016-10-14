'use strict';

/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in ./tasks. Any files in that directory get
  automatically required below.

  To add a new task, simply add a new task file that directory.
  ./tasks/default.js specifies the default set of tasks to run
  when you run `pinion`.
*/

import 'babel-polyfill';
import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';
import requireDir from 'require-dir';
import { passConfigToTasks, getTaskDeps } from './taskHelpers';
import installTask from './wsTasks/install';

export function start(toRun, config) {
  config = Object.assign({
    root: {
      src: 'src',
      dest: 'bin'
    }
  }, config);

  // Load all of the tasks that we might need to run
  const taskConstrucs = requireDir('./tasks', { recurse: true });
  passConfigToTasks(taskConstrucs, config);

  const deps = getTaskDeps(taskConstrucs, config);
  installTask(deps);

  // `gulp.start()` forces our tasks in parallel, so we need a pseudo-task to
  // force sequential task running
  gulp.task('__toRun', gulpSequence(...toRun));
  gulp.start('__toRun');
}
