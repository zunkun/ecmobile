<template>
  <div id="budgetdetail">
    <FormBasic :application="application" />
    <van-panel title="申请流程">
      <van-steps direction="vertical" :active="active">
        <van-step v-for="(processItem, $index) in processLists" :key="'process-' + $index">
          <h3>{{processItem.title}}</h3>
          <p>{{processItem.userNames.join('、')}}</p>
        </van-step>
      </van-steps>
    </van-panel>
    <div class="button-area" v-if="application.id">
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
      active: 0,
      application: {
        group: {}
      },
      process: {},
      processLists: [],
    }
  },
  methods: {
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
      
    }
  },
  created() {
    this.getApplication()
    this.getProcess()
  }
}
</script>

<style>

</style>

