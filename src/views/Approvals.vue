<template>
  <div id="approvals">
    <van-tabs v-model="type" @click="getApprovalLists">
      <van-tab title="待审批">
        <ApprovalBasic :approvals="approvalLists[0].approvals" :count="approvalLists[0].count" />
      </van-tab>
      <van-tab title="已审批" >
        <ApprovalBasic :approvals="approvalLists[1].approvals" :count="approvalLists[1].count" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import ApprovalBasic from '../components/ApprovalBasic'
export default {
  name: 'approvals',
  components: { ApprovalBasic },
  data() {
    return {
      type: 0,
      limit: 10,
      approvalLists: {
        0: {
          page: 1,
          count: 0,
          approvals: [],
        },
        1: {
          page: 1,
          count: 0,
          approvals: []
        }
      },
    }
  },
  methods: {
    getApprovalLists(type = 0) {
      this.type = type;
      if(this.approvalLists[type].approvals.length) {
        return;
      }
      this.getApprovals(type)
    },
    getApprovals(type = 0) {
      if(this.approvalLists[type].count && this.approvalLists[type].approvals.length >= this.approvalLists[type].count) {
        return;
      }
      this.$http.get(`/ec/api/approvals/lists/manage?type=${type}&limit=${this.limit}&page=${this.approvalLists[type].page++}`).then(res =>{
        let resData = res.data;
        if(resData.errcode === 0) {
          let approvalData = resData.data;
          this.approvalLists[type].approvals = this.approvalLists[type].approvals.concat(approvalData.approvals)
          this.approvalLists[type].count = approvalData.count || 0;

          if(type === 0) {
            this.$store.commit('setApprovalCount', this.approvalLists[type].count)
          }
        }
      }).catch(()=>{})
    },

    lowEnough() {
      let mainWindow = document.getElementById('approvals');
      if(!mainWindow) return;
      let pageHeight = Math.max(mainWindow.scrollHeight, document.body.offsetHeight);
      let viewportHeight = window.innerHeight ||
        document.documentElement.clientHeight ||
        mainWindow.clientHeight || 0;
      let scrollHeight = window.pageYOffset ||
        document.documentElement.scrollTop ||
        mainWindow.scrollTop || 0;
      // 通过 真实内容高度 - 视窗高度 - 上面隐藏的高度 < 20，作为加载的触发条件
      return pageHeight - viewportHeight - scrollHeight < 60;
    },

    watchScroll(wait=200, mustTime=3000) {
      let that = this;
      if (!this.startTime) {
        this.startTime = Date.now();
      }
      let currentTime = Date.now();

      return function () {
        if ((currentTime - this.startTime) >= mustTime) {
          this.startTime = currentTime;
          clearTimeout(this.timeout)
          if (that.lowEnough()) {
            that.getApprovals(this.type);
          }
        } else {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(function () {
            this.startTime = Date.now();
            if (that.lowEnough()) {
             that.getApprovals(this.type);
            }
          }, wait)
        }
      }
    },
  },
  created() {
    this.getApprovals(0);
    window.addEventListener('scroll', this.watchScroll(), true)
  }
}
</script>