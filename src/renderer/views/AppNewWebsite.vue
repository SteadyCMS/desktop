<script setup>
  import {  useRouter } from 'vue-router';
  import { ref, computed } from 'vue';

  import StepOne from '../components/createNewWebsite/StepOne.vue';
  import StepTwo from '../components/createNewWebsite/StepTwo.vue';
  import StepThree from '../components/createNewWebsite/StepThree.vue';
  import StepFour from '../components/createNewWebsite/StepFour.vue';

  import LoadingScreen from "../components/LoadingScreen.vue";

  import AccentButton from '../components/buttons/AccentButton.vue';
  import SecondaryButton from '../components/buttons/SecondaryButton.vue';

  import { downloadFile, extractFile, deleteFile } from '../utils/system.js'

  import LogoLight from '../components/logos/LogoLight.vue';
  import LogoDark from '../components/logos/LogoDark.vue';
  import IconX from '../components/icons/IconX.vue';

  const router = useRouter();

  // For Component Step switching
  const num = ref("1");
  const showLoadingScreen = ref(false);
  const loadingScreenText = ref('Perparing...');
  // Step 1
  const websiteName = ref("");
  const nameInputError = ref("")
  const nameInputIsValid = ref(true)
  // Step 2
  const templateName = ref("x");
  const templatePath = ref("");

  const currentStepComponent = computed(() => {
    if (num.value == "1") {
      return StepOne;
    } else if (num.value == "2") {
      return StepTwo;
    } else if (num.value == "3") {
      return StepThree;
    } else {
      // Done: set to done
      return StepFour;
    }
  });
  
  function changeCurrentStep(type) {
    if (type == "next") {
      if (num.value == "1") {
        // validate user name input
        if (validateUserInput()) {
          // Go on to next step
          nameInputIsValid.value = true;
          num.value = "2";
          stepCount.value[1].done = true;
        } else {
          // Show error
          nameInputIsValid.value = false;
        }
      } else if (num.value == "2") {
        num.value = "3";
        stepCount.value[2].done = true;
      } else if (num.value == "3") {
        num.value = "4";
        stepCount.value[3].done = true;
      }
    } else {
      if (num.value == "1") {
        num.value = "1";
        stepCount.value[1].done = false;
      } else if (num.value == "2") {
        num.value = "1";
        stepCount.value[1].done = false;
      } else if (num.value == "3") {
        num.value = "2";
        stepCount.value[2].done = false;
      } else if (num.value == "4") {
        num.value = "3";
        stepCount.value[3].done = false;
      }
    }
  }

  const stepCount = ref([
    {
      number: 1,
      done: true,
    },
    {
      number: 2,
      done: false,
    },
    {
      number: 3,
      done: false,
    },
    {
      number: 4,
      done: false,
    },
  ]);

  function validateUserInput() {
    // check if is input empty
    if (websiteName.value.trim() == "" || websiteName.value == null || websiteName.value.trim().length < 2) {
      nameInputError.value = "Name must be at least 2 characters.";
      return false;
    } else {
      var format = /[`!@#$%^&*()+\-=\[\]{};':"/|,<>\/?~]/;
      // Check if input has any special characters except "." or "_"
      if (!format.test(websiteName.value)) {
        return true;
      } else {
        nameInputError.value = 'Name can not contain any special characters except "." and "_"';
        return false;
      }
    }
  }


  function buildWebsite(){
    showLoadingScreen.value = true;
    const name = websiteName.value.replaceAll(' ', '_').toLowerCase();
    loadingScreenText.value = "Downloading Template...";
    downloadFile('https://github.com/nanxiaobei/hugo-paper/archive/refs/heads/main.zip', '/sites/' + name + '/temp/').then(files => {
      loadingScreenText.value = "Prossesing Template...";
      extractFile('/sites/' + name + '/temp/hugo-paper-main.zip', '/sites/' + name).then(files => {
        deleteFile('/sites/' + name + '/temp/hugo-paper-main.zip').then(files => {
          loadingScreenText.value = "Seting Up...";
          router.go(-1);
        });
      });
    });
   
  }


  function backToDashboard() {
    router.go(-1);
    // router.push({path: '/new-website/step-two'});
    //localStorage.setItem('todo_items', JSON.stringify(this.todo_items)); 
  }
  
</script>

<template>
  <LoadingScreen class="h-full w-full" v-if="showLoadingScreen" :loadingtext="loadingScreenText"></LoadingScreen>
  <div class="relative max-w-6xl mx-auto px-8">
    <div class="flex flex-row w-full h-screen py-8">
      <div class="w-5/6 md:w-2/3 flex flex-col justify-between">
        <div>
          <!-- Steps -->
          <div class="flex flex-col w-full mt-6">
            <div>
              <LogoDark class="h-9 w-auto" />
            </div>
            <div class="flex flex-row space-x-2 mt-4 mb-2">
              <div v-for="item in stepCount" :key="item" class="flex rounded-md h-2 w-8" :class="{'bg-accent': item.done, 'bg-light-gray': !item.done }"></div>
            </div>
            <h6 class="text-xs font-medium text-slate-600">Step {{ num }} of 4</h6>
          </div>
          <!-- Views -->
          <div>
            <Transition name="fade" mode="out-in">
            <component :is="currentStepComponent" 
              :name="websiteName" 
              :isvalid="nameInputIsValid"
              :errortext="nameInputError"
              :websiteinfo="{ website: websiteName, template: templateName, path: templatePath}"
              @on-change="(name) => websiteName = name"
              @choose-template="(template, path) => {templateName = template; templatePath = path;}">
            </component>
          </Transition>
          </div>
        </div>
        <div class="space-x-1 mb-2">
          <SecondaryButton text="Cancel" v-if="(num == '1')" @click="backToDashboard" />
          <SecondaryButton text="Back" v-if="!(num == '1')" @click="changeCurrentStep('previous')" />
          <AccentButton text="Continue" v-if="!(num == '4')" @click="changeCurrentStep('next')" />
          <AccentButton text="Create website" v-if="(num == '4')" @click="buildWebsite" />
        </div>
      </div>
      <div class="w-1/6 md:w-1/3 flex flex-row justify-end mt-4">
        <div>
          <button class="py-3 px-6 bg-white text-dark" @click="backToDashboard">
            <IconX class="fill-gray-400 w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>