import Vue from 'vue'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import VueRouter from 'vue-router'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

// 导入lodash库
import * as lodash from 'lodash'
import * as utils from './utils'

import App from './App'
import routers from './routers.js'
import PlatformStore from './platform/store'
import AppsStore from './apps/store'
import filters from './filters'

// 注册全局组件
import RainDay from './global/components/RainDay.vue'
import NoData from './global/components/NoData.vue'
import Switch from './global/components/Switch.vue'
Vue.component('XRainDay', RainDay)
Vue.component('XNoData', NoData)
Vue.component('XSwitch', Switch)

// 注册插件
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(iView)

// 创建 axios 实例
const httpInstance = axios.create({
  withCredentials: true
})
// 注册 $http
Vue.prototype.$http = httpInstance

// 创建 store 实例
const storeInstance = new Vuex.Store({
  modules: {
    [PlatformStore.moduleName]: PlatformStore.store,
    [AppsStore.moduleName]: AppsStore.store
  },
  plugins: [
    // createPersistedState({
    //   storage: window.sessionStorage
    // })
  ]
})

// 注册 $lodash
Vue.prototype.$lodash = lodash
// 注册全局utils
Vue.prototype.$utils = utils
// 注册 $filters
// 组件methods内使用
Vue.prototype.$filters = filters
// 组件模板内使用
for (let key in filters) {
  Vue.filter(key, filters[key])
}
// 配置$Message
Vue.prototype.$Message.config({
  duration: 3
})

// 创建router实例
const routerInstance = new VueRouter({
  // 开启 HTML5 history 模式
  mode: 'history',
  base: '/X-Desktop-Vue/',
  routes: routers
})
// 创建导航钩子
routerInstance.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})
routerInstance.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
})
// router & store 同步
sync(storeInstance, routerInstance, { moduleName: 'x-router' })

const isDev = process && process.env.NODE_ENV !== 'production'
Vue.config.debug = isDev
Vue.config.devtools = isDev
Vue.config.productionTip = isDev

/* eslint-disable no-new */
// 启动应用
new Vue({
  store: storeInstance,
  router: routerInstance,
  render: h => h(App)
}).$mount('#app')
