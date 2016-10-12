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
import readline from 'readline';
import { exec } from 'child_process';

const getTaskDeps = (taskConstrucs, config) => {
  const deps = {};

  for(let key in taskConstrucs) {
    if(typeof taskConstrucs[key].getTaskDeps === 'function') {
      Object.assign(deps, taskConstrucs[key].getTaskDeps(config));
    }
  }

  return Object.values(deps).map((x) => x.split('/')[0]);
};

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

  gulp.task('install', () => {
    const deps = getTaskDeps(taskConstrucs, config);

    if(!deps.length) {
      console.log('No dependencies are needed!');
      process.exit(0);
    }

    console.log('The following npm modules will be installed, and saved to your package.json');
    deps.forEach((x) => console.log(x));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Proceed? (y/n): ', (answer) => {
      if(answer[0].toLowerCase() === 'y') {
        const inst = exec('npm install --save ' + deps.join(' '), (error) => {
          if(error) {
            console.error(error);
            process.exit(1);
          }
          else {
            console.log('Modules successfully installed');
            process.exit(0);
          }
        });

        inst.stdout.pipe(process.stdout);
        inst.stderr.pipe(process.stderr);
      }
      else {
        console.log('Install cancelled');
        process.exit(0);
      }
    });
  });

  // `gulp.start()` forces our tasks in parallel, so we need a pseudo-task to
  // force sequential task running
  gulp.task('__toRun', gulpSequence(...toRun));
  gulp.start('__toRun');
}
