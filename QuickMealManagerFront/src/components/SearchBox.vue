<template>
    <div class="search-box">
      <input
        :placeholder="placeholder"
        v-model="inputValue"
        @keydown.enter="handleSearch"
        class="search-input"
      />
      <button class="search-button" @click="handleSearch">搜索</button>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    modelValue: String,
    placeholder: {
      type: String,
      default: '请输入关键词'
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'search'])
  
  const inputValue = ref(props.modelValue || '')
  
  watch(() => props.modelValue, newVal => {
    inputValue.value = newVal
  })
  
  watch(inputValue, newVal => {
    emit('update:modelValue', newVal)
  })
  
  const handleSearch = () => {
    emit('search', inputValue.value)
  }
  </script>
  
  <style scoped>
  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .search-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    color: #333;
    transition: border 0.2s;
  }
  
  .search-input:focus {
    border-color: #65ac7b;
  }
  
  .search-button {
    background-color: #65ac7b;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .search-button:hover {
    background-color: #4c9966;
  }
  </style>
  