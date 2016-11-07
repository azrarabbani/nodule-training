'use strict';

var path = require('path');

module.exports = function loopmocha(grunt) {

    // Load task
    grunt.loadNpmTasks('grunt-loop-mocha');

    // Options
    return {

        "src": ["<%=loopmocha.options.nemoBaseDir%>/spec/*.js"],
        "options": {
            "nemoBaseDir": path.resolve(__dirname, "../test/functional"),
            "mocha": {
                "timeout": grunt.option("timeout") || 60000,
                "grep": grunt.option("grep") || 0,
                "debug": grunt.option("debug") || 0,
                "reporter": grunt.option("reporter") || "spec"
            },

            "iterations": [
                {
                    "description": "default"
                }
            ]
        },
        "local": {
            "src": "<%=loopmocha.src%>"
        },
        "jenkins": {
            "src": "<%=loopmocha.src%>",
            "options": {
                "loop": {
                    "noFail": (grunt.option('noFail') === undefined) ? true : grunt.option('noFail'),
                    "parallel": true
                },
                "mocha": {
                    "reporter": "mocha-jenkins-reporter"
                },
                "NODE_ENV": "jenkins",
                "iterations": [
                    {
                        "description": "default",
                        "JUNIT_REPORT_PATH": "<%=loopmocha.options.nemoBaseDir%>/report/default" + (new Date()).getTime() + ".xml"
                    }
                ]
            }

        }
    };
};
