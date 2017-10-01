/**
 * Created by OXOYO on 2017/9/30.
 */

export default {
  // 桌面右键菜单
  'webDesktop/components/contextMenu/update': (state, data) => {
    state.components.contextMenu = {
      ...data
    }
  },
  // 更新桌面图表数据
  'webDesktop/components/desktop/update': (state, data) => {
    state.components.desktop = {
      ...data
    }
  },
  'webDesktop/components/appModalBox/toggleApp': (state, data) => {
    // 判断是否移除
    // if (data.closeApp) {
    //   let modalMap = {
    //     ...state.components.appModalBox.modalMap
    //   }
    //   delete modalMap[data.name]
    //   state.components.appModalBox.modalMap = modalMap
    // } else {
    state.components.appModalBox.modalMap = {
      ...state.components.appModalBox.modalMap,
      [data.app.name]: data
    }
    // }
  },
  // 切换窗口层级
  'webDesktop/components/appModalBox/changeZIndex': (state, data) => {
    let modalMap = state.components.appModalBox.modalMap
    let keysArr = Object.keys(modalMap)
    let defZIndex = 600
    let i = 0
    for (let key of keysArr) {
      let item = modalMap[key]
      if (item.app.name !== data.app.name) {
        modalMap[key].modal.zIndex = defZIndex + i
        i++
      }
    }
    data.modal.zIndex = defZIndex + i
    state.components.appModalBox.modalMap = {
      ...modalMap,
      [data.app.name]: data
    }
  },
  // 窗口缩放
  'webDesktop/components/appModalBox/reSize/update': (state, data) => {
    state.components.appModalBox.reSize = data
  },
  // 初始化任务栏图标信息
  'webDesktop/components/taskBarBox/initIconMap': (state, data) => {
    state.components.taskBarBox.iconMap = {
      ...data
    }
  },
  // 更新任务栏图标信息
  'webDesktop/components/taskBarBox/toggleApp': (state, data) => {
    // 判断是否移除
    if (data.closeApp) {
      // 判断是否锁定
      if (!data.taskBar.isPinned) {
        let iconMap = {
          ...state.components.taskBarBox.iconMap
        }
        delete iconMap[data.app.name]
        state.components.taskBarBox.iconMap = {
          ...iconMap
        }
      } else {
        data.closeApp = false
        state.components.taskBarBox.iconMap = {
          ...state.components.taskBarBox.iconMap,
          [data.app.name]: data
        }
      }
    } else {
      state.components.taskBarBox.iconMap = {
        ...state.components.taskBarBox.iconMap,
        [data.app.name]: data
      }
    }
  }
}
