import BaseService from './base'

/**
 * 角色管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class BrandService extends BaseService {
  constructor () {
    super('role')
  }
}
export default new BrandService()
