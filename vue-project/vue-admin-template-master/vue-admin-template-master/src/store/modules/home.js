import mockRequest from '@/utils/mockRequest'
const actions = {
  async getDate( {commit} ) {
    let result = await mockRequest.get('/home/list')
    console.log(result)
    if( result.code === 20000 ) {
      commit( 'GET_DATE' , result.data )
    }
  } , 
  async getDate2() {
    let result = await mockRequest.get('/home/list')
    return result
  }
}

const mutations = {
  GET_DATE(state , homeObj) {
    state.homeObj = homeObj
  }
}

const state = {
  homeObj : {}
}

const getters = {
  saleRank({ homeObj }) {
    return homeObj.saleRank
  }
}

export default {
  actions , 
  mutations , 
  state , 
  getters
}