/**
* Created by OXOYO on 2017/6/30.
*
* 任务栏容器
*/

<style scoped lang="less" rel="stylesheet/less">
  .task-bar-box {
    position: absolute;
    bottom: 0;
    z-index: 500;
    width: 100%;
    height: 40px;
    display: inline-block;

    .task-bar-box-bg {
      position: absolute;
      bottom: 0;
      z-index: 510;
      width: 100%;
      height: 100%;
      display: inline-block;
      border-top: 1px solid #FFF;
      background: #2A5AAD;
      opacity: .5;
      filter: blur(20px);
      overflow: hidden;
    }

    .task-bar-box-main {
      position: absolute;
      bottom: 0;
      z-index: 520;
      width: 100%;
      height: 100%;
      display: inline-block;
      // #0E2E49
      border-top: 1px solid rgba(14, 46, 73, .3);
      box-sizing: content-box;
    }
  }
</style>

<template>
  <div class="task-bar-box">
    <div class="task-bar-box-bg"></div>
    <div class="task-bar-box-main">
      <!-- TODO 任务栏图标列表 -->
      <TaskBarIcon
        v-for="item in iconMap"
        :key="item.app.name"
        :info="item"
      ></TaskBarIcon>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import TaskBarIcon from '../components/TaskBarIcon.vue'

  export default {
    name: 'TaskBarBox',
    components: {
      TaskBarIcon
    },
    // TODO 从state拉取任务栏图标信息
    computed: {
      ...mapState('Platform', {
        // TODO 从state中获取打开的APP列表
        iconMap: state => state.webDesktop.components.taskBarBox.iconMap
      })
    }
  }
</script>

