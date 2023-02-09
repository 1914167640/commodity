<template>
  <el-form :inline="true" class="demo-form-inline" :model="form">
    <!-- 一级分类 -->
    <el-form-item label="一级分类">
      <el-select placeholder="请选择" v-model="form.category1Id" @change="handler1" :disabled="selectFlag">
        <el-option :label="class1.name" :value="class1.id" v-for="class1 in classify1" :key="class1.id"></el-option>
      </el-select>
    </el-form-item>
    <!-- 二级分类 -->
    <el-form-item label="二级分类">
      <el-select placeholder="请选择" v-model="form.category2Id" @change="handler2" :disabled="selectFlag">
        <el-option :label="class2.name" :value="class2.id" v-for="class2 in classify2" :key="class2.id"></el-option>
      </el-select>
    </el-form-item>
    <!-- 三级分类 -->
    <el-form-item label="三级分类">
      <el-select placeholder="请选择" v-model="form.category3Id" @change="handler3" :disabled="selectFlag">
        <el-option :label="class3.name" :value="class3.id" v-for="class3 in classify3" :key="class3.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name : 'categorySelect' , 
  props : ['selectFlag'] , 
  data() {
    return {
      classify1 : [] , //一级分类数组
      classify2 : [] , //二级分类数组
      classify3 : [] , //三级分类数组
      form : {
        category1Id : '' , //一级id
        category2Id : '' , //二级id
        category3Id : ''//三级id
      }
    }
  } , 
  methods: {
    handler1() { //一级分类状态改变时
      let { category1Id } = this.form
      this.form.category2Id = ''
      this.form.category3Id = ''
      this.classify3 = []
      this.$emit('clearAttrList') 
      this.$API.attr.reqGetCategory2(category1Id).then( result => this.classify2 = result.data )// 二级分类
    } , 
    handler2() { //二级状态改变时
      let { category2Id } = this.form
      this.form.category3Id = ''
      this.$emit('clearAttrList') //清空attru组件的数组
      this.$API.attr.reqGetCategory3(category2Id).then( result => this.classify3 = result.data )// 二级分类
    } , 
    handler3() { //三级状态发生改变时
      this.$emit('getCategoryId' , this.form)
    } 
  },
  mounted() {
    this.$API.attr.reqGetCategory1().then( result => this.classify1 = result.data )// 一级分类
  }
}
</script>

<style>
  .el-form{
   
  }
</style>