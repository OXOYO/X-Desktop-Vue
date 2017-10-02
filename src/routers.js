/**
 * Created by OXOYO on 2017/6/26.
 *
 * 平台路由表
 */

export default [
  // 平台首页
  {
    path: '/',
    name: 'platform.index',
    component: resolve => require(['./platform/pages/Index'], resolve),
    meta: {
      title: '首页',
      requiresAuth: false
    }
  }
]
