<template>
  <div id="budgetdetail">
    <FormBasic :application="application" />
    <div class="button-area" v-if="application.id">
      <van-row gutter="20">
        <van-col span="12">
          <van-button block type="danger" plain @click="cancelApplication" >撤 销</van-button>
        </van-col>
        <van-col span="12">
          <van-button block type="primary" plain :to="{name: 'applybudget', query: {id: application.id}}">修 改</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import FormBasic from '../../components/Application/FormBasic.vue';

export default {
  name: 'budgetdetail',
  components: { FormBasic },
  data() {
    return {
      application: {
        group: {}
      },
    }
  },
  methods: {
    getApplication() {
      if(!this.$route.query.id) {
        return;
      }
      this.$http.get(`/ec/api/applications/${this.$route.query.id}`).then(res => {
        let resData = res.data;
        if(resData.errcode === 0) {
          this.application = resData.data;
          return;
        }
        this.$toast.fail('获取费用申请单失败');
      })
    },

    cancelApplication() {
      
    }
  },
  created() {
    this.getApplication()
  }
}
</script>

<style>

</style>

