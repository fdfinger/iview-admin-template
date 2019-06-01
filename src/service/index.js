import BaseService from './base'
import Vue from 'vue';
const service = {
  Address: require('./address').default,
  CouponDefinition: require('./coupon').default,
  CouponUsed: require('./memberCoupon').default,
  CartItem: require('./cartItem').default,
  MemberInfo: require('./member').default,
  OrderItem: require('./orderItem').default,
  OrderList: require('./order').default,
  ProductList: require('./product').default,
  ProductClassification: require('./productClassify').default,
  productSku: require('./productSku').default,
  StoreAuthentication: require('./shop').default,
  StoreList: require('./shop').default,
  Menu: require('./menu').default,
  Role: require('./role').default,
  User: require('./user').default,
  SupplierProduct: require('./product').default,
  AllotItem: require('./allotItem').default,
  PurchItem: require('./purchItem').default,
  ShopDeposit: new BaseService('shop_deposit'),
  FeedBack: new BaseService('feedback'),
  Module: new BaseService('module')
}
// 注册一个实例方法 使用: this.$service['Address'].select(params).then(callback)
Vue.prototype.$service = service
export default service