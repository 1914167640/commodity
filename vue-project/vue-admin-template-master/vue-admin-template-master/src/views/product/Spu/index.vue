<template>
  <div>
    <!-- 卡片一 -->
    <el-card style="margin: 20px 0px;">
      <!-- 三级联动选择框 -->
      <categorySelect @getCategoryId="getCategoryId" :selectFlag="selectFlag"/>
    </el-card>
    <!-- 卡片二 -->
    <el-card>
      <!-- 底部这三个是要切换的 -->
      <!-- spu列表 -->
      <div v-show = "flag === 'spuList'">
        <!-- 添加spu按钮 -->
        <el-button type="primary" size="default" icon="el-icon-plus" @click="addSpu()" :disabled="!category3Id">添加spu</el-button> 
          <!-- spu表格 -->
          <el-table style="width: 100%" :data="records" border>
            <!-- 序号 -->
            <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
            <!-- spu名称 -->
            <el-table-column label="spu名称" prop="spuName"></el-table-column>
            <!-- spu描述 -->
            <el-table-column label="spu描述" prop="description"></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button type="success" size="mini" icon="el-icon-plus" title="添加" @click="addShiLi(row)"></el-button>
                <el-button type="warning" size="mini" icon="el-icon-edit" title="修改" @click="updateSpu(row)"></el-button>
                <el-button type="info" size="mini" icon="el-icon-info" title="查看当前spu全部sku列表" style="margin-right: 10px;" @click="getSkuList(row)"></el-button>
                <el-popconfirm :title="`是否删除${row.spuName}`" @onConfirm="deleteSpu(row)">
                  <el-button type="danger" size="mini" icon="el-icon-delete" title="删除spu" slot="reference"></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        <!-- 分页器 -->
        <el-pagination
          @current-change="getDate"
          @size-change="sizeChange"
          :current-page.sync="page"
          :page-sizes="[ 3 , 5 , 10 ]"
          :page-size="limit"
          layout= "prev , pager, next , jumper , -> , sizes"
          :total="total" 
          background
          class="pagination">
        </el-pagination>        
      </div>
      <!-- 添加spu和修改spu共用-->
      <spuForm v-show = "flag === 'addOrUpdateSpu'" @Cancel="Cancel" ref="spuForm"/>
      <!-- 添加spu实例 -->
      <skuForm v-show = "flag === 'addShili'" @Cancel="Cancel" ref="skuForm"/>
    </el-card>
    <!-- sku列表 -->
    <el-dialog :title="`${spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="handleClose">
      <el-table :data="skuList" style="width: 100%;" v-loading="loading" border>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import spuForm from './SpuForm'
import skuForm from './SkuForm' 

export default {
  name : 'spu' , 
  components : {
    spuForm , 
    skuForm
  } , 
  data() {
    return {
      records : [] , // spuList
      page : 1 , //当前页数
      limit : 3 , //每页数据
      total : 0 , //总数据
      selectFlag : false , //控制三级联动能否使用
      dialogTableVisible : false , //对话框的显示与隐藏
      loading: true , 
      skuList : [] , //sku列表 
      spuName : '' , //spu名字
      /**
       * flag表示页面切换状态
       * spuList : spu列表
       * addOrUpdateSpu: 添加或修改类
       * addShili : 添加实例
       */
      flag : 'spuList' , 
      category3Id : '' ,  //三级分类id
      category2Id : '' , //二级分类id
      category1Id : ''  ,  //三级分类id
    }
  },
  methods: {
    // //获取三级联动的id
    getCategoryId( { category1Id , category2Id , category3Id } ) { 
      this.category3Id = category3Id //把三级id传给data
      this.category2Id = category2Id //把二级id传给data
      this.category1Id = category1Id //把一级id传给data
      this.getDate()
    } , 
    // 更新数据
    getDate(page=1) { //获取spu列表数据
      let { limit , category3Id } = this
      this.page = page
      this.$API.spu.reqGetSpuList(page , limit , category3Id)
      .then( result => { 
        this.records = result.data.records 
        this.total = result.data.total
      })
    } , 
    // 更新limit
    sizeChange(limit) {
      this.limit = limit
      this.getDate()
    } ,
    // 添加spu 
    addSpu() {
      this.flag = 'addOrUpdateSpu' //页面切换成addOrUpdateSpu
      this.selectFlag = true //禁用三级联动框
      this.$refs.spuForm.addSpuData(this.category3Id) //点击添加按钮清空spu表单数据
    } , 
    // 修改spu
    updateSpu(row) {
      this.flag = 'addOrUpdateSpu' //去修改页
      this.selectFlag = true //禁用三级联动框
      this.$refs.spuForm.initSpuData(row) //向子组件spuForm传递数据
    } , 
    //删除spu
    deleteSpu(row) {
      this.$API.spu.reqDeleteSpu(row.id)
      .then(() => {
        this.$message.success('删除成功')
        this.getDate( this.records.length > 1 ? this.page : this.page - 1) //更新数据
      })
      .catch(err => console.log(err)) 
    } , 
    // 添加spu实例
    addShiLi(row) {
      this.flag = 'addShili' //去添加实例
      this.selectFlag = true //禁用三级联动框
      this.$refs.skuForm.getDate(this.category1Id , this.category2Id ,  row)
    } ,
    // 获取sku实例
    async getSkuList(row) {
      this.dialogTableVisible = true //显示对话框
      this.spuName = row.spuName //获取spu名称
      let result = await this.$API.spu.reqSkuList(row.id) //获取sku列表
      if(result.code === 200) {
        this.skuList = result.data
        this.loading = false //隐藏loading
      }
    } , 
    // 对话框将要关闭时
    handleClose(done) {
      this.loading = true //显示loading
      this.skuList = [] //解决数据回显
      done()
    } , 
    // 取消按钮 
    Cancel(flag , isPage) {
      this.flag = flag //返回列表页
      this.selectFlag = false //显示三级联动框
      this.getDate(isPage || this.page) //如果isPage是1 , 则是添加页 ， 否则是修改页
    } 
  }
}
</script>
<style>
  body {
    margin: 0;
  }
  .pagination {
    text-align: center;
  }
</style>