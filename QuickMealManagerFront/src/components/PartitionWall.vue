<template>
    <div
      class="partition"
      :class="[orientation]"
      :style="computedStyle"
    />
</template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  /** 横竖方向 */
  const props = defineProps<{
    orientation: 'horizontal' | 'vertical'
    size?: 'long' | 'short'
    /** 自定义像素长度（优先级最高） */
    length?: number
  }>()
  
  /* 默认尺寸（px） */
  const DEFAULTS = {
    horizontal: { long: 200, short: 100, thickness: 12 },
    vertical:   { long: 200, short: 100, thickness: 12 }
  }
  
  const computedStyle = computed(() => {
    const o = props.orientation
    const len  = props.length ?? DEFAULTS[o][props.size ?? 'long']
    const thick = DEFAULTS[o].thickness
    return o === 'horizontal'
      ? { width: `${len}px`, height: `${thick}px` }
      : { width: `${thick}px`, height: `${len}px` }
  })
</script>
  
<style scoped>
  .partition{
    background:#65ac7b;
    border-radius:4px;
  }
  /* 可加阴影 / 纹理等： */
  /* .partition.horizontal { box-shadow:0 1px 3px rgba(0,0,0,.2);} */
</style>
  