import axios from 'axios'

const BASE_URL = 'http://localhost:8000';// http://localhost:8000  http://101.201.39.232:8000
const instance = axios.create({
  baseURL: 'http://localhost:8000', // 改为你的后端地址
  timeout: 5000,
})

instance.interceptors.response.use(
  res => res.data,
  err => {
    console.error('请求错误：', err)
    return Promise.reject(err)
  }
)

export { BASE_URL };
export default instance
