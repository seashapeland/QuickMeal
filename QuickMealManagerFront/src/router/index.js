import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import OrderManagement from '@/views/OrderManagement.vue'
import FoodManagement from '@/views/FoodManagement.vue'
import UserManagement from '@/views/UserManagement.vue'
import DataStatistics from '@/views/DataStatistics.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard, 
    children: [ 
    { path: '', redirect: 'order-management' },
    { path: '/order-management', name: 'OrderManagement', component: OrderManagement },
    { path: '/food-management', name: 'FoodManagement', component: FoodManagement },
    { path: '/user-management', name: 'UserManagement', component: UserManagement },
    { path: '/data-statistics', name: 'DataStatistics', component: DataStatistics },
  ]},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
/*cd QuickMealManagerFront*/