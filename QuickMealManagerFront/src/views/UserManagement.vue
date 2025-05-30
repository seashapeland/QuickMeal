<template>
    <div class="user-container">
      <!-- 标签切换栏 -->
      <div class="user-tabs">
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
      <div class="user-content">
        <div v-if="activeTab === '用户总览'">
          <!-- 用户筛选工具栏 -->
          <div class="filters">
            <!-- 排序方式 -->
            <Dropdown
              label="排序方式"
              :options="sortOptions"
              v-model="selectedSort"
              id="sortDropdown"
              width="140px"
            />

            <!-- 首字母筛选 -->
            <Dropdown
              label="首字母"
              :options="alphabetOptions"
              v-model="selectedLetter"
              id="alphaDropdown"
              width="100px"
            />

            <!-- 搜索框 -->
            <SearchBox
              v-model="keyword"
              placeholder="搜索用户名"
              @search="handleUserSearch"
            />
            <!-- 发放优惠券按钮 -->
            <button class="confirm-btn" @click="isBatchMode = true" v-if="!isBatchMode">
              发放优惠券
            </button>
          </div>

          <!-- 用户卡片滚动列表 -->
          <div class="user-list-scroll">
            <div class="user-card" v-for="user in filteredUserList" :key="user.id">
              <!-- 复选框 -->
              <input
                v-if="isBatchMode"
                type="checkbox"
                :checked="selectedUserIds.includes(user.id)"
                @change="toggleUserSelection(user.id)"
                class="user-checkbox"
              />
              <!-- 用户头像 -->
              <img :src="`${BASE_URL}${user.avatar}?v=${Date.now()}`" class="user-avatar" alt="头像" />

              <!-- 用户信息 -->
              <div class="user-info">
                <h4 class="user-name">{{ user.username }}</h4>
                <p class="user-created">创建时间：{{ user.createdAt }}</p>
              </div>

              <!-- 操作按钮 -->
              <div class="user-actions">
                <button class="action-btn">查看消费</button>
                <button class="action-btn">查看优惠券</button>
              </div>
            </div>
          </div>
          <!-- 批量发放工具栏 -->
          <div class="batch-toolbar" v-if="isBatchMode">
            <span>已选择 {{ selectedUserIds.length }} 位用户</span>
            <div>
              <button class="confirm-btn" @click="openCouponModal" :disabled="selectedUserIds.length === 0">
                发放
              </button>
              <button class="cancel-btn" @click="exitBatchMode">取消</button>
            </div>
          </div>

          <!-- 发放优惠券弹窗（内容占位） -->
          <div v-if="showCouponModal" class="modal-overlay">
            <div class="modal-box">
              <h3>发放优惠券</h3>
              <p>这里是发放优惠券的弹窗内容（占位）</p>
              <div class="modal-actions">
                <button class="confirm-btn" @click="closeCouponModal">确认</button>
                <button class="cancel-btn" @click="closeCouponModal">取消</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === '优惠券总览'">
          <p>这里显示二维码相关内容...</p>
        </div>
        <div v-if="activeTab === '创建优惠券'">
          <p>这里显示门店地图相关内容...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref, watch, onMounted, nextTick, computed } from 'vue'
    import Dropdown from '@/components/Dropdown.vue'
    import SearchBox from '@/components/SearchBox.vue'
    import pinyin from 'pinyin'
    import { BASE_URL } from '@/utils/request'
    import { getAllUserList } from '@/api/user'



    const tabs = [
      { key: '用户总览', label: '用户总览' },
      { key: '优惠券总览', label: '优惠券总览' },
      { key: '创建优惠券', label: '创建优惠券' }
    ];
    const activeTab = ref('用户总览');  // 默认显示“管理员”标签内容
    watch(activeTab, (newVal) => {
      if (newVal === '用户总览') {
        exitBatchMode()
        fetchUserList()
      } else if (newVal === '优惠券总览') {
        
      } else if (newVal === '创建优惠券') {
        
      } 
    })

    onMounted(() => {
      fetchUserList()
    })
    const sortOptions = [
      { label: '用户名顺序', value: 'name' },
      { label: '创建时间降序', value: 'created-desc' },
      { label: '创建时间升序', value: 'created-asc' }
    ]

    const alphabetOptions = [
      { label: '全部', value: '' }, // ✅ 默认项
      ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({
        label: l,
        value: l
      }))
    ]

    const selectedSort = ref('name')
    const selectedLetter = ref('')
    const keyword = ref('')

    // 模拟用户数据
    const userList = ref([])

    async function fetchUserList() {
      try {
        const res = await getAllUserList()
        if (res?.data) {
          userList.value = res.data.map(item => ({
            id: item.id,
            username: item.nickname || item.username || '未知用户',
            avatar: item.avatar,
            createdAt: item.created_at
          }))
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
      } 
    }

    function sortByNameUniversal(list) {
      function isEnglish(str) {
        return /^[A-Za-z]/.test(str)
      }

      return list.sort((a, b) => {
        const aIsEn = isEnglish(a.username)
        const bIsEn = isEnglish(b.username)

        if (aIsEn && !bIsEn) return -1
        if (!aIsEn && bIsEn) return 1

        return a.username.localeCompare(b.username, 'zh-Hans-CN', { sensitivity: 'base' })
      })
    }

    function getFirstLetter(name) {
      const firstChar = name[0]

      // 如果是英文字母，直接返回原始字符
      if (/^[A-Za-z]$/.test(firstChar)) {
        return firstChar.toUpperCase()
      }

      // 否则认为是中文，用拼音提取首字母（转成大写）
      const py = pinyin(name, {
        style: pinyin.STYLE_FIRST_LETTER,
        heteronym: false
      })

      return py && py.length ? py[0][0].toUpperCase() : ''
    }


    // 过滤逻辑
    const filteredUserList = computed(() => {
      let list = [...userList.value]

      // 按首字母筛选（英文首字母或拼音首字母）
      if (selectedLetter.value) {
        list = list.filter(user =>
          getFirstLetter(user.username) === selectedLetter.value
        )
      }

      // 按关键字搜索
      if (keyword.value.trim()) {
        list = list.filter(user =>
          user.username.includes(keyword.value.trim())
        )
      }

      // 排序
      if (selectedSort.value === 'name') {
        list = sortByNameUniversal(list)
      } else if (selectedSort.value === 'created-desc') {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } else if (selectedSort.value === 'created-asc') {
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      }

      return list
    })


    function handleUserSearch(value) {
      keyword.value = value
    }

    const isBatchMode = ref(false)           // 是否正在批量发放模式
    const selectedUserIds = ref([]) // 存放被选中的用户 ID 列表
    const showCouponModal = ref(false) // 控制发放弹窗显示

    function toggleUserSelection(userId) {
      const idx = selectedUserIds.value.indexOf(userId)
      if (idx === -1) {
        selectedUserIds.value.push(userId)
      } else {
        selectedUserIds.value.splice(idx, 1)
      }
    }

    function exitBatchMode() {
      isBatchMode.value = false
      selectedUserIds.value = []
    }

    function openCouponModal() {
      showCouponModal.value = true
    }

    function closeCouponModal() {
      showCouponModal.value = false
      exitBatchMode()
    }

  </script>
  
  <style scoped>
  .user-container {
    display: flex;  /* 使用flex布局 */
    height: 100%;
  }
  
  .user-tabs {
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
  
  .user-content {
    flex-grow: 1;
    height: 100%;
    padding: 20px;
    background-color: #f9f9f9; /* 内容区域背景 */
    border: 2px solid #e9e9e9;  /* 右边的边框 */
    border-radius: 4px;
  }

  .filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.user-list-scroll {
  height: 520px;
  overflow-y: auto;
  padding-right: 8px;
}

.user-card {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 12px;
  background-color: #fff;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 16px;
  margin: 0;
  font-weight: bold;
}

.user-created {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

.user-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  background-color: #65ac7b;
}

.action-btn:hover {
  opacity: 0.8;
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

.user-checkbox {
  margin-right: 10px;
  transform: scale(1.2);
}

.batch-toolbar {
  position: sticky;
  bottom: 0;
  background: #ffffff;
  padding: 12px 24px;
  border-top: 2px solid #3b3b3b;
  border-left: 2px solid #3b3b3b;
  border-right: 2px solid #3b3b3b;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;
  border-radius: 6px 6px 0 0;
}

/* 内部按钮区域 */
.batch-toolbar .confirm-btn {
  background-color: #00b386;
  color: #fff;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  margin-left: 12px;
}

.batch-toolbar .confirm-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.batch-toolbar .cancel-btn {
  background-color: #e0e0e0;
  color: #555;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  margin-left: 8px;
}

  
  </style>
  