'use strict';


module.exports = function jshint(grunt) {

    function isJenkins() {
        return process.env.BUILD_ID !== undefined;
    }
    // Load task
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Options
    return {
        files: [
            'index.js',
            'controllers/**/*.js',
            'lib/**/*.js',
            'models/**/*.js'
        ],
        options: {
            jshintrc: '.jshintrc',
            reporter: isJenkins() ? 'checkstyle-file' : 'jshint'
        }
    };
};