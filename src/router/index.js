import Vue from 'vue';
import Router from 'vue-router';
import store from './../store'
import iView from 'iview';
import $cookies from 'vue-cookies'
import routes from './routes'

Vue.use(Router)
Vue.use(iView)

routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({
  mode: 'history',
  routes
});

function findName (name) {
  const nav = JSON.parse(localStorage.NAVIGATE_MENU).data
  for (let i of nav) {
    if (i.route == name) return i.name
    else {
      for (let j of i.children) {
        if (j.route == name) return j.name
      }
    }
  }
}

/*
// 懒加载组件
function load(name){
	return function () {
		return import(`@/view/${name}.vue`)
	}
}
// 根据后台生成路由
router.addRoutes(localStorage.routes.map(e => ({
	path: `/${e.name}`,
	name: e.route,
	components: () => import('@/view/dashboard.vue')
	children: e.children.map(c => ({
		path: `/${c.name}`,
		name: c.route,
		components: load(c.name)
	}))
})))
*/

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  let title = to.meta && to.meta.title;
  if (localStorage.NAVIGATE_MENU) title = findName(to.name);
  if (title) {
    document.title = title;
  }
  store.commit('updateReferer', {
    referer: from
  })
  let token = $cookies.get('AUTH_TOKEN')
  //没有token，则全部需要登录
  if (to.name != 'Login') {
    if (!token) {
      next({
        path: '/login?referer=' + to.fullPath
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
router.afterEach(() => {
  iView.LoadingBar.finish()
})
export {
  router
};