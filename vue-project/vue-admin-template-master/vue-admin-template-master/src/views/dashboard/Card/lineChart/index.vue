<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from "echarts"
import home from '@/store/modules/home'
export default {
  name: 'lineChart',
  data() {
    return {
      myecharts: {}
    }
  },
  async mounted() {
    let result = await home.actions.getDate2()
    if (result.code === 20000) {
      // 初始化charts实例
      this.myecharts = echarts.init(this.$refs.charts)
      // 配置数据
      this.myecharts.setOption({
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
            type: 'line',
            data: result.data.visitTrend ,
            // 拐点样式的设置
            itemStyle: {
              opacity: 0
            },
            //线条的样式
            lineStyle: {
              color: "purple"
            },
            // 填充颜色设置
            areaStyle: {
              color: { // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'purple' // 0% 处的颜色
                }, {
                  offset: 1, color: '#fff' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
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