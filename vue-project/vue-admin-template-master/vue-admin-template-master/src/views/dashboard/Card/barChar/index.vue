<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from "echarts"
import home from '@/store/modules/home'

export default {
  name: 'barChar',
  data() {
    return {
      echarts: {}
    }
  },
  async mounted() {
    let result = await home.actions.getDate2()
    if (result.code === 20000) {
      // 初始化charts实例
      this.echarts = echarts.init(this.$refs.charts)
      // 配置数据
      this.echarts.setOption({
        xAxis: {
          show: false,
          type: 'category'
        },
        yAxis: {
          show: false
        },
        //系列
        series: [
          {
            type: 'bar',
            data: result.data.payTrend
          }
        ],
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        // 提示信息
        tooltip: {}
      })
    }
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>