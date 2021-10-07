<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-one-quarter">
        <div class="file is-centered is-boxed has-name">
          <label class="file-label">
            <input class="file-input" type="file" accept="image/png, image/jpeg" :onchange="loadImage" />
            <span class="file-cta">
              <span class="file-icon">
                <FontAwesomeIcon icon="upload" />
              </span>
              <span class="file-label">Choose an image...</span>
            </span>
            <span class="file-name">{{ filename }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column field">
        <label class="label">Minimum Radius</label>
        <input v-model="minRadius" class="slider is-circle" type="range" min="0" max="400" @mouseup="calculateImage" />
      </div>

      <div class="column field">
        <label class="label">Maximum Radius</label>
        <input v-model="maxRadius" class="slider is-circle" type="range" min="0" max="400" @mouseup="calculateImage" />
      </div>

      <div class="column field">
        <label class="label">Invert Filter</label>
        <input v-model="inverse" class="is-rounded" type="checkbox" checked="checked" @change="calculateImage" />
      </div>

      <div class="column field">
        <label class="label">Gamma</label>
        <input
          v-model="gamma"
          class="slider is-circle"
          type="range"
          min="0"
          max="3"
          step="0.1"
          @mouseup="calculateImage"
        />
      </div>

      <div class="column field">
        <button @click="clearMask" class="button is-primary">Clear Mask</button>
      </div>
    </div>

    <div class="columns box canvas">
      <canvas
        ref="canvas"
        class="column px-0 py-0"
        width="512"
        height="512"
        @click="maskClick"
        @mousedown="masking = true"
        @mouseup="cancelMasking"
        @mousemove="maskDrag"
      />
      <canvas ref="resultCanvas" class="column px-0 py-0" width="512" height="512" />
    </div>
  </section>
</template>

<script setup>
import nj from 'numjs'
import { fftshift } from 'fftshift'
import { drawImage } from 'canvas-object-fit'
import { ref, onMounted } from 'vue'
import bresenham from '@/scripts/bresenham'

const filename = ref('No file selected')

const minRadius = ref(0)
const maxRadius = ref(400)
const inverse = ref(false)
const gamma = ref(1.5)
const masking = ref(false)

const canvas = ref(null)
const resultCanvas = ref(null)
let context = ref(null)
let resultContext = ref(null)

let imageData = null
let originalFFT = null
let mask = nj.zeros([512, 512])
let lastMaskPoint = null

const loadImage = function loadImage(input) {
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

  const file = files[0]
  filename.value = file.name
  reader.readAsDataURL(file)
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

  const ifft = nj.ifft(fft).reshape(-1).tolist()

  const inverseFourier = new ImageData(imageData.width, imageData.height)
  const fourierMagnitudeSpectrum = new ImageData(imageData.width, imageData.height)
  for (let i = 0; i < imageData.width * imageData.height; i++) {
    const index = i * 4

    const magnitudeValue = (magnitudesArray[i] * 255) / maxMag
    fourierMagnitudeSpectrum.data[index] = magnitudeValue
    fourierMagnitudeSpectrum.data[index + 1] = magnitudeValue
    fourierMagnitudeSpectrum.data[index + 2] = magnitudeValue
    fourierMagnitudeSpectrum.data[index + 3] = 255

    const inverseFourierValue = Math.pow(ifft[i * 2], 1 / gamma.value) * 255
    const imageValue = inverseFourierValue < 0 ? 0 : inverseFourierValue
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
  const radius = 10
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
img {
  margin-top: 16px;
  width: 100%;
}

.canvas {
  > canvas:first-child {
    border-right: 1px dashed rgba(0, 0, 0, 0.2);
  }
}
</style>
