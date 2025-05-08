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
            :options="filterCategoryOptions"
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
          <div class="food-item-card" v-for="item in foodList" :key="item.id">
            <!-- 图片 -->
            <img :src="`http://localhost:8000${item.image}?v=${Date.now()}`" alt="菜品图" class="food-img" />

            <!-- 主要信息 -->
            <div class="food-info">
              <h3 class="food-name">{{ item.name }}</h3>
              <p class="food-description">{{ item.description }}</p>
              <p class="food-price">¥{{ Number(item.price).toFixed(2) }}</p>
              <p class="food-status">
                状态：<span :class="item.status === '上架' ? 'on' : 'off'">{{ item.status }}</span>
              </p>
              <p class="food-meta">创建：{{ item.createdAt }}</p>
              <p class="food-meta">更新：{{ item.updatedAt }}</p>
            </div>

            <!-- 操作 -->
            <div class="food-actions">
              <!-- 查看评价 -->
              <button class="action-btn" @click="viewReviews(item)">查看评价</button>

              <!-- 修改价格 -->
              <button class="action-btn" @click="openPriceModal(item)">修改价格</button>

              <!-- 历史价格 -->
              <button class="action-btn" @click="openHistoryPriceModal(item)">历史价格</button>

              <!-- 上架/下架 -->
              <button class="action-btn" 
                      :class="item.status === '上架' ? 'off' : 'on'"
                      @click="openStatusModal(item)">
                {{ item.status === '上架' ? '下架' : '上架' }}
              </button>

              <!-- 编辑 -->
              <button class="action-btn" @click="openEditModal(item)">编辑</button>

            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'publish'">
        <!-- 创建菜品表单 -->
        <div class="create-dish-form">
          <div class="form-group">
            <label for="dish-name">菜品名</label>
            <input type="text" id="dish-name" v-model="newDish.name" placeholder="请输入菜品名" />
          </div>

          <div class="form-group">
            <label for="dish-description">菜品描述</label>
            <textarea id="dish-description" v-model="newDish.description" placeholder="请输入菜品描述"></textarea>
          </div>

          <div class="form-group">
            <label for="dish-price">菜品价格</label>
            <input type="number" id="dish-price" v-model="newDish.price" placeholder="请输入菜品价格" />
          </div>

          <div class="form-group">
            <label for="dish-category">菜品种类</label>
            <select id="dish-category" v-model="newDish.category">
              <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>菜品状态</label>
            <div>
              <label>
                <input type="radio" v-model="newDish.status" value="上架" /> 上架
              </label>
              <label>
                <input type="radio" v-model="newDish.status" value="下架" /> 下架
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="dish-image">菜品图片</label>
            
            <!-- 上传按钮 -->
            <button class="upload-btn" @click="uploadImage">上传图片</button>

            <!-- 图片选择框 -->
            <input type="file" id="dish-image" ref="imageInput" @change="handleImageChange_creat" style="display: none" />
            
            <!-- 显示图片预览 -->
            <div class="image-preview">
              <img :src="newDish.imagePreview" v-if="newDish.imagePreview" alt="图片预览" class="image-preview-img"/>
            </div>
          </div>


          <div class="form-actions">
            <button class="confirm-btn" @click="createDish">创建</button>
            <button class="cancel-btn" @click="clearForm">清空</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗部分：统一弹窗位置 -->

    <!-- 修改价格弹窗 -->
    <div v-if="showPriceModal" class="modal-overlay">
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
          <button class="cancel-btn" @click="closePriceModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 历史价格弹窗 -->
    <div v-if="showHistoryModal" class="modal-overlay">
      <div class="modal-box large-modal">
        <h3>{{ currentDish.name }} 的价格历史</h3>

        <!-- 图表区域 -->
        <div id="price-chart" style="width: 100%; height: 300px;"></div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="closeHistoryModal">关闭</button>
        </div>
      </div>
    </div>

    <!-- 上架/下架弹窗 -->
    <div v-if="showStatusModal" class="modal-overlay">
      <div class="modal-box">
        <h3>确认{{ currentStatusAction }}？</h3>
        <div class="modal-actions">
          <button class="confirm-btn" @click="confirmStatusChange">确认</button>
          <button class="cancel-btn" @click="cancelStatusChange">取消</button>
        </div>
      </div>
    </div>

    <!-- 编辑菜品弹窗 -->
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
</template>

