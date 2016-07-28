#!/usr/bin/env node

'use strict';

process.on('exit', function(exitCode) {
  if(exitCode !== 0) {
    console.warn('Non-zero exit code ' + exitCode);
    console.warn('Stack trace is as follows:');
    console.warn(new Error().stack);
  }
});

var gutil = require('gulp-util');
var chalk = require('chalk');
var semver = require('semver');
var Liftoff = require('liftoff');
var tildify = require('tildify');
var argv = require('minimist')(process.argv.slice(2));

var cli = new Liftoff({
  name: 'pinion-pipeline',
  configName: 'pinionfile',
  extensions: {
    '.js': null,
    '.json': null
  }
});

// Parse the command line arguments (copied from Gulp)
var cliPackage = require('../package');
var versionFlag = argv.v || argv.version;
var tasks = argv._;
var toRun = tasks.length ? tasks : ['default'];

var shouldLog = !argv.silent;
if (!shouldLog) {
  gutil.log = function() {};
}

cli.on('require', function(name) {
  gutil.log('Requiring external module', chalk.magenta(name));
});

cli.on('requireFail', function(name) {
  gutil.log(chalk.red('Failed to load external module'), chalk.magenta(name));
});

cli.on('respawn', function(flags, child) {
  var nodeFlags = chalk.magenta(flags.join(', '));
  var pid = chalk.magenta(child.pid);
  gutil.log('Node flags detected:', nodeFlags);
  gutil.log('Respawned to PID:', pid);
});

// The actual main logic that occurs upon a `pinion` command
function handleArguments(env) {
  if (versionFlag && tasks.length === 0) {
    gutil.log('CLI version', cliPackage.version);
    if (env.modulePackage && typeof env.modulePackage.version !== 'undefined') {
      gutil.log('Local version', env.modulePackage.version);
    }
    process.exit(0);
  }

  if (!env.modulePath) {
    gutil.log(
      chalk.red('Local pinion-pipeline not found in'),
      chalk.magenta(tildify(env.cwd))
    );
    gutil.log(chalk.red('Try running: npm install pinion-pipeline'));
    process.exit(1);
  }

  if (!env.configPath) {
    gutil.log(chalk.red('No pinionfile found'));
    process.exit(1);
  }

  // Check for semver difference between cli and local installation
  if (semver.gt(cliPackage.version, env.modulePackage.version)) {
    gutil.log(chalk.red('Warning: pinion-pipeline version mismatch:'));
    gutil.log(chalk.red('Global pinion-pipeline is', cliPackage.version));
    gutil.log(chalk.red('Local pinion-pipeline is', env.modulePackage.version));
  }

  // Chdir before requiring pinionfile to make sure
  // we let them chdir as needed
  if (process.cwd() !== env.cwd) {
    process.chdir(env.cwd);
    gutil.log(
      'Working directory changed to',
      chalk.magenta(tildify(env.cwd))
    );
  }

  // This is what actually loads up the pinionfile
  gutil.log('Using pinionfile', chalk.magenta(tildify(env.configPath)));
  var pinionConfig = require(env.configPath);

  var pinionInst = require(env.modulePath);

  process.nextTick(function() {
    pinionInst.start(toRun, pinionConfig);
  });
}

cli.launch({
  cwd: argv.cwd,
  configPath: argv.pinionfile,
  require: argv.require
}, handleArguments);
