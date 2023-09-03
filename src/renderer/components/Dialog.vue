<script setup>
import { ref } from 'vue'
import { GDialog } from 'gitart-vue-dialog'
import 'gitart-vue-dialog/dist/style.css'

const show = ref(false);
const title = ref('');
const message = ref('');

const declineText = ref('');
const acceptText = ref('');
const cancelText = ref('');

const onCancel = () => {};
const onAccept = () => {};
const onDecline = () => {};

defineExpose({
  title,
  message,
  show,
  declineText,
  acceptText,
  cancelText,
  onCancel,
  onAccept,
  onDecline,
});

</script>

<template>
    <GDialog v-model="show" max-width="500">
      <div class="wrapper">
        <div class="content">
          <div v-if="title" class="title">{{ title }}</div>
          <p>{{ message }}</p>
        </div>
        <div class="actions">
          <button
            class="m-2"
            @click="() => {show = false; onDecline()}">
            {{ declineText }}
          </button>
          <button
            class="m-2"
            @click="() => {show = false; onAccept()}">
            {{ acceptText }}
          </button>
          <button
            class="m-2"
            @click="() => {show = false; onCancel()}">
            {{ cancelText }}
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

