import BaseService from './base'

/**
 * 用户角色关系
 *
 * @class UserRoleService
 * @extends {BaseService}
 */
class UserRoleService extends BaseService {
  constructor () {
    super('user_role')
  }
}

export default new UserRoleService()
