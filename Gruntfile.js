module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			development: {
				files: [
					{
						expand: true,
						cwd: "src/less",
						src: ["**/*.less"],
						dest: "public/css",
						ext: ".css"
					}
				]
			}
		},
		watch: {
			scripts: {
				files: ['**/*.less', '**/*.jade'],
				tasks: ['less', 'jade'],
				options: {
					spawn: false
				}
			}
		},
		jade: {
			compile: {
				options: {
					client: false,
					pretty: true
				},
				files: [
					{
						expand: true,
						cwd: "src/jade",
						src: ["**/*.jade", "!**/partials_*.jade"],
						dest: "public",
						ext: ".html"
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');

	grunt.registerTask("default", ["jade", "less", "watch"]);
};