<template>
  <div>
    <div slot="header" class="clearfix">
      <span>线上热门搜索</span>
      <el-dropdown>
        <span>
          <i class="el-icon-more"></i>
        </span>
        <!-- 菜单列表 -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-row :gutter="10">
      <el-col :span="12">
        <!-- 图表 -->
        <lineEcharts />
      </el-col>
      <el-col :span="12">
        <!-- 图表 -->
        <lineEcharts />
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table border style="width: 100%" :default-sort="{ prop: 'date', order: 'descending' }">
      <el-table-column prop="date" width="80" type="index" label="排名">
      </el-table-column>
      <el-table-column prop="date" label="搜索关键字" width="180">
      </el-table-column>
      <el-table-column prop="date" label="用户数" sortable>
      </el-table-column>
      <el-table-column prop="name" label="周涨幅" sortable>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :page-size="20"
      :pager-count="11"
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>
  </div>
</template>

<script>
import lineEcharts from './lineEcharts'
export default {
  name: 'Search',
  components: {
    lineEcharts
  },
  formatter(row, column) {
    return row.address
  }
}
</script>

<style lang="scss" scoped>
.clearfix {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  display: flex;
}

.el-dropdown {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-table {
  margin-top: 20px;
}
.el-pagination {
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
}
</style>