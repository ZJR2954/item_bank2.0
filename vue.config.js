module.exports = {
  devServer: {
    host: '0.0.0.0',                  //处理IP地址不能访问
    proxy: {                          //处理跨域，配置代理，开发环境使用，打包后失效
      '/api': {
        target: 'http://127.0.0.1:8081',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        },
      }
    }
  },

  //生产环境下的配置，cdn方式引入依赖
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios'
      })
    })
  }

}
