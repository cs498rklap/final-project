module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.initConfig({
    clean: ["client/public/js"],
    uglify: {
      my_target: {
        options: {
          mangle: false
        },
        files: {
          'client/public/js/script.js': ['client/source_js/script.js'],
          'client/public/js/app.js': ['client/source_js/app.js'],
          'client/public/js/controllers.js': [
              'client/source_js/controllers/posts-individual.js',
              'client/source_js/controllers/posts-overall.js',
              'client/source_js/controllers/jobs-individual.js',
              'client/source_js/controllers/jobs-overall.js',
              'client/source_js/controllers/user.js'
          ],
          'client/public/js/services.js': [
              'client/source_js/services/jobs-individual.js',
              'client/source_js/services/jobs-overall.js',
              'client/source_js/services/posts-individual.js',
              'client/source_js/services/posts-overall.js',
              'client/source_js/services/user.js'
          ],
        } //files
      } //my_target
    }, //uglify
    copy: {
      files: {
            expand : true,
            dest   : 'client/public/js',
            cwd    : 'js',
            src    : [
              '**/*.js'
            ]
      }
    },
    compass: {
      dev: {
        options: {
          config: 'compass_config.rb'
        } //options
      }, //dev
      foundation: {
        options: {
          config: 'compass_foundation_config.rb'
        } //options
      } //foundation

    }, //compass
    watch: {
      options: { livereload: true },
      scripts: {
        files: ['client/source_js/*/*.js'],
        tasks: ['clean','uglify'],
        //tasks: ['copy']
      }, //script
      sass: {
        files: ['client/source_sass/*.scss'],
        tasks: ['compass:dev','compass:foundation']
      }, //sass
      sass_foundation: {
        files: ['client/public/foundation6_lib/scss/foundation.scss',
                'client/public/foundation6_lib/scss/*.scss',
                'client/public/foundation6_lib/scss/components/*.scss',
                'client/public/foundation6_lib/scss/forms/*.scss',
                'client/public/foundation6_lib/scss/grid/*.scss',
                'client/public/foundation6_lib/scss/settings/*.scss',
                'client/public/foundation6_lib/scss/typography/*.scss',
                'client/public/foundation6_lib/scss/util/*.scss',
        ],
        tasks: ['compass:dev', 'compass:foundation']
      }, //sass_foundation
      html: {
        files: ['client/public/*/*.html']
      }
    }, //watch
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'server/server.js'
        }
      }
  }
  }) //initConfig
  grunt.registerTask('default', ['express:dev', 'watch', 'uglify']);
} //exports
