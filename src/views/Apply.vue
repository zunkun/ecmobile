<template>
  <div id="apply">
    <ApprovalDetail :approval="approval" />
    <div class="button-area" v-if="approval.approvalId">
      <van-row gutter="20">
        <van-col span="12" v-if="[10, 20].indexOf(approval.status) > -1">
          <van-button block type="danger" plain @click="cancelApproval" >撤 销</van-button>
        </van-col>
        <van-col span="12" v-if="[10, 20].indexOf(approval.status) > -1">
          <van-button block type="primary" plain :to="{name: 'home', query: {id: approval.approvalId}}">修 改</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import ApprovalDetail from '../components/ApprovalDetail';

export default {
  name: 'apply',
  components: {ApprovalDetail},
  data() {
    return {
      approvalId: '',
      approval: {}
    }
  },
  methods: {
    getApproval() {
      this.$http.get(`/ec/api/approvals/${this.approvalId}`).then(res => {
        let data = res.data;
        if (data.errcode !== 0) {
          this.$toast(data.errmsg)
          return;
        }
          this.approval = data.data;
      }).catch(() =>{
        this.$toast('获取申请单失败')
      })
    },

    cancelApproval() {
      this.$dialog.confirm({
        title: '撤销申请单',
        message:'您确定要撤销该出差申请？',
        showCancelButton: true,
      }).then(() => {
        return this.$http.post(`/ec/api/approvals/${this.approval.approvalId}/cancel`).then((res) =>{
          let resData = res.data;
          if(resData.errcode === 0) {
            this.$toast('撤销该申请单成功');
            this.getApproval()
            return;
          }
          this.$toast('撤销该申请单失败');
        });
      }).catch(() => {
      })
    }
  },
  created() {
    this.approvalId = this.$route.query.id;
    this.getApproval();
  }
}
</script>

