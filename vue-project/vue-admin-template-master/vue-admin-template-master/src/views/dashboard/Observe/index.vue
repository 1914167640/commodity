<template>
  <div class="box">
    <el-row :gutter="30">
      <el-col :span="12">
        <el-card>
          <!-- search组件 -->
          <Search />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <!-- Category组件 -->
          <Category />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from './Category'
import Search from './Search'

export default {
  name: 'Observe',
  components: {
    Category,
    Search
  }
}
</script>

<style lang="scss" scoped>
.box {
  margin-top: 12px;
}
</style>