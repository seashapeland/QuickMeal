// api/coupon.js
import request from '@/utils/request'

// 创建优惠券
export function createCoupon(data) {
  const token = localStorage.getItem('token') // 从本地存储获取 Token
  return request({
    url: '/coupon/create/',
    method: 'post',
    headers: {
      'Authorization': `Bearer ${token}` // 手动添加 Token
    },
    data: data
  })
}

// 获取优惠券列表
export function getCoupons() {
  const token = localStorage.getItem('token') // 从本地存储获取 Token
  return request({
    url: '/coupon/list/',
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token}` // 手动添加 Token
    },
  })
}

// 删除优惠券
export function deleteCoupon(couponId) {
  const token = localStorage.getItem('token') // 从本地存储获取 Token
  return request({
    url: `/coupon/delete/${couponId}/`,
    method: 'delete',
    headers: {
      'Authorization': `Bearer ${token}` // 手动添加 Token
    },
  })
}

// 发放优惠券给单个用户
export function assignCouponToUser(userId, couponId) {
  const token = localStorage.getItem('token')
  return request({
    url: '/coupon/assign/',
    method: 'post',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      user_id: userId,
      coupon_id: couponId
    }
  })
}