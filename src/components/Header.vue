<template>
  <nav class="navbar is-spaced has-shadow" role="navigation" aria-label="main navigation">
    <div class="navbar-menu is-active">
      <div class="navbar-start">
        <a class="navbar-item">Fourier Magnitude Spectrum</a>
        <a class="navbar-item">Fourier Series</a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item is-expanded">
          <div class="columns is-mobile is-centered">
            <github-button
              href="https://github.com/igormandello/fourier-transform-visualization/subscription"
              data-icon="octicon-eye"
              data-size="large"
              data-show-count="true"
              aria-label="Watch igormandello/fourier-transform-visualization on GitHub"
              class="column is-narrow"
            >
              Watch
            </github-button>

            <github-button
              href="https://github.com/igormandello/fourier-transform-visualization"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star igormandello/fourier-transform-visualization on GitHub"
              class="column is-narrow"
            >
              Star
            </github-button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import GithubButton from 'vue-github-button'
</script>

<style lang="scss" scoped>
.navbar {
  .navbar-menu {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    > div {
      display: flex;
      align-items: center;
    }
  }
}
</style>
