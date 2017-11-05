/**
 * Created by OXOYO on 2017/9/30.
 */

// 导入api
import Api from '../api'

// TODO action功能细化
export default {
  // 打开/关闭应用
  'webDesktop/components/appModalBox/toggleApp': async ({ commit }, payload) => {
    // 处理iframe显示方式
    if (payload.modal.type && payload.modal.type === 'iframe') {
      commit('webDesktop/components/appModalBox/toggleApp', payload)
      // 处理modal显示方式
    } else {
      let appName = payload.app.name
      console.log('appName', appName)
      console.log('payload', payload)
      // 动态加载组件
      require.ensure([], (require) => {
        let app = require('@/apps/' + appName + '/Index.vue')
        payload.component = app
        commit('webDesktop/components/appModalBox/toggleApp', payload)
      })
    }
  },
  // 获取当前用户桌面应用列表
  'webDesktop/application/list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getApplicationListByUserId(payload)
    return res
  }
}
