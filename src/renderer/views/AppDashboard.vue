<script setup>
  import { ref } from 'vue';
  import { RouterLink, RouterView, useRouter} from 'vue-router';
  import { storeToRefs } from 'pinia'
  import { useGeneralStore } from '../stores/general.js'
  import { getDirsIn, doesFileExistInAppDir, readFileInAppDir, getPathTo, 
           doesFileExist, writeToFileInAppDir, deleteFileInAppDir } from '../utils/system.js'
  import { fileNameToTitle } from '../utils/utils.js'

  import LogoLight from '../components/logos/LogoLight.vue';
  import LogoMark from '../components/logos/LogoMark.vue';
  import IconThreeDots from '../components/icons/IconThreeDots.vue';
  import IconPosts from '../components/icons/IconPosts.vue';
  import IconPages from '../components/icons/IconPages.vue';
  import IconTags from '../components/icons/IconTags.vue';
  import IconArrowDown from '../components/icons/IconArrowDown.vue';
  import IconPlus from '../components/icons/IconPlus.vue';

  const generalStore = useGeneralStore();
  const { currentSite } = storeToRefs(generalStore);
  const { changeCurrentSite } = generalStore; 


  const router = useRouter();
  const dropdownState = ref(false);
  const websites = ref([]);
  const currentWebsite = ref('');

  (function() {
    // On load, set view to posts
    router.push({path: '/posts'});
    // And load content
    loadSiteContent();
  })();

  function loadSiteContent() {
    // TODO: make sure the current site is there
    doesFileExistInAppDir('steady.config.json').then(fileExsits => {
      if (fileExsits) {
          // Get the Current website
        readFileInAppDir("steady.config.json").then(fileData => {
          currentWebsite.value = fileNameToTitle(JSON.parse(fileData.data).currentWebsite);
          currentSite.value = currentWebsite.value;
          // Get a list of all websites by looping over the dirs and add them to array for the dropdown
          getPathTo('documents').then(path => {
            getDirsIn(path + "/SteadyCMS/sites/").then( dirs => {
             // console.log(dirs)
              if (dirs != "error" && dirs.length != 0) {

                for (let i = 0; i < dirs.length; i++) {
                  doesFileExist("/sites/" + dirs[i] + '/hugo.toml').then(fileExsits => {
                    if (fileExsits && dirs[i] != currentWebsite.value.toLowerCase()) {
                      websites.value.splice(0,0, { "name": fileNameToTitle(dirs[i]), "path": dirs[i], });
                    }
                  });
                }
              } else {
                  // Delete steady.config.json
                  deleteFileInAppDir("steady.config.json").then(x => {
                  // They have no websites (have them make one)
                  createNewWebsite(false);
                });
              }
            });
          });
        });
      } else { 
        // They have no websites (have them make one)
        createNewWebsite(false);
      }
    });
  }

  function changeCurrentWebsite(websiteName) { // TODO: when changing site the server must be stop before changed
    console.log(websiteName);
     const obj = {"currentWebsite": websiteName};
      writeToFileInAppDir(JSON.stringify(obj), "/", "steady.config.json").then(x => {
        websites.value = [];
        router.push({path: '/posts'});
        dropdownState.value = false;
        loadSiteContent();
        changeCurrentSite(websiteName);
    });
  }

  function createNewWebsite(projects) {
    router.push({path: '/new-website', 
      query: {
        hasProjects: projects
      }
    });
  }

</script>

<template>
  <main> 
    <div class="flex flex-row">

      <div class="h-screen w-1/3 lg:w-1/4 lg:max-w-xs bg-black px-8 py-6">
        <!-- Logo -->
        <div class="flex justify-between mb-4">
          <LogoLight class="h-8 w-auto" />
          <button class="py-1.5 px-2 border border-black hover:border-tint-10 rounded-lg duration-300">
            <IconThreeDots class="w-4 h-4 fill-tint-4" />
          </button>
        </div>
        <div class="flex flex-row space-x-1 mb-8">
          <div class="relative w-full">
            <!-- Website selector -->
            <button class="flex flex-grow items-center justify-between px-4 py-2 rounded-lg border border-tint-10 w-full hover:bg-accent-glow duration-300" 
              @click="dropdownState =! dropdownState">
              <div class="flex items-center space-x-2">
                <LogoMark class="w-5 h-5 border border-tint-10 rounded" />
                <span class="text-white text-sm font-semibold">{{ currentWebsite }}</span>
              </div>

              <IconArrowDown class="fill-tint-4 w-3 h-3 ml-1" :class="{'rotate-180 duration-300': dropdownState, 'duration-300' : !dropdownState}"/>
            </button>
            <!-- Dropdown menu -->
            <div class="absolute top-6 left-0 bg-black border border-tint-10 text-base z-50 list-none rounded-lg my-4 w-full" id="dropdown" :class="{'opacity-100': dropdownState, 'visible': dropdownState, 'opacity-0': !dropdownState, 'hidden': !dropdownState}">
              <ul class="py-1" aria-labelledby="dropdown">
                <li v-for="site in websites" :key="site.path" @click="changeCurrentWebsite(site.path)" class="flex flex-row flex-grow rounded-lg hover:bg-accent-glow hover:cursor-pointer px-4 py-2 duration-300">
                  <div class="flex flex-row items-center space-x-2">
                    <LogoMark class="w-5 h-5 border border-tint-10 rounded" />
                    <span class="text-white text-sm font-bold"> {{ site.name }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- New website button -->
          <button @click="createNewWebsite(true)" class="p-1.5 border border-tint-10 rounded-lg hover:bg-accent-glow duration-300">
            <IconPlus class="fill-tint-4 w-5 h-5" />
          </button>
        </div>
        <!-- Page links -->
        <div class="text-white flex flex-col space-y-1">
          <RouterLink class="flex items-center rounded-lg px-4 py-2 text-tint-2 fill-tint-3 text-sm font-semibold"
            active-class="active-rl"
            to="/posts">
            <IconPosts class="w-4 h-4 mr-2" /> Posts
          </RouterLink>
          <RouterLink class="flex items-center rounded-lg px-4 py-2 text-tint-2 fill-tint-3 text-sm font-semibold"
            active-class="active-rl" 
            to="/pages">
            <IconPages class="w-4 h-4 mr-2" /> Pages
          </RouterLink>
          <RouterLink class="flex items-center rounded-lg px-4 py-2 text-tint-2 fill-tint-3 text-sm font-semibold" 
            active-class="active-rl"
            to="/tags">
            <IconTags class="w-4 h-4 mr-2" /> Tags
          </RouterLink>
        </div>
      </div>

      <div class="flex h-screen w-3/4">
        <RouterView />
      </div>

    </div>
  </main>
</template>