'use strict';

export default {
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
