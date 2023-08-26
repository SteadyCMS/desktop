<script setup>
import { ref } from 'vue'
import { GDialog } from 'gitart-vue-dialog'
import 'gitart-vue-dialog/dist/style.css'

const props = defineProps(['dialogState', 'title', 'content', 'button']);
defineEmits(['closeDialog']);

</script>
<template>
    <GDialog v-model="props.dialogState" max-width="500">
      <div class="wrapper">
        <div class="content">
          <div class="title">{{ props.title }}</div>
          <p>{{ props.content }}</p>
        </div>
        <div class="actions">
          <button
            class="btn btn--outline-gray"
            @click="$emit('closeDialog')">
            {{ props.button }}
          </button>
        </div>
      </div>
    </GDialog>
</template>

<style scoped>

.wrapper {
  color: #000;
}

.content {
  padding: 20px;
}

.title {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

</style>


