var debug   = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var pkgjson = require('./package.json');
var path    = require('path')

module.exports = {
  context: __dirname,
  entry: './src/marketplace.js',
  output: {
    filename: debug ? './marketplace.js' : './marketplace.min.js',
    // library: 'flipp',
    // libraryTarget: 'var'
  },
  devtool: 'source-map'
}

// Plugins
module.exports.plugin = debug ? [] : [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    sourcemap: false
  })
]

// Resolve
module.exports.resolve = {
  root: [
    path.resolve('./'),
    path.resolve('./src/')
  ],
  extensions: ['', '.ts', '.js', 'css', 'scss'],
  moduleDirectories: ['node_modules', 'bower_components']
}

// Loaders
module.exports.module = {
  loaders: [
    { test: /\.ts$/, loader: 'ts-loader' },
    { test: /\.handlebars$/, loader: 'handlebars-loader' },
    { test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"] }
  ]
}