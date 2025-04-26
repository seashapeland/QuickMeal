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
      <div class="revenue-block">
        <span class="label">今日营业额：</span>
        <span class="symbol">¥</span>
        <span class="amount">{{ revenue }}</span>
      </div>

      <!-- 层叠区 -->
      <div class="card-list-scrollable">
        <div
          class="table-card"
          v-for="(theme, tableId) in tableThemes"
          :key="tableId"
          :ref="el => registerCardRef(tableId, el)"
        >
          <!-- 顶部标签行 -->
          <div class="card-header" @click="toggleCard(tableId)">
            <!-- 状态颜色圆点 -->
            <span
              class="status-dot"
              :style="{ backgroundColor: THEMES[theme].seat }"
            ></span>

            <!-- 展开/收起图标 -->
            <span class="toggle-icon">
              {{ expandedCards[tableId] ? '▼' : '▶' }}
            </span>

            <!-- 桌号 + 状态 -->
            <span class="card-title">{{ tableId }}（{{ THEME_STATUS_MAP[theme] }}）</span>
          </div>

          <!-- 展开区域 -->
          <div
            v-if="expandedCards[tableId]"
            class="card-content"
          >
            <p>👉 这里是 {{ tableId }} 的展开内容</p>
            <p style="color: #ccc;">（占位展示）</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
  // 目前无需脚本，后续可在这里绑定桌位状态、点击交互等
  import { ref, onMounted, nextTick } from 'vue'
  import PartitionWall from '@/components/PartitionWall.vue'
  import RestaurantTable from '@/components/RestaurantTable.vue'
  const currentDate = ref('')
  const currentTime = ref('')
  const revenue = ref('16,230.00')
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

  /** 所有桌号及其初始主题（全部设为 green） */
  const tableThemes = ref({
    T1: 'green', T2: 'green', T3: 'green', T4: 'green',
    T5: 'green', T6: 'green', T7: 'green', T8: 'green',
    T9: 'green', T10: 'green', T11: 'green', T12: 'green',
    T13: 'green', T14: 'green', T15: 'green', T16: 'green',
    T17: 'green', T18: 'green', T19: 'green', T20: 'green'
  })
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
      tableThemes.value[tableNo] = theme
    } else {
      console.warn(`桌号 ${tableNo} 不存在于 tableThemes 中`)
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
  setTableTheme('T13', 'blue')
  setTableTheme('T1', 'black')
  setTableTheme('T11', 'red')
  setTableTheme('T18', 'yellow')
  setTableTheme('T10', 'orange')
  setTableTheme('T9', 'deepblue')


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

  onMounted(() => {
    updateClock()
    setInterval(updateClock, 1000)
  })

  function toggleCard(tableId) {
    expandedCards.value[tableId] = !expandedCards.value[tableId]
  }

  /** 在 v-for 中注册卡片 DOM 元素 */
  function registerCardRef(tableId, el) {
    if (el) cardRefs.value[tableId] = el
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



</style>
