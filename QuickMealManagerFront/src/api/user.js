// api/user.js
import request from '@/utils/request'

export function getAllUserList() {
  const token = localStorage.getItem('token')
  return request({
    url: '/user/list/',
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}