<script setup>
import { RouterLink, RouterView } from 'vue-router';
window.electronAPI.sendMessage('Hello from App.vue');

// import { exec } from 'child_process';
// function execute(command, callback){
//     exec(command, function(error, stdout, stderr){ callback(stdout); });
// };

// module.exports.getGitUser = function(callback){
//     execute("git config --global user.name", function(name){
//         execute("git config --global user.email", function(email){
//             callback({ name: name.replace("\n", ""), email: email.replace("\n", "") });
//         });
//     });
// };

</script>

<template>
  <main> 

    <div class="subpixel-antialiased">
      <RouterView />
    </div>

  </main>
</template>

<style scoped>
</style>
