<template>
  <div>
    <div slot="header" class="clearfix">
      <!-- 头部 -->
      <div class="header">
        <span>销售额类别占比</span>
        <!-- 单选导航 -->
        <el-radio-group v-model="radio1" size="mini" @input="online(radio1)">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
      <!-- 饼图 -->
      <div class="echarts" ref="echarts"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
export default {
  name: 'Category',
  data() {
    return {
      radio1: '全部渠道',
      echarts: {}
    }
  },
  computed: {
    ...mapGetters(['saleRank']) , 
    onlineNameArr() {
      return this.saleRank.online.name
    } , 
    onlinevalArr() {
      return  this.saleRank.online.value
    } , 
    shopNameArr() {
      return this.saleRank.shop.name
    } , 
    shopValArr() {
      return this.saleRank.shop.value
    }   
  },
  methods: {
    online(radio) {
      let arr = []
      let arr2 = []
      let result
      this.onlineNameArr.forEach((item, index) => {
        arr.push({ value: this.onlinevalArr[index], name: item })
        arr2.push({ value: this.shopValArr[index], name: this.shopNameArr[index] })
      })
      if (radio === '全部渠道') {
        result = [
          { value: 1048, name: '视频' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
      if (radio === '线上') {
        result = arr
      }
      if (radio === '门店') {
        result = arr2
      }
      this.echarts.setOption({
        series: [
          {
            data: result
          }
        ]
      })
    },
  },
  mounted() {
    // saleRank online shop
    this.echarts = echarts.init(this.$refs.echarts)
    this.echarts.setOption({
      title: {
        text: '视频',
        subtext: 1048,
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outsize'
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '视频' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    this.echarts.on('mouseover', params => {
      const { value, name } = params
      this.echarts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  // background: red;
  position: relative;
  top: -5px;
  padding-bottom: 11px;
}

.echarts {
  width: 100%;
  height: 500px;
  // margin: 0 auto;
}
</style>