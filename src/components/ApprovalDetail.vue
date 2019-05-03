<template>
  <div id="approvaldetail">
    <van-panel title="员工信息">
      <van-cell-group>
        <van-cell title="姓名" :value="approval.userName" />
        <van-cell title="部门" :value="approval.deptName" />
      </van-cell-group>
    </van-panel>
    <van-panel title="出差申请" desc="出差基本信息">
      <van-cell-group v-if="approval.trip">
        <van-cell title="出差简介" :value="approval.trip.title" />
        <van-cell title="出差天数" :value="approval.trip.day" />
        <van-field v-model="approval.trip.cause" disabled type="textarea" label="出差事由" />
      </van-cell-group>
    </van-panel>

    <van-panel v-for="(itinerary, $index) in approval.itineraries" :key="'itinerary-' + $index" :title="'行程列表 ' + ($index +1)">

      <van-cell title="行程类型" :value="tripWayMap[itinerary.tripWay]" />
      <van-cell title="交通方式" :value="trafficMap[itinerary.trafficType]" />
      <van-cell title="出发城市" :value="itinerary.depCity" />
      <van-cell title="目的城市" :value="itinerary.arrCity" />
      <van-cell title="出发日期" :value="parseDateStr(itinerary.depDate)" />
      <van-cell title="出发日期" :value="parseDateStr(itinerary.arrDate)" />
    </van-panel> 

    <van-panel title="同行人员" v-if="approval.cotravelers">
       <van-cell title="姓名" :value="cotraveler.userName"  v-for="(cotraveler, $index) in approval.cotravelers" :key="'cotraveler-' + $index"/>
    </van-panel>
  </div>
</template>
<script>
export default {
  name: 'ApprovalDetail',
  props: ['approval'],
  data() {
    return {
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
    }
  },
  methods: {
    parseDateStr(date) {
      if (!date) {
        return '';
      }
      date = new Date(date);
      return `${date.getFullYear()}年${date.getMonth() +1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`
    },
  }
}
</script>

<style>
  .button-area {
    padding: 10px 15px;
  }
</style>


