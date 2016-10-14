'use strict';

import gulp from 'gulp';
import readline from 'readline';
import { exec } from 'child_process';

const installDeps = (deps) => {
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
};

export default (deps) => {
  gulp.task('install', () => {
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
        installDeps(deps);
      }
      else {
        console.log('Install cancelled');
        process.exit(0);
      }
    });
  });
};
