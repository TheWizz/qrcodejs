var gulp = require('gulp');

var uglify = require('gulp-uglify');
var rjs = require('requirejs');
var gzip = require('gulp-gzip');
// var env = require('gulp-env');	// For reading env variables


var uglifyOptions = {
	mangle: {
		keep_fnames: false
	}, output: {
		// Beautify, if set to true makes the obfuscated code readable (indented)
		beautify: false,
		// Attempt to retain license-related comments
		comments: /@preserve|@license/i
	}
};

var rjsOptimizeConfig = {
	baseUrl: ".",
	findNestedDependencies: true,
	paths: {
		requireLib: 'node_modules/requirejs/require',
	},
	include: ['QRCode'],
	out: "temp/QRCode.js",
	fileExclusionRegExp: /^\./,	// Avoid .DSStore, et al
	optimize: "none",		// Done separately
};

gulp.task('rjsOptimize', function(cb) {
	rjs.optimize(rjsOptimizeConfig, function(buildResponse) {
		// console.log('build response', buildResponse);
		cb();
	}, cb);
});


var gzipConfig = {
	threshold: 256
};

var DIST_PATH = 'dist';


// Concatenate & Minify JS
gulp.task('minify', ['rjsOptimize'], function() {
	return gulp.src('temp/QRCode.js')	// Was *.js
		.pipe(uglify(uglifyOptions))
		.pipe(gulp.dest(DIST_PATH))
		.pipe(gzip(gzipConfig))
		.pipe(gulp.dest(DIST_PATH));
});




// Default Task
gulp.task('default', ['rjsOptimize', 'minify']);