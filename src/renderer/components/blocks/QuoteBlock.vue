<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps(['item']);
  const emit = defineEmits(['onPressEnter', 'onBackspaceWhenEmpty']);
  const inputField = ref();
  const authorInput = ref();
  const inputText = ref(props.item.content);
  const inputAuthor = ref(props.item.author);

  function checkContentOnBackspace(){
    if (props.item.content == '') {
      emit('onBackspaceWhenEmpty');
    }
  }

  function OnPressEnter(isAuther) {
   // if(isAuther){
      emit('onPressEnter', '');
    // }else{
    //   inputField.value.blur();
    //   authorInput.value.focus();
    // }
  }

  function updateOnChange() {
    props.item.content = inputField.value.innerHTML;
    props.item.author =  inputAuthor.value;
  }

</script>
<template>
  <blockquote class="text-base italic block ml-2 mr-2 mt-2 
  mb-2 pl-6 border-l-4 border-slate-950 w-full">
  <div type="text" 
      data-placeholder="Type Quote..."
      ref="inputField"
      v-focus="props.item.focus"
      contenteditable="true"
      @keydown.backspace.exact="checkContentOnBackspace()"
      @input="updateOnChange()"
      placeholder="Type Quote..."
      class="h-auto resize-none block w-full
      bg-white outline-none border-0
      border-none text-base
      placeholder-tint-6 
      focus:placeholder-transparent
      text-tint-10 break-words">
      {{ inputText }}
  </div>

  <input type="text"
    ref="authorInput"
    placeholder="Type Author (optional)..." 
    @keydown.enter.exact.prevent
    @keydown.enter.exact="OnPressEnter(true)"
    @change="updateOnChange()"
    v-model="inputAuthor" 
    class="bg-white text-tint-10 outline-none border-0 border-none 
    placeholder-tint-6 w-full flex flex-grow mt-1 text-base italic ml-2 "/>

</blockquote>
</template>
<style scoped>
  [contenteditable] {
    padding: 10px;
  }

  [data-placeholder]:empty:before{
    content: attr(data-placeholder);
    color: #888;
    font-style: italic;
  }
</style>
