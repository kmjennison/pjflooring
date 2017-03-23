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
    return gulp.src('less/agency.less')
        .pipe(less())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('css/agency.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/agency.js')
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
            baseDir: ''
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});

// Compiles SCSS files from /scss into /css
// NOTE: This theme uses LESS by default. To swtich to SCSS you will need to update this gulpfile by changing the 'less' tasks to run 'sass'!
gulp.task('sass', function() {
    return gulp.src('scss/agency.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Dist for production.

gulp.task('images', function() {
    gulp.src(['img/**/*']).pipe(gulp.dest('../dist/img'));
});

gulp.task('scripts', function() {
    // gulp.src(['js/jqBootstrapValidation.js', 'js/contact_me.js', 'js/agency.min.js',])
    gulp.src(['js/agency.min.js'])
        .pipe(concat('app.js'))
        .pipe(rev())
        .pipe(gulp.dest('../dist/js'))
        .pipe(rev.manifest('rev-manifest.json'))
        .pipe(gulp.dest('../dist'));

    gulp.src(['css/agency.min.css'])
        .pipe(concat('app.css'))
        .pipe(rev())
        .pipe(gulp.dest('../dist/css'))
        .pipe(rev.manifest('rev-manifest-css.json'))
        .pipe(gulp.dest('../dist'));
        // // add CSS file revisions to same manifest
        // .pipe(rev.manifest('rev-manifest.json', {
        //     merge: true,
        //     base: gulp.dest('../dist')
        // }));
});

// Replace script references.
gulp.task('revreplace', function() {
  // var manifest = gulp.src('../dist/rev-manifest.json');

  // return gulp.src('*.html')
  //   .pipe(revReplace({manifest: manifest}))
  //   .pipe(useref())
  //   .pipe(gulp.dest('../dist/'));

  // var manifest = gulp.src('../dist/rev-manifest.json');

  var manifestJs = gulp.src('../dist/rev-manifest.json');

  return gulp.src('*.html')
    .pipe(useref())
    .pipe(revReplace({manifest: manifestJs}))
    // .pipe(revReplace({manifest: gulp.src('../dist/rev-manifest-css.json')}))
    .pipe(gulp.dest('../dist'));
});

gulp.task('dist', ['less', 'minify-css', 'minify-js', 'scripts', 'images', 'revreplace'], function() {
    console.log('Built!');
});
