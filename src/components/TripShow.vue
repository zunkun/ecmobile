<template>
  <div class="detail">
    <van-panel class="basic">
      <van-row class="user">
        <van-col span="4">
          <van-image round width="48" height="48" :alt="trip.userName" fit="cover" :src="trip.avatar">
            <template v-slot:error class="errmsg">{{parseName(trip.userName)}}</template>
          </van-image>
        </van-col>
        <van-col span="20">
          <div class="a-title">
            {{trip.userName}}
          </div>
          <div class="a-desc" :style="{color: colorMap[trip.status]}">
            {{statusMap[trip.status]}}
          </div>
        </van-col>
      </van-row>
      <div class="basic1">
        <van-row class="basic1-item">
          <van-col span="6" class="basic1-title">
            审批编号
          </van-col>
          <van-col span="18" class="basic1-text">
            {{trip.id}}
          </van-col>
        </van-row>
        <van-row class="basic1-item">
          <van-col span="6" class="basic1-title">
            所在部门
          </van-col>
          <van-col span="18" class="basic1-text">
            {{trip.deptName}}
          </van-col>
        </van-row>
        <van-row class="basic1-item">
          <van-col span="6" class="basic1-title">
            预算余额
          </van-col>
          <van-col span="18" class="basic1-text">
            {{trip.balance}}
          </van-col>
        </van-row>
        <van-row class="basic1-item">
          <van-col span="6" class="basic1-title">
            出差事由
          </van-col>
          <van-col span="18" class="basic1-text">
            {{trip.reason}}
          </van-col>
        </van-row>
      </div>
    </van-panel>
    <van-panel class="basic" v-for="(it, $index) in trip.itineraries" :key="'trip' + $index">
      <van-row class="it-title">
        行程{{$index+1}}
      </van-row>
      <van-row class="basic1-item">
        <van-col span="6" class="basic1-title">
          交通工具
        </van-col>
        <van-col span="18" class="basic1-text">
          {{it.trafficTypeName}}
        </van-col>
      </van-row>
      <van-row class="basic1-item">
        <van-col span="6" class="basic1-title">
          单程往返
        </van-col>
        <van-col span="18" class="basic1-text">
          {{it.tripwayName}}
        </van-col>
      </van-row>
      <van-row class="basic1-item">
        <van-col span="6" class="basic1-title">
          出发城市
        </van-col>
        <van-col span="18" class="basic1-text">
          {{it.depCity}}
        </van-col>
      </van-row>
      <van-row class="basic1-item">
        <van-col span="6" class="basic1-title">
          目的城市
        </van-col>
        <van-col span="18" class="basic1-text">
          {{it.arrCity}}
        </van-col>
      </van-row>
      <van-row class="basic1-item">
        <van-col span="6" class="basic1-title">
          开始时间
        </van-col>
        <van-col span="18" class="basic1-text">
          {{parseDateStr(it.depDate)}}
        </van-col>
      </van-row>
      <van-row class="basic1-item">
        <van-col span="6" class="basic1-title">
          到达时间
        </van-col>
        <van-col span="18" class="basic1-text">
          {{parseDateStr(it.arrDate)}}
        </van-col>
      </van-row>
      <van-row class="basic1-item">
        <van-col span="6" class="basic1-title">
          时长（天）
        </van-col>
        <van-col span="18" class="basic1-text">
          {{it.tripDay}}
        </van-col>
      </van-row>
    </van-panel>
    <van-panel class="basic">
      <van-row class="basic1-item">
        <van-col span="6" class="basic1-title">
          出差天数
        </van-col>
        <van-col span="18" class="basic1-text">
          {{trip.tripDay}}
        </van-col>
      </van-row>
      <van-row class="basic1-item">
        <van-col span="6" class="basic1-title">
          出差备注
        </van-col>
        <van-col span="18" class="basic1-text">
          {{trip.remark}}
        </van-col>
      </van-row>
      <van-row class="basic1-item" v-if="trip.fellowUsers && trip.fellowUsers.length">
        <van-col span="6" class="basic1-title">
          同行人员
        </van-col>
        <van-col span="18" class="basic1-text">
          <span v-for="(user, $userIndex) in trip.fellowUsers" :key="'user-' + $userIndex"
            class="fellow">{{user.name}}</span>
        </van-col>
      </van-row>
    </van-panel>
  </div>
</template>

<script>
  export default {
    props: ['trip'], 
    data() {
      return {
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
        activeColor: '#ccc',
        imgName: '',
      }
    },
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
      parseName(name) {
        if(name.length > 2) {
          name = name.slice(name.length -2)
        }
        return name;
      }
    },
  }
</script>

<style>
  .basic .van-panel__header {
    display: none;
  }

  .basic {
    /* margin-top: 4px; */
    padding: 10px 6px;
  }

  .a-title {
    margin-bottom: 10px;
  }

  .a-desc {
    color: #a1a2a4;
    font-size: 0.94rem;
  }

  .basic1 {
    border-top: 1px solid #f8f8f8;
    padding: 10px 0px;
  }

  .basic1-item {
    margin: 3px 0px;
  }

  .it-title {
    background: #ebedf0;
    padding: 4px;
  }

  .fellow {
    margin-right: 4px;
  }

  .steptime {
    text-align: right;
    font-size: 0.88rem;
  }

  .remark .van-cell {
    padding: 10px 0px;
  }

  .remark .van-cell__value {
    border: 1px solid #ccc;
  }

  .commit-btn .left {
    padding-right: 5px;
  }

  .commit-btn .right {
    padding-left: 5px;
  }
  .van-image__error {
    background: #5e97f6 !important;
    color:inherit;
    font-size: 1rem;
  }
</style>