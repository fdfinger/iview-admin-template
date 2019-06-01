import BaseService from './base'

/**
 * 拼团订单
 *
 * @class CartItemService
 * @extends {BaseService}
 */
class CartItemService extends BaseService {
  constructor () {
    super('cart_item')
  }
}
export default new CartItemService()
