<template>
  <div id="me">
    <van-panel 
      :title="approval.trip.title" 
      :desc="approval.trip.cause" 
      :status="approvalStatus[approval.status]" 
      class="approval-panel" 
      v-for="(approval, $index) in approvals" :key="'approval-'+$index">
      <div class="approval-content">
        <p>申请时间: {{parseDate(approval.createTime)}}</p>
      </div>
      <div slot="footer" class="approval-footer">
        <van-button size="small" type="warning" plain class="footer-btn">取消</van-button>
        <van-button size="small" type="primary" plain class="footer-btn">详细</van-button>
      </div>
    </van-panel>
  </div>
</template>

<script>
export default {
  name: 'Me',
  data() {
    return {
      page: 1,
      limit: 10,
      count: 0,
      approvals: [],

      approvalStatus: {
        10: '申请中',
        20: '已取消',
        30: '申请费用',
        40: '审核中',
        50: '拒绝',
        60: '通过',
        70: '进入商旅'
      }
    }
  },
  methods: {
    parseDate(date) {
      date = new Date(date)
      return `${date.getFullYear()}年${date.getMonth() +1}月${date.getDate()}日`
    },
    getApprovals() {
      if(this.count && this.approvals.length >= this.count) {
        return;
      }
      this.$http.get(`/api/approvals/basic?page=${this.page}&limit=${this.limit}`).then(res => {
        let data = res.data;
        if(data.errcode === 0) {
          let approvalData = data.data;
          this.count = approvalData.count;
          this.approvals = this.approvals.concat(approvalData.approvals);
        }
      }).catch(() =>{
        this.$toast(`获取申请单列表失败`);
      })
    }

  },

  created() {
    this.getApprovals()
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
</style>


