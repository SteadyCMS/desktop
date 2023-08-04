<script setup>

  import {Drag,DropList} from "vue-easy-dnd";
  import { ref, computed } from 'vue'
  import TurndownService from 'turndown';
  import Showdown from 'showdown';
  
  // blocks
  import textEditor from './blocks/textEditor.vue';
  import headerEditor from './blocks/headerEditor.vue';
  import imageBlock from './blocks/imageBlock.vue';

  import header from './topbar/header.vue';
  import paragraph from './topbar/paragraph.vue';
  import image from './topbar/image.vue';

  // Icons
  import dragHandleIcon from './icons/theDragHandleIcon.vue';
  import plusIcon from './icons/plusIcon.vue';
  import xSquareIcon from './icons/xSquareIcon.vue';

   // var
    let overTopbar = false;
    let blockButton = false;
    const filterText = ref('')

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

let blockTypes = ref([
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
}

const blockBarTypes = {
    "paragraph": paragraph,
    "heading": header,
    "list": header,
    "image": image,
}

// Save to Json in markdown blocks (loop and copy all to .markdown file for website builder)
// read the json into web blocks

function addNewBlock(array, value, name) {
            let index = array.indexOf(value);
            let idNum =  Math.random().toString().slice(2,9).concat( Math.random().toString().slice(5,7)).concat( Math.random().toString().slice(4,6));

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
            console.log(blocks)

    }


    // Delete block
    function removeBlock(array, value) {
        let index = array.indexOf(value);
        array.splice(index, 1);
    }


    function insert1(event) {
        blocks.splice(event.index, 0, event.data);
    }

    function remove(array, value) {
        let index = array.indexOf(value);
        array.splice(index, 1);
    }

    // Cancel the close event when mouse is over the top bar
    function cancelCloseEvent(over){
        overTopbar = over;
    }
    // Block the add button when add block box is open
    function blockAddButton(block){
        blockButton = block;
    }

    function focusEditor(array, value, activeType){
        if(!overTopbar){
            if(activeType == "click"){
                console.log("ON CLICK")
                for (let i = 0; i < array.length; i++) {
                    array[i].active = false;
                } 
                let index = array.indexOf(value);
                array[index].active = true;
            }else if(activeType == "out"){
                console.log("ON OUT")
                for (let i = 0; i < array.length; i++) {
                    array[i].active = false;
                } 

            }
            console.log("ON")
    }

        //console.log(htmlToMarkdown(markdownToHtml(value.content)))
    // console.log(markdownToHtml(value.content))
        // TODO disable all blocks not in uses
        // show buttons and border on active one
        // 

    }

    function htmlToMarkdown (html){
        const turndownService = new TurndownService()
        const markdown = turndownService.turndown(html)
    return markdown;
    }

    function markdownToHtml (markdown){
        const converter = new Showdown.Converter();
        const html = converter.makeHtml(markdown);
    return html;
    }


//     var data = {
//       name: "cliff",
//       age: "34",
//       name: "ted",
//       age: "42",
//       name: "bob",
//       age: "12"
//     }

// var jsonData = JSON.stringify(data);

// var fs = require('fs');
// fs.writeFile("test.txt", jsonData, function(err) {
//     if (err) {
//         console.log(err);
//     }
// });


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


    function changeHeaderSize(size, value){
        value.headingType = size;
    }

    // Open/Close the add new block box
    function openBlockBox(array, value, activeType){
        if(activeType == "click"){
            if(!blockButton){
                console.log("open")
                let index = array.indexOf(value);
                array[index].menu = true;
                // An event to tell if they click outside the dialog so we can close it
                var doClick = (event) => closeBoxOnOut(event, array, value); 
                document.addEventListener("mouseup", doClick);
            }
        }else{
            console.log("closed 1")
            for (let i = 0; i < array.length; i++) {
            array[i].menu = false;
            } 
            document.removeEventListener("mouseup", closeBoxOnOut)
            filterText.value = "";
        }
        
    }

    // Close the add new block box (with above)
    function closeBoxOnOut(e, array, value){
        if(!blockButton){
            console.log("closed 2")
            for (let i = 0; i < array.length; i++) {
            array[i].menu = false;
            } 
            document.removeEventListener("mouseup", closeBoxOnOut)
            focusEditor(array, value, 'out')
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

// this.$refs['sample-ref-1']


// Convert to .json & .markdown
function saveAsDraft(){

blocks


}









</script>

<template>
<div class="flex flex-row" >
<div class="w-1/4 flex flex-col h-screen">
    <div class="h-10"></div>
    <div class="border-2 border-slate-200 rounded h-full">
    </div>
</div>

<drop-list class="w-1/2 ms-10 me-10 mt-10" :items="blocks" @reorder="$event.apply(blocks)" @insert="insert1" mode="cut">
    <template v-slot:item="{item}">
        <drag @click="focusEditor(blocks, item, 'click')" @focusout="focusEditor(blocks, item, 'out')" @dragstart="focusEditor(blocks, item, 'out')"
        :class="{ 'border-opacity-100': item.active }" class="group relative flex flex-row border-b-2 border-x-2 m-2 border-slate-100 rounded-b border-opacity-0 px-2 pb-2" :key="item.id" :data="item" @cut="remove(items1, item)" handle=".drag-handle">
        
            <!-- Block Top Bar -->
            <div @mouseover="cancelCloseEvent(true)" @mouseleave="cancelCloseEvent(false)" class="flex flex-row bg-white -top-12 -left-2.5 -right-2.5 h-10 border-t-2 border-x-2 mt-2 mx-2 border-slate-100 rounded-t px-2 pt-2" 
                :class="{ 'absolute': item.active, 'hidden':!item.active }">
                <div class="ml-1.5 flex grow justify-between">

                    <!-- Top Bar Buttons -->
                    <div class="flex space-x-1 items-center">
                        <span class="tracking-tight text-sm font-medium text-slate-700 uppercase mr-4">{{ item.type }}</span> 
                        <component :is="blockBarTypes[item.type]" v-bind="currentblockBarproperties(item)" @size-changed="changeHeaderSize" :ref="'block_'+item.id" />
                    </div>

                    <!-- Delete (Right Side)-->
                    <div class="flex items-center"> <!--TODO  Fix remove -->
                        <button @click="removeBlock(blocks, item)" class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
                            <xSquareIcon class="fill-slate-600 w-5 h-5" />     
                        </button> 
                    </div>

                </div>
            </div> 

            <!-- Block Icons -->
            <div class="flex flex-col mt-4 " :class="{ 'visible':item.active, 'invisible':!item.active, 'group-hover:visible':!item.active }">
                <span class="drag-handle mb-1 hover:cursor-grab">
                    <dragHandleIcon class="w-8"/>
                </span>
                <span @click="openBlockBox(blocks, item, 'click')" class="add-button">
                    <plusIcon class="w-8"/>

                <!-- Added Blocks Box -->
                <div class="relative flex">
                    <div class="absolute w-50 max-h-60 bg-white z-30 -bottom-62 -left-4 flex flex-col visible rounded-lg shadow-[0_5px_30px_-12px_rgba(0,0,0,0.45)]" 
                    @mouseover="cancelCloseEvent(true), blockAddButton(true)" @mouseleave="cancelCloseEvent(false), blockAddButton(false)"
                    :class="{'hidden':!item.menu }">

                    <input  v-model="filterText" type="text" placeholder="Search Blocks..." class="m-3 outline-1 outline-slate-300 border-1 border-slate-400 p-2 rounded-sm" />
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
            <div class="w-full">
                <component :is="mainBlockTypes[item.type]" v-bind="currentblockproperties(item)" :ref="'block_'+item.id" />
            </div>
            
        </drag>
    </template>
        <template v-slot:feedback="{data}">
    </template>
</drop-list>
   
<div class="w-1/3 flex flex-col h-screen">
<div class="h-10">

<button @click="saveAsDraft">Save as Draft</button> <!-- Convert to .json & .markdown-->
<button @click="makeSitePreview">Preview</button> <!-- Do "Save as Draft" + run hugo and show -->
<button @click="publishSite">Publish</button> <!-- All above + Push to server -->

</div>    
<div class="border-2 border-slate-200 rounded h-full">
</div>
</div>

</div>
</template>


