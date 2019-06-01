import BaseService from './base'

/**
 * 会员管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class MemberService extends BaseService {
  constructor () {
    super('member')
  }
}
export default new MemberService()
