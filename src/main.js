import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// 导入lodash库
import * as lodash from 'lodash'

import App from './App'
// import Store from './store'
import filters from './filters'

// 注册插件
Vue.use(Vuex)

// 创建 axios 实例
const httpInstance = axios.create({
  withCredentials: true
})
// 注册 $http
Vue.prototype.$http = httpInstance

// 创建 store 实例
const storeInstance = new Vuex.Store({
  modules: {
    // [Store.moduleName]: Store.store
  },
  plugins: [
    // createPersistedState({
    //   storage: window.sessionStorage
    // })
  ]
})

// 注册 $lodash
Vue.prototype.$lodash = lodash

// 注册 $filters
// 组件methods内使用
Vue.prototype.$filters = filters
// 组件模板内使用
for (let key in filters) {
  Vue.filter(key, filters[key])
}

const isDev = process && process.env.NODE_ENV !== 'production'
Vue.config.debug = isDev
Vue.config.devtools = isDev
Vue.config.productionTip = isDev

// 启动应用
new Vue({
  store: storeInstance,
  // router: routerInstance,
  render: h => h(App)
}).$mount('#app')
