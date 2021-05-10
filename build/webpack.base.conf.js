const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');
const config = require('./config');
const { resolve, isProd } = require('./tools');
const pkg = require('../package.json');

const baseConfig = {
  target: 'web',
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'source-map',
  entry: {
    index: resolve('src/index.js'),
    
  },
  output: {
    filename: '[name].js',
    path: resolve(`dist`),
    library: pkg.name,
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.json'],
    
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        
        // loader: 'babel-loader',
        use: [
          {
            loader: 'happypack/loader',
            options: {
              id: 'happy-babel',
            },
          },
        ],
        include: [resolve('src'), resolve('demo')],
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: { inline: true, fallback: false },
        },
        include: [resolve('src'), resolve('demo')],
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: 'happy-babel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            cacheDirectory: true,
          },
        },
      ],
      threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_PATH: JSON.stringify(config[process.env.BUILD_ENV].API_PATH),
      },
    }),
  ],
};

module.exports = baseConfig;
