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
         build: {
            files: [ {
               expand: true,
               src: [ 'js/*.js', '!js/sjsxc.config.js', 'js/lib/*.js', 'css/*', 'ajax/*', 'img/*', 'LICENSE' ],
               dest: 'build/'
            }, {
               expand: true,
               cwd: 'js/jsxc/build/',
               src: [ '**' ],
               dest: 'build/js/jsxc/'
            } ]
         },
         css: {
            files: [ {
               expand: true,
               cwd: 'js/jsxc/lib/',
               src: ['*.css'],
               dest: 'css/'
            } ]
         }
      },
      clean: {
        build: [ 'build/' ],
        css: ['css/']
      },
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
      },
      replace: {
        imageUrl: {
           src: ['css/*.css'],
           overwrite: true,
           replacements: [
              {
                 from: /image-url\(["'](.+)["']\)/g,
                 to: 'url(\'../js/jsxc/img/$1\')'
              }
           ]
        }
      },
      search: {
         console: {
            files: {
               src: [ 'js/*.js' ]
            },
            options: {
               searchString: /console\.log\((?!'[<>]|msg)/g,
               logFormat: 'console',
               failOnMatch: true
            }
         },
         changelog: {
            files: {
               src: [ 'CHANGELOG.md' ]
            },
            options: {
               searchString: "<%= app.version %>",
               logFormat: 'console',
               onComplete: function(m) {
                  if (m.numMatches === 0) {
                     grunt.fail.fatal("No entry in README.md for current version found.");
                  }
               }
            }
         }
      },
      compress: {
         main: {
            options: {
               archive: "archives/sjsxc-<%= app.version %>.zip"
            },
            files: [ {
               src: [ '**' ],
               expand: true,
               dest: 'sjsxc/',
               cwd: 'build/'
            } ]
         }
      },
      autoprefixer: {
         no_dest: {
             src: 'css/*.css'
         }
      },
      sass: {
         options: {
            imagePath: '../js/jsxc/img'
         },
         dist: {
             files: {
                'css/jsxc.sogo.css': 'scss/jsxc.sogo.scss'
             }
         }
      },
      dataUri: {
          dist: {
            src: 'css/jsxc.sogo.css',
            dest: 'build/css/',
            options: {
              target: ['img/*.*', 'js/jsxc/img/*.*', 'js/jsxc/img/**/*.*'],
              maxBytes: 1 //2048
            }
          }
      },
      watch: {
            css: {
                files: ['js/jsxc/scss/*', 'scss/*'],
                tasks: ['sass', 'autoprefixer', 'replace:imageUrl']
            }
      }
   });

   // These plugins provide necessary tasks.
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-banner');
   grunt.loadNpmTasks('grunt-search');
   grunt.loadNpmTasks('grunt-contrib-compress');
   grunt.loadNpmTasks('grunt-sass');
   grunt.loadNpmTasks('grunt-autoprefixer');
   grunt.loadNpmTasks('grunt-data-uri');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-text-replace');

   // Default task.
   grunt.registerTask('default', [ 'build', 'watch' ]);

   grunt.registerTask('build', ['jshint', 'clean:css', 'copy:css', 'sass', 'replace:imageUrl', 'autoprefixer']);

   grunt.registerTask('build:prerelease', ['search:console', 'clean:build', 'build', 'copy:build', 'dataUri', 'usebanner', 'compress']);

   grunt.registerTask('build:release', ['search:changelog', 'build:prerelease']);

   // Create alpha/beta build @deprecated
   grunt.registerTask('pre', [ 'build:prerelease' ]);
};
