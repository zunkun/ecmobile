module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/eclient/': './',
  outputDir: 'eclient',
  devServer: {
    port: 4500,
    proxy: {
      '/ec/api': {
        target: 'http://10.164.8.131:5600/',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {'^/ec/api' : '/api'}
      },
      '/api': {
        target: 'http://10.164.8.131:5600',
        secure: false,
        ws: true,
        changeOrigin: true,
      },
    }
  }
}