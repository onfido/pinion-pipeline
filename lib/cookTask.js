'use strict';

var path = require('path');
var merge = require('merge-stream');
var objectAssign = require('object-assign');

var cookSubTaskConfig = function(config) {
  config = objectAssign({}, config);

  if(!config.fileGlob && config.extensions) {
    config.fileGlob = '**/*.{' + config.extensions.join(',') + '}';
  }

  return config;
};

var getFullSrc = function(config, rootConfig) {
  if(!Array.isArray(config.src)) {
    config.src = [config.src];
  }

  var baseSrcList = config.src.map(function(baseSrc) {
    return path.join(baseSrc, config.fileGlob || '**');
  });

  if(config.ignore) {
    baseSrcList.push('!' + config.ignore);
  }

  var srcVariants = baseSrcList.map(function(baseSrc) {
    // The order of these variants denotes priority. Sooner is higher priority
    var variants = [path.join(rootConfig.src, baseSrc)];

    if(config.npm) {
      variants.push(path.join(process.cwd(), 'node_modules', baseSrc));
    }

    return variants;
  });

  // Turn our variants list (array of arrays) into a src list (flat array)
  var srcList = srcVariants.reduce(function(soFar, remaining) {
    return soFar.concat(remaining);
  }, []);

  return srcList;
};

var getOptionsList = function(rootConfig, taskConfig) {
  return taskConfig.taskArray.map(function(subTask) {
    var subTaskConfig = objectAssign(
      {},
      cookSubTaskConfig(taskConfig),
      cookSubTaskConfig(subTask)
    );

    var src = getFullSrc(subTaskConfig, rootConfig);

    return {
      src: src,
      dest: path.join(rootConfig.dest, subTaskConfig.dest),
      config: subTaskConfig
    };
  });
};

module.exports = function(rawTask, rootConfig, taskConfig) {
  var optionsList = getOptionsList(rootConfig, taskConfig);

  var cookedTask = function() {
    var streams = optionsList.map(function(options) {
      return rawTask(options);
    });

    return merge.apply(merge, streams);
  };

  return cookedTask;
};
