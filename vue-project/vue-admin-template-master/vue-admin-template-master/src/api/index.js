// 引入全部接口
// import * as user from './user'
import * as tradeMark from './product/tradeMark'
import * as spu from './product/spu'
import * as sku from './product/sku'
import * as attr from './product/attr'
import * as user from './acl/user'
import permission from './acl/permission'
import role from './acl/role'



// 将全部接口对外暴露
export default {
  // user , 
  tradeMark , 
  spu , 
  sku , 
  attr , 
  permission , 
  role , 
  user
}