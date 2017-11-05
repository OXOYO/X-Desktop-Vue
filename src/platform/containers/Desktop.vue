/**
* Created by OXOYO on 2017/6/28.
*
* 窗口界面
*/

<style scoped lang="less" rel="stylesheet/less">
  .desktop {
    display: inline-block;
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .logout {
    float: right;
    margin-top: 20px;
    margin-right:20px;
  }
</style>

<template>
  <div
    class="desktop"
    @drop.stop.prevent="dropHandle"
    @dragover.stop.prevent
    @click="desktopLeftClick($event)"
    @contextmenu.stop.prevent="desktopRightClick($event)"
  >
    <!-- 雨滴背景 -->
    <XRainDay style="position: absolute;" :config="rainDayConfig"></XRainDay>
    <!-- @mousemove.stop.prevent="moveResize" -->
    <!-- 桌面图标 -->
    <DesktopIconBox :desktopIcon="desktopIcon"></DesktopIconBox>
    <!-- 右键菜单 -->
    <ContextMenu></ContextMenu>
    <!-- TODO 任务栏 -->
    <TaskBarBox></TaskBarBox>
    <!-- TODO 循环AppModal -->
    <AppModal
      v-for="item in modalMap"
      :key="item.app.name"
      :info="item"
    >
      <!--<keep-alive>
          <component :is="item.component" v-if="item.component"></component>
      </keep-alive>-->
    </AppModal>
    <!-- TODO Widget -->
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import DesktopIconBox from './DesktopIconBox.vue'
  import ContextMenu from '../components/ContextMenu.vue'
  import TaskBarBox from './TaskBarBox.vue'
  import AppModal from '../components/AppModal.vue'

  export default {
    // TODO 1.需支持图标拖拽
    // TODO DONE 2.需支持右键菜单
    // TODO 3.需支持开始菜单
    // TODO DONE 4.需支持任务栏
    name: 'Desktop',
    components: {
      DesktopIconBox,
      ContextMenu,
      TaskBarBox,
      AppModal
    },
    data () {
      return {
        rainDayConfig: {
          blur: 20,
          opacity: 1
        }
      }
    },
    computed: {
      ...mapState('Platform', {
        // 桌面图标
        desktopIcon: state => {
          return {
            // TODO 应该通过接口获取
            iconList: state.webDesktop.components.desktop.iconList,
            showTitle: state.webDesktop.components.desktop.showTitle
          }
        },
        // TODO 从state中获取打开的APP列表
        modalMap: state => state.webDesktop.components.appModalBox.modalMap,
        // 菜单信息
        contextMenu: state => state.webDesktop.components.contextMenu
      })
    },
    methods: {
      // 桌面左键点击
      desktopLeftClick: function () {
        let _t = this
        if (_t.contextMenu.isShow) {
          // 分发mutation，关闭右键菜单
          _t.$store.commit('Platform/webDesktop/components/contextMenu/update', {
            isShow: false
          })
        }
      },
      // 桌面右键点击
      desktopRightClick: function () {
        let _t = this
        let xVal = parseInt(event.clientX)
        let yVal = parseInt(event.clientY)
        // 菜单信息
        let contextMenuInfo = {
          isShow: true,
          x: xVal,
          y: yVal,
          target: 'desktop'
        }
        // 分发mutation
        _t.$store.commit('Platform/webDesktop/components/contextMenu/update', contextMenuInfo)
      },
      // 节点drop
      dropHandle: function (event) {
        let _t = this
        // 获取拖拽对象数据
        let targetInfo = JSON.parse(event.dataTransfer.getData('Text'))
        // 判断类型
        if (targetInfo && targetInfo.type) {
          switch (targetInfo.type) {
            case 'AppModal':
              _t.handleAppModalDrag(targetInfo, event, 'drop')
              break
          }
        }
      },
      // 拖拽移动中
      dragMoveHandle: function (event) {
        let _t = this
        // 获取拖拽对象数据
        let targetInfo = event.dataTransfer ? JSON.parse(event.dataTransfer.getData('Text')) : null

        if (!targetInfo) {
          return
        }
        // 判断类型
        if (targetInfo && targetInfo.type) {
          switch (targetInfo.type) {
            case 'AppModal':
              _t.handleAppModalDrag(targetInfo, event, 'dragover')
              break
          }
        }
      },
      // 各种处理方法
      handleAppModalDrag: function (targetInfo, event, type) {
        let _t = this
        let data = targetInfo.data || {}
        // 健壮，防止空数据
        if (!Object.keys(data).length) {
          return
        }
        let tmpInfo = {}
        if (type === 'drop') {
          let xVal = event.clientX - data.offsetX
          let yVal = event.clientY - data.offsetY
          let style = {
            'margin-left': 0,
            'margin-top': 0,
            'left': xVal + 'px',
            'top': yVal + 'px'
          }

          tmpInfo = _t.modalMap[data.name]
          tmpInfo = {
            ...tmpInfo,
            modal: {
              ...tmpInfo.modal,
              style: style
            }
          }
        }

        // TODO 处理应用拖拽后相关操作
        // 分发action，更新弹窗列表信息
        _t.$store.dispatch('Platform/webDesktop/components/appModalBox/toggleApp', tmpInfo)
        // 分发mutation，更新任务栏图标信息
        _t.$store.commit('Platform/webDesktop/components/taskBarBox/toggleApp', tmpInfo)
      },
      getApplicationList: async function () {
        let _t = this
        let res = await _t.$store.dispatch('Platform/webDesktop/application/list', {
          userId: 1,
          noToken: true
        })
        res = _t.$utils.Serv.handleRes(res, true)
        if (!res) {
          _t.$Message.error('获取应用列表失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res.data.count === 0) {
          _t.$Message.info('暂无数据！')
        }

        let resList = res.data.list || []
        if (resList.length) {
          _t.$Message.success(res.msg || '获取应用列表成功！')
        }
        _t.appList = resList
        // TODO 解析appList，渲染deskIcon、taskarIcon
        let desktopIcon = {
          iconList: [],
          showTitle: true
        }
        let taskBarIconMap = {}
        for (let i = 0, len = resList.length, item, tmpObj = {}, userConfig, appInfo, appDefConfig; i < len; i++) {
          item = resList[i]
          // 用户配置信息
          userConfig = JSON.parse(item.config)
          // 应用信息
          appInfo = item.appDetail
          // 应用默认配置信息
          appDefConfig = JSON.parse(appInfo.config)
          tmpObj = {
            app: {
              id: appInfo.id,
              name: appInfo.name,
              title: appInfo.title,
              ...appDefConfig.app,
              ...userConfig.app
            },
            modal: {
              ...appDefConfig.modal,
              ...userConfig.modal
            },
            taskBar: {
              ...appDefConfig.taskBar,
              ...userConfig.taskBar
            }
          }
          desktopIcon.iconList.push(tmpObj)
          if (tmpObj.taskBar.isPinned) {
            taskBarIconMap[tmpObj.app.name] = tmpObj
          }
        }
        // TODO 分发mutations，更新desktopIcon数据
        _t.$store.commit('Platform/webDesktop/components/desktop/update', desktopIcon)
        // TODO 初始化任务栏图标信息
        if (Object.keys(taskBarIconMap).length) {
          _t.$store.commit('Platform/webDesktop/components/taskBarBox/initIconMap', taskBarIconMap)
        }
      },
      // 退出
      doLogout: function () {
        // body...
        let _t = this
        sessionStorage.removeItem('demo-token')
        _t.$router.push('/signin')
      },
      // 缩放中
      moveResize: function () {
        console.log('Desktop moveResize...')
      }
    },
    created: async function () {
      let _t = this
      // 获取当前用户应用列表
      await _t.getApplicationList()
    }
  }
</script>

