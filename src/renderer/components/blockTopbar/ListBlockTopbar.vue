
<script setup>
  import listOL from '../icons/IconListUL.vue';
  import listUL from '../icons/IconListOL.vue';

const props =  defineProps(['item']);
defineEmits(['listStyleChanged'])

</script>

<template>
<div>
    <button @click="$emit('listStyleChanged', 'UL', props.item )" :class="{ 'bg-slate-100': props.item.listType == 'UL' }"
    class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
        <listOL class="fill-slate-600 w-5 h-5"  :class="{ 'fill-slate-800': props.item.listType == 'UL' }" />
    </button>

    <button @click="$emit('listStyleChanged', 'OL', props.item )" :class="{ 'bg-slate-100': props.item.listType == 'OL' }"
    class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
        <listUL class="fill-slate-600 w-5 h-5" :class="{ 'fill-slate-800': props.item.listType == 'OL' }" />
    </button>
</div>
</template>
