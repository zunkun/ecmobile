module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/eclient/': './',
  outputDir: 'eclient',
  devServer: {
    port: 4500,
    proxy: {
      '/ec/api': {
        target: 'http://172.18.1.100:5400/',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {'^/ec/api' : '/api'}
      },
      '/api': {
        target: 'http://172.18.1.100:5400',
        secure: false,
        ws: true,
        changeOrigin: true,
      },
    }
  }
}