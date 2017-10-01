/**
* Created by OXOYO on 2017/6/29.
* 应用弹窗容器
*/
<!--  FIXME 暂弃 -->

<style scoped lang="less" rel="stylesheet/less">
  .app-modal-box {
    display: inline-block;
  }
</style>

<template>
  <div class="app-modal-box">
    <!-- TODO 循环AppModal -->
    <u-app-modal
      v-for="item in modalList"
      :key="item.app.name"
      :info="item"
    ></u-app-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AppModal from '../components/AppModal.vue'

  export default {
    name: 'AppModalBox',
    components: {
      'u-app-modal': AppModal
    },
    data () {
      return {
        modalList: [
          {
            name: '',
            id: '',
            index: '',
            size: '',
            isShow: false
          }
        ]
      }
    },
    computed: {
      ...mapState('Platform', {
        // TODO 从state中获取打开的APP列表
        appModalBox: state => state.webDesktop.components.appModalBox
      })
    }
  }
</script>

