// api/auth.js
import request from '@/utils/request'

// 实际后端上线后替换此函数即可
export const loginAdmin = (data) => {
  // TODO: 替换为后端实际登录接口
  return request.post('/login', data)
}

// 示例：模拟登录（前期开发用）
export const mockLoginAdmin = (data) => {
  const { username, password } = data

  // 假设管理员账号 admin / 密码 123456
  if (username === 'admin' && password === '123456') {
    return Promise.resolve({
      token: 'mock-token-123456',
      username: 'admin'
    })
  } else {
    return Promise.resolve({
      error: '用户名或密码错误'
    })
  }
}
