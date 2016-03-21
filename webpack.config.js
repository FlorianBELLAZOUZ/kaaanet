var webpack = require('webpack');

module.exports = {
  targer:'web',
  entry:'./lib/Client.js',
  output:{
    path:'dist/',
    filename:'client.js'
  },
  resolve:{
    alias:{
      ws: './ws.browser.js',
    }
  }
}
