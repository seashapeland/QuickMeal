<template>
  <div class="food-container">
    <!-- 顶部 Tab 切换栏 -->
    <div class="food-tabs">
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
    <div class="food-content">
      <div v-if="activeTab === 'overview'">
        <div class="filters">
          <!-- 菜品种类下拉框 -->
          <Dropdown 
            label="菜品种类"
            :options="categoryOptions"
            v-model="selectedCategory"
            id="categoryDropdown"
            width="120px" 
          />

          <!-- 菜品状态下拉框 -->
          <Dropdown
            label="菜品状态"
            :options="statusOptions"
            v-model="selectedStatus"
            id="statusDropdown"
            width="120px"
            customClass="filter-dropdown"
          />

          <!-- 排序方式下拉框 -->
          <Dropdown
            label="排序方式"
            :options="sortOptions"
            v-model="selectedSort"
            id="sortDropdown"
            width="140px"
            customClass="filter-dropdown"
          />

          <!-- 搜索框 -->
          <SearchBox
            v-model="keyword"
            placeholder="搜索菜品"
            @search="handleSearch"
          />
        </div>

        <!-- 菜品总览展示区 -->
        <div class="food-list-scroll">
          <div class="food-item-card" v-for="item in mockFoodList" :key="item.id">
            <!-- 图片 -->
            <img :src="item.image" alt="菜品图" class="food-img" />

            <!-- 主要信息 -->
            <div class="food-info">
              <h3 class="food-name">{{ item.name }}</h3>
              <p class="food-price">¥{{ item.price.toFixed(2) }}</p>
              <p class="food-status">
                状态：<span :class="item.status === '上架' ? 'on' : 'off'">{{ item.status }}</span>
              </p>
              <p class="food-meta">创建：{{ item.createdAt }}</p>
              <p class="food-meta">更新：{{ item.updatedAt }}</p>
            </div>

            <!-- 操作 -->
            <div class="food-actions">
              <!-- 查看评价 -->
              <button class="view-reviews-btn">查看评价</button>
              
              <!-- 修改价格 -->
              <button class="edit-price-btn" @click="openPriceModal(item)">修改价格</button>
              <!-- 修改价格弹窗 -->
              <div v-if="showModal" class="modal-overlay">
                <div class="modal-box">
                  <h3>修改价格</h3>

                  <input
                    v-model="newPrice"
                    type="number"
                    class="price-input"
                    placeholder="请输入新的价格"
                  />

                  <div class="modal-actions">
                    <button class="confirm-btn" @click="confirmPriceChange">确认</button>
                    <button class="cancel-btn" @click="closeModal">取消</button>
                  </div>
                </div>
              </div>
              <!-- 上架/下架 -->
              <button class="toggle-status-btn" 
                      :class="item.status === '上架' ? 'off' : 'on'"
                      @click="openStatusModal(item)">
                {{ item.status === '上架' ? '下架' : '上架' }}
              </button>
              <div v-if="showStatusModal" class="modal-overlay">
                <div class="modal-box">
                  <h3>确认{{ currentStatusAction }}？</h3>
                  <div class="modal-actions">
                    <button class="confirm-btn" @click="confirmStatusChange">确认</button>
                    <button class="cancel-btn" @click="cancelStatusChange">取消</button>
                  </div>
                </div>
              </div>

              <button class="edit-btn" @click="openEditModal(item)">编辑</button>
              <div v-if="showEditModal" class="edit-modal-mask">
                <div class="modal-box">
                  <h3>编辑菜品</h3>
                  <div class="form-group">
                    <label>菜品名</label>
                    <input v-model="editingDish.name" type="text" placeholder="输入菜品名" />
                  </div>
                  <div class="form-group">
                    <label>描述</label>
                    <input v-model="editingDish.description" type="text" placeholder="输入菜品描述" />
                  </div>
                  <div class="form-group">
                    <label>图片</label>
                    <input type="file" @change="handleImageChange" />
                  </div>
                  <div class="form-group">
                    <label>菜品类别</label>
                    <select v-model="editingDish.category">
                      <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>

                  <div class="modal-actions">
                    <button class="confirm-btn" @click="updateDish">更新</button>
                    <button class="cancel-btn" @click="cancelEdit">取消</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div v-else-if="activeTab === 'publish'">
        <p>📦 上架管理区域 - 占位内容</p>
      </div>
      <div v-else-if="activeTab === 'review'">
        <p>📝 评价反馈区域 - 占位内容</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import Dropdown from '@/components/Dropdown.vue'
  import SearchBox from '@/components/SearchBox.vue'
  const tabs = [
    { key: 'overview', label: '菜品总览' },
    { key: 'publish', label: '上架管理' },
    { key: 'review', label: '评价反馈' }
  ]

  const activeTab = ref('overview')
  
  const categoryOptions = [
    { label: '全部种类', value: 'all' },
    { label: '蔬菜', value: 'vegetable' },
    { label: '肉类', value: 'meat' },
    { label: '甜点', value: 'dessert' }
  ]
  const selectedCategory = ref('all')
  
  const statusOptions = [
    { label: '全部状态', value: 'all' },
    { label: '上架', value: 'on-shelf' },
    { label: '下架', value: 'off-shelf' }
  ]
  const selectedStatus = ref('all')

  const sortOptions = [
    { label: '默认排序', value: 'default' },
    { label: '价格升序', value: 'price-asc' },
    { label: '价格降序', value: 'price-desc' }
  ]
  const selectedSort = ref('default')

  const keyword = ref('')

  const handleSearch = (value) => {
    console.log('搜索关键词:', value)
  }

  const mockFoodList = ref([
    {
      id: 1,
      name: '番茄炒蛋',
      image: 'https://via.placeholder.com/60',
      price: 16.5,
      status: '上架',
      createdAt: '2024-12-01',
      updatedAt: '2025-04-20'
    },
    {
      id: 2,
      name: '糖醋排骨',
      image: 'https://via.placeholder.com/60',
      price: 28.0,
      status: '下架',
      createdAt: '2024-11-15',
      updatedAt: '2025-03-30'
    },
    {
      id: 3,
      name: '草莓奶油蛋糕',
      image: 'https://via.placeholder.com/60',
      price: 32.8,
      status: '上架',
      createdAt: '2024-10-10',
      updatedAt: '2025-04-18'
    },
    {
      id: 4,
      name: '草莓奶油蛋糕',
      image: 'https://via.placeholder.com/60',
      price: 32.8,
      status: '上架',
      createdAt: '2024-10-10',
      updatedAt: '2025-04-18'
    }
  ])

  const showModal = ref(false)
  const newPrice = ref('')
  const currentDish = ref(null)

  function openPriceModal(dish) {
    currentDish.value = dish
    newPrice.value = dish.price
    showModal.value = true
  }

  function closeModal() {
    showModal.value = false
  }

  function confirmPriceChange() {
    // TODO: 提交新价格逻辑
    console.log('修改价格为：', newPrice.value)
    showModal.value = false
  }

  // 弹窗状态
  const showStatusModal = ref(false)
  const currentStatusAction = ref('')  // '上架' 或 '下架'
  const currentDishId = ref(null)      // 可选：记录操作的菜品 id（如果后面要提交到后端）

  // 打开弹窗
  function openStatusModal(dish) {
    currentStatusAction.value = dish.status === '上架' ? '下架' : '上架'
    currentDishId.value = dish.id  // 如果你有id字段
    showStatusModal.value = true
  }

  // 确认操作（TODO）
  function confirmStatusChange() {
    console.log(`TODO: 确认 ${currentStatusAction.value} 菜品 ${currentDishId.value}`)
    showStatusModal.value = false
  }

  // 取消
  function cancelStatusChange() {
    showStatusModal.value = false
  }

  const showEditModal = ref(false)  // 控制编辑弹窗的显示与隐藏
  const editingDish = ref({
    name: '',     // 菜品名
    description: '',  // 描述
    image: '',  // 图片
    category: '',  // 菜品类别
  })
  // 打开编辑弹窗，并填充当前菜品的数据
  function openEditModal(dish) {
    editingDish.value = {
      name: dish.name,
      description: dish.description,
      image: dish.image,  // 这里可以预填充菜品图片
      category: dish.category
    }
    showEditModal.value = true
  }

  // 更新按钮逻辑（TODO）
  function updateDish() {
    console.log('TODO: 更新菜品', editingDish.value)
    showEditModal.value = false
  }

  // 取消按钮：关闭弹窗
  function cancelEdit() {
    showEditModal.value = false
  }

  function handleImageChange(event) {
    const file = event.target.files[0]
    if (file) {
      // 这里你可以直接把 file 存到 editingDish.image
      editingDish.value.image = file
      console.log('上传的文件:', file)
    }
  }
