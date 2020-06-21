const { src, dest } = require('gulp');
const   babel = require('gulp-babel'),
        uglify = require('gulp-uglify'),
        concat = require('gulp-concat'), //conbines files
        sass = require('gulp-sass'),
        connect = require('gulp-connect'),
        gulpif = require('gulp-if'),
        uglify = require('gulp-uglify'),
        imagemin = require('gulp-imagemin'),
        pngcrush = require('imagemin-pngcrush');

function defaultTask(cb) {
    // place code for your default task here
    cb();
  }
  
  exports.default = defaultTask