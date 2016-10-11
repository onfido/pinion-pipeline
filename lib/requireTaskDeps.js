'use strict';

export default (taskDeps) => {
  const td = {};

  const errors = [];
  for(let key in taskDeps) {
    try{
      td[key] = require(process.cwd() + '/node_modules/' + taskDeps[key]);
    }
    catch(e) {
      errors.push(e.message);
    }
  }

  if(errors.length) {
    errors.map((e) => console.error(e));
    process.exit(1);
  }

  return td;
};
