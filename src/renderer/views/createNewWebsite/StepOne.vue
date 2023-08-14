<script setup>
import { ref } from 'vue';

const websiteName = ref('');




//localStorage.setItem('todo_items', JSON.stringify(this.todo_items));



</script>

<template>

  <div class="flex flex-col">
    <div class="w-full my-5 mx-8">
      <div class="flex flex-grow align-center justify-between">
        <h1 class="text-3xl text-dark font-bold">Choose a name for your website.</h1>
      </div>
    </div>
  
    <div class="flex flex-row items-center">
      <input type="text" 
        :model="websiteName"
        placeholder="Website name..."
        class="outline-none rounded-lg border-solid border-2 border-accent-dark 
        focus:border-accent text-lg py-2 px-4 mx-2 my-4" />
      </div>

  </div>

  </template>