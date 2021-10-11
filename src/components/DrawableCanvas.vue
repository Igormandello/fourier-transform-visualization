<template>
  <canvas
    ref="canvas"
    :width="width"
    :height="height"
    @click="drawClick"
    @mousemove="drawDrag"
    @mousedown="drawing = true"
    @mouseup="cancelDrawing"
    @mouseleave="cancelDrawing"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import bresenham from '@/scripts/bresenham'

defineProps({
  width: Number,
  height: Number
})

const emit = defineEmits(['drawPoint', 'finishedDrawing', 'update:context'])

const canvas = ref(null)
const drawing = ref(false)

let lastDrawnPoint = null
function drawDrag(event) {
  if (!drawing.value) {
    return
  }

  const { x, y } = calculateCoordinates(event)
  if (lastDrawnPoint) {
    bresenham(x, lastDrawnPoint.x, y, lastDrawnPoint.y, (lineX, lineY) => emit('drawPoint', lineX, lineY))
  }

  lastDrawnPoint = { x, y }
  emit('drawPoint', x, y)
}

function drawClick(event) {
  const { x, y } = calculateCoordinates(event)
  emit('drawPoint', x, y)
  emit('finishedDrawing')
}

function cancelDrawing() {
  if (!drawing.value) {
    return
  }

  drawing.value = false
  lastDrawnPoint = null
  emit('finishedDrawing')
}

function calculateCoordinates(event) {
  return {
    x: Math.floor((event.target.width * event.offsetX) / event.target.clientWidth),
    y: Math.floor((event.target.height * event.offsetY) / event.target.clientHeight)
  }
}

onMounted(() => {
  emit('update:context', canvas.value.getContext('2d'))
})
</script>

<style></style>
