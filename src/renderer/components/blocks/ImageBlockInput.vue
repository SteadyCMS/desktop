<script setup>
  import { ref } from 'vue'

  // Outside 
  const props =  defineProps(['item']);

  //Inside
  const imagesrc = ref(null);

  function onFileChange(item, e){
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
          return;
          props.item.src = files[0];
      createImage(item, files[0]);
  }

  function createImage(item, file) {
    var image = new Image();
    var reader = new FileReader();

    reader.onload = (e) => {
      imagesrc.value = e.target.result;
    };
    reader.readAsDataURL(file);
  };

</script>


<template>

  <label class="block m-4">
    <span class="sr-only">Choose a photo</span>
    <input type="file"  @change="onFileChange(item, $event)" class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-600
      hover:file:bg-blue-100"/>
  </label>

  <img :src="imagesrc">

  <input type="text" placeholder="Enter Caption..." v-model="props.item.caption" class="mt-1 px-2 py-1 block w-full bg-white outline-none border-0 border-none text-md placeholder-slate-400"/>

</template>






<!--
    {{< figure src="/posts/racoons.jpg" alt="Racoons" caption="We caught a family of racoons raiding our kitchen area" >}}

--> 















