<template>
  <nav class="navbar is-spaced has-shadow" role="navigation" aria-label="main navigation">
    <div class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item">Fourier Magnitude Spectrum</a>
        <a class="navbar-item link-active">Fourier Series</a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="columns">
            <github-button
              href="https://github.com/igormandello/fourier-transform-visualization/subscription"
              data-icon="octicon-eye"
              data-size="large"
              data-show-count="true"
              aria-label="Watch igormandello/fourier-transform-visualization on GitHub"
              class="column"
            >
              Watch
            </github-button>

            <github-button
              href="https://github.com/igormandello/fourier-transform-visualization"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star igormandello/fourier-transform-visualization on GitHub"
              class="column"
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

<style lang="scss"></style>
