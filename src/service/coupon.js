import BaseService from './base'

/**
 * 拼团订单
 *
 * @class CouponService
 * @extends {BaseService}
 */
class CouponService extends BaseService {
  constructor () {
    super('coupon')
  }
}
export default new CouponService()
