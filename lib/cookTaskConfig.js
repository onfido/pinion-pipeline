'use strict';

var objectAssign = require('object-assign');

// Make sure that the taskConfig is in consistent syntax
var makeConsistent = function(rawTaskConfig) {
  rawTaskConfig = objectAssign({}, rawTaskConfig);

  if(Array.isArray(rawTaskConfig)) {
    rawTaskConfig = {
      taskArray: rawTaskConfig
    };
  }
  else if(!rawTaskConfig.taskArray) {
    // An array of an empty object will create 1 task, that will inherit its options
    rawTaskConfig.taskArray = [{}];
  }

  return rawTaskConfig;
};

module.exports = function(rawTaskConfig, defaultTaskConfig) {
  return objectAssign(
    {},
    makeConsistent(defaultTaskConfig),
    makeConsistent(rawTaskConfig)
  );
};