</script>

<style scoped>
.food-container {
  display: flex;  /* 使用flex布局 */
  height: 100%;
}

.food-tabs {
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

.food-content {
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

.food-list-scroll {
  margin-top: 24px;
  max-height: 520px;
  overflow-y: auto;
  padding-right: 8px;
}

.food-item-card {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 12px;
  background-color: #fff;
}

.food-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;
}

.food-info {
  flex: 1;
}

.food-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.food-price {
  margin: 4px 0;
  color: #f56c6c;
  font-weight: 600;
}

.food-status span {
  font-weight: bold;
}

.food-status .on {
  color: #52c41a;
}

.food-status .off {
  color: #f56c6c;
}

.food-meta {
  font-size: 12px;
  color: #888;
}

.food-actions {
  display: flex;
  gap: 10px;
  margin-left: 16px;
}

/* 查看评价按钮 */
.view-reviews-btn {
  background-color: #4d88ff;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.view-reviews-btn:hover {
  background-color: #3c6bb2;
}

/* 修改价格按钮 */
.edit-price-btn {
  background-color: #f4b400;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.edit-price-btn:hover {
  background-color: #d88f00;
}

/* 上架/下架按钮 */
.toggle-status-btn {
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.toggle-status-btn.off {
  background-color: #ff4d4f; /* 下架按钮 */
}

.toggle-status-btn.off:hover {
  background-color: #e03b3b;
}

.toggle-status-btn.on {
  background-color: #52c41a; /* 上架按钮 */
}

.toggle-status-btn.on:hover {
  background-color: #4ca70f;
}


.edit-btn {
  background-color: #65ac7b;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #4c9966;
}

/* 修改价格弹窗样式 */
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

.price-input {
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 20px;
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

.edit-modal-mask {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.edit-modal-mask .modal-box {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.edit-modal-mask .form-group {
  margin-bottom: 16px;
}

.edit-modal-mask label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

.edit-modal-mask input, select {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-modal-mask .modal-actions {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}






</style>
