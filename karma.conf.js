module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    files: ['test/browser/*.js'],
    preprocessors: {'test/browser/*.js': ['webpack', 'sourcemap'],},
    webpack: {devtool: 'inline-source-map'},
    reporters: ['mocha'],
    browsers: ['Chrome'],
  })
}
