import BaseService from './base'

/**
 * 商品类目管理
 *
 * @class ProductCategoryService
 * @extends {BaseService}
 */
class ProductCategoryService extends BaseService {
  constructor () {
    super('product_category')
  }
}

export default new ProductCategoryService()
