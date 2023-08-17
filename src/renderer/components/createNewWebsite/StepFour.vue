<script setup>
  import { ref } from 'vue';

  const props =  defineProps(['websiteinfo']);

  /*
  - show loading page
  - download template / unzip / delete old zip
  - make dir
  - save web info as .json
  - set up .t file
  - 
  */
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-grow align-center justify-between">
        <h1 class="text-4xl text-dark font-bold">Website.</h1>
      </div>
    </div>

    <div class="mt-8">
      <p>Website name: {{ props.websiteinfo.website }}</p>
      <p>Template: {{ props.websiteinfo.template }}</p>
      <p>Output path: {{ props.websiteinfo.path }}</p>
    </div>

  </div>
</template>