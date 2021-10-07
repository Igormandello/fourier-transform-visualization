<template>
  <Header />
  <div class="content">
    <Home />
  </div>
  <Footer />
</template>

<script setup>
import Header from './components/Header.vue'
import Home from './components/Home.vue'
import Footer from './components/Footer.vue'
</script>

<style lang="scss">
@import '@/styles/main.scss';

html {
  background-color: #fafafa;
}

#app {
  display: flex;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;

  > .content {
    flex-grow: 1;
  }
}
</style>
