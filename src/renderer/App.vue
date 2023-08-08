<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BlockEditorView from './components/BlockEditorView.vue'


window.electronAPI.sendMessage('Hello from App.vue');
//window.electronAPI.runHugo(['version']);
//window.electronAPI.writeToFile("hi", "output", "myFile.txt");

// (async () => {
//   const foo = await window.electronAPI.readFile("output\\myFile.txt")
//   window.electronAPI.sendMessage('Hello from App.vue ' + foo);
// })();

//  <BlockEditorView />
</script>

<template>
<main> <!-- 
  <header>
    <nav>
        <RouterLink to="/">main</RouterLink>
        <RouterLink to="/test">test</RouterLink>
    </nav>
  </header> --> 



  <BlockEditorView />

 <!-- 
<RouterView />
 --> 
 
</main>
</template>

<style scoped>
</style>
