<template>
  <div id="formbasic">
    <van-panel title="基本信息">
      <van-cell-group>
        <van-cell title="姓名" :value="application.userName" />
        <van-cell title="部门">
          {{application.deptName}}
        </van-cell>
      </van-cell-group>
    </van-panel>
    <van-panel title="申请原因">
      <van-field v-model="application.cause" type="textarea" readonly/>
    </van-panel>
  </div>
</template>

<script>
export default {
  name: 'formbasic',
  props: ['application'],
  data() {
    return { }
  }
}
</script>

