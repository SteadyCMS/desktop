<script setup>
  import { useRouter } from 'vue-router';

  import AccentButton from '../../components/buttons/AccentButton.vue';
  
  const router = useRouter();

  function goToBlockEditor() {
    router.push({path: '/editor'});
  }
</script>

<template>
  <div class="w-full my-4 mx-8">
    <div class="flex flex-grow align-center items-center justify-between mx-6">
      <h1 class="text-4xl text-dark font-bold">Posts</h1>
      <AccentButton text="Add Post" @click="goToBlockEditor" />
    </div>

    <div class="flex flex-col mt-12 space-y-2">

      <div class="rounded-lg cursor-pointer py-5 px-6 bg-slate-50 hover:bg-slate-100 duration-500">
        <div class="flex flex-row justify-between items-center">
          <h4 class="flex items-center text-xl text-dark font-bold">Sunshine and storm clouds <span class="text-sm text-slate-500 ml-1 font-bold">&mdash; Draft</span></h4>
          <span class="text-xs text-slate-500">Aug 17, 2023 5:12pm</span>
        </div>
        <p class="text-slate-500 text-sm mt-1 max-w-2xl truncate">Borders are a great way to distinguish two elements from one another, but using too many of them can make your design feel busy and cluttered.</p>
      </div>

    </div>
  </div>
</template>