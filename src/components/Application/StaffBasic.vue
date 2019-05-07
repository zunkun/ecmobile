<template>
  <div id="staffbasic">
    <van-panel
      title="预算申请" 
      :desc="application.cause" 
      :status="applicationStatus[application.status]" 
      class="application-panel" 
      v-for="(application, $index) in applications" :key="'application-'+$index">
      <div class="application-content">
        <p>申请费用: {{application.balance ||0}}元</p>
        <p>申请时间: {{parseDate(application.createTime)}}</p>
      </div>
      <div slot="footer" class="application-footer">
        <van-button size="small" type="primary" plain class="footer-btn" :to="{name: 'applybudgetdetil', query: {id: application.id}}">详细</van-button>
      </div>
    </van-panel>
    <van-panel v-if="!count" title="预算申请单" class="application-panel">
      <div class="application-content">
        <p>当前没有预算申请单</p>
      </div>
    </van-panel>
  </div>
</template>

<script>
export default {
  name: 'staffbasic',
  props: ['applications', 'count'],
  data() {
    return {
      applicationStatus: {
        10: '待审批',
        20: '审批中',
        30: '审批通过',
        40: '进入商旅',
        50: '已拒绝',
        60: '员工取消',
      }
    }
  },
  methods: {
    parseDate(date) {
      date = new Date(date)
      return `${date.getFullYear()}年${date.getMonth() +1}月${date.getDate()}日`
    },
  }
}
</script>

<style>
.application-footer {
  text-align:right;
}

.footer-btn {
  margin-left:10px;
}

.application-content {
  padding-left: 15px;
}

.application-panel {
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.a-z {
  padding: 10px 15px;
  font-size: 20px;
}
</style>
