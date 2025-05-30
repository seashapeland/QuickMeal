// api/package.js
import request from '@/utils/request'

export const createPackageRequest = (data) => {
  const token = localStorage.getItem('token')
  const formData = new FormData()

  formData.append('name', data.name)
  formData.append('description', data.description)
  formData.append('price', data.price)
  formData.append('status', data.status)
  if (data.image) {
    formData.append('image', data.image)
  }
  formData.append('items', JSON.stringify(data.items.map(item => ({
    id: item.id,
    quantity: item.quantity
  }))))

  return request.post('/package/create/', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getPackageList = (params) => {
  return request.get('/package/list/', { params })
}

// 更新套餐菜品
export const updatePackageItems = (data) => {
  const token = localStorage.getItem('token')
  return request.patch('/package/update_items/', data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export const updatePackageInfoRequest = (data) => {
  const token = localStorage.getItem('token')
  return request.patch('/package/update_info/', data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updatePackageStatus = (data) => {
  const token = localStorage.getItem('token')
  return request.patch('/package/update_status/', data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export const updatePackagePrice = (data) => {
  const token = localStorage.getItem('token')
  return request.patch('/package/update_price/', data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const getPackagePriceHistory = (packageId) => {
  return request.get(`/package/price_history/${packageId}/`)
}

export const getPackageReviews = (packageId) => {
  return request.get(`/review/package/${packageId}/list/`)
}