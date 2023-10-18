<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGeneralStore } from '../../stores/general.js'
  import { storeToRefs } from "pinia";

  import { doesFileExistInAppDir, readFileInAppDir, getPathTo, getFilesIn, readFile } from '../../utils/system.js'
  import { siteToFolderName, fileNameToTitle } from '../../utils/utils.js'

  import AccentButton from '../../components/buttons/AccentButton.vue';
  
  const router = useRouter();

  const website = ref([]);
  const currentWebsite = ref('');
  const isPosts = ref(false);
  const postList = ref({});

  const generalStore = useGeneralStore();
  const { isCurrentPostDraft } = storeToRefs(generalStore);
  const { updateCurrentDaftStatus } = generalStore; 

  (function() {
    updatePostList();
  })();

  // Event
  generalStore.$onAction(
    ({name}) => {
      if (name === 'changeCurrentSite') {
        website.value = [];
        updatePostList();
      }
    }
  );

  function goToBlockEditor(name) {
    if (name == "newsteadycmspost") {
      localStorage.setItem('activeSiteData_currentPost', "newsteadycmspost"); 
    } else {
      localStorage.setItem('activeSiteData_currentPost', name); 
    }
    localStorage.setItem('activeSiteData_currentSite', currentWebsite.value);
    localStorage.setItem('activeSiteData_iscurrentPostADraft', postList.value[name]); 
    router.push({name: 'editor'});
  }

  function updatePostList() {
    doesFileExistInAppDir('steady.config.json').then(fileExsits => {
      if (fileExsits) {
        // Get the Current website
        readFileInAppDir("steady.config.json").then(fileData => {
          currentWebsite.value = siteToFolderName(JSON.parse(fileData.data).currentWebsite);
          getPathTo('documents').then(path => {
            console.log(currentWebsite.value);
            const pathToPosts =  "sites/" + currentWebsite.value+ "/content/post/";
            getFilesIn(path + "/SteadyCMS/" + pathToPosts).then( dirs => {
              if (dirs.length >= 1 && dirs != "error") {
                for (let i = 0; i < dirs.length; i++) {
                  parseFile(pathToPosts, dirs[i]).then(fileData => {
                  website.value.splice(0,0, { "title": fileNameToTitle(dirs[i]).replace(".markdown", ""), "name": dirs[i], "date":  fileData.date, "text": fileData.description, "isDraft": fileData.isDraft });
                  postList.value[dirs[i]] = fileData.isDraft;
                  });
                }
                isPosts.value = true;
              }else{
                // No posts  
                isPosts.value = false;
              }
            });
          });

        });
      }else{
        // No posts (no websites)
        isPosts.value = false;
      }
    });
  }

  async function parseFile(path, fileName) {
   let fileData = await readFile(path + fileName);
      if (fileData.success) {
        // Parse and get description and data
        let frontMatter = /---([^;]*)---/.exec(fileData.data); // Get the front matter
        let description = /(?<=description: )"(?:[^\\"]+|\\.)*"/.exec(frontMatter)[0].slice(1,-1);
        let date = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?([Zz]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?/.exec(frontMatter)[0];
        let isDraft =  /(?<=draft: )(?:[^\\"\n]+|\\.)*/.exec(frontMatter)[0];
        console.log(isDraft)
        let returnData = {
          "description": description, 
          "date": formatDate(date),
          "isDraft": isDraft,
        };
        return returnData;
      }else{
        console.log(fileData.data);
        return "error";
      }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
</script>

<template>
  <div class="w-full my-4 mx-8">
    <div class="flex flex-grow align-center items-center justify-between mx-6">
      <h1 class="text-4xl text-tint-10 font-bold">Posts</h1>
      <AccentButton text="Add Post" @click="goToBlockEditor('newsteadycmspost')" />
    </div>
    <div class="flex flex-col mt-12 space-y-2">
      <div v-for="post in website" :key="post.name" @click="goToBlockEditor(post.name)" class="rounded-lg cursor-pointer py-5 px-6 bg-tint-0 hover:bg-tint-1 duration-500">
        <div class="flex flex-row justify-between items-center">
          <h4 class="flex items-center text-xl text-tint-10 font-bold">{{ post.title }}<span class="text-sm text-tint-7 ml-1 font-semibold">&mdash; 
            <span v-if="post.isDraft">Draft</span> 
            <span v-if="!post.isDraft">Published</span>
          </span></h4>
          <span class="text-xs text-tint-7">{{ post.date }}</span>
        </div>
        <p class="text-tint-7 text-sm mt-1 max-w-2xl truncate">{{ post.text }}</p>
      </div>
      <div v-if="!isPosts" class="flex h-full justify-center mt-12">
        <div class="flex flex-col items-center text-center justify-center">
          <h4 class="flex items-center text-2xl text-tint-10 font-bold"> {{ generalStore.currentSite }} doesn't have any posts yet.</h4>
          <p class="text-tint-7 mt-1">Create one by clicking the Add Post button.</p>
        </div>
      </div>
    </div>
  </div>
</template>