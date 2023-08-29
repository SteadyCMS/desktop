<script setup>
  import { ref } from 'vue';

  const webName = ref("")
  defineEmits(['onChange']);
  const props =  defineProps(['name', 'isvalid', 'errortext']);
  webName.value = props.name;

</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-grow align-center justify-between">
        <h1 class="text-4xl text-dark font-bold">Choose a name for your new website.</h1>
      </div>
    </div>
  
    <div class="flex flex-col mt-8">
      <input type="text" 
        v-model="webName"
        maxlength="40"
        @input="$emit('onChange', webName)"
        placeholder="Your website name"
        :class="{'border-red-500': !props.isvalid }"
        class="outline-none rounded-lg border-solid border-2 border-slate-200 focus:border-accent placeholder:text-slate-400 text-base py-3 px-4 max-w-md duration-300" />
      <small v-if="!props.isvalid" class="text-red-500 font-medium mx-4 mt-1"> 
        {{ props.errortext }}
      </small>
    </div>
  </div>
</template>