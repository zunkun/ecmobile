<template>
  <div id="approvals">
    <van-tabs v-model="active">
      <van-tab title="待审批">待审批</van-tab>
      <van-tab title="已审批">已审批</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'approvals',
  data() {
    return {
      active: 0,
    }
  }
}
</script>

