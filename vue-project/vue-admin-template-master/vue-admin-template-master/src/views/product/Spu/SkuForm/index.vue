<template>
  <!-- sku表单 -->
  <el-form ref="form" label-width="80px" :inline="false" size="normal">
    <!-- spu名称 -->
    <el-form-item label="SPU名称">
      <span>{{spuName}}</span>
    </el-form-item>
    <!-- SKU名称 -->
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" size="normal" clearable v-model="skuform.skuName"></el-input>
    </el-form-item>
    <!-- 价格 -->
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" size="normal" clearable type="number" v-model="skuform.price"></el-input>
    </el-form-item>
    <!-- 重量 -->
    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)" size="normal" clearable type="number" v-model="skuform.weight"></el-input>
    </el-form-item>
    <!-- 规格描述 -->
    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuform.skuDesc"></el-input>
    </el-form-item>
    <!-- 平台属性 -->
    <el-form-item label="平台属性">
      <el-form label-width="80px" :inline="true" size="normal" >
        <!-- 遍历平台属性 -->
        <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
          <!-- 遍历平台属性值 -->
          <el-select placeholder="请选择" v-model="attr.item">
            <el-option :label="attrVal.valueName" :value="`${attrVal.attrId}:${attrVal.id}`" v-for="attrVal in attr.attrValueList" :key="attrVal.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>  
    </el-form-item>
    <!-- 销售属性 -->
    <el-form-item label="销售属性" > 
      <el-form label-width="80px" :inline="true" size="normal">
        <el-form-item :label="sale.saleAttrName" v-for="sale in saleAttrList" :key="sale.id">
          <el-select placeholder="请选择" v-model="sale.item">
            <el-option :label="saleVal.saleAttrValueName" :value="`${saleVal.baseSaleAttrId}:${saleVal.id}`" v-for="saleVal in sale.spuSaleAttrValueList" :key="saleVal.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>  
    </el-form-item>
    <!-- 图片列表 -->
    <el-form-item label="图片列表" >
      <el-table border stripe :data="imageList" @selection-change="handleSelectionChange">
        <!-- 勾选框 -->
        <el-table-column type="selection" width="80" align="center" />
        <!-- 图片 -->
        <el-table-column label="图片">
          <template slot-scope="{row}">
            <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px;">
            <!-- <img src="@/assets/02.jpg" alt="" style="width: 100px;height: 50px;"> -->
          </template>
        </el-table-column>
        <!-- 名称 -->
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="default" v-show="!row.isDefault" @click="myDefault(row)">设为默认</el-button>
            <el-button type="success" plain size="mini" v-show="row.isDefault">默认</el-button>
          </template>
        </el-table-column>
      </el-table>    
    </el-form-item>
    <!-- 保存 && 取消 -->
    <el-form-item>
      <template slot-scope="{}">
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </template>
    </el-form-item>
  </el-form> 
</template>
<script>
export default {
  name : 'SkuForm' , 
  data() {
    return {
      imageList : [] , //图片列表
      saleAttrList : [] ,  //销售属性列表
      attrInfoList : []  , //获取平台属性列表
      multipleSelection : [] , //已经勾选的图片数据
      spuName : '' , //spu名称
      attrAndAttrvalId : '' , //属性id与属性值id
      skuform : { //表单数据
        category3Id : 0 , //三级id
        spuId : 0 , //spuId
        tmId : 0  , //品牌Id
        skuName : "" , //sku名称
        price : '' , //价格
        weight : "" , //重量
        skuDesc : "" , //描述
        skuAttrValueList : [ //平台属性值
        ] , 
        skuSaleAttrValueList: [ //销售属性值
          // {
          //   saleAttrId : 0 ,
          //   saleAttrValueId : 0,
          // }
        ] ,
        skuImageList : [ //图片列表
          // {
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   skuId: 0 ,
          //   spuImgId: 0
          // }
        ] ,
        skuDefaultImg : ""
      }
    }
  },
  methods: {
    //更新数据
    getDate(category1Id , category2Id , spu) { 
      this.spuName = spu.spuName // 获取spum名称
      this.skuform.spuId = spu.id//获取spuId
      this.skuform.tmId = spu.tmId//获取品牌id
      this.skuform.category3Id = spu.category3Id // 获取三级联动id

      let p1 = this.$API.spu.reqSpuImageList(spu.id) //获取图片列表
      let p2 = this.$API.spu.reqSpuSaleAttrList(spu.id) //获取销售属性列表
      let p3 = this.$API.spu.reqAttrInfoList(category1Id , category2Id , spu.category3Id) //获取属性 
      Promise.all([p1 , p2 , p3]).then( resultArr => {
        let list = resultArr[0].data
        list.forEach( item => item.isDefault = 0 ) //添加isDefault
        this.imageList = resultArr[0].data// 图片列表
        this.saleAttrList = resultArr[1].data// 销售属性列表
        this.attrInfoList = resultArr[2].data// 平台属性列表
      })
      .catch(err => console.log(err)) 
    } , 
    //获取勾选的图片数据
    handleSelectionChange(val) {
      this.multipleSelection = val
    } , 
    //设置默认的排他思想
    myDefault(row) { 
      this.imageList.forEach( item => item.isDefault = 0 )
      row.isDefault = 1 //设置当前点击的图片为默认图片
      this.skuform.skuDefaultImg =  row.imgUrl // 收集默认图片信息
    } , 
    //保存并整理数据
    async save() { 
      let { skuform , attrInfoList , saleAttrList , multipleSelection} = this
      // 整理attrInfoList的参数
      skuform.skuAttrValueList = attrInfoList.reduce(( prev , attr ) => {
        if( attr.item ) { //如果存在这个属性
          const [attrId , valueId] = attr.item.split(':') //结构属性id和属性值ID
          prev.push({ attrId , valueId }) //添加进空数组
        }
        return prev
      } , [])
      // 整理saleAttrList的参数
      skuform.skuSaleAttrValueList = saleAttrList.reduce(( prev , sale ) => {
        if(sale.item) {
          const [saleAttrId , saleAttrValueId] = sale.item.split(':')
          prev.push({ saleAttrId , saleAttrValueId })
        }
        return prev
      } , [])
      // 整理勾选图片的参数
      skuform.skuImageList = multipleSelection.map( item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl ,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 提交表单数据
      let result = await this.$API.spu.reqAddSku(this.skuform)
      if(result.code === 200) {
        this.$message.success('添加成功')
        this.$emit('Cancel' , 'spuList')
        Object.assign(this._data , this.$options.data()) // 清楚数据 合并及相互清空
      }
    } , 
    //取消按钮
    cancel() {
      this.$emit('Cancel' , 'spuList') //返回spu列表
      Object.assign(this._data , this.$options.data()) // 清楚数据 合并及相互清空
    }
  }
}
</script>

<style>

</style>