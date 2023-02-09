import request from '@/utils/request'


// 品牌列表
export const reqBaseTrademark = ( page , limit ) => request({ url : `/admin/product/baseTrademark/${page}/${limit}` ,  method : 'get' })

// 添加品牌
export const addOrUpdateTrademark = data => { 
  if( data.id ) { //如果商品id存在
    return request( { url : `/admin/product/baseTrademark/update` , method : 'put' , data } ) // 修改品牌
  } else { //如果商品id不存在 , 为undefined
    return request( { url : `/admin/product/baseTrademark/save` , method : 'post' , data } ) //添加品牌
  } 
}

//删除品牌
export const reqRemoveTrademark = id => request( { url : `/admin/product/baseTrademark/remove/${id}` , method : 'delete' } )



