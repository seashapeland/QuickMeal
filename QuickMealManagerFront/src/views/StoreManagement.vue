<template>
  <div class="store-wrapper">
    <!-- 楼面图 -->
    <div class="floorplan">
      <!-- 大门 -->
      <div class="door"></div>

      <!-- 前台 -->
      <div class="counter">前台</div>

      <!-- 桌位（可自定义数量、大小、方向） -->
      <RestaurantTable :size="4" orientation="horiz" label="T1" :theme="tableThemes['T1']"
        :style="{ position:'absolute', top:'20px', left:'20px' }"
        @mouseenter="e => showHoverInfo('T1', tableThemes['T1'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T1')"/>
      <RestaurantTable :size="4" orientation="horiz" label="T2" :theme="tableThemes['T2']"
        :style="{ position:'absolute', top:'140px', left:'20px' }"
        @mouseenter="e => showHoverInfo('T2', tableThemes['T2'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T2')"/>
      <RestaurantTable :size="4" orientation="horiz" label="T3" :theme="tableThemes['T3']"
        :style="{ position:'absolute', top:'260px', left:'20px' }"
        @mouseenter="e => showHoverInfo('T3', tableThemes['T3'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T3')"/>
      <RestaurantTable :size="6" orientation="horiz" label="T4" :theme="tableThemes['T4']"
        :style="{ position:'absolute', top:'380px', left:'20px' }"
        @mouseenter="e => showHoverInfo('T4', tableThemes['T4'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T4')"/>
      <RestaurantTable :size="6" orientation="horiz" label="T5" :theme="tableThemes['T5']"
        :style="{ position:'absolute', top:'500px', left:'20px' }"
        @mouseenter="e => showHoverInfo('T5', tableThemes['T5'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T5')"/>
      <RestaurantTable :size="4" orientation="vert" label="T6" :theme="tableThemes['T6']"
        :style="{ position:'absolute', top:'0px', left:'190px' }"
        @mouseenter="e => showHoverInfo('T6', tableThemes['T6'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T6')"/>
      <RestaurantTable :size="4" orientation="vert" label="T7" :theme="tableThemes['T7']"
        :style="{ position:'absolute', top:'150px', left:'190px' }"
        @mouseenter="e => showHoverInfo('T7', tableThemes['T7'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T7')"/>
      <RestaurantTable :size="4" orientation="vert" label="T8" :theme="tableThemes['T8']"
        :style="{ position:'absolute', top:'290px', left:'190px' }"
        @mouseenter="e => showHoverInfo('T8', tableThemes['T8'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T8')"/>
      <RestaurantTable :size="4" orientation="vert" label="T9" :theme="tableThemes['T9']"
        :style="{ position:'absolute', top:'500px', left:'190px' }"
        @mouseenter="e => showHoverInfo('T9', tableThemes['T9'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T9')"/>
      <RestaurantTable :size="6" orientation="vert" label="T10" :theme="tableThemes['T10']"
        :style="{ position:'absolute', top:'260px', left:'320px' }"
        @mouseenter="e => showHoverInfo('T10', tableThemes['T10'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T10')"/>
      <RestaurantTable :size="6" orientation="vert" label="T11" :theme="tableThemes['T11']"
        :style="{ position:'absolute', top:'260px', left:'450px' }"
        @mouseenter="e => showHoverInfo('T11', tableThemes['T11'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T11')"/>
      <RestaurantTable :size="10" orientation="horiz" label="T12" :width="200" :height="70" :theme="tableThemes['T12']"
        :style="{ position:'absolute', top:'510px', left:'317px' }"
        @mouseenter="e => showHoverInfo('T12', tableThemes['T12'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T12')"/>
      <RestaurantTable :size="4" orientation="horiz" label="T13" :theme="tableThemes['T13']"
        :style="{ position:'absolute', top:'20px', left:'570px' }"
        @mouseenter="e => showHoverInfo('T13', tableThemes['T13'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T13')"/>
      <RestaurantTable :size="4" orientation="horiz" label="T14" :theme="tableThemes['T14']"
        :style="{ position:'absolute', top:'180px', left:'570px' }"
        @mouseenter="e => showHoverInfo('T14', tableThemes['T14'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T14')"/>
      <RestaurantTable :size="4" orientation="horiz" label="T15" :theme="tableThemes['T15']"
        :style="{ position:'absolute', top:'310px', left:'570px' }"
        @mouseenter="e => showHoverInfo('T15', tableThemes['T15'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T15')"/>
      <RestaurantTable :size="6" orientation="vert" label="T16" :theme="tableThemes['T16']"
        :style="{ position:'absolute', top:'490px', left:'590px' }"
        @mouseenter="e => showHoverInfo('T16', tableThemes['T16'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T16')"/>
      <RestaurantTable :size="4" orientation="horiz" label="T17" :theme="tableThemes['T17']"
        :style="{ position:'absolute', top:'20px', left:'710px' }"
        @mouseenter="e => showHoverInfo('T17', tableThemes['T17'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T17')"/>
      <RestaurantTable :size="4" orientation="horiz" label="T18" :theme="tableThemes['T18']"
        :style="{ position:'absolute', top:'180px', left:'710px' }"
        @mouseenter="e => showHoverInfo('T18', tableThemes['T18'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T18')"/>
      <RestaurantTable :size="4" orientation="horiz" label="T19" :theme="tableThemes['T19']"
        :style="{ position:'absolute', top:'310px', left:'710px' }"
        @mouseenter="e => showHoverInfo('T19', tableThemes['T19'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T19')"/>
      <RestaurantTable :size="6" orientation="vert" label="T20" :theme="tableThemes['T20']"
        :style="{ position:'absolute', top:'490px', left:'730px' }"
        @mouseenter="e => showHoverInfo('T20', tableThemes['T20'], e.currentTarget)" @mouseleave="hideHoverInfo" @click="expandAndScrollTo('T20')"/>


      <!-- 隔断 -->
      <!-- middle -->
      <PartitionWall orientation="vertical" :length="100" :style="{top:'-4px', left:'280px', position:'absolute'}"/>
      <PartitionWall orientation="vertical" :length="100" :style="{top:'-4px', left:'545px', position:'absolute'}"/>
      <PartitionWall orientation="vertical" :length="250" :style="{top:'150px', left:'280px', position:'absolute'}"/>
      <PartitionWall orientation="vertical" :length="250" :style="{top:'150px', left:'545px', position:'absolute'}"/>
      <PartitionWall orientation="horizontal" :length="270" :style="{top:'230px', left:'285px', position:'absolute'}"/>
      <PartitionWall orientation="vertical" :length="130" :style="{top:'240px', left:'410px', position:'absolute'}"/>
      <!-- left -->
      <PartitionWall orientation="horizontal" :length="130" :style="{top:'105px', left:'-4px', position:'absolute'}"/>
      <PartitionWall orientation="horizontal" :length="130" :style="{top:'225px', left:'-4px', position:'absolute'}"/>
      <PartitionWall orientation="horizontal" :length="130" :style="{top:'345px', left:'-4px', position:'absolute'}"/>
      <PartitionWall orientation="horizontal" :length="130" :style="{top:'465px', left:'-4px', position:'absolute'}"/>
      <PartitionWall orientation="horizontal" :length="130" :style="{top:'265px', left:'160px', position:'absolute'}"/>
      <PartitionWall orientation="vertical" :length="130" :style="{top:'480px', left:'280px', position:'absolute'}"/>
      <PartitionWall orientation="vertical" :length="130" :style="{top:'480px', left:'545px', position:'absolute'}"/>
      <!-- right -->
      <PartitionWall orientation="horizontal" :length="130" :style="{top:'265px', left:'545px', position:'absolute'}"/>
      <PartitionWall orientation="horizontal" :length="120" :style="{top:'265px', left:'705px', position:'absolute'}"/>
      <PartitionWall orientation="vertical" :length="130" :style="{top:'480px', left:'685px', position:'absolute'}"/>


    </div>
    <!--  Tooltip 浮层 -->
    <div
      v-if="hoverInfo.visible"
      class="table-tooltip"
      :style="{
        top: `${hoverInfo.y}px`,
        left: `${hoverInfo.x}px`
      }"
    >
      <p>桌号：{{ hoverInfo.label }}</p>
      <p
        class="status-text"
        :style="{ color: hoverInfo.theme }"
      >
        <span
          class="status-dot"
          :style="{ backgroundColor: hoverInfo.theme }"
        ></span>
        {{ hoverInfo.statusText }}
      </p>
    </div>

    <!-- 右侧区域 -->
    <div class="store-panel">
      <!-- 顶部时间区域 -->
      <div class="time-block">
        <div class="date">{{ currentDate }}</div>
        <div class="time">{{ currentTime }}</div>
      </div>

      <!-- 今日营业额 -->
      

      <!-- 层叠区 -->
      <div class="card-list-scrollable">
        <div
          class="table-card"
          v-for="(theme, tableId) in tableThemes"
          :key="tableId"
          :class="{ 'has-order': ordersData[tableId] }"
          :ref="el => { if (el) cardRefs[tableId] = el }"
        >
          <!-- 顶部标签行 -->
          <div class="card-header" @click="toggleCard(tableId)">
            <span class="status-dot" :style="{ backgroundColor: THEMES[theme].seat }"></span>
            <span class="toggle-icon">{{ expandedCards[tableId] ? '▼' : '▶' }}</span>
            <span class="card-title">{{ tableId }}（{{ THEME_STATUS_MAP[theme] }}）</span>
          </div>

          <!-- 展开区域 -->
          <Transition name="slide-fade">
            <div v-if="expandedCards[tableId]" class="card-content">
              <!-- 空闲状态显示 -->
              <div v-if="theme === 'green'" class="empty-state">
                <p>当前桌位空闲</p>
                <button @click="startNewOrder(tableId)">开始新订单</button>
              </div>

              <!-- 点菜中状态显示 -->
              <div v-else-if="theme === 'blue'" class="ordering-state">
                <p>顾客正在点菜...</p>
              </div>

              <!-- 有订单状态显示 -->
              <div v-else class="order-info">
                <div class="order-header">
                  <h3>订单号：{{ ordersData[tableId]?.orderId }}</h3>
                  <span class="order-status" :style="{ color: THEMES[theme].text }">
                    {{ THEME_STATUS_MAP[theme] }}
                  </span>
                </div>

                <div class="customer-info">
                  <p>客户：{{ ordersData[tableId]?.customer }}</p>
                  <p>下单时间：{{ ordersData[tableId]?.createdAt }}</p>
                </div>

                <div class="order-items">
                  <h4>菜品清单：</h4>
                  <ul>
                    <li v-for="(item, index) in ordersData[tableId]?.items" :key="index">
                      <span class="item-name">{{ item.name }}</span>
                      <span class="item-quantity">×{{ item.quantity }}</span>
                      <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
                    </li>
                  </ul>
                </div>

                <div class="order-footer">
                  <div class="total-amount">
                    总计：<span>¥{{ ordersData[tableId]?.amount.toFixed(2) }}</span>
                  </div>
                  <div class="action-buttons">
                    <div class="action-buttons">
                      <button 
                        v-if="theme === 'yellow'" 
                        @click="openModal('serve', ordersData[tableId]?.orderId, ordersData[tableId]?.tableId)"
                        class="serve-btn"
                      >
                        <i class="icon-check"></i> 确认上菜
                      </button>
                      
                      <button 
                        v-if="theme === 'yellow'" 
                        @click="openModal('cancel', ordersData[tableId]?.orderId, ordersData[tableId]?.tableId)"
                        class="cancel-btn-1"
                      >
                        <i class="icon-close"></i> 取消订单
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
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
  // 目前无需脚本，后续可在这里绑定桌位状态、点击交互等
  import { ref, onMounted, nextTick, onUnmounted, reactive, watch } from 'vue'
  import PartitionWall from '@/components/PartitionWall.vue'
  import RestaurantTable from '@/components/RestaurantTable.vue'
  import { getTableStatusList, getOrderDetail } from '@/api/table'
  import { markOrderAsServed, cancelOrder } from '@/api/order'
  import { ElMessage } from 'element-plus';

  const currentDate = ref('')
  const currentTime = ref('')
  const THEMES = {
      green : { bg:'#d5eadb', border:'#71ac7a', seat:'#71ac7a', text:'#184b29' },
      blue  : { bg:'#d6e8ff', border:'#4d88ff', seat:'#4d88ff', text:'#003a8c' },
      yellow: { bg:'#fff8cc', border:'#e6c200', seat:'#e6c200', text:'#795900' },
      orange: { bg:'#ffe6d3', border:'#ff944d', seat:'#ff944d', text:'#a34700' },
      red   : { bg:'#ffd8d8', border:'#ff4d4f', seat:'#ff4d4f', text:'#a8071a' },
      black : { bg:'#d9d9d9', border:'#595959', seat:'#595959', text:'#141414' },
      deepblue: {bg: '#cce0ff', border: '#003366', seat: '#003366', text: '#001d3d'}
  }
  
  const THEME_STATUS_MAP = {
    green:  '空闲',
    blue:   '点菜中',
    yellow: '待餐中',
    orange: '待餐较久',
    red:    '待餐过久',
    black:  '故障中',
    deepblue: '待支付'
  }

  const STATUS_THEME_MAP = {
    '空闲': 'green',
    '点菜中': 'blue',
    '待餐中': 'yellow',
    '待餐较久': 'orange',
    '待餐过久': 'red',
    '故障中': 'black',
    '待支付': 'deepblue'
  }



  /** 所有桌号及其初始主题（全部设为 green） */
  const tableThemes = ref({
    T1: 'green', T2: 'green', T3: 'green', T4: 'green',
    T5: 'green', T6: 'green', T7: 'green', T8: 'green',
    T9: 'green', T10: 'green', T11: 'green', T12: 'green',
    T13: 'green', T14: 'green', T15: 'green', T16: 'green',
    T17: 'green', T18: 'green', T19: 'green', T20: 'green'
  })

  // 监听整个 tableThemes
  watch(
    () => ({ ...tableThemes.value }), // 创建新对象确保触发
    (newVal) => {
      console.log('tableThemes 变化:', newVal)
    },
    { deep: true }
  )

  const expandedCards = ref({
    T1: false, T2: false, T3: false, T4: false,
    T5: false, T6: false, T7: false, T8: false,
    T9: false, T10: false, T11: false, T12: false,
    T13: false, T14: false, T15: false, T16: false,
    T17: false, T18: false, T19: false, T20: false
  })
  const cardRefs = ref({})
  /**
   * 切换某个桌号的主题颜色
   * @param tableNo 桌号（如 T1）
   * @param theme 新主题（支持六种）
   */
  function setTableTheme(tableNo, theme) {
    if (tableThemes.value[tableNo] !== undefined) {
      tableThemes.value[tableNo] = theme // 正确使用 .value
    } else {
      console.warn(`桌号 ${tableNo} 不存在于 tableThemes 中`)
    }
  }
  // setTableTheme('T1', 'blue');

  let intervalId;

  onMounted(() => {
    updateClock()
    setInterval(updateClock, 1000)
    updateTableThemesFromBackend(); // 立即执行一次
    intervalId = setInterval(updateTableThemesFromBackend, 1000);
  });

  onUnmounted(() => {
    clearInterval(intervalId);
  });

  const ordersData = ref({});

  async function updateTableThemesFromBackend() {
    try {
      const res = await getTableStatusList();
      if (res.data && Array.isArray(res.data)) {
        for (const item of res.data) {
          const key = `T${item.table_id}`;
          const theme = STATUS_THEME_MAP[item.status];
          if (theme) {
            setTableTheme(key, theme);
          }

          // 👇 如果有订单号就查详情并更新 ordersData
          if (item.current_order_id) {
            try {
              const orderRes = await getOrderDetail(item.current_order_id);
              ordersData.value[key] = {
                orderId: orderRes.order_id,
                tableId: orderRes.table_id,
                customer: `${orderRes.user.name}`,
                createdAt: orderRes.created_at,
                amount: orderRes.total_price,
                status: orderRes.status,
                items: orderRes.items.map(i => ({
                  name: i.name,
                  price: i.price,
                  quantity: i.quantity
                }))
              };
              console.log(ordersData.value)
            } catch (err) {
              console.error(`获取订单 ${item.order_id} 失败:`, err);
            }
          } else {
            delete ordersData[key]; // 若无订单，则清空该桌订单信息
          }
        }
      }
    } catch (err) {
      console.error('桌位状态获取失败:', err);
    }
  }



  const hoverInfo = ref({
    visible: false,
    label: '',
    theme: '',
    statusText: '',
    x: 0,
    y: 0
  })

  function showHoverInfo(label, theme, event) {
    const rect = event.getBoundingClientRect()
    const color = THEMES[theme] ?? THEMES.green
    hoverInfo.value = {
      visible: true,
      label,
      theme: color.seat,
      statusText: THEME_STATUS_MAP[theme] ?? '未知状态',
      x: rect.left + rect.width / 2,
      y: rect.top - 12 // 向上偏移
    }
  }

  function hideHoverInfo() {
    hoverInfo.value.visible = false
  }
 


  // 右边逻辑
  function updateClock() {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const d = now.getDate()
    currentDate.value = `${y}年${m}月${d}日`

    const h = now.getHours().toString().padStart(2, '0')
    const min = now.getMinutes().toString().padStart(2, '0')
    const s = now.getSeconds().toString().padStart(2, '0')
    currentTime.value = `${h}:${min}:${s}`

  }


  function toggleCard(tableId) {
    expandedCards.value[tableId] = !expandedCards.value[tableId]
  }


  /** 点击桌子后，自动展开对应卡片并滚动到其位置 */
  function expandAndScrollTo(tableId) {
    // 可选：先关闭其他项（单开模式）
    Object.keys(expandedCards.value).forEach(id => expandedCards.value[id] = false)

    expandedCards.value[tableId] = true

    // 等待 DOM 渲染完毕后执行滚动
    nextTick(() => {
      const targetEl = cardRefs.value[tableId]
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  }

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
        modalTitle.value = '确认已上菜完成';
        break;
      case 'cancel':
        modalTitle.value = '确认要取消此订单';
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
      } else if (modalAction.value === 'cancel') {
        await cancelOrder(currentOrderId.value, currentTableId.value);
        ElMessage.success('订单已取消');
      }
      
      updateTableThemesFromBackend();// 重新获取订单数据
      showModal.value = false; // 关闭弹窗
    } catch (error) {
      ElMessage.error(`操作失败: ${error.message}`);
    }
  };
