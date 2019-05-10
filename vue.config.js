module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/ecmobile/': './',
  outputDir: 'ecmobile',
  devServer: {
    port: 4500,
    proxy: {
      '/ec/api': {
        target: 'https://portal.haierfinancial.com:18612/',
        secure: false,
        ws: true,
        changeOrigin: true,
        // pathRewrite: {'^/ec/api' : '/api'}
      },
    }
  }
}