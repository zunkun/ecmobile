<template>
  <div>
    <TripShow :trip="trip" />
    <TripStep :steps="approval.steps" :step="approval.step" v-for="approval in approvals" :key="approval.id" />
    <van-panel class="basic remark" v-if="authority">
      <van-row>审批意见</van-row>
      <van-field v-model="remark" rows="3" autosize type="textarea" placeholder="审批意见" />
      <van-row class="commit-btn">
        <van-col span="12" class="left">
          <van-button type="info" plain size="large" @click="review(30)">拒 绝</van-button>
        </van-col>
        <van-col span="12" class="right">
          <van-button type="primary" plain size="large" @click="review(20)">同 意</van-button>
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
        approvals: [],
        statusMap: {
          10: '审批中',
          11: '审批中',
          20: '已通过',
          30: '已拒绝',
          40: '已撤销',
        },
        colorMap: {
          10: '#38f',
          11: '#38f',
          20: '#07c160',
          30: 'red',
          40: '#ccc'
        },
        tripId: '',
        authority: false,
        remark: '',
        steps: [],
      }
    },
    components: { TripShow, TripStep },
    methods: {
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
        this.$http.get(`/ecapi/api/approvals/detail?tripId=${this.tripId}`)
          .then(res => {
            let resData = res.data;
            if (resData.errcode === 0) {
              this.trip = resData.data.trip || {};
              this.approvals = resData.data.approvals || [];
              this.authority = !!resData.data.authority;
            }
          });
      },

      review(status) {
        let that = this;
        this.$http.post('/ecapi/api/approvals/review', {tripId: this.tripId, status, remark: this.remark})
        .then(() => {
          that.getApproval()
        })
      }
    },

    created() {
      this.tripId = this.$route.params.tripId;
      this.getApproval();
    }
  }
</script>

<style>
  .detail {
    padding: 0px 6px;
  }
</style>