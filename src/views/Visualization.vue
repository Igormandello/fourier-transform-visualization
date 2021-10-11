<template>
  <section class="section container is-max-widescreen">
    <div class="columns is-centered mb-4" v-if="!hasFile">
      <div class="column is-one-quarter">
        <ImageInput @imageLoaded="imageLoaded" :width="imageWidth" :height="imageHeight" />
      </div>
    </div>

    <div class="columns is-multiline is-centered is-variable is-6 mt-4" v-else>
      <Slider v-model="minRadius" class="is-one-third-tablet" label="Minimum Radius" min="0" max="400" step="1" @change="calculateImage" />
      <Slider v-model="maxRadius" class="is-one-third-tablet" label="Maximum Radius" min="0" max="400" step="1" @change="calculateImage" />
      <Slider v-model="gamma" class="is-one-third-tablet" label="Gamma" min="0.1" max="3" step="0.1" @change="calculateImage" />
      <Slider v-model="brushSize" class="is-half-tablet" label="Brush size" min="5" max="50" step="1" />
      <Slider v-model="minimumValue" class="is-half-tablet" label="Minimum value" min="0" max="255" step="1" @change="calculateImage" />

      <div class="column field is-flex is-align-items-center is-justify-content-center">
        <label class="radio mr-4">
          <input v-model="filterType" value="ideal" type="radio" name="filterType" />
          Ideal
        </label>
        <label class="radio mr-4">
          <input v-model="filterType" value="butterworth" type="radio" name="filterType" />
          Butterworth
        </label>
        <label class="radio">
          <input v-model="filterType" value="gaussian" type="radio" name="filterType" />
          Gaussian
        </label>
      </div>

      <div class="column field is-narrow">
        <label class="label">Invert Filter</label>
        <input id="invert" v-model="inverse" type="checkbox" class="switch is-rounded is-small" @change="calculateImage" />
        <label for="invert"></label>
      </div>

      <div class="column field is-narrow is-flex is-align-items-center is-justify-content-center">
        <button @click="clearMask" class="button is-primary">Clear Mask</button>
      </div>
    </div>

    <div class="columns box canvas px-0 py-0">
      <DrawableCanvas
        v-model:context="context"
        class="column px-0 py-0"
        :width="imageWidth"
        :height="imageHeight"
        :shouldInterpolateDrag="true"
        @drawPoint="maskSpectrum"
        @finishedDrawing="calculateImage"
      />
      <DrawableCanvas v-model:context="resultContext" class="column px-0 py-0" :width="imageWidth" :height="imageHeight" />
    </div>
  </section>
</template>

<script setup>
import Slider from '@/components/Slider.vue'
import ImageInput from '@/components/ImageInput.vue'
import DrawableCanvas from '@/components/DrawableCanvas.vue'

import { ref, watch } from 'vue'
import nj from 'numjs'
import { fft, ifft, magnitudes } from '@/scripts/fourier'
import fillGreyscale from '@/scripts/imageData'

const hasFile = ref(false)

const minRadius = ref('0')
const maxRadius = ref('400')
const inverse = ref(false)
const gamma = ref('1.5')
const brushSize = ref('10')
const minimumValue = ref('0')
const filterType = ref('ideal')

const context = ref(null)
const resultContext = ref(null)

const imageWidth = 512
const imageHeight = 512

let originalFFT = null
let mask = nj.zeros([imageWidth, imageHeight])

watch(filterType, calculateImage)

function imageLoaded(imageData) {
  hasFile.value = true

  originalFFT = fft(imageData)
  calculateImage()
}

function calculateImage() {
  const fft = originalFFT.clone()
  const { maxMag, magnitudesList } = magnitudes(fft, filterType.value, minRadius.value, maxRadius.value, inverse.value, mask)

  const ifftList = ifft(fft)
  const inverseFourier = new ImageData(imageWidth, imageHeight)
  const fourierMagnitudeSpectrum = new ImageData(imageWidth, imageHeight)
  for (let i = 0; i < imageWidth * imageHeight; i++) {
    const index = i * 4

    const magnitudeValue = (magnitudesList[i] * 255) / maxMag
    fillGreyscale(fourierMagnitudeSpectrum, index, magnitudeValue)

    const inverseFourierValue = Math.floor(Math.pow(ifftList[i * 2], 1 / gamma.value) * 255)
    const imageValue = inverseFourierValue < 0 ? 0 : inverseFourierValue <= minimumValue.value ? 0 : inverseFourierValue
    fillGreyscale(inverseFourier, index, imageValue)
  }

  resultContext.value.putImageData(inverseFourier, 0, 0)
  context.value.putImageData(fourierMagnitudeSpectrum, 0, 0)
}

function maskSpectrum(x, y) {
  const radius = brushSize.value
  for (let i = -radius; i < radius; i++) {
    for (let j = -radius; j < radius; j++) {
      if (Math.sqrt(i * i + j * j) > radius) {
        continue
      }

      mask.set(i + y, j + x, 1)
    }
  }
}

function clearMask() {
  mask = nj.zeros([imageWidth, imageHeight])
  calculateImage()
}
</script>

<style lang="scss" scoped>
.section {
  .canvas {
    overflow: hidden;
    display: flex;

    > canvas {
      width: 50%;
    }

    > canvas:first-child {
      border-right: 1px dashed rgba(0, 0, 0, 0.2);
      width: calc(50% - 1px);
      cursor: pointer;
    }
  }
}
</style>
