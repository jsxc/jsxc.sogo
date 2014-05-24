/* global module:false */
module.exports = function(grunt) {

   // Project configuration.
   grunt.initConfig({
      app: grunt.file.readJSON('package.json'),
      meta: {
         banner: grunt.file.read('js/jsxc/banner.js')
      },
      jshint: {
         options: {
            jshintrc: 'js/jsxc/.jshintrc'
         },
         gruntfile: {
            src: 'Gruntfile.js'
         },
         files: [ 'js/sjsxc.js' ]
      },
      copy: {
         main: {
            files: [ {
               expand: true,
               src: [ 'js/*.js', 'js/lib/*.js', 'css/*', 'ajax/*', 'img/*', 'LICENSE' ],
               dest: 'build/'
            }, {
               expand: true,
               cwd: 'js/jsxc/build/',
               src: [ '**' ],
               dest: 'build/js/jsxc/'
            } ]
         }
      },
      clean: [ 'build/' ],
      usebanner: {
         dist: {
            options: {
               position: 'top',
               banner: '<%= meta.banner %>'
            },
            files: {
               src: [ 'build/js/*.js' ]
            }
         }
      }
   });

   // These plugins provide necessary tasks.
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-banner');

   // Default task.
   grunt.registerTask('default', [ 'jshint', 'clean', 'copy', 'usebanner' ]);

};
