module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/ecapi/ecmobile/': './',
  outputDir: 'ecmobile',
  devServer: {
    // disableHostCheck: true,
    port: 4500,
    proxy: {
      '/ecapi/api': {
        target: 'http://127.0.0.1:5600/',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {'^/ecapi/api' : '/api'}
      },
    }
  }
}