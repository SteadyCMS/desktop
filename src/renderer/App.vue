<script setup>
import { RouterLink, RouterView } from 'vue-router';

window.electronAPI.sendMessage('Hello from App.vue');

</script>

<template>
  <main> 

    <div class="">
      <RouterView />
    </div>

    <!--  <BlockEditorView />  -->
  </main>
</template>

<style scoped>
</style>
