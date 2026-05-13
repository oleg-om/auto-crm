/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path')
require('dotenv').config()

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const { v4: uuidv4 } = require('uuid')

const version = uuidv4().substr(0, 7)

const config = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        // In Docker/CI (especially under emulation) parallel workers may stall for large bundles.
        parallel: false,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  entry: {
    main: './main.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      d3: 'd3/index.js'
    }
  },
  output: {
    hashFunction: 'sha256',
    filename: 'js/[name].bundle.js',
    path: resolve(__dirname, 'dist/assets'),
    publicPath: '/',
    chunkFilename: 'js/[name].js?id=[chunkhash]'
  },
  mode: 'production',
  context: resolve(__dirname, 'client'),
  devtool: false,
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          { loader: 'css-loader', options: { sourceMap: false } },
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
              publicPath: '../'
            }
          },

          { loader: 'css-loader', options: { sourceMap: false } },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      },
      {
        test: /\.eot$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.woff(2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.[ot]tf$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
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
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets/images', to: 'images' },
        { from: 'assets/fonts', to: 'fonts' },

        { from: 'assets/sitemap.xml', to: 'sitemap.xml' },
        { from: 'assets/manifest.json', to: 'manifest.json' },
        {
          from: 'install-sw.js',
          to: 'js/install-sw.js',
          transform: (content) => {
            return content.toString().replace(/APP_VERSION/g, version)
          }
        },
        { from: 'assets/robots.txt', to: 'robots.txt' },
        { from: 'vendors', to: 'vendors' },
        {
          from: 'html.js',
          to: 'html.js',
          transform: (content) => {
            return content.toString().replace(/COMMITHASH/g, version)
          }
        },
        {
          from: 'sw.js',
          to: 'sw.js',
          transform: (content) => {
            return content.toString().replace(/APP_VERSION/g, version)
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css',
      chunkFilename: 'css/[id].css',
      ignoreOrder: false
    }),
    // Emit version.json so the Node server can read the actual build version at runtime
    {
      apply(compiler) {
        compiler.hooks.emit.tapAsync('VersionPlugin', (compilation, callback) => {
          const content = JSON.stringify({ version })
          // eslint-disable-next-line no-param-reassign
          compilation.assets['version.json'] = {
            source: () => content,
            size: () => content.length
          }
          callback()
        })
      }
    },
    new webpack.DefinePlugin(
      Object.keys(process.env).reduce(
        (res, key) => ({ ...res, [key]: JSON.stringify(process.env[key]) }),
        {
          APP_VERSION: uuidv4().substr(0, 7),
          ENABLE_SOCKETS: process.env.ENABLE_SOCKETS || false,
          process: {
            env: {
              MODE: JSON.stringify(process.env.MODE),
              REACT_APP_STUDY_WEBSOCKET_URL: JSON.stringify(process.env.REACT_APP_STUDY_WEBSOCKET_URL),
              REACT_APP_MAIN_WEBSOCKET_URL: JSON.stringify(process.env.REACT_APP_MAIN_WEBSOCKET_URL)
            }
          }
        }
      )
    )
  ]
}

module.exports = config
