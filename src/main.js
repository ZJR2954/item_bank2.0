import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
//cdn方式引入时注释
// import './plugins/element.js'

// 导入全局样式表
import './assets/css/base.css'

Vue.config.productionTip = false

Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'
//请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

//添加事件总线对象
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
