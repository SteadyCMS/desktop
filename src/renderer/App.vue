<script setup>
import BlockEditor from './components/BlockEditor.vue'


window.electronAPI.sendMessage('Hello from App.vue');
//window.electronAPI.runHugo(['version']);

//window.electronAPI.readFromFile("output\\myFile.txt");
//window.electronAPI.writeToFile("hi", "output", "myFile.txt");

// (async () => {
//   const foo = await window.electronAPI.readFile("output\\myFile.txt")
//   window.electronAPI.sendMessage('Hello from App.vue ' + foo);
// })();



</script>

<template>
<main>
  <BlockEditor />
</main>
</template>

<style scoped>
</style>
