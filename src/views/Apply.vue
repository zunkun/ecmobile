<template>
  <div id="apply">
    <ApprovalDetail :approval="approval" />
    <div class="button-area" v-if="approval.approvalId">
      <van-row gutter="20">
        <van-col span="12" v-if="[20, 60,70].indexOf(approval.status) === -1">
          <van-button block type="danger" plain @click="cancelApproval" >取消</van-button>
        </van-col>
        <van-col span="12" v-if="[10, 30].indexOf(approval.status) > -1">
          <van-button block type="primary" plain>编辑</van-button>
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
      this.$http.get(`/api/approvals/${this.approvalId}`).then(res => {
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
        title: '取消申请单',
        message:'您确定要取消该出差申请？',
        showCancelButton: true,
      }).then(() => {
        return this.$http.post(`/api/approvals/${this.approval.approvalId}/cancel`).then((res) =>{
          let resData = res.data;
          if(resData.errcode === 0) {
            this.$toast('取消该申请单成功');
            this.getApproval()
            return;
          }
          this.$toast('取消该申请单失败');
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

