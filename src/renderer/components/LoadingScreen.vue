<script setup>
  import { ref } from 'vue';

  const props =  defineProps(['title', 'text']);
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div id="loading" class="w-full h-full bg-white flex flex-col absolute">

      <div class="flex flex-row items-center self-center">
        <div class="flex mt-40">
          <svg class="animate-spin -ml-1 mr-3 h-20 w-20 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <div class="text-center mt-6 text-lg text-gray-600 font-medium">{{ props.title }}</div>
      <div class="text-center mt-2 text-lg text-gray-600 font-medium">{{ props.text }}</div>

    </div>
  </Transition>
  </template>
  
<style>
#loading {
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.0s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>