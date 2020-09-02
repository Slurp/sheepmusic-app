'use strict'
process.env.BABEL_ENV = 'renderer'

const path             = require('path')
const { dependencies } = require('../package.json')
const webpack          = require('webpack')

const MinifyPlugin         = require("babel-minify-webpack-plugin")
const CopyWebpackPlugin    = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin    = require('html-webpack-plugin')
const { VueLoaderPlugin }  = require('vue-loader')
const pkg                  = require('../package.json')

const _ = module.exports = {}

_.cwd = (file) => {
  return path.join(process.cwd(), file || '')
};

/**
 List of node_modules to include in webpack bundle
 Required for specific packages like Vue UI libraries
 that provide pure *.vue files that need compiling
 https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */

let whiteListedModules = ['vue']

let rendererConfig = {

  devtool:   '#cheap-module-eval-source-map',
  entry:     {
    renderer: path.join(__dirname, '../src/renderer/main.js')
  },
  externals: [
    ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
  ],

  module:  {

    rules: [
      {
        test:    /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use:     {
          loader:  'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.scss$/,
        use:  [
          { loader: 'vue-style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true, sassOptions: { includePaths: ['./node_modules'], indentedSyntax: false } } },
        ]
      },
      {
        test: /\.sass$/,
        use:  ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.less$/,
        use:  ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use:  ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use:  'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use:  'node-loader'
      },
      {
        test: /\.vue$/,
        use:  {
          loader:  'vue-loader',
          options: {
            extractCSS: process.env.NODE_ENV === 'production',
            loaders:    {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader',
              less: 'vue-style-loader!css-loader!less-loader',
            }
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use:  {
          loader: 'url-loader',
          query:  {
            limit: 10000,
            name:  'img/[name].[ext]'
          }
        }
      },
      {
        test:    /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader:  'url-loader',
        options: {
          limit: 10000,
          name:  'media/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use:  {
          loader: 'url-loader',
          query:  {
            limit: 10000,
            name:  'fonts/[name].[ext]'
          }
        }
      }
    ]
  },
  node:    {
    __dirname:  process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new webpack.DefinePlugin({
      PKG_INFO: {
        appId:       JSON.stringify(pkg.build.appId),
        productName: JSON.stringify(pkg.build.productName),
        description: JSON.stringify(pkg.description),
        name:        JSON.stringify(pkg.name),
        author:      JSON.stringify(pkg.author),
        version:     JSON.stringify(pkg.version),
        repository:  JSON.stringify(pkg.repository),
        homepage:    JSON.stringify(pkg.homepage),
        license:     JSON.stringify(pkg.license)
      }
    }),

    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new HtmlWebpackPlugin({
      title:       'ZelfSpotify',
      filename:    'index.html',
      template:    path.resolve(__dirname, '../src/index.ejs'),
      templateParameters(compilation, assets, options)
      {
        return {
          compilation:       compilation,
          webpack:           compilation.getStats().toJson(),
          webpackConfig:     compilation.options,
          htmlWebpackPlugin: {
            files:   assets,
            options: options
          },
          process,
        }
      },
      minify:      {
        collapseWhitespace:    true,
        removeAttributeQuotes: true,
        removeComments:        true
      },
      nodeModules: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output:  {
    filename:      '[name].js',
    libraryTarget: 'commonjs2',
    path:          path.join(__dirname, '../dist/electron')
  },

  resolve: {
    alias:      {
      '@':    path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    modules:    [
      _.cwd('node_modules'),
      // this meanse you can get rid of dot hell
      // for example import 'components/Foo' instead of import '../../components/Foo'
      _.cwd('src/renderer')
    ],
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  },
  target:  'electron-renderer'
}

/**
 Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  rendererConfig.plugins.push(
      new webpack.DefinePlugin({
        '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
      })
  )
}

/**
 Adjust rendererConfig for production settings
 */

if (process.env.NODE_ENV === 'production') {
  rendererConfig.devtool = ''
  rendererConfig.plugins.push(
      new MinifyPlugin(),
      new CopyWebpackPlugin(
        {
          patterns: [{
            from:   path.join(__dirname, '../static'),
            to:     path.join(__dirname, '../dist/electron/static'),
          }]
        }
      ),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
  )
}

module.exports = rendererConfig
