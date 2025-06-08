<template>
    <!--
      外层盒子请用绝对定位或 flex/grid 自行放置。
      组件内部只负责桌体 + 座椅布局、桌号显示。
    -->
    <div
      :class="['table', `t-${size}`, orientation]"
      :style="tableStyle"
    >
      <!-- 桌号 -->
      <span class="num">{{ label }}</span>
  
      <!-- 座椅：按座位数动态渲染 -->
      <div v-for="n in seatCount"
        :key="n"
        class="seat"
        :style="{ background: theme.seat }" />
    </div>
</template>
  
<script setup lang="ts">
  import { computed } from 'vue'
  
  /* ====== props ====== */
  const props = defineProps<{
    /** 座位数，目前支持 4 / 6 / 10 */
    size: 4 | 6 | 10
    /** 'horiz' 横放；'vert' 竖放 */
    orientation: 'horiz' | 'vert'
    /** 桌号或自定义文字 */
    label: string | number
    /** 自定义宽度（横放时宽，高度自动）；可选 */
    width?: number
    /** 自定义高度（竖放时高，宽度自动）；可选 */
    height?: number
    theme?: keyof typeof THEMES // 改为动态获取 THEMES 的键
  }>()
  
  /* 颜色字典 */
    const THEMES = {
        green : { bg:'#d5eadb', border:'#71ac7a', seat:'#71ac7a', text:'#184b29' },
        blue  : { bg:'#d6e8ff', border:'#4d88ff', seat:'#4d88ff', text:'#003a8c' },
        yellow: { bg:'#fff8cc', border:'#e6c200', seat:'#e6c200', text:'#795900' },
        orange: { bg:'#ffe6d3', border:'#ff944d', seat:'#ff944d', text:'#a34700' },
        red   : { bg:'#ffd8d8', border:'#ff4d4f', seat:'#ff4d4f', text:'#a8071a' },
        black : { bg:'#d9d9d9', border:'#595959', seat:'#595959', text:'#141414' },
        deepblue: {bg: '#cce0ff', border: '#003366', seat: '#003366', text: '#001d3d'}
    }
    // 使用 watchEffect 确保深度响应
  const currentTheme = computed(() => {
    return THEMES[props.theme || 'green']
  })
  
  /* ====== 计算属性 ====== */
  const seatCount = computed(() => props.size)
  const theme = computed(() => THEMES[props.theme ?? 'green'])
  const tableStyle = computed(() => {
    // 默认横 120×70，竖 70×120，可用 props.width/height 覆盖
    
    const base = props.orientation === 'horiz'
      ? { width: '100px', height: '60px' }
      : { width: '60px',  height: '100px' }
  
    return {
      ...base,
      ...(props.width  ? { width:  `${props.width}px`  } : {}),
      ...(props.height ? { height: `${props.height}px` } : {}),
      background:  theme.value.bg,
      borderColor: theme.value.border,
      color:       theme.value.text
    }
  })
</script>
  
<style scoped>
  /* ============= 桌体 ============= */
  .table{
    position:relative;
    background:#d5eadb;
    border:2px solid #71ac7a;
    border-radius:4px;
    display:flex;justify-content:center;align-items:center;
    font-weight:600;color:#184b29;
    box-sizing:border-box;
  }
  
  /* 桌号 */
  .num{
    pointer-events:none;
    user-select:none;
  }
  
  /* ============= 座椅基础 ============= */
  .seat{
    position:absolute;
    width:16px;height:16px;
    background:#71ac7a;
    border-radius:50%;
  }
  
  /* ---------- 4 座 ---------- */
  .t-4.horiz .seat:nth-child(2){top:-18px; left:20%;}
  .t-4.horiz .seat:nth-child(3){top:-18px; left:70%;}
  .t-4.horiz .seat:nth-child(4){bottom:-18px; left:20%;}
  .t-4.horiz .seat:nth-child(5){bottom:-18px; left:70%;}
  
  .t-4.vert  .seat:nth-child(2){left:-18px;  top:20%;}
  .t-4.vert  .seat:nth-child(3){left:-18px;  top:70%;}
  .t-4.vert  .seat:nth-child(4){right:-18px; top:20%;}
  .t-4.vert  .seat:nth-child(5){right:-18px; top:70%;}
  
  /* ---------- 6 座 ---------- */
  .t-6.horiz .seat:nth-child(2){top:-18px; left:25%;}
  .t-6.horiz .seat:nth-child(3){top:-18px; left:75%;}
  .t-6.horiz .seat:nth-child(4){bottom:-18px; left:25%;}
  .t-6.horiz .seat:nth-child(5){bottom:-18px; left:75%;}
  .t-6.horiz .seat:nth-child(6){left:-18px; top:50%; translate:0 -50%;}
  .t-6.horiz .seat:nth-child(7){right:-18px;top:50%; translate:0 -50%;}
  
  .t-6.vert  .seat:nth-child(2){left:50%; top:-18px; translate:-50% 0;}
  .t-6.vert  .seat:nth-child(3){left:50%; bottom:-18px; translate:-50% 0;}
  .t-6.vert  .seat:nth-child(4){left:-18px; top:25%;}
  .t-6.vert  .seat:nth-child(5){left:-18px; top:75%;}
  .t-6.vert  .seat:nth-child(6){right:-18px; top:25%;}
  .t-6.vert  .seat:nth-child(7){right:-18px; top:75%;}
  
  /* ---------- 10 座 ---------- */
  .t-10.horiz .seat:nth-child(2){top:-18px; left:15%;}
  .t-10.horiz .seat:nth-child(3){top:-18px; left:35%;}
  .t-10.horiz .seat:nth-child(4){top:-18px; left:65%;}
  .t-10.horiz .seat:nth-child(5){top:-18px; left:85%;}
  .t-10.horiz .seat:nth-child(6){bottom:-18px; left:15%;}
  .t-10.horiz .seat:nth-child(7){bottom:-18px; left:35%;}
  .t-10.horiz .seat:nth-child(8){bottom:-18px; left:65%;}
  .t-10.horiz .seat:nth-child(9){bottom:-18px; left:85%;}
  .t-10.horiz .seat:nth-child(10){left:-18px; top:50%; translate:0 -50%;}
  .t-10.horiz .seat:nth-child(11){right:-18px; top:50%; translate:0 -50%;}
  
  /* 如需 10 座竖放，可按同理补充 .t-10.vert 的 nth-child 定位 */
</style>
  