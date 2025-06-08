<template>
    <div class="order-container">
      <!-- 标签切换栏 -->
      <div class="order-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.key"  
          :class="['tab-item', activeTab === tab.key && 'active']"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>
  
      <!-- 内容区域 -->
      <div class="order-content">
        <div v-if="activeTab === '今日订单'">
          <div class="search-bar">
            <input v-model="searchOrderId" placeholder="搜索订单号" class="search-input" />
            <input v-model="searchUsername" placeholder="搜索用户名" class="search-input" />
            <button 
              @click="refreshOrders" 
              class="confirm-btn"
              :disabled="isRefreshing"
            >
              {{ isRefreshing ? '刷新中...' : '刷新' }}
            </button>
          </div>

          <div class="order-list-scroll">
            <div class="order-card" v-for="order in filteredOrders" :key="order.order_id">
              <!-- 左侧信息 -->
              <div class="order-left">
                <div class="order-header">
                  <img src="@/assets/order.png" class="order-icon" />
                  <p class="order-user">
                    <img :src="`${BASE_URL}${order.user.avatar}?v=${Date.now()}`" class="avatar" />
                    {{ order.user.name }}
                  </p>
                </div>
                <div class="order-info">
                  <p class="order-id">订单号：{{ order.order_id }}</p>
                  <p class="order-status" :data-status="order.status">状态：{{ order.status }}</p>
                  <p class="order-time">下单时间：{{ order.created_at }}</p>
                  <p class="order-table">桌号：{{ order.table_id }}</p>
                  <p class="order-total">金额：¥{{ order.total_price }}</p>
                </div>
              </div>

              <!-- 中间菜品区域 -->
              <div class="order-middle">
                <div class="order-dish-list">
                  <div v-for="item in order.items" :key="item.name" class="order-dish">
                    <img :src="`${BASE_URL}${item.image}?v=${Date.now()}`" class="dish-thumb" />
                    <div class="dish-info">
                      <p class="dish-name">{{ item.name }}</p>
                      <p class="dish-detail">数量：×{{ item.quantity }} | 总价：¥{{ item.total }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="order-actions">
                <button
                  v-if="order.status === '待餐中'"
                  class="confirm-btn"
                  @click="openModal('serve', order.order_id, order.table_id)"
                >
                  确认上菜
                </button>
                <button
                  v-if="order.status === '待餐中'"
                  class="cancel-order-btn"
                  @click="openModal('cancel', order.order_id, order.table_id)"
                >
                  取消订单
                </button>
                <button
                  v-if="order.status === '申请中'"
                  class="confirm-btn"
                  @click="openModal('refund', order.order_id, order.table_id)"
                >
                  确认退款
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === '待处理'">
          <div class="search-bar">
            <input v-model="searchOrderId" placeholder="搜索订单号" class="search-input" />
            <input v-model="searchUsername" placeholder="搜索用户名" class="search-input" />
            <button 
              @click="refreshOrders" 
              class="confirm-btn"
              :disabled="isRefreshing"
            >
              {{ isRefreshing ? '刷新中...' : '刷新' }}
            </button>
          </div>

          <div class="order-list-scroll">
            <div class="order-card" v-for="order in filteredOrders" :key="order.order_id">
              <!-- 左侧信息 -->
              <div class="order-left">
                <div class="order-header">
                  <img src="@/assets/order.png" class="order-icon" />
                  <p class="order-user">
                    <img :src="`${BASE_URL}${order.user.avatar}?v=${Date.now()}`" class="avatar" />
                    {{ order.user.name }}
                  </p>
                </div>
                <div class="order-info">
                  <p class="order-id">订单号：{{ order.order_id }}</p>
                  <p class="order-status" :data-status="order.status">状态：{{ order.status }}</p>
                  <p class="order-time">下单时间：{{ order.created_at }}</p>
                  <p class="order-table">桌号：{{ order.table_id }}</p>
                  <p class="order-total">金额：¥{{ order.total_price }}</p>
                </div>
              </div>

              <!-- 中间菜品区域 -->
              <div class="order-middle">
                <div class="order-dish-list">
                  <div v-for="item in order.items" :key="item.name" class="order-dish">
                    <img :src="`${BASE_URL}${item.image}?v=${Date.now()}`" class="dish-thumb" />
                    <div class="dish-info">
                      <p class="dish-name">{{ item.name }}</p>
                      <p class="dish-detail">数量：×{{ item.quantity }} | 总价：¥{{ item.total }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="order-actions">
                <button
                  v-if="order.status === '待餐中'"
                  class="confirm-btn"
                  @click="openModal('serve', order.order_id, order.table_id)"
                >
                  确认上菜
                </button>
                <button
                  v-if="order.status === '待餐中'"
                  class="cancel-order-btn"
                  @click="openModal('cancel', order.order_id, order.table_id)"
                >
                  取消订单
                </button>
                <button
                  v-if="order.status === '申请中'"
                  class="confirm-btn"
                  @click="openModal('refund', order.order_id, order.table_id)"
                >
                  确认退款
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === '历史订单'">
          <div class="search-bar">
            <input v-model="searchOrderId" placeholder="搜索订单号" class="search-input" />
            <input v-model="searchUsername" placeholder="搜索用户名" class="search-input" />
            <button 
              @click="refreshOrders" 
              class="confirm-btn"
              :disabled="isRefreshing"
            >
              {{ isRefreshing ? '刷新中...' : '刷新' }}
            </button>
          </div>

          <div class="order-list-scroll">
            <div class="order-card" v-for="order in filteredOrders" :key="order.order_id">
              <!-- 左侧信息 -->
              <div class="order-left">
                <div class="order-header">
                  <img src="@/assets/order.png" class="order-icon" />
                  <p class="order-user">
                    <img :src="`${BASE_URL}${order.user.avatar}?v=${Date.now()}`" class="avatar" />
                    {{ order.user.name }}
                  </p>
                </div>
                <div class="order-info">
                  <p class="order-id">订单号：{{ order.order_id }}</p>
                  <p class="order-status" :data-status="order.status">状态：{{ order.status }}</p>
                  <p class="order-time">下单时间：{{ order.created_at }}</p>
                  <p class="order-table">桌号：{{ order.table_id }}</p>
                  <p class="order-total">金额：¥{{ order.total_price }}</p>
                </div>
              </div>

              <!-- 中间菜品区域 -->
              <div class="order-middle">
                <div class="order-dish-list">
                  <div v-for="item in order.items" :key="item.name" class="order-dish">
                    <img :src="`${BASE_URL}${item.image}?v=${Date.now()}`" class="dish-thumb" />
                    <div class="dish-info">
                      <p class="dish-name">{{ item.name }}</p>
                      <p class="dish-detail">数量：×{{ item.quantity }} | 总价：¥{{ item.total }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="order-actions">
                <button
                  v-if="order.status === '待餐中'"
                  class="confirm-btn"
                  @click="openModal('serve', order.order_id, order.table_id)"
                >
                  确认上菜
                </button>
                <button
                  v-if="order.status === '待餐中'"
                  class="cancel-order-btn"
                  @click="openModal('cancel', order.order_id, order.table_id)"
                >
                  取消订单
                </button>
                <button
                  v-if="order.status === '申请中'"
                  class="confirm-btn"
                  @click="openModal('refund', order.order_id, order.table_id)"
                >
                  确认退款
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 确认弹窗 -->
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-box">
          <h3>{{ modalTitle }} ?</h3>
          <div class="modal-actions">
            <button class="cancel-btn" @click="showModal = false">取消</button>
            <button class="confirm-btn" @click="confirmAction">确认</button>
          </div>
        </div>
      </div>
    </teleport>
  </template>
  
  <script setup>
    import { ref, watch, onMounted, nextTick, computed } from 'vue';
    import { BASE_URL } from '@/utils/request'
    import { getAdminOrders, markOrderAsServed, processRefund, cancelOrder } from '@/api/order'
    import { ElMessage } from 'element-plus';
    const tabs = [
      { key: '今日订单', label: '今日订单' },
      { key: '待处理', label: '待处理' },
      { key: '历史订单', label: '历史订单' },
    ];
    const activeTab = ref('今日订单');
    const searchOrderId = ref('');
    const searchUsername = ref('');

    watch(activeTab, (newVal) => {
      if (newVal === '今日订单') {
        fetchOrders();
      } else if (newVal === '待处理') {
        fetchOrders();
      } else if (newVal === '历史订单') {
        fetchOrders();
      }
    })

    onMounted(async () => {
      fetchOrders();
    });

    const isRefreshing = ref(false); // 加载状态

    async function refreshOrders() {
      try {
        isRefreshing.value = true; // 开始加载
        await fetchOrders(); // 调用原有的获取订单方法
      } catch (err) {
        console.error('刷新订单失败', err);
        // 这里可以添加错误提示（如 Toast 弹窗）
      } finally {
        isRefreshing.value = false; // 结束加载
      }
    }

    const orders = ref([]);
    async function fetchOrders() {
      try {
        const res = await getAdminOrders();
        const processed = res.map(order => {
          const items = order.items.map(item => ({
            ...item,
            total: (item.price * item.quantity).toFixed(2)
          }));
          return {
            ...order,
            items
          };
        });
        orders.value = processed;
      } catch (err) {
        console.error('加载订单失败', err);
      }
    }
    

    // 根据当前标签页过滤订单
    const filteredOrders = computed(() => {
      // 首先根据标签页筛选基础订单
      let tabFilteredOrders = orders.value.filter(order => {
        const orderDate = new Date(order.created_at).toDateString()
        const today = new Date().toDateString()
        
        switch(activeTab.value) {
          case '今日订单':
            return orderDate === today
          case '待处理':
            return ['待餐中', '申请中'].includes(order.status)
          case '历史订单':
            return orderDate !== today
          default:
            return true
        }
      })
      
      // 然后应用搜索条件
      return tabFilteredOrders.filter(order => {
        const matchesOrderId = order.order_id.toString().includes(searchOrderId.value)
        const matchesUsername = (order.user?.name || '').toLowerCase().includes(searchUsername.value.toLowerCase())
        return matchesOrderId && matchesUsername
      })
    })
    // 弹窗相关状态
    const showModal = ref(false);
    const modalTitle = ref('');
    const modalAction = ref('');
    const currentOrderId = ref(null);
    const currentTableId = ref(null);

    // 打开弹窗
    const openModal = (action, orderId, tableId) => {
      modalAction.value = action;
      currentOrderId.value = orderId;
      currentTableId.value = tableId;
      
      switch(action) {
        case 'serve':
          modalTitle.value = '确认上菜完成';
          console.log(currentTableId.value)
          break;
        case 'refund':
          modalTitle.value = '确认退款';
          console.log(currentTableId.value)
          break;
        case 'cancel':
          modalTitle.value = '确认取消订单';
          console.log(currentTableId.value)
          break;
      }
      
      showModal.value = true;
    };

    // 确认操作
    const confirmAction = async () => {
      try {
        if (modalAction.value === 'serve') {
          await markOrderAsServed(currentOrderId.value, currentTableId.value);
          ElMessage.success('已确认上菜完成');
        } else if (modalAction.value === 'refund') {
          await processRefund(currentOrderId.value);
          ElMessage.success('退款处理成功');
        } else if (modalAction.value === 'cancel') {
          await cancelOrder(currentOrderId.value, currentTableId.value);
          ElMessage.success('订单已取消');
        }
        
        await fetchOrders();
        showModal.value = false;
      } catch (error) {
        ElMessage.error(`操作失败: ${error.message}`);
      }
    };

  
  </script>
  
  <style scoped>
  .order-container {
  display: flex;
  height: 100%;
}
.order-tabs {
  display: flex;
  flex-direction: column;
  width: 45px;
  gap: 16px;
  padding-top: 20px;
}
.tab-item {
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
  text-align: left;
  background-color: #f1f1f1;
  border-left: 4px solid transparent;
}
.tab-item:hover {
  background-color: #e6f7e5;
  color: #65ac7b;
}
.tab-item.active {
  background-color: #e6f7e5;
  color: #65ac7b;
  border-color: #65ac7b;
}
.order-content {
  flex-grow: 1;
  height: 100%;
  padding: 20px;
  background-color: #f9f9f9;
  border: 2px solid #e9e9e9;
  border-radius: 4px;
}
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.search-input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
.order-list-scroll {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 520px;
  overflow-y: auto;
  margin-top: 24px;
  padding-right: 8px;
}
.order-card {
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  gap: 20px;
}

.order-left {
  width: 240px;
}

.order-header {
  display: flex;
  align-items: center;
  gap: 10px; /* 控制图标和用户信息之间的间距 */
}

.order-icon {
  width: 36px;
  height: 36px;
  /* 移除了原来的 margin-bottom */
}

.order-user {
  margin: 0; /* 覆盖原来的 p 标签样式 */
  font-size: 14px;
  display: flex;
  align-items: center;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 6px;
  /* vertical-align: middle; 不再需要，因为使用了flex布局 */
}

.order-info {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.order-info p {
  margin: 6px 0;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
}

.order-info p::before {
  content: "•";
  color: #6c757d;
  margin-right: 8px;
  font-size: 16px;
}

.order-id {
  font-weight: 600;
  color: #212529 !important;
}

.order-status {
  color: #fff;
  background-color: #6c757d;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 4px !important;
}

/* 特定状态颜色 */
.order-status[data-status="申请中"],
.order-status[data-status="applying"] {
  background-color: #17a2b8; /* 青色 */
  background-image: linear-gradient(to bottom, #17a2b8, #138496);
}

.order-status[data-status="待餐中"],
.order-status[data-status="dining"] {
  background-color: #fd7e14; /* 橙色 */
  background-image: linear-gradient(to bottom, #fd7e14, #e36209);
}

.order-status[data-status="待支付"],
.order-status[data-status="unpaid"] {
  background-color: #ffc107; /* 黄色 */
  background-image: linear-gradient(to bottom, #ffc107, #e0a800);
  color: #212529; /* 深色文字提高可读性 */
  text-shadow: none;
}

.order-status[data-status="已完成"],
.order-status[data-status="completed"] {
  background-color: #28a745; /* 绿色 */
  background-image: linear-gradient(to bottom, #28a745, #1e7e34);
}

.order-status[data-status="已取消"],
.order-status[data-status="cancelled"] {
  background-color: #dc3545; /* 红色 */
  background-image: linear-gradient(to bottom, #dc3545, #c82333);
}

.order-status[data-status="已退款"],
.order-status[data-status="refunded"] {
  background-color: #6c757d; /* 灰色 */
  background-image: linear-gradient(to bottom, #6c757d, #5a6268);
  text-decoration: line-through;
}

.order-total {
  font-weight: 600;
  color: #dc3545 !important;
  margin-top: 8px !important;
  padding-top: 8px;
  border-top: 1px dashed #dee2e6;
}

.order-middle {
  flex: 1;
  min-width: 280px; /* 增加最小宽度 */
  max-height: 220px; /* 增加最大高度 */
  overflow-y: auto;
  padding: 0 12px;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #ddd transparent; /* Firefox */
}

/* 自定义滚动条 (Chrome/Safari) */
.order-middle::-webkit-scrollbar {
  width: 6px;
}
.order-middle::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
.order-middle::-webkit-scrollbar-track {
  background: transparent;
}

.order-dish-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 6px; /* 为滚动条留出空间 */
}

.order-dish {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgb(236, 236, 236);
}


.dish-thumb {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.dish-info {
  flex: 1;
  min-width: 0; /* 防止文本溢出 */
}

.dish-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-detail {
  font-size: 13px;
  color: #6c757d;
  display: flex;
  gap: 12px;
}

/* 套餐详情样式 */
.dish-details {
  margin-top: 8px;
  padding-left: 12px;
  border-left: 2px solid #eee;
}

.dish-details-item {
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.confirm-btn {
  background-color: #65ac7b;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.confirm-btn:hover {
  background-color: #4c9966;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-box h3 {
  margin-bottom: 16px;
  font-size: 18px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
}

.confirm-btn {
  background-color: #65ac7b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #4c9966;
}

.cancel-btn {
  background-color: #ccc;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #c1c1c1;
}

.cancel-order-btn {
  background-color: #f56c6c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-order-btn:hover {
  background-color: #e64c4c;
}

  </style>
  