'use strict';
const gulp = require("gulp");
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const inject = require('gulp-inject-string');
const uglify = require('gulp-uglify');

gulp.task('buildJs', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(inject.replace('var numas;', ''))
        .pipe(inject.prepend('window.numas = {};\nwindow.ii = window.numas;\n'))
        .pipe(inject.replace('var __extends', 'window.__extends'))
        .pipe(inject.replace('var ', 'let '))
        .pipe(uglify())
        .pipe(gulp.dest('./bin'));
})

gulp.task("buildDts", () => {
    return tsProject.src()
        .pipe(tsProject())
        .dts.pipe(inject.append('import ii = numas;'))
        .pipe(gulp.dest('./bin'));
});

gulp.task("copy", () => {
    return gulp.src('bin/**/*')
        .pipe(gulp.dest('../../assets/Lib/'))
});

gulp.task('build', gulp.series(
    gulp.parallel('buildJs')
    , gulp.parallel('buildDts')
    , gulp.parallel('copy')
))
