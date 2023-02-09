<template>
  <div>
    <!-- 卡片一 -->
    <el-card style="margin: 20px 0px;">
      <!-- 平台属性分类 -->
      <categorySelect @getCategoryId="getCategoryId" @clearAttrList="clearAttrList" :selectFlag="!flag"/>
    </el-card>
    <!-- 卡片2 -->
    <el-card>
      <div v-show="flag">
        <!-- 添加属性 -->
        <el-button type="primary" size="default" icon="el-icon-plus" v-show="flag" @click="addAttr" :disabled="!category3Id">添加属性</el-button>
        <!-- 平台属性展示表格 -->
        <el-table style="width: 100%" border :data="attrList">
          <!-- 序号 -->
          <el-table-column
            type="index"
            label="序号"
            width="90"
            align="center">
          </el-table-column>
          <!-- 属性名称 -->
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="180">
          </el-table-column>
          <!-- 属性列表 -->
          <el-table-column 
            label="属性列表">
            <template slot-scope="{row}">
              <el-tag type="success" v-for="attr in row.attrValueList" :key="attr.id" style="margin-right: 12px;margin-bottom: 12px;">{{attr.valueName}}</el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="{row}">
              <!-- 修改按钮 -->
              <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateAttr(row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr(row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!flag">
        <!-- 请输入属性名 -->
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item>
             <el-input placeholder="请输入属性名" ref="attrValue" v-model.trim = "attrInfo.attrName" @blur="attrNameInp(attrInfo.attrName)"></el-input>
          </el-form-item>      
        </el-form>
        <!-- 添加属性值 -->
        <el-button type="primary" size="default" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>           
        <!-- 取消 -->
        <el-button size="default" @click = "flag = true">取消</el-button>
        <!-- 添加或修改表格-->
        <el-table border :data="attrInfo.attrValueList" style="width: 100%; margin: 20px 0px;" >
          <!-- 序号 -->
          <el-table-column 
            type="index"
            label="序号"
            width="90"
            align="center">
          </el-table-column>
          <!-- 属性值名称 -->
          <el-table-column 
            label="属性值名称"
            align="left">
            <template slot-scope="{row}">
              <el-input ref="attrName" v-model.trim = "row.valueName" clearable  size="mini" v-if="row.flag" @blur="blurInp(row)" @keyup.native.enter="row.flag = false"></el-input>
              <div v-else @click="toRedact(row)">{{row.valueName}}</div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            label="操作"
            align="left">
            <template slot-scope="{row , $index}">
              <el-popconfirm :title="`是否删除属性值 ${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" size="mini" icon="el-icon-delete" slot="reference"></el-button>
              </el-popconfirm>
            </template>    
          </el-table-column>
        </el-table>
        <!-- 保存 -->
        <el-button type="primary" :disabled="!attrInfo.attrValueList.length" @click="save">保存</el-button>
        <!-- 取消 -->
        <el-button @click="flag = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入lodash的深拷贝
import  cloneDeep from 'lodash/cloneDeep' 
export default {
  name : 'attr' , 
  data() {
    return {
      attrList : [] , //属性列表数组
      flag : true , //切换页面的状态
      category3Id : '' , //三级分类id
      category2Id : '' , //二级分类id
      category1Id : '' , //二级分类id
      // 收集新增属性 | 修改属性使用的
      attrInfo : { //传送给服务器的对象
        attrName: "" , //属性名
        attrValueList : [] ,//属性值 , 因为属性值有多个 , 因此可以用数组
        categoryId : 0 , //三级分类id
        categoryLevel : 3 , //服务器需要知道这是几级分类
      } 
    } 
  },
  methods: {
    // 更新数据
    getData(category1Id , category2Id , category3Id) { 
      this.$API.attr.reqAttrInfoList( category1Id , category2Id , category3Id) //获取属性列表数据
      .then( result => this.attrList = result.data )   
    } , 
    // 清空数组
    clearAttrList() {
      this.attrList = []
      this.category3Id = ''
    } , 
    // 获取属性列表
    getCategoryId( { category1Id , category2Id , category3Id } ) {
      this.getData(category1Id , category2Id , category3Id) //更新数据
      this.category3Id = category3Id //把三级id传给data
      this.category2Id = category2Id //把二级id传给data
      this.category1Id = category1Id //把一级id传给data
    } ,
    // 修改按钮
    updateAttr(row) {
      this.flag = false
      // 由于数据的结构比较复杂 , 套娃太多 , 使用lodash的深拷贝 
      this.attrInfo = cloneDeep(row) //把列表页遍历的当前商品属性传给修改界面
      this.attrInfo.attrValueList.forEach( item => this.$set( item , 'flag' , false) ) //添加响应式数据控制inp隐藏
    } , 
    // 添加属性
    addAttr() {
      // 解决回显问题
      this.attrInfo.attrName = '' //清空属性名
      this.attrInfo.attrValueList = [] //清空数组
      this.flag = false 
      if(this.attrInfo.id) delete this.attrInfo.id //因为修改时会返回一个id ，要及时清楚这个id
      this.$nextTick(() => this.$refs.attrValue.focus() )  
    } , 
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId : undefined , //属性名id
        valueName : '' , 
        flag : true //input和span的切换状态 
      }) 
      this.$nextTick( () => this.$refs.attrName.focus() ) //页面异步加载完成时自动聚焦
    } , 
    // 删除属性
    deleteAttr(attrId) {
      let { category1Id , category2Id , category3Id } = this
      this.$confirm('是否删除该属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let result = await this.$API.attr.reqDeleteAttr(attrId) //删除数据
        if ( result.code === 200 ) { 
          this.$message.success('删除成功')
          this.getData(category1Id , category2Id , category3Id) //更新数据
        }
      }).catch( () => this.$message('已取消删除') )
    } , 
    // 删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index , 1)
    } ,
    // 输入属性值的input框失去焦点时 
    attrNameInp(attrName) {
      if( !attrName.trim() ) {
        this.$message('请输入一个属性')
        return
      }
      if (attrName.length < 2 || attrName.length > 10) { //输入的字符必须在3~10
        this.$message('输入的字符必须在2~10')
        return
      }
    } , 
    // attrValueList的input失去焦点时
    blurInp(row) {
      if ( !row.valueName.trim() ) { //如果输入的框首尾有空格
        this.$message('请输入一个属性值') 
        return // 结束这个函数 , 阻止inp隐藏
      }
      if (row.valueName.length < 2 || row.valueName.length > 10) { //输入的字符必须在3~10
        this.$message('输入的字符必须在2~10')
        return
      }
      // 方法二:
      let result = this.attrInfo.attrValueList.some( item => {
        if(row !== item) {// 排除自己
          return row.valueName === item.valueName
        } 
      })    
      if(result) {
        this.$message('属性名不能重复')
        return
      }
      方法一:
      // try {
      //   //不能输入重复的值
      //   this.attrInfo.attrValueList.forEach( (item , index , attrValueList) => {
      //     if(index > 0) { //第一次不用判断
      //       if( row.valueName === attrValueList[index - 1].valueName ) { //除了自身以外都要判断
      //         this.$message('不能输入同一个属性值')
      //         throw Error() 
      //       }
      //     }
      //   })
      // } catch (e) {
      //   return //退出函数
      // }
      row.flag = false //隐藏input
    } , 
    // 编辑时自动聚焦
    toRedact(row) {
      row.flag = true
      this.$nextTick( () => this.$refs.attrName.focus() ) //页面异步加载完成时自动聚焦
    } , 
    // 保存发送到服务器
    save() {
      this.attrInfo.categoryId = this.category3Id //获取三级id
      let { attrInfo , category1Id , category2Id , category3Id } = this //结构赋值
      let result = this.attrInfo.attrValueList.some( item => item.flag === true )//如果attrValueList的input依然处于聚焦状态

      if (result || this.attrInfo.attrName.length < 2 || this.attrInfo.attrName.length > 10 ) { 
        this.$message('保存失败')
      } else {
        this.attrInfo.attrValueList.forEach( item => delete item.flag ) //删除服务器不需要的flag参数
        this.$API.attr.reqSaveAttrInfo(attrInfo) //请求服务器
        .then(() => { 
          this.$message.success('保存成功') 
          this.flag = true //返回属性列表页面
          this.getData(category1Id , category2Id , category3Id) //更新数据
        })
      }
    } 
  } 
}
</script>

<style>
  .hide {
    display: none;
  }
</style>