import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8000/api', // 改为你的后端地址
  timeout: 5000,
})

instance.interceptors.response.use(
  res => res.data,
  err => {
    console.error('请求错误：', err)
    return Promise.reject(err)
  }
)

export default instance
