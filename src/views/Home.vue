<template>
  <div id="home">
    <!-- <van-nav-bar
      title="出差申请"
      @click-left="back"
    /> -->
    <van-panel title="员工信息">
      <van-cell-group>
        <van-cell title="姓名" :value="$store.state.user.userName" />
        <van-cell title="部门" @click="showSelectDept">
          {{trip.deptName}}
        </van-cell>
      </van-cell-group>
    </van-panel>
    <van-panel title="出差申请" desc="出差基本信息">
      <van-field v-model="trip.trip.title" type="text" label="出差简介" placeholder="如“杭州出差”" required />
      <van-field v-model="trip.trip.day" type="number" label="出差天数" placeholder="出差天数" required />
      <van-field v-model="trip.trip.cause" type="textarea" label="出差事由" placeholder="如“部门业务需要，去杭州出差”" required />
    </van-panel>
    <van-panel v-for="(itinerary, $index) in trip.itineraries" :key="'itinerary-' + $index">
      <div slot="header" class="panel-head">
        <van-row>
          <van-col span="22" class="title">
            {{'行程列表 ' + ($index +1)}}
          </van-col>
          <van-col span="2" class="handle">
            <van-icon name="delete" color="red" size="20px" @click="deleteItinerary($index)" />
          </van-col>
        </van-row>
      </div>
      <van-cell title="行程类型" required @click="showSelectTripWay($index)">
        {{tripWayMap[itinerary.tripWay]}}
      </van-cell>
      <van-cell title="交通方式" required @click="showSelectTraffic($index)">
        {{trafficMap[itinerary.trafficType]}}
      </van-cell>

      <van-cell title="出发城市" required @click="showCity($index, 'depCity')">
        {{trip.itineraries[$index].depCity}}
      </van-cell>


      <van-cell title="目的城市" required @click="showCity($index, 'arrCity')">
        {{trip.itineraries[$index].arrCity}}
      </van-cell>

      <van-cell title="出发日期" required @click="showDatePicker($index, 'depDate')">
        {{parseDateStr(itinerary.depDate)}}
      </van-cell>
      <van-cell title="到达日期" required @click="showDatePicker($index, 'arrDate')">
        {{parseDateStr(itinerary.arrDate)}}
      </van-cell>
    </van-panel>

    <div class="button-area">
      <van-button block type="warning" plain @click="addItinerary">新增行程</van-button>
    </div>


    <van-panel title="同行人员" class="traveler-head">
      <van-cell-group>
        <van-row v-for="(cotraveler, $index) in trip.cotravelers" :key="'cotraveler-' + $index" class="traveler-row">
          <van-col span="22">
            <van-cell title="姓名" :value="cotraveler.userName" @click="selectTraveler($index)">
            </van-cell>
          </van-col>
          <van-col span="2">
            <van-icon name="delete" class="traveler-icon" @click="deleteTraveler($index, 'delete')" />
          </van-col>
        </van-row>

        <div class="button-area">
          <van-button block type="warning" plain @click="addCotraveler">新增同行人员</van-button>
        </div>
      </van-cell-group>

    </van-panel>
    <div class="button-area">
      <van-button block type="primary" plain @click="saveTrip">申请出差</van-button>
    </div>

    <van-popup v-model="deptSelectShow" position="bottom">
      <van-picker :columns="departments" :show-toolbar="true" @cancel="deptSelectShow=false" @confirm="selectDept" />
    </van-popup>

    <van-popup v-model="tripWaySelectShow" position="bottom">
      <van-picker :columns="tripWayLists" :default-index="1" :show-toolbar="true" @cancel="tripWaySelectShow=false"
        @confirm="selectTripWay" />
    </van-popup>

    <van-popup v-model="trafficShow" position="bottom">
      <van-picker :columns="trafficLists" :default-index="0" :show-toolbar="true" @cancel="trafficShow=false"
        @confirm="selectTraffic" />
    </van-popup>

    <van-popup v-model="datePickerShow" position="bottom">
      <van-datetime-picker :show-toolbar="true" v-model="timeSelected" type="datetime" @cancel="datePickerShow=false"
        @confirm="pickDate" />
    </van-popup>

    <van-popup v-model="areaShow" position="bottom">
      <van-area :area-list="areaList" :value="defaultArea[trafficType]" @cancel="areaShow=false" @confirm="pickCity" />
    </van-popup>

    <van-popup v-model="travelerShow" position="center" class="traverer-wrapper">
      <van-tree-select :items="staffLists" :height="treeHeight" :main-active-index="mainActiveIndex" :active-id="activeId"
        @navclick="onNavClick" @itemclick="pickTraveler" />
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        deptSelectShow: false,
        departmentLists: [],
        departments: [],
        trip: {
          deptId: null,
          deptName: null,
          trip: {
            day: 1,
            title: '',
            cause: ''
          },
          itineraries: [{
            tripWay: 1,
            trafficType: 0,
            depCity: '上海',
            depCityCode: '',
            arrCity: '上海',
            arrCityCode: '',
            depDate: null,
            arrDate: null
          }],
          cotravelers: []
        },
        defaultArea: {
          0: '421000',
          1: '401000',
          2: '310100',
          3: '310100',
        },
        itineraryIndex: 0,
        tripWaySelectShow: false,
        tripWayMap: {
          0: '单程',
          1: '往返'
        },
        tripWayLists: ['单程', '往返'],
        trafficType: 0,
        trafficShow: false,
        trafficMap: {
          0: '飞机',
          1: '火车',
          2: '汽车',
          3: '其他'
        },
        trafficLists: ['飞机', '火车', '汽车', '其他'],
        datePickerShow: false,
        datePickType: 'depDate',
        timeSelected: new Date(),

        areaShow: false,
        areaList: {
          province_list: {},
          city_list: {},
          county_list: {}
        },
        areaPickType: 'depCity',
        travelerShow: false,
        treeHeight: 450,
        travelerIndex: 0,
        mainActiveIndex: 0,
        activeId: 1,
        staffLists: [],
      }
    },
    methods: {
      back() {},
      showSelectDept() {
        if (this.departments.length <= 1) {
          return;
        }
        this.deptSelectShow = true;
      },
      selectDept(deptName, index) {
        this.trip.deptId = this.departmentLists[index].deptId;
        this.trip.deptName = this.departmentLists[index].deptName;

        this.deptSelectShow = false;
      },

      showSelectTripWay(index) {
        this.itineraryIndex = index || 0;
        this.tripWaySelectShow = true;
      },

      selectTripWay(tripWayName, index) {
        this.trip.itineraries[this.itineraryIndex].tripWay = index;
        this.tripWaySelectShow = false;
      },

      showSelectTraffic(index) {
        this.itineraryIndex = index || 0;
        this.trafficShow = true;
      },

      selectTraffic(trafficName, index) {
        this.trip.itineraries[this.itineraryIndex].trafficType = index;
        this.trafficShow = false;

        this.trafficType = index;

        this.trip.itineraries[this.itineraryIndex].depCity = '';
        this.trip.itineraries[this.itineraryIndex].arrCity = '';
        this.getAreaLists();
      },

      getAreaLists() {
        this.$http.get(`/api/area?type=${this.trafficType}`).then(res => {
          let data = res.data;
          if (data.errcode === 0) {
            this.areaList = data.data;
          }
        })
      },

      showCity(index, areaPickType = 'depCity') {
        this.itineraryIndex = index || 0;
        this.areaShow = true;

        this.areaPickType = areaPickType;
      },


      pickCity(area) {
        this.trip.itineraries[this.itineraryIndex][this.areaPickType] = area[1].name;
        this.trip.itineraries[this.itineraryIndex][`${this.areaPickType}Code`] = area[1].code;

        this.areaShow = false;
      },

      showDatePicker(index, datePickType = 'depDate') {
        this.itineraryIndex = index || 0;
        this.datePickType = datePickType;
        this.datePickerShow = true;
      },

      pickDate() {
        let date = new Date(this.timeSelected);
        this.trip.itineraries[this.itineraryIndex][this.datePickType] = date;

        this.datePickerShow = false;
      },
      parseDateStr(date) {
        if (!date) {
          return '';
        }
        date = new Date(date);
        return `${date.getFullYear()}年${date.getMonth() +1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`
      },

      addItinerary() {
        this.trip.itineraries.push({
          tripWay: 1,
          trafficType: 0,
          depCity: '上海',
          depCityCode: '',
          arrCity: '上海',
          arrCityCode: '',
          depDate: null,
          arrDate: null
        })
      },

      deleteItinerary(index) {
        this.$delete(this.trip.itineraries, index)
      },

      addCotraveler() {
        this.trip.cotravelers.push({
          userId: '',
          userName: '',
          deptId: '',
          deptName: '',
        })
      },

      deleteTraveler(index) {
        this.$delete(this.trip.cotravelers, index)
      },

      async selectTraveler(index) {
        this.travelerIndex = index || 0;
        if (!this.staffLists.length) {
          let res = await this.$http.get('/api/staffs/depts');
          let resData = res.data;
          if (resData.errcode !== 0) {
            return;
          }
          this.staffLists = resData.data || [];
        }
        this.travelerShow = true;
      },

      onNavClick(index) {
        this.mainActiveIndex = index;
      },

      pickTraveler(staff) {
        this.trip.cotravelers[this.travelerIndex] = staff;

        this.travelerShow = false;
      },

      appendBudget() {
        this.$http.post('/api/approvals/append', this.trip).then(res => {
          if(res.data.errcode === 0) {
            this.$toast('已提交追加部门预算申请');
            return;
          }
          this.$toast('追加部门预算申请失败，请联系管理员');
        })
      },

      saveTrip() {
        let flag = true;
        let trip = this.trip;
        if(!trip.deptId) {
          flag = false;
        }
        if(!trip.trip.day || !trip.trip.title || !trip.trip.cause) {
          flag = false;
        }
        let itineraries = trip.itineraries || []
        for(let it of itineraries) {
          if(!it.tripWay || !it.depCity || !it.arrCity || !it.depDate || !it.arrDate) {
            flag = false;
          }
          if(!flag) {
            break;
          }
        }

        if(!flag) {
          this.$toast('申请单填写不正确，请正确填写')
          return;
        }

        this.$http.get(`/api/fees/balance?deptId=${trip.deptId}`).then((res) =>{
          let feeRes = res.data;
          if(feeRes.errcode !== 0) {
            this.$toast(`申请失败,${feeRes.errmsg}`)
            return;
          }
          let approval = feeRes.data.approval;
          if(!approval) {
            this.$dialog.confirm({
              message: '部门预算不足，是否申请追加预算',
            }).then(() => {
              return this.appendBudget();
            }).catch(() =>{
              this.$toast('已取消申请追加预算');
            })
            return;
          }

          this.$http.post('/api/approvals',trip).then(res => {
            let approvalRes = res.data;
            
            if(approvalRes.errcode ===0) {
              this.$toast('出差申请单填写成功，请等待领导审批');
              return;
            }
            this.$toast('出差申请单填写失败，请重新申请或者联系管理员');
          })
        }).catch(res => {
            this.$toast('出差申请单填写失败，请重新申请或者联系管理员');
        })
      }
    },
    created() {
      if (this.$store.state.user) {
        let departments = this.$store.state.user.departments || [];
        for (let department of departments) {
          this.departments.push(department.deptName)
        }
        this.departmentLists = departments;
        this.trip.deptId = departments[0].deptId;
        this.trip.deptName = departments[0].deptName;
      }

      this.getAreaLists();
    }
  }
</script>

<style>
  .button-area {
    padding: 10px 15px;
  }

  .panel-head {
    padding: 4px 15px;
  }

  .panel-head .title {
    color: #1989fa;
  }

  .panel-head .handle {
    text-align: right;
  }

  .traveler-head {
    color: #ff976a;
  }

  .traveler-icon {
    color: red;
    margin-top: 12px;
    font-size: 20px !important;
  }

  .traveler-row {
    margin-left: 15px;
    border-bottom: 1px solid #ebedf0;
  }

  .traveler-row .van-cell {
    padding-left: 0px !important;
  }

  .traverer-wrapper {
    width: 94%;
  }

  .van-panel__header .van-cell__title {
    color: #1989fa;
  }
</style>