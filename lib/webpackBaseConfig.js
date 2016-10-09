'use strict';

import path from 'path';
import ensureArray from './ensureArray';

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

export default ({ webpack }, taskConfig, rootConfig) => {
  const jsSrc = path.resolve(rootConfig.src, taskConfig.src);
  const jsDest = path.resolve(rootConfig.dest, taskConfig.dest);
  const publicPath = path.join(rootConfig.dest, '/');
  const globals = Object.assign({}, taskConfig.globals);
  const entries = Object.assign({}, taskConfig.entries);
  const extensions = taskConfig.extensions.map((extension) => '.' + extension);

  // There's a webpack bug, where (since pinion is external to where it will
  // be called from) we need to pass through resolved webpack ids, for plugins
  // and presets, rather than strings for webpack to resolve itself.
  // See https://github.com/babel/babel-loader/issues/166
  const resolvedPackages = (() => {
    const returnObj = {};
    [
      'babel-preset-react',
      'babel-preset-es2015'
    ].forEach((x) => returnObj[x] = require.resolve(x));

    return returnObj;
  })();

  const globalModulePathToAliasMap = getGlobalModulePathToAliasMap(globals);

  const wpconfig = {
    context: jsSrc,
    entry: forceGlobalModulesRequire(entries, Object.keys(globalModulePathToAliasMap)),
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    output: {
      path: path.normalize(jsDest),
      filename: '[name].js',
      publicPath: publicPath
    },
    module: {
      loaders: createLoadersForGlobalPackages(globalModulePathToAliasMap).concat([
        { test: /\.coffee$/, loader: 'coffee-loader' },
        { test: /\.json$/, loader: 'json-loader' },
        {
          test: /\.jsx$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            presets: [
              resolvedPackages['babel-preset-react'],
              resolvedPackages['babel-preset-es2015']
            ]
          }
        },
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            presets: [
              resolvedPackages['babel-preset-es2015']
            ]
          }
        },
        {
          test: /\.css$/,
          loaders: [
            'style',
            'css?modules&localIdentName=[local]___[hash:base64:5]'
          ]
        },
        {
          test: /\.scss$/,
          loaders: [
            'style',
            'css?modules&localIdentName=[local]___[hash:base64:5]',
            'sass'
          ]
        }
      ])
    },
    resolve: {
      root: jsSrc,
      extensions: [''].concat(extensions)
    },
    resolveLoader: {
      // Make sure we look for loaders in `pinion`'s node_modules, rather than
      // the node_modules of where `pinion` is called from
      root: path.join(__dirname, '../node_modules')
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
