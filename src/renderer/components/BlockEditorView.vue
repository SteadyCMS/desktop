<script setup>
  import {Drag, DropList} from "vue-easy-dnd";
  import { ref, computed } from 'vue';
  import TurndownService from 'turndown';
  //import Showdown from 'showdown';

  // Blocks
  import textEditor from './blocks/ParagraphBlockEditor.vue';
  import headerEditor from './blocks/HeaderBlockInput.vue';
  import imageBlock from './blocks/ImageBlockInput.vue';

  import header from './blockTopbar/HeaderBlockTopbar.vue';
  import paragraph from './blockTopbar/ParagraphBlockTopbar.vue';
  import image from './blockTopbar/ImageBlockTopbar.vue';

  // Icons
  import IconDragHandle from './icons/IconDragHandle.vue';
  import IconPlus from './icons/IconPlus.vue';
  import IconX from './icons/IconX.vue';

  // Var
  let overTopbar = false;
  let blockButton = false;
  const filterText = ref('');
  const pageTitle = ref('Untitled');

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


  const blockTypes = ref([
    {
      name: "heading",
      icon: "_",
      id: 1
    },
    {
      name: "paragraph",
      icon: "_",
      id: 2
    },
    {
      name: "image",
      icon: "_",
      id: 3
    },  
    {
      name: "list",
      icon: "_",
      id: 4
    },  
    {
      name: "other",
      icon: "_",
      id: 5
    },
  ]);

  const mainBlockTypes = {
    "paragraph": textEditor,
    "heading": headerEditor,
    "list": textEditor,
    "image": imageBlock,
  };

  const blockBarTypes = {
    "paragraph": paragraph,
    "heading": header,
    "list": header,
    "image": image,
  };


  // Load in blocks and data from json on start if they exsist
  //   (async () => {
  //   const exists = await window.electronAPI.doesFileExist("websites\\my-new-website\\content\\posts\\my-blog-post.json")
  //   window.electronAPI.sendMessage(exists);
  //   if(exists){
  //     const rawData = await window.electronAPI.readFile("websites\\my-new-website\\content\\posts\\my-blog-post.json")
  //     const data = JSON.parse(rawData);
  //     blocks.value = data['data']
  //   }
  // })();


  function addNewBlock(array, value, name) {
    let idNum =  Math.random().toString().slice(2,9).concat( Math.random().toString().slice(5,7)).concat( Math.random().toString().slice(4,6));
    console.log(value)

    if(value != 0){
    let index = array.indexOf(value);
    switch(name) {
      case "paragraph":
        array.splice(index + 1, 0,  { type: "paragraph", content: "", id: idNum, active: false, menu: false });
        break;
      case "heading":
        array.splice(index + 1, 0,  { type: "heading", content: "", id: idNum, active: false, menu: false, headingType: "h3" });
        break;
      case "list":
            
        break;
      case "image":
        array.splice(index + 1, 0,  { type: "image", caption: "", src: "", id: idNum, active: false, menu: false });
        break;

      default:
            
    } 
    openBlockBox(array, value, 'out')
  } else {
    array.splice(0, 0,  { type: "paragraph", content: "", id: idNum, active: false, menu: false });
  }
    console.log(blocks)
  }


  // Delete block
  function removeBlock(array, value) {
    let index = array.indexOf(value);
    array.splice(index, 1);
    overTopbar = false;
  }


  function insert1(event) {
    blocks.splice(event.index, 0, event.data);
  }

  function remove(array, value) {
    let index = array.indexOf(value);
    array.splice(index, 1);
  }

  // Cancel the close event when mouse is over the top bar
  function cancelCloseEvent(over) {
    overTopbar = over;
  }
  // Block the add button when add block box is open
  function blockAddButton(block) {
    blockButton = block;
  }

  function focusEditor(array, value, activeType) {
    if (!overTopbar) {
      if (activeType == "click") {
       // console.log("ON CLICK")
        for (let i = 0; i < array.length; i++) {
          array[i].active = false;
        } 
        let index = array.indexOf(value);
        if(index >= 0){
          array[index].active = true;
        }

      } else if (activeType == "out") {
        //console.log("ON OUT")
        for (let i = 0; i < array.length; i++) {
          array[i].active = false;
        } 
      }
   
    }

  }

  function htmlToMarkdown(html) {
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(html);
    return markdown;
  }

  // function markdownToHtml(markdown) {
  //   const converter = new Showdown.Converter();
  //   const html = converter.makeHtml(markdown);
  //   return html;
  // }

  function changeHeaderSize(size, value) {
    value.headingType = size;
  }

  // Open/Close the add new block box
  function openBlockBox(array, value, activeType) {
    if (activeType == "click") {
      if (!blockButton) {
        console.log("open")
        let index = array.indexOf(value);
        array[index].menu = true;
        // An event to tell if they click outside the dialog so we can close it
        var doClick = (event) => closeBoxOnOut(event, array, value); 
        document.addEventListener("mouseup", doClick);
      }
    } else {
      console.log("closed 1")
      for (let i = 0; i < array.length; i++) {
        array[i].menu = false;
      } 
      document.removeEventListener("mouseup", closeBoxOnOut);
      filterText.value = "";
    }
  }

  // Close the add new block box (with above)
  function closeBoxOnOut(e, array, value) {
    if (!blockButton) {
      console.log("closed 2")
      for (let i = 0; i < array.length; i++) {
        array[i].menu = false;
      } 
      document.removeEventListener("mouseup", closeBoxOnOut);
      focusEditor(array, value, 'out');
      filterText.value = "";
    }   
  }

  // Search function for the add blocks box
  const filteredBlocks = computed( () => {
    let filter = filterText.value
    if (!filter.length) return blockTypes.value
    return blockTypes.value.filter( poke => 
        poke.name.toLowerCase().includes(filter.toLowerCase())
    )
  })


  // Properties to be passed in for main blocks
  function currentblockproperties(_item) {
    let blockProperties = {};

    switch(_item.type) {
      case "paragraph":
        blockProperties = { item: _item };
        break;
      case "heading":
        blockProperties = { item: _item };
        break;
      case "list":
        blockProperties = { item: _item };
        break;
      case "image":
        blockProperties = { item: _item };
        break;
      default:
        blockProperties = { item: _item };
    } 
    return blockProperties;
  }

  // Properties to be passed in for blocks top bar
  function currentblockBarproperties(_item) {
    let blockProperties = {};

    switch(_item.type) {
      case "paragraph":
        blockProperties = { item: _item };
        break;
      case "heading":
        blockProperties = { item: _item };
        break;
      case "list":
        blockProperties = { item: _item };
        break;
      case "image":
        blockProperties = { item: _item };
        break;
      default:
        blockProperties = { item: _item };
    } 
    return blockProperties;
  }

  /*** Output Funcsions ***/

  // Convert to .json & .markdown
  function saveAsDraft() {

    saveJsonAndMarkdownToFile("-");

  }

  function makeSitePreview() {

  }


  function publishSite() {
    setupHugo()
    // 4. hugo server
    window.electronAPI.runHugo(['server', '-s', 'C:/Users/sundr/Documents/Projects/desktop/build/main/data/websites/my-new-website']);
    // 5. open in browser  http://localhost:1313

  window.electronAPI.openInBrowser('http://localhost:1313/post/my-blog-post');
  }

  function setupHugo() {
    // 1. [init hugo] like
    window.electronAPI.runHugo(['new', 'site', 'C:/Users/sundr/Documents/Projects/desktop/build/main/data/websites/my-new-website']);
    // 2. add theme they picked TODO (or git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke) (MUST have git)
    // 3. set hugo.toml TODO (or echo "theme = 'ananke'" >> hugo.toml)
    // TODO set up hugoToml
    let hugoToml = "baseURL = 'http://example.org/'\r\nlanguageCode = 'en-us'\r\ntitle = 'My New Hugo Site'\r\ntheme='stackt'";
    window.electronAPI.writeToFile(hugoToml, "websites\\my-new-website", "hugo.toml");

  }

  function saveJsonAndMarkdownToFile(title) {
    let blocksData = blocks['_rawValue'];

    // TODO: get and add date (set up all)
    let pageHead = '---\r\ndate: 2017-04-09T10:58:08-04:00\r\ndescription: "The Grand Hall"\r\nfeatured_image: "/images/Pope-Edouard-de-Beaumont-1844.jpg"\r\ntags: ["scene"]\r\ntitle: "Chapter I: The Grand Hall"\r\n---\r\n';
    
    let jsonData = JSON.stringify(blocks['_rawValue'], null, 4);
    window.electronAPI.writeToFile('{"data": ' + jsonData + '}', "websites\\my-new-website\\content\\post", "my-blog-post.json");

    var data = pageHead;
    for (let i = 0; i < blocksData.length; i++) {
      switch(blocksData[i].type) {
        case "paragraph":
        data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
          break;
        case "heading":
          let ht =  blocksData[i].headingType + ">";
          data = data + "\n\n" + htmlToMarkdown( "<" + ht + blocksData[i].content + "</" + ht);
          break;
        case "list":
          data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
          break;
        case "image":
          
          break;
        default:
          data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
      }
    } 
    window.electronAPI.writeToFile(data, "websites\\my-new-website\\content\\post", "my-blog-post.markdown");
  }

  // On enter create new paragraph block if called on paragraph or header
  function addNewBlockOnEnter(array, value, name){
    console.log("enter")
    if(name == "paragraph" || name == "header"){
      addNewBlock(array, value, name);
    }
  }


