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
            
            <button class="upload-btn" @click="uploadDishImage">上传图片</button>
            <input type="file" id="dish-image" @change="handleDishImageChange" style="display: none" />
            
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
      <!-- 套餐总览展示区域 -->
      <div v-if="activeTab === 'package-overview'">
        <div class="filters">
          <!-- 套餐状态 -->
          <Dropdown
            label="套餐状态"
            :options="statusOptions"
            v-model="selectedPackageStatus"
            id="statusDropdown"
            width="120px"
          />

          <!-- 排序方式 -->
          <Dropdown
            label="排序方式"
            :options="sortOptions"
            v-model="selectedPackageSort"
            id="sortDropdown"
            width="140px"
          />

          <!-- 搜索 -->
          <SearchBox
            v-model="packageSearchKeyword"
            placeholder="搜索套餐"
            @search="handlePackageSearch"
          />
        </div>

        <!-- 套餐总览列表 -->
        <div class="food-list-scroll">
          <div class="food-item-card" v-for="item in packageList" :key="item.id">
            <img :src="`http://localhost:8000${item.image}?v=${Date.now()}`" alt="套餐图" class="food-img" />

            <div class="food-info">
              <h3 class="food-name">{{ item.name }}</h3>
              <p class="food-description">{{ item.description }}</p>
              <p class="food-sub-items">
                {{ item.items.map(d => `${d.name}×${d.quantity}`).join('，') }}
              </p>

              <p class="food-price">¥{{ Number(item.price).toFixed(2) }}</p>
              <p class="food-status">
                状态：<span :class="item.status === '上架' ? 'on' : 'off'">{{ item.status }}</span>
              </p>
              <p class="food-meta">创建时间：{{ item.createdAt }}</p>
              <p class="food-meta">更新时间：{{ item.updatedAt }}</p>
            </div>

            <!-- 操作按钮 -->
            <div class="food-actions">
              <button class="action-btn" @click="viewPackageReviews(item)">查看评价</button>
              <button class="action-btn" @click="openPackagePriceModal(item)">修改价格</button>
              <button class="action-btn" @click="openPackageHistoryPriceModal(item)">历史价格</button>
              <button class="action-btn" :class="item.status === '上架' ? 'off' : 'on'" @click="openPackageStatusModal(item)">
                {{ item.status === '上架' ? '下架' : '上架' }}
              </button>
              <button class="action-btn" @click="openPackageEditModal(item)">信息编辑</button>
              <button class="action-btn" @click="openPackageFoodEditModal(item)">菜品编辑</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'package-publish'">
          <!-- 创建套餐表单 -->
        <div class="create-dish-form">
          <div class="form-group">
            <label for="package-name">套餐名</label>
            <input type="text" id="package-name" v-model="newPackage.name" placeholder="请输入套餐名" />
          </div>

          <div class="form-group">
            <label for="package-description">套餐描述</label>
            <textarea id="package-description" v-model="newPackage.description" placeholder="请输入套餐描述"></textarea>
          </div>

          <div class="form-group">
            <label for="package-price">套餐价格</label>
            <input type="number" id="package-price" v-model="newPackage.price" placeholder="请输入套餐价格" />
          </div>

          <div class="form-group">
            <label>套餐状态</label>
            <div>
              <label>
                <input type="radio" v-model="newPackage.status" value="上架" /> 上架
              </label>
              <label>
                <input type="radio" v-model="newPackage.status" value="下架" /> 下架
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="package-image">套餐图片</label>
            <button class="upload-btn" @click="uploadPackageImage">上传图片</button>
            <input type="file" id="package-image" @change="handlePackageImageChange" style="display: none" />
            <div class="image-preview">
              <img :src="newPackage.imagePreview" alt="图片预览" class="image-preview-img"  v-if="newPackage.imagePreview"/>
            </div>
          </div>

          <!-- 添加菜品 -->
          <div class="form-group">
            <label>套餐菜品</label>
            <button class="upload-btn" @click="openAddDishModal">添加菜品</button>
          </div>

          <!-- 套餐包含的菜品展示区域 -->
          <div class="dish-list-scroll">
            <div class="dish-card" v-for="dish in newPackage.items" :key="dish.id">
              <!-- 菜品图片 -->
              <img :src="`http://localhost:8000${dish.image}?v=${Date.now()}`" class="dish-image" />

              <!-- 菜品信息 -->
              <div class="dish-info">
                <p class="dish-name">{{ dish.name }}</p>
                <p class="dish-price">¥{{ dish.price }}</p>
              </div>

              <!-- 数量控制器 -->
              <div class="quantity-control">
                <button class="qty-btn minus" @click="decreaseQuantity(dish.id)">−</button>
                <span class="qty-value">{{ dish.quantity }}</span>
                <button class="qty-btn plus" @click="increaseQuantity(dish.id)">＋</button>
              </div>

              <!-- 删除按钮 -->
              <button class="remove-btn" @click="removeDishFromPackage(dish.id)">×</button>
            </div>
          </div>
          <!-- 套餐菜品总价提示 -->
          <div class="dish-total-price">
            当前所选菜品总价参考：<span>¥{{ totalItemsPrice }}</span>
          </div>


          <div class="form-actions">
            <button class="confirm-btn" @click="createPackage">创建</button>
            <button class="cancel-btn" @click="clearPackageForm">清空</button>
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


    <!-- 套餐相关弹窗 -->
    <!-- 查看评价 -->
    <div v-if="showPackageReviewModal" class="modal-overlay">
      <div class="modal-box">
        <h3>套餐评价</h3>
        <p>这里显示 {{ currentPackage.name }} 的评价内容（占位）</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showPackageReviewModal = false">关闭</button>
        </div>
      </div>
    </div>

    <!-- 修改价格 -->
    <div v-if="showPackagePriceModal" class="modal-overlay">
      <div class="modal-box">
        <h3>修改套餐价格</h3>
        <input v-model="packageUpdatedPrice" type="number" class="price-input" />
        <div class="modal-actions">
          <button class="confirm-btn" @click="confirmUpdatePackagePrice">确认</button>
          <button class="cancel-btn" @click="showPackagePriceModal = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 历史价格 -->
    <div v-if="showPackageHistoryModal" class="modal-overlay">
      <div class="modal-box large-modal">
        <h3>{{ currentPackage.name }} 的历史价格</h3>

        <!-- 图表区域 -->
        <div id="package-price-chart" style="width: 100%; height: 300px;"></div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="closePackageHistoryModal">关闭</button>
        </div>
      </div>
    </div>

    <!-- 上架/下架确认 -->
    <div v-if="showPackageStatusModal" class="modal-overlay">
      <div class="modal-box">
        <h3>确认{{ packageStatusAction }}？</h3>
        <div class="modal-actions">
          <button class="confirm-btn" @click="confirmPackageStatusChange">确认</button>
          <button class="cancel-btn" @click="showPackageStatusModal = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 信息编辑 -->
    <div v-if="showPackageInfoModal" class="edit-modal-mask">
      <div class="modal-box">
        <h3>编辑套餐</h3>
        <div class="form-group">
          <label>菜品名</label>
          <input v-model="editingPackage.name" type="text" placeholder="输入套餐名" />
        </div>
        <div class="form-group">
          <label>描述</label>
          <input v-model="editingPackage.description" type="text" placeholder="输入套餐描述" />
        </div>
        <div class="form-group">
          <label>图片</label>
          <input type="file" @change="handleEditingPackageImageChange" />
        </div>
        <div class="modal-actions">
          <button class="confirm-btn" @click="updatePackageInfo">更新</button>
          <button class="cancel-btn" @click="showPackageInfoModal = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 菜品编辑 -->
    <div v-if="showPackageFoodModal" class="modal-overlay">
      <div class="modal-box"  style="width: 600px;">
        <h3>编辑套餐菜品</h3>
        <!-- 添加菜品 -->
        <div class="form-group">
          <button class="upload-btn" style="margin-bottom: 10px;" @click="openAddDishModal">添加菜品</button>
        </div>

        <!-- 套餐包含的菜品展示区域 -->
        <div class="dish-list-scroll" style="height: 320px;">
          <div class="dish-card" v-for="dish in editingPackageFood.items" :key="dish.id">
            <!-- 菜品图片 -->
            <img :src="`http://localhost:8000${dish.image}?v=${Date.now()}`" alt="菜品图片" class="dish-image" />

            <!-- 菜品信息 -->
            <div class="dish-info">
              <p class="dish-name">{{ dish.name }}</p>
              <p class="dish-price">¥{{ dish.price }}</p>
            </div>

            <!-- 数量控制器 -->
            <div class="quantity-control">
              <button class="qty-btn minus" @click="decreaseQuantity_e(dish.id)">−</button>
              <span class="qty-value">{{ dish.quantity }}</span>
              <button class="qty-btn plus" @click="increaseQuantity_e(dish.id)">＋</button>
            </div>

            <!-- 删除按钮 -->
            <button class="remove-btn" @click="removeDishFromPackage_e(dish.id)">×</button>
          </div>
        </div>
        <!-- 套餐菜品总价提示 -->
        <div class="dish-total-price">
          当前所选菜品总价参考：<span>¥{{ totalItemsPrice_e }}</span>
        </div>
        <div class="modal-actions">
          <button class="confirm-btn" @click="handleConfirm">保存</button>
          <button class="cancel-btn" @click="handleCancel">取消</button>
        </div>
      </div>
    </div>


    <!-- 添加菜品弹窗（结构占位） -->
    <div v-if="showAddDishModal" class="modal-overlay">
      <div class="modal-box large">
        <h3>添加菜品到套餐</h3>

        <!-- 下拉选择菜品种类 -->
        <Dropdown
          label="菜品种类"
          :options="filterCategoryOptions"
          v-model="selectedCategoryForAdd"
          id="categoryDropdown"
          width="150px"
        />

        <!-- 菜品列表滚动区域 -->
        <div class="selectable-dish-list">
          <div
            class="selectable-dish-card"
            v-for="dish in (showPackageFoodModal ? addableDishList_edit : addableDishList)"
            :key="dish.id"
          >
            <img :src="`http://localhost:8000${dish.image}?v=${Date.now()}`" class="selectable-dish-image" />
            <div class="selectable-dish-info">
              <p class="dish-name">{{ dish.name }}</p>
              <p class="dish-price">¥{{ dish.price }}</p>
            </div>
            <div class="dish-action-area">
              <button
                v-if="showPackageFoodModal ? !addedDishIds_edit.includes(dish.id) : !addedDishIds.includes(dish.id)"
                @click="showPackageFoodModal ? addDishToEditingPackage(dish) : addDishToPackage(dish)"
                class="add-btn"
              >
                添加
              </button>
              <span v-else class="added-text">已添加</span>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="modal-actions">
          <button class="cancel-btn" @click="closeAddDishModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, nextTick, computed } from 'vue'
  import Dropdown from '@/components/Dropdown.vue'
  import SearchBox from '@/components/SearchBox.vue'
  import { createDishRequest, getDishCategories, getDishList, updateDishStatus, updateDishPrice, getDishPriceHistory, updateDishInfo } from '@/api/dish'
  import { createPackageRequest, getPackageList, updatePackageItems, updatePackageInfoRequest, updatePackageStatus, updatePackagePrice, getPackagePriceHistory  } from '@/api/package'
  import * as echarts from 'echarts'

  const tabs = [
    { key: 'overview', label: '菜品总览' },
    { key: 'publish', label: '创建菜品' },
    { key: 'package-overview', label: '套餐总览' },
    { key: 'package-publish', label: '创建套餐' }
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
    } else if (newVal === 'publish') {
      clearForm()
      loadCategoryOptions()
    } else if (newVal === 'package-overview') {
      selectedPackageStatus.value = 'all'
      selectedPackageSort.value = 'default'
      packageSearchKeyword.value = ''
      loadCategoryOptions()
      fetchPackageList()
      selectedCategoryForAdd.value = 'all'
    } else if (newVal === 'package-publish') {
      selectedCategoryForAdd.value = 'all'
      loadCategoryOptions()
      clearPackageForm()
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
  const selectedPackageStatus = ref('all')

  const sortOptions = [
    { label: '默认排序', value: 'default' },
    { label: '价格升序', value: 'price-asc' },
    { label: '价格降序', value: 'price-desc' },
    { label: '创建时间', value: 'create-time' },
    { label: '更新时间', value: 'update-time' },
  ]
  const selectedSort = ref('default')
  const selectedPackageSort = ref('default')

  const keyword = ref('')
  const packageSearchKeyword = ref('')
  const foodList = ref([])
  const packageList = ref([])




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

  const fetchPackageList = async () => {
    try {
      const res = await getPackageList({
        status: selectedPackageStatus.value,
        sort: selectedPackageSort.value,
        keyword: packageSearchKeyword.value
      })
      packageList.value = res.data
    } catch (err) {
      console.error('套餐列表获取失败', err)
    }
  }

  watch([selectedCategory, selectedStatus, selectedSort], () => {
    fetchDishList()
  })

  watch([selectedPackageStatus, selectedPackageSort], () => {
    fetchPackageList()
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

  const showPackageReviewModal = ref(false)
  const showPackagePriceModal = ref(false)
  const showPackageHistoryModal = ref(false)
  const showPackageStatusModal = ref(false)
  const showPackageInfoModal = ref(false)
  const showPackageFoodModal = ref(false)

  const currentPackage = ref(null)
  const packageUpdatedPrice = ref('')
  const packageStatusAction = ref('')

  function viewPackageReviews(pkg) {
    currentPackage.value = pkg
    showPackageReviewModal.value = true
  }

  function openPackagePriceModal(pkg) {
    currentPackage.value = pkg
    packageUpdatedPrice.value = pkg.price
    showPackagePriceModal.value = true
  }

  const confirmUpdatePackagePrice = () => {
    updatePackagePrice({
      package_id: currentPackage.value.id,
      new_price: packageUpdatedPrice.value
    })
      .then(() => {
        alert('套餐价格修改成功')
        showPackagePriceModal.value = false
        fetchPackageList()
      })
      .catch(err => {
        alert('修改失败：' + (err.response?.data?.detail || '未知错误'))
      })
  }

  let packageChartInstance = null

  function openPackageHistoryPriceModal(pkg) {
    currentPackage.value = pkg
    showPackageHistoryModal.value = true

    // 先清空图表占位
    nextTick(() => {
      renderPackagePriceChart([])
    })

    // 调接口加载数据
    getPackagePriceHistory(pkg.id)
      .then(res => {
        renderPackagePriceChart(res.data)
      })
      .catch(() => {
        alert('获取历史价格失败')
      })
  }

  function closePackageHistoryModal() {
    showPackageHistoryModal.value = false
    if (packageChartInstance) {
      packageChartInstance.dispose()
      packageChartInstance = null
    }
  }

  function renderPackagePriceChart(data) {
    const dom = document.getElementById('package-price-chart')
    if (!dom) return

    if (packageChartInstance) {
      packageChartInstance.dispose()
    }
    packageChartInstance = echarts.init(dom)

    const option = {
      title: {
        text: '套餐价格变化趋势',
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

    packageChartInstance.setOption(option)
  }



  function openPackageStatusModal(pkg) {
    currentPackage.value = pkg
    packageStatusAction.value = pkg.status === '上架' ? '下架' : '上架'
    showPackageStatusModal.value = true
  }

  function confirmPackageStatusChange() {
    const payload = {
      package_id: currentPackage.value.id,
      action: packageStatusAction.value
    }

    updatePackageStatus(payload)
      .then(() => {
        alert(`套餐已成功${packageStatusAction.value}`)
        showPackageStatusModal.value = false
        fetchPackageList() // 刷新列表
      })
      .catch(err => {
        alert('操作失败：' + (err.response?.data?.detail || '未知错误'))
      })
  }


  const editingPackage = ref({
    package_id: null,
    name: '',
    description: '',
    image: null
  })

  const editingPackageFood = ref({
    items: []
  })

  const updatePackageInfo = () => {
    const formData = new FormData()
    formData.append('package_id', editingPackage.value.package_id)
    formData.append('name', editingPackage.value.name)
    formData.append('description', editingPackage.value.description)
    if (editingPackage.value.image) {
      formData.append('image', editingPackage.value.image)
    }

    updatePackageInfoRequest(formData)
      .then(() => {
        alert('套餐信息更新成功')
        showPackageInfoModal.value = false
        fetchPackageList() // 刷新套餐列表
      })
      .catch(err => {
        alert('更新失败：' + (err.response?.data?.detail || '未知错误'))
      })
  }


  // 编辑套餐时的添加菜品弹窗数据
  const addableDishList_edit = ref([])

  const addedDishIds_edit = computed(() =>
    editingPackageFood.value.items.map(item => item.id)
  )

  const totalItemsPrice_e = computed(() => {
    return editingPackageFood.value.items.reduce((sum, dish) => {
      return sum + (dish.price * dish.quantity)
    }, 0).toFixed(2)
  })

  function openPackageEditModal(pkg) {
    editingPackage.value = {
      package_id: pkg.id,              // 关键字段
      name: pkg.name,
      description: pkg.description,
      image: null                    // 初始为 null，除非上传新图
    }
    showPackageInfoModal.value = true
  }

  function handleEditingPackageImageChange(event) {
    const file = event.target.files[0]
    if (file) {
      editingPackage.value.image = file
      console.log('上传的文件:', file)
    }
  }

  const currentPackageId = ref(null)
  function openPackageFoodEditModal(pkg) {
    currentPackageId.value = pkg.id
    editingPackageFood.value.items = pkg.items.map(d => ({ ...d }))
    showPackageFoodModal.value = true
  }

  // 增加数量
  function increaseQuantity_e(dishId) {
    const dish = editingPackageFood.value.items.find(d => d.id === dishId);
    if (dish) dish.quantity++;
  }

  // 减少数量（最小为 1）
  function decreaseQuantity_e(dishId) {
    const dish = editingPackageFood.value.items.find(d => d.id === dishId);
    if (dish && dish.quantity > 1) dish.quantity--;
  }

  // 移除该菜品
  function removeDishFromPackage_e(dishId) {
    editingPackageFood.value.items = editingPackageFood.value.items.filter(d => d.id !== dishId);
  }

  function addDishToEditingPackage(dish) {
    const exists = editingPackageFood.value.items.some(item => item.id === dish.id)
    if (!exists) {
      editingPackageFood.value.items.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        quantity: 1
      })
    }
  }

  function handleConfirm() {
    const packageId = currentPackageId.value
    const items = editingPackageFood.value.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    }))

    updatePackageItems({
      package_id: packageId,
      items: JSON.stringify(items)
    })
      .then(res => {
        alert('套餐菜品更新成功！')
        showPackageFoodModal.value = false
        fetchPackageList()  // 刷新套餐列表（如果有）
      })
      .catch(err => {
        console.error('套餐菜品更新失败', err)
        alert('套餐菜品更新失败：' + (err.response?.data?.detail || '未知错误'))
      })
    
  }

  function handleCancel() {
    showPackageFoodModal.value = false;
    fetchPackageList()
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

  // 创建套餐的表单数据
  const newPackage = ref({
    name: '',
    description: '',
    price: '',
    status: '上架',
    image: null,
    imagePreview: '',
    items: [] // 已添加的菜品列表
  });

  function uploadDishImage() {
    document.getElementById('dish-image')?.click();
  }

  function uploadPackageImage() {
    document.getElementById('package-image')?.click();
  }

  function handleDishImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      newDish.value.image = file;
      const reader = new FileReader();
      reader.onload = e => {
        newDish.value.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function handlePackageImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      newPackage.value.image = file;
      const reader = new FileReader();
      reader.onload = e => {
        newPackage.value.imagePreview = e.target.result;
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

  // 控制弹窗显示
  const showAddDishModal = ref(false);
  const addableDishList = ref([])  // 弹窗中展示的菜品列表（只显示上架菜品）

  const selectedCategoryForAdd = ref('all')  // 弹窗用的下拉筛选分类

  watch([selectedCategoryForAdd], () => {
    if (showPackageFoodModal.value) {
      fetchAddableDishesForEdit()
    } else {
      fetchAddableDishes()
    }
      
  })

  async function fetchAddableDishes() {
    try {
      const res = await getDishList({
        category: selectedCategoryForAdd.value,
        status: 'on-shelf',  // ✅ 只取上架菜品
        sort: 'default',
        keyword: ''
      })
      addableDishList.value = res.data
    } catch (err) {
      console.error('菜品列表获取失败:', err)
    }
    
  }

  async function fetchAddableDishesForEdit() {
    try {
      const res = await getDishList({
        category: selectedCategoryForAdd.value,
        status: 'on-shelf',
        sort: 'default',
        keyword: ''
      })
      addableDishList_edit.value = res.data
    } catch (err) {
      console.error('菜品列表获取失败:', err)
    }
  }

  const addedDishIds = computed(() =>
    newPackage.value.items.map(item => item.id)
  )
  // 打开/关闭弹窗
  function openAddDishModal() {
    // 判断当前是在编辑还是创建
    if (showPackageFoodModal.value) {
      // 编辑模式
      fetchAddableDishesForEdit()
    } else {
      // 创建模式（原来已有）
      fetchAddableDishes()
    }

    showAddDishModal.value = true
  }


  function closeAddDishModal() {
    showAddDishModal.value = false;
  }

  // 添加到套餐中的逻辑
  function addDishToPackage(dish) {
    const exists = newPackage.value.items.some(item => item.id === dish.id)
    if (!exists) {
      newPackage.value.items.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        quantity: 1
      })
    }
  }

  // 增加数量
  function increaseQuantity(dishId) {
    const dish = newPackage.value.items.find(d => d.id === dishId);
    if (dish) dish.quantity++;
  }

  // 减少数量（最小为 1）
  function decreaseQuantity(dishId) {
    const dish = newPackage.value.items.find(d => d.id === dishId);
    if (dish && dish.quantity > 1) dish.quantity--;
  }

  // 移除该菜品
  function removeDishFromPackage(dishId) {
    newPackage.value.items = newPackage.value.items.filter(d => d.id !== dishId);
  }

  const totalItemsPrice = computed(() => {
    return newPackage.value.items.reduce((sum, dish) => {
      return sum + (dish.price * dish.quantity)
    }, 0).toFixed(2)
  })

  // 创建套餐的函数
  const createPackage = async () => {
    // 表单验证
    if (!newPackage.value.name || !newPackage.value.price || !newPackage.value.items.length || !newPackage.value.image) {
      alert('请填写完整信息并选择至少一个菜品')
      return
    }

    try {
      await createPackageRequest(newPackage.value)
      alert('套餐创建成功')
      clearPackageForm()
      // 可以选择性刷新套餐列表等
    } catch (err) {
      alert('套餐创建失败：' + (err.response?.data?.detail || '未知错误'))
    }
  }

  // 清空表单的函数
  const clearPackageForm = () => {
    newPackage.value = {
      name: '',
      description: '',
      price: '',
      status: '上架',
      image: null,
      imagePreview: '',
      items: [] // 已添加的菜品列表
    };
  };

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

.food-sub-items {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  white-space: nowrap;      /* 禁止换行 */
  overflow: hidden;         /* 隐藏溢出内容 */
  text-overflow: ellipsis;  /* 显示省略号 */
  max-width: 300px;          /* 限制最大宽度 */
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

.action-btn:nth-child(6) {
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
.create-dish-form .upload-btn, 
.modal-box .upload-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  background-color: #65ac7b;
  color: white;
  cursor: pointer;
}

.create-dish-form .upload-btn:hover, 
.modal-box .upload-btn:hover {
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

.create-dish-form .dish-list-scroll, 
.modal-box .dish-list-scroll {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  padding: 18px;
  border-radius: 6px;
  margin-bottom: 18px;
  background-color: #f9f9f9;
}

.create-dish-form .dish-card, 
.modal-box .dish-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.create-dish-form .dish-image, 
.modal-box .dish-image {
  width: 70px;
  height: 70px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
}

.create-dish-form .dish-info, 
.modal-box .dish-info {
  flex-grow: 1;
}

.create-dish-form .dish-name, 
.modal-box .dish-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.create-dish-form .dish-price, 
.modal-box .dish-price {
  font-size: 15px;
  font-weight: 600;
  color: #f56c6c;
  margin: 4px 0 0;
}

.create-dish-form .quantity-control, 
.modal-box .quantity-control {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 12px;
  margin-right: 24px;
}

.create-dish-form .qty-btn, 
.modal-box .qty-btn {
  width: 24px;
  height: 24px;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  border: 1px solid #65ac7b;
  color: #65ac7b;
  background-color: #fff;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
}

.create-dish-form .qty-btn:hover, 
.modal-box .qty-btn:hover {
  background-color: #65ac7b;
  color: #fff;
}

.create-dish-form .qty-btn.plus, 
.modal-box .qty-btn.plus {
  background-color: #65ac7b;
  color: #fff;
}

.create-dish-form .qty-btn.plus:hover, 
.modal-box .qty-btn.plus:hover {
  background-color: #fff;
  color: #65ac7b;
}

.create-dish-form .qty-value, 
.modal-box .qty-value {
  width: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.create-dish-form .remove-btn, 
.modal-box .remove-btn {
  margin-left: 12px;
  margin-right: 12px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-dish-form .dish-total-price,
.modal-box .dish-total-price {
  margin-top: 18px;
  margin-bottom: 18px;
  margin-right: 16px;
  text-align: right;
  font-size: 16px;
  color: #555;
  font-weight: bold;
}

.create-dish-form .dish-total-price span,
.modal-box .dish-total-price span {
  color: #f56c6c;
  font-weight: bold;
  margin-left: 4px;
}

.create-dish-form .remove-btn:hover, 
.modal-box .remove-btn:hover {
  opacity: 0.8;
}

.modal-box.large {
  width: 500px;
  height: 480px;
  overflow-y: auto;
}

.selectable-dish-list {
  margin-top: 12px;
  margin-bottom: 12px;
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.selectable-dish-list .selectable-dish-card {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #ccc;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 6px;
}

.selectable-dish-list .selectable-dish-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
}

.selectable-dish-list .selectable-dish-info {
  flex-grow: 1;
}

.selectable-dish-list .selectable-dish-info .dish-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.selectable-dish-list .selectable-dish-info .dish-price {
  font-size: 13px;
  font-weight: 600;
  color: #f56c6c;
  margin: 4px 0 0;
}

.selectable-dish-list .dish-action-area {
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selectable-dish-list .added-text {
  color: #888;
  font-weight: 600;
  font-size: 13px;
}

.selectable-dish-list .add-btn {
  background-color: #65ac7b;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.selectable-dish-list .add-btn:hover {
  background-color: #4c9966;
}


</style>
