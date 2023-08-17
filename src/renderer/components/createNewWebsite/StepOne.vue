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
        <h1 class="text-4xl text-dark font-bold">Choose a name for your website.</h1>
      </div>
    </div>
  
    <div class="flex flex-col mt-10">
      <input type="text" 
        v-model="webName"
        @input="$emit('onChange', webName)"
        placeholder="Website name..."
        :class="{'border-red-600': !props.isvalid }"
        class="outline-none rounded-lg border-solid border-2 border-light-gray
        focus:border-accent text-base py-3 px-4 max-w-md" />

      <div v-if="!props.isvalid" class="text-red-600 text-sm font-medium mx-4 mt-2"> 
        {{ props.errortext }}
      </div>
    </div>
  </div>
</template>