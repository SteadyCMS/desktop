<script setup>
import { RouterLink, RouterView } from 'vue-router';
window.electronAPI.sendMessage('Hello from App.vue');

</script>

<template>
  <main> 

    <div class="subpixel-antialiased">
      <RouterView />
    </div>

  </main>
</template>

<style scoped>
</style>
