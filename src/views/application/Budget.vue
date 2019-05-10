<template>
  <div id="budget">
    <FormBasic :application="application" />

    <!-- 领导审核后结果，审核领导，财务，跳入调出部门领导可见 -->
    <div class="pz">
      <div v-for="(item, $index) in process.applications" :key="'application-' + $index">
        <div v-if="item.approvalTime || item.approvalUser" class="note">
          <p><strong>审批人:</strong> {{item.approvalUser.userName}}</p>
          <p v-if="item.note"><strong>意见:</strong> {{item.note}}</p>
          <p v-if="item.approvalTime"><strong>时间:</strong> {{parseTime(item.approvalTime)}}</p>
          <p><strong>结果:</strong> {{applicationStatusMap[item.status]}}</p>
        </div>
      </div>
    </div>
    <!-- 领导审核后结果，审核领导，财务，调入调出部门领导可见 -->

    <!-- 财务调整后结果，财务，调入调出领导可见 ,财务调整时不可见-->
    <div v-if="process.from.length && ['finance', 'from', 'to'].indexOf(this.type) > -1 && process.status !== 30 ">
      <div class="pz"><h4>财务调整</h4></div>
      <van-panel v-for="(item, $index) in process.from" :key="'from-' + $index" :title="'调出部门(' + ($index+1) + ')'">
        <van-cell title="部门">
          {{item.name}}
        </van-cell>
        <van-cell title="金额(元)">
          {{item.amount}}
        </van-cell>
      </van-panel>
      <van-panel title="调入部门">
        <van-cell title="部门" v-if="application.group"> {{application.group.name}}</van-cell>
        <van-cell title="金额(元)" label="结果自动计算" ref="processvalue">{{total}}</van-cell>
      </van-panel>
    </div>
    <!-- 财务调整后结果，财务，调入调出领导可见 -->

    <!-- 调出领导审核后结果，调出领导，调入领导可见 -->
    <div v-if="process.from.length && ['from', 'to'].indexOf(this.type) > -1 && [50, 60, 61, 62].indexOf(process.status) > -1 ">
      <div class="pz">
        <h4>调出部门领导审批结果</h4>
        <div v-for="(item, $index) in process.from" :key="'frominfo-' + $index">
          <div v-if="item.approvalTime || item.approvalUser" class="note">
            <p><strong>审批人:</strong> {{item.approvalUser.userName}}</p>
            <p v-if="item.note"><strong>意见:</strong> {{item.note}}</p>
            <p v-if="item.approvalTime"><strong>时间:</strong> {{parseTime(item.approvalTime)}}</p>
            <p><strong>结果:</strong> {{applicationStatusMap[item.status]}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 调出领导审核后结果，调出领导，调入领导可见 -->
    <!-- 调入领导审核后结果，调出领导，调入领导可见 -->

    <div v-if="process.to.length && this.type === 'to' && [60, 61, 62].indexOf(process.status) > -1 ">
      <div class="pz">
        <h4>调出部门领导审批结果</h4>
        <div v-for="(item, $index) in process.to" :key="'toinfo-' + $index">
          <div v-if="item.approvalTime" class="note">
            <p><strong>审批人:</strong> {{item.userName}}</p>
            <p v-if="item.note"><strong>意见:</strong> {{item.note}}</p>
            <p v-if="item.approvalTime"><strong>时间:</strong> {{parseTime(item.approvalTime)}}</p>
            <p><strong>结果:</strong> {{applicationStatusMap[item.status]}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 调入领导审核后结果，调出领导，调入领导可见 -->


    <!-- 当前状态，所有人可见 -->
    <div class="pz2">
      <p><strong>当前状态:</strong> <span class="statusz">  {{statusMap[process.status]}}</span></p>
    </div>
    <!-- 当前状态，所有人可见 -->


    <!-- 部门领导操作，部门领导可见-->
    <div v-if="type==='application' && [10,20].indexOf(process.status) > -1 && authority.application">
      <van-panel title="审批意见">
        <van-field v-model="note" type="textarea" placeholder="审批意见（选填）" />
      </van-panel>
      <div class="button-area">
        <van-row gutter="20">
          <van-col span="12">
            <van-button block type="danger" plain @click="reject">驳 回</van-button>
          </van-col>
          <van-col span="12">
            <van-button block type="primary" plain @click="agree">同 意</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- 部门领导操作，部门领导可见-->

    <!-- 财务操作，财务调整时可见 -->
    <div v-if="type==='finance' && process.status === 30">
      <van-panel v-for="(item, $index) in process.from" :key="'from-' + $index">
        <div slot="header" class="panel-head">
          <van-row>
            <van-col span="22" class="title">
              {{'调出部门(' + ($index+1) + ')'}}
            </van-col>
            <van-col span="2" class="handle">
              <van-icon name="delete" color="red" size="20px" @click="deleteFrom($index)"/>
            </van-col>
          </van-row>
        </div>
        <van-cell title="部门" is-link required @click="showPickDept($index)">
          {{item.name}}
        </van-cell>
        <van-cell title="费用类型" is-link required @click="showPickFeeType($index)">
          {{typeMap2[item.type]}}
        </van-cell>
        <van-field v-model="item.amount" type="number" label="金额(元)" placeholder="请输入金额" required @blur="computeAmount"/>
      </van-panel>
      <div class="button-area">
        <van-button block type="warning" plain @click="addFrom"><span class="icon-btn">+</span> 增加调出项</van-button>
      </div>
      <van-panel title="调入部门">
        <van-cell title="部门" v-if="application.group"> {{application.group.name}}</van-cell>
        <van-cell title="费用类型" >
          差旅费
        </van-cell>
        <van-cell title="金额(元)" label="结果自动计算" ref="processvalue">{{total}}</van-cell>
      </van-panel>
      <div class="button-area">
        <van-button block type="primary" plain @click="modifyFinance">调 整</van-button>
      </div>
    </div>
    <!-- 财务操作，财务调整时可见 -->
    <!-- 财务操作，调入调出操作中，财务撤回 -->
    <div v-if="type==='finance' && [40,50].indexOf(process.status) > -1">
      <div class="button-area">
        <van-button block type="warning" plain @click="withdraw">撤 回</van-button>
      </div>
    </div>
    <!-- 调出领导操作，调出领导可见 -->
    <div v-if="type==='from' && process.status===40 && authority.from">
      <van-panel title="审批意见">
        <van-field v-model="note" type="textarea" placeholder="审批意见（选填）" />
      </van-panel>
      <div class="button-area">
        <van-row gutter="20">
          <van-col span="12">
            <van-button block type="danger" plain @click="fromback" >驳 回</van-button>
          </van-col>
          <van-col span="12">
            <van-button block type="primary" plain @click="frompass">同 意</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- 调出领导操作，调出领导可见 -->

    <!-- 调入领导操作，调入领导可见 -->
    <div v-if="type==='to' && process.status===50">
      <van-panel title="审批意见">
        <van-field v-model="note" type="textarea" placeholder="审批意见（选填）" />
      </van-panel>
      <div class="button-area">
        <van-row gutter="20">
          <van-col span="12">
            <van-button block type="danger" plain @click="toback" >驳 回</van-button>
          </van-col>
          <van-col span="12">
            <van-button block type="primary" plain @click="topass">同 意</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
       
    <!-- 调入领导操作，调入领导可见 -->

    <van-popup v-model="deptSelectShow" position="bottom">
      <van-picker :columns="groupcolumns" :show-toolbar="true" @cancel="deptSelectShow=false" @confirm="selectDept" />
    </van-popup>

    <van-popup v-model="feeTypeShow" position="bottom">
      <van-picker :columns="feeTypeArray" :show-toolbar="true" @cancel="feeTypeShow=false" @confirm="selectFeeType" />
    </van-popup>
  </div>
</template>

<script>
import FormBasic from '../../components/Application/FormBasic.vue';

export default {
  name: 'budget',
  components: { FormBasic },
  data() {
    return {
      active: 0,
      type: 'applications',
      application: {group: {}},
      process: {group: {}, from: [], to: [], count: 0},
      processLists: [],
      note: '',
      applicationStatusMap: {
        10: '审批中',
        20: '同意',
        30: '拒绝',
      },
      feeTypeShow: false,
      typeMap: {
        '差旅费': 'trip',
        '福利费': 'benefits',
        '其他': 'others',
      },
      typeMap2:{
        trip: '差旅费',
        benefits: '福利费',
        others: '其他',
      },
      feeTypeArray: ['差旅费', '福利费', '其他'],
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
      groupLists: [],
      groupcolumns: [],
      total: 0,
      fromIndex: 0,
      deptSelectShow: false,
      authority: {
        application: false,
        from: false
      }
    }
  },
  methods: {
    parseTime(date) {
      date = new Date(date)
      return `${date.getFullYear()}年${date.getMonth() +1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`
    },
    setType() {

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

      if(!this.process.from.length) {
        this.process.from = this.process.from.concat({
          code: '',
          name: '',
          amount: 0
        });
        this.process.count = 0;
      }
      this.total = this.process.count;
    },
    computeAuth() {
      // 鉴权
      if(this.type === 'application') {
        this.authority.application = false;
        if(this.process.status === 20) {
          for(let item of this.process.applications) {
            if(item.approvalTime) {
              continue;
            }
            let index = item.users.findIndex(userInfo => {
              return userInfo.userId === this.process.userId;
            })
            this.authority.application = index > -1;
          }
        }

      }
      
      if(this.type === 'from') {
        this.authority.from = false;
        if(this.process.status === 40) {
          for(let item of this.process.from) {
            if(item.approvalTime) {
              continue;
            }
            let index = item.users.findIndex(userInfo => {
              return userInfo.userId === this.process.userId;
            })
            this.authority.from = index > -1;
          }
        }
      }
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
          this.computeAuth()
          return;
        }
      })
    },
    getGroupLists() {
      this.$http.get(`/ec/api/depts/grouplists`).then(res => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.groupLists = resData.data || [];
          for(let group of this.groupLists) {
            this.groupcolumns.push(group.name)
          }
          return;
        }
      })
    },
    reject() {
      this.$http.post(`/ec/api/processes/application/${this.application.id}/reject`, {note: this.note}).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('拒绝成功');
          this.getProcess()
          return;
        }
        this.$toast.fail('拒绝失败');
      })
    },
    agree() {
      this.$http.post(`/ec/api/processes/application/${this.application.id}/agree`, {note: this.note}).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('操作成功');
          this.getProcess()
          return;
        }
        this.$toast.fail('操作失败');
      })
    },
    showPickFeeType(index) {
      this.fromIndex = index || 0;
      this.feeTypeShow = true;
    },
    selectFeeType(type) {
      this.process.from[this.fromIndex].type = this.typeMap[type]
      this.feeTypeShow = false;
    },
    addFrom() {
      if(!this.process.from) {
        this.process.from = [];
      }
      this.process.from= this.process.from.concat({
        code: '',
        name: '',
        amount: 0
      })
    },
    deleteFrom(index) {
      this.$delete(this.process.from, index);
      this.computeAmount();
    },
    computeAmount() {
      let count = 0;
      for(let item of this.process.from) {
        count += Number(item.amount);
      }
      this.$set(this.process, 'count', count);
      this.total = count;
    },
    showPickDept(index) {
      this.fromIndex = index || 0;
      this.deptSelectShow = true;
    },
    selectDept(name, index) {
      if(this.name === this.process.group.name) {
        this.$toast('转入转出部门不能相同')
        return;
      }
      let group = this.groupLists[index];
      this.process.from[this.fromIndex].name = group.name;
      this.process.from[this.fromIndex].code = group.code;

      this.deptSelectShow = false;
    },
    validateFinance() {
      let from = this.process.from ||[]
      let flag = true;
      if(!from.length ||!this.process.count) {
        return false;
      }
      for(let item of from ) {
        if(!item.amount || !item.code || !item.type) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    modifyFinance() {
      let valid = this.validateFinance();
      if(!valid) {
        this.$toast('请正确填入调出项目')
        return;
      }
      this.$http.post(`/ec/api/processes/application/${this.application.id}/financesave`, {from: this.process.from}).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('操作成功');
          this.getProcess()
          return;
        }
        this.$toast.fail('操作失败');
      });
    },
    withdraw() {
      this.$http.post(`/ec/api/processes/application/${this.application.id}/withdraw`).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('操作成功');
          this.getProcess()
          return;
        }
        this.$toast.fail('操作失败');
      });
    },
    fromback() {
      this.$http.post(`/ec/api/processes/application/${this.application.id}/fromback`, {note: this.note}).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('操作成功');
          this.getProcess()
          return;
        }
        this.$toast.fail('操作失败');
      });
    },
    frompass() {
      this.$http.post(`/ec/api/processes/application/${this.application.id}/frompass`, {note: this.note}).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('操作成功');
          this.getProcess()
          return;
        }
        this.$toast.fail('操作失败');
      });
    },
    toback() {
      this.$http.post(`/ec/api/processes/application/${this.application.id}/toback`, {note: this.note}).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('操作成功');
          this.getProcess()
          return;
        }
        this.$toast.fail('操作失败');
      });
    },
    topass() {
      this.$http.post(`/ec/api/processes/application/${this.application.id}/topass`, {note: this.note}).then((res) => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.$toast.success('操作成功');
          this.getProcess()
          return;
        }
        this.$toast.fail('操作失败');
      });
    }
  },
  created() {
    this.type = this.$route.query.type ||'application'
    this.getApplication()
    this.getProcess();
    if(this.type === 'finance') {
      this.getGroupLists()
    }
  },
}
</script>

<style>
  .pz {
    padding: 4px 15px;
  }
  .pz2 {
    padding: 0px 15px;
  }
  .note {
    border-top: 1px solid #ebedf0;
    border-bottom: 1px solid #ebedf0;
  }

  .statusz {
    color: green;
  }

  .button-area {
    padding: 10px 15px;
  }

  .panel-head {
    padding: 4px 15px;
    border-bottom: 1px solid #ebedf0;
  }

  .panel-head .title {
    color: #1989fa;
  }

  .panel-head .handle {
    text-align: right;
  }

  .icon-btn {
    font-size: 18px;
  }
</style>


