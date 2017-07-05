module.exports = function(grunt) {
	// LiveReload的默认端口号，你也可以改成你想要的端口号
	var lrPort = 35729;
	// 使用connect-livereload模块，生成一个与LiveReload脚本
	// <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
	var lrSnippet = require('connect-livereload')({ port: lrPort });
	// 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
	 var serveStatic = require('serve-static');
	 var serveIndex = require('serve-index');
	var lrMiddleware = function(connect, options) {
		return [
			// 把脚本，注入到静态文件中
			lrSnippet,
			// 静态文件服务器的路径
			serveStatic(options.base[0]),
			// 启用目录浏览(相当于IIS中的目录浏览)
			serveIndex(options.base[0])
		];
	};
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			options: {
				// 服务器端口号
				port: 8888,
				// (可以使用主机名localhost，也能使用IP)
				hostname: 'localhost',
				// 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
				base: '.'
			},
			livereload: {
				options: {
					// 通过LiveReload脚本，让页面重新加载。
					middleware: lrMiddleware
				}
			}
		},
		watch: {
			client: {
				// 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
				options: {
					livereload: lrPort
				},
				// '**' 表示包含所有的子目录
				// '*' 表示包含所有的文件
                tasks: ['less'],
				files: ['*.html', 'css/**/*','less/**/*']
			}
		},
		less: {
			lessall: {
				files: [{
					expand: true,
					cwd: 'less',
					src: '**/*.less',
					dest: 'css/',
					ext: '.css'
				}]
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-less');
	// Default task(s).
	grunt.registerTask('default', ['connect','watch','less']);
};
