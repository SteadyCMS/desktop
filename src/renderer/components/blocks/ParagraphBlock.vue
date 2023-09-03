<script setup>
  import { ref } from 'vue';
  import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3';

  import Gapcursor from '@tiptap/extension-gapcursor'
  import Dropcursor from '@tiptap/extension-dropcursor'
  import Document from '@tiptap/extension-document'
  import History from '@tiptap/extension-history'
  import Paragraph from '@tiptap/extension-paragraph'
  import Text from '@tiptap/extension-text'
  import Placeholder from '@tiptap/extension-placeholder'
  import Strike from '@tiptap/extension-strike'
  import Bold from '@tiptap/extension-bold'
  import Italic from '@tiptap/extension-italic'
  import Code from '@tiptap/extension-code'

  const props =  defineProps(['item']);
  const emit = defineEmits(['onPressEnter', 'onBackspaceWhenEmpty']);

  const isEnter = ref(false);

  const editor = new Editor({
    content: props.item.content,
    extensions: [
      Document,
      Paragraph,
      Text,
      History,
      Gapcursor,
      Dropcursor,
      Strike,
      Bold,
      Italic,
      Code,
      Placeholder.configure({
        placeholder: 'Text here...',

      }),
    ],
    autofocus: true,
    onUpdate({ editor }) {  
      props.item.content = editor.getHTML();
      if (isEnter.value) {
        editor.commands.joinBackward();
        isEnter.value = false;
      }
    },
    editorProps: {
      handleKeyDown(view, event) {
          if (event.key == "Enter") { // On enter create a new block
            //console.log('enter');
            isEnter.value = true;
          }else if(event.key == "Backspace"){ // If the block is empty on backspace delete it
            //console.log('Backspace');
            if(props.item.content == "" || props.item.content == "<p></p>"){
              emit('onBackspaceWhenEmpty')
            }
            isEnter.value = false;
          }else{
            isEnter.value = false;
          }
      },
      attributes: {
        class: 'focus:outline-none w-full h-full break-normal',
      },
    }
  });

</script>
<template>

<bubble-menu
  :editor="editor"
  :tippy-options="{ duration: 100 }"
  v-if="editor">
    <div class="bg-[#444444] rounded-full text-white flex flex-row p-1">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        italic
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        strike
      </button>
    </div>
  </bubble-menu>

<editor-content :editor="editor" @keydown.enter.exact="$emit('onPressEnter')" class="w-full"/>


</template>

<style>
/* Placeholder (at the top)  MUST HAVE! */
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
