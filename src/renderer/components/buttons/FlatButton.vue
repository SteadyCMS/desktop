<script setup>
  const props = defineProps(['text']);
</script>

<template>
  <button class="">
    <slot /> {{ text }}
  </button>
</template>