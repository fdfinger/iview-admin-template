import axios from './../axios'
import BaseService from './base'

/**
 * 商品管理
 *
 * @class ProductService
 * @extends {BaseService}
 */
class ProductService extends BaseService {
  constructor () {
    super('product')
  }
  status(id,status){
    return axios.post('/product/status',{id,status})
  }
  relation (params) {
    return axios.post('/product/relation',params)
  }
}

export default new ProductService()
