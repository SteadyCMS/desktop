<script setup>
import BlockEditorView from './components/BlockEditorView.vue'


window.electronAPI.sendMessage('Hello from App.vue');
//window.electronAPI.runHugo(['version']);

//window.electronAPI.readFromFile("output\\myFile.txt"); XXXXXX
//window.electronAPI.writeToFile("hi", "output", "myFile.txt");

// (async () => {
//   const foo = await window.electronAPI.readFile("output\\myFile.txt")
//   window.electronAPI.sendMessage('Hello from App.vue ' + foo);
// })();
















/*


  let blocks = ref([
    {
      type: "heading",
      content: "Putting Yahweh first",
      id: 60585449478,
      active: false,
      menu: false,
      headingType: "h3"
    },
    {
      type: "paragraph",
      content: "After hours of driving through Iowa, we came into Minnesota…just in time to wait. There we were with a low battery on our phone (which we were using for GPS), slowly creeping along the road with a long line of vehicles ahead of us. We had hit a construction standstill.",
      id: 73127606971,
      active: false,
      menu: false
    },
    {
      type: "image",
      caption: "A image of something",
      src: "",
      id: 51951226658,
      active: false,
      menu: false
    },
    {
      type: "list",
      content: "We live in a busy culture of work and pleasure. A “selfie” generation of people who only care about what they can get, how much they can get, how much people like them, and what would benefit them the most. As much as we would like to say that we are not one of those people, we are not perfect. Being self-less rather than self-ish is a difficult task.",
      id: 51951209688,
      active: false,
      menu: false
    },
  ]);


*/

    //let blocksData = blocks['_rawValue'];
    // let jsonData = JSON.stringify(blocks['_rawValue'], null, 4);
    // window.electronAPI.writeToFile(jsonData, "websites\\my-new-website\\content\\posts", "my-blog-post.json");


    // var data = "/* */ \n";
    // for (let i = 0; i < blocksData.length; i++) {

    //   switch(blocksData[i].type) {
    //   case "paragraph":
    //   data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
    //     break;
    //   case "heading":
    //     let ht =  blocks['_rawValue'][i].headingType + ">";
    //     data = data + "\n\n" + htmlToMarkdown( "<" + ht + blocksData[i].content + "</" + ht);
    //     break;
    //   case "list":
    //     data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
    //     break;
    //   case "image":
        
    //     break;
    //   default:
    //     data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
    // } 
    


    //     window.electronAPI.sendMessage(blocksData[i].type);
    // } 
    
    // window.electronAPI.writeToFile(data, "websites\\my-new-website\\content\\posts", "my-blog-post.markdown");


</script>

<template>
<main>
  <BlockEditorView />
</main>
</template>

<style scoped>
</style>
