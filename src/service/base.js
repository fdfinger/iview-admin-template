import axios from './../axios'
import qs from 'qs'
/**
 * 基类
 *
 * @export
 * @class BaseService
 */
export default class BaseService {
  constructor (url) {
    this.url = url
  }
  // 删除 ids:Array
  delete (params) {
    return axios.post(`${this.url}/delete`,params)
  }
  // 插入 entity:Object
  insert (params) {
    return axios.post(`${this.url}/insert`,params,'JSON')
  }
  // 查询数据 ps p :Object
  select (params) {
    return axios.post(`${this.url}/select/page`,params)
  }
  // 查询数据 ps p :Object
  list (params) {
    return axios.post(`${this.url}/list`,params)
  }
  // 查询数据byId id:number
  id (id) {
    return axios.get(`${this.url}/select/${id}`)
  }
  // 更新数据 entity: Object
  update (params) {
    return axios.post(`${this.url}/update`,params,'JSON')
  }
  excel (params) {
    if (Object.keys(params).length == 0) return axios.get(`${this.url}/excel/page`)
    else return axios.get(`${this.url}/excel/page?${qs.stringify(params, { arrayFormat: 'repeat' })}`)
  }
}
