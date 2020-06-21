var gulp = require('gulp'),
    concat = require('gulp-concat'), //conbines files
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush')
;

//create variables
var env, jsSources, sassSources, htmlSources, outputDir;

//create environment variable
var env = process.env.NODE_ENV || 'development';

//output directory
if (env === 'development') {
  outputDir = 'builds/development/';
} else {
  outputDir = 'builds/production/';
}

//Js file sources
jsSources = [
  'components/scripts/vendor/*.js',
  'components/scripts/*.js'
  // add more sources here if needed.
];

sassSources = ['components/sass/style.scss'];
htmlSources = ['builds/development/*.html'];


//Tasks Begin

gulp.task('html', function() {
  gulp.src(htmlSources)
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
  .pipe(connect.reload())
});

gulp.task('styles', function() {
  gulp.src(sassSources)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('main.js'))
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('images', function() {
  gulp.src('builds/development/images/**/*.*')
  .pipe(gulpif(env === 'production', imagemin({
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [pngcrush()]
  })))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
  .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['styles']);
  gulp.watch('builds/development/*.html',['html']);
  gulp.watch('builds/development/images/**/*.*',['images']);
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true,
    port: 8008
  });
});

gulp.task('default', ['html', 'styles', 'js', 'images', 'connect', 'watch']);