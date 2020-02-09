<template>
  <div>
    <TripShow :trip="trip" />    
    <van-collapse v-model="stepName">
      <van-collapse-item :title="setTitle(approval.catalog)" :name="$index" v-for="(approval, $index) in approvals" :key="approval.id">
        <TripStep :steps="approval.steps" :step="approval.step" :catalog="approval.catalog" :activeColor="activeColor"/>
      </van-collapse-item>
    </van-collapse>



    <van-panel class="basic remark" v-if="user.userId === trip.userId">
      <van-row class="commit-btn" v-if="finish">
        <div v-if="trip.changeable">
          <van-col span="12" class="btn-area">
          <van-button type="primary" plain size="large" @click="edit">编 辑</van-button>
          </van-col>
          <van-col span="12"  class="btn-area">
            <van-button type="info" plain size="large" @click="withdrawClick">撤 销</van-button>
          </van-col>
        </div>
      </van-row>
      <van-row class="commit-btn" v-else>
        <van-col span="24"  class="btn-area">
          <van-button type="info" plain size="large" @click="withdrawClick">撤 销</van-button>
        </van-col>
      </van-row>
    </van-panel>
  </div>
</template>

<script>
  import TripShow from '../components/TripShow.vue'
  import TripStep from '../components/TripStep.vue'
  export default {
    data() {
      return {
        trip: {},
        user: {},
        approvals: [],
        statusMap: {
          10: '审批中',
          11: '审批中',
          20: '已通过',
          30: '已拒绝',
          40: '已撤销',
        },
        tripId: '',
        authority: false,
        remark: '',
        steps: [],
        activeColor: '',
        finish: false,
        stepName: [0],
      }
    },
    components: { TripShow, TripStep },
    methods: {
      setTitle(catalog) {
        return catalog === 1 ? '审批流程': '原审批流程'
      },
      parseDateStr(date, type = 1) {
        date = new Date(date);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let monthStr = month >= 10 ? month : `0${month}`;
        let dayStr = day >= 10 ? day : `0${day}`;
        let str = `${year}-${monthStr}-${dayStr}`;
        if (type === 2) {
          let hours = date.getHours();
          hours = hours >= 10 ? hours : `0${hours}`;
          let minutes = date.getMinutes();
          minutes = minutes >= 10 ? minutes : `0${minutes}`;
          let seconds = date.getSeconds();
          seconds = seconds >= 10 ? seconds : `0${seconds}`;
          str = `${str} ${hours}:${minutes}:${seconds}`
        }
        return str;
      },
      getApproval() {
        let that = this;
        this.$http.get(`/ecapi/api/approvals/detail?tripId=${this.tripId}`)
          .then(res => {
            let resData = res.data;
            if (resData.errcode === 0) {
              that.trip = resData.data.trip || {};
              that.approvals = resData.data.approvals || [];

              that.authority = !!resData.data.authority;

              that.finish = [20, 30, 40].indexOf(that.trip.status) > -1;
              that.stepName = [that.approvals.length -1];
              // if(this.approvals.length >=2) {
              // }
            }
          });
      },
      
      withdrawClick() {
        let that = this;
        this.$dialog.confirm({
          message: '您确定要撤销申请吗？',
          beforeClose(action, done) {
            if(action === 'confirm') {
              that.withdraw();
            }
            done()
          }
        })
      },

      withdraw() {
        let that = this;
        this.$http.post(`/ecapi/api/approvals/withdraw`, {tripId: this.tripId})
        .then(() => {
         that.getApproval()
        }).catch(() => {
        })
      },
      edit() {
        this.$router.push({name: 'tripedit', params: {tripId: this.tripId}});
      }
    },

    created() {
      this.tripId = this.$route.params.tripId;
      this.getApproval();
      this.user = JSON.parse(localStorage.getItem('user'))
    }
  }
</script>

<style>
  .detail {
    padding: 0px 6px;
  }

  .btn-area {
    padding: 0px 6px;
  }
</style>