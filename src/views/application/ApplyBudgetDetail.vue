<template>
  <div id="budgetdetail">
    <FormBasic :application="application" />
    <div class="pz" v-if="process.applications">
      <div v-for="(item, $index) in process.applications" :key="'application-' + $index">
        <div v-if="item.approvalTime || item.approvalUser" class="note">
          <p><strong>审批人:</strong> {{item.approvalUser.userName}}</p>
          <p v-if="item.note"><strong>意见:</strong> {{item.note}}</p>
          <p v-if="item.approvalTime"><strong>时间:</strong> {{parseTime(item.approvalTime)}}</p>
          <p><strong>结果:</strong> {{applicationStatusMap[item.status]}}</p>
        </div>
      </div>
    </div>
    <div class="pz">
      <p><strong>当前状态:</strong> <span class="statusz">  {{statusMap[process.status]}}</span></p>
    </div>

    <div class="button-area" v-if="[10,20].indexOf(process.status) > -1">
      <van-row gutter="20">
        <van-col span="12">
          <van-button block type="danger" plain @click="cancelApplication" >撤 销</van-button>
        </van-col>
        <van-col span="12">
          <van-button block type="primary" plain :to="{name: 'applybudget', query: {id: application.id}}">修 改</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import FormBasic from '../../components/Application/FormBasic.vue';

export default {
  name: 'budgetdetail',
  components: { FormBasic },
  data() {
    return {
      applicationStatusMap: {
        10: '审批中',
        20: '同意',
        30: '拒绝',
      },
      statusMap: {
        10: '审批中',
        11: '员工取消',
        20: '审批中',
        21: '主管拒绝',
        30: '财务调整中',
        31: '财务撤回',
        40: '调出部门审批中',
        50: '调入部门审批中',
        60: '审批通过',
        61: '审批通过',
        62: '审批通过'
      },
      active: 0,
      application: {
        group: {}
      },
      process: {},
      processLists: [],
    }
  },
  methods: {
    parseTime(date) {
      date = new Date(date)
      return `${date.getFullYear()}年${date.getMonth() +1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`
    },
    getApplication() {
      if(!this.$route.query.id) {
        return;
      }
      this.$http.get(`/ec/api/applications/${this.$route.query.id}`).then(res => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.application = resData.data;
          return;
        }
        this.$toast.fail('获取费用申请单失败');
      })
    },
    initProcess() {
      this.processLists.push({
        title: '申请预算',
        userNames: []
      })
      for(let [index, item] of this.process.applications.entries()) {
        let processItem = {
          title: `第${index+1}级主管审批`,
          userNames: []
        };
        if(item.deptId === this.process.deptId) {
          processItem.title = '直接主管审批'
        }
        for(let user of item.users) {
          processItem.userNames.push(user.userName)
        }
        this.processLists.push(processItem)
      }
      let financeItem = {
        title: '财务调整',
        userNames: []
      }
      for(let item of this.process.finances.users) {
        financeItem.userNames.push(item.userName)
      }

      this.processLists.push(financeItem)

      this.processLists.push({
        title: '预算调出部门领导审批',
        userNames: []
      })

      this.processLists.push({
        title: '预算调入部门领导审批',
        userNames: []
      })
      this.processLists.push({
        title: '预算调整',
        userNames: []
      })
    },
    getProcess() {
      if(!this.$route.query.id) {
        return;
      }
      this.$http.get(`/ec/api/processes/application/${this.$route.query.id}`).then(res => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.process = resData.data;
          this.initProcess()
          return;
        }
      })
    },

    cancelApplication() {
      this.$http.post(`/ec/api/processes/application/${this.application.id}/cancel`).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('操作成功');
          this.getProcess()
          return;
        }
        this.$toast.fail('操作失败');
      })
    }
  },
  created() {
    this.getApplication()
    this.getProcess()
  }
}
</script>

<style>
.pz {
  padding: 0px 15px;
}
</style>

