<template>
  <div class="app">
    <Header />
    <Home />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Home from './components/Home.vue'
</script>

<style lang="scss">
@import '@/styles/main.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
