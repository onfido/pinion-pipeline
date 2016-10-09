'use strict';

export default (taskDeps) => {
  const td = {};

  for(let key in taskDeps) {
    try{
      td[key] = require(process.cwd() + '/node_modules/' + taskDeps[key]);
    }
    catch(e) {
      throw new Error(`Can't find ${taskDeps[key]} - try \`npm install ${taskDeps[key]}\``);
    }
  }

  return td;
};
