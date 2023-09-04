<script setup> 
  import { useRouter } from 'vue-router';
  import {Drag, DropList} from 'vue-easy-dnd';
  import { ref, computed, watch } from 'vue';
  import TurndownService from 'turndown';
  import { createToast } from 'mosha-vue-toastify';
  //import Showdown from 'showdown';

  import { writeToFile, openInBrowser, getPathTo, deleteFile, doesFileExist, readFileInAppDir, readFile } from '../utils/system.js'
  import { startServer, buildNewSite } from '../utils/hugo.js'
  import { titleToFileName, fileNameToTitle, siteToFolderName, getTodaysDate } from '../utils/utils.js'
  import { blockTypes, currentblockproperties, currentblockBarproperties } from '../utils/blockEditorData.js'

  // Blocks
  import ParagraphBlock from '../components/blocks/ParagraphBlock.vue';
  import HeadingBlock from '../components/blocks/HeadingBlock.vue';
  import ImageBlock from '../components/blocks/ImageBlock.vue';

  import header from '../components/blockTopbar/HeaderBlockTopbar.vue';
  import paragraph from '../components/blockTopbar/ParagraphBlockTopbar.vue';
  import image from '../components/blockTopbar/ImageBlockTopbar.vue';

  // Icons
  import IconDragHandle from '../components/icons/IconDragHandle.vue';
  import IconPlus from '../components/icons/IconPlus.vue';
  import IconX from '../components/icons/IconX.vue';
  import IconArrowLeft from '../components/icons/IconArrowLeft.vue';

  import { Dialog } from "../utils/DialogService.js";

  const router = useRouter();
 
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
      type: "heading",
      content: "Putting Yahweh first",
      id: 60585449478,
      active: false,
      menu: false,
      focus: false,
      headingType: "h3",
    },
    {
      type: "paragraph",
      content: "After hours of driving through Iowa, we came into Minnesota…just in time to wait. There we were with a low battery on our phone (which we were using for GPS), slowly creeping along the road with a long line of vehicles ahead of us. We had hit a construction standstill.",
      id: 73127606972,
      active: false,
      menu: false,
      focus: false,
    },
    // {
    //   type: "image",
    //   caption: "A image of something",
    //   src: "",
    //   id: 51951226658,
    //   active: false,
    //   menu: false
    // },
    {
      type: "list",
      content: "We live in a busy culture of work and pleasure. A “selfie” generation of people who only care about what they can get, how much they can get, how much people like them, and what would benefit them the most. As much as we would like to say that we are not one of those people, we are not perfect. Being self-less rather than self-ish is a difficult task.",
      id: 51951209688,
      active: false,
      menu: false,
      focus: false,
    },
    {
      type: "paragraph",
      content: "After hours of driving through Iowa, we came into Minnesota…just in time to wait. There we were with a low battery on our phone (which we were using for GPS), slowly creeping along the road with a long line of vehicles ahead of us. We had hit a construction standstill.",
      id: 73127606973,
      active: false,
      menu: false,
      focus: false,
    },
  ]);

  const mainBlockTypes = {
    "paragraph": ParagraphBlock,
    "heading": HeadingBlock,
    "list": ParagraphBlock,
    "image": ImageBlock,
  };

  const blockBarTypes = {
    "paragraph": paragraph,
    "heading": header,
    "list": header,
    "image": image,
  };
    
  (async () => {
    // Check if they are opening a post or creating a new one
    const currentPost = localStorage.getItem("activeSiteData_currentPost");
    websiteName.value = siteToFolderName(localStorage.getItem("activeSiteData_currentSite"));
    isDraft.value = localStorage.getItem("activeSiteData_iscurrentPostADraft");
    // If there editing load it else don't
    console.log(currentPost);
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

  function addNewBlock(array, value, name) {
    let idNum =  Math.random().toString().slice(2,9).concat( Math.random().toString().slice(5,7)).concat(Math.random().toString().slice(4,6));
    if (value != 0) {
      let index = array.indexOf(value);
      switch(name) {
        case "paragraph":
          array.splice(index + 1, 0,  { type: "paragraph", content: "", id: idNum, active: false, menu: false, focus: false, });
          break;
        case "heading":
          array.splice(index + 1, 0,  { type: "heading", content: "", id: idNum, active: false, menu: false, focus: false, headingType: "h3" });
          break;
        case "list":
              
          break;
        case "image":
          array.splice(index + 1, 0,  { type: "image", caption: "", src: "", id: idNum, active: false, menu: false, focus: false, });
          break;
        default:
              
      } 
      openBlockBox(array, value, 'out');
    } else {
      array.splice(0, 0, { type: "paragraph", content: "", id: idNum, active: false, menu: false, focus: false, });
    }
    console.log(blocks.value);
    focusEditor(array, value, 'click');
  }

  // Delete block
  function removeBlock(array, value, focusPreBlock) {
    let index = array.indexOf(value);
    array.splice(index, 1);
    overTopbar = false;

    // if(focusPreBlock){
    //   focusEditor(array, index - 1, 'click'); 
    // }
  }

  // function insert1(event) {
  //   console.log(event.index)
  //   console.log(event.data)
  //   blocks.splice(event.index, 0, event.data);
  // }

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
    if (!overTopbar) { // Only if the corser is not over the top bar
      if (activeType == "click") { // Focus the block they clicked on 
        for (let i = 0; i < array.length; i++) { // First blur them all (so we don't end up with two focused blocks)
          array[i].active = false;
        } 
        // if(typeof(value) == 'number'){ // This is to focus block in special circumstances (i.e it uses a number instead of a array value)
        //   array[value].active = true;

        //  // array[value + 1].focus = false;
        //   array[value].focus = true;
        // }else{ // Otherwise if the type is not a number this is a normal focus 
          let index = array.indexOf(value);
          if(index >= 0){ // Focus block
            array[index].active = true;
          }
        //}
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
      //console.log("closed 1")
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

  // On enter create new paragraph block if called on paragraph or header
  function addNewBlockOnEnter(array, value, name){
    if(name == "paragraph" || name == "heading"){
      //console.log("enter");
      addNewBlock(array, value, name);
      let index;
      if(value == 0){ // For the title
        index = 0;
      }else{
        index = array.indexOf(value);
      }
      // Focus new block and blur old
      array[index].focus = false;
      array[index + 1].focus = true;
    }
  }

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
    do {
      if(blocksData[i].type == "paragraph"){
        found = true;
        return blocksData[i].content.substr(0, 150).replace(/<[^>]+>/g, '').trim();
      }else{
        found = false;
      }
      i++;
    } while (found == false);  
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
    await writeToFile(data, "sites/" + websiteName.value + "/content/post", titleToFileName(pageTitle.value) + ".markdown");
  }

  function publishSite() {
    dialogState.value = true;
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
        @keydown.enter.exact="addNewBlockOnEnter(blocks, 0, 'heading')"
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
            
            <!-- Block Top Bar -->
            <div @mouseover="cancelCloseEvent(true)" 
              @mouseleave="cancelCloseEvent(false)" 
              class="flex flex-row bg-white -top-10 -left-2.5 -right-2.5 
              h-10 rounded-lg px-1 shadow-md" 
              :class="{ 'absolute': item.active, 'hidden':!item.active }">
              <div class="ml-1.5 flex grow justify-between">
                <!-- Top Bar Buttons -->
                <div class="flex space-x-1 items-center w-full">
                  <span class="text-sm font-medium text-tint-9 mr-4 capitalize">{{ item.type }}</span> 
                  <component :is="blockBarTypes[item.type]" 
                    v-bind="currentblockBarproperties(item)" 
                    @size-changed="changeHeaderSize" 
                    :ref="'block_'+item.id" />
                </div>
                <!-- Delete (Right Side)-->
                <div class="flex items-center"> 
                  <button @click="removeBlock(blocks, item, false)" class="hover:bg-tint-1 px-1 py-1 rounded-md duration-300">
                    <IconX class="fill-tint-8 w-5 h-5" />     
                  </button> 
                </div>
              </div>
            </div> 
    
            <!-- Block Icons -->
            <div class="flex flex-row" :class="{ 'visible':item.active, 'invisible':!item.active, 'group-hover:visible':!item.active }">
              <span @click="openBlockBox(blocks, item, 'click')" class="add-button cursor-pointer">
                <IconPlus class="w-6 fill-tint-7"/>
    
                <!-- Add Blocks Box -->
                <div class="relative flex">
                  <div class="absolute w-44 max-h-60 bg-white z-30 -bottom-62 -left-4 
                    flex flex-col visible rounded-lg shadow-lg" 
                    @mouseover="cancelCloseEvent(true), blockAddButton(true)" 
                    @mouseleave="cancelCloseEvent(false), blockAddButton(false)"
                    :class="{'hidden':!item.menu }">
                    <input v-model="filterText" type="text" placeholder="Filter" 
                      class="text-tint-10 m-2 text-base outline-1 outline-tint-2 border border-tint-2 px-2 py-1 rounded-md bg-tint-0" />
                    <div class="relative flex flex-col m-2 overflow-y-scroll">
                      <div v-for="(blockItems, i) in filteredBlocks" :key="i">
                        <span class="w-full flex flex-row py-0.5" @click="addNewBlock(blocks, item, blockItems.name)">
                            
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
              v-bind="currentblockproperties(item)" 
              :ref="item.id" 
              @on-press-enter="addNewBlockOnEnter(blocks, item, item.type)"
              @on-backspace-when-empty="removeBlock(blocks, item, true)"/>
            </div>
          </drag>
        
        </template>
        <template v-slot:feedback="{item}"></template>
      </drop-list>
    </div>
  </div>
</template>


<!--
// TODO:
On down space create new block
Resize header on change 1/2

Make Image block
Fix List block

Fix block (Other than paragraph) width *
Add style to add block box
Genral style fix >*
Decide what bottons we want on toolbar

# Other #
Set Window size
Add Word count
Keyboard short cuts
-->



<!-- 



Image, Video, 




 -->
