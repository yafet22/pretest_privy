// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'

function loadView(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `../views/${view}.vue`)
}

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadView('HomePage')
  },
  {
    path: '/verification',
    name: 'Verification',
    component: loadView('VerificationPage')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: loadView('Dashboard'),
    meta: { requiresAuth: true }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth) && !store.state.isLoggedIn) {
    next({ name: 'Home' })
    return
  }
  if ((to.name === 'login') && store.state.isLoggedIn) {
    next({ name: 'Dashboard' })
    return
  }
  if ((to.name === 'Verification') && !store.state.isAlreadyRegister) {
    next({ name: 'Home' })
    return
  }
  next()
})

export default router
