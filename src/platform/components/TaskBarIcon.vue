/**
* Created by OXOYO on 2017/6/30.
*
* 任务栏图标
*/

<style scoped lang="less" rel="stylesheet/less">
  .task-bar-icon {
    display: inline-block;
    width: 60px;
    height: 39px;
    margin: 0 4px;
    position: relative;
    user-select:none;

    .task-bar-icon-main{
      width: 60px;
      height: 39px;
      line-height: 39px;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: all .2s ease-out;

      &:after {
        content: ' ';
        position: absolute;
        z-index: -1;
        /*background: red;*/
        /*background: rgba(250, 253, 255, .5);*/
        background: rgba(255, 255, 255, 0.3);
        /*opacity: .5;*/
        filter: blur(5px);
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }

      &.app-open {
        /*border: 1px solid rgba(0, 0, 0, .3);*/
        /*background: rgba(250, 253, 255, .3);*/
        border-radius: 2px;
        /*box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);*/
        box-shadow: 0 0 1px 1px rgba(0, 0, 0, .2);
      }
      &:hover {
        /*background: rgba(250, 253, 255, .6);*/
        &:after {
          /*background: rgba(255, 255, 255, 0.5);*/
          /*background: rgba(14, 46, 73, .1);*/
          filter: blur(10px);
        }
        &.app-open {
          box-shadow: 0 0 1px 1px rgba(0, 0, 0, .3);
        }
        .app-icon-bg {
          /*display: block;*/
          filter: blur(6px);
        }
      }
    }

    .app-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -15px;
      margin-top: -15px;
      width: 30px;
      height: 30px;
      /*filter: drop-shadow(0 0 10px #ccc);*/
      /*background: hsla(0,0%,100%,.25) border-box;*/
      /*box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);*/
    }
    .app-icon-down {
      margin-left: -14px;
      margin-top: -14px;
    }
    .app-icon-bg {
      position: absolute;
      display: block;
      overflow: hidden;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      filter: blur(50px);
      background-position: center top;
      transition: all .2s ease-out;
      /*background-size: cover;*/
      /*background-attachment: fixed;*/
    }
  }
</style>

<template>
  <div
    v-if="info.modal.isShow || info.taskBar.isPinned"
    class="task-bar-icon"
    @mousedown.left="mouseDownHandle"
    @mouseup.left="toggleApp"
    @contextmenu.stop.prevent="taskBarIconRightClick($event)"
  >
    <!-- 图标 -->
    <div class="task-bar-icon-main" :class="{ 'app-open': info.modal.isShow }" :data-name="info.app.name">
      <img class="app-icon" :class="{ 'app-icon-down': isMouseDown}" v-if="info.app.icon" :src="info.app.icon" :data-name="info.app.name">
      <div class="app-icon-bg" v-if="info.app.icon" :style="appIconBg"></div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'TaskBarIcon',
    props: {
      info: {
        type: Object,
        default: function () {
          return {}
        },
        required: true
      }
    },
    data () {
      return {
        isMouseDown: false
      }
    },
    computed: {
      appIconBg: function () {
        let _t = this
        let icon = _t.info.app.hasOwnProperty('icon') && _t.info.app.icon ? _t.info.app.icon : null
        if (!icon) {
          return {}
        }
//        console.log('icon', icon)
//        let img = require(icon)
        let img = icon
        return {
          backgroundImage: 'url(' + img + ')'
        }
      },
      ...mapState('Platform', {
        // TODO 从state中获取打开的APP列表
        modalMap: state => state.webDesktop.components.appModalBox.modalMap
      })
    },
    methods: {
      // 鼠标按下
      mouseDownHandle: function () {
        let _t = this
        _t.isMouseDown = true
      },
      // 打开应用
      toggleApp: function () {
        let _t = this
        _t.isMouseDown = false
        let tmpInfo
        let appInfo = _t.info
        let currentSize = appInfo.modal.size
        let oldSize = appInfo.modal.oldSize
        console.log('size:', currentSize, 'oldSize:', oldSize)
        let isNeedChangeZIndex = (appInfo) => {
          let flag = false
          // 1.先判断AppModal个数，大于1个则需要处理zIndex
          if (Object.keys(_t.modalMap).length > 1) {
            // 1.1.遍历判断是否存在比当前Modal的zIndex高的Modal，如果存在则需要处理zIndex
            for (let key in _t.modalMap) {
              let item = _t.modalMap[key]
              if (key !== appInfo.name && item.modal.size !== 'min' && item.modal.zIndex > appInfo.modal.zIndex) {
                flag = true
                break
              }
            }
            // 1.2.如果不存在则需要判断是否等于当前窗口zIndex
//            if (!flag) {
//              for (let key in _t.modalMap) {
//                let item = _t.modalMap[key]
//                if (item.modal.zIndex === targetZIndex) {
//                  flag = true
//                  break
//                }
//              }
//            }
          }
          return flag
        }
        let flag = false
        if (currentSize !== 'min') {
          console.log('zIndex', appInfo.modal.zIndex)
          // TODO 需要判断当前窗口z-index是否在顶层，在顶层则min窗口，不在顶层则将窗口置顶
          flag = isNeedChangeZIndex(appInfo)
          console.log('flag', flag)
          if (flag) {
            // 更新当前弹窗层级
            console.log('changeZIndex 004')
            _t.$store.commit('Platform/webDesktop/components/appModalBox/changeZIndex', appInfo)
          } else {
            tmpInfo = {
              ...appInfo,
              modal: {
                ...appInfo.modal,
                size: appInfo.modal.isCreated ? 'min' : 'middle',
                oldSize: appInfo.modal.isCreated ? currentSize : 'min',
                isShow: true,
                isCreated: true
              }
            }
          }
        } else {
          tmpInfo = {
            ...appInfo,
            modal: {
              ...appInfo.modal,
              size: oldSize,
              oldSize: currentSize,
              isShow: true
            }
          }
        }
        // TODO 处理应用打开相关操作
        _t.$Message.info('打开应用: ' + appInfo.app.title)
        if (!flag) {
          // 分发action，更新弹窗列表信息
          _t.$store.dispatch('Platform/webDesktop/components/appModalBox/toggleApp', tmpInfo)
          // 分发mutation，更新任务栏图标信息
          _t.$store.commit('Platform/webDesktop/components/taskBarBox/toggleApp', tmpInfo)
        }
      },
      // 右键菜单
      taskBarIconRightClick: function (event) {
        let _t = this
        let xVal = parseInt(event.clientX)
        let yVal = parseInt(event.clientY)
        let appName = event.target.dataset['name'] || null
        // 菜单信息
        let contextMenuInfo = {
          isShow: true,
          x: xVal,
          y: yVal,
          target: 'taskBarIcon',
          appName: appName
        }
        // 分发mutation
        _t.$store.commit('Platform/webDesktop/components/contextMenu/update', contextMenuInfo)
      }
    }
  }
</script>

