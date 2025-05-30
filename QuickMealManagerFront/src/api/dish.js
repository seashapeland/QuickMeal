// api/dish.js
import request from '@/utils/request'

// 创建菜品
export const createDishRequest = (data) => {
  const token = localStorage.getItem('token')  // 从 localStorage 获取 Token
  
  // 使用 FormData 发送包含图片和其他字段的数据
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('description', data.description)
  formData.append('price', data.price)
  formData.append('category_name', data.category)  // 菜品类别名称
  formData.append('status', data.status)
  formData.append('image', data.image)  // 菜品图片

  return request.post('/dish/create/', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'  // 设置请求头为 multipart/form-data
    }
  })
}

// 获取菜品种类
export const getDishCategories = () => {
  return request.get('/dish/categories/')
}

/**
 * 获取菜品列表（支持分类、状态、排序、搜索）
 * @param {Object} params - 筛选参数
 * @param {string} params.category - 类别名称（如 '甜品'，'肉类'，或 'all'）
 * @param {string} params.status - 上下架状态（'on-shelf' | 'off-shelf' | 'all'）
 * @param {string} params.sort - 排序方式（'default' | 'price-asc' | 'price-desc' | 'create-time' | 'update-time'）
 * @param {string} params.keyword - 搜索关键词
 * @returns Promise
 */
export const getDishList = (params) => {
  return request.get('/dish/list/', {
    params: {
      category: params.category || 'all',
      status: params.status || 'all',
      sort: params.sort || 'default',
      keyword: params.keyword || ''
    }
  })
}

export const updateDishStatus = (dish_id, action) => {
  const token = localStorage.getItem('token')
  return request.patch('/dish/changeStatus/', {
    dish_id,
    action  // "上架" 或 "下架"
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const updateDishPrice = (dish_id, new_price) => {
  const token = localStorage.getItem('token')
  return request.patch('/dish/update_price/', {
    dish_id,
    new_price
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getDishPriceHistory = (dishId) => {
  return request.get(`/dish/price_history/${dishId}/`)
}

export const updateDishInfo = (data) => {
  const token = localStorage.getItem('token')
  const formData = new FormData()

  formData.append('dish_id', data.dish_id)
  if (data.name) formData.append('name', data.name)
  if (data.description) formData.append('description', data.description)
  if (data.category) formData.append('category_name', data.category)
  if (data.image) formData.append('image', data.image)

  return request.patch('/dish/update/', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getDishReviews = (dishId) => {
  return request.get(`/review/dish/${dishId}/list/`)
}

