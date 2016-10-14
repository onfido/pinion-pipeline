'use strict';

export const getTaskDeps = (taskConstrucs, config) => {
  const deps = {};

  for(let key in taskConstrucs) {
    if(typeof taskConstrucs[key].getTaskDeps === 'function') {
      Object.assign(deps, taskConstrucs[key].getTaskDeps(config));
    }
  }

  return Object.values(deps).map((x) => x.split('/')[0]);
};

export const passConfigToTasks = (taskConstrucs, config) => {
  for(let key in taskConstrucs) {
    const task = taskConstrucs[key].default || taskConstrucs[key];
    if(typeof task === 'object') {
      passConfigToTasks(task, config);
    }
    else if(typeof task === 'function') {
      task(config);
    }
    else {
      throw new Error('Can only pass config to a function, or an object containing functions');
    }
  }
};
