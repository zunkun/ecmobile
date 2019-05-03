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
        <van-button size="small" type="primary" plain class="footer-btn" :to="{name: 'apply', query: {id: approval.approvalId}}">详细</van-button>
      </div>
    </van-panel>
    <van-panel v-if="!count" title="我的出差审批单">
      <div class="a-z">
        当前没有出差审批单
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
        20: '审核中',
        30: '审批通过',
        40: '进入商旅',
        50: '拒绝',
        60: '取消',
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
      this.$http.get(`/api/approvals/lists/basic?page=${this.page++}&limit=${this.limit}`).then(res => {
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

    watchScroll(wait, mustTime) {
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
    window.addEventListener('scroll', this.watchScroll(200, 3000), true)
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


