import BaseService from './base'

/**
 * 会员优惠券管理
 *
 * @class MemberCouponService
 * @extends {BaseService}
 */
class MemberCouponService extends BaseService {
  constructor () {
    super('member_coupon')
  }
}
export default new MemberCouponService()
