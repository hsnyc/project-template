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
const imagemin = require('gulp-imagemin');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();
var replace = require('gulp-replace');

//create variables
const files = {
  htmlPath: 'builds/development/*.html',
  scssPath: 'components/sass/*.scss',
  jsPath: [
    'components/scripts/libraries/*.js',
    'components/scripts/*.js'
    // add more sources here if needed.
  ],
  imgPath: 'builds/development/images/**/*.*'
}

//other vars
let cbString; //to use in cacheBust
let outputDir; //for output directory

//create environment variable
// https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_env
const env = process.env.NODE_ENV || 'production';

//output directory check
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

// HTML task: cacheBust hack in dev and uglify if prod
function htmlTask(){
  cbString = new Date().getTime();
  return src(files.htmlPath)
      .pipe(gulpif(env === 'development', replace(/cb=\d+/g, 'cb=' + cbString)))
      .pipe(dest(outputDir));
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
  return src(files.scssPath)
      .pipe(sourcemaps.init()) // initialize sourcemaps first
      .pipe(sass()) // compile SCSS to CSS
      .pipe(gulpif(env === 'production', postcss([autoprefixer(), cssnano()]))) // autopref & cssnano on prod
      .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
      .pipe(dest(outputDir + 'css')); // put final CSS in output folder
}

// JS task: concatenates files to main.js and uglifies on prod
function jsTask(){
  return src(files.jsPath)
      .pipe(concat('main.js'))
      .pipe(gulpif(env === 'production', uglify())) //uglify on prod only
      .pipe(dest(outputDir + 'js'));
}

// Image task: optimize images for production
// https://www.npmjs.com/package/gulp-imagemin
function imgTask(){
  return src(files.imgPath)
    .pipe(gulpif(env === 'production', imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
          plugins: [
              {removeViewBox: false},
              {cleanupIDs: false}
          ]
      })
    ],
    {
      verbose: true
    }
  )))
    .pipe(gulpif(env === 'production', dest(outputDir + 'images')));
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
  //start BrowserSync server
  server();

  //now watch each file
  watch(files.htmlPath, htmlTask).on('change', browserSync.reload);
  watch(files.scssPath, series(scssTask, htmlTask)).on('change', browserSync.reload);
  watch(files.jsPath, jsTask).on('change', browserSync.reload);
  watch(files.imgPath, imgTask).on('change', browserSync.reload);
}

// https://www.browsersync.io/docs/options#option-server
function server() {
  browserSync.init({
    server: {
        baseDir: outputDir,
        index: "index.html"
        //directory: true
    },
    /* 
    Open in specific browser
    (On MacOS check Applications folder for name of app) */
    browser: "FirefoxDeveloperEdition",
    port: 8080, //<-- changing default port (default:3000);
    open: false //<-- enable to prevent opening browser
  });
}

// Export the default Gulp task so it can be run
// Runs html task then the scss and js tasks simultaneously
// then watch files

exports.default = series(
  htmlTask,
  parallel(scssTask, jsTask, imgTask),
  watchTask
);

//BrowserSync Server can be started here or in Watch Task
// exports.build = server();