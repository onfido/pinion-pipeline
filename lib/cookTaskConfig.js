'use strict';

// Make sure that the taskConfig is in consistent syntax
const makeConsistent = (rawTaskConfig) => {
  rawTaskConfig = Object.assign({}, rawTaskConfig);

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

export default (rawTaskConfig, defaultTaskConfig) => {
  return Object.assign(
    {},
    makeConsistent(defaultTaskConfig),
    makeConsistent(rawTaskConfig)
  );
};
