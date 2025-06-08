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
              
              <div class="coupon-list">
                <div 
                  v-for="coupon in coupons.filter(c => new Date(c.valid_to) > new Date())"  
                  :key="coupon.coupon_id"
                  class="coupon-item"
                  :class="{ 'selected': selectedCouponId === coupon.coupon_id }"
                  @click="selectedCouponId = coupon.coupon_id"
                >
                  <div class="coupon-info">
                    <h4>{{ coupon.name }}</h4>
                    <div class="coupon-details">
                      <p v-if="coupon.amount">
                        <span class="label">折扣：</span>
                        <span class="value">¥{{ coupon.amount }}</span>
                      </p>
                      <p>
                        <span class="label">最低消费：</span>
                        <span class="value">¥{{ coupon.min_amount || 0 }}</span>
                      </p>
                      <p>
                        <span class="label">有效期：</span>
                        <span class="value">{{ formatDate(coupon.valid_from) }} 至 {{ formatDate(coupon.valid_to) }}</span>
                      </p>
                      <p v-if="coupon.weekdays">
                        <span class="label">适用日期：</span>
                        <span class="value">{{ formatWeekdays(coupon.weekdays) }}</span>
                      </p>
                      <p v-if="coupon.description" class="description">
                        {{ coupon.description }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <p v-if="coupons.filter(c => new Date(c.valid_to) > new Date()).length === 0" class="empty-tip">
                  暂无可用优惠券
                </p>
              </div>
              
              <div class="selected-info">
                已选择 {{ selectedUserIds.length }} 位用户
              </div>
              
              <div class="modal-actions">
                <button 
                  class="confirm-btn" 
                  @click="assignCoupons"
                  :disabled="isAssigning"
                >
                  {{ isAssigning ? '发放中...' : '确认发放' }}
                </button>
                <button class="cancel-btn" @click="closeCouponModal">取消</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === '优惠券总览'" class="coupon-overview-container">
          <div class="header">
            <h2><i class="el-icon-collection"></i> 优惠券管理</h2>
            <div class="actions">
              <el-input
                v-model="searchQuery"
                placeholder="搜索优惠券名称..."
                clearable
                style="width: 300px"
                @clear="handleSearchClear"
              >
                <template #prefix>
                  <i class="el-icon-search"></i>
                </template>
              </el-input>
              <el-button type="primary" @click="refreshCoupons">
                <i class="el-icon-refresh"></i> 刷新
              </el-button>
            </div>
          </div>

          <div class="coupon-list" v-loading="loading">

            <!-- 优惠券卡片列表 -->
            <el-scrollbar class="scroll-container">
              <div class="card-grid">
                <div 
                  v-for="coupon in filteredCoupons" 
                  :key="coupon.coupon_id" 
                  class="coupon-card"
                  :class="{ 'expired': isExpired(coupon.valid_to) }"
                >
                  <div class="card-header">
                    <span class="coupon-name">{{ coupon.name }}</span>
                    <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="handleDelete(coupon.coupon_id)"
                      class="delete-btn"
                    >
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </div>
                  
                  <div class="card-content">
                    <div class="coupon-value">
                      <span class="amount">¥{{ coupon.amount }}</span>
                      <span v-if="coupon.min_amount > 0" class="condition">
                        (满¥{{ coupon.min_amount }}可用)
                      </span>
                      <span v-else class="condition">(无门槛)</span>
                    </div>
                    
                    <div class="valid-date">
                      <i class="el-icon-date"></i>
                      {{ formatDate(coupon.valid_from) }} 至 {{ formatDate(coupon.valid_to) }}
                    </div>
                    
                    <div class="weekdays">
                      <i class="el-icon-time"></i>
                      可用: {{ formatWeekdays(coupon.weekdays) }}
                    </div>
                  </div>
                  
                  <div class="card-footer">
                    <el-tag 
                      :type="isExpired(coupon.valid_to) ? 'info' : 'success'" 
                      size="small"
                    >
                      {{ isExpired(coupon.valid_to) ? '已过期' : '有效中' }}
                    </el-tag>
                    <span class="create-time">
                      创建: {{ formatDateTime(coupon.created_date) }}
                    </span>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>

          <!-- 删除确认对话框 -->
          <el-dialog
            v-model="deleteDialogVisible"
            title="确认删除"
            width="30%"
          >
            <span>确定要删除优惠券 "{{ deletingCouponName }}" 吗？此操作不可撤销。</span>
            <template #footer>
              <el-button @click="deleteDialogVisible = false">取消</el-button>
              <el-button type="danger" @click="confirmDelete">确认删除</el-button>
            </template>
          </el-dialog>
        </div>
        <div v-if="activeTab === '创建优惠券'" class="coupon-create-container">
          <div class="header">
            <h2><i class="el-icon-tickets"></i> 创建新优惠券</h2>
            <p class="subtitle">填写优惠券信息，为顾客提供优惠</p>
          </div>
          
          <el-form 
            :model="couponForm" 
            :rules="rules" 
            ref="couponFormRef" 
            label-width="120px"
            label-position="top"
            class="green-form"
          >
            <!-- 优惠券名称 -->
            <el-form-item label="优惠券名称" prop="name">
              <el-input
                v-model="couponForm.name"
                placeholder="例如：周末满减券"
                maxlength="100"
                show-word-limit
              >
                <template #prefix>
                  <i class="el-icon-edit"></i>
                </template>
              </el-input>
            </el-form-item>
            
            <div class="form-row">
              <!-- 优惠金额 -->
              <el-form-item label="优惠金额" prop="amount" class="form-col">
                <el-input-number 
                  v-model="couponForm.amount" 
                  :min="0.01" 
                  :max="9999.99" 
                  :precision="2" 
                  controls-position="right"
                  placeholder="例如：10.00"
                />
                <span class="unit">元</span>
              </el-form-item>
              
              <!-- 满减门槛 -->
              <el-form-item label="满减门槛" prop="min_amount" class="form-col">
                <el-input-number 
                  v-model="couponForm.min_amount" 
                  :min="0" 
                  :max="99999.99" 
                  :precision="2" 
                  controls-position="right"
                  placeholder="不填表示无门槛"
                />
                <span class="unit">元</span>
              </el-form-item>
            </div>
            
            <!-- 有效期 -->
            <el-form-item label="有效期" required>
              <el-date-picker
                v-model="couponForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                :disabled-date="disabledDate"
                class="green-datepicker"
              />
            </el-form-item>
            
            <!-- 可用星期 -->
            <el-form-item label="可用星期" prop="weekdays">
              <el-checkbox-group v-model="couponForm.weekdays" class="weekday-group">
                <el-checkbox-button 
                  v-for="day in weekdayOptions" 
                  :key="day.value" 
                  :label="day.value"
                >
                  {{ day.label }}
                </el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            
            <!-- 使用说明 -->
            <el-form-item label="使用说明" prop="description">
              <el-input
                v-model="couponForm.description"
                type="textarea"
                :rows="4"
                placeholder="请输入优惠券使用规则和注意事项"
                maxlength="255"
                show-word-limit
                class="green-textarea"
              />
            </el-form-item>
            
            <!-- 提交按钮 -->
            <el-form-item class="form-actions">
              <el-button 
                type="primary" 
                @click="submitForm" 
                class="submit-btn"
                :icon="ElIconUpload"
              >
                创建优惠券
              </el-button>
              <el-button 
                @click="resetForm" 
                class="reset-btn"
                :icon="ElIconRefresh"
              >
                重置表单
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref, watch, onMounted, nextTick, computed, reactive } from 'vue'
    import Dropdown from '@/components/Dropdown.vue'
    import SearchBox from '@/components/SearchBox.vue'
    import pinyin from 'pinyin'
    import { BASE_URL } from '@/utils/request'
    import { getAllUserList } from '@/api/user'
    import { ElMessage } from 'element-plus';
    import { Upload as ElIconUpload, Refresh as ElIconRefresh } from '@element-plus/icons-vue'
    import { createCoupon, getCoupons, deleteCoupon, assignCouponToUser} from '@/api/coupon'


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
        fetchCoupons()
      } else if (newVal === '优惠券总览') {
        fetchCoupons()
      } else if (newVal === '创建优惠券') {

      } 
    })

    onMounted(() => {
      fetchUserList()
      fetchCoupons()
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
    const selectedCouponId = ref(null) // 当前选中的优惠券ID
    const isAssigning = ref(false) // 是否正在发放中（防止重复提交）


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
      selectedCouponId.value = null
      exitBatchMode()
    }

    async function assignCoupons() {
      console.log(selectedCouponId.value)
      if (selectedCouponId.value == null) {
        ElMessage({
          type: 'warning',
          message: '请选择要发放的优惠券'
        })
        return
      }

      isAssigning.value = true

      try {
        const results = await Promise.allSettled(
          selectedUserIds.value.map(userId =>
            assignCouponToUser(userId, selectedCouponId.value)
          )
        )

        const successCount = results.filter(r => r.status === 'fulfilled').length
        const failCount = results.filter(r => r.status === 'rejected').length

        if (failCount === 0) {
          ElMessage.success(`成功发放 ${successCount} 张优惠券`)
          closeCouponModal()
        } else {
          ElMessage.success(`成功发放 ${successCount} 张，失败 ${failCount} 张`)
        }
      } catch (error) {
        console.error('发放优惠券出错:', error)
        ElMessage.error('发放过程中出现错误')
      } finally {
        isAssigning.value = false
      }
    }

    const couponFormRef = ref()

    // 星期选项
    const weekdayOptions = [
      { value: '1', label: '周一' },
      { value: '2', label: '周二' },
      { value: '3', label: '周三' },
      { value: '4', label: '周四' },
      { value: '5', label: '周五' },
      { value: '6', label: '周六' },
      { value: '7', label: '周日' }
    ]

    // 表单数据
    const couponForm = reactive({
      name: '',
      amount: null,
      min_amount: null,
      dateRange: [],
      weekdays: [],
      description: ''
    })

    // 验证规则
    const rules = reactive({
      name: [
        { required: true, message: '请输入优惠券名称', trigger: 'blur' },
        { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
      ],
      amount: [
        { required: true, message: '请输入优惠金额', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            if (value <= 0) {
              callback(new Error('优惠金额必须大于0'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      min_amount: [
        { 
          validator: (rule, value, callback) => {
            if (value !== null && value < 0) {
              callback(new Error('满减门槛不能为负数'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      weekdays: [
        { required: true, message: '请至少选择一个可用星期', trigger: 'change' }
      ],
      description: [
        { required: true, message: '请输入使用说明', trigger: 'blur' },
        { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
      ]
    })

    // 禁用今天之前的日期
    const disabledDate = (time) => {
      return time.getTime() < Date.now() - 8.64e7
    }

    // 提交表单
    const submitForm = () => {
      couponFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const formData = {
              name: couponForm.name,
              amount: couponForm.amount,
              min_amount: couponForm.min_amount || 0,
              valid_from: couponForm.dateRange[0],
              valid_to: couponForm.dateRange[1],
              weekdays: couponForm.weekdays.join(','),
              description: couponForm.description
            }
            
            // 调用API创建优惠券
            const response = await createCoupon(formData)
            
            ElMessage.success(response.message || '优惠券创建成功')
            resetForm()
            
            
          } catch (error) {
            let errorMsg = error.message
            if (error.response && error.response.data) {
              errorMsg = error.response.data.message || JSON.stringify(error.response.data)
            }
            ElMessage.error(`创建失败: ${errorMsg}`)
          }
        }
      })
    }

    // 重置表单
    const resetForm = () => {
      couponFormRef.value.resetFields()
      couponForm.dateRange = []
    }

    const loading = ref(false)
    const coupons = ref([])
    const searchQuery = ref('')
    const deleteDialogVisible = ref(false)
    const deletingCouponId = ref(null)
    const deletingCouponName = ref('')

    // 获取优惠券列表
    const fetchCoupons = async () => {
      try {
        loading.value = true
        const res = await getCoupons()
        coupons.value = res.coupons
      } catch (error) {
        ElMessage.error('获取优惠券列表失败: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    // 刷新列表
    const refreshCoupons = () => {
      searchQuery.value = ''
      fetchCoupons()
    }

    // 过滤优惠券
    const filteredCoupons = computed(() => {
      if (!searchQuery.value) return coupons.value
      return coupons.value.filter(coupon => 
        coupon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    // 检查是否过期
    const isExpired = (validTo) => {
      return new Date(validTo) < new Date()
    }

    // 格式化日期
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    // 格式化日期时间
    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleString()
    }

    // 格式化星期
    const formatWeekdays = (weekdays) => {
      const daysMap = {
        '1': '周一',
        '2': '周二',
        '3': '周三',
        '4': '周四',
        '5': '周五',
        '6': '周六',
        '7': '周日'
      }
      return weekdays.split(',').map(day => daysMap[day]).join('、')
    }

    // 处理删除
    const handleDelete = (couponId) => {
      const coupon = coupons.value.find(c => c.coupon_id === couponId)
      deletingCouponId.value = couponId
      deletingCouponName.value = coupon.name
      deleteDialogVisible.value = true
    }

    // 确认删除
    const confirmDelete = async () => {
      try {
        await deleteCoupon(deletingCouponId.value)
        ElMessage.success('删除成功')
        refreshCoupons()
      } catch (error) {
        if (error.response?.data?.detail) {
          ElMessage.error(error.response.data.detail)
        } else {
          ElMessage.error('删除失败')
        }
      }
    }

    // 清空搜索
    const handleSearchClear = () => {
      searchQuery.value = ''
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
  width: 600px;
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
  background-color: #65ac7b;
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

/* 优惠券列表样式 */
.coupon-list {
  max-height: 300px;
  overflow-y: auto;
  margin: 16px 0;
  border: 1px solid #eee;
  border-radius: 4px;
}

.coupon-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
}

.coupon-item:hover {
  background: #f5f5f5;
}

.coupon-item.selected {
  background: #e8f5e9;
  border-left: 3px solid #65ac7b;
}

.coupon-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.coupon-details {
  font-size: 13px;
  color: #666;
}

.coupon-details p {
  margin: 4px 0;
  display: flex;
}

.label {
  color: #888;
  min-width: 60px;
  display: inline-block;
}

.value {
  flex: 1;
}

.description {
  margin-top: 8px !important;
  padding-top: 8px;
  border-top: 1px dashed #eee;
  color: #999;
  font-size: 12px;
}

.empty-tip {
  text-align: center;
  padding: 16px;
  color: #999;
}

.selected-info {
  margin: 12px 0;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.coupon-create-container {
  padding: 24px;
  border-radius: 8px;
  
  height: 580px;
  overflow-y: auto;
  margin: 0 auto;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.header h2 {
  color: #71ac7a;
  font-size: 22px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header h2 i {
  margin-right: 10px;
}

.subtitle {
  color: #888;
  font-size: 14px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-col {
  flex: 1;
}

.unit {
  margin-left: 10px;
  color: #71ac7a;
  font-size: 14px;
}

.weekday-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 深度选择器样式需提升到根级别 */
:deep(.weekday-group .el-checkbox-button__inner) {
  border-color: #c8e6c9;
}

:deep(.weekday-group .el-checkbox-button.is-checked .el-checkbox-button__inner) {
  background-color: #71ac7a !important;
  border-color: #71ac7a !important;
  color: white !important;
}

:deep(.weekday-group .el-checkbox-button__inner:hover) {
  border-color: #a5d6a7;
  color: #71ac7a;
}




.green-textarea :deep(.el-textarea__inner) {
  border-color: #c8e6c9;
}

.green-textarea :deep(.el-textarea__inner:focus) {
  border-color: #71ac7a;
  box-shadow: 0 0 0 1px #71ac7a;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.submit-btn {
  background-color: #71ac7a;
  border-color: #71ac7a;
  padding: 12px 24px;
}

.submit-btn:hover {
  background-color: #5d9967;
  border-color: #5d9967;
}

.reset-btn {
  color: #71ac7a;
  border-color: #71ac7a;
  padding: 12px 24px;
}

.reset-btn:hover {
  color: #5d9967;
  border-color: #5d9967;
}

.green-form {
  display: block;
}

:deep(.green-form .el-form-item__label) {
  color: #5a8f64;
  font-weight: 500;
  padding-bottom: 8px;
}

:deep(.green-form .el-input__prefix i) {
  color: #71ac7a;
}


:deep(.green-form .el-input.is-focus .el-input__wrapper),
:deep(.green-form .el-input__wrapper:hover) {
  border-color: #71ac7a;
  box-shadow: 0 0 0 1px #71ac7a inset;
}

:deep(.green-form .el-input-number__wrapper:hover),
:deep(.green-form .el-input-number.is-focus .el-input-number__wrapper) {
  border-color: #71ac7a;
  box-shadow: 0 0 0 1px #71ac7a inset;
}

.green-datepicker {}

/* Move ::v-deep selectors to root level for valid syntax */
:deep(.green-datepicker .el-range-input) {
  color: #71ac7a;
}

:deep(.green-datepicker .el-range-separator) {
  color: #71ac7a;
}

:deep(.green-datepicker .el-date-editor.is-active),
:deep(.green-datepicker .el-date-editor:hover) {
  border-color: #71ac7a;
  box-shadow: 0 0 0 1px #71ac7a inset;
  color: #71ac7a;
}
  
.coupon-overview-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: calc(100vh - 80px);
}

.coupon-overview-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.coupon-overview-container .header h2 {
  color: #333;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.coupon-overview-container .header h2 i {
  margin-right: 10px;
  color: #71ac7a;
}

.actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

:deep(.actions .el-input__wrapper) {
  border-color: #c8e6c9;
  transition: border-color 0.2s, box-shadow 0.2s;
}

:deep(.actions .el-input__wrapper:hover),
:deep(.actions .el-input.is-focus .el-input__wrapper) {
  border-color: #71ac7a;
  box-shadow: 0 0 0 1px #71ac7a inset;
}

:deep(.actions .el-input__prefix i) {
  color: #71ac7a;
}

.actions .el-button--primary {
  background-color: #71ac7a;
  border-color: #71ac7a;
  color: white;
}

.actions .el-button--primary:hover {
  background-color: #5a9e68;
  border-color: #5a9e68;
}

.actions .el-button--primary i {
  margin-right: 4px;
}

.coupon-overview-container .coupon-list {
  flex: 1;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 15px;
  max-height: 480px;
  overflow-y: auto;
}

.coupon-overview-container .scroll-container {

}

.coupon-overview-container .card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 10px;
}

.coupon-overview-container .coupon-card {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 15px;
  transition: all 0.3s;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}


.coupon-overview-container .coupon-card.expired {
  opacity: 0.7;
  background-color: #fafafa;
}

.coupon-overview-container .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
}

.coupon-overview-container .coupon-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.coupon-overview-container .delete-btn {
  margin-left: auto;
}

.coupon-overview-container .card-content {
  flex: 1;
}

.coupon-overview-container .coupon-value {
  margin-bottom: 10px;
}

.coupon-overview-container .amount {
  font-size: 24px;
  font-weight: bold;
  color: #71ac7a;
}

.coupon-overview-container .condition {
  font-size: 12px;
  color: #999;
}

.coupon-overview-container .valid-date, .weekdays {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.coupon-overview-container .valid-date i, .weekdays i {
  margin-right: 5px;
  color: #71ac7a;
}

.coupon-overview-container .card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
  font-size: 12px;
}

.coupon-overview-container .create-time {
  color: #999;
}
  </style>
