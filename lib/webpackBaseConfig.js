'use strict';

var path = require('path');
var webpack = require('webpack');
var objectAssign = require('object-assign');

function getGlobalModulePathToAliasMap(globals) {
  var pathToAliasMap = {};

  Object.keys(globals).map(function(pkgName) {
    // We have to manually pass in the location of the module, to ensure we
    // load from the package's node_modules, and not pinion's
    var globalPath = process.cwd() + '/node_modules/' + pkgName;
    var aliases = Array.isArray(globals[pkgName]) ? globals[pkgName] : [globals[pkgName]];

    pathToAliasMap[globalPath] = aliases;
  });

  return pathToAliasMap;
}

function forceGlobalModulesRequire(entries, globalModulePaths) {
  globalModulePaths.forEach(function(path) {
    // Force a `require(global)` so it's ready as a global
    Object.keys(entries).forEach(function(entryKey) {
      // Ensure we load globals before anything else
      entries[entryKey].unshift(path);
    });
  });

  return entries;
}

// These loaders will handle the `require` calls for injected globals, e.g.
// `require('jquery')` would hit one of these loaders
function createLoadersForGlobalPackages(globalModulePathToAliasMap) {
  return Object.keys(globalModulePathToAliasMap).map(function(path) {
    var aliasLoader = globalModulePathToAliasMap[path].map(function(alias) {
      return 'expose?' + alias;
    }).join('!');

    return {
      test: require.resolve(path),
      loader: aliasLoader
    };
  });
}

module.exports = function(taskConfig, rootConfig) {
  var jsSrc = path.resolve(rootConfig.src, taskConfig.src);
  var jsDest = path.resolve(rootConfig.dest, taskConfig.dest);
  var publicPath = path.join(rootConfig.dest, '/');
  var globals = objectAssign({}, taskConfig.globals);
  var entries = objectAssign({}, taskConfig.entries);
  var extensions = taskConfig.extensions.map(function(extension) {
    return '.' + extension;
  });
  var cssQueryParams = taskConfig.cssModules ? '?modules&localIdentName=[local]___[hash:base64:5]' : '';

  // There's a webpack bug, where (since pinion is external to where it will
  // be called from) we need to pass through resolved webpack ids, for plugins
  // and presets, rather than strings for webpack to resolve itself.
  // See https://github.com/babel/babel-loader/issues/166
  var resolvedPackages = (function() {
    var returnObj = {};
    [
      'babel-preset-react',
      'babel-preset-es2015'
    ].forEach((function(x) {
      returnObj[x] = require.resolve(x);
    }));

    return returnObj;
  })();

  var globalModulePathToAliasMap = getGlobalModulePathToAliasMap(globals);

  var wpconfig = {
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
          exclude: /node_modules/,
          loaders: [
            'style',
            'css' + cssQueryParams
          ]
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          loader: 'style!css'
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loaders: [
            'style',
            'css' + cssQueryParams,
            'sass'
          ]
        },
        {
          test: /\.scss$/,
          include: /node_modules/,
          loader: 'style!css!sass'
        }
      ], taskConfig.loaders || [])
    },
    resolve: {
      root: jsSrc,
      extensions: [''].concat(extensions)
    },
    resolveLoader: {
      // Make sure we look for loaders in `pinion`'s node_modules, before
      // the node_modules of where `pinion` is called from
      root: [
        path.join(__dirname, '../node_modules'),
        jsSrc
      ]
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
