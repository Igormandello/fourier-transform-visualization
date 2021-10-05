<template>
  <h1>FFT</h1>
  <input type="file" accept="image/png, image/jpeg" :onchange="loadImage" />
  <div>
    <canvas ref="canvas" width="512" height="512" />
    <canvas ref="resultCanvas" width="512" height="512" />
  </div>
</template>

<script setup>
import nj from 'numjs'
import { fftshift } from 'fftshift'
import { drawImage } from 'canvas-object-fit'
import { ref, onMounted } from 'vue'

const image = ref(null)
const canvas = ref(null)
const resultCanvas = ref(null)
let context = ref(null)
let resultContext = ref(null)

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

      const imageData = ctx.getImageData(0, 0, auxCanvas.width, auxCanvas.height)

      const grayscale = []
      const fourier = []
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) {
          grayscale.push(1)
          fourier.push([1, 0])
          continue
        }

        const grayValue = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / (255 * 3)
        grayscale.push(grayValue)
        fourier.push([grayValue, 0])
      }

      const matrix = nj.array(grayscale).reshape(imageData.width, imageData.height)
      const array = matrix
        .reshape(-1)
        .pow(1 / 3)
        .tolist()

      const fourierArray = nj.array(fourier).reshape(imageData.width, imageData.height, 2)
      const fft = nj.fft(fourierArray).tolist()
      fftshift(fft)

      for (let i = 0; i < imageData.height; i++) {
        fftshift(fft[i])
      }

      const fftList = nj.array(fft).reshape(-1).tolist()

      let maxMag = 0
      const magnitudesArray = []
      for (let i = 0; i < matrix.size * 2; i += 2) {
        const pixel = i / 2
        const y = Math.floor(pixel / imageData.width)
        const x = pixel - y * imageData.width

        const magnitudeValue = Math.log(Math.sqrt(Math.pow(fftList[i], 2) + Math.pow(fftList[i + 1], 2)))
        if (magnitudeValue > maxMag) {
          maxMag = magnitudeValue
        }

        const distanceToCenter = Math.sqrt(Math.pow(x - imageData.width / 2, 2) + Math.pow(y - imageData.width / 2, 2))
        if (distanceToCenter > 40) {
            magnitudesArray.push(0)
            fft[y][x] = [0, 0]
            continue
        }

        magnitudesArray.push(magnitudeValue)
      }

      const ifft = nj.ifft(fft).reshape(-1).tolist()

      const inverseFourier = new ImageData(imageData.width, imageData.height)
      const fourierMagnitudeSpectrum = new ImageData(imageData.width, imageData.height)
      for (let i = 0; i < imageData.width * imageData.height; i++) {
        const index = i * 4

        const magnitudeValue = magnitudesArray[i] * 255 / maxMag
        fourierMagnitudeSpectrum.data[index] = magnitudeValue
        fourierMagnitudeSpectrum.data[index + 1] = magnitudeValue
        fourierMagnitudeSpectrum.data[index + 2] = magnitudeValue
        fourierMagnitudeSpectrum.data[index + 3] = 255

        const inverseFourierValue = Math.pow(ifft[i * 2], 1 / 1.2) * 255
        const imageValue = inverseFourierValue < 0 ? 0 : inverseFourierValue
        inverseFourier.data[index] = imageValue
        inverseFourier.data[index + 1] = imageValue
        inverseFourier.data[index + 2] = imageValue
        inverseFourier.data[index + 3] = 255
      }
      
      resultContext.putImageData(inverseFourier, 0, 0)
      context.putImageData(fourierMagnitudeSpectrum, 0, 0)
    }
  }

  reader.readAsDataURL(files[0])
}

onMounted(() => {
  context = canvas.value.getContext('2d')
  resultContext = resultCanvas.value.getContext('2d')
})
</script>

<style scoped>
img {
  margin-top: 16px;
  width: 100%;
}
</style>
