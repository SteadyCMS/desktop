<script setup>
  import { ref, inject } from 'vue';
  import { useRouter } from 'vue-router';

  import { doesFileExistInAppDir, readFileInAppDir, getPathTo, getFilesIn, readFile } from '../../utils/system.js'

  import AccentButton from '../../components/buttons/AccentButton.vue';
  
  const router = useRouter();

  function goToBlockEditor(name) {
    if (name == "newsteadycmspost") {
      localStorage.setItem('activeSiteData_currentPost', "newsteadycmspost"); 
    } else {
      localStorage.setItem('activeSiteData_currentPost', name); 
    }
    localStorage.setItem('activeSiteData_currentSite', currentWebsite.value); 
    router.push({name: 'editor'});
  }

 
  const website = ref([]);
  const currentWebsite = ref('');
  const isPosts = ref(false);

  (function() {
    updatePostList();
  })();

  function cleanSiteName(name) { // TODO 
    const rawName = name[0].toUpperCase() + name.slice(1);
    return rawName.replaceAll('_', ' ').replaceAll('-', ' ');
  }

  function updatePostList() {
    doesFileExistInAppDir('steady.config.json').then(fileExsits => {
      if (fileExsits) {
        // Get the Current website
        readFileInAppDir("steady.config.json").then(fileData => {
          currentWebsite.value = cleanSiteName(JSON.parse(fileData.data).currentWebsite);
          getPathTo('documents').then(path => {
            console.log(currentWebsite.value);
            //const pathToPosts = `${path}/SteadyCMS/sites/${currentWebsite.value.toLocaleLowerCase()}/content/post/`;
            const pathToPosts =  "sites/" + currentWebsite.value.toLocaleLowerCase() + "/content/post/";
            getFilesIn(path + "/SteadyCMS/" + pathToPosts).then( dirs => {
              if (dirs.length >= 1) {
                for (let i = 0; i < dirs.length; i++) {
                  parseFile(pathToPosts, dirs[i]).then(fileData => {
                  website.value.splice(0,0, { "title": cleanSiteName(dirs[i]).replace(".markdown", ""), "name": dirs[i], "date":  fileData.date, "text": fileData.description });
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
        let frontMatter = /---([^;]*)---/.exec(fileData.data);
        let description = /(?<=description: )"(?:[^\\"]+|\\.)*"/.exec(frontMatter)[0].slice(1,-1);
        let date = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?([Zz]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?/.exec(frontMatter)[0];
        //"Aug 17, 2023 5:12pm"
        let returnData = {
          "description": description, 
          "date": formatDate(date)
        };
        return returnData;
      }else{
        console.log(fileData.data);
        return "error";
      }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

</script>

<template>
  <div class="w-full my-4 mx-8">
    <div class="flex flex-grow align-center items-center justify-between mx-6">
      <h1 class="text-4xl text-dark font-bold">Posts</h1>
      <AccentButton text="Add Post" @click="goToBlockEditor('newsteadycmspost')" />
    </div>

    <div class="flex flex-col mt-12 space-y-2">

      <div v-for="posts in website" @click="goToBlockEditor(posts.name)" class="rounded-lg cursor-pointer py-5 px-6 bg-slate-50 hover:bg-slate-100 duration-500">
        <div class="flex flex-row justify-between items-center">
          <h4 class="flex items-center text-xl text-dark font-bold">{{ posts.title }}<span class="text-sm text-slate-500 ml-1 font-semibold">&mdash; Draft</span></h4>
          <span class="text-xs text-slate-500">{{ posts.date }}</span>
        </div>
        <p class="text-slate-500 text-sm mt-1 max-w-2xl truncate">{{ posts.text }}</p>
      </div>

      <div v-if="!isPosts" class="rounded-lg cursor-pointer py-5 px-6 bg-slate-50 hover:bg-slate-100 duration-500">
        <div class="flex flex-row justify-between items-center">
          <h4 class="flex items-center text-xl text-dark font-bold">No Posts</h4>
        </div>
      </div>

    </div>
  </div>
</template>