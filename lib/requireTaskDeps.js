'use strict';

export default (taskDeps) => {
  const td = {};

  for(let key in taskDeps) {
    const dep = taskDeps[key];
    const depPackage = dep.split('/')[0];

    try{
      td[key] = require(process.cwd() + '/node_modules/' + dep);
    }
    catch(e) {
      throw new Error(`Can't find ${depPackage} - try \`npm install ${depPackage}\``);
    }
  }

  return td;
};
