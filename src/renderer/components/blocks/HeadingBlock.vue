<script setup>
  import { ref } from 'vue';

  const props = defineProps(['item']);
  const emit = defineEmits(['onPressEnter', 'onBackspaceWhenEmpty']);

  function checkContent(){
    if (props.item.content == '') {
      emit('onBackspaceWhenEmpty');
    }
  }

</script>

<template>
  <input type="text"
    placeholder="Type heading..." 
    @keydown.enter.exact.prevent
    @keydown.enter.exact="$emit('onPressEnter', '')"
    @keydown.backspace.exact="checkContent()"
    v-focus="props.item.focus"
    v-model="props.item.content" 
    :class="{
     'text-[2.5rem]': (props.item.headingType == 'h2'),
     'text-[2rem]': (props.item.headingType == 'h3'),
     'text-[1.5rem]': (props.item.headingType == 'h4'),
     'text-[1.333rem]': (props.item.headingType == 'h5'),
     'text-[1rem]': (props.item.headingType == 'h6'),
     }"
    class="bg-white text-tint-10 outline-none border-0 border-none placeholder-tint-6 font-semibold w-full flex flex-grow"/>
</template>