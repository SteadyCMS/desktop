import DialogVue from '../components/Dialog.vue';
import { createApp } from 'vue';

export const Dialog = (options = {}) => {
 // const onCancel = options.onCancel;
  const tempDiv = document.createElement('div');
  const instance = createApp(DialogVue).mount(tempDiv);

  instance.title = options.title;
  instance.message = options.message;

  instance.cancelText = options.cancelText;
  instance.acceptText = options.acceptText;
  instance.declineText = options.declineText;

  instance.onCancel = options.onCancel;
  instance.onAccept = options.onAccept;
  instance.onDecline = options.onDecline;

  instance.show = true;

  document.body.appendChild(instance.$el);
}
