<script setup>
  const props = defineProps(['text']);
</script>

<template>
  <button class="py-3 px-6 text-dark hover:text-white bg-accent hover:bg-dark text-sm font-semibold rounded-lg ease-in-out duration-500">
    {{ props.text }}
  </button>
</template>