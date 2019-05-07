<template>
  <div id="manage">
    <div class="profile">
      <van-row gutter="20">
        <van-col span="6">
          <img :src="$store.state.user.avatar || 'assets/haier.png'" alt="图像" class="avatar">
        </van-col>
        <van-col span="18">
          <p><strong>{{$store.state.user.userName}}</strong></p>
          <p>{{$store.state.user.departments[0].deptName}}</p>
        </van-col>
      </van-row>
    </div>
    <van-panel title="出差管理">
      <van-cell title="出差申请列表" is-link :to="{name: 'applylists'}"/>
      <van-cell title="预算申请列表" is-link :to="{name: 'budgetlists'}"/>
    </van-panel>
  </div>
</template>

<script>
export default {
  name: 'manage',
}
</script>

<style>
.profile {
  padding: 10px 15px;
  border-bottom: 1px solid #ccc;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}
</style>




