<script setup>
  import { ref, watch } from 'vue';
  import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3';

  import Gapcursor from '@tiptap/extension-gapcursor';
  import Dropcursor from '@tiptap/extension-dropcursor';
  import Document from '@tiptap/extension-document';
  import History from '@tiptap/extension-history';
  import Paragraph from '@tiptap/extension-paragraph';
  import Text from '@tiptap/extension-text';
  import Placeholder from '@tiptap/extension-placeholder';
  import Strike from '@tiptap/extension-strike';
  import Bold from '@tiptap/extension-bold';
  import Italic from '@tiptap/extension-italic';

  import BoldStyleIcon from '../icons/BoldStyleIcon.vue';
  import ItalicStyleIcon from '../icons/ItalicStyleIcon.vue';
  import StrikethroughStyleIcon from '../icons/StrikethroughStyleIcon.vue';

  const props = defineProps(['item', 'blocks']);
  const emit = defineEmits(['onPressEnter', 'onBackspaceWhenEmpty', 'onBackspaceJoin']);

  const isEnter = ref(false);
  const cursorPosition = ref(3);


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
      Placeholder.configure({
        placeholder: 'Type paragraph...',
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
          isEnter.value = true;
        } else if(event.key == "Backspace") {
          if (props.item.content == "" || props.item.content == "<p></p>") { // If the block is empty on backspace delete it
            emit('onBackspaceWhenEmpty');
          }else if(cursorPosition.value == 3){ // If they are at the start of the input...
            let index = props.blocks.indexOf(props.item);
            if(index > 0){ // & It's not the first block...
              if(props.blocks[index - 1].type == "paragraph"){ // & the above block is a paragraph, join the blocks
                emit('onBackspaceJoin', index);
              }
            }
          }
          isEnter.value = false;
        } else {
          isEnter.value = false;
        }
      },
      attributes: {
        class: 'focus:outline-none w-full h-full break-normal',
      },
      createSelectionBetween(view, anchor, head){  //TODO: Fix this
       if (props.item.content.match(/<p>/gi) != null) {
        cursorPosition.value = props.item.content.match(/<p>/gi).length + props.item.content.match(/<p>/gi).length + anchor.pos;
       }else{
        cursorPosition.value = anchor.pos;
       }
      },
    }
  });

  // Update focus
  watch(
    () => props.item.focus,
    (focus) => {
      if(focus){
        //editor.commands.focus('end');
        updateContent(); // And focus
      }else{
        editor.commands.blur();
      }
    }
  );

  function getContent() {
    let content = props.item.content.slice(cursorPosition.value);
    if(content != "/p>"){
      editor.commands.splitBlock();
      let content = props.item.content.split("</p>");
      editor.commands.setContent(content[0], false);
      return content[1];
    }else{
      // there is nothing to pass 
      return "";
    }
  }

    function updateContent() {
      if(props.item.content.match(/<p>/gi) != null){
        if (props.item.content.match(/<p>/gi).length == 2) {
          let x = editor.getHTML().length - 6;
          editor.commands.setContent(props.item.content.replace('</p><p>', ''), false);
          editor.commands.focus(x);
        }else{
          editor.commands.setContent(props.item.content, false);
          editor.commands.focus('end');
        }
      }
    }

</script>
<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    v-if="editor">
      <div class="bg-white shadow-lg rounded-full text-white flex flex-row p-1">
        <button class="p-1 rounded-full" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active bg-tint-1': editor.isActive('bold') }">
          <BoldStyleIcon class="w-5 h-5 fill-tint-7"/>
        </button>
        <button class="p-1 rounded-full" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active bg-tint-1': editor.isActive('italic') }">
          <ItalicStyleIcon class="w-5 h-5 fill-tint-7"/>
        </button>
        <button class="p-1 rounded-full" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active bg-tint-1': editor.isActive('strike') }">
          <StrikethroughStyleIcon class="w-5 h-5 fill-tint-7"/>
        </button>
      </div>
  </bubble-menu>

  <editor-content :editor="editor" @keydown.enter.exact="$emit('onPressEnter', getContent())" class="w-full text-tint-10"/>
</template>

<style>
/* Placeholder (at the top)  MUST HAVE! */
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #8fa3a8;
  pointer-events: none;
  height: 0;
}
  strong {
    font-weight: bold;
  }
</style>
