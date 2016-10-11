'use strict';

import path from 'path';
import defaultLoaderValues from './wp/defaultLoaderValues';
import {
  getGlobalModulePathToAliasMap,
  forceGlobalModulesRequire,
  createLoadersForGlobalPackages
} from './wp/globals';

const replace = (loaders, searchString, replaceObj) => {
  const i = loaders.indexOf(searchString);
  if(i !== -1) {
    loaders.splice(i, 1, replaceObj);
  }
};

export default ({ webpack }, taskConfig, rootConfig) => {
  taskConfig = Object.assign({}, taskConfig);

  const jsSrc = path.resolve(rootConfig.src, taskConfig.src);
  const jsDest = path.resolve(rootConfig.dest, taskConfig.dest);
  const extensions = taskConfig.extensions.map((extension) => '.' + extension);
  const loaders = taskConfig.loaders || Object.keys(defaultLoaderValues);

  let entry = taskConfig.entries || [];
  if(Object.keys(taskConfig.globals || {}).length) {
    const globalModulePathToAliasMap = getGlobalModulePathToAliasMap(taskConfig.globals);

    entry = forceGlobalModulesRequire(entry, Object.keys(globalModulePathToAliasMap));
    loaders.push(createLoadersForGlobalPackages(globalModulePathToAliasMap));
  }

  for(let loaderName in defaultLoaderValues) {
    const loaderValue = defaultLoaderValues[loaderName];
    replace(loaders, loaderName, loaderValue);
  }

  const wpconfig = {
    context: jsSrc,
    entry: entry,
    plugins: taskConfig.plugins || [],
    output: {
      path: path.normalize(jsDest),
      filename: '[name].js',
      publicPath: rootConfig.dest
    },
    module: {
      loaders: loaders
    },
    resolve: {
      root: jsSrc,
      extensions: [''].concat(extensions)
    }
  };

  if(taskConfig.extractSharedJs) {
    // Factor out common dependencies into a shared.js
    wpconfig.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({ name: 'shared' })
    );
  }

  return wpconfig;
};

export function getTaskDeps(taskConfig) {
  const wpDeps = {};

  if(Object.keys(taskConfig.globals || {}).length) {
    wpDeps['expose-loader'] = 'expose-loader';
  }

  const setDep = (dep) => wpDeps[dep] = dep;
  for(let loaderName in defaultLoaderValues) {
    const loaderValue = defaultLoaderValues[loaderName];
    loaderValue._wpDeps.forEach(setDep);
  }

  return wpDeps;
}
