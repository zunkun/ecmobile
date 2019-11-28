<template>
  <div id="app">
    <div class="main-panel">
      <router-view />
    </div>

    <van-tabbar v-model="tabActive">
      <van-tabbar-item name="home" to="/" icon="wap-home-o">出差</van-tabbar-item>
      <van-tabbar-item name="approvals"  to="/approvals?type=1" icon="records" v-if="user.manager">审批</van-tabbar-item>
      <van-tabbar-item name="trips"  to="/trips" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        tabActive: 'home',
        user: {}
      }
    },
    created() {
      let user = JSON.parse(localStorage.getItem('user')) || {};
      this.user = user;
    }
  }
</script>

<style scoped>
  #app {
    background-color: hsl(0, 0%, 98%);
    padding: 0px 0px;
    color: #000;
    min-height: 100vh;
    height: 100%;
  }

  .main-panel {
    margin-bottom: 60px;
  }
</style>