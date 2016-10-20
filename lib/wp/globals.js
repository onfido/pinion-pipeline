'use strict';

import ensureArray from '../ensureArray';

export function getGlobalModulePathToAliasMap(globals) {
  const pathToAliasMap = {};

  for(let pkgName in globals) {
    // We have to manually pass in the location of the module, to ensure we
    // load from the package's node_modules, and not pinion's
    const globalPath = `${process.cwd()}/node_modules/${pkgName}`;
    const aliases = ensureArray(globals[pkgName]);

    pathToAliasMap[globalPath] = aliases;
  }

  return pathToAliasMap;
}

export function forceGlobalModulesRequire(entries, globalModulePaths) {
  globalModulePaths.forEach((path) => {
    // Force a `require(global)` so it's ready as a global
    for(let entryKey in entries) {
      // Ensure we load globals before anything else
      entries[entryKey].unshift(path);
    }
  });

  return entries;
}

// These loaders will handle the `require` calls for injected globals, e.g.
// `require('jquery')` would hit one of these loaders
export function createLoadersForGlobalPackages(globalModulePathToAliasMap) {
  return Object.keys(globalModulePathToAliasMap).map((path) => {
    const aliasLoader = globalModulePathToAliasMap[path].map(
      (alias) =>  'expose?' + alias
    ).join('!');

    return {
      test: require.resolve(path),
      loader: aliasLoader
    };
  });
}
