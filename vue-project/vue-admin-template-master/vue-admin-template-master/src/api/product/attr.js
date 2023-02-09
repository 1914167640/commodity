import request from '@/utils/request'

// 获取一级分类属性
export const reqGetCategory1 = () => request( { url : '/admin/product/getCategory1' , method : 'get'} )

// 获取二级分类属性
export const reqGetCategory2 = ( category1Id ) => request( { url : `/admin/product/getCategory2/${category1Id}` , method : 'get' } )

//获取三级分类
export const reqGetCategory3 = ( category2Id ) => request( { url : `/admin/product/getCategory3/${category2Id}` , method : 'get' } )

// 商品属性列表
export const reqAttrInfoList = ( category1Id , category2Id , category3Id ) => request( { url : `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}` , method : 'get' } )

//添加商品属性
export const reqSaveAttrInfo = ( data ) => request( {url : '/admin/product/saveAttrInfo' , method : 'post' , data } )

// 删除商品属性
export const reqDeleteAttr = ( attrId ) => request( {url : `/admin/product/deleteAttr/${attrId}` , method : 'delete' } ) 