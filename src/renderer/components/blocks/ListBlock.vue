<script setup>
  import { ref, watch } from 'vue';
  import { Editor, EditorContent } from '@tiptap/vue-3';

  import Gapcursor from '@tiptap/extension-gapcursor'
  import Dropcursor from '@tiptap/extension-dropcursor'
  import Document from '@tiptap/extension-document'
  import History from '@tiptap/extension-history'
  import Paragraph from '@tiptap/extension-paragraph'
  import Text from '@tiptap/extension-text'

  import ListItem from '@tiptap/extension-list-item'
  import OrderedList from '@tiptap/extension-ordered-list'
  import BulletList from '@tiptap/extension-bullet-list'

  const props =  defineProps(['item']);
  const emit = defineEmits(['onPressEnter', 'onBackspaceWhenEmpty']);

  const onEnterOnce = ref(false);
  const isEndSelected = ref(false);
  const anchorPos = ref(10)

  const editor = new Editor({
    content: props.item.content,
    extensions: [
      Document,
      Paragraph,
      Text,
      History,
      Gapcursor,
      Dropcursor,
      ListItem,
      OrderedList,
      BulletList,
    ],
    autofocus: true,
    onUpdate({ editor }) {  
      props.item.content = editor.getHTML();

      // If they sleaced all the text and delete it reset the list
      if(props.item.content == '<p></p>'){ 
        if(props.item.listType == "UL"){
          editor.chain().focus().toggleBulletList().run()
        }else{
          editor.chain().focus().toggleOrderedList().run()
        }
      }
    },
    editorProps: {
      handleKeyDown(view, event) {
          if (event.key == "Enter") { // If they hit enter twice create new block
            if(onEnterOnce.value){ // Have they pressed enter once already (if so this is the second time)
              //console.log(isEndSelected.value);
              if(isEndSelected.value){
                editor.chain().focus().redo().run();
                emit('onPressEnter', "");
              }
              onEnterOnce.value = false;
            }else{
              onEnterOnce.value = true;
            }
          }else if(event.key == "Backspace"){ // If the block is empty on backspace delete it
            if(props.item.content == "<ul><li><p></p></li></ul>" || props.item.content == "<ol><li><p></p></li></ol>" || props.item.content == '<p></p>'){
              emit('onBackspaceWhenEmpty')
            }else if(anchorPos.value == 3){
              editor.chain().focus().undo().run();
            }
            onEnterOnce.value = false;
          }else{
            onEnterOnce.value = false;
          }
      },
      createSelectionBetween(view, anchor, head){
        // Checks if the corser is at the end of the block (Needs some work)
        anchorPos.value = anchor.pos;
        // console.log("-----------")
        // console.log("pod: " + (anchor.pos ))
        //console.log(props.item.content.replaceAll("<ul>", "").replaceAll("</ul>", "").replaceAll("<li>", "..").replaceAll("</li>", "").replaceAll("<p>", "..").replaceAll("</p>", "").length)
        let textLength = props.item.content.replaceAll("<ul>", "").replaceAll("</ul>", "").replaceAll("<li>", "..").replaceAll("</li>", "").replaceAll("<p>", "..").replaceAll("</p>", "").length;
        if(anchor.pos == textLength){
          isEndSelected.value = true;
        }else{
          isEndSelected.value = false;
        }
      },
      attributes: {
        class: 'focus:outline-none w-full h-full break-normal lists',
      },
    }
  });

  // Setup list when block is first made (UL)
  (() => {
    editor.chain().focus().toggleBulletList().run(); 
    // Fix a list bug
    if(props.item.content.startsWith("<p>")){
      let firstItem = props.item.content.match(/<p>[^<>]*<\/p>/g)[0];
      let html = '<li>' + firstItem + '</li>';
      let inner = props.item.content.replace(firstItem, '');
      editor.commands.setContent(inner.slice(0, 4) + html + inner.slice(4).replace("<p></p>", ""));
    }
  })();

  // Watch for when they change the list type (and change it)
  watch(
    () => props.item.listType,
    (listType) => {
      if(listType == "UL"){
        editor.chain().focus().toggleBulletList().run();
      }else{
        editor.chain().focus().toggleOrderedList().run();
      }
    }
  );

  // Update focus
  watch(
    () => props.item.focus,
    (focus) => {
      if(focus){
        editor.commands.focus('end');
      }else{
        editor.commands.blur();
      }
    }
  );

</script>
<template>
  <editor-content :editor="editor" class="w-full"/>
</template>

<style>
  ul {
    list-style-type: disc; 
    list-style-position: outside;
    padding: 0 1.5rem;
  }

  ol {
    list-style-type: decimal; 
    list-style-position: outside;
    padding: 0 1.5rem;
  }
</style>


<!-- 


  <ol><li><p>There is the setup</p></li></ol><ul><li><p>All the learning</p></li><li><p>building each thing</p></li><li><p>Fixing bugs (and there are always bugs)</p></li></ul><p></p>
 -->