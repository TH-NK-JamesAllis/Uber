
var gulp = require('gulp'),
    rjs = require('gulp-requirejs');
 
gulp.task('requirejsBuild', function() {
    rjs({
        baseUrl: '/main.js',
        out: 'mainfdfssf.js',
        shim: {
            // standard require.js shim options 
        },
        // ... more require.js options 
    })
    .pipe(gulp.dest('/build')); // pipe it to the output DIR 
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['requirejsBuild']);