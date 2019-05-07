<template>
  <div id="nobalance">
    <van-panel title="基本信息">
      <van-cell-group>
        <van-cell title="姓名" :value="application.userName" />
        <van-cell title="部门">
          {{application.deptName}}
        </van-cell>
        <van-cell title="预算部门" v-if="application.group">
          {{application.group.name}}
        </van-cell>
        <van-cell title="预算余额">
            {{application.balance}}
        </van-cell>
      </van-cell-group>
      <van-field v-model="application.amount" label="申请金额(元)" placeholder="请输入身亲金额" type="number" required />
    </van-panel>
    <van-panel title="申请原因">
      <van-field v-model="application.cause" type="textarea" placeholder="申请原因（必填，少于100字）" />
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
      application: { group: {}},
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
        balance: 0,
        amount: 1,
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
      this.getBalance(this.application.deptId);
    },
    getBalance(deptId) {
      this.$http.get(`/ec/api/fees/count?deptId=${deptId || this.application.deptId}`).then((res) =>{
        let feeRes = res.data;
        if(feeRes.errcode !== 0) {
          this.$toast(`获取部门费用预算失败`)
          return;
        }
        this.application.balance = feeRes.data.balance || 0;
      }).catch();
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
      if(!this.application.amount || !this.application.cause) {
        this.$toast('请正确填写申请单信息')
        return;
      }
      this.$http.put(`/api/applications/${this.application.id}`, this.application).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('修改成功')
          return;
        }
        this.$toast.fail('修改失败');
      })
    },
    createApplication() {
      if(!this.application.amount || !this.application.cause) {
        this.$toast('请正确填写申请单信息')
        return;
      }
      this.$http.post('/api/applications', this.application).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('申请成功')
          this.$router.push({name: 'applybudgetdetil', query: {id: resData.data.id}})
          return;
        }
        this.$toast.fail('申请失败');
      })
    }
  },
  created() {
    if(this.$route.query.id) {
      this.getApplication();
    } else {
      this.initApplication();
      this.setDeptInfo()
    }
  }
}
</script>

<style>

</style>

