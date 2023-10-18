<script setup> 
  import { useRouter } from 'vue-router';
  import {Drag, DropList} from 'vue-easy-dnd';
  import { ref, computed } from 'vue';
  import TurndownService from 'turndown';
  import { createToast } from 'mosha-vue-toastify';
  import { useGeneralStore } from '../stores/general.js'
  //import Showdown from 'showdown';

  import { writeToFile, openInBrowser, getPathTo, deleteFile, doesFileExist, readFileInAppDir, readFile } from '../utils/system.js'
  import { startServer, buildNewSite } from '../utils/hugo.js'
  import { titleToFileName, fileNameToTitle, siteToFolderName, getTodaysDate } from '../utils/utils.js'
  import { blockTypes, currentblockproperties, currentblockBarproperties } from '../utils/blockEditorData.js'

  // Blocks
  import ParagraphBlock from '../components/blocks/ParagraphBlock.vue';
  import HeadingBlock from '../components/blocks/HeadingBlock.vue';
  import ImageBlock from '../components/blocks/ImageBlock.vue';
  import ListBlock from '../components/blocks/ListBlock.vue';
  import QuoteBlock from '../components/blocks/QuoteBlock.vue';
  

  import header from '../components/blockTopbar/HeaderBlockTopbar.vue';
  import paragraph from '../components/blockTopbar/ParagraphBlockTopbar.vue';
  import image from '../components/blockTopbar/ImageBlockTopbar.vue';
  import list from '../components/blockTopbar/ListBlockTopbar.vue';

  // Icons
  import IconDragHandle from '../components/icons/IconDragHandle.vue';
  import IconPlus from '../components/icons/IconPlus.vue';
  import IconX from '../components/icons/IconX.vue';
  import IconArrowLeft from '../components/icons/IconArrowLeft.vue';
  import { storeToRefs } from "pinia";
  import { Dialog } from "../utils/DialogService.js";

  const router = useRouter();

  const generalStore = useGeneralStore();
  const { isCurrentPostDraft } = storeToRefs(generalStore);
  const { updateCurrentDaftStatus } = generalStore; 

 
  // Var
  let overTopbar = false;
  let blockButton = false;
  const filterText = ref('');
  const pageTitle = ref('');
  const titleAtPerview = ref("");
  const isFirstTime = ref(true);
  const websiteName = ref('');
  const isNotANewPost = ref(false);
  const isDraft = ref(true);

  let blocks = ref([
  {
        "type": "heading",
        "content": "All about our work",
        "id": "32369332045",
        "active": false,
        "menu": false,
        "focus": false,
        "headingType": "h3"
    },
    {
        "type": "paragraph",
        "content": "<p>This is test text. <strong>So much testing is needed to make this...</strong> Days and weeks of work... It is a big job.</p>",
        "id": "91466924419",
        "active": false,
        "menu": false,
        "focus": false
    },
    {
        "type": "list",
        "content": "<ul><li><p>There is the setup</p></li><li><p>All the learning</p></li><li><p>building each thing</p></li><li><p>Fixing bugs (and there are always bugs)</p></li></ul><p></p>",
        "id": "08249939654",
        "active": false,
        "menu": false,
        "focus": false,
        "listType": "UL"
    },
    {
        "type": "paragraph",
        "content": "<p>But over all it's really cool what you can do!</p>",
        "id": "98016553865",
        "active": false,
        "menu": false,
        "focus": false
    },
    {
        "type": "paragraph",
        "content": "<p>I would say to leave comments bellow, but we are still working  on that:)</p>",
        "id": "33169299101",
        "active": false,
        "menu": false,
        "focus": true
    },
    {
        "type": "paragraph",
        "content": "<p>After hours of driving through Iowa, we came into Minnesota…just in time to wait. There we were with a low battery on our phone (which we were using for GPS), slowly creeping along the road with a long line of vehicles ahead of us. We had hit a construction standstill.</p>",
        "id": "70610341484",
        "active": false,
        "menu": false,
        "focus": false
    },
    {
        "type": "quote",
        "content": "After hours of driving through Iowa, we came into Minnesota…just in time to wait. There we were with a low battery on our phone (which we were using for GPS), slowly creeping along the road with a long line of vehicles ahead of us. We had hit a construction standstill.",
        "author": "- El de Lasovain",
        "id": "70610341414",
        "active": false,
        "menu": false,
        "focus": false
    },
    
  ]);

  const mainBlockTypes = {
    "paragraph": ParagraphBlock,
    "heading": HeadingBlock,
    "list": ListBlock,
    "image": ImageBlock,
    "quote": QuoteBlock,
  };

  const blockBarTypes = {
    "paragraph": paragraph,
    "heading": header,
    "list": list,
    "image": image,
  };
    
  (async () => {
    // Check if they are opening a post or creating a new one
    const currentPost = localStorage.getItem("activeSiteData_currentPost");
    websiteName.value = siteToFolderName(localStorage.getItem("activeSiteData_currentSite"));
    isDraft.value = localStorage.getItem("activeSiteData_iscurrentPostADraft");
    // If there editing load it else don't
   // console.log(currentPost);
    if (currentPost != "newsteadycmspost") {
      isNotANewPost.value = true;
      pageTitle.value = fileNameToTitle(currentPost.replace('.markdown', ''));
      //Load in blocks and data to post from json on start if they exist
      readFile("sites/" + websiteName.value.toLocaleLowerCase() + "/content/post/" + currentPost.replace('.markdown', '.json')).then(fileData => {
        if (fileData.success) {
          const data = JSON.parse(fileData.data);
          blocks.value = data['data'];
        } else {
          console.log(fileData.data);
        }
      });
    }
  })();

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

  // FOR ACTIVE NOT FOCUS
  function focusEditor(array, value, activeType) {
    if (!overTopbar) { // Only if the corser is not over the top bar
      if (activeType == "click") { // Focus the block they clicked on 
        for (let i = 0; i < array.length; i++) { // First blur them all (so we don't end up with two focused blocks)
          array[i].active = false;
        } 
          let index = array.indexOf(value);
          if(index >= 0){ // Focus block
            array[index].active = true;
          }
      } else if (activeType == "out") { // Blur all blocks
        for (let i = 0; i < array.length; i++) {
          array[i].active = false;
        } 
      }
    }
  }

  function htmlToMarkdown(html) {
    const turndownService = new TurndownService({emDelimiter: '*'});
    turndownService.addRule('strikethrough', {
      filter: ['del', 's', 'strike'],
      replacement: function (content) {
        return '~~' + content + '~~'
      }
    });
    const markdown = turndownService.turndown(html);
    return markdown;
  }

  // function markdownToHtml(markdown) {
  //   const converter = new Showdown.Converter();
  //   const html = converter.makeHtml(markdown);
  //   return html;
  // }

  // For Block Topbars (Header)
  function changeHeaderSize(size, value) {
    value.headingType = size;
  }

  // For Block Topbars (List)
  function changeListStyle(type, value) {
    value.listType = type;
  }

  // Open/Close the add new block box
  function openBlockBox(array, value, activeType) {
    if (activeType == "click") {
      if (!blockButton) {
        let index = array.indexOf(value);
        array[index].menu = true;
        // An event to tell if they click outside the dialog so we can close it
        var doClick = (event) => closeBoxOnOut(event, array, value); 
        document.addEventListener("mouseup", doClick);
      }
    } else {
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
    return blockTypes.value.filter( x => 
        x.name.toLowerCase().includes(filter.toLowerCase())
    )
  });

  // When the uses trys to go back to dashboard
  function goToDashboard() {
    if(isNotANewPost.value){ // i.e Are they editing the post or is this a new one
      // TODO: If they are editing a published post ask if they want to publish their changes
      if(isDraft.value){// i.e Is it a draft or published post
      buildAndSavePostAs("save-draft").then(x => { 
        // TODO: show loading screen
        router.push({path: '/'});
      });
    }else{
      // Dialog({
      //   title: "Unpublished Changes!", 
      //   message: "Would you like to publish your changes? All unpublished changes will be lost.", 
      //   cancelText: 'Cancel', 
      //   onCancel: console.log("closedx"),
      //   acceptText: "Publish",
      //   onAccept: console.log("savex"),
      //   declineText: 'Discard',
      //   onDecline: console.log("deletex")});
      router.push({path: '/'});
    }
    } else { // If it's a new post
    //   Dialog({
    //     title: "Unsaved Changes!", 
    //     message: "Would you like to save your post? All unsaved changes will be lost.", 
    //     cancelText: 'Cancel', 
    //     acceptText: "Save",
    //     declineText: 'Delete',
    //     onCancel: () => {console.log("goodbye there")},
    //     onAccept: () => {console.log("save")},  
    //     onDecline: () => {console.log("delete")},
    // });
      router.push({path: '/'});
    }
  }

  function publishSite() {
        //console.log(websiteName.value)
        if (titleToFileName(pageTitle.value).length > 2) {
        // If they changed the title delete the old files with other title (not when editing a saved post)
        if(titleAtPerview.value != ""){
          if (titleAtPerview.value != pageTitle.value) {
            deleteFile("sites/" + websiteName.value + "/content/post/" + titleToFileName(titleAtPerview.value) + ".json");
            deleteFile("sites/" + websiteName.value + "/content/post/" + titleToFileName(titleAtPerview.value) + ".markdown");
            titleAtPerview.value = pageTitle.value;
          }
        }
        // TODO: IF they are updating a post skip this step (doesFileExist)
        // Make sure they don't already have a post with this name
        doesFileExist("sites/" + websiteName.value + "/content/post/" + titleToFileName(pageTitle.value) + ".json").then(fileExsits => {

        // TODO: Improve this
        const runbuild = ref(true);
        if (fileExsits) { // If there is a file with the same name
          if (isFirstTime.value == true) { // if this is the first time runinng perview 
            if(isNotANewPost.value){ // i.e Are editing a post or creating a new one
              runbuild.value = true;
            }else{
              runbuild.value = false;
            }
          }else{ // if this is NOT the first time runinng perview 
            runbuild.value = true;
          }
        }else{ // If there is NOT a file with the same name
          runbuild.value = true;
        }

        if(runbuild.value){ // If this is the first time pervining they can't use a name of a post
          buildAndSavePostAs("published").then(x => { 
            getPathTo('documents').then(path => { 
              buildNewSite(path + "/steadyCMS/sites/" + websiteName.value);
              isDraft.value = false;
              console.log("done");
              //startServer('8080', path + "/steadyCMS/sites/" + websiteName.value);
              //openInBrowser('http://localhost:8080/post/' + titleToFileName(pageTitle.value) + '/');
              titleAtPerview.value = pageTitle.value;
              isFirstTime.value = false;
            });
          });
        }else{
          // The title is not unique
          showWarningToast({ title: 'Post title must be unique', description: 'You already have a post with this title.'});
        }
      });
    }else{
      // The title is too short
      showWarningToast({ title: 'Problem with title', description: 'Title must have more than 2 letters.'});
    }
  }

  function previewPost() {
    //console.log(websiteName.value)
    if (titleToFileName(pageTitle.value).length > 2) {
        // If they changed the title delete the old files with other title (not when editing a saved post)
        if(titleAtPerview.value != ""){
          if (titleAtPerview.value != pageTitle.value) {
            deleteFile("sites/" + websiteName.value + "/content/post/" + titleToFileName(titleAtPerview.value) + ".json");
            deleteFile("sites/" + websiteName.value + "/content/post/" + titleToFileName(titleAtPerview.value) + ".markdown");
            titleAtPerview.value = pageTitle.value;
          }
        }
        // TODO: IF they are updating a post skip this step (doesFileExist)
        // Make sure they don't already have a post with this name
        doesFileExist("sites/" + websiteName.value + "/content/post/" + titleToFileName(pageTitle.value) + ".json").then(fileExsits => {

        // TODO: Improve this
        const runbuild = ref(true);
        if (fileExsits) { // If there is a file with the same name
          if (isFirstTime.value == true) { // if this is the first time runinng perview 
            if(isNotANewPost.value){ // i.e Are editing a post or creating a new one
              runbuild.value = true;
            }else{
              runbuild.value = false;
            }
          }else{ // if this is NOT the first time runinng perview 
            runbuild.value = true;
          }
        }else{ // If there is NOT a file with the same name
          runbuild.value = true;
        }

        if(runbuild.value){ // If this is the first time pervining they can't use a name of a post
          buildAndSavePostAs("preview-draft").then(x => { 
            getPathTo('documents').then(path => { 
             // buildNewSite(path + "/steadyCMS/sites/" + websiteName.value);

              startServer('8080', path + "/steadyCMS/sites/" + websiteName.value);
              openInBrowser('http://localhost:8080/post/' + titleToFileName(pageTitle.value) + '/');
              titleAtPerview.value = pageTitle.value;
              isFirstTime.value = false;
            });
          });
        }else{
          // The title is not unique
          showWarningToast({ title: 'Post title must be unique', description: 'You already have a post with this title.'});
        }
      });
    }else{
      // The title is too short
      showWarningToast({ title: 'Problem with title', description: 'Title must have more than 2 letters.'});
    }
  }

  const showWarningToast = (message) => {
    createToast(message, {type: 'warning', /* toastBackgroundColor: 'color',*/ showCloseButton: true, swipeClose: true, transition: 'slide', showIcon: false, position: 'top-right'})
  }

  // Get 150 characters of the first paragraph for a post description
  function getPostDescription(blocksData) {
    let found;
    let i = 0;
    if(blocksData.length > 0){
    do {
      if(blocksData[i].type == "paragraph"){
        found = true;
        return blocksData[i].content.substr(0, 150).replace(/<[^>]+>/g, '').trim();
      }else{
        found = false;
      }
      i++;
    } while (found == false);  
  }else{
    return '';
  }
  }

  // Convert blocks to markdown and json
  async function buildAndSavePostAs(buildType){
    const blocksData = blocks['_rawValue'];
    const buildTypeSettings = ref({})

    switch (buildType) {
      case 'published': // Build as pubished post (render = "always" & draft = "false")
      buildTypeSettings.value = {
      'isDraft': false,
      'render': 'always',
      }
        break;
      case 'preview-draft': // Build as a draft for previewing (render = "always" & draft = "false")
      buildTypeSettings.value = {
      'isDraft': false,
      'render': 'always',
      }
        break;
      case 'save-draft': // Build as a draft for saving (render = "never" & draft = "true")
      buildTypeSettings.value = {
      'isDraft': true,
      'render': 'never',
      }
        break;
      default:
      buildTypeSettings.value = {
      'isDraft': false,
      'render': 'always',
      }
      console.log("Error: Using default [buildAndSavePost: BlockEditorVue.vue]")
        break;
    }

    let postDescription = getPostDescription(blocksData);
    let featuredImage = "/images/Pope-Edouard-de-Beaumont-1844.jpg";
    let postTages = '"scene", "fun", "time"';
  
    // TODO: Don't change date on update
    let pageHead = `---\r\ndate: ${getTodaysDate()} \r\ndescription: "${postDescription}"\r\nfeatured_image: "${featuredImage}"\r\ntags: [${postTages}]\r\ntitle: "${pageTitle.value}"\r\ndraft: ${buildTypeSettings.value.isDraft}\r\n_build:\r\n  render: ${buildTypeSettings.value.render}\r\n  list: ${buildTypeSettings.value.render}\r\n---\r\n`;

    // Save as Json
    let jsonData = JSON.stringify(blocks['_rawValue'], null, 4);
    await writeToFile('{"data": ' + jsonData + '}', "sites/" + websiteName.value + "/content/post", titleToFileName(pageTitle.value) + ".json");

    // Save as markdown
    var data = pageHead;
    for (let i = 0; i < blocksData.length; i++) {
      switch(blocksData[i].type) {
        case "paragraph":
        data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
          break;
        case "heading":
          let ht =  blocksData[i].headingType + ">";
          data = data + "\n\n" + htmlToMarkdown( `<${ht}${blocksData[i].content}</${ht}`);
          break;
        case "list":
          data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
          break;
        case "image":
          
          break;
        case "quote":
          data = data + "\n\n" + htmlToMarkdown(`<blockquote>${blocksData[i].content}</br>${blocksData[i].author}</blockquote>`);
          break;
        default:
          data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
      }
    } 
    await writeToFile(data, "sites/" + websiteName.value + "/content/post", titleToFileName(pageTitle.value) + ".markdown");
  }

  function addNewBlock(array, value, name) {
    let idNum =  Math.random().toString().slice(2,9).concat( Math.random().toString().slice(5,7)).concat(Math.random().toString().slice(4,6));
    if (value != 0) {
      let index = array.indexOf(value);
      switch(name) {
        case "paragraph":
          array.splice(index + 1, 0,  { type: "paragraph", content: "", id: idNum, active: false, menu: false, focus: false });
          break;
        case "heading":
          array.splice(index + 1, 0,  { type: "heading", content: "", id: idNum, active: false, menu: false, focus: false, headingType: "h3" });
          break;
        case "list":
          array.splice(index + 1, 0,  { type: "list", content: "", id: idNum, active: false, menu: false, focus: false, listType: "UL" });
          break;
        case "image":
          array.splice(index + 1, 0,  { type: "image", caption: "", src: "", id: idNum, active: false, menu: false, focus: false });
          break;
        case "quote":
          array.splice(index + 1, 0,  { type: "quote", content: "", author: "", id: idNum, active: false, menu: false, focus: false });
          break;
          
        default:
          
      } 
      openBlockBox(array, value, 'out');
      setBlockFocus(array, index + 1);
    } else {
      array.splice(0, 0, { type: "paragraph", content: "", id: idNum, active: false, menu: false, focus: false, });
    }
    console.log(blocks.value);
    focusEditor(array, value, 'click');
   
  }

  // Delete a block By it's item
  function deleteBlockByItem(blocksArray, blockItem, focusPerviousBlock) {
    let index = blocksArray.indexOf(blockItem);
    blocksArray.splice(index, 1);
    overTopbar = false;
    if(focusPerviousBlock){
      setBlockFocus(blocksArray, index - 1);
    }
  }

  // Delete a block By it's index
  function deleteBlockByIndex(blocksArray, blockIndex, focusPerviousBlock) {
    blocksArray.splice(blockIndex, 1);
    overTopbar = false;
    if(focusPerviousBlock){
      setBlockFocus(blocksArray, blockIndex - 1);
    }
  }

  function setBlockFocus(blocksArray, BlockIndex){
    for (let i = 0; i < blocksArray.length; i++) { // Clear all focus
      blocksArray[i].focus = false;
    } 
    if(BlockIndex >= 0){ // Focus the block
      blocksArray[BlockIndex].focus = true;
    }
  }

  // function joinBlockWithPervious(blocksArray, content, blockIndex){
  //   console.log( blocksArray[blockIndex - 1].content)
  //   deleteBlockByIndex(blocksArray, blockIndex, true);
  // }

  // On enter create new block with setup config
  function addNewBlockWithSetup(blocksArray, blockItem, blockType, passedContent){
    if(blockType == "paragraph" || blockType == "heading" || blockType == "list" || blockType == "quote"){
      addNewBlock(blocksArray, blockItem, "paragraph");
      let index;
      if(blockItem == 0){ // For the title
        index = 0;
      }else{
        index = blocksArray.indexOf(blockItem);
      }
      // If there is content to be passed in pass it
      if (passedContent != "") {
        blocksArray[index + 1].content = passedContent;
      }
      // Focus new block and blur old 
      if(index > 0){
        blocksArray[index].focus = false;
        blocksArray[index + 1].focus = true;
      }
    }
  }
