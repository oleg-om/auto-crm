/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const eslintCacheIdentifier = JSON.stringify(fs.statSync('.eslintrc').mtimeMs)
require('dotenv').config()

const version = 'development'
const config = {
  devtool: 'eval-cheap-module-source-map',

  entry: ['./main.js'],
  resolve: {
    alias: {
      d3: 'd3/index.js'
    },
    modules: [resolve(__dirname, 'node_modules'), 'node_modules']
  },
  output: {
    filename: 'js/[name].bundle2.js',
    path: resolve(__dirname, 'dist/assets'),
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash].js'
  },
  mode: 'development',
  context: resolve(__dirname, 'client'),
  devServer: {
    hot: true,
    liveReload: true,
    static: {
      directory: resolve(__dirname, 'dist/assets'),
      watch: true
    },
    host: 'localhost',
    port: 8087,
    allowedHosts: 'all',
    open: true,
    historyApiFallback: true,

    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    },
    proxy: [
      {
        context: ['/api', '/auth'],
        target: `http://localhost:${process.env.PORT || 8090}`,
        secure: false,
        changeOrigin: true
      }
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [/client/, /stories/],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },

          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|svg|webp)$/,
        loader: 'image-webpack-loader',
        enforce: 'pre'
      },
      {
        test: /\.(png|jpg|gif|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[ext]'
        }
      },
      {
        test: /\.eot$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.woff(2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.[ot]tf$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10 * 1024,
              noquotes: true
            }
          }
        ]
      }
    ]
  },

  plugins: [
    // Temporarily disabled ESLint to resolve function component definition errors
    // new ESLintPlugin({
    //   context: resolve(__dirname, 'client'),
    //   exclude: 'node_modules',
    //   cache: false
    // }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/main.css',
      chunkFilename: 'css/[id].css',
      ignoreOrder: false
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: `${__dirname}/client/assets/images`, to: 'images' },
          { from: `${__dirname}/client/assets/fonts`, to: 'fonts' },

          { from: `${__dirname}/client/assets/sitemap.xml`, to: 'sitemap.xml' },
          { from: `${__dirname}/client/assets/manifest.json`, to: 'manifest.json' },
          { from: `${__dirname}/client/index.html`, to: 'index.html' },

          {
            from: `${__dirname}/client/install-sw.js`,
            to: 'js/install-sw.js',
            transform: (content) => {
              return content.toString().replace(/APP_VERSION/g, version)
            }
          },
          { from: `${__dirname}/client/assets/robots.txt`, to: 'robots.txt' },
          {
            from: `${__dirname}/client/html.js`,
            to: 'html.js',
            transform: (content) => {
              return content.toString().replace(/COMMITHASH/g, version)
            }
          },
          {
            from: `${__dirname}/client/sw.js`,
            to: 'sw.js',
            transform: (content) => {
              return content.toString().replace(/APP_VERSION/g, version)
            }
          }
        ]
      },
      { parallel: 100 }
    ),

    // Disabled ReactRefreshWebpackPlugin to avoid WebSocket compatibility issues
    // new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin(
      Object.keys(process.env).reduce(
        (res, key) => ({ ...res, [key]: JSON.stringify(process.env[key]) }),
        {
          APP_VERSION: +new Date(),
          ENABLE_SOCKETS: JSON.stringify(process.env.ENABLE_SOCKETS || false),
          process: {
            env: {
              MODE: JSON.stringify(process.env.MODE)
            }
          }
        }
      )
    ),
    //  new HardSourceWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = config