<script setup>
  import { ref, watch, onMounted, nextTick } from 'vue'
  import Dropdown from '@/components/Dropdown.vue'
  import SearchBox from '@/components/SearchBox.vue'
  import { createDishRequest, getDishCategories, getDishList, updateDishStatus, updateDishPrice, getDishPriceHistory, updateDishInfo } from '@/api/dish'
  import * as echarts from 'echarts'

  const tabs = [
    { key: 'overview', label: '菜品总览' },
    { key: 'publish', label: '创建菜品' },
    { key: 'meal-overview', label: '套餐总览' },
    { key: 'meal-publish', label: '创建套餐' }
  ]

  const activeTab = ref('overview')
  watch(activeTab, (newVal) => {
    if (newVal === 'overview') {
      clearForm()
      selectedCategory.value = 'all'
      selectedStatus.value = 'all'
      selectedSort.value = 'default'
      keyword.value = ''
      loadCategoryOptions()
      fetchDishList()
    }
  })

  const categoryOptions = ref([])
  const filterCategoryOptions = ref([{ label: '全部种类', value: 'all' }])  // 预置“全部种类”

  const loadCategoryOptions = async () => {
    try {
      const res = await getDishCategories()
      const backendOptions = res.data.map(item => ({
        label: item.category_name,
        value: item.category_name  // 你前端用的 value 就是 category_name
      }))
      
      // 设置普通下拉选项
      categoryOptions.value = backendOptions

      // 设置过滤下拉选项（带“全部种类”）
      filterCategoryOptions.value = [
        { label: '全部种类', value: 'all' },
        ...backendOptions
      ]
    } catch (err) {
      console.error('加载菜品类别失败:', err)
    }
  }

  

  onMounted(() => {
    loadCategoryOptions()
    fetchDishList()
  })
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
    { label: '价格降序', value: 'price-desc' },
    { label: '创建时间', value: 'create-time' },
    { label: '更新时间', value: 'update-time' },
  ]
  const selectedSort = ref('default')

  const keyword = ref('')
  const foodList = ref([])

  const fetchDishList = async () => {
    try {
      const res = await getDishList({
        category: selectedCategory.value,
        status: selectedStatus.value,
        sort: selectedSort.value,
        keyword: keyword.value
      })
      foodList.value = res.data
      console.log(foodList.value)
    } catch (err) {
      console.error('菜品列表获取失败:', err)
    }
  }

  watch([selectedCategory, selectedStatus, selectedSort], () => {
    fetchDishList()
  })

  const handleSearch = () => {
    fetchDishList()
  }

  const currentDish = ref(null) // 当前选中菜品

  const showPriceModal = ref(false)
  const newPrice = ref('')
  

  function openPriceModal(dish) {
    currentDish.value = dish
    newPrice.value = dish.price
    showPriceModal.value = true
  }

  function closePriceModal() {
    showPriceModal.value = false
  }

  async function confirmPriceChange() {
    try {
      await updateDishPrice(currentDish.value.id, newPrice.value)
      alert('价格修改成功')
      fetchDishList()
      closePriceModal()
    } catch (err) {
      alert('修改失败：' + (err.response?.data?.detail || '未知错误'))
    }
  }

  const showHistoryModal = ref(false)
  let chartInstance = null

  async function openHistoryPriceModal(dish) {
    currentDish.value = dish
    showHistoryModal.value = true

    nextTick(() => {
      renderPriceChart([])  // ⚠ 先画空图占位
    })

    try {
      const res = await getDishPriceHistory(dish.id)
      renderPriceChart(res.data)
    } catch (err) {
      alert('价格历史获取失败：' + (err.response?.data?.detail || '未知错误'))
    }
  }

  function closeHistoryModal() {
    showHistoryModal.value = false
    if (chartInstance) {
      chartInstance.dispose()
    }
  }

  // 渲染折线图函数
  function renderPriceChart(data) {
    const chartDom = document.getElementById('price-chart')
    if (!chartDom) return

    if (chartInstance) {
      chartInstance.dispose()
    }
    chartInstance = echarts.init(chartDom)

    const option = {
      title: {
        text: '价格变化趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.date)
      },
      yAxis: {
        type: 'value',
        min: 'dataMin'
      },
      series: [
        {
          name: '价格',
          type: 'line',
          data: data.map(item => item.price)
        }
      ]
    }

    chartInstance.setOption(option)
  }

  // 弹窗状态
  const showStatusModal = ref(false)
  const currentStatusAction = ref('')

  function openStatusModal(dish) {
    currentDish.value = dish
    currentStatusAction.value = dish.status === '上架' ? '下架' : '上架'
    showStatusModal.value = true
  }

  function cancelStatusChange() {
    showStatusModal.value = false
    currentDish.value = null
  }

  async function confirmStatusChange() {
    try {
      await updateDishStatus(currentDish.value.id, currentStatusAction.value)
      alert(`菜品已${currentStatusAction.value}`)

      // 更新状态本地刷新
      currentDish.value = null
      fetchDishList()
      showStatusModal.value = false
    } catch (error) {
      alert('操作失败：' + (error.response?.data?.detail || '未知错误'))
    }
  }


  const showEditModal = ref(false)

  const editingDish = ref({
    dish_id: null,
    name: '',
    description: '',
    category: '',
    image: null
  })

  // 打开弹窗并填充初始值
  function openEditModal(dish) {
    editingDish.value = {
      dish_id: dish.id,              // 关键字段
      name: dish.name,
      description: dish.description,
      category: dish.category,       // 这里是中文类别名
      image: null                    // 初始为 null，除非上传新图
    }
    showEditModal.value = true
  }

  // 关闭弹窗并重置数据
  function cancelEdit() {
    showEditModal.value = false
    resetEditForm()
  }

  function resetEditForm() {
    editingDish.value = {
      dish_id: null,
      name: '',
      description: '',
      category: '',
      image: null
    }
  }

  // 提交更新
  async function updateDish() {
    try {
      await updateDishInfo(editingDish.value)
      alert('菜品更新成功')
      showEditModal.value = false
      resetEditForm()
      fetchDishList()  // ✅ 记得刷新列表
    } catch (err) {
      alert('菜品更新失败: ' + (err.response?.data?.detail || '未知错误'))
    }
  }

  // 处理图片上传
  function handleImageChange(event) {
    const file = event.target.files[0]
    if (file) {
      editingDish.value.image = file
      console.log('上传的文件:', file)
    }
  }

  // 创建菜品的表单数据
  const newDish = ref({
    name: '',
    description: '',
    price: '',
    category: 'all',
    status: '上架',
    image: null,
    imagePreview: '',
  })

  // 点击上传图片框
  function uploadImage() {
    const imageInput = document.getElementById('dish-image');
    imageInput.click();
  }

  // 处理图片上传并显示预览
  function handleImageChange_creat(event) {
    const file = event.target.files[0];
    if (file) {
      // 显示文件名
      newDish.value.image = file;

      // 使用 FileReader API 读取图片文件并显示预览
      const reader = new FileReader();
      reader.onload = function(e) {
        // 将图片预览 URL 赋值给 imagePreview
        newDish.value.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // 创建菜品（提交请求到后端）
  function createDish() {
    // 先检查输入数据是否完整
    if (!newDish.value.name || !newDish.value.price || !newDish.value.category || !newDish.value.image) {
      alert('请填写完整的菜品信息！')
      return
    }

    // 调用后端接口
    createDishRequest(newDish.value)
      .then(response => {
        alert('菜品创建成功！')
        // 清空表单
        clearForm()
      })
      .catch(error => {
        alert('创建菜品失败：' + (error.response.data.detail || '未知错误'))
      })
  }

  // 清空表单
  function clearForm() {
    newDish.value = {
      name: '',
      description: '',
      price: '',
      category: 'all',
      status: '上架',
      image: null,
      imagePreview: '',
    };
  }
</script>

<style scoped>
.food-container {
  display: flex;
  height: 100%;
}

.food-tabs {
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

.food-content {
  flex-grow: 1;
  height: 100%;
  padding: 20px;
  background-color: #f9f9f9;
  border: 2px solid #e9e9e9;
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
  width: 140px;
  height: 140px;
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

.food-description {
  margin: 4px 0;
  color: #888;
  font-size: 12px;
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

/* 按钮样式 */
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

/* 查看评价按钮 */
.action-btn:nth-child(1) {
  background-color: #4d88ff; /* 原来 .view-reviews-btn 样式 */
  color: white;
}

/* 修改价格按钮 */
.action-btn:nth-child(2) {
  background-color: #f4b400; /* 原来 .edit-price-btn 样式 */
  color: white;
}

.action-btn:nth-child(3) {
  background-color: #f4b400; /* 原来 .edit-price-btn 样式 */
  color: white;
}

/* 上架按钮 */
.action-btn.on {
  background-color: #52c41a; /* 原来 .toggle-status-btn.on 样式 */
  color: white;
}

/* 下架按钮 */
.action-btn.off {
  background-color: #ff4d4f;
  color: white;
}

/* 编辑按钮 */
.action-btn:nth-child(5) {
  background-color: #65ac7b; /* 原来 .edit-btn 样式 */
  color: white;
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

.large-modal {
  width: 700px;
  padding: 20px;
}

/* 编辑菜品弹窗样式 */
.edit-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
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

.edit-modal-mask input,
.edit-modal-mask select {
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

.create-dish-form {
  padding: 5px;
  max-height: 580px;  /* 最大高度 */
  overflow-y: auto;  /* 超出部分滚动 */
}

.create-dish-form .form-group {
  margin-bottom: 16px;
}

.create-dish-form .form-group label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

.create-dish-form .form-group input,
.create-dish-form .form-group select,
.create-dish-form .form-group textarea {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.create-dish-form textarea {
  resize: vertical;
}


/* 上传按钮样式 */
.create-dish-form .upload-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  background-color: #65ac7b;
  color: white;
  cursor: pointer;
}

.create-dish-form .upload-btn:hover {
  background-color: #4c9966;
}

.create-dish-form .image-preview {
  margin-top: 8px;
  width: 150px;
  height: 150px;
  object-fit: contain;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed rgb(189, 189, 189);
}

.create-dish-form .image-preview-img {
  max-width: 100%;
  max-height: 100%;
}


.create-dish-form .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.create-dish-form .confirm-btn,
.create-dish-form .cancel-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-dish-form .confirm-btn {
  background-color: #65ac7b;
  color: white;
}

.create-dish-form .confirm-btn:hover {
  background-color: #4c9966;
}

.create-dish-form .cancel-btn {
  background-color: #ccc;
  color: white;
}

.create-dish-form .cancel-btn:hover {
  background-color: #c1c1c1;
}

.create-dish-form .form-group div {
  display: flex;
  gap: 16px;
  align-items: center;
}

.create-dish-form .form-group input[type="radio"] {
  margin-right: 8px;
}
</style>
