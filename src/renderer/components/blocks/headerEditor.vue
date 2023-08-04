
<script setup>

const props =  defineProps(['item']);

</script>

<template>
<input type="text" placeholder="Title..." v-model="props.item.content"
class="mt-1 px-3 py-2 block w-full bg-white outline-none border-0 border-none text-xl placeholder-slate-400"/>
</template>






