<script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter()
  function back() {
    router.go(-1);
  }
</script>

<template>
  <div class="my-5 mx-8">
    <h1 class="text-3xl text-tint-10 font-bold" @click="back">Sorry, Not Found!</h1>
  </div>
</template>