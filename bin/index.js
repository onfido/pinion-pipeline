#!/usr/bin/env node

'use strict';

import gutil from 'gulp-util';
import chalk from 'chalk';
import semver from 'semver';
import Liftoff from 'liftoff';
import tildify from 'tildify';
import minimist from 'minimist';
import cliPackage from '../../package';

const argv = minimist(process.argv.slice(2));

const cli = new Liftoff({
  name: 'pinion-pipeline',
  configName: 'pinionfile',
  extensions: {
    '.js': null,
    '.json': null
  }
});

// Parse the command line arguments (copied from Gulp)
const versionFlag = argv.v || argv.version;
const tasks = argv._;
const toRun = tasks.length ? tasks : ['default'];

if(argv.silent) {
  gutil.log = function() {};
}

const printVersion = (env) => {
  gutil.log('CLI version', cliPackage.version);
  if(env.modulePackage && typeof env.modulePackage.version !== 'undefined') {
    gutil.log('Local version', env.modulePackage.version);
  }
};

const ensurePinionRunnable = (env) => {
  if(!env.modulePath) {
    gutil.log(
      chalk.red('Local pinion-pipeline not found in'),
      chalk.magenta(tildify(env.cwd))
    );
    gutil.log(chalk.red('Try running: npm install pinion-pipeline'));
    process.exit(1);
  }

  if(!env.configPath) {
    gutil.log(chalk.red('No pinionfile found'));
    process.exit(1);
  }
};

const compareCliToLocalVersion = (env) => {
  // Check for semver difference between cli and local installation
  if(semver.gt(cliPackage.version, env.modulePackage.version)) {
    gutil.log(chalk.red('Warning: pinion-pipeline version mismatch:'));
    gutil.log(chalk.red('Global pinion-pipeline is', cliPackage.version));
    gutil.log(chalk.red('Local pinion-pipeline is', env.modulePackage.version));
  }
};

const setCwdToEnv = (env) => {
  if(process.cwd() !== env.cwd) {
    process.chdir(env.cwd);
    gutil.log(
      'Working directory changed to',
      chalk.magenta(tildify(env.cwd))
    );
  }
};

// The actual main logic that occurs upon a `pinion` command
const handleArguments = (env) => {
  if(versionFlag && tasks.length === 0) {
    printVersion(env);
    process.exit(0);
  }

  ensurePinionRunnable(env);

  compareCliToLocalVersion(env);

  // Do this so pinion runs from the project directory, rather than from pinion
  setCwdToEnv(env);

  // This is what actually loads up the pinionfile
  gutil.log('Using pinionfile', chalk.magenta(tildify(env.configPath)));
  const pinionConfig = require(env.configPath);
  const pinionInst = require(env.modulePath);

  pinionInst.start(toRun, pinionConfig);
};

cli.launch({
  cwd: argv.cwd,
  configPath: argv.pinionfile,
  require: argv.require
}, handleArguments);
