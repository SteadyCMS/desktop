<script setup>
import { RouterLink, RouterView } from 'vue-router';

window.electronAPI.sendMessage('Hello from App.vue');
//window.electronAPI.runHugo(['version']);
//window.electronAPI.writeToFile("hi", "output", "myFile.txt");

// (async () => {
//   const foo = await window.electronAPI.readFile("output/myFile.txt")
//   window.electronAPI.sendMessage('Hello from App.vue ' + foo);
// })();

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
