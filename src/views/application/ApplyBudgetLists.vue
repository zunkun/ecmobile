<template>
  <div id="budgets">
    <StaffBasic :applications="applications" :count="count" />
  </div>
</template>

<script>
import StaffBasic from '../../components/Application/StaffBasic.vue'
export default {
  name: 'ApplyBudgetLists',
  components: { StaffBasic },
  data() {
    return {
      page: 1,
      limit: 10,
      count: 0,
      applications: [],
    }
  },
  methods: {
    getApplications() {
      if(this.count && this.applications.length >= this.count) {
        return;
      }
      this.$http.get(`/ec/api/applications/lists/basic?page=${this.page++}&limit=${this.limit}`).then(res => {
        let data = res.data;
        if(data.errcode === 0) {
          let applicationData = data.data;
          this.count = applicationData.count;
          this.applications = this.applications.concat(applicationData.applications);
        }
      }).catch(() =>{
        this.$toast(`获取申请单列表失败`);
      })
    },

    lowEnough() {
      let mainWindow = document.getElementById('budgets');
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

    watchScroll(event, wait=200, mustTime=3000) {
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
            that.getApplications();
          }
        } else {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(function () {
            this.startTime = Date.now();
            if (that.lowEnough()) {
             that.getApplications();
            }
          }, wait)
        }
      }
    },

  },

  created() {
    this.getApplications();
    window.addEventListener('scroll', this.watchScroll(), true)
  }
}
</script>


