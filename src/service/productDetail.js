import BaseService from './base'

/**
 * 商品详情管理
 *
 * @class ProductDetailService
 * @extends {BaseService}
 */
class ProductDetailService extends BaseService {
  constructor () {
    super('product_detail')
  }
}

export default new ProductDetailService()
