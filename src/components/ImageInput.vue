<template>
  <div class="file is-centered is-boxed">
    <label class="file-label">
      <input class="file-input" type="file" accept="image/png, image/jpeg" :onchange="loadImage" />
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
import { toRefs } from '@vue/reactivity'
import { drawImage } from 'canvas-object-fit'

const props = defineProps({
  width: Number,
  height: Number
})

const emit = defineEmits(['imageLoaded'])

const { width, height } = toRefs(props)

function loadImage(input) {
  const files = input.target.files
  if (!files || !files[0]) {
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = document.createElement('img')
    img.src = e.target.result

    img.onload = () => {
      const auxCanvas = document.createElement('canvas')
      auxCanvas.width = width.value
      auxCanvas.height = height.value

      const ctx = auxCanvas.getContext('2d')
      drawImage(ctx, img, 0, 0, auxCanvas.width, auxCanvas.height, { objectFit: 'contain' })

      const imageData = ctx.getImageData(0, 0, auxCanvas.width, auxCanvas.height)
      emit('imageLoaded', imageData)
    }
  }

  reader.readAsDataURL(files[0])
}
</script>

<style lang="scss" scoped>
.file .file-cta {
  background-color: white;

  &:hover {
    background-color: #fbfbfb;
  }
}
</style>
