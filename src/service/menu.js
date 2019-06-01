import BaseService from './base'

/**
 * 菜单管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class MenuService extends BaseService {
  constructor () {
    super('menu')
  }
}
export default new MenuService()
