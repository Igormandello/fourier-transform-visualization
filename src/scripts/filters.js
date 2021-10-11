function ideal(realValue, imaginaryValue, distanceToCenter, minRadius, maxRadius, inverse) {
  const isOutside = distanceToCenter < minRadius || distanceToCenter > maxRadius
  const isInside = distanceToCenter > minRadius && distanceToCenter < maxRadius
  if ((!inverse && isOutside) || (inverse && isInside)) {
    return {
      realValue: 0,
      imaginaryValue: 0
    }
  }

  return { realValue, imaginaryValue }
}

function generateButterworthFactors(distanceToCenter, minRadius, maxRadius) {
  const butterworthHigh = 1 / (1 + Math.pow(minRadius / distanceToCenter, 4))
  return {
    high: Number.isNaN(butterworthHigh) ? 1 : butterworthHigh,
    low: 1 / (1 + Math.pow(distanceToCenter / maxRadius, 2))
  }
}

function generateGaussianFactors(distanceToCenter, minRadius, maxRadius) {
  const gaussianHigh = 1 - Math.exp(-((distanceToCenter * distanceToCenter) / (2 * minRadius * minRadius)))
  return {
    high: Number.isNaN(gaussianHigh) ? 1 : gaussianHigh,
    low: Math.exp(-((distanceToCenter * distanceToCenter) / (2 * maxRadius * maxRadius)))
  }
}

function transformComplexNumber(generateFactors) {
  return (realValue, imaginaryValue, distanceToCenter, minRadius, maxRadius, inverse) => {
    const convertedDistance = inverse ? distanceToCenter - minRadius : distanceToCenter
    const { high, low } = generateFactors(convertedDistance, minRadius, maxRadius)

    return {
      realValue: realValue * low * high,
      imaginaryValue: imaginaryValue * low * high
    }
  }
}

const butterworth = transformComplexNumber(generateButterworthFactors)
const gaussian = transformComplexNumber(generateGaussianFactors)

export { ideal, butterworth, gaussian }
