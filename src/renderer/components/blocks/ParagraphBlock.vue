<script setup>
  import { ref } from 'vue';

  const props =  defineProps(['item']);
  defineEmits(['onPressEnter']);

  function toolbarStyle(value){
    let toolbarType = [];

    switch(value.type) {
      case "paragraph":
        toolbarType = [
          ['bold', 'italic', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'], 
          ['clean'] 
        ];
        break;
      case "list":
        toolbarType = [{ 'list': 'ordered' }, { 'list': 'bullet'} ];
        break;
      default:
        toolbarType = ['bold', 'italic', 'underline'];
    } 
    // console.log(value.type)
    return toolbarType;
  }

// const quillEditor = ref();
// function onQuillReady() {

//     quillEditor.keyboard.bindings[13].unshift({
//     key: 13,
//     handler: (range, context) => {
//         console.log('jjjj')

//         if (this.popupVisible) {
//             return false;
//         }
//         return true;
//     }
// });


// focus editor when it is ready
//quillEditor.value.getQuill().blur();
//}



</script>

<template>
  <QuillEditor v-model:content="props.item.content" 
    :toolbar="toolbarStyle(props.item)"
    @keydown.enter.exact.prevent
    @keydown.enter.exact="$emit('onPressEnter')"
    ref="quillEditor"
    theme="bubble" 
    placeholder="Write Here..." 
    contentType="html"/>
</template>



<!--  'toolbar': [
[{ 'font': [] }, { 'size': [] }],
[ 'bold', 'italic', 'underline', 'strike' ],
[{ 'color': [] }, { 'background': [] }],
[{ 'script': 'super' }, { 'script': 'sub' }],
[{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
[{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
[ 'direction', { 'align': [] }],
[ 'link', 'image', 'video', 'formula' ],
[ 'clean' ]
]-->