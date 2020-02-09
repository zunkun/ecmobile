<template>
  <div>
    <van-panel class="basic">
      <van-steps direction="vertical" :active="step" :active-color="activeColor" >
        <van-step v-for="(step, $index) in steps" :key="'step' + $index">
          <van-row>
            <van-col span="10">{{step.title}}</van-col>
            <van-col span="14" v-if="step.time" class="steptime" style="color:#a1a2a4;">{{parseDateStr(step.time, 2)}}
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24">
              {{step.userName}}
              <span v-if="step.status">({{step.statusStr || statusMap[step.status]}})</span>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24" v-if="step.remark">
              {{step.remark}}
            </van-col>
          </van-row>
        </van-step>
      </van-steps>
    </van-panel>
  </div>
</template>

<script>
export default {
  props: ['steps', 'step', 'tripColor', 'catalog'],
  data() {
    return {
      activeColor: '#ccc',
      statusMap: {
        10: '审批中',
        11: '修改审批中',
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
  },
  created() {
    if(this.steps) {
      this.activeColor = this.colorMap[this.steps[this.step].status]
    } else {
      this.activeColor = '#ccc'
    }
  },
  watch: {
    step() {
      this.activeColor = this.colorMap[this.steps[this.step].status]
      
    } 
  }
}
</script>

<style>

</style>