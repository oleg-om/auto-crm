/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path')
require('dotenv').config()

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { v4: uuidv4 } = require('uuid')

const gitRevisionPlugin = new GitRevisionPlugin()
const version = uuidv4().substr(0, 7)

const config = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        }
      })
    ]
  },
  entry: {
    main: './main.js'
  },
  resolve: {
    alias: {
      d3: 'd3/index.js'
    },
    modules: [resolve(__dirname, 'node_modules'), 'node_modules']
  },
  output: {
    filename: 'js/[name].bundle.test.js?id=[contenthash]',
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
        test: /.html$/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                {
                  search: /COMMITHASH/gi,
                  replace: gitRevisionPlugin.commithash()
                }
              ]
            }
          }
        ]
      },

      {
        test: /\.js$/,
        use: ['babel-loader'],
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
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },

          { loader: 'css-loader', options: { sourceMap: false } },
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
        test: /\.(jpg|png|gif|webp)$/,
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
    //   cache: true
    // }),
    new CopyWebpackPlugin(
      {
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
      },
      { parallel: 100 }
    ),
    new MiniCssExtractPlugin({
      filename: 'css/main.css',
      chunkFilename: 'css/[id].css',
      ignoreOrder: false
    }),
    new webpack.DefinePlugin(
      Object.keys(process.env).reduce(
        (res, key) => ({ ...res, [key]: JSON.stringify(process.env[key]) }),
        {
          APP_VERSION: uuidv4().substr(0, 7),
          ENABLE_SOCKETS: process.env.ENABLE_SOCKETS || false,
          process: {
            env: {
              MODE: JSON.stringify(process.env.MODE)
            }
          }
        }
      )
    )
  ]
}

module.exports = config
