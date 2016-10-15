'use strict';

import gulp from 'gulp';
import readline from 'readline';
import { exec } from 'child_process';
import * as colors from '../lib/colors';
import consoleSpinner from '../lib/consoleSpinner';

const installDeps = (deps) => {
  const spinner = consoleSpinner();
  const inst = exec('npm install --save ' + deps.join(' '), (error) => {
    spinner.stop();

    if(error) {
      console.error(error);
      process.exit(1);
    }
    else {
      console.log(colors.green('Modules successfully installed'));
      process.exit(0);
    }
  });

  inst.stdout.pipe(process.stdout);
  inst.stderr.pipe(process.stderr);
};

export default (deps) => {
  gulp.task('install', () => {
    if(!deps.length) {
      console.log(colors.magenta('No dependencies are needed!'));
      process.exit(0);
    }

    console.log(
      `The following npm modules will be ${colors.magenta('installed')}, and`,
      colors.magenta('saved to your package.json')
    );
    deps.forEach((x) => console.log(x));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Proceed? (y/n): ', (answer) => {
      if(answer[0].toLowerCase() === 'y') {
        installDeps(deps);
      }
      else {
        console.log(colors.red('Install cancelled'));
        process.exit(0);
      }
    });
  });
};
