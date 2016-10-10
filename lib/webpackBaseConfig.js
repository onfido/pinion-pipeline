'use strict';

import path from 'path';
import ensureArray from './ensureArray';
import requireTaskDeps from './requireTaskDeps';

const getGlobalModulePathToAliasMap = (globals) => {
  const pathToAliasMap = {};

  for(let pkgName in globals) {
    // We have to manually pass in the location of the module, to ensure we
    // load from the package's node_modules, and not pinion's
    const globalPath = `${process.cwd()}/node_modules/${pkgName}`;
    const aliases = ensureArray(globals[pkgName]);

    pathToAliasMap[globalPath] = aliases;
  }

  return pathToAliasMap;
};

const forceGlobalModulesRequire = (entries, globalModulePaths) => {
  globalModulePaths.forEach((path) => {
    // Force a `require(global)` so it's ready as a global
    for(let entryKey in entries) {
      // Ensure we load globals before anything else
      entries[entryKey].unshift(path);
    }
  });

  return entries;
};

// These loaders will handle the `require` calls for injected globals, e.g.
// `require('jquery')` would hit one of these loaders
const createLoadersForGlobalPackages = (globalModulePathToAliasMap) => {
  return Object.keys(globalModulePathToAliasMap).map((path) => {
    const aliasLoader = globalModulePathToAliasMap[path].map(
      (alias) =>  'expose?' + alias
    ).join('!');

    return {
      test: require.resolve(path),
      loader: aliasLoader
    };
  });
};

const replace = (loaders, searchString, replaceObj) => {
  if(loaders.includes(searchString)) {
    loaders.splice(loaders.indexOf(searchString), 1, replaceObj);
  }
};

export default ({ webpack }, taskConfig, rootConfig) => {
  const jsSrc = path.resolve(rootConfig.src, taskConfig.src);
  const jsDest = path.resolve(rootConfig.dest, taskConfig.dest);
  const publicPath = path.join(rootConfig.dest, '/');
  const globals = Object.assign({}, taskConfig.globals);
  const entries = Object.assign({}, taskConfig.entries);
  const extensions = taskConfig.extensions.map((extension) => '.' + extension);
  const loaders = Object.assign(
    [],
    taskConfig.loaders || ['js', 'jsx', 'json', 'coffee', 'css', 'scss']
  );

  const dynamicWpDeps = {};

  let entry = entries;
  if(Object.keys(globals).length) {
    const globalModulePathToAliasMap = getGlobalModulePathToAliasMap(globals);

    entry = forceGlobalModulesRequire(entries, Object.keys(globalModulePathToAliasMap));
    loaders.push(createLoadersForGlobalPackages(globalModulePathToAliasMap));

    dynamicWpDeps['expose-loader'] = 'expose-loader';
  }

  const loaderNameToValueMap = {
    js: {
      _wpDeps: [
        'babel-loader',
        'babel-core',
        'babel-preset-es2015'
      ],
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        cacheDirectory: true,
        presets: ['babel-preset-es2015']
      }
    },
    jsx: {
      _wpDeps: [
        'babel-loader',
        'babel-core',
        'babel-preset-es2015',
        'babel-preset-react'
      ],
      test: /\.jsx$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        cacheDirectory: true,
        presets: [
          'babel-preset-react',
          'babel-preset-es2015'
        ]
      }
    },
    css: {
      _wpDeps: ['style-loader', 'css-loader'],
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader?modules&localIdentName=[local]___[hash:base64:5]'
      ]
    },
    scss: {
      _wpDeps: ['style-loader', 'css-loader', 'sass-loader', 'node-sass'],
      test: /\.scss$/,
      loaders: [
        'style-loader',
        'css-loader?modules&localIdentName=[local]___[hash:base64:5]',
        'sass-loader'
      ]
    },
    coffee: {
      _wpDeps: ['coffee-loader', 'coffee-script'],
      test: /\.coffee$/,
      loader: 'coffee-loader'
    },
    json: {
      _wpDeps: ['json-loader'],
      test: /\.json$/,
      loader: 'json-loader'
    }
  };

  const setDep = (dep) => dynamicWpDeps[dep] = dep;
  for(let loaderName in loaderNameToValueMap) {
    const loaderValue = loaderNameToValueMap[loaderName];
    replace(loaders, loaderName, loaderValue);

    loaderValue._wpDeps.forEach(setDep);
  }

  const wpconfig = {
    context: jsSrc,
    entry: entry,
    plugins: taskConfig.plugins,
    output: {
      path: path.normalize(jsDest),
      filename: '[name].js',
      publicPath: publicPath
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

  requireTaskDeps(dynamicWpDeps);

  return wpconfig;
};
