// api/auth.js
import request from '@/utils/request'

// 调用后端登录接口
export const loginAdmin = (data) => {
  return request.post('/manager/login/', data)  // 使用正确的后端接口路径
}

// 获取管理员列表
export const getAdminList = () => {
  const token = localStorage.getItem('token')  // 从 localStorage 获取 Token
  return request.get('/manager/admin_list/', {
    headers: {
      'Authorization': `Bearer ${token}`  // 在请求头中添加 Token
    }
  })
}

// 创建管理员
export const createAdminRequest = (data) => {
  const token = localStorage.getItem('token')
  return request.post('/manager/create_admin/', data, {
    headers: {
      'Authorization': `Bearer ${token}`  // 传递Token
    }
  })
}

// 修改密码
export const changePasswordRequest = (data) => {
  const token = localStorage.getItem('token')
  return request.patch('/manager/change_password/', data, {
    headers: {
      'Authorization': `Bearer ${token}`  // 传递Token
    }
  })
}

export const disableAdmin = (data) => {
  const token = localStorage.getItem('token')
  return request.patch('/manager/disable_admin/', data, {
    headers: {
      'Authorization': `Bearer ${token}`  // 传递Token
    }
  })
}

export const restoreAdmin = (data) => {
  const token = localStorage.getItem('token')
  return request.patch('/manager/restore_admin/', data, {
    headers: {
      'Authorization': `Bearer ${token}`  // 传递Token
    }
  })
}

export const deleteAdmin = (data) => {
  const token = localStorage.getItem('token')
  return request.delete('/manager/delete_admin/', {
    data: { username: data.username },  // 将数据放在请求体中
    headers: {
      'Authorization': `Bearer ${token}`  // 传递Token
    }
  })
}

export function getShopReviews() {
  return request({
    url: '/review/store/list/',
    method: 'get'
  })
}

