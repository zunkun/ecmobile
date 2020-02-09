<template>
  <div id="approvals">
    <van-panel class="approval">
      <div class="card-lists" v-if="loaded && trips.length">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="(approval, $index) in trips" :key="'todo-' + $index" class="a-card" @click="goto(approval.trip.id)">
            <van-row>
              <van-col span="12">
                <div class="a-title">
                  {{approval.trip.cause}}
                </div>
              </van-col>
              <van-col span="12">
                <div class="a-status" :style="{color: colorMap[approval.trip.status]}">
                  {{statusMap[approval.trip.status]}}
                </div>
                <div class="a-time">
                  {{parseDateStr(approval.trip.createdAt)}}
                </div>
              </van-col>
            </van-row>
          </div>
        </van-list>
      </div>
      <div class="no-data" v-else>
        没有出差申请
      </div>
    </van-panel>
  </div>
</template>

<script>
  export default {
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
        trips: [],
        loaded: false,
        page: 1,
        count: 0,
        finished: false,
        loading: false,
      }
    },
    methods: {
      onLoad() {
        this.page++;
        this.getTrips();
      },
      getTrips() {
        let that = this;
        this.$http.get(`/ecapi/api/approvals/trips?page=${ this.page}&limit=10`)
          .then(res => {
            that.loaded = true;
            let resData = res.data;
            if (resData.errcode === 0) {
              that.count = resData.data.count;
              that.trips = that.trips.concat(resData.data.rows)
              if (that.trips.length >= that.count) {
              that.finished = true;
              } else {
                that.finished = false;
              }
            }
          })
      },
      parseDateStr(date) {
        date = new Date(date);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let monthStr = month >= 10 ? month : `0${month}`;
        let dayStr = day >= 10 ? day : `0${day}`;
        // let hours = date.getHours();
        // hours = hours >= 10 ? hours: `0${hours}`
        // let minutes = date.getMinutes();
        // minutes = minutes >= 10 ? minutes: `0${minutes}`
        // let seconds = date.getSeconds();
        // seconds = seconds >= 10 ? seconds: `0${seconds}`
        return `${year}-${monthStr}-${dayStr}`;
      },

      goto(tripId) {
        this.$router.push({name: 'tripdetail', params: {tripId}})
      }
    },
    created() {
      this.getTrips();
    }

  }
</script>

<style>
  .approval .van-panel__header {
    display: none !important;
  }

  .card-lists {
    /* border-top: 1px solid #ccc; */
    padding-top: 4px;
  }

  .a-card {
    /* display: flex; */
    margin-top: 4px;
    padding: 2px 6px;
    border-bottom: 1px solid #ccc;
  }

  .a-img {
    width: 48px;
    height: 48px;
  }

  .a-content {
    display: flex;
  }

  .a-title {
    margin-bottom: 10px;
  }

  .a-desc {
    color: #a1a2a4;
  }

  .a-status {
    color: #a1a2a4;
    text-align: right;
    /* font-size: 1.2rem; */
    margin-bottom: 10px;
    font-size: 0.9rem;
  }

  .a-time {
    color: #a1a2a4;
    text-align: right;
    font-size: 0.9rem;
    /* vertical-align: bottom; */
  }

  .no-data {
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
  }
</style>