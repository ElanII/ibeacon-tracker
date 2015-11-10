module.exports = function factory($, env) {
    return function task() {
        var target = $.gulp.src(env.paths.input.html + '/index.html');
        var sources = $.gulp.src([
            env.paths.output.scripts.client + '/**/*.js',
            env.paths.output.styles + '/**/*.css'
        ], { read: false });

        return target
            .pipe($.inject(sources, {
                ignorePath: 'dist',
                addRootSlash: true
            }))
            .pipe($.gulp.dest(env.paths.output.html));
    };
};