import BaseService from './base'
import axios from './../axios'

/**
 * 供应商管理
 *
 * @class MemberShopService
 * @extends {BaseService}
 */
class MemberShopService extends BaseService {
  constructor () {
    super('member_shop')
  }
  // 关系
  relationMember (params) {
    return axios.post( `${this.url}/relation/member`, params)
  }

  // 关系
  relationShop (params) {
    return axios.post(`${this.url}/relation/shop`, params)
  }
}
export default new MemberShopService()
