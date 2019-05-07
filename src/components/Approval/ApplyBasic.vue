<template>
  <div id="applybasic">
    <van-panel
      :title="approval.trip.title" 
      :desc="approval.trip.cause" 
      :status="applyStatus[approval.status]" 
      class="approval-panel" 
      v-for="(approval, $index) in approvals" :key="'approval-'+$index">
      <div class="approval-content">
        <p>申请时间: {{parseDate(approval.createTime)}}</p>
      </div>
      <div slot="footer" class="approval-footer">
        <van-button size="small" type="primary" plain class="footer-btn" :to="{name: 'apply', query: {id: approval.id}}">详细</van-button>
      </div>
    </van-panel>
    <van-panel v-if="!count" title="出差审批单" class="approval-panel">
      <div class="approval-content">
        <p>当前没有出差审批单</p>
      </div>
      <div slot="footer" class="approval-footer">
        <van-button size="small" type="primary" plain class="footer-btn" :to="{name: 'home'}">出差申请</van-button>
      </div>
    </van-panel>
  </div>
</template>

<script>
export default {
  name: 'ApprovalBasic',
  props: ['approvals', 'count'],
  data() {
    return {
      applyStatus: {
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
.approval-footer {
  text-align:right;
}

.footer-btn {
  margin-left:10px;
}

.approval-content {
  padding-left: 15px;
}

.approval-panel {
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.a-z {
  padding: 10px 15px;
  font-size: 20px;
}
</style>

