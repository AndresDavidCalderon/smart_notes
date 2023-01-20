require('dotenv').config();

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const csp = {
  development: "default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' wss://*.preview.app.github.dev:8080/ws; img-src 'self' data:; script-src 'self' 'unsafe-inline';",
  production: "default-src 'self'; img-src 'self' data:;",
};

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: devMode ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.ejs',
      templateParameters: {
        CSP: csp[devMode ? 'development' : 'production'],
      },
    }),
  ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devtool: 'source-map',
  devServer: {
    static: ['dist'],
    port: 8080,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    headers: [{
      key: 'Content-Security-Policy',
      value: csp.development,
    }],
  },
};
