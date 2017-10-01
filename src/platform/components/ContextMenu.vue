/**
* Created by OXOYO on 2017/6/29.
* 右键菜单
*/

<style lang="less" rel="stylesheet/less">
  .context-menu {
    position: absolute;
    min-width: 120px;
    width: auto !important;
    z-index: 9999;
    /*background: #F0F0F0;*/
    box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, .1);

    .context-menu-group {
      width: 100%;
      &:after {
        content: ' ';
        width: 90%;
        height: 1px;
        background: #cdcdcd;
        display: block;
        margin-left: 5%;
      }
    }
    .hide-title {
      .ivu-menu-item-group-title {
        display: none;
      }
    }
    .context-menu-item {
      padding: 5px 10px 5px 30px;
      position: relative;

      .context-menu-icon {
        position: absolute;
        top: 10px;
        left: 10px;
      }
    }
  }
</style>

<template>
  <Menu
    v-if="contextMenu.isShow"
    class="context-menu"
    theme="light"
    :style="contextMenuStyle"
    @on-select="triggerMenu"
  >
    <!-- TODO 菜单功能待细化，需根据target类型来分别处理 -->
    <!-- FIXME 可以考虑自定义菜单的实现 -->
    <!-- 桌面 -->
    <Menu-group class="context-menu-group hide-title" v-if="contextMenu.target === 'desktop'">
      <Menu-item class="context-menu-item" name="refresh">
        <Icon class="context-menu-icon" type="refresh"></Icon>
        刷新
      </Menu-item>
      <Menu-item class="context-menu-item" name="fullscreen" v-if="!isFullscreen">
        <Icon class="context-menu-icon" type="arrow-expand"></Icon>
        全屏
      </Menu-item>
      <Menu-item class="context-menu-item" name="cancelFullscreen" v-if="isFullscreen">
        <Icon class="context-menu-icon" type="arrow-shrink"></Icon>
        取消全屏
      </Menu-item>
      <Menu-item class="context-menu-item" name="theme">
        主题
      </Menu-item>
    </Menu-group>
    <!-- 桌面图标 -->
    <Menu-group class="context-menu-group hide-title" v-if="contextMenu.target === 'desktopIcon'">
      <Menu-item class="context-menu-item" name="openApp">
        打开
      </Menu-item>
      <Menu-item class="context-menu-item" name="uninstallApp">
        卸载
      </Menu-item>
    </Menu-group>
    <!-- 任务栏图标 -->
    <Menu-group class="context-menu-group hide-title" v-if="contextMenu.target === 'taskBarIcon'">
      <Menu-item class="context-menu-item" name="pinToTaskBar" v-if="!isPinned">
        <Icon class="context-menu-icon" type="pin" style="transform: rotate(90deg);"></Icon>
        将此程序锁定到任务栏
      </Menu-item>
      <Menu-item class="context-menu-item" name="unpinToTaskBar" v-if="isPinned">
        <Icon class="context-menu-icon" type="pin"></Icon>
        将此程序从任务栏解锁
      </Menu-item>
      <Menu-item class="context-menu-item" name="closeApp">
        <Icon class="context-menu-icon" type="close"></Icon>
        关闭
      </Menu-item>
    </Menu-group>
  </Menu>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'ContextMenu',
    data () {
      return {
        // 是否全屏标识
        isFullscreen: false,
        // 是否锁定到任务栏标识
        isPinned: false
      }
    },
    computed: {
      ...mapState('Platform', {
        // 菜单信息
        contextMenu: state => state.webDesktop.components.contextMenu,
        // 任务栏中的应用列表
        iconMap: state => state.webDesktop.components.taskBarBox.iconMap
      }),
      contextMenuStyle: function () {
        let _t = this
        let x = _t.contextMenu.x !== undefined ? (parseInt(_t.contextMenu.x) > 0 ? parseInt(_t.contextMenu.x) : 0) : 0
        let y = _t.contextMenu.y !== undefined ? (parseInt(_t.contextMenu.y) > 0 ? parseInt(_t.contextMenu.y) : 0) : 0
        let tmpObj = {}
        // 判断是否超出边界
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
          let winHeight = document.documentElement.clientHeight
          let winWidth = document.documentElement.clientWidth
          if (x + 200 > winWidth) {
            tmpObj['right'] = '10px'
          } else {
            tmpObj['left'] = x + 'px'
          }
          if (y + 100 > winHeight) {
            tmpObj['bottom'] = '42px'
          } else {
            tmpObj['top'] = y + 'px'
          }
        }
        return tmpObj
      }
    },
    watch: {
      'contextMenu.isShow': function (val) {
        let _t = this
        // 判断是否显示菜单 && target为taskBarIcon
        if (val && _t.contextMenu.target === 'taskBarIcon' && _t.contextMenu.appName) {
          // 获取当前app是否已锁定到任务栏
          let appInfo = _t.iconMap[_t.contextMenu.appName]
          _t.isPinned = appInfo.taskBar.isPinned
        }
      }
    },
    methods: {
      // 右键菜单触发
      triggerMenu: function (menuName) {
        let _t = this
        // TODO 执行菜单相应操作
        _t.$Message.info('触发菜单: ' + menuName)
        switch (menuName) {
          case 'refresh':
            _t.$router.go(0)
            break
          case 'fullscreen':
            _t.toggleFullscreen(true)
            break
          case 'cancelFullscreen':
            _t.toggleFullscreen(false)
            break
          case 'theme':

            break
          case 'openApp':

            break
          case 'uninstallApp':

            break
          case 'pinToTaskBar':
            _t.togglePin(true)
            break
          case 'unpinToTaskBar':
            _t.togglePin(false)
            break
          case 'closeApp':
            _t.doCloseApp()
            break
        }
        // 关闭菜单
        let contextMenuInfo = {
          ..._t.contextMenu,
          isShow: false
        }
        // 分发mutation
        _t.$store.commit('Platform/webDesktop/components/contextMenu/update', contextMenuInfo)
      },
      // 切换全屏
      toggleFullscreen: function (isFullscreen) {
        let _t = this
        _t.isFullscreen = isFullscreen
        if (isFullscreen) {
          // 全屏
          let docElm = document.documentElement
          if (docElm.requestFullscreen) {
            docElm.requestFullscreen()
          } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen()
          } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen()
          } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen()
          }
        } else {
          // 退出全屏
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        }
      },
      // 切换锁定
      togglePin: function (isPin) {
        let _t = this
        let tmpInfo = _t.iconMap[_t.contextMenu.appName]
        tmpInfo = {
          ...tmpInfo,
          taskBar: {
            ...tmpInfo.taskBar,
            isPinned: isPin
          }
        }
        // TODO 处理应用拖拽后相关操作
        // 分发action，更新弹窗列表信息
        _t.$store.dispatch('Platform/webDesktop/components/appModalBox/toggleApp', tmpInfo)
        // 分发mutation，更新任务栏图标信息
        _t.$store.commit('Platform/webDesktop/components/taskBarBox/toggleApp', tmpInfo)
        // TODO 调用API，更新用户app信息
      },
      // 关闭app
      doCloseApp: function () {
        let _t = this
        let tmpInfo = _t.iconMap[_t.contextMenu.appName]
        tmpInfo = {
          ...tmpInfo,
          modal: {
            ...tmpInfo.modal,
            isShow: false
          },
          closeApp: true
        }
        // 更新当前弹窗状态
        _t.$store.dispatch('Platform/webDesktop/components/appModalBox/toggleApp', tmpInfo)
        // 分发mutation，更新任务栏图标信息
        _t.$store.commit('Platform/webDesktop/components/taskBarBox/toggleApp', tmpInfo)
      }
    }
  }
</script>

