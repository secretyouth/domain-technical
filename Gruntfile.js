module.exports = function(grunt) {

    // Load Grunt Tasks
    grunt.loadNpmTasks('grunt-libsass');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');


    // Config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: {
            client: 'client',
            dist: 'dist'
        },

        // Libsass
        libsass: {
            development: {
                src: '<%= app.client %>/components/styles/main.scss',
                dest: '<%= app.client %>/main.css'
            }
        },

        // Connect
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                base: [
                '<%= app.client %>'
                ],
                // Change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {}
            }
        },

        // Copy
        copy: {
            dev: {
                expand: true,
                dot: true,
                cwd: 'node_modules/',
                dest: '<%= app.client %>/components/scripts',
                src: [
                    'angular/angular.js'
                ]
            }
        },

        // Watch
        watch: {
            sass: {
                files: [
                    '<%= app.client %>/components/**/*.{scss,sass}',
                    '!<%= app.client %>/components/styles/main.scss'
                ],
                tasks: ['injector:sass', 'libsass']
            },
            scripts: {
                files: [
                    '<%= app.client %>/**/*.js'
                ],
                tasks: ['injector:externalScripts', 'injector:internalScripts']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                files: [
                '{.tmp,<%= app.client %>}/*.css',
                '{.tmp,<%= app.client %>}/*.html',
                '{.tmp,<%= app.client %>}/**/*.js',
                ],
                options: {
                    livereload: true
                }
            }
        },

        // Injector
        injector: {
            options: {

            },
            // Inject node_module scripts into index
            externalScripts: {
                options: {
                    transform: function(filePath) {
                        filePath = filePath.replace('/client/', '');
                        console.log(filePath);
                        return '<script src="' + filePath + '"></script>';
                    },
                    starttag: '<!-- injector:js -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {
                    '<%= app.client %>/index.html': ['<%= app.client %>/components/scripts/**/*.js']
                }
            },
            // Inject scripts into index
            internalScripts: {
                options: {
                    transform: function(filePath) {
                        filePath = filePath.replace('/client/', '');
                        console.log(filePath);
                        return '<script src="' + filePath + '"></script>';
                    },
                    starttag: '<!-- injector:appjs -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {
                    '<%= app.client %>/index.html': ['<%= app.client %>/**/*.js', '!<%= app.client %>/components/scripts/**/*.js', '!<%= app.client %>/app.js' ]
                }
            },
            // Inject scss into main scss.
            sass: {
                options: {
                    transform: function(filePath) {
                        // console.log('FILEPATH', filePath);
                        filePath = filePath.replace('/client/components/styles/', '');
                        return '@import \'' + filePath + '\';';
                    },
                    starttag: '// injector',
                    endtag: '// endinjector'
                },
                files: {
                    '<%= app.client %>/components/styles/main.scss': [
                    '<%= app.client %>/components/**/*.{scss,sass}',
                    '!<%= app.client %>/components/styles/main.scss'
                    ]
                }
            }
        }

    });

    // Default task(s).
    grunt.registerTask('default', ['injector', 'libsass', 'copy:dev', 'connect', 'watch']);

};