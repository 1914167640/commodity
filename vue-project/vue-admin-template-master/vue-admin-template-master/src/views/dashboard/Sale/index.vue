<template>
  <el-card style="margin-top: 10px;">
    <!-- 头部 -->
    <div class="header">
      <!-- 导航 -->
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
        <!-- 销售额 -->
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <!-- 访问量 -->
        <el-tab-pane label="访问量" name="second"></el-tab-pane>
      </el-tabs>
      <div class="block">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- 默认显示日期 -->
        <el-date-picker type="daterange" v-model="data" start-placeholder="开始日期" end-placeholder="结束日期"
          value-format="yyyy-MM-dd" format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']" size="mini"
          class="data">
        </el-date-picker>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :span="18">
        <!-- 柱状图 -->
        <div class="main" ref="main"></div>
      </el-col>
      <el-col :span="6">
        <!-- 门店销售名额 -->
        <h3>门店{{ listTitle }}排名</h3>
        <ul class="list" v-for="item in list" :key="item.no">
          <li class="item">
            <span :class="{ rindex: item.no <= 3 }">{{ item.no }}</span>
            <span>{{ item.name }}</span>
            <span>{{ item.money }}</span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
import mockRequest from '@/utils/mockRequest'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      listTitle: '销售额',
      data: [],
      myCharts: null ,
      saleInfo : {} ,
      list : []
    }
  } ,
  methods: {
    handleClick(tab) {
      let { saleInfo , myCharts , listTitle } = this
      listTitle = tab.label // 更新排名列表标题
      myCharts.setOption({ //更新图表标题
        title: {
          text: `${listTitle}趋势`
        }
      })
      myCharts.setOption({ //更新销售额的图表数据
        xAxis: listTitle === '销售额' ? [{ data: saleInfo.orderFullYearAxis }] : [{ data: saleInfo.userFullYearAxis }] ,
        series: listTitle === '销售额' ? [{ data: saleInfo.orderFullYear }] : [{ data: saleInfo.userFullYear }]
      })
      this.list = listTitle === '销售额' ? saleInfo.orderRank : saleInfo.userRank
    },
    // 今天时间
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.data = [day, day]
    },
    // 本周时间 
    setWeek() {
      const day = dayjs().day(1).format('YYYY-MM-DD') //星期一的时间
      const day2 = dayjs().day(7).format('YYYY-MM-DD') //获取星期日的时间
      this.data = [day, day2]
    },
    // 本月时间
    setMonth() {
      const day = dayjs().startOf('month').format('YYYY-MM-DD') //本月第一天
      const day2 = dayjs().endOf('month').format('YYYY-MM-DD') //本月最后一天
      this.data = [day, day2]
    },
    // 本年时间
    setYear() {
      const day = dayjs().startOf('year').format('YYYY-MM-DD') //本年第一天
      const day2 = dayjs().endOf('year').format('YYYY-MM-DD') //本年最后一天
      this.data = [day, day2]
    },
    async getData() {
      let result = await mockRequest.get('/home/list')
      if (result.code === 20000) {
        this.saleInfo = result.data //获取接口全部信息
        this.list = result.data.orderRank //获取销售额排名信息
        this.myCharts = echarts.init(this.$refs.main)
        this.myCharts.setOption({
          title: {
            text: `销售额趋势`
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.saleInfo.orderFullYearAxis,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '60%',
              data: this.saleInfo.orderFullYear,
              color: 'yellowgreen'
            }
          ]
        })
      }
    }
  },
  async mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;

  .block {
    position: absolute;
    top: 0px;
    right: 0px;

    span {
      margin: 0 20px;
    }

    .data {
      width: 300px;
      height: 30px;
      margin: 0 10px;
    }
  }

  .tabs {
    // margin-top: -10px;
    // width: 100%;
  }
}

.main {
  // background: red;
  width: 100%;
  height: 300px;
}

.list {
  list-style: none;
  padding: 0;

  .item {
    display: flex;
    margin: 10px 0;
    text-align: center;

    >span:first-child {
      width: 20px;
      height: 20px;
      display: inline-block;
    }

    >span:nth-child(2) {
      margin-left: 20px;
    }

    >span:nth-child(3) {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }

    .rindex {
      background: black;
      color: white;
      border-radius: 50%;
    }
  }
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2),
::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(3) {
  font-size: 18px;
}

::v-deep .el-date-editor--daterange.el-input__inner {
  height: 35px;
}
</style>