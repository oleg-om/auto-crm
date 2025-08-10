const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Load environment variables from .env file
require('dotenv').config()

// Create environment variables object for webpack
const env = {}
Object.keys(process.env).forEach(key => {
  env[key] = JSON.stringify(process.env[key])
})

// Ensure NODE_ENV is set correctly
env.NODE_ENV = JSON.stringify('production')

module.exports = {
  mode: 'production',
  entry: './client/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[id].js',
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'client/assets', to: '.' },
        { from: 'public', to: '.' },
        { from: 'client/install-sw.js', to: '.' },
        { from: 'client/sw.js', to: '.' },
        { from: 'client/html.js', to: '.' },
        { from: 'client/index.docker.html', to: 'index.html' }
      ]
    })
  ],
  module: {
    rules: [
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
              sourceMap: false
            }
          }
        ]
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
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'client')
    }
  }
}
