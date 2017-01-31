var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        ngtemplates: {
            core: {
                src: 'app/**/*.html',
                dest: 'app/templates-cache.generated.js',
                options: {
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    },
                    bootstrap: function (module, script) {
                        return '"use strict";' +
                                'angular.module("livesite-management.templates-cache")' +
                                '.run([\'$templateCache\', function($templateCache) {' +
                                script + ' }]);';
                    }
                }
            },
            dev: {
                dest: 'app/templates-cache.generated.js',
                src: [],
                options: {bootstrap: () => ''}
            }
        },

        clean: {
            options: {force: true},
            structure: ['dist']
        },

        webpack: {
            options: webpackConfig,
            build: {}
        },

        'webpack-dev-server': {
            start: {
                webpack: webpackConfig
            }
        }
    });

    grunt.registerTask('build', [
        'clean',
        'ngtemplates:core',
        'webpack:build'
    ]);

    grunt.registerTask('server', [
        'clean',
        'ngtemplates:dev',
        'webpack-dev-server:start'
    ]);
};
