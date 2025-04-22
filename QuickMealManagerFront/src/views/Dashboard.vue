<template>
    <div class="dashboard-container">
      <!-- Top Navigation -->
      <div class="top-nav">
        <img class="logo" src="@/assets/logo.png" alt="Logo" />
        <h1>曲辰智慧点餐 · 管理后台</h1>
        <div class="user-info">
          <span class="username">管理员</span>
          <button class="logout-btn" @click="logout">退出</button>
        </div>
      </div>
  
      <!-- Sidebar Menu -->
      <div class="sidebar">
        <ul>
            <router-link to="/store-management" class="menu-link" exact-active-class="active">
                <li class="menu-item">
                    <img src="@/assets/store.png" alt="门店经营" class="menu-icon" />
                    <p class="menu-text">门店经营</p>
                </li>
            </router-link>
            <router-link to="/order-management" class="menu-link" exact-active-class="active">
                <li class="menu-item">
                    <img src="@/assets/dingdan.png" alt="订单管理" class="menu-icon" />
                    <p class="menu-text">订单管理</p>
                </li>
            </router-link>
            <router-link to="/food-management" class="menu-link" exact-active-class="active">
                <li class="menu-item">
                    <img src="@/assets/caiping.png" alt="菜品管理" class="menu-icon" />
                    <p class="menu-text">菜品管理</p>
                </li>
            </router-link>
            <router-link to="/user-management" class="menu-link" exact-active-class="active">
                <li class="menu-item">
                    <img src="@/assets/user.png" alt="用户管理" class="menu-icon" />
                    <p class="menu-text">用户管理</p>
                </li>
            </router-link>
            <router-link to="/data-statistics" class="menu-link" exact-active-class="active">
                <li class="menu-item">
                    <img src="@/assets/data.png" alt="数据统计" class="menu-icon" />
                    <p class="menu-text">数据统计</p>
                </li>
            </router-link>
            <router-link to="/super-management" class="menu-link" exact-active-class="active">
                <li class="menu-item">
                    <img src="@/assets/storeM.png" alt="门店管理" class="menu-icon" />
                    <p class="menu-text">门店管理</p>
                </li>
            </router-link>
        </ul>
      </div>
  
      <!-- Main Content -->
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const logout = () => {
    localStorage.removeItem('token')  // 清除登录状态
    window.location.href = '/'   // 跳转到登录页面
  }

    
</script>
  
<style scoped>
  .dashboard-container {
    display: flex;
    height: 100vh;
    background-color: #f9f9f9;
    padding-top: 72px;
  }
  
  .top-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 32px;
        background-color: #65ac7b;
        color: white;
        width: 100%;
        position: fixed; /* 使导航栏固定在顶部 */
        top: 0;
        left: 0;
        z-index: 10;
    }

  
  .top-nav .logo {
    height: 40px;
  }
  
  .top-nav h1 {
    font-size: 20px;
    font-weight: 700;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .username {
    margin-right: 10px;
  }
  
  .logout-btn {
    background-color: #ff4d4f;
    color: white;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
  }

  .logout-btn:hover {
    background-color: #db4f51;
  }
  
  .sidebar {
    width: 220px;
    background-color: #fff;
    padding: 16px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .menu-link {
    text-decoration: none !important;
  }

  .menu-item {
    display: flex;
    align-items: center; /* 图标和文字垂直居中对齐 */
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 12px;
    cursor: pointer;  /* 鼠标悬停显示为手指 */
    /*border-left: 4px solid #71ac7a;*/
  }

  .menu-text {
    text-decoration: none;
    color: #184b29;
    font-size: 16px;
    font-weight: 400;
    display: flex;
    align-items: center; /* 保证文字和图标水平排列 */
  }

  .menu-icon {
    width: 24px; /* 自定义图标宽度 */
    height: 24px; /* 自定义图标高度 */
    margin-right: 10px; /* 图标和文字之间的间距 */
  }

  .menu-item:hover {
    background-color: #e1f4e6; /* 鼠标悬停效果 */
  }

  .active .menu-item {
    background-color: #cdf0d6; /* 鼠标悬停和选中时相同的背景颜色 */
  }
  
  .main-content {
    flex-grow: 1;
    padding: 20px;
  }
  
  
</style>
  