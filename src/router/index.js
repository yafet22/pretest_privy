// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'

function loadView(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `../views/${view}.vue`)
}
function loadDashboardMenu(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `../views/dashboard-menu/${view}.vue`)
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
    component: loadView('Dashboard'),
    meta: { requiresAuth: true },
    children: [
      {
        name: 'Dashboard',
        path: '/',
        component: loadDashboardMenu('Main')
      },
      {
        name: 'CarrerEdu',
        path: '/carrer-edu',
        component: loadDashboardMenu('CarrerEdu')
      },
      {
        name: 'Message',
        path: '/message',
        component: loadDashboardMenu('Message')
      },
      {
        name: 'Profile',
        path: '/profile',
        component: loadDashboardMenu('Profile')
      }
    ]
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
  if ((to.name === 'Home') && store.state.isLoggedIn) {
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
