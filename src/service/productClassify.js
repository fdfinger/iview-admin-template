import BaseService from './base'

/**
 * 商品类目管理
 *
 * @class ProductClassifyService
 * @extends {BaseService}
 */
class ProductClassifyService extends BaseService {
  constructor () {
    super('product_classify')
  }
}

export default new ProductClassifyService()
