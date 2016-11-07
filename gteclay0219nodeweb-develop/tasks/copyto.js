'use strict';


module.exports = function copyto(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-copy-to');

    // Options
    return {
        build: {
            files: [
                {
                    cwd: '.',
                    src: ['node_modules/dustjs-linkedin/dist/dust-core.js'],
                    dest: 'public/js/lib/'
                },
                {
                    cwd: 'public',
                    src: ['**/*'],
                    dest: '.build/'
                }
            ],
            options: {
                ignore: [
                    'public/css/**/*',
                    'public/js/**/*',
                    'public/templates/**/*'
                ]
            }
        }
    };
};
