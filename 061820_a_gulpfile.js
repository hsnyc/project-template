const { watch } = require('gulp');
const browserSync = require('browser-sync').create();

/*  Globs */
//  'scripts/**/*.js'
/*  will match files like scripts/index.js, scripts/nested/index.js, and scripts/nested/twice/index.js */

/*  Negative globs can be used as an alternative for restricting double-star globs. */
//  ['**/*.js', '!node_modules/**']
/*  https://gulpjs.com/docs/en/getting-started/explaining-globs */

// https://www.browsersync.io/docs/options#option-server
function server() {
  browserSync.init({
    server: {
        baseDir: "src",
        index: "email-preference.html"
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

exports.default = function() {
  server();
  // Watch files
  watch('src/*.html').on('change', browserSync.reload);
};