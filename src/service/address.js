import BaseService from './base'

/**
 * 地址管理
 *
 * @class AddressService
 * @extends {BaseService}
 */
class AddressService extends BaseService {
  constructor() {
    super('address')
  }
}
export default new AddressService()