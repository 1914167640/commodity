<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from "echarts";
import home from '@/store/modules/home'
export default {
  name: 'progressCharts',
  data() {
    return {
      echarts: {}
    }
  } ,
  async mounted() {
    let result = await home.actions.getDate2()
    if (result.code === 20000) {
      // 初始化charts实例
      this.echarts = echarts.init(this.$refs.charts)
      // 配置数据
      this.echarts.setOption({
        xAxis: {
          show: false ,
        },
        yAxis: {
          show: false,
          type: 'category'
        },
        //系列
        series: [
          {
            type: 'bar',
            data: [ result.data.activityRate ] ,
            barWidth: 10,
            color: 'yellowgreen',
            showBackground: true,
            backgroundStyle: {
              color: '#eee'
            },
            label: {
              show: true,
              formatter: '|',
              position: 'right'
            }
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