<script setup>
import { ref } from 'vue';

const props =  defineProps(['websiteinfo']);

/*
 # show loading page
 - download template
 - make dir
 - save web info as .json
 - set up .t file
 - 
*/

</script>

<template>

    <div class="flex flex-col">
      <div class="w-full my-5 mx-8">
        <div class="flex flex-grow align-center justify-between">
          <h1 class="text-3xl text-dark font-bold"> Step Four Your Done.</h1>
        </div>
      </div>
  
  <p>website {{ props.websiteinfo.website }}</p>
  <p>template {{ props.websiteinfo.template }}</p>
  <p>path {{ props.websiteinfo.path }}</p>
  
  
  
  
    </div>
  
    </template>