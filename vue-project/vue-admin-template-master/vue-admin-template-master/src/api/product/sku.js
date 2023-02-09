
import request from '@/utils/request'

// 商品skuList接口
export const reqSkuList = (page , limit) => request({ url : `/admin/product/list/${page}/${limit}` ,  method : 'get' })

// 商品上架
export const reqOnSale = ( skuId ) => request({ url : `/admin/product/onSale/${skuId}` ,  method : 'get' })

// 商品下架
export const reqCancelSale = ( skuId ) =>  request({ url : `/admin/product/cancelSale/${skuId}` ,  method : 'get' })

// 商品详情
export const reqSkuById = ( skuId ) =>  request({ url : `/admin/product/getSkuById/${skuId}` ,  method : 'get' })

// 删商品/admin/product/deleteSku/{skuId}
export const reqDeleteSku= ( skuId ) =>  request({ url : `/admin/product/deleteSku/${skuId}` ,  method : 'delete' })
