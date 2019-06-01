import BaseService from './base'

/**
 * 商品SKU管理
 *
 * @class ProductSkuService
 * @extends {BaseService}
 */
class ProductSkuService extends BaseService {
  constructor () {
    super('product_sku')
  }
}

export default new ProductSkuService()
