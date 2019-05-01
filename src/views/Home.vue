<template>
  <div id="home">
    <van-nav-bar
      title="出差申请"
      @click-left="back"
    />
    <van-panel title="员工信息">
      <van-cell-group>
        <van-cell title="姓名" :value="$store.state.user.userName" />
        <van-cell title="部门" @click="showSelectDept">
          {{trip.deptName}}
        </van-cell>
      </van-cell-group>
    </van-panel>
    <van-panel title="出差申请" desc="出差基本信息">
      <van-field
        v-model="trip.trip.title"
        type="text"
        label="出差简介"
        placeholder="如“杭州出差”"
        required
      />
      <van-field
        v-model="trip.trip.day"
        type="number"
        label="出差天数"
        placeholder="出差天数"
        required
      />
      <van-field
        v-model="trip.trip.cause"
        type="textarea"
        label="出差事由"
        placeholder="如“部门业务需要，去杭州出差”"
        required
      />
    </van-panel>
    <van-panel :title="'行程列表' + ($index +1)" status="删除" v-for="(itinerary, $index) in trip.itineraries" :key="'itinerary-' + $index">
      <van-cell title="行程类型" @click="showSelectTripWay($index)">
          {{tripWayMap[itinerary.tripWay]}}
      </van-cell>
      <van-cell title="交通方式" @click="showSelectTraffic($index)">
          {{trafficMap[itinerary.trafficType]}}
      </van-cell>

      <van-cell title="出发城市" @click="showCity($index, 'depCity')">
        {{trip.itineraries[$index].depCity}}
      </van-cell>


      <van-cell title="目的城市" @click="showCity($index, 'arrCity')">
        {{trip.itineraries[$index].arrCity}}
      </van-cell>

      <van-cell title="出发日期" @click="showDatePicker($index, 'depDate')">
        {{parseDateStr(itinerary.depDate)}}
      </van-cell>
      <van-cell title="到达日期" @click="showDatePicker($index, 'arrDate')">
        {{parseDateStr(itinerary.arrDate)}}
      </van-cell>

    </van-panel>
    <div style="margin-bottom:60px;"></div>

    <van-popup v-model="deptSelectShow" position="bottom" >
      <van-picker :columns="departments" :show-toolbar="true" @cancel="deptSelectShow=false" @confirm="selectDept"/>
    </van-popup>

    <van-popup v-model="tripWaySelectShow" position="bottom" >
      <van-picker :columns="tripWayLists" :default-index="1" :show-toolbar="true" @cancel="tripWaySelectShow=false" @confirm="selectTripWay"/>
    </van-popup>

    <van-popup v-model="trafficShow" position="bottom" >
      <van-picker :columns="trafficLists" :default-index="0" :show-toolbar="true" @cancel="trafficShow=false" @confirm="selectTraffic"/>
    </van-popup>

    <van-popup v-model="datePickerShow" position="bottom" >
      <van-datetime-picker
        :show-toolbar	= "true"
        v-model="timeSelected"
        type="datetime"
        @cancel="datePickerShow=false"
        @confirm="pickDate"
      />
    </van-popup>

    <van-popup v-model="areaShow" position="bottom" >
      <van-area
        :area-list="areaList"
        @cancel="areaShow=false"
      />
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
          arrCity: '上海',
          depDate: null,
          arrDate: null
        }]
      },
      itineraryIndex: 0,
      tripWaySelectShow: false,
      tripWayMap: {
        0:'单程',
        1: '往返'
      },
      tripWayLists: ['单程', '往返'],
      trafficType: null,
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
      areaPickType:'depCity',
    }
  },
  methods: {
    back() {
      console.log('back')
    },
    showSelectDept() {
      if(this.departments.length <=1) {
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
        if(data.errcode === 0) {
          this.areaList = data.data;
        }
      })
    },

    showCity(index, areaPickType = 'depCity') {
      this.itineraryIndex = index || 0;
      this.areaShow = true;

      this.areaPickType = areaPickType;
    },

    showDatePicker(index, datePickType='depDate') {
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
      if(!date) {
        return '';
      }
      date = new Date(date);
      return `${date.getFullYear()}年${date.getMonth() +1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`
    }
  },
  created() {
    if(this.$store.state.user) {
      let departments = this.$store.state.user.departments ||[];
      for(let department of departments) {
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
