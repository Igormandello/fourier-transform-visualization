<template>
  <section class="section container is-max-widescreen">
    <div class="columns is-multiline is-centered is-variable is-6 mt-4">
      <Slider v-model="speed" class="is-one-third-desktop" label="Speed" min="1" max="20" step="1" @change="restartSeries" />
      <Slider v-model="xEpicyclesPosition" class="is-one-third-desktop" label="X Epicycles Position" min="100" :max="imageWidth" step="1" @change="restartSeries" />
      <Slider v-model="yEpicyclesPosition" class="is-one-third-desktop" label="Y Epicycles Position" min="100" :max="imageHeight" step="1" @change="restartSeries" />

      <div class="column field is-narrow is-flex is-align-items-center is-justify-content-center">
        <button @click="generateFourierSeries" class="button is-primary">Generate Series</button>
      </div>
    </div>
    <div class="columns box canvas px-0 py-0 mt-1">
      <DrawableCanvas
        v-model:context="context"
        class="column px-0 py-0"
        :width="imageWidth"
        :height="imageHeight"
        @drawPoint="drawPoint"
        @finishedDrawing="renderImage"
        :shouldInterpolateDrag="true"
      />
    </div>
  </section>
</template>

<script setup>
import Slider from '@/components/Slider.vue'
import DrawableCanvas from '@/components/DrawableCanvas.vue'

import { ref } from 'vue'
import nj from 'numjs'

const context = ref(null)
const scale = ref(50)
const speed = ref(2)

const xEpicyclesPosition = ref(150)
const yEpicyclesPosition = ref(150)

const imageWidth = 720
const imageHeight = 720

const points = []

const path = []

let time = 0
let fourierSeries = null
let interval = null

function restartSeries() {
  resetDrawing()
  generateFourierSeries()
}

function resetDrawing() {
  time = 0
  path.splice(0, path.length)
}

function generateFourierSeries() {
  const xs = nj.array(points.flatMap(it => [it.x, 0])).reshape(points.length, 2)
  const ys = nj.array(points.flatMap(it => [it.y, 0])).reshape(points.length, 2)

  const fftX = nj.fft(xs).tolist()
  const fftY = nj.fft(ys).tolist()

  const xFourierSeries = []
  const yFourierSeries = []

  let xAmplitudeSum = 0
  let yAmplitudeSum = 0

  for (let i = 0; i < points.length; i++) {
    const fourierCircleX = generateFourierCircle(i, fftX)
    xAmplitudeSum += fourierCircleX.amplitude
    xFourierSeries.push(fourierCircleX)

    const fourierCircleY = generateFourierCircle(i, fftY)
    yAmplitudeSum += fourierCircleY.amplitude
    yFourierSeries.push(fourierCircleY)
  }

  scale.value = Math.max(xAmplitudeSum / (imageWidth - xEpicyclesPosition.value), yAmplitudeSum / (imageHeight - yEpicyclesPosition.value))

  fourierSeries = {
    x: xFourierSeries.sort((a, b) => b.amplitude - a.amplitude),
    y: yFourierSeries.sort((a, b) => b.amplitude - a.amplitude)
  }

  if (interval) {
    clearInterval(interval)
  }

  interval = setInterval(() => {
    time += (speed.value * 2 * Math.PI) / points.length
    if (time > 2 * Math.PI) {
      resetDrawing()
    }

    renderImage()
  }, 20)
}

function generateFourierCircle(index, fftArray) {
  const frequency = index
  const realPart = fftArray[index][0]
  const imaginaryPart = fftArray[index][1]
  const amplitude = Math.sqrt(realPart * realPart + imaginaryPart * imaginaryPart)
  const phase = Math.atan2(imaginaryPart, realPart)

  return { realPart, imaginaryPart, frequency, amplitude, phase }
}

function drawPoint(x, y) {
  points.unshift({ x, y })
}

function renderImage() {
  if (fourierSeries === null) {
    renderDrawCanvas()
    return
  }

  renderSeries()
}

function renderSeries() {
  const ctx = context.value
  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, 0, imageWidth, imageHeight)

  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
  const xSeriesPosition = drawEpicycles({ series: fourierSeries.x, x: xEpicyclesPosition.value, y: 100, phaseOffset: 0 })
  const ySeriesPosition = drawEpicycles({ series: fourierSeries.y, x: 100, y: yEpicyclesPosition.value, phaseOffset: Math.PI / 2 })

  const x = xSeriesPosition.x
  const y = ySeriesPosition.y

  ctx.beginPath()
  ctx.moveTo(xSeriesPosition.x, xSeriesPosition.y)
  ctx.lineTo(x, y)
  ctx.moveTo(ySeriesPosition.x, ySeriesPosition.y)
  ctx.lineTo(x, y)
  ctx.stroke()

  path.push({ x, y })

  ctx.fillStyle = '#000'
  for (const point of path) {
    ctx.fillRect(point.x, point.y, 1, 1)
  }
}

function drawEpicycles({ series, x, y, phaseOffset }) {
  const ctx = context.value

  for (const circle of series) {
    const radius = circle.amplitude / scale.value
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.moveTo(x, y)

    x += Math.cos(circle.frequency * time + circle.phase + phaseOffset) * radius
    y += Math.sin(circle.frequency * time + circle.phase + phaseOffset) * radius

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  return { x, y }
}

function renderDrawCanvas() {
  const ctx = context.value
  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, 0, imageWidth, imageHeight)

  if (points.length === 0) {
    return
  }

  ctx.fillStyle = '#000'
  for (const point of points) {
    ctx.fillRect(point.x, point.y, 1, 1)
  }
}
</script>

<style></style>
