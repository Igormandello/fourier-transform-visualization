<template>
  <section class="section container is-max-widescreen">
    <div class="columns is-centered" v-if="!hasFile">
      <div class="column is-one-quarter">
        <ImageInput @imageLoaded="imageLoaded" :width="imageWidth" :height="imageHeight" />
      </div>
    </div>

    <div class="columns is-multiline is-centered is-variable is-6" v-else>
      <Slider v-model="minRadius" class="is-one-third-tablet" label="Minimum Radius" min="0" max="400" step="1" @change="calculateImage" />
      <Slider v-model="maxRadius" class="is-one-third-tablet" label="Maximum Radius" min="0" max="400" step="1" @change="calculateImage" />
      <Slider v-model="gamma" class="is-one-third-tablet" label="Gamma" min="0.1" max="3" step="0.1" @change="calculateImage" />
      <Slider v-model="brushSize" class="is-half-tablet" label="Brush size" min="5" max="50" step="1" />
      <Slider v-model="minimumValue" class="is-half-tablet" label="Minimum value" min="0" max="255" step="1" @change="calculateImage" />

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
      <canvas
        ref="canvas"
        class="column px-0 py-0"
        :width="imageWidth"
        :height="imageHeight"
        @click="maskClick"
        @mousedown="masking = true"
        @mouseup="cancelMasking"
        @mouseleave="cancelMasking"
        @mousemove="maskDrag"
      />
      <canvas ref="resultCanvas" class="column px-0 py-0" :width="imageWidth" :height="imageHeight" />
    </div>
  </section>
</template>

<script setup>
import Slider from '@/components/Slider.vue'
import ImageInput from '@/components/ImageInput.vue'

import { ref, onMounted } from 'vue'
import nj from 'numjs'
import { fft, ifft, magnitudes } from '@/scripts/fourier'
import bresenham from '@/scripts/bresenham'
import fillGreyscale from '@/scripts/imageData'

const hasFile = ref(false)

const minRadius = ref('0')
const maxRadius = ref('400')
const inverse = ref(false)
const gamma = ref('1.5')
const brushSize = ref('10')
const minimumValue = ref('0')
const masking = ref(false)

const canvas = ref(null)
const resultCanvas = ref(null)
const context = ref(null)
const resultContext = ref(null)

const imageWidth = 512
const imageHeight = 512

let originalFFT = null
let mask = nj.zeros([imageWidth, imageHeight])
let lastMaskPoint = null

function imageLoaded(imageData) {
  hasFile.value = true

  originalFFT = fft(imageData)
  calculateImage()
}

function calculateImage() {
  const fft = originalFFT.clone()
  const { maxMag, magnitudesList } = magnitudes(fft, minRadius.value, maxRadius.value, inverse.value, mask)

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

  resultContext.putImageData(inverseFourier, 0, 0)
  context.putImageData(fourierMagnitudeSpectrum, 0, 0)
}

function maskDrag(event) {
  if (!masking.value) {
    return
  }

  const { x, y } = calculateCoordinates(event)
  if (lastMaskPoint !== null) {
    bresenham(x, lastMaskPoint.x, y, lastMaskPoint.y, maskSpectrum)
  }

  lastMaskPoint = { x, y }
  maskSpectrum(x, y)
}

function maskClick(event) {
  const { x, y } = calculateCoordinates(event)
  maskSpectrum(x, y)
  calculateImage()
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

function cancelMasking() {
  if (!masking.value) {
    return
  }

  masking.value = false
  lastMaskPoint = null
  calculateImage()
}

function clearMask() {
  mask = nj.zeros([imageWidth, imageHeight])
  calculateImage()
}

function calculateCoordinates(event) {
  return {
    x: Math.floor((event.target.width * event.offsetX) / event.target.clientWidth),
    y: Math.floor((event.target.height * event.offsetY) / event.target.clientHeight)
  }
}

onMounted(() => {
  context.value = canvas.value.getContext('2d')
  resultContext.value = resultCanvas.value.getContext('2d')
})
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
    }
  }
}
</style>