</script>


<template>
  <div class="flex flex-row">

    <div class="w-1/4 flex flex-col h-screen">
      <div class="h-10"></div>
      <div class="border-2 border-slate-200 rounded h-full"></div>
    </div>
  
    <div class="flex flex-col mt-8">

      <div class="flex flex-row">

        <textarea 
          @keydown.enter.exact.prevent
          @keydown.enter.exact="addNewBlockOnEnter(blocks, 0, 'header')"
          type="text" 
          placeholder="Add Post Title..." 
          v-model="pageTitle" 
          maxlength="72" 
          class="h-auto resize-none mt-1 
          px-3 py-2 block w-full mx-8 
          bg-white outline-none border-0
          border-none text-5xl 
          placeholder-slate-500 
          focus:placeholder-transparent 
          font-semibold 
          text-slate-700 break-words 
          text-center">
        </textarea>
      </div>
   

    <drop-list class="w-1/2 ms-10 me-10 mt-10" :items="blocks" @reorder="$event.apply(blocks)" @insert="insert1" mode="cut">
      <template v-slot:item="{item}">
        <drag @click="focusEditor(blocks, item, 'click')" 
          @focusout="focusEditor(blocks, item, 'out')" 
          @dragstart="focusEditor(blocks, item, 'out')" 
          :class="{ 'border-opacity-100': item.active }" 
          class="group relative flex flex-row border-b-2 border-x-2 m-2 border-slate-100 rounded-b border-opacity-0 px-2 pb-2" 
          :key="item.id" :data="item" 
          @cut="remove(items1, item)" 
          handle=".drag-handle">
          
          <!-- Block Top Bar -->
          <div @mouseover="cancelCloseEvent(true)" 
            @mouseleave="cancelCloseEvent(false)" 
            class="flex flex-row bg-white -top-12 -left-2.5 -right-2.5 
            h-10 border-t-2 border-x-2 mt-2 mx-2 border-slate-100 rounded-t px-2 pt-2" 
            :class="{ 'absolute': item.active, 'hidden':!item.active }">
            <div class="ml-1.5 flex grow justify-between">
              <!-- Top Bar Buttons -->
              <div class="flex space-x-1 items-center w-full">
                <span class="tracking-tight text-sm font-medium text-slate-700 uppercase mr-4">{{ item.type }}</span> 
                <component :is="blockBarTypes[item.type]" 
                  v-bind="currentblockBarproperties(item)" 
                  @size-changed="changeHeaderSize" 
                  :ref="'block_'+item.id" />
              </div>
              <!-- Delete (Right Side)-->
              <div class="flex items-center"> <!--TODO  Fix remove -->
                <button @click="removeBlock(blocks, item)" class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
                  <IconX class="fill-slate-600 w-5 h-5" />     
                </button> 
              </div>
            </div>
          </div> 
  
          <!-- Block Icons -->
          <div class="flex flex-col mt-4 " :class="{ 'visible':item.active, 'invisible':!item.active, 'group-hover:visible':!item.active }">
            <span class="drag-handle mb-1 hover:cursor-grab">
                <IconDragHandle class="w-8"/>
            </span>
            <span @click="openBlockBox(blocks, item, 'click')" class="add-button">
              <IconPlus class="w-8"/>
  
              <!-- Added Blocks Box -->
              <div class="relative flex">
                <div class="absolute w-50 max-h-60 bg-white z-30 -bottom-62 -left-4 
                  flex flex-col visible rounded-lg shadow-[0_5px_30px_-12px_rgba(0,0,0,0.45)]" 
                  @mouseover="cancelCloseEvent(true), blockAddButton(true)" 
                  @mouseleave="cancelCloseEvent(false), blockAddButton(false)"
                  :class="{'hidden':!item.menu }">
                  <input v-model="filterText" type="text" placeholder="Search Blocks..." 
                    class="m-3 outline-1 outline-slate-300 border-1 border-slate-400 p-2 rounded-sm" />
                  <div class="w-full h-full flex flex-col m-2 overflow-scroll">
                      <div v-for="(blockItems, i) in filteredBlocks" :key="i">
                        <span class="w-full flex flex-row" @click="addNewBlock(blocks, item, blockItems.name)">
                            {{ blockItems.icon }}
                          <span  class="text-base text-slate-600">
                            {{ blockItems.name }}
                          </span>
                        </span> 
                      </div>
                      <span v-if="!filteredBlocks.length" class="text-base text-slate-600 ml-1">No Blocks Found</span>
                  </div>
                </div>
              </div>
            </span>
          </div>
         
          <!-- Main Block getBlockType(item.type) -->
          <div class="flex flex-auto">
              <component :is="mainBlockTypes[item.type]" 
              v-bind="currentblockproperties(item)" 
              :ref="'block_'+item.id" 
              @on-press-enter="addNewBlockOnEnter(blocks, item, item.type)" />
          </div>
              
        </drag>
      </template>
      <template v-slot:feedback="{data}"></template>
    </drop-list>
   </div>
    <div class="w-1/3 flex flex-col h-screen">
      <div class="h-10">
      </div>    
      <div class="border-2 border-slate-200 rounded h-full">

        
        <button class="bg-blue-500 rounded p-2 m-2 text-white" @click="saveAsDraft">Save as Draft</button> <!-- Convert to .json & .markdown-->
        <button class="bg-blue-500 rounded p-2 m-2 text-white" @click="makeSitePreview">Preview</button> <!-- Do "Save as Draft" + run hugo and show -->
        <button class="bg-blue-500 rounded p-2 m-2 text-white" @click="publishSite">Publish (temp setup)</button> <!-- All above + Push to server -->
    
      </div>
    </div>
  
  </div>
</template>


<!--
// TODO:
On down space create new block
Resize header on change

Make Image block
Fix List block

Fix block (Other than paragraph) width *
Add style to add block box
Genral style fix >*
Decide what bottons we want on toolbar

# Other #
Set Window size

-->

