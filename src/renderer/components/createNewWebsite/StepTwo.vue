<script setup>
import { ref } from 'vue';

defineEmits(['chooseTemplate']);

// TODO: Make Sure they pick one

</script>

<template>
  <div class="flex flex-col">
    <div class="w-full my-5 mx-8">
      <div class="flex flex-grow align-center justify-between">
        <h1 class="text-3xl text-dark font-bold">Choose a template for your website.</h1>
      </div>
    </div>

    <button class="py-2.5 px-6 bg-accent text-dark text-sm font-bold rounded-lg" 
          @click="$emit('chooseTemplate', 'Paper', 'https://github.com/nanxiaobei/hugo-paper/archive/refs/heads/main.zip')">Choose template "tester"</button>

          
  </div>

  </template>