<script setup>
  import { ref } from 'vue';

  const props = defineProps(['title', 'text']);
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div id="loading" class="absolute w-screen h-screen flex flex-row justify-center items-center bg-white">
      <div class="flex flex-col text-center mx-auto">
        <svg class="animate-spin h-20 w-20 text-accent mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-center mt-6 text-tint-10 font-semibold">{{ props.title }}</p>
        <p class="text-center text-sm mt-1 text-tint-8">{{ props.text }}</p>
      </div>
    </div>
  </Transition>
</template>
  
<style scoped>
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