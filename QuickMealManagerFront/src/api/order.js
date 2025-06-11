// api/order.js
import request from '@/utils/request'


// 获取全部管理员订单列表（不加工原始数据）
export function getAdminOrders() {
  const token = localStorage.getItem('token');
  return request({
    url: '/order/admin/orders/',
    method: 'get',
  });
}


// 上菜完成：订单设为“待支付”，餐桌状态也设为“待支付”
export function markOrderAsServed(orderId, tableId) {
  return Promise.all([
    request({
      url: '/order/update_status/',
      method: 'post',
      data: {
        order_id: orderId,
        status: '待支付'
      }
    }),
    request({
      url: '/table/update_status/',
      method: 'post',
      data: {
        table_id: tableId,
        status: '待支付'
      }
    })
  ]);
}


// ✅ 整合订单退款 + 优惠券退还
export async function processRefund(orderId) {
  const token = localStorage.getItem('token');

  // Step 1: 更新订单状态为已退款
  await request({
    url: '/order/update_status/',
    method: 'post',
    data: {
      order_id: orderId,
      status: '已退款'
    }
  });

  // Step 2: 尝试退还优惠券（如果有绑定）
  try {
    await request({
      url: '/coupon/return/',
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        order_id: orderId
      }
    });
    console.log(`优惠券已成功退还（订单 ${orderId}）`);
  } catch (err) {
    console.warn(`订单 ${orderId} 没有可退还的优惠券或已过期：`, err.response?.data || err.message);
  }
}


// 取消订单：更新订单状态、餐桌状态，并解绑订单
export async function cancelOrder(orderId, tableId) {
  try {
    await request({
      url: '/order/update_status/',
      method: 'post',
      data: {
        order_id: orderId,
        status: '已取消'
      }
    });

    await request({
      url: '/table/update_status/',
      method: 'post',
      data: {
        table_id: tableId,
        status: '空闲'
      }
    });

    await request({
      url: '/table/unbind_order/',
      method: 'post',
      data: {
        table_id: tableId
      }
    });
  } catch (error) {
    console.error('取消订单失败:', error);
    throw error;  // 抛出错误以便上层 catch 捕获处理
  }
}

