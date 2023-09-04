<script setup>
  import { ref } from 'vue';

  const webName = ref("");
  defineEmits(['onChange']);
  const props =  defineProps(['name', 'isvalid', 'errortext']);
  webName.value = props.name;
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Choose a name for your new website.</h1>
      </div>
    </div>
  
    <div class="flex flex-col mt-8">
      <input type="text" 
        v-model="webName"
        maxlength="40"
        @input="$emit('onChange', webName)"
        placeholder="Your website name"
        :class="{'border-red-600': !props.isvalid }"
        class="outline-none rounded-lg border-solid border border-tint-2 focus:border-accent placeholder:text-tint-6 text-base py-3 px-4 max-w-md duration-300" />
      <small v-if="!props.isvalid" class="text-red-600 mx-4 mt-1"> 
        {{ props.errortext }}
      </small>
    </div>
  </div>
</template>