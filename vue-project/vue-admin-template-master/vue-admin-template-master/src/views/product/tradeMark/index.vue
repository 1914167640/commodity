<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" class="primary" @click="addTrademark">添加按钮</el-button>
    <!-- 品牌列表 -->
    <el-table :data="trademarkList" border>
      <!-- 序号 -->
      <el-table-column prop="id" label="序号" width="80px" align="center"></el-table-column>
      <!-- 品牌名称 -->
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center"></el-table-column>
      <!-- 品牌logo -->
      <el-table-column label="品牌LOGO" width="width" align="center">
        <template slot-scope="{row}">
          <el-image style="width: 100px; height: 50px" :src="row.logoUrl" :preview-src-list="[row.logoUrl]" :key="row.id"></el-image>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column prop="date" label="操作" width="width" align="center">
        <!-- 删除和修改按钮 -->
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" @click="updateTrademark(row)">修改</el-button>  
          <el-button type="danger" icon="el-icon-delete" @click="deleteTrademark(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加和修改共用页面 -->
    <el-dialog :title="form.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 品牌名称 -->
        <el-form-item label="品牌名称" prop="tmName" :label-width="formLabelWidth" style="width: 80%;">    
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item label="品牌LOGO" prop="logoUrl" :label-width="formLabelWidth">         
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 
      分页器 
      current-page 当前页数
      page-size 每页数据
      page-sizes 设置每一页能展示多少条数据
      total 总页数
    -->
    <el-pagination
      @current-change="getDate"
      @size-change="sizeChange"
      :current-page="current" 
      :page-size="size"
      :page-sizes="[3 , 5 , 10]"
      :total="total"
      :pager-count="7"
      layout= "prev , pager, next , jumper , -> , sizes"
      class="pagination"
      background>
    </el-pagination>     
  </div>
</template>

<script>
export default {
  name : 'tradeMark' , 
  data() { 
    return {
      trademarkList : [] , //品牌信息
      form : {// 表单信息
        id: 0,
        logoUrl : '' ,
        tmName : ''
      } ,    
      rules : {// 表单验证
        tmName : [ //品牌名称验证
          { required: true , message: '请输入活动名称' , trigger: 'blur' } ,
          { min: 2 , max: 10 , message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ] , 
        logoUrl : [ { required: true , message : '请选择图片' , trigger: 'change'} ] //图片验证
      } ,
      pageNo : 1 , //默认当前页数
      limit : 3  , //默认每页数据
      total : 0 , //一共多少条数据
      size : 0 , //每页数据
      current : 0 , //当前页数
      dialogFormVisible : false , //添加或修改框的显示与隐藏
      formLabelWidth : '120px' , // 表单外边距调整
    }
  },
  methods: {
    // 获取品牌列表
    getDate(page=1) {      
      let { limit } = this
      this.pageNo = page
      this.$API.tradeMark.reqBaseTrademark( page , limit ).then( result => { 
        this.trademarkList = result.data.records  
        this.total = result.data.total
        this.size = result.data.size      
      })
      .catch( err => console.log(err) )
    } , 
    // 更改每页数据
    sizeChange(pageSize) {
      this.limit = pageSize //参数赋值
      this.getDate()
    } , 
    // 添加品牌
    addTrademark() {
      this.dialogFormVisible = true //显示
      this.form = {id : 0 , tmName : '' , logoUrl : ''} //清空品牌id、品牌名字、logoUrl
    } , 
    // 修改品牌
    updateTrademark(trademarkObj) {
      this.dialogFormVisible = true //显示
      this.form = { ...trademarkObj }//深拷贝 , 获取品牌id、品牌名字、logoUrl
    } , 
    // 删除品牌
    deleteTrademark(id) {
      let { trademarkList , pageNo } = this
      this.$confirm('是否删除该品牌?', '提示', { confirmButtonText: '确定' , cancelButtonText: '取消' , type: 'warning'})
      .then( async () => { //确定按钮       
        let result = await this.$API.tradeMark.reqRemoveTrademark(id) //删除品牌
        if( result.code === 200 ) {
          this.getDate(trademarkList.length > 1 ? pageNo : pageNo - 1) //更新数据
          this.$message.success('删除成功!')
        } 
      })
      .catch(() => this.$message.info('已取消删除!')) //取消按钮
    } , 
    // 确定(修改和添加的确定按钮)
    confirm(form) {
      this.$refs[form].validate( valid => { 
        if( valid ) { //全部验证成功
          this.$API.tradeMark.addOrUpdateTrademark( this.form ) //请求服务器
          .then(() => { //添加到服务器
            this.$message.success(this.form.id ? '修改成功' : '添加成功') //如果id是0则是添加成功
            this.getDate() //更新页面
            this.dialogFormVisible = false //关闭页面
          }).catch(err => console.log(err))
        } else { //验证不成功
          this.$message.error(this.form.id ? '修改失败' : '添加失败')
        }
      })
    } , 
    // 文件上传成功把图片路径传递给data
    handleAvatarSuccess(res, file) {
      this.form.logoUrl = res.data
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  },
  mounted() {
    this.getDate() //页面挂载时更新数据
  }
}
</script>

<style>
  .primary {
    margin: 10px 0px;
  }
  .pagination{
    text-align: center;
    margin-top: 20px;
  }
  
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>