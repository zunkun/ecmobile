<template>
  <div id="approvals">
    <ApplyBasic :approvals="approvals" :count="count" />
  </div>
</template>

<script>
import ApplyBasic from '../../components/Approval/ApplyBasic'
export default {
  name: 'Me',
  components: { ApplyBasic },
  data() {
    return {
      page: 1,
      limit: 10,
      count: 0,
      approvals: [],
    }
  },
  methods: {
    getApprovals() {
      if(this.count && this.approvals.length >= this.count) {
        return;
      }
      this.$http.get(`/ec/api/approvals/lists/basic?page=${this.page++}&limit=${this.limit}`).then(res => {
        let data = res.data;
        if(data.errcode === 0) {
          let approvalData = data.data;
          this.count = approvalData.count;
          this.approvals = this.approvals.concat(approvalData.approvals);
        }
      }).catch(() =>{
        this.$toast(`获取申请单列表失败`);
      })
    },

    lowEnough() {
      let mainWindow = document.getElementById('me');
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

    watchApplyScroll(event, wait=200, mustTime=3000) {
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
            that.getApprovals();
          }
        } else {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(function () {
            this.startTime = Date.now();
            if (that.lowEnough()) {
             that.getApprovals();
            }
          }, wait)
        }
      }
    },

  },

  created() {
    this.getApprovals();
    window.addEventListener('scroll', this.watchApplyScroll(), true)
  }
}
</script>