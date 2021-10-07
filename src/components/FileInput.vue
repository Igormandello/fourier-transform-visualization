<template>
  <div class="file is-centered is-boxed">
    <label class="file-label">
      <input class="file-input" type="file" accept="image/png, image/jpeg" :onchange="e => $emit('change', e)" />
      <span class="file-cta">
        <span class="file-icon">
          <FontAwesomeIcon icon="upload" />
        </span>
        <span class="file-label">Choose an image...</span>
      </span>
    </label>
  </div>
</template>

<script setup>
defineEmits(['change'])
</script>

<style></style>
