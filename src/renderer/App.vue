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
<main> 


  <div class="flex flex-row">

    <div class=" h-screen w-1/4 bg-slate-950">

        <div class="text-white flex flex-col">
            <RouterLink class="bg-" to="/">Posts</RouterLink>
            <RouterLink to="/pages">Pages</RouterLink>
        </div>
 

    </div>

    <div class="flex h-screen w-3/4">
      <RouterView />
    </div>

  </div>
  


   <!--  <BlockEditorView />  -->



</main>
</template>

<style scoped>
</style>
