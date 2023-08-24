<script setup>
 import { ref } from 'vue';

  const props = defineProps(['item']);

// h1 is 2 em
// h2 is 1.5 em
// h3 is 1.3 em
// h4 is 1 em
// h5 is 0.8 em
// h6 is 0.7 em

</script>

<template>
  <input type="text" 
    placeholder="Title..." 
    v-model="props.item.content" 
    :class="{
     'text-[2em]': (props.item.headingType == 'h1'),
     'text-[1.5em]': (props.item.headingType == 'h2'),
     'text-[1.3em]': (props.item.headingType == 'h3'),
     'text-[1em]': (props.item.headingType == 'h4'),
     'text-[0.83em]': (props.item.headingType == 'h5'),
     'text-[0.75em]': (props.item.headingType == 'h6'),
     }"
    class="mt-1 px-3 py-2 bg-white outline-none border-0 border-none text-xl placeholder-slate-400 w-full flex flex-grow"/>
</template>

