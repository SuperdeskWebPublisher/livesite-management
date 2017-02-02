'use strict';

// Modules
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var lodash = require('lodash');

module.exports = function (grunt) {
    var appConfigPath = path.join(process.cwd(), 'config.js');
    const baseConfig = lodash.defaultsDeep(require(appConfigPath)(grunt));

    var config = {};

    config.entry = {
        app: './app/index.js'
    };

    config.output = {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js'
    };

    config.devtool = 'source-map';

    config.resolve = {
        root: [
            __dirname,
            path.join(__dirname, '/app')
        ],
        extensions: ['', '.js', '.html']
    },

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
                loader: 'file?name=[hash].[ext]'
            },
            {
                test: /\.html$/,
                loader: 'html'
            }
        ]
    };

    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    config.plugins = [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'window.$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery'
        }),
        new webpack.DefinePlugin({
            __BASE_CONFIG__: JSON.stringify(baseConfig)
        })
    ];

    config.plugins.push(
        new HtmlWebpackPlugin({
            template: 'app/index.html',
            inject: 'body'
        }),
        new ExtractTextPlugin('[name].[hash].css')
    );

    config.plugins.push(
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            mangle: false,
            compress: {warnings: false}
        })
    );

    config.devServer = {
        contentBase: './app',
        stats: 'minimal'
    };

    return config;
}();
