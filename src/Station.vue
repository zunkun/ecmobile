<template>
  <div id="station">
    <div class="s-h">
      <van-search
        v-model="keywords"
        placeholder="中文/拼音/首字母"
        :show-action="true"
        @input="onSearch"
        @search="onSearch"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    </div>
    <van-index-bar :index-list="indexList" v-if="!inSearch">
      <van-index-anchor index="历史" class="p-label2">历史</van-index-anchor>
      <div class="p-content">
        <van-row>
          <van-col span="6" v-for="(city, $cityIndex) in hiscities" :key="'city-' + $cityIndex">
            <van-button type="info" color="#1989fa" size="small" plain :text="city" class="h-btn" @click="pickCity(city)" />
          </van-col>
        </van-row>  
      </div>
      <van-index-anchor index="热门" class="p-label2">热门城市</van-index-anchor>
      <div class="p-content">
        <van-row>
          <van-col span="6" v-for="(city, $cityIndex) in hotcities" :key="'city-' + $cityIndex">
            <van-button type="info" color="#1989fa" size="small" plain :text="city" class="h-btn" @click="pickCity(city)" />
          </van-col>
        </van-row>  
      </div>

      <div v-for="(lists, letter) in cityLists" :key="'cityLists-' + letter">
        <van-index-anchor :index="letter" class="p-label">{{letter}}</van-index-anchor>
          <div class="p-content">
            <div v-for="(city, $cityIndex) in lists" :key="'city-' + letter + $cityIndex" class="s-lists" @click="pickCity(city.city)">
              <div>
                {{city.city}} <span v-if="city.abbr" class="s-tip">{{city.abbr}}</span>
              </div>
            </div>  
        </div>
      </div>
    </van-index-bar>

    <div class="station-lists" v-if="inSearch">
      <div class="p-content">
            <div v-for="(city, $cityIndex) in searchCities" :key="'city-' + $cityIndex" class="s-lists" @click="pickCity(city.city)">
              <div>
                {{city.city}} <span v-if="city.abbr" class="s-tip">{{city.abbr}}</span>
              </div>
            </div>  
        </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'Station',
    props: ['trafficTypeId'],
    data() {
      return {
        keywords: '',
        cityName: '',
        inSearch: false,  // 是否在搜索状态
        indexList: ['历史', '热门'],
        hotcities: ['郑州','重庆', '天津', '西安', '广州', '深圳', '成都', '厦门', '长沙', '武汉', '昆明', '大连', '杭州','南京', '北京', '上海'],
        hiscities: [],
        cityLists: {},
        searchCities: [],
      }
    },
    methods: {
      onSearch() {
        let that = this;
        if(!this.keywords) {
          this.inSearch = false;
          this.searchCities = [];
          return;
        };
        this.inSearch = true;
        this.$http.get(`/ec/api/area/search?type=${this.trafficTypeId}&keywords=${this.keywords}`).then(res => {
          let resData = res.data;
          this.searchCities = [];
          if(resData.errcode !== 0) return;
          for(let key of Object.keys(resData.data)) {
          }
          this.searchCities = resData.data || [];
        });     
      },
      getLists() {
        let that = this;
        this.$http.get(`/ec/api/area/cities?type=${this.trafficTypeId}`).then(res => {
          let resData = res.data;
          if(resData.errcode !== 0) return;
          for(let key of Object.keys(resData.data)) {
            that.indexList.push(key);
          }
          this.cityLists = resData.data;
        });
      },
      initHis() {
        this.hiscities = JSON.parse(localStorage.getItem(`hiscities${this.trafficTypeId}`) || "[]");
        if(this.hiscities.length > 7) {
          this.hiscities.splice(7);
        }
      },
      addHis(name) {
        if(!this.hiscities) this.hiscities = [];

        if(this.hiscities.indexOf(name) > -1) return;

        if(this.hiscities.length > 7) {
          this.hiscities.splice(7);
        }
        this.hiscities.unshift(name);
        localStorage.setItem(`hiscities${this.trafficTypeId}`, JSON.stringify(this.hiscities));
      },
      pickCity (city) {
        this.inSearch = false;
        this.keywords = '';
        this.searchCities = [];
        this.cityName = city;
        this.addHis(this.cityName);
        this.$emit('closepage', this.cityName)
      },
      goBack () {
        this.inSearch = false;
        this.keywords = '';
        this.searchCities = [];
        this.$emit('closepage', this.cityName)
        history.pushState(null, null, document.URL);
      },
    },
    created() {
      this.trafficTypeId = this.trafficTypeId || 0;
      this.getLists()
      this.initHis()
    },
    mounted () {      
      if (window.history && window.history.pushState) {
        // 向历史记录中插入了当前页
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }
    },
    destroyed () {
      window.removeEventListener('popstate', this.goBack, false);
    },
    watch: {      
      trafficTypeId(newVal,oldVal) {
        this.getLists();
        this.initHis()
        return newVal;
      }
    }
  }
</script>

<style scoped>
  #station {
    /* background-color: hsl(0, 0%, 96%); */
    overflow: auto;
    padding: 0px;
    color: #000;
    min-height:100vh;
    height: 300px;
    width: 100vw;
  }

  .p-content {
    padding: 0px 16px;
    
  }
  .my-panel {
    padding: 10px;
  }

  .h-btn {
    width: 90%;
    margin-bottom: 6px;
    margin-right: 10px;
  }

  .s-lists {
    border-bottom: 1px solid #ddd;
    padding: 7px 0px;
  }
  .s-tip {
    color: #ccc;
    font-size:12px;
  }  

  .p-label {
    border-bottom: 1px solid #ccc;
    margin: 0px 14px;
  }
  .p-label2 {
    margin: 0px 14px;
  }
</style>

<style>
  .van-search__content {
    border: #1989fa 1px solid !important;
  }
  .van-index-anchor {
    color: #1989fa;
    padding: 0px !important;
  }
</style>