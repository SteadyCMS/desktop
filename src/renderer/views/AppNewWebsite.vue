<script setup>
  import {  useRouter } from 'vue-router';
  import { ref, computed } from 'vue';
  import { createToast, clearToasts } from 'mosha-vue-toastify';

  import StepOne from '../components/createNewWebsite/StepOne.vue';
  import StepTwo from '../components/createNewWebsite/StepTwo.vue';
  import StepThree from '../components/createNewWebsite/StepThree.vue';
  import StepFour from '../components/createNewWebsite/StepFour.vue';
  import LoadingScreen from "../components/LoadingScreen.vue";

  import AccentButton from '../components/buttons/AccentButton.vue';
  import SecondaryButton from '../components/buttons/SecondaryButton.vue';

  import { downloadFile, extractFile, deleteFile, deleteDir, writeToFile, 
           getPathTo, doesFileExistInAppDir, readFileInAppDir, writeToFileInAppDir } from '../utils/system.js'
  import { createNewSite } from '../utils/hugo.js'

  import LogoLight from '../components/logos/LogoLight.vue';
  import LogoDark from '../components/logos/LogoDark.vue';
  import IconX from '../components/icons/IconX.vue';

  const router = useRouter();

  // TODO: On start up remove the x and cancel buttons

  // For Component Step Switching
  const num = ref("1");
  const showLoadingScreen = ref(false);
  const loadingScreenText = ref('Preparing...');
  const isUsingInternet = ref(false);
  const isCancelAndCleanUp = ref(false);
  // Step 1
  const websiteName = ref("");
  const nameInputError = ref("")
  const nameInputIsValid = ref(true)
  // Step 2
  const templateName = ref("");
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

  function backToDashboard() {
    router.go(-1); 
  }
  
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
    // Check if is input empty
    if (websiteName.value.trim() == "" || websiteName.value == null || websiteName.value.trim().length < 2) {
      nameInputError.value = "Name must be at least 2 characters.";
      return false;
    } else {
      var format = /[`!@#$%^&*()+\-=\[\]{};':"/|,<>\/?~]/;
      // Check if input has any special characters except "." or "_"
      if (!format.test(websiteName.value)) {
        return true;
      } else {
        nameInputError.value = 'Name cannot contain any special characters except "." and "_"';
        return false;
      }
    }
  }

  function cancelAndCleanUp() {
    loadingScreenText.value = "Canceling...";
    setTimeout(deleteOldFiles, 5000);
  }

  function deleteOldFiles() {
      const name = websiteName.value.replaceAll(' ', '_').toLowerCase();
      deleteDir('sites/' + name).then(x => {
      showLoadingScreen.value = false;
      loadingScreenText.value = 'Preparing...';
      isCancelAndCleanUp.value = false;
    });
  }

  function buildWebsite() { 
    if (isOnline()) {
      showLoadingScreen.value = true;
      const name = websiteName.value.replaceAll(' ', '_').toLowerCase();
      
      // Create New Hugo Site
      loadingScreenText.value = "Setting up...";
      getPathTo('documents').then(path => {
        createNewSite(path + "/SteadyCMS/sites/"  + name + "/").then(x => {

        // Download Hugo Template, extract zip and delete .zip file
        isUsingInternet.value = true;
        loadingScreenText.value = "Downloading template..."; 
        downloadFile('https://github.com/nanxiaobei/hugo-paper/archive/refs/heads/main.zip', '/sites/' + name + '/themes/').then(x => {
          loadingScreenText.value = "Processing template...";
          isUsingInternet.value = false;
          extractFile('sites/' + name + '/themes/hugo-paper-main.zip', 'sites/' + name + "/themes/").then(x => {
            deleteFile('sites/' + name + '/themes/hugo-paper-main.zip').then(x => {

              // Set up hugo.toml
              loadingScreenText.value = "Configuring your site..."; // TODO: SET theme name in .toml

              let hugoToml = "baseURL = 'http://example.org/'\r\nlanguageCode = 'en-us'\r\ntitle = '" + name.replaceAll("_", " ") +"'\r\ntheme='hugo-paper-main'";
              writeToFile(hugoToml, "/sites/" + name, "hugo.toml").then(x => {

                // Saving info to steady.config.json
                loadingScreenText.value = "Finishing up...";
                doesFileExistInAppDir('steady.config.json').then(fileExsits => {
                  // If the file exsists add too
                  if (fileExsits) {
                    readFileInAppDir("steady.config.json").then(fileData => {
                      let fileObj = JSON.parse(fileData.data);
                      fileObj.currentWebsite = name;
                      writeToFileInAppDir(JSON.stringify(fileObj), "/", "steady.config.json").then(x => {
                        backToDashboard();
                      });
                    });
                  } else {
                    // Else make the file and write info
                    const obj = { "currentWebsite": name};
                      writeToFileInAppDir(JSON.stringify(obj), "/", "steady.config.json").then(x => {
                      backToDashboard();
                    });
                  }
                });
              });
            });
          });
        });
      });
    });
    } else {
      // They are offline
      changeWarningToast({ title: 'Internet Connection Needed', description: 'Please check your internet connection and try again.'});
    }
  }

  const changeWarningToast = (message) => {
    createToast(message, {
      type: 'warning', /* toastBackgroundColor: 'color',*/ 
      showCloseButton: true, 
      swipeClose: true, 
      transition: 'slide', 
      showIcon: false, 
      position: 'top-right'
    });
  }

  // Check if uses is connected to the internet
  function isOnline() {
    return navigator.onLine;
  }
  
  // If they user gose offline when the app is using it cancel can clean up
  window.addEventListener("offline", (e) => {
    if (isUsingInternet.value) {
      if (isCancelAndCleanUp.value == false) {
        isCancelAndCleanUp.value = true;
        //console.log('called');
        changeWarningToast({ title: 'Internet Connection Was Lost', description: 'Please check your internet connection and try again.'});
        cancelAndCleanUp(); // TODO: Doesn't work sometimes because the downloading progress is not stopped
      }
    }
  });

</script>

<template>
  <Transition name="fade" mode="out-in">
    <LoadingScreen class="h-full w-full" v-if="showLoadingScreen" :title="'Creating website'" :text="loadingScreenText"></LoadingScreen>
  </Transition>
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
              <div v-for="item in stepCount" :key="item" class="flex rounded-md h-2 w-8" :class="{'bg-accent': item.done, 'bg-tint-2': !item.done }"></div>
            </div>
            <h6 class="text-xs font-medium text-tint-7">Step {{ num }} of 4</h6>
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
          <div v-if="(this.$route.query.hasProjects == true)"> 
            <SecondaryButton text="Cancel" v-if="(num == '1')" @click="backToDashboard" />
          </div>
          <SecondaryButton text="Back" v-if="!(num == '1')" @click="changeCurrentStep('previous')" />
          <AccentButton text="Continue" v-if="!(num == '4')" @click="changeCurrentStep('next')" />
          <AccentButton text="Create website" v-if="(num == '4')" @click="buildWebsite" />
        </div>
      </div>
      <div class="w-1/6 md:w-1/3 flex flex-row justify-end mt-4">
        <div v-if="this.$route.query.hasProjects">
          <button class="py-3 px-6 bg-white" @click="backToDashboard">
            <IconX class="fill-tint-6 w-8 h-8" />
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