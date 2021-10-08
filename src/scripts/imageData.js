export default function fillGreyscale(imageData, baseIndex, value) {
  imageData.data[baseIndex] = value
  imageData.data[baseIndex + 1] = value
  imageData.data[baseIndex + 2] = value
  imageData.data[baseIndex + 3] = 255
}
