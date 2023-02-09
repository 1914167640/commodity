<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <svg data-v-7c31a34e="" t="1674998140781" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="1373" width="18" height="18" class="icon">
        <path data-v-7c31a34e=""
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          p-id="1374" fill="#8a8a8a"></path>
        <path data-v-7c31a34e="" d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="1375" fill="#8a8a8a">
        </path>
        <path data-v-7c31a34e=""
          d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" p-id="1376"
          fill="#8a8a8a"></path>
      </svg>
    </div>
    <div class="content">
      <span>12321</span>
      <span>17.1</span>
      <svg t="1675181040615" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4491" width="16" height="16">
        <path d="M512 187.24L699.501 512 887 836.76H137L324.5 512z" p-id="4492" fill="#d81e06"></path>
      </svg>
      <svg t="1675182784355" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="5567" width="20" height="20">
        <path d="M512 682.666667l298.666667-298.666667H213.333333z" fill="#1afa29" p-id="5568"></path>
      </svg>
    </div>
    <div class="echarts" ref="echarts"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  name: 'lineEcharts',
  mounted() {
    // 初始化charts实例
    let result = echarts.init(this.$refs.echarts)
    // 配置数据
    result.setOption({
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
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
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
</script>

<style lang="scss" scoped>
.header {
  margin-top: 20px;
  display: flex;

  >span {
    margin-right: 8px;
  }
}

.content {
  display: flex;
  margin-top: 10px;

  >span:first-child {
    font-size: 20px;
    margin-right: 30px;
  }

  >span:nth-child(2) {
    // color: #DCDFE6;
    // padding-top: 4px;
    align-self: center;
    margin-top: 2px;
  }

  .icon {
    align-self: center;
  }
}

.echarts {
  width: 100%;
  height: 100px;
}
</style>