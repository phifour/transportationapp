/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var through = require('through2');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var browserify = require('browserify');
var uglifyify = require('gulp-uglifyjs');
var stripDebug = require('gulp-strip-debug');
var mergeStream = require('merge-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var hbsfy = require("hbsfy");
var path = require('path');
var swPrecache = require('sw-precache');
var nodemon = require('gulp-nodemon');

var reload = browserSync.reload;

gulp.task('clean', function (done) {
    require('del')(['dist'], done);
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		// proxy: "http://localhost:8000",
        files: ["dist/**/*.*"],
        browser: "google chrome",
        port: 8000,
	});
});

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

gulp.task('html', function () {
    return gulp.src([
        'src/index.html'
    ])
        .pipe(plugins.swig({
            defaults: { cache: false }
        }))
        .pipe(plugins.htmlmin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            minifyJS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
        })).pipe(gulp.dest('dist'))
        .pipe(reload({ stream: true }));
});

gulp.task('css', function () {
    return gulp.src('src/css/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({ outputStyle: 'compressed' }))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
        .pipe(plugins.filter('**/*.css'))
        .pipe(reload({ stream: true }));
});

gulp.task('misc', function () {
    return gulp.src([
    // Copy all files
        'src/**',
    // Exclude the following files
    // (other tasks will handle the copying of these files)
    // '!src/*.html',
    // '!src/{css,css/**}',
        '!src/{js,js/**}'
    ]).pipe(gulp.dest('dist'));
});

function createBundler(src) {
    var b;

    if (plugins.util.env.production) {
        b = browserify();
    }
    else {
        b = browserify({
            cache: {}, packageCache: {}, fullPaths: true,
            debug: true
        });
    }

    b.transform(hbsfy);

    if (plugins.util.env.production) {
        b.transform({
            global: true
        }, 'uglifyify');
    }

    b.add(src);
    return b;
}

var bundlers = {
    'js/app.js': createBundler(['./src/js/app.js',
        './src/js/controller/main.controller.js',
         './src/js/controller/dummy.js'
    ])
};

function bundle(bundler, outputPath) {
    var splitPath = outputPath.split('/');
    var outputFile = splitPath[splitPath.length - 1];
    var outputDir = splitPath.slice(0, -1).join('/');

    return bundler.bundle()
    // log errors if they happen
        .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
        .pipe(source(outputFile))
        .pipe(buffer())
        .pipe(plugins.sourcemaps.init({ loadMaps: true })) // loads map from browserify file
        .pipe(plugins.sourcemaps.write('./')) // writes .map file
        .pipe(plugins.size({ gzip: true, title: outputFile }))
        .pipe(gulp.dest('dist/' + outputDir))
        .pipe(reload({ stream: true }));
}

gulp.task('json', function () {
    gulp.src(['./src/json/**'])
        .pipe(gulp.dest('./dist/json/'))
});

gulp.task('js', function () {
    gulp.src(['./src/js/**'])
        .pipe(concat('app.js'))
        //.pipe(uglifyify())
        //.pipe(stripDebug())
        .pipe(gulp.dest('./dist/js/'))
});

gulp.task('watch', ['build'], function () {
    gulp.watch(['src/*.html'], ['html']);
    gulp.watch(['src/css/*.css'], ['css']);

    Object.keys(bundlers).forEach(function (key) {
        var watchifyBundler = watchify(bundlers[key]);
        watchifyBundler.on('update', function () {
            return bundle(watchifyBundler, key);
        });
        bundle(watchifyBundler, key);
    });
});

gulp.task('generate-service-worker', ['css', 'misc', 'html', 'js', 'json'], function (callback) {
    var rootDir = 'dist';
    swPrecache.write(path.join(rootDir, 'my-service-worker.js'), {
        staticFileGlobs: ['src/index.html', 'src/css/*.*', 'src/dependencies/*.js', 'src/json/*.json', 'src/js/app.js'],
        stripPrefix: 'src'
    }, callback);
});

gulp.task('build', function () {
    //return runSequence('clean', ['css', 'misc', 'html', 'js','json']);
    return runSequence('clean', ['css', 'misc', 'html', 'js','json','generate-service-worker']);
});

gulp.task('serve', ['browser-sync', 'watch']);
gulp.task('default', ['build']);