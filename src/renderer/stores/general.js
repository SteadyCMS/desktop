  import { ref, computed } from 'vue'
  import { defineStore } from 'pinia'

  export const useGeneralStore = defineStore('general', () => {
    const currentSite = ref('');
    const isCurrentPostDraft = ref('');

      function changeCurrentSite(name) {
        currentSite.value = name;
      }
      
      function updateCurrentDaftStatus(isDraft) {
        isCurrentPostDraft.value = isDraft;
      }

    return { currentSite, changeCurrentSite, isCurrentPostDraft, updateCurrentDaftStatus };
  });


//  const count = ref(0)
//  const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }




 // return { count, doubleCount, increment }