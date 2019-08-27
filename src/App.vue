<template>
  <div id="app">
    <van-panel class="task-panel1">
      <div slot="header" hidden></div>
      <van-cell-group>
        <van-cell title="姓名" :value="trip.userName" />
        <van-cell title="部门" is-link :value="trip.deptName" @click="showSelectDept" />
        <van-cell title="预算余额(元)" :value="trip.balance" />

        <van-field v-model="trip.reason" label="出差事由" required placeholder="请输入出差事由" v-if="trip.balance > 0"/>
        <p class="desc" v-if="trip.balance <= 0">{{trip.deptName}}部门预算不足，不能提交出差</p>
      </van-cell-group>
    </van-panel>

    <div v-if="trip.balance > 0" class="z-w">
      <van-panel class="task-panel" v-for="(it, $index) in trip.itineraries" :key="'it-' + $index">
        <div slot="header" class="trip-head">
          <van-row>
            <van-col span="20" class="title" v-if="$index === 0">
              行程
            </van-col>
            <van-col span="20" class="title" v-else>
              {{'行程(' + ($index +1) + ')'}}
            </van-col>

            <van-col span="4" class="handle" v-if="trip.itineraries.length !== 1">
              <span class="text-danger" @click="deleteItinerary($index)">删除</span>
            </van-col>
          </van-row>
        </div>

        <van-cell-group>
          <van-cell title="交通工具" class="trans">
            <van-button v-for="(trafficTypeName, trafficTypeId) in trafficTypeMap" :key="'trafficTypeId' + $index + '-' + trafficTypeId"
              type="info" size="small" :plain="it.trafficTypeId !== Number(trafficTypeId)" :text="trafficTypeName"
              @click="selectTrafficType(it, trafficTypeName, trafficTypeId)" />
          </van-cell>
          <van-field v-model="it.trafficTypeName" required placeholder="请填写交通工具名称（必填）" v-if="it.trafficTypeId === 3" />

          <van-cell title="单程往返" class="trans">
            <van-button v-for="(tripwayName, $tripwayIndex) in ['单程', '往返']" :key="'tripway' + $index + '-' + $tripwayIndex" type="info"
              size="small" :plain="it.tripwayId !== $tripwayIndex" :text="tripwayName" @click="selectTripway(it, $tripwayIndex)" />
          </van-cell>
          <van-field v-model="it.depCity" label="出发城市" required placeholder="出发城市" v-if="trafficTypeId == 2 || trafficTypeId ==3" />
          <van-field v-model="it.arrCity" label="目的城市" required placeholder="目的城市" v-if="trafficTypeId == 2 || trafficTypeId ==3" />
          <van-cell title="出发城市" required is-link :value="it.depCity" @click="chooseCity($index, 'depCity')" v-if="trafficTypeId == 0 || trafficTypeId ==1" />
          <van-cell title="目的城市" required is-link :value="it.arrCity"  @click="chooseCity($index, 'arrCity')" v-if="trafficTypeId == 0 || trafficTypeId ==1"/>

          <van-cell title="开始时间" required is-link :value="it.depDateStr" @click="chooseDate(it, 'depDate', it.depDate)" />
          <van-cell title="结束时间" required is-link :value="it.arrDateStr" @click="chooseDate(it, 'arrDate', it.arrDate)" />
          <van-cell title="时长（天）" required label="自动计算时长" :value="it.tripDay" />
        </van-cell-group>
      </van-panel>
      <div class="itbtn">
        <van-button block type="info" plain @click="addItinerary"><span class="icon-btn">+</span> 增加行程</van-button>
      </div>

      <van-panel title="出差备注" class="task-panel">
        <van-cell-group>
          <van-field v-model="trip.remark" type="textarea" placeholder="请输入具体的出差备注（选填，少于500字）" />
        </van-cell-group>
      </van-panel>

      <van-panel class="task-panel">
        <div slot="header" hidden></div>
        <van-cell-group>
          <van-cell title="同行人员" is-link @click="chooseFellows" :value="fellowStr" />
        </van-cell-group>
      </van-panel>
      <div class="itbtn">
        <van-button block type="info" @click="commit"> 提 交 出 差</van-button>
      </div>
    </div>


    <van-popup v-model="stationShow" position="right" :overlay="false" :duration="0" class="popup-z">
      <Station :trafficTypeId="trafficTypeId" @closepage="closePage"/>
    </van-popup>

    <van-popup v-model="deptSelectShow" position="bottom">
      <van-picker :columns="departments" :show-toolbar="true" @cancel="deptSelectShow=false" @confirm="selectDept" />
    </van-popup>


  </div>
</template>

