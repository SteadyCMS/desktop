
<script setup>

const props =  defineProps(['item']);


function toolbarStlye(value){
        let toolbarType = [];

    switch(value.type) {
        case "paragraph":
            toolbarType = [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent       
                ['clean'] 
            ];
            break;
 
        case "list":
            toolbarType = [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }];
            break;

        default:
            toolbarType = ['bold', 'italic', 'underline'];
    } 
        // console.log(value.type)
        return toolbarType;
    }

</script>

<template>

        <QuillEditor v-model:content="props.item.content" :toolbar="toolbarStlye(props.item)" theme="bubble" toolbar="essential" placeholder="Write Here..." contentType="html"/>
  
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