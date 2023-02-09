<template>
  <div>
    <!-- 卡片 -->
    <el-card >
      <!-- skuTable -->
      <el-table :data="skuList" border>
        <!-- 序号 -->
        <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
        <!-- 名称 -->
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <!-- 描述 -->
        <el-table-column label="描述" prop="skuDesc"></el-table-column>
        <!-- 默认图片 -->
        <el-table-column label="默认图片" align="center" width="110">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width: 90px;height: 90px;">
          </template>
        </el-table-column>
        <!-- 重量 -->
        <el-table-column label="重量(KG)" width="80" prop="price"></el-table-column>
        <!-- 价格 -->
        <el-table-column label="价格(元)" width="80" prop="weight"></el-table-column>
        <!-- 四个按钮 -->
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <!-- 上架-->
            <el-button type="info" size="mini" icon="el-icon-bottom" v-if="row.isSale === 0" @click="onSku(row)"></el-button>
            <!-- 下架 -->
            <el-button type="success" size="mini" icon="el-icon-top" v-else @click="CalcelSku(row)"></el-button>
            <!-- 修改 -->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="updateSku"></el-button>
            <!-- 查看 -->
            <el-button type="info" size="mini" icon="el-icon-info" @click="skuInfo(row)" style="margin-right: 10px;"></el-button>
            <!-- 删除 -->
            <el-popconfirm title="是否删除当前的sku?" @onConfirm="deleteSku(row)">
              <el-button type="danger" size="mini" icon="el-icon-delete" slot="reference"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="getDate"
        :current-page.sync="page"
        :page-sizes="[3 , 5 , 10]"
        :page-size="limit" 
        :total="total"
        layout= "prev , pager, next , jumper , -> , sizes" 
        background class="pagination">
      </el-pagination>     
    </el-card>
    <el-drawer :visible.sync="drawer" size="50%" :direction="direction" :show-close="false" :withHeader="false" >      
      <!-- 名称 -->
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{mySkuInfo.skuName}}</el-col>
      </el-row>
      <!-- 描述 -->
      <el-row >
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{mySkuInfo.skuDesc}}</el-col>
      </el-row>
      <!-- 价格 -->
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{mySkuInfo.price}}元</el-col>
      </el-row>
      <!-- 平台属性 -->
      <el-row>
        <el-col :span="5" >平台属性</el-col>
        <el-col :span="16">
          <el-tag 
            type="success" 
            v-for="skuAttr in mySkuInfo.skuAttrValueList" 
            :key="skuAttr.id" 
            style="margin: 0px 10px 10px 0px;">{{skuAttr.attrId}}-{{skuAttr.valueId}}
          </el-tag>  
        </el-col>
      </el-row>
      <!-- 商品图片 -->
      <el-row >
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <div class="block">
            <el-carousel trigger="click" height="550px" class="carousel" style="border: 0.5px solid #c0c0c0;">
              <el-carousel-item v-for="img in mySkuInfo.skuImageList" :key="img.id">
                <img :src="img.imgUrl" alt="" style="width: 100%;">
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>

export default {
  name : 'suk' , 
  data() {
    return {
      page : 1 , //当前页数
      limit : 10 , //每页展示的数据
      skuList : [] , //商品列表
      mySkuInfo :{} , //商品详情信息
      total : 0 ,  //总数据
      drawer : false , //是否弹出抽屉
      direction : 'rtl' //抽屉弹出的方向
    }
  } , 
  methods: {
    async getDate(page = 1) { //更新数据
      let {limit} = this
      let result = await this.$API.sku.reqSkuList( page , limit )
      if( result.code === 200 ) {
        this.skuList = result.data.records //获取sku列表
        this.total = result.data.total// 总数据  
      }
    } , 
    sizeChange(limit) { //更改每页数据数量
      this.limit = limit
      this.getDate()
    } ,
    // 下架
    async CalcelSku (row) {
      let result = await this.$API.sku.reqCancelSale(row.id)
      if(result.code === 200) {
        this.$message.success('下架成功')
        this.getDate()
      }   
    } , 
    // 上架
    async onSku(row) {
      let result = await this.$API.sku.reqOnSale(row.id)
      if(result.code === 200) {
        this.$message.success('上架成功')
        this.getDate()
      }   
    } , 
    // 修改
    updateSku() {
      this.$message('正在开发中......')
    } , 
    // 商品详情信息
    async skuInfo(row) {
      this.mySkuInfo = {} //清空数据
      this.drawer = true //显示抽屉
      let result = await this.$API.sku.reqSkuById(row.id) //获取商品详情信息
      if(result.code === 200) {
        this.mySkuInfo = result.data
      }
    } , 
    // 删除sku
    async deleteSku(row) {
      let result = await this.$API.sku.reqDeleteSku(row.id)
      if (result.code === 200) {
        this.$message.success('删除成功')
        this.getDate(this.skuList.length > 1 ? this.page : this.page - 1)       
      }
    }
  },
  mounted() {
    this.getDate()
  }
}
</script>


<style scoped>
  .pagination{
    text-align: center;
  }
  .el-col {
    margin: 10px 10px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .el-row:nth-child(2){
    line-height: 2;
  }
  .el-row:nth-child(5) {
    position: relative;
    bottom: 8px;
  }
  .el-row:nth-child(5) .carousel{
    position: relative;
    bottom: 10px;
  }
  .el-row > .el-col-5 {
    font-size: 18px;
    font-weight: bold;
    text-align: right;
  }
  /* 页面结构比较复杂深度获取样式 */
  >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: #475669;
  }
  >>>.el-drawer__body{
    overflow-y:scroll;
  }
</style>