<script setup>
  const props = defineProps(['text']);
</script>

<template>
  <button class="py-3 px-6 bg-white text-dark border border-gray-300 text-sm font-semibold rounded-lg ease-in-out duration-500">
    {{ props.text }}
  </button>
</template>