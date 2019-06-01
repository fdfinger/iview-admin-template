import axios from './../axios'
import BaseService from './base'

/**
 * 订单管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class OrderService extends BaseService {
  constructor () {
    super('order')
  }
  sign(id){
    return axios.post('/order/sign',{id:id})
  }
  filling(id){
    return axios.post('/order/filling',{id:id})
  }
  contract(sn){
    return axios.post('/order/view/contract',{orderSn:sn})
  }
  // excel(params){
  //   return axios.get(`/order/excel/page`,JSON.stringify(params))
  // }
}
export default new OrderService()
