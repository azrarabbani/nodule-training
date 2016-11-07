'use strict';
module.exports = function codecoverage(grunt) {

    grunt.loadNpmTasks('grunt-ci-suite');

    return {
        all: {
            src: ['test/unit/**/*-test.js'],
            options: {
                globals: ['chai'], //Mocha options
                timeout: 30000, //Mocha options
                ignoreLeaks: true, //Mocha options
                ui: 'bdd', //Mocha options
                reporter: 'dot', //Mocha options
                covDir: 'test/coverage/istanbul',
                reportType: 'lcov', // Istanbul option - default to "lcov"
                printType: 'both', // Istanbul option - default to "both"
                excludes: []
            }
        }
    };
};