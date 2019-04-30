module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/eclient/': './',
  outputDir: 'eclient',
  devServer: {
    port: 4000,
    proxy: {
      '/eclient/api': {
        target: 'http://[::1]:4000/',
        secure: false,
        ws: true,
        changeOrigin: true,
      },
    }
  }
}