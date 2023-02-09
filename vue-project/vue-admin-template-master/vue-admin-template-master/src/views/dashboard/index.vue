<template>
  <div class="dashboard-container">
    <!-- 显示顶部card的组件 -->
    <Card/>
    <!-- 显示中间sale的组件 -->
    <Sale/>
    <!-- 显示底部 -->
    <Observe/>
  </div>
</template>

<script>
import Card from './Card'
import Observe from './Observe'
import Sale from './Sale'
export default {
  name: 'Dashboard' , 
  components : {
    Card , 
    Sale ,
    Observe
  }
}
</script>

<style lang="scss" scoped>
// .dashboard {
//   &-container {
//     margin: 30px;
//   }
//   &-text {
//     font-size: 30px;
//     line-height: 46px;
//   }
// }
</style>