</script>

<style scoped>
/* 整体左右排布 */
.store-wrapper {
  display: flex;
  gap: 36px;
  height: 100%;
}

/* ===== 楼面图区域 ===== */
.floorplan {
  position: relative;
  width: 840px;         /* 根据侧边栏宽度自行调节 */
  height: 627px;
  background: #fafafa;
  border: 10px solid #71ac7a;
  border-radius: 8px;
  padding: 16px;
}

/* 大门 */
.door{
  position:absolute;top:-2px;left:50%;translate:-50% 0;
  width:160px;height:14px;
  background:#8d8d8d;border-radius:0 0 6px 6px;
}

/* 前台 */
.counter{
  position:absolute;top:150px;left:50%;translate:-50% 0;
  width:220px;height:48px;
  background:#65ac7b;color:#fff;
  display:flex;justify-content:center;align-items:center;
  border-radius:6px;font-size:16px;font-weight:600;
}

.table-tooltip {
  position: fixed;
  transform: translate(-50%, -100%);
  background: white;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 999;
}

.status-text {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
  font-size: 14px;
  font-weight: 500;
}

.status-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
}


/* ===== 右侧区域 ===== */
.store-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  font-family: sans-serif;
  color: #333;
  background: #fff;
  border: 2px solid #d9f0e1;
  box-sizing: border-box;
  border-radius: 8px;
}

