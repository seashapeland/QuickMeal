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
                 :style="{ position:'absolute', top:'20px', left:'20px' }" />
      <RestaurantTable :size="4" orientation="horiz" label="T2" :theme="tableThemes['T2']"
                 :style="{ position:'absolute', top:'140px', left:'20px' }" />
      <RestaurantTable :size="4" orientation="horiz" label="T3" :theme="tableThemes['T3']"
                 :style="{ position:'absolute', top:'260px', left:'20px' }" />
      <RestaurantTable :size="6" orientation="horiz" label="T4" :theme="tableThemes['T4']"
                 :style="{ position:'absolute', top:'380px', left:'20px' }" />
      <RestaurantTable :size="6" orientation="horiz" label="T5" :theme="tableThemes['T5']"
                 :style="{ position:'absolute', top:'500px', left:'20px' }" />   
      <RestaurantTable :size="4" orientation="vert" label="T6" :theme="tableThemes['T6']"
                 :style="{ position:'absolute', top:'0px', left:'190px' }" />
      <RestaurantTable :size="4" orientation="vert" label="T7" :theme="tableThemes['T7']"
                 :style="{ position:'absolute', top:'150px', left:'190px' }" />
      <RestaurantTable :size="4" orientation="vert" label="T8" :theme="tableThemes['T8']"
                 :style="{ position:'absolute', top:'290px', left:'190px' }" />
      <RestaurantTable :size="4" orientation="vert" label="T9" :theme="tableThemes['T9']"
                 :style="{ position:'absolute', top:'500px', left:'190px' }" />
      <RestaurantTable :size="6" orientation="vert" label="T10" :theme="tableThemes['T10']"
                 :style="{ position:'absolute', top:'260px', left:'320px' }" />
      <RestaurantTable :size="6" orientation="vert" label="T11" :theme="tableThemes['T11']"
                 :style="{ position:'absolute', top:'260px', left:'450px' }" />
      <RestaurantTable :size="10" orientation="horiz" label="T12" :width="200" :height="70" :theme="tableThemes['T12']"
                 :style="{ position:'absolute', top:'510px', left:'317px' }" />

      <RestaurantTable :size="4" orientation="horiz" label="T13" :theme="tableThemes['T13']"
                 :style="{ position:'absolute', top:'20px', left:'570px' }" />
      <RestaurantTable :size="4" orientation="horiz" label="T14" :theme="tableThemes['T14']"
                 :style="{ position:'absolute', top:'180px', left:'570px' }" />
      <RestaurantTable :size="4" orientation="horiz" label="T15" :theme="tableThemes['T15']"
                 :style="{ position:'absolute', top:'310px', left:'570px' }" />
      <RestaurantTable :size="6" orientation="vert" label="T16" :theme="tableThemes['T16']"
                 :style="{ position:'absolute', top:'490px', left:'590px' }" />

      <RestaurantTable :size="4" orientation="horiz" label="T17" :theme="tableThemes['T17']"
                 :style="{ position:'absolute', top:'20px', left:'710px' }" />
      <RestaurantTable :size="4" orientation="horiz" label="T18" :theme="tableThemes['T18']"
                 :style="{ position:'absolute', top:'180px', left:'710px' }" />
      <RestaurantTable :size="4" orientation="horiz" label="T19" :theme="tableThemes['T19']"
                 :style="{ position:'absolute', top:'310px', left:'710px' }" />
      <RestaurantTable :size="6" orientation="vert" label="T20" :theme="tableThemes['T20']"
                 :style="{ position:'absolute', top:'490px', left:'730px' }" />

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

    <!-- 右侧后续区域（暂留空） -->
    <div class="placeholder">
      <!-- 这里以后可放经营报表、实时状态、图表等 -->
      <h3>门店经营组件占位</h3>
    </div>
  </div>
</template>

<script setup>
  // 目前无需脚本，后续可在这里绑定桌位状态、点击交互等
  import { ref } from 'vue'
  import PartitionWall from '@/components/PartitionWall.vue'
  import RestaurantTable from '@/components/RestaurantTable.vue'
  /** 所有桌号及其初始主题（全部设为 green） */
  const tableThemes = ref({
    T1: 'green', T2: 'green', T3: 'green', T4: 'green',
    T5: 'green', T6: 'green', T7: 'green', T8: 'green',
    T9: 'green', T10: 'green', T11: 'green', T12: 'green',
    T13: 'green', T14: 'green', T15: 'green', T16: 'green',
    T17: 'green', T18: 'green', T19: 'green', T20: 'green'
  })

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
  

</script>

<style scoped>
/* 整体左右排布 */
.store-wrapper {
  display: flex;
  gap: 24px;
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



/* 隔断墙 */


/* ===== 右侧占位区域 ===== */
.placeholder {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
  border: 2px dashed #eee;
  border-radius: 8px;
}
</style>
