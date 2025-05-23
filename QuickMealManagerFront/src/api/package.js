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