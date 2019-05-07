<template>
  <div id="approvaldetail">
    <div style="padding:10px 15px; color:red;">
      当前状态: {{approvalStatus[approval.status]}}
    </div>
    <van-panel title="员工信息">
      <van-cell-group>
        <van-cell title="姓名" :value="approval.userName" />
        <van-cell title="部门" :value="approval.deptName" />
        <van-cell title="预算余额" :value="approval.balance" />
      </van-cell-group>
    </van-panel>
    <van-panel title="出差申请">
      <van-cell-group v-if="approval.trip">
        <van-field v-model="approval.trip.cause" disabled type="textarea" label="出差事由" />
      </van-cell-group>
    </van-panel>

    <van-panel v-for="(itinerary, $index) in approval.itineraries" :key="'itinerary-' + $index" :title="'行程(' + ($index +1) + ')'">

      <van-cell title="行程类型" :value="tripWayMap[itinerary.tripWay]" />
      <van-cell title="交通方式" :value="trafficMap[itinerary.trafficType]" />
      <van-cell title="出发城市" :value="itinerary.depCity" />
      <van-cell title="目的城市" :value="itinerary.arrCity" />
      <van-cell title="开始时间" :value="parseDateStr(itinerary.depDate)" />
      <van-cell title="结束时间" :value="parseDateStr(itinerary.arrDate)" />
      <van-cell title="时长(天)">
        {{itinerary.day}}
      </van-cell>
    </van-panel>

    <van-panel title="成本中心/发票抬头">
      <van-cell title="出差时长" :value="approval.trip.day" v-if="approval.trip"></van-cell>
      <van-cell title="成本中心" v-if="approval.costcenter">
        {{approval.costcenter.title}}
      </van-cell>
      <van-cell title="发票抬头" v-if="approval.invoice">
        {{approval.invoice.title}}
      </van-cell>
    </van-panel>
    <van-panel title="出差备注" v-if="approval.trip && approval.trip.remark">
      <van-field v-model="approval.trip.remark" type="textarea" readonly />
    </van-panel>

    <van-panel title="同行人员" v-if="approval.cotravelers && approval.cotravelers.length">
       <van-cell title="姓名" :value="cotraveler.userName"  v-for="(cotraveler, $index) in approval.cotravelers" :key="'cotraveler-' + $index"/>       
    </van-panel>
    <van-panel title="审批流程">
      <van-steps direction="vertical" >
        <van-step v-for="(listItem, $index) in approvalLists" :key="'listItem-' + $index">
          <h3>{{listItem.title}}</h3>
          <p>{{listItem.users.join('、')}}</p>
        </van-step>
      </van-steps>
    </van-panel>
  </div>
</template>
<script>
export default {
  name: 'ApprovalDetail',
  props: ['approval'],
  data() {
    return {
      approvalStatus: {
        10: '审批中',
        20: '审批中',
        30: '审批通过',
        40: '审批通过',
        50: '拒绝',
        60: '撤销',
      },
      approvalStep: 0,
      tripWayMap: {
        0: '单程',
        1: '往返'
      },
      trafficMap: {
        0: '飞机',
        1: '火车',
        2: '汽车',
        3: '其他'
      },
      approvalLists: [],
    }
  },
  methods: {
    parseDateStr(date) {
      if (!date) {
        return '';
      }
      date = new Date(date);
      return `${date.getFullYear()}年${date.getMonth() +1}月${date.getDate()}日`
    },
    setApprovalDepts(approvalDepts) {
      for(let index in approvalDepts) {
        let listItem = {
          title: '',
          users: []
        };
        if((index === '0' || index === 0) && approvalDepts[index].deptId === Number(this.approval.deptId)) {
          listItem.title = '直接主管';
        } else {
          listItem.title = `第${Number(index)+1}级主管` 
        }
        let users = approvalDepts[index].users ||[]
        for(let user of users) {
          listItem.users.push(user.userName)
        }
        this.approvalLists.push(listItem)
      }
    },
    getApprpvalUsers(approval) {
      if(!approval.id) {
        return;
      }

      for(let item of approval.approvalDepts) {
        let approvalUser = {
          users: '',
          approval: item.approval || false
        };
        if(item.approvalTime) {
          this.approvalStep += 1;
        }
        let users = item.users || [];
        if(users.length >= 2) {
          approvalUser.users = `${users[0].userName}、${users[1].userName}`
        } else {
          approvalUser.users = `${users[0].userName}`
        }
        this.approvalUsers.push(approvalUser)
      }
      if(approval.status == 40) {
        this.approvalStep = approval.approvalDepts.length + 2;
      }
    }
  },
  created() {
    let timer = setInterval(() =>{
      if(this.approval) {
        this.setApprovalDepts(this.approval.approvalDepts);
        clearInterval(timer)
      }
    }, 500)
  }
}
</script>

<style>
  .button-area {
    padding: 10px 15px;
  }
</style>


