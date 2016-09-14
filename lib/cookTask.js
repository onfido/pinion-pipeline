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
}

var getOptionsList = function(rootConfig, taskConfig) {
  return taskConfig.taskArray.map(function(subTask) {
    var subTaskConfig = objectAssign(
      {},
      cookSubTaskConfig(taskConfig),
      cookSubTaskConfig(subTask)
    );

    var src = path.join(rootConfig.src, subTaskConfig.src, subTaskConfig.fileGlob || '**');
    if(subTaskConfig.ignore) {
      src = [
        src,
        '!' + path.join(rootConfig.src, subTaskConfig.ignore)
      ];
    }

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
