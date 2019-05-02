<template>
  <div id="app">
    <router-view />
    <div style="margin-bottom:60px;"></div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="orders-o" :to="{name: 'home'}">出差</van-tabbar-item>
      <van-tabbar-item icon="sign" info="2">审批</van-tabbar-item>
      <van-tabbar-item icon="friends-o">部门</van-tabbar-item>
      <van-tabbar-item icon="user-o" :to="{name: 'me'}">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: 0
      }
    },
  }
</script>