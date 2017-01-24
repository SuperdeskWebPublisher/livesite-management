'use strict';

// Modules
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    var config = {};

    config.entry = isTest ? {} : {
        app: './app/index.js'
    };

    config.output = isTest ? {} : {
        path: __dirname + '/dist',

        publicPath: isProd ? '/' : 'http://localhost:8080/',

        filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

        chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
    };

    if (isTest) {
        config.devtool = 'inline-source-map';
    } else if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    config.resolve = {
        root: [
            __dirname,
            path.join(__dirname, '/app')
        ],
        extensions: ['', '.js', '.html']
    },

    // Initialize module
    config.module = {
        preLoaders: [],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.css/,
                loader: 'style!css'
            },
            {
                test: /\.(png|gif|jpeg|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file'
            },
            {
                test: /\.html$/,
                loader: 'raw'
            }
        ]
    };

    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    config.plugins = [];

    if (!isTest) {
        config.plugins.push(
                new HtmlWebpackPlugin({
                    template: 'app/index.html',
                    inject: 'body'
                }),
                new ExtractTextPlugin('[name].[hash].css', {disable: !isProd})
                );
    }

    if (isProd) {
        config.plugins.push(
                new webpack.NoErrorsPlugin(),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin(),
                new CopyWebpackPlugin([{
                        from: __dirname + '/app'
                    }])
                );
    }

    config.devServer = {
        contentBase: './app',
        stats: 'minimal'
    };

    return config;
}();
