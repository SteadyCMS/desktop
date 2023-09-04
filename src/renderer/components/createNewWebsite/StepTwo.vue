<script setup>
  import { ref } from 'vue';

  defineEmits(['chooseTemplate']);

  // TODO: Make Sure they pick one

</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Choose a template.</h1>
      </div>
    </div>

    <div class="mt-8">
      <button class="py-10 px-10 border border-accent text-tint-10 text-sm font-bold rounded-lg" 
        @click="$emit('chooseTemplate', 'Paper', 'https://github.com/nanxiaobei/hugo-paper/archive/refs/heads/main.zip')">
        Paper
      </button>
    </div>
  </div>
</template>