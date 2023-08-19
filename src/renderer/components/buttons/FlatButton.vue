<script setup>
  const props = defineProps(['text']);
</script>

<template>
  <button class="flex items-center py-3 px-6 text-sm font-medium text-slate-800">
    <slot /> {{ text }}
  </button>
</template>