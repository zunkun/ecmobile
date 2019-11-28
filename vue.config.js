module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/ecmobile/': './',
  outputDir: 'ecmobile',
  devServer: {
    // disableHostCheck: true,
    port: 4500,
    proxy: {
      '/ec/api': {
        target: 'http://127.0.0.1:5600/',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {'^/ec/api' : '/api'}
      },
    }
  }
}