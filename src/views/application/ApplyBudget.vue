<template>
  <div id="nobalance">
    <van-panel title="基本信息">
      <van-cell-group>
        <van-cell title="姓名" :value="application.userName" />
        <van-cell title="部门">
          {{application.deptName}}
        </van-cell>
        <van-cell title="预算科目" v-if="application.type">
          {{feeMap[application.type]}}
        </van-cell>
      </van-cell-group>
    </van-panel>
    <van-panel title="申请原因">
      <van-field v-model="application.cause" type="textarea" placeholder="申请原因（必填，少于100字）" />
    </van-panel>
    <van-panel title="申请流程">
      <van-steps direction="vertical" :active="active">
        <van-step v-for="(processItem, $index) in processLists" :key="'process-' + $index">
          <h3>{{processItem.title}}</h3>
          <p>{{processItem.userNames.join('、')}}</p>
        </van-step>
      </van-steps>
    </van-panel>
    <div class="button-area">
      <van-button block type="primary" plain @click="saveApplication" v-if="!application.id">申请预算</van-button>
      <van-button block type="warning" plain @click="saveApplication" v-else>修改预算申请单 </van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'nobalance',
  data() {
    return {
      active: 0,
      feeMap: {
        trip: '差旅费',
        benefits: '福利费',
        others: '其他',
      },
      application: { group: {}, type: '差旅'},
      process: {
        group: {},
        applications: [],
        approvals: [],
        finances: [],
      },
      processLists: [],
    }
  },
  methods: {
    initApplication() {
      let user = this.$store.state.user;
      this.application = {
        userId: user.userId,
        userName: user.userName,
        deptId: '',
        deptName: '',
        cause: '',
        group: {}
      };
    },
    setDeptInfo() {
      let departments = this.$store.state.user.departments || []
      this.application.deptId = this.$route.query.deptId || departments[0].deptId;

      this.$http.get(`/ec/api/depts/${this.application.deptId}`).then(res => {
        let resData = res.data;
        if(resData.errcode === 0) {
          let dept = resData.data;
          this.application.deptName = dept.deptName;
          this.application.group = dept.group || {}
        }
      }).catch(() => {})
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
    saveApplication() {
      if(this.application.id) {
        this.updateApplication();
        return;
      }
      this.createApplication();
    },
    updateApplication() {
      if(!this.application.cause) {
        this.$toast('请正确填写申请单信息')
        return;
      }
      this.$http.put(`/ec/api/applications/${this.application.id}`, this.application).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('修改成功')
          return;
        }
        this.$toast.fail('修改失败');
      })
    },
    createApplication() {
      if(!this.application.cause) {
        this.$toast('请正确填写申请单信息')
        return;
      }
      this.$http.post('/ec/api/applications', this.application).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('申请成功')
          this.$router.push({name: 'applybudgetdetil', query: {id: resData.data.id}})
          return;
        }
        this.$toast.fail('申请失败');
      })
    },
    initStaffProcess() {
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
      for(let item of this.process.finances) {
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
    getStaffProcess(deptId) {
      this.$http.get(`/ec/api/processes/personal/${deptId || this.application.deptId}`).then((res) =>{
        let processRes = res.data;
        if(processRes.errcode !== 0) {
          this.$toast(`获取申请流程失败`)
          return;
        }
        this.process = processRes.data || {};
        
        this.initStaffProcess();
      }).catch();
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
  },
  created() {
    if(this.$route.query.id) {
      this.getApplication();
      this.getProcess()
    } else {
      this.initApplication();
      this.setDeptInfo();
      this.getStaffProcess()
      this.application.type = this.$route.query.type || 'trip'
    }
  }
}
</script>

<style>

</style>

