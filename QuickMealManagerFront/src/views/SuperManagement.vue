<template>
  <div class="sm-container">
    <!-- 标签切换栏 -->
    <div class="sm-tabs">
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
    <div class="sm-content">
      <div v-if="activeTab === '管理员'">
        <!-- 创建按钮 -->
        <div class="create-btn-container">
          <button class="create-btn" @click="openCreateModal">创建</button>
        </div>

        <!-- 管理员信息展示区 -->
        <div class="admin-list">
          <div class="admin-card" v-for="(admin, index) in admins" :key="index">
            <div class="admin-info">
              <h3>{{ admin.username }}</h3>
              <p>状态：<span :class="{'active': admin.status === '可用', 'inactive': admin.status === '禁用'}">{{ admin.status }}</span></p>
              <p>上次登录：{{ admin.last_login_time }}</p>
              <p>创建时间：{{ admin.created_at }}</p>
            </div>
            <div class="admin-actions">
              <button class="action-btn" @click="openChangePasswordModal(admin)">修改密码</button>
              <button class="action-btn" @click="openDisableModal(admin)">{{ admin.status === '可用' ? '禁用' : '恢复' }}</button>
              <button class="action-btn" @click="openDeleteModal(admin)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建管理员弹窗 -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-box">
        <h3>创建管理员</h3>
        <!-- 管理员名字输入框 -->
        <div class="form-group">
          <label for="admin-name">管理员名字</label>
          <input 
            v-model="newAdmin.username" 
            type="text" 
            id="admin-name" 
            placeholder="请输入管理员名字" 
          />
        </div>
        <!-- 管理员密码输入框 -->
        <div class="form-group">
          <label for="admin-password">密码</label>
          <input 
            v-model="newAdmin.password" 
            type="password" 
            id="admin-password" 
            placeholder="请输入管理员密码" 
          />
        </div>
        <!-- 错误信息 -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        
        <div class="modal-actions">
          <button class="confirm-btn" @click="createAdmin">创建</button>
          <button class="cancel-btn" @click="closeCreateModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showChangePasswordModal" class="modal-overlay">
      <div class="modal-box">
        <h3>修改密码</h3>
        <!-- 密码输入框 -->
        <div class="form-group">
          <label for="new-password">新密码</label>
          <input 
            v-model="newPassword" 
            type="password" 
            id="new-password" 
            placeholder="请输入新密码" 
          />
        </div>
        <!-- 错误信息 -->
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        
        <div class="modal-actions">
          <button class="confirm-btn" @click="changePassword">确定</button>
          <button class="cancel-btn" @click="closeChangePasswordModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 禁用/恢复弹窗 -->
    <div v-if="showDisableModal" class="modal-overlay">
      <div class="modal-box">
        <h3>确定{{ currentStatusAction }}？</h3>
        <div class="modal-actions">
          <button class="confirm-btn" @click="confirmStatusChange">确定</button>
          <button class="cancel-btn" @click="closeDisableModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 删除弹窗 -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-box">
        <h3>确定删除？</h3>
        <div class="modal-actions">
          <button class="confirm-btn" @click="confirmDelete">确定</button>
          <button class="cancel-btn" @click="closeDeleteModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { getAdminList, createAdminRequest, changePasswordRequest, disableAdmin, restoreAdmin, deleteAdmin } from '@/api/auth'

  const tabs = [
    { key: '管理员', label: '管理员' },
    { key: '二维码', label: '二维码' },
    { key: '门店地图', label: '门店地图' }
  ];
  const activeTab = ref('管理员');  // 默认显示“管理员”标签内容

  const admins = ref([]);
  const fetchAdminList = async () => {
    try {
      const res = await getAdminList()  // 调用获取管理员列表接口

      // 对返回的管理员数据进行处理，转换status值
      admins.value = res.data.map(admin => {
        return {
          ...admin,
          status: admin.status ? '可用' : '禁用',  // 将 true/false 转换为 可用/禁用
        }
      })

    } catch (err) {
      alert('获取管理员列表失败：' + err.response.data.detail)
    }
  }

  watch(activeTab, (newVal) => {
    if (newVal === '管理员') {
      fetchAdminList()
    }
  })
  onMounted(() => {
    fetchAdminList()  // 页面加载时获取管理员列表
  })

  const showCreateModal = ref(false);  // 控制创建管理员弹窗的显示与隐藏
  const newAdmin = ref({ username: '', password: '' });  // 新管理员的输入信息
  const errorMessage = ref('');  // 错误信息占位

  const showChangePasswordModal = ref(false);  // 控制修改密码弹窗的显示与隐藏
  const newPassword = ref('');  // 新密码输入框内容
  const passwordError = ref('');  // 错误信息占位

  // 控制禁用/恢复和删除的弹窗显示
  const showDisableModal = ref(false);
  const showDeleteModal = ref(false);
  const currentAdmin = ref(null);  // 当前操作的管理员
  const currentStatusAction = ref('');  // 当前操作（禁用/恢复）

  // 打开创建管理员弹窗
  function openCreateModal() {
    newAdmin.value.username = ''
    newAdmin.value.password = ''
    showCreateModal.value = true;
  }

  // 关闭创建管理员弹窗
  function closeCreateModal() {
    showCreateModal.value = false;
    errorMessage.value = '';  // 清除错误信息
  }

  // 创建管理员
  const createAdmin = async () => {
    try {
      const res = await createAdminRequest(newAdmin.value)  // 传递Token
      if (res.detail) {
        errorMessage.value = res.detail
      } else {
        // 请求成功时
        closeCreateModal()
        fetchAdminList()
      }
      

    } catch (error) {
      // 请求失败时，显示错误信息
      alert('创建管理员失败：' + error.response.data.detail)
    }
  }

  // 打开修改密码弹窗
  function openChangePasswordModal(admin) {
    currentAdmin.value = admin;
    newPassword.value = ''
    showChangePasswordModal.value = true;
  }

  // 关闭修改密码弹窗
  function closeChangePasswordModal() {
    showChangePasswordModal.value = false;
    passwordError.value = '';  // 清除错误信息
  }

  // 修改密码
  const changePassword = async () => {
    try {
      const res = await changePasswordRequest({ username: currentAdmin.value.username, new_password: newPassword.value })
      if (res.detail) {
        passwordError.value = res.detail
      } else {
        // 请求成功时
        closeChangePasswordModal()
        alert('修改密码成功')
      }
      
    } catch (error) {
      alert('修改密码失败：' + error.response.data.detail)
    }
  }

  // 打开禁用/恢复弹窗
  function openDisableModal(admin) {
    currentAdmin.value = admin;
    currentStatusAction.value = admin.status === '可用' ? '禁用' : '恢复';
    showDisableModal.value = true;
  }

  // 关闭禁用/恢复弹窗
  function closeDisableModal() {
    showDisableModal.value = false;
  }

  // 确认禁用/恢复
  const confirmStatusChange = async () => {
    if (currentStatusAction.value === '禁用') {
      try {
        const res = await disableAdmin({ username: currentAdmin.value.username })
        alert('该管理员已禁用')
        closeDisableModal()
        fetchAdminList()
      } catch (error) {
        alert('禁用管理员失败：' + error.response.data.detail)
      }
    } else {
      try {
        const res = await restoreAdmin({ username: currentAdmin.value.username })
        alert('该管理员已恢复')
        closeDisableModal()
        fetchAdminList()
      } catch (error) {
        alert('恢复管理员失败：' + error.response.data.detail)
      }
    }
    
  }

  // 打开删除弹窗
  function openDeleteModal(admin) {
    currentAdmin.value = admin;
    showDeleteModal.value = true;
  }

  // 关闭删除弹窗
  function closeDeleteModal() {
    showDeleteModal.value = false;
  }

  // 确认删除
  const confirmDelete = async () => {
    try {
      const res = await deleteAdmin({ username: currentAdmin.value.username })
      alert('该管理员已删除')
      closeDeleteModal()
      fetchAdminList()
    } catch (error) {
      alert('删除管理员失败：' + error.response.data.detail)
    }
  }
</script>

<style scoped>
.sm-container {
  display: flex;
  height: 100%;
}

.sm-tabs {
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

.sm-content {
  flex-grow: 1;
  height: 100%;
  padding: 20px;
  background-color: #f9f9f9;
  border: 2px solid #e9e9e9;
  border-radius: 4px;
}

.create-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.create-btn {
  padding: 8px 16px;
  background-color: #00b386;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-btn:hover {
  background-color: #4ca70f;
}

.admin-list {
  max-height: 520px;
  overflow-y: auto;
}

.admin-card {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 12px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.admin-info {
  flex: 1;
}

.admin-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.admin-info p {
  font-size: 14px;
  color: #888;
  margin: 4px 0;
}

.admin-info span.active {
  color: #52c41a;
}

.admin-info span.inactive {
  color: #f56c6c;
}

.admin-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-btn:hover {
  opacity: 0.8;
}

.action-btn:nth-child(1) {
  background-color: #ff4d4f;
  color: white;
}

.action-btn:nth-child(2) {
  background-color: #f4b400;
  color: white;
}

.action-btn:nth-child(3) {
  background-color: #65ac7b;
  color: white;
}

/* 创建管理员弹窗样式 */
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

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
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
</style>
