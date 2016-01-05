module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [ 'Gruntfile.js', 'src/**/*.js' ]
    },
    exec: {
      docker_build: {
        command: 'docker build -t <%= pkg.dockerRegistry %>/<%= pkg.name %>:<%= pkg.version %>b<%= pkg.build %> .'
      },
      docker_tag: {
        command: 'docker tag -f <%= pkg.dockerRegistry %>/<%= pkg.name %>:<%= pkg.version %>b<%= pkg.build %> <%= pkg.dockerRegistry %>/<%= pkg.name %>:latest'
      },
      docker_push: {
        command: 'docker push <%= pkg.dockerRegistry %>/<%= pkg.name %>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('dist', ['default', 'exec:docker_build', 'exec:docker_tag']);
  grunt.registerTask('deploy', ['dist', 'exec:docker_push']);

};
