<template>
  <section class="section container is-max-widescreen">
    <div class="columns is-multiline is-centered is-variable is-6 mt-4">
      <Slider v-model="scale" label="Scale reduction" min="1" max="100" step="1" @change="changeScale" />
      <!-- <Slider v-model="maxRadius" class="is-one-third-tablet" label="Position X" min="0" max="400" step="1" @change="calculateImage" /> -->
      <div class="column field is-narrow is-flex is-align-items-center is-justify-content-center">
        <button @click="generateFourierSeries" class="button is-primary">Generate Series</button>
      </div>
    </div>
    <div class="columns box canvas px-0 py-0">
      <DrawableCanvas
        v-model:context="context"
        class="column px-0 py-0"
        :width="imageWidth"
        :height="imageHeight"
        @drawPoint="drawPoint"
        @finishedDrawing="renderImage"
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

const imageWidth = 720
const imageHeight = 720

const lineWidth = 4
const points = []

const path = []

let time = 0
let fourierSeries = null
let interval = null

function changeScale() {
  restartDrawing()
  generateFourierSeries()
}

function restartDrawing() {
  time = 0
  path.splice(0, path.length)
}

function generateFourierSeries() {
  const xs = nj.array(points.flatMap(it => [it.x - imageWidth / 4, 0])).reshape(points.length, 2)
  const ys = nj.array(points.flatMap(it => [it.y - imageHeight / 4, 0])).reshape(points.length, 2)

  const fftX = nj.fft(xs).tolist()
  const fftY = nj.fft(ys).tolist()

  const xFourierSeries = []
  const yFourierSeries = []
  for (let i = 0; i < points.length; i++) {
    const fourierCircleX = generateFourierCircle(i, fftX)
    xFourierSeries.push(fourierCircleX)

    const fourierCircleY = generateFourierCircle(i, fftY)
    yFourierSeries.push(fourierCircleY)
  }

  fourierSeries = {
    x: xFourierSeries.sort((a, b) => b.amplitude - a.amplitude),
    y: yFourierSeries.sort((a, b) => b.amplitude - a.amplitude)
  }

  if (interval) {
    clearInterval(interval)
  }

  interval = setInterval(() => {
    time += (2 * Math.PI) / points.length
    if (time > 2 * Math.PI) {
      restartDrawing()
    }

    renderImage()
  }, 20)
}

function generateFourierCircle(index, fftArray) {
  const frequency = index
  const realPart = fftArray[index][0]
  const imaginaryPart = fftArray[index][1]
  const amplitude = Math.sqrt(realPart * realPart + imaginaryPart * imaginaryPart) / scale.value
  const phase = Math.atan2(imaginaryPart, realPart)

  return { realPart, imaginaryPart, frequency, amplitude, phase }
}

function drawPoint(x, y) {
  points.push({ x, y })
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
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
  const xEpicyclesPosition = drawEpicycles({ series: fourierSeries.x, x: 400, y: 100, phaseOffset: 0 })
  const yEpicyclesPosition = drawEpicycles({ series: fourierSeries.y, x: 100, y: 300, phaseOffset: Math.PI / 2 })

  const x = xEpicyclesPosition.x
  const y = yEpicyclesPosition.y

  ctx.beginPath()
  ctx.moveTo(xEpicyclesPosition.x, xEpicyclesPosition.y)
  ctx.lineTo(x, y)
  ctx.moveTo(yEpicyclesPosition.x, yEpicyclesPosition.y)
  ctx.lineTo(x, y)
  ctx.stroke()

  path.push({ x, y })
  const firstPoint = path[0]

  ctx.strokeStyle = '#000'
  ctx.beginPath()
  ctx.moveTo(firstPoint.x, firstPoint.y)
  for (const point of path.slice(1)) {
    ctx.lineTo(point.x, point.y)
  }

  ctx.stroke()
}

function drawEpicycles({ series, x, y, phaseOffset }) {
  const ctx = context.value

  for (const circle of series) {
    const radius = circle.amplitude
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
  const firstPoint = points[0]

  ctx.beginPath()
  if (points.length === 1) {
    ctx.arc(firstPoint.x, firstPoint.y, lineWidth / 2, 0, Math.PI * 2)
    ctx.fill()
    return
  }

  ctx.moveTo(firstPoint.x, firstPoint.y)
  for (const point of points.slice(1)) {
    ctx.lineTo(point.x, point.y)
  }

  ctx.lineWidth = lineWidth
  ctx.stroke()
}
</script>

<style></style>
