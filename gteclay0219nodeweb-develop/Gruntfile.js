'use strict';


module.exports = function (grunt) {

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    // App tasks
    grunt.registerTask('build', [ 'jshint', 'less', 'requirejs', 'dustjs', 'copyto' ]);
    grunt.registerTask('test', [ 'jshint', 'mochacli' ]);
    grunt.registerTask('lint', [ 'jshint' ]);
    grunt.registerTask('automation', [ 'loopmocha:local' ]);
    grunt.registerTask('coverage', [ 'codecoverage' ]);
    grunt.registerTask('automation:ci', [ 'loopmocha:jenkins' ]);

    // Build tasks
    grunt.loadNpmTasks('grunt-ci-suite');

};
