import BaseService from './base'
import axios from './../axios'
/**
 * 门店
 *
 * @class ShopService
 * @extends {BaseService}
 */
class ShopService extends BaseService {
  constructor () {
    super('shop')
  }
  updateDeposit (params) {
    return axios.post(`${this.url}/update/deposit`,params)
  }
}
export default new ShopService()