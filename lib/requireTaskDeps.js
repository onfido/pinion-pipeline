'use strict';

export default (taskDeps) => {
  const td = {};

  for(let key in taskDeps) {
    try{
      td[key] = require(process.cwd() + '/node_modules/' + taskDeps[key]);
    }
    catch(e) {
      console.error(e);
      process.exit(1);
    }
  }

  return td;
};
