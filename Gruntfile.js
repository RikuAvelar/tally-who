module.exports = function (grunt) {
  'use strict';
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var files;
  var domain = require('domain').create();
  domain.on('error', function(err) {
    // Proceed. We're totally cool
    console.error(err.stack);
    domain.dispose();
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      server: {
        options: {
          script: 'app.js',
          port: 3000
        }
      }
    },
    jshint: {
      gruntfile: {
        src: ['./Gruntfile.js']
      },
      server: {
        src: ['app.js', 'routes/*.js']
      },
      tests: {
        src: ['spec/*.js'],
        options: {
          expr: true
        }
      }
    },
    simplemocha: {
        options: {
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },

      all: { src: ['spec/*.js'] }
    },
    watch: {
      options: {
        spawn: false
      },
      server: {
        files: [
          'app.js',
          'routes/*.js'
        ],
        tasks: ['jshint:server', 'express']
      },
      all: {
        files: [
          'spec/*.js',
          './Gruntfile.js',
          'app.js',
          'routes/*.js'
        ],
        tasks: ['jshint', 'simplemocha', 'express']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'simplemocha', 'express', 'watch:all']);
  grunt.registerTask('test', ['jshint', 'simplemocha']);
  grunt.registerTask('serve', ['jshint', 'express', 'watch:server']);
};
