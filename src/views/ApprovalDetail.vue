<template>
  <div>
    <TripShow :trip="trip" :approval="approval" />
    <TripStep :steps="steps" :step="approval.step"/>

    <van-panel class="basic remark" v-if="authority">
      <van-row>审批意见</van-row>
      <van-field v-model="remark" rows="3" autosize type="textarea" placeholder="审批意见" />
      <van-row class="commit-btn">
        <van-col span="12" class="left">
          <van-button type="info" plain size="large" @click="review(3)">拒 绝</van-button>
        </van-col>
        <van-col span="12" class="right">
          <van-button type="primary" plain size="large" @click="review(2)">同 意</van-button>
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
        approval: {},
        statusMap: {
          1: '审批中',
          2: '已通过',
          3: '已拒绝',
          4: '已撤回',
        },
        colorMap: {
          1: '#38f',
          2: '#07c160',
          3: 'red',
          4: '#ccc'
        },
        tripId: '',
        authority: false,
        remark: '',
        steps: [],
      }
    },
    components: { TripShow, TripStep },
    methods: {
      getSteps() {
        let approval = this.approval || [];
        this.steps = [{
          title: '发起申请',
          userName: this.trip.userName,
          time: this.trip.createdAt,
          statusNum: 1,
        }]
        let togo = true;
        if (approval.approver1Id) {
          let step = {
            title: '审批人',
            userName: approval.approver1Name,
            remark: approval.approver1Remark,
            time: approval.approver1Time,
          }
          if (approval.approver1Status) {
            step.statusNum = approval.approver1Status;
            step.status = this.statusMap[approval.approver1Status];
          } else {
            step.status = '审批中';
            step.statusNum = 1;
          }
          if (approval.approver1Status !== 2) {
            togo = false;
          }
          this.steps.push(step);
        }
        if (togo && approval.approver2Id) {
          let step = {
            title: '审批人',
            userName: approval.approver2Name,
            remark: approval.approver2Remark,
            time: approval.approver2Time,
          }
          if (approval.approver2Status) {
            step.statusNum = approval.approver2Status;
            step.status = this.statusMap[approval.approver2Status];
          } else {
            step.status = '审批中';
            step.statusNum = 1;
          }
          if (approval.approver2Status !== 2) {
            togo = false;
          }
          this.steps.push(step);
        }
        if (togo && approval.approver3Id) {
          let step = {
            title: '审批人',
            userName: approval.approver3Name,
            remark: approval.approver3Remark,
            time: approval.approver3Time,
          }
          if (approval.approver3Status) {
            step.statusNum = approval.approver3Status;
            step.status = this.statusMap[approval.approver3Status];
          } else {
            step.status = '审批中';
            step.statusNum = 1;
          }
          if (approval.approver3Status !== 2) {
            togo = false;
          }
          this.steps.push(step);
        }
        if (this.steps.length >= 1) {
          let step = this.steps[this.steps.length - 1];
          this.activeColor = this.colorMap[step.statusNum]
          console.log(step.statusNum, this.activeColor)
        }
      },
      parseDateStr(date, type = 1) {
        date = new Date(date);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDay();
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
        this.$http.get(`/ec/api/approvals/detail?tripId=${this.tripId}`)
          .then(res => {
            let resData = res.data;
            if (resData.errcode === 0) {
              this.trip = resData.data.trip || {};
              this.approval = resData.data.approval || {};
              this.authority = !!resData.data.authority;

              this.getSteps();
            }
          });
      },
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