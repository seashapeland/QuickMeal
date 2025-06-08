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

// 处理退款：只更新订单状态为“已退款”
export function processRefund(orderId) {
  return request({
    url: '/order/update_status/',
    method: 'post',
    data: {
      order_id: orderId,
      status: '已退款'
    }
  });
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

