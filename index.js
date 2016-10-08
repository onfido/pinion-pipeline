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

const passConfigRecursive = (taskConstrucs, config) => {
  for(let key in taskConstrucs) {
    const task = taskConstrucs[key].default || taskConstrucs[key];
    if(typeof task === 'object') {
      passConfigRecursive(task, config);
    }
    else if(typeof task === 'function') {
      task(config);
    }
    else {
      throw new Error('Can only pass config to a function, or an object containing functions');
    }
  }
};

export function start(toRun, config) {
  config = Object.assign({
    root: {
      src: 'src',
      dest: 'bin'
    }
  }, config);

  // Load all of the tasks that we might need to run
  const taskConstrucs = requireDir('./tasks', { recurse: true });
  passConfigRecursive(taskConstrucs, config);

  // `gulp.start()` forces our tasks in parallel, so we need a pseudo-task to
  // force sequential task running
  gulp.task('__toRun', gulpSequence(...toRun));
  gulp.start('__toRun');
}
