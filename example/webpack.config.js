const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./src'],
  output: {
    path: path.join(__dirname, 'static'),
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    ...({
      alias: {
        '@toranj/react-file-hooks': path.resolve(__dirname, '../src/index.ts'),
        // Have to alias react to avoid two versions
        'react': path.resolve(__dirname, './node_modules/react/index.js')
      }
    })
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html'),
    })
  ]
}