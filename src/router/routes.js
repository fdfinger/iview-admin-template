const routes=[
  {
    name: 'index',
    path:'/',
    component: () => import('./../view/dashboard'),
    redirect: '/main',
    meta: {
      title: '控制面板',
      keepAlive: true
    },
    children:[
      {
        name:'Main',
        path:'main',
        component: () => import(/* webpackChunkName: "main" */ './../view/common/main'),
        meta:{
          title:'控制面板首页'
        }
      },
    ]
  },
  {
    name:'Product',
    path:'/product',
    component: () => import('./../view/dashboard'),
    children:[
      {
        name:'ProductList',
        path:'list',
        component: () => import(/* webpackChunkName: "product_list" */ '@/view/product/product_list'),
        meta:{
          title:'商品管理',
          keepAlive: true
        }
      },
      {
        name:'ProductClassification',
        path:'product-classification',
        component: () => import(/* webpackChunkName: "product-classification" */ '@/view/product/product-classification'),
        meta:{
          title:'商品分类管理',
          auth: true,
        }
      },
      {
        name:'ProductSku',
        path:'product-sku',
        component: () => import(/* webpackChunkName: "product-sku" */ '@/view/product/product-sku'),
        meta:{
          title:'商品明细',

        }
      }
    ]
  },
  {
    path: '/store',
    name: 'store',
    component: () => import('./../view/dashboard'),
    meta: {
      title: '商户中心',
      icon: 'md-outlet'
    },
    children: [
      { path: 'store-list', name: 'StoreList', meta: { title: '商家管理', notCache: true }, component: () => import(/* webpackChunkName: "store-list" */ '@/view/store/store-list') },
      { path: 'store-authentication', name: 'StoreAuthentication', meta: { title: '认证审核', notCache: true }, component: () => import(/* webpackChunkName: "store-authentication" */ '@/view/store/store-authentication') },
      { path: 'store-account', name: 'StoreAccount', meta: { title: '门店账号', notCache: true }, component: () => import(/* webpackChunkName: "store-account" */ '@/view/store/store-account') }
    ]
  },
  {
    name:'Order',
    path:'/order',
    component: () => import('./../view/dashboard'),
    children:[
      {
        name:'OrderList',
        path:'list',
        component: () => import(/* webpackChunkName: "order-list" */ '@/view/order/list'),
        meta: {
          title:'订单管理'
        }
      },
      {
        name:'OrderItem',
        path:'item',
        component: () => import(/* webpackChunkName: "order-item" */ './../view/order/item'),
        meta:{
          title:'订单明细管理'
        }
      },
      {
        name: 'OrderCollage',
        path: 'order-collage',
        component: () => import(/* webpackChunkName: "order-collage" */ '@/view/order/order-collage'),
        meta: {
          title: '拼团订单'
        },
      }
    ]
  },
  {
    name: 'supplier',
    paht: '/supplier',
    component: () => import('@/view/dashboard'),
    children: [
      {
        name: 'Allot',
        path: 'allot',
        meta: {
          title: '调拨单'
        },
        component: () => import(/* webpackChunkName: "allot" */ '@/view/supplier/allot')
      },
      {
        name: 'AllotItem',
        path: 'allotItem',
        meta: {
          title: '调拨明细'
        },
        component: () => import(/* webpackChunkName: "allot" */ '@/view/supplier/allotItem')
      },
      {
        name: 'Freight',
        path: 'freight',
        meta: {
          title: '运费管理'
        },
        component: () => import(/* webpackChunkName: "freight" */ '@/view/supplier/freight')
      },
      {
        name: 'Brand',
        path: 'brand',
        meta: {
          title: '品牌管理'
        },
        component: () => import(/* webpackChunkName: "brand" */ '@/view/supplier/brand')
      },
      {
        name: 'Purch',
        path: 'purch',
        meta: {
          title: '采购管理'
        },
        component: () => import(/* webpackChunkName: "purch" */ '@/view/supplier/purch')
      },
      {
        name: 'PurchItem',
        path: 'purchItem',
        meta: {
          title: '采购明细'
        },
        component: () => import(/* webpackChunkName: "purch" */ '@/view/supplier/purchItem')
      },
      {
        name: 'SupplierProduct',
        path: 'supplierProduct',
        meta: {
          title: '供货商管理'
        },
        component: () => import(/* webpackChunkName: "supplierProduct" */ '@/view/supplier/supplierProduct')
      },
      {
        name:'SupplierProductInsert',
        path:'productInsert',
        component: () => import('@/view/supplier/supplierProductInsert'),
        meta:{
          title:'添加商品'
        }
      },
      {
        name:'SupplierProductEdit',
        path:'productEdit/:id',
        component: () => import('@/view/supplier/supplierProductInsert'),
        props:true,
        meta:{
          title:'编辑商品'
        }
      },
      {
        name:'Cash',
        path:'cash',
        component: () => import('@/view/supplier/cash'),
        meta:{
          title:'资金查看'
        }
      },
      {
        name:'StoreInfo',
        path:'storeInfo',
        component: () => import('@/view/supplier/storeInfo'),
        meta:{
          title:'店铺信息'
        }
      },
      {
        name:'ProductCategory',
        path:'product-category',
        component: () => import('@/view/supplier/product-category')
      },
      {
        name:'Module',
        path:'module',
        component: () => import('@/view/supplier/module')
      },
    ]
  },
  {
    name:'member',
    path:'/member',
    component: () => import('./../view/dashboard'),
    children:[
      { path: 'member-info', name: 'MemberInfo', meta: { icon: 'md-people', title: '会员中心', notCache: true }, component: () => import(/* webpackChunkName: "member-info" */ '@/view/member/member-info') },
      { path: 'cart_item', name: 'CartItem', meta: { icon: 'md-card', title: '购物车列表', notCache: true }, component: () => import(/* webpackChunkName: "cart_item" */ '@/view/member/cart_item') },
      { path: 'address', name: 'Address', meta: { title: '收货地址', notCache: true }, component: () => import(/* webpackChunkName: "address" */ '@/view/member/address') },
      { path: 'feedback', name: 'FeedBack', meta: { title: '意见反馈', notCache: true }, component: () => import(/* webpackChunkName: "address" */ '@/view/member/feedback') }
    ]
  },
  {
    name:'System',
    path:'/system',
    component: () => import('./../view/dashboard'),
    children:[
      {
        name:'User',
        path:'user',
        component: () => import(/* webpackChunkName: "user" */ './../view/system/user'),
        meta:{
          title:'用户设置'
        }
      },
      {
        name:'Role',
        path:'role',
        component: () => import(/* webpackChunkName: "role" */ './../view/system/role'),
        meta:{
          title:'角色管理'
        }
      },
      {
        name:'Menu',
        path:'menu',
        component: () => import(/* webpackChunkName: "menu" */ './../view/system/menu'),
        meta:{
          title:'菜单管理'
        }
      }
    ]
  },
  {
    path: '/marketing',
    name: 'marketing',
    component: () => import('./../view/dashboard'),
    meta: {
      title: '营销中心',
      icon: 'md-paper-plane'
    },
    children: [
      { path: 'coupon-definition', name: 'CouponDefinition', meta: { title: '优惠券定义', notCache: true }, component: () => import(/* webpackChunkName: "coupon-definition" */ '@/view/marketing/coupon-definition') },
      { path: 'coupon-used', name: 'CouponUsed', meta: { title: '优惠券使用', notCache: true }, component: () => import(/* webpackChunkName: "coupon-used" */ '@/view/marketing/coupon-used') },
      { path: 'collage-product', name: 'CollageProduct', meta: { title: '拼团商品', notCache: true }, component: () => import(/* webpackChunkName: "collage-product" */ '@/view/marketing/collage-product') }
    ]
  },
  {
    path: '/finance',
    name: 'finance',
    component: () => import('./../view/dashboard'),
    meta: {
      title: '财务中心',
      icon: 'logo-yen'
    },
    children: [
      { path: 'wait-operate', name: 'WaitOperate', meta: { title: '待运营审核', notCache: true }, component: () => import(/* webpackChunkName: "wait-operate" */ '@/view/finance/wait-operate') },
      { path: 'wait-finance', name: 'WaitFinance', meta: { title: '待财务支付', notCache: true }, component: () => import(/* webpackChunkName: "wait-finance" */ '@/view/finance/wait-finance') },
      { path: 'bill-detail', name: 'BillDetail', meta: { title: '收支明细', notCache: true }, component: () => import(/* webpackChunkName: "bill-detail" */ '@/view/finance/bill-detail') },
      { path: 'payment', name: 'Payment', meta: { title: '支付单管理', notCache: true }, component: () => import(/* webpackChunkName: "payment" */ '@/view/finance/payment') }
    ]
  },
  {
    name: 'Login',
    path:'/login',
    component: () => import('../view/login'),
    meta: {
      title: '管理登录',
      keepAlive: false
    }
  },
]
export default routes
