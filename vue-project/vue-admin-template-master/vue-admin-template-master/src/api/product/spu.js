
import request from '@/utils/request'

// 获取spu列表
export const reqGetSpuList = ( page , limit , category3Id ) => request({ url : `/admin/product/${page}/${limit}` ,  method : 'get' , params : { category3Id } })

// 获取spu信息
export const reqSpu = ( spuId ) => request({ url : `admin/product/getSpuById/${spuId}` ,  method : 'get'})

// 获取品牌的数据
export const reqGetTrademarkList = () => request({ url : `/admin/product/baseTrademark/getTrademarkList` ,  method : 'get' })

// 获取图片信息
export const reqGetImageList = ( spuId ) => request({ url : `/admin/product/spuImageList/${spuId}` ,  method : 'get' })

// 获取销售属性
export const reqGetSaleAttrList = () => request({ url : `/admin/product/baseSaleAttrList` ,  method : 'get' })

// 删除spu
export const reqDeleteSpu = (spuId) => request({ url : `/admin/product/deleteSpu/${spuId}` ,  method : 'delete' })

// 添加或修改
export const reqAddOrUpdateSpu = (data) => {
  if(data.id) { //如果id存在
    return request({ url : `/admin/product/updateSpuInfo` ,  method : 'post'  , data }) //修改spu
  } else { //如果不存在
    return request({ url : `/admin/product/saveSpuInfo` ,  method : 'post'  , data}) //添加spu
  }
} 


// 添加实例
// http://localhost:9529/dev-api/admin/product/spuImageList/5704
// http://localhost:9529/dev-api/admin/product/spuSaleAttrList/5704
// http://localhost:9529/dev-api/admin/product/attrInfoList/1/1/1

// 获取图片数组
export const reqSpuImageList = (spuId) => request({ url : `/admin/product/spuImageList/${spuId}` ,  method : 'get' })

// 获取销售属性列表
export const reqSpuSaleAttrList = (spuId) => request({ url : `/admin/product/spuSaleAttrList/${spuId}` ,  method : 'get' })

// 获取属性列表
export const reqAttrInfoList = (category1Id , category2Id , category3Id) => request({ url : `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}` ,  method : 'get' })

//添加sku
export const reqAddSku = (data) => request({ url : `/admin/product/saveSkuInfo` ,  method : 'post' , data })

// 获取sku列表
export const reqSkuList = (spuId) => request({ url : `/admin/product/findBySpuId/${spuId}` ,  method : 'get'})


