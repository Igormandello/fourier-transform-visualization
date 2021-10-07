<template>
  <Header />
  <router-view class="content" />
  <Footer />
</template>

<script setup>
import Header from './components/Header.vue'
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
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
  }
}
</style>
