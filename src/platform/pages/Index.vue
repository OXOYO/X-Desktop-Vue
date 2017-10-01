/**
* Created by OXOYO on 2017/9/30.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .platform-main {
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div class="platform-main">
    <Desktop></Desktop>
  </div>
</template>

<script>
  import Desktop from '../containers/Desktop.vue'

  export default {
    name: 'Platform',
    components: {
      Desktop
    }
  }
</script>

