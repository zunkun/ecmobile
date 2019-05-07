<template>
  <div id="approval" v-if="approval.id">
    <ApprovalDetail :approval="approval" />
    <div class="button-area">
      <van-row gutter="20">
        <van-col span="12" v-if="approval.status === 20">
          <van-button block type="danger" plain @click="rejectApproval" >拒绝</van-button>
        </van-col>
        <van-col span="12" v-if="approval.status === 20">
          <van-button block type="primary" plain @click="passApproval">通过</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import ApprovalDetail from '../../components/Approval/ApprovalDetail';

export default {
  name: 'apply',
  components: {ApprovalDetail},
  data() {
    return {
      id: '',
      approval: {}
    }
  },
  methods: {
    getApproval() {
      this.$http.get(`/ec/api/approvals/${this.id}/detail`).then(res => {
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

    rejectApproval() {
      this.$dialog.confirm({
        title: '拒绝申请单',
        message:'您确定要拒绝该出差申请？',
        showCancelButton: true,
      }).then(() => {
        return this.$http.post(`/ec/api/approvals/${this.approval.id}/reject`).then((res) =>{
          let resData = res.data;
          if(resData.errcode === 0) {
            this.$toast('拒绝成功');
            this.getApproval()
            return;
          }
          this.$toast.fail('拒绝失败');
        });
      }).catch(() => {
      })
    },

    passApproval() {
      this.$dialog.confirm({
        title: '确认申请单',
        message:'您确定要通过该出差申请？',
        showCancelButton: true,
      }).then(() => {
        return this.$http.post(`/ec/api/approvals/${this.approval.id}/pass`).then((res) =>{
          let resData = res.data;
          if(resData.errcode === 0) {
            this.$toast('通过该申请单成功');
            this.getApproval()
            return;
          }
          this.$toast('通过该申请单失败');
        });
      }).catch(() => {
      })
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.getApproval();
  }
}
</script>

