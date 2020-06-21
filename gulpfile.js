// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
var replace = require('gulp-replace');
const browserSync = require('browser-sync').create();

//create environment variable
const env = process.env.NODE_ENV || 'development';

//create variables
const files = {
  htmlPath: 'builds/development/*.html',
  scssPath: 'components/sass/*.scss',
  jsPath: [
    'components/scripts/vendor/*.js',
    'components/scripts/*.js'
    // add more sources here if needed.
  ]
}

//output directory
if (env === 'development') {
  outputDir = 'builds/development/';
} else {
  outputDir = 'builds/production/';
}

/*  Globs */
//  'scripts/**/*.js'
/*  will match files like scripts/index.js, scripts/nested/index.js, and scripts/nested/twice/index.js */

/*  Negative globs can be used as an alternative for restricting double-star globs. */
//  ['**/*.js', '!node_modules/**']
/*  https://gulpjs.com/docs/en/getting-started/explaining-globs */

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
  return src(files.scssPath)
      .pipe(sourcemaps.init()) // initialize sourcemaps first
      .pipe(sass()) // compile SCSS to CSS
      .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
      .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
      .pipe(dest(outputDir + 'css')
  ); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
  return src(files.jsPath)
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(dest(outputDir + 'js')
  );
}

// Cachebust
function cacheBustTask(){
  var cbString = new Date().getTime();
  return src(['builds/development/index.html'])
      .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
      .pipe(dest(outputDir));
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
  //start BrowserSync server
  server();
  //now watch files
  watch([files.htmlPath, files.scssPath, ...files.jsPath],
      {interval: 1000, usePolling: true}, //Makes docker work
      series(
          parallel(scssTask, jsTask),
          cacheBustTask
      )
  ).on('change', browserSync.reload);
}

// https://www.browsersync.io/docs/options#option-server
function server() {
  browserSync.init({
    server: {
        baseDir: outputDir,
        index: "index.html"
        //directory: true
    },

    /* Open in specific browser
      (On MacOS check Applications folder for name) */
    browser: "FirefoxDeveloperEdition",

    //changing default port (default:3000);
    port: 8080

    //open: false //<--- set to false to prevent opening browser
  });
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task

exports.default = series(
  parallel(scssTask, jsTask), 
  cacheBustTask,
  watchTask
);

// exports.build = server();