
<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';



const router = useRouter()

function back() {
    router.go(-1);
}




</script>



<template>
    <div class="my-5 mx-8">
      <h1 class="text-3xl text-dark font-bold" @click="back">New Website</h1>
    </div>
  </template>