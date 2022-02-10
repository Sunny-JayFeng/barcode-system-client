<template>
  <div id="app" style="width: 100%; height: 100%">
    <Nav v-if="!isLogin" style="position: absolute"/>
    <router-view v-if="isLogin"/>
    <router-view v-else style="position: absolute; left: 14.8%; top: 16%"/>
  </div>
</template>

<script>
import Nav from './components/Nav'
export default {
  name: 'App',
  data () {
    return {
      isLogin: false
    }
  },
  created () {
    let path = window.location.pathname
    this.isLogin = path.indexOf('login') !== -1
  },
  components: {Nav}
}
</script>

<style>
@import '/assets/style/global.css';
@import '/assets/style/reset.css';
</style>
