<style>
  html {
    height: 100%;
    width: 100%;
  }
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>

<template>
  <Platform></Platform>
</template>

<script>
  import Platform from './platform/pages/Index.vue'
  export default {
    name: 'App',
    components: {
      Platform
    }
  }
</script>
