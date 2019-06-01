import axios from './../axios'
import BaseService from './base'
import md5 from 'md5'
/**
 * 会员管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class UserService extends BaseService {
  constructor () {
    super('user')
  }
  login(data){
    data.password=md5(data.password)
    return axios.post('/user/login',data)
  }
  resetPassword (data) {
    data.password=md5(data.password)
    return axios.post('/user/reset/password',data)
  }
}
export default new UserService()
