
<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { ref } from 'vue';
import LogoLight from '../components/logos/LogoLight.vue';


const router = useRouter()
// On load set view to posts
router.push({path: '/new-website/step-one'});

function backToDashbord() {
    router.go(-1);
}

function nextStep(){
  router.push({path: '/new-website/step-two'});
}

function perStep(){
  router.push({path: '/new-website/step-one'});
}


</script>



  <template>
  <div class="h-screen">
    <div class="grid grid-rows-6 grid-flow-col gap-2 h-full my-4 mx-8">


      <div class="bg-black my-8 mx-14 rounded-3xl row-span-6">
        <LogoLight class="h-10 w-auto" />
      </div>

     
        <div class="col-span-5 flex flex-col">
          <h4 class="text-xl text-dark font-bold mt-14">Website Setup</h4>
        </div>

        <div class="col-span-5 row-span-4">
          <RouterView />
        </div>

        <div class="col-span-5">
          <button class="py-2.5 px-6 bg-accent text-dark text-sm font-bold rounded-lg" @click="perStep">Back</button>
          <button class="py-2.5 px-6 bg-accent text-dark text-sm font-bold rounded-lg" @click="nextStep">Continue</button>
          


        </div>


      
    </div>
  </div>
  </template>


<!--    



  
  <template>
  <div class="h-screen">
    <div class="grid grid-rows-6 grid-flow-col gap-1 h-full">


      <div class="bg-black w-1/4 flex h-full rounded-3xl my-8 mx-10 row-span-2 col-span-6">
        <LogoLight class="h-12 w-auto mt-12 ml-14" />
      </div>

       <div class="flex flex-row w-3/4 my-8"> 
        <div class="row-span-2">
          xx
        </div>

        <div class="row-span-2">
          <RouterView />xx
        </div>

        <div class="row-span-2">
          <button class="py-2.5 px-6 bg-accent text-dark text-sm font-bold rounded-lg">Back</button>
          <button class="py-2.5 px-6 bg-accent text-dark text-sm font-bold rounded-lg">Next</button>
        </div>
       </div>

      
    </div>
  </div>
  </template>
-->