const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './src/index',
	output: {
		path: path.resolve(__dirname, 'libs'),
		filename: 'vedux.min.js',
		// library: '@wmfe/',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
		],
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compressor: {
		// 		pure_getters: true,
		// 		unsafe: true,
		// 		unsafe_comps: true,
		// 		screw_ie8: true,
		// 		warnings: false,
		// 	},
		// })
	],
	mode: 'production',
	optimization: {
		minimize: true
	}
};
