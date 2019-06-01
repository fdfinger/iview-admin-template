import BaseService from './base'

/**
 * 角色菜单关系
 *
 * @class RoleMenuService
 * @extends {BaseService}
 */
class RoleMenuService extends BaseService {
  constructor () {
    super('role_menu')
  }
}

export default new RoleMenuService()
