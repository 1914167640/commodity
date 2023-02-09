import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter , asyncRoutes , constantRoutes , anyRoutes } from '@/router'
import router from '@/router'
const getDefaultState = () => {
  return {
    token: getToken() ,
    name: '' ,
    avatar: '' , 
    routes : [] , 
    buttons : [] , 
    roles : [] , 
    filterRoutes : [] , 
    resultAllRouters : [] 
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  } ,
  // 获取用户信息
  SET_USERINFO( state , userInfo) {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  } , 
  // 计算出当前的异步路由
  FILTER_ROUTES(state , filterRoutes) {
    state.filterRoutes = filterRoutes
    state.resultAllRouters = constantRoutes.concat(state.filterRoutes , anyRoutes) //合并路由数组
    router.addRoutes(state.resultAllRouters) //添加路由
  }
}

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })

    console.log(result)
    if(result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
    }
  } ,

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取用户信息:返回数据包含
        const { data } = response
        commit('FILTER_ROUTES' , filtersRouter(asyncRoutes , data.routes))
        commit('SET_USERINFO' , data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  async logout({ commit, state }) {
    let result = await logout(state.token)
    if(result.code === 20000) { 
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 过滤好的路由
const filtersRouter = ( asyncRoutes , routes) => {
  // 两个数组判断
  return asyncRoutes.filter( item => {
    // 如果第一层有
    if( routes.indexOf(item.name) !== -1 ) {
      // console.log(item)
      // 第一层还要判断第二层、第三层.......
      if( item.children && item.children.length ) { //如果children是数组且有值
        item.children = filtersRouter( item.children , routes )
      }
      return true
    }
  })
}

const getters = {
  resultAllRoutes(state) {
    return state.user.resultAllRoutes
  } 
}

export default {
  namespaced: true ,
  state,
  mutations,
  actions  , 
  getters
}

