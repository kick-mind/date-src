var gulp = require("gulp");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var ts = require("gulp-typescript");

var tsProject_browser = ts.createProject("tsconfig-browser.json");
var tsProject_nodejs = ts.createProject("tsconfig-nodejs.json");
var tsProject_amd = ts.createProject("tsconfig-amd.json");

gulp.task("nodejs", function () {
    return tsProject_nodejs
      .src()
      .pipe(tsProject_nodejs())
      .js
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist/nodejs"));
  });

  gulp.task("amd", function () {
    return tsProject_amd
      .src()
      .pipe(tsProject_amd())
      .js
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist/amd"));
  });
gulp.task("default", gulp.series(gulp.parallel(["nodejs","amd"]), function () {
  return tsProject_browser
    .src()
    .pipe(tsProject_browser())
    .js
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist/browser"));
}));