</script>

<template>
  <div class="relative">
    <!-- Topbar -->
    <div class="flex flex-row max-w-7xl py-2 items-center justify-between mx-auto">
      <div class="flex flex-row items-center">
        <button @click="goToDashboard" class="flex items-center py-2 pl-6 pr-4 text-sm font-medium text-tint-10 hover:text-tint-9 duration-500">
          <IconArrowLeft class="w-2 h-2 mr-1 fill-tint-9" /> Posts
        </button>
        <p class="text-tint-7 text-sm font-medium">Draft</p>
      </div>
      <div class="flex flex-row items-center space-x-1">
        <button @click="previewPost" class="py-2 px-6 text-sm font-medium text-tint-10 hover:text-tint-9 duration-500">
          Preview
        </button>
        <button @click="publishSite" class="py-2 px-6 text-sm font-medium bg-accent rounded-lg">
          Publish
        </button>
      </div>
    </div>

    <div class="flex flex-row mt-2">
      <!-- TODO: allow editing title -->
      <textarea
        :disabled="isNotANewPost ? true : null"
        @keydown.enter.exact.prevent
        @keydown.enter.exact="addNewBlockWithSetup(blocks, 0, 'heading', '')"
        type="text" 
        placeholder="Add title" 
        v-model="pageTitle" 
        maxlength="72"
        class="h-auto resize-none mt-1 
        px-3 py-2 block w-full mx-8 
        bg-white outline-none border-0
        border-none text-5xl 
        placeholder-tint-6 
        focus:placeholder-transparent 
        font-semibold 
        text-tint-10 break-words 
        text-center">
      </textarea>
    </div>

    <div class="flex flex-row mt-5">
      <drop-list class="w-1/2 mx-auto" :items="blocks" @reorder="$event.apply(blocks)" mode="cut">
        <template v-slot:item="{item}">
          <drag @click="focusEditor(blocks, item, 'click')" 
            @focusout="focusEditor(blocks, item, 'out')" 
            @dragstart="focusEditor(blocks, item, 'out')"
            @cut="remove(blocks, item)" 
            :class="{ 'border-opacity-100': item.active }" 
            class="group relative flex flex-row border-slate-100 px-2 pb-6" 
            :key="item.id" 
            :data="item" 
            handle=".drag-handle">
            
            <!-- Block Topbar -->
            <div @mouseover="cancelCloseEvent(true)" 
              @mouseleave="cancelCloseEvent(false)" 
              class="flex flex-row bg-white -top-10 left-0 right-0 rounded-lg px-1 shadow-md" 
              :class="{ 'absolute': item.active, 'hidden':!item.active }">
              <div class="ml-1.5 flex grow justify-between">
                <!-- Topbar Buttons -->
                <div class="flex space-x-1 items-center w-full">
                  <span class="text-sm font-medium text-tint-9 mr-3 py-2 capitalize">{{ item.type }}</span> 
                  <component :is="blockBarTypes[item.type]" 
                    v-bind="currentblockBarproperties(item)" 
                    @size-changed="changeHeaderSize"
                    @list-style-changed="changeListStyle"
                    :ref="'block_'+item.id" />
                </div>
                <!-- Delete (Right Side)-->
                <div class="flex items-center"> 
                  <button @click="deleteBlockByItem(blocks, item, false)" class="hover:bg-tint-1 px-1 py-1 rounded-md duration-300">
                    <IconX class="fill-tint-8 w-5 h-5" />     
                  </button> 
                </div>
              </div>
            </div> 
    
            <!-- Block Icons -->
            <div class="flex flex-row" :class="{ 'visible':item.active, 'invisible':!item.active, 'group-hover:visible':!item.active }">
              <span @click="openBlockBox(blocks, item, 'click')" class="add-button">
                <span class="cursor-pointer">
                  <IconPlus class="w-6 fill-tint-7"/>
                </span>
                <!-- Add blocks menu -->
                <div class="relative flex">
                  <div class="absolute w-44 max-h-44 bg-white z-30 -bottom-62 left-0 
                    flex flex-col visible rounded-lg shadow-lg" 
                    @mouseover="cancelCloseEvent(true), blockAddButton(true)" 
                    @mouseleave="cancelCloseEvent(false), blockAddButton(false)"
                    :class="{'hidden':!item.menu }">
                    <input v-model="filterText" type="text" placeholder="Filter blocks" 
                      class="text-tint-10 m-2 text-base outline-1 outline-tint-2 border border-tint-2 px-2 py-1 rounded-md bg-tint-0 placeholder:text-tint-6" />
                    <div class="relative flex flex-col m-2 overflow-y-scroll">
                      <div v-for="(blockItems, i) in filteredBlocks" :key="i">
                        <span class="w-full flex flex-row py-1 px-2 cursor-pointer hover:bg-tint-1 duration-500 rounded-md" @click="addNewBlock(blocks, item, blockItems.name)">
                          <span class="text-base text-tint-10 capitalize">
                            {{ blockItems.name }}
                          </span>
                        </span> 
                      </div>
                      <span v-if="!filteredBlocks.length" class="text-base text-slate-600 ml-1">No Blocks Found</span>
                    </div>
                  </div>
                </div>
              </span>
              <span class="drag-handle mr-1 hover:cursor-grab">
                <IconDragHandle class="w-6 fill-tint-7"/>
              </span>
            </div>
          
            <!-- Main Block getBlockType(item.type) -->
            <div class="flex flex-auto">
              <component :is="mainBlockTypes[item.type]" 
              v-bind="currentblockproperties(item, blocks)" 
              :ref="item.id" 
              @on-press-enter="(content) => {addNewBlockWithSetup(blocks, item, item.type, content);}"
              @on-backspace-when-empty="deleteBlockByItem(blocks, item, true)"
              @on-backspace-join="(blockIndex) => {deleteBlockByIndex(blocks, blockIndex, true);}"/>
            </div>
          </drag>
        </template>
        <template v-slot:feedback="{item}"></template>
      </drop-list>
    </div>
  </div>
</template>


<!-- 
  TODO:
WITH BLOCKS:
- On list . doesn't show always (has <p> instead of list)

With Block Editor:
Fix dialog
Make Image block + Media library

Other:
Add template chooser
Fix downloder
Add Site publishing
If website is deleted and is the current don't show it
-->



