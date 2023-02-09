<template>
  <!-- spu表单 -->
  <el-form ref="spuform" :model="spuform" label-width="80px" :inline="false" :rules="rules" size="normal">
    <!-- spu名称 -->
    <el-form-item label="SPU名称" prop="spuName">
      <el-input v-model="spuform.spuName"></el-input>
    </el-form-item>
    <!-- spu品牌 -->
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spuform.tmId">
        <el-option :label="item.tmName" :value="item.id" v-for="item in trademarkList" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
    <!-- spu描述 -->
    <el-form-item label="SPU描述" prop="description">
      <el-input type="textarea" rows="4" placeholder="描述" v-model="spuform.description"></el-input>
    </el-form-item>
    <!-- spu图片 -->
    <el-form-item label="SPU图片">
      <!-- 上传 -->
      <el-upload
        action="/dev-api/admin/product/upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handlerSuccess"
        :file-list="spuImageList || []">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>
    </el-form-item>
    <!-- 销售属性 -->
    <el-form-item label="销售属性" >
      <!-- 选择框 -->
      <el-select :placeholder="`还有${num}个未选择`" v-model="attrIdAndAttrName">
        <el-option :label="item.name" :value="`${item.id}:${item.name}`" v-for="item in saleAttr" :key="item.id"></el-option>
      </el-select>
      <!-- 添加销售属性 -->
      <el-button type="primary" size="default" icon="el-icon-plus" @click="addSaleAttr(attrIdAndAttrName)" :disabled="!attrIdAndAttrName">添加销售属性</el-button>
      <!-- 销售值列表 -->
      <el-table border stripe :data="spuform.spuSaleAttrList">
        <!-- 序号 -->
        <el-table-column label="序号" type="index" width="80" align="center">
        </el-table-column>
        <!-- 属性名 -->
        <el-table-column label="属性名" prop="saleAttrName">
        </el-table-column>
        <!-- 属性值列表 -->
        <el-table-column label="属性值名称列表" prop="spuSaleAttrValueList">
          <template slot-scope="{row , $index}">
            <!-- 添加属性值 -->
            <el-tag
              :key="item.id"
              v-for="item in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="handleClose(item , row.spuSaleAttrValueList)">
              {{item.saleAttrValueName}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.flag"
              v-model="row.inputValue"
              ref="attrValue"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row , $index)">
            </el-input>
            <!-- 添加按钮 -->
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row , $index)">添加</el-button>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="{row , $index}">
              <el-popconfirm :title="`是否删除属性值${row.saleAttrName}?`" @onConfirm="deleteAttr($index)">
                <el-button type="danger" size="mini" icon="el-icon-delete" slot="reference"></el-button>
              </el-popconfirm>
            </template> 
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 保存 && 取消 -->
    <el-form-item>
      <template slot-scope="{}">
        <el-button type="primary" size="default" @click="save('spuform')" :disabled="!spuform.spuName">保存</el-button>
        <el-button size="default" @click="Cancel()">取消</el-button>
      </template>
    </el-form-item>
  </el-form> 
</template>

