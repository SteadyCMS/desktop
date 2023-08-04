
<script setup>
  import h1Icon from '../icons/headerIcons/h1Icon.vue';
  import h2Icon from '../icons/headerIcons/h2Icon.vue';
  import h3Icon from '../icons/headerIcons/h3Icon.vue';
  import h4Icon from '../icons/headerIcons/h4Icon.vue';
  import h5Icon from '../icons/headerIcons/h5Icon.vue';
  import h6Icon from '../icons/headerIcons/h6Icon.vue';

const props =  defineProps(['item']);
defineEmits(['sizeChanged'])

</script>

<template>

    <button @click="$emit('sizeChanged', 'h1', props.item )" :class="{ 'bg-slate-100': props.item.headingType == 'h1' }"
    class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
        <h1Icon class="fill-slate-600 w-5 h-5"  :class="{ 'fill-slate-800': props.item.headingType == 'h1' }" />
    </button>

    <button @click="$emit('sizeChanged', 'h2', props.item )" :class="{ 'bg-slate-100': props.item.headingType == 'h2' }"
    class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
        <h2Icon class="fill-slate-600 w-5 h-5" :class="{ 'fill-slate-800': props.item.headingType == 'h2' }" />
    </button>

    <button @click="$emit('sizeChanged', 'h3', props.item )" :class="{ 'bg-slate-100': props.item.headingType == 'h3' }"
    class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
        <h3Icon class="fill-slate-600 w-5 h-5" :class="{ 'fill-slate-800': props.item.headingType == 'h3' }"/>
    </button> 

    <button @click="$emit('sizeChanged', 'h4', props.item )" :class="{ 'bg-slate-100': props.item.headingType == 'h4' }"
    class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
        <h4Icon class="fill-slate-600 w-5 h-5" :class="{ 'fill-slate-800': props.item.headingType == 'h4' }"/>
    </button>

    <button @click="$emit('sizeChanged', 'h5', props.item )" :class="{ 'bg-slate-100': props.item.headingType == 'h5' }"
    class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
        <h5Icon class="fill-slate-600 w-5 h-5" :class="{ 'fill-slate-800': props.item.headingType == 'h5' }"/>
    </button>

    <button @click="$emit('sizeChanged', 'h6', props.item )" :class="{ 'bg-slate-100': props.item.headingType == 'h6' }"
    class="hover:bg-slate-100 px-1.5 py-1 rounded-md duration-300">
        <h6Icon class="fill-slate-600 w-5 h-5" :class="{ 'fill-slate-800': props.item.headingType == 'h6' }"/>
    </button>

</template>
