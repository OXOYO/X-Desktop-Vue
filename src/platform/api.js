/**
 * Created by OXOYO on 2017/9/30.
 */

import Vue from 'vue'

export default {
  // 获取用户应用列表
  getApplicationListByUserId: async (data) => {
    Vue.prototype.$Loading.start()
    // let res = await Vue.prototype.$http.get(
    //   Vue.prototype.$utils.Serv.handleUrl('/WebDesktop/application/list'),
    //   {
    //     params: Vue.prototype.$utils.Serv.handleParams(data)
    //   }
    // )
    // FIXME 暂时使用 json 数据模拟API
    let res
    await require.ensure([], (require) => {
      res = (require('../../server/WebDesktop/application/list.js')).default
    })
    Vue.prototype.$Loading.finish()

    return res
  }
}
