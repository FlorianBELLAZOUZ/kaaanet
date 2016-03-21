module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    files: ['test/browser/*.js'],
    preprocessors: {'test/browser/*.js': ['webpack', 'sourcemap'],},
    webpack: {
      devtool: 'inline-source-map',
      resolve:{
        alias:{
          ws: './ws.browser.js',
        }
      }
    },
    reporters: ['mocha'],
    browsers: ['Chrome'],
  })
}
