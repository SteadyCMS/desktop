<script setup>
  const props =  defineProps(['item']);
</script>

<template>
  <input type="text" placeholder="Title..." v-model="props.item.content" class="mt-1 px-3 py-2 bg-white outline-none border-0 border-none text-xl placeholder-slate-400 w-full flex flex-grow "/>
</template>

<!--
<template>
<div class="flex">
  <textarea type="text" placeholder="Title..."  v-model="props.item.content"
  class="mt-1 px-3 py-2 bg-white outline-none border-0 border-none text-xl
   placeholder-slate-400 h-auto resize-none break-words w-full"></textarea>
</div>
</template>
-->
