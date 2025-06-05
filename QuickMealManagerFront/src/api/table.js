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