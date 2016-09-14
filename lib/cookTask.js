'use strict';

var path = require('path');
var merge = require('merge-stream');
var objectAssign = require('object-assign');

var getOptionsList = function(rootConfig, taskConfig) {
  return taskConfig.taskArray.map(function(subTask) {
    var subTaskConfig = objectAssign({}, taskConfig, subTask);

    var fileGlob = subTaskConfig.fileGlob;
    if(!fileGlob) {
      fileGlob = '**';
      if(subTaskConfig.extensions) {
        fileGlob += '/*.{' + subTaskConfig.extensions + '}';
      }
    }

    return {
      src: path.join(rootConfig.src, subTaskConfig.src, fileGlob),
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
