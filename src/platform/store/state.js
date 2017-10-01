/**
 * Created by OXOYO on 2017/9/30.
 */

export default {
  webDesktop: {
    // 组件状态
    components: {
      contextMenu: {
        isShow: false,
        x: 0,
        y: 0
      },
      desktop: {
        showTitle: true,
        // 图标列表
        iconList: []
      },
      taskBarBox: {
        // 图标列表
        iconMap: {}
      },
      appModalBox: {
        // 是否显示
        isShow: false,
        // 弹窗列表
        modalMap: {},
        // 窗口缩放
        reSize: {
          // 是否开始缩放
          isStartResize: false,
          appName: ''
        }
      }
    }
  }
}
