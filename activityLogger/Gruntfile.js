module.exports = function (grunt) {

    grunt.initConfig({
        docular: {
                useHtml5Mode: false, //Use angular's html5 mode? true/false.
                docular_webapp_target: './docs', //The place where the docs will be generated
                showAngularDocs: true,
                showDocularDocs: true,
                examples: {}, //instructions for how to run the sandboxed examples
                groups: [
                    {
                        id: 'app',
                        title: 'Ionic App',
                        files: grunt.file.expand(['www/app/**/*.js'])
                    }
                ] //groups of documentation to parse
            }
    });

    grunt.loadNpmTasks('grunt-docular');
    grunt.registerTask('docs', ['docular']);
};