.time-block {
  text-align: left;
  margin-bottom: 24px;
}

.date {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.time {
  font-size: 24px;
  font-weight: bold;
  color: #71ac7a;
}

.revenue-block {
  font-size: 18px;
  background: #f4f8f9;
  border: 1px solid #e0e0e0;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.symbol {
  font-size: 20px;
  color: #f56c6c;
  margin: 0 4px;
}

.amount {
  font-size: 28px;
  font-weight: bold;
  color: #f56c6c;
}

/* 卡片列表区域 */
.card-list-scrollable {
  width: 350px;
  max-height: 100%;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.table-card {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  padding: 12px 14px;
  transition: all 0.3s;
  cursor: pointer;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 15px;
}

.status-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.toggle-icon {
  font-size: 12px;
  color: #888;
}

.card-title {
  flex-grow: 1;
}

.card-content {
  margin-top: 10px;
  padding-left: 24px;
  font-size: 14px;
  color: #444;
}

/* 展开内容样式 */
.card-content {
  padding: 16px;
  border-top: 1px solid #eee;
}

.empty-state {
  text-align: center;
  padding: 20px 0;
  color: #888;
}

.empty-state button {
  margin-top: 10px;
  padding: 6px 12px;
  background: #4d88ff;
  color: white;
  border: none;
  border-radius: 4px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.order-status {
  font-weight: bold;
}

.customer-info p {
  margin: 4px 0;
  color: #666;
}

.order-items {
  margin: 16px 0;
}

.order-items ul {
  list-style: none;
  padding: 0;
  margin: 8px 0;
}

.order-items li {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed #eee;
}

.item-name {
  flex: 2;
}

.item-quantity {
  flex: 1;
  text-align: center;
}

.item-price {
  flex: 1;
  text-align: right;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.total-amount span {
  font-weight: bold;
  color: #f56c6c;
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: flex-end;
}

/* 确认按钮样式 */
.serve-btn {
  background-color: #65ac7b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(101, 172, 123, 0.3);
}

.serve-btn:hover {
  background-color: #4c9966;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(101, 172, 123, 0.4);
}

.serve-btn:active {
  transform: translateY(0);
}

/* 取消按钮样式 */
.cancel-btn-1 {
  background-color: #fff1f0;
  color: #f5222d;
  border: 1px solid #ffa39e;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.cancel-btn-1:hover {
  background-color: #ffccc7;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(245, 34, 45, 0.1);
}

.cancel-btn-1:active {
  transform: translateY(0);
}

/* 图标样式（可以使用字体图标或SVG） */
.icon-check {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>') no-repeat center;
}

.icon-close {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f5222d"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>') no-repeat center;
}

/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.ordering-state {
  padding: 16px;
  text-align: center;
}

.ordering-state p {
  color: #666;
  margin-bottom: 16px;
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

</style>
