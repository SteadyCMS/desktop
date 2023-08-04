<script setup>
import TheWelcome from './components/TheWelcome.vue'


window.electronAPI.sendMessage('Hello from App.vue');
//window.electronAPI.runHugo(['version']);

//window.electronAPI.readFromFile("output\\myFile.txt");
window.electronAPI.writeToFile("hi", "output", "myFile.txt");

(async () => {
  const foo = await window.electronAPI.readFile("output\\myFile.txt")
  window.electronAPI.sendMessage('Hello from App.vue ' + foo);
})();



</script>

<template>
<header>
  
</header>

<main>
  <TheWelcome />
</main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
