var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var watch = require('gulp-watch');


gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('sass', function() {
	 return gulp.src('assets/css/src/main.scss')
		  		.pipe(sass().on('error', sass.logError) )
		  		.pipe(autoprefixer())
		  		.pipe(gulp.dest('assets/css'));
  	});

// gulp.task('scripts', function() {
// 	return gulp.src([
// 		'./bower_components/mustache.js/mustache.js',
// 		'./assets/js/src/functions.js',
// 		'./assets/js/src/main.js'
// 		])
// 		.pipe(concat('app.js'))
// 		.pipe(gulp.dest('./js/'));
// });

gulp.task('watch', function() {
	gulp.watch([
		'assets/css/src/**/*.scss',
		'assets/js/src/*.js'
		], 
		[
		'sass'
		]);
});