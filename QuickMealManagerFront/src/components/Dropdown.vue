<template>
  <div class="dropdown-container">
    <label :for="id" class="dropdown-label">{{ label }}</label>
    <select
      :id="id"
      v-model="selectedValue"
      :class="['dropdown', customClass]"
      :disabled="disabled"
      :style="{ width: width }" 
      @change="handleChange"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['update:modelValue']) // 修改事件名称

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    required: false
  },
  id: {
    type: String,
    required: true
  },
  customClass: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  width: {  
    type: String,
    default: '180px' 
  }
})

const selectedValue = ref(props.modelValue)

const handleChange = () => {
  emit('update:modelValue', selectedValue.value)
}
</script>

<style scoped>
.dropdown-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.dropdown-label {
  font-size: 14px;
  color: #184b29;
  font-weight: 600;
}

.dropdown {
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #184b29;
  transition: all 0.2s;
}

/* 去掉聚焦时的黑色边框 */
.dropdown:focus {
  outline: none;
  border-color: #d9d9d9;
}

/* 悬浮时的背景色 */
.dropdown option:hover {
  background-color: #e6f7e5;
}

/* 禁用状态样式 */
.dropdown[disabled] {
  background-color: #f1f1f1;
  cursor: not-allowed;
}
</style>