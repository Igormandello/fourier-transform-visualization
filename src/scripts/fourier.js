import nj from 'numjs'
import { fftshift, ifftshift } from 'fftshift'
import { ideal, butterworth, gaussian } from '@/scripts/filters'

const filterByType = { ideal, butterworth, gaussian }

function fft(imageData) {
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

  return nj.array(fftList)
}

function ifft(fft) {
  const fftList = fft.tolist()
  ifftshift(fftList)

  for (let i = 0; i < fft.shape[0]; i++) {
    ifftshift(fftList[i])
  }

  const unshiftedFFT = nj.array(fftList)
  return nj.ifft(unshiftedFFT).reshape(-1).tolist()
}

function magnitudes(fft, filterType, minRadius, maxRadius, inverse, mask) {
  const height = fft.shape[0]
  const width = fft.shape[1]

  let maxMag = 0
  const magnitudesList = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const distanceToCenter = Math.sqrt(Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2))

      const oldRealValue = fft.get(y, x, 0)
      const oldImaginaryValue = fft.get(y, x, 1)
      const { realValue, imaginaryValue } = filterByType[filterType](oldRealValue, oldImaginaryValue, distanceToCenter, minRadius, maxRadius, inverse)

      fft.set(y, x, 0, realValue)
      fft.set(y, x, 1, imaginaryValue)
      const module = Math.sqrt(realValue * realValue + imaginaryValue * imaginaryValue)

      const magnitudeValue = Math.log(module)
      if (magnitudeValue > maxMag) {
        maxMag = magnitudeValue
      }

      if (mask.get(y, x)) {
        magnitudesList.push(0)
        fft.set(y, x, 0, 0)
        fft.set(y, x, 1, 0)
        continue
      }

      magnitudesList.push(magnitudeValue)
    }
  }

  return { maxMag, magnitudesList }
}

export { fft, ifft, magnitudes }
