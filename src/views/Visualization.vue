<template>
  <section class="section container is-max-widescreen">
    <div class="columns is-centered" v-if="file === null">
      <div class="column is-one-quarter">
        <FileInput @change="loadImage" />
      </div>
    </div>

    <div class="columns is-centered is-variable is-6" v-else>
      <Slider v-model="minRadius" label="Minimum Radius" min="0" max="400" step="1" @change="calculateImage" />
      <Slider v-model="maxRadius" label="Maximum Radius" min="0" max="400" step="1" @change="calculateImage" />
      <Slider v-model="gamma" label="Gamma" min="0.1" max="3" step="0.1" @change="calculateImage" />
      <Slider v-model="brushSize" label="Brush size" min="5" max="50" step="1" />
      <Slider v-model="minimumValue" label="Minimum value" min="0" max="255" step="1" @change="calculateImage" />

      <div class="column field is-narrow">
        <label class="label">Invert Filter</label>
        <input
          id="invert"
          v-model="inverse"
          type="checkbox"
          class="switch is-rounded is-small"
          @change="calculateImage"
        />
        <label for="invert"></label>
      </div>

      <div class="column field is-narrow is-flex is-align-items-center">
        <button @click="clearMask" class="button is-primary">Clear Mask</button>
      </div>
    </div>

    <div class="columns box canvas px-0 py-0">
      <canvas
        ref="canvas"
        class="column px-0 py-0"
        width="512"
        height="512"
        @click="maskClick"
        @mousedown="masking = true"
        @mouseup="cancelMasking"
        @mouseleave="cancelMasking"
        @mousemove="maskDrag"
      />
      <canvas ref="resultCanvas" class="column px-0 py-0" width="512" height="512" />
    </div>
  </section>
</template>

<script setup>
import Slider from '@/components/Slider.vue'
import FileInput from '@/components/FileInput.vue'

import { ref, onMounted } from 'vue'
import nj from 'numjs'
import { fftshift, ifftshift } from 'fftshift'
import { drawImage } from 'canvas-object-fit'
import bresenham from '@/scripts/bresenham'

const file = ref(null)

const minRadius = ref('0')
const maxRadius = ref('400')
const inverse = ref(false)
const gamma = ref('1.5')
const brushSize = ref('10')
const minimumValue = ref('0')
const masking = ref(false)

const canvas = ref(null)
const resultCanvas = ref(null)
let context = ref(null)
let resultContext = ref(null)

let imageData = null
let originalFFT = null
let mask = nj.zeros([512, 512])
let lastMaskPoint = null

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
      auxCanvas.width = canvas.value.width
      auxCanvas.height = canvas.value.height

      const ctx = auxCanvas.getContext('2d')
      drawImage(ctx, img, 0, 0, canvas.value.width, canvas.value.height, { objectFit: 'contain' })

      imageData = ctx.getImageData(0, 0, auxCanvas.width, auxCanvas.height)

      const fourier = []
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) {
          fourier.push([1, 0])
          continue
        }

        const grayValue = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / (255 * 3)
        fourier.push([grayValue, 0])
      }

      const fourierArray = nj.array(fourier).reshape(imageData.width, imageData.height, 2)
      const fftList = nj.fft(fourierArray).tolist()
      fftshift(fftList)

      for (let i = 0; i < imageData.height; i++) {
        fftshift(fftList[i])
      }

      originalFFT = nj.array(fftList)
      calculateImage()
    }
  }

  file.value = files[0]
  reader.readAsDataURL(file.value)
}

function calculateImage() {
  if (!imageData) {
    return
  }

  const fft = originalFFT.clone()

  let maxMag = 0
  const magnitudesArray = []
  for (let i = 0; i < originalFFT.size; i += 2) {
    const pixel = i / 2
    const y = Math.floor(pixel / imageData.width)
    const x = pixel - y * imageData.width

    const magnitudeValue = Math.log(Math.sqrt(Math.pow(fft.get(y, x, 0), 2) + Math.pow(fft.get(y, x, 1), 2)))
    if (magnitudeValue > maxMag) {
      maxMag = magnitudeValue
    }

    const distanceToCenter = Math.sqrt(Math.pow(x - imageData.width / 2, 2) + Math.pow(y - imageData.width / 2, 2))

    const isOutside = distanceToCenter < minRadius.value || distanceToCenter > maxRadius.value
    const isInside = distanceToCenter > minRadius.value && distanceToCenter < maxRadius.value
    if ((!inverse.value && isOutside) || (inverse.value && isInside) || mask.get(y, x)) {
      magnitudesArray.push(0)
      fft.set(y, x, 0, 0)
      fft.set(y, x, 1, 0)
      continue
    }

    magnitudesArray.push(magnitudeValue)
  }

  const fftList = fft.tolist()
  ifftshift(fftList)

  for (let i = 0; i < imageData.height; i++) {
    ifftshift(fftList[i])
  }

  const unshiftedFFT = nj.array(fftList)
  const ifft = nj.ifft(unshiftedFFT).reshape(-1).tolist()

  const inverseFourier = new ImageData(imageData.width, imageData.height)
  const fourierMagnitudeSpectrum = new ImageData(imageData.width, imageData.height)
  for (let i = 0; i < imageData.width * imageData.height; i++) {
    const index = i * 4

    const magnitudeValue = (magnitudesArray[i] * 255) / maxMag
    fourierMagnitudeSpectrum.data[index] = magnitudeValue
    fourierMagnitudeSpectrum.data[index + 1] = magnitudeValue
    fourierMagnitudeSpectrum.data[index + 2] = magnitudeValue
    fourierMagnitudeSpectrum.data[index + 3] = 255

    const inverseFourierValue = Math.floor(Math.pow(ifft[i * 2], 1 / gamma.value) * 255)
    const imageValue = inverseFourierValue < 0 ? 0 : inverseFourierValue <= minimumValue.value ? 0 : inverseFourierValue
    inverseFourier.data[index] = imageValue
    inverseFourier.data[index + 1] = imageValue
    inverseFourier.data[index + 2] = imageValue
    inverseFourier.data[index + 3] = 255
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
  mask = nj.zeros([512, 512])
  calculateImage()
}

function calculateCoordinates(event) {
  return {
    x: Math.floor((event.target.width * event.offsetX) / event.target.clientWidth),
    y: Math.floor((event.target.height * event.offsetY) / event.target.clientHeight)
  }
}

onMounted(() => {
  context = canvas.value.getContext('2d')
  resultContext = resultCanvas.value.getContext('2d')
})
</script>

<style lang="scss" scoped>
.section {
  .file .file-cta {
    background-color: white;

    &:hover {
      background-color: #fbfbfb;
    }
  }

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

  input[type='range'].slider {
    margin: 0;
  }

  .label {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;

    > .tag {
      margin-left: 6px;
      font-size: 0.6rem;
      line-height: 0.8rem;
      min-width: 2.2rem;
    }
  }
}
</style>
