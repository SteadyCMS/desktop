<script setup>
import { RouterLink, RouterView } from 'vue-router';
import BlockEditorView from './components/BlockEditorView.vue';
import LogoLight from './components/logos/LogoLight.vue';
import LogoMark from './components/logos/LogoMark.vue';
import IconThreeDots from './components/icons/IconThreeDots.vue';
import IconPosts from './components/icons/IconPosts.vue';
import IconPages from './components/icons/IconPages.vue';
import IconTags from './components/icons/IconTags.vue';
import IconArrowDown from './components/icons/IconArrowDown.vue';
import IconPlus from './components/icons/IconPlus.vue';

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

    <div class="h-screen w-1/3 lg:w-1/4 lg:max-w-xs bg-black px-8 py-6">
      
      <div class="flex justify-between mb-4">
        <LogoLight class="h-8 w-auto" />
        <button class="py-1.5 px-2 border border-black hover:border-gray-800 rounded-lg duration-300">
          <IconThreeDots class="w-4 h-4 fill-gray-400" />
        </button>
      </div>

      <div class="flex flex-row space-x-1 mb-8">
        <button class="flex flex-grow items-center justify-between px-4 py-2 rounded-lg border border-gray-800 hover:bg-accent-glow duration-300">
          <div class="flex items-center space-x-2">
            <LogoMark class="w-5 h-5 border border-gray-800 rounded" />
            <span class="text-white text-sm font-bold">Isaiah's Blog</span>
          </div>
          <IconArrowDown class="fill-gray-200 w-3 h-3" />
        </button>
        <button class="p-1.5 border border-gray-800 rounded-lg hover:bg-accent-glow duration-300">
          <IconPlus class="fill-white w-5 h-5" />
        </button>
      </div>

      <div class="text-white flex flex-col space-y-1">
        <RouterLink class="flex items-center bg-accent-glow rounded-lg px-4 py-2 text-accent fill-accent font-bold" to="/">
          <IconPosts class="w-4 h-4 mr-2" /> Posts
        </RouterLink>
        <RouterLink class="flex items-center rounded-lg px-4 py-2 text-gray-300 fill-gray-300 font-bold" to="/pages">
          <IconPages class="w-4 h-4 mr-2" /> Pages
        </RouterLink>
        <RouterLink class="flex items-center rounded-lg px-4 py-2 text-gray-300 fill-gray-300 font-bold" to="/tags">
          <IconTags class="w-4 h-4 mr-2" /> Tags
        </RouterLink>
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