<script>
export default {
  name : 'SpuForm' , 
  data() {
    return {
      trademarkList : []  , //获取品牌列表信息
      saleAttrList : [] , //销售属性列表
      spuImageList : [] , //图片数组
      attrIdAndAttrName : '' , //未选择的销售属性id
      dialogVisible: false , 
      dialogImageUrl : '' , 
      spuform : {
        category3Id : 0 , //三级di
        description: '' , //spu描述
        tmId : '' , //品牌id
        spuImageList : [] , //图片数组
        spuName : '' , //spu名称
        spuSaleAttrList : [ //销售属性
          // {
          //   baseSaleAttrId : '' ,
          //   id: '' ,
          //   saleAttrName : '' ,
          //   spuId : 0 ,
          //   spuSaleAttrValueList : [
          //     {
          //       baseSaleAttrId : '' ,
          //       id : 0,
          //       isChecked :  null ,
          //       saleAttrName : '' ,
          //       saleAttrValueName : '' ,
          //       spuId : '' 
          //     }
          //   ]
          // }
        ]
      } , 
      rules : {
        spuName: [
          { required: true, message: 'spu名称是必要的', trigger: 'blur' },
          { min: 3 , max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ] , 
        description : [
          { required: true, message: '请填写spu描述', trigger: 'blur' } , 
          { min: 3 , max: 150 , message: '长度在 3 到 150 个字符', trigger: 'blur' }
        ]
      }
    }
  } , 
  computed : {
    // 未选择的销售属性
    saleAttr() {
      //every()数组的方法
      //判断数组中的元素是否符合某个条件
      //如果数组中的所有元素都符合条件 返回true
      //相反只要有一个不符合就返回false
      // 获取未选择的销售属性
      // saleAttrList 尺寸  颜色  版本
      // 底层是两个for循环嵌套!
      return this.saleAttrList.filter((item) => { //获取未选择的销售属性
        return this.spuform.spuSaleAttrList.every( item2 => item.name !== item2.saleAttrName )
      })
    } , 
    // 未选择的销售属性数量
    num() {
      return this.saleAttr.length
    } 
  } , 
  methods: {
    // 接受父组件传递的数据 , 并发送请求
    async initSpuData(spu) { 
      // 获取spu名称、描述
      let spuResult = await this.$API.spu.reqSpu(spu.id)
      if( spuResult.code === 200)  {
        this.spuform = spuResult.data
      } 
      // 获取品牌列表
      let trademarkResult = await this.$API.spu.reqGetTrademarkList()
      if(trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取图片列表
      let imgResult = await this.$API.spu.reqGetImageList(spu.id)
      if( imgResult.code === 200 ) { 
        // 饿了么ui的file-list列表需要规定的格式[{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
        let listArr = imgResult.data
        listArr.forEach( item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      } 
      //获取销售属性
      let attrResult = await this.$API.spu.reqGetSaleAttrList()
      if( attrResult.code === 200 ) {
        this.saleAttrList = attrResult.data
      }
    } ,
    // 删除照片墙时的回调 
    handleRemove(file , fileList) {
      // file : 已经删除的图片路径
      // fileList : 删除图片后剩余的图片路径
      // 把剩余的图片数据收集起来
      this.spuImageList = fileList
    } ,
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    } , 
    // 图片上传成功的回调
    handlerSuccess(resqonse , file , fileList) {
      this.spuImageList = fileList
    } , 
    // 删除属性值
    handleClose(tag , spuSaleAttrValueList) {
      spuSaleAttrValueList.splice(spuSaleAttrValueList.indexOf(tag), 1)
    },
    // 添加属性值
    showInput(row) {
      this.$set(row , 'flag' , true) // 给当前的对象添加一个flag 
      this.$set(row , 'inputValue' , '') // 给当前的对象添加一个flag    
      this.$nextTick( () => this.$refs.attrValue.focus() ) //异步加载完成自动聚焦
    } ,
    // 离开焦点时 , 添加到数组
    handleInputConfirm(row) {
      const { baseSaleAttrId , inputValue } = row //解构赋值
      if(inputValue.trim() === '') { //如果为空值
        this.$message('不能输入空格或空值')
        return
      } 
      let isRepetition = row.spuSaleAttrValueList.every( item => item.saleAttrValueName !== inputValue )//去掉重复的属性值
      if(!isRepetition) { //如果重复
        this.$message('不能输入重复的值')
        return
      }
      let data = {
        baseSaleAttrId , //销售属性id
        saleAttrValueName : inputValue //属性值
      }
      row.spuSaleAttrValueList.push(data) 
      row.flag = false //隐藏input
      row.inputValue = '' //清空文本
    } , 
    // 删除属性
    deleteAttr(index) {
      this.spuform.spuSaleAttrList.splice(index , 1)
    } , 
    // 添加属性
    addSaleAttr(attrIdAndAttrName) {
      // attrArr包括了属性名和属性值
      let attrArr = attrIdAndAttrName.split(':')
      this.spuform.spuSaleAttrList.push({
        baseSaleAttrId : attrArr[0] , //销售属性id
        saleAttrName : attrArr[1] , //未选择的属性的属性名
        spuSaleAttrValueList : [] //销售属性值
      })
      this.attrIdAndAttrName = ''
    } , 
    // 点击添加按钮时获取数据
    async addSpuData(category3Id) {
      this.spuform.category3Id = category3Id //获取3id
      // 获取品牌列表
      let trademarkResult = await this.$API.spu.reqGetTrademarkList()
      if(trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      //获取销售属性
      let attrResult = await this.$API.spu.reqGetSaleAttrList()
      if( attrResult.code === 200 ) {
        this.saleAttrList = attrResult.data
      }  
    } , 
    // 保存发送到服务器
    save(spuform) {
      // 整理image参数 ， 添加imgName 和 imgUrl
      // 这个方法返回一个新数组 ， 把属性映射到新数组
      this.spuform.spuImageList = this.spuImageList.map(item => {
        return { //添加属性
          imgName : item.name , 
          imgUrl : item.response ? item.response.data : item.url
        }
      })
      this.$refs[spuform].validate(async (valid) => { //表单验证
        if (valid) { //如果验证成功
            let result = await this.$API.spu.reqAddOrUpdateSpu(this.spuform)
            if( result.code === 200 ) {
              this.$message.success('保存成功')
              this.$emit('Cancel' , 'spuList' , this.spuform.id ? 0 : 1) //返回页面  , 并携带第三个参数 , 如果是1 ， 表示添加页 ， 否则表示修改页
            }
            Object.assign(this._data , this.$options.data()) //相互替换即清空 
        } else {
          this.$message('保存失败')
        }
      })
    } ,
    // 取消按钮 
    Cancel() {
      this.$emit('Cancel' , 'spuList')
      //this.$options.data() 获取当前的数据(原始)
      Object.assign(this._data , this.$options.data()) //相互替换即清空
    }
  }
} 
</script>

<style>
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>