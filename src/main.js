import Vue from 'vue'
import store from './store'
import { router } from './router'
import { sync } from 'vuex-router-sync'
import * as Filter from './filter'
import {LocalStorage} from './utils'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'
import iView from 'iview'
import '@/components/_globals'
import '@/service'
import './theme/common.less'

Vue.use(iView, { transfer: true });
Vue.use(VueClipboard)

iView.Message.config({ top: 80 })
iView.Notice.config({ top: 80 })
//加载过滤器
Object.keys(Filter).forEach(key => {
  Vue.filter(key, Filter[key])
})
Vue.prototype.LocalStorage = LocalStorage
Vue.config.productionTip = false
sync(store, router)

window.vm=new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
