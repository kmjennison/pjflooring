var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var concat = require('gulp-concat');
var useref = require('gulp-useref');
var revReplace = require('gulp-rev-replace');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('src/less/agency.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('src/css/agency.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('src/js/agency.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('lib/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('lib/jquery'))

    gulp.src(['node_modules/tether/dist/js/tether.js', 'node_modules/tether/dist/js/tether.min.js'])
        .pipe(gulp.dest('lib/tether'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('lib/font-awesome'))
})

// Run everything
gulp.task('default', ['less', 'minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './src'
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('src/less/*.less', ['less']);
    gulp.watch('src/css/*.css', ['minify-css']);
    gulp.watch('src/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

// Compiles SCSS files from /scss into /css
gulp.task('sass', function() {
    return gulp.src('src/css/agency.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Dist for production.

gulp.task('images', function() {
    // TODO: update CSS after adding hash to img file names
    // See: https://github.com/galkinrost/gulp-rev-css-url
    gulp.src(['img/**/*']).pipe(gulp.dest('./dist/img'));
});

gulp.task('js', function() {
    return gulp.src(['src/js/jqBootstrapValidation.js', 'src/js/contact_me.js', 'src/js/agency.min.js',])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe(rev.manifest('rev-manifest-js.json'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('css', function() {
    return gulp.src(['src/css/agency.min.css'])
        .pipe(concat('app.css'))
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe(rev.manifest('rev-manifest-css.json'))
        .pipe(gulp.dest('./dist'));
});

// Replace script references.
gulp.task('revreplace', function() {

  // Can also try: https://github.com/lazd/gulp-replace
  return gulp.src('*.html')
    .pipe(useref())
    .pipe(revReplace({manifest: gulp.src('./dist/rev-manifest-js.json')}))
    .pipe(revReplace({manifest: gulp.src('./dist/rev-manifest-css.json')}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('dist', ['less', 'minify-css', 'js', 'css', 'images', 'revreplace'], function() {
    console.log('Built!');
});
