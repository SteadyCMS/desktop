<script setup>
  import h2Icon from '../icons/headerIcons/h2Icon.vue';
  import h3Icon from '../icons/headerIcons/h3Icon.vue';
  import h4Icon from '../icons/headerIcons/h4Icon.vue';
  import h5Icon from '../icons/headerIcons/h5Icon.vue';
  import h6Icon from '../icons/headerIcons/h6Icon.vue';

  const props =  defineProps(['item']);
  defineEmits(['sizeChanged'])
</script>

<template>
  <div>
    <button @click="$emit('sizeChanged', 'h2', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h2' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <h2Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h2' }" />
    </button>

    <button @click="$emit('sizeChanged', 'h3', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h3' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <h3Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h3' }"/>
    </button> 

    <button @click="$emit('sizeChanged', 'h4', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h4' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <h4Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h4' }"/>
    </button>

    <button @click="$emit('sizeChanged', 'h5', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h5' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <h5Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h5' }"/>
    </button>

    <button @click="$emit('sizeChanged', 'h6', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h6' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <h6Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h6' }"/>
    </button>
  </div>
</template>