// api/table.js
import request from '@/utils/request'

export function getAllQRCodes() {
  const token = localStorage.getItem('token')  // 从本地存储获取 Token

  return request({
    url: '/table/qrcodes/',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
}

export function getTableStatusList() {
  return request({
    url: '/table/status/list/',
    method: 'get'
  });
}

// 获取订单详情
export function getOrderDetail(orderId) {
  return request.get(`/order/order/${orderId}/`);
}