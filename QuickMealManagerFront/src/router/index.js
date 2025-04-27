import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import OrderManagement from '@/views/OrderManagement.vue'
import FoodManagement from '@/views/FoodManagement.vue'
import UserManagement from '@/views/UserManagement.vue'
import DataStatistics from '@/views/DataStatistics.vue'
import StoreManagement from '@/views/StoreManagement.vue'
import SuperManagement from '@/views/SuperManagement.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },  // 登录页面不需要Token
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true },  // Dashboard及子页面都需要验证Token
    children: [ 
      { path: '', redirect: 'store-management' },
      { path: '/store-management', name: 'StoreManagement', component: StoreManagement, meta: { requiresAuth: true } },
      { path: '/order-management', name: 'OrderManagement', component: OrderManagement, meta: { requiresAuth: true } },
      { path: '/food-management', name: 'FoodManagement', component: FoodManagement, meta: { requiresAuth: true } },
      { path: '/user-management', name: 'UserManagement', component: UserManagement, meta: { requiresAuth: true } },
      { path: '/data-statistics', name: 'DataStatistics', component: DataStatistics, meta: { requiresAuth: true } },
      { path: '/super-management', name: 'SuperManagement', component: SuperManagement, meta: { requiresAuth: true } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果目标路由需要登录（requiresAuth: true）
  if (to.meta.requiresAuth) {
    // 获取token
    const token = localStorage.getItem('token')

    // 如果没有token，跳转到登录页面
    if (!token) {
      next('/')
    } else {
      // 如果有token，继续访问目标页面
      next()
    }
  } else {
    // 登录页面或者不需要token的页面直接跳转
    next()
  }
})

export default router
/*cd QuickMealManagerFront*/