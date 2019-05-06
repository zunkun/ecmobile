<template>
  <div id="home">
    <van-panel title="员工信息">
      <van-cell-group>
        <van-cell title="姓名" :value="approval.userName" />
        <van-cell title="部门" @click="showSelectDept">
          {{approval.deptName}}
        </van-cell>
        <van-cell title="预算余额">
          {{approval.balance}}
        </van-cell>
      </van-cell-group>
    </van-panel>
    <van-panel title="出差申请">
      <van-field v-model="approval.trip.cause" type="textarea" label="出差事由" placeholder="请输入出差事由" required />
    </van-panel>
    <van-panel v-for="(itinerary, $index) in approval.itineraries" :key="'itinerary-' + $index">
      <div slot="header" class="panel-head">
        <van-row>
          <van-col span="22" class="title">
            {{'行程(' + ($index +1) + ')'}}
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
        {{approval.itineraries[$index].depCity}}
      </van-cell>


      <van-cell title="目的城市" required @click="showCity($index, 'arrCity')">
        {{approval.itineraries[$index].arrCity}}
      </van-cell>

      <van-cell title="开始时间" required @click="showDatePicker($index, 'depDate')">
        {{parseDateStr(itinerary.depDate)}}
      </van-cell>
      <van-cell title="结束时间" required @click="showDatePicker($index, 'arrDate')">
        {{parseDateStr(itinerary.arrDate)}}
      </van-cell>
      <van-cell title="时长(天)" required label="自动计算时长">
        {{itinerary.day}}
      </van-cell>
    </van-panel>

    <div class="button-area">
      <van-button block type="warning" plain @click="addItinerary"><span class="icon-btn">+</span> 增加行程</van-button>
    </div>
    <van-panel>
      <van-field v-model="approval.trip.day" label="出差天数" required />
      <van-field label="成本中心" v-model="approval.costcenter.title" readonly @click="costcenterShow=true" />
      <van-field label="发票抬头" v-model="approval.invoice.title" readonly @click="invoiceShow=true" />
    </van-panel>
    <van-panel title="出差备注">
      <van-field v-model="approval.trip.remark" type="textarea" placeholder="请输入具体的出差备注（选填，少于500字）" />
    </van-panel>

    <van-panel title="同行人员" class="traveler-head">
      <van-cell-group>
        <van-row v-for="(cotraveler, $index) in approval.cotravelers" :key="'cotraveler-' + $index" class="traveler-row">
          <van-col span="22">
            <van-cell title="姓名" :value="cotraveler.userName" @click="selectTraveler($index)">
            </van-cell>
          </van-col>
          <van-col span="2">
            <van-icon name="delete" class="traveler-icon" @click="deleteTraveler($index, 'delete')" />
          </van-col>
        </van-row>

        <div class="button-area">
          <van-button block type="warning" plain @click="addCotraveler"><span class="icon-btn">+</span>增加同行人员</van-button>
        </div>
      </van-cell-group>

    </van-panel>
    <van-panel title="审批流程">
      <van-steps direction="vertical" >
        <van-step v-for="(listItem, $index) in approvalLists" :key="'listItem-' + $index">
          <h3>{{listItem.title}}</h3>
          <p>{{listItem.users.join('、')}}</p>
        </van-step>
      </van-steps>
    </van-panel>
    <div class="button-area" v-if="approval.balance">
      <van-button block type="primary" plain @click="saveApproval" v-if="!approval.approvalId">申请出差</van-button>
      <van-button block type="warning" plain @click="saveApproval" v-else>修改申请单</van-button>
    </div>
    <div v-else>
      <p>当前部门没有预算，请联系管理员调整预算再申请出差</p>
    </div>

    <van-popup v-model="deptSelectShow" position="bottom">
      <van-picker :columns="departments" :show-toolbar="true" @cancel="deptSelectShow=false" @confirm="selectDept" />
    </van-popup>

    <van-popup v-model="tripWaySelectShow" position="bottom">
      <van-picker :columns="tripWayLists" :default-index="1" :show-toolbar="true" @cancel="tripWaySelectShow=false"
        @confirm="selectTripWay" title="行程类别"/>
    </van-popup>

    <van-popup v-model="trafficShow" position="bottom">
      <van-picker :columns="trafficLists" :default-index="0" :show-toolbar="true" @cancel="trafficShow=false"
        @confirm="selectTraffic" title="交通方式" />
    </van-popup>

    <van-popup v-model="datePickerShow" position="bottom">
      <van-datetime-picker :show-toolbar="true" v-model="timeSelected" type="date" @cancel="datePickerShow=false"
        @confirm="pickDate" />
    </van-popup>

    <van-popup v-model="areaShow" position="center" class="traverer-wrapper">
      <van-tree-select :items="areaList" title="区域选择" :height="treeHeight" :main-active-index="areaActiveIndex" :active-id="activeArea"  @navclick="navArea" @itemclick="pickCity" />
    </van-popup>

    <van-popup v-model="travelerShow" position="center" class="traverer-wrapper">
      <van-tree-select :items="staffLists" title="同行人" :height="treeHeight" :main-active-index="travelActiveIndex" :active-id="activeId" @navclick="onNavClick" @itemclick="pickTraveler" />
    </van-popup>

    <van-popup v-model="costcenterShow" position="bottom">
      <van-picker :columns="costcenters" :show-toolbar="true" title="成本中心" @cancel="costcenterShow=false" @confirm="pickCostCenter" />
    </van-popup>

    <van-popup v-model="invoiceShow" position="bottom">
      <van-picker :columns="invoices" :show-toolbar="true" @cancel="invoiceShow=false" @confirm="pickInvoice" title="发票抬头"/>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        isEdit: false,
        apprvalProcess: 0,
        deptSelectShow: false,
        departmentLists: [],
        departments: [],
        approval: {
          trip: {},
          invoice: {},
          costcenter: {},
          itineraries: [],
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
        trafficAreaMap: {
          0: 0,
          1: 1,
          2: 2,
          3: 2
        },
        trafficLists: ['飞机', '火车', '汽车', '其他'],
        datePickerShow: false,
        datePickType: 'depDate',
        timeSelected: new Date(),

        areaShow: false,
        areaList: [],
        areaPickType: 'depCity',
        travelerShow: false,
        areaActiveIndex: 0,
        activeArea: '',
        treeHeight: 550,
        travelerIndex: 0,
        travelActiveIndex: 0,
        activeId: 1,
        staffLists: [],
        costcenterShow: false,
        costcenters: [],
        invoiceShow: false,
        invoices: [],
        approvalLists: [],
      }
    },
    methods: {
      getBalance(deptId) {
        this.$http.get(`/ec/api/fees/count?deptId=${deptId || this.approval.deptId}`).then((res) =>{
          let feeRes = res.data;
          if(feeRes.errcode !== 0) {
            this.$toast(`获取部门费用预算失败`)
            return;
          }
          this.approval.balance = feeRes.data.balance || 0;
        }).catch();
      },
      initApproval(){
        this.approval =  {
          deptId: null,
          deptName: null,
          balance: 0,
          trip: {
            day: 1,
            title: '',
            cause: '',
            remark: ''
          },
          itineraries: [{
            tripWay: 1,
            trafficType: 0,
            depCity: '上海',
            depCityCode: '',
            depCityProvince: {
              code: '',
              name: '',
              index: ''
            },
            arrCity: '上海',
            arrCityCode: '',
            arrCityProvince: {
              code: '',
              name: '',
              index: ''
            },
            depDate: null,
            arrDate: null,
            day: 1,
          }],
          costcenter: {
            id: '',
            title: '',
          },
          invoice: {
            id: '',
            title: '',
          },
          cotravelers: [],
          approvalDepts: [],
        }

        if(this.departmentLists.length) {
          this.approval.deptId = this.departmentLists[0].deptId;
          this.approval.deptName = this.departmentLists[0].deptName;
        }
      },
      showSelectDept() {
        if (this.departments.length <= 1) {
          return;
        }
        this.deptSelectShow = true;
      },
      selectDept(deptName, index) {
        this.approval.deptId = this.departmentLists[index].deptId;
        this.approval.deptName = this.departmentLists[index].deptName;
        this.deptSelectShow = false;
        this.getApprovalDepts();
        this.getBalance(this.approval.deptId)
      },

      showSelectTripWay(index) {
        this.itineraryIndex = index || 0;
        this.tripWaySelectShow = true;
      },

      selectTripWay(tripWayName, index) {
        this.approval.itineraries[this.itineraryIndex].tripWay = index;
        this.tripWaySelectShow = false;
      },

      showSelectTraffic(index) {
        this.itineraryIndex = index || 0;
        this.trafficShow = true;
      },

      selectTraffic(trafficName, index) {
        this.approval.itineraries[this.itineraryIndex].trafficType = index;
        this.trafficShow = false;

        this.trafficType = index;

        this.approval.itineraries[this.itineraryIndex].depCity = '';
        this.approval.itineraries[this.itineraryIndex].arrCity = '';
        this.getAreaLists();
      },

      async getAreaLists(type) {
        let res = await this.$http.get(`/ec/api/area?type=${type || this.trafficType}`);
        let data = res.data;
        if (data.errcode === 0) {
          this.areaList = data.data;
        }
      },

      async showCity(index, areaPickType = 'depCity') {
        this.itineraryIndex = index || 0;

        this.areaPickType = areaPickType;
        let it = this.approval.itineraries[index];
        this.activeArea = it[`${areaPickType}Code`] || this.defaultArea[this.trafficType]
        if(it.trafficType !== this.trafficType) {
          await this.getAreaLists(it.trafficType)
        }        
        this.areaShow = true;
      },

      pickCity(area) {
        let it = this.approval.itineraries[this.itineraryIndex];
        it[this.areaPickType] = area.text;
        it[`${this.areaPickType}Code`] = area.id;
        this.areaShow = false;
      },

      showDatePicker(index, datePickType = 'depDate') {
        this.itineraryIndex = index || 0;
        this.datePickType = datePickType;
        this.datePickerShow = true;
      },

      pickDate() {
        let date = new Date(this.timeSelected);
        let it = this.approval.itineraries[this.itineraryIndex];
        it[this.datePickType] = date;
        if(it.arrDate && (it.arrDate < it.depDate)) {
          this.$toast('结束时间不得小于开始时间')
          it.arrDate = it.depDate;
        }

        this.datePickerShow = false;

        it.day = this.parseTripDay(this.itineraryIndex)

        this.computeTripDay()
      },
      parseDateStr(date) {
        if (!date) {
          return '';
        }
        date = new Date(date);
        return `${date.getFullYear()}年${date.getMonth() +1}月${date.getDate()}日`
      },

      parseTripDay(index) {
        let it = this.approval.itineraries[index]
        if(!it.depDate || !it.arrDate) {
          return 1
        }

        return Math.abs(Math.ceil((it.arrDate.setHours(23) - it.depDate.setHours(0)) / (24 * 60 * 60 * 1000)))
      },

      addItinerary() {
        this.approval.itineraries.push({
          tripWay: 1,
          trafficType: 0,
          depCity: '上海',
          depCityCode: '',
          arrCity: '上海',
          arrCityCode: '',
          depDate: null,
          arrDate: null,
          day: 1
        })
      },

      deleteItinerary(index) {
        this.$delete(this.approval.itineraries, index);
        this.computeTripDay()
      },

      computeTripDay() {
        let small = null;
        let big = null;
        for(let it of this.approval.itineraries) {
          if(!small) {
            small = it.depDate;
          }
          if(!big) {
            big = it.depDate;
          }
          if(it.depDate && it.depDate < small) {
            small = it.depDate;
          }
          if(it.arrDate && it.arrDate < small) {
            small = it.arrDate;
          }

          if(it.depDate && it.depDate > big) {
            big = it.depDate;
          }
          if(it.arrDate && it.arrDate > big) {
            big = it.arrDate;
          }
        }
        if(!big || !small) {
          this.approval.trip.day = 1;
          return;
        }
        this.approval.trip.day = Math.abs(Math.ceil((big.setHours(23) - small.setHours(0)) / (24 * 60 * 60 * 1000)))
      },

      addCotraveler() {
        this.approval.cotravelers.push({
          userId: '',
          userName: '',
          deptId: '',
          deptName: '',
        })
      },

      deleteTraveler(index) {
        this.$delete(this.approval.cotravelers, index)
      },

      async selectTraveler(index) {
        this.travelerIndex = index || 0;
        if (!this.staffLists.length) {
          let res = await this.$http.get('/ec/api/staffs/depts');
          let resData = res.data;
          if (resData.errcode !== 0) {
            return;
          }
          this.staffLists = resData.data || [];
        }
        this.travelerShow = true;
      },

      onNavClick(index) {
        this.travelActiveIndex = index;
      },

      pickTraveler(staff) {
        this.approval.cotravelers[this.travelerIndex] = staff;

        this.travelerShow = false;
      },

       navArea(index) {
        this.areaActiveIndex = index;
      },

      appendBudget() {
        this.$http.post('/ec/api/approvals/append', this.approval).then(res => {
          if(res.data.errcode === 0) {
            this.$toast('已提交追加部门预算申请');
            this.initApproval();
            return;
          }
          this.$toast('追加部门预算申请失败，请联系管理员');
        })
      },

      saveApproval() {
        let flag = true;
        let approval = this.approval;
        if(!approval.deptId) {
          flag = false;
        }
        if(!approval.trip.day || !approval.trip.cause) {
          flag = false;
        }
        let itineraries = approval.itineraries || []
        if(!itineraries.length) {
          flag = false;
        }
        for(let it of itineraries) {
          if(!it.depCity || !it.arrCity || !it.depDate || !it.arrDate) {
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

        if(!approval.costcenter.id) {
          this.$toast('申请失败，您没有商旅成本中心');
          return;
        }

        if(!approval.invoice.id) {
          this.$toast('申请失败，您没有商旅发票抬头');
          return;
        }
        
        if(this.approval.approvalId) {
          this.updateApproval();
          return;
        }
        
        this.createApproval();
      },

      updateApproval() {
        this.$http.put(`/ec/api/approvals/${this.approval.approvalId}`,this.approval).then(res => {
          let approvalRes = res.data;
          
          if(approvalRes.errcode ===0) {
            this.$toast('出差申请单修改成功');
            return;
          }
          this.$toast('出差申请修改失败，请重新填写或者联系管理员');
        })
      },

      createApproval() {
        let that = this;
        if(this.approval.balance <= 0) {
          this.$dialog.confirm({
            message: '部门预算不足，是否申请追加预算',
          }).then(() => {
            return this.appendBudget();
          }).catch(() =>{
            this.$toast('已取消申请追加预算');
          })
          return;
        }

        this.$http.post('/ec/api/approvals',this.approval).then(res => {
          let approvalRes = res.data;
          
          if(approvalRes.errcode ===0) {
            this.$toast('出差申请单填写成功，请等待领导审批');
            that.$router.push({name: 'apply', query: {id: approvalRes.data.approvalId}})
            // this.initApproval();
            return;
          }
          this.$toast('出差申请单填写失败，请重新申请或者联系管理员');
        })
      },

      pickCostCenter(title, index) {
        let costcenterLists = this.$store.state.user.costcenters;
        this.approval.costcenter = {
          id: costcenterLists[index].id,
          title: costcenterLists[index].title 
        }
        this.costcenterShow = false;
      },

      pickInvoice(title, index) {
        let invoiceLists = this.$store.state.user.invoices;
        this.approval.invoice = {
          id: invoiceLists[index].id,
          title: invoiceLists[index].title 
        }
        this.invoiceShow = false;
      },

      async getApprovalDepts2(approvalDepts) {
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

      async getApprovalDepts() {
        if(!this.approval.deptId) {
          return;
        }

        this.$http.get(`/ec/api/depts/approval/${this.approval.deptId}`).then(res => {
          let resData = res.data;
          let approvalDepts = [];
          if(resData.errcode === 0) {
            approvalDepts = resData.data || []
          }
          this.approval.approvalDepts = approvalDepts;

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
        }).catch(() => {})
      },

      getApproval(approvalId) {
        this.$http.get(`/ec/api/approvals/${approvalId}`).then(res => {
          let data = res.data;
          if (data.errcode !== 0) {
            this.$toast(data.errmsg)
            return;
          }
            this.approval = data.data;
            this.getApprovalDepts2(this.approval.approvalDepts);
        }).catch(() =>{
          this.$toast('获取申请单失败')
        })
      },
    },
    created() {
      if(!this.$store.state.user) {
        this.$router.push({name: 'me'})
        return;
      }
      let user = this.$store.state.user;

      let departments = user.departments || [];
      for (let department of departments) {
        this.departments.push(department.deptName)
      }
      this.departmentLists = departments;

      for(let item of user.costcenters) {
        this.costcenters.push(item.title);
      }
      for(let item of user.invoices) {
        this.invoices.push(item.title);
      }

      if(this.$route.query.id) {
        this.getApproval(this.$route.query.id);
      } else {
        this.initApproval();        
        this.getBalance()

        this.approval.userId = user.userId;
        this.approval.userName = user.userName;
        this.approval.deptId = departments[0].deptId;
        this.approval.deptName = departments[0].deptName;
        if(user.costcenters.length) {
          this.approval.costcenter = {
            id: user.costcenters[0].id,
            title: user.costcenters[0].title
          }
        }
        if(user.invoices.length) {
          this.approval.invoice = {
            id: user.invoices[0].id,
            title: user.invoices[0].title
          }
        }
        this.getApprovalDepts();
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

  .icon-btn {
    font-size: 18px;
  }
</style>