/**
* Created by OXOYO on 2017/6/28.
*
* 桌面图标
*/

<style scoped lang="less" rel="stylesheet/less">
  .desktop-icon {
    width: 80px;
    height: 80px;
    margin: 10px;
    padding: 5px;
    text-align: center;
    display: inline-block;
    position: absolute;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 2px;
    transition: all .2s ease-out;
    user-select:none;

    &:after {
      content: ' ';
      position: absolute;
      display: block;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(255, 255, 255, .5);
      filter: blur(25px);
      opacity: 0;
      overflow: hidden;
    }

    &:hover {
      /*background: rgba(250, 253, 255, .3);*/
      border-color: #B9D7FC;
      &:after {
        opacity: 1;
      }
    }

    img {
      display: block;
      width: 48px;
      height: 48px;
      margin: 0 auto;
    }
    .desktop-icon-down {
      width: 47px;
      height: 47px;
    }
    span {
      display: inline-block;
      color: #ffffff;
      cursor: default;
    }
  }
</style>

<template>
  <!-- TODO 支持图标的拖拽，自动排序 -->
  <div
    class="desktop-icon"
    :style="{ left: info.app.x + 'px', top: info.app.y + 'px' }"
    @mousedown.left="mouseDownHandle"
    @dblclick="openApp"
    @contextmenu.stop.prevent="desktopIconRightClick($event)"
  >
    <!--@mouseup.left="openApp"-->
    <!--@dblclick="openApp"-->
    <img :class="{ 'desktop-icon-down': isMouseDown}" v-if="info.app.icon" :src="info.app.icon">
    <span v-if="showTitle">{{ info.app.title }}</span>
  </div>
</template>

<script>
  export default {
    name: 'DesktopIcon',
    props: {
      info: {
        type: Object,
        default: () => {
          return {
            app: {
              icon: '',
              title: '',
              name: '',
              id: '',
              index: ''
            },
            modal: {
              size: '',
              isShow: false
            },
            taskBar: {
              isPinned: false
            }
          }
        },
        required: true
      },
      showTitle: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        isMouseDown: false
      }
    },
    methods: {
      // 鼠标按下
      mouseDownHandle: function () {
        let _t = this
        _t.isMouseDown = true
      },
      // 打开应用
      openApp: async function () {
        console.log('dblclick...')
        let _t = this
        _t.isMouseDown = false
        let tmpInfo = {
          ..._t.info,
          modal: {
            ..._t.info.modal,
            isShow: true
          }
        }
        // TODO 处理应用打开相关操作
        _t.$Message.info('打开应用: ' + _t.info.app.title)
        // 分发action，更新弹窗列表信息
        await _t.$store.dispatch('Platform/webDesktop/components/appModalBox/toggleApp', tmpInfo)
        // 分发mutation，更新任务栏图标信息
        _t.$store.commit('Platform/webDesktop/components/taskBarBox/toggleApp', tmpInfo)
      },
      // 右键菜单
      desktopIconRightClick: function (event) {
        let _t = this
        let xVal = parseInt(event.clientX)
        let yVal = parseInt(event.clientY)
        // 菜单信息
        let contextMenuInfo = {
          isShow: true,
          x: xVal,
          y: yVal,
          target: 'desktopIcon'
        }
        // 分发mutation
        _t.$store.commit('Platform/webDesktop/components/contextMenu/update', contextMenuInfo)
      }
    }
  }
</script>

