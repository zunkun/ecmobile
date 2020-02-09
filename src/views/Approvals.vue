<template>
  <div id="approvals">
    <van-tabs v-model="active" color="#1989fa" @click="setType">
      <van-tab title="待我审批" name="todo">
        <van-panel class="approval">
          <div class="card-lists" v-if="todoLoaded && todos.length">
            <van-list v-model="query.todo.loading" :finished="query.todo.finished" finished-text="没有更多了" @load="onLoad">
              <div v-for="(approval, $index) in todos" :key="'todo-' + $index" class="a-card" @click="goto(approval.trip.id)">
                <van-row>
                  <van-col span="4">
                    <van-image round width="48" height="48" :alt="approval.trip.userName" fit="cover" :src="approval.trip.avatar">
                      <template v-slot:error class="errmsg">{{parseName(approval.trip.userName)}}</template>
                    </van-image>
                  </van-col>
                  <van-col span="12">
                    <div class="a-title">
                      {{approval.trip.cause}} {{$index +1}}
                    </div>
                    <div class="a-desc">
                      {{approval.trip.userName}} 提交的出差申请
                    </div>
                  </van-col>
                  <van-col span="8">
                    <div class="a-status">
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
            没有审批单
          </div>
        </van-panel>
      </van-tab>
      <van-tab title="我已审批" name="done">
        <van-panel class="approval">
          <div class="card-lists" v-if="doneLoaded && dones.length">
            <van-list v-model="query.done.loading" :finished="query.done.finished" finished-text="没有更多了" @load="onLoad">
              <div v-for="(approval, $index) in dones" :key="'done-' + $index" class="a-card" @click="goto(approval.trip.id)">
                <van-row>
                  <van-col span="4">
                    <van-image round width="48" height="48" :alt="approval.trip.userName" fit="cover" :src="approval.trip.avatar">
                      <template v-slot:error class="errmsg">{{parseName(approval.trip.userName)}}</template>
                    </van-image>
                  </van-col>
                  <van-col span="12">
                    <div class="a-title">
                      {{approval.trip.cause}}
                    </div>
                    <div class="a-desc">
                      {{approval.trip.userName}} 提交的出差申请
                    </div>
                  </van-col>
                  <van-col span="8">
                    <div class="a-status">
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
            没有审批单
          </div>
        </van-panel>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: 'todo',
        statusMap: {
          10: '审批中',
          11: '修改审批中',
          20: '已通过',
          30: '已拒绝',
          40: '已撤销',
        },
        type: 'todo',
        todos: [],
        dones: [],
        todoLoaded: false,
        doneLoaded: true,
        query: {
          todo: {
            page: 1,
            max: 1,
            count: 0,
            finished: false,
            loading: false,
            loaded: false,
          },
          done: {
            page: 1,
            max: 1,
            count: 0,
            finished: true,
            loading: false,
            loaded: false,
          }
        }
      }
    },
    methods: {
      setType(name) {
        this.type = name;
        if (!this.query[this.type].count) {
          this.query[this.type] = {
            page: 1,
            max: 1,
            count: 0,
            finished: false,
            loading: false,
          }
          this.getApprovals();
        }        
      },
      onLoad() {
        this.query[this.type].page++;
        this.getApprovals();
      },
      getApprovals() {
        let that = this;
        this.$http.get(`/ecapi/api/approvals?type=${this.type}&page=${ this.query[this.type].page}&limit=10`)
          .then(res => {
            if(that.type === 'todo') that.todoLoaded = true;
            if(that.type === 'done') that.doneLoaded = true;
            let resData = res.data;
            if (resData.errcode === 0) {
              that.query[that.type].count = resData.data.count;
              that.query[that.type].max = Math.ceil(resData.data.count / 10);
              if (that.type === 'todo') {
                that.todos = that.todos.concat(resData.data.rows)
                if (that.todos.length >= that.query.todo.count) {
                  that.query.todo.finished = true;
                } else {
                  that.query.todo.finished = false;
                }
              } else {
                that.dones = that.dones.concat(resData.data.rows);
                if (that.dones.length >= that.query.done.count) {
                  that.query.done.finished = true;
                } else {
                  that.query.done.finished = false;
                }
              }
              that.query[that.type].loading = false;
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
        return `${year}-${monthStr}-${dayStr}`;
      },

      parseName(name) {
        if(name.length > 2) {
          name = name.slice(name.length -2)
        }
        return name;
      },

      goto(tripId) {
        this.$router.push({name: 'approvaldetail', params: {tripId}})
      }
    },
    created() {
      this.getApprovals();
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
  }

  .a-time {
    color: #a1a2a4;
    text-align: right;
    /* vertical-align: bottom; */
  }

  .no-data {
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
  }
  .van-image__error {
    background: #5e97f6 !important;
    color:inherit;
    font-size: 1rem;
  }
</style>