<script>
  import Station from './Station.vue';
  export default {
    name: 'home',
    components: { Station },
    data() {
      return {
        departments: [],
        departmentLists: [],
        trafficTypeMap: {
          0: '飞机',
          1: '火车',
          2: '汽车',
          3: '其他'
        },
        tripwayMap: {
          0: '单程',
          1: '往返'
        },
        trafficTypeId: 0,
        cityType: '',
        itIndex: 0,
        defaultIt: {
          trafficTypeId: 0,
          trafficTypeName: '飞机',
          tripwayId: 0,
          tripwayName: '单程',
          depCity: '',
          arrCity: '',
          depDate: '',
          depDateStr: '',
          arrDate: '',
          arrDateStr: '',
          tripDay: '',
        },
        trip: {
          userId: '',
          userName: '',
          deptId: '',
          deptName: '',
          balance: 1000,
          reason: '',
          itineraries: [],
          remark: '', // 备注
          fellowUserIds: [],
          fellowUsers: [], // 同行人userId
        },
        fellowDepts: [], // 同行人userName
        fellowDeptIds: [],
        fellowCount: '',
        fellowStr: '',
        stationShow: false,
        deptSelectShow: false,
        errMsg: '', // 表单校验失败消息
      }
    },
    methods: {
      getBalance(deptId) {
        this.trip.balance = 1300;
        return;
        this.$http.get(`/ec/api/fees/count?deptId=${deptId}`).then((res) => {
          let feeRes = res.data;
          if (feeRes.errcode !== 0) {
            this.trip.balance = 0;
            return;
          }
          this.trip.balance = feeRes.data.balance || 0;
        }).catch(() => {
          this.trip.balance = 0;
        });
      },

      initTrip() {
        this.trip = {
          userId: this.trip.userId,
          userName: this.trip.userName,
          deptId: this.trip.deptId,
          deptName: this.trip.deptName,
          balance: 0,
          reason: '',
          itineraries: [],
          remark: '', // 备注
          fellowUserIds: [],
          fellowUsers: [], // 同行人userId
        };
        this.fellowDepts = [];
        this.fellowDeptIds = [];
        this.fellowCount = '';
        this.fellowStr = '';
        this.itIndex = 0;

        this.addItinerary();
        this.getBalance()
      },

      selectTrafficType(it, trafficTypeName, trafficTypeId) {
        trafficTypeId = Number(trafficTypeId);
        if (it.trafficTypeId === trafficTypeId) return;

        it.trafficTypeId = trafficTypeId;
        it.trafficTypeName = trafficTypeName;
        if (trafficTypeId === 3) {
          it.trafficTypeName = '';
        }
        it.depCity = '';
        it.arrCity = '';
        this.trafficTypeId = trafficTypeId;
      },

      selectTripway(it, tripwayId) {
        it.tripwayId = tripwayId;
        it.tripwayName = this.tripwayMap[tripwayId];
      },

      isSameDay(timeStampA, timeStampB) {
        // 判断两个日期是否是同一天
        let dateA = new Date(timeStampA);
        let dateB = new Date(timeStampB);
        return (dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0));
      },
      parseDate2Str(timestamp) {
        var date = new Date(timestamp || '');
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var monthStr = month <= 9 ? `0${month}` : month;
        var dayStr = day <= 9 ? `0${day}` : day;
        return `${year}年${monthStr}月${dayStr}日`;
      },
      parseTripDay(depDate, arrDate) {
        if (!depDate || !arrDate) return;

        return Math.abs(Math.ceil((arrDate - depDate) / (24 * 60 * 60 * 1000)))
      },
      chooseDate(it, type, timestamp) {
        let that = this;
        let defaultDate = Date.now();
        if (type === 'arrDate' && it.depDate) {
          defaultDate = it.arrDate;
        }
        if (timestamp) {
          defaultDate = timestamp;
        }
        this.$dd.ready(() => {
          this.$dd.biz.calendar.chooseOneDay({
            default: defaultDate,
            onSuccess: function (result) {
              let timestamp = result.chosen;
              let depTime = new Date(timestamp).setHours(0, 0, 0, 0)
              let arrTime = new Date(timestamp).setHours(23, 59, 59, 59)
              let depDate = type === 'depDate' ? depTime : it.depDate;
              let arrDate = type === 'arrDate' ? arrTime : it.arrDate;

              // 如果开始时间大于结束时间，需要判断是否在同一天
              if (depDate && arrDate && arrDate < depDate && !that.isSameDay(arrDate, depDate)) {
                return;
              }

              it[type] = type === 'depDate' ? depDate : arrDate;
              it[`${type}Str`] = that.parseDate2Str(timestamp);

              it.tripDay = that.parseTripDay(depDate, arrDate);
            }
          })
        })
      },

      addItinerary() {
        this.trip.itineraries.push(JSON.parse(JSON.stringify(this.defaultIt)))
      },

      deleteItinerary(index) {
        if (this.trip.itineraries.length > 1) {
          this.$delete(this.trip.itineraries, index);
        }
      },

      chooseFellows() {
        let config = JSON.parse(localStorage.getItem('config') || {});
        let that = this;
        this.$dd.ready(() => {
          that.$dd.biz.contact.complexPicker({
            title: "选择同行人员", //标题
            corpId: config.corpId, //企业的corpId
            multiple: true, //是否多选
            limitTips: "最多只能选择10人", //超过限定人数返回提示
            maxUsers: 10, //最大可选人数
            pickedUsers: that.trip.fellowUserIds, //已选用户
            appId: config.agentId, //微应用的Id
            responseUserOnly: true, //返回人，或者返回人和部门
            startWithDepartmentId: 0, //仅支持0和-1
            onSuccess: function (result) {
              that.trip.fellowUsers = result.users;
              that.trip.fellowUserIds = [];
              that.fellowCount = that.selectedCount;
              that.fellowStr = '';
              let nameArray = []
              for(let user of result.users) {
                that.trip.fellowUserIds.push(user.emplId);
                nameArray.push(user.name);
              }
              if(result.users.length <= 3) {
                that.fellowStr = nameArray.join('、');
              } else {
                that.fellowStr =`${nameArray[0]}、${nameArray[1]}等${result.selectedCount}人`
              }
            },
          });
        })
      },

      chooseCity(itIndex, cityType) {
        if(this.trafficTypeId !== 0 && this.trafficTypeId !== 1) {
          this.stationShow = false;
          return;
        }
        this.itIndex = itIndex;
        this.cityType = cityType;
        this.stationShow = true;
      },
      closePage(cityName) {
        this.stationShow = false;
        if(cityName) {
          this.trip.itineraries[this.itIndex][this.cityType] = cityName;
        }
      },
      showSelectDept() {
        if (this.departments.length <= 1) {
          return;
        }
        this.deptSelectShow = true;
      },
      selectDept(deptName, index) {
        this.trip.deptId = this.departmentLists[index].deptId;
        this.trip.deptName = deptName;
        this.deptSelectShow = false;
        this.getBalance(this.trip.deptId)
      },
      setErrMsg(msg) {
        if(!this.errMsg) {
          this.errMsg = msg;
        }
      },
      validate() {
        let valid = true;
        this.errMsg = '';
        if(!this.trip.userId) {
          valid = false;
          this.setErrMsg('无法获取当前用户信息')
        }
        if(!this.trip.deptId) {
          valid = false;
          this.setErrMsg('无法获取当前用户部门信息')
        }
        if(!this.trip.reason) {
          valid = false;
          this.setErrMsg('请输入出差事由')
        }
        if(this.trip.balance <= 0) {
          valid = false;
          this.setErrMsg('当前部门预算余额不足')
        }
        if(!valid) return false;

        for(let it of this.trip.itineraries) {
          if(it.trafficTypeId !== 0 && !it.trafficTypeId) {
            valid = false;
            this.setErrMsg('无法获取交通工具信息')
            break;
          }
          if(it.trafficTypeId === 3 && !it.trafficTypeName) {
            valid = false;
            this.setErrMsg('请填写交通工具名称')
            break;
          } 
          
          if(!it.depCity) {
            valid = false;
            this.setErrMsg('请选择出发城市')
            break;
          }
          if(!it.arrCity) {
            valid = false;
            this.setErrMsg('请选择目的城市')
            break;
          }
          if(!it.depDate) {
            valid = false;
            this.setErrMsg('请选择开始时间')
            break;
          }
          if(!it.arrDate) {
            valid = false;
            this.setErrMsg('请选择结束时间')
            break;
          }
        }
        return valid;
      },
      commit() {
        // 提交审批单
        let that = this;
        let valid = this.validate();
        if(!valid) {
          this.$toast(this.errMsg)
          return 
        }
        
        this.$http.post('/ec/api/trips', this.trip)
        .then(res => {
          let resData = res.data;
          if(resData.errcode !== 0) {
            that.$toast(resData.errmsg)
            return;
          }
          that.$toast.success('出差申请成功');
          that.initTrip();
        })
        .catch(() => {
          that.$toast('出差申请失败')
        });
      }
    },
    created() {
      let user = JSON.parse(localStorage.getItem('user')) || {};
      this.trip.userId = user.userId;
      this.trip.userName = user.userName;

      let departments = user.departments || [];
      if(departments.length) {
        this.trip.deptId = departments[0].deptId;
        this.trip.deptName = departments[0].deptName;
        for (let department of departments) {
          this.departments.push(department.deptName)
        }
        this.departmentLists = departments;
      }

      this.getBalance(this.trip.deptId)
      this.addItinerary();
    }
  }
</script>

<style scoped>
  #app {
    background-color: hsl(0, 0%, 98%);
    padding: 0px 0px;
    color: #000;
    min-height: 100vh;
    height: 100%;
  }

  .z-w {
    padding: 0px;
    margin: 0px;
  }

  .van-cell__value {
    color: #000 !important;
  }

  .desc {
    padding-left: 15px;
    padding-bottom: 10px;
  }

  .task-panel {
    margin-top: 10px;
  }

  .trans .van-cell__title {
    flex: none;
  }

  .trans .van-button {
    margin-left: 4px;
  }

  .trip-head {
    padding: 10px 16px;
  }

  .trip-head .handle {
    text-align: right;
  }

  .text-danger {
    color: red;
  }

  .itbtn {
    padding: 10px 16px;
  }

  .icon-btn {
    font-size: 18px;
  }

  .popup-z {
    overflow: hidden;
  }
</style>