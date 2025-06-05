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
          </div>

          <div class="order-list-scroll">
            <div class="order-card" v-for="order in filteredOrders" :key="order.id">
              <div class="order-left">
                <div class="order-icon">🧾</div>
                <div class="order-info">
                  <p class="order-id">订单号：{{ order.id }}</p>
                  <p class="order-status">状态：{{ order.status }}</p>
                  <p class="order-user">
                    <img :src="order.user.avatar" class="avatar" />
                    {{ order.user.name }}
                  </p>
                  <p class="order-time">下单时间：{{ order.createdAt }}</p>
                </div>
              </div>
              <div class="order-actions">
                <button
                  v-if="order.status === '待餐中' && order.waitTime > 30"
                  class="confirm-btn"
                >
                  确认上菜
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === '历史订单'">
          <p>这里显示历史订单相关内容...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref, computed } from 'vue';
    const tabs = [
      { key: '今日订单', label: '今日订单' },
      { key: '历史订单', label: '历史订单' },
    ];
    const activeTab = ref('今日订单');
    const searchOrderId = ref('');
    const searchUsername = ref('');
    const orders = ref([
      {
        id: '20240521001',
        status: '待餐中',
        createdAt: '2025-05-21 10:00',
        waitTime: 45,
        user: {
          name: 'Alice',
          avatar: 'https://i.pravatar.cc/40?img=12'
        }
      },
      {
        id: '20240521002',
        status: '待支付',
        createdAt: '2025-05-21 10:10',
        waitTime: 0,
        user: {
          name: 'Bob',
          avatar: 'https://i.pravatar.cc/40?img=13'
        }
      },
      {
        id: '20240521002',
        status: '待支付',
        createdAt: '2025-05-21 10:10',
        waitTime: 0,
        user: {
          name: 'Bob',
          avatar: 'https://i.pravatar.cc/40?img=13'
        }
      },
      {
        id: '20240521002',
        status: '待支付',
        createdAt: '2025-05-21 10:10',
        waitTime: 0,
        user: {
          name: 'Bob',
          avatar: 'https://i.pravatar.cc/40?img=13'
        }
      },
      {
        id: '20240521002',
        status: '待支付',
        createdAt: '2025-05-21 10:10',
        waitTime: 0,
        user: {
          name: 'Bob',
          avatar: 'https://i.pravatar.cc/40?img=13'
        }
      },
      {
        id: '20240521002',
        status: '待支付',
        createdAt: '2025-05-21 10:10',
        waitTime: 0,
        user: {
          name: 'Bob',
          avatar: 'https://i.pravatar.cc/40?img=13'
        }
      }
    ]);

    const filteredOrders = computed(() => {
      return orders.value.filter(order => {
        return (
          order.id.includes(searchOrderId.value) &&
          order.user.name.includes(searchUsername.value)
        );
      });
    });
  </script>
  
  <style scoped>
  .order-container {
    display: flex;  /* 使用flex布局 */
    height: 100%;
  }
  
  .order-tabs {
    display: flex;
    flex-direction: column;  /* Tab竖直排列 */
    width: 45px;  /* 左侧边栏宽度 */
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
    border-left: 4px solid transparent; /* 初始无边框 */
  }
  
  .tab-item:hover {
    background-color: #e6f7e5;
    color: #65ac7b;
  }
  
  .tab-item.active {
    background-color: #e6f7e5;
    color: #65ac7b;
    border-color: #65ac7b;  /* 激活时显示左侧的绿色边框 */
  }
  
  .order-content {
    flex-grow: 1;
    height: 100%;
    padding: 20px;
    background-color: #f9f9f9; /* 内容区域背景 */
    border: 2px solid #e9e9e9;  /* 右边的边框 */
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
  max-height: 540px;
  overflow-y: auto;
}

.order-card {
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.order-left {
  display: flex;
  gap: 12px;
}

.order-icon {
  font-size: 32px;
}

.order-info p {
  margin: 2px 0;
  font-size: 14px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
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
  </style>
  