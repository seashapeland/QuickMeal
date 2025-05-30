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
          <p>这里显示今日订单相关内容...</p>
        </div>
        <div v-if="activeTab === '历史订单'">
          <p>这里显示历史订单相关内容...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    const tabs = [
      { key: '今日订单', label: '今日订单' },
      { key: '历史订单', label: '历史订单' },
    ];
    const activeTab = ref('今日订单');
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
  
  </style>
  