
  <script setup>
  import {  useRouter } from 'vue-router';
  import { ref, computed } from 'vue';

  import StepOne from '../components/createNewWebsite/StepOne.vue';
  import StepTwo from '../components/createNewWebsite/StepTwo.vue';
  import StepThree from '../components/createNewWebsite/StepThree.vue';
  import StepFour from '../components/createNewWebsite/StepFour.vue';

  import { downloadFile, extractFile, deleteFile } from '../utils/system.js'

  import LogoLight from '../components/logos/LogoLight.vue';

  // For Component Step switching
  const num = ref("1");
  const continueButtonText = ref("Continue");
  // Step 1
  const websiteName = ref("");
  const nameInputError = ref("")
  const nameInputIsValid = ref(true)
  // Step 2
  const templateName = ref("x");
  const templatePath = ref("");

  

    const currentStepComponent = computed(() => {
      if(num.value == "1"){
        return StepOne;
      }else if(num.value == "2"){
        return StepTwo;
      }else if(num.value == "3"){
        return StepThree;
      }else{
        // Done :: set to done
        return StepFour;
      }
  });
  
  function changeCurrentStep(type){
    if(type == "next"){
      if (num.value == "1") {
        // validate user name input
        if(validateUserInput()){
          // Go on to next step
          nameInputIsValid.value = true;
          num.value = "2";
          stepCount.value[1].done = true;
        }else{
          // Show error
          nameInputIsValid.value = false;
        }
      }else if(num.value == "2"){
        num.value = "3";
        stepCount.value[2].done = true;
      }else if(num.value == "3"){
        num.value = "4";
        stepCount.value[3].done = true;
      }
    }else{
      if (num.value == "1") {
        num.value = "1";
        stepCount.value[1].done = false;
      }else if(num.value == "2"){
        num.value = "1";
        stepCount.value[1].done = false;
      }else if(num.value == "3"){
        num.value = "2";
        stepCount.value[2].done = false;
      }else if(num.value == "4"){
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

  function validateUserInput(){
    // check if is input empty
    if (websiteName.value.trim() == "" || websiteName.value == null || websiteName.value.trim().length < 2) {
      nameInputError.value = "Name must contain at least two character.";
      return false;
    }else{
      var format = /[`!@#$%^&*()+\-=\[\]{};':"/|,<>\/?~]/;
      // Check if input has any special characters except "." or "_"
      if (!format.test(websiteName.value)) {
        return true;
      }else{
        nameInputError.value = 'Name can not contain any special characters except "." and "_"';
        return false;
      }
    }
  }

  function buildWebsite(){
    downloadFile('https://github.com/nanxiaobei/hugo-paper/archive/refs/heads/main.zip', '/sites/' + websiteName.value + '/temp/').then(files => {
      extractFile('/sites/' + websiteName.value + '/temp/hugo-paper-main.zip', '/sites/' + websiteName.value).then(files => {
        deleteFile('/sites/' + websiteName.value + '/temp/hugo-paper-main.zip');
      });
    });
   
  }


  /********************/
  const router = useRouter()
  function backToDashbord() {
    router.go(-1);
    // router.push({path: '/new-website/step-two'});
    //localStorage.setItem('todo_items', JSON.stringify(this.todo_items)); 
  }
  
</script>

  <template>
  <div class="h-screen">
    <div class="grid grid-rows-6 grid-flow-col gap-2 h-full my-4 mx-8">

      <div class="bg-black my-8 mx-14 rounded-3xl row-span-6">
        <LogoLight class="h-10 w-auto" />
      </div>

        <div class="col-span-5 flex flex-col w-full">
          <h4 class="text-xl text-dark font-bold mt-14">Website Setup</h4>
          <div class="flex flex-row space-x-2 my-2">
              <div v-for="item in stepCount" class="flex rounded-md h-2 w-8" :class="{'bg-accent': item.done, 'bg-light-gray': !item.done }"></div>
          </div>
          <h6 class="text-sm font-medium text-slate-600">Step {{ num }} of 4</h6>
        </div>

        <div class="col-span-5 row-span-4">
          <component :is="currentStepComponent" 
            :name="websiteName" 
            :isvalid="nameInputIsValid"
            :errortext="nameInputError"
            :websiteinfo="{ website: websiteName, template: templateName, path: templatePath}"
            @on-change="(name) => {websiteName = name.replace(' ', '_');}"
            @choose-template="(template, path) => {templateName = template; templatePath = path;}">
          </component>
        </div>

        <div class="col-span-5">
          <button class="py-2.5 px-6 bg-accent text-dark text-sm font-bold rounded-lg" v-if="!(num == '1')"
          @click="changeCurrentStep('previous')">Back</button>

          <button class="py-2.5 px-6 bg-accent text-dark text-sm font-bold rounded-lg" v-if="!(num == '4')"
          @click="changeCurrentStep('next')">Continue</button>

          <button class="py-2.5 px-6 bg-accent text-dark text-sm font-bold rounded-lg" v-if="(num == '4')"
          @click="buildWebsite">Build Website</button>
        
        </div>
    </div>
  </div>
  </template>



