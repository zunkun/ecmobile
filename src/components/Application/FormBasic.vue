<template>
  <div id="formbasic">
    <van-panel title="基本信息">
      <van-cell-group>
        <van-cell title="姓名" :value="application.userName" />
        <van-cell title="部门">
          {{application.deptName}}
        </van-cell>
        <van-cell title="预算部门" v-if="application.group">
          {{application.group.name}}
        </van-cell>
        <van-cell title="预算余额">
            {{application.balance}}
        </van-cell>
        <van-cell title="申请金额(元)">
            {{application.amount}}
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

