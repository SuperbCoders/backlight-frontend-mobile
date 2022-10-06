//====================================
//              modules             //
//====================================
var gulp         = require('gulp');
// var sass         = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
var csscomb      = require('gulp-csscomb');
var csso         = require('gulp-csso');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var plumber      = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();
var tinpng       = require('gulp-tinypng');
var newer        = require('gulp-newer');
var svgo         = require('gulp-svgo');
var twig         = require('gulp-twig');
var replace      = require('gulp-replace');
var htmlbeautify = require('gulp-html-beautify');
var rename       = require("gulp-rename");
var purgecss     = require('gulp-purgecss');

// var sourcemaps   = require('gulp-sourcemaps');
// var del = require('del');


//====================================
//              paths             //
//====================================
var paths = {
    template: {
        srcWatch: ['src/pages/*.twig','src/twig/**/*.twig'],
        src: ['src/twig/pages/*.twig'],
        dest: 'app/'
    },
    styles: {
        srcWatch: ['src/scss/**/*.scss', 'src/twig/**/**/*.scss'],
        src: 'src/scss/main.scss',
        dest: 'app/css/'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'app/js/'
    },
    images: {
        src: 'src/img/**/**/*.*',
        dest: 'app/img/'
    },
    svg: {
        src: 'src/img/**/**/*.*',
        dest: 'app/img/'
    },
    php: {
        src: 'src/**/**/*.php',
        dest: 'app/'
    },
    fonts: {
        src: 'src/fonts/*.*',
        dest: 'app/fonts/'
    },
    stylesStatic: {
        src: 'src/static/plugins/css/*.css',
        dest: 'app/css/'
    },
    scriptsStatic: {
        src: 'src/static/plugins/js/*.js',
        dest: 'app/js/'
    },
    scriptsVendor: {
        src: 'src/static/vendor/*.js',
        dest: 'app/js/vendor/'
    },
};

//====================================
//          BrowserSync            //
//====================================
function browserSyncTask() {
    browserSync.init({
        server: {
            baseDir: "app"
        },
        ui: false
    });
}

//====================================
//                Twig              //
//====================================
function twigTask() {
    return gulp.src(paths.template.src)
        .pipe(plumber())
        .pipe(twig())
        .pipe(replace('/src/', ''))
        .pipe(htmlbeautify())
        .pipe(gulp.dest(paths.template.dest))
        .pipe(browserSync.stream());
}

//====================================
//                scss              //
//====================================
function scssTask() {
    return gulp.src(paths.styles.src)
        .pipe(rename("style.scss"))
        .pipe(plumber())
        .pipe(sass())
        // .pipe(purgecss({
        //     content: ['app/*.html', 'app/**/*.js']
        // }))
        .pipe(autoprefixer())
        .pipe(csscomb())
        .pipe(replace('/src/', '../'))
        .pipe(csso())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

//====================================
//                js                //
//====================================
function jsTask() {
    return gulp.src(paths.scripts.src)
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

//====================================
//            img TinyPng           //
//====================================
function TinyPngTask() {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(newer(paths.images.dest))
        .pipe(tinpng('1n9UL-m3FoRoJ-nq24hbAJmuR1pl_wls'))
        .pipe(gulp.dest(paths.images.dest))
}

//====================================
//                svg               //
//====================================
function svgTask() {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(newer(paths.images.dest))
        .pipe(svgo())
        .pipe(gulp.dest(paths.images.dest))
}

//====================================
//               fonts              //
//====================================
function fontsTask() {
    return gulp.src(paths.fonts.src)
        .pipe(plumber())
        .pipe(newer(paths.fonts.dest))
        .pipe(gulp.dest(paths.fonts.dest))
}

//====================================
//                php               //
//====================================
function phpTask() {
    return gulp.src(paths.php.src)
        .pipe(plumber())
        .pipe(replace('/src/', ''))
        .pipe(newer(paths.php.dest))
        .pipe(gulp.dest(paths.php.dest))
        .pipe(browserSync.stream());
}

//====================================
//             jsStatic             //
//====================================
function jsStaticTask() {
    return gulp.src(paths.scriptsStatic.src)
        .pipe(concat('assets.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scriptsStatic.dest))
}

//====================================
//             ssStatic             //
//====================================
function cssStaticTask() {
    return gulp.src(paths.stylesStatic.src)
        .pipe(concat("assets.css"))
        .pipe(autoprefixer())
        .pipe(csscomb())
        .pipe(csso())
        .pipe(gulp.dest(paths.stylesStatic.dest))
}

//====================================
//             jsVendor             //
//====================================
function jsVendorTask() {
    return gulp.src(paths.scriptsVendor.src)
        .pipe(uglify())
        .pipe(gulp.dest(paths.scriptsVendor.dest))
        .pipe(browserSync.stream());
}

//====================================
//              scsscomb            //
//====================================
function scssCombTask() {
    return gulp.src(paths.scss.src)
        .pipe(plumber())
        .pipe(csscomb())
        .pipe(gulp.dest(paths.scss.dest))
}

//====================================
//              watch               //
//====================================
function watch() {
    gulp.watch(paths.template.srcWatch, twigTask);
    gulp.watch(paths.styles.srcWatch, scssTask);
    gulp.watch(paths.scripts.src, jsTask);
    gulp.watch(paths.images.src, TinyPngTask);
    gulp.watch(paths.svg.src, svgTask);
    gulp.watch(paths.php.src, phpTask);
    gulp.watch(paths.fonts.src, fontsTask);
    gulp.watch(paths.scriptsStatic.src, jsStaticTask);
    gulp.watch(paths.stylesStatic.src, cssStaticTask);
}


var dev = gulp.parallel(jsVendorTask, browserSyncTask, watch);

exports.default = dev;

//====================================
//            End Gulpfile          //
//====================